"use client";

interface GeometrySavePanelProps {
  geometryReady: boolean;
  saved: boolean;
  savedAt?: string;
  onSave?: () => void;
}

export default function GeometrySavePanel({
  geometryReady,
  saved,
  savedAt,
  onSave,
}: GeometrySavePanelProps) {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
        Save Geometry
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Engineering Geometry
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Save the calibrated engineering geometry for marker
        generation, fabric consumption, nesting and future
        production analysis.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
        <StatusRow
          label="Geometry Ready"
          value={geometryReady ? "YES" : "NO"}
          ok={geometryReady}
        />

        <StatusRow
          label="Saved"
          value={saved ? "YES" : "NO"}
          ok={saved}
        />

        <StatusRow
          label="Saved At"
          value={savedAt ?? "—"}
          ok={saved}
        />
      </div>

      <button
        type="button"
        disabled={!geometryReady}
        onClick={onSave}
        className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 transition enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
      >
        Save Geometry
      </button>
    </section>
  );
}

function StatusRow({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-3 last:border-b-0">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span
        className={`font-black ${
          ok
            ? "text-emerald-400"
            : "text-amber-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}