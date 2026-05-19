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

const forms = [
  "Incoming Material Inspection Form",
  "In-Process Quality Check Form",
  "Final Product Inspection Form",
  "Defect & Rework Log",
  "Corrective Action Request",
  "Supplier Quality Evaluation",
  "Customer Complaint Form",
  "Internal Quality Audit Checklist",
];

const kpiCards = [
  {
    title: "Forms Ready",
    value: "8",
    description:
      "Structured TQM forms prepared for inspection, defect tracking, audits, and corrective action.",
    target: "TQM Forms Library",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  {
    title: "Quality Areas",
    value: "6",
    description:
      "Support incoming inspection, in-process quality, supplier quality, and complaint handling.",
    target: "TQM Intelligence Layer",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Audit Support",
    value: "Yes",
    description:
      "Internal audit checklist and evidence tracking support structured compliance review.",
    target: "TQM Intelligence Layer",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Consultancy Use",
    value: "High",
    description:
      "Prepared for factory consultancy, operational excellence review, and TQM implementation.",
    target: "Why These Forms Matter",
    className: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  },
];

export default function TQMFormsPage() {
  return (
    <DashboardShell title="TQM Forms & Checklists">
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
              MBNCON TQM Toolkit
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              TQM Forms & Checklists
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Practical quality forms for manufacturing teams to capture
              defects, inspections, corrective actions, supplier quality,
              audit findings, and customer complaints.
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

          <section
            id={slugify("TQM Forms Library")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-emerald-200">
              TQM Forms Library
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {forms.map((form, index) => {
                const formId = slugify(form);

                return (
                  <a
                    key={form}
                    href={`#${formId}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {form}
                        </h2>

                        <p className="mt-2 leading-7 text-slate-300">
                          Captures evidence, responsibility, issue type, root
                          cause, corrective action, target date, and management
                          review.
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("TQM Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-emerald-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              TQM Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Inspection, Audit, Complaint & Corrective Action Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module provides structured quality forms and checklists for
              incoming inspection, in-process quality control, final inspection,
              defect logging, corrective action management, supplier quality
              review, customer complaint handling, and internal audit
              management. It supports operational discipline, traceability, and
              continuous improvement.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {forms.map((form) => {
                const formId = slugify(form);

                return (
                  <section
                    key={form}
                    id={formId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{form}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence support prepared for quality visibility,
                      audit evidence, corrective action discipline, and factory
                      operational excellence review.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Why These Forms Matter")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-emerald-200">
              Why These Forms Matter
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              These forms make TQM implementation easier for factories because
              managers, supervisors, quality teams, operators, and suppliers
              can record quality problems in a structured way and convert them
              into improvement actions.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Structured quality evidence collection",
                "Corrective action accountability",
                "Operational excellence implementation support",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for TQM rollout,
                    audit readiness, quality discipline, and factory
                    improvement culture.
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