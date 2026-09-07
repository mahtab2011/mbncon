"use client";

interface TracingStatusBarProps {
  imageLoaded?: boolean;

  boundaryDetected?: boolean;

  boundaryClosed?: boolean;

  vertexCount?: number;

  scaleCalibrated?: boolean;

  pixelsPerCm?: number | null;

  geometryReady?: boolean;

  saveStatus?: string;
}

export default function TracingStatusBar({
  imageLoaded = false,

  boundaryDetected = false,

  boundaryClosed = false,

  vertexCount = 0,

  scaleCalibrated = false,

  pixelsPerCm = null,

  geometryReady = false,

  saveStatus = "Not saved",
}: TracingStatusBarProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatusItem
          label="Image"
          value={
            imageLoaded
              ? "Loaded"
              : "Pending"
          }
          ready={imageLoaded}
        />

        <StatusItem
          label="Boundary"
          value={
            boundaryDetected
              ? "Detected"
              : "Pending"
          }
          ready={boundaryDetected}
        />

        <StatusItem
          label="Closed"
          value={
            boundaryClosed
              ? "Yes"
              : "No"
          }
          ready={boundaryClosed}
        />

        <StatusItem
          label="Vertices"
          value={String(vertexCount)}
          ready={vertexCount >= 3}
        />

        <StatusItem
          label="Scale"
          value={
            scaleCalibrated &&
            pixelsPerCm !== null
              ? `${pixelsPerCm.toFixed(
                  2
                )} px/cm`
              : "Pending"
          }
          ready={scaleCalibrated}
        />

        <StatusItem
          label="Geometry"
          value={
            geometryReady
              ? saveStatus
              : "Not ready"
          }
          ready={geometryReady}
        />
      </div>
    </section>
  );
}

function StatusItem({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words font-black text-white">
            {value}
          </p>
        </div>

        <span
          className={`h-3 w-3 shrink-0 rounded-full ${
            ready
              ? "bg-emerald-400"
              : "bg-amber-400"
          }`}
          aria-label={
            ready
              ? `${label} ready`
              : `${label} pending`
          }
          title={
            ready
              ? `${label} ready`
              : `${label} pending`
          }
        />
      </div>
    </div>
  );
}