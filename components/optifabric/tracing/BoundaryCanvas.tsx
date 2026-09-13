"use client";

import {
  ChangeEvent,
  MouseEvent,
  RefObject,
} from "react";

import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

import {
  PatternGrainLine,
  PatternScaleCalibration,
  PatternTracingBoundary,
  PatternTracingTool,
} from "@/lib/optifabric/patternTracingTypes";

export interface BoundaryCanvasImageDimensions {
  width: number;
  height: number;
}

export interface BoundaryCanvasViewport {
  zoom: number;
  centreX: number;
  centreY: number;
}

export interface BoundaryCanvasViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BoundaryCanvasProps {
  svgRef: RefObject<SVGSVGElement | null>;

  patternName: string;

  imageSource: string;

  imageDimensions:
    BoundaryCanvasImageDimensions;

  viewport:
    BoundaryCanvasViewport;

  viewBox:
    BoundaryCanvasViewBox;

  activeTool:
    PatternTracingTool;

  boundary:
    PatternTracingBoundary;

  calibration:
    PatternScaleCalibration;

  grainLine:
    PatternGrainLine;

  onImageFileChange:
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => void;

  onWorkspaceClick:
    (
      event:
        MouseEvent<SVGSVGElement>
    ) => void;

  onImageLoaded:
    (
      event:
        ChangeEvent<HTMLImageElement>
    ) => void;

  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitImage: () => void;

  onPanLeft: () => void;
  onPanRight: () => void;
  onPanUp: () => void;
  onPanDown: () => void;
}

function buildPointString(
  points: GeometryPoint[]
): string {
  return points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(" ");
}

function getWorkspaceCursor(
  activeTool:
    PatternTracingTool
): string {
  if (
    activeTool === "trace" ||
    activeTool === "calibrate" ||
    activeTool === "grain-line"
  ) {
    return "cursor-crosshair";
  }

  if (activeTool === "pan") {
    return "cursor-move";
  }

  return "cursor-default";
}

export default function BoundaryCanvas({
  svgRef,

  patternName,

  imageSource,

  imageDimensions,

  viewport,

  viewBox,

  activeTool,

  boundary,

  calibration,

  grainLine,

  onImageFileChange,

  onWorkspaceClick,

  onImageLoaded,

  onZoomIn,
  onZoomOut,
  onFitImage,

  onPanLeft,
  onPanRight,
  onPanUp,
  onPanDown,
}: BoundaryCanvasProps) {
  const cursorClass =
    getWorkspaceCursor(
      activeTool
    );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
      <header className="flex flex-col gap-4 border-b border-slate-700 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-cyan-300">
            Pattern Image Workspace
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Active tool:{" "}
            <span className="font-bold text-white">
              {activeTool}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CanvasButton
            label="−"
            onClick={onZoomOut}
          />

          <span className="min-w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-center font-black">
            {Math.round(
              viewport.zoom * 100
            )}
            %
          </span>

          <CanvasButton
            label="+"
            onClick={onZoomIn}
          />

          <CanvasButton
            label="Fit"
            onClick={onFitImage}
          />
        </div>
      </header>

      <div className="border-b border-slate-700 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="cursor-pointer rounded-xl bg-cyan-400 px-5 py-3 text-center font-black text-slate-950 transition hover:bg-cyan-300">
            {imageSource
              ? "Replace Tracing Image"
              : "Load Tracing Image"}

            <input
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={
                onImageFileChange
              }
              className="hidden"
            />
          </label>

          <p className="text-sm leading-6 text-slate-400">
            The existing upload preview is temporary in this pilot.
            Reload the same pattern image here when necessary.
          </p>
        </div>
      </div>

      <div className="relative min-h-[650px] bg-slate-950">
        {imageSource ? (
          <>
            <img
              src={imageSource}
              alt=""
              onLoad={
                onImageLoaded
              }
              className="hidden"
            />

            <svg
              ref={svgRef}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
              className={`h-[650px] w-full select-none ${cursorClass}`}
              onClick={
                onWorkspaceClick
              }
              role="img"
              aria-label={`${patternName} tracing workspace`}
            >
              <image
                href={imageSource}
                x="0"
                y="0"
                width={
                  imageDimensions.width
                }
                height={
                  imageDimensions.height
                }
                preserveAspectRatio="none"
              />

              <BoundaryShape
                boundary={
                  boundary
                }
              />

              <BoundaryVertices
                points={
                  boundary.vertices
                }
              />

              <CalibrationOverlay
                calibration={
                  calibration
                }
              />

              <GrainLineOverlay
                grainLine={
                  grainLine
                }
              />
            </svg>

            <NavigationPad
              onFitImage={
                onFitImage
              }
              onPanLeft={
                onPanLeft
              }
              onPanRight={
                onPanRight
              }
              onPanUp={
                onPanUp
              }
              onPanDown={
                onPanDown
              }
            />
          </>
        ) : (
          <EmptyCanvas />
        )}
      </div>
    </section>
  );
}

