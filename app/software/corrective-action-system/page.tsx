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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CorrectiveActionSystemPage() {
  const kpiCards = [
    {
      label: "CAPA Steps",
      value: "10",
      href: "#capa-workflow",
    },
    {
      label: "Root Cause Focus",
      value: "High",
      href: "#executive-capa-assessment",
    },
    {
      label: "Closure Control",
      value: "Required",
      href: "#consultancy-application",
    },
    {
      label: "Recurrence Risk",
      value: "Monitored",
      href: "#capa-workflow",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
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

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-purple-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-purple-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review CAPA intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-capa-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-purple-400/30 bg-purple-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-purple-300">
            Executive CAPA Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-100">
            Corrective Action Governance Active
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment recommends disciplined root cause analysis,
            ownership tracking, verification control, closure review, and
            recurrence prevention for all operational, audit, shipment,
            quality, and customer-related failures.
          </p>
        </section>

        <section
          id="capa-workflow"
          className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
        >
          <h2 className="text-2xl font-bold">CAPA Workflow</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {capaSteps.map((step, index) => {
              const sectionId = slugify(step);

              return (
                <a
                  key={step}
                  id={sectionId}
                  href="#consultancy-application"
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-purple-400/70 hover:shadow-xl"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-400 font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      {step}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Record evidence, owner, target date, status,
                      verification, and management comments.
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-purple-400/30 bg-purple-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-purple-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories stop repeated problems by converting
            defects, complaints, audit findings, delivery failures, and process
            issues into accountable corrective and preventive actions.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-purple-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should ensure every CAPA item has clear ownership,
              measurable root cause analysis, target completion dates,
              effectiveness verification, and recurrence prevention review
              before final closure approval.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}