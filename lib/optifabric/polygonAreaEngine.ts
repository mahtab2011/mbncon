import { PolygonPoint } from "./polygonTypes";

export function calculatePolygonPixelArea(
  points: PolygonPoint[]
): number {
  if (points.length < 3) {
    return 0;
  }

  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    area += current.x * next.y - next.x * current.y;
  }

  return Number(Math.abs(area / 2).toFixed(2));
}

export function convertPixelAreaToSqInches(
  pixelArea: number,
  scaleLengthInches: number,
  scaleLengthPixels: number
): number {
  if (scaleLengthPixels <= 0) {
    return 0;
  }

  const inchesPerPixel =
    scaleLengthInches / scaleLengthPixels;

  const squareInches =
    pixelArea * inchesPerPixel * inchesPerPixel;

  return Number(squareInches.toFixed(2));
}