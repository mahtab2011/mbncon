"use client";

import DashboardShell from "@/components/software/DashboardShell";

export default function ProductionCapacityIntelligencePage() {
  return (
    <DashboardShell title="AI Production Capacity Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Capacity Planning Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Production Capacity Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses factory capacity, overload risk, idle capacity,
              manpower pressure, machine availability, and shipment feasibility.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
              <p className="text-red-300 text-sm">Capacity Risk</p>
              <h2 className="text-2xl font-bold mt-2">Monitoring</h2>
              <p className="text-red-200 mt-3">
                Capacity intelligence structure active.
              </p>
            </div>

            <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
              <p className="text-orange-300 text-sm">Overload Detection</p>
              <h2 className="text-3xl font-bold mt-2">Ready</h2>
              <p className="text-orange-200 mt-3">
                Next step will connect order and production data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Decision Support</p>
              <h2 className="text-3xl font-bold mt-2">Order Acceptance</h2>
              <p className="text-slate-300 mt-3">
                Helps decide whether the factory can safely accept new orders.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}