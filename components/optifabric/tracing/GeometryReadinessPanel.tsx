"use client";

interface GeometryReadinessPanelProps {
  geometryReady: boolean;

  tracingStatus: string;

  vertexCount: number;

  boundaryClosed: boolean;

  pixelsPerCm?: number;

  scaleCalibrated: boolean;
}

function formatNumber(
  value: number | undefined,
  decimals = 4
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toFixed(decimals);
}

export default function GeometryReadinessPanel({
  geometryReady,

  tracingStatus,

  vertexCount,

  boundaryClosed,

  pixelsPerCm,

  scaleCalibrated,
}: GeometryReadinessPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
        Engineering status
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Geometry Readiness
      </h2>

      <div
        className={`mt-5 rounded-2xl border p-5 ${
          geometryReady
            ? "border-emerald-400/30 bg-emerald-950/20"
            : "border-amber-400/30 bg-amber-950/20"
        }`}
      >
        <p
          className={`text-xl font-black ${
            geometryReady
              ? "text-emerald-300"
              : "text-amber-300"
          }`}
        >
          {geometryReady
            ? "✓ Geometry Ready"
            : "! Geometry Pending"}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Status:{" "}
          {tracingStatus.replace(
            /-/g,
            " "
          )}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <EngineeringValue
          label="Vertices"
          value={String(vertexCount)}
        />

        <EngineeringValue
          label="Closed"
          value={
            boundaryClosed
              ? "Yes"
              : "No"
          }
        />

        <EngineeringValue
          label="Pixels / cm"
          value={formatNumber(
            pixelsPerCm,
            4
          )}
        />

        <EngineeringValue
          label="Scale"
          value={
            scaleCalibrated
              ? "Calibrated"
              : "Pending"
          }
        />
      </div>
    </section>
  );
}

function EngineeringValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-black text-white">
        {value}
      </p>
    </div>
  );
}