"use client";

import DashboardShell from "@/components/software/DashboardShell";

export default function LineBalancingIntelligencePage() {
  return (
    <DashboardShell title="AI Line Balancing Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Lean Manufacturing Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Line Balancing Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses overloaded lines, idle lines, operator imbalance,
              bottleneck movement, workstation pressure, and output optimization opportunities.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
              <p className="text-red-300 text-sm">Imbalance Risk</p>
              <h2 className="text-2xl font-bold mt-2">Monitoring</h2>
              <p className="text-red-200 mt-3">
                Line balancing intelligence structure active.
              </p>
            </div>

            <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
              <p className="text-orange-300 text-sm">Operator Pressure</p>
              <h2 className="text-3xl font-bold mt-2">Ready</h2>
              <p className="text-orange-200 mt-3">
                Next step will connect manpower, production, and line data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Lean Focus</p>
              <h2 className="text-3xl font-bold mt-2">Output Flow</h2>
              <p className="text-slate-300 mt-3">
                Helps management balance workload and improve production flow.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}