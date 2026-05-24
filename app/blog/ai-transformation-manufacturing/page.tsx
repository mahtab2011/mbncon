"use client";

import Link from "next/link";

export default function AITransformationManufacturingBlogPage() {
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
            Manufacturing Intelligence
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            AI Transformation in Manufacturing:
            The Future of Operational Excellence
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>By MBNCON</span>
            <span>•</span>
            <span>AI Transformation Division</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </div>

        <section className="mt-12 space-y-8 text-lg leading-9 text-slate-300">
          <p>
            Manufacturing industries across the world are entering a major
            transformation era driven by artificial intelligence, operational
            visibility, predictive systems and connected enterprise intelligence.
            Traditional reporting systems alone are no longer sufficient for
            modern factories operating under rising pressure of cost, quality,
            speed and customer expectations.
          </p>

          <p>
            Artificial intelligence is not simply automation. AI transformation
            means building systems that can identify operational risks earlier,
            support faster decision-making, improve visibility and help leaders
            act proactively instead of reactively.
          </p>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
            <h2 className="text-3xl font-bold text-cyan-200">
              Key Areas Where AI Is Changing Manufacturing
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Production bottleneck prediction",
                "Machine downtime intelligence",
                "Quality failure prediction",
                "Factory loss visibility",
                "Predictive maintenance",
                "Workforce productivity analysis",
                "Shipment risk detection",
                "Utility cost optimisation",
                "Inventory intelligence",
                "Executive decision support",
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
            One of the biggest advantages of AI transformation is the ability to
            convert operational data into management intelligence. Instead of
            isolated spreadsheets and delayed reporting cycles, AI systems help
            leaders monitor operational conditions continuously and identify
            abnormal patterns before they become critical business problems.
          </p>

          <p>
            Factories that successfully combine leadership capability,
            workforce engagement, Lean thinking, operational discipline and AI
            intelligence are likely to achieve stronger competitiveness in the
            future manufacturing landscape.
          </p>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-3xl font-bold">
              Executive Insight
            </h2>

            <p className="mt-5 text-slate-300">
              AI transformation should not replace people. Instead, it should
              strengthen human decision-making, improve operational visibility
              and help organisations solve problems earlier with greater clarity.
              The future belongs to organisations that combine human leadership
              with intelligent systems.
            </p>
          </div>

          <p>
            At MBNCON, we believe enterprise intelligence platforms will become
            one of the most important operational foundations for manufacturing
            organisations over the next decade. Businesses that begin preparing
            today will have significant advantages in productivity, adaptability
            and resilience.
          </p>
        </section>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-10">
          <h2 className="text-3xl font-bold text-cyan-100">
            Stay Updated with MBNCON Intelligence Insights
          </h2>

          <p className="mt-4 max-w-3xl text-slate-200">
            Follow MBNCON for future articles on AI transformation,
            manufacturing intelligence, leadership systems, operational
            excellence and enterprise productivity improvement.
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