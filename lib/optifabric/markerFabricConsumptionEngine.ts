/**
 * OptiFabric AI
 * Stage 2D-1 — Core Marker-Based Fabric Consumption Engine
 *
 * Pure extraction/formalisation of the real "Fabric Planning" mathematics
 * already live in app/optifabric/project/[projectId]/marker/page.tsx (the
 * "Usable Roll Requirement" section) — no new arithmetic is invented here,
 * only the existing, proven formulas given explicit types, validation, and
 * a home outside the page component. This module has NO React, localStorage,
 * fetch, or backend dependency — it is a plain function of its inputs.
 *
 * setsPerMarker is confirmed (by tracing marker/page.tsx) to represent the
 * number of complete GARMENT SETS one marker is built for — a direct,
 * user-entered value (clamped 1..24), NOT a pattern-piece count. It is the
 * multiplier applied to a garment's own piece list (sum of each pattern's
 * cutQuantity) to get the total piece instances nested. A MarkerRun's own
 * placedPieceCount/expectedPieceCount are PIECE counts, not garment counts,
 * and this engine never treats them as garments-per-marker — they are only
 * ever compared to each other (both piece counts) to decide completeness.
 * The caller is responsible for supplying setsPerMarker (Stage 2D-1 does not
 * select or interpret a MarkerRun itself).
 *
 * Width authority: usableFabricWidthCm (FabricProfile's persisted usable
 * width) is the calculation authority. If the selected MarkerRun reports a
 * different fabricWidthCm it generated at, this engine does NOT recompute
 * or silently pick one — it flags a warning for the caller/UI to surface.
 */

export type MarkerFabricConsumptionIssueSeverity = "error" | "warning";

export interface MarkerFabricConsumptionIssue {
  /** Stable machine-readable identifier — see the individual check comments below for the full set. */
  code: string;
  severity: MarkerFabricConsumptionIssueSeverity;
  message: string;
}

export interface MarkerFabricConsumptionCostInput {
  /** Cost per linear metre of fabric, in whatever currency the caller tracks. */
  costPerMetre: number;
}

export interface MarkerFabricConsumptionInput {
  /** The selected MarkerRun's marker length, in centimetres. */
  markerLengthCm: number;

  /**
   * The fabric width the selected marker was actually generated/nested at
   * (e.g. MarkerOptimisationCandidateMetrics.fabricWidthCm), if known. Used
   * only to detect a mismatch against usableFabricWidthCm below — never
   * used as the calculation width itself.
   */
  markerFabricWidthCm?: number;

  /** Piece instances the marker was expected to contain vs. actually placed — both PIECE counts, never garment counts. */
  expectedPieceCount?: number;
  placedPieceCount?: number;

  /** FabricProfile.usableFabricWidthCm — the authoritative cutting width. */
  usableFabricWidthCm: number;

  /** FabricProfile.maximumMarkerLengthCm — 0/undefined/null means no configured limit. */
  maximumMarkerLengthCm?: number | null;

  /** Number of complete garment sets this marker is built for (see module comment) — not a piece count. */
  setsPerMarker: number;

  /** Total garments/sets required for the order. */
  orderQuantity: number;

  grossRollLengthMetres: number;
  startAllowanceMetres?: number;
  endAllowanceMetres?: number;
  defectAllowanceMetres?: number;

  /** Optional — when absent, cost figures are simply not computed (null), not zero. */
  fabricCost?: MarkerFabricConsumptionCostInput;
}

export interface MarkerFabricConsumptionResult {
  /** False when at least one "error"-severity issue is present — see issues. */
  valid: boolean;
  issues: MarkerFabricConsumptionIssue[];

  /**
   * Roll-length figures depend only on the roll/allowance inputs, never on
   * marker validity — computed unconditionally, mirroring the existing page
   * (its own usableRollLengthMetres is never gated behind the marker's own
   * validity there either).
   */
  usableRollLengthMetres: number;

  /**
   * Marker-dependent figures below are null whenever `valid` is false —
   * there is no proven number to report for an invalid marker
   * configuration. When `valid` is true but the roll happens to be too
   * short for even one marker, these are legitimately 0 (see the
   * "roll-shorter-than-marker" warning), not null.
   */
  fabricConsumptionPerGarmentCm: number | null;
  markersPerRoll: number | null;
  garmentsPerRoll: number | null;
  rollRemainderCm: number | null;
  rollsRequiredForOrder: number | null;
  totalFabricRequiredCm: number | null;
  totalFabricRequiredMetres: number | null;

