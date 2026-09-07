import {
  GeometryArea,
  GeometryBoundingBox,
  GeometryCentroid,
  GeometryConstraint,
  GeometryDimensions,
  GeometryPerimeter,
  GeometryPoint,
  GeometryPolygon,
  GeometryProjectSummary,
  GeometryRotation,
  PatternGeometryResult,
} from "@/lib/optifabric/patternGeometryTypes";

export interface PatternGeometryInput {
  patternId: string;
  recognisedName: string;

  vertices: GeometryPoint[];

  widthCm?: number;
  heightCm?: number;

  widthPixels?: number;
  heightPixels?: number;

  pixelsPerCm?: number;

  grainControlled?: boolean;
  cutOnFold?: boolean;
  mirroredPair?: boolean;

  rotation?: GeometryRotation;

  directionalFabric?: boolean;
  stripeMatch?: boolean;
  checkMatch?: boolean;
  napDirection?: boolean;

  cutQuantity?: number;
  markerEligible?: boolean;
}

const EPSILON = 0.000001;

function roundValue(
  value: number,
  decimals = 2
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier = 10 ** decimals;

  return (
    Math.round(value * multiplier) /
    multiplier
  );
}

function clampValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

export function closePolygon(
  vertices: GeometryPoint[]
): GeometryPoint[] {
  if (vertices.length === 0) {
    return [];
  }

  const cleanedVertices = vertices.filter(
    (point) =>
      Number.isFinite(point.x) &&
      Number.isFinite(point.y)
  );

  if (cleanedVertices.length === 0) {
    return [];
  }

  const firstPoint = cleanedVertices[0];
  const lastPoint =
    cleanedVertices[
      cleanedVertices.length - 1
    ];

  const alreadyClosed =
    Math.abs(firstPoint.x - lastPoint.x) <
      EPSILON &&
    Math.abs(firstPoint.y - lastPoint.y) <
      EPSILON;

  if (alreadyClosed) {
    return cleanedVertices;
  }

  return [
    ...cleanedVertices,
    {
      x: firstPoint.x,
      y: firstPoint.y,
    },
  ];
}

export function calculatePolygonAreaPixels(
  vertices: GeometryPoint[]
): number {
  const closedVertices =
    closePolygon(vertices);

  if (closedVertices.length < 4) {
    return 0;
  }

  let doubledArea = 0;

  for (
    let index = 0;
    index < closedVertices.length - 1;
    index += 1
  ) {
    const currentPoint =
      closedVertices[index];

    const nextPoint =
      closedVertices[index + 1];

    doubledArea +=
      currentPoint.x * nextPoint.y -
      nextPoint.x * currentPoint.y;
  }

  return roundValue(
    Math.abs(doubledArea) / 2,
    4
  );
}

export function calculatePolygonPerimeterPixels(
  vertices: GeometryPoint[]
): number {
  const closedVertices =
    closePolygon(vertices);

  if (closedVertices.length < 2) {
    return 0;
  }

  let perimeter = 0;

  for (
    let index = 0;
    index < closedVertices.length - 1;
    index += 1
  ) {
    const currentPoint =
      closedVertices[index];

    const nextPoint =
      closedVertices[index + 1];

    const differenceX =
      nextPoint.x - currentPoint.x;

    const differenceY =
      nextPoint.y - currentPoint.y;

    perimeter += Math.sqrt(
      differenceX ** 2 +
        differenceY ** 2
    );
  }

  return roundValue(perimeter, 4);
}

export function calculateBoundingBox(
  vertices: GeometryPoint[]
): GeometryBoundingBox {
  if (vertices.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
      centreX: 0,
      centreY: 0,
    };
  }

  const xValues = vertices.map(
    (point) => point.x
  );

  const yValues = vertices.map(
    (point) => point.y
  );

  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);
  const maxX = Math.max(...xValues);
  const maxY = Math.max(...yValues);

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    minX: roundValue(minX, 4),
    minY: roundValue(minY, 4),
    maxX: roundValue(maxX, 4),
    maxY: roundValue(maxY, 4),

    width: roundValue(width, 4),
    height: roundValue(height, 4),

    centreX: roundValue(
      minX + width / 2,
      4
    ),

    centreY: roundValue(
      minY + height / 2,
      4
    ),
  };
}

