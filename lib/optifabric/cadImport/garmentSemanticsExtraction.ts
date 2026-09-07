/**
 * OptiFabric AI
 * RC5-005-007 — Garment Semantic Extraction (Step 5B §9, §12, §13, §15)
 *
 * Purpose:
 * - Separate layer from dxfEntityExtraction.ts (generic DXF capability):
 *   this file makes HEURISTIC garment-specific judgement calls — which
 *   closed shape is the outer cutting contour, which points are notches vs
 *   drill marks, which line is the grainline, which text is a piece
 *   name/code/size.
 * - The Step 5A audit found no repository evidence of a single, confirmed
 *   AAMA/factory layer-naming convention. The keyword lists below are
 *   therefore explicitly labelled HEURISTIC and exported so they can be
 *   tuned once a genuine factory file is available (Step 5C) — this file
 *   does not hardwire one assumed Gerber/Lectra convention; it is a
 *   best-effort default that a real file may well not match, in which case
 *   the result legitimately falls back to "no evidence found" rather than
 *   a wrong guess.
 */

import type { ExtractedDrawing, ExtractedPoint, ExtractedText } from "./dxfEntityExtraction";
import type { FlatPoint } from "./curveFlattening";

/** HEURISTIC layer-name keyword lists — not a confirmed standard. See file header. */
export const GARMENT_LAYER_KEYWORDS = {
  notch: ["notch"],
  drill: ["drill", "awl"],
  grain: ["grain", "grainline"],
  internalConstruction: ["internal", "construction", "seam", "reference", "fold"],
} as const;

function layerMatches(layerName: string, keywords: ReadonlyArray<string>): boolean {
  const lowered = layerName.toLowerCase();
  return keywords.some((keyword) => lowered.includes(keyword));
}

function polygonArea(points: ReadonlyArray<FlatPoint>): number {
  if (points.length < 3) {
    return 0;
  }

  let doubled = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    doubled += current.x * next.y - next.x * current.y;
  }

  return Math.abs(doubled) / 2;
}

function isClosed(points: ReadonlyArray<FlatPoint>): boolean {
  if (points.length < 3) {
    return false;
  }

  const first = points[0];
  const last = points[points.length - 1];

  return Math.hypot(first.x - last.x, first.y - last.y) < 1e-6;
}

function pointInBoundingBox(
  point: FlatPoint,
  points: ReadonlyArray<FlatPoint>
): boolean {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const vertex of points) {
    minX = Math.min(minX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxX = Math.max(maxX, vertex.x);
    maxY = Math.max(maxY, vertex.y);
  }

  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  );
}

export interface OuterContourCandidate {
  readonly points: ReadonlyArray<FlatPoint>;
  readonly layer: string;
  readonly area: number;
}

/**
 * Picks the largest closed shape as the piece's outer cutting contour — the
 * standard heuristic for a single-piece DXF (a garment piece file's biggest
 * closed loop is its cutting line; everything smaller is internal detail).
 * Explicitly a heuristic: a multi-piece DXF or one using a non-obvious
 * layer convention may need a different selection strategy in Step 5C.
 */
export function selectOuterContour(
  drawing: ExtractedDrawing
): OuterContourCandidate | null {
  const closedCandidates = drawing.polylines
    .filter((polyline) => polyline.closed || isClosed(polyline.points))
    .map((polyline) => ({
      points: polyline.points,
      layer: polyline.layer,
      area: polygonArea(polyline.points),
    }))
    .filter((candidate) => candidate.area > 0);

  if (closedCandidates.length > 0) {
    return closedCandidates.reduce((largest, candidate) =>
      candidate.area > largest.area ? candidate : largest
    );
  }

  // No closed shape exists at all. Rather than reporting a generic "missing
  // outer contour" for a file that clearly has geometry, fall back to the
  // largest OPEN polyline so the Import Validation Gate can reject it with
  // the specific, more useful "openContour" diagnostic (Step 5B §8).
  const openCandidates = drawing.polylines
    .filter((polyline) => polyline.points.length >= 2)
    .map((polyline) => ({
      points: polyline.points,
      layer: polyline.layer,
      area: polygonArea(polyline.points),
    }));

  if (openCandidates.length === 0) {
    return null;
  }

  return openCandidates.reduce((largest, candidate) =>
    candidate.points.length > largest.points.length ? candidate : largest
  );
}

