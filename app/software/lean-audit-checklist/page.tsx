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

const kpis = [
  ["Audit Areas", "10"],
  ["Waste Focus", "High"],
  ["Gemba Ready", "Yes"],
  ["Kaizen Support", "Active"],
];

const auditCategories = [
  "Inventory Waste",
  "Waiting Time",
  "Motion Waste",
  "Rework and Defects",
  "Machine Utilization",
  "Material Flow",
  "5S Workplace Discipline",
  "Continuous Improvement",
];

export default function LeanAuditChecklistPage() {
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
          id={slugify("Lean Audit Checklist")}
          className="scroll-mt-28 mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
        >
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
        </section>

        <section
          id={slugify("Lean Audit KPI Cards")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-4"
        >
          {kpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-orange-300/50 hover:bg-orange-400/10 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>

              <p className="mt-3 text-2xl font-bold text-orange-300">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section
          id={slugify("Lean Audit Intelligence Areas")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {auditCategories.map((item, index) => (
            <a
              key={item}
              href={`#${slugify(item)}`}
              id={slugify(item)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-orange-300/50 hover:bg-orange-400/10 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400 font-bold text-slate-950">
                  {index + 1}
                </div>

                <div>
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Lean manufacturing operational audit visibility
                    and waste reduction intelligence.
                  </p>
                </div>
              </div>
            </a>
          ))}
        </section>

        <section
          id={slugify("Lean Manufacturing Audit Points")}
          className="scroll-mt-28 mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Gemba Walk Audit System
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Lean Manufacturing Audit Points
              </h2>
            </div>

            <div className="rounded-2xl bg-orange-400/20 px-4 py-2 text-sm font-bold text-orange-200">
              Continuous Improvement
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {checklist.map((item, index) => (
              <section
                key={item}
                id={slugify(item)}
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-orange-300/40 hover:bg-orange-400/10 hover:shadow-xl"
              >
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400 font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <div className="flex-1">
                    <p className="text-lg font-medium text-slate-200">
                      {item}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-slate-950 transition hover:scale-105">
                        Good
                      </button>

                      <button className="rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-slate-950 transition hover:scale-105">
                        Observe
                      </button>

                      <button className="rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white transition hover:scale-105">
                        Problem
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      Observe operational behaviour, identify waste,
                      investigate bottlenecks, and support continuous
                      improvement activities through structured Lean audits.
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section
          id={slugify("Consultancy Application")}
          className="scroll-mt-28 mt-10 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-2xl font-bold text-orange-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This checklist supports Gemba walks, operational reviews,
            productivity audits, Kaizen events, Lean implementation
            projects, and management consulting engagements across
            manufacturing industries.
          </p>
        </section>
      </section>
    </main>
  );
}