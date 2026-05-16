"use client";

import Link from "next/link";

const esgAreas = [
  "Carbon footprint tracking",
  "Electricity efficiency",
  "Generator fuel efficiency",
  "Water consumption",
  "Waste generation",
  "Recycling rate",
  "Chemical disposal control",
  "Environmental audit status",
  "Sustainability targets",
  "ESG reporting readiness",
];

const esgRisks = [
  "Buyer sustainability concern",
  "Higher energy cost",
  "Environmental compliance risk",
  "Waste disposal issue",
  "Water usage pressure",
  "Future ESG reporting gap",
];

export default function SustainabilityESGIntelligencePage() {
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
            MBNCON Sustainability Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Sustainability & ESG Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track carbon footprint, energy efficiency, water use, waste,
            recycling, chemical disposal, sustainability targets, environmental
            audit status, and ESG reporting readiness.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["ESG Readiness", "Developing"],
            ["Energy Efficiency", "Tracked"],
            ["Waste Reduction", "Monitored"],
            ["Buyer Readiness", "Improving"],
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
              Sustainability Areas
            </h2>

            <div className="mt-6 space-y-3">
              {esgAreas.map((item, index) => (
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
              ESG Business Risks
            </h2>

            <div className="mt-6 space-y-4">
              {esgRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Track impact, buyer requirement, legal exposure,
                    improvement action, owner, target date, and evidence.
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
            This module helps factories prepare for future buyer requirements,
            reduce energy and waste costs, improve environmental performance,
            strengthen ESG reporting, and position themselves as responsible
            manufacturing partners.
          </p>
        </section>
      </section>
    </main>
  );
}