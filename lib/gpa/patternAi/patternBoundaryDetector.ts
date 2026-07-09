/*
========================================================

GPA AI Pattern Engineering Centre

Pattern Boundary Detector

Version : RC4

Purpose:
Detect pattern boundary outlines from calibrated images.

Future:
OpenCV contour detection
Canny edge detection
Noise removal
Closed contour validation

========================================================
*/

export interface BoundaryPoint {
  x: number;
  y: number;
}

export interface DetectedBoundary {
  id: string;
  label: string;
  points: BoundaryPoint[];
  confidence: number;
  closedShape: boolean;
}

export function detectPatternBoundaries(): DetectedBoundary[] {
  return [
    {
      id: "piece-front-001",
      label: "Detected Pattern Piece 1",
      confidence: 0.989,
      closedShape: true,
      points: [
        { x: 10, y: 10 },
        { x: 180, y: 12 },
        { x: 190, y: 420 },
        { x: 20, y: 418 },
      ],
    },
    {
      id: "piece-back-001",
      label: "Detected Pattern Piece 2",
      confidence: 0.984,
      closedShape: true,
      points: [
        { x: 220, y: 15 },
        { x: 395, y: 18 },
        { x: 402, y: 430 },
        { x: 230, y: 426 },
      ],
    },
  ];
}