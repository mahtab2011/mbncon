export interface SavedGeometryRecord {
  id: string;

  projectId: string;

  patternId: string;

  garmentType: string;

  patternPiece: string;

  widthCm: number;

  heightCm: number;

  areaSqCm: number;

  perimeterCm: number;

  pixelArea: number;

  pixelsPerCm: number;

  vertexCount: number;

  boundaryClosed: boolean;

  boundaryQualityScore: number;

  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };

  grainLineLengthCm?: number;

  orientation: "portrait" | "landscape";

  geometryVersion: string;

  savedAt: string;

  polygon: {
    x: number;
    y: number;
  }[];
}