export function calculatePolygonCentroid(
  vertices: GeometryPoint[]
): GeometryCentroid {
  const closedVertices =
    closePolygon(vertices);

  if (closedVertices.length < 4) {
    const boundingBox =
      calculateBoundingBox(vertices);

    return {
      x: boundingBox.centreX,
      y: boundingBox.centreY,
    };
  }

  let signedAreaFactor = 0;
  let centroidXFactor = 0;
  let centroidYFactor = 0;

  for (
    let index = 0;
    index < closedVertices.length - 1;
    index += 1
  ) {
    const currentPoint =
      closedVertices[index];

    const nextPoint =
      closedVertices[index + 1];

    const crossProduct =
      currentPoint.x * nextPoint.y -
      nextPoint.x * currentPoint.y;

    signedAreaFactor += crossProduct;

    centroidXFactor +=
      (currentPoint.x + nextPoint.x) *
      crossProduct;

    centroidYFactor +=
      (currentPoint.y + nextPoint.y) *
      crossProduct;
  }

  const signedArea =
    signedAreaFactor / 2;

  if (Math.abs(signedArea) < EPSILON) {
    const boundingBox =
      calculateBoundingBox(vertices);

    return {
      x: boundingBox.centreX,
      y: boundingBox.centreY,
    };
  }

  const divisor = 6 * signedArea;

  return {
    x: roundValue(
      centroidXFactor / divisor,
      4
    ),

    y: roundValue(
      centroidYFactor / divisor,
      4
    ),
  };
}

export function convertPixelAreaToSquareCm(
  squarePixels: number,
  pixelsPerCm?: number
): number | undefined {
  if (
    !pixelsPerCm ||
    pixelsPerCm <= 0
  ) {
    return undefined;
  }

  return roundValue(
    squarePixels /
      (pixelsPerCm * pixelsPerCm),
    2
  );
}

export function convertPixelLengthToCm(
  pixels: number,
  pixelsPerCm?: number
): number | undefined {
  if (
    !pixelsPerCm ||
    pixelsPerCm <= 0
  ) {
    return undefined;
  }

  return roundValue(
    pixels / pixelsPerCm,
    2
  );
}

export function calculateAspectRatio(
  width: number,
  height: number
): number {
  if (
    width <= 0 ||
    height <= 0
  ) {
    return 0;
  }

  const longerSide = Math.max(
    width,
    height
  );

  const shorterSide = Math.min(
    width,
    height
  );

  return roundValue(
    longerSide / shorterSide,
    3
  );
}

export function calculateCompactness(
  area: number,
  perimeter: number
): number {
  if (
    area <= 0 ||
    perimeter <= 0
  ) {
    return 0;
  }

  const compactness =
    (4 * Math.PI * area) /
    perimeter ** 2;

  return roundValue(
    clampValue(
      compactness,
      0,
      1
    ),
    4
  );
}

export function calculateBoundingBoxUtilisation(
  area: number,
  boundingBox: GeometryBoundingBox
): number {
  const boundingBoxArea =
    boundingBox.width *
    boundingBox.height;

  if (boundingBoxArea <= 0) {
    return 0;
  }

  return roundValue(
    clampValue(
      area / boundingBoxArea,
      0,
      1
    ),
    4
  );
}

export function calculatePackingPriority(
  area: number,
  aspectRatio: number,
  compactness: number,
  constraints: GeometryConstraint
): number {
  if (area <= 0) {
    return 0;
  }

  let score = 30;

  if (area >= 200000) {
    score += 35;
  } else if (area >= 100000) {
    score += 28;
  } else if (area >= 50000) {
    score += 22;
  } else if (area >= 10000) {
    score += 15;
  } else {
    score += 8;
  }

  if (aspectRatio >= 3) {
    score += 12;
  } else if (aspectRatio >= 2) {
    score += 8;
  } else {
    score += 4;
  }

  if (compactness < 0.35) {
    score += 12;
  } else if (compactness < 0.55) {
    score += 8;
  } else {
    score += 4;
  }

  if (constraints.cutOnFold) {
    score += 10;
  }

  if (constraints.rotation === "fixed") {
    score += 8;
  }

  if (constraints.directionalFabric) {
    score += 7;
  }

  if (
    constraints.stripeMatch ||
    constraints.checkMatch
  ) {
    score += 8;
  }

  return roundValue(
    clampValue(score, 0, 100),
    0
  );
}

