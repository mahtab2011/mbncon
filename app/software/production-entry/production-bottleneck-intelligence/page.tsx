"use client";

import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const intelligenceCards = [
  {
    title: "Highest Bottleneck Area",
    value: "Production Flow",
    description: "Initial module ready.",
    border: "border-red-700",
    bg: "bg-red-950/40",
    text: "text-red-300",
  },
  {
    title: "Flow Risk",
    value: "Monitoring",
    description: "Bottleneck intelligence structure active.",
    border: "border-orange-700",
    bg: "bg-orange-950/40",
    text: "text-orange-300",
  },
  {
    title: "Recovery Focus",
    value: "Output",
    description:
      "Next step will connect live Firestore production data.",
    border: "border-slate-700",
    bg: "bg-slate-900",
    text: "text-slate-300",
  },
];

const bottleneckAreas = [
  "Production line bottleneck",
  "Machine overload detection",
  "Idle manpower analysis",
  "WIP congestion monitoring",
  "Cutting-to-sewing imbalance",
  "Finishing department delay",
  "Packaging flow interruption",
  "Production planning mismatch",
];

const recoveryActions = [
  "Reallocate operators",
  "Balance production capacity",
  "Reduce machine waiting time",
  "Optimize workflow sequence",
  "Escalate critical bottlenecks",
  "Improve hourly production tracking",
  "Reduce output interruption",
  "Strengthen production recovery actions",
];

export default function ProductionBottleneckIntelligencePage() {
  return (
    <DashboardShell title="AI Production Bottleneck Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
            <p className="text-sm text-slate-400">
              MBNCON AI Factory Flow Intelligence
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              AI Production Bottleneck Intelligence Engine
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module identifies bottleneck departments, bottleneck
              machines, production flow interruptions, idle capacity,
              overloaded areas, and output recovery opportunities across the
              manufacturing operation.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {intelligenceCards.map((card) => {
              const sectionId = slugify(card.title);

              return (
                <a
                  key={card.title}
                  href={`#${sectionId}`}
                  className={`group rounded-2xl border ${card.border} ${card.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl hover:shadow-black/30`}
                >
                  <p className={`text-sm ${card.text}`}>{card.title}</p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {card.value}
                  </h2>

                  <p className="mt-3 text-sm text-slate-300">
                    {card.description}
                  </p>

                  <div className="mt-4 text-xs text-slate-500 transition-colors group-hover:text-slate-300">
                    View intelligence section →
                  </div>
                </a>
              );
            })}
          </section>

          <section
            id={slugify("Highest Bottleneck Area")}
            className="scroll-mt-28 rounded-3xl border border-red-900/40 bg-slate-900/70 p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-wide text-red-300">
                  Critical Production Monitoring
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  Production Bottleneck Visibility
                </h2>

                <p className="mt-4 text-slate-300">
                  AI-driven production bottleneck intelligence helps factory
                  leadership identify operational slowdowns, blocked flow
                  areas, idle capacity, and output recovery opportunities
                  before shipment risk increases.
                </p>
              </div>

              <div className="rounded-2xl border border-red-800 bg-red-950/40 p-6 text-center">
                <p className="text-sm text-red-300">
                  Current Monitoring Status
                </p>

                <h3 className="mt-2 text-4xl font-bold text-white">
                  ACTIVE
                </h3>

                <p className="mt-2 text-sm text-red-200">
                  Enterprise stabilization completed.
                </p>
              </div>
            </div>
          </section>

          <section
            id={slugify("Flow Risk")}
            className="scroll-mt-28 rounded-3xl border border-orange-900/40 bg-slate-900/70 p-8"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm uppercase tracking-wide text-orange-300">
                  Flow Intelligence
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Bottleneck Risk Areas
                </h2>
              </div>

              <div className="rounded-full border border-orange-700 bg-orange-950/40 px-4 py-2 text-sm text-orange-200">
                Live monitoring architecture enabled
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {bottleneckAreas.map((area) => (
                <div
                  key={area}
                  className="rounded-2xl border border-orange-900/30 bg-slate-950/60 p-5 transition-all duration-300 hover:border-orange-600 hover:shadow-lg hover:shadow-orange-950/20"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {area}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    AI intelligence monitoring configured for operational
                    visibility and production flow stabilization.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id={slugify("Recovery Focus")}
            className="scroll-mt-28 rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-400">
                  Recovery Intelligence
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Output Recovery Actions
                </h2>
              </div>

              <div className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300">
                Consultancy-demo executive UX active
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {recoveryActions.map((action) => (
                <div
                  key={action}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-xl hover:shadow-black/20"
                >
                  <p className="text-lg font-semibold text-white">
                    {action}
                  </p>

                  <p className="mt-3 text-sm text-slate-400">
                    Enterprise intelligence layer prepared for future
                    Firestore integration and executive operational recovery
                    workflows.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}