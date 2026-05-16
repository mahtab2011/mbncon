"use client";

import Link from "next/link";

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

export default function RootCauseAnalysisPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-300">
            MBNCON Problem Solving Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Root Cause Analysis
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A structured problem-solving module to investigate defects, delays,
            rework, downtime, customer complaints, productivity loss, and
            repeated operational failures.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["RCA Tools", "8"],
            ["Issue Focus", "High"],
            ["Repeat Risk", "Monitored"],
            ["CAPA Link", "Ready"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-amber-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Root Cause Tools</h2>

            <div className="mt-6 space-y-3">
              {rootCauseTools.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Investigation Areas</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {investigationAreas.map((item) => (
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

        <section className="mt-10 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8">
          <h2 className="text-2xl font-bold text-amber-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps consultants and factory teams move beyond blaming
            people and instead identify process, material, method, machine,
            measurement, manpower, and environment causes behind recurring
            problems.
          </p>
        </section>
      </section>
    </main>
  );
}