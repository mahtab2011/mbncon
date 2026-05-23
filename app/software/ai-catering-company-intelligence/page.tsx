"use client";

import DashboardShell from "@/components/software/DashboardShell";

const intelligenceAreas = [
  "Event order planning",
  "Menu costing intelligence",
  "Ingredient purchasing control",
  "Kitchen production scheduling",
  "Delivery route and timing risk",
  "Event setup readiness",
  "Staff deployment planning",
  "Food wastage monitoring",
  "Customer feedback analysis",
  "Profit margin protection",
];

const kpis = [
  { label: "Event Readiness", value: "86%", note: "Most orders on track" },
  { label: "Delivery Risk", value: "Medium", note: "Timing requires monitoring" },
  { label: "Food Wastage", value: "8%", note: "Portion and surplus control needed" },
  { label: "Margin Risk", value: "Watch", note: "Cost changes need review" },
];

const actions = [
  "Improve event order preparation tracking",
  "Control ingredient purchasing and menu costing",
  "Reduce food wastage through demand planning",
  "Monitor delivery timing and setup readiness",
  "Deploy staff according to event workload",
  "Protect margin by tracking cost leakage",
];

export default function AICateringCompanyIntelligencePage() {
  return (
    <DashboardShell title="AI Catering Company Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-semibold text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              AI Catering Company Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module helps catering companies improve event planning, menu
              costing, ingredient purchasing, kitchen scheduling, delivery timing,
              setup readiness, staff deployment and profit margin protection.
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
                Catering Intelligence Areas
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
              MBNCON AI Catering Company Intelligence converts event orders,
              kitchen preparation, purchasing, delivery and customer service data
              into practical management insight. It helps catering owners reduce
              wastage, improve event readiness, control costs and protect profit
              margins.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}