import type {
  GeometryMeasurementUnit,
  PatternBoundingBox,
  PatternGeometryMeasurements,
  PatternGeometryPoint,
  PatternGeometryPolygon,
  PatternScaleCalibration,
} from "@/lib/optifabric/geometry/patternGeometry";

/**
 * OptiFabric AI Polygon Geometry Engine
 *
 * This engine performs the core mathematical calculations required to
 * convert traced pattern boundary points into measurable engineering data.
 *
 * It supports:
 *
 * - Polygon closure
 * - Signed polygon area
 * - Absolute polygon area
 * - Polygon perimeter
 * - Clockwise/counter-clockwise orientation
 * - Bounding-box calculation
 * - Pixel-to-real measurement conversion
 * - Area conversion between engineering units
 */

/**
 * Minimum number of unique points required to form a valid polygon.
 */
export const MINIMUM_PATTERN_POLYGON_POINTS = 3;

/**
 * Small numerical tolerance used when comparing coordinates.
 */
export const GEOMETRY_EPSILON = 0.000001;

/**
 * Result returned after analysing polygon points.
 */
export interface PolygonGeometryResult {
  valid: boolean;

  points: PatternGeometryPoint[];

  closed: boolean;

  signedPixelArea: number;
  pixelArea: number;
  pixelPerimeter: number;

  clockwise: boolean;

  boundingBox: PatternBoundingBox;

  errors: string[];
}

/**
 * Result returned after real-world geometry measurements are calculated.
 */
export interface RealGeometryResult {
  valid: boolean;

  measurements?: PatternGeometryMeasurements;

  errors: string[];
}

/**
 * Determines whether two geometry points occupy the same location.
 */
export function areGeometryPointsEqual(
  firstPoint: PatternGeometryPoint,
  secondPoint: PatternGeometryPoint,
  tolerance: number = GEOMETRY_EPSILON
): boolean {
  return (
    Math.abs(firstPoint.x - secondPoint.x) <= tolerance &&
    Math.abs(firstPoint.y - secondPoint.y) <= tolerance
  );
}

/**
 * Removes consecutive duplicate points from a polygon.
 *
 * The original point sequence is preserved.
 */
export function removeConsecutiveDuplicatePoints(
  points: PatternGeometryPoint[]
): PatternGeometryPoint[] {
  if (points.length === 0) {
    return [];
  }

  const cleanedPoints: PatternGeometryPoint[] = [
    points[0],
  ];

  for (
    let pointIndex = 1;
    pointIndex < points.length;
    pointIndex += 1
  ) {
    const currentPoint = points[pointIndex];
    const previousPoint =
      cleanedPoints[cleanedPoints.length - 1];

    if (
      !areGeometryPointsEqual(
        currentPoint,
        previousPoint
      )
    ) {
      cleanedPoints.push(currentPoint);
    }
  }

  return cleanedPoints;
}

/**
 * Removes the duplicated closing point when the first and final points are
 * identical.
 *
 * OptiFabric stores a polygon as a unique point list together with a
 * separate closed flag. Therefore the first point should not be repeated at
 * the end of the stored array.
 */
