/*
========================================================

GPA AI Pattern Engineering Centre

Pattern Recognition Engine

Version : RC4

Purpose:
Classify detected pattern pieces into garment components.

Future:
TensorFlow
YOLO
Vision Transformer
OpenCV Shape Matching

========================================================
*/

import { TracedPolygon } from "./polygonTracer";

export interface RecognizedPattern {
  id: string;
  label: string;
  confidence: number;
  category:
    | "Front"
    | "Back"
    | "Sleeve"
    | "Collar"
    | "Pocket"
    | "Cuff"
    | "Waistband"
    | "Facing"
    | "Unknown";
}

const DEFAULT_SEQUENCE: RecognizedPattern["category"][] = [
  "Front",
  "Back",
  "Sleeve",
  "Sleeve",
  "Collar",
  "Pocket",
  "Cuff",
  "Waistband",
  "Facing",
];

export function recognizePatterns(
  polygons: TracedPolygon[]
): RecognizedPattern[] {
  return polygons.map((polygon, index) => ({
    id: polygon.id,
    label: polygon.label,
    confidence: polygon.confidence,
    category:
      DEFAULT_SEQUENCE[index] ??
      "Unknown",
  }));
}