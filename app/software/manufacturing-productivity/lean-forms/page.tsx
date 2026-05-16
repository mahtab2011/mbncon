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

export default function LeanFormsPage() {
  const [activeForm, setActiveForm] = useState(forms[0]);

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-blue-50 text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-5xl font-extrabold">
          Lean Manufacturing Forms System
        </h1>

        <p className="mt-6 max-w-4xl text-xl leading-9 text-gray-700">
          Intelligent digital lean-management forms for Kaizen, 5S, Gemba,
          Muda reduction, quality control, and productivity improvement.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {forms.map((form) => (
            <button
              key={form}
              onClick={() => setActiveForm(form)}
              className={`rounded-2xl p-5 text-left font-bold transition ${
                activeForm === form
                  ? "bg-blue-700 text-white"
                  : "bg-white shadow hover:bg-blue-50"
              }`}
            >
              {form}
            </button>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-2xl">
          <h2 className="text-4xl font-bold">{activeForm}</h2>

          {/* KAIZEN */}
          {activeForm === "Kaizen Suggestion Form" && (
            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="Employee Name"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Department"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Current Problem"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Suggested Improvement"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Expected Saving"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Implementation Time"
              />

              <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white md:col-span-2">
                Submit Kaizen
              </button>
            </form>
          )}

          {/* 5S */}
          {activeForm === "5S Audit Checklist" && (
            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="Area / Department"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Auditor Name"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Sort Score"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Set in Order Score"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Shine Score"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Standardize Score"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Sustain Score"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Improvement Actions"
              />

              <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white md:col-span-2">
                Submit 5S Audit
              </button>
            </form>
          )}

          {/* GEMBA */}
          {activeForm === "Gemba Walk Report" && (
            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="Observation Area"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Supervisor"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Observed Issues"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Immediate Corrective Actions"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Responsible Person"
              />

              <input
                type="date"
                className="rounded-xl border p-4"
              />

              <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white md:col-span-2">
                Submit Gemba Report
              </button>
            </form>
          )}

          {/* MUDA */}
          {activeForm === "Muda Waste Reporting" && (
            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <select className="rounded-xl border p-4">
                <option>Overproduction</option>
                <option>Waiting</option>
                <option>Transport</option>
                <option>Inventory</option>
                <option>Motion</option>
                <option>Defects</option>
              </select>

              <input
                className="rounded-xl border p-4"
                placeholder="Department"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Waste Description"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Estimated Cost Impact"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Suggested Reduction Method"
              />

              <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white md:col-span-2">
                Submit Waste Report
              </button>
            </form>
          )}

          {/* DOWNTIME */}
          {activeForm === "Downtime Analysis" && (
            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="Machine Name"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Operator"
              />

              <input
                type="datetime-local"
                className="rounded-xl border p-4"
              />

              <input
                type="datetime-local"
                className="rounded-xl border p-4"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Downtime Reason"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Corrective Action"
              />

              <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white md:col-span-2">
                Submit Downtime Report
              </button>
            </form>
          )}

          {/* QUALITY */}
          {activeForm === "Quality Defect Report" && (
            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="Product Name"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Batch Number"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Defect Quantity"
              />

              <input
                className="rounded-xl border p-4"
                placeholder="Inspector Name"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Defect Description"
              />

              <textarea
                className="min-h-32 rounded-xl border p-4 md:col-span-2"
                placeholder="Root Cause Analysis"
              />

              <button className="rounded-full bg-blue-700 px-8 py-4 font-bold text-white md:col-span-2">
                Submit Quality Report
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}