export function calculateMarkerWeight(
  area: number,
  cutQuantity: number,
  markerEligible: boolean
): number {
  if (
    !markerEligible ||
    area <= 0 ||
    cutQuantity <= 0
  ) {
    return 0;
  }

  return roundValue(
    area * cutQuantity,
    2
  );
}

export function calculateEngineeringScore(
  polygon: GeometryPolygon,
  constraints: GeometryConstraint,
  markerEligible: boolean
): number {
  let score = 0;

  if (polygon.vertexCount >= 3) {
    score += 20;
  }

  if (polygon.closed) {
    score += 15;
  }

  if (polygon.area.squarePixels > 0) {
    score += 15;
  }

  if (polygon.perimeter.pixels > 0) {
    score += 10;
  }

  if (
    polygon.boundingBox.width > 0 &&
    polygon.boundingBox.height > 0
  ) {
    score += 10;
  }

  if (
    Number.isFinite(
      polygon.centroid.x
    ) &&
    Number.isFinite(
      polygon.centroid.y
    )
  ) {
    score += 10;
  }

  if (
    constraints.rotation !== "free" ||
    constraints.grainControlled
  ) {
    score += 10;
  }

  if (markerEligible) {
    score += 10;
  }

  return roundValue(
    clampValue(score, 0, 100),
    0
  );
}

export function createGeometryConstraints(
  input: PatternGeometryInput
): GeometryConstraint {
  return {
    grainControlled:
      input.grainControlled ?? false,

    cutOnFold:
      input.cutOnFold ?? false,

    mirroredPair:
      input.mirroredPair ?? false,

    rotation:
      input.rotation ?? "fixed",

    directionalFabric:
      input.directionalFabric ?? false,

    stripeMatch:
      input.stripeMatch ?? false,

    checkMatch:
      input.checkMatch ?? false,

    napDirection:
      input.napDirection ?? false,
  };
}

export function createPatternPolygon(
  vertices: GeometryPoint[],
  pixelsPerCm?: number
): GeometryPolygon {
  const closedVertices =
    closePolygon(vertices);

  const uniqueVertices =
    closedVertices.length > 1
      ? closedVertices.slice(0, -1)
      : closedVertices;

  const squarePixels =
    calculatePolygonAreaPixels(
      uniqueVertices
    );

  const perimeterPixels =
    calculatePolygonPerimeterPixels(
      uniqueVertices
    );

  const area: GeometryArea = {
    squarePixels,
    squareCm:
      convertPixelAreaToSquareCm(
        squarePixels,
        pixelsPerCm
      ),
  };

  const perimeter: GeometryPerimeter = {
    pixels: perimeterPixels,
    cm: convertPixelLengthToCm(
      perimeterPixels,
      pixelsPerCm
    ),
  };

  return {
    vertices: uniqueVertices,
    closed:
      uniqueVertices.length >= 3,
    vertexCount:
      uniqueVertices.length,
    area,
    perimeter,
    centroid:
      calculatePolygonCentroid(
        uniqueVertices
      ),
    boundingBox:
      calculateBoundingBox(
        uniqueVertices
      ),
  };
}

