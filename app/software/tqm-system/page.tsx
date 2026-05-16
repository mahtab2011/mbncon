"use client";

import Link from "next/link";

const pillars = [
  "Customer focus",
  "Leadership commitment",
  "Employee involvement",
  "Process control",
  "Supplier quality",
  "Defect prevention",
  "Corrective action",
  "Continuous improvement",
];

const qualityFlow = [
  "Customer requirement",
  "Product specification",
  "Supplier/material approval",
  "Incoming quality check",
  "Production quality control",
  "Defect/rework tracking",
  "Final inspection",
  "Customer feedback",
];

export default function TQMSystemPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            MBNCON Manufacturing Excellence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Total Quality Management System
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A practical TQM framework for manufacturing companies to reduce
            defects, rework, complaints, hidden losses, and quality failure
            costs through process discipline and continuous improvement.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Quality Risk", "Medium"],
            ["Defect Focus", "High"],
            ["Rework Impact", "Visible"],
            ["Customer Claim Risk", "Monitor"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">TQM Pillars</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {pillars.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Quality Flow</h2>

            <div className="mt-6 space-y-3">
              {qualityFlow.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            TQM Consultancy Intelligence
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps consultants identify where quality is failing:
            supplier material, production process, operator method, inspection
            gap, packaging damage, delivery issue, customer misuse, or design
            weakness.
          </p>
        </section>
      </section>
    </main>
  );
}