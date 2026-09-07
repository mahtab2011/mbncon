"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  MarkerLayout,
} from "@/lib/optifabric/markerTypes";

import MarkerCanvas from "./MarkerCanvas";
import MarkerLegend from "./MarkerLegend";

interface MarkerPreviewPageProps {
  layout: MarkerLayout | null;

  projectName?: string;

  title?: string;
}

export default function MarkerPreviewPage({
  layout,

  projectName =
    "Engineering Project",

  title =
    "Marker CAD Preview",
}: MarkerPreviewPageProps) {
  const [
    selectedPieceId,
    setSelectedPieceId,
  ] = useState<string | null>(
    null
  );

  const [
    zoom,
    setZoom,
  ] = useState(1);

  const [
    panX,
    setPanX,
  ] = useState(0);

  const [
    panY,
    setPanY,
  ] = useState(0);

  const [
    showGrid,
    setShowGrid,
  ] = useState(true);

  const [
    showLabels,
    setShowLabels,
  ] = useState(true);

  const [
    showRotation,
    setShowRotation,
  ] = useState(true);

  const selectedPiece =
    useMemo(() => {
      if (
        !layout ||
        !selectedPieceId
      ) {
        return null;
      }

      return (
        layout.placedPieces.find(
          (piece) =>
            piece.id ===
            selectedPieceId
        ) ?? null
      );
    }, [
      layout,
      selectedPieceId,
    ]);

  function zoomIn() {
    setZoom((current) =>
      Math.min(
        current * 1.2,
        4
      )
    );
  }

  function zoomOut() {
    setZoom((current) =>
      Math.max(
        current / 1.2,
        0.4
      )
    );
  }

  function resetView() {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }

  function fitView() {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }

  function pan(
    direction:
      | "left"
      | "right"
      | "up"
      | "down"
  ) {
    const movement = 30;

    if (direction === "left") {
      setPanX(
        (current) =>
          current - movement
      );
    }

    if (direction === "right") {
      setPanX(
        (current) =>
          current + movement
      );
    }

    if (direction === "up") {
      setPanY(
        (current) =>
          current - movement
      );
    }

    if (direction === "down") {
      setPanY(
        (current) =>
          current + movement
      );
    }
  }

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-5 sm:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            OptiFabric AI · CAD
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {title}
          </h2>

          <p className="mt-2 text-xl font-black text-cyan-100">
            {projectName}
          </p>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Inspect placed pattern
            polygons, select individual
            pieces, review rotation and
            navigate the generated marker
            without recalculating the
            engineering layout.
          </p>
        </div>

        <div className="grid min-w-64 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Metric
            label="Placed"
            value={
              layout
                ? String(
                    layout
                      .placedPieces
                      .length
                  )
                : "0"
            }
          />

          <Metric
            label="Unplaced"
            value={
              layout
                ? String(
                    layout
                      .unplacedPieceIds
                      .length
                  )
                : "0"
            }
          />
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              CAD Controls
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Zoom, pan and control
              marker display layers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              label="−"
              disabled={!layout}
              onClick={zoomOut}
            />

            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-black text-white">
              {(zoom * 100).toFixed(
                0
              )}
              %
            </div>

            <ToolbarButton
              label="+"
              disabled={!layout}
              onClick={zoomIn}
            />

            <ToolbarButton
              label="←"
              disabled={!layout}
              onClick={() =>
                pan("left")
              }
            />

            <ToolbarButton
              label="↑"
              disabled={!layout}
              onClick={() =>
                pan("up")
              }
            />

            <ToolbarButton
              label="↓"
              disabled={!layout}
              onClick={() =>
                pan("down")
              }
            />

            <ToolbarButton
              label="→"
              disabled={!layout}
              onClick={() =>
                pan("right")
              }
            />

            <ToolbarButton
              label="Fit"
              disabled={!layout}
              onClick={fitView}
              wide
            />

            <ToolbarButton
              label="Reset"
              disabled={!layout}
              onClick={resetView}
              wide
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <DisplayToggle
            label="Grid"
            checked={showGrid}
            onChange={
              setShowGrid
            }
          />

          <DisplayToggle
            label="Labels"
            checked={
              showLabels
            }
            onChange={
              setShowLabels
            }
          />

          <DisplayToggle
            label="Rotation"
            checked={
              showRotation
            }
            onChange={
              setShowRotation
            }
          />
        </div>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <MarkerCanvas
          layout={layout}
          selectedPieceId={
            selectedPieceId
          }
          zoom={zoom}
          panX={panX}
          panY={panY}
          showGrid={showGrid}
          showLabels={
            showLabels
          }
          showRotation={
            showRotation
          }
          onSelectPiece={
            setSelectedPieceId
          }
        />

        <div className="space-y-5">
          <MarkerLegend
            layout={layout}
            selectedPieceId={
              selectedPieceId
            }
            onSelectPiece={
              setSelectedPieceId
            }
          />

          {selectedPiece ? (
            <section className="rounded-2xl border border-violet-400/20 bg-violet-950/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-violet-300">
                    Selected Piece
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    {
                      selectedPiece.name
                    }
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPieceId(
                      null
                    )
                  }
                  className="rounded-lg border border-violet-400/30 bg-slate-950 px-3 py-2 text-xs font-black text-violet-300"
                >
                  Clear
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <SelectedValue
                  label="Instance"
                  value={String(
                    selectedPiece
                      .instanceNumber
                  )}
                />

                <SelectedValue
                  label="Rotation"
                  value={`${selectedPiece.rotation}°`}
                />

                <SelectedValue
                  label="Position"
                  value={`${selectedPiece.xCm.toFixed(
                    2
                  )}, ${selectedPiece.yCm.toFixed(
                    2
                  )} cm`}
                />

                <SelectedValue
                  label="Dimensions"
                  value={`${selectedPiece.widthCm.toFixed(
                    2
                  )} × ${selectedPiece.heightCm.toFixed(
                    2
                  )} cm`}
                />

                <SelectedValue
                  label="Area"
                  value={`${selectedPiece.areaSqCm.toFixed(
                    2
                  )} cm²`}
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-5 py-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function ToolbarButton({
  label,
  disabled,
  onClick,
  wide = false,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 font-black text-white transition enabled:hover:border-cyan-400 enabled:hover:bg-cyan-950 disabled:cursor-not-allowed disabled:opacity-40 ${
        wide
          ? "min-w-20"
          : "min-w-12"
      }`}
    >
      {label}
    </button>
  );
}

function DisplayToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="h-4 w-4 accent-cyan-400"
      />

      <span className="text-sm font-black text-slate-300">
        {label}
      </span>
    </label>
  );
}

function SelectedValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words font-black text-white">
        {value}
      </p>
    </div>
  );
}