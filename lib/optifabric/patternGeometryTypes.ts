export interface GeometryPoint {
  x: number;
  y: number;
}

export interface GeometryBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  width: number;
  height: number;

  centreX: number;
  centreY: number;
}

export interface GeometryCentroid {
  x: number;
  y: number;
}

export interface GeometryDimensions {
  widthCm?: number;
  heightCm?: number;

  widthPixels?: number;
  heightPixels?: number;
}

export interface GeometryArea {
  squarePixels: number;
  squareCm?: number;
}

export interface GeometryPerimeter {
  pixels: number;
  cm?: number;
}

export interface GeometryPolygon {
  vertices: GeometryPoint[];

  closed: boolean;

  vertexCount: number;

  area: GeometryArea;

  perimeter: GeometryPerimeter;

  centroid: GeometryCentroid;

  boundingBox: GeometryBoundingBox;
}

export type GeometryRotation =
  | "fixed"
  | "rotate-180"
  | "rotate-90"
  | "free";

export interface GeometryConstraint {
  grainControlled: boolean;

  cutOnFold: boolean;

  mirroredPair: boolean;

  rotation: GeometryRotation;

  directionalFabric: boolean;

  stripeMatch: boolean;

  checkMatch: boolean;

  napDirection: boolean;
}

export interface PatternGeometryResult {
  patternId: string;

  recognisedName: string;

  polygon: GeometryPolygon;

  dimensions: GeometryDimensions;

  constraints: GeometryConstraint;

  aspectRatio: number;

  compactness: number;

  packingPriority: number;

  markerWeight: number;

  engineeringScore: number;

  /**
   * Pieces of this pattern required per garment. Carried through from
   * PatternGeometryInput.cutQuantity so the marker stage does not have to
   * fall back to an assumed 1-per-garment quantity. Undefined when the
   * upload stage never recorded one.
   */
  cutQuantity?: number;

  analysedAt: string;
}

export interface GeometryProjectSummary {
  projectId: string;

  totalPatterns: number;

  totalAreaCm2: number;

  totalPerimeterCm: number;

  averageCompactness: number;

  averageEngineeringScore: number;

  generatedAt: string;
}