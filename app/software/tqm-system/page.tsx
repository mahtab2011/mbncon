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

const pillars = [
  "Customer focus",
  "Leadership commitment",
  "Employee involvement",
  "Process control",
  "Supplier quality",
  "Defect prevention",
  "Corrective action",
  "Continuous improvement",
];

const qualityFlow = [
  "Customer requirement",
  "Product specification",
  "Supplier/material approval",
  "Incoming quality check",
  "Production quality control",
  "Defect/rework tracking",
  "Final inspection",
  "Customer feedback",
];

const kpiCards = [
  {
    title: "Quality Risk",
    value: "Medium",
    description:
      "Quality risk visibility prepared for process, supplier, inspection, and customer feedback review.",
    target: "TQM Pillars",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  {
    title: "Defect Focus",
    value: "High",
    description:
      "Defect prevention and corrective action are linked with practical manufacturing controls.",
    target: "Quality Flow",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Rework Impact",
    value: "Visible",
    description:
      "Rework, inspection gaps, and process weakness are structured for management visibility.",
    target: "TQM Intelligence Layer",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Customer Claim Risk",
    value: "Monitor",
    description:
      "Customer feedback and claim risk are connected with supplier, process, and inspection intelligence.",
    target: "TQM Consultancy Intelligence",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
];

export default function TQMSystemPage() {
  return (
    <DashboardShell title="Total Quality Management System">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
              MBNCON Manufacturing Excellence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Total Quality Management System
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              A practical TQM framework for manufacturing companies to reduce
              defects, rework, complaints, hidden losses, and quality failure
              costs through process discipline and continuous improvement.
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
              id={slugify("TQM Pillars")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-emerald-200">
                TQM Pillars
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {pillars.map((item) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200 transition duration-300 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-lg"
                    >
                      {item}
                    </a>
                  );
                })}
              </div>
            </section>

            <section
              id={slugify("Quality Flow")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-emerald-200">
                Quality Flow
              </h2>

              <div className="mt-6 space-y-3">
                {qualityFlow.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <span className="text-slate-200">{item}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("TQM Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-emerald-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              TQM Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Quality System, Defect Prevention & Customer Feedback Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module connects customer focus, leadership commitment,
              employee involvement, process control, supplier quality, defect
              prevention, corrective action, and continuous improvement into one
              practical Total Quality Management system for manufacturing
              excellence.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...pillars, ...qualityFlow].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for quality discipline,
                      defect prevention, evidence-based review, customer
                      satisfaction, and continuous improvement action.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("TQM Consultancy Intelligence")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-emerald-200">
              TQM Consultancy Intelligence
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps consultants identify where quality is failing:
              supplier material, production process, operator method,
              inspection gap, packaging damage, delivery issue, customer
              misuse, or design weakness.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Defect prevention discipline",
                "Customer feedback intelligence",
                "Continuous improvement culture",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for Total Quality
                    Management, operational excellence, and factory improvement
                    review.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-emerald-300 transition duration-300 hover:text-emerald-100"
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