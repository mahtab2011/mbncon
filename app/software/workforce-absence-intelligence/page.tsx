"use client";

import Link from "next/link";

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

export default function WorkforceAbsenceIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-rose-300">
            MBNCON Workforce Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Workforce Absence Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track employee no-show, unauthorised absence, skilled and unskilled
            labour impact, salary cost, resulting overtime, habitual absence,
            sudden absence, production delay, and supervisor follow-up.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Absence Risk", "Monitored"],
            ["Overtime Impact", "Tracked"],
            ["Habitual Pattern", "Visible"],
            ["Production Risk", "Measured"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-rose-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-rose-200">
              Absence Tracking Fields
            </h2>

            <div className="mt-6 space-y-3">
              {absenceFields.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-rose-200">
              Business Impact Risks
            </h2>

            <div className="mt-6 space-y-4">
              {absenceRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Measure cost, delay, replacement requirement, root cause,
                    and corrective action.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-8">
          <h2 className="text-2xl font-bold text-rose-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories understand how employee absence affects
            production planning, overtime cost, delivery commitment, line
            balance, skill availability, labour discipline, and management
            decision-making.
          </p>
        </section>
      </section>
    </main>
  );
}