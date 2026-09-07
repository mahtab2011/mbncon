export interface MarkerRectangle {
  id: string;

  x: number;
  y: number;

  width: number;
  height: number;
}

export interface MarkerCollisionPair {
  firstIndex: number;

  secondIndex: number;

  first: MarkerRectangle;

  second: MarkerRectangle;
}

export function rectanglesOverlap(
  a: MarkerRectangle,
  b: MarkerRectangle
): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

export function isRectangleInsideMarker({
  rectangle,
  markerWidth,
  markerHeight,
}: {
  rectangle: MarkerRectangle;

  markerWidth: number;

  markerHeight: number;
}): boolean {
  return (
    rectangle.x >= 0 &&
    rectangle.y >= 0 &&
    rectangle.x +
      rectangle.width <=
      markerWidth &&
    rectangle.y +
      rectangle.height <=
      markerHeight
  );
}

export function detectMarkerCollisions(
  rectangles: MarkerRectangle[]
): MarkerRectangle[][] {
  const collisions: MarkerRectangle[][] =
    [];

  for (
    let i = 0;
    i < rectangles.length;
    i += 1
  ) {
    for (
      let j = i + 1;
      j < rectangles.length;
      j += 1
    ) {
      if (
        rectanglesOverlap(
          rectangles[i],
          rectangles[j]
        )
      ) {
        collisions.push([
          rectangles[i],
          rectangles[j],
        ]);
      }
    }
  }

  return collisions;
}

export function findRectangleCollisions(
  rectangles: MarkerRectangle[]
): MarkerCollisionPair[] {
  const collisions:
    MarkerCollisionPair[] = [];

  for (
    let firstIndex = 0;
    firstIndex <
    rectangles.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      rectangles.length;
      secondIndex += 1
    ) {
      const first =
        rectangles[firstIndex];

      const second =
        rectangles[secondIndex];

      if (
        rectanglesOverlap(
          first,
          second
        )
      ) {
        collisions.push({
          firstIndex,

          secondIndex,

          first,

          second,
        });
      }
    }
  }

  return collisions;
}