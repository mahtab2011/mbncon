"use client";

interface DetectionStatusPanelProps {
  boundaryStatus?: string;

  boundaryConfidence?: number | null;

  boundaryVertexCount?: number;

  boundaryMessage?: string;

  boundaryWarnings?: string[];

  scaleStatus?: string;

  scaleConfidence?: number | null;

  scaleMessage?: string;

  scaleWarnings?: string[];
}

function formatConfidence(
  value: number | null | undefined
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(1)}%`;
}

function normaliseStatus(
  status: string | undefined
): string {
  if (!status) {
    return "not started";
  }

  return status.replace(/-/g, " ");
}

export default function DetectionStatusPanel({
  boundaryStatus = "not-started",

  boundaryConfidence = null,

  boundaryVertexCount = 0,

  boundaryMessage = "",

  boundaryWarnings = [],

  scaleStatus = "not-started",

  scaleConfidence = null,

  scaleMessage = "",

  scaleWarnings = [],
}: DetectionStatusPanelProps) {
  const allWarnings = [
    ...boundaryWarnings.map(
      (warning) =>
        `Boundary: ${warning}`
    ),

    ...scaleWarnings.map(
      (warning) =>
        `Scale: ${warning}`
    ),
  ];

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-6">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
        AI detection
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Detection Status
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetectionCard
          title="Boundary"
          status={normaliseStatus(
            boundaryStatus
          )}
          confidence={formatConfidence(
            boundaryConfidence
          )}
          metricLabel="Vertices"
          metricValue={String(
            boundaryVertexCount
          )}
          message={boundaryMessage}
        />

        <DetectionCard
          title="Scale"
          status={normaliseStatus(
            scaleStatus
          )}
          confidence={formatConfidence(
            scaleConfidence
          )}
          metricLabel="Calibration"
          metricValue={
            scaleStatus === "detected"
              ? "Ready"
              : scaleStatus ===
                  "requires-review"
                ? "Review"
                : "Pending"
          }
          message={scaleMessage}
        />
      </div>

      {allWarnings.length > 0 ? (
        <div className="mt-5 space-y-2">
          <p className="font-black text-red-300">
            AI warnings
          </p>

          {allWarnings.map(
            (warning) => (
              <div
                key={warning}
                className="rounded-xl border border-red-400/20 bg-red-950/10 px-4 py-3 text-sm leading-6 text-red-100"
              >
                {warning}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-950/10 px-4 py-3 text-sm font-bold text-emerald-200">
          No AI detection warnings are currently present.
        </div>
      )}
    </section>
  );
}

function DetectionCard({
  title,
  status,
  confidence,
  metricLabel,
  metricValue,
  message,
}: {
  title: string;
  status: string;
  confidence: string;
  metricLabel: string;
  metricValue: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-xl font-black capitalize text-white">
            {status}
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 px-3 py-2 text-right">
          <p className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Confidence
          </p>

          <p className="mt-1 font-black text-cyan-200">
            {confidence}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          {metricLabel}
        </p>

        <p className="mt-1 font-black text-white">
          {metricValue}
        </p>
      </div>

      {message ? (
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}