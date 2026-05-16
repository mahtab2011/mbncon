"use client";

import Link from "next/link";

const capaSteps = [
  "Problem identification",
  "Immediate containment action",
  "Root cause analysis",
  "Corrective action planning",
  "Responsible person assignment",
  "Target completion date",
  "Action implementation",
  "Effectiveness verification",
  "Recurrence prevention",
  "Management review and closure",
];

export default function CorrectiveActionSystemPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-300">
            MBNCON Quality Improvement
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Corrective Action System
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A practical CAPA system to capture problems, identify root causes,
            assign responsibilities, track actions, verify effectiveness, and
            prevent repeated failures.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["CAPA Steps", "10"],
            ["Root Cause Focus", "High"],
            ["Closure Control", "Required"],
            ["Recurrence Risk", "Monitored"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-purple-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">CAPA Workflow</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {capaSteps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-400 font-bold text-slate-950">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold text-white">{step}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Record evidence, owner, target date, status, verification,
                    and management comments.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-purple-400/30 bg-purple-400/10 p-8">
          <h2 className="text-2xl font-bold text-purple-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories stop repeated problems by converting
            defects, complaints, audit findings, delivery failures, and process
            issues into accountable corrective and preventive actions.
          </p>
        </section>
      </section>
    </main>
  );
}