export function generatePatternGeometry(
  input: PatternGeometryInput
): PatternGeometryResult {
  const polygon =
    createPatternPolygon(
      input.vertices,
      input.pixelsPerCm
    );

  const dimensions: GeometryDimensions = {
    widthCm:
      input.widthCm ??
      convertPixelLengthToCm(
        polygon.boundingBox.width,
        input.pixelsPerCm
      ),

    heightCm:
      input.heightCm ??
      convertPixelLengthToCm(
        polygon.boundingBox.height,
        input.pixelsPerCm
      ),

    widthPixels:
      input.widthPixels ??
      polygon.boundingBox.width,

    heightPixels:
      input.heightPixels ??
      polygon.boundingBox.height,
  };

  const constraints =
    createGeometryConstraints(input);

  const aspectRatio =
    calculateAspectRatio(
      polygon.boundingBox.width,
      polygon.boundingBox.height
    );

  const compactness =
    calculateCompactness(
      polygon.area.squarePixels,
      polygon.perimeter.pixels
    );

  const packingPriority =
    calculatePackingPriority(
      polygon.area.squarePixels,
      aspectRatio,
      compactness,
      constraints
    );

  const markerWeight =
    calculateMarkerWeight(
      polygon.area.squarePixels,
      input.cutQuantity ?? 1,
      input.markerEligible ?? true
    );

  const engineeringScore =
    calculateEngineeringScore(
      polygon,
      constraints,
      input.markerEligible ?? true
    );

  return {
    patternId: input.patternId,
    recognisedName:
      input.recognisedName,

    polygon,
    dimensions,
    constraints,

    aspectRatio,
    compactness,
    packingPriority,
    markerWeight,
    engineeringScore,

    cutQuantity: input.cutQuantity,

    analysedAt:
      new Date().toISOString(),
  };
}

export function generateProjectGeometry(
  projectId: string,
  inputs: PatternGeometryInput[]
): {
  patterns: PatternGeometryResult[];
  summary: GeometryProjectSummary;
} {
  const patterns = inputs.map(
    (input) =>
      generatePatternGeometry(input)
  );

  const totalAreaCm2 =
    patterns.reduce(
      (total, pattern) =>
        total +
        (pattern.polygon.area
          .squareCm ?? 0),
      0
    );

  const totalPerimeterCm =
    patterns.reduce(
      (total, pattern) =>
        total +
        (pattern.polygon.perimeter
          .cm ?? 0),
      0
    );

  const averageCompactness =
    patterns.length > 0
      ? patterns.reduce(
          (total, pattern) =>
            total +
            pattern.compactness,
          0
        ) / patterns.length
      : 0;

  const averageEngineeringScore =
    patterns.length > 0
      ? patterns.reduce(
          (total, pattern) =>
            total +
            pattern.engineeringScore,
          0
        ) / patterns.length
      : 0;

  const summary: GeometryProjectSummary = {
    projectId,
    totalPatterns:
      patterns.length,

    totalAreaCm2:
      roundValue(
        totalAreaCm2,
        2
      ),

    totalPerimeterCm:
      roundValue(
        totalPerimeterCm,
        2
      ),

    averageCompactness:
      roundValue(
        averageCompactness,
        4
      ),

    averageEngineeringScore:
      roundValue(
        averageEngineeringScore,
        1
      ),

    generatedAt:
      new Date().toISOString(),
  };

  return {
    patterns,
    summary,
  };
}

export function sortPatternsForPacking(
  patterns: PatternGeometryResult[]
): PatternGeometryResult[] {
  return [...patterns].sort(
    (firstPattern, secondPattern) => {
      if (
        secondPattern.packingPriority !==
        firstPattern.packingPriority
      ) {
        return (
          secondPattern.packingPriority -
          firstPattern.packingPriority
        );
      }

      return (
        secondPattern.markerWeight -
        firstPattern.markerWeight
      );
    }
  );
}

export function getValidGeometryPatterns(
  patterns: PatternGeometryResult[]
): PatternGeometryResult[] {
  return patterns.filter(
    (pattern) =>
      pattern.polygon.closed &&
      pattern.polygon.vertexCount >= 3 &&
      pattern.polygon.area
        .squarePixels > 0 &&
      pattern.polygon.perimeter
        .pixels > 0
  );
}

export const patternGeometryEngine = {
  closePolygon,
  calculatePolygonAreaPixels,
  calculatePolygonPerimeterPixels,
  calculateBoundingBox,
  calculatePolygonCentroid,
  convertPixelAreaToSquareCm,
  convertPixelLengthToCm,
  calculateAspectRatio,
  calculateCompactness,
  calculateBoundingBoxUtilisation,
  calculatePackingPriority,
  calculateMarkerWeight,
  calculateEngineeringScore,
  createGeometryConstraints,
  createPatternPolygon,
  generatePatternGeometry,
  generateProjectGeometry,
  sortPatternsForPacking,
  getValidGeometryPatterns,
};

export default patternGeometryEngine;