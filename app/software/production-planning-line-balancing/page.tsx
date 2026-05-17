"use client";

import Link from "next/link";

const planningAreas = [
  {
    id: "line-capacity-planning",
    title: "Line capacity planning",
    detail:
      "Review available machines, operators, working hours, target output, order quantity and realistic daily capacity before committing production dates.",
  },
  {
    id: "hourly-production-target",
    title: "Hourly production target",
    detail:
      "Set practical hourly targets by line, style and operation so supervisors can detect shortfall early instead of waiting until end of day.",
  },
  {
    id: "smv-standard-minute-value",
    title: "SMV / standard minute value",
    detail:
      "Use SMV to calculate labour requirement, expected output, operator balance and fair production target for each style.",
  },
  {
    id: "bottleneck-operation-identification",
    title: "Bottleneck operation identification",
    detail:
      "Identify the slowest operation restricting total line output, then allocate support, skill, machine or method improvement.",
  },
  {
    id: "operator-skill-balancing",
    title: "Operator skill balancing",
    detail:
      "Match operator skill with operation difficulty so weak points do not create waiting time, WIP build-up or shipment delay.",
  },
  {
    id: "machine-availability",
    title: "Machine availability",
    detail:
      "Check machine readiness, breakdown risk, spare machine availability and maintenance support before finalising the line plan.",
  },
  {
    id: "style-changeover-loss",
    title: "Style changeover loss",
    detail:
      "Measure lost time during style change, layout change, feeding delay, sample approval delay and first-output stabilisation.",
  },
  {
    id: "production-planning-accuracy",
    title: "Production planning accuracy",
    detail:
      "Compare planned output against actual output to improve future planning, capacity forecasting and shipment promise accuracy.",
  },
  {
    id: "wip-movement-control",
    title: "WIP movement control",
    detail:
      "Control work-in-progress flow between operations so material does not get stuck, hidden, mixed, delayed or overproduced.",
  },
  {
    id: "shipment-commitment-risk",
    title: "Shipment commitment risk",
    detail:
      "Highlight late production, unfinished WIP, quality hold, missing trims or packing delay before the shipment date becomes critical.",
  },
];

const lossRisks = [
  {
    id: "low-line-efficiency",
    title: "Low line efficiency",
    detail:
      "Track lost minutes, weak operations, skill gaps, poor feeding, machine problems and supervision gaps reducing actual output.",
  },
  {
    id: "unplanned-overtime",
    title: "Unplanned overtime",
    detail:
      "Identify whether overtime is caused by poor planning, low efficiency, late material, rework, absenteeism or buyer changes.",
  },
  {
    id: "production-bottleneck",
    title: "Production bottleneck",
    detail:
      "Escalate bottleneck operations quickly so management can add manpower, change method, rebalance operators or adjust layout.",
  },
  {
    id: "idle-operator-time",
    title: "Idle operator time",
    detail:
      "Measure paid time lost due to material shortage, machine waiting, unclear instruction, quality approval delay or imbalance.",
  },
  {
    id: "machine-waiting-time",
    title: "Machine waiting time",
    detail:
      "Track downtime, repair delay, missing spare parts, technician response time and impact on line output.",
  },
  {
    id: "late-shipment-risk",
    title: "Late shipment risk",
    detail:
      "Connect production shortfall with packing, finishing and export deadline so directors can intervene before penalty or air shipment.",
  },
];

export default function ProductionPlanningLineBalancingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/software"
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
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-400 hover:bg-violet-400/10"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item.title}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-violet-200">
              Production Loss Risks
            </h2>

            <div className="mt-6 space-y-3">
              {lossRisks.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-400 hover:bg-violet-400/10"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          {[...planningAreas, ...lossRisks].map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
            >
              <h2 className="text-2xl font-bold text-violet-200">
                {item.title}
              </h2>

              <p className="mt-4 leading-relaxed text-slate-300">
                {item.detail}
              </p>

              <div className="mt-5">
                <a
                  href="#top"
                  className="text-sm font-semibold text-violet-300 hover:text-violet-100"
                >
                  Back to top ↑
                </a>
              </div>
            </div>
          ))}
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