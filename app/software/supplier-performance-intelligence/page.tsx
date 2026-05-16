"use client";

import Link from "next/link";

const supplierAreas = [
  "Material quality performance",
  "On-time delivery reliability",
  "Price stability",
  "Lead time consistency",
  "Rejection and return rate",
  "Shortage risk",
  "Communication responsiveness",
  "Dependency risk",
  "Corrective action response",
  "Overall supplier scorecard",
];

export default function SupplierPerformanceIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-300">
            MBNCON Supplier Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Supplier Performance Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Analyse supplier quality, delivery reliability, price stability,
            lead time, rejection rate, shortage risk, dependency risk, and
            corrective action performance.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Supplier Risk", "Medium"],
            ["Quality Concern", "Monitor"],
            ["Delivery Reliability", "Developing"],
            ["Scorecard Status", "Ready"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-fuchsia-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Supplier Scorecard Areas</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {supplierAreas.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-400 font-bold text-slate-950">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold text-white">{item}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Track score, trend, risk level, supplier response, and
                    improvement action.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-8">
          <h2 className="text-2xl font-bold text-fuchsia-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories evaluate which suppliers support
            performance and which suppliers create hidden cost, production
            delay, quality failure, shortage, and delivery risk.
          </p>
        </section>
      </section>
    </main>
  );
}