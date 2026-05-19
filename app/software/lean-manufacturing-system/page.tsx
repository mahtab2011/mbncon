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

const leanPrinciples = [
  "Kaizen – small continuous improvement",
  "Gemba – go to the actual workplace",
  "Genchi Genbutsu – go and see the real facts",
  "Muda – remove non-value adding waste",
  "Mura – reduce unevenness and instability",
  "Muri – reduce overburden on people and machines",
  "Kanban – visual pull system",
  "JIT – right item, right time, right quantity",
];

const wasteTypes = [
  "Overproduction",
  "Waiting",
  "Transport",
  "Over-processing",
  "Excess inventory",
  "Unnecessary motion",
  "Defects and rework",
  "Unused employee ideas",
];

const kpis = [
  ["Waste Focus", "High"],
  ["Flow Risk", "Medium"],
  ["Kaizen Potential", "Strong"],
  ["Productivity Impact", "High"],
];

export default function LeanManufacturingSystemPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <section
          id="lean-manufacturing-overview"
          className="mt-8 scroll-mt-28 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-300">
            MBNCON Lean Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Lean Manufacturing System
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A practical Lean Manufacturing framework to identify waste,
            improve flow, reduce waiting, control inventory, strengthen shop
            floor discipline, and improve productivity through continuous
            improvement.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {kpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-orange-300/50 hover:bg-white/10 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-orange-300">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            id="lean-principles"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">Lean Principles</h2>

            <div className="mt-6 space-y-3">
              {leanPrinciples.map((item, index) => (
                <a
                  key={item}
                  id={slugify(item)}
                  href={`#${slugify(item)}`}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-orange-300/50 hover:bg-white/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400 font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-slate-200">{item}</span>
                </a>
              ))}
            </div>
          </div>

          <div
            id="eight-wastes-of-lean"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">8 Wastes of Lean</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {wasteTypes.map((item) => (
                <a
                  key={item}
                  id={slugify(item)}
                  href={`#${slugify(item)}`}
                  className="scroll-mt-28 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200 transition hover:-translate-y-1 hover:border-orange-300/50 hover:bg-white/10"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="lean-consultancy-intelligence"
          className="mt-10 scroll-mt-28 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-orange-200">
            Lean Consultancy Intelligence
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps MBNCON consultants observe the shop floor, map
            the value stream, identify bottlenecks, reduce waste, improve
            labour productivity, stabilise material flow, and create practical
            improvement actions for factory teams.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([label, value]) => (
            <section
              key={label}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-orange-300">
                {value}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Used by management to prioritise Lean improvement actions and
                consultancy recommendations.
              </p>
            </section>
          ))}
        </section>
      </section>
    </main>
  );
}