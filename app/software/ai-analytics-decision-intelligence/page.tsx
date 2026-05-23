"use client";

import Link from "next/link";

const analyticsAreas = [
  "Executive dashboard intelligence",
  "KPI and performance analytics",
  "Operational trend analysis",
  "Risk and opportunity detection",
  "Cost and profitability insights",
  "Customer and market analytics",
  "Supply chain decision support",
  "Real-time management reporting",
];

const decisionBenefits = [
  "Convert raw data into clear business insight",
  "Support faster and better decisions",
  "Identify weak signals before major problems",
  "Reduce dependency on guesswork",
  "Improve leadership visibility",
  "Connect data, action, and accountability",
];

export default function AIAnalyticsDecisionIntelligencePage() {
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
            AI Analytics & Decision Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            AI Analytics & Decision Intelligence helps leaders understand what
            is happening, why it is happening, what may happen next, and what
            action should be taken. It connects data, dashboards, alerts,
            forecasts, and management decisions into one intelligent operating
            system.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-cyan-200">
              Analytics Intelligence Areas
            </h2>

            <div className="mt-6 grid gap-3">
              {analyticsAreas.map((item) => (
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
              Decision Benefits
            </h2>

            <div className="mt-6 grid gap-3">
              {decisionBenefits.map((item) => (
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
            MBNCON Decision Intelligence Model
          </h2>

          <p className="mt-4 max-w-5xl leading-8 text-slate-300">
            MBNCON combines analytics, AI observations, performance scoring,
            forecasting, alert logic, and leadership dashboards to help
            organisations make decisions with greater clarity. This intelligence
            layer can be used across manufacturing, agriculture, healthcare,
            food service, logistics, retail, and public-sector improvement.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-cyan-200">Data</h3>
              <p className="mt-2 text-sm text-slate-300">
                Capture business, operational, customer, and market information.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-emerald-200">Insight</h3>
              <p className="mt-2 text-sm text-slate-300">
                Convert numbers into patterns, risks, opportunities, and meaning.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-amber-200">Decision</h3>
              <p className="mt-2 text-sm text-slate-300">
                Guide leaders toward timely, practical, and measurable action.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-rose-200">Follow-up</h3>
              <p className="mt-2 text-sm text-slate-300">
                Track accountability, impact, improvement, and next actions.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}