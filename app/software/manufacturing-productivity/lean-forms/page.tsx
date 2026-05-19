"use client";

import { useState } from "react";

const forms = [
  "Kaizen Suggestion Form",
  "5S Audit Checklist",
  "Gemba Walk Report",
  "Muda Waste Reporting",
  "Downtime Analysis",
  "Quality Defect Report",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function LeanFormsPage() {
  const [activeForm, setActiveForm] = useState(forms[0]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Lean Manufacturing Forms System
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight">
            Intelligent Lean Manufacturing Operational Forms
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            Intelligent digital lean-management forms for Kaizen, 5S, Gemba,
            Muda reduction, quality control, downtime analysis, and productivity
            improvement across manufacturing operations.
          </p>
        </div>
      </section>

      {/* FORM NAVIGATION */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {forms.map((form) => {
              const id = slugify(form);

              return (
                <button
                  key={form}
                  onClick={() => setActiveForm(form)}
                  className={`scroll-mt-28 rounded-2xl p-5 text-left font-bold transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    activeForm === form
                      ? "bg-blue-700 text-white"
                      : "bg-white shadow hover:bg-blue-50"
                  }`}
                >
                  <span id={id}>{form}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE FORM CONTAINER */}
          <section className="mt-16 rounded-3xl bg-white p-10 shadow-2xl">
            <h2 className="text-4xl font-bold text-slate-900">
              {activeForm}
            </h2>

            {/* KAIZEN */}
            {activeForm === "Kaizen Suggestion Form" && (
              <form
                id={slugify(activeForm)}
                className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2"
              >
                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Employee Name"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Department"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Current Problem"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Suggested Improvement"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Expected Saving"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Implementation Time"
                />

                <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white transition hover:bg-blue-800 hover:shadow-xl md:col-span-2">
                  Submit Kaizen
                </button>
              </form>
            )}

            {/* 5S */}
            {activeForm === "5S Audit Checklist" && (
              <form
                id={slugify(activeForm)}
                className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2"
              >
                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Area / Department"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Auditor Name"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Sort Score"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Set in Order Score"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Shine Score"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Standardize Score"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Sustain Score"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Improvement Actions"
                />

                <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white transition hover:bg-blue-800 hover:shadow-xl md:col-span-2">
                  Submit 5S Audit
                </button>
              </form>
            )}

            {/* GEMBA */}
            {activeForm === "Gemba Walk Report" && (
              <form
                id={slugify(activeForm)}
                className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2"
              >
                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Observation Area"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Supervisor"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Observed Issues"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Immediate Corrective Actions"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Responsible Person"
                />

                <input
                  type="date"
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                />

                <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white transition hover:bg-blue-800 hover:shadow-xl md:col-span-2">
                  Submit Gemba Report
                </button>
              </form>
            )}

            {/* MUDA */}
            {activeForm === "Muda Waste Reporting" && (
              <form
                id={slugify(activeForm)}
                className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2"
              >
                <select className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white">
                  <option>Overproduction</option>
                  <option>Waiting</option>
                  <option>Transport</option>
                  <option>Inventory</option>
                  <option>Motion</option>
                  <option>Defects</option>
                </select>

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Department"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Waste Description"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Estimated Cost Impact"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Suggested Reduction Method"
                />

                <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white transition hover:bg-blue-800 hover:shadow-xl md:col-span-2">
                  Submit Waste Report
                </button>
              </form>
            )}

            {/* DOWNTIME */}
            {activeForm === "Downtime Analysis" && (
              <form
                id={slugify(activeForm)}
                className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2"
              >
                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Machine Name"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Operator"
                />

                <input
                  type="datetime-local"
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                />

                <input
                  type="datetime-local"
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Downtime Reason"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Corrective Action"
                />

                <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white transition hover:bg-blue-800 hover:shadow-xl md:col-span-2">
                  Submit Downtime Report
                </button>
              </form>
            )}

            {/* QUALITY */}
            {activeForm === "Quality Defect Report" && (
              <form
                id={slugify(activeForm)}
                className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-2"
              >
                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Product Name"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Batch Number"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Defect Quantity"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white"
                  placeholder="Inspector Name"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Defect Description"
                />

                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 bg-slate-50 p-4 outline-none transition focus:border-blue-600 focus:bg-white md:col-span-2"
                  placeholder="Root Cause Analysis"
                />

                <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white transition hover:bg-blue-800 hover:shadow-xl md:col-span-2">
                  Submit Quality Report
                </button>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}