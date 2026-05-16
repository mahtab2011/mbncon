"use client";

import Link from "next/link";

const leakageAreas = [
  "Incorrect product costing",
  "Hidden factory overhead",
  "Unplanned overtime cost",
  "Material wastage cost",
  "Rework and rejection cost",
  "Low production efficiency",
  "Buyer discount pressure",
  "Shipment delay penalty",
  "Currency fluctuation loss",
  "Excess inventory carrying cost",
  "Underquoted order risk",
  "Utility cost increase",
];

const profitRisks = [
  "Margin erosion",
  "Unprofitable orders",
  "Cash flow pressure",
  "Higher operational cost",
  "Hidden financial leakage",
  "Reduced competitiveness",
];

export default function CostingProfitLeakageIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-300">
            MBNCON Financial Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Costing & Profit Leakage Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Identify hidden profit leakage across costing, overtime, material
            wastage, rework, shipment penalty, inventory carrying cost,
            currency fluctuation, and operational inefficiency.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Profit Leakage", "Tracked"],
            ["Margin Risk", "High"],
            ["Cost Visibility", "Improving"],
            ["Financial Exposure", "Measured"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-green-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-green-200">
              Leakage Areas
            </h2>

            <div className="mt-6 space-y-3">
              {leakageAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-green-200">
              Profit Risks
            </h2>

            <div className="mt-6 space-y-4">
              {profitRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Measure financial impact, root cause, corrective action,
                    management response, and recovery opportunity.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-green-400/30 bg-green-400/10 p-8">
          <h2 className="text-2xl font-bold text-green-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories identify where profit is silently lost,
            which orders are becoming unprofitable, how operational inefficiency
            affects margins, and where corrective financial and operational
            action is needed.
          </p>
        </section>
      </section>
    </main>
  );
}