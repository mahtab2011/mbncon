"use client";

import DashboardShell from "@/components/software/DashboardShell";

export default function UtilityCostIntelligencePage() {
  return (
    <DashboardShell title="AI Utility Cost Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Energy & Utility Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Utility Cost Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses electricity, generator fuel, gas, steam,
              compressed air, water, utility spikes, abnormal consumption,
              and production-to-utility efficiency.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
              <p className="text-red-300 text-sm">Utility Cost Risk</p>
              <h2 className="text-2xl font-bold mt-2">Monitoring</h2>
              <p className="text-red-200 mt-3">
                Utility cost intelligence structure active.
              </p>
            </div>

            <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
              <p className="text-orange-300 text-sm">Energy Leakage</p>
              <h2 className="text-3xl font-bold mt-2">Ready</h2>
              <p className="text-orange-200 mt-3">
                Next step will connect electricity, generator, gas, steam, and production data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Recovery Focus</p>
              <h2 className="text-3xl font-bold mt-2">Cost Saving</h2>
              <p className="text-slate-300 mt-3">
                Helps management reduce abnormal utility cost and improve energy efficiency.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">AI Utility Warning</h2>
              <p className="text-slate-300 mt-3">
                Utility cost may rise silently through generator fuel dependency,
                compressed air leakage, idle machine running, steam loss, gas
                overconsumption, or poor production scheduling.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">Executive Saving Action</h2>
              <p className="text-slate-300 mt-3">
                Compare utility cost against production output, separate national
                grid electricity from generator fuel cost, monitor abnormal spikes,
                and identify avoidable energy leakage.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}