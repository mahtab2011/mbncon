"use client";

import Link from "next/link";

export default function ProductivityManufacturingBlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
        >
          ← Back to Blog
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Productivity Intelligence
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            How to Increase Productivity in Manufacturing
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>By MBNCON</span>
            <span>•</span>
            <span>Operational Excellence Division</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </div>

        <section className="mt-12 space-y-8 text-lg leading-9 text-slate-300">
          <p>
            Productivity improvement remains one of the most critical challenges
            for manufacturing organisations. Rising operational costs, delivery
            pressure, quality expectations and competitive market conditions are
            forcing factories to improve efficiency while maintaining operational
            stability.
          </p>

          <p>
            Many organisations attempt to improve productivity by increasing
            pressure on employees. However, sustainable productivity improvement
            comes from operational visibility, process discipline, workforce
            engagement, leadership effectiveness and intelligent decision-making.
          </p>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
            <h2 className="text-3xl font-bold text-cyan-100">
              Core Areas That Influence Productivity
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Bottleneck operations",
                "Machine downtime",
                "Absenteeism",
                "Line balancing",
                "Material waiting time",
                "Quality rejection and rework",
                "Operator skill variation",
                "Inefficient workflow",
                "Weak production planning",
                "Delayed management response",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p>
            One of the most effective approaches to productivity improvement is
            identifying operational bottlenecks. Every production system contains
            constraints that limit overall output. Improving non-bottleneck
            areas alone often produces limited results.
          </p>

          <p>
            Manufacturing leaders should focus on real operational visibility.
            This includes direct observation, activity sampling, workflow
            analysis, downtime tracking and performance measurement supported by
            reliable operational data.
          </p>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-3xl font-bold">
              Leadership & Productivity
            </h2>

            <p className="mt-5 text-slate-300">
              Productivity is not only a technical issue. Leadership behaviour,
              communication quality, accountability systems and employee
              engagement strongly influence operational performance. Factories
              with strong operational leadership often achieve better
              productivity stability during periods of pressure and uncertainty.
            </p>
          </div>

          <p>
            Artificial intelligence is increasingly supporting productivity
            improvement through predictive visibility, anomaly detection,
            downtime intelligence, workforce analytics and executive dashboards.
            However, AI systems are most effective when combined with Lean
            discipline, operational ownership and management commitment.
          </p>

          <p>
            Sustainable productivity improvement requires continuous monitoring,
            disciplined execution and measurable follow-up systems. Organisations
            that consistently review operational data and act quickly on risks
            are more likely to achieve long-term competitive advantages.
          </p>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
            <h2 className="text-3xl font-bold text-cyan-100">
              Executive Insight
            </h2>

            <p className="mt-5 text-slate-200">
              Productivity improvement should not be viewed as a short-term
              campaign. It should become part of organisational culture,
              leadership behaviour and daily operational management supported by
              intelligence systems and measurable accountability.
            </p>
          </div>

          <p>
            At MBNCON, we believe the future of manufacturing productivity will
            depend on the successful integration of leadership capability,
            operational excellence and AI-powered enterprise intelligence.
          </p>
        </section>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-10">
          <h2 className="text-3xl font-bold text-cyan-100">
            Follow MBNCON Business Excellence Insights
          </h2>

          <p className="mt-4 max-w-3xl text-slate-200">
            Explore future insights on manufacturing productivity, Lean systems,
            AI transformation, operational intelligence and leadership
            excellence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore More Articles
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Contact MBNCON
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}