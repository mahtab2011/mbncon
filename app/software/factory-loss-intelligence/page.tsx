"use client";

import Link from "next/link";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

const kpis = [
  ["Loss Areas", "13"],
  ["Profit Risk", "High"],
  ["Action Priority", "Immediate"],
  ["Consultancy Value", "Very High"],
];

export default function FactoryLossIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
        >
          ← Back to Dashboard
        </Link>

        <section
          id={slugify("Factory Loss Intelligence")}
          className="scroll-mt-28 mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
        >
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
        </section>

        <section
          id={slugify("Factory Loss KPI Cards")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-4"
        >
          {kpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-red-300/50 hover:bg-red-400/10 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-red-300">{value}</p>
            </a>
          ))}
        </section>

        <section
          id={slugify("Hidden Loss Map")}
          className="scroll-mt-28 mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8"
        >
          <h2 className="text-2xl font-bold">Hidden Loss Map</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {lossAreas.map((item, index) => (
              <a
                key={item}
                href={`#${slugify(item)}`}
                id={slugify(item)}
                className="scroll-mt-28 flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-red-300/50 hover:bg-red-400/10 hover:shadow-xl"
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
              </a>
            ))}
          </div>
        </section>

        <section
          id={slugify("Consultancy Application")}
          className="scroll-mt-28 mt-10 rounded-3xl border border-red-400/30 bg-red-400/10 p-8 transition hover:-translate-y-1 hover:shadow-xl"
        >
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