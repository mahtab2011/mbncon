"use client";

import DashboardShell from "@/components/software/DashboardShell";

const intelligenceAreas = [
  "Table turnover analysis",
  "Food preparation delay tracking",
  "Menu item profitability",
  "Kitchen bottleneck detection",
  "Customer waiting time monitoring",
  "Ingredient wastage control",
  "Peak hour demand forecasting",
  "Staff deployment optimization",
  "Customer feedback intelligence",
  "Revenue and margin leakage",
];

const kpis = [
  { label: "Table Turnover", value: "74%", note: "Capacity use can improve" },
  { label: "Kitchen Delay Risk", value: "Medium", note: "Peak hour pressure visible" },
  { label: "Food Wastage", value: "9%", note: "Ingredient loss needs control" },
  { label: "Menu Margin", value: "+16%", note: "High-margin items identified" },
];

const actions = [
  "Reduce kitchen bottlenecks during peak hours",
  "Improve table allocation and turnaround",
  "Track menu profitability by item",
  "Control ingredient wastage and portion variation",
  "Match staff deployment with demand pattern",
  "Use customer feedback to improve service quality",
];

export default function AIRestaurantIntelligencePage() {
  return (
    <DashboardShell title="AI Restaurant Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-semibold text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              AI Restaurant Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module helps restaurants improve service speed, kitchen flow,
              table utilization, menu profitability, customer satisfaction and food
              cost control through AI-driven operational intelligence.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {kpis.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>

                <h2 className="mt-2 text-3xl font-bold text-cyan-300">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  {item.note}
                </p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Restaurant Intelligence Areas
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {intelligenceAreas.map((area) => (
                  <div
                    key={area}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-200"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                AI Recommended Actions
              </h2>

              <div className="mt-5 space-y-3">
                {actions.map((action, index) => (
                  <div
                    key={action}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4"
                  >
                    <p className="text-sm text-cyan-200">
                      {index + 1}. {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Executive Summary
            </h2>

            <p className="mt-4 max-w-5xl text-slate-300">
              MBNCON AI Restaurant Intelligence converts restaurant operations,
              kitchen performance, menu data and customer service signals into
              practical management insight. It helps owners reduce waste, improve
              service speed, increase table productivity and protect food margins.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}