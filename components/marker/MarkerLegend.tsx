"use client";

import { useMemo } from "react";

import {
  getMarkerPieceColour,
} from "@/lib/optifabric/marker/markerColourEngine";

import type {
  MarkerLayout,
} from "@/lib/optifabric/markerTypes";

interface MarkerLegendProps {
  layout: MarkerLayout | null;

  selectedPieceId?: string | null;

  onSelectPiece?: (
    pieceId: string
  ) => void;
}

interface LegendItem {
  sourcePieceId: string;

  name: string;

  instanceCount: number;

  placedPieceIds: string[];

  rotations: number[];
}

export default function MarkerLegend({
  layout,

  selectedPieceId = null,

  onSelectPiece,
}: MarkerLegendProps) {
  const legendItems =
    useMemo<LegendItem[]>(() => {
      if (!layout) {
        return [];
      }

      const itemMap =
        new Map<
          string,
          LegendItem
        >();

      for (
        const piece
        of layout.placedPieces
      ) {
        const existing =
          itemMap.get(
            piece.sourcePieceId
          );

        if (existing) {
          existing.instanceCount +=
            1;

          existing.placedPieceIds.push(
            piece.id
          );

          if (
            !existing.rotations.includes(
              piece.rotation
            )
          ) {
            existing.rotations.push(
              piece.rotation
            );
          }

          continue;
        }

        itemMap.set(
          piece.sourcePieceId,
          {
            sourcePieceId:
              piece.sourcePieceId,

            name:
              piece.name,

            instanceCount: 1,

            placedPieceIds: [
              piece.id,
            ],

            rotations: [
              piece.rotation,
            ],
          }
        );
      }

      return Array.from(
        itemMap.values()
      ).sort(
        (first, second) =>
          first.name.localeCompare(
            second.name
          )
      );
    }, [layout]);

  if (
    !layout ||
    legendItems.length === 0
  ) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-center">
        <p className="font-black text-slate-400">
          Marker legend pending
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Generate a marker layout to
          display pattern-piece colours
          and placement quantities.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Marker legend
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Pattern Pieces
          </h3>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Types
          </p>

          <p className="mt-1 text-lg font-black text-cyan-300">
            {legendItems.length}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {legendItems.map(
          (item) => {
            const colour =
              getMarkerPieceColour(
                item.sourcePieceId
              );

            const selected =
              item.placedPieceIds.includes(
                selectedPieceId ??
                  ""
              );

            const firstPlacedPieceId =
              item.placedPieceIds[0];

            return (
              <button
                key={
                  item.sourcePieceId
                }
                type="button"
                onClick={() =>
                  onSelectPiece?.(
                    firstPlacedPieceId
                  )
                }
                className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-950/30"
                    : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-5 w-5 shrink-0 rounded-md border-2"
                    style={{
                      background:
                        selected
                          ? colour.selectedFill
                          : colour.fill,

                      borderColor:
                        selected
                          ? colour.selectedStroke
                          : colour.stroke,
                    }}
                  />

                  <div className="min-w-0">
                    <p className="truncate font-black text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Rotation:{" "}
                      {item.rotations
                        .sort(
                          (
                            first,
                            second
                          ) =>
                            first -
                            second
                        )
                        .map(
                          (rotation) =>
                            `${rotation}°`
                        )
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-slate-600 bg-slate-950 px-3 py-1 text-xs font-black text-slate-300">
                  {
                    item.instanceCount
                  }{" "}
                  pcs
                </span>
              </button>
            );
          }
        )}
      </div>

      {layout.unplacedPieceIds
        .length > 0 ? (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-950/20 px-4 py-3">
          <p className="font-black text-red-300">
            Unplaced pieces
          </p>

          <p className="mt-1 text-sm text-red-100">
            {
              layout
                .unplacedPieceIds
                .length
            }{" "}
            piece instance(s) require
            engineering review.
          </p>
        </div>
      ) : null}
    </section>
  );
}