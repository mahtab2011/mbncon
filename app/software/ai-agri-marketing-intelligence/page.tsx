"use client";

import DashboardShell from "@/components/software/DashboardShell";

const marketingAreas = [
  {
    title: "Market Demand Forecasting",
    description:
      "AI can analyse crop demand, buyer patterns, seasonal consumption, export pressure, and district-level supply signals to help farmers decide what to grow and when to sell.",
  },
  {
    title: "Farmer-to-Market Intelligence",
    description:
      "AI can connect farmers with buyers, wholesalers, processors, retailers, and exporters using transparent data-driven market signals.",
  },
  {
    title: "AI Price Forecasting",
    description:
      "Predictive models can estimate future crop prices based on supply, weather, storage pressure, transport cost, imports, exports, and consumer demand.",
  },
  {
    title: "Supply Chain Visibility",
    description:
      "AI can track movement from farm to market, reduce waste, improve logistics, and identify bottlenecks in collection, transport, storage, and distribution.",
  },
  {
    title: "Digital Agri Marketplace",
    description:
      "AI-enabled platforms can improve farmer profitability by matching products with the right buyers at the right time and reducing dependence on informal middlemen.",
  },
  {
    title: "Agri Marketing Communication",
    description:
      "Generative AI can support product descriptions, buyer communication, rural campaign messages, farmer education, and digital trade content.",
  },
];

const marketingBenefits = [
  "Better farmer price awareness",
  "Reduced market uncertainty",
  "Improved buyer matching",
  "Lower post-harvest loss",
  "Smarter logistics planning",
  "Higher farmer profitability",
  "Better export readiness",
  "Improved national food planning",
];

export default function AIAgriMarketingIntelligencePage() {
  return (
    <DashboardShell title="AI Agri Marketing Intelligence Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8">
            <p className="text-sm text-emerald-300">
              MBNCON AI Agriculture Transformation
            </p>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              AI Agri Marketing Intelligence Centre
            </h1>

            <p className="mt-6 max-w-5xl text-lg text-slate-300">
              AI can transform agricultural marketing by improving demand
              forecasting, price intelligence, supply-chain visibility,
              farmer-to-buyer matching, logistics planning, and digital rural
              commerce.
            </p>

            <p className="mt-4 max-w-5xl text-slate-400">
              The goal is simple: help farmers sell better, reduce market
              uncertainty, improve transparency, and strengthen national food
              supply intelligence.
            </p>
          </div>

          <section className="mt-12">
            <h2 className="text-4xl font-bold">
              AI Use Cases in Agricultural Marketing
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {marketingAreas.map((area) => (
                <div
                  key={area.title}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                >
                  <h3 className="text-2xl font-bold text-emerald-300">
                    {area.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-300">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">
              <h2 className="text-3xl font-bold text-cyan-200">
                Why AI Agri Marketing Matters
              </h2>

              <div className="mt-6 space-y-5 leading-8 text-slate-300">
                <p>
                  Farmers often produce without reliable visibility of future
                  demand, live market prices, storage pressure, transport cost,
                  and buyer behaviour.
                </p>

                <p>
                  AI can convert scattered market signals into practical
                  intelligence so farmers, cooperatives, traders, retailers, and
                  policy makers can make better decisions.
                </p>

                <p>
                  A transparent agri-marketing intelligence platform can reduce
                  uncertainty, support fairer pricing, improve crop planning, and
                  reduce avoidable waste.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-500/20 bg-amber-950/20 p-8">
              <h2 className="text-3xl font-bold text-amber-200">
                Expected Benefits
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {marketingBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-300"
                  >
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-4xl font-bold text-emerald-300">
              From Farm Data to Market Intelligence
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-slate-300">
              <p>
                AI agri marketing can combine crop production data, district
                supply, weather conditions, warehouse stock, transport movement,
                retail demand, export demand, and wholesale market prices.
              </p>

              <p>
                Over time, this creates a powerful agri-data intelligence layer
                for forecasting supply gaps, price movements, harvest pressure,
                market shortages, and food inflation risks.
              </p>

              <p>
                This intelligence can support farmers, cooperatives, ministries,
                retailers, food processors, exporters, insurers, development
                partners, and commodity planners.
              </p>
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}