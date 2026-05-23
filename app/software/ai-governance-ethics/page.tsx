"use client";

import Link from "next/link";

const governanceAreas = [
  "Responsible AI use",
  "Data privacy and protection",
  "Bias and fairness monitoring",
  "Human oversight",
  "AI policy and approval control",
  "Risk and compliance review",
  "Audit trail and accountability",
  "Safe automation boundaries",
];

const ethicsPrinciples = [
  "AI should support people, not replace judgement blindly",
  "Sensitive data must be protected",
  "Decisions should be explainable where possible",
  "Bias should be checked before deployment",
  "High-risk AI outputs should require human review",
  "AI systems should be monitored continuously",
];

export default function AIGovernanceEthicsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/software"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            MBNCON AI Transformation Division
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            AI Governance & Ethics
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            AI Governance & Ethics ensures that artificial intelligence is used
            safely, fairly, transparently, and responsibly. It helps
            organisations create clear rules for AI adoption, data protection,
            human review, risk control, and accountability.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-cyan-200">
              Governance Areas
            </h2>

            <div className="mt-6 grid gap-3">
              {governanceAreas.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-emerald-200">
              Ethical AI Principles
            </h2>

            <div className="mt-6 grid gap-3">
              {ethicsPrinciples.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-amber-200">
            MBNCON Responsible AI Framework
          </h2>

          <p className="mt-4 max-w-5xl leading-8 text-slate-300">
            MBNCON supports organisations in building AI systems with clear
            governance, ethical safeguards, practical human oversight, and
            business accountability. The goal is to make AI useful, trusted,
            explainable, and safe for real operational environments.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-cyan-200">
                Control
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Define what AI can do, who approves it, and where human review is required.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-emerald-200">
                Protect
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Safeguard data, privacy, customers, employees, and business integrity.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h3 className="font-semibold text-amber-200">
                Review
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Monitor AI outputs, risks, bias, errors, and business impact continuously.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}