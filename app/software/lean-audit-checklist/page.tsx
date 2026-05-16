"use client";

import Link from "next/link";

const checklist = [
  "Is excess inventory visible on the shop floor?",
  "Are operators waiting for materials or instructions?",
  "Is unnecessary movement observed?",
  "Are defects or rework areas increasing?",
  "Are machines idle frequently?",
  "Is material flow smooth and visible?",
  "Are 5S standards maintained?",
  "Are improvement ideas encouraged from employees?",
  "Is production tracking updated live?",
  "Are bottlenecks identified daily?",
];

export default function LeanAuditChecklistPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-300">
            MBNCON Lean Audit System
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Lean Audit Checklist
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A practical Lean audit checklist for consultants, supervisors,
            factory managers, and improvement teams to observe waste, flow,
            discipline, productivity, and operational efficiency.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Audit Areas", "10"],
            ["Waste Focus", "High"],
            ["Gemba Ready", "Yes"],
            ["Kaizen Support", "Active"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-orange-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">
            Lean Manufacturing Audit Points
          </h2>

          <div className="mt-6 space-y-4">
            {checklist.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-400 font-bold text-slate-950">
                  {index + 1}
                </span>

                <div className="flex-1">
                  <p className="text-slate-200">{item}</p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button className="rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-slate-950">
                      Good
                    </button>

                    <button className="rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-slate-950">
                      Observe
                    </button>

                    <button className="rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white">
                      Problem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8">
          <h2 className="text-2xl font-bold text-orange-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This checklist supports Gemba walks, operational reviews,
            productivity audits, Kaizen events, Lean implementation projects,
            and management consulting engagements across manufacturing
            industries.
          </p>
        </section>
      </section>
    </main>
  );
}