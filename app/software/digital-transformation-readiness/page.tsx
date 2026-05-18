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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function DigitalTransformationReadinessPage() {
  const kpiCards = [
    {
      label: "Digital Readiness",
      value: "Medium",
      href: "#executive-digital-assessment",
    },
    {
      label: "Automation Potential",
      value: "High",
      href: "#transformation-opportunities",
    },
    {
      label: "AI Readiness",
      value: "Emerging",
      href: "#readiness-assessment-areas",
    },
    {
      label: "Reporting Maturity",
      value: "Developing",
      href: "#consultancy-application",
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

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-indigo-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review digital intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-digital-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-indigo-300">
            Executive Digital Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-indigo-100">
            Medium Readiness · High Automation Potential
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment indicates that the organisation has strong digital
            improvement potential, but needs better reporting discipline,
            real-time visibility, workflow standardisation, data integration,
            and workforce adaptation before full transformation.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            id="readiness-assessment-areas"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">
              Readiness Assessment Areas
            </h2>

            <div className="mt-6 space-y-3">
              {readinessAreas.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-400 font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="transformation-opportunities"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">
              Transformation Opportunities
            </h2>

            <div className="mt-6 grid gap-3">
              {opportunities.map((item) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-xl"
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-indigo-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps MBNCON identify where organisations still depend
            on manual systems and where digital dashboards, AI analysis,
            workflow automation, and real-time operational visibility can
            improve performance and decision-making.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-indigo-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should begin with digital KPI dashboards, production
              visibility, quality tracking, supplier and inventory integration,
              corrective action workflow, and AI-assisted operational analysis.
              Transformation should be phased so teams can adapt without
              disrupting daily operations.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}