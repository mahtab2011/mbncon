"use client";

import DashboardShell from "@/components/software/DashboardShell";

const intelligenceAreas = [
  "Retail sales trend analysis",
  "Slow-moving inventory detection",
  "Fast-selling product tracking",
  "Customer buying behaviour",
  "Stockout prediction",
  "Store productivity monitoring",
  "Shrinkage and loss detection",
  "Staff deployment optimization",
  "Promotion performance analysis",
  "Profit margin intelligence",
];

const kpis = [
  { label: "Sales Growth", value: "+18%", note: "Retail performance improving" },
  { label: "Stockout Risk", value: "Medium", note: "Some items nearing shortage" },
  { label: "Inventory Loss", value: "7%", note: "Shrinkage and wastage observed" },
  { label: "Customer Retention", value: "82%", note: "Loyal customer trend stable" },
];

const actions = [
  "Improve fast-moving stock replenishment",
  "Reduce slow-moving inventory holding",
  "Track customer buying trends daily",
  "Optimize store staffing during peak hours",
  "Monitor promotion effectiveness",
  "Reduce retail shrinkage and leakage",
];

export default function AIRetailIntelligencePage() {
  return (
    <DashboardShell title="AI Retail Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-semibold text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              AI Retail Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module helps retail businesses improve sales visibility,
              customer engagement, inventory control, profit optimization and
              operational productivity through AI-driven retail intelligence.
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
                Retail Intelligence Areas
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
              MBNCON AI Retail Intelligence transforms retail operational data
              into actionable business intelligence. The system helps management
              improve customer experience, reduce inventory losses, increase
              profitability and strengthen decision-making through AI-powered
              retail insights.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}