export interface ClassifiedPoints {
  readonly notches: ReadonlyArray<ExtractedPoint>;
  readonly drillPoints: ReadonlyArray<ExtractedPoint>;
  readonly unclassified: ReadonlyArray<ExtractedPoint>;
}

/**
 * Classifies POINT entities as notches vs. drill points using layer-name
 * keywords first (explicit evidence); falls back to a position heuristic
 * only when no layer evidence exists (points on the outer contour boundary
 * are more likely notches, points strictly inside are more likely drill
 * marks) — and even then only within the outer contour's bounding box, so
 * clearly unrelated points are left "unclassified" rather than guessed.
 */
export function classifyPoints(
  points: ReadonlyArray<ExtractedPoint>,
  outerContour: OuterContourCandidate | null
): ClassifiedPoints {
  const notches: ExtractedPoint[] = [];
  const drillPoints: ExtractedPoint[] = [];
  const unclassified: ExtractedPoint[] = [];

  for (const point of points) {
    if (layerMatches(point.layer, GARMENT_LAYER_KEYWORDS.notch)) {
      notches.push(point);
      continue;
    }

    if (layerMatches(point.layer, GARMENT_LAYER_KEYWORDS.drill)) {
      drillPoints.push(point);
      continue;
    }

    if (outerContour && pointInBoundingBox(point.position, outerContour.points)) {
      // No layer evidence — record as unclassified rather than guessing
      // notch vs. drill from position alone; position alone is not
      // reliable evidence per the Step 5A "do not invent support" rule.
      unclassified.push(point);
      continue;
    }

    unclassified.push(point);
  }

  return { notches, drillPoints, unclassified };
}

export interface ClassifiedGrainline {
  readonly start: FlatPoint;
  readonly end: FlatPoint;
  readonly layer: string;
}

/** Finds a LINE on a grain-keyword-matching layer, if any. No fallback guess. */
export function findGrainline(
  drawing: ExtractedDrawing
): ClassifiedGrainline | null {
  const candidate = drawing.lines.find((line) =>
    layerMatches(line.layer, GARMENT_LAYER_KEYWORDS.grain)
  );

  if (!candidate) {
    return null;
  }

  return { start: candidate.start, end: candidate.end, layer: candidate.layer };
}

export interface TextEvidence {
  readonly pieceCode?: string;
  readonly pieceName?: string;
  readonly size?: string;
  readonly allNearbyText: ReadonlyArray<string>;
}

/**
 * Extracts piece name/code/size CANDIDATES from TEXT/MTEXT near the piece.
 * Deliberately conservative: only a size-shaped token (e.g. "32", "S", "M",
 * "L", "XL") is offered as `size`; the first remaining text is offered as
 * `pieceName`. Nothing is invented when no text exists nearby.
 */
export function extractTextEvidence(
  texts: ReadonlyArray<ExtractedText>,
  outerContour: OuterContourCandidate | null
): TextEvidence {
  const nearby = outerContour
    ? texts.filter((text) => pointInBoundingBox(text.position, outerContour.points))
    : texts;

  const allNearbyText = nearby.map((text) => text.text);

  const sizePattern = /^(XXS|XS|S|M|L|XL|XXL|XXXL|\d{1,3})$/i;

  const sizeCandidate = nearby.find((text) => sizePattern.test(text.text.trim()));
  const nameCandidate = nearby.find((text) => text !== sizeCandidate);

  return {
    pieceCode: undefined, // No repository-confirmed convention for a distinct "code" vs "name" token — left unset rather than guessed.
    pieceName: nameCandidate?.text,
    size: sizeCandidate?.text,
    allNearbyText,
  };
}
