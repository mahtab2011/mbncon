"use client";

import Link from "next/link";

const roadmap = [
  {
    period: "First 30 Days",
    focus: "Stabilise operations",
    actions: [
      "Identify urgent bottlenecks",
      "Review quality failure points",
      "Start daily KPI visibility",
      "Assign improvement owners",
    ],
  },
  {
    period: "Next 60 Days",
    focus: "Improve performance",
    actions: [
      "Launch Kaizen projects",
      "Reduce rework and rejection",
      "Improve material flow",
      "Strengthen supervisor follow-up",
    ],
  },
  {
    period: "Next 90 Days",
    focus: "Build excellence system",
    actions: [
      "Introduce Lean and TQM routines",
      "Track savings and productivity gains",
      "Review leadership capability",
      "Prepare digital transformation roadmap",
    ],
  },
];

export default function FutureImprovementProgrammePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-300">
            MBNCON Business Excellence Roadmap
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Future Improvement Programme
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A structured future improvement programme for factories and
            organisations to plan short-term stabilisation, medium-term
            improvement, and long-term business excellence.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Roadmap", "30/60/90 Days"],
            ["Improvement Focus", "Strategic"],
            ["Business Impact", "High"],
            ["Digital Readiness", "Planned"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-sky-300">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {roadmap.map((item) => (
            <div
              key={item.period}
              className="rounded-3xl border border-white/10 bg-slate-900 p-6"
            >
              <h2 className="text-2xl font-bold text-sky-200">
                {item.period}
              </h2>

              <p className="mt-2 text-lg font-semibold text-white">
                {item.focus}
              </p>

              <div className="mt-5 space-y-3">
                {item.actions.map((action, index) => (
                  <div
                    key={action}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-200">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-sky-400/30 bg-sky-400/10 p-8">
          <h2 className="text-2xl font-bold text-sky-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This programme helps MBNCON convert assessment findings into a
            structured improvement journey so clients can see what should happen
            now, what should improve next, and how the organisation can move
            toward long-term excellence.
          </p>
        </section>
      </section>
    </main>
  );
}