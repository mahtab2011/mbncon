"use client";

import Link from "next/link";

const predictiveAreas = [
  "Demand forecasting",
  "Sales trend prediction",
  "Production risk prediction",
  "Inventory shortage prediction",
  "Customer behaviour prediction",
  "Price movement prediction",
  "Maintenance failure prediction",
  "Cashflow pressure prediction",
];

const businessBenefits = [
  "Plan before problems become serious",
  "Reduce waste, delay, and uncertainty",
  "Improve stock and resource planning",
  "Support better management decisions",
  "Help small and large businesses prepare early",
  "Turn historical data into future guidance",
];

export default function PredictiveAIIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">

        <Link
          href="/software"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            MBNCON AI Transformation Division
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Predictive AI Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Predictive AI Intelligence helps organisations move from reactive
            management to forward-looking decision making. It analyses past and
            current data to identify future risks, opportunities, demand changes,
            operational pressure, and business performance trends.
          </p>

        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h2 className="text-2xl font-bold text-cyan-200">
              Predictive Intelligence Areas
            </h2>

            <div className="mt-6 grid gap-3">

              {predictiveAreas.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-slate-100"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h2 className="text-2xl font-bold text-emerald-200">
              Business Benefits
            </h2>

            <div className="mt-6 grid gap-3">

              {businessBenefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-slate-100"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-bold text-amber-200">
            MBNCON Predictive AI Approach
          </h2>

          <p className="mt-4 max-w-5xl leading-8 text-slate-300">
            MBNCON uses predictive intelligence to support manufacturing,
            agriculture, healthcare, retail, logistics, food businesses,
            public service improvement, and SME transformation.
            The aim is not only to show data, but to help decision makers
            understand what may happen next and what action should be taken early.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-cyan-200">
                Observe
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Collect operational, market, customer, and process data.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-emerald-200">
                Predict
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Identify likely risks, demand changes, delays,
                or performance pressure.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-amber-200">
                Act
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Recommend early action so leaders can prevent losses
                and improve outcomes.
              </p>
            </div>

          </div>

        </section>

      </section>
    </main>
  );
}