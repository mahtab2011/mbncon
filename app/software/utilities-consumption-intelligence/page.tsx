"use client";

import Link from "next/link";

const utilityAreas = [
  "National grid electricity unit consumption",
  "National grid electricity cost",
  "Generator fuel consumption",
  "Generator fuel cost during load shedding",
  "Gas unit consumption",
  "Gas cost",
  "Water unit consumption",
  "Water cost",
  "Load shedding hours",
  "Production loss due to utility interruption",
  "Utility price increase reason",
  "Abnormal consumption investigation",
];

const costRisks = [
  "Higher generator fuel expense",
  "Production delay from load shedding",
  "Machine idle time",
  "Overtime caused by utility interruption",
  "Higher cost per production unit",
  "Unexplained utility consumption increase",
];

export default function UtilitiesConsumptionIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            MBNCON Utility Cost Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Utilities Consumption Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track electricity, generator fuel, gas, water, load shedding,
            consumption increase, unit cost, production interruption, and
            utility-related financial impact in manufacturing operations.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Grid Electricity", "Separate"],
            ["Generator Fuel", "Tracked"],
            ["Load Shedding", "Measured"],
            ["Utility Cost Risk", "Monitored"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-cyan-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-cyan-200">
              Utility Tracking Areas
            </h2>

            <div className="mt-6 space-y-3">
              {utilityAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-cyan-200">
              Cost & Production Risks
            </h2>

            <div className="mt-6 space-y-4">
              {costRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Record unit consumption, unit price, reason for increase,
                    production effect, responsible area, and corrective action.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-bold text-cyan-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories separate normal grid electricity cost
            from generator fuel cost during load shedding, understand abnormal
            gas, water, and electricity consumption, calculate utility-related
            production loss, and identify opportunities for energy efficiency
            and cost reduction.
          </p>
        </section>
      </section>
    </main>
  );
}