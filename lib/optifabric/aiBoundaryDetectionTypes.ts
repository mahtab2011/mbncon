import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

export type BoundaryDetectionStatus =
  | "idle"
  | "analysing"
  | "detected"
  | "requires-review"
  | "failed";

export type BoundaryDetectionMethod =
  | "foreground-estimation"
  | "contrast-detection"
  | "edge-detection"
  | "fallback-envelope";

export interface BoundaryDetectionImageInput {
  imageWidth: number;
  imageHeight: number;

  sourceUrl?: string;
  fileName?: string;

  backgroundExpected?: "light" | "dark" | "unknown";
}

export interface BoundaryDetectionSettings {
  edgeThreshold: number;
  contrastThreshold: number;

  simplifyTolerance: number;
  minimumVertexCount: number;
  maximumVertexCount: number;

  imagePaddingRatio: number;

  removeSmallRegions: boolean;
  closeBoundaryGaps: boolean;
}

export interface BoundaryDetectionQuality {
  confidence: number;

  boundaryCoverage: number;
  edgeContinuity: number;
  foregroundSeparation: number;
  polygonSimplicity: number;

  requiresManualReview: boolean;
}

export interface BoundaryDetectionWarning {
  id: string;

  code:
    | "LOW_CONFIDENCE"
    | "LOW_CONTRAST"
    | "EDGE_GAPS"
    | "TOO_FEW_VERTICES"
    | "TOO_MANY_VERTICES"
    | "IMAGE_NOT_AVAILABLE"
    | "FALLBACK_BOUNDARY_USED"
    | "MANUAL_REVIEW_REQUIRED";

  message: string;

  severity:
    | "info"
    | "warning"
    | "critical";
}

export interface BoundaryDetectionResult {
  status: BoundaryDetectionStatus;
  method: BoundaryDetectionMethod;

  vertices: GeometryPoint[];

  closed: boolean;
  vertexCount: number;

  quality: BoundaryDetectionQuality;

  warnings: BoundaryDetectionWarning[];

  explanation: string;

  analysedAt: string;
}

export interface BoundaryDetectionEngineInput {
  image: BoundaryDetectionImageInput;

  settings?: Partial<
    BoundaryDetectionSettings
  >;

  imageData?: ImageData;
}

export const DEFAULT_BOUNDARY_DETECTION_SETTINGS:
  BoundaryDetectionSettings = {
    edgeThreshold: 38,
    contrastThreshold: 28,

    simplifyTolerance: 3,
    minimumVertexCount: 8,
    maximumVertexCount: 120,

    imagePaddingRatio: 0.06,

    removeSmallRegions: true,
    closeBoundaryGaps: true,
  };

export function createEmptyBoundaryQuality():
  BoundaryDetectionQuality {
  return {
    confidence: 0,

    boundaryCoverage: 0,
    edgeContinuity: 0,
    foregroundSeparation: 0,
    polygonSimplicity: 0,

    requiresManualReview: true,
  };
}

export function createEmptyBoundaryDetectionResult():
  BoundaryDetectionResult {
  return {
    status: "idle",
    method: "fallback-envelope",

    vertices: [],

    closed: false,
    vertexCount: 0,

    quality:
      createEmptyBoundaryQuality(),

    warnings: [],

    explanation:
      "Boundary detection has not been run.",

    analysedAt:
      new Date().toISOString(),
  };
}