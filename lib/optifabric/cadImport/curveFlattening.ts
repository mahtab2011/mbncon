/**
 * OptiFabric AI
 * RC5-005-004 — Physical-Tolerance Curve Flattening (Step 5B §7)
 *
 * Purpose:
 * - The live marker consumes straight-edge polygons only (confirmed in the
 *   Step 5A audit — the nesting/collision/rotation stack has no arc/curve
 *   representation anywhere). Genuine garment CAD curves (armholes,
 *   necklines, sleeve heads, crotch curves) must therefore be converted to
 *   polygon segments before they can reach that pipeline.
 * - This module chooses segment counts from an explicit PHYSICAL chord-
 *   deviation tolerance (in centimetres), not an arbitrary fixed segment
 *   count, per the Step 5A/5B instruction. All inputs/outputs are already
 *   in canonical centimetres — this module has no unit-conversion role.
 *
 * Known limitation (reported, not hidden): flattenSpline() evaluates
 * NON-RATIONAL B-splines via De Boor's algorithm. A rational spline
 * (`rational: true`, i.e. with per-control-point weights) is flattened
 * using the same control points and knots but ignoring weights — this is
 * an approximation, not an exact NURBS evaluation. Flagged in the entity
 * support matrix as PARTIALLY SUPPORTED for rational splines.
 */

export interface CurveFlatteningTolerance {
  /** Maximum allowed chord deviation from the true curve, in centimetres. */
  readonly maxChordDeviationCm: number;
}

/** 0.5 mm — a reasonable default for garment pattern cutting accuracy; explicit and overridable, never silently assumed elsewhere. */
export const DEFAULT_CURVE_TOLERANCE: CurveFlatteningTolerance = {
  maxChordDeviationCm: 0.05,
};

const MAXIMUM_ARC_SEGMENTS = 2000;
const MAXIMUM_SPLINE_SAMPLES = 4000;

export interface FlatPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Flattens a circular arc into a polyline meeting the chord-deviation
 * tolerance. Uses the standard sagitta relationship: for a chord subtending
 * angle theta on a circle of radius r, the maximum deviation between the
 * chord and the arc is r * (1 - cos(theta / 2)). Solved for theta given the
 * requested tolerance.
 */
export function flattenArc(
  center: FlatPoint,
  radiusCm: number,
  startAngleDegrees: number,
  endAngleDegrees: number,
  tolerance: CurveFlatteningTolerance = DEFAULT_CURVE_TOLERANCE
): FlatPoint[] {
  if (!(radiusCm > 0)) {
    return [];
  }

  let sweepDegrees = endAngleDegrees - startAngleDegrees;

  while (sweepDegrees <= 0) {
    sweepDegrees += 360;
  }

  const sweepRadians = (sweepDegrees * Math.PI) / 180;

  const clampedRatio = Math.min(
    1,
    Math.max(0, tolerance.maxChordDeviationCm / radiusCm)
  );

  const maxThetaPerSegment =
    clampedRatio >= 1 ? sweepRadians : 2 * Math.acos(1 - clampedRatio);

  const segmentCount = Math.min(
    MAXIMUM_ARC_SEGMENTS,
    Math.max(1, Math.ceil(sweepRadians / Math.max(maxThetaPerSegment, 1e-6)))
  );

  const points: FlatPoint[] = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const angleDegrees =
      startAngleDegrees + (sweepDegrees * index) / segmentCount;

    const angleRadians = (angleDegrees * Math.PI) / 180;

    points.push({
      x: center.x + radiusCm * Math.cos(angleRadians),
      y: center.y + radiusCm * Math.sin(angleRadians),
    });
  }

  return points;
}

export function flattenCircle(
  center: FlatPoint,
  radiusCm: number,
  tolerance: CurveFlatteningTolerance = DEFAULT_CURVE_TOLERANCE
): FlatPoint[] {
  return flattenArc(center, radiusCm, 0, 360, tolerance);
}

/**
 * Evaluates a (non-rational) B-spline at parameter `t` via De Boor's
 * algorithm.
 */
function deBoor(
  degree: number,
  knots: ReadonlyArray<number>,
  controlPoints: ReadonlyArray<FlatPoint>,
  t: number
): FlatPoint {
  const clampedT = Math.min(
    knots[knots.length - degree - 1],
    Math.max(knots[degree], t)
  );

  let span = degree;

  for (let index = degree; index < knots.length - degree - 1; index += 1) {
    if (clampedT >= knots[index] && clampedT < knots[index + 1]) {
      span = index;
    }
  }

  if (clampedT >= knots[knots.length - degree - 1]) {
    span = knots.length - degree - 2;
  }

  const d: FlatPoint[] = [];

  for (let j = 0; j <= degree; j += 1) {
    const point = controlPoints[span - degree + j];
    d.push(point ? { ...point } : { x: 0, y: 0 });
  }

  for (let r = 1; r <= degree; r += 1) {
    for (let j = degree; j >= r; j -= 1) {
      const left = knots[span - degree + j];
      const right = knots[span + 1 + j - r];
      const denominator = right - left;

      const alpha = denominator === 0 ? 0 : (clampedT - left) / denominator;

      d[j] = {
        x: (1 - alpha) * d[j - 1].x + alpha * d[j].x,
        y: (1 - alpha) * d[j - 1].y + alpha * d[j].y,
      };
    }
  }

  return d[degree];
}

/**
 * Flattens a B-spline into a polyline meeting (approximately) the requested
 * chord-deviation tolerance, via adaptive doubling: sample at an increasing
 * density until adding more samples changes the midpoint deviation by less
 * than the tolerance, capped at MAXIMUM_SPLINE_SAMPLES for safety.
 */
export function flattenSpline(
  degree: number,
  knots: ReadonlyArray<number>,
  controlPoints: ReadonlyArray<FlatPoint>,
  tolerance: CurveFlatteningTolerance = DEFAULT_CURVE_TOLERANCE
): FlatPoint[] {
  if (controlPoints.length === 0 || degree < 1 || knots.length === 0) {
    return [];
  }

  if (controlPoints.length === 1) {
    return [controlPoints[0]];
  }

  const tMin = knots[degree];
  const tMax = knots[knots.length - degree - 1];

  function sample(count: number): FlatPoint[] {
    const points: FlatPoint[] = [];

    for (let index = 0; index <= count; index += 1) {
      const t = tMin + ((tMax - tMin) * index) / count;
      points.push(deBoor(degree, knots, controlPoints, t));
    }

    return points;
  }

  function maxMidpointDeviation(points: FlatPoint[]): number {
    let worst = 0;

    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const midT =
        tMin +
        ((tMax - tMin) * (index + 0.5)) / (points.length - 1);

      const trueMid = deBoor(degree, knots, controlPoints, midT);
      const chordMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };

      const deviation = Math.hypot(
        trueMid.x - chordMid.x,
        trueMid.y - chordMid.y
      );

      worst = Math.max(worst, deviation);
    }

    return worst;
  }

  let sampleCount = Math.max(controlPoints.length * 4, 16);
  let points = sample(sampleCount);

  while (
    maxMidpointDeviation(points) > tolerance.maxChordDeviationCm &&
    sampleCount < MAXIMUM_SPLINE_SAMPLES
  ) {
    sampleCount = Math.min(MAXIMUM_SPLINE_SAMPLES, sampleCount * 2);
    points = sample(sampleCount);
  }

  return points;
}
