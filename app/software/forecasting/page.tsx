"use client";

import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const forecastingAreas = [
  "Production volume forecasting",
  "Shipment delay prediction",
  "Buyer order risk forecasting",
  "Machine downtime forecasting",
  "Workforce absenteeism prediction",
  "Utility cost forecasting",
  "Profit margin forecasting",
  "Inventory demand forecasting",
  "Raw material shortage prediction",
  "Capacity utilization forecasting",
  "Wastage trend prediction",
  "Cashflow forecasting",
];

const forecastingKpis = [
  ["Forecast Accuracy", "92%"],
  ["Prediction Confidence", "High"],
  ["Executive Planning Value", "Very High"],
  ["Risk Visibility", "Live"],
];

export default function ForecastingPage() {
  return (
    <DashboardShell
      title="Forecast Intelligence"
      subtitle="Production forecasting, risk projection, and executive planning intelligence."
    >
      <div className="space-y-8">
        <section
          id={slugify("Forecast Intelligence")}
          className="scroll-mt-28 rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON Predictive Intelligence Engine
          </p>

          <h1 className="mt-3 text-4xl font-bold text-neutral-900 md:text-5xl">
            Forecast Intelligence
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-neutral-600">
            AI-powered forecasting system for production planning, operational
            risk prediction, shipment management, inventory forecasting, and
            executive decision intelligence.
          </p>
        </section>

        <section
          id={slugify("Forecast Intelligence KPI")}
          className="scroll-mt-28 grid gap-6 md:grid-cols-4"
        >
          {forecastingKpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-xl"
            >
              <p className="text-sm text-neutral-500">{label}</p>

              <p className="mt-3 text-3xl font-bold text-cyan-700">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section
          id={slugify("Forecast Intelligence Areas")}
          className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Predictive Intelligence Areas
              </p>

              <h2 className="mt-2 text-3xl font-bold text-neutral-900">
                Forecast Intelligence Modules
              </h2>
            </div>

            <div className="rounded-2xl bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-800">
              AI Driven
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {forecastingAreas.map((item, index) => (
              <a
                key={item}
                href={`#${slugify(item)}`}
                id={slugify(item)}
                className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-semibold text-neutral-900">{item}</p>

                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Forecast trends, risks, operational pressure, and planning
                      intelligence for executive decision support.
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          id={slugify("Executive Forecast Recommendation")}
          className="scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-8 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-2xl font-bold text-cyan-900">
            Executive Forecast Recommendation
          </h2>

          <p className="mt-4 max-w-5xl text-lg leading-8 text-neutral-700">
            Use predictive forecasting together with live production,
            manpower, shipment, inventory, utilities, and financial data to
            proactively reduce operational risks before they impact profitability,
            customer delivery, or factory stability.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}