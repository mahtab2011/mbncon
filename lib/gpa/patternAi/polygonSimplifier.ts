/*
========================================================

GPA AI Pattern Engineering Centre

Polygon Simplifier

Version : RC6

Purpose:
Reduce unnecessary polygon points while preserving
the overall pattern shape.

Future:
- Douglas-Peucker Algorithm
- Curve smoothing
- Arc fitting
- Bezier reconstruction
- DXF-quality geometry

========================================================
*/

import { ContourPoint } from "./contourDetector";

export interface SimplifiedPolygon {
  id: string;
  originalPointCount: number;
  simplifiedPointCount: number;
  reductionPercentage: number;
  points: ContourPoint[];
}

export function simplifyPolygon(
  id: string,
  points: ContourPoint[]
): SimplifiedPolygon {

  const simplified =
    points.filter((_, index) => index % 2 === 0);

  const finalPoints =
    simplified.length >= 3 ? simplified : points;

  const reduction =
    (
      (points.length - finalPoints.length) /
      Math.max(points.length, 1)
    ) * 100;

  return {

    id,

    originalPointCount: points.length,

    simplifiedPointCount: finalPoints.length,

    reductionPercentage: Number(
      reduction.toFixed(2)
    ),

    points: finalPoints,

  };

}