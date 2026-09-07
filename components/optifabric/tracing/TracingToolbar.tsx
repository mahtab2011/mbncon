"use client";

export type TracingToolMode =
  | "trace"
  | "calibrate"
  | "select"
  | "pan";

interface TracingToolbarProps {
  activeTool?: TracingToolMode;

  onLoadImage?: () => void;
  onSelectTraceTool?: () => void;
  onSelectCalibrationTool?: () => void;
  onSelectTool?: () => void;
  onSelectPanTool?: () => void;

  onUndoPoint?: () => void;
  onClosePolygon?: () => void;
  onClearTrace?: () => void;

  onDetectBoundary?: () => void;
  onDetectScale?: () => void;
  onResetScale?: () => void;

  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitImage?: () => void;
  onResetView?: () => void;

  onPanLeft?: () => void;
  onPanRight?: () => void;
  onPanUp?: () => void;
  onPanDown?: () => void;

  onSaveGeometry?: () => void;
  onResetWorkspace?: () => void;

  imageLoaded?: boolean;
  boundaryDetected?: boolean;
  boundaryClosed?: boolean;
  calibrationComplete?: boolean;

  boundaryEnabled?: boolean;
  scaleEnabled?: boolean;
  saveEnabled?: boolean;

  canUndo?: boolean;
  canClosePolygon?: boolean;
  canClearTrace?: boolean;
  canResetScale?: boolean;
  canZoom?: boolean;
  canPan?: boolean;

  detectingBoundary?: boolean;
  detectingScale?: boolean;
  savingGeometry?: boolean;
}

function getToolButtonClass(
  active: boolean
): string {
  if (active) {
    return [
      "rounded-xl",
      "border",
      "border-cyan-300",
      "bg-cyan-500",
      "px-4",
      "py-3",
      "font-bold",
      "text-slate-950",
      "shadow-lg",
      "shadow-cyan-950/40",
      "transition",
    ].join(" ");
  }

  return [
    "rounded-xl",
    "border",
    "border-slate-600",
    "bg-slate-800",
    "px-4",
    "py-3",
    "font-bold",
    "text-slate-200",
    "transition",
    "hover:border-cyan-400",
    "hover:bg-slate-700",
    "hover:text-white",
  ].join(" ");
}

const actionButtonClass = [
  "rounded-xl",
  "border",
  "border-cyan-500/40",
  "bg-cyan-950/40",
  "px-4",
  "py-3",
  "font-bold",
  "text-cyan-200",
  "transition",
  "hover:border-cyan-300",
  "hover:bg-cyan-900/50",
  "hover:text-white",
  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
].join(" ");

const secondaryButtonClass = [
  "rounded-xl",
  "border",
  "border-slate-600",
  "bg-slate-800",
  "px-4",
  "py-3",
  "font-bold",
  "text-slate-200",
  "transition",
  "hover:border-slate-400",
  "hover:bg-slate-700",
  "hover:text-white",
  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
].join(" ");

const successButtonClass = [
  "rounded-xl",
  "border",
  "border-emerald-400/40",
  "bg-emerald-950/40",
  "px-5",
  "py-3",
  "font-black",
  "text-emerald-200",
  "transition",
  "hover:border-emerald-300",
  "hover:bg-emerald-900/50",
  "hover:text-white",
  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
].join(" ");

const dangerButtonClass = [
  "rounded-xl",
  "border",
  "border-red-500/50",
  "bg-red-950/30",
  "px-4",
  "py-3",
  "font-bold",
  "text-red-300",
  "transition",
  "hover:border-red-400",
  "hover:bg-red-950/60",
  "hover:text-red-100",
  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
].join(" ");

