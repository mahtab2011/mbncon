import type {
  PatternGeometry,
  PatternGeometryConfidence,
  PatternGeometryPoint,
  PatternGeometryValidation,
  PatternGeometryWarning,
} from "@/lib/optifabric/geometry/patternGeometry";

import {
  GEOMETRY_EPSILON,
  MINIMUM_PATTERN_POLYGON_POINTS,
  analysePolygonGeometry,
  calculatePatternBoundingBox,
  calculatePointDistance,
  isValidScaleCalibration,
  normalisePolygonPoints,
} from "@/lib/optifabric/geometry/polygonGeometryEngine";

/**
 * OptiFabric AI Geometry Validation Engine
 *
 * This engine checks whether a traced pattern is technically reliable
 * enough for marker planning, fabric consumption and waste analysis.
 *
 * It validates:
 *
 * - Uploaded image availability
 * - Minimum polygon points
 * - Closed pattern boundary
 * - Duplicate points
 * - Self-intersections
 * - Scale calibration
 * - Width and height
 * - Polygon area
 * - Grain-line readiness
 * - AI confidence
 * - Marker readiness
 */

/**
 * Minimum acceptable AI confidence for marker planning.
 */
export const MINIMUM_MARKER_CONFIDENCE_SCORE = 55;

/**
 * Minimum realistic pattern dimension in millimetres.
 *
 * This prevents accidental zero-size or tiny invalid traced shapes.
 */
export const MINIMUM_REAL_PATTERN_DIMENSION_MM = 2;

/**
 * Maximum realistic pattern dimension in millimetres.
 *
 * This is intentionally generous so large industrial garment components
 * can still pass validation.
 */
export const MAXIMUM_REAL_PATTERN_DIMENSION_MM = 5000;

/**
 * Minimum acceptable real polygon area in square millimetres.
 */
export const MINIMUM_REAL_PATTERN_AREA_SQ_MM = 4;

/**
 * Internal geometry validation result.
 */
export interface GeometryValidationResult {
  validation: PatternGeometryValidation;
  confidence: PatternGeometryConfidence;
  markerReady: boolean;
  status:
    | "validation-required"
    | "validated"
    | "warning"
    | "failed";
}

/**
 * Creates a stable validation warning ID.
 */
function createWarningId(
  patternId: string,
  code: PatternGeometryWarning["code"],
  index: number
): string {
  return `${patternId}-${code}-${index}`;
}

/**
 * Creates one validation warning.
 */
function createWarning(
  patternId: string,
  code: PatternGeometryWarning["code"],
  severity: PatternGeometryWarning["severity"],
  title: string,
  message: string,
  index: number
): PatternGeometryWarning {
  return {
    id: createWarningId(patternId, code, index),
    code,
    severity,
    title,
    message,
    resolved: false,
  };
}

/**
 * Restricts a score to the range of 0 to 100.
 */
function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Converts a numerical confidence score into a confidence level.
 */
function getConfidenceLevel(
  score: number
): PatternGeometryConfidence["level"] {
  const safeScore = clampScore(score);

  if (safeScore >= 90) {
    return "very-high";
  }

  if (safeScore >= 75) {
    return "high";
  }

  if (safeScore >= 55) {
    return "medium";
  }

  if (safeScore >= 30) {
    return "low";
  }

  return "very-low";
}

/**
 * Detects whether the point list contains any duplicate points.
 */
