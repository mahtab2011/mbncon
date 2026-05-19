"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

const kpiCards = [
  {
    title: "Skill Visibility",
    value: "Active",
    description:
      "Operator skill level, certification, and multi-skill capability are mapped for management visibility.",
    target: "Skill Matrix Areas",
    className: "border-lime-400/30 bg-lime-400/10 text-lime-200",
  },
  {
    title: "Training Gap",
    value: "Tracked",
    description:
      "Training history and effectiveness are prepared for structured workforce development control.",
    target: "Training & Skill Risks",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Replacement Risk",
    value: "Measured",
    description:
      "Critical skill dependency and replacement worker availability are visible for continuity planning.",
    target: "Skill Intelligence Layer",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Productivity Link",
    value: "Visible",
    description:
      "Productivity by skill level connects people capability with factory output and quality performance.",
    target: "Consultancy Application",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
];

export default function SkillMatrixTrainingIntelligencePage() {
  return (
    <DashboardShell title="Skill Matrix & Training Intelligence">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div id="top" />

          <Link
            href="/software"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>

          <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-lime-300">
              MBNCON People Capability Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Skill Matrix & Training Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track operator skills, multi-skill capability, training history,
              certification, replacement availability, skill gaps, productivity
              impact, and training effectiveness across factory teams.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => {
              const targetId = slugify(card.target);

              return (
                <a
                  key={card.title}
                  href={`#${targetId}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </p>

                  <p className="mt-4 text-sm leading-7 opacity-90">
                    {card.description}
                  </p>

                  <p className="mt-5 text-sm font-semibold opacity-80">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <section
              id={slugify("Skill Matrix Areas")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-lime-200">
                Skill Matrix Areas
              </h2>

              <div className="mt-6 space-y-3">
                {skillAreas.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-lime-400 hover:bg-lime-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <span className="text-sm leading-6 text-slate-200">
                        {item}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>

            <section
              id={slugify("Training & Skill Risks")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-lime-200">
                Training & Skill Risks
              </h2>

              <div className="mt-6 space-y-4">
                {trainingRisks.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-lime-400 hover:bg-lime-400/10 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">
                        {index + 1}. {item}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Track department, operation, skill level, responsible
                        trainer, improvement target, and productivity result.
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("Skill Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-lime-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">
              Skill Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Workforce Capability, Training Gap & Productivity Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps factory leadership understand operator skill
              levels, multi-skill flexibility, training history, certification
              status, replacement coverage, critical skill dependency, and
              productivity impact. It connects workforce capability with line
              balancing, quality stability, absenteeism risk, and output
              recovery.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...skillAreas, ...trainingRisks].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-lime-400 hover:bg-lime-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for training planning,
                      capability development, replacement risk control, and
                      productivity improvement.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-lime-400/30 bg-lime-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-lime-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories reduce dependency on a few skilled
              workers, improve training planning, strengthen line balancing,
              reduce quality defects from skill gaps, and build a more flexible
              and productive workforce.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Skill dependency reduction",
                "Training improvement planning",
                "Workforce productivity uplift",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for workforce
                    capability intelligence and training effectiveness review.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-lime-300 transition duration-300 hover:text-lime-100"
              >
                Back to top ↑
              </a>
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}