  /** Null whenever fabricCost was not supplied, or the marker is invalid — never a misleading 0. */
  costPerGarment: number | null;
}

// A material fabric-width mismatch, in centimetres — large enough to filter
// out floating-point/rounding noise, small enough to catch a genuinely
// different fabric width the marker was generated at. No authoritative
// tolerance exists in this repo for this comparison; this is a reasonable
// engineering default, not a domain-confirmed figure.
const MATERIAL_WIDTH_MISMATCH_CM = 0.5;

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function calculateMarkerFabricConsumption(
  input: MarkerFabricConsumptionInput,
): MarkerFabricConsumptionResult {
  const issues: MarkerFabricConsumptionIssue[] = [];

  // -- Roll/allowance figures — always computed, independent of marker validity -----------------

  const grossRollLengthMetres = Number.isFinite(input.grossRollLengthMetres)
    ? input.grossRollLengthMetres
    : 0;

  const rawStartAllowanceMetres = input.startAllowanceMetres ?? 0;
  const rawEndAllowanceMetres = input.endAllowanceMetres ?? 0;
  const rawDefectAllowanceMetres = input.defectAllowanceMetres ?? 0;

  const negativeAllowanceFields: string[] = [];
  if (Number.isFinite(rawStartAllowanceMetres) && rawStartAllowanceMetres < 0) {
    negativeAllowanceFields.push("startAllowanceMetres");
  }
  if (Number.isFinite(rawEndAllowanceMetres) && rawEndAllowanceMetres < 0) {
    negativeAllowanceFields.push("endAllowanceMetres");
  }
  if (Number.isFinite(rawDefectAllowanceMetres) && rawDefectAllowanceMetres < 0) {
    negativeAllowanceFields.push("defectAllowanceMetres");
  }
  if (negativeAllowanceFields.length > 0) {
    issues.push({
      code: "negative-allowance-clamped",
      severity: "warning",
      message: `${negativeAllowanceFields.join(", ")} was negative and has been treated as 0.`,
    });
  }

  // Same treatment as the existing page's own parseNonNegative(): negative
  // or non-finite inputs are treated as 0, never propagated.
  const startAllowanceMetres =
    Number.isFinite(rawStartAllowanceMetres) && rawStartAllowanceMetres > 0 ? rawStartAllowanceMetres : 0;
  const endAllowanceMetres =
    Number.isFinite(rawEndAllowanceMetres) && rawEndAllowanceMetres > 0 ? rawEndAllowanceMetres : 0;
  const defectAllowanceMetres =
    Number.isFinite(rawDefectAllowanceMetres) && rawDefectAllowanceMetres > 0 ? rawDefectAllowanceMetres : 0;

  const totalAllowanceMetres = startAllowanceMetres + endAllowanceMetres + defectAllowanceMetres;

  if (totalAllowanceMetres > grossRollLengthMetres) {
    issues.push({
      code: "allowances-exceed-gross-roll",
      severity: "warning",
      message: "Start, end and defect allowances together exceed the gross roll length; usable roll length is 0.",
    });
  }

  // Extracted verbatim from marker/page.tsx's usableRollLengthMetres.
  const usableRollLengthMetres = Math.max(0, grossRollLengthMetres - totalAllowanceMetres);
  const rollLengthCm = usableRollLengthMetres * 100;

  // -- Marker-configuration validity --------------------------------------------------------------

  if (!isPositiveFinite(input.markerLengthCm)) {
    issues.push({
      code: "marker-length-invalid",
      severity: "error",
      message: "markerLengthCm must be a finite number greater than 0.",
    });
  }

  if (!isPositiveFinite(input.usableFabricWidthCm)) {
    issues.push({
      code: "usable-width-invalid",
      severity: "error",
      message: "usableFabricWidthCm must be a finite number greater than 0.",
    });
  }

  const setsPerMarker = Math.floor(input.setsPerMarker);
  if (!isPositiveFinite(setsPerMarker)) {
    issues.push({
      code: "sets-per-marker-invalid",
      severity: "error",
      message: "setsPerMarker must be a finite whole number greater than 0.",
    });
  }

  if (
    input.expectedPieceCount !== undefined &&
    input.placedPieceCount !== undefined &&
    Number.isFinite(input.expectedPieceCount) &&
    Number.isFinite(input.placedPieceCount) &&
    input.placedPieceCount < input.expectedPieceCount
  ) {
    issues.push({
      code: "marker-incomplete",
      severity: "error",
      message:
        `This marker is incomplete (${input.placedPieceCount} of ${input.expectedPieceCount} pattern-piece instances placed) — ` +
        "not a valid basis for a production booking quantity.",
    });
  }

  const maximumMarkerLengthCm =
    input.maximumMarkerLengthCm !== undefined &&
    input.maximumMarkerLengthCm !== null &&
    Number.isFinite(input.maximumMarkerLengthCm) &&
    input.maximumMarkerLengthCm > 0
      ? input.maximumMarkerLengthCm
      : null;

  if (
    maximumMarkerLengthCm !== null &&
    isPositiveFinite(input.markerLengthCm) &&
    input.markerLengthCm > maximumMarkerLengthCm
  ) {
    issues.push({
      code: "marker-length-exceeds-maximum",
      severity: "error",
      message: `Marker length (${input.markerLengthCm} cm) exceeds the configured maximum (${maximumMarkerLengthCm} cm).`,
    });
  }

  // Warning only — usableFabricWidthCm remains the calculation width
  // regardless; this never changes what the engine computes with.
  if (
    input.markerFabricWidthCm !== undefined &&
    Number.isFinite(input.markerFabricWidthCm) &&
    Math.abs(input.markerFabricWidthCm - input.usableFabricWidthCm) > MATERIAL_WIDTH_MISMATCH_CM
  ) {
    issues.push({
      code: "fabric-width-mismatch",
      severity: "warning",
      message:
        `The selected marker was generated at ${input.markerFabricWidthCm} cm fabric width, ` +
        `which differs from the current usable fabric width (${input.usableFabricWidthCm} cm).`,
    });
  }

  // -- orderQuantity ---------------------------------------------------------------------------

  let orderQuantity = Number.isFinite(input.orderQuantity) ? input.orderQuantity : 0;
  if (orderQuantity < 0) {
    issues.push({
      code: "order-quantity-negative-clamped",
      severity: "warning",
      message: "orderQuantity was negative and has been treated as 0.",
    });
    orderQuantity = 0;
  }

  const valid = !issues.some((issue) => issue.severity === "error");

  if (!valid) {
    return {
      valid,
      issues,
      usableRollLengthMetres,
      fabricConsumptionPerGarmentCm: null,
      markersPerRoll: null,
      garmentsPerRoll: null,
      rollRemainderCm: null,
      rollsRequiredForOrder: null,
      totalFabricRequiredCm: null,
      totalFabricRequiredMetres: null,
      costPerGarment: null,
    };
  }

  // -- Marker-dependent figures — extracted verbatim from marker/page.tsx --------------------------

  const fabricConsumptionPerGarmentCm = input.markerLengthCm / setsPerMarker;

  const markersPerRoll = rollLengthCm > 0 ? Math.floor(rollLengthCm / input.markerLengthCm) : 0;

  if (markersPerRoll === 0) {
    issues.push({
      code: "roll-shorter-than-marker",
      severity: "warning",
      message: "The usable roll length is shorter than one marker — zero markers fit per roll.",
    });
  }

  const garmentsPerRoll = markersPerRoll * setsPerMarker;

  const rollRemainderCm = rollLengthCm > 0 ? rollLengthCm - markersPerRoll * input.markerLengthCm : 0;

  const totalFabricRequiredCm = fabricConsumptionPerGarmentCm * orderQuantity;
  const totalFabricRequiredMetres = totalFabricRequiredCm / 100;

  const rollsRequiredForOrder =
    orderQuantity > 0 && garmentsPerRoll > 0 ? Math.ceil(orderQuantity / garmentsPerRoll) : 0;

  const costPerGarment = input.fabricCost
    ? (fabricConsumptionPerGarmentCm / 100) * input.fabricCost.costPerMetre
    : null;

  return {
    valid,
    issues,
    usableRollLengthMetres,
    fabricConsumptionPerGarmentCm,
    markersPerRoll,
    garmentsPerRoll,
    rollRemainderCm,
    rollsRequiredForOrder,
    totalFabricRequiredCm,
    totalFabricRequiredMetres,
    costPerGarment,
  };
}
