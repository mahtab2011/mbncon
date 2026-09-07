import type {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

export type MarkerGrainDirection =
  | "vertical"
  | "horizontal";

export type MarkerRotation =
  | 0
  | 90
  | 180
  | 270;

export type MarkerEfficiencyGrade =
  | "A"
  | "B"
  | "C"
  | "D";

export interface MarkerPiece {
  id: string;

  patternId: string;

  name: string;

  quantity: number;

  widthCm: number;

  heightCm: number;

  areaSqCm: number;

  polygon: GeometryPoint[];

  grainDirection:
    MarkerGrainDirection;

  rotationAllowed: boolean;

  allowedRotations:
    MarkerRotation[];
}

export interface PlacedMarkerPiece {
  id: string;

  sourcePieceId: string;

  patternId: string;

  name: string;

  instanceNumber: number;

  xCm: number;

  yCm: number;

  rotation:
    MarkerRotation;

  widthCm: number;

  heightCm: number;

  areaSqCm: number;

  transformedPolygon:
    GeometryPoint[];
}

export interface MarkerSettings {
  fabricWidthCm: number;

  pieceSpacingCm: number;

  edgeAllowanceCm: number;

  allowRotation: boolean;

  grainDirection:
    MarkerGrainDirection;

  maximumMarkerLengthCm?: number;
}

export interface MarkerLayout {
  id: string;

  projectId: string;

  fabricWidthCm: number;

  markerLengthCm: number;

  markerAreaSqCm: number;

  placedPieces:
    PlacedMarkerPiece[];

  unplacedPieceIds: string[];

  createdAt: string;

  engineVersion: string;
}

export interface MarkerStatistics {
  patternCount: number;

  placedPieceCount: number;

  unplacedPieceCount: number;

  fabricWidthCm: number;

  markerLengthCm: number;

  markerAreaSqCm: number;

  usedPatternAreaSqCm: number;

  markerEfficiencyPercent: number;

  wastePercent: number;

  endLossSqCm: number;

  averageGapCm: number;

  efficiencyGrade:
    MarkerEfficiencyGrade;

  engineeringRecommendation:
    string;
}

export interface MarkerGenerationInput {
  projectId: string;

  pieces: MarkerPiece[];

  settings: MarkerSettings;
}

export interface MarkerGenerationResult {
  success: boolean;

  layout: MarkerLayout;

  statistics: MarkerStatistics;

  warnings: string[];

  explanation: string;
}