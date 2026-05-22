"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

const leadershipCapabilities = [
  "Adaptive leadership capability",
  "Strategic thinking under uncertainty",
  "Decision-making under pressure",
  "Cross-functional collaboration",
  "Communication stability",
  "Operational recovery coordination",
  "People motivation and morale support",
  "Emotional intelligence awareness",
  "Continuous learning behaviour",
  "Leadership accountability",
  "Transformation readiness",
  "Organisational focus discipline",
];

const leadershipRisks = [
  "Leadership burnout",
  "Decision inconsistency",
  "Weak crisis communication",
  "Low employee confidence",
  "Slow adaptation capability",
  "Strategic confusion",
  "Resistance to transformation",
  "Operational misalignment",
];

const frameworkPrinciples = [
  "Leadership resilience improves enterprise continuity",
  "Focus reduces operational interference",
  "Strong communication accelerates recovery",
  "Adaptability improves long-term sustainability",
  "Continuous learning strengthens leadership maturity",
  "Cross-functional collaboration improves enterprise stability",
];

export default function ResilienceLeadershipFrameworkPage() {
  return (
    <DashboardShell title="AI Resilience Leadership Framework">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/software"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            ← Back to Platform
          </Link>

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              MBNCON Leadership Intelligence Systems
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white">
              AI Resilience Leadership Framework
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              This framework supports leadership resilience, enterprise
              adaptability, emotional stability, operational continuity,
              workforce confidence and sustainable transformation capability
              during periods of uncertainty, disruption and rapid change.
            </p>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Leadership Stability Index
              </p>

              <h2 className="mt-4 text-5xl font-black text-cyan-300">
                88%
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Leadership alignment and organisational confidence remain
                stable.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Workforce Confidence
              </p>

              <h2 className="mt-4 text-5xl font-black text-emerald-300">
                High
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Positive communication and leadership visibility support
                operational morale.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Transformation Pressure
              </p>

              <h2 className="mt-4 text-5xl font-black text-yellow-300">
                Medium
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Leadership adaptability and decision clarity require continuous
                reinforcement.
              </p>
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-white">
                Leadership Capability Areas
              </h2>

              <div className="mt-6 grid gap-4">
                {leadershipCapabilities.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-cyan-500/10 bg-slate-800/60 px-5 py-4 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-white">
                Leadership Risk Indicators
              </h2>

              <div className="mt-6 grid gap-4">
                {leadershipRisks.map((risk) => (
                  <div
                    key={risk}
                    className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-200"
                  >
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-3xl font-bold text-white">
              Resilience Leadership Principles
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {frameworkPrinciples.map((principle) => (
                <div
                  key={principle}
                  className="rounded-2xl border border-cyan-500/10 bg-slate-800/60 p-5"
                >
                  <p className="text-slate-200">{principle}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-bold text-white">
              AI Leadership Observation
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Organisations with resilient leadership structures are more
              capable of maintaining operational continuity, workforce
              confidence and strategic clarity during disruption and enterprise
              transformation.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Leadership resilience improves decision quality, communication
              stability, adaptability and enterprise recovery capability across
              changing business environments.
            </p>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-3">
            <Link
              href="/software/organisational-resilience-intelligence"
              className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6 transition hover:bg-cyan-500/20"
            >
              <h3 className="text-xl font-bold text-cyan-200">
                Organisational Resilience
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Explore enterprise resilience and recovery intelligence.
              </p>
            </Link>

            <Link
              href="/software/leadership-dashboard"
              className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 transition hover:bg-emerald-500/20"
            >
              <h3 className="text-xl font-bold text-emerald-200">
                Leadership Dashboard
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Monitor leadership capability and workforce alignment.
              </p>
            </Link>

            <Link
              href="/software/future-improvement-programme"
              className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 transition hover:bg-yellow-500/20"
            >
              <h3 className="text-xl font-bold text-yellow-200">
                Future Improvement Programme
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Strengthen continuous improvement and transformation readiness.
              </p>
            </Link>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}