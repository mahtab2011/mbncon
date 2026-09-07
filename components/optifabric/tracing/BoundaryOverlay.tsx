"use client";

export interface BoundaryPoint {
  x: number;
  y: number;
}

interface BoundaryOverlayProps {
  points: BoundaryPoint[];

  closed?: boolean;

  showVertices?: boolean;

  showFill?: boolean;

  activeVertexIndex?: number | null;

  strokeWidth?: number;

  onVertexClick?: (
    index: number
  ) => void;
}

export default function BoundaryOverlay({
  points,

  closed = true,

  showVertices = true,

  showFill = true,

  activeVertexIndex = null,

  strokeWidth = 2,

  onVertexClick,
}: BoundaryOverlayProps) {
  if (points.length === 0) {
    return null;
  }

  const polygonPoints = points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(" ");

  const linePath = createBoundaryPath(
    points,
    closed
  );

  return (
    <g
      aria-label="Detected pattern boundary"
      data-boundary-overlay="true"
    >
      {showFill &&
      closed &&
      points.length >= 3 ? (
        <polygon
          points={polygonPoints}
          fill="rgba(34, 211, 238, 0.10)"
          stroke="none"
          pointerEvents="none"
        />
      ) : null}

      <path
        d={linePath}
        fill="none"
        stroke="rgb(34, 211, 238)"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />

      {showVertices
        ? points.map(
            (point, index) => {
              const isActive =
                activeVertexIndex ===
                index;

              return (
                <circle
                  key={`${point.x}-${point.y}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 5 : 3.5}
                  fill={
                    isActive
                      ? "rgb(250, 204, 21)"
                      : "rgb(15, 23, 42)"
                  }
                  stroke={
                    isActive
                      ? "rgb(254, 240, 138)"
                      : "rgb(34, 211, 238)"
                  }
                  strokeWidth={
                    isActive ? 2.5 : 2
                  }
                  vectorEffect="non-scaling-stroke"
                  className={
                    onVertexClick
                      ? "cursor-pointer"
                      : undefined
                  }
                  onClick={() =>
                    onVertexClick?.(
                      index
                    )
                  }
                />
              );
            }
          )
        : null}

      {closed &&
      points.length >= 3 ? (
        <BoundaryDirectionMarker
          points={points}
        />
      ) : null}
    </g>
  );
}

function createBoundaryPath(
  points: BoundaryPoint[],
  closed: boolean
): string {
  if (points.length === 0) {
    return "";
  }

  const pathParts = [
    `M ${points[0].x} ${points[0].y}`,
  ];

  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    pathParts.push(
      `L ${points[index].x} ${points[index].y}`
    );
  }

  if (closed && points.length >= 3) {
    pathParts.push("Z");
  }

  return pathParts.join(" ");
}

function BoundaryDirectionMarker({
  points,
}: {
  points: BoundaryPoint[];
}) {
  if (points.length < 2) {
    return null;
  }

  const firstPoint = points[0];
  const secondPoint = points[1];

  const midpointX =
    (firstPoint.x +
      secondPoint.x) /
    2;

  const midpointY =
    (firstPoint.y +
      secondPoint.y) /
    2;

  const angle =
    Math.atan2(
      secondPoint.y -
        firstPoint.y,

      secondPoint.x -
        firstPoint.x
    ) *
    (180 / Math.PI);

  return (
    <g
      transform={`translate(${midpointX} ${midpointY}) rotate(${angle})`}
      pointerEvents="none"
    >
      <path
        d="M -6 -4 L 2 0 L -6 4 Z"
        fill="rgb(34, 211, 238)"
        stroke="rgb(15, 23, 42)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}