"use client";

import { useMemo } from "react";

import {
  createMarkerPreview,
} from "@/lib/optifabric/marker/markerPreviewEngine";

import type {
  MarkerLayout,
} from "@/lib/optifabric/markerTypes";

import MarkerPiece from "./MarkerPiece";

interface MarkerCanvasProps {
  layout: MarkerLayout | null;

  selectedPieceId?: string | null;

  zoom?: number;

  panX?: number;

  panY?: number;

  showGrid?: boolean;

  showLabels?: boolean;

  showRotation?: boolean;

  onSelectPiece?: (
    pieceId: string
  ) => void;
}

export default function MarkerCanvas({
  layout,

  selectedPieceId = null,

  zoom = 1,

  panX = 0,

  panY = 0,

  showGrid = true,

  showLabels = true,

  showRotation = true,

  onSelectPiece,
}: MarkerCanvasProps) {
  const preview = useMemo(() => {
    if (!layout) {
      return null;
    }

    return createMarkerPreview(
      layout,
      {
        canvasWidth: 1100,

        maximumCanvasHeight:
          760,

        padding: 30,
      }
    );
  }, [layout]);

  if (!layout || !preview) {
    return (
      <div className="flex min-h-[440px] items-center justify-center rounded-2xl border border-dashed border-cyan-400/30 bg-slate-950/70 p-8 text-center">
        <div>
          <p className="text-6xl">
            📐
          </p>

          <h3 className="mt-5 text-2xl font-black text-white">
            CAD Canvas Waiting
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Generate a marker layout
            before opening the visual CAD
            canvas.
          </p>
        </div>
      </div>
    );
  }

  const {
    viewport,
    renderedPieces,
    fabricBoundary,
  } = preview;

  const safeZoom =
    Number.isFinite(zoom) &&
    zoom > 0
      ? zoom
      : 1;

  const gridId =
    `marker-grid-${layout.id}`
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      );

  return (
    <div className="overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <svg
        viewBox={`0 0 ${viewport.viewBoxWidth} ${viewport.viewBoxHeight}`}
        className="min-h-[440px] w-full"
        role="img"
        aria-label="OptiFabric generated marker layout canvas"
      >
        <defs>
          <pattern
            id={gridId}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(148, 163, 184, 0.10)"
              strokeWidth="1"
            />
          </pattern>

          <filter
            id="marker-piece-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="rgba(0, 0, 0, 0.50)"
            />
          </filter>
        </defs>

        <g
          transform={`translate(${panX} ${panY}) scale(${safeZoom})`}
        >
          <rect
            x={fabricBoundary.x}
            y={fabricBoundary.y}
            width={
              fabricBoundary.width
            }
            height={
              fabricBoundary.height
            }
            rx="8"
            fill="rgba(15, 23, 42, 0.98)"
            stroke="rgb(34, 211, 238)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {showGrid ? (
            <rect
              x={fabricBoundary.x}
              y={fabricBoundary.y}
              width={
                fabricBoundary.width
              }
              height={
                fabricBoundary.height
              }
              rx="8"
              fill={`url(#${gridId})`}
              pointerEvents="none"
            />
          ) : null}

          <line
            x1={fabricBoundary.x}
            y1={
              fabricBoundary.y -
              10
            }
            x2={
              fabricBoundary.x +
              fabricBoundary.width
            }
            y2={
              fabricBoundary.y -
              10
            }
            stroke="rgb(148, 163, 184)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          <text
            x={
              fabricBoundary.x +
              fabricBoundary.width /
                2
            }
            y={
              fabricBoundary.y -
              16
            }
            fill="rgb(148, 163, 184)"
            fontSize="11"
            fontWeight="800"
            textAnchor="middle"
            vectorEffect="non-scaling-stroke"
          >
            FABRIC WIDTH{" "}
            {layout.fabricWidthCm.toFixed(
              2
            )}{" "}
            CM
          </text>

          <g filter="url(#marker-piece-shadow)">
            {renderedPieces.map(
              (piece) => (
                <MarkerPiece
                  key={piece.id}
                  piece={piece}
                  selected={
                    selectedPieceId ===
                    piece.id
                  }
                  showLabel={
                    showLabels
                  }
                  showRotation={
                    showRotation
                  }
                  onSelect={
                    onSelectPiece
                  }
                />
              )
            )}
          </g>

          <text
            x={
              fabricBoundary.x +
              12
            }
            y={
              fabricBoundary.y +
              fabricBoundary.height -
              12
            }
            fill="rgb(100, 116, 139)"
            fontSize="10"
            fontWeight="800"
            vectorEffect="non-scaling-stroke"
          >
            MARKER LENGTH{" "}
            {layout.markerLengthCm.toFixed(
              2
            )}{" "}
            CM
          </text>
        </g>
      </svg>
    </div>
  );
}