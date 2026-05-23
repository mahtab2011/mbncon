"use client";

import DashboardShell from "@/components/software/DashboardShell";

const foodDemandForecasts = [
  {
    year: "2040",
    demand: "20–30% higher food demand",
    note: "Driven by population growth, urbanisation, dietary change, climate pressure, and higher protein consumption.",
  },
  {
    year: "2050",
    demand: "25–45% higher food demand",
    note: "Food security will depend on higher productivity, lower waste, better water use, and predictive agriculture.",
  },
  {
    year: "2070",
    demand: "High climate-risk agriculture era",
    note: "AI forecasting, water intelligence, soil analytics, and resilient crop planning become essential.",
  },
  {
    year: "2100",
    demand: "Sustainable food resilience required",
    note: "Long-term food systems must rely on intelligence, data, climate adaptation, and resource optimisation.",
  },
];

const aiAgricultureInterventions = [
  {
    title: "AI Irrigation Intelligence",
    description:
      "Uses soil moisture, weather signals, and crop-stage data to reduce over-irrigation, save water, and lower diesel or electricity costs.",
  },
  {
    title: "AI Pest & Disease Prediction",
    description:
      "Uses image recognition, outbreak signals, and field data to warn farmers before major crop damage occurs.",
  },
  {
    title: "Soil Fertility Intelligence",
    description:
      "Analyses soil quality, nutrients, nitrogen use, microbial health, and crop suitability to improve sustainable productivity.",
  },
  {
    title: "AI Weed & Small Robot Support",
    description:
      "Uses computer vision, drones, or small robots to identify weed growth and apply targeted control instead of whole-field spraying.",
  },
  {
    title: "Predictive Weather Intelligence",
    description:
      "Supports sowing, spraying, irrigation, harvesting, flood-risk planning, drought response, and crop protection decisions.",
  },
  {
    title: "Post-Harvest & Grain Preservation",
    description:
      "Uses storage monitoring, moisture alerts, supply-chain analytics, and spoilage forecasting to reduce food loss.",
  },
];

const cloudDataIntelligence = [
  "Farmer field data",
  "Soil condition data",
  "Crop disease images",
  "Weather and rainfall data",
  "Irrigation and water-use data",
  "Harvest and yield data",
  "Warehouse and post-harvest data",
  "Live market and price data",
];

export default function AISmartAgricultureIntelligencePage() {
  return (
    <DashboardShell title="AI Smart Agriculture Intelligence Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8">
            <p className="text-sm text-emerald-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              AI Smart Agriculture Intelligence Centre
            </h1>

            <p className="mt-6 max-w-5xl text-lg text-slate-300">
              AI-enabled agriculture can help countries improve food security,
              water efficiency, crop productivity, climate resilience, soil
              fertility, post-harvest preservation, and fair market access.
            </p>

            <p className="mt-4 max-w-5xl text-slate-400">
              Future food security will depend not only on land and labour, but
              on intelligence, data, prediction, and sustainable decision-making.
            </p>
          </div>

          <section className="mt-12">
            <h2 className="text-4xl font-bold">
              Future Food Demand Outlook
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {foodDemandForecasts.map((item) => (
                <div
                  key={item.year}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                >
                  <p className="text-sm text-slate-400">{item.year}</p>
                  <h3 className="mt-3 text-2xl font-bold text-emerald-300">
                    {item.demand}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">
            <h2 className="text-4xl font-bold text-cyan-200">
              How AI Can Save Crops and Increase Productivity
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {aiAgricultureInterventions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-slate-950 p-6"
                >
                  <h3 className="text-2xl font-bold text-emerald-300">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-amber-500/20 bg-amber-950/20 p-8">
              <h2 className="text-3xl font-bold text-amber-200">
                AI Agriculture Data Cloud
              </h2>

              <p className="mt-4 leading-8 text-slate-300">
                Field, soil, crop, weather, pest, irrigation, warehouse, and
                market data can be sent to the cloud for analytics, data mining,
                forecasting, and decision intelligence.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {cloudDataIntelligence.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4 text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-500/20 bg-purple-950/20 p-8">
              <h2 className="text-3xl font-bold text-purple-200">
                Forecasting & Data Monetisation
              </h2>

              <div className="mt-6 space-y-5 leading-8 text-slate-300">
                <p>
                  After three years of structured data collection, the platform
                  can build valuable agricultural intelligence for forecasting,
                  climate-risk analysis, insurance modelling, input planning,
                  crop demand prediction, and public policy.
                </p>

                <p>
                  Exponential smoothing and other forecasting methods can be
                  used to predict crop yield, water demand, price movement,
                  pest risk, input demand, storage pressure, and food supply
                  gaps.
                </p>

                <p>
                  This data can support farmers, ministries, development
                  partners, insurers, commodity planners, retailers, and food
                  security analysts.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-4xl font-bold text-emerald-300">
              Quantitative Value of AI Agriculture
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Water Saving</p>
                <h3 className="mt-2 text-3xl font-bold">20–30%</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Through AI-guided irrigation and weather-linked decisions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Crop Loss Reduction</p>
                <h3 className="mt-2 text-3xl font-bold">10–20%</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Through early pest, disease, weed, and storage alerts.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Yield Improvement</p>
                <h3 className="mt-2 text-3xl font-bold">5–15%</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Through better sowing, soil, irrigation, and harvesting decisions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Food Supply Gain</p>
                <h3 className="mt-2 text-3xl font-bold">10–20%</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Through national scale AI adoption and reduced avoidable loss.
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-5xl leading-8 text-slate-300">
              The real economic value comes from combined savings: water,
              fertiliser, pesticide, labour, diesel, electricity, storage loss,
              transport inefficiency, crop damage, and price exploitation.
            </p>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}