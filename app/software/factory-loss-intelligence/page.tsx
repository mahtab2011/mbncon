"use client";

import Link from "next/link";

const lossAreas = [
  "Material over-ordering loss",
  "Poor material quality loss",
  "Transport and transit delay loss",
  "Factory gate waiting loss",
  "Excess stock holding cost",
  "Labour waiting time loss",
  "Machine idle time loss",
  "Production rejection loss",
  "Rework labour and material loss",
  "Packaging delay loss",
  "Finished goods holding cost",
  "Late shipment penalty risk",
  "Customer complaint and claim risk",
];

export default function FactoryLossIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-300">
            MBNCON Cost & Loss Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Factory Loss Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Identify hidden losses across material, labour, machine, inventory,
            rework, rejection, shipment, and customer claim areas before they
            damage profit.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Loss Areas", "13"],
            ["Profit Risk", "High"],
            ["Action Priority", "Immediate"],
            ["Consultancy Value", "Very High"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-red-300">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Hidden Loss Map</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {lossAreas.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-400 font-bold text-slate-950">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold text-white">{item}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Track frequency, value, root cause, responsible area, and
                    recovery action.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-red-400/30 bg-red-400/10 p-8">
          <h2 className="text-2xl font-bold text-red-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps MBNCON show clients where money is silently lost
            across the factory value stream and convert those losses into
            measurable improvement projects.
          </p>
        </section>
      </section>
    </main>
  );
}