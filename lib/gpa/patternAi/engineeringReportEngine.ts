/*
========================================================

GPA AI Pattern Engineering Centre

Engineering Report Engine

Version : RC4

Purpose:
Combine all AI engineering engines into a single
production-ready engineering report.

========================================================
*/

import { ImportedPatternDocument } from "./pdfPatternImporter";
import { CalibrationResult } from "./imageCalibration";
import { DetectedBoundary } from "./patternBoundaryDetector";
import { TracedPolygon } from "./polygonTracer";
import { RecognizedPattern } from "./patternRecognitionEngine";
import { MarkerOptimizationResult } from "./markerOptimizationEngine";

export interface EngineeringReport {

  document: ImportedPatternDocument;

  calibration: CalibrationResult;

  boundaries: DetectedBoundary[];

  polygons: TracedPolygon[];

  patterns: RecognizedPattern[];

  marker: MarkerOptimizationResult;

  generatedAt: Date;

}

export function generateEngineeringReport(

  document: ImportedPatternDocument,

  calibration: CalibrationResult,

  boundaries: DetectedBoundary[],

  polygons: TracedPolygon[],

  patterns: RecognizedPattern[],

  marker: MarkerOptimizationResult

): EngineeringReport {

  return {

    document,

    calibration,

    boundaries,

    polygons,

    patterns,

    marker,

    generatedAt: new Date(),

  };

}