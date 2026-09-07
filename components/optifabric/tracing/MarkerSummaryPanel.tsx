"use client";

interface MarkerSummaryPanelProps {
  generated: boolean;

  patternCount?: number;

  placedPieceCount?: number;

  fabricWidthCm?: number | null;

  markerLengthCm?: number | null;

  markerAreaSqCm?: number | null;

  usedPatternAreaSqCm?: number | null;

  efficiencyPercent?: number | null;

  wastePercent?: number | null;
}

export default function MarkerSummaryPanel({
  generated,

  patternCount = 0,

  placedPieceCount = 0,

  fabricWidthCm = null,

  markerLengthCm = null,

  markerAreaSqCm = null,

  usedPatternAreaSqCm = null,

  efficiencyPercent = null,

  wastePercent = null,
}: MarkerSummaryPanelProps) {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
        Marker output
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        Marker Engineering Summary
      </h2>

      {!generated ? (
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-5">
          <p className="font-black text-amber-300">
            Marker layout not generated
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Generate a marker layout to calculate marker
            length, fabric utilization and estimated waste.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryMetric
              label="Patterns"
              value={String(patternCount)}
            />

            <SummaryMetric
              label="Pieces placed"
              value={String(placedPieceCount)}
            />

            <SummaryMetric
              label="Fabric width"
              value={formatMeasurement(
                fabricWidthCm,
                "cm"
              )}
            />

            <SummaryMetric
              label="Marker length"
              value={formatMeasurement(
                markerLengthCm,
                "cm"
              )}
            />

            <SummaryMetric
              label="Marker area"
              value={formatMeasurement(
                markerAreaSqCm,
                "cm²"
              )}
            />

            <SummaryMetric
              label="Pattern area"
              value={formatMeasurement(
                usedPatternAreaSqCm,
                "cm²"
              )}
            />

            <SummaryMetric
              label="Efficiency"
              value={formatMeasurement(
                efficiencyPercent,
                "%"
              )}
            />

            <SummaryMetric
              label="Estimated waste"
              value={formatMeasurement(
                wastePercent,
                "%"
              )}
            />
          </div>

          <div
            className={`mt-6 rounded-2xl border p-5 ${
              typeof efficiencyPercent ===
                "number" &&
              efficiencyPercent >= 80
                ? "border-emerald-400/30 bg-emerald-950/20"
                : "border-amber-400/30 bg-amber-950/20"
            }`}
          >
            <p className="font-black text-white">
              Engineering interpretation
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {createMarkerMessage(
                efficiencyPercent
              )}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function formatMeasurement(
  value: number | null,
  unit: string
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(2)} ${unit}`;
}

function createMarkerMessage(
  efficiencyPercent: number | null
): string {
  if (
    efficiencyPercent === null ||
    !Number.isFinite(
      efficiencyPercent
    )
  ) {
    return "Marker generation completed, but a valid efficiency result is not yet available.";
  }

  if (efficiencyPercent >= 85) {
    return "The marker demonstrates strong fabric utilization and is suitable for engineering review before production approval.";
  }

  if (efficiencyPercent >= 75) {
    return "The marker has acceptable utilization, but further arrangement optimization may reduce fabric waste.";
  }

  return "The marker efficiency is below the preferred engineering range. Regenerate or manually optimize the layout before production use.";
}