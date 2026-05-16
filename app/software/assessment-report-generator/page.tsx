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

export default function AssessmentReportGeneratorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
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

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Overall Score", "74%"],
            ["Risk Level", "Medium"],
            ["Improvement Potential", "High"],
            ["Priority Actions", "6"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-bold text-cyan-300">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {reportSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 text-slate-300">{section.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">Recommended Action Plan</h2>

          <div className="mt-6 space-y-4">
            {recommendations.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                  {index + 1}
                </div>
                <p className="text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-bold text-cyan-200">
            Consultancy Output
          </h2>
          <p className="mt-4 text-slate-200">
            This report can be used by MBNCON consultants to discuss business
            excellence, manufacturing improvement, leadership development, cost
            reduction, productivity improvement, and operational transformation
            with client companies.
          </p>
        </section>
      </section>
    </main>
  );
}