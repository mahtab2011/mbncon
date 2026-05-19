"use client";

import Link from "next/link";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

const programmeKpis = [
  ["Roadmap", "30/60/90 Days"],
  ["Improvement Focus", "Strategic"],
  ["Business Impact", "High"],
  ["Digital Readiness", "Planned"],
];

export default function FutureImprovementProgrammePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
        >
          ← Back to Dashboard
        </Link>

        <section
          id={slugify("Future Improvement Programme")}
          className="scroll-mt-28 mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
        >
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
        </section>

        <section
          id={slugify("Programme KPI Cards")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-4"
        >
          {programmeKpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-sky-300/50 hover:bg-sky-400/10 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>

              <p className="mt-3 text-2xl font-bold text-sky-300">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section
          id={slugify("Thirty Sixty Ninety Day Roadmap")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-3"
        >
          {roadmap.map((item) => (
            <a
              key={item.period}
              href={`#${slugify(item.period)}`}
              id={slugify(item.period)}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-sky-300/50 hover:bg-sky-400/10 hover:shadow-xl"
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
                    id={slugify(action)}
                    className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{action}</span>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </section>

        <section
          id={slugify("Consultancy Application")}
          className="scroll-mt-28 mt-10 rounded-3xl border border-sky-400/30 bg-sky-400/10 p-8 transition hover:-translate-y-1 hover:shadow-xl"
        >
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