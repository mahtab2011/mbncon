"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParams } from "next/navigation";

import { polygonToSvgPoints } from "@/lib/optifabric/marker/polygonSvg";

import {
  countPolygonCollisions,
  findPolygonCollisionPairs,
  type PositionedPolygon,
} from "@/lib/optifabric/marker/markerPolygonCollisionEngine";

import { createDeterministicNestedMarker } from "@/lib/optifabric/marker/markerNestingEngine";

import { createMarkerQuantityCandidate } from "@/lib/optifabric/marker/markerQuantityCandidateEngine";

import { analyseMarkerSolutions } from "@/lib/optifabric/marker/markerQuantityOptimisationEngine";

import {
  createEngineeringConsultantReport,
} from "@/lib/optifabric/marker/markerEngineeringConsultantEngine";

import type {
  MarkerDecisionCandidate,
  MarkerPriority,
} from "@/lib/optifabric/marker/markerDecisionEngine";

import {
  createMarkerQuantityPlan,
  calculateMaximumSafeGarments,
} from "@/lib/optifabric/marker/markerQuantityRangeEngine";

import {
  extractCompletedMarkerCandidates,
  solveMarkerQuantitiesSequentially,
  type MarkerBatchSourcePattern,
  type MarkerQuantityBatchProgress,
  type MarkerQuantityBatchResult,
} from "@/lib/optifabric/marker/markerQuantityBatchSolver";

import {
  createMarkerAlternatives,
  createMarkerComparison,
  type MarkerComparisonSummary,
} from "@/lib/optifabric/marker/markerComparisonEngine";

import {
  runHoleFillingCompaction,
  type HoleFillingCandidatePiece,
  type HoleFillingCompactionInput,
  type HoleFillingCompactionResult,
  type HoleFillingSourcePlacement,
} from "@/lib/optifabric/markerOptimization/holeFillingCompactionOrchestrator";

import {
  rankProductionSafetyGateSolutions,
  type ProductionSafetyGateInput,
  type ProductionSafetyGateRanking,
  type ProductionSafetyGateResult,
} from "@/lib/optifabric/markerOptimization/productionSafetyGateEngine";

import {
  createProductionReleaseDecision,
  type ProductionReleaseDecisionResult,
} from "@/lib/optifabric/markerOptimization/productionReleaseDecisionEngine";

import {
  runSafeEfficiencyRecovery,
  type SafeEfficiencyRecoveryResult,
  type SafeRecoveryMarkerInput,
} from "@/lib/optifabric/markerOptimization/safeEfficiencyRecoveryEngine";

import {
  runSafeDenseRepacking,
  type SafeDenseRepackingInput,
  type SafeDenseRepackingResult,
} from "@/lib/optifabric/markerOptimization/safeDenseRepackingEngine";

import {
  validateSafeDenseProductionSolutions,
  type SafeDenseValidationRanking,
  buildSafeDenseValidationDiagnostics,
type SafeDenseValidationDiagnosticSummary,
} from "@/lib/optifabric/markerOptimization/safeDenseProductionValidationEngine";

import { computeCanonicalMarkerQualityScore } from "@/lib/optifabric/marker/markerScoringEngine";

import {
  resolveMarkerRotationPolicy,
  isRotationPermitted,
  type MarkerRotationAngle,
  type MarkerRotationPolicyResult,
} from "@/lib/optifabric/marker/markerRotationPolicyEngine";

import {
  runMarkerOptimisation,
  type MarkerOptimisationInput,
  type MarkerOptimisationResult,
  type MarkerOptimisationSourcePiece,
} from "@/lib/optifabric/markerOptimization/markerOptimisationOrchestrator";

import {
  createMarkerRun,
  getFabricProfile,
  listMarkerRuns,
  saveFabricProfile as putFabricProfile,
  type SaveFabricProfileInput,
  type ServerFabricProfile,
  type ServerMarkerRun,
  type ServerProjectMeta,
} from "@/lib/optifabric/projectApi";

import {
  calculateMarkerFabricConsumption,
  type MarkerFabricConsumptionInput,
} from "@/lib/optifabric/markerFabricConsumptionEngine";

import {
  buildEngineeringRecommendations,
  type EngineeringRecommendationSeverity,
} from "@/lib/optifabric/engineeringRecommendationsEngine";

import type { ProductionSafetyGateIssue } from "@/lib/optifabric/markerOptimization/productionSafetyGateEngine";

import {
  FABRIC_TYPES,
  GRAIN_CONTROL_OPTIONS,
  FACE_DIRECTION_OPTIONS,
  NAP_OPTIONS,
  ALLOWABLE_ROTATION_OPTIONS,
  STRETCH_OPTIONS,
  MATCHING_REQUIREMENT_OPTIONS,
  DIRECTIONAL_FABRIC_OPTIONS,
  type FabricProfile,
  type FabricType,
} from "@/lib/optifabric/marker/fabricProfileTypes";

import { createDefaultFabricProfile } from "@/lib/optifabric/marker/fabricProfileDefaults";

import {
  composeFabricAndPieceRotationConstraints,
  type PieceRotationConstraints,
} from "@/lib/optifabric/marker/fabricPieceConstraintComposer";

import {
  createEngineeringLanguageService,
  isEngineeringLanguage,
  type EngineeringLanguage,
} from "@/lib/optifabric/language/engineeringLanguageService";

import { MARKER_PRODUCTION_MESSAGES } from "@/lib/optifabric/language/markerProductionMessages";

import {
  translateFabricOptionLabel,
  type FabricOptionField,
} from "@/lib/optifabric/language/fabricOptionTranslations";

/* ============================================================================
 * Types
 * ========================================================================== */

interface MarkerGeometryPoint {
  x: number;
  y: number;
}

interface MarkerGeometryPattern {
  patternId: string;

  recognisedName: string;

  polygon: {
    vertices: MarkerGeometryPoint[];

    area: {
      squareCm?: number;
    };

    boundingBox: {
      width: number;
      height: number;
    };
  };

  dimensions: {
    widthCm?: number;
    heightCm?: number;
  };

  engineeringScore: number;

  /**
   * Pieces of this pattern required per garment — two sleeves, two cuffs and
   * so on. Saved by the geometry stage (patternGeometryEngine.ts) from the
   * quantity the engineer set at upload; falls back to 1 only for older
   * saved projects that predate this field.
   */
  cutQuantity?: number;

  packingPriority?: number;

  markerWeight?: number;

  /**
   * Production-rule signals saved by the geometry stage
   * (see PatternGeometryResult.constraints in patternGeometryTypes.ts).
   *
   * Optional and read-only here: older saved projects created before this
   * field existed simply omit it, and every consumer below treats a
   * missing/undefined constraints object as "no metadata available" rather
   * than failing — see markerRotationPolicyEngine.ts's usedFallbackPolicy.
   */
  constraints?: {
    grainControlled?: boolean;

    rotation?: "fixed" | "rotate-180" | "rotate-90" | "free";

    directionalFabric?: boolean;

    napDirection?: boolean;

    stripeMatch?: boolean;

    checkMatch?: boolean;
  };
}

interface MarkerFabricCost {
  currency: "GBP" | "USD" | "EUR" | "BDT";

  costPerMetre: number;

  supplier?: string;

  fabricLot?: string;
}

interface MarkerProject {
  id: string;

  projectName?: string;
  name?: string;

  orderQuantity?: number;

  fabricCost?: MarkerFabricCost;

  /** Step 4A — fabric-level production constraints. See fabricProfileTypes.ts. */
  fabricProfile?: FabricProfile;

  aiGeometry?: {
    completed: boolean;

    markerReadyPatterns: number;

    patterns: MarkerGeometryPattern[];
  };

  updatedAt?: string;

  // Stage 2C-1: presence is how this page tells a server-backed project
  // (created via the server-first flow — see lib/optifabric/projectApi.ts)
  // from a legacy local-only one, same signal the trace/project-overview
  // pages already key off. Marker-run persistence is gated on this; a
  // legacy project never attempts a server request here.
  _server?: ServerProjectMeta;

  [key: string]: unknown;
}

interface PlacedMarkerPattern {
  instanceId: string;

  pattern: MarkerGeometryPattern;

  placement: {
    x: number;
    y: number;

    width: number;
    height: number;

    rotation: 0 | 90 | 180 | 270;
  };
}

interface SelectedCanvasPlacement {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName: string;
  readonly pattern: MarkerGeometryPattern | null;

  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;

  readonly rotation: number;
  readonly source: "existing" | "holeFilling";
  readonly engineeringScore: number;
}
interface UnplacedGroup {
  pattern: MarkerGeometryPattern;
  count: number;
}

type FabricWidthUnit = "cm" | "in";

type MarkerSearchMode = "fast" | "standard" | "maximum";

type MarkerCanvasSolutionKind =
  | "original"
  | "holeFilled"
  | "compacted"
  | "combined";

interface MarkerCanvasSolutionOption {
  readonly id: string;
  readonly kind: MarkerCanvasSolutionKind;
  readonly label: string;
  readonly description: string;
  readonly markerLengthCm: number;
  readonly utilisationPercent: number;
  readonly wastePercent: number;
  readonly engineeringScore: number;
  readonly confidencePercent: number;
  readonly collisionFree: boolean;
  readonly engineeringReady: boolean;
  readonly recommended: boolean;
}

/**
 * Step 4 — the single production-facing marker result this page displays.
 * Either the untouched deterministic baseline, or the Step 3 optimiser's
 * result when (and only when) it is production-safe and equal-or-better on
 * both utilisation and marker length. Never surfaced as an error state to
 * the user — an ineligible or failed optimisation attempt silently falls
 * back to the baseline variant of this same shape.
 *
 * Step 4C: `decision`/`decisionLabel`/`safetyGate` are read directly from a
 * REAL evaluateProductionSafetyGate()/rankProductionSafetyGateSolutions()
 * result — the same canonical gate the optimiser itself is ranked by (see
 * productionSafetyGateEngine.ts). This page never computes its own
 * pass/fail judgement; `decision` is exactly what that gate returned.
 * `productionSafe`/`productionStatusLabel` are kept for the existing
 * summary badge and are simply `decision === "productionReleased"` restated.
 */
interface ProductionMarkerResult {
  readonly source: "baseline" | "optimised";
  readonly utilisationPercent: number;
  readonly wastePercent: number;
  readonly markerLengthCm: number;
  readonly placedCount: number;
  readonly expectedCount: number;
  readonly complete: boolean;
  readonly productionSafe: boolean;
  readonly productionStatusLabel: string;
  /**
   * "notIndependentlyGated" only occurs when the marker is too large for the
   * Step 3 optimiser's automatic-gating ceiling (see
   * MAXIMUM_PRODUCTION_OPTIMISATION_INSTANCES) — an honest "not yet
   * evaluated" state, never fabricated as released or rejected.
   */
  readonly decision:
    | "productionReleased"
    | "engineeringReviewRequired"
    | "rejected"
    | "notIndependentlyGated";
  readonly decisionLabel: string;
  readonly safetyGate: ProductionSafetyGateResult | null;
  // Stage 2C-1: the orchestrator's own MarkerOptimisationResult this summary
  // was derived from — null only when runMarkerOptimisation never ran (no
  // productionOptimisationInput yet, or it threw). Save Marker Run persists
  // this directly; nothing here is reconstructed from the summary fields.
  readonly rawResult: MarkerOptimisationResult | null;
}

/* ============================================================================
 * Canvas constants
 * ========================================================================== */

const CANVAS_PADDING = 24;
const CANVAS_HEADER_HEIGHT = 56;

/**
 * Engineering display scale: screen pixels per centimetre.
 *
 * Declared before the gap constants, which are derived from it.
 */
const CANVAS_PIXELS_PER_CM = 4;

/**
 * Cutting gap between pieces, in centimetres — the blade allowance a cutting
 * room needs between adjacent pieces.
 */
const CUTTING_GAP_CM = 0.5;

const HORIZONTAL_GAP = CUTTING_GAP_CM * CANVAS_PIXELS_PER_CM;
const VERTICAL_GAP = CUTTING_GAP_CM * CANVAS_PIXELS_PER_CM;

const MINIMUM_PIECE_WIDTH = 24;
const MINIMUM_PIECE_HEIGHT = 18;

const MINIMUM_CANVAS_HEIGHT = 520;
const CANVAS_BOTTOM_PADDING = 32;

const MAXIMUM_SETS_PER_MARKER = 24;

/**
 * Hard ceiling on pieces in one nest.
 *
 * Nesting cost grows faster than the piece count, and this page runs on the
 * browser's main thread. Beyond this many pieces the tab stops responding, so
 * the nest is refused with an explanation rather than freezing the window.
 */
const MAXIMUM_NESTING_INSTANCES = 400;

/** Per-piece position budget. Raised for multi-garment markers. */
const CANDIDATE_TESTS_PER_PIECE = 4000;

/**
 * Step 4 — production optimisation ceiling.
 *
 * The Step 3 multi-strategy optimiser (BALANCED profile) is substantially
 * more expensive per piece than the deterministic baseline nesting pass, and
 * runs synchronously on this same main thread. Benchmarked runtime at
 * BALANCED stays in the low seconds up to ~50 pieces; there is no benchmark
 * evidence yet for markers approaching the 400-piece nesting ceiling above,
 * so automatic optimisation is only attempted below this separate, more
 * conservative limit. Above it, the deterministic baseline is used directly
 * with no optimisation attempt — the same "silently retain baseline"
 * behaviour as an optimisation error or timeout, not a special case.
 */
const MAXIMUM_PRODUCTION_OPTIMISATION_INSTANCES = 150;

/** Spatial index band height, in canvas pixels. */
const SPATIAL_BAND_HEIGHT = 200;

/**
 * Step 18 — the production interface's language preference. Deliberately a
 * standalone localStorage key, not a field inside the per-project JSON blob:
 * language is a presentation-only, per-device preference, never project
 * data, and must never travel with an exported/shared project.
 */
const OPTIFABRIC_LANGUAGE_STORAGE_KEY = "optifabric-production-language";

const STANDARD_WIDTHS_CM = [
  { value: "112", label: "112 cm / 44.1 in" },
  { value: "114.3", label: "114.3 cm / 45 in" },
  { value: "121.92", label: "121.92 cm / 48 in" },
  { value: "127", label: "127 cm / 50 in" },
  { value: "137.16", label: "137.16 cm / 54 in" },
  { value: "142.24", label: "142.24 cm / 56 in" },
  { value: "147.32", label: "147.32 cm / 58 in" },
  { value: "152.4", label: "152.4 cm / 60 in" },
] as const;

const STANDARD_WIDTHS_IN = [
  { value: "44", label: "44 in / 111.76 cm" },
  { value: "45", label: "45 in / 114.3 cm" },
  { value: "48", label: "48 in / 121.92 cm" },
  { value: "50", label: "50 in / 127 cm" },
  { value: "54", label: "54 in / 137.16 cm" },
  { value: "56", label: "56 in / 142.24 cm" },
  { value: "58", label: "58 in / 147.32 cm" },
  { value: "60", label: "60 in / 152.4 cm" },
] as const;

/* ============================================================================
 * Helpers
 * ========================================================================== */

function formatCurrency(
  currency: "GBP" | "USD" | "EUR" | "BDT"
): string {
  const symbols = {
    GBP: "£",
    USD: "$",
    EUR: "€",
    BDT: "৳",
  };

  return symbols[currency];
}

