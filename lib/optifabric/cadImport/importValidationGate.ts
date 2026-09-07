/**
 * OptiFabric AI
 * RC5-005-009 — Import Validation Gate (Step 5B §8)
 *
 * Purpose:
 * - A PRE-MARKER gate that decides whether imported PATTERN DATA is
 *   trustworthy enough to be canonicalised into ImportedPatternSet at all.
 * - This is explicitly NOT the Production Safety Gate
 *   (productionSafetyGateEngine.ts, untouched by Step 5B). That gate
 *   evaluates a completed MARKER (placement, collisions, rotation
 *   compliance). This gate evaluates raw geometry before a marker is ever
 *   attempted — a piece can fail here for reasons a marker gate has no
 *   concept of (self-intersection, unknown units, NaN coordinates).
 */

import type { CadUnitState } from "./importedPatternSetTypes";
import type { FlatPoint } from "./curveFlattening";
import { DXF_SECURITY_LIMITS } from "./dxfSecurityLimits";

export type ImportValidationOutcome =
  | "IMPORT_ACCEPTED"
  | "ENGINEERING_CONFIRMATION_REQUIRED"
  | "IMPORT_REJECTED";

export interface ImportValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly severity: "reject" | "confirm";
}

export interface ImportValidationResult {
  readonly outcome: ImportValidationOutcome;
  readonly issues: ReadonlyArray<ImportValidationIssue>;
}

function hasNonFiniteCoordinate(points: ReadonlyArray<FlatPoint>): boolean {
  return points.some(
    (point) => !Number.isFinite(point.x) || !Number.isFinite(point.y)
  );
}

function hasExtremeCoordinate(points: ReadonlyArray<FlatPoint>): boolean {
  return points.some(
    (point) =>
      Math.abs(point.x) > DXF_SECURITY_LIMITS.maximumCoordinateMagnitudeCm ||
      Math.abs(point.y) > DXF_SECURITY_LIMITS.maximumCoordinateMagnitudeCm
  );
}

function hasDuplicateConsecutiveVertices(
  points: ReadonlyArray<FlatPoint>
): boolean {
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index];
    const b = points[index + 1];

    if (Math.hypot(a.x - b.x, a.y - b.y) < 1e-9) {
      return true;
    }
  }

  return false;
}

function isOpenContour(points: ReadonlyArray<FlatPoint>): boolean {
  if (points.length < 3) {
    return true;
  }

  const first = points[0];
  const last = points[points.length - 1];

  return Math.hypot(first.x - last.x, first.y - last.y) > 1e-6;
}

function signedArea(points: ReadonlyArray<FlatPoint>): number {
  let doubled = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    doubled += current.x * next.y - next.x * current.y;
  }

  return doubled / 2;
}

function segmentsIntersect(
  p1: FlatPoint,
  p2: FlatPoint,
  p3: FlatPoint,
  p4: FlatPoint
): boolean {
  function direction(a: FlatPoint, b: FlatPoint, c: FlatPoint): number {
    return (c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y);
  }

  const d1 = direction(p3, p4, p1);
  const d2 = direction(p3, p4, p2);
  const d3 = direction(p1, p2, p3);
  const d4 = direction(p1, p2, p4);

  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  );
}

/**
 * Simple O(n^2) self-intersection check on the outer contour's straight
 * segments (post-curve-flattening, so this also catches an arc/spline that
 * loops back on itself). O(n^2) is acceptable here given the security
 * limit already caps a single contour's vertex count.
 */
function isSelfIntersecting(points: ReadonlyArray<FlatPoint>): boolean {
  const segmentCount = points.length - 1;

  for (let i = 0; i < segmentCount; i += 1) {
    for (let j = i + 1; j < segmentCount; j += 1) {
      const adjacent = Math.abs(i - j) <= 1 || (i === 0 && j === segmentCount - 1);

      if (adjacent) {
        continue;
      }

      if (
        segmentsIntersect(points[i], points[i + 1], points[j], points[j + 1])
      ) {
        return true;
      }
    }
  }

  return false;
}

export interface ImportValidationInput {
  readonly outerContour: ReadonlyArray<FlatPoint> | null;
  readonly unit: CadUnitState;
  readonly cutQuantity?: number;
  readonly widthCm: number;
  readonly heightCm: number;
}