export function removeRepeatedClosingPoint(
  points: PatternGeometryPoint[]
): PatternGeometryPoint[] {
  if (points.length < 2) {
    return [...points];
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (
    areGeometryPointsEqual(
      firstPoint,
      lastPoint
    )
  ) {
    return points.slice(0, -1);
  }

  return [...points];
}

/**
 * Normalises a point collection before polygon calculations.
 */
export function normalisePolygonPoints(
  points: PatternGeometryPoint[]
): PatternGeometryPoint[] {
  const withoutConsecutiveDuplicates =
    removeConsecutiveDuplicatePoints(points);

  const withoutRepeatedClosingPoint =
    removeRepeatedClosingPoint(
      withoutConsecutiveDuplicates
    );

  return withoutRepeatedClosingPoint.map(
    (point, pointIndex) => ({
      ...point,
      sequence: pointIndex,
    })
  );
}

/**
 * Calculates the straight-line distance between two points.
 */
export function calculatePointDistance(
  firstPoint: PatternGeometryPoint,
  secondPoint: PatternGeometryPoint
): number {
  const horizontalDifference =
    secondPoint.x - firstPoint.x;

  const verticalDifference =
    secondPoint.y - firstPoint.y;

  return Math.sqrt(
    horizontalDifference * horizontalDifference +
      verticalDifference * verticalDifference
  );
}

/**
 * Calculates the signed pixel area of a polygon using the shoelace formula.
 *
 * A positive or negative result indicates the tracing orientation.
 */
export function calculateSignedPolygonPixelArea(
  points: PatternGeometryPoint[]
): number {
  const normalisedPoints =
    normalisePolygonPoints(points);

  if (
    normalisedPoints.length <
    MINIMUM_PATTERN_POLYGON_POINTS
  ) {
    return 0;
  }

  let doubledSignedArea = 0;

  for (
    let pointIndex = 0;
    pointIndex < normalisedPoints.length;
    pointIndex += 1
  ) {
    const currentPoint =
      normalisedPoints[pointIndex];

    const nextPoint =
      normalisedPoints[
        (pointIndex + 1) %
          normalisedPoints.length
      ];

    doubledSignedArea +=
      currentPoint.x * nextPoint.y -
      nextPoint.x * currentPoint.y;
  }

  return doubledSignedArea / 2;
}

/**
 * Calculates the absolute pixel area of a polygon.
 */
export function calculatePolygonPixelArea(
  points: PatternGeometryPoint[]
): number {
  return Math.abs(
    calculateSignedPolygonPixelArea(points)
  );
}

/**
 * Determines whether the polygon point order is clockwise.
 *
 * Screen coordinates usually increase downwards on the y-axis, therefore
 * this result follows image/canvas coordinate behaviour.
 */
export function isPolygonClockwise(
  points: PatternGeometryPoint[]
): boolean {
  return (
    calculateSignedPolygonPixelArea(points) > 0
  );
}

/**
 * Calculates the complete perimeter of a closed polygon in pixels.
 */
export function calculatePolygonPixelPerimeter(
  points: PatternGeometryPoint[]
): number {
  const normalisedPoints =
    normalisePolygonPoints(points);

  if (normalisedPoints.length < 2) {
    return 0;
  }

  let perimeter = 0;

  for (
    let pointIndex = 0;
    pointIndex < normalisedPoints.length;
    pointIndex += 1
  ) {
    const currentPoint =
      normalisedPoints[pointIndex];

    const nextPoint =
      normalisedPoints[
        (pointIndex + 1) %
          normalisedPoints.length
      ];

    perimeter += calculatePointDistance(
      currentPoint,
      nextPoint
    );
  }

  return perimeter;
}

/**
 * Calculates the smallest axis-aligned rectangle surrounding the polygon.
 */
export function calculatePatternBoundingBox(
  points: PatternGeometryPoint[]
): PatternBoundingBox {
  const normalisedPoints =
    normalisePolygonPoints(points);

  if (normalisedPoints.length === 0) {
    return {
      minimumX: 0,
      minimumY: 0,
      maximumX: 0,
      maximumY: 0,
      widthPixels: 0,
      heightPixels: 0,
    };
  }

  let minimumX = normalisedPoints[0].x;
  let minimumY = normalisedPoints[0].y;
  let maximumX = normalisedPoints[0].x;
  let maximumY = normalisedPoints[0].y;

  for (const point of normalisedPoints) {
    minimumX = Math.min(minimumX, point.x);
    minimumY = Math.min(minimumY, point.y);
    maximumX = Math.max(maximumX, point.x);
    maximumY = Math.max(maximumY, point.y);
  }

  return {
    minimumX,
    minimumY,
    maximumX,
    maximumY,
    widthPixels: maximumX - minimumX,
    heightPixels: maximumY - minimumY,
  };
}

/**
 * Checks whether a numerical value is finite and greater than zero.
 */
export function isPositiveFiniteNumber(
  value: number
): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * Checks whether calibration data is suitable for real-world conversion.
 */
export function isValidScaleCalibration(
  calibration: PatternScaleCalibration
): boolean {
  return (
    calibration.calibrated &&
    isPositiveFiniteNumber(
      calibration.referenceLength
    ) &&
    isPositiveFiniteNumber(
      calibration.referencePixelLength
    ) &&
    isPositiveFiniteNumber(
      calibration.pixelsPerUnit
    ) &&
    isPositiveFiniteNumber(
      calibration.unitsPerPixel
    )
  );
}

/**
 * Calculates units per pixel from a known scale reference.
 */
export function calculateUnitsPerPixel(
  referenceLength: number,
  referencePixelLength: number
): number {
  if (
    !isPositiveFiniteNumber(referenceLength) ||
    !isPositiveFiniteNumber(
      referencePixelLength
    )
  ) {
    return 0;
  }

  return referenceLength / referencePixelLength;
}

/**
 * Calculates pixels per engineering unit from a known scale reference.
 */
export function calculatePixelsPerUnit(
  referenceLength: number,
  referencePixelLength: number
): number {
  if (
    !isPositiveFiniteNumber(referenceLength) ||
    !isPositiveFiniteNumber(
      referencePixelLength
    )
  ) {
    return 0;
  }

  return referencePixelLength / referenceLength;
}

/**
 * Converts a pixel length into the calibrated real-world unit.
 */
export function convertPixelLengthToRealLength(
  pixelLength: number,
  calibration: PatternScaleCalibration
): number {
  if (
    !Number.isFinite(pixelLength) ||
    !isValidScaleCalibration(calibration)
  ) {
    return 0;
  }

  return pixelLength * calibration.unitsPerPixel;
}

/**
 * Converts a pixel area into the square of the calibrated unit.
 */
export function convertPixelAreaToRealArea(
  pixelArea: number,
  calibration: PatternScaleCalibration
): number {
  if (
    !Number.isFinite(pixelArea) ||
    !isValidScaleCalibration(calibration)
  ) {
    return 0;
  }

  return (
    pixelArea *
    calibration.unitsPerPixel *
    calibration.unitsPerPixel
  );
}

/**
 * Converts a length into millimetres.
 */
export function convertLengthToMillimetres(
  length: number,
  unit: GeometryMeasurementUnit
): number {
  if (!Number.isFinite(length)) {
    return 0;
  }

  switch (unit) {
    case "millimetre":
      return length;

    case "centimetre":
      return length * 10;

    case "inch":
      return length * 25.4;

    default:
      return 0;
  }
}

/**
 * Converts a square area into square millimetres.
 */
export function convertAreaToSquareMillimetres(
  area: number,
  unit: GeometryMeasurementUnit
): number {
  if (!Number.isFinite(area)) {
    return 0;
  }

  switch (unit) {
    case "millimetre":
      return area;

    case "centimetre":
      return area * 100;

    case "inch":
      return area * 645.16;

    default:
      return 0;
  }
}

/**
 * Converts square millimetres into all engineering area units required by
 * the OptiFabric reporting engine.
 */
export function convertSquareMillimetresToAreaSet(
  areaSquareMillimetres: number
): {
  areaSquareMillimetres: number;
  areaSquareCentimetres: number;
  areaSquareInches: number;
  areaSquareMetres: number;
} {
  if (
    !Number.isFinite(areaSquareMillimetres) ||
    areaSquareMillimetres < 0
  ) {
    return {
      areaSquareMillimetres: 0,
      areaSquareCentimetres: 0,
      areaSquareInches: 0,
      areaSquareMetres: 0,
    };
  }

  return {
    areaSquareMillimetres,
    areaSquareCentimetres:
      areaSquareMillimetres / 100,
    areaSquareInches:
      areaSquareMillimetres / 645.16,
    areaSquareMetres:
      areaSquareMillimetres / 1_000_000,
  };
}

/**
 * Produces a complete analysis of one traced polygon.
 */
export function analysePolygonGeometry(
  points: PatternGeometryPoint[],
  closed: boolean = true
): PolygonGeometryResult {
  const errors: string[] = [];

  const normalisedPoints =
    normalisePolygonPoints(points);

  if (
    normalisedPoints.length <
    MINIMUM_PATTERN_POLYGON_POINTS
  ) {
    errors.push(
      `A pattern polygon requires at least ${MINIMUM_PATTERN_POLYGON_POINTS} unique points.`
    );
  }

  if (!closed) {
    errors.push(
      "The pattern boundary is not closed."
    );
  }

  const signedPixelArea =
    calculateSignedPolygonPixelArea(
      normalisedPoints
    );

  const pixelArea = Math.abs(
    signedPixelArea
  );

  const pixelPerimeter =
    calculatePolygonPixelPerimeter(
      normalisedPoints
    );

  const boundingBox =
    calculatePatternBoundingBox(
      normalisedPoints
    );

  if (
    normalisedPoints.length >=
      MINIMUM_PATTERN_POLYGON_POINTS &&
    pixelArea <= GEOMETRY_EPSILON
  ) {
    errors.push(
      "The traced polygon has zero or negligible area."
    );
  }

  if (
    normalisedPoints.length >=
      MINIMUM_PATTERN_POLYGON_POINTS &&
    pixelPerimeter <= GEOMETRY_EPSILON
  ) {
    errors.push(
      "The traced polygon has zero or negligible perimeter."
    );
  }

  if (
    normalisedPoints.length >=
      MINIMUM_PATTERN_POLYGON_POINTS &&
    (boundingBox.widthPixels <=
      GEOMETRY_EPSILON ||
      boundingBox.heightPixels <=
        GEOMETRY_EPSILON)
  ) {
    errors.push(
      "The traced polygon has an invalid width or height."
    );
  }

  return {
    valid: errors.length === 0,
    points: normalisedPoints,
    closed,
    signedPixelArea,
    pixelArea,
    pixelPerimeter,
    clockwise: signedPixelArea > 0,
    boundingBox,
    errors,
  };
}

/**
 * Calculates real-world engineering measurements from a polygon and scale
 * calibration.
 */
export function calculateRealGeometryMeasurements(
  points: PatternGeometryPoint[],
  calibration: PatternScaleCalibration,
  closed: boolean = true
): RealGeometryResult {
  const errors: string[] = [];

  const polygonResult =
    analysePolygonGeometry(points, closed);

  errors.push(...polygonResult.errors);

  if (
    !isValidScaleCalibration(calibration)
  ) {
    errors.push(
      "Valid pattern scale calibration is required before real measurements can be calculated."
    );
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  const width =
    convertPixelLengthToRealLength(
      polygonResult.boundingBox.widthPixels,
      calibration
    );

  const height =
    convertPixelLengthToRealLength(
      polygonResult.boundingBox.heightPixels,
      calibration
    );

  const perimeter =
    convertPixelLengthToRealLength(
      polygonResult.pixelPerimeter,
      calibration
    );

  const area =
    convertPixelAreaToRealArea(
      polygonResult.pixelArea,
      calibration
    );

  const areaSquareMillimetres =
    convertAreaToSquareMillimetres(
      area,
      calibration.referenceUnit
    );

  const convertedAreas =
    convertSquareMillimetresToAreaSet(
      areaSquareMillimetres
    );

  const measurements: PatternGeometryMeasurements = {
    unit: calibration.referenceUnit,

    width,
    height,

    perimeter,
    area,

    ...convertedAreas,

    boundingBox: {
      ...polygonResult.boundingBox,
      widthReal: width,
      heightReal: height,
      unit: calibration.referenceUnit,
    },
  };

  return {
    valid: true,
    measurements,
    errors: [],
  };
}

/**
 * Creates a complete PatternGeometryPolygon object from traced points.
 */
export function createPatternGeometryPolygon(
  points: PatternGeometryPoint[],
  closed: boolean = true,
  existingCreatedAt?: string
): PatternGeometryPolygon {
  const polygonResult =
    analysePolygonGeometry(points, closed);

  const now = new Date().toISOString();

  return {
    points: polygonResult.points,

    closed,

    pixelArea: polygonResult.pixelArea,

    pixelPerimeter:
      polygonResult.pixelPerimeter,

    signedPixelArea:
      polygonResult.signedPixelArea,

    clockwise: polygonResult.clockwise,

    createdAt: existingCreatedAt ?? now,

    updatedAt: now,
  };
}

/**
 * Reverses polygon point order while retaining stable sequential indexing.
 */
export function reversePolygonPointOrder(
  points: PatternGeometryPoint[]
): PatternGeometryPoint[] {
  return [...normalisePolygonPoints(points)]
    .reverse()
    .map((point, pointIndex) => ({
      ...point,
      sequence: pointIndex,
    }));
}

/**
 * Forces the polygon into clockwise orientation.
 */
export function ensureClockwisePolygon(
  points: PatternGeometryPoint[]
): PatternGeometryPoint[] {
  const normalisedPoints =
    normalisePolygonPoints(points);

  if (isPolygonClockwise(normalisedPoints)) {
    return normalisedPoints;
  }

  return reversePolygonPointOrder(
    normalisedPoints
  );
}

/**
 * Forces the polygon into counter-clockwise orientation.
 */
export function ensureCounterClockwisePolygon(
  points: PatternGeometryPoint[]
): PatternGeometryPoint[] {
  const normalisedPoints =
    normalisePolygonPoints(points);

  if (!isPolygonClockwise(normalisedPoints)) {
    return normalisedPoints;
  }

  return reversePolygonPointOrder(
    normalisedPoints
  );
}

/**
 * Calculates the centre point of the polygon bounding box.
 *
 * This is useful for marker placement, rotation and visualisation.
 */
export function calculateBoundingBoxCentre(
  points: PatternGeometryPoint[]
): {
  x: number;
  y: number;
} {
  const boundingBox =
    calculatePatternBoundingBox(points);

  return {
    x:
      boundingBox.minimumX +
      boundingBox.widthPixels / 2,

    y:
      boundingBox.minimumY +
      boundingBox.heightPixels / 2,
  };
}

/**
 * Translates polygon points by the supplied horizontal and vertical offset.
 */
export function translatePolygonPoints(
  points: PatternGeometryPoint[],
  horizontalOffset: number,
  verticalOffset: number
): PatternGeometryPoint[] {
  return normalisePolygonPoints(points).map(
    (point, pointIndex) => ({
      ...point,

      x: point.x + horizontalOffset,
      y: point.y + verticalOffset,

      realX:
        point.realX === undefined
          ? undefined
          : point.realX +
            horizontalOffset,

      realY:
        point.realY === undefined
          ? undefined
          : point.realY +
            verticalOffset,

      sequence: pointIndex,
    })
  );
}

/**
 * Scales polygon points around the origin.
 *
 * This will later support preview zooming and marker transformations.
 */
export function scalePolygonPoints(
  points: PatternGeometryPoint[],
  horizontalScale: number,
  verticalScale: number = horizontalScale
): PatternGeometryPoint[] {
  if (
    !Number.isFinite(horizontalScale) ||
    !Number.isFinite(verticalScale)
  ) {
    return normalisePolygonPoints(points);
  }

  return normalisePolygonPoints(points).map(
    (point, pointIndex) => ({
      ...point,

      x: point.x * horizontalScale,
      y: point.y * verticalScale,

      sequence: pointIndex,
    })
  );
}

/**
 * Rotates polygon points around a selected centre.
 *
 * Positive angles rotate clockwise in canvas coordinates.
 */
export function rotatePolygonPoints(
  points: PatternGeometryPoint[],
  angleDegrees: number,
  centre?: {
    x: number;
    y: number;
  }
): PatternGeometryPoint[] {
  if (!Number.isFinite(angleDegrees)) {
    return normalisePolygonPoints(points);
  }

  const normalisedPoints =
    normalisePolygonPoints(points);

  const rotationCentre =
    centre ??
    calculateBoundingBoxCentre(
      normalisedPoints
    );

  const angleRadians =
    (angleDegrees * Math.PI) / 180;

  const cosine = Math.cos(angleRadians);
  const sine = Math.sin(angleRadians);

  return normalisedPoints.map(
    (point, pointIndex) => {
      const translatedX =
        point.x - rotationCentre.x;

      const translatedY =
        point.y - rotationCentre.y;

      return {
        ...point,

        x:
          rotationCentre.x +
          translatedX * cosine -
          translatedY * sine,

        y:
          rotationCentre.y +
          translatedX * sine +
          translatedY * cosine,

        sequence: pointIndex,
      };
    }
  );
}

export default {
  analysePolygonGeometry,
  calculateBoundingBoxCentre,
  calculatePatternBoundingBox,
  calculatePixelsPerUnit,
  calculatePointDistance,
  calculatePolygonPixelArea,
  calculatePolygonPixelPerimeter,
  calculateRealGeometryMeasurements,
  calculateSignedPolygonPixelArea,
  calculateUnitsPerPixel,
  convertAreaToSquareMillimetres,
  convertLengthToMillimetres,
  convertPixelAreaToRealArea,
  convertPixelLengthToRealLength,
  convertSquareMillimetresToAreaSet,
  createPatternGeometryPolygon,
  ensureClockwisePolygon,
  ensureCounterClockwisePolygon,
  isPolygonClockwise,
  isValidScaleCalibration,
  normalisePolygonPoints,
  removeConsecutiveDuplicatePoints,
  removeRepeatedClosingPoint,
  reversePolygonPointOrder,
  rotatePolygonPoints,
  scalePolygonPoints,
  translatePolygonPoints,
};