function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function toFiniteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function parseNonNegative(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/* ============================================================================
 * Stage 2C-1 — defensive readers for a saved MarkerRun's opaque
 * snapshotJson/resultJson. Mirrors the same "never throw, undefined for
 * anything absent/malformed" convention lib/optifabric/projectApi.ts already
 * uses for PatternGeometry's own opaque Json fields — these only ever
 * display a summary, they never feed back into live marker state.
 * ========================================================================== */

function readOpaqueNumber(source: unknown, key: string): number | undefined {
  if (!source || typeof source !== "object") return undefined;

  const value = (source as Record<string, unknown>)[key];

  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readOpaqueArrayLength(source: unknown, key: string): number | undefined {
  if (!source || typeof source !== "object") return undefined;

  const value = (source as Record<string, unknown>)[key];

  return Array.isArray(value) ? value.length : undefined;
}

function summariseMarkerRunSnapshot(snapshotJson: unknown): {
  fabricWidth?: number;
  pieceCount?: number;
} {
  return {
    fabricWidth: readOpaqueNumber(snapshotJson, "fabricWidth"),
    pieceCount: readOpaqueArrayLength(snapshotJson, "pieces"),
  };
}

function summariseMarkerRunResult(resultJson: unknown): {
  utilisationPercent?: number;
  wastePercent?: number;
  markerLengthCm?: number;
  // Stage 2D-2: additional bestCandidate fields the fabric-consumption
  // engine needs — read with the exact same defensive convention as the
  // three fields above (undefined for anything absent/malformed, never a
  // throw).
  fabricWidthCm?: number;
  placedPieceCount?: number;
  expectedPieceCount?: number;
} {
  if (!resultJson || typeof resultJson !== "object") return {};

  const bestCandidate = (resultJson as Record<string, unknown>).bestCandidate;

  return {
    utilisationPercent: readOpaqueNumber(bestCandidate, "utilisationPercent"),
    wastePercent: readOpaqueNumber(bestCandidate, "wastePercent"),
    markerLengthCm: readOpaqueNumber(bestCandidate, "markerLengthCm"),
    fabricWidthCm: readOpaqueNumber(bestCandidate, "fabricWidthCm"),
    placedPieceCount: readOpaqueNumber(bestCandidate, "placedPieceCount"),
    expectedPieceCount: readOpaqueNumber(bestCandidate, "expectedPieceCount"),
  };
}

function formatMarkerRunTimestamp(createdAt: string): string {
  const parsed = new Date(createdAt);

  if (Number.isNaN(parsed.getTime())) {
    return createdAt;
  }

  return parsed.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const SAFETY_GATE_SEVERITIES = new Set([
  "critical",
  "review",
  "advisory",
  "passed",
]);

// Stage 2E-2: defensive reader for a saved MarkerRun's opaque
// resultJson.bestCandidate.safetyGate.issues — same "never throw, drop
// anything absent/malformed" convention as summariseMarkerRunResult above.
// Does not call productionSafetyGateEngine and does not reconstruct its
// rules; this only extracts the ALREADY-COMPUTED issues array that engine
// wrote into the MarkerRun at generation time. A malformed/missing
// safetyGate (e.g. from a MarkerRun saved before this field existed, or any
// unexpected shape) yields an empty array, never a throw.
function readSafetyGateIssues(
  resultJson: unknown
): ProductionSafetyGateIssue[] {
  if (!resultJson || typeof resultJson !== "object") return [];

  const bestCandidate = (resultJson as Record<string, unknown>).bestCandidate;
  if (!bestCandidate || typeof bestCandidate !== "object") return [];

  const safetyGate = (bestCandidate as Record<string, unknown>).safetyGate;
  if (!safetyGate || typeof safetyGate !== "object") return [];

  const issues = (safetyGate as Record<string, unknown>).issues;
  if (!Array.isArray(issues)) return [];

  return issues.filter((issue): issue is ProductionSafetyGateIssue => {
    if (!issue || typeof issue !== "object") return false;

    const candidate = issue as Record<string, unknown>;

    return (
      typeof candidate.code === "string" &&
      typeof candidate.severity === "string" &&
      SAFETY_GATE_SEVERITIES.has(candidate.severity) &&
      typeof candidate.title === "string" &&
      typeof candidate.message === "string" &&
      typeof candidate.blocksRelease === "boolean"
    );
  }) as ProductionSafetyGateIssue[];
}

function isPersistedGeometryPoint(value: unknown): boolean {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as Record<string, unknown>).x === "number" &&
    typeof (value as Record<string, unknown>).y === "number"
  );
}

// Stage 2E-2: reads which pattern pieces in this project's own cached
// geometry (the SAME optifabric-project-{projectId} object the trace page
// writes grainLineFirstPoint/grainLineSecondPoint into — Stage 2B-3) have a
// traced grain line, keyed by the pattern id trace/geometry pages use
// (PatternStatus.id) so it can be cross-referenced against this page's own
// markerPatterns (keyed by MarkerGeometryPattern.patternId — the same
// underlying value, different field name). Presence-only: this checks that
// both endpoints are well-formed {x,y} points, never angles/compliance.
// project here is typed narrowly as MarkerProject (only the fields this
// page otherwise cares about) but carries the full shared project object at
// runtime, hence the defensive unknown-cast rather than trusting the type.
function readGrainLineTracedPatternIds(project: unknown): Set<string> {
  const rawPatterns =
    project && typeof project === "object"
      ? (project as Record<string, unknown>).patterns
      : undefined;
  if (!Array.isArray(rawPatterns)) return new Set();

  const traced = new Set<string>();

  for (const raw of rawPatterns) {
    if (!raw || typeof raw !== "object") continue;

    const record = raw as Record<string, unknown>;

    const patternId =
      typeof record.id === "string"
        ? record.id
        : typeof record.patternId === "string"
          ? record.patternId
          : undefined;

    if (!patternId) continue;

    if (
      isPersistedGeometryPoint(record.grainLineFirstPoint) &&
      isPersistedGeometryPoint(record.grainLineSecondPoint)
    ) {
      traced.add(patternId);
    }
  }

  return traced;
}

// Stage 2E-2: purely presentational — visual styling only, no judgement.
const RECOMMENDATION_SEVERITY_STYLES: Record<
  EngineeringRecommendationSeverity,
  { label: string; badge: string; panel: string; text: string }
> = {
  critical: {
    label: "Critical",
    badge: "border-red-400/40 bg-red-500/10 text-red-200",
    panel: "border-red-500/30 bg-red-950/20",
    text: "text-red-200",
  },
  review: {
    label: "Review",
    badge: "border-orange-400/40 bg-orange-500/10 text-orange-200",
    panel: "border-orange-500/30 bg-orange-950/20",
    text: "text-orange-100",
  },
  advisory: {
    label: "Advisory",
    badge: "border-amber-400/40 bg-amber-500/10 text-amber-200",
    panel: "border-amber-500/30 bg-amber-950/20",
    text: "text-amber-200",
  },
  passed: {
    label: "Passed",
    badge: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    panel: "border-emerald-500/30 bg-emerald-950/20",
    text: "text-emerald-200",
  },
};

// Stage 2C-2: ServerFabricProfile -> the frontend's own FabricProfile shape
// — strips id/projectId/createdAt/updatedAt (never part of the editable
// profile) and converts the server's `null` (nullable Prisma columns) back
// to `undefined` for every field FabricProfile itself declares optional.
// maximumMarkerLengthCm is the one exception: FabricProfile declares it
// `number | null` itself (see that interface's own comment), so it passes
// through unchanged.
function mapServerFabricProfile(serverProfile: ServerFabricProfile): FabricProfile {
  return {
    fabricType: serverProfile.fabricType as FabricProfile["fabricType"],
    construction: serverProfile.construction as FabricProfile["construction"],

    grainControl: serverProfile.grainControl as FabricProfile["grainControl"],
    faceDirection: serverProfile.faceDirection as FabricProfile["faceDirection"],
    nap: serverProfile.nap as FabricProfile["nap"],
    allowableRotation: serverProfile.allowableRotation as FabricProfile["allowableRotation"],
    stretch: serverProfile.stretch as FabricProfile["stretch"],
    knitOrientation:
      (serverProfile.knitOrientation as FabricProfile["knitOrientation"]) ?? undefined,

    lengthWarpShrinkagePercent: serverProfile.lengthWarpShrinkagePercent ?? undefined,
    widthWeftShrinkagePercent: serverProfile.widthWeftShrinkagePercent ?? undefined,

    matchingRequirement: serverProfile.matchingRequirement as FabricProfile["matchingRequirement"],
    horizontalRepeat: serverProfile.horizontalRepeat ?? undefined,
    verticalRepeat: serverProfile.verticalRepeat ?? undefined,
    repeatUnit: (serverProfile.repeatUnit as FabricProfile["repeatUnit"]) ?? undefined,

    directionalFabric: serverProfile.directionalFabric as FabricProfile["directionalFabric"],

    nominalFabricWidthCm: serverProfile.nominalFabricWidthCm ?? undefined,
    usableFabricWidthCm: serverProfile.usableFabricWidthCm,
    fabricWidthUnit: serverProfile.fabricWidthUnit as FabricProfile["fabricWidthUnit"],

    maximumMarkerLengthOption:
      serverProfile.maximumMarkerLengthOption as FabricProfile["maximumMarkerLengthOption"],
    maximumMarkerLengthCm: serverProfile.maximumMarkerLengthCm,
  };
}

// Stage 2C-2: FabricProfile -> SaveFabricProfileInput (the PUT body) — the
// two shapes are already field-for-field identical (see SaveFabricProfileInput's
// own comment), this only exists so the call site doesn't rely on structural
// typing implicitly and stays obvious about what's actually sent.
function toSaveFabricProfileInput(profile: FabricProfile): SaveFabricProfileInput {
  return { ...profile };
}

function widthToCentimetres(
  value: number,
  unit: FabricWidthUnit
): number {
  return unit === "in" ? value * 2.54 : value;
}

function centimetresToWidthUnit(
  valueCm: number,
  unit: FabricWidthUnit
): number {
  return unit === "in" ? valueCm / 2.54 : valueCm;
}

function resolveCutQuantity(pattern: MarkerGeometryPattern): number {
  const saved = toFiniteNumber(pattern.cutQuantity);

  return saved >= 1 ? Math.floor(saved) : 1;
}

/**
 * Resolves the production-safe rotation policy for one pattern from its
 * saved geometry constraints (see MarkerGeometryPattern.constraints) AND the
 * project's confirmed fabric production constraints (Step 4A — see
 * fabricPieceConstraintComposer.ts). The composer computes the effective,
 * most-restrictive-wins intersection of fabric-level and piece-level rules
 * and hands it to the SAME unchanged markerRotationPolicyEngine.ts — this
 * remains the single authority; nothing here duplicates its logic.
 *
 * Every nesting/repacking/hole-filling call site below must go through this
 * — not construct its own rotation list — so fabric, grain and nap/direction
 * restrictions cannot be bypassed or duplicated.
 */
function resolveRotationPolicy(
  pattern: MarkerGeometryPattern,
  fabricProfile: FabricProfile
): MarkerRotationPolicyResult {
  const pieceConstraints: PieceRotationConstraints = {
    geometricRotationRule: pattern.constraints?.rotation,
    grainControlled: pattern.constraints?.grainControlled,
    directionalFabric: pattern.constraints?.directionalFabric,
    napDirection: pattern.constraints?.napDirection,
    stripeMatch: pattern.constraints?.stripeMatch,
    checkMatch: pattern.constraints?.checkMatch,
  };

  return resolveMarkerRotationPolicy(
    composeFabricAndPieceRotationConstraints(fabricProfile, pieceConstraints)
  );
}

function resolveAllowedRotations(
  pattern: MarkerGeometryPattern,
  fabricProfile: FabricProfile
): MarkerRotationAngle[] {
  return [...resolveRotationPolicy(pattern, fabricProfile).permittedRotations];
}

interface RotationComplianceAudit {
  readonly rotationSafe: boolean;
  readonly grainLineSafe: boolean;
  readonly fabricDirectionSafe: boolean;
  readonly rotationViolationCount: number;
  readonly grainLineViolationCount: number;
}

/**
 * Hard-gate check: verifies every supplied placement actually used one of
 * its own pattern's canonically permitted rotations.
 *
 * Every live placement engine now only ever offers permitted rotations as
 * candidates (see the allowedRotations wiring above), so a genuine
 * violation should never occur from a freshly generated nest — this exists
 * as a real, independent verification layer rather than trusting that
 * upstream filtering was applied correctly, matching how
 * safeDenseProductionValidationEngine.ts independently re-checks
 * safeDenseRepackingEngine.ts's own output.
 */
function auditRotationCompliance(
  placements: ReadonlyArray<{
    readonly pattern: MarkerGeometryPattern | undefined;
    readonly rotation: number;
  }>,
  fabricProfile: FabricProfile
): RotationComplianceAudit {
  let grainLineViolationCount = 0;
  let directionViolationCount = 0;

  for (const placement of placements) {
    if (!placement.pattern) {
      continue;
    }

    const policy = resolveRotationPolicy(placement.pattern, fabricProfile);
    const usedRotation = normaliseDisplayRotation(placement.rotation);

    if (isRotationPermitted(policy, usedRotation)) {
      continue;
    }

    if (
      (placement.pattern.constraints?.grainControlled === true ||
        fabricProfile.grainControl === "required") &&
      (usedRotation === 90 || usedRotation === 270)
    ) {
      grainLineViolationCount += 1;
    } else {
      directionViolationCount += 1;
    }
  }

  return {
    rotationSafe:
      grainLineViolationCount === 0 &&
      directionViolationCount === 0,

    grainLineSafe: grainLineViolationCount === 0,

    fabricDirectionSafe: directionViolationCount === 0,

    rotationViolationCount:
      grainLineViolationCount + directionViolationCount,

    grainLineViolationCount,
  };
}

/**
 * Rotates source vertices for rendering, matching the rotation the nesting
 * engine applied when it placed this instance.
 *
 * The placed box returned by the nesting engine is already the rotated
 * footprint, so the outline is rotated here rather than the box. Formulas
 * mirror transformPolygonToMarker in markerPolygonCollisionEngine.ts:
 * 90°/270° exchange width and height, 180° does not.
 */
function rotateVerticesForDisplay(
  vertices: MarkerGeometryPoint[],
  rotation: 0 | 90 | 180 | 270
): MarkerGeometryPoint[] {
  if (vertices.length === 0 || rotation === 0) {
    return vertices;
  }

  let maximumX = Number.NEGATIVE_INFINITY;
  let maximumY = Number.NEGATIVE_INFINITY;

  for (const vertex of vertices) {
    if (vertex.x > maximumX) {
      maximumX = vertex.x;
    }

    if (vertex.y > maximumY) {
      maximumY = vertex.y;
    }
  }

  if (rotation === 90) {
    return vertices.map((vertex) => ({
      x: maximumY - vertex.y,
      y: vertex.x,
    }));
  }

  if (rotation === 180) {
    return vertices.map((vertex) => ({
      x: maximumX - vertex.x,
      y: maximumY - vertex.y,
    }));
  }

  return vertices.map((vertex) => ({
    x: vertex.y,
    y: maximumX - vertex.x,
  }));
}

/**
 * Narrows a loosely-typed placement rotation (SelectedCanvasPlacement.rotation
 * is `number` for display-composition convenience) to the four orientations
 * the geometry engines ever actually produce.
 */
function normaliseDisplayRotation(
  rotation: number
): 0 | 90 | 180 | 270 {
  const normalised = ((Math.round(rotation) % 360) + 360) % 360;

  if (normalised === 90 || normalised === 180 || normalised === 270) {
    return normalised;
  }

  return 0;
}

/**
 * Creates a deterministic rectangular polygon in engineering units.
 *
 * RC5-004 initially consumes the exact placed footprint used by the
 * current marker canvas. A later polygon adapter may replace this with
 * the fully transformed traced outline without changing the orchestrator.
 */
function createMarkerRectanglePolygon(
  x: number,
  y: number,
  width: number,
  height: number
): Array<{ x: number; y: number }> {
  return [
    {
      x,
      y,
    },
    {
      x: x + width,
      y,
    },
    {
      x: x + width,
      y: y + height,
    },
    {
      x,
      y: y + height,
    },
  ];
}

function getEngineeringPolygonBounds(
  polygon: ReadonlyArray<{
    readonly x: number;
    readonly y: number;
  }>
): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} | null {
  if (polygon.length < 3) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of polygon) {
    if (
      !Number.isFinite(point.x) ||
      !Number.isFinite(point.y)
    ) {
      return null;
    }

    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

/* ============================================================================
 * Page
 * ========================================================================== */

export default function MarkerEngineeringPage() {
  const params = useParams<{ projectId: string }>();

  const projectId = params.projectId;

  const projectStorageKey = `optifabric-project-${projectId}`;

  const [project, setProject] = useState<MarkerProject | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");

  const [fabricWidthUnit, setFabricWidthUnit] =
    useState<FabricWidthUnit>("cm");

  const [nominalWidthOption, setNominalWidthOption] =
    useState("152.4");

  const [customNominalWidth, setCustomNominalWidth] =
    useState("152.4");

  const [leftEdgeExclusion, setLeftEdgeExclusion] =
    useState("2");

  const [rightEdgeExclusion, setRightEdgeExclusion] =
    useState("2");

  const [setsPerMarkerInput, setSetsPerMarkerInput] =
    useState("1");

  const [maximumMarkerLengthMetres, setMaximumMarkerLengthMetres] =
    useState("");

  const [grossRollLengthMetres, setGrossRollLengthMetres] =
    useState("100");

  const [startAllowanceMetres, setStartAllowanceMetres] =
    useState("0.5");

  const [endAllowanceMetres, setEndAllowanceMetres] =
    useState("0.5");

  const [defectAllowanceMetres, setDefectAllowanceMetres] =
    useState("1");

  const [markerPriority, setMarkerPriority] =
    useState<MarkerPriority>("balanced");

  const [searchMode, setSearchMode] =
    useState<MarkerSearchMode>("standard");

  const [maximumAnalysisQuantityInput, setMaximumAnalysisQuantityInput] =
    useState("14");

  const [batchRunning, setBatchRunning] =
    useState(false);

  const [batchProgress, setBatchProgress] =
    useState<MarkerQuantityBatchProgress | null>(null);

  const [batchResult, setBatchResult] =
    useState<MarkerQuantityBatchResult | null>(null);

  const [batchError, setBatchError] =
    useState("");
  const [holeFillingRunning, setHoleFillingRunning] =
    useState(false);

  const [holeFillingError, setHoleFillingError] =
    useState("");

  const [holeFillingResult, setHoleFillingResult] =
    useState<HoleFillingCompactionResult | null>(null);

  const [selectedCanvasSolutionId, setSelectedCanvasSolutionId] =
    useState("original-marker");
  useEffect(() => {
    if (!projectId) {
      return;
    }

    try {
      const storedProject = localStorage.getItem(projectStorageKey);

      if (!storedProject) {
        setProjectError(
          "The OptiFabric engineering project could not be found in this browser."
        );

        return;
      }

      setProject(JSON.parse(storedProject) as MarkerProject);
    } catch (error) {
      console.error(
        "Unable to load the marker engineering project:",
        error
      );

      setProjectError("The saved engineering project could not be read.");
    } finally {
      setProjectLoading(false);
    }
  }, [projectId, projectStorageKey]);

  /* ============================================================================
   * Stage 2C-1 — Marker run save & history
   *
   * Persists exactly the canonical productionOptimisationInput /
   * productionMarkerResult.rawResult pair (MarkerOptimisationInput /
   * MarkerOptimisationResult, computed further below) via the
   * already-existing server/optifabric-api MarkerRun endpoints. Gated on
   * project._server — a legacy local-only project never makes a request
   * here, same signal
   * the trace/project-overview pages already key off.
   * ========================================================================== */

  const isServerBackedProject = Boolean(project?._server);

  const [savedMarkerRuns, setSavedMarkerRuns] = useState<ServerMarkerRun[]>([]);
  const [markerRunsLoading, setMarkerRunsLoading] = useState(false);
  const [markerRunsLoadError, setMarkerRunsLoadError] = useState("");

  const [markerRunSaving, setMarkerRunSaving] = useState(false);
  const [markerRunSaveError, setMarkerRunSaveError] = useState("");
  const [markerRunSaveMessage, setMarkerRunSaveMessage] = useState("");

  const [selectedMarkerRun, setSelectedMarkerRun] =
    useState<ServerMarkerRun | null>(null);

  // Stage 2D-2: which saved run (if any) is the source for fabric-consumption
  // analysis. Deliberately a SEPARATE piece of state from selectedMarkerRun
  // above — clicking a run to inspect it (read-only, Stage 2C-1) must never
  // change this, and choosing a run for consumption must never touch the
  // live/editable marker or nesting state. Page/session state only: never
  // persisted, never auto-set to "the latest run".
  const [selectedConsumptionRun, setSelectedConsumptionRun] =
    useState<ServerMarkerRun | null>(null);

  // Defensive: if the saved-runs list ever changes (e.g. a reload) and the
  // previously-selected consumption run is no longer in it, drop the
  // selection rather than silently keep computing against stale data.
  useEffect(() => {
    setSelectedConsumptionRun((current) =>
      current && !savedMarkerRuns.some((run) => run.id === current.id)
        ? null
        : current
    );
  }, [savedMarkerRuns]);

  // Synchronous guard against a rapid double-click submitting two save
  // requests — state alone can't guarantee this (two clicks in the same
  // tick would both see the pre-update value), a ref always reads current.
  const markerRunSavingRef = useRef(false);

  useEffect(() => {
    if (!projectId || !isServerBackedProject) {
      return;
    }

    let cancelled = false;

    setMarkerRunsLoading(true);
    setMarkerRunsLoadError("");

    listMarkerRuns(projectId)
      .then((runs) => {
        if (cancelled) return;

        setSavedMarkerRuns(runs);
      })
      .catch((error) => {
        if (cancelled) return;

        console.error("Unable to load saved OptiFabric marker runs:", error);

        // Non-blocking: the marker-generation workflow above is entirely
        // unaffected by this failing — only the history list shows an error.
        setMarkerRunsLoadError(
          error instanceof Error
            ? error.message
            : "Saved marker runs could not be loaded."
        );
      })
      .finally(() => {
        if (!cancelled) setMarkerRunsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, isServerBackedProject]);

  // saveMarkerRun itself is defined further below, right after
  // productionMarkerResult (whose .rawResult it persists) is declared.

  /* ============================================================================
   * Step 18 — Production interface language (English / বাংলা)
   *
   * Presentation only: reuses the existing OptiFabric engineering language
   * architecture (lib/optifabric/language/) rather than a new mechanism.
   * Persisted to its own localStorage key (see OPTIFABRIC_LANGUAGE_STORAGE_KEY
   * above) — deliberately NOT part of the per-project JSON, so switching
   * language can never touch marker geometry, fabric profile, optimisation
   * results, constraints, safety status or any other project data.
   * ========================================================================== */

  const [language, setLanguage] = useState<EngineeringLanguage>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(
      OPTIFABRIC_LANGUAGE_STORAGE_KEY
    );

    if (stored && isEngineeringLanguage(stored)) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(OPTIFABRIC_LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const lang = useMemo(
    () => createEngineeringLanguageService({ language }),
    [language]
  );

  /**
   * Translates one fixed fabricProfileTypes.ts option list for display,
   * without touching the underlying `value`s the composer/rotation policy
   * key off. See lib/optifabric/language/fabricOptionTranslations.ts.
   */
  function translatedOptions<TValue extends string>(
    field: FabricOptionField,
    options: ReadonlyArray<{ readonly value: TValue; readonly label: string }>
  ): ReadonlyArray<{ readonly value: TValue; readonly label: string }> {
    return options.map((option) => ({
      value: option.value,
      label: translateFabricOptionLabel(field, option.value, language, option.label),
    }));
  }

  /* ============================================================================
   * Step 4A — Fabric profile
   *
   * Loaded from the project once it arrives (falls back to a fresh "custom"
   * default when the project has never had one saved). Persisted back to the
   * SAME project object/localStorage key the rest of this page already reads
   * from, using the identical spread pattern batch/page.tsx uses for
   * fabricCost — not a new persistence mechanism.
   * ========================================================================== */

  const [fabricProfile, setFabricProfile] = useState<FabricProfile>(() =>
    createDefaultFabricProfile("custom")
  );

  const [fabricProfileSaved, setFabricProfileSaved] = useState(true);
  const [fabricProfileSaveError, setFabricProfileSaveError] = useState("");
  const [fabricProfileSaving, setFabricProfileSaving] = useState(false);
  const [fabricProfileLoadError, setFabricProfileLoadError] = useState("");

  // Mirrors fabricProfileSaved for the async hydration effect below, which
  // must see the CURRENT value at the moment its server response resolves —
  // same reasoning as hasUnsavedChangesRef/markerRunSavingRef elsewhere on
  // this page.
  const fabricProfileSavedRef = useRef(fabricProfileSaved);
  const fabricProfileSavingRef = useRef(false);

  useEffect(() => {
    fabricProfileSavedRef.current = fabricProfileSaved;
  }, [fabricProfileSaved]);

  useEffect(() => {
    if (project?.fabricProfile) {
      setFabricProfile(project.fabricProfile);
      setFabricProfileSaved(true);
    }
  }, [project]);

  /* ============================================================================
   * Stage 2C-2 — FabricProfile server hydration
   *
   * For server-backed projects, loads this project's persisted FabricProfile
   * once on mount and — only when the user hasn't already started an unsaved
   * local edit — uses it as the authoritative starting point, same
   * "server wins unless local is already dirty" policy the marker-run save
   * guard and Stage 2B's reconciliation already use. A legacy local-only
   * project never makes this request; a failure here is non-blocking (the
   * existing local/default fabricProfile state is simply left as-is).
   * ========================================================================== */

  useEffect(() => {
    if (!projectId || !isServerBackedProject) {
      return;
    }

    let cancelled = false;

    setFabricProfileLoadError("");

    getFabricProfile(projectId)
      .then((serverProfile) => {
        if (cancelled || !serverProfile || !fabricProfileSavedRef.current) {
          return;
        }

        const resolvedProfile = mapServerFabricProfile(serverProfile);

        setFabricProfile(resolvedProfile);
        setFabricProfileSaved(true);

        setProject((current) =>
          current
            ? {
                ...current,
                fabricProfile: resolvedProfile,
              }
            : current
        );
      })
      .catch((error) => {
        if (cancelled) return;

        console.error(
          "Unable to load the saved OptiFabric fabric profile:",
          error
        );

        // Non-blocking: the marker workflow above is entirely unaffected —
        // the existing local/default fabric profile state is left as-is.
        setFabricProfileLoadError(
          error instanceof Error
            ? error.message
            : "The saved fabric profile could not be loaded."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, isServerBackedProject]);

  function updateFabricProfile(patch: Partial<FabricProfile>): void {
    setFabricProfile((current) => ({ ...current, ...patch }));
    setFabricProfileSaved(false);
  }

  /**
   * Populates RECOMMENDED defaults for the selected fabric type. Width
   * fields are deliberately excluded — this page's own existing fabric-roll
   * width controls remain the single source of truth for width, never
   * overwritten by a fabric-type default. The engineer can, and is expected
   * to, confirm/change every constraint field afterwards — this only seeds
   * a starting point.
   */
  function applyFabricTypeDefaults(fabricType: FabricType): void {
    const defaults = createDefaultFabricProfile(fabricType, usableFabricWidthCm);

    setFabricProfile((current) => ({
      ...current,
      fabricType: defaults.fabricType,
      construction: defaults.construction,
      grainControl: defaults.grainControl,
      faceDirection: defaults.faceDirection,
      nap: defaults.nap,
      allowableRotation: defaults.allowableRotation,
      stretch: defaults.stretch,
      knitOrientation: defaults.knitOrientation,
      matchingRequirement: defaults.matchingRequirement,
      directionalFabric: defaults.directionalFabric,
    }));

    setFabricProfileSaved(false);
  }

  // Stage 2C-2: for a server-backed project, PUTs the current fabricProfile
  // state and — on success — adopts the authoritative server response as
  // the new local state, same pattern Save Marker Run already established
  // (ref-guarded against rapid repeat clicks, failure leaves everything as
  // it was). A legacy local-only project keeps its original behaviour
  // exactly (write straight to localStorage, no server request).
  async function saveFabricProfile(): Promise<void> {
    if (!project) {
      return;
    }

    if (!isServerBackedProject) {
      try {
        const updatedProject: MarkerProject = {
          ...project,
          fabricProfile,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(projectStorageKey, JSON.stringify(updatedProject));
        setProject(updatedProject);
        setFabricProfileSaved(true);
        setFabricProfileSaveError("");
      } catch (error) {
        console.error("Unable to save the fabric production profile:", error);

        setFabricProfileSaveError(
          "The fabric production profile could not be saved."
        );
      }

      return;
    }

    if (fabricProfileSavingRef.current) {
      return;
    }

    fabricProfileSavingRef.current = true;
    setFabricProfileSaving(true);
    setFabricProfileSaveError("");

    try {
      const saved = await putFabricProfile(
        projectId,
        toSaveFabricProfileInput(fabricProfile)
      );

      const resolvedProfile = mapServerFabricProfile(saved);

      const updatedProject: MarkerProject = {
        ...project,
        fabricProfile: resolvedProfile,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(projectStorageKey, JSON.stringify(updatedProject));
      setProject(updatedProject);
      setFabricProfile(resolvedProfile);
      setFabricProfileSaved(true);
    } catch (error) {
      // The current fabric inputs and marker result are untouched — only
      // the save-error status changes on failure.
      console.error("Unable to save the fabric production profile:", error);

      setFabricProfileSaveError(
        error instanceof Error
          ? error.message
          : "The fabric production profile could not be saved."
      );
    } finally {
      fabricProfileSavingRef.current = false;
      setFabricProfileSaving(false);
    }
  }

  const markerPatterns = useMemo(
    () => project?.aiGeometry?.patterns ?? [],
    [project]
  );

  const standardWidthOptions =
    fabricWidthUnit === "cm"
      ? STANDARD_WIDTHS_CM
      : STANDARD_WIDTHS_IN;

  const nominalWidthInSelectedUnit =
    nominalWidthOption === "custom"
      ? parseNonNegative(customNominalWidth)
      : parseNonNegative(nominalWidthOption);

  const nominalFabricWidthCm = widthToCentimetres(
    nominalWidthInSelectedUnit,
    fabricWidthUnit
  );

  const leftEdgeExclusionCm = widthToCentimetres(
    parseNonNegative(leftEdgeExclusion),
    fabricWidthUnit
  );

  const rightEdgeExclusionCm = widthToCentimetres(
    parseNonNegative(rightEdgeExclusion),
    fabricWidthUnit
  );

  const usableFabricWidthCm = Math.max(
    0,
    nominalFabricWidthCm -
      leftEdgeExclusionCm -
      rightEdgeExclusionCm
  );

  const edgeExclusionTotalCm =
    leftEdgeExclusionCm + rightEdgeExclusionCm;

  const edgeWidthLossPercent =
    nominalFabricWidthCm > 0
      ? (edgeExclusionTotalCm / nominalFabricWidthCm) * 100
      : 0;

  /**
   * Step 4C §4, §8 — one place that labels every fabric field as ENFORCED
   * (composed into the effective rotation policy by
   * fabricPieceConstraintComposer.ts), STORED / ADVISORY (recorded, but no
   * algorithm reads it yet), or UNKNOWN — REQUIRES CONFIRMATION (a
   * fail-conservative default is currently in force). This reads the same
   * FabricProfile values already used above; it does not recompute or
   * duplicate the composer's own logic.
   */
  const fabricProfileSummaryRows = useMemo(() => {
    type SummaryStatus = "enforced" | "conservative" | "advisory";

    const STATUS_LABEL: Record<SummaryStatus, string> = {
      enforced: lang.term("enforced"),
      conservative: lang.term("enforcedConservative"),
      advisory: lang.term("storedAdvisory"),
    };

    const STATUS_CLASS: Record<SummaryStatus, string> = {
      enforced: "text-emerald-300",
      conservative: "text-amber-300",
      advisory: "text-slate-400",
    };

    function row(
      field: string,
      value: string,
      status: SummaryStatus
    ): { field: string; value: string; status: string; statusClass: string } {
      return { field, value, status: STATUS_LABEL[status], statusClass: STATUS_CLASS[status] };
    }

    return [
      row(
        lang.term("grainControl"),
        translateFabricOptionLabel(
          "grainControl",
          fabricProfile.grainControl,
          language,
          optionLabel(GRAIN_CONTROL_OPTIONS, fabricProfile.grainControl)
        ),
        "enforced"
      ),
      row(
        lang.term("faceDirection"),
        translateFabricOptionLabel(
          "faceDirection",
          fabricProfile.faceDirection,
          language,
          optionLabel(FACE_DIRECTION_OPTIONS, fabricProfile.faceDirection)
        ),
        "enforced"
      ),
      row(
        lang.term("nap"),
        translateFabricOptionLabel(
          "nap",
          fabricProfile.nap,
          language,
          optionLabel(NAP_OPTIONS, fabricProfile.nap)
        ),
        fabricProfile.nap === "unknown" ? "conservative" : "enforced"
      ),
      row(
        lang.term("directionalFabric"),
        translateFabricOptionLabel(
          "directionalFabric",
          fabricProfile.directionalFabric,
          language,
          optionLabel(DIRECTIONAL_FABRIC_OPTIONS, fabricProfile.directionalFabric)
        ),
        fabricProfile.directionalFabric === "requiresConfirmation"
          ? "conservative"
          : "enforced"
      ),
      row(
        lang.term("allowableRotation"),
        translateFabricOptionLabel(
          "allowableRotation",
          fabricProfile.allowableRotation,
          language,
          optionLabel(ALLOWABLE_ROTATION_OPTIONS, fabricProfile.allowableRotation)
        ),
        "enforced"
      ),
      row(
        lang.term("stretch"),
        translateFabricOptionLabel(
          "stretch",
          fabricProfile.stretch,
          language,
          optionLabel(STRETCH_OPTIONS, fabricProfile.stretch)
        ),
        "advisory"
      ),
      row(
        lang.term("lengthWarpShrinkage"),
        fabricProfile.lengthWarpShrinkagePercent !== undefined
          ? `${formatNumber(fabricProfile.lengthWarpShrinkagePercent, 1)}%`
          : lang.term("notSpecified"),
        "advisory"
      ),
      row(
        lang.term("widthWeftShrinkage"),
        fabricProfile.widthWeftShrinkagePercent !== undefined
          ? `${formatNumber(fabricProfile.widthWeftShrinkagePercent, 1)}%`
          : lang.term("notSpecified"),
        "advisory"
      ),
      row(
        lang.term("matchingRequirement"),
        translateFabricOptionLabel(
          "matchingRequirement",
          fabricProfile.matchingRequirement,
          language,
          optionLabel(MATCHING_REQUIREMENT_OPTIONS, fabricProfile.matchingRequirement)
        ),
        "advisory"
      ),
      row(
        lang.term("usableFabricWidth"),
        `${formatNumber(centimetresToWidthUnit(usableFabricWidthCm, fabricWidthUnit), 2)} ${fabricWidthUnit}`,
        "enforced"
      ),
    ];
  }, [fabricProfile, usableFabricWidthCm, fabricWidthUnit, lang, language]);

  const setsPerMarker = useMemo(() => {
    const parsed = Math.floor(Number(setsPerMarkerInput));

    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return Math.min(parsed, MAXIMUM_SETS_PER_MARKER);
  }, [setsPerMarkerInput]);

  const piecesPerGarment = useMemo(
    () =>
      markerPatterns.reduce(
        (total, pattern) => total + resolveCutQuantity(pattern),
        0
      ),
    [markerPatterns]
  );

  const totalInstances = piecesPerGarment * setsPerMarker;

  const nestingRefused = totalInstances > MAXIMUM_NESTING_INSTANCES;

  /**
   * Step 4A: moved earlier so the deterministic baseline, the dense
   * repacking engine and the Step 3 production optimiser can all honour the
   * factory's confirmed maximum cutting-table/marker length (previously this
   * was computed further down and only ever used for after-the-fact
   * fabric-consumption reporting — the nesting engines themselves were never
   * actually capped by it).
   */
  const optionalMaximumMarkerLengthCm =
    parseNonNegative(maximumMarkerLengthMetres) * 100;

  /* ------------------------------- Nesting ------------------------------- */

  const nesting = useMemo(() => {
    const empty = {
      placedPatterns: [] as PlacedMarkerPattern[],
      unplacedGroups: [] as UnplacedGroup[],
      markerHeightPixels: 0,
      positionedPolygons: [] as PositionedPolygon[],
      instanceNames: new Map<string, string>(),
      candidateTests: 0,
      budgetExhaustedCount: 0,
      requiredMarkerHeightPixelsUncapped: null as number | null,
    };

    const fabricWidthPixels =
      Number.isFinite(usableFabricWidthCm) && usableFabricWidthCm > 0
        ? usableFabricWidthCm * CANVAS_PIXELS_PER_CM
        : 0;

    if (
      markerPatterns.length === 0 ||
      fabricWidthPixels <= 0 ||
      nestingRefused
    ) {
      return empty;
    }

    /*
     * Every physical piece the marker must contain: each pattern repeated by
     * its cut quantity, then by the number of garments in the marker.
     *
     * Instance identifiers must be unique, otherwise the collision report and
     * the placement lookup would collapse repeated pieces into one.
     */
    const instanceToPattern = new Map<string, MarkerGeometryPattern>();

    const nestingInput = markerPatterns.flatMap((pattern) => {
      const width = Math.max(
        toFiniteNumber(pattern.dimensions.widthCm) * CANVAS_PIXELS_PER_CM,
        MINIMUM_PIECE_WIDTH
      );

      const height = Math.max(
        toFiniteNumber(pattern.dimensions.heightCm) * CANVAS_PIXELS_PER_CM,
        MINIMUM_PIECE_HEIGHT
      );

      const instanceCount = resolveCutQuantity(pattern) * setsPerMarker;

      const allowedRotations = resolveAllowedRotations(pattern, fabricProfile);

      return Array.from({ length: instanceCount }, (_, index) => {
        const instanceId = `${pattern.patternId}::${index}`;

        instanceToPattern.set(instanceId, pattern);

        return {
          id: instanceId,

          width,
          height,

          vertices: pattern.polygon.vertices,

          allowedRotations,
        };
      });
    });

    const result = createDeterministicNestedMarker(nestingInput, {
      fabricWidth: fabricWidthPixels,

      horizontalGap: HORIZONTAL_GAP,
      verticalGap: VERTICAL_GAP,

      searchStep: 4,

      /**
       * Step 4A: honour the factory's confirmed maximum cutting-table/marker
       * length when one is set. 100000px (~grossly unbounded) preserves the
       * previous "no limit" behaviour exactly when none is specified.
       */
      maximumMarkerHeight:
        optionalMaximumMarkerLengthCm > 0
          ? optionalMaximumMarkerLengthCm * CANVAS_PIXELS_PER_CM
          : 100000,

      maximumCandidateTestsPerPiece: CANDIDATE_TESTS_PER_PIECE,

      spatialBandHeight: SPATIAL_BAND_HEIGHT,
    });

    /**
     * Step 4A: when a maximum cutting-table/marker length is confirmed AND
     * it left pieces unplaced, run one extra, uncapped baseline pass purely
     * to measure the length that WOULD be required — for the "MARKER
     * EXCEEDS AVAILABLE CUTTING TABLE LENGTH" report only. This measurement
     * is never used to place pieces; the capped `result` above remains the
     * only source of the actual, displayed marker.
     */
    let requiredMarkerHeightPixelsUncapped: number | null = null;

    if (optionalMaximumMarkerLengthCm > 0 && result.unplacedCount > 0) {
      const uncappedResult = createDeterministicNestedMarker(nestingInput, {
        fabricWidth: fabricWidthPixels,
        horizontalGap: HORIZONTAL_GAP,
        verticalGap: VERTICAL_GAP,
        searchStep: 4,
        maximumMarkerHeight: 100000,
        maximumCandidateTestsPerPiece: CANDIDATE_TESTS_PER_PIECE,
        spatialBandHeight: SPATIAL_BAND_HEIGHT,
      });

      requiredMarkerHeightPixelsUncapped = uncappedResult.markerHeight;
    }

    const placementById = new Map(
      result.patterns.map((placement) => [placement.id, placement])
    );

    const placedPatterns: PlacedMarkerPattern[] = [];
    const unplacedCounts = new Map<string, number>();
    const instanceNames = new Map<string, string>();

    for (const input of nestingInput) {
      const pattern = instanceToPattern.get(input.id);

      if (!pattern) {
        continue;
      }

      instanceNames.set(input.id, pattern.recognisedName);

      const placement = placementById.get(input.id);

      if (!placement) {
        unplacedCounts.set(
          pattern.patternId,
          (unplacedCounts.get(pattern.patternId) ?? 0) + 1
        );

        continue;
      }

      placedPatterns.push({
        instanceId: input.id,

        pattern,

        placement: {
          x: placement.x + CANVAS_PADDING,
          y: placement.y + CANVAS_HEADER_HEIGHT,

          width: placement.width,
          height: placement.height,

          rotation: placement.rotation,
        },
      });
    }

    const unplacedGroups: UnplacedGroup[] = [];

    for (const pattern of markerPatterns) {
      const count = unplacedCounts.get(pattern.patternId);

      if (count) {
        unplacedGroups.push({ pattern, count });
      }
    }

    const positionedPolygons: PositionedPolygon[] = placedPatterns.map(
      (entry) => ({
        id: entry.instanceId,

        vertices:
          entry.placement.rotation !== 0
            ? rotateVerticesForDisplay(
                entry.pattern.polygon.vertices,
                entry.placement.rotation
              )
            : entry.pattern.polygon.vertices,

        x: entry.placement.x,
        y: entry.placement.y,

        width: entry.placement.width,
        height: entry.placement.height,

        rotation: 0,
      })
    );

    return {
      placedPatterns,
      unplacedGroups,
      markerHeightPixels: result.markerHeight,
      positionedPolygons,
      instanceNames,
      candidateTests: result.candidateTests,
      budgetExhaustedCount: result.budgetExhaustedCount,
      requiredMarkerHeightPixelsUncapped,
    };
  }, [
    markerPatterns,
    usableFabricWidthCm,
    setsPerMarker,
    nestingRefused,
    fabricProfile,
    optionalMaximumMarkerLengthCm,
  ]);

  const {
    placedPatterns,
    unplacedGroups,
    positionedPolygons,
    instanceNames,
    candidateTests,
    budgetExhaustedCount,
    requiredMarkerHeightPixelsUncapped,
  } = nesting;

  /* ------------------------------ Collisions ----------------------------- */

  const collisionCount = useMemo(
    () => countPolygonCollisions(positionedPolygons),
    [positionedPolygons]
  );

  const collisionPairs = useMemo(
    () => findPolygonCollisionPairs(positionedPolygons),
    [positionedPolygons]
  );

  /* ------------------------------- Measures ------------------------------ */

  const markerCanvasHeight = useMemo(() => {
    if (placedPatterns.length === 0) {
      return MINIMUM_CANVAS_HEIGHT;
    }

    const lowestEdge = Math.max(
      ...placedPatterns.map(
        (entry) => entry.placement.y + entry.placement.height
      )
    );

    return Math.max(
      MINIMUM_CANVAS_HEIGHT,
      Math.ceil(lowestEdge + CANVAS_BOTTOM_PADDING)
    );
  }, [placedPatterns]);

  const areaPerGarmentCm2 = useMemo(
    () =>
      markerPatterns.reduce(
        (total, pattern) =>
          total +
          toFiniteNumber(pattern.polygon.area.squareCm) *
            resolveCutQuantity(pattern),
        0
      ),
    [markerPatterns]
  );

  const markerLengthCm = nesting.markerHeightPixels / CANVAS_PIXELS_PER_CM;

  const markerAreaCm2 =
    usableFabricWidthCm > 0 && markerLengthCm > 0
      ? usableFabricWidthCm * markerLengthCm
      : 0;

  const placedPatternAreaCm2 = useMemo(
    () =>
      placedPatterns.reduce(
        (total, entry) =>
          total + toFiniteNumber(entry.pattern.polygon.area.squareCm),
        0
      ),
    [placedPatterns]
  );

  const utilisation =
    markerAreaCm2 > 0
      ? Math.min(100, (placedPatternAreaCm2 / markerAreaCm2) * 100)
      : 0;

  const waste = markerAreaCm2 > 0 ? Math.max(0, 100 - utilisation) : 0;

  const grossWidthUtilisation =
    nominalFabricWidthCm > 0
      ? utilisation * (usableFabricWidthCm / nominalFabricWidthCm)
      : 0;

  const markerIsComplete =
    collisionCount === 0 &&
    unplacedGroups.length === 0 &&
    budgetExhaustedCount === 0 &&
    placedPatterns.length > 0;

  /**
   * Step 4A — cutting-table/marker-length conflict report.
   *
   * Now that a confirmed maximum length is actually enforced by the nesting
   * engines (see the `maximumMarkerHeight`/`maximumMarkerLength` wiring
   * above), a marker that cannot fit every required piece within that limit
   * leaves pieces unplaced rather than silently growing past it. This
   * derives the specific "MARKER EXCEEDS AVAILABLE CUTTING TABLE LENGTH"
   * report — required length, available length, difference, piece count,
   * fabric width — instead of just reporting "some pieces are unplaced"
   * with no explanation of why.
   */
  const cuttingTableLengthConflict = useMemo(() => {
    if (
      optionalMaximumMarkerLengthCm <= 0 ||
      requiredMarkerHeightPixelsUncapped === null
    ) {
      return null;
    }

    const requiredMarkerLengthCm =
      requiredMarkerHeightPixelsUncapped / CANVAS_PIXELS_PER_CM;

    if (requiredMarkerLengthCm <= optionalMaximumMarkerLengthCm) {
      return null;
    }

    return {
      requiredMarkerLengthCm,
      availableTableLengthCm: optionalMaximumMarkerLengthCm,
      differenceCm: requiredMarkerLengthCm - optionalMaximumMarkerLengthCm,
      pieceCount: totalInstances,
      fabricWidthCm: usableFabricWidthCm,
    };
  }, [
    optionalMaximumMarkerLengthCm,
    requiredMarkerHeightPixelsUncapped,
    totalInstances,
    usableFabricWidthCm,
  ]);

  /* ============================================================================
   * Step 4 — Production optimisation
   *
   * Runs the Step 3 multi-strategy optimiser (BALANCED profile) against the
   * same patterns already nested by the deterministic baseline above, and
   * only ever REPLACES THE DISPLAYED RESULT — never the underlying baseline
   * data (markerLengthCm/utilisation/waste/placedPatterns/nesting stay
   * exactly as computed above, unchanged, and every other engine on this
   * page — hole filling, safety gate, dense repacking, recovery, quantity
   * analysis — continues to read from that unchanged baseline exactly as
   * before). The optimiser's own rotation policy resolution is the same
   * canonical resolveMarkerRotationPolicy() used everywhere else on this
   * page, so grain/nap/directional/rotation rules are identical either way.
   * ========================================================================== */

  const productionOptimisationInput =
    useMemo<MarkerOptimisationInput | null>(() => {
      if (
        markerPatterns.length === 0 ||
        usableFabricWidthCm <= 0 ||
        totalInstances > MAXIMUM_PRODUCTION_OPTIMISATION_INSTANCES
      ) {
        return null;
      }

      const pieces: MarkerOptimisationSourcePiece[] = markerPatterns.flatMap(
        (pattern) => {
          const vertices = pattern.polygon.vertices;

          if (!vertices || vertices.length < 3) {
            return [];
          }

          let minX = Number.POSITIVE_INFINITY;
          let minY = Number.POSITIVE_INFINITY;
          let maxX = Number.NEGATIVE_INFINITY;
          let maxY = Number.NEGATIVE_INFINITY;

          for (const vertex of vertices) {
            if (!Number.isFinite(vertex.x) || !Number.isFinite(vertex.y)) {
              return [];
            }

            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);
          }

          const sourceWidth = maxX - minX;
          const sourceHeight = maxY - minY;

          const widthCm = toFiniteNumber(pattern.dimensions?.widthCm);
          const heightCm = toFiniteNumber(pattern.dimensions?.heightCm);

          if (
            sourceWidth <= 0 ||
            sourceHeight <= 0 ||
            widthCm <= 0 ||
            heightCm <= 0
          ) {
            return [];
          }

          /**
           * Same canvas-orientation convention as the rest of this page and
           * the (Step 3C canonicalised) optimiser engines — no axis
           * transpose. See safeDenseRepackingInput above for the equivalent
           * recipe.
           */
          const polygon = vertices.map((vertex) => ({
            x: ((vertex.x - minX) / sourceWidth) * widthCm,
            y: ((vertex.y - minY) / sourceHeight) * heightCm,
          }));

          const instanceCount = resolveCutQuantity(pattern) * setsPerMarker;

          /**
           * Step 4A: compose the project's confirmed fabric constraints with
           * this piece's own constraints (most-restrictive-wins) BEFORE
           * handing anything to the orchestrator, exactly as every other
           * call site on this page now does. The orchestrator's own
           * resolveMarkerRotationPolicy() call on these already-effective
           * flags is idempotent — it simply re-derives the same final
           * policy, it does not narrow twice.
           */
          const effectiveConstraints = composeFabricAndPieceRotationConstraints(
            fabricProfile,
            {
              geometricRotationRule: pattern.constraints?.rotation,
              grainControlled: pattern.constraints?.grainControlled,
              directionalFabric: pattern.constraints?.directionalFabric,
              napDirection: pattern.constraints?.napDirection,
              stripeMatch: pattern.constraints?.stripeMatch,
              checkMatch: pattern.constraints?.checkMatch,
            }
          );

          return Array.from({ length: instanceCount }, (_, index) => ({
            id: `${pattern.patternId}-opt-${index + 1}`,
            pieceName: pattern.recognisedName,
            polygon,
            geometricRotationRule: effectiveConstraints.geometricRotationRule,
            grainControlled: effectiveConstraints.grainControlled,
            directionalFabric: effectiveConstraints.directionalFabric,
            napDirection: effectiveConstraints.napDirection,
            priority: Math.max(
              1,
              Math.round(toFiniteNumber(pattern.engineeringScore))
            ),
            category: pattern.recognisedName,
          }));
        }
      );

      if (pieces.length === 0) {
        return null;
      }

      return {
        markerId: `${projectId}-production-optimisation`,
        fabricWidth: usableFabricWidthCm,
        pieces,
        cuttingGap: CUTTING_GAP_CM,
        maximumMarkerLength:
          optionalMaximumMarkerLengthCm > 0
            ? optionalMaximumMarkerLengthCm
            : undefined,
      };
    }, [
      markerPatterns,
      usableFabricWidthCm,
      setsPerMarker,
      totalInstances,
      projectId,
      fabricProfile,
      optionalMaximumMarkerLengthCm,
    ]);

  function describeGateDecision(
    decision: ProductionSafetyGateResult["decision"],
    sourceLabel: "baseline" | "optimised"
  ): string {
    if (decision === "productionReleased") {
      return `Production Released (${sourceLabel})`;
    }

    if (decision === "rejected") {
      return "Production Rejected";
    }

    return "Engineering Review Required";
  }

  const productionMarkerResult = useMemo<ProductionMarkerResult>(() => {
    const notGatedResult: ProductionMarkerResult = {
      source: "baseline",
      utilisationPercent: utilisation,
      wastePercent: waste,
      markerLengthCm,
      placedCount: placedPatterns.length,
      expectedCount: totalInstances,
      complete: markerIsComplete,
      productionSafe: false,
      productionStatusLabel: "Not Independently Gated (marker too large)",
      decision: "notIndependentlyGated",
      decisionLabel: "Not Independently Gated",
      safetyGate: null,
      // Stage 2C-1: the orchestrator's own raw result, carried alongside the
      // derived summary fields above rather than discarded — this is the
      // exact canonical MarkerOptimisationResult Save Marker Run persists,
      // computed here once (this memo already ran runMarkerOptimisation
      // before this stage too) and never re-run at save time.
      rawResult: null,
    };

    if (!productionOptimisationInput) {
      return notGatedResult;
    }

    try {
      const result = runMarkerOptimisation(
        productionOptimisationInput,
        "balanced"
      );

      /**
       * The orchestrator ALWAYS evaluates a baseline candidate through the
       * same canonical, independently-audited Production Safety Gate,
       * regardless of whether an optimised replacement is later chosen —
       * see markerOptimisationOrchestrator.ts's computeBaselineCandidate().
       * Using it here (rather than a page-local heuristic) means the
       * displayed status is never a second, parallel judgement.
       */
      const baselineCandidate = result.candidates.find(
        (candidate) => candidate.source === "baseline"
      );

      const baselineResult: ProductionMarkerResult = baselineCandidate
        ? {
            source: "baseline",
            utilisationPercent: baselineCandidate.utilisationPercent,
            wastePercent: baselineCandidate.wastePercent,
            markerLengthCm: baselineCandidate.markerLengthCm,
            placedCount: baselineCandidate.placedPieceCount,
            expectedCount: baselineCandidate.expectedPieceCount,
            complete:
              baselineCandidate.placedPieceCount ===
              baselineCandidate.expectedPieceCount,
            productionSafe: baselineCandidate.safetyGate.productionReleased,
            productionStatusLabel: describeGateDecision(
              baselineCandidate.safetyGate.decision,
              "baseline"
            ),
            decision: baselineCandidate.safetyGate.decision,
            decisionLabel: baselineCandidate.safetyGate.decisionLabel,
            safetyGate: baselineCandidate.safetyGate,
            rawResult: result,
          }
        : { ...notGatedResult, rawResult: result };

      const GEOMETRY_TOLERANCE = 1e-6;
      const candidate = result.bestCandidate;

      if (
        candidate &&
        candidate.source !== "baseline" &&
        candidate.safetyGate.productionReleased &&
        candidate.utilisationPercent >=
          baselineResult.utilisationPercent - GEOMETRY_TOLERANCE &&
        candidate.markerLengthCm <=
          baselineResult.markerLengthCm + GEOMETRY_TOLERANCE
      ) {
        return {
          source: "optimised",
          utilisationPercent: candidate.utilisationPercent,
          wastePercent: candidate.wastePercent,
          markerLengthCm: candidate.markerLengthCm,
          placedCount: candidate.placedPieceCount,
          expectedCount: candidate.expectedPieceCount,
          complete: candidate.placedPieceCount === candidate.expectedPieceCount,
          productionSafe: true,
          productionStatusLabel: describeGateDecision(
            candidate.safetyGate.decision,
            "optimised"
          ),
          decision: candidate.safetyGate.decision,
          decisionLabel: candidate.safetyGate.decisionLabel,
          safetyGate: candidate.safetyGate,
          rawResult: result,
        };
      }

      return baselineResult;
    } catch (error) {
      console.error(
        "Marker optimisation failed; retaining the deterministic baseline result.",
        error
      );

      return notGatedResult;
    }
  }, [
    productionOptimisationInput,
    utilisation,
    waste,
    markerLengthCm,
    placedPatterns.length,
    totalInstances,
    markerIsComplete,
  ]);

  // Stage 2C-1: persists productionOptimisationInput and
  // productionMarkerResult.rawResult exactly as the orchestrator produced
  // them above — never recomputed, never approximated from page UI state.
  async function saveMarkerRun() {
    const rawResult = productionMarkerResult.rawResult;

    if (
      !projectId ||
      !isServerBackedProject ||
      !productionOptimisationInput ||
      !rawResult
    ) {
      return;
    }

    if (markerRunSavingRef.current) {
      return;
    }

    markerRunSavingRef.current = true;
    setMarkerRunSaving(true);
    setMarkerRunSaveError("");
    setMarkerRunSaveMessage("");

    try {
      const saved = await createMarkerRun(
        projectId,
        productionOptimisationInput,
        rawResult
      );

      setSavedMarkerRuns((current) => [saved, ...current]);
      setMarkerRunSaveMessage("Marker run saved.");
    } catch (error) {
      // The current generated marker/result is untouched — only the save
      // status changes on failure.
      setMarkerRunSaveError(
        error instanceof Error
          ? error.message
          : "The marker run could not be saved."
      );
    } finally {
      markerRunSavingRef.current = false;
      setMarkerRunSaving(false);
    }
  }

      /* --------------------- RC5-004 geometry adapter ---------------------- */

  const holeFillingCompactionInput =
    useMemo<HoleFillingCompactionInput | null>(() => {
      if (
        placedPatterns.length === 0 ||
        usableFabricWidthCm <= 0 ||
        markerLengthCm <= 0
      ) {
        return null;
      }

      const existingPlacements: HoleFillingSourcePlacement[] =
        placedPatterns.map((entry, index) => {
                    /**
           * Canvas orientation:
           * - canvas X = Fabric Width
           * - canvas Y = Marker Length
           *
           * RC5-004 engineering orientation:
           * - engineering X = Marker Length
           * - engineering Y = Fabric Width
           */
          const markerLengthX =
            Math.max(
              0,
              entry.placement.y -
                CANVAS_HEADER_HEIGHT
            ) / CANVAS_PIXELS_PER_CM;

          const fabricWidthY =
            Math.max(
              0,
              entry.placement.x -
                CANVAS_PADDING
            ) / CANVAS_PIXELS_PER_CM;

          const lengthDimension =
            entry.placement.height /
            CANVAS_PIXELS_PER_CM;

          const widthDimension =
            entry.placement.width /
            CANVAS_PIXELS_PER_CM;

          return {
            id: entry.instanceId,

            pieceId: entry.instanceId,

            pieceName:
              entry.pattern.recognisedName,

                        polygon:
              createMarkerRectanglePolygon(
                markerLengthX,
                fabricWidthY,
                lengthDimension,
                widthDimension
              ),

            x: markerLengthX,

            y: fabricWidthY,

            rotation:
              entry.placement.rotation,

            mirrored: false,

            locked: false,

            /**
             * grainLineAngle/maximumGrainDeviation use 0 as the canonical
             * reference axis (grain running along Marker Length) with zero
             * tolerance — the live geometry pipeline does not measure a real
             * grain angle, only a grainControlled boolean (see
             * markerRotationPolicyEngine.ts). grainLineLocked now reflects
             * that real flag instead of being hardcoded true for every
             * piece.
             */
            grainLineLocked:
              entry.pattern.constraints
                ?.grainControlled === true,

            grainLineAngle: 0,

            maximumGrainDeviation: 0,

            priority:
              Math.max(
                1,
                100 - index
              ),

            category:
              entry.pattern.recognisedName,
          };
        });

      const candidatePieces: HoleFillingCandidatePiece[] =
        unplacedGroups.flatMap((group) => {
          const widthCm =
            Math.max(
              toFiniteNumber(
                group.pattern.dimensions.widthCm
              ),
              MINIMUM_PIECE_WIDTH /
                CANVAS_PIXELS_PER_CM
            );

          const heightCm =
            Math.max(
              toFiniteNumber(
                group.pattern.dimensions.heightCm
              ),
              MINIMUM_PIECE_HEIGHT /
                CANVAS_PIXELS_PER_CM
            );

          const allowedRotations =
            resolveAllowedRotations(
              group.pattern,
              fabricProfile
            );

          return Array.from(
            {
              length: group.count,
            },
            (_, index) => ({
              id: `${group.pattern.patternId}-unplaced-${index + 1}`,

              name:
                group.pattern.recognisedName,

                            /**
               * Engineering X follows Marker Length, while
               * Engineering Y follows Fabric Width.
               */
              polygon:
                createMarkerRectanglePolygon(
                  0,
                  0,
                  heightCm,
                  widthCm
                ),

              rotation: 0,

              allowedRotations,

              rotationLocked:
                allowedRotations.length === 1,

              /**
               * See the matching comment on existingPlacements above:
               * allowedRotations has already been narrowed to the
               * production-permitted set (grain + nap/direction), so this
               * is a second, independent enforcement layer using the real
               * grainControlled flag rather than a hardcoded value.
               */
              grainLineLocked:
                group.pattern.constraints
                  ?.grainControlled === true,

              grainLineAngle: 0,

              maximumGrainDeviation: 0,

              availableQuantity: 1,

              locked: false,

              priority:
                group.pattern.packingPriority ??
                50,

              category:
                group.pattern.recognisedName,
            })
          );
        });

      return {
        markerId:
          `${projectId}-marker-${setsPerMarker}`,

        markerLength:
          markerLengthCm,

        fabricWidth:
          usableFabricWidthCm,

        existingPlacements,

        candidatePieces,

        options: {
          includeHoleFillingPlacementsInCompaction:
            true,

          maximumFinalSolutions: 10,

          minimumCombinedEngineeringScore:
            0,

          voidDetection: {
            cellSize: 1,

            minimumVoidWidth:
              CUTTING_GAP_CM * 2,

            minimumVoidHeight:
              CUTTING_GAP_CM * 2,

            minimumVoidArea: 4,

            collisionMargin:
              CUTTING_GAP_CM,

            maximumVoids: 100,

            mergeAdjacentVoids: true,

            mergeTolerance:
              CUTTING_GAP_CM,

            internalVoidsOnly: false,
          },

          compatibility: {
            clearance:
              CUTTING_GAP_CM,

            minimumFitEfficiency: 2,

            maximumCandidatesPerVoid: 25,

            maximumTotalCandidates: 250,

            allowMirroring: false,

            allowEnvelopeOnlyFit: false,

            allowBoundaryContact: true,

            rejectInvalidPieces: true,

            internalVoidsOnly: false,

            preferredRotations: [
              0,
              90,
            ],
          },

          collisionValidation: {
            collisionClearance:
              CUTTING_GAP_CM,

            markerBoundaryClearance: 0,

            allowMarkerBoundaryContact: true,

            allowPieceBoundaryContact: true,

            maximumPlacements: 100,

            maximumPlacementsPerVoid: 20,

            excludeExistingPieceIds: true,

            uniquePiecePerPlacementPlan: true,

            uniqueVoidPerPlacementPlan: true,

            recalculateEngineeringScore: true,

            minimumEngineeringScore: 0,
          },

          compaction: {
            collisionClearance:
              CUTTING_GAP_CM,

            markerBoundaryClearance: 0,

            horizontalStep: 0.5,

            verticalStep: 0.5,

            maximumHorizontalMovement:
              markerLengthCm,

            maximumVerticalMovement:
              usableFabricWidthCm,

            maximumPasses: 6,

            maximumCandidatesPerPiece: 500,

            minimumLengthImprovement: 0.01,

            allowPieceBoundaryContact: true,

            allowMarkerBoundaryContact: true,

            verticalSearchBeforeHorizontal: true,

            priorityFirst: true,

            preservePlacementOrder: false,

            returnIntermediateSolutions: true,

            maximumSolutions: 10,

            minimumEngineeringScore: 0,
          },
        },
      };
    }, [
      placedPatterns,
      unplacedGroups,
      usableFabricWidthCm,
      markerLengthCm,
      projectId,
      setsPerMarker,
    ]);
  /* --------------------------- Fabric planning --------------------------- */

  const grossRollLengthMetresValue =
    parseNonNegative(grossRollLengthMetres);

  const startAllowanceMetresValue =
    parseNonNegative(startAllowanceMetres);

  const endAllowanceMetresValue =
    parseNonNegative(endAllowanceMetres);

  const defectAllowanceMetresValue =
    parseNonNegative(defectAllowanceMetres);

  // Used both for display here and as an input elsewhere on this page
  // (e.g. the engineering-consultant report below) — kept independent of
  // marker/consumption selection, unlike the figures Stage 2D-2 moved into
  // the shared engine below.
  const usableRollLengthMetres = Math.max(
    0,
    grossRollLengthMetresValue -
      startAllowanceMetresValue -
      endAllowanceMetresValue -
      defectAllowanceMetresValue
  );

  const orderQuantity = toFiniteNumber(project?.orderQuantity);

  /* ============================================================================
   * Stage 2D-2 — marker-based fabric consumption
   *
   * Calculated ONLY against an explicitly selected saved MarkerRun
   * (selectedConsumptionRun) via the shared, pure
   * lib/optifabric/markerFabricConsumptionEngine.ts — never the live/current
   * nesting session, and never auto-selected as "the latest run". No
   * formulas are duplicated here; this block only adapts real persisted
   * data (MarkerRun.resultJson, FabricProfile, project, this page's own
   * roll/allowance inputs) into the engine's input shape.
   *
   * Width authority: FabricProfile.usableFabricWidthCm (fabricProfile.
   * usableFabricWidthCm below) — never Project.fabricWidth (not even
   * exposed on this page's MarkerProject type) and never the separate,
   * page-local `usableFabricWidthCm` (nominal-width-minus-edge-exclusion)
   * used above for live marker nesting — that is a different concept this
   * stage does not touch.
   * ========================================================================== */

  // Deliberately a plain const, not useMemo — calculateMarkerFabricConsumption
  // is cheap, pure arithmetic (a handful of numeric operations, no loops
  // over pattern/marker data), so there is nothing expensive here worth
  // caching across renders. A new useMemo in this region of the component
  // was previously found to make the React Compiler give up optimising the
  // component entirely (the same lesson already learned for Stage 2C-1's
  // own productionOptimisationResult) — avoided here by simply not adding
  // one. consumptionMarkerSummary is read once and reused for both the
  // engine input and the "Marker Length" display below.
  const consumptionMarkerSummary = selectedConsumptionRun
    ? summariseMarkerRunResult(selectedConsumptionRun.resultJson)
    : null;

  const consumptionResult = selectedConsumptionRun && consumptionMarkerSummary
    ? calculateMarkerFabricConsumption({
        markerLengthCm: consumptionMarkerSummary.markerLengthCm ?? 0,
        markerFabricWidthCm: consumptionMarkerSummary.fabricWidthCm,
        expectedPieceCount: consumptionMarkerSummary.expectedPieceCount,
        placedPieceCount: consumptionMarkerSummary.placedPieceCount,

        usableFabricWidthCm: fabricProfile.usableFabricWidthCm,
        maximumMarkerLengthCm: fabricProfile.maximumMarkerLengthCm,

        setsPerMarker,
        orderQuantity,

        grossRollLengthMetres: grossRollLengthMetresValue,
        startAllowanceMetres: startAllowanceMetresValue,
        endAllowanceMetres: endAllowanceMetresValue,
        defectAllowanceMetres: defectAllowanceMetresValue,

        fabricCost: project?.fabricCost
          ? { costPerMetre: project.fabricCost.costPerMetre }
          : undefined,
      } satisfies MarkerFabricConsumptionInput)
    : null;

  /* ============================================================================
   * Stage 2E-2 — Engineering Recommendations UI integration
   *
   * A plain, deterministic mapping of state this page already holds into
   * lib/optifabric/engineeringRecommendationsEngine.ts's own input shape —
   * no new engineering rules, thresholds, severity mapping, dedup, or
   * ordering here; all of that belongs exclusively to that module (Stage
   * 2E-1) and is not duplicated.
   *
   * CRITICAL CONSISTENCY RULE: sourced from selectedConsumptionRun only —
   * the exact same run already driving Marker-Based Fabric Consumption
   * above — never selectedMarkerRun (read-only inspection, Stage 2C-1) and
   * never the live/current nesting session. If no consumption run is
   * selected, engineeringRecommendations is simply an empty array and the
   * panel below explains why instead of showing anything run-specific.
   * ========================================================================== */

  // Deliberately a plain const, not useMemo — same React Compiler
  // memoization-preservation lesson already noted above for
  // consumptionMarkerSummary/consumptionResult.
  const safetyGateIssues = selectedConsumptionRun
    ? readSafetyGateIssues(selectedConsumptionRun.resultJson)
    : [];

  // FabricProfile completeness only applies once a consumption analysis is
  // actually being attempted against a server-backed project — the same
  // real-world condition the Marker-Based Consumption panel itself gates on
  // (!isServerBackedProject / !project?.fabricProfile above), so this can
  // never disagree with what that panel already shows. A legacy/local-only
  // project (isServerBackedProject === false) never has this recommendation
  // apply, matching instruction Section 3.
  const engineeringFabricProfileApplicable = Boolean(
    isServerBackedProject && selectedConsumptionRun
  );

  const grainLineTracedPatternIds = readGrainLineTracedPatternIds(project);

  // markerPatterns (Stage 2B geometry) is the relevant pattern set for the
  // current marker/project — the same set already rendered/nested above.
  const grainLineTracePieces = markerPatterns.map((pattern) => ({
    patternId: pattern.patternId,
    hasTracedGrainLine: grainLineTracedPatternIds.has(pattern.patternId),
  }));

  const engineeringRecommendations = selectedConsumptionRun
    ? buildEngineeringRecommendations({
        safetyGateIssues,
        // Stage 2E-4: consumptionResult is computed against whatever
        // fabricProfile currently holds in local state, which stays at
        // createDefaultFabricProfile("custom") when no profile has actually
        // been saved (see the FabricProfile useState above) — the exact same
        // unsaved-default value Marker-Based Consumption itself refuses to
        // display in that case. Gate on the same persisted-profile indicator
        // used for `present` below so this never surfaces a consumption
        // issue derived from that unsaved default.
        consumptionIssues: project?.fabricProfile
          ? (consumptionResult?.issues ?? null)
          : null,
        fabricProfile: {
          applicable: engineeringFabricProfileApplicable,
          present: Boolean(project?.fabricProfile),
        },
        grainLineTrace: { pieces: grainLineTracePieces },
      })
    : [];

  /* ---------------------- AI engineering intelligence ------------------- */

  const currentCandidateBuild = createMarkerQuantityCandidate({
    garmentsPerMarker: setsPerMarker,

    nestingResult: {
      patterns: placedPatterns.map((entry) => ({
        id: entry.instanceId,
        x: entry.placement.x - CANVAS_PADDING,
        y: entry.placement.y - CANVAS_HEADER_HEIGHT,
        width: entry.placement.width,
        height: entry.placement.height,
        rotation: entry.placement.rotation,
      })),

      markerHeight: nesting.markerHeightPixels,

      collisionCount,

      placedCount: placedPatterns.length,

      unplacedCount: Math.max(
        0,
        totalInstances - placedPatterns.length
      ),

      candidateTests,

      budgetExhaustedCount,
    },

    usableFabricWidthCm,

    totalPatternAreaPerGarmentCm2: areaPerGarmentCm2,

    expectedPiecesPerGarment: piecesPerGarment,

    canvasPixelsPerCm: CANVAS_PIXELS_PER_CM,

    maximumMarkerLengthCm:
      optionalMaximumMarkerLengthCm > 0
        ? optionalMaximumMarkerLengthCm
        : null,

    orderQuantity:
      orderQuantity > 0
        ? orderQuantity
        : null,
  });

  const completedBatchCandidates =
    batchResult
      ? extractCompletedMarkerCandidates(batchResult)
      : [];

  const analysisCandidates =
    completedBatchCandidates.length > 0
      ? completedBatchCandidates
      : [currentCandidateBuild.candidate];

  const quantityAnalysis = analyseMarkerSolutions(
    analysisCandidates,
    {
      requestedGarmentsPerMarker: setsPerMarker,

      orderQuantity:
        orderQuantity > 0
          ? orderQuantity
          : null,

      maximumMarkerLengthCm:
        optionalMaximumMarkerLengthCm > 0
          ? optionalMaximumMarkerLengthCm
          : null,
    }
  );

  const recommendedQuantity =
    quantityAnalysis.bestOverall?.garmentsPerMarker ??
    null;

  const markerComparison: MarkerComparisonSummary =
    createMarkerComparison(
      quantityAnalysis.rankedSolutions,
      {
        requestedGarmentsPerMarker:
          setsPerMarker,

        recommendedGarmentsPerMarker:
          recommendedQuantity,

        orderQuantity:
          orderQuantity > 0
            ? orderQuantity
            : null,
      }
    );

  const markerAlternatives =
    createMarkerAlternatives(
      markerComparison,
      3
    );

  const decisionCandidates: MarkerDecisionCandidate[] =
    quantityAnalysis.validSolutions.map((candidate) => ({
      garments: candidate.garmentsPerMarker,

      utilisation: candidate.utilisationPercent,

      waste: candidate.wastePercent,

      markerLength: candidate.markerLengthCm,

      estimatedCost:
        project?.fabricCost
          ? (
              candidate.fabricPerGarmentCm /
              100
            ) *
            project.fabricCost.costPerMetre
          : candidate.fabricPerGarmentCm / 100,

      confidence: Math.max(
        0,
        Math.min(
          100,
          100 -
            (
              candidate.searchBudgetExceeded
                ? 35
                : 0
            ) -
            candidate.collisionCount * 20 -
            Math.max(
              0,
              candidate.expectedPieces -
                candidate.piecesPlaced
            ) *
              2
        )
      ),
    }));

  const engineeringConsultantReport =
    decisionCandidates.length > 0
      ? createEngineeringConsultantReport({
          priority: markerPriority,

          requestedGarments: setsPerMarker,

          candidates: decisionCandidates,

          rollLength: usableRollLengthMetres,

          fabricWidth: usableFabricWidthCm,

          orderQuantity:
            orderQuantity > 0
              ? orderQuantity
              : setsPerMarker,

          costPerMetre:
            project?.fabricCost?.costPerMetre ??
            0,
        })
      : null;

  const consultantDecision =
    engineeringConsultantReport?.decision ??
    null;

  const consultantRecommendation =
    engineeringConsultantReport?.recommendation ??
    null;

      /* ------------------- Rotation policy compliance ------------------- */

  /**
   * Mirrors the id format used when building candidatePieces above
   * (`${pattern.patternId}-unplaced-${index + 1}`), so a Hole Filling
   * placement's pieceId can be traced back to the pattern whose rotation
   * policy it must respect.
   */
  const unplacedPatternByCandidateId = useMemo(() => {
    const map = new Map<string, MarkerGeometryPattern>();

    for (const group of unplacedGroups) {
      for (let index = 0; index < group.count; index += 1) {
        map.set(
          `${group.pattern.patternId}-unplaced-${index + 1}`,
          group.pattern
        );
      }
    }

    return map;
  }, [unplacedGroups]);

  /**
   * Rotation compliance of the original deterministic nest. Hole Filling,
   * Compaction and Safe Efficiency Recovery never rotate an existing
   * placement (they only translate it or leave it untouched), so this
   * audit also covers the existing-placement portion of every other
   * RC5-004 candidate kind below.
   */
  const originalRotationCompliance = useMemo(
    () =>
      auditRotationCompliance(
        placedPatterns.map((entry) => ({
          pattern: entry.pattern,
          rotation: entry.placement.rotation,
        })),
        fabricProfile
      ),
    [placedPatterns, fabricProfile]
  );

  /**
   * Rotation compliance including pieces newly inserted by Hole Filling —
   * relevant to the holeFilled, compacted and combined candidate kinds.
   */
  const afterInsertionRotationCompliance = useMemo(() => {
    const insertedPlacements = (
      holeFillingResult?.collisionValidation.plan.placements ?? []
    ).map((placement) => ({
      pattern: unplacedPatternByCandidateId.get(placement.pieceId),
      rotation: placement.rotation,
    }));

    return auditRotationCompliance(
      [
        ...placedPatterns.map((entry) => ({
          pattern: entry.pattern,
          rotation: entry.placement.rotation,
        })),
        ...insertedPlacements,
      ],
      fabricProfile
    );
  }, [
    placedPatterns,
    holeFillingResult,
    unplacedPatternByCandidateId,
    fabricProfile,
  ]);

      /* ------------------- RC5-004 canvas solutions -------------------- */

  const markerCanvasSolutions =
    useMemo<ReadonlyArray<MarkerCanvasSolutionOption>>(() => {
      const originalConfidence =
        markerIsComplete
          ? 100
          : Math.max(
              0,
              100 -
                collisionCount * 20 -
                unplacedGroups.reduce(
                  (total, group) =>
                    total + group.count * 5,
                  0
                ) -
                (
                  budgetExhaustedCount > 0
                    ? 25
                    : 0
                )
            );

      /**
       * Canonical, absolute marker-quality score (see markerScoringEngine.ts).
       * Every candidate kind below uses the same formula so "Engineering
       * Score" means the same thing regardless of which kind produced it.
       */
      const originalEngineeringScore =
        computeCanonicalMarkerQualityScore({
          utilisationPercent: utilisation,
        }).overallScore;

      const originalSolution:
        MarkerCanvasSolutionOption = {
        id: "original-marker",

        kind: "original",

        label: "Original Marker",

        description:
          "The current deterministic marker produced before RC5-004 optimisation.",

        markerLengthCm,

        utilisationPercent:
          utilisation,

        wastePercent:
          waste,

        engineeringScore:
          originalEngineeringScore,

        confidencePercent:
          originalConfidence,

        collisionFree:
          collisionCount === 0,

        engineeringReady:
          markerIsComplete,

        recommended: false,
      };

      if (!holeFillingResult) {
        return [
          originalSolution,
        ];
      }

      const selectedHoleFillingArea =
        holeFillingResult
          .collisionValidation
          .plan
          .totalPieceArea;

      const holeFilledPatternArea =
        placedPatternAreaCm2 +
        selectedHoleFillingArea;

      const holeFilledMarkerArea =
        usableFabricWidthCm > 0 &&
        markerLengthCm > 0
          ? usableFabricWidthCm *
            markerLengthCm
          : 0;

      const holeFilledUtilisation =
        holeFilledMarkerArea > 0
          ? Math.min(
              100,
              (
                holeFilledPatternArea /
                holeFilledMarkerArea
              ) * 100
            )
          : utilisation;

      const holeFilledWaste =
        Math.max(
          0,
          100 -
            holeFilledUtilisation
        );

      const selectedHoleFillingPlacements =
        holeFillingResult
          .collisionValidation
          .plan
          .placements;

      /**
       * Canonical marker-quality score for the hole-filled candidate.
       * Previously this averaged each inserted piece's own per-placement fit
       * score (collisionSafeHoleFillingEngine's engineeringScore) — a
       * placement-fit metric, not a marker-quality one — into a marker-level
       * "Engineering Score". That average is still available on
       * holeFillingResult.collisionValidation.plan.averageEngineeringScore
       * for anyone diagnosing placement fit quality specifically; it is no
       * longer read into the canonical quality field.
       */
      const holeFillingAverageScore =
        computeCanonicalMarkerQualityScore({
          utilisationPercent: holeFilledUtilisation,
        }).overallScore;

      const holeFilledSolution:
        MarkerCanvasSolutionOption = {
        id: "hole-filled-marker",

        kind: "holeFilled",

        label: "Hole-Filled Marker",

        description:
          selectedHoleFillingPlacements.length >
          0
            ? `${selectedHoleFillingPlacements.length} compatible piece${
                selectedHoleFillingPlacements.length ===
                1
                  ? ""
                  : "s"
              } inserted into validated marker voids.`
            : "No additional compatible piece was available for Hole Filling.",

        markerLengthCm,

        utilisationPercent:
          holeFilledUtilisation,

        wastePercent:
          holeFilledWaste,

        engineeringScore:
          holeFillingAverageScore,

        confidencePercent:
          selectedHoleFillingPlacements.length >
          0
            ? 95
            : 70,

        collisionFree:
          holeFillingResult
            .collisionValidation
            .statistics
            .collisionRejections === 0,

        engineeringReady:
          holeFillingResult
            .collisionValidation
            .engineeringReady,

        recommended: false,
      };

      const bestCompaction =
        holeFillingResult
          .compaction
          .bestSolution;

      const compactedSolution:
        MarkerCanvasSolutionOption = {
        id: "compacted-marker",

        kind: "compacted",

        label: "Compacted Marker",

        description:
          bestCompaction
            ? `${bestCompaction.movedPlacementCount} placement${
                bestCompaction.movedPlacementCount ===
                1
                  ? ""
                  : "s"
              } repositioned through collision-safe compaction.`
            : "No separate Marker Compaction solution was generated.",

        markerLengthCm:
          bestCompaction
            ?.compactedMarkerLength ??
          markerLengthCm,

        utilisationPercent:
          bestCompaction
            ?.compactedUtilisation ??
          utilisation,

        wastePercent:
          Math.max(
            0,
            100 -
              (
                bestCompaction
                  ?.compactedUtilisation ??
                utilisation
              )
          ),

        /**
         * Canonical marker-quality score, not
         * intelligentMarkerCompactionEngine's own engineeringScore (that
         * formula rewards movement efficiency and length *reduction* — a
         * compaction-search-quality metric — and is preserved unchanged on
         * bestCompaction.engineeringScore for anyone diagnosing the
         * compaction pass itself).
         */
        engineeringScore:
          computeCanonicalMarkerQualityScore({
            utilisationPercent:
              bestCompaction
                ?.compactedUtilisation ??
              utilisation,
          }).overallScore,

        confidencePercent:
          bestCompaction?.engineeringReady
            ? 96
            : 72,

        collisionFree:
          bestCompaction
            ?.collisionFree ??
          collisionCount === 0,

        engineeringReady:
          bestCompaction
            ?.engineeringReady ??
          false,

        recommended: false,
      };

      const bestCombined =
        holeFillingResult.bestSolution;

      const combinedSolution:
        MarkerCanvasSolutionOption = {
        id: "combined-marker",

        kind: "combined",

        label:
          "Best Combined Solution",

        description:
          bestCombined
            ? "The highest-ranked result after Hole Filling, collision validation and Intelligent Marker Compaction."
            : "No combined RC5-004 solution was generated.",

        markerLengthCm:
          bestCombined
            ?.finalMarkerLength ??
          markerLengthCm,

        utilisationPercent:
          bestCombined
            ?.finalUtilisation ??
          utilisation,

        wastePercent:
          Math.max(
            0,
            100 -
              (
                bestCombined
                  ?.finalUtilisation ??
                utilisation
              )
          ),

        /**
         * Canonical marker-quality score, not
         * holeFillingCompactionOrchestrator's own combinedEngineeringScore
         * (that formula blends hole-filling fit, compaction search quality
         * and a utilisation-*improvement* term — an orchestration-quality
         * metric — and is preserved unchanged on
         * bestCombined.combinedEngineeringScore for that purpose).
         */
        engineeringScore:
          computeCanonicalMarkerQualityScore({
            utilisationPercent:
              bestCombined
                ?.finalUtilisation ??
              utilisation,
          }).overallScore,

        confidencePercent:
          bestCombined?.engineeringReady
            ? 98
            : 75,

        collisionFree:
          bestCombined
            ?.collisionFree ??
          collisionCount === 0,

        engineeringReady:
          bestCombined
            ?.engineeringReady ??
          false,

        recommended:
          Boolean(
            bestCombined &&
              (
                bestCombined.decision ===
                  "recommended" ||
                bestCombined.engineeringReady
              )
          ),
      };

      return [
        originalSolution,
        holeFilledSolution,
        compactedSolution,
        combinedSolution,
      ];
    }, [
      markerIsComplete,
      collisionCount,
      unplacedGroups,
      budgetExhaustedCount,
      utilisation,
      waste,
      markerLengthCm,
      placedPatternAreaCm2,
      usableFabricWidthCm,
      holeFillingResult,
    ]);
  /* ---------------- RC5-004-009 Production Safety Gate ---------------- */

  const productionSafetyRanking =
    useMemo<ProductionSafetyGateRanking>(() => {
      const safetyInputs: ProductionSafetyGateInput[] =
        markerCanvasSolutions.map((solution) => {
          const isOriginal =
            solution.kind === "original";

          /**
           * Step 2 connects real Grain Line / rotation / nap-direction
           * compliance here. "original" uses the deterministic-nest audit;
           * every other kind also includes pieces Hole Filling inserted,
           * since Compaction and Safe Efficiency Recovery never rotate a
           * placement (see auditRotationCompliance and its call sites).
           */
          const rotationCompliance = isOriginal
            ? originalRotationCompliance
            : afterInsertionRotationCompliance;

          const isHoleFilled =
            solution.kind === "holeFilled";

          const isCompacted =
            solution.kind === "compacted";

          const isCombined =
            solution.kind === "combined";

          let boundarySafe =
            solution.collisionFree;

          if (
            isCompacted &&
            holeFillingResult
              ?.compaction
              .bestSolution
          ) {
            boundarySafe =
              holeFillingResult
                .compaction
                .bestSolution
                .boundarySafe;
          }

          if (
            isCombined &&
            holeFillingResult
              ?.bestSolution
          ) {
            boundarySafe =
              holeFillingResult
                .bestSolution
                .boundarySafe;
          }

          const pieceComplete =
            isOriginal
              ? markerIsComplete
              : isHoleFilled
                ? (
                    unplacedGroups.length ===
                      0 &&
                    budgetExhaustedCount ===
                      0
                  )
                : true;

          const productionFeasible =
            solution.collisionFree &&
            boundarySafe &&
            pieceComplete;

          return {
            id: solution.id,

            label: solution.label,

            markerLengthCm:
              solution.markerLengthCm,

            utilisationPercent:
              solution.utilisationPercent,

            wastePercent:
              solution.wastePercent,

            engineeringScore:
              solution.engineeringScore,

            confidencePercent:
              solution.confidencePercent,

            collisionFree:
              solution.collisionFree,

            collisionCount:
              solution.collisionFree
                ? 0
                : 1,

            boundarySafe,

            /**
             * Current deterministic marker placement already
             * incorporates the configured cutting clearance.
             *
             * A failed collision state cannot be considered
             * cutting-gap safe.
             */
            cuttingGapSafe:
              solution.collisionFree,

            requiredCuttingGapCm:
              CUTTING_GAP_CM,

            grainLineSafe:
              rotationCompliance.grainLineSafe,

            grainLineViolationCount:
              rotationCompliance.grainLineViolationCount,

            rotationSafe:
              rotationCompliance.rotationSafe,

            rotationViolationCount:
              rotationCompliance.rotationViolationCount,

            fabricDirectionSafe:
              rotationCompliance.fabricDirectionSafe,

            pieceComplete,

            expectedPieceCount:
              totalInstances,

            placedPieceCount:
              pieceComplete
                ? totalInstances
                : placedPatterns.length,

            productionFeasible,

            upstreamEngineeringReady:
              solution.engineeringReady,

            source:
              `RC5-004 ${solution.kind}`,
          };
        });

      return rankProductionSafetyGateSolutions(
        safetyInputs,
        {
          targetUtilisationPercent: 90,

          minimumReleaseEngineeringScore:
            60,

          minimumReleaseConfidencePercent:
            70,

          /**
           * Step 2 connects real Grain Line, rotation and fabric-direction
           * checks (see rotationCompliance above), so every tri-state check
           * this call site can supply is now always explicitly true/false,
           * never left undefined. Requiring confirmed checks is therefore
           * safe and guards against a future call site silently omitting
           * one of these fields.
           */
          requireConfirmedSafetyChecks:
            true,

          lowUtilisationAdvisoryPercent:
            70,
        }
      );
    }, [
      markerCanvasSolutions,
      holeFillingResult,
      markerIsComplete,
      unplacedGroups,
      budgetExhaustedCount,
      totalInstances,
      placedPatterns.length,
      originalRotationCompliance,
      afterInsertionRotationCompliance,
    ]);

  const bestProductionSafetyResult =
    productionSafetyRanking
      .bestProductionSolution;

  const highestUtilisationSafetyResult =
    productionSafetyRanking
      .highestUtilisationCandidate;

  const selectedProductionSafetyResult =
    productionSafetyRanking
      .evaluated
      .find(
        (result) =>
          result.id ===
          selectedCanvasSolutionId
      ) ??
    null;
  const productionReleaseDecision =
    useMemo<ProductionReleaseDecisionResult>(() => {
      return createProductionReleaseDecision({
        safetyRanking:
          productionSafetyRanking,

        selectedSolutionId:
          selectedCanvasSolutionId,

        targetUtilisationPercent: 90,

        requireProductionSafetyRelease:
          true,
      });
    }, [
      productionSafetyRanking,
      selectedCanvasSolutionId,
    ]);
    /* ---------------- RC5-004-010 Safe Efficiency Recovery ---------------- */

  const safeEfficiencyRecoveryInput =
    useMemo<SafeRecoveryMarkerInput | null>(() => {
      const bestCombined =
        holeFillingResult?.bestSolution;

      if (
        !bestCombined ||
        bestCombined.placements.length === 0 ||
        bestCombined.finalMarkerLength <= 0 ||
        usableFabricWidthCm <= 0
      ) {
        return null;
      }

      const recoveryPlacements =
        bestCombined.placements
          .map((placement) => {
            const bounds =
              getEngineeringPolygonBounds(
                placement.polygon
              );

            if (!bounds) {
              return null;
            }

            return {
              id: placement.id,

              pieceId:
                placement.pieceId,

              pieceName:
                placement.pieceName,

              polygon:
                placement.polygon,

              x: bounds.minX,

              y: bounds.minY,

              rotation:
                placement.rotation,

              source:
                placement.source,
            };
          })
          .filter(
            (
              placement
            ): placement is NonNullable<
              typeof placement
            > =>
              placement !== null
          );

      if (
        recoveryPlacements.length === 0
      ) {
        return null;
      }

      /**
       * Recover the real pattern area represented by the
       * current high-efficiency combined marker.
       *
       * utilisation =
       * pattern area / marker area × 100
       */
      const recoveredPatternArea =
        (
          bestCombined.finalUtilisation /
          100
        ) *
        bestCombined.finalMarkerLength *
        usableFabricWidthCm;

      return {
        markerId:
          `${projectId}-safe-efficiency-recovery`,

        markerLength:
          bestCombined.finalMarkerLength,

        fabricWidth:
          usableFabricWidthCm,

        placements:
          recoveryPlacements,

        totalPatternArea:
          recoveredPatternArea,
      };
    }, [
      holeFillingResult,
      usableFabricWidthCm,
      projectId,
    ]);

  const safeEfficiencyRecoveryResult =
    useMemo<SafeEfficiencyRecoveryResult | null>(() => {
      if (
        !safeEfficiencyRecoveryInput
      ) {
        return null;
      }

      return runSafeEfficiencyRecovery(
        safeEfficiencyRecoveryInput,
        {
          collisionClearance:
            CUTTING_GAP_CM,

          markerBoundaryClearance:
            0,

          searchStep:
            0.5,

          maximumLengthMovement:
            safeEfficiencyRecoveryInput.markerLength,

          maximumWidthMovement:
            safeEfficiencyRecoveryInput.fabricWidth,

          maximumPasses:
            6,

          maximumCandidatesPerPlacement:
            1500,

          maximumSolutions:
            8,

          allowBoundaryContact:
            true,

          bidirectionalLengthSearch:
            true,

          localRepairFirst:
            true,

          minimumRecoveredUtilisation:
            70,

          targetUtilisationPercent:
            90,
        }
      );
    }, [
      safeEfficiencyRecoveryInput,
    ]);

      /* ---------------- RC5-004-011 Safe Dense Repacking ---------------- */

  const safeDenseRepackingInput =
  useMemo<SafeDenseRepackingInput | null>(() => {
    if (
      markerPatterns.length === 0 ||
      usableFabricWidthCm <= 0
    ) {
      return null;
    }

    const pieces =
      markerPatterns.flatMap((pattern) => {
        const vertices =
          pattern.polygon.vertices;

        if (
          !vertices ||
          vertices.length < 3
        ) {
          return [];
        }

        let minX =
          Number.POSITIVE_INFINITY;

        let minY =
          Number.POSITIVE_INFINITY;

        let maxX =
          Number.NEGATIVE_INFINITY;

        let maxY =
          Number.NEGATIVE_INFINITY;

        for (const vertex of vertices) {
          if (
            !Number.isFinite(vertex.x) ||
            !Number.isFinite(vertex.y)
          ) {
            return [];
          }

          minX =
            Math.min(
              minX,
              vertex.x
            );

          minY =
            Math.min(
              minY,
              vertex.y
            );

          maxX =
            Math.max(
              maxX,
              vertex.x
            );

          maxY =
            Math.max(
              maxY,
              vertex.y
            );
        }

        const sourceWidth =
          maxX - minX;

        const sourceHeight =
          maxY - minY;

        const widthCm =
          toFiniteNumber(
            pattern.dimensions?.widthCm
          );

        const heightCm =
          toFiniteNumber(
            pattern.dimensions?.heightCm
          );

        /**
         * Stored polygon coordinates originate from the
         * source image coordinate system.
         *
         * Safe Dense Repacking works in real engineering
         * centimetres, therefore the raw polygon must be
         * normalised and rescaled using the calibrated
         * physical pattern dimensions.
         *
         * Dense engine coordinate convention (canonicalised in Step 3C to
         * match the baseline/canvas engine — see
         * safeDenseRepackingEngine.ts's header comment):
         *
         * X = Usable Fabric Width
         * Y = Marker Length
         *
         * This is the SAME orientation the deterministic nesting engine and
         * this page's own canvas already use, so source axes map straight
         * through with no transpose:
         *
         * source horizontal extent -> Usable Fabric Width X
         * source vertical extent   -> Marker Length Y
         */
        if (
          sourceWidth <= 0 ||
          sourceHeight <= 0 ||
          widthCm <= 0 ||
          heightCm <= 0
        ) {
          return [];
        }

        const engineeringPolygon =
          vertices.map((vertex) => ({
            x:
              (
                (
                  vertex.x -
                  minX
                ) /
                sourceWidth
              ) *
              widthCm,

            y:
              (
                (
                  vertex.y -
                  minY
                ) /
                sourceHeight
              ) *
              heightCm,
          }));

        const instanceCount =
          resolveCutQuantity(pattern) *
          setsPerMarker;

        const allowedRotations =
          resolveAllowedRotations(
            pattern,
            fabricProfile
          );

        return Array.from(
          {
            length:
              instanceCount,
          },
          (_, index) => ({
            id:
              `${pattern.patternId}-dense-${index + 1}`,

            pieceId:
              pattern.patternId,

            pieceName:
              pattern.recognisedName,

            polygon:
              engineeringPolygon,

            allowedRotations,

            rotationLocked:
              allowedRotations.length ===
              1,

            /**
             * Previously omitted entirely, so safeDenseRepackingEngine's own
             * grain-rotation-lock check never engaged for this call site —
             * it relied solely on allowedRotations already being narrowed.
             * Both layers now agree, using the same real grainControlled
             * flag as the other call sites — now also composed with the
             * fabric's confirmed Grain Control setting (Step 4A).
             */
            grainLineLocked:
              pattern.constraints?.grainControlled === true ||
              fabricProfile.grainControl === "required",

            priority:
              Math.max(
                1,
                Math.round(
                  toFiniteNumber(
                    pattern.engineeringScore
                  )
                )
              ),
          })
        );
      });

    if (pieces.length === 0) {
      return null;
    }

    return {
      markerId:
        `${projectId}-safe-dense-repacking`,

      fabricWidth:
        usableFabricWidthCm,

      pieces,

      /** Step 4A: honour the factory's confirmed maximum length, when set. */
      maximumMarkerLength:
        optionalMaximumMarkerLengthCm > 0
          ? optionalMaximumMarkerLengthCm
          : undefined,
    };
  }, [
    markerPatterns,
    usableFabricWidthCm,
    setsPerMarker,
    projectId,
    fabricProfile,
    optionalMaximumMarkerLengthCm,
  ]);
      const safeDenseRepackingResult =
    useMemo<SafeDenseRepackingResult | null>(() => {
      if (!safeDenseRepackingInput) {
        return null;
      }

      return runSafeDenseRepacking(
        safeDenseRepackingInput,
        {
          cuttingGap:
            CUTTING_GAP_CM,

          boundaryClearance:
            0,

          searchStep:
            0.5,

          maximumCandidatesPerPiece:
            4000,

          maximumSolutions:
            6,

          targetUtilisationPercent:
            90,

          minimumEngineeringUtilisation:
  0,

            allowBoundaryContact:
    true,

  allowMarkerLengthGrowth:
    true,

  compactionPasses:
    3,

  evaluateRotations:
    true,

  anchorResolution:
    0.5,

  contourSamplesPerPiece:
    8,

  maximumAnchorsX:
    60,

  maximumAnchorsY:
    60,

  improvementRounds:
    2,

  improvementEjectCount:
    3,

  enforceGrainRotationLock:
    true,

  strategies: [
    "areaDescending",
    "lengthDescending",
    "widthDescending",
    "priorityFirst",
    "perimeterDescending",
    "compactHybrid",
  ],
        }
      );
    }, [
      safeDenseRepackingInput,
    ]);

      const safeDenseValidationRanking =
    useMemo<SafeDenseValidationRanking | null>(() => {
      if (
        !safeDenseRepackingResult ||
        !safeDenseRepackingInput
      ) {
        return null;
      }

      return validateSafeDenseProductionSolutions(
        safeDenseRepackingResult.solutions,
        safeDenseRepackingInput.pieces,
        safeDenseRepackingInput.fabricWidth,
        {
          requiredCuttingGap:
            CUTTING_GAP_CM,

          geometryTolerance:
            0.0001,

          boundaryClearance:
            0,

          targetUtilisationPercent:
            90,

          utilisationTolerancePercent:
            0.25,

          rejectUnknownPieces:
            true,
        }
      );
    }, [
      safeDenseRepackingResult,
      safeDenseRepackingInput,
    ]);

      const safeDenseValidationDiagnostics =
    useMemo<SafeDenseValidationDiagnosticSummary | null>(() => {
      if (!safeDenseValidationRanking) {
        return null;
      }

      return buildSafeDenseValidationDiagnostics(
        safeDenseValidationRanking
      );
    }, [
      safeDenseValidationRanking,
    ]);
    const selectedCanvasSolution =
    markerCanvasSolutions.find(
      (solution) =>
        solution.id ===
        selectedCanvasSolutionId
    ) ??
    markerCanvasSolutions[0] ??
    null;
  const selectedCanvasPlacements =
    useMemo<ReadonlyArray<SelectedCanvasPlacement>>(() => {
      const originalPlacementMap =
        new Map(
          placedPatterns.map((entry) => [
            entry.instanceId,
            entry,
          ])
        );

      /**
       * Original marker uses the existing deterministic nesting result.
       */
      if (
        !selectedCanvasSolution ||
        selectedCanvasSolution.kind ===
          "original" ||
        !holeFillingResult
      ) {
        return placedPatterns.map((entry) => ({
          id: entry.instanceId,

          pieceId: entry.instanceId,

          pieceName:
            entry.pattern.recognisedName,

          pattern: entry.pattern,

          left: entry.placement.x,

          top: entry.placement.y,

          width: entry.placement.width,

          height:
            entry.placement.height,

          rotation:
            entry.placement.rotation,

          source: "existing",

          engineeringScore:
            entry.pattern.engineeringScore,
        }));
      }

      let engineeringPlacements:
        ReadonlyArray<{
          readonly id: string;
          readonly pieceId: string;
          readonly pieceName?: string;
          readonly polygon: ReadonlyArray<{
            readonly x: number;
            readonly y: number;
          }>;
          readonly rotation: number;
          readonly source:
            | "existing"
            | "holeFilling";
        }> = [];

      if (
        selectedCanvasSolution.kind ===
        "holeFilled"
      ) {

          const selectedMarkerCanvasHeight =
    useMemo(() => {
      if (
        selectedCanvasPlacements.length ===
        0
      ) {
        return MINIMUM_CANVAS_HEIGHT;
      }

      const lowestEdge = Math.max(
        ...selectedCanvasPlacements.map(
          (placement) =>
            placement.top +
            placement.height
        )
      );

      return Math.max(
        MINIMUM_CANVAS_HEIGHT,
        Math.ceil(
          lowestEdge +
            CANVAS_BOTTOM_PADDING
        )
      );
    }, [selectedCanvasPlacements]);

  const selectedCanvasMinimumWidth =
    useMemo(() => {
      if (
        selectedCanvasPlacements.length ===
        0
      ) {
       return 760;
      }

      const rightmostEdge = Math.max(
        ...selectedCanvasPlacements.map(
          (placement) =>
            placement.left +
            placement.width
        )
      );

      Math.max(
  760,
        Math.ceil(
          rightmostEdge +
            CANVAS_PADDING
        )
      );
    }, [
      selectedCanvasPlacements,
      canvasMinimumWidth,
    ]);
        const originalPlacements =
          holeFillingCompactionInput
            ?.existingPlacements.map(
              (placement) => ({
                id: placement.id,

                pieceId:
                  placement.pieceId,

                pieceName:
                  placement.pieceName,

                polygon:
                  placement.polygon,

                rotation:
                  placement.rotation ?? 0,

                source:
                  "existing" as const,
              })
            ) ?? [];

        const insertedPlacements =
          holeFillingResult
            .collisionValidation
            .plan
            .placements.map(
              (placement) => ({
                id: placement.id,

                pieceId:
                  placement.pieceId,

                pieceName:
                  placement.pieceName,

                polygon:
                  placement.polygon,

                rotation:
                  placement.rotation,

                source:
                  "holeFilling" as const,
              })
            );

        engineeringPlacements = [
          ...originalPlacements,
          ...insertedPlacements,
        ];
      }

      if (
        selectedCanvasSolution.kind ===
        "compacted"
      ) {
        engineeringPlacements =
          holeFillingResult
            .compaction
            .bestSolution
            ?.placements.map(
              (placement) => ({
                id: placement.id,

                pieceId:
                  placement.pieceId,

                pieceName:
                  placement.pieceName,

                polygon:
                  placement.polygon,

                rotation:
                  placement.rotation,

                source:
                  originalPlacementMap.has(
                    placement.id
                  )
                    ? "existing"
                    : "holeFilling",
              })
            ) ?? [];
      }

      if (
        selectedCanvasSolution.kind ===
        "combined"
      ) {
        engineeringPlacements =
          holeFillingResult
            .bestSolution
            ?.placements.map(
              (placement) => ({
                id: placement.id,

                pieceId:
                  placement.pieceId,

                pieceName:
                  placement.pieceName,

                polygon:
                  placement.polygon,

                rotation:
                  placement.rotation,

                source:
                  placement.source,
              })
            ) ?? [];
      }

      return engineeringPlacements
        .map((placement) => {
          const bounds =
            getEngineeringPolygonBounds(
              placement.polygon
            );

          if (!bounds) {
            return null;
          }

          const originalEntry =
            originalPlacementMap.get(
              placement.id
            );

          const matchingPattern =
            originalEntry?.pattern ??
            markerPatterns.find(
              (pattern) =>
                pattern.patternId ===
                  placement.pieceId ||
                pattern.recognisedName ===
                  placement.pieceName
            ) ??
            null;

          /**
           * Engineering coordinates:
           * - X = Marker Length
           * - Y = Fabric Width
           *
           * Canvas coordinates:
           * - top = Marker Length
           * - left = Fabric Width
           */
          const left =
            bounds.minY *
              CANVAS_PIXELS_PER_CM +
            CANVAS_PADDING;

          const top =
            bounds.minX *
              CANVAS_PIXELS_PER_CM +
            CANVAS_HEADER_HEIGHT;

          const width =
            Math.max(
              MINIMUM_PIECE_WIDTH,
              (
                bounds.maxY -
                bounds.minY
              ) *
                CANVAS_PIXELS_PER_CM
            );

          const height =
            Math.max(
              MINIMUM_PIECE_HEIGHT,
              (
                bounds.maxX -
                bounds.minX
              ) *
                CANVAS_PIXELS_PER_CM
            );

          const holeFillingPlacement =
            holeFillingResult
              .collisionValidation
              .plan
              .placements.find(
                (candidate) =>
                  candidate.id ===
                  placement.id
              );

          return {
            id: placement.id,

            pieceId:
              placement.pieceId,

            pieceName:
              placement.pieceName ??
              matchingPattern
                ?.recognisedName ??
              placement.pieceId,

            pattern:
              matchingPattern,

            left,

            top,

            width,

            height,

            rotation:
              placement.rotation,

            source:
              placement.source,

            engineeringScore:
              holeFillingPlacement
                ?.engineeringScore ??
              matchingPattern
                ?.engineeringScore ??
              selectedCanvasSolution
                .engineeringScore,
          };
        })
        .filter(
          (
            placement
          ): placement is SelectedCanvasPlacement =>
            placement !== null
        );
    }, [
      selectedCanvasSolution,
      placedPatterns,
      markerPatterns,
      holeFillingResult,
      holeFillingCompactionInput,
    ]);

      const selectedMarkerCanvasHeight =
    useMemo(() => {
      if (
        selectedCanvasPlacements.length === 0
      ) {
        return MINIMUM_CANVAS_HEIGHT;
      }

      const lowestEdge = Math.max(
        ...selectedCanvasPlacements.map(
          (placement) =>
            placement.top +
            placement.height
        )
      );

      return Math.max(
        MINIMUM_CANVAS_HEIGHT,
        Math.ceil(
          lowestEdge +
            CANVAS_BOTTOM_PADDING
        )
      );
    }, [selectedCanvasPlacements]);

  const selectedCanvasMinimumWidth =
    useMemo(() => {
      if (
        selectedCanvasPlacements.length === 0
      ) {
        return 760;
      }

      const rightmostEdge = Math.max(
        ...selectedCanvasPlacements.map(
          (placement) =>
            placement.left +
            placement.width
        )
      );

      return Math.max(
        760,
        Math.ceil(
          rightmostEdge +
            CANVAS_PADDING
        )
      );
    }, [selectedCanvasPlacements]);

  const maximumSafeAnalysisQuantity =
    calculateMaximumSafeGarments(
      Math.max(1, piecesPerGarment),
      MAXIMUM_NESTING_INSTANCES
    );

  const requestedMaximumAnalysisQuantity =
    Math.max(
      1,
      Math.floor(
        Number(maximumAnalysisQuantityInput) ||
          maximumSafeAnalysisQuantity
      )
    );

  const preferredFastQuantities = useMemo(() => {
    const values = [
      1,
      2,
      4,
      6,
      8,
      10,
      12,
      setsPerMarker,
      requestedMaximumAnalysisQuantity,
    ];

    return Array.from(
      new Set(
        values.filter(
          (quantity) =>
            quantity >= 1 &&
            quantity <= requestedMaximumAnalysisQuantity
        )
      )
    ).sort((first, second) => first - second);
  }, [setsPerMarker, requestedMaximumAnalysisQuantity]);

  const analysisCandidateBudget =
    searchMode === "maximum"
      ? 6500
      : searchMode === "fast"
        ? 2500
        : CANDIDATE_TESTS_PER_PIECE;

  async function runOptimumQuantityAnalysis() {
    if (
      batchRunning ||
      markerPatterns.length === 0 ||
      usableFabricWidthCm <= 0 ||
      piecesPerGarment <= 0
    ) {
      return;
    }

    setBatchRunning(true);
    setBatchError("");
    setBatchResult(null);
    setBatchProgress(null);

    try {
      const plan =
        createMarkerQuantityPlan({
          minimumGarments: 1,

          maximumGarments:
            requestedMaximumAnalysisQuantity,

          requestedGarments:
            setsPerMarker,

          piecesPerGarment,

          maximumNestingInstances:
            MAXIMUM_NESTING_INSTANCES,

          includeEveryQuantity:
            searchMode !== "fast",

          preferredQuantities:
            searchMode === "fast"
              ? preferredFastQuantities
              : undefined,
        });

      const batchPatterns:
        MarkerBatchSourcePattern[] =
        markerPatterns.map(
          (pattern) => ({
            id: pattern.patternId,

            width: Math.max(
              toFiniteNumber(
                pattern.dimensions.widthCm
              ) *
                CANVAS_PIXELS_PER_CM,
              MINIMUM_PIECE_WIDTH
            ),

            height: Math.max(
              toFiniteNumber(
                pattern.dimensions.heightCm
              ) *
                CANVAS_PIXELS_PER_CM,
              MINIMUM_PIECE_HEIGHT
            ),

            vertices:
              pattern.polygon.vertices,

            cutQuantity:
              resolveCutQuantity(pattern),

            allowedRotations:
              resolveAllowedRotations(pattern, fabricProfile),
          })
        );

      const result =
        await solveMarkerQuantitiesSequentially({
          quantities:
            plan.quantities,

          patterns:
            batchPatterns,

          usableFabricWidthCm,

          totalPatternAreaPerGarmentCm2:
            areaPerGarmentCm2,

          expectedPiecesPerGarment:
            piecesPerGarment,

          canvasPixelsPerCm:
            CANVAS_PIXELS_PER_CM,

          horizontalGapPixels:
            HORIZONTAL_GAP,

          verticalGapPixels:
            VERTICAL_GAP,

          maximumMarkerHeightPixels:
            100000,

          maximumCandidateTestsPerPiece:
            analysisCandidateBudget,

          spatialBandHeight:
            SPATIAL_BAND_HEIGHT,

          maximumMarkerLengthCm:
            optionalMaximumMarkerLengthCm > 0
              ? optionalMaximumMarkerLengthCm
              : null,

          orderQuantity:
            orderQuantity > 0
              ? orderQuantity
              : null,

          onProgress:
            setBatchProgress,
        });

      setBatchResult(result);
    } catch (error) {
      console.error(
        "Unable to analyse marker quantities:",
        error
      );

      setBatchError(
        error instanceof Error
          ? error.message
          : "The marker quantity analysis could not be completed."
      );
    } finally {
      setBatchRunning(false);
    }
  }

    async function runHoleFillingAndCompaction() {
    if (
      holeFillingRunning ||
      !holeFillingCompactionInput
    ) {
      return;
    }

    setHoleFillingRunning(true);
    setHoleFillingError("");
    setHoleFillingResult(null);
    setSelectedCanvasSolutionId(
      "original-marker"
    );

    try {
      /**
       * Yield once so React can display the running state
       * before the synchronous engineering workflow begins.
       */
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });

      const result =
        runHoleFillingCompaction(
          holeFillingCompactionInput
        );

      setHoleFillingResult(result);

      if (result.bestSolution) {
        setSelectedCanvasSolutionId(
          "combined-marker"
        );
      }
    } catch (error) {
      console.error(
        "Unable to run Hole Filling and Intelligent Compaction:",
        error
      );

      setHoleFillingError(
        error instanceof Error
          ? error.message
          : "Hole Filling and Intelligent Compaction could not be completed."
      );
    } finally {
      setHoleFillingRunning(false);
    }
  }

  /* -------------------------------- States ------------------------------- */

  if (projectLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-8">
            <p className="font-black text-cyan-300">
              Loading AI Marker Engineering...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (projectError || !project) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-red-500/30 bg-red-950/20 p-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-red-300">
              Marker Project Error
            </p>

            <h1 className="mt-3 text-3xl font-black">Project unavailable</h1>

            <p className="mt-4 leading-7 text-red-100">
              {projectError || "The project could not be loaded."}
            </p>

            <Link
              href={`/optifabric/project/${projectId}`}
              className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950"
            >
              Return to Project
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const projectName = project.projectName ?? project.name ?? project.id;

  const currencySymbol = project.fabricCost
    ? formatCurrency(project.fabricCost.currency)
    : null;

  const canvasMinimumWidth = Math.max(
    760,
    Math.ceil(
      (Number.isFinite(usableFabricWidthCm) ? usableFabricWidthCm : 0) *
        CANVAS_PIXELS_PER_CM +
        CANVAS_PADDING * 2
    )
  );

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-violet-950/30 p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Module 04 · RC6-005A
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                AI Marker Engineering
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
                Apply usable roll width, edge exclusions, roll allowances and marker constraints before calculating production fabric consumption.
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-3">
              <div
                className="flex overflow-hidden rounded-xl border border-slate-600 bg-slate-900/70"
                role="group"
                aria-label="Production interface language"
              >
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-3 text-sm font-black transition ${
                    language === "en"
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "text-slate-400 hover:text-cyan-300"
                  }`}
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  className={`px-4 py-3 text-sm font-black transition ${
                    language === "bn"
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "text-slate-400 hover:text-cyan-300"
                  }`}
                >
                  বাংলা
                </button>
              </div>

              <Link
                href={`/optifabric/project/${projectId}/geometry`}
                className="rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-3 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Project Geometry
              </Link>

              <Link
                href={`/optifabric/project/${projectId}/batch`}
                className="rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-3 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Batch Engineering
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MarkerStat label="Project" value={projectName} />

          <MarkerStat
            label={lang.term("uniquePatternDefinitions")}
            value={String(markerPatterns.length)}
          />

          <MarkerStat
            label="Pieces / Garment"
            value={String(piecesPerGarment)}
          />

          <MarkerStat
            label={lang.term("totalPiecesRequired")}
            value={String(totalInstances)}
          />

          <MarkerStat
            label={lang.term("totalPiecesPlaced")}
            value={String(productionMarkerResult.placedCount)}
          />

          <MarkerStat
            label="Fabric Cost"
            value={
              project.fabricCost && currencySymbol
                ? `${currencySymbol}${formatNumber(
                    project.fabricCost.costPerMetre,
                    4
                  )}/m`
                : "Not saved"
            }
          />

          <MarkerStat
            label="Cutting Gap"
            value={`${formatNumber(CUTTING_GAP_CM, 1)} cm`}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)_380px]">
          <aside className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
              Pattern Queue
            </p>

            <h2 className="mt-2 text-2xl font-black">Marker-Ready Pieces</h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Approved geometry waiting for automatic marker placement.
            </p>

            <div className="mt-5 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {markerPatterns.length > 0 ? (
                markerPatterns.map((pattern, index) => (
                  <PatternQueueItem
                    key={pattern.patternId}
                    pattern={pattern}
                    index={index + 1}
                    setsPerMarker={setsPerMarker}
                    fabricProfile={fabricProfile}
                    lang={lang}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4">
                  <p className="font-bold leading-6 text-amber-200">
                    No approved geometry has reached Module 04 yet.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                  Marker Canvas
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Engineering Placement Area
                </h2>
              </div>

              <span
                className={`rounded-full border px-4 py-2 text-xs font-black ${
                  markerIsComplete
                    ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
                    : "border-amber-400/30 bg-amber-950/20 text-amber-300"
                }`}
              >
                {markerIsComplete
                  ? "Placement Validated"
                  : "Placement Exceptions"}
              </span>
            </div>

            {/* ======================================================================
             * Step 4A — Fabric Type + Fabric Production Constraints
             * ================================================================== */}

            <section className="mt-5 rounded-2xl border border-violet-500/20 bg-slate-950/40 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                    {lang.term("fabric")}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {lang.message("fabricTypeHelperText", MARKER_PRODUCTION_MESSAGES)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!fabricProfileSaved ? (
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200">
                      {lang.term("unsaved")}
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={saveFabricProfile}
                    disabled={!project || fabricProfileSaving}
                    className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-black text-violet-100 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fabricProfileSaving
                      ? "Saving..."
                      : lang.term("saveFabricProfile")}
                  </button>
                </div>
              </div>

              {!isServerBackedProject ? (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  This project is local-only — the fabric profile saves to
                  this browser, same as before, but not to your account.
                </p>
              ) : null}

              {fabricProfileLoadError ? (
                <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm font-bold text-amber-200">
                  Could not load your saved fabric profile:{" "}
                  {fabricProfileLoadError}. Using the current local values
                  instead.
                </p>
              ) : null}

              {fabricProfileSaveError ? (
                <p className="mt-3 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm font-bold text-red-200">
                  Save failed: {fabricProfileSaveError}
                </p>
              ) : null}

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <FabricSelectField
                  label={lang.term("fabricType")}
                  value={fabricProfile.fabricType}
                  options={translatedOptions("fabricType", FABRIC_TYPES)}
                  onChange={applyFabricTypeDefaults}
                />

                <div className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("fabricConstruction")}
                  </span>

                  <div className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white">
                    {fabricProfile.construction === "woven"
                      ? lang.term("constructionWoven")
                      : fabricProfile.construction === "knit"
                        ? lang.term("constructionKnit")
                        : lang.term("constructionOther")}
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                {lang.term("productionConstraints")}
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FabricSelectField
                  label={lang.term("grainControl")}
                  value={fabricProfile.grainControl}
                  options={translatedOptions("grainControl", GRAIN_CONTROL_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ grainControl: value })}
                />

                <FabricSelectField
                  label={lang.term("faceDirection")}
                  value={fabricProfile.faceDirection}
                  options={translatedOptions("faceDirection", FACE_DIRECTION_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ faceDirection: value })}
                />

                <FabricSelectField
                  label={lang.term("nap")}
                  value={fabricProfile.nap}
                  options={translatedOptions("nap", NAP_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ nap: value })}
                />

                <FabricSelectField
                  label={lang.term("directionalFabric")}
                  value={fabricProfile.directionalFabric}
                  options={translatedOptions("directionalFabric", DIRECTIONAL_FABRIC_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ directionalFabric: value })}
                />

                <FabricSelectField
                  label={lang.term("allowableRotation")}
                  value={fabricProfile.allowableRotation}
                  options={translatedOptions("allowableRotation", ALLOWABLE_ROTATION_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ allowableRotation: value })}
                />

                <FabricSelectField
                  label={lang.term("stretch")}
                  value={fabricProfile.stretch}
                  options={translatedOptions("stretch", STRETCH_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ stretch: value })}
                />

                <NumberField
                  label={`${lang.term("lengthWarpShrinkage")} (%)`}
                  value={String(fabricProfile.lengthWarpShrinkagePercent ?? "")}
                  onChange={(value) =>
                    updateFabricProfile({
                      lengthWarpShrinkagePercent: value === "" ? undefined : Number(value),
                    })
                  }
                  min="0"
                  step="0.1"
                />

                <NumberField
                  label={`${lang.term("widthWeftShrinkage")} (%)`}
                  value={String(fabricProfile.widthWeftShrinkagePercent ?? "")}
                  onChange={(value) =>
                    updateFabricProfile({
                      widthWeftShrinkagePercent: value === "" ? undefined : Number(value),
                    })
                  }
                  min="0"
                  step="0.1"
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-amber-200/80">
                {lang.message("shrinkageDisclaimer", MARKER_PRODUCTION_MESSAGES)}
              </p>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                {lang.term("matchingRequirement")}
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FabricSelectField
                  label={lang.term("matchingRequirement")}
                  value={fabricProfile.matchingRequirement}
                  options={translatedOptions("matchingRequirement", MATCHING_REQUIREMENT_OPTIONS)}
                  onChange={(value) => updateFabricProfile({ matchingRequirement: value })}
                />

                {fabricProfile.matchingRequirement !== "none" ? (
                  <>
                    <NumberField
                      label={`${lang.term("horizontalRepeat")} (${fabricProfile.repeatUnit ?? "cm"})`}
                      value={String(fabricProfile.horizontalRepeat ?? "")}
                      onChange={(value) =>
                        updateFabricProfile({
                          horizontalRepeat: value === "" ? undefined : Number(value),
                        })
                      }
                      min="0"
                      step="0.1"
                    />

                    <NumberField
                      label={`${lang.term("verticalRepeat")} (${fabricProfile.repeatUnit ?? "cm"})`}
                      value={String(fabricProfile.verticalRepeat ?? "")}
                      onChange={(value) =>
                        updateFabricProfile({
                          verticalRepeat: value === "" ? undefined : Number(value),
                        })
                      }
                      min="0"
                      step="0.1"
                    />

                    <FabricSelectField
                      label={lang.term("repeatUnit")}
                      value={fabricProfile.repeatUnit ?? "cm"}
                      options={[
                        { value: "cm", label: lang.term("centimetres") },
                        { value: "in", label: lang.term("inches") },
                      ]}
                      onChange={(value) => updateFabricProfile({ repeatUnit: value })}
                    />
                  </>
                ) : null}
              </div>

              {fabricProfile.matchingRequirement !== "none" ? (
                <p className="mt-3 text-xs leading-5 text-amber-200/80">
                  {lang.message("matchingDisclaimer", MARKER_PRODUCTION_MESSAGES)}
                </p>
              ) : null}
            </section>

            {/* ======================================================================
             * Step 4C §2, §3, §8 — fabric confirmation status, the
             * conservative-assumption warning, and an ENFORCED / STORED /
             * ADVISORY summary. Reads the same FabricProfile state as the
             * panel above; introduces no parallel data model or recomputed
             * rotation logic.
             * ================================================================== */}

            <section className="mt-5 rounded-2xl border border-fuchsia-500/20 bg-slate-950/40 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
                {lang.term("fabricConfirmationStatus")}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {lang.message("fabricConfirmationIntro", MARKER_PRODUCTION_MESSAGES)}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: lang.term("grainControl"),
                    confirmed: fabricProfile.grainControl !== "custom",
                  },
                  {
                    label: lang.term("faceDirection"),
                    confirmed: fabricProfile.faceDirection !== "custom",
                  },
                  {
                    label: lang.term("nap"),
                    confirmed: fabricProfile.nap !== "unknown",
                  },
                  {
                    label: lang.term("directionalFabric"),
                    confirmed:
                      fabricProfile.directionalFabric !== "requiresConfirmation",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                      {field.label}
                    </p>

                    <p
                      className={`mt-1 text-xs font-black uppercase ${
                        field.confirmed ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      {field.confirmed ? lang.term("confirmed") : lang.term("requiresConfirmation")}
                    </p>
                  </div>
                ))}
              </div>

              {fabricProfile.nap === "unknown" ||
              fabricProfile.directionalFabric === "requiresConfirmation" ? (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm leading-6 text-amber-100">
                  <p className="font-black uppercase tracking-wide text-amber-300">
                    {lang.term("conservativeAssumptionActive")}
                  </p>

                  <p className="mt-1">
                    {fabricProfile.nap === "unknown"
                      ? `${lang.message("conservativeAssumptionNap", MARKER_PRODUCTION_MESSAGES)} `
                      : ""}
                    {fabricProfile.directionalFabric === "requiresConfirmation"
                      ? `${lang.message("conservativeAssumptionDirectional", MARKER_PRODUCTION_MESSAGES)} `
                      : ""}
                    {lang.message("conservativeAssumptionFooter", MARKER_PRODUCTION_MESSAGES)}
                  </p>
                </div>
              ) : null}

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
                {lang.term("fabricProfileSummary")}
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-[10px] font-black uppercase tracking-wide text-slate-500">
                      <th className="border-b border-slate-700 pb-2">Field</th>
                      <th className="border-b border-slate-700 pb-2">Value</th>
                      <th className="border-b border-slate-700 pb-2">Status</th>
                    </tr>
                  </thead>

                  <tbody className="text-slate-200">
                    {fabricProfileSummaryRows.map((row) => (
                      <tr key={row.field}>
                        <td className="border-b border-slate-800 py-2 font-bold">
                          {row.field}
                        </td>

                        <td className="border-b border-slate-800 py-2">
                          {row.value}
                        </td>

                        <td
                          className={`border-b border-slate-800 py-2 text-xs font-black uppercase ${row.statusClass}`}
                        >
                          {row.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    {lang.term("fabricRollIntelligence")}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {lang.message("fabricRollIntelligenceNote", MARKER_PRODUCTION_MESSAGES)}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-right">
                  <p className="text-[10px] font-black uppercase tracking-wide text-emerald-400">
                    {lang.term("usableMarkerWidth")}
                  </p>

                  <p className="mt-1 text-xl font-black text-emerald-200">
                    {formatNumber(
                      centimetresToWidthUnit(
                        usableFabricWidthCm,
                        fabricWidthUnit
                      ),
                      2
                    )}{" "}
                    {fabricWidthUnit}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatNumber(usableFabricWidthCm, 2)} {lang.term("cmInternal")}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("widthUnit")}
                  </span>

                  <select
                    value={fabricWidthUnit}
                    onChange={(event) => {
                      const nextUnit = event.target.value as FabricWidthUnit;

                      setFabricWidthUnit(nextUnit);
                      setNominalWidthOption(nextUnit === "cm" ? "152.4" : "60");
                      setCustomNominalWidth(nextUnit === "cm" ? "152.4" : "60");
                      setLeftEdgeExclusion(nextUnit === "cm" ? "2" : "0.75");
                      setRightEdgeExclusion(nextUnit === "cm" ? "2" : "0.75");
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="cm">{lang.term("centimetres")}</option>
                    <option value="in">{lang.term("inches")}</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("nominalRollWidth")}
                  </span>

                  <select
                    value={nominalWidthOption}
                    onChange={(event) => setNominalWidthOption(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                  >
                    {standardWidthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}

                    <option value="custom">{lang.term("customWidth")}</option>
                  </select>
                </label>

                {nominalWidthOption === "custom" ? (
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {lang.term("customWidth")} ({fabricWidthUnit})
                    </span>

                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={customNominalWidth}
                      onChange={(event) =>
                        setCustomNominalWidth(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>
                ) : null}

                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("leftEdgeExclusion")} ({fabricWidthUnit})
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={leftEdgeExclusion}
                    onChange={(event) =>
                      setLeftEdgeExclusion(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("rightEdgeExclusion")} ({fabricWidthUnit})
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rightEdgeExclusion}
                    onChange={(event) =>
                      setRightEdgeExclusion(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                  />
                </label>
              </div>

              {usableFabricWidthCm <= 0 ? (
                <p className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm font-bold text-red-200">
                  {lang.message("edgeExclusionError", MARKER_PRODUCTION_MESSAGES)}
                </p>
              ) : null}

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("garmentsPerMarker")}
                  </span>

                  <input
                    type="number"
                    min="1"
                    max={MAXIMUM_SETS_PER_MARKER}
                    step="1"
                    value={setsPerMarkerInput}
                    onChange={(event) =>
                      setSetsPerMarkerInput(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                  />

                  <div className="mt-2 flex flex-wrap gap-2">
                    {[4, 8, 12, 24].map((quantity) => (
                      <button
                        key={quantity}
                        type="button"
                        onClick={() => setSetsPerMarkerInput(String(quantity))}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
                      >
                        {quantity}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("maximumCuttingTableMarkerLength")}
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder={lang.term("noLimitNotSpecified")}
                    value={maximumMarkerLengthMetres}
                    onChange={(event) =>
                      setMaximumMarkerLengthMetres(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
                  />

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setMaximumMarkerLengthMetres("")}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
                    >
                      {lang.term("noLimitButton")}
                    </button>

                    {[10, 15, 20, 25, 30, 40, 50].map((metres) => (
                      <button
                        key={metres}
                        type="button"
                        onClick={() => setMaximumMarkerLengthMetres(String(metres))}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
                      >
                        {metres} m
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {lang.message("maximumTableLengthHelper", MARKER_PRODUCTION_MESSAGES)}
                  </p>
                </label>

                <div className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("patternPiecesPlaced")} / {lang.term("patternPiecesRequired")}
                  </span>

                  <div className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white">
                    {productionMarkerResult.placedCount} / {productionMarkerResult.expectedCount}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {markerPatterns.length} unique pattern definition
                    {markerPatterns.length === 1 ? "" : "s"}, cut to{" "}
                    {productionMarkerResult.expectedCount} total physical
                    pieces across {setsPerMarker} garment
                    {setsPerMarker === 1 ? "" : "s"} in this marker.
                  </p>
                </div>

                <div className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("calculatedMarkerLength")}
                  </span>

                  <div className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-3 font-black text-emerald-300">
                    {productionMarkerResult.markerLengthCm > 0
                      ? `${formatNumber(productionMarkerResult.markerLengthCm / 100, 3)} m`
                      : lang.term("awaitingPlacement")}
                  </div>
                </div>

                <div className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("edgeWidthLoss")}
                  </span>

                  <div className="mt-2 w-full rounded-xl border border-amber-500/30 bg-slate-950 px-4 py-3 font-black text-amber-300">
                    {formatNumber(edgeWidthLossPercent, 2)}%
                  </div>
                </div>
              </div>

              <section className="mt-5 rounded-2xl border border-violet-500/30 bg-violet-950/10 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                      AI Optimum Quantity Analysis
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                      OptiFabric will sequentially generate and compare every safe
                      marker quantity from 1 through the selected maximum.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[170px_170px_auto]">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                        Search Mode
                      </span>

                      <select
                        value={searchMode}
                        onChange={(event) =>
                          setSearchMode(
                            event.target.value as MarkerSearchMode
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-violet-400"
                      >
                        <option value="fast">Fast Engineering</option>
                        <option value="standard">Standard Analysis</option>
                        <option value="maximum">Maximum Search</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                        Analyse Up To
                      </span>

                      <input
                        type="number"
                        min="1"
                        max={maximumSafeAnalysisQuantity}
                        step="1"
                        value={maximumAnalysisQuantityInput}
                        onChange={(event) =>
                          setMaximumAnalysisQuantityInput(
                            event.target.value
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-violet-400"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={runOptimumQuantityAnalysis}
                      disabled={
                        batchRunning ||
                        markerPatterns.length === 0 ||
                        usableFabricWidthCm <= 0
                      }
                      className="rounded-xl bg-violet-400 px-5 py-3 font-black text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {batchRunning
                        ? "Analysing Marker Quantities..."
                        : "Analyse All Safe Quantities"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MarkerMetric
                    label="Search Strategy"
                    value={
                      searchMode === "fast"
                        ? "Preferred quantities"
                        : searchMode === "maximum"
                          ? "Deep sequential search"
                          : "Every safe quantity"
                    }
                  />

                  <MarkerMetric
                    label="Browser-Safe Maximum"
                    value={`${maximumSafeAnalysisQuantity} garments`}
                  />

                  <MarkerMetric
                    label="Requested Marker"
                    value={`${setsPerMarker} garments`}
                  />

                  <MarkerMetric
                    label="Solutions Analysed"
                    value={String(
                      batchResult?.results.length ??
                        0
                    )}
                  />
                </div>

                {batchProgress ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wide">
                      <span className="text-slate-400">
                        {batchRunning
                          ? `Analysing ${batchProgress.activeQuantity} garments`
                          : "Analysis completed"}
                      </span>

                      <span className="text-violet-300">
                        {formatNumber(
                          batchProgress.progressPercent,
                          0
                        )}
                        %
                      </span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-violet-400 transition-all"
                        style={{
                          width: `${batchProgress.progressPercent}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null}

                {batchError ? (
                  <p className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm font-bold text-red-200">
                    {batchError}
                  </p>
                ) : null}
              </section>

              {/* Step 4C §10 — width/length/table shown together with an
                  explicit FITS TABLE / EXCEEDS TABLE / no-limit-set status,
                  always visible (not only on conflict). */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MarkerStat
                  label={lang.term("usableFabricWidth")}
                  value={`${formatNumber(
                    centimetresToWidthUnit(usableFabricWidthCm, fabricWidthUnit),
                    2
                  )} ${fabricWidthUnit}`}
                />

                <MarkerStat
                  label={lang.term("calculatedMarkerLength")}
                  value={
                    productionMarkerResult.markerLengthCm > 0
                      ? `${formatNumber(productionMarkerResult.markerLengthCm / 100, 3)} m`
                      : lang.term("awaitingPlacement")
                  }
                />

                <MarkerStat
                  label={lang.term("maximumCuttingTableLength")}
                  value={
                    optionalMaximumMarkerLengthCm > 0
                      ? `${formatNumber(optionalMaximumMarkerLengthCm / 100, 3)} m`
                      : lang.term("notSpecified")
                  }
                />

                <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {lang.term("tableStatus")}
                  </p>

                  <p
                    className={`mt-2 text-lg font-black ${
                      optionalMaximumMarkerLengthCm <= 0
                        ? "text-slate-400"
                        : cuttingTableLengthConflict
                          ? "text-red-300"
                          : "text-emerald-300"
                    }`}
                  >
                    {optionalMaximumMarkerLengthCm <= 0
                      ? lang.term("noLimitSet")
                      : cuttingTableLengthConflict
                        ? lang.term("exceedsTable")
                        : lang.term("fitsTable")}
                  </p>
                </div>
              </div>

              {cuttingTableLengthConflict ? (
                <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
                  <p className="font-black uppercase tracking-wide text-amber-200">
                    {lang.term("markerExceedsTableLength")}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-100/80">
                    {lang.message("markerExceedsTableLengthBody", MARKER_PRODUCTION_MESSAGES)}
                  </p>

                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-amber-100/90 sm:grid-cols-4">
                    <dt className="text-amber-300/70">{lang.term("requiredMarkerLength")}</dt>
                    <dd className="font-bold">
                      {formatNumber(cuttingTableLengthConflict.requiredMarkerLengthCm / 100, 3)} m
                    </dd>

                    <dt className="text-amber-300/70">{lang.term("availableTableLength")}</dt>
                    <dd className="font-bold">
                      {formatNumber(cuttingTableLengthConflict.availableTableLengthCm / 100, 3)} m
                    </dd>

                    <dt className="text-amber-300/70">{lang.term("difference")}</dt>
                    <dd className="font-bold">
                      {formatNumber(cuttingTableLengthConflict.differenceCm / 100, 3)} m
                    </dd>

                    <dt className="text-amber-300/70">{lang.term("requiredPieces")}</dt>
                    <dd className="font-bold">{cuttingTableLengthConflict.pieceCount}</dd>

                    <dt className="text-amber-300/70">{lang.term("placedPieces")}</dt>
                    <dd className="font-bold">{productionMarkerResult.placedCount}</dd>

                    <dt className="text-amber-300/70">{lang.term("fabricWidth")}</dt>
                    <dd className="font-bold">
                      {formatNumber(cuttingTableLengthConflict.fabricWidthCm, 1)} cm
                    </dd>
                  </dl>
                </div>
              ) : null}
            </section>

            {nestingRefused ? (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-950/20 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-red-300">
                  Nest Refused
                </p>

                <p className="mt-2 text-sm font-bold leading-6 text-red-100">
                  {totalInstances} pieces exceeds the{" "}
                  {MAXIMUM_NESTING_INSTANCES}-piece limit for browser
                  nesting. Reduce the garments per marker.
                </p>

                <p className="mt-2 text-sm leading-6 text-red-200/80">
                  Nesting runs on the page&apos;s main thread, so a larger
                  nest would stop the tab responding. Moving this work to a
                  web worker or the server is the proper fix for full
                  production markers.
                </p>
              </div>
            ) : null}

            <section className="mt-6 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-950/10 p-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
                    RC5-004 · Hole Filling &amp; Intelligent Compaction
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    Multi-Solution Marker Optimisation
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Analyse current marker voids, test compatible pieces,
                    validate collision-safe placements and compact the final
                    layout without changing the original marker.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={runHoleFillingAndCompaction}
                  disabled={
                    holeFillingRunning ||
                    !holeFillingCompactionInput ||
                    placedPatterns.length === 0
                  }
                  className="rounded-xl bg-fuchsia-400 px-5 py-3 font-black text-slate-950 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {holeFillingRunning
                    ? "Optimising Marker..."
                    : "Run Hole Filling & Compaction"}
                </button>
              </div>

              {!holeFillingCompactionInput ? (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3">
                  <p className="text-sm font-bold text-amber-200">
                    A valid completed marker is required before RC5-004
                    optimisation can run.
                  </p>
                </div>
              ) : null}

              {holeFillingError ? (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3">
                  <p className="text-sm font-bold text-red-200">
                    {holeFillingError}
                  </p>
                </div>
              ) : null}

              {holeFillingResult ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <MarkerMetric
                    label="Detected Voids"
                    value={String(
                      holeFillingResult.statistics.detectedVoidCount
                    )}
                  />

                  <MarkerMetric
                    label="Compatible Fits"
                    value={String(
                      holeFillingResult.statistics
                        .compatibilityCandidateCount
                    )}
                  />

                  <MarkerMetric
                    label="Collision-Safe"
                    value={String(
                      holeFillingResult.statistics
                        .collisionSafePlacementCount
                    )}
                  />

                  <MarkerMetric
                    label="Final Solutions"
                    value={String(
                      holeFillingResult.statistics.finalSolutionCount
                    )}
                  />

                  <MarkerMetric
                    label="Best Score"
                    value={formatNumber(
                      holeFillingResult.statistics
                        .bestCombinedEngineeringScore,
                      2
                    )}
                  />
                  <MarkerMetric
  label="Recovery Solutions"
  value={String(
    safeEfficiencyRecoveryResult
      ?.statistics
      .recoveredSolutionCount ??
      0
  )}
/>

<MarkerMetric
  label="Recovered Utilisation"
  value={
    safeEfficiencyRecoveryResult
      ?.bestSolution
      ? `${formatNumber(
          safeEfficiencyRecoveryResult
            .bestSolution
            .utilisationPercent,
          2
        )}%`
      : "—"
  }
/>

<MarkerMetric
  label="Recovery Status"
  value={
    safeEfficiencyRecoveryResult
      ?.bestSolution
      ?.engineeringReady
      ? "Engineering Ready"
      : safeEfficiencyRecoveryResult
            ?.bestSolution
        ? "Review Required"
        : "No Recovery"
  }
/>
<MarkerMetric
  label="Dense Solutions"
  value={String(
    safeDenseRepackingResult
      ?.statistics
      .generatedSolutionCount ??
      0
  )}
/>

<MarkerMetric
  label="Best Safe Utilisation"
  value={
    safeDenseRepackingResult
      ?.bestSolution
      ? `${formatNumber(
          safeDenseRepackingResult
            .bestSolution
            .utilisationPercent,
          2
        )}%`
      : "—"
  }
/>

<MarkerMetric
  label="Dense Repacking Status"
  value={
    safeDenseRepackingResult
      ?.bestSolution
      ?.engineeringReady
      ? safeDenseRepackingResult
          .bestSolution
          .targetUtilisationAchieved
        ? "90%+ Target Achieved"
        : "Engineering Ready"
      : safeDenseRepackingResult
            ?.bestSolution
        ? "Review Required"
        : "No Solution"
  }
/>
<MarkerMetric
  label="Validated Dense Solutions"
  value={String(
    safeDenseValidationRanking
      ?.productionValid
      .length ??
      0
  )}
/>

<MarkerMetric
  label="Highest Validated Utilisation"
  value={
    safeDenseValidationRanking
      ? `${formatNumber(
          safeDenseValidationRanking
            .highestValidatedUtilisation,
          2
        )}%`
      : "—"
  }
/>

<MarkerMetric
  label="90%+ Production Validation"
  value={
    safeDenseValidationRanking
      ?.targetAchieved
      ? "PASSED"
      : safeDenseValidationRanking
          ? "NOT PASSED"
          : "—"
  }
/>
<MarkerMetric
  label="Rejected Dense Solutions"
  value={String(
    safeDenseValidationDiagnostics
      ?.rejectedSolutions ??
      0
  )}
/>

<MarkerMetric
  label="Primary Failure"
  value={
    safeDenseValidationDiagnostics
      ?.primaryFailureReason ??
      "—"
  }
/>

<MarkerMetric
  label="Collision Failures"
  value={String(
    safeDenseValidationDiagnostics
      ?.collisionRejectedSolutions ??
      0
  )}
/>

<MarkerMetric
  label="Cutting Gap Failures"
  value={String(
    safeDenseValidationDiagnostics
      ?.cuttingGapRejectedSolutions ??
      0
  )}
/>

<MarkerMetric
  label="Boundary Failures"
  value={String(
    safeDenseValidationDiagnostics
      ?.boundaryRejectedSolutions ??
      0
  )}
/>

<MarkerMetric
  label="Completeness Failures"
  value={String(
    safeDenseValidationDiagnostics
      ?.completenessRejectedSolutions ??
      0
  )}
/>
<MarkerMetric
  label="Missing Pieces"
  value={String(
    safeDenseValidationDiagnostics
      ?.diagnostics.reduce(
        (total, diagnostic) =>
          total + diagnostic.missingPieceCount,
        0
      ) ?? 0
  )}
/>

<MarkerMetric
  label="Duplicate Pieces"
  value={String(
    safeDenseValidationDiagnostics
      ?.diagnostics.reduce(
        (total, diagnostic) =>
          total + diagnostic.duplicatePieceCount,
        0
      ) ?? 0
  )}
/>
<MarkerMetric
  label="Dense Expected Pieces"
  value={String(
    safeDenseRepackingResult
      ?.bestSolution
      ?.expectedPieceCount ??
      0
  )}
/>

<MarkerMetric
  label="Dense Placed Pieces"
  value={String(
    safeDenseRepackingResult
      ?.bestSolution
      ?.placedPieceCount ??
      0
  )}
/>

<MarkerMetric
  label="Dense Rejected Pieces"
  value={String(
    safeDenseRepackingResult
      ?.bestSolution
      ?.rejectedPieces
      .length ??
      0
  )}
/>
                </div>
              ) : null}

              <div className="mt-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Marker Solutions
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Select a solution to load its engineering metrics and
                      marker layout.
                    </p>
                  </div>

                  <p className="text-xs font-bold text-slate-500">
                    {markerCanvasSolutions.length} solution
                    {markerCanvasSolutions.length === 1 ? "" : "s"} available
                  </p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  {markerCanvasSolutions.map((solution, index) => {
                    const selected =
                      solution.id === selectedCanvasSolution?.id;

                    return (
                      <button
                        key={solution.id}
                        type="button"
                        onClick={() =>
                          setSelectedCanvasSolutionId(solution.id)
                        }
                        className={`relative rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/30"
                            : "border-slate-700 bg-slate-950/60 hover:border-slate-500"
                        }`}
                      >
                        {(() => {
  const safetyResult =
    productionSafetyRanking.evaluated.find(
      (result) =>
        result.id === solution.id
    );

  const isBestProductionSafe =
    bestProductionSafetyResult?.id ===
    solution.id;

  const isHighestUtilisation =
    highestUtilisationSafetyResult?.id ===
    solution.id;

  if (isBestProductionSafe) {
    return (
      <span className="absolute right-3 top-3 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-300">
        Best Production-Safe Marker
      </span>
    );
  }

  if (
    isHighestUtilisation &&
    safetyResult &&
    !safetyResult.productionReleased
  ) {
    return (
      <span className="absolute right-3 top-3 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-300">
        Highest Efficiency · Not Released
      </span>
    );
  }

  return null;
})()}

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 text-xs font-black text-slate-300">
                          {index + 1}
                        </div>

                        <h4 className="mt-4 pr-20 text-base font-black text-white">
                          {solution.label}
                        </h4>

                        <p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-400">
                          {solution.description}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                              Marker Length
                            </p>

                            <p className="mt-1 font-black text-white">
                              {formatNumber(
                                solution.markerLengthCm / 100,
                                3
                              )}{" "}
                              m
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                              Utilisation
                            </p>

                            <p className="mt-1 font-black text-emerald-300">
                              {formatNumber(
                                solution.utilisationPercent,
                                2
                              )}
                              %
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                              Waste
                            </p>

                            <p className="mt-1 font-black text-amber-300">
                              {formatNumber(
                                solution.wastePercent,
                                2
                              )}
                              %
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                              Engineering Score
                            </p>

                            <p className="mt-1 font-black text-cyan-300">
                              {formatNumber(
                                solution.engineeringScore,
                                2
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                              solution.collisionFree
                                ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
                                : "border-red-400/30 bg-red-950/20 text-red-300"
                            }`}
                          >
                            {solution.collisionFree
                              ? "Collision-Free"
                              : "Collision Review"}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                              solution.engineeringReady
                                ? "border-cyan-400/30 bg-cyan-950/20 text-cyan-300"
                                : "border-amber-400/30 bg-amber-950/20 text-amber-300"
                            }`}
                          >
                            {solution.engineeringReady
                              ? "Engineering Ready"
                              : "Review Required"}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wide">
                            <span className="text-slate-500">
                              AI Confidence
                            </span>

                            <span className="text-violet-300">
                              {formatNumber(
                                solution.confidencePercent,
                                0
                              )}
                              %
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-violet-400 transition-all"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    solution.confidencePercent
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        {selected ? (
                          <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-center text-xs font-black text-cyan-200">
                            Loaded on Marker Canvas
                          </div>
                        ) : (
                          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-center text-xs font-black text-slate-400">
                            Load This Solution
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
            <div className="mt-6 overflow-auto rounded-2xl border border-cyan-500/30 bg-slate-950 p-4">
              <div
                className="relative min-h-[520px] overflow-hidden rounded-xl border-2 border-dashed border-cyan-400/40"
                style={{
  height: `${selectedMarkerCanvasHeight}px`,
  minWidth: `${selectedCanvasMinimumWidth}px`,

                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",

                  backgroundSize: "24px 24px",
                }}
              >
                <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-cyan-400/20 bg-cyan-950/20 px-4 py-3">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    Fabric Start
                  </span>

                  <div className="text-center">
  <p className="text-xs font-black text-slate-300">
    {selectedCanvasSolution?.label ?? "Original Marker"}
  </p>

  <p className="mt-0.5 text-[10px] font-bold text-slate-500">
    Usable width {formatNumber(usableFabricWidthCm, 1)} cm ·{" "}
    {setsPerMarker} garment
    {setsPerMarker === 1 ? "" : "s"}
  </p>
</div>

                  <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    Marker End
                  </span>
                </div>

                <div className="absolute inset-0">
  {selectedCanvasPlacements.map((placement) => {
    const displayVertices =
      placement.pattern
        ? placement.rotation !== 0
          ? rotateVerticesForDisplay(
              placement.pattern.polygon.vertices,
              normaliseDisplayRotation(placement.rotation)
            )
          : placement.pattern.polygon.vertices
        : null;

    const compact =
      placement.width < 70 ||
      placement.height < 56;

    const isHoleFillingPiece =
      placement.source === "holeFilling";

    return (
      <div
        key={placement.id}
        title={`${placement.pieceName} · ${
          isHoleFillingPiece
            ? "Hole Filling"
            : "Existing Marker Piece"
        }`}
        className={`absolute overflow-hidden rounded-lg border-2 shadow-xl transition-all ${
          isHoleFillingPiece
            ? "border-fuchsia-400 bg-gradient-to-br from-fuchsia-500/25 to-violet-500/10 hover:border-fuchsia-200"
            : "border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 hover:border-cyan-300"
        }`}
        style={{
          left: placement.left,
          top: placement.top,
          width: placement.width,
          height: placement.height,
        }}
      >
        <div className="flex h-full flex-col justify-between">
          {!compact ? (
            <div
              className={`border-b px-2 py-1 ${
                isHoleFillingPiece
                  ? "border-fuchsia-400/30 bg-fuchsia-500/15"
                  : "border-emerald-400/30 bg-emerald-500/15"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate text-[11px] font-black ${
                    isHoleFillingPiece
                      ? "text-fuchsia-200"
                      : "text-emerald-200"
                  }`}
                >
                  {placement.pieceName}
                </p>

                {isHoleFillingPiece ? (
                  <span className="shrink-0 rounded-full border border-fuchsia-400/40 bg-fuchsia-950/40 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-fuchsia-200">
                    Hole Filled
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="flex flex-1 items-center justify-center">
            <svg
              width="90%"
              height="90%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {displayVertices ? (
                <polygon
                  points={polygonToSvgPoints(
                    displayVertices,
                    100,
                    100
                  )}
                  fill={
                    isHoleFillingPiece
                      ? "rgba(217,70,239,0.22)"
                      : "rgba(16,185,129,0.20)"
                  }
                  stroke={
                    isHoleFillingPiece
                      ? "#f0abfc"
                      : "#6ee7b7"
                  }
                  strokeWidth="2"
                />
              ) : (
                <rect
                  x="4"
                  y="4"
                  width="92"
                  height="92"
                  rx="5"
                  fill="rgba(217,70,239,0.22)"
                  stroke="#f0abfc"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}
            </svg>
          </div>

          {!compact ? (
            <div
              className={`border-t bg-slate-950/60 px-2 py-1 ${
                isHoleFillingPiece
                  ? "border-fuchsia-400/30"
                  : "border-emerald-400/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[10px] font-bold text-slate-300">
                  {formatNumber(
                    placement.engineeringScore,
                    0
                  )}
                  %
                </p>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${
                    isHoleFillingPiece
                      ? "border-fuchsia-400/30 bg-fuchsia-950/30 text-fuchsia-300"
                      : "border-cyan-400/30 bg-cyan-950/30 text-cyan-300"
                  }`}
                >
                  {placement.rotation}°
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  })}

  {selectedCanvasPlacements.length === 0 ? (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="max-w-md rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 text-center">
        <p className="font-black text-amber-200">
          No placement geometry is available for this solution.
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-100/70">
          Load the Original Marker or rerun Hole Filling and
          Intelligent Compaction.
        </p>
      </div>
    </div>
  ) : null}
</div>
              </div>
            </div>
            {selectedCanvasSolution ? (
  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
    <MarkerMetric
      label="Loaded Solution"
      value={selectedCanvasSolution.label}
    />

    <MarkerMetric
      label={lang.term("markerLength")}
      value={`${formatNumber(
        selectedCanvasSolution.markerLengthCm / 100,
        3
      )} m`}
    />

    <MarkerMetric
      label={lang.term("markerUtilisation")}
      value={`${formatNumber(
        selectedCanvasSolution.utilisationPercent,
        2
      )}%`}
    />

    <MarkerMetric
      label={lang.term("waste")}
      value={`${formatNumber(
        selectedCanvasSolution.wastePercent,
        2
      )}%`}
    />

    <MarkerMetric
      label="Engineering Score"
      value={formatNumber(
        selectedCanvasSolution.engineeringScore,
        2
      )}
    />

    <MarkerMetric
      label="AI Confidence"
      value={`${formatNumber(
        selectedCanvasSolution.confidencePercent,
        0
      )}%`}
    />
  </div>
) : null}

            <section
              className={`mt-5 rounded-3xl border p-5 ${
                productionReleaseDecision.severity === "approved"
                  ? "border-emerald-400/30 bg-emerald-950/20"
                  : productionReleaseDecision.severity === "warning"
                    ? "border-amber-400/30 bg-amber-950/20"
                    : "border-red-400/30 bg-red-950/20"
              }`}
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-4xl">
                  <p
                    className={`text-xs font-black uppercase tracking-[0.22em] ${
                      productionReleaseDecision.severity === "approved"
                        ? "text-emerald-300"
                        : productionReleaseDecision.severity === "warning"
                          ? "text-amber-300"
                          : "text-red-300"
                    }`}
                  >
                    RC5-004-009 · Production Release Decision
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    Cutting Master Release Control
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {productionReleaseDecision.summary}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border px-5 py-4 text-center ${
                    productionReleaseDecision.severity === "approved"
                      ? "border-emerald-400/40 bg-emerald-500/10"
                      : productionReleaseDecision.severity === "warning"
                        ? "border-amber-400/40 bg-amber-500/10"
                        : "border-red-400/40 bg-red-500/10"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {lang.term("finalDecision")}
                  </p>

                  <p
                    className={`mt-2 text-lg font-black ${
                      productionReleaseDecision.severity === "approved"
                        ? "text-emerald-300"
                        : productionReleaseDecision.severity === "warning"
                          ? "text-amber-300"
                          : "text-red-300"
                    }`}
                  >
                    {productionReleaseDecision.decisionLabel}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <MarkerMetric
                  label={lang.term("selectedMarker")}
                  value={
                    productionReleaseDecision.selectedSolution?.label ??
                    lang.term("none")
                  }
                />

                <MarkerMetric
                  label={lang.term("safetyScore")}
                  value={
                    productionReleaseDecision.safetyScore !== null
                      ? formatNumber(
                          productionReleaseDecision.safetyScore,
                          1
                        )
                      : "—"
                  }
                />

                <MarkerMetric
                  label={lang.term("markerUtilisation")}
                  value={
                    productionReleaseDecision.selectedUtilisationPercent !==
                    null
                      ? `${formatNumber(
                          productionReleaseDecision.selectedUtilisationPercent,
                          2
                        )}%`
                      : "—"
                  }
                />

                <MarkerMetric
                  label={lang.term("engineeringScore")}
                  value={
                    productionReleaseDecision.engineeringScore !== null
                      ? formatNumber(
                          productionReleaseDecision.engineeringScore,
                          2
                        )
                      : "—"
                  }
                />

                <MarkerMetric
                  label={lang.term("targetGap90")}
                  value={
                    productionReleaseDecision.utilisationGapToTarget !== null
                      ? `${formatNumber(
                          productionReleaseDecision.utilisationGapToTarget,
                          2
                        )}%`
                      : "—"
                  }
                />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  {lang.term("cuttingInstruction")}
                </p>

                <p
                  className={`mt-2 text-base font-black leading-7 ${
                    productionReleaseDecision.severity === "approved"
                      ? "text-emerald-200"
                      : productionReleaseDecision.severity === "warning"
                        ? "text-amber-200"
                        : "text-red-200"
                  }`}
                >
                  {productionReleaseDecision.instruction}
                </p>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Engineering Decision
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {productionReleaseDecision.engineeringMessage}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                    Efficiency Decision
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {productionReleaseDecision.efficiencyMessage}
                  </p>
                </div>
              </div>

              {productionReleaseDecision.blockingReasons.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-950/20 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
                    Blocking Reasons
                  </p>

                  <div className="mt-3 space-y-2">
                    {productionReleaseDecision.blockingReasons.map(
                      (reason, index) => (
                        <p
                          key={`${reason}-${index}`}
                          className="text-sm leading-6 text-red-100"
                        >
                          {index + 1}. {reason}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ) : null}

              {productionReleaseDecision.reviewReasons.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    {lang.term("engineeringReviewReasons")}
                  </p>

                  <div className="mt-3 space-y-2">
                    {productionReleaseDecision.reviewReasons.map(
                      (reason, index) => (
                        <p
                          key={`${reason}-${index}`}
                          className="text-sm leading-6 text-amber-100"
                        >
                          {index + 1}. {reason}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ) : null}

              {productionReleaseDecision.selectedIsHighestUtilisationCandidate &&
              !productionReleaseDecision.selectedProductionReleased ? (
                <div className="mt-4 rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4">
                  <p className="text-sm font-black text-violet-200">
                    {lang.message("highestEfficiencyBlockedNotice", MARKER_PRODUCTION_MESSAGES)}
                  </p>
                </div>
              ) : null}
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                    Live Statistics
                  </p>

                  <h2 className="mt-2 text-2xl font-black">Marker Performance</h2>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    productionMarkerResult.decision === "productionReleased"
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                      : productionMarkerResult.decision === "rejected"
                        ? "border-red-400/40 bg-red-500/10 text-red-200"
                        : productionMarkerResult.decision === "notIndependentlyGated"
                          ? "border-slate-500/40 bg-slate-500/10 text-slate-300"
                          : "border-amber-400/40 bg-amber-500/10 text-amber-200"
                  }`}
                >
                  {productionMarkerResult.decision === "productionReleased"
                    ? lang.term("productionReleased")
                    : productionMarkerResult.decision === "rejected"
                      ? lang.term("productionRejected")
                      : productionMarkerResult.decision === "notIndependentlyGated"
                        ? lang.term("notIndependentlyGated")
                        : lang.term("engineeringReviewRequired")}
                </span>
              </div>

              {/* Step 4C §7 — Safety, Engineering Release and Efficiency are
                  three different questions. A low-efficiency marker is never
                  presented as "unsafe" unless a physical safety gate (not the
                  Engineering Score/Utilisation gates) actually failed. */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                    {lang.term("safety")}
                  </p>
                  <p
                    className={`mt-1 text-sm font-black ${
                      productionMarkerResult.safetyGate === null
                        ? "text-slate-400"
                        : productionMarkerResult.safetyGate.criticalFailureCount === 0
                          ? "text-emerald-300"
                          : "text-red-300"
                    }`}
                  >
                    {productionMarkerResult.safetyGate === null
                      ? lang.term("notGated")
                      : productionMarkerResult.safetyGate.criticalFailureCount === 0
                        ? lang.term("safetyChecksPassed")
                        : lang.term("failed")}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                    {lang.term("engineeringRelease")}
                  </p>
                  <p
                    className={`mt-1 text-sm font-black ${
                      productionMarkerResult.decision === "productionReleased"
                        ? "text-emerald-300"
                        : productionMarkerResult.decision === "rejected"
                          ? "text-red-300"
                          : "text-amber-300"
                    }`}
                  >
                    {productionMarkerResult.decision === "productionReleased"
                      ? lang.term("released")
                      : productionMarkerResult.decision === "rejected"
                        ? lang.term("rejectedShort")
                        : productionMarkerResult.decision === "notIndependentlyGated"
                          ? lang.term("notGated")
                          : lang.term("reviewRequiredShort")}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                    {lang.term("efficiency")}
                  </p>
                  <p className="mt-1 text-sm font-black text-white">
                    {formatNumber(productionMarkerResult.utilisationPercent, 1)}%
                  </p>
                </div>
              </div>

              {/* Step 4C §6 — a specific, gate-generated reason, never
                  hard-coded per fabric. Built entirely from the real
                  ProductionSafetyGateResult.issues this candidate received. */}
              {productionMarkerResult.safetyGate &&
              productionMarkerResult.decision !== "productionReleased" ? (
                <div
                  className={`mt-4 rounded-2xl border p-4 ${
                    productionMarkerResult.decision === "rejected"
                      ? "border-red-500/30 bg-red-950/20"
                      : "border-amber-500/30 bg-amber-950/20"
                  }`}
                >
                  <p
                    className={`text-xs font-black uppercase tracking-wide ${
                      productionMarkerResult.decision === "rejected"
                        ? "text-red-300"
                        : "text-amber-300"
                    }`}
                  >
                    {productionMarkerResult.decision === "rejected"
                      ? lang.message("productionRejectedReason", MARKER_PRODUCTION_MESSAGES)
                      : lang.message("engineeringReviewReason", MARKER_PRODUCTION_MESSAGES)}
                  </p>

                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-200">
                    {productionMarkerResult.safetyGate.blockingIssues.map((issue, index) => (
                      <li key={`${issue.code}-${index}`}>{issue.message}</li>
                    ))}
                  </ul>

                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    {lang.message("engineeringReviewFooter", MARKER_PRODUCTION_MESSAGES)}{" "}
                    {productionMarkerResult.decision === "engineeringReviewRequired"
                      ? lang.message("engineeringReviewNotUnsafe", MARKER_PRODUCTION_MESSAGES)
                      : ""}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 space-y-3">
                <MarkerMetric
                  label={lang.term("fabricUtilisation")}
                  value={`${formatNumber(productionMarkerResult.utilisationPercent, 2)}%`}
                />

                <MarkerMetric
                  label={lang.term("fabricWaste")}
                  value={`${formatNumber(productionMarkerResult.wastePercent, 2)}%`}
                />

                <MarkerMetric
                  label={lang.term("markerLength")}
                  value={`${formatNumber(productionMarkerResult.markerLengthCm, 1)} cm`}
                />

                <MarkerMetric
                  label={`${lang.term("patternPiecesPlaced")} / ${lang.term("patternPiecesRequired")}`}
                  value={`${productionMarkerResult.placedCount} / ${productionMarkerResult.expectedCount}`}
                />

                <MarkerMetric
                  label={lang.term("markerArea")}
                  value={`${formatNumber(markerAreaCm2)} cm²`}
                />

                <MarkerMetric
                  label={lang.term("placedPatternArea")}
                  value={`${formatNumber(placedPatternAreaCm2)} cm²`}
                />

                <MarkerMetric
                  label={lang.term("grossWidthUtilisation")}
                  value={`${formatNumber(grossWidthUtilisation, 2)}%`}
                />

                <MarkerMetric
                  label={lang.term("candidateTests")}
                  value={candidateTests.toLocaleString("en-GB")}
                />

                <MarkerMetric
                  label={lang.term("searchBudgetExhausted")}
                  value={String(budgetExhaustedCount)}
                />

                <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {lang.term("collisionsLabel")}
                    </span>

                    <span
                      className={`text-2xl font-black ${
                        collisionCount === 0
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {collisionCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${productionMarkerResult.utilisationPercent}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {productionMarkerResult.source === "optimised"
                  ? lang.message("resultOptimised", MARKER_PRODUCTION_MESSAGES)
                  : lang.message("resultBaseline", MARKER_PRODUCTION_MESSAGES)}
              </p>
            </section>

            {/* Stage 2C-1 — Marker Run Save & History. A compact addition
                to the existing sidebar, not a page redesign: persists the
                exact productionOptimisationInput/productionMarkerResult.rawResult
                pair above via the already-existing MarkerRun endpoints. */}
            <section className="rounded-3xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-300">
                Marker Run History
              </p>

              <h2 className="mt-2 text-xl font-black">
                Save &amp; Reopen Runs
              </h2>

              {!isServerBackedProject ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Saving marker runs requires a server-synced engineering
                  project. This project is local-only — the marker workflow
                  above is unaffected, but generated results here won&apos;t
                  be saved to your account.
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={saveMarkerRun}
                    disabled={
                      !productionMarkerResult.rawResult || markerRunSaving
                    }
                    className="mt-4 w-full rounded-xl border border-emerald-400/40 bg-emerald-950/40 px-4 py-3 text-center font-black text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-900/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {markerRunSaving
                      ? "Saving Marker Run..."
                      : "Save Marker Run"}
                  </button>

                  {!productionMarkerResult.rawResult ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Generate a complete marker (loaded geometry and a
                      confirmed fabric width) before a run can be saved.
                    </p>
                  ) : null}

                  {markerRunSaveMessage ? (
                    <p className="mt-2 text-xs font-bold text-emerald-300">
                      {markerRunSaveMessage}
                    </p>
                  ) : null}

                  {markerRunSaveError ? (
                    <p className="mt-2 text-xs font-bold text-red-300">
                      Save failed: {markerRunSaveError}
                    </p>
                  ) : null}

                  <div className="mt-5 border-t border-slate-700 pt-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Saved Runs
                    </p>

                    {markerRunsLoading ? (
                      <p className="mt-2 text-sm text-slate-400">
                        Loading saved marker runs...
                      </p>
                    ) : markerRunsLoadError ? (
                      <p className="mt-2 text-sm text-amber-300">
                        Could not load saved marker runs:{" "}
                        {markerRunsLoadError}
                      </p>
                    ) : savedMarkerRuns.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-400">
                        No marker runs saved yet for this project.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {savedMarkerRuns.map((run) => {
                          const rowSummary = summariseMarkerRunResult(
                            run.resultJson
                          );

                          const isInspecting =
                            selectedMarkerRun?.id === run.id;
                          const isConsumptionSelected =
                            selectedConsumptionRun?.id === run.id;

                          return (
                            <li key={run.id}>
                              <div
                                className={`rounded-xl border px-3 py-2 transition ${
                                  isInspecting
                                    ? "border-cyan-300 bg-cyan-950/40"
                                    : "border-slate-700 bg-slate-950/60"
                                }`}
                              >
                                {/* Read-only inspection (Stage 2C-1) — never
                                    changes the consumption selection below. */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedMarkerRun((current) =>
                                      current?.id === run.id ? null : run
                                    )
                                  }
                                  className="w-full text-left"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-white">
                                      {formatMarkerRunTimestamp(
                                        run.createdAt
                                      )}
                                    </p>

                                    {isConsumptionSelected ? (
                                      <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                                        Consumption
                                      </span>
                                    ) : null}
                                  </div>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    Run {run.id.slice(0, 8)}
                                    {typeof rowSummary.utilisationPercent ===
                                    "number"
                                      ? ` · ${formatNumber(rowSummary.utilisationPercent, 1)}% utilisation`
                                      : ""}
                                  </p>
                                </button>

                                {/* Stage 2D-2 — explicit, separate action.
                                    Selecting this never touches
                                    selectedMarkerRun (inspection) above, and
                                    never modifies the saved run or any live
                                    marker/nesting state — it only points the
                                    consumption calculation below at this
                                    run. */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedConsumptionRun(run)
                                  }
                                  disabled={isConsumptionSelected}
                                  className="mt-2 rounded-lg border border-emerald-400/40 bg-emerald-950/30 px-2 py-1 text-[11px] font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isConsumptionSelected
                                    ? "Selected for Consumption"
                                    : "Use for Consumption"}
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {selectedMarkerRun ? (
                    <div className="mt-5 border-t border-slate-700 pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                          Inspecting Saved Run
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedMarkerRun(null)}
                          className="text-xs font-bold text-slate-400 hover:text-white"
                        >
                          Close
                        </button>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Read-only — selecting a saved run never changes your
                        current unsaved marker configuration or result above.
                      </p>

                      <div className="mt-3 space-y-2">
                        <MarkerMetric
                          label="Saved"
                          value={formatMarkerRunTimestamp(
                            selectedMarkerRun.createdAt
                          )}
                        />

                        <MarkerMetric
                          label="Run ID"
                          value={selectedMarkerRun.id}
                        />

                        {(() => {
                          const snapshotSummary =
                            summariseMarkerRunSnapshot(
                              selectedMarkerRun.snapshotJson
                            );

                          const resultSummary = summariseMarkerRunResult(
                            selectedMarkerRun.resultJson
                          );

                          return (
                            <>
                              <MarkerMetric
                                label="Fabric Width"
                                value={
                                  typeof snapshotSummary.fabricWidth ===
                                  "number"
                                    ? `${formatNumber(snapshotSummary.fabricWidth, 1)} cm`
                                    : "—"
                                }
                              />

                              <MarkerMetric
                                label="Pieces"
                                value={
                                  typeof snapshotSummary.pieceCount ===
                                  "number"
                                    ? String(snapshotSummary.pieceCount)
                                    : "—"
                                }
                              />

                              <MarkerMetric
                                label="Utilisation"
                                value={
                                  typeof resultSummary.utilisationPercent ===
                                  "number"
                                    ? `${formatNumber(resultSummary.utilisationPercent, 2)}%`
                                    : "—"
                                }
                              />

                              <MarkerMetric
                                label="Waste"
                                value={
                                  typeof resultSummary.wastePercent ===
                                  "number"
                                    ? `${formatNumber(resultSummary.wastePercent, 2)}%`
                                    : "—"
                                }
                              />

                              <MarkerMetric
                                label="Marker Length"
                                value={
                                  typeof resultSummary.markerLengthCm ===
                                  "number"
                                    ? `${formatNumber(resultSummary.markerLengthCm, 1)} cm`
                                    : "—"
                                }
                              />
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </section>

            <section className="rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Fabric Planning
              </p>

              <h2 className="mt-2 text-2xl font-black">Usable Roll Requirement</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <NumberField
                  label="Gross Roll Length (m)"
                  value={grossRollLengthMetres}
                  onChange={setGrossRollLengthMetres}
                  min="0"
                  step="0.1"
                />

                <NumberField
                  label="Start Allowance (m)"
                  value={startAllowanceMetres}
                  onChange={setStartAllowanceMetres}
                  min="0"
                  step="0.01"
                />

                <NumberField
                  label="End Allowance (m)"
                  value={endAllowanceMetres}
                  onChange={setEndAllowanceMetres}
                  min="0"
                  step="0.01"
                />

                <NumberField
                  label="Defect / Splice Allowance (m)"
                  value={defectAllowanceMetres}
                  onChange={setDefectAllowanceMetres}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="mt-5 rounded-xl border border-cyan-500/30 bg-slate-950/60 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Calculated Usable Roll Length
                </p>

                <p className="mt-2 text-xl font-black text-cyan-300">
                  {formatNumber(usableRollLengthMetres, 2)} m
                </p>
              </div>

              {/* Live nesting-width figures — describe the marker currently
                  being built on this page, independent of any saved
                  MarkerRun or consumption selection below. */}
              <div className="mt-5 space-y-3">
                <MarkerMetric
                  label="Nominal Width"
                  value={`${formatNumber(nominalFabricWidthCm, 2)} cm`}
                />

                <MarkerMetric
                  label="Usable Width (Live Nesting)"
                  value={`${formatNumber(usableFabricWidthCm, 2)} cm`}
                />

                <MarkerMetric
                  label="Total Edge Exclusion"
                  value={`${formatNumber(edgeExclusionTotalCm, 2)} cm`}
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Roll planning uses the usable roll length after start, end and
                defect allowances. Marker nesting uses the usable width after
                both edge exclusions.
              </p>

              {/* ======================================================================
               * Stage 2D-2 — Marker-based fabric consumption, driven ONLY by
               * an explicitly selected saved MarkerRun (see "Marker Run
               * History" above) via the shared engine.
               * ================================================================== */}

              <div className="mt-6 border-t border-slate-700 pt-5">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Marker-Based Consumption
                </p>

                {!isServerBackedProject ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Consumption analysis uses saved marker runs, which
                    requires a server-synced engineering project. This
                    project is local-only — the rest of the marker workflow
                    above is unaffected.
                  </p>
                ) : !project?.fabricProfile ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    A Fabric Profile must be completed and saved (see the
                    Fabric section above) before consumption can be
                    calculated — the current usable width shown there has
                    not been confirmed for this project yet.
                  </p>
                ) : savedMarkerRuns.length === 0 ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    No marker runs saved yet. Generate a marker and use{" "}
                    &quot;Save Marker Run&quot; above before running a
                    consumption analysis.
                  </p>
                ) : !selectedConsumptionRun ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Select &quot;Use for Consumption&quot; on a saved marker
                    run above to calculate fabric consumption from it.
                  </p>
                ) : (
                  <>
                    <p className="mt-3 text-sm font-bold text-white">
                      Selected run:{" "}
                      {formatMarkerRunTimestamp(
                        selectedConsumptionRun.createdAt
                      )}{" "}
                      (Run {selectedConsumptionRun.id.slice(0, 8)})
                    </p>

                    {consumptionResult
                      ? consumptionResult.issues
                          .filter((issue) => issue.severity === "error")
                          .map((issue) => (
                            <p
                              key={issue.code}
                              className="mt-3 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm font-bold text-red-200"
                            >
                              {issue.message}
                            </p>
                          ))
                      : null}

                    {consumptionResult
                      ? consumptionResult.issues
                          .filter((issue) => issue.severity === "warning")
                          .map((issue) => (
                            <p
                              key={issue.code}
                              className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200"
                            >
                              {issue.message}
                            </p>
                          ))
                      : null}

                    {consumptionResult?.valid ? (
                      <div className="mt-4 space-y-3">
                        <MarkerMetric
                          label="Marker Length"
                          value={`${formatNumber(
                            consumptionMarkerSummary?.markerLengthCm ?? 0,
                            1
                          )} cm`}
                        />

                        <MarkerMetric
                          label="Usable Fabric Width (Fabric Profile)"
                          value={`${formatNumber(
                            fabricProfile.usableFabricWidthCm,
                            2
                          )} cm`}
                        />

                        <MarkerMetric
                          label="Sets per Marker"
                          value={String(setsPerMarker)}
                        />

                        <MarkerMetric
                          label="Usable Roll Length"
                          value={`${formatNumber(
                            consumptionResult.usableRollLengthMetres,
                            2
                          )} m`}
                        />

                        <MarkerMetric
                          label="Fabric Consumption per Garment/Set"
                          value={`${formatNumber(
                            (consumptionResult.fabricConsumptionPerGarmentCm ??
                              0) / 100,
                            4
                          )} m`}
                        />

                        <MarkerMetric
                          label="Markers per Roll"
                          value={String(consumptionResult.markersPerRoll)}
                        />

                        <MarkerMetric
                          label="Garments/Sets per Roll"
                          value={String(consumptionResult.garmentsPerRoll)}
                        />

                        <MarkerMetric
                          label="Roll Remainder"
                          value={`${formatNumber(
                            (consumptionResult.rollRemainderCm ?? 0) / 100,
                            3
                          )} m`}
                        />

                        <MarkerMetric
                          label="Total Fabric Requirement"
                          value={`${formatNumber(
                            consumptionResult.totalFabricRequiredMetres ?? 0,
                            2
                          )} m`}
                        />

                        {consumptionResult.rollsRequiredForOrder !== null &&
                        consumptionResult.rollsRequiredForOrder > 0 ? (
                          <MarkerMetric
                            label={`Rolls for ${orderQuantity.toLocaleString(
                              "en-GB"
                            )} Garments`}
                            value={String(
                              consumptionResult.rollsRequiredForOrder
                            )}
                          />
                        ) : null}

                        {consumptionResult.costPerGarment !== null &&
                        currencySymbol ? (
                          <MarkerMetric
                            label="Fabric Cost per Garment/Set"
                            value={`${currencySymbol}${formatNumber(
                              consumptionResult.costPerGarment,
                              4
                            )}`}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </section>

            {/* ======================================================================
             * Stage 2E-2 — Engineering Recommendations
             *
             * A deterministic, read-only aggregated view over the SAME
             * selectedConsumptionRun already driving Marker-Based Fabric
             * Consumption above (never selectedMarkerRun / read-only
             * inspection, never the live nesting session). This panel does
             * not decide production release — that authority remains the
             * Safety Gate baked into each saved MarkerRun; this is an
             * aggregated engineering view on top of it, not a new one.
             * ================================================================== */}

            <section className="rounded-3xl border border-slate-700 bg-slate-900/60 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Engineering Recommendations
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Engineering Recommendations
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Aggregated from the Safety Gate and Fabric Consumption results
                of the same marker run selected for consumption above, plus
                Fabric Profile and grain-line trace completeness. This is not
                a production-release decision — the Safety Gate remains the
                sole release authority.
              </p>

              {!isServerBackedProject ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Engineering recommendations use saved marker runs, which
                  requires a server-synced engineering project. This project
                  is local-only — the rest of the marker workflow above is
                  unaffected.
                </p>
              ) : savedMarkerRuns.length === 0 ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  No marker runs saved yet. Generate a marker and use{" "}
                  &quot;Save Marker Run&quot; above before viewing engineering
                  recommendations.
                </p>
              ) : !selectedConsumptionRun ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Select &quot;Use for Consumption&quot; on a saved marker run
                  above to view engineering recommendations for it.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm font-bold text-white">
                    Selected run:{" "}
                    {formatMarkerRunTimestamp(
                      selectedConsumptionRun.createdAt
                    )}{" "}
                    (Run {selectedConsumptionRun.id.slice(0, 8)})
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(
                      [
                        "critical",
                        "review",
                        "advisory",
                        "passed",
                      ] as EngineeringRecommendationSeverity[]
                    ).map((severity) => {
                      const count = engineeringRecommendations.filter(
                        (recommendation) =>
                          recommendation.severity === severity
                      ).length;
                      const style = RECOMMENDATION_SEVERITY_STYLES[severity];

                      return (
                        <span
                          key={severity}
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}
                        >
                          {style.label}: {count}
                        </span>
                      );
                    })}
                  </div>

                  {engineeringRecommendations.length === 0 ? (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      No engineering recommendations to show for this run —
                      the safety gate reported no issues, the consumption
                      result reported no issues, and there is nothing
                      applicable to report for Fabric Profile or grain-line
                      trace completeness.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {engineeringRecommendations.map((recommendation) => {
                        const style =
                          RECOMMENDATION_SEVERITY_STYLES[
                            recommendation.severity
                          ];

                        return (
                          <div
                            key={`${recommendation.source}:${recommendation.code}`}
                            className={`rounded-xl border px-4 py-3 ${style.panel}`}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${style.badge}`}
                              >
                                {style.label}
                              </span>

                              {recommendation.blocking ? (
                                <span className="rounded-full border border-red-400/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-red-100">
                                  Blocking
                                </span>
                              ) : null}

                              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                {recommendation.category} · {recommendation.source}
                              </span>
                            </div>

                            <p
                              className={`mt-2 text-sm font-bold ${style.text}`}
                            >
                              {recommendation.title}
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-300">
                              {recommendation.message}
                            </p>

                            {recommendation.evidence ? (
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                {Object.entries(recommendation.evidence).map(
                                  ([key, value]) => (
                                    <span key={key}>
                                      {key}: {String(value)}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            {collisionPairs.length > 0 ? (
              <section className="rounded-3xl border border-red-500/30 bg-red-950/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
                  Collision Report
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Overlapping Pieces
                </h2>

                <div className="mt-4 max-h-60 space-y-2 overflow-y-auto pr-1">
                  {collisionPairs.map((pair) => (
                    <div
                      key={`${pair.firstId}-${pair.secondId}`}
                      className="rounded-xl border border-red-500/30 bg-slate-950/60 px-3 py-2 text-sm font-bold text-red-200"
                    >
                      {instanceNames.get(pair.firstId) ?? pair.firstId}
                      {" ↔ "}
                      {instanceNames.get(pair.secondId) ?? pair.secondId}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {budgetExhaustedCount > 0 ? (
              <section className="rounded-3xl border border-orange-500/30 bg-orange-950/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                  Search Budget Warning
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Optimisation Limit Reached
                </h2>

                <p className="mt-3 text-sm leading-6 text-orange-100">
                  {budgetExhaustedCount} piece
                  {budgetExhaustedCount === 1 ? "" : "s"} reached the
                  per-piece candidate-test limit. This does not prove that the
                  pieces cannot fit; it means the browser-safe search stopped
                  before finding a legal placement.
                </p>

                <p className="mt-3 text-xs leading-5 text-orange-200/80">
                  Reduce Garments per Marker, increase the candidate-test budget
                  carefully, or move nesting to a Web Worker before relying on
                  this marker for fabric planning.
                </p>
              </section>
            ) : null}

            {unplacedGroups.length > 0 ? (
              <section className="rounded-3xl border border-amber-500/30 bg-amber-950/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                  Placement Exceptions
                </p>

                <h2 className="mt-2 text-2xl font-black">Unplaced Pieces</h2>

                <p className="mt-3 text-sm leading-6 text-amber-100">
                  These pieces did not fit within the fabric width, the
                  permitted rotations, or the per-piece search budget.
                </p>

                <div className="mt-4 max-h-60 space-y-2 overflow-y-auto pr-1">
                  {unplacedGroups.map((group) => (
                    <div
                      key={group.pattern.patternId}
                      className="rounded-xl border border-amber-500/30 bg-slate-950/60 px-3 py-2"
                    >
                      <p className="text-sm font-black text-amber-100">
                        {group.pattern.recognisedName} × {group.count}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatNumber(
                          toFiniteNumber(group.pattern.dimensions.widthCm)
                        )}{" "}
                        ×{" "}
                        {formatNumber(
                          toFiniteNumber(group.pattern.dimensions.heightCm)
                        )}{" "}
                        cm
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-3xl border border-violet-500/20 bg-violet-950/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
                AI Engineering Consultant
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Marker Decision Dashboard
              </h2>

              <label className="mt-5 block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Factory Decision Priority
                </span>

                <select
                  value={markerPriority}
                  onChange={(event) =>
                    setMarkerPriority(
                      event.target.value as MarkerPriority
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-violet-500/30 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-violet-300"
                >
                  <option value="balanced">Balanced Engineering</option>
                  <option value="maximum-utilisation">
                    Maximum Utilisation
                  </option>
                  <option value="lowest-cost">Lowest Fabric Cost</option>
                  <option value="shortest-marker">Shortest Marker</option>
                  <option value="minimum-waste">Minimum Waste</option>
                  <option value="highest-throughput">
                    Highest Throughput
                  </option>
                </select>
              </label>

              {consultantDecision && consultantRecommendation ? (
                <>
                  <div className="mt-5 rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-950/60 to-cyan-950/30 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
                          Recommended Marker
                        </p>

                        <p className="mt-2 text-4xl font-black text-white">
                          {consultantDecision.selected.garments}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-400">
                          garments per marker
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/30 px-4 py-3 text-right">
                        <p className="text-[10px] font-black uppercase tracking-wide text-emerald-400">
                          Decision Score
                        </p>

                        <p className="mt-1 text-3xl font-black text-emerald-200">
                          {consultantDecision.score}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm font-bold leading-6 text-violet-100">
                      {consultantDecision.reason}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {consultantDecision.engineeringComment}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <MarkerMetric
                      label="Recommended Utilisation"
                      value={`${formatNumber(
                        consultantDecision.selected.utilisation,
                        2
                      )}%`}
                    />

                    <MarkerMetric
                      label="Recommended Waste"
                      value={`${formatNumber(
                        consultantDecision.selected.waste,
                        2
                      )}%`}
                    />

                    <MarkerMetric
                      label="Recommended Marker Length"
                      value={`${formatNumber(
                        consultantDecision.selected.markerLength /
                          100,
                        3
                      )} m`}
                    />

                    <MarkerMetric
                      label="AI Confidence"
                      value={`${formatNumber(
                        consultantDecision.selected.confidence,
                        1
                      )}%`}
                    />

                    <MarkerMetric
                      label="Potential Fabric Saving"
                      value={`${formatNumber(
                        consultantRecommendation.estimatedFabricSaving,
                        2
                      )} m`}
                    />

                    {currencySymbol ? (
                      <MarkerMetric
                        label="Estimated Cost Saving"
                        value={`${currencySymbol}${formatNumber(
                          consultantRecommendation.estimatedCostSaving,
                          2
                        )}`}
                      />
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-cyan-300">
                      Explainable AI
                    </p>

                    <p className="mt-3 text-sm font-bold leading-6 text-slate-200">
                      {consultantRecommendation.recommendation}
                    </p>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      {batchResult
                        ? `This recommendation is based on ${markerComparison.totalAnalysed} sequentially generated marker solutions.`
                        : "Run AI Optimum Quantity Analysis to compare the requested marker against every browser-safe garment quantity."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4">
                  <p className="text-sm font-bold leading-6 text-amber-200">
                    The AI consultant is withholding a recommendation until the
                    marker is complete, collision-free, within the marker-length
                    constraint and free of search-budget failures.
                  </p>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Engineering Data Status
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {markerIsComplete
                    ? "Every required saved piece is placed with no overlapping outlines and no search-budget failures."
                    : budgetExhaustedCount > 0
                      ? "This marker is incomplete because the browser-safe search budget was exhausted."
                      : "This marker has unresolved placement exceptions."}
                </p>

                {markerPatterns.some((pattern) => pattern.cutQuantity === undefined) ? (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    One or more patterns here were saved before cut quantity
                    was recorded by the geometry stage and are being counted
                    once per garment. Re-run pattern approval in Project
                    Geometry to save their real cut quantity.
                  </p>
                ) : null}
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-violet-500/20 bg-slate-900/80 p-5 sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
                RC5-003 · Automatic Quantity Optimisation
              </p>

              <h2 className="mt-2 text-3xl font-black">
                AI Marker Quantity Comparison
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
                Compare complete marker solutions, identify the lowest fabric
                consumption per garment, and review the AI recommendation before
                changing the live marker quantity.
              </p>
            </div>

            {batchResult ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <ComparisonBadge
                  label="Analysed"
                  value={String(
                    markerComparison.totalAnalysed
                  )}
                />

                <ComparisonBadge
                  label="Valid"
                  value={String(
                    markerComparison.totalValid
                  )}
                />

                <ComparisonBadge
                  label="Rejected"
                  value={String(
                    markerComparison.totalRejected
                  )}
                />
              </div>
            ) : null}
          </div>

          {!batchResult ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
              <p className="font-black text-slate-300">
                No multi-quantity analysis has been run yet.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use “Analyse Optimum Quantity” above to generate the comparison
                table and AI recommendation.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ComparisonHighlight
                  label="AI Recommended"
                  value={
                    markerComparison.recommendedRow
                      ? `${markerComparison.recommendedRow.garmentsPerMarker} garments`
                      : "No valid solution"
                  }
                  detail={
                    markerComparison.recommendedRow
                      ? `${formatNumber(
                          markerComparison.recommendedRow
                            .utilisationPercent,
                          2
                        )}% utilisation`
                      : "Review rejected solutions"
                  }
                />

                <ComparisonHighlight
                  label="Highest Utilisation"
                  value={
                    markerComparison.highestUtilisationRow
                      ? `${formatNumber(
                          markerComparison.highestUtilisationRow
                            .utilisationPercent,
                          2
                        )}%`
                      : "—"
                  }
                  detail={
                    markerComparison.highestUtilisationRow
                      ? `${markerComparison.highestUtilisationRow.garmentsPerMarker} garments`
                      : "No valid solution"
                  }
                />

                <ComparisonHighlight
                  label="Lowest Consumption"
                  value={
                    markerComparison.lowestConsumptionRow
                      ? `${formatNumber(
                          markerComparison.lowestConsumptionRow
                            .fabricPerGarmentMetres,
                          4
                        )} m`
                      : "—"
                  }
                  detail={
                    markerComparison.lowestConsumptionRow
                      ? `${markerComparison.lowestConsumptionRow.garmentsPerMarker} garments`
                      : "No valid solution"
                  }
                />

                <ComparisonHighlight
                  label="Potential Order Saving"
                  value={`${formatNumber(
                    markerComparison.fabricSavingForOrderMetres,
                    2
                  )} m`}
                  detail={`${markerComparison.recommendationStrength} recommendation`}
                />
              </div>

              {markerComparison.recommendedRow ? (
                <section className="mt-6 rounded-2xl border border-cyan-500/25 bg-cyan-950/10 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                        Why AI selected this marker
                      </p>

                      <h3 className="mt-2 text-2xl font-black">
                        {markerComparison.recommendedRow.garmentsPerMarker} garments gives the strongest current result
                      </h3>

                      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                        The recommendation is based on completed placement, zero unresolved collisions, fabric consumption per garment, utilisation, marker length, production balance and search stability.
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-5 py-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-wide text-emerald-400">
                        Recommendation Strength
                      </p>

                      <p className="mt-2 text-2xl font-black capitalize text-emerald-200">
                        {markerComparison.recommendationStrength}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MarkerMetric
                      label="Complete Pieces"
                      value={`${markerComparison.recommendedRow.piecesPlaced} / ${markerComparison.recommendedRow.expectedPieces}`}
                    />

                    <MarkerMetric
                      label="Collision Status"
                      value={
                        markerComparison.recommendedRow.collisionCount === 0
                          ? "0 · Clear"
                          : String(markerComparison.recommendedRow.collisionCount)
                      }
                    />

                    <MarkerMetric
                      label="Fabric per Garment"
                      value={`${formatNumber(
                        markerComparison.recommendedRow.fabricPerGarmentMetres,
                        4
                      )} m`}
                    />

                    <MarkerMetric
                      label="Engineering Score"
                      value={formatNumber(
                        markerComparison.recommendedRow.engineeringScore ?? 0,
                        1
                      )}
                    />
                  </div>
                </section>
              ) : null}

              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-700">
                <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
                  <thead className="bg-slate-950/80">
                    <tr className="text-xs font-black uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Garments</th>
                      <th className="px-4 py-3">Marker Length</th>
                      <th className="px-4 py-3">Fabric / Garment</th>
                      <th className="px-4 py-3">Utilisation</th>
                      <th className="px-4 py-3">Waste</th>
                      <th className="px-4 py-3">Pieces</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                    {markerComparison.rows.map((row) => (
                      <tr
                        key={row.garmentsPerMarker}
                        className={
                          row.status === "recommended"
                            ? "bg-emerald-950/20"
                            : row.status === "requested"
                              ? "bg-cyan-950/20"
                              : ""
                        }
                      >
                        <td className="px-4 py-3 font-black text-slate-300">
                          {row.rank ?? "—"}
                        </td>

                        <td className="px-4 py-3 font-black text-white">
                          {row.garmentsPerMarker}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {formatNumber(
                            row.markerLengthMetres,
                            3
                          )}{" "}
                          m
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {formatNumber(
                            row.fabricPerGarmentMetres,
                            4
                          )}{" "}
                          m
                        </td>

                        <td className="px-4 py-3 font-black text-emerald-300">
                          {formatNumber(
                            row.utilisationPercent,
                            2
                          )}
                          %
                        </td>

                        <td className="px-4 py-3 text-amber-300">
                          {formatNumber(
                            row.wastePercent,
                            2
                          )}
                          %
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {row.piecesPlaced} /{" "}
                          {row.expectedPieces}
                        </td>

                        <td className="px-4 py-3 font-black text-violet-300">
                          {row.engineeringScore !== null
                            ? formatNumber(
                                row.engineeringScore,
                                1
                              )
                            : "—"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                              row.status === "recommended"
                                ? "border-emerald-400/30 bg-emerald-950/30 text-emerald-300"
                                : row.status === "requested"
                                  ? "border-cyan-400/30 bg-cyan-950/30 text-cyan-300"
                                  : row.status === "rejected"
                                    ? "border-red-400/30 bg-red-950/30 text-red-300"
                                    : "border-slate-600 bg-slate-900 text-slate-400"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {row.complete ? (
                            <button
                              type="button"
                              onClick={() =>
                                setSetsPerMarkerInput(
                                  String(
                                    row.garmentsPerMarker
                                  )
                                )
                              }
                              className="rounded-lg border border-violet-400/30 bg-violet-950/20 px-3 py-2 text-xs font-black text-violet-300 transition hover:bg-violet-900/30"
                            >
                              Show on Canvas
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-red-300">
                              Invalid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {markerAlternatives.length > 0 ? (
                <div className="mt-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Strong Alternatives
                  </p>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {markerAlternatives.map((alternative) => (
                      <div
                        key={alternative.garmentsPerMarker}
                        className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                      >
                        <p className="text-2xl font-black text-white">
                          {alternative.garmentsPerMarker}
                        </p>

                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          garments
                        </p>

                        <p className="mt-3 text-sm font-black text-emerald-300">
                          {formatNumber(
                            alternative.utilisationPercent,
                            2
                          )}
                          % utilisation
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatNumber(
                            alternative.fabricPerGarmentMetres,
                            4
                          )}{" "}
                          m per garment
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/* ============================== Presentation ============================== */

function NumberField({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
      />
    </label>
  );
}

/** Step 4A — a labelled dropdown for one FabricProfile field. */
function FabricSelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: ReadonlyArray<{ readonly value: TValue; readonly label: string }>;
  onChange: (value: TValue) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none transition focus:border-cyan-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function optionLabel<TValue extends string>(
  options: ReadonlyArray<{ readonly value: TValue; readonly label: string }>,
  value: TValue
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function MarkerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}

function MarkerMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
      <div className="flex min-w-0 flex-col gap-2">
        <span className="break-words text-[11px] font-bold uppercase leading-4 tracking-wide text-slate-400">
          {label}
        </span>

        <span className="break-words text-left text-base font-black leading-5 text-white">
          {value}
        </span>
      </div>
    </div>
  );
}

function ComparisonBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-950/10 px-4 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-violet-200">
        {value}
      </p>
    </div>
  );
}

function ComparisonHighlight({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-xs font-bold text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function PatternQueueItem({
  pattern,
  index,
  setsPerMarker,
  fabricProfile,
  lang,
}: {
  pattern: MarkerGeometryPattern;
  index: number;
  setsPerMarker: number;
  fabricProfile: FabricProfile;
  lang: ReturnType<typeof createEngineeringLanguageService>;
}) {
  const width = pattern.dimensions.widthCm;
  const height = pattern.dimensions.heightCm;
  const area = pattern.polygon.area.squareCm;

  const cutQuantity = resolveCutQuantity(pattern);

  /**
   * Step 4C §4 — reads the SAME canonical composed result already used to
   * gate real placements (resolveRotationPolicy), never a recalculation.
   */
  const effectiveRotation = resolveRotationPolicy(pattern, fabricProfile);

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-black text-violet-300">
          {index}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-black text-white">
            {pattern.recognisedName}
          </p>

          <p className="mt-1 truncate text-xs text-slate-600">
            {cutQuantity} per garment · {cutQuantity * setsPerMarker} in
            marker
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <QueueValue
          label={lang.term("width")}
          value={
            typeof width === "number" ? `${formatNumber(width)} cm` : "—"
          }
        />

        <QueueValue
          label={lang.term("height")}
          value={
            typeof height === "number" ? `${formatNumber(height)} cm` : "—"
          }
        />

        <QueueValue
          label={lang.term("area")}
          value={typeof area === "number" ? `${formatNumber(area)} cm²` : "—"}
        />

        <QueueValue
          label={lang.term("engineeringScore")}
          value={`${pattern.engineeringScore}%`}
        />
      </div>

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/40 p-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-600">
          {lang.term("effectiveMarkerConstraints")}
        </p>

        <p className="mt-1 text-xs font-bold text-slate-300">
          {lang.term("permitted")}:{" "}
          {effectiveRotation.permittedRotations.length > 0
            ? effectiveRotation.permittedRotations.map((angle) => `${angle}°`).join(", ")
            : lang.term("none")}
          {effectiveRotation.grainRestricted ? ` · ${lang.term("grainLocked")}` : ""}
          {effectiveRotation.directionRestricted ? ` · ${lang.term("directionLocked")}` : ""}
        </p>
      </div>
    </article>
  );
}

function QueueValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-slate-300">{value}</p>
    </div>
  );
}