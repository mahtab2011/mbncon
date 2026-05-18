"use client";

import Link from "next/link";

const reportSections = [
  {
    title: "Executive Summary",
    text: "The assessment indicates strong improvement potential across leadership, value stream flow, empowerment, quality control, and operational discipline.",
  },
  {
    title: "Key Bottlenecks",
    text: "Major bottlenecks are visible in material ordering, rework, production delay, waiting time, stock control, and shipment coordination.",
  },
  {
    title: "Cost & Loss Intelligence",
    text: "Hidden losses may come from over-ordering, poor material quality, rejections, rework, excess transport, holding time, and late customer feedback.",
  },
  {
    title: "Leadership Insight",
    text: "Leaders need stronger shop-floor visibility, faster decision-making, better communication, and employee involvement in problem solving.",
  },
];

const recommendations = [
  "Create daily production visibility dashboard",
  "Introduce value stream tracking from order to customer feedback",
  "Measure rework, rejection, waiting time, and shipment delay weekly",
  "Empower supervisors and operators to report problems early",
  "Use Kaizen actions for small continuous improvements",
  "Review pricing, costing, material use, and labour efficiency monthly",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AssessmentReportGeneratorPage() {
  const kpiCards = [
    {
      label: "Overall Score",
      value: "74%",
      href: "#executive-assessment",
    },
    {
      label: "Risk Level",
      value: "Medium",
      href: "#risk-assessment",
    },
    {
      label: "Improvement Potential",
      value: "High",
      href: "#report-sections",
    },
    {
      label: "Priority Actions",
      value: "6",
      href: "#recommended-action-plan",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            MBNCON Intelligence System
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Assessment Report Generator
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Generate a structured management consultancy report from leadership,
            manufacturing value stream, adaptive leadership, and employee
            empowerment assessments.
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
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-3xl font-bold text-cyan-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review report intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Executive Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-100">
            Medium Risk · High Improvement Potential
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment indicates that the organisation has strong improvement
            potential across productivity, quality, leadership visibility,
            value stream control, employee empowerment, and cost discipline.
          </p>
        </section>

        <section
          id="risk-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-orange-300">
            Risk Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Bottleneck, Rework & Delay Exposure
          </h2>

          <p className="mt-4 text-slate-200">
            The main operational risks are material delay, production waiting
            time, rework, rejection, weak stock control, shipment coordination
            gaps, and late customer feedback loops.
          </p>
        </section>

        <section
          id="report-sections"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-2"
        >
          {reportSections.map((section) => {
            const sectionId = slugify(section.title);

            return (
              <a
                key={section.title}
                id={sectionId}
                href="#recommended-action-plan"
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
              >
                <h2 className="text-xl font-bold text-white">
                  {section.title}
                </h2>

                <p className="mt-3 text-slate-300">{section.text}</p>

                <p className="mt-4 text-xs text-slate-500">
                  Click to review recommended action plan
                </p>
              </a>
            );
          })}
        </section>

        <section
          id="recommended-action-plan"
          className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-white/5 p-8"
        >
          <h2 className="text-2xl font-bold">Recommended Action Plan</h2>

          <div className="mt-6 space-y-4">
            {recommendations.map((item, index) => (
              <a
                key={item}
                href="#consultancy-output"
                className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                  {index + 1}
                </div>

                <p className="text-slate-200">{item}</p>
              </a>
            ))}
          </div>
        </section>

        <section
          id="consultancy-output"
          className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-cyan-200">
            Consultancy Output
          </h2>

          <p className="mt-4 text-slate-200">
            This report can be used by MBNCON consultants to discuss business
            excellence, manufacturing improvement, leadership development, cost
            reduction, productivity improvement, and operational transformation
            with client companies.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-cyan-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Start with daily visibility, bottleneck tracking, rework control,
              leadership walk-through, and Kaizen action ownership. This creates
              a practical improvement roadmap that management can monitor weekly.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}