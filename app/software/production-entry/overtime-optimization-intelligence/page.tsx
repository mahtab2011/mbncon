"use client";

import DashboardShell from "@/components/software/DashboardShell";

export default function OvertimeOptimizationIntelligencePage() {
  return (
    <DashboardShell title="AI Overtime Optimization Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Labour Cost Protection Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Overtime Optimization Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses overtime pressure, labour cost escalation,
              excessive overtime dependency, department imbalance, worker fatigue,
              and overtime reduction opportunities.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
              <p className="text-red-300 text-sm">Overtime Risk</p>
              <h2 className="text-2xl font-bold mt-2">Monitoring</h2>
              <p className="text-red-200 mt-3">
                Overtime optimization intelligence structure active.
              </p>
            </div>

            <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
              <p className="text-orange-300 text-sm">Cost Pressure</p>
              <h2 className="text-3xl font-bold mt-2">Ready</h2>
              <p className="text-orange-200 mt-3">
                Next step will connect overtime, manpower, and production data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Recovery Focus</p>
              <h2 className="text-3xl font-bold mt-2">Efficiency</h2>
              <p className="text-slate-300 mt-3">
                Helps management reduce unnecessary overtime and improve labour efficiency.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">AI Overtime Warning</h2>
              <p className="text-slate-300 mt-3">
                Excessive overtime may indicate weak planning, bottlenecks, poor line
                balancing, shipment pressure, or avoidable labour cost leakage.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">Executive Recovery Action</h2>
              <p className="text-slate-300 mt-3">
                Review overtime by department, compare overtime hours with output,
                identify avoidable overtime, and reduce dependency through better
                planning and line balancing.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}