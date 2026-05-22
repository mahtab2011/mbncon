"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

const emotionalCapabilities = [
  "Self-awareness under pressure",
  "Emotional self-control",
  "Empathy and listening capability",
  "Conflict reduction behaviour",
  "Team morale visibility",
  "Leadership communication maturity",
  "Stress and burnout awareness",
  "Psychological safety support",
  "Coaching conversation quality",
  "Trust-building behaviour",
  "Respectful feedback practice",
  "Workforce motivation sensitivity",
];

const emotionalRisks = [
  "Leadership overreaction",
  "Poor listening culture",
  "Low team trust",
  "High emotional stress",
  "Conflict escalation",
  "Employee disengagement",
  "Burnout warning signs",
  "Communication breakdown",
];

const emotionalPrinciples = [
  "Self-awareness improves leadership judgement",
  "Empathy strengthens workforce trust",
  "Calm communication reduces conflict",
  "Psychological safety improves learning culture",
  "Respectful feedback supports performance improvement",
  "Emotionally intelligent leadership improves resilience",
];

export default function EmotionalIntelligenceLeadershipPage() {
  return (
    <DashboardShell title="AI Emotional Intelligence & Leadership">
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
              MBNCON Leadership & Human Performance Intelligence
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white">
              AI Emotional Intelligence & Leadership
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              This module supports leaders in improving self-awareness,
              emotional control, empathy, communication maturity, team trust,
              morale visibility, burnout prevention and people-centred
              performance improvement.
            </p>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Emotional Leadership Score
              </p>

              <h2 className="mt-4 text-5xl font-black text-cyan-300">
                86%
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Strong emotional awareness and communication discipline are
                visible across leadership behaviour.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Team Trust Indicator
              </p>

              <h2 className="mt-4 text-5xl font-black text-emerald-300">
                Strong
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Trust and psychological safety indicators are positive.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Burnout Exposure
              </p>

              <h2 className="mt-4 text-5xl font-black text-yellow-300">
                Medium
              </h2>

              <p className="mt-4 text-sm text-slate-300">
                Continuous monitoring is required where workload pressure and
                emotional fatigue increase.
              </p>
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-white">
                Emotional Intelligence Capability Areas
              </h2>

              <div className="mt-6 grid gap-4">
                {emotionalCapabilities.map((item) => (
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
                Emotional Leadership Risk Indicators
              </h2>

              <div className="mt-6 grid gap-4">
                {emotionalRisks.map((risk) => (
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
              Emotional Intelligence Leadership Principles
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {emotionalPrinciples.map((principle) => (
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
              AI People Leadership Observation
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Leaders with strong emotional intelligence are better able to
              maintain calm judgement, listen actively, reduce conflict,
              support morale and build trust during uncertainty and operational
              pressure.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-200">
              Emotional intelligence is especially important for modern
              workforce engagement, Gen-Z motivation, coaching conversations
              and sustainable leadership development.
            </p>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-3">
            <Link
              href="/software/resilience-leadership-framework"
              className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6 transition hover:bg-cyan-500/20"
            >
              <h3 className="text-xl font-bold text-cyan-200">
                Resilience Leadership
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Strengthen leadership resilience and enterprise adaptability.
              </p>
            </Link>

            <Link
              href="/software/employee-empowerment-intelligence"
              className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 transition hover:bg-emerald-500/20"
            >
              <h3 className="text-xl font-bold text-emerald-200">
                Employee Empowerment
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Improve ownership, engagement and workforce participation.
              </p>
            </Link>

            <Link
              href="/software/leadership-dashboard"
              className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 transition hover:bg-yellow-500/20"
            >
              <h3 className="text-xl font-bold text-yellow-200">
                Leadership Dashboard
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Review leadership capability and workforce alignment.
              </p>
            </Link>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}