export function hasDuplicateGeometryPoints(
  points: PatternGeometryPoint[]
): boolean {
  const normalisedPoints =
    normalisePolygonPoints(points);

  for (
    let firstIndex = 0;
    firstIndex < normalisedPoints.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < normalisedPoints.length;
      secondIndex += 1
    ) {
      const distance = calculatePointDistance(
        normalisedPoints[firstIndex],
        normalisedPoints[secondIndex]
      );

      if (distance <= GEOMETRY_EPSILON) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculates the orientation value for three points.
 */
function calculateOrientation(
  firstPoint: PatternGeometryPoint,
  secondPoint: PatternGeometryPoint,
  thirdPoint: PatternGeometryPoint
): number {
  return (
    (secondPoint.y - firstPoint.y) *
      (thirdPoint.x - secondPoint.x) -
    (secondPoint.x - firstPoint.x) *
      (thirdPoint.y - secondPoint.y)
  );
}

/**
 * Checks whether a point lies on a line segment.
 */
function isPointOnSegment(
  firstPoint: PatternGeometryPoint,
  candidatePoint: PatternGeometryPoint,
  secondPoint: PatternGeometryPoint
): boolean {
  return (
    candidatePoint.x <=
      Math.max(firstPoint.x, secondPoint.x) +
        GEOMETRY_EPSILON &&
    candidatePoint.x >=
      Math.min(firstPoint.x, secondPoint.x) -
        GEOMETRY_EPSILON &&
    candidatePoint.y <=
      Math.max(firstPoint.y, secondPoint.y) +
        GEOMETRY_EPSILON &&
    candidatePoint.y >=
      Math.min(firstPoint.y, secondPoint.y) -
        GEOMETRY_EPSILON
  );
}

/**
 * Checks whether two line segments intersect.
 */
function doLineSegmentsIntersect(
  firstStart: PatternGeometryPoint,
  firstEnd: PatternGeometryPoint,
  secondStart: PatternGeometryPoint,
  secondEnd: PatternGeometryPoint
): boolean {
  const orientationOne = calculateOrientation(
    firstStart,
    firstEnd,
    secondStart
  );

  const orientationTwo = calculateOrientation(
    firstStart,
    firstEnd,
    secondEnd
  );

  const orientationThree = calculateOrientation(
    secondStart,
    secondEnd,
    firstStart
  );

  const orientationFour = calculateOrientation(
    secondStart,
    secondEnd,
    firstEnd
  );

  const generalIntersection =
    orientationOne * orientationTwo < 0 &&
    orientationThree * orientationFour < 0;

  if (generalIntersection) {
    return true;
  }

  if (
    Math.abs(orientationOne) <= GEOMETRY_EPSILON &&
    isPointOnSegment(
      firstStart,
      secondStart,
      firstEnd
    )
  ) {
    return true;
  }

  if (
    Math.abs(orientationTwo) <= GEOMETRY_EPSILON &&
    isPointOnSegment(
      firstStart,
      secondEnd,
      firstEnd
    )
  ) {
    return true;
  }

  if (
    Math.abs(orientationThree) <= GEOMETRY_EPSILON &&
    isPointOnSegment(
      secondStart,
      firstStart,
      secondEnd
    )
  ) {
    return true;
  }

  if (
    Math.abs(orientationFour) <= GEOMETRY_EPSILON &&
    isPointOnSegment(
      secondStart,
      firstEnd,
      secondEnd
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Determines whether two polygon edges are adjacent.
 *
 * Adjacent edges share an endpoint and should not be treated as an invalid
 * self-intersection.
 */
function arePolygonEdgesAdjacent(
  firstEdgeIndex: number,
  secondEdgeIndex: number,
  pointCount: number
): boolean {
  if (
    Math.abs(firstEdgeIndex - secondEdgeIndex) === 1
  ) {
    return true;
  }

  const firstIsOpeningEdge =
    firstEdgeIndex === 0;

  const secondIsClosingEdge =
    secondEdgeIndex === pointCount - 1;

  const secondIsOpeningEdge =
    secondEdgeIndex === 0;

  const firstIsClosingEdge =
    firstEdgeIndex === pointCount - 1;

  return (
    (firstIsOpeningEdge && secondIsClosingEdge) ||
    (secondIsOpeningEdge && firstIsClosingEdge)
  );
}

/**
 * Detects whether the polygon boundary crosses itself.
 */
export function hasPolygonSelfIntersection(
  points: PatternGeometryPoint[]
): boolean {
  const normalisedPoints =
    normalisePolygonPoints(points);

  const pointCount = normalisedPoints.length;

  if (
    pointCount <
    MINIMUM_PATTERN_POLYGON_POINTS
  ) {
    return false;
  }

  for (
    let firstEdgeIndex = 0;
    firstEdgeIndex < pointCount;
    firstEdgeIndex += 1
  ) {
    const firstStart =
      normalisedPoints[firstEdgeIndex];

    const firstEnd =
      normalisedPoints[
        (firstEdgeIndex + 1) % pointCount
      ];

    for (
      let secondEdgeIndex =
        firstEdgeIndex + 1;
      secondEdgeIndex < pointCount;
      secondEdgeIndex += 1
    ) {
      if (
        arePolygonEdgesAdjacent(
          firstEdgeIndex,
          secondEdgeIndex,
          pointCount
        )
      ) {
        continue;
      }

      const secondStart =
        normalisedPoints[secondEdgeIndex];

      const secondEnd =
        normalisedPoints[
          (secondEdgeIndex + 1) % pointCount
        ];

      if (
        doLineSegmentsIntersect(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Converts a length from the geometry unit into millimetres.
 */
function convertLengthToMillimetres(
  value: number,
  unit:
    | "millimetre"
    | "centimetre"
    | "inch"
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  switch (unit) {
    case "millimetre":
      return value;

    case "centimetre":
      return value * 10;

    case "inch":
      return value * 25.4;

    default:
      return 0;
  }
}

/**
 * Evaluates whether real-world pattern dimensions are reasonable.
 */
function areRealDimensionsValid(
  geometry: PatternGeometry
): boolean {
  if (!geometry.measurements) {
    return false;
  }

  const widthMillimetres =
    convertLengthToMillimetres(
      geometry.measurements.width,
      geometry.measurements.unit
    );

  const heightMillimetres =
    convertLengthToMillimetres(
      geometry.measurements.height,
      geometry.measurements.unit
    );

  return (
    widthMillimetres >=
      MINIMUM_REAL_PATTERN_DIMENSION_MM &&
    heightMillimetres >=
      MINIMUM_REAL_PATTERN_DIMENSION_MM &&
    widthMillimetres <=
      MAXIMUM_REAL_PATTERN_DIMENSION_MM &&
    heightMillimetres <=
      MAXIMUM_REAL_PATTERN_DIMENSION_MM
  );
}

/**
 * Calculates the geometry-confidence result.
 */
export function calculateGeometryConfidence(
  geometry: PatternGeometry,
  validation: PatternGeometryValidation
): PatternGeometryConfidence {
  const explanation: string[] = [];

  const imageQualityScore =
    geometry.sourceImageUrl ? 80 : 0;

  if (geometry.sourceImageUrl) {
    explanation.push(
      "A source pattern image is available."
    );
  } else {
    explanation.push(
      "No source pattern image is available."
    );
  }

  const scaleConfidenceScore =
    geometry.calibration.calibrated
      ? clampScore(
          geometry.calibration.confidenceScore
        )
      : 0;

  if (validation.scaleValid) {
    explanation.push(
      "Scale calibration is valid."
    );
  } else {
    explanation.push(
      "Scale calibration must be completed."
    );
  }

  let boundaryConfidenceScore = 0;

  if (
    validation.minimumPointsSatisfied &&
    validation.boundaryClosed &&
    validation.selfIntersectionFree
  ) {
    boundaryConfidenceScore = 90;

    explanation.push(
      "The traced boundary is closed and structurally valid."
    );
  } else if (
    validation.minimumPointsSatisfied
  ) {
    boundaryConfidenceScore = 45;

    explanation.push(
      "The traced boundary requires correction."
    );
  } else {
    explanation.push(
      "The pattern boundary has insufficient traced points."
    );
  }

  const measurementConfidenceScore =
    validation.areaValid &&
    validation.dimensionsValid
      ? 90
      : geometry.measurements
        ? 45
        : 0;

  if (
    validation.areaValid &&
    validation.dimensionsValid
  ) {
    explanation.push(
      "Real pattern measurements are valid."
    );
  } else {
    explanation.push(
      "Real pattern measurements are not yet reliable."
    );
  }

  const grainLineConfidenceScore =
    validation.grainLineValid
      ? clampScore(
          geometry.grainLine.confidenceScore ||
            80
        )
      : 0;

  if (validation.grainLineValid) {
    explanation.push(
      "The grain-line requirement is satisfied."
    );
  } else {
    explanation.push(
      "The grain line requires confirmation."
    );
  }

  const weightedScore =
    imageQualityScore * 0.1 +
    scaleConfidenceScore * 0.25 +
    boundaryConfidenceScore * 0.3 +
    measurementConfidenceScore * 0.25 +
    grainLineConfidenceScore * 0.1;

  const score = Math.round(
    clampScore(weightedScore)
  );

  return {
    score,
    level: getConfidenceLevel(score),

    imageQualityScore,
    scaleConfidenceScore,
    boundaryConfidenceScore,
    measurementConfidenceScore,
    grainLineConfidenceScore,

    explanation,
  };
}

/**
 * Validates one complete AI pattern geometry object.
 */
export function validatePatternGeometry(
  geometry: PatternGeometry
): GeometryValidationResult {
  const warnings: PatternGeometryWarning[] = [];

  let warningIndex = 0;

  const normalisedPoints =
    normalisePolygonPoints(
      geometry.polygon.points
    );

  const polygonAnalysis =
    analysePolygonGeometry(
      normalisedPoints,
      geometry.polygon.closed
    );

  const minimumPointsSatisfied =
    normalisedPoints.length >=
    MINIMUM_PATTERN_POLYGON_POINTS;

  const boundaryClosed =
    geometry.polygon.closed;

  const duplicatePoints =
    hasDuplicateGeometryPoints(
      geometry.polygon.points
    );

  const selfIntersection =
    hasPolygonSelfIntersection(
      normalisedPoints
    );

  const scaleValid =
    isValidScaleCalibration(
      geometry.calibration
    );

  const areaValid =
    polygonAnalysis.pixelArea >
      GEOMETRY_EPSILON &&
    Boolean(
      geometry.measurements &&
        geometry.measurements
          .areaSquareMillimetres >=
          MINIMUM_REAL_PATTERN_AREA_SQ_MM
    );

  const dimensionsValid =
    areRealDimensionsValid(geometry);

  const grainLineValid =
    geometry.directionRule ===
      "non-directional" ||
    geometry.grainLine.detected;

  if (!geometry.sourceImageUrl) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "image-not-available",
        "critical",
        "Pattern image unavailable",
        "Upload or reconnect the source pattern image before geometry processing.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (!minimumPointsSatisfied) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "insufficient-points",
        "critical",
        "Insufficient boundary points",
        `At least ${MINIMUM_PATTERN_POLYGON_POINTS} unique points are required to form a valid pattern polygon.`,
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (!boundaryClosed) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "open-boundary",
        "critical",
        "Open pattern boundary",
        "The final traced point must connect to the first point before measurement and marker planning.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (duplicatePoints) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "duplicate-point",
        "warning",
        "Duplicate tracing points detected",
        "Remove repeated points because they may reduce tracing quality and affect later geometry operations.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (selfIntersection) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "self-intersection",
        "critical",
        "Pattern boundary crosses itself",
        "Correct the traced boundary so no non-adjacent polygon edges intersect.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (!scaleValid) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "missing-scale",
        "critical",
        "Scale calibration required",
        "Confirm the visible ruler or scale reference before calculating real pattern dimensions.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (
    minimumPointsSatisfied &&
    polygonAnalysis.pixelArea <=
      GEOMETRY_EPSILON
  ) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "zero-area",
        "critical",
        "Pattern area is invalid",
        "The traced polygon has zero or negligible area and cannot be used for fabric calculations.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (
    geometry.measurements &&
    !dimensionsValid
  ) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "unrealistic-size",
        "critical",
        "Pattern dimensions appear unrealistic",
        "Review the scale reference and tracing because the calculated width or height falls outside the supported engineering range.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  if (!grainLineValid) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "missing-grain-line",
        "warning",
        "Grain line requires confirmation",
        "Directional patterns must have a confirmed grain line before marker optimisation.",
        warningIndex
      )
    );

    warningIndex += 1;
  }

  const criticalWarnings =
    warnings.filter(
      (warning) =>
        warning.severity === "critical"
    );

  const valid =
    criticalWarnings.length === 0 &&
    minimumPointsSatisfied &&
    boundaryClosed &&
    scaleValid &&
    areaValid &&
    dimensionsValid &&
    !selfIntersection &&
    grainLineValid;

  const validation: PatternGeometryValidation = {
    valid,

    boundaryClosed,
    minimumPointsSatisfied,
    scaleValid,
    areaValid,
    dimensionsValid,
    selfIntersectionFree:
      !selfIntersection,
    grainLineValid,

    warnings,

    validatedAt:
      valid || warnings.length > 0
        ? new Date().toISOString()
        : undefined,
  };

  const confidence =
    calculateGeometryConfidence(
      geometry,
      validation
    );

  if (
    confidence.score <
      MINIMUM_MARKER_CONFIDENCE_SCORE &&
    !warnings.some(
      (warning) =>
        warning.code === "low-confidence"
    )
  ) {
    warnings.push(
      createWarning(
        geometry.patternId,
        "low-confidence",
        "warning",
        "AI confidence is below marker threshold",
        `The geometry confidence score is ${confidence.score}%. Review the pattern before marker planning.`,
        warningIndex
      )
    );

    validation.warnings = warnings;
  }

  const markerReady =
    validation.valid &&
    confidence.score >=
      MINIMUM_MARKER_CONFIDENCE_SCORE;

  let status: GeometryValidationResult["status"];

  if (markerReady) {
    status = "validated";
  } else if (
    criticalWarnings.length > 0
  ) {
    status = "failed";
  } else if (warnings.length > 0) {
    status = "warning";
  } else {
    status = "validation-required";
  }

  return {
    validation,
    confidence,
    markerReady,
    status,
  };
}

/**
 * Applies validation results to an existing geometry object.
 */
export function applyGeometryValidation(
  geometry: PatternGeometry
): PatternGeometry {
  const result =
    validatePatternGeometry(geometry);

  return {
    ...geometry,

    status: result.status,

    validation: result.validation,

    confidence: result.confidence,

    markerReady: result.markerReady,

    updatedAt: new Date().toISOString(),
  };
}

/**
 * Produces a compact geometry-readiness summary.
 */
export function getGeometryReadinessSummary(
  geometries: PatternGeometry[]
): {
  total: number;
  markerReady: number;
  pending: number;
  warning: number;
  failed: number;
  readinessPercentage: number;
} {
  const total = geometries.length;

  const markerReady =
    geometries.filter(
      (geometry) => geometry.markerReady
    ).length;

  const pending =
    geometries.filter(
      (geometry) =>
        geometry.status === "not-started" ||
        geometry.status === "image-ready" ||
        geometry.status ===
          "calibration-required" ||
        geometry.status === "calibrated" ||
        geometry.status === "tracing" ||
        geometry.status === "traced" ||
        geometry.status ===
          "validation-required"
    ).length;

  const warning =
    geometries.filter(
      (geometry) =>
        geometry.status === "warning"
    ).length;

  const failed =
    geometries.filter(
      (geometry) =>
        geometry.status === "failed"
    ).length;

  const readinessPercentage =
    total > 0
      ? Math.round(
          (markerReady / total) * 100
        )
      : 0;

  return {
    total,
    markerReady,
    pending,
    warning,
    failed,
    readinessPercentage,
  };
}

/**
 * Determines whether all selected pattern geometries are ready for marker
 * planning.
 */
export function areAllPatternGeometriesMarkerReady(
  geometries: PatternGeometry[]
): boolean {
  return (
    geometries.length > 0 &&
    geometries.every(
      (geometry) => geometry.markerReady
    )
  );
}

/**
 * Returns the patterns that still require geometry action.
 */
export function getPatternsRequiringGeometryAction(
  geometries: PatternGeometry[]
): PatternGeometry[] {
  return geometries.filter(
    (geometry) => !geometry.markerReady
  );
}

/**
 * Returns a compact message for the geometry dashboard.
 */
export function getGeometryReadinessMessage(
  geometries: PatternGeometry[]
): string {
  const summary =
    getGeometryReadinessSummary(geometries);

  if (summary.total === 0) {
    return "No pattern geometries are available.";
  }

  if (
    summary.markerReady === summary.total
  ) {
    return `All ${summary.total} pattern geometries are ready for marker planning.`;
  }

  return `${summary.markerReady} of ${summary.total} pattern geometries are ready. ${summary.pending} pending, ${summary.warning} warning and ${summary.failed} failed.`;
}

export default {
  applyGeometryValidation,
  areAllPatternGeometriesMarkerReady,
  calculateGeometryConfidence,
  getGeometryReadinessMessage,
  getGeometryReadinessSummary,
  getPatternsRequiringGeometryAction,
  hasDuplicateGeometryPoints,
  hasPolygonSelfIntersection,
  validatePatternGeometry,
};