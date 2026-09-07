"use client";

import {
  useMemo,
  useState,
} from "react";

import MarkerEngineeringValidationPanel from "./MarkerEngineeringValidationPanel";
import MarkerGenerationPanel from "./MarkerGenerationPanel";
import MarkerPreviewPanel from "./MarkerPreviewPanel";
import MarkerStatisticsPanel from "./MarkerStatisticsPanel";

import {
  validateMarkerEngineering,
  type MarkerEngineeringValidationResult,
} from "@/lib/optifabric/marker/markerEngineeringValidationEngine";

import {
  generateProjectMarkerLayout,
} from "@/lib/optifabric/markerLayoutProjectEngine";

import type {
  MarkerGenerationResult,
} from "@/lib/optifabric/markerTypes";

interface MarkerWorkspacePanelProps {
  projectId: string;

  patternIds: string[];

  geometryReady: boolean;

  projectName?: string;
}

export default function MarkerWorkspacePanel({
  projectId,

  patternIds,

  geometryReady,

  projectName = "Engineering Project",
}: MarkerWorkspacePanelProps) {
  const [
    fabricWidthCm,
    setFabricWidthCm,
  ] = useState(150);

  const [
    quantityPerPattern,
    setQuantityPerPattern,
  ] = useState(1);

  const [
    pieceSpacingCm,
    setPieceSpacingCm,
  ] = useState(0.5);

  const [
    edgeAllowanceCm,
    setEdgeAllowanceCm,
  ] = useState(1);

  const [
    allowRotation,
    setAllowRotation,
  ] = useState(true);

  const [
    maximumMarkerLengthCm,
    setMaximumMarkerLengthCm,
  ] = useState<number | null>(
    null
  );

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    markerResult,
    setMarkerResult,
  ] =
    useState<MarkerGenerationResult | null>(
      null
    );

  const [
    engineeringValidation,
    setEngineeringValidation,
  ] =
    useState<MarkerEngineeringValidationResult | null>(
      null
    );

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
    message,
    setMessage,
  ] = useState("");

  const markerGenerated =
    markerResult !== null;

  const layout =
    markerResult?.layout ?? null;

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

  function generateMarker() {
    if (!geometryReady) {
      setMessage(
        "Complete and save all marker-eligible geometry before generating the marker."
      );

      return;
    }

    if (patternIds.length === 0) {
      setMessage(
        "No marker-ready pattern IDs are available."
      );

      return;
    }

    if (
      !Number.isFinite(
        fabricWidthCm
      ) ||
      fabricWidthCm <= 0
    ) {
      setMessage(
        "Enter a valid fabric width before generating the marker."
      );

      return;
    }

    setGenerating(true);
    setMessage("");
    setSelectedPieceId(null);
    setEngineeringValidation(
      null
    );

    window.setTimeout(() => {
      try {
        const result =
          generateProjectMarkerLayout({
            projectId,

            patternIds,

            fabricWidthCm,

            quantityPerPattern,

            pieceSpacingCm,

            edgeAllowanceCm,

            allowRotation,

            maximumMarkerLengthCm:
              maximumMarkerLengthCm ??
              undefined,
          });

        const validation =
          validateMarkerEngineering(
            result.layout
          );

        setMarkerResult(
          result
        );

        setEngineeringValidation(
          validation
        );

        setZoom(1);
        setPanX(0);
        setPanY(0);

        if (result.success) {
          setMessage(
            validation.productionReady
              ? `Marker generated and approved. ${result.layout.placedPieces.length} piece instance(s) were placed with Quality Grade ${validation.qualityGrade}.`
              : `Marker generated for ${result.layout.placedPieces.length} piece instance(s), but engineering review is required.`
          );
        } else {
          setMessage(
            result.explanation
          );
        }
      } catch (error) {
        console.error(
          "Marker generation failed:",
          error
        );

        setMarkerResult(null);

        setEngineeringValidation(
          null
        );

        setMessage(
          "The marker layout could not be generated. Review the saved geometry and marker settings."
        );
      } finally {
        setGenerating(false);
      }
    }, 400);
  }

  function clearMarker() {
    setMarkerResult(null);

    setEngineeringValidation(
      null
    );

    setSelectedPieceId(null);

    setZoom(1);
    setPanX(0);
    setPanY(0);

    setMessage(
      "The generated marker was cleared."
    );
  }

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

  function panMarker(
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
    <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-5 shadow-2xl shadow-cyan-950/20 sm:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            OptiFabric AI · RC4-021
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Marker Engineering Workspace
          </h2>

          <p className="mt-3 text-xl font-black text-cyan-100">
            {projectName}
          </p>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Generate, inspect and validate
            a project marker using saved
            engineering polygons. This
            workspace combines marker
            controls, CAD preview,
            selection, utilisation
            statistics, collision checking
            and production-readiness
            analysis.
          </p>
        </div>

        <div className="grid min-w-72 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <WorkspaceMetric
            label="Pattern IDs"
            value={String(
              patternIds.length
            )}
          />

          <WorkspaceMetric
            label="Marker Status"
            value={
              markerGenerated
                ? engineeringValidation
                    ?.productionReady
                  ? "Approved"
                  : "Review"
                : "Pending"
            }
          />

          <WorkspaceMetric
            label="Quality Grade"
            value={
              engineeringValidation
                ?.qualityGrade ??
              "—"
            }
          />
        </div>
      </div>

      {message ? (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 font-bold leading-6 ${
            engineeringValidation
              ?.productionReady
              ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-100"
              : engineeringValidation
                ? "border-amber-400/30 bg-amber-950/20 text-amber-100"
                : "border-cyan-400/30 bg-cyan-950/20 text-cyan-100"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mt-8">
        <MarkerGenerationPanel
          geometryReady={
            geometryReady
          }
          markerGenerated={
            markerGenerated
          }
          generating={
            generating
          }
          fabricWidthCm={
            fabricWidthCm
          }
          quantityPerPattern={
            quantityPerPattern
          }
          pieceSpacingCm={
            pieceSpacingCm
          }
          edgeAllowanceCm={
            edgeAllowanceCm
          }
          allowRotation={
            allowRotation
          }
          maximumMarkerLengthCm={
            maximumMarkerLengthCm
          }
          onFabricWidthChange={
            setFabricWidthCm
          }
          onQuantityChange={
            setQuantityPerPattern
          }
          onPieceSpacingChange={
            setPieceSpacingCm
          }
          onEdgeAllowanceChange={
            setEdgeAllowanceCm
          }
          onAllowRotationChange={
            setAllowRotation
          }
          onMaximumMarkerLengthChange={
            setMaximumMarkerLengthCm
          }
          onGenerate={
            generateMarker
          }
          onClear={
            clearMarker
          }
        />
      </div>

      <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-950/60 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
              CAD View Controls
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select a marker piece, zoom
              the canvas or pan the view
              without recalculating the
              marker layout.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ControlButton
              label="−"
              onClick={zoomOut}
              disabled={!layout}
            />

            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-black text-white">
              {(zoom * 100).toFixed(
                0
              )}
              %
            </div>

            <ControlButton
              label="+"
              onClick={zoomIn}
              disabled={!layout}
            />

            <ControlButton
              label="←"
              onClick={() =>
                panMarker("left")
              }
              disabled={!layout}
            />

            <ControlButton
              label="↑"
              onClick={() =>
                panMarker("up")
              }
              disabled={!layout}
            />

            <ControlButton
              label="↓"
              onClick={() =>
                panMarker("down")
              }
              disabled={!layout}
            />

            <ControlButton
              label="→"
              onClick={() =>
                panMarker("right")
              }
              disabled={!layout}
            />

            <ControlButton
              label="Reset View"
              onClick={resetView}
              disabled={!layout}
              wide
            />
          </div>
        </div>
      </div>

      {selectedPiece ? (
        <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-950/20 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-violet-300">
                Selected Marker Piece
              </p>

              <h3 className="mt-2 text-xl font-black text-white">
                {selectedPiece.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedPieceId(
                  null
                )
              }
              className="rounded-xl border border-violet-400/30 bg-slate-950 px-4 py-2 font-black text-violet-300 transition hover:bg-violet-950/30"
            >
              Clear Selection
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectionMetric
              label="Instance"
              value={String(
                selectedPiece
                  .instanceNumber
              )}
            />

            <SelectionMetric
              label="Rotation"
              value={`${selectedPiece.rotation}°`}
            />

            <SelectionMetric
              label="Position"
              value={`${selectedPiece.xCm.toFixed(
                2
              )}, ${selectedPiece.yCm.toFixed(
                2
              )} cm`}
            />

            <SelectionMetric
              label="Dimensions"
              value={`${selectedPiece.widthCm.toFixed(
                2
              )} × ${selectedPiece.heightCm.toFixed(
                2
              )} cm`}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <MarkerPreviewPanel
          layout={layout}
          selectedPieceId={
            selectedPieceId
          }
          zoom={zoom}
          panX={panX}
          panY={panY}
          onSelectPiece={
            setSelectedPieceId
          }
        />
      </div>

      <div className="mt-8">
        <MarkerStatisticsPanel
          layout={layout}
          utilisationTargetPercent={
            85
          }
        />
      </div>

      <div className="mt-8">
        <MarkerEngineeringValidationPanel
          validation={
            engineeringValidation
          }
        />
      </div>

      {markerResult?.warnings
        .length ? (
        <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-950/10 p-6">
          <p className="font-black text-amber-300">
            Marker Engine Warnings
          </p>

          <div className="mt-4 space-y-3">
            {markerResult.warnings.map(
              (warning) => (
                <div
                  key={warning}
                  className="rounded-xl border border-amber-400/20 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-amber-100"
                >
                  {warning}
                </div>
              )
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function WorkspaceMetric({
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

function SelectionMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-black text-white">
        {value}
      </p>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  wide = false,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 font-black text-white transition enabled:hover:border-cyan-400 enabled:hover:bg-cyan-950 disabled:cursor-not-allowed disabled:opacity-40 ${
        wide
          ? "min-w-28"
          : "min-w-12"
      }`}
    >
      {label}
    </button>
  );
}