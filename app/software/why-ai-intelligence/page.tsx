"use client";

import DashboardShell from "@/components/software/DashboardShell";

const whyAIReasons = [
  {
    title: "Population Growth",
    description:
      "Global population growth is increasing demand for food, healthcare, energy, transportation, and public services.",
  },
  {
    title: "Climate Change",
    description:
      "AI can support predictive weather analysis, disaster forecasting, resource optimisation, and climate resilience.",
  },
  {
    title: "Healthcare Pressure",
    description:
      "AI can help improve diagnostics, telemedicine, predictive healthcare, patient prioritisation, and healthcare accessibility.",
  },
  {
    title: "Food Security",
    description:
      "AI-enabled agriculture can improve crop yield, reduce waste, optimise irrigation, and support long-term food security.",
  },
  {
    title: "Operational Efficiency",
    description:
      "AI supports faster analysis, predictive maintenance, automation, forecasting, and smarter operational decisions.",
  },
  {
    title: "Data Intelligence",
    description:
      "Modern organisations generate massive data volumes. AI helps analyse, forecast, optimise, and generate actionable intelligence.",
  },
];

const aiApplications = [
  {
    sector: "Healthcare",
    items: [
      "Predictive diagnostics",
      "Telemedicine",
      "AI disease detection",
      "Remote monitoring",
      "Public health analytics",
    ],
  },
  {
    sector: "Agriculture",
    items: [
      "AI irrigation",
      "Crop disease prediction",
      "Soil intelligence",
      "Predictive weather",
      "Food security analytics",
    ],
  },
  {
    sector: "Manufacturing",
    items: [
      "Predictive maintenance",
      "Bottleneck intelligence",
      "Quality analytics",
      "Energy optimisation",
      "Production forecasting",
    ],
  },
  {
    sector: "Banking & Insurance",
    items: [
      "Fraud detection",
      "Risk prediction",
      "Customer intelligence",
      "Predictive analytics",
      "Financial forecasting",
    ],
  },
];

export default function WhyAIIntelligencePage() {
  return (
    <DashboardShell title="Why AI & AI Transformation Intelligence">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">
            <p className="text-sm text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              Why AI & AI Transformation Intelligence
            </h1>

            <p className="mt-6 max-w-5xl text-lg text-slate-300">
              Artificial Intelligence is transforming how countries,
              organisations, industries, and public services make decisions,
              predict risks, optimise operations, and improve productivity.
            </p>

            <p className="mt-4 max-w-5xl text-slate-400">
              AI is not only automation. AI is intelligence augmentation —
              helping humans analyse faster, forecast better, reduce waste,
              improve safety, and make more informed decisions.
            </p>
          </div>

          <section className="mt-10">
            <h2 className="text-4xl font-bold">
              Why the World Needs AI
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {whyAIReasons.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                >
                  <h3 className="text-2xl font-bold text-cyan-300">
                    {reason.title}
                  </h3>

                  <p className="mt-4 text-slate-300 leading-7">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8">
            <h2 className="text-4xl font-bold text-emerald-200">
              What AI Can Improve
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {aiApplications.map((app) => (
                <div
                  key={app.sector}
                  className="rounded-3xl border border-white/10 bg-slate-950 p-6"
                >
                  <h3 className="text-2xl font-bold text-white">
                    {app.sector}
                  </h3>

                  <div className="mt-5 space-y-3">
                    {app.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-amber-500/20 bg-amber-950/20 p-8">
            <h2 className="text-4xl font-bold text-amber-200">
              AI & Future Sustainability
            </h2>

            <div className="mt-6 space-y-5 text-slate-300 leading-8">
              <p>
                Future food security, healthcare accessibility,
                climate resilience, and operational sustainability
                will increasingly depend on intelligence,
                prediction, automation, and data-driven decision-making.
              </p>

              <p>
                AI can help countries improve productivity,
                reduce operational waste, optimise limited resources,
                and strengthen long-term national resilience.
              </p>

              <p>
                A healthy nation is a productive nation.
                A food-secure nation is a stable nation.
                AI-enabled transformation can support both.
              </p>
            </div>
          </section>

        </section>
      </main>
    </DashboardShell>
  );
}