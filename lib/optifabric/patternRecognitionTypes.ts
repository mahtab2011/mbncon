export type PatternMaterialCategory =
  | "main-fabric"
  | "lining"
  | "fusing"
  | "interlining"
  | "contrast"
  | "pocketing"
  | "unknown";

export type PatternSide =
  | "left"
  | "right"
  | "centre"
  | "pair"
  | "not-applicable"
  | "unknown";

export type GrainDirection =
  | "vertical"
  | "horizontal"
  | "bias"
  | "any"
  | "unknown";

export type PatternSymmetry =
  | "symmetrical"
  | "asymmetrical"
  | "partially-symmetrical"
  | "unknown";

export type MarkerRotationRule =
  | "fixed"
  | "rotate-180"
  | "rotate-90"
  | "free-rotation"
  | "unknown";

export type PatternRecognitionStatus =
  | "pending"
  | "analysing"
  | "recognised"
  | "requires-review"
  | "rejected";

export interface PatternRecognitionConfidence {
  overall: number;
  pieceName: number;
  materialCategory: number;
  side: number;
  grainDirection: number;
  symmetry: number;
  foldDetection: number;
  pairing: number;
  geometry: number;
}

export interface PatternBoundingBox {
  widthPixels: number;
  heightPixels: number;
  widthCm?: number;
  heightCm?: number;
}

export interface PatternRecognitionDimensions {
  widthCm?: number;
  heightCm?: number;
  perimeterCm?: number;
  areaSqCm?: number;
  boundingBox?: PatternBoundingBox;
}

export interface PatternRecognitionRestriction {
  id: string;
  type:
    | "grain"
    | "fold"
    | "rotation"
    | "pairing"
    | "directional-fabric"
    | "stripe"
    | "check"
    | "nap"
    | "manual";
  message: string;
  blocking: boolean;
}

export interface PatternRecognitionWarning {
  id: string;
  code:
    | "LOW_CONFIDENCE"
    | "MISSING_GRAIN_LINE"
    | "UNCLEAR_BOUNDARY"
    | "POSSIBLE_DUPLICATE"
    | "PAIR_NOT_FOUND"
    | "FOLD_EDGE_NOT_CONFIRMED"
    | "DIMENSIONS_NOT_CALIBRATED"
    | "MATERIAL_UNKNOWN"
    | "MANUAL_REVIEW_REQUIRED";
  message: string;
  severity: "info" | "warning" | "critical";
}

export interface RecognisedPatternPiece {
  patternId: string;
  projectId: string;

  originalName: string;
  recognisedName: string;

  materialCategory: PatternMaterialCategory;
  side: PatternSide;
  grainDirection: GrainDirection;
  symmetry: PatternSymmetry;
  rotationRule: MarkerRotationRule;

  cutQuantity: number;
  cutOnFold: boolean;
  requiresPair: boolean;
  markerEligible: boolean;

  status: PatternRecognitionStatus;

  dimensions: PatternRecognitionDimensions;
  confidence: PatternRecognitionConfidence;

  restrictions: PatternRecognitionRestriction[];
  warnings: PatternRecognitionWarning[];

  explanation: string;
  analysedAt: string;
}

export interface PatternRecognitionInput {
  patternId: string;
  projectId: string;
  name: string;

  required?: boolean;
  cutQuantity?: number;
  cutOnFold?: boolean;
  custom?: boolean;
  sequence?: number;
  description?: string;

  imageUrl?: string;
  fileName?: string;
  uploaded?: boolean;

  detectedWidthPixels?: number;
  detectedHeightPixels?: number;

  calibratedWidthCm?: number;
  calibratedHeightCm?: number;
  calibratedAreaSqCm?: number;
  calibratedPerimeterCm?: number;
}

export interface PatternRecognitionProjectResult {
  projectId: string;
  totalPatterns: number;
  recognisedPatterns: number;
  reviewRequired: number;
  rejectedPatterns: number;
  markerEligiblePatterns: number;
  averageConfidence: number;
  patterns: RecognisedPatternPiece[];
  completedAt: string;
}

export interface PatternRecognitionSummary {
  totalPatterns: number;
  mainFabricPatterns: number;
  liningPatterns: number;
  fusingPatterns: number;
  foldPatterns: number;
  pairedPatterns: number;
  markerEligiblePatterns: number;
  reviewRequired: number;
  averageConfidence: number;
}

export const createEmptyRecognitionConfidence =
  (): PatternRecognitionConfidence => ({
    overall: 0,
    pieceName: 0,
    materialCategory: 0,
    side: 0,
    grainDirection: 0,
    symmetry: 0,
    foldDetection: 0,
    pairing: 0,
    geometry: 0,
  });