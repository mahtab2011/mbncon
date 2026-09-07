"use client";

import { useMemo } from "react";

import {
  getMarkerPieceDisplayColour,
} from "@/lib/optifabric/marker/markerColourEngine";

import {
  createMarkerPreview,
} from "@/lib/optifabric/marker/markerPreviewEngine";

import type {
  MarkerLayout,
} from "@/lib/optifabric/markerTypes";

interface MarkerPreviewPanelProps {
  layout: MarkerLayout | null;

  selectedPieceId?: string | null;

  zoom?: number;

  panX?: number;

  panY?: number;

  onSelectPiece?: (
    pieceId: string
  ) => void;
}

export default function MarkerPreviewPanel({
  layout,

  selectedPieceId = null,

  zoom = 1,

  panX = 0,

  panY = 0,

  onSelectPiece,
}: MarkerPreviewPanelProps) {
  const preview = useMemo(() => {
    if (!layout) {
      return null;
    }

    return createMarkerPreview(
      layout,
      {
        canvasWidth: 1100,
        maximumCanvasHeight: 760,
        padding: 30,
      }
    );
  }, [layout]);

  if (!layout || !preview) {
    return (
      <section className="rounded-3xl border border-dashed border-cyan-400/30 bg-cyan-950/10 p-10 text-center">
        <p className="text-5xl">
          📐
        </p>

        <h2 className="mt-4 text-2xl font-black text-white">
          No Marker Preview Yet
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Generate a marker layout from the saved
          engineering geometry to display the placed
          pattern pieces on the fabric.
        </p>
      </section>
    );
  }

  const {
    viewport,
    renderedPieces,
    fabricBoundary,
  } = preview;

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
            Marker preview
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            CAD Marker Canvas
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {layout.placedPieces.length} piece instance(s)
            placed on {layout.fabricWidthCm.toFixed(2)} cm fabric.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-right">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Marker length
          </p>

          <p className="mt-1 text-xl font-black text-cyan-300">
            {layout.markerLengthCm.toFixed(2)} cm
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <svg
          viewBox={`0 0 ${viewport.viewBoxWidth} ${viewport.viewBoxHeight}`}
          className="min-h-[420px] w-full"
          role="img"
          aria-label="Generated marker layout preview"
        >
          <defs>
            <pattern
              id="marker-grid"
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
          </defs>

          <g
            transform={`translate(${panX} ${panY}) scale(${zoom})`}
          >
            <rect
              x={fabricBoundary.x}
              y={fabricBoundary.y}
              width={fabricBoundary.width}
              height={fabricBoundary.height}
              rx="8"
              fill="rgba(15, 23, 42, 0.96)"
              stroke="rgb(34, 211, 238)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <rect
              x={fabricBoundary.x}
              y={fabricBoundary.y}
              width={fabricBoundary.width}
              height={fabricBoundary.height}
              rx="8"
              fill="url(#marker-grid)"
            />

            {renderedPieces.map(
              (piece) => {
                const selected =
                  selectedPieceId ===
                  piece.id;

                const colour =
                  getMarkerPieceDisplayColour({
                    pieceId:
                      piece.sourcePieceId,
                    selected,
                    invalid:
                      piece.outsideMarker,
                  });

                return (
                  <g
                    key={piece.id}
                    onClick={() =>
                      onSelectPiece?.(
                        piece.id
                      )
                    }
                    className="cursor-pointer"
                  >
                    <polygon
                      points={
                        piece.polygonPointString
                      }
                      fill={colour.fill}
                      stroke={colour.stroke}
                      strokeWidth={
                        selected ? 4 : 2
                      }
                      vectorEffect="non-scaling-stroke"
                    />

                    <text
                      x={piece.labelX}
                      y={piece.labelY}
                      fill={colour.text}
                      fontSize="12"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      vectorEffect="non-scaling-stroke"
                    >
                      {piece.name}
                    </text>

                    <text
                      x={piece.labelX}
                      y={piece.labelY + 16}
                      fill="rgb(148, 163, 184)"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      vectorEffect="non-scaling-stroke"
                    >
                      #{piece.instanceNumber} · {piece.rotation}°
                    </text>
                  </g>
                );
              }
            )}
          </g>
        </svg>
      </div>

      {layout.unplacedPieceIds.length > 0 ? (
        <div className="mt-5 rounded-xl border border-red-400/30 bg-red-950/20 p-4 text-sm leading-6 text-red-200">
          {layout.unplacedPieceIds.length} piece
          instance(s) could not be placed within the
          current marker constraints.
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-4 text-sm font-black text-emerald-300">
          ✓ All requested pieces were placed inside the marker.
        </div>
      )}
    </section>
  );
}