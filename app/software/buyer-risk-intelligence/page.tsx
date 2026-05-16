"use client";

import DashboardShell from "@/components/software/DashboardShell";

export default function BuyerRiskIntelligencePage() {
  return (
    <DashboardShell title="AI Buyer Risk Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Commercial & Buyer Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Buyer Risk Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses buyer-related commercial risks including delayed
              payment, excessive discount pressure, repeated claims, shipment escalation,
              unrealistic lead times, frequent order changes, and profitability pressure.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
              <p className="text-red-300 text-sm">Buyer Risk</p>
              <h2 className="text-2xl font-bold mt-2">Monitoring</h2>
              <p className="text-red-200 mt-3">
                Buyer risk intelligence structure active.
              </p>
            </div>

            <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
              <p className="text-orange-300 text-sm">Commercial Pressure</p>
              <h2 className="text-3xl font-bold mt-2">Ready</h2>
              <p className="text-orange-200 mt-3">
                Next step will connect buyer orders, claims, recovery, and shipment data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Recovery Focus</p>
              <h2 className="text-3xl font-bold mt-2">Margin Protection</h2>
              <p className="text-slate-300 mt-3">
                Helps management identify risky buyers and protect commercial profitability.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">AI Buyer Warning</h2>
              <p className="text-slate-300 mt-3">
                Repeated claims, unrealistic shipment pressure, frequent style changes,
                delayed approvals, and excessive negotiations may create commercial instability
                and margin erosion.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold">Executive Commercial Action</h2>
              <p className="text-slate-300 mt-3">
                Track buyer claim history, payment behaviour, lead-time pressure,
                recovery performance, and profitability before accepting high-risk orders.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}