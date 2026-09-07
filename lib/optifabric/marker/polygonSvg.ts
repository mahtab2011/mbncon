export interface SvgPoint {
  x: number;
  y: number;
}

export function polygonToSvgPoints(
  vertices: SvgPoint[],
  targetWidth: number,
  targetHeight: number
): string {
  if (vertices.length === 0) {
    return "";
  }

  const xs = vertices.map((v) => v.x);
  const ys = vertices.map((v) => v.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width =
    Math.max(maxX - minX, 1);

  const height =
    Math.max(maxY - minY, 1);

  return vertices
    .map((vertex) => {
      const x =
        ((vertex.x - minX) /
          width) *
        targetWidth;

      const y =
        ((vertex.y - minY) /
          height) *
        targetHeight;

      return `${x.toFixed(
        2
      )},${y.toFixed(2)}`;
    })
    .join(" ");
}