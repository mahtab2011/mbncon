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
    title: "Imbalance Risk",
    value: "Monitoring",
    message: "Line balancing intelligence structure active.",
    color: "red",
  },
  {
    title: "Operator Pressure",
    value: "Ready",
    message: "Next step will connect manpower, production, and line data.",
    color: "orange",
  },
  {
    title: "Lean Focus",
    value: "Output Flow",
    message: "Helps management balance workload and improve production flow.",
    color: "slate",
  },
];

const cardStyle: Record<string, string> = {
  red: "border-red-700 bg-red-950 text-red-200",
  orange: "border-orange-700 bg-orange-950 text-orange-200",
  slate: "border-slate-800 bg-slate-900 text-slate-300",
};

const titleStyle: Record<string, string> = {
  red: "text-red-300",
  orange: "text-orange-300",
  slate: "text-slate-400",
};

export default function LineBalancingIntelligencePage() {
  return (
    <DashboardShell title="AI Line Balancing Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section id="line-balancing-overview" className="scroll-mt-28">
            <p className="text-sm text-slate-400">
              MBNCON AI Lean Manufacturing Intelligence
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              AI Line Balancing Intelligence Engine
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module analyses overloaded lines, idle lines, operator
              imbalance, bottleneck movement, workstation pressure, and output
              optimization opportunities.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {intelligenceCards.map((card) => (
              <a
                key={card.title}
                href={`#${slugify(card.title)}`}
                className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-xl ${cardStyle[card.color]}`}
              >
                <p className={`text-sm ${titleStyle[card.color]}`}>
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>

                <p className="mt-3">{card.message}</p>
              </a>
            ))}
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            {intelligenceCards.map((card) => (
              <section
                key={card.title}
                id={slugify(card.title)}
                className={`scroll-mt-28 rounded-2xl border p-5 ${cardStyle[card.color]}`}
              >
                <p className={`text-sm ${titleStyle[card.color]}`}>
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>

                <p className="mt-3">{card.message}</p>

                <p className="mt-4 text-sm leading-7 opacity-90">
                  Used by factory leadership to identify line pressure,
                  workload imbalance, idle capacity, bottleneck risk, and
                  improvement priorities.
                </p>
              </section>
            ))}
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}