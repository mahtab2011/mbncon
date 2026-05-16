"use client";

import DashboardShell from "@/components/software/DashboardShell";

export default function PreventiveMaintenanceIntelligencePage() {
  return (
    <DashboardShell title="AI Preventive Maintenance Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Predictive Maintenance Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Preventive Maintenance Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses breakdown trends, preventive maintenance compliance,
              high-risk machines, downtime probability, spare-part risk, and maintenance
              scheduling intelligence.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
              <p className="text-red-300 text-sm">Breakdown Risk</p>
              <h2 className="text-2xl font-bold mt-2">Monitoring</h2>
              <p className="text-red-200 mt-3">
                Preventive maintenance intelligence structure active.
              </p>
            </div>

            <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
              <p className="text-orange-300 text-sm">Machine Failure Pattern</p>
              <h2 className="text-3xl font-bold mt-2">Ready</h2>
              <p className="text-orange-200 mt-3">
                Next step will connect maintenance, machine, downtime, and spare-part data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Recovery Focus</p>
              <h2 className="text-3xl font-bold mt-2">Downtime Prevention</h2>
              <p className="text-slate-300 mt-3">
                Helps management prevent unplanned breakdowns and protect shipment flow.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">AI Maintenance Warning</h2>
              <p className="text-slate-300 mt-3">
                Repeated breakdowns may indicate weak preventive maintenance, poor spare
                readiness, operator misuse, machine age risk, or hidden production disruption.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">Executive Maintenance Action</h2>
              <p className="text-slate-300 mt-3">
                Track high-risk machines, monitor downtime frequency, verify preventive
                maintenance completion, and prepare spare parts before failure affects output.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}