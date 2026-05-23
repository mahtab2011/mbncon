"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

const aiDomains = [
  {
    title: "Generative AI Intelligence",
    description:
      "Explore how Generative AI transforms content creation, automation, operational intelligence, and enterprise productivity.",
    href: "/software/generative-ai-intelligence",
  },
  {
    title: "Predictive AI Intelligence",
    description:
      "Learn how predictive analytics, forecasting, and AI models improve decision-making and future operational planning.",
    href: "/software/predictive-ai-intelligence",
  },
  {
    title: "AI Smart Healthcare Intelligence",
    description:
      "AI-driven healthcare transformation including smart hospitals, predictive diagnostics, telemedicine, AI kiosks, and public health intelligence.",
    href: "/software/ai-smart-healthcare-intelligence",
  },
  {
    title: "AI Smart Agriculture Intelligence",
    description:
      "AI-powered agriculture transformation including crop intelligence, predictive weather, irrigation optimisation, soil analytics, and food security intelligence.",
    href: "/software/ai-smart-agriculture-intelligence",
  },
  {
    title: "AI Governance & Ethics",
    description:
      "Responsible AI governance, ethical AI deployment, security, compliance, transparency, and policy intelligence.",
    href: "/software/ai-governance-intelligence",
  },
  {
    title: "AI Analytics & Decision Intelligence",
    description:
      "Advanced AI dashboards, predictive analytics, decision intelligence, forecasting engines, and operational optimisation.",
    href: "/software/ai-analytics-intelligence",
  },
];

export default function AITransformationIntelligencePage() {
  return (
    <DashboardShell title="AI Transformation Intelligence Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">
            <p className="text-sm text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              AI Transformation Intelligence Centre
            </h1>

            <p className="mt-6 max-w-5xl text-lg text-slate-300">
              MBNCON AI Transformation Intelligence Centre explores how
              Artificial Intelligence can transform healthcare, agriculture,
              manufacturing, analytics, forecasting, operational decision-making,
              governance, and enterprise productivity.
            </p>

            <p className="mt-4 max-w-5xl text-slate-400">
              Our vision focuses on scalable AI-enabled transformation for
              countries, organisations, healthcare systems, agriculture
              ecosystems, and enterprises seeking operational intelligence,
              predictive analytics, sustainability, and future readiness.
            </p>
          </div>

          <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {aiDomains.map((domain) => (
              <Link
                key={domain.title}
                href={domain.href}
                className="group rounded-3xl border border-white/10 bg-slate-900 p-6 transition hover:border-cyan-400/40 hover:bg-slate-800"
              >
                <div className="flex h-full flex-col">
                  <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300">
                    {domain.title}
                  </h2>

                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">
                    {domain.description}
                  </p>

                  <div className="mt-6 inline-flex items-center text-sm font-medium text-cyan-300">
                    Explore Intelligence →
                  </div>
                </div>
              </Link>
            ))}
          </section>

          <section className="mt-12 rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8">
            <h2 className="text-3xl font-bold text-emerald-200">
              Strategic AI Transformation Vision
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                <h3 className="text-xl font-semibold text-cyan-300">
                  AI Smart Healthcare
                </h3>

                <p className="mt-3 text-slate-300">
                  AI-powered smart healthcare systems can improve diagnostics,
                  predictive healthcare, telemedicine, remote patient support,
                  public health intelligence, and healthcare accessibility.
                </p>

                <p className="mt-3 text-slate-400">
                  A healthy nation is a productive nation. AI-driven healthcare
                  can improve healthcare quality while reducing medical tourism
                  dependency and improving access for remote populations.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                <h3 className="text-xl font-semibold text-emerald-300">
                  AI Smart Agriculture
                </h3>

                <p className="mt-3 text-slate-300">
                  AI agriculture systems can support food security, predictive
                  farming, crop disease intelligence, irrigation optimisation,
                  soil analysis, precision agriculture, and post-harvest
                  intelligence.
                </p>

                <p className="mt-3 text-slate-400">
                  Future food demand will continue increasing through 2040,
                  2050, and beyond. AI-enabled agriculture can improve
                  productivity, reduce waste, optimise resources, and strengthen
                  long-term sustainability.
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}