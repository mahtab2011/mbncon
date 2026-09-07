"use client";

interface EngineeringDecisionPanelProps {
  boundaryReady: boolean;
  qualityPassed: boolean;
  scaleReady: boolean;
  geometryReady: boolean;
  nextStep: string;
}

export default function EngineeringDecisionPanel({
  boundaryReady,
  qualityPassed,
  scaleReady,
  geometryReady,
  nextStep,
}: EngineeringDecisionPanelProps) {
  const readiness =
    [
      boundaryReady,
      qualityPassed,
      scaleReady,
      geometryReady,
    ].filter(Boolean).length * 25;

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-6">

      <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
        Engineering Decision
      </p>

      <h2 className="mt-2 text-2xl font-black">
        AI Decision Assistant
      </h2>

      <div className="mt-6 space-y-3">

        <DecisionRow
          label="Boundary"
          passed={boundaryReady}
        />

        <DecisionRow
          label="Boundary Quality"
          passed={qualityPassed}
        />

        <DecisionRow
          label="Scale Calibration"
          passed={scaleReady}
        />

        <DecisionRow
          label="Geometry"
          passed={geometryReady}
        />

      </div>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">

        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          Next Engineering Step
        </p>

        <p className="mt-2 text-lg font-black text-white">
          {nextStep}
        </p>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Readiness
          </p>

          <p className="text-3xl font-black text-white">
            {readiness}%
          </p>

        </div>

        <div
          className={`rounded-xl px-4 py-3 font-black ${
            geometryReady
              ? "bg-emerald-600"
              : "bg-amber-500 text-slate-950"
          }`}
        >
          {geometryReady
            ? "READY"
            : "PENDING"}
        </div>

      </div>

    </section>
  );
}

function DecisionRow({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3">

      <span className="font-semibold">
        {label}
      </span>

      <span
        className={`font-black ${
          passed
            ? "text-emerald-400"
            : "text-amber-400"
        }`}
      >
        {passed ? "PASS" : "WAIT"}
      </span>

    </div>
  );
}