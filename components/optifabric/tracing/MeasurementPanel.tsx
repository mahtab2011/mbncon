"use client";

interface MeasurementPanelProps {
  widthCm?: number;
  heightCm?: number;
  areaSquareCm?: number;
  perimeterCm?: number;
  areaSquarePixels?: number;
  grainLineLengthCm?: number;
}

function formatNumber(
  value: number | undefined,
  decimals = 2
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toFixed(decimals);
}

export default function MeasurementPanel({
  widthCm,
  heightCm,
  areaSquareCm,
  perimeterCm,
  areaSquarePixels,
  grainLineLengthCm,
}: MeasurementPanelProps) {
  return (
    <section className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
        Measurements
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Pattern Geometry
      </h2>

      <div className="mt-5 space-y-3">
        <MeasurementRow
          label="Width"
          value={`${formatNumber(
            widthCm
          )} cm`}
        />

        <MeasurementRow
          label="Height"
          value={`${formatNumber(
            heightCm
          )} cm`}
        />

        <MeasurementRow
          label="Area"
          value={`${formatNumber(
            areaSquareCm
          )} cm²`}
        />

        <MeasurementRow
          label="Perimeter"
          value={`${formatNumber(
            perimeterCm
          )} cm`}
        />

        <MeasurementRow
          label="Pixel Area"
          value={formatNumber(
            areaSquarePixels,
            0
          )}
        />

        <MeasurementRow
          label="Grain Line"
          value={
            typeof grainLineLengthCm ===
            "number"
              ? `${formatNumber(
                  grainLineLengthCm
                )} cm`
              : "Not marked"
          }
        />
      </div>
    </section>
  );
}

function MeasurementRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
      <span className="text-sm font-bold text-slate-400">
        {label}
      </span>

      <span className="font-black text-white">
        {value}
      </span>
    </div>
  );
}