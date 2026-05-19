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

const absenceFields = [
  "Employee name",
  "Employee ID",
  "Skilled / unskilled category",
  "Department / production line",
  "Daily salary or wage rate",
  "Absence date",
  "No-show / unauthorised absence reason",
  "Habitual or sudden absence status",
  "Resulting overtime requirement",
  "Overtime cost impact",
  "Production delay impact",
  "Supervisor follow-up action",
];

const absenceRisks = [
  "Production line disruption",
  "Overtime cost increase",
  "Skill gap during shift",
  "Delivery delay risk",
  "Quality risk from replacement worker",
  "Habitual absence pattern",
];

const kpiCards = [
  {
    title: "Absence Risk",
    value: "Monitored",
    description:
      "No-show, unauthorised absence, sudden absence, and habitual absence patterns are monitored.",
    target: "Absence Tracking Fields",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  },
  {
    title: "Overtime Impact",
    value: "Tracked",
    description:
      "Resulting overtime requirement, overtime cost, and replacement labour impact are tracked.",
    target: "Business Impact Risks",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Habitual Pattern",
    value: "Visible",
    description:
      "Habitual absence behaviour and sudden absence pressure are visible for supervisor follow-up.",
    target: "Workforce Intelligence Layer",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Production Risk",
    value: "Measured",
    description:
      "Production delay, skill gap, quality risk, and delivery impact are measured for management action.",
    target: "Consultancy Application",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
];

export default function WorkforceAbsenceIntelligencePage() {
  return (
    <DashboardShell title="Workforce Absence Intelligence">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-rose-300">
              MBNCON Workforce Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Workforce Absence Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track employee no-show, unauthorised absence, skilled and
              unskilled labour impact, salary cost, resulting overtime,
              habitual absence, sudden absence, production delay, and
              supervisor follow-up.
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
              id={slugify("Absence Tracking Fields")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-rose-200">
                Absence Tracking Fields
              </h2>

              <div className="mt-6 space-y-3">
                {absenceFields.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-rose-400 hover:bg-rose-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-400 text-sm font-bold text-slate-950">
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
              id={slugify("Business Impact Risks")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-rose-200">
                Business Impact Risks
              </h2>

              <div className="mt-6 space-y-4">
                {absenceRisks.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-rose-400 hover:bg-rose-400/10 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">
                        {index + 1}. {item}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Measure cost, delay, replacement requirement, root
                        cause, and corrective action.
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("Workforce Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-rose-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
              Workforce Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Absence, Overtime, Skill Gap & Production Risk Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps management analyse no-show behaviour,
              unauthorised absence, skilled and unskilled labour impact,
              department or production line disruption, daily salary cost,
              resulting overtime requirement, overtime cost impact, production
              delay impact, habitual absence patterns, and supervisor follow-up
              action.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...absenceFields, ...absenceRisks].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-rose-400 hover:bg-rose-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for absence tracking,
                      overtime cost visibility, replacement planning,
                      production stability, and corrective action follow-up.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-rose-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories understand how employee absence
              affects production planning, overtime cost, delivery commitment,
              line balance, skill availability, labour discipline, and
              management decision-making.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Absence and overtime visibility",
                "Skill gap and replacement planning",
                "Production continuity protection",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for workforce
                    stability, cost control, and production-risk review.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-rose-300 transition duration-300 hover:text-rose-100"
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