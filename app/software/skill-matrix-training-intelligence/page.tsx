"use client";

import Link from "next/link";

const skillAreas = [
  "Operator skill level",
  "Skilled / semi-skilled / unskilled status",
  "Multi-skill availability",
  "Training history",
  "Certification status",
  "Replacement worker availability",
  "Critical skill dependency",
  "Skill gap risk",
  "Productivity by skill level",
  "Training effectiveness",
];

const trainingRisks = [
  "Single-operator dependency",
  "Low productivity from skill gap",
  "Quality defect from untrained worker",
  "Line balancing difficulty",
  "Replacement risk during absence",
  "Higher supervision requirement",
];

export default function SkillMatrixTrainingIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-lime-300">
            MBNCON People Capability Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Skill Matrix & Training Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track operator skills, multi-skill capability, training history,
            certification, replacement availability, skill gaps, productivity
            impact, and training effectiveness across factory teams.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Skill Visibility", "Active"],
            ["Training Gap", "Tracked"],
            ["Replacement Risk", "Measured"],
            ["Productivity Link", "Visible"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-lime-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-lime-200">
              Skill Matrix Areas
            </h2>

            <div className="mt-6 space-y-3">
              {skillAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-lime-200">
              Training & Skill Risks
            </h2>

            <div className="mt-6 space-y-4">
              {trainingRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Track department, operation, skill level, responsible
                    trainer, improvement target, and productivity result.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-lime-400/30 bg-lime-400/10 p-8">
          <h2 className="text-2xl font-bold text-lime-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories reduce dependency on a few skilled
            workers, improve training planning, strengthen line balancing,
            reduce quality defects from skill gaps, and build a more flexible
            and productive workforce.
          </p>
        </section>
      </section>
    </main>
  );
}