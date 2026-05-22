"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

const crisisCapabilities = [
  "Emergency response coordination",
  "Leadership escalation discipline",
  "Business continuity planning",
  "Operational disruption visibility",
  "Crisis communication readiness",
  "Rapid decision-making capability",
  "Workforce safety coordination",
  "Supply chain disruption response",
  "Production continuity protection",
  "Recovery ownership clarity",
  "Cross-functional emergency teamwork",
  "Post-crisis learning capability",
];

const crisisRisks = [
  "Slow emergency response",
  "Leadership confusion during disruption",
  "Communication breakdown",
  "Operational panic escalation",
  "Poor workforce coordination",
  "Unclear crisis ownership",
  "Delayed business recovery",
  "Repeated crisis vulnerability",
];

const crisisPrinciples = [
  "Prepared organisations recover faster",
  "Clear communication reduces panic",
  "Fast escalation improves crisis control",
  "Cross-functional coordination strengthens continuity",
  "Learning after disruption improves resilience",
  "Leadership calmness improves workforce confidence",
];

export default function CrisisReadinessIntelligencePage() {
  return (
    <DashboardShell title="AI Crisis Readiness Intelligence">
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
              MBNCON Enterprise Crisis Intelligence Systems
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white">
              AI Crisis Readiness Intelligence
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              This module supports enterprise crisis preparedness, leadership
              escalation discipline, operational continuity, emergency
              coordination, workforce stability and rapid recovery capability
              during unexpected disruption and high-pressure business events.
            </p>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Crisis Preparedness Index
              </p>

              <h2 className="mt-4 text-5xl font-black text-cyan-300">
                81%
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Emergency coordination and escalation systems show positive
                readiness.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Operational Continuity
              </p>

              <h2 className="mt-4 text-5xl font-black text-emerald-300">
                Stable
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Continuity planning and cross-functional coordination remain
                aligned.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Crisis Exposure Risk
              </p>

              <h2 className="mt-4 text-5xl font-black text-yellow-300">
                Medium
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Continuous improvement is required in communication and response
                discipline.
              </p>
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-white">
                Crisis Readiness Capability Areas
              </h2>

              <div className="mt-6 grid gap-4">
                {crisisCapabilities.map((item) => (
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
                Crisis Risk Indicators
              </h2>

              <div className="mt-6 grid gap-4">
                {crisisRisks.map((risk) => (
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
              Crisis Leadership Principles
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {crisisPrinciples.map((principle) => (
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
              AI Crisis Observation
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Organisations that prepare before disruption are more capable of
              maintaining workforce confidence, operational continuity and
              leadership control during periods of crisis and uncertainty.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Crisis readiness is not only about reacting to emergencies. It is
              about building systems, communication discipline, escalation
              clarity and leadership stability before disruption occurs.
            </p>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-3">
            <Link
              href="/software/adaptive-recovery-intelligence"
              className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6 transition hover:bg-cyan-500/20"
            >
              <h3 className="text-xl font-bold text-cyan-200">
                Adaptive Recovery
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Improve disruption recovery coordination and continuity.
              </p>
            </Link>

            <Link
              href="/software/executive-escalation-engine"
              className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 transition hover:bg-emerald-500/20"
            >
              <h3 className="text-xl font-bold text-emerald-200">
                Executive Escalation
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Strengthen leadership escalation and emergency visibility.
              </p>
            </Link>

            <Link
              href="/software/organisational-resilience-intelligence"
              className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 transition hover:bg-yellow-500/20"
            >
              <h3 className="text-xl font-bold text-yellow-200">
                Organisational Resilience
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Connect crisis readiness with long-term enterprise resilience.
              </p>
            </Link>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}