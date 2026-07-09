/*
========================================================

GPA AI Pattern Engineering Centre

Dimension Engine

Version : RC4

Purpose:
Calculate real pattern dimensions from calibrated polygon points.

========================================================
*/

import { BoundaryPoint } from "./patternBoundaryDetector";

export interface PatternDimensions {
  widthCm: number;
  heightCm: number;
  perimeterCm: number;
}

export function calculatePatternDimensions(
  points: BoundaryPoint[],
  pixelsPerMillimeter: number
): PatternDimensions {
  if (points.length < 2 || pixelsPerMillimeter <= 0) {
    return {
      widthCm: 0,
      heightCm: 0,
      perimeterCm: 0,
    };
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  const widthPixels = Math.max(...xs) - Math.min(...xs);
  const heightPixels = Math.max(...ys) - Math.min(...ys);

  let perimeterPixels = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    perimeterPixels += Math.hypot(
      next.x - current.x,
      next.y - current.y
    );
  }

  return {
    widthCm: widthPixels / pixelsPerMillimeter / 10,
    heightCm: heightPixels / pixelsPerMillimeter / 10,
    perimeterCm: perimeterPixels / pixelsPerMillimeter / 10,
  };
}