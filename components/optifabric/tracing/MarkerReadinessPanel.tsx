"use client";

interface MarkerReadinessPanelProps {
  geometrySaved: boolean;

  geometryReady: boolean;

  polygonAvailable: boolean;

  scaleCalibrated: boolean;

  markerReady: boolean;

  patternName?: string;

  vertexCount?: number;
}

export default function MarkerReadinessPanel({
  geometrySaved,

  geometryReady,

  polygonAvailable,

  scaleCalibrated,

  markerReady,

  patternName = "Pattern Piece",

  vertexCount = 0,
}: MarkerReadinessPanelProps) {
  const readinessScore =
    [
      geometrySaved,
      geometryReady,
      polygonAvailable,
      scaleCalibrated,
    ].filter(Boolean).length * 25;

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
            Marker readiness
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Geometry to Marker Handover
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {patternName}
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-3 ${
            markerReady
              ? "border-emerald-400/30 bg-emerald-950/40"
              : "border-amber-400/30 bg-amber-950/30"
          }`}
        >
          <p
            className={`text-xs font-black uppercase tracking-wider ${
              markerReady
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            Readiness
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {readinessScore}%
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <ReadinessRow
          label="Geometry record"
          value={
            geometrySaved
              ? "Saved"
              : "Not saved"
          }
          ready={geometrySaved}
        />

        <ReadinessRow
          label="Engineering geometry"
          value={
            geometryReady
              ? "Ready"
              : "Pending"
          }
          ready={geometryReady}
        />

        <ReadinessRow
          label="Polygon data"
          value={
            polygonAvailable
              ? `${vertexCount} vertices`
              : "Unavailable"
          }
          ready={polygonAvailable}
        />

        <ReadinessRow
          label="Scale calibration"
          value={
            scaleCalibrated
              ? "Calibrated"
              : "Pending"
          }
          ready={scaleCalibrated}
        />
      </div>

      <div
        className={`mt-6 rounded-2xl border p-5 ${
          markerReady
            ? "border-emerald-400/30 bg-emerald-950/20"
            : "border-amber-400/30 bg-amber-950/20"
        }`}
      >
        <p
          className={`font-black ${
            markerReady
              ? "text-emerald-300"
              : "text-amber-300"
          }`}
        >
          {markerReady
            ? "✓ Ready for Marker Generation"
            : "! Marker Generation Pending"}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {markerReady
            ? "The saved pattern geometry can now be transferred safely to the marker-layout engine."
            : "Complete and save the calibrated pattern geometry before beginning marker generation."}
        </p>
      </div>
    </section>
  );
}

function ReadinessRow({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-black text-white">
          {value}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          ready
            ? "bg-emerald-500/15 text-emerald-300"
            : "bg-amber-500/15 text-amber-300"
        }`}
      >
        {ready ? "PASS" : "WAIT"}
      </span>
    </div>
  );
}