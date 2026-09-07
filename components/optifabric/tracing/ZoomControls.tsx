"use client";

interface ZoomControlsProps {
  zoom: number;

  minimumZoom?: number;
  maximumZoom?: number;

  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export default function ZoomControls({
  zoom,

  minimumZoom = 0.25,
  maximumZoom = 4,

  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ZoomControlsProps) {
  const zoomPercentage =
    Number.isFinite(zoom)
      ? Math.round(zoom * 100)
      : 100;

  const zoomOutDisabled =
    zoom <= minimumZoom;

  const zoomInDisabled =
    zoom >= maximumZoom;

  return (
    <div className="absolute bottom-4 right-4 rounded-2xl border border-slate-700 bg-slate-950/90 p-3 shadow-xl">
      <div className="flex items-center gap-2">
        <ZoomButton
          label="−"
          ariaLabel="Zoom out"
          disabled={zoomOutDisabled}
          onClick={onZoomOut}
        />

        <button
          type="button"
          onClick={onResetZoom}
          aria-label="Reset zoom"
          title="Reset zoom"
          className="min-w-[76px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-black text-cyan-300 transition hover:border-cyan-400/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          {zoomPercentage}%
        </button>

        <ZoomButton
          label="+"
          ariaLabel="Zoom in"
          disabled={zoomInDisabled}
          onClick={onZoomIn}
        />
      </div>

      <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Zoom controls
      </p>
    </div>
  );
}

interface ZoomButtonProps {
  label: string;
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
}

function ZoomButton({
  label,
  ariaLabel,
  disabled = false,
  onClick,
}: ZoomButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-xl font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {label}
    </button>
  );
}