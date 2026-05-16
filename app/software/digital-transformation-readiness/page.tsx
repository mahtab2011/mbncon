"use client";

import Link from "next/link";

const readinessAreas = [
  "Paper-based vs digital workflow",
  "ERP system readiness",
  "Production data visibility",
  "Real-time reporting capability",
  "Dashboard usage maturity",
  "AI and analytics readiness",
  "Automation opportunity mapping",
  "Workforce digital adaptation",
  "Management reporting discipline",
  "Cross-department data integration",
];

const opportunities = [
  "Digital KPI dashboards",
  "Live production monitoring",
  "Quality tracking automation",
  "Supplier and inventory visibility",
  "AI-assisted operational analysis",
  "Digital corrective action tracking",
];

export default function DigitalTransformationReadinessPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-300">
            MBNCON Digital Excellence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Digital Transformation Readiness
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Assess how prepared an organisation is for digital operations,
            reporting, automation, AI-assisted analysis, and business
            intelligence transformation.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Digital Readiness", "Medium"],
            ["Automation Potential", "High"],
            ["AI Readiness", "Emerging"],
            ["Reporting Maturity", "Developing"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-indigo-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Readiness Assessment Areas</h2>

            <div className="mt-6 space-y-3">
              {readinessAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-400 font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">
              Transformation Opportunities
            </h2>

            <div className="mt-6 grid gap-3">
              {opportunities.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-8">
          <h2 className="text-2xl font-bold text-indigo-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps MBNCON identify where organisations still depend
            on manual systems and where digital dashboards, AI analysis,
            workflow automation, and real-time operational visibility can
            improve performance and decision-making.
          </p>
        </section>
      </section>
    </main>
  );
}