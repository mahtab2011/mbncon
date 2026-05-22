"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

const recoveryCapabilities = [
  "Operational recovery planning",
  "Rapid issue escalation",
  "Leadership response coordination",
  "Workforce redeployment readiness",
  "Communication flow during disruption",
  "Supplier and material recovery visibility",
  "Production continuity protection",
  "Customer and buyer expectation management",
  "Cross-functional recovery teamwork",
  "Learning from disruption",
  "Corrective action follow-up",
  "Business continuity discipline",
];

const recoveryRisks = [
  "Slow recovery response",
  "Unclear ownership",
  "Poor communication during disruption",
  "Delayed escalation",
  "Workforce confusion",
  "Production restart delay",
  "Supplier recovery weakness",
  "Repeated disruption without learning",
];

const recoveryPrinciples = [
  "Fast visibility improves recovery speed",
  "Clear ownership reduces confusion",
  "Cross-functional action improves continuity",
  "Learning from disruption prevents repeat failure",
  "Communication discipline protects workforce confidence",
  "Adaptive recovery strengthens long-term resilience",
];

export default function AdaptiveRecoveryIntelligencePage() {
  return (
    <DashboardShell title="AI Adaptive Recovery Intelligence">
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
              MBNCON Resilience Intelligence Systems
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white">
              AI Adaptive Recovery Intelligence
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              This module supports organisations in recovering faster from
              disruption by improving escalation, ownership, communication,
              workforce coordination, operational restart discipline and
              continuous learning after unexpected events.
            </p>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Recovery Readiness</p>

              <h2 className="mt-4 text-5xl font-black text-cyan-300">82%</h2>

              <p className="mt-4 text-sm text-slate-300">
                Recovery planning and escalation discipline show strong
                foundations.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Response Coordination</p>

              <h2 className="mt-4 text-5xl font-black text-emerald-300">
                Stable
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Cross-functional response capability remains aligned.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Recovery Risk</p>

              <h2 className="mt-4 text-5xl font-black text-yellow-300">
                Medium
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Communication and ownership discipline require continuous
                reinforcement.
              </p>
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-white">
                Adaptive Recovery Capability Areas
              </h2>

              <div className="mt-6 grid gap-4">
                {recoveryCapabilities.map((item) => (
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
                Recovery Risk Indicators
              </h2>

              <div className="mt-6 grid gap-4">
                {recoveryRisks.map((risk) => (
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
              Adaptive Recovery Principles
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {recoveryPrinciples.map((principle) => (
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
              AI Recovery Observation
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Organisations that recover quickly from disruption usually have
              clear ownership, fast escalation, disciplined communication and a
              learning system that converts disruption into future prevention.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Adaptive recovery is not only about returning to normal. It is
              about improving the system after every disruption so that the next
              response becomes faster, calmer and more coordinated.
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
                Review enterprise resilience and continuity capability.
              </p>
            </Link>

            <Link
              href="/software/resilience-leadership-framework"
              className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 transition hover:bg-emerald-500/20"
            >
              <h3 className="text-xl font-bold text-emerald-200">
                Resilience Leadership
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Strengthen leadership response and adaptability.
              </p>
            </Link>

            <Link
              href="/software/executive-escalation-engine"
              className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 transition hover:bg-yellow-500/20"
            >
              <h3 className="text-xl font-bold text-yellow-200">
                Executive Escalation
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Connect recovery risk with senior management action.
              </p>
            </Link>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}