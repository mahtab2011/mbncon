"use client";

import DashboardShell from "@/components/software/DashboardShell";

const livePriceSignals = [
  {
    title: "Live Market Price Visibility",
    description:
      "Shows district, wholesale, retail, and farm-gate prices so farmers and buyers can compare real market movement.",
  },
  {
    title: "Wholesale vs Retail Gap",
    description:
      "Highlights abnormal price gaps between farmer price and consumer price to detect unfair margin pressure.",
  },
  {
    title: "Price Syndication Risk",
    description:
      "AI can identify unusual price behaviour, coordinated price movement, artificial shortages, and potential market manipulation patterns.",
  },
  {
    title: "Demand Forecasting",
    description:
      "Predicts future demand using seasonal trends, weather intelligence, population growth, and historical consumption data.",
  },
  {
    title: "Harvest Season Monitoring",
    description:
      "Tracks harvest timing and expected supply volume to reduce sudden market shocks and price instability.",
  },
  {
    title: "Consumer Price Protection",
    description:
      "Helps governments and regulators monitor food affordability and intervene early when essential food prices rise excessively.",
  },
];

const aiBenefits = [
  "Fairer agricultural pricing",
  "Reduced middleman exploitation",
  "Improved farmer income visibility",
  "Better consumer protection",
  "Reduced artificial food shortage",
  "Data-driven national food intelligence",
  "AI-powered agricultural forecasting",
  "Improved supply chain transparency",
];

export default function AILiveAgriPriceIntelligencePage() {
  return (
    <DashboardShell title="AI Live Agri Price Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="mx-auto max-w-7xl space-y-10">

          <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              AI Agricultural Market Intelligence
            </p>

            <h1 className="mt-4 text-5xl font-black text-cyan-300">
              AI Live Agri Product Price Intelligence
            </h1>

            <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300">
              AI-powered live agricultural price intelligence systems can help
              governments, farmers, wholesalers, retailers, and consumers
              monitor real-time food pricing across multiple regions and markets.
              By integrating live market data, predictive analytics, weather
              intelligence, logistics visibility, and supply chain forecasting,
              AI may help reduce price syndication, artificial shortages,
              excessive food inflation, and market inefficiencies.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {livePriceSignals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-3xl border border-cyan-500/20 bg-slate-900/50 p-6"
              >
                <h2 className="text-2xl font-bold text-cyan-300">
                  {signal.title}
                </h2>

                <p className="mt-4 text-slate-300 leading-7">
                  {signal.description}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-8">
            <h2 className="text-4xl font-black text-emerald-300">
              Why AI Live Price Intelligence Matters
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {aiBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
                >
                  <p className="text-lg font-semibold text-slate-200">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-yellow-500/20 bg-slate-900/60 p-8">
            <h2 className="text-4xl font-black text-yellow-300">
              AI + Agriculture + National Food Security
            </h2>

            <div className="mt-6 space-y-6 text-slate-300 leading-8 text-lg">
              <p>
                Global food demand is expected to increase significantly between
                2040 and 2100 due to population growth, urbanisation, climate
                pressure, and rising food consumption patterns.
              </p>

              <p>
                AI-driven agricultural intelligence systems may support future
                food security by improving crop productivity, soil health
                monitoring, weather prediction, irrigation optimisation, weed
                control automation, disease prediction, and post-harvest
                preservation.
              </p>

              <p>
                AI-powered data collection and forecasting models may also help
                governments estimate future food demand, detect food shortage
                risks early, optimise import/export planning, and strengthen
                national agricultural resilience.
              </p>

              <p>
                Over time, large-scale agricultural datasets can support
                predictive analytics, exponential smoothing forecasting models,
                climate risk analysis, and AI-powered food supply chain
                optimisation.
              </p>
            </div>
          </section>

        </div>
      </main>
    </DashboardShell>
  );
}