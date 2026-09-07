"use client";

interface NavigationPadProps {
  onFitImage: () => void;

  onPanLeft: () => void;
  onPanRight: () => void;
  onPanUp: () => void;
  onPanDown: () => void;
}

export default function NavigationPad({
  onFitImage,

  onPanLeft,
  onPanRight,
  onPanUp,
  onPanDown,
}: NavigationPadProps) {
  return (
    <div className="absolute bottom-4 left-4 rounded-2xl border border-slate-700 bg-slate-950/90 p-3 shadow-xl">
      <div className="grid grid-cols-3 gap-2">
        <span />

        <PanButton
          label="↑"
          ariaLabel="Pan pattern image up"
          onClick={onPanUp}
        />

        <span />

        <PanButton
          label="←"
          ariaLabel="Pan pattern image left"
          onClick={onPanLeft}
        />

        <PanButton
          label="•"
          ariaLabel="Fit pattern image to workspace"
          onClick={onFitImage}
        />

        <PanButton
          label="→"
          ariaLabel="Pan pattern image right"
          onClick={onPanRight}
        />

        <span />

        <PanButton
          label="↓"
          ariaLabel="Pan pattern image down"
          onClick={onPanDown}
        />

        <span />
      </div>
    </div>
  );
}

interface PanButtonProps {
  label: string;
  ariaLabel: string;
  onClick: () => void;
}

function PanButton({
  label,
  ariaLabel,
  onClick,
}: PanButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
    >
      {label}
    </button>
  );
}