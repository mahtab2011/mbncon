import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

export type PatternTracingStatus =
  | "not-started"
  | "in-progress"
  | "boundary-closed"
  | "calibrated"
  | "ready"
  | "requires-review";

export type PatternTracingTool =
  | "select"
  | "trace"
  | "calibrate"
  | "grain-line"
  | "pan";

export type PatternImageFileType =
  | "image/png"
  | "image/jpeg"
  | "application/pdf"
  | "unknown";

export interface PatternTracingImage {
  fileName?: string;
  fileType?: PatternImageFileType;

  sourceUrl?: string;

  naturalWidth?: number;
  naturalHeight?: number;

  displayWidth?: number;
  displayHeight?: number;
}

export interface PatternScalePoint {
  x: number;
  y: number;
}

export interface PatternScaleCalibration {
  firstPoint?: PatternScalePoint;
  secondPoint?: PatternScalePoint;

  referenceLengthCm: number;

  measuredPixels?: number;
  pixelsPerCm?: number;
  pixelsPerInch?: number;

  calibrated: boolean;
  calibratedAt?: string;
}

// Stage 2B-3: a pattern piece's grain line, marked with the same two-point
// click interaction as PatternScaleCalibration's firstPoint/secondPoint
// above (activate the tool, click twice). Deliberately does NOT carry a
// computed length — like the boundary's own width/height/area/perimeter,
// physical length depends on calibration.pixelsPerCm, which can change
// after the points are placed, so it is derived live (see the trace page's
// own grainLineLengthCm) and only frozen into a flat field at save time,
// same treatment as calibratedWidthCm etc. below.
export interface PatternGrainLine {
  firstPoint?: GeometryPoint;
  secondPoint?: GeometryPoint;

  marked: boolean;
}

export interface PatternTracingViewport {
  zoom: number;

  offsetX: number;
  offsetY: number;

  minimumZoom: number;
  maximumZoom: number;
}

export interface PatternTracingBoundary {
  vertices: GeometryPoint[];

  closed: boolean;
  vertexCount: number;

  startedAt?: string;
  closedAt?: string;
}

export interface PatternTracingMeasurement {
  widthPixels?: number;
  heightPixels?: number;

  widthCm?: number;
  heightCm?: number;

  areaSquarePixels?: number;
  areaSquareCm?: number;

  perimeterPixels?: number;
  perimeterCm?: number;
}

export interface PatternTracingValidation {
  hasImage: boolean;

  hasMinimumVertices: boolean;
  boundaryClosed: boolean;

  scalePointCount: number;
  calibrationCompleted: boolean;

  measurementAvailable: boolean;

  geometryReady: boolean;

  warnings: string[];
}

export interface SavedPatternTracingData {
  patternId: string;
  projectId: string;

  patternName: string;

  status: PatternTracingStatus;

  image: PatternTracingImage;

  boundary: PatternTracingBoundary;

  calibration: PatternScaleCalibration;

  measurement: PatternTracingMeasurement;

  validation: PatternTracingValidation;

  createdAt: string;
  updatedAt: string;
}

export interface PatternTracingWorkspaceState {
  activeTool: PatternTracingTool;

  selectedVertexIndex?: number;

  boundary: PatternTracingBoundary;

  calibration: PatternScaleCalibration;

  viewport: PatternTracingViewport;

  image: PatternTracingImage;

  measurement: PatternTracingMeasurement;

  validation: PatternTracingValidation;

  hasUnsavedChanges: boolean;
}

export interface PatternTracingProjectFields {
  geometryVertices?: GeometryPoint[];
  polygonVertices?: GeometryPoint[];

  pixelsPerCm?: number;
  pixelsPerInch?: number;

  detectedWidthPixels?: number;
  detectedHeightPixels?: number;

  calibratedWidthCm?: number;
  calibratedHeightCm?: number;

  calibratedAreaSqCm?: number;
  calibratedPerimeterCm?: number;

  // Stage 2B-3 — flat like polygonVertices/geometryVertices above (not
  // nested under patternTracing), so a grain line survives fresh-device
  // reconstruction and Stage 2B-2 cached-device reconciliation the same way
  // the traced polygon does, without needing local image metadata. Optional
  // and additive: absent on every pattern piece saved before this stage.
  grainLineFirstPoint?: GeometryPoint;
  grainLineSecondPoint?: GeometryPoint;
  grainLineLengthCm?: number;

  geometryTracingCompleted?: boolean;
  geometryTracingCompletedAt?: string;

  patternTracing?: SavedPatternTracingData;
}

export const DEFAULT_REFERENCE_LENGTH_CM = 30.48;

export const DEFAULT_PATTERN_TRACING_VIEWPORT:
  PatternTracingViewport = {
    zoom: 1,

    offsetX: 0,
    offsetY: 0,

    minimumZoom: 0.25,
    maximumZoom: 5,
  };

export function createEmptyPatternBoundary():
  PatternTracingBoundary {
  return {
    vertices: [],
    closed: false,
    vertexCount: 0,
  };
}

export function createEmptyScaleCalibration():
  PatternScaleCalibration {
  return {
    referenceLengthCm:
      DEFAULT_REFERENCE_LENGTH_CM,

    calibrated: false,
  };
}

export function createEmptyGrainLine():
  PatternGrainLine {
  return {
    marked: false,
  };
}

export function createEmptyTracingMeasurement():
  PatternTracingMeasurement {
  return {};
}

export function createEmptyTracingValidation():
  PatternTracingValidation {
  return {
    hasImage: false,

    hasMinimumVertices: false,
    boundaryClosed: false,

    scalePointCount: 0,
    calibrationCompleted: false,

    measurementAvailable: false,

    geometryReady: false,

    warnings: [],
  };
}

export function createInitialTracingWorkspaceState():
  PatternTracingWorkspaceState {
  return {
    activeTool: "trace",

    boundary:
      createEmptyPatternBoundary(),

    calibration:
      createEmptyScaleCalibration(),

    viewport: {
      ...DEFAULT_PATTERN_TRACING_VIEWPORT,
    },

    image: {},

    measurement:
      createEmptyTracingMeasurement(),

    validation:
      createEmptyTracingValidation(),

    hasUnsavedChanges: false,
  };
}