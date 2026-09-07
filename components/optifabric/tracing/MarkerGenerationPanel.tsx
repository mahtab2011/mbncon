"use client";

interface MarkerGenerationPanelProps {
  markerReady: boolean;

  generating?: boolean;

  generated?: boolean;

  patternName?: string;

  fabricWidthCm?: number | null;

  quantity?: number;

  onGenerate?: () => void;
}

export default function MarkerGenerationPanel({
  markerReady,

  generating = false,

  generated = false,

  patternName = "Pattern Piece",

  fabricWidthCm = null,

  quantity = 1,

  onGenerate,
}: MarkerGenerationPanelProps) {
  const validFabricWidth =
    typeof fabricWidthCm === "number" &&
    Number.isFinite(fabricWidthCm) &&
    fabricWidthCm > 0;

  const generationEnabled =
    markerReady &&
    validFabricWidth &&
    quantity > 0 &&
    !generating;

  return (
    <section className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
        AI marker generation
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        Generate Marker Layout
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Transfer the saved engineering polygon into the
        marker-layout engine for placement, utilization and
        fabric-consumption analysis.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <GenerationValue
          label="Pattern"
          value={patternName}
        />

        <GenerationValue
          label="Quantity"
          value={String(quantity)}
        />

        <GenerationValue
          label="Fabric width"
          value={
            validFabricWidth
              ? `${fabricWidthCm?.toFixed(
                  2
                )} cm`
              : "Pending"
          }
        />

        <GenerationValue
          label="Geometry"
          value={
            markerReady
              ? "Ready"
              : "Pending"
          }
        />
      </div>

      {!validFabricWidth ? (
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
          Enter a valid fabric width before generating the
          marker layout.
        </div>
      ) : null}

      <button
        type="button"
        disabled={!generationEnabled}
        onClick={onGenerate}
        className="mt-6 w-full rounded-xl bg-violet-500 px-5 py-3 font-black text-white transition enabled:hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
      >
        {generating
          ? "AI Generating Marker..."
          : generated
            ? "Regenerate Marker Layout"
            : "Generate Marker Layout"}
      </button>

      <div
        className={`mt-5 rounded-xl border px-4 py-3 text-center font-black ${
          generated
            ? "border-emerald-400/20 bg-emerald-950/20 text-emerald-300"
            : markerReady
              ? "border-violet-400/20 bg-violet-950/20 text-violet-200"
              : "border-amber-400/20 bg-amber-950/20 text-amber-300"
        }`}
      >
        {generated
          ? "✓ Marker Layout Generated"
          : markerReady
            ? "Ready to Generate Marker"
            : "Complete Geometry Handover"}
      </div>
    </section>
  );
}

function GenerationValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-black text-white">
        {value}
      </p>
    </div>
  );
}