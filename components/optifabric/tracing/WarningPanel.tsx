"use client";

interface WarningPanelProps {
  title?: string;

  warnings: string[];

  emptyMessage?: string;
}

export default function WarningPanel({
  title = "Engineering checks",

  warnings,

  emptyMessage =
    "No engineering warnings are currently present.",
}: WarningPanelProps) {
  if (warnings.length === 0) {
    return (
      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-6">
        <p className="font-black text-emerald-300">
          {title}
        </p>

        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-emerald-100">
          {emptyMessage}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-red-400/20 bg-red-950/10 p-6">
      <p className="font-black text-red-300">
        {title}
      </p>

      <div className="mt-4 space-y-2">
        {warnings.map(
          (warning, index) => (
            <div
              key={`${warning}-${index}`}
              className="rounded-xl border border-red-400/20 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-red-100"
            >
              {warning}
            </div>
          )
        )}
      </div>
    </section>
  );
}