function BoundaryShape({
  boundary,
}: {
  boundary:
    PatternTracingBoundary;
}) {
  if (
    boundary.vertices.length === 0
  ) {
    return null;
  }

  const points =
    buildPointString(
      boundary.vertices
    );

  if (boundary.closed) {
    return (
      <polygon
        points={points}
        fill="rgba(34, 211, 238, 0.18)"
        stroke="rgb(34, 211, 238)"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <polyline
      points={points}
      fill="none"
      stroke="rgb(34, 211, 238)"
      strokeWidth="3"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function BoundaryVertices({
  points,
}: {
  points: GeometryPoint[];
}) {
  return (
    <>
      {points.map(
        (point, index) => (
          <g
            key={`boundary-${index}`}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={
                index === 0
                  ? "rgb(16, 185, 129)"
                  : "rgb(167, 139, 250)"
              }
              stroke="white"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <text
              x={point.x + 10}
              y={point.y - 10}
              fill="white"
              fontSize="16"
              fontWeight="700"
            >
              {index + 1}
            </text>
          </g>
        )
      )}
    </>
  );
}

function CalibrationOverlay({
  calibration,
}: {
  calibration:
    PatternScaleCalibration;
}) {
  const firstPoint =
    calibration.firstPoint;

  const secondPoint =
    calibration.secondPoint;

  if (!firstPoint) {
    return null;
  }

  return (
    <>
      <circle
        cx={firstPoint.x}
        cy={firstPoint.y}
        r="8"
        fill="rgb(251, 191, 36)"
        stroke="white"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />

      {secondPoint ? (
        <>
          <line
            x1={firstPoint.x}
            y1={firstPoint.y}
            x2={secondPoint.x}
            y2={secondPoint.y}
            stroke="rgb(251, 191, 36)"
            strokeWidth="4"
            strokeDasharray="10 8"
            vectorEffect="non-scaling-stroke"
          />

          <circle
            cx={secondPoint.x}
            cy={secondPoint.y}
            r="8"
            fill="rgb(251, 191, 36)"
            stroke="white"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : null}
    </>
  );
}

function GrainLineOverlay({
  grainLine,
}: {
  grainLine:
    PatternGrainLine;
}) {
  const firstPoint =
    grainLine.firstPoint;

  const secondPoint =
    grainLine.secondPoint;

  if (!firstPoint) {
    return null;
  }

  return (
    <>
      <circle
        cx={firstPoint.x}
        cy={firstPoint.y}
        r="8"
        fill="rgb(52, 211, 153)"
        stroke="white"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />

      {secondPoint ? (
        <>
          <line
            x1={firstPoint.x}
            y1={firstPoint.y}
            x2={secondPoint.x}
            y2={secondPoint.y}
            stroke="rgb(52, 211, 153)"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />

          <circle
            cx={secondPoint.x}
            cy={secondPoint.y}
            r="8"
            fill="rgb(52, 211, 153)"
            stroke="white"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : null}
    </>
  );
}

function NavigationPad({
  onFitImage,
  onPanLeft,
  onPanRight,
  onPanUp,
  onPanDown,
}: {
  onFitImage: () => void;
  onPanLeft: () => void;
  onPanRight: () => void;
  onPanUp: () => void;
  onPanDown: () => void;
}) {
  return (
    <div className="absolute bottom-4 left-4 rounded-2xl border border-slate-700 bg-slate-950/90 p-3">
      <div className="grid grid-cols-3 gap-2">
        <span />

        <PanButton
          label="↑"
          onClick={onPanUp}
        />

        <span />

        <PanButton
          label="←"
          onClick={onPanLeft}
        />

        <PanButton
          label="•"
          onClick={onFitImage}
        />

        <PanButton
          label="→"
          onClick={onPanRight}
        />

        <span />

        <PanButton
          label="↓"
          onClick={onPanDown}
        />

        <span />
      </div>
    </div>
  );
}

function EmptyCanvas() {
  return (
    <div className="flex min-h-[650px] items-center justify-center px-6 text-center">
      <div>
        <p className="text-7xl">
          📐
        </p>

        <h2 className="mt-5 text-3xl font-black">
          Load the Pattern Image
        </h2>

        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-400">
          Load the pattern image,
          run AI boundary detection,
          and verify the generated
          engineering polygon.
        </p>
      </div>
    </div>
  );
}

function CanvasButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-2 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
    >
      {label}
    </button>
  );
}

function PanButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
    >
      {label}
    </button>
  );
}