"use client";

import type {
  BoundaryPoint,
} from "./BoundaryOverlay";

interface CalibrationOverlayProps {
  points: BoundaryPoint[];

  referenceLengthCm?: number;

  measuredPixels?: number | null;

  pixelsPerCm?: number | null;

  active?: boolean;

  onPointClick?: (
    index: number
  ) => void;
}

export default function CalibrationOverlay({
  points,

  referenceLengthCm = 30.48,

  measuredPixels = null,

  pixelsPerCm = null,

  active = false,

  onPointClick,
}: CalibrationOverlayProps) {
  if (points.length === 0) {
    return null;
  }

  const firstPoint =
    points[0] ?? null;

  const secondPoint =
    points[1] ?? null;

  const midpoint =
    firstPoint && secondPoint
      ? {
          x:
            (firstPoint.x +
              secondPoint.x) /
            2,

          y:
            (firstPoint.y +
              secondPoint.y) /
            2,
        }
      : null;

  return (
    <g
      aria-label="Scale calibration overlay"
      data-calibration-overlay="true"
    >
      {firstPoint &&
      secondPoint ? (
        <>
          <line
            x1={firstPoint.x}
            y1={firstPoint.y}
            x2={secondPoint.x}
            y2={secondPoint.y}
            stroke={
              active
                ? "rgb(250, 204, 21)"
                : "rgb(168, 85, 247)"
            }
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />

          {midpoint ? (
            <CalibrationLabel
              x={midpoint.x}
              y={midpoint.y}
              referenceLengthCm={
                referenceLengthCm
              }
              measuredPixels={
                measuredPixels
              }
              pixelsPerCm={
                pixelsPerCm
              }
            />
          ) : null}
        </>
      ) : null}

      {points.map(
        (point, index) => {
          const label =
            index === 0
              ? "A"
              : index === 1
                ? "B"
                : String(
                    index + 1
                  );

          return (
            <g
              key={`${point.x}-${point.y}-${index}`}
              className={
                onPointClick
                  ? "cursor-pointer"
                  : undefined
              }
              onClick={() =>
                onPointClick?.(
                  index
                )
              }
            >
              <circle
                cx={point.x}
                cy={point.y}
                r={7}
                fill={
                  active
                    ? "rgb(250, 204, 21)"
                    : "rgb(168, 85, 247)"
                }
                stroke="rgb(15, 23, 42)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />

              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="900"
                stroke="rgb(15, 23, 42)"
                strokeWidth="3"
                paintOrder="stroke"
                pointerEvents="none"
              >
                {label}
              </text>
            </g>
          );
        }
      )}
    </g>
  );
}

function CalibrationLabel({
  x,
  y,

  referenceLengthCm,

  measuredPixels,

  pixelsPerCm,
}: {
  x: number;
  y: number;

  referenceLengthCm: number;

  measuredPixels:
    | number
    | null;

  pixelsPerCm:
    | number
    | null;
}) {
  const referenceText =
    `${formatNumber(
      referenceLengthCm,
      2
    )} cm`;

  const pixelText =
    measuredPixels !== null
      ? `${formatNumber(
          measuredPixels,
          1
        )} px`
      : "Pixels pending";

  const scaleText =
    pixelsPerCm !== null
      ? `${formatNumber(
          pixelsPerCm,
          2
        )} px/cm`
      : "Scale pending";

  return (
    <g
      transform={`translate(${x} ${y})`}
      pointerEvents="none"
    >
      <rect
        x="-70"
        y="-42"
        width="140"
        height="64"
        rx="10"
        fill="rgba(15, 23, 42, 0.92)"
        stroke="rgb(168, 85, 247)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />

      <text
        x="0"
        y="-22"
        textAnchor="middle"
        fill="rgb(216, 180, 254)"
        fontSize="12"
        fontWeight="900"
      >
        {referenceText}
      </text>

      <text
        x="0"
        y="-6"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
      >
        {pixelText}
      </text>

      <text
        x="0"
        y="10"
        textAnchor="middle"
        fill="rgb(203, 213, 225)"
        fontSize="10"
        fontWeight="700"
      >
        {scaleText}
      </text>
    </g>
  );
}

function formatNumber(
  value: number,
  decimalPlaces: number
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toFixed(
    decimalPlaces
  );
}