"use client";

import Link from "next/link";

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

export default function TQMFormsPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            MBNCON TQM Toolkit
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            TQM Forms & Checklists
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Practical quality forms for manufacturing teams to capture defects,
            inspections, corrective actions, supplier quality, audit findings,
            and customer complaints.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Forms Ready", "8"],
            ["Quality Areas", "6"],
            ["Audit Support", "Yes"],
            ["Consultancy Use", "High"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {forms.map((form, index) => (
            <div
              key={form}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                  {index + 1}
                </span>

                <div>
                  <h2 className="text-xl font-bold text-white">{form}</h2>
                  <p className="mt-2 text-slate-300">
                    Captures evidence, responsibility, issue type, root cause,
                    corrective action, target date, and management review.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            Why These Forms Matter
          </h2>

          <p className="mt-4 text-slate-200">
            These forms make TQM implementation easier for factories because
            managers, supervisors, quality teams, operators, and suppliers can
            record quality problems in a structured way and convert them into
            improvement actions.
          </p>
        </section>
      </section>
    </main>
  );
}