/** Plausible garment-piece bounding dimension range, in centimetres. Outside this, the file is almost certainly mis-scaled or mis-parsed, not a genuine tiny/huge garment piece. */
const PLAUSIBLE_MIN_DIMENSION_CM = 0.5;
const PLAUSIBLE_MAX_DIMENSION_CM = 300;

export function validateImportedPiece(
  input: ImportValidationInput
): ImportValidationResult {
  const issues: ImportValidationIssue[] = [];

  if (!input.outerContour || input.outerContour.length === 0) {
    return {
      outcome: "IMPORT_REJECTED",
      issues: [
        {
          code: "missingOuterContour",
          message: "No outer cutting contour could be identified for this piece.",
          severity: "reject",
        },
      ],
    };
  }

  if (hasNonFiniteCoordinate(input.outerContour)) {
    issues.push({
      code: "nonFiniteCoordinate",
      message: "The outer contour contains a NaN or infinite coordinate.",
      severity: "reject",
    });
  }

  if (hasExtremeCoordinate(input.outerContour)) {
    issues.push({
      code: "extremeCoordinate",
      message: `A coordinate exceeds the ${DXF_SECURITY_LIMITS.maximumCoordinateMagnitudeCm} cm plausibility limit.`,
      severity: "reject",
    });
  }

  if (isOpenContour(input.outerContour)) {
    issues.push({
      code: "openContour",
      message: "The outer contour is not closed (start and end points do not coincide).",
      severity: "reject",
    });
  }

  if (hasDuplicateConsecutiveVertices(input.outerContour)) {
    issues.push({
      code: "duplicateVertices",
      message: "The outer contour contains duplicate/degenerate consecutive vertices.",
      severity: "confirm",
    });
  }

  const area = Math.abs(signedArea(input.outerContour));

  if (area < 1e-6) {
    issues.push({
      code: "zeroArea",
      message: "The outer contour encloses zero (or near-zero) area.",
      severity: "reject",
    });
  }

  if (!issues.some((issue) => issue.severity === "reject") && !isOpenContour(input.outerContour)) {
    if (isSelfIntersecting(input.outerContour)) {
      issues.push({
        code: "selfIntersecting",
        message: "The outer contour self-intersects.",
        severity: "reject",
      });
    }
  }

  if (input.unit.confidence !== "detected") {
    issues.push({
      code: "unitUnconfirmed",
      message: input.unit.note,
      severity: "confirm",
    });
  }

  if (
    input.unit.confidence === "detected" &&
    (input.widthCm < PLAUSIBLE_MIN_DIMENSION_CM ||
      input.widthCm > PLAUSIBLE_MAX_DIMENSION_CM ||
      input.heightCm < PLAUSIBLE_MIN_DIMENSION_CM ||
      input.heightCm > PLAUSIBLE_MAX_DIMENSION_CM)
  ) {
    issues.push({
      code: "implausibleDimensions",
      message: `Piece bounding box is ${input.widthCm.toFixed(1)} x ${input.heightCm.toFixed(
        1
      )} cm, outside the ${PLAUSIBLE_MIN_DIMENSION_CM}-${PLAUSIBLE_MAX_DIMENSION_CM} cm plausible garment-piece range. This often indicates a unit error even when a unit was detected.`,
      severity: "confirm",
    });
  }

  if (input.cutQuantity !== undefined && (!Number.isFinite(input.cutQuantity) || input.cutQuantity < 1)) {
    issues.push({
      code: "invalidQuantity",
      message: `Cut quantity ${input.cutQuantity} is not a valid positive integer.`,
      severity: "reject",
    });
  }

  if (input.cutQuantity === undefined) {
    issues.push({
      code: "missingQuantity",
      message: "No cut quantity could be determined from the source file.",
      severity: "confirm",
    });
  }

  const hasRejection = issues.some((issue) => issue.severity === "reject");
  const hasConfirmation = issues.some((issue) => issue.severity === "confirm");

  const outcome: ImportValidationOutcome = hasRejection
    ? "IMPORT_REJECTED"
    : hasConfirmation
      ? "ENGINEERING_CONFIRMATION_REQUIRED"
      : "IMPORT_ACCEPTED";

  return { outcome, issues };
}
