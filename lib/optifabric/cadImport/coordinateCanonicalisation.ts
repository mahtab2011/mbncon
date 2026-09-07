/**
 * OptiFabric AI
 * RC5-005-005 — Single Coordinate Canonicalisation Boundary (Step 5B §6, §9)
 *
 * Purpose:
 * - This is the ONE place DXF coordinates are converted into OptiFabric's
 *   canonical piece-local convention. No other file in lib/optifabric/cadImport
 *   performs a unit conversion or axis transform — every extractor upstream
 *   (dxfEntityExtraction.ts) works in raw DXF units/axes, and everything
 *   downstream works in the canonical convention this file defines.
 *
 * Canonical convention (matches lib/optifabric/patternGeometryEngine.ts's
 * existing photo-tracing pipeline exactly, confirmed in the Step 5A audit —
 * app/optifabric/project/[projectId]/marker/page.tsx:1602-1605):
 * - Units: centimetres.
 * - Origin: the piece's own outer-contour bounding-box minimum (x, y) —
 *   i.e. piece-local, not document-global.
 * - Y-axis: DXF is Y-up (mathematical/Cartesian convention — positive Y
 *   points toward the top of the drawing). OptiFabric's existing traced-photo
 *   pieces are Y-down in piece-local space (inherited from on-screen pixel
 *   tracing, where Y increases downward) — and a garment piece is normally
 *   photographed/traced with its hem lower in the image, so increasing
 *   piece-local Y already means "toward the hem" for those pieces.
 *
 *   To keep DXF-imported pieces consistent with that existing "increasing Y
 *   = toward hem" convention (which matters once grainline direction and
 *   nap/directional restrictions are eventually evaluated against real
 *   imported orientation, not just a boolean), this boundary FLIPS the DXF
 *   Y axis: canonicalY = (boundingBoxMaxY - rawY). A typical garment CAD
 *   piece is drawn with higher Y toward the waist/collar and lower Y toward
 *   the hem, so after this flip, increasing canonical Y again means "toward
 *   the hem" — consistent with the existing pipeline.
 *
 *   IMPORTANT — this specific up/down assumption is a documented judgement
 *   call, not a confirmed fact: the Step 5A audit found no repository
 *   evidence establishing a universal AAMA/factory convention for which
 *   direction a piece is drawn in. It must be validated against a genuine
 *   factory DXF export in Step 5C before being trusted for anything beyond
 *   engineering test fixtures. If it proves wrong, the fix is a one-line
 *   change to this single function — never scattered adapter-site changes,
 *   exactly the lesson from Step 3C's axis-convention incident.
 */

import type { CadUnit } from "./importedPatternSetTypes";
import { convertToCentimetres } from "./unitDetection";

export interface RawCadPoint {
  readonly x: number;
  readonly y: number;
}

export interface CanonicalisedPoint {
  readonly x: number;
  readonly y: number;
}

export interface CanonicalisationResult {
  readonly points: ReadonlyArray<CanonicalisedPoint>;
  readonly widthCm: number;
  readonly heightCm: number;
}

/**
 * Canonicalises one closed contour (or any point set that should share one
 * origin) from raw DXF units/axes into the OptiFabric convention described
 * above. `referenceBounds`, when supplied, forces the origin/flip to be
 * computed from a DIFFERENT point set (the piece's own outer contour) so
 * that internal lines/notches/drill points/grainline for the same piece
 * share exactly one coordinate frame — never independently re-originated.
 */
export function canonicalisePoints(
  rawPoints: ReadonlyArray<RawCadPoint>,
  unit: CadUnit,
  referenceBounds?: {
    readonly minX: number;
    readonly minY: number;
    readonly maxY: number;
  }
): CanonicalisationResult {
  if (rawPoints.length === 0) {
    return { points: [], widthCm: 0, heightCm: 0 };
  }

  const cmPoints = rawPoints.map((point) => ({
    x: convertToCentimetres(point.x, unit),
    y: convertToCentimetres(point.y, unit),
  }));

  let minX = referenceBounds
    ? convertToCentimetres(referenceBounds.minX, unit)
    : Number.POSITIVE_INFINITY;
  let minY = referenceBounds
    ? convertToCentimetres(referenceBounds.minY, unit)
    : Number.POSITIVE_INFINITY;
  let maxY = referenceBounds
    ? convertToCentimetres(referenceBounds.maxY, unit)
    : Number.NEGATIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;

  if (!referenceBounds) {
    for (const point of cmPoints) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }

  for (const point of cmPoints) {
    maxX = Math.max(maxX, point.x);
  }

  const points = cmPoints.map((point) => ({
    x: point.x - minX,
    // The single documented Y-flip: see file header.
    y: maxY - point.y,
  }));

  return {
    points,
    widthCm: maxX - minX,
    heightCm: maxY - minY,
  };
}

/** Computes bounding-box min/max in raw (pre-canonicalisation) units — used to derive a shared reference frame for a whole piece from its outer contour alone. */
export function computeRawBounds(
  rawPoints: ReadonlyArray<RawCadPoint>
): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of rawPoints) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return { minX, minY, maxX, maxY };
}