export default function TracingToolbar({
  activeTool = "trace",

  onLoadImage,
  onSelectTraceTool,
  onSelectCalibrationTool,
  onSelectTool,
  onSelectPanTool,

  onUndoPoint,
  onClosePolygon,
  onClearTrace,

  onDetectBoundary,
  onDetectScale,
  onResetScale,

  onZoomIn,
  onZoomOut,
  onFitImage,
  onResetView,

  onPanLeft,
  onPanRight,
  onPanUp,
  onPanDown,

  onSaveGeometry,
  onResetWorkspace,

  imageLoaded = false,
  boundaryDetected = false,
  boundaryClosed = false,
  calibrationComplete = false,

  boundaryEnabled = true,
  scaleEnabled = true,
  saveEnabled = true,

  canUndo = false,
  canClosePolygon = false,
  canClearTrace = false,
  canResetScale = false,
  canZoom = false,
  canPan = false,

  detectingBoundary = false,
  detectingScale = false,
  savingGeometry = false,
}: TracingToolbarProps) {
  const boundaryButtonDisabled =
    !imageLoaded ||
    !boundaryEnabled ||
    detectingBoundary;

  const scaleButtonDisabled =
    !imageLoaded ||
    !scaleEnabled ||
    detectingScale;

  const saveButtonDisabled =
    !saveEnabled ||
    savingGeometry;

  return (
    <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg">
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Image and AI Tools
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={actionButtonClass}
              onClick={onLoadImage}
            >
              Load Tracing Image
            </button>

            <button
              type="button"
              className={actionButtonClass}
              disabled={boundaryButtonDisabled}
              onClick={onDetectBoundary}
            >
              {detectingBoundary
                ? "Detecting Boundary..."
                : boundaryDetected
                  ? "Detect Boundary Again"
                  : "AI Detect Boundary"}
            </button>

            <button
              type="button"
              className={actionButtonClass}
              disabled={scaleButtonDisabled}
              onClick={onDetectScale}
            >
              {detectingScale
                ? "Detecting Scale..."
                : calibrationComplete
                  ? "Detect Scale Again"
                  : "AI Detect Scale"}
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canResetScale}
              onClick={onResetScale}
            >
              Reset Scale
            </button>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Workspace Tools
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={getToolButtonClass(
                activeTool === "trace"
              )}
              onClick={onSelectTraceTool}
            >
              Trace Boundary
            </button>

            <button
              type="button"
              className={getToolButtonClass(
                activeTool === "calibrate"
              )}
              onClick={onSelectCalibrationTool}
            >
              Calibrate Scale
            </button>

            <button
              type="button"
              className={getToolButtonClass(
                activeTool === "select"
              )}
              onClick={onSelectTool}
            >
              Select
            </button>

            <button
              type="button"
              className={getToolButtonClass(
                activeTool === "pan"
              )}
              onClick={onSelectPanTool}
            >
              Pan
            </button>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Boundary Controls
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canUndo}
              onClick={onUndoPoint}
            >
              Undo Point
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={
                !canClosePolygon ||
                boundaryClosed
              }
              onClick={onClosePolygon}
            >
              {boundaryClosed
                ? "Polygon Closed"
                : "Close Polygon"}
            </button>

            <button
              type="button"
              className={dangerButtonClass}
              disabled={!canClearTrace}
              onClick={onClearTrace}
            >
              Clear Trace
            </button>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            View Controls
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canZoom}
              onClick={onZoomOut}
            >
              Zoom Out
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canZoom}
              onClick={onZoomIn}
            >
              Zoom In
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!imageLoaded}
              onClick={onFitImage}
            >
              Fit Image
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!imageLoaded}
              onClick={onResetView}
            >
              Reset View
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canPan}
              onClick={onPanLeft}
            >
              Pan Left
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canPan}
              onClick={onPanUp}
            >
              Pan Up
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canPan}
              onClick={onPanDown}
            >
              Pan Down
            </button>

            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!canPan}
              onClick={onPanRight}
            >
              Pan Right
            </button>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Engineering Actions
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={successButtonClass}
              disabled={saveButtonDisabled}
              onClick={onSaveGeometry}
            >
              {savingGeometry
                ? "Saving Geometry..."
                : "Save Geometry"}
            </button>

            <button
              type="button"
              className={dangerButtonClass}
              onClick={onResetWorkspace}
            >
              Reset Workspace
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}