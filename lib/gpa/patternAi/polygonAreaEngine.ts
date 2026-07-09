/*
========================================================

GPA AI Pattern Engineering Centre

Polygon Area Engine

Version : RC4

Purpose:
Calculate true polygon area using the Shoelace Formula.

========================================================
*/

import { BoundaryPoint } from "./patternBoundaryDetector";

export function calculatePolygonAreaInPixels(
  points: BoundaryPoint[]
): number {
  if (points.length < 3) return 0;

  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    sum += current.x * next.y - next.x * current.y;
  }

  return Math.abs(sum) / 2;
}

export function convertPixelAreaToSquareCm(
  pixelArea: number,
  pixelsPerMillimeter: number
): number {
  if (pixelArea <= 0 || pixelsPerMillimeter <= 0) return 0;

  const squareMillimeters =
    pixelArea / (pixelsPerMillimeter * pixelsPerMillimeter);

  return squareMillimeters / 100;
}