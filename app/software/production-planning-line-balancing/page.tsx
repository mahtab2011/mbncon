"use client";

import Link from "next/link";

const planningAreas = [
  "Line capacity planning",
  "Hourly production target",
  "SMV / standard minute value",
  "Bottleneck operation identification",
  "Operator skill balancing",
  "Machine availability",
  "Style changeover loss",
  "Production planning accuracy",
  "WIP movement control",
  "Shipment commitment risk",
];

const lossRisks = [
  "Low line efficiency",
  "Unplanned overtime",
  "Production bottleneck",
  "Idle operator time",
  "Machine waiting time",
  "Late shipment risk",
];

export default function ProductionPlanningLineBalancingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-300">
            MBNCON Production Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Production Planning & Line Balancing
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track capacity, hourly targets, SMV, bottlenecks, operator balance,
            machine availability, changeover loss, planning accuracy, WIP
            movement, and shipment commitment risk.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Line Efficiency", "Tracked"],
            ["Bottleneck Risk", "Visible"],
            ["Planning Accuracy", "Measured"],
            ["Shipment Risk", "Monitored"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-violet-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-violet-200">
              Planning & Balancing Areas
            </h2>

            <div className="mt-6 space-y-3">
              {planningAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-violet-200">
              Production Loss Risks
            </h2>

            <div className="mt-6 space-y-4">
              {lossRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Measure cause, lost minutes, labour impact, overtime need,
                    shipment effect, and corrective action.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-violet-400/30 bg-violet-400/10 p-8">
          <h2 className="text-2xl font-bold text-violet-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories improve line efficiency, reduce
            bottlenecks, balance operators, control WIP, reduce overtime, and
            protect shipment commitments through better production planning.
          </p>
        </section>
      </section>
    </main>
  );
}