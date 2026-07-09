/*
========================================================

GPA AI Pattern Engineering Centre

Polygon Tracer

Version : RC4

Purpose:
Convert detected pattern boundaries into clean polygons
for measurement, area calculation and marker optimisation.

Future:
Curve smoothing
Bezier conversion
Noise reduction
Point simplification
DXF export

========================================================
*/

import { BoundaryPoint, DetectedBoundary } from "./patternBoundaryDetector";

export interface TracedPolygon {
  id: string;
  sourceBoundaryId: string;
  label: string;
  points: BoundaryPoint[];
  pointCount: number;
  closed: boolean;
  confidence: number;
}

export function tracePolygons(
  boundaries: DetectedBoundary[]
): TracedPolygon[] {
  return boundaries.map((boundary) => ({
    id: `polygon-${boundary.id}`,
    sourceBoundaryId: boundary.id,
    label: boundary.label,
    points: boundary.points,
    pointCount: boundary.points.length,
    closed: boundary.closedShape,
    confidence: boundary.confidence,
  }));
}