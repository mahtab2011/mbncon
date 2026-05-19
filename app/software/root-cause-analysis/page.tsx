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

const rootCauseTools = [
  "5 Why Analysis",
  "Fishbone / Ishikawa Thinking",
  "Manpower Cause",
  "Machine Cause",
  "Material Cause",
  "Method Cause",
  "Measurement Cause",
  "Environment Cause",
];

const investigationAreas = [
  "Defect problem",
  "Rework problem",
  "Shipment delay",
  "Material shortage",
  "Machine downtime",
  "Labour productivity drop",
  "Customer complaint",
  "Repeated operational failure",
];

const kpiCards = [
  {
    title: "RCA Tools",
    value: "8",
    description:
      "Structured tools prepared for deeper operational problem investigation.",
    target: "Root Cause Tools",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  },
  {
    title: "Issue Focus",
    value: "High",
    description:
      "Defect, delay, downtime, complaint, rework, and productivity loss focus.",
    target: "Investigation Areas",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Repeat Risk",
    value: "Monitored",
    description:
      "Repeated operational failure patterns prepared for escalation visibility.",
    target: "Root Cause Intelligence",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "CAPA Link",
    value: "Ready",
    description:
      "Corrective and preventive action discipline prepared for consultancy use.",
    target: "Consultancy Application",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
];

export default function RootCauseAnalysisPage() {
  return (
    <DashboardShell title="Root Cause Analysis">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-300">
              MBNCON Problem Solving Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Root Cause Analysis
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              A structured problem-solving module to investigate defects,
              delays, rework, downtime, customer complaints, productivity loss,
              and repeated operational failures.
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
              id={slugify("Root Cause Tools")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-amber-200">
                Root Cause Tools
              </h2>

              <div className="mt-6 space-y-3">
                {rootCauseTools.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <span className="text-slate-200">{item}</span>
                    </a>
                  );
                })}
              </div>
            </section>

            <section
              id={slugify("Investigation Areas")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-amber-200">
                Investigation Areas
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {investigationAreas.map((item) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200 transition duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-lg"
                    >
                      {item}
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("Root Cause Intelligence")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-amber-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Root Cause Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Structured Problem Solving Framework
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module supports structured RCA using 5 Why analysis,
              Fishbone / Ishikawa thinking, and the manufacturing cause
              categories of manpower, machine, material, method, measurement,
              and environment. It helps teams avoid blame-based reactions and
              focus on evidence-based process correction.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...rootCauseTools, ...investigationAreas].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Investigation focus prepared for RCA documentation,
                      evidence review, corrective action planning, and
                      executive operational learning.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-amber-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps consultants and factory teams move beyond
              blaming people and instead identify process, material, method,
              machine, measurement, manpower, and environment causes behind
              recurring problems.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Evidence-based RCA discipline",
                "Corrective action ownership",
                "Repeat problem prevention",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for manufacturing
                    problem-solving and continuous improvement.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-amber-300 transition duration-300 hover:text-amber-100"
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