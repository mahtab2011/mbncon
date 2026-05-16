"use client";

import Link from "next/link";

const maturityAreas = [
  {
    area: "Leadership & Strategy",
    level: "Developing",
  },
  {
    area: "Operational Discipline",
    level: "Moderate",
  },
  {
    area: "Lean Manufacturing",
    level: "Emerging",
  },
  {
    area: "Quality Management",
    level: "Stable",
  },
  {
    area: "Digital Readiness",
    level: "Developing",
  },
  {
    area: "People Development",
    level: "Moderate",
  },
  {
    area: "Continuous Improvement",
    level: "Growing",
  },
  {
    area: "Customer Focus",
    level: "Stable",
  },
];

export default function BusinessExcellenceMaturityPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-300">
            MBNCON Business Excellence Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Business Excellence Maturity
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Evaluate how mature an organisation is across leadership,
            operational excellence, Lean systems, quality management, digital
            readiness, people development, and continuous improvement.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Overall Maturity", "Developing"],
            ["Improvement Potential", "High"],
            ["Operational Stability", "Moderate"],
            ["Transformation Readiness", "Growing"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-teal-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">
            Maturity Assessment Areas
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {maturityAreas.map((item, index) => (
              <div
                key={item.area}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400 font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      {item.area}
                    </p>

                    <p className="text-sm text-slate-400">
                      Business excellence capability area
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-teal-400/40 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
                  {item.level}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-teal-400/30 bg-teal-400/10 p-8">
          <h2 className="text-2xl font-bold text-teal-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps MBNCON determine how advanced an organisation is
            and where future investment, leadership focus, process discipline,
            digital systems, and operational improvement should be prioritised.
          </p>
        </section>
      </section>
    </main>
  );
}