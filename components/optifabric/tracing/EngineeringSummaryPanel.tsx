"use client";

interface EngineeringSummaryPanelProps {
  widthCm?: number | null;

  heightCm?: number | null;

  areaSqCm?: number | null;

  perimeterCm?: number | null;

  pixelArea?: number | null;

  vertexCount?: number;

  boundaryClosed?: boolean;

  scaleCalibrated?: boolean;

  geometryReady?: boolean;

  markerReady?: boolean;
}

export default function EngineeringSummaryPanel({
  widthCm = null,

  heightCm = null,

  areaSqCm = null,

  perimeterCm = null,

  pixelArea = null,

  vertexCount = 0,

  boundaryClosed = false,

  scaleCalibrated = false,

  geometryReady = false,

  markerReady = false,
}: EngineeringSummaryPanelProps) {
  const readinessScore = calculateReadinessScore({
    vertexCount,
    boundaryClosed,
    scaleCalibrated,
    geometryReady,
  });

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Engineering output
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Pattern Engineering Summary
          </h2>
        </div>

        <ReadinessBadge
          score={readinessScore}
          geometryReady={geometryReady}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryMetric
          label="Width"
          value={formatMeasurement(
            widthCm,
            "cm",
            2
          )}
        />

        <SummaryMetric
          label="Height"
          value={formatMeasurement(
            heightCm,
            "cm",
            2
          )}
        />

        <SummaryMetric
          label="Area"
          value={formatMeasurement(
            areaSqCm,
            "cm²",
            2
          )}
        />

        <SummaryMetric
          label="Perimeter"
          value={formatMeasurement(
            perimeterCm,
            "cm",
            2
          )}
        />

        <SummaryMetric
          label="Pixel area"
          value={formatMeasurement(
            pixelArea,
            "px²",
            0
          )}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <EngineeringCheck
          label="Boundary"
          value={
            vertexCount >= 3
              ? `${vertexCount} vertices`
              : "Pending"
          }
          ready={vertexCount >= 3}
        />

        <EngineeringCheck
          label="Polygon"
          value={
            boundaryClosed
              ? "Closed"
              : "Open"
          }
          ready={boundaryClosed}
        />

        <EngineeringCheck
          label="Scale"
          value={
            scaleCalibrated
              ? "Calibrated"
              : "Pending"
          }
          ready={scaleCalibrated}
        />

        <EngineeringCheck
          label="Geometry"
          value={
            geometryReady
              ? "Ready"
              : "Pending"
          }
          ready={geometryReady}
        />

        <EngineeringCheck
          label="Marker use"
          value={
            markerReady
              ? "Ready"
              : "Not ready"
          }
          ready={markerReady}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
        <p className="font-black text-white">
          Engineering interpretation
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {createEngineeringMessage({
            vertexCount,
            boundaryClosed,
            scaleCalibrated,
            geometryReady,
            markerReady,
          })}
        </p>
      </div>
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

function EngineeringCheck({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-1 font-black text-white">
            {value}
          </p>
        </div>

        <span
          className={`h-3 w-3 shrink-0 rounded-full ${
            ready
              ? "bg-emerald-400"
              : "bg-amber-400"
          }`}
          title={
            ready
              ? `${label} ready`
              : `${label} pending`
          }
          aria-label={
            ready
              ? `${label} ready`
              : `${label} pending`
          }
        />
      </div>
    </div>
  );
}

function ReadinessBadge({
  score,
  geometryReady,
}: {
  score: number;
  geometryReady: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-3 ${
        geometryReady
          ? "border-emerald-400/30 bg-emerald-950/40"
          : "border-amber-400/30 bg-amber-950/30"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-wider ${
          geometryReady
            ? "text-emerald-300"
            : "text-amber-300"
        }`}
      >
        Readiness
      </p>

      <p className="mt-1 text-2xl font-black text-white">
        {score}%
      </p>
    </div>
  );
}

function formatMeasurement(
  value: number | null,
  unit: string,
  decimalPlaces: number
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(
    decimalPlaces
  )} ${unit}`;
}

function calculateReadinessScore({
  vertexCount,
  boundaryClosed,
  scaleCalibrated,
  geometryReady,
}: {
  vertexCount: number;
  boundaryClosed: boolean;
  scaleCalibrated: boolean;
  geometryReady: boolean;
}): number {
  let score = 0;

  if (vertexCount >= 3) {
    score += 25;
  }

  if (boundaryClosed) {
    score += 25;
  }

  if (scaleCalibrated) {
    score += 25;
  }

  if (geometryReady) {
    score += 25;
  }

  return score;
}

function createEngineeringMessage({
  vertexCount,
  boundaryClosed,
  scaleCalibrated,
  geometryReady,
  markerReady,
}: {
  vertexCount: number;
  boundaryClosed: boolean;
  scaleCalibrated: boolean;
  geometryReady: boolean;
  markerReady: boolean;
}): string {
  if (markerReady) {
    return "The pattern geometry is calibrated, validated and ready for marker planning, fabric-consumption analysis and nesting operations.";
  }

  if (geometryReady) {
    return "The pattern geometry is ready. Complete any remaining marker-specific validation before sending the piece to the marker-layout engine.";
  }

  if (!scaleCalibrated) {
    return "The boundary may already be detected, but real engineering dimensions cannot be calculated until the reference scale is calibrated.";
  }

  if (!boundaryClosed) {
    return "The reference scale is available, but the pattern boundary must form a closed polygon before area and perimeter can be trusted.";
  }

  if (vertexCount < 3) {
    return "At least three valid boundary points are required to construct a measurable pattern polygon.";
  }

  return "The pattern requires additional engineering validation before it can proceed to marker planning.";
}