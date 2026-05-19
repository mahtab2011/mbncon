"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

const kpis = [
  {
    title: "Line Efficiency",
    value: "Tracked",
    description:
      "Production efficiency visibility prepared for operational analysis.",
    style:
      "border-violet-400/30 bg-violet-400/10 text-violet-200",
  },
  {
    title: "Bottleneck Risk",
    value: "Visible",
    description:
      "AI bottleneck escalation structure enabled for factory visibility.",
    style:
      "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Planning Accuracy",
    value: "Measured",
    description:
      "Compare planning commitment against real production execution.",
    style:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Shipment Risk",
    value: "Monitored",
    description:
      "Shipment delay intelligence linked with production recovery flow.",
    style:
      "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
];

export default function ProductionPlanningLineBalancingPage() {
  return (
    <DashboardShell title="Production Planning & Line Balancing">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div id="top" />

          <Link
            href="/software"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>

          <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-300">
              MBNCON Production Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Production Planning & Line Balancing
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track capacity, hourly targets, SMV, bottlenecks, operator
              balance, machine availability, changeover loss, planning
              accuracy, WIP movement, and shipment commitment risk across
              manufacturing operations.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.style}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {item.title}
                  </p>

                  <p className="mt-3 text-3xl font-extrabold">
                    {item.value}
                  </p>

                  <p className="mt-4 text-sm leading-7 opacity-90">
                    {item.description}
                  </p>

                  <div className="mt-5 text-sm font-semibold opacity-80">
                    View intelligence →
                  </div>
                </a>
              );
            })}
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <div
                id={slugify("Planning Areas")}
                className="scroll-mt-28"
              />

              <h2 className="text-2xl font-bold text-violet-200">
                Planning & Balancing Areas
              </h2>

              <div className="mt-6 space-y-3">
                {planningAreas.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-violet-400 hover:bg-violet-400/10 hover:shadow-lg"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm leading-6 text-slate-200">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <div
                id={slugify("Production Loss Risks")}
                className="scroll-mt-28"
              />

              <h2 className="text-2xl font-bold text-violet-200">
                Production Loss Risks
              </h2>

              <div className="mt-6 space-y-3">
                {lossRisks.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-violet-400 hover:bg-violet-400/10 hover:shadow-lg"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm leading-6 text-slate-200">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 space-y-6">
            {[...planningAreas, ...lossRisks].map((item) => (
              <section
                key={item.id}
                id={item.id}
                className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
              >
                <h2 className="text-2xl font-bold text-violet-200">
                  {item.title}
                </h2>

                <p className="mt-4 leading-8 text-slate-300">
                  {item.detail}
                </p>

                <div className="mt-6">
                  <a
                    href="#top"
                    className="text-sm font-semibold text-violet-300 transition duration-300 hover:text-violet-100"
                  >
                    Back to top ↑
                  </a>
                </div>
              </section>
            ))}
          </section>

          <section className="mt-10 rounded-3xl border border-violet-400/30 bg-violet-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl">
            <div
              id={slugify("Consultancy Application")}
              className="scroll-mt-28"
            />

            <h2 className="text-2xl font-bold text-violet-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories improve line efficiency, reduce
              bottlenecks, balance operators, control WIP, reduce overtime,
              improve planning accuracy, and protect shipment commitments
              through structured production planning intelligence and AI-driven
              operational visibility.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Line balancing visibility",
                "Operational bottleneck escalation",
                "Production planning recovery support",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">
                    {item}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for manufacturing
                    intelligence expansion.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}