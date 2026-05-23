"use client";

import DashboardShell from "@/components/software/DashboardShell";

const generativeAIUses = [
  {
    title: "Business Report Generation",
    description:
      "Generative AI can draft executive reports, summaries, board updates, proposals, emails, policies, and operational narratives from structured data.",
  },
  {
    title: "Healthcare Communication",
    description:
      "Generative AI can support patient education, care instructions, discharge summaries, appointment guidance, and health awareness content.",
  },
  {
    title: "Agriculture Advisory Content",
    description:
      "Generative AI can create farmer-friendly advisory messages for irrigation, sowing, harvesting, pest alerts, weather warnings, and market guidance.",
  },
  {
    title: "Manufacturing Intelligence Reports",
    description:
      "Generative AI can explain production trends, bottlenecks, quality issues, downtime, wastage, workforce risks, and corrective actions.",
  },
  {
    title: "Marketing & Customer Engagement",
    description:
      "Generative AI can assist with product descriptions, social media posts, campaign ideas, customer communication, and personalised marketing.",
  },
  {
    title: "Software & Workflow Support",
    description:
      "Generative AI can support coding, documentation, workflow design, training material, process mapping, and operational system development.",
  },
];

const risksAndControls = [
  "Human review before publication",
  "Source verification and fact-checking",
  "No blind trust in AI outputs",
  "Data privacy protection",
  "Bias and hallucination control",
  "Clear governance and approval workflow",
  "Secure handling of confidential information",
  "Responsible AI training for staff",
];

export default function AIGenerativeIntelligencePage() {
  return (
    <DashboardShell title="Generative AI Intelligence Centre">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <section className="rounded-3xl border border-purple-500/20 bg-purple-950/20 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-4 text-5xl font-black text-purple-200">
              Generative AI Intelligence Centre
            </h1>

            <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300">
              Generative AI creates new text, reports, images, summaries,
              designs, code, recommendations, and communication outputs from
              prompts, documents, data, or user instructions.
            </p>

            <p className="mt-4 max-w-5xl leading-8 text-slate-400">
              For MBNCON, Generative AI is positioned as an intelligence
              augmentation tool — helping leaders, managers, healthcare
              teams, agriculture advisors, factories, marketers, and public
              organisations communicate faster, explain data better, and
              improve productivity.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8">
              <h2 className="text-3xl font-bold text-cyan-300">
                What Generative AI Does
              </h2>

              <div className="mt-6 space-y-5 text-slate-300 leading-8">
                <p>
                  Generative AI helps users move from a blank page to a draft,
                  explanation, recommendation, visual idea, workflow, policy,
                  report, or communication message.
                </p>

                <p>
                  It does not replace expert judgement. It supports humans by
                  accelerating writing, summarisation, translation, idea
                  generation, code support, and knowledge communication.
                </p>

                <p>
                  The strongest value comes when Generative AI is connected to
                  verified organisational data, clear workflow rules, and human
                  approval.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-8">
              <h2 className="text-3xl font-bold text-emerald-300">
                Generative AI vs Predictive AI
              </h2>

              <div className="mt-6 space-y-5 text-slate-300 leading-8">
                <p>
                  Generative AI creates content, summaries, explanations,
                  recommendations, images, reports, and workflow drafts.
                </p>

                <p>
                  Predictive AI forecasts future risks, demand, prices,
                  diseases, breakdowns, crop yield, production performance,
                  and market movement.
                </p>

                <p>
                  In enterprise transformation, the two work together:
                  Predictive AI detects what may happen, while Generative AI
                  explains the insight and recommends action.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-4xl font-black text-purple-200">
              Where Generative AI Can Help
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {generativeAIUses.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-slate-950 p-6"
                >
                  <h3 className="text-2xl font-bold text-cyan-300">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-500/20 bg-amber-950/20 p-8">
            <h2 className="text-4xl font-black text-amber-200">
              Responsible Use & Control
            </h2>

            <p className="mt-5 max-w-5xl leading-8 text-slate-300">
              Generative AI must be used carefully because it can sometimes
              produce incorrect, incomplete, biased, or unsupported outputs.
              Enterprise use requires governance, verification, human review,
              and secure data handling.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {risksAndControls.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                >
                  <p className="font-semibold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">
            <h2 className="text-4xl font-black text-cyan-200">
              MBNCON Generative AI Positioning
            </h2>

            <div className="mt-6 space-y-5 text-lg leading-8 text-slate-300">
              <p>
                MBNCON uses Generative AI as a practical support layer for
                leaders, consultants, managers, healthcare professionals,
                agriculture advisors, and operational teams.
              </p>

              <p>
                The purpose is not to remove human expertise. The purpose is to
                make expertise faster, clearer, more scalable, and more useful
                across organisations and communities.
              </p>

              <p>
                In the MBNCON ecosystem, Generative AI supports explanation,
                communication, documentation, training, executive reporting, and
                transformation storytelling.
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}