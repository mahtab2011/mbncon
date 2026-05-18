"use client";

import Link from "next/link";

const leakageAreas = [
  "Incorrect product costing",
  "Hidden factory overhead",
  "Unplanned overtime cost",
  "Material wastage cost",
  "Rework and rejection cost",
  "Low production efficiency",
  "Buyer discount pressure",
  "Shipment delay penalty",
  "Currency fluctuation loss",
  "Excess inventory carrying cost",
  "Underquoted order risk",
  "Utility cost increase",
];

const profitRisks = [
  "Margin erosion",
  "Unprofitable orders",
  "Cash flow pressure",
  "Higher operational cost",
  "Hidden financial leakage",
  "Reduced competitiveness",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CostingProfitLeakageIntelligencePage() {
  const kpiCards = [
    {
      label: "Profit Leakage",
      value: "Tracked",
      href: "#leakage-areas",
    },
    {
      label: "Margin Risk",
      value: "High",
      href: "#executive-profit-assessment",
    },
    {
      label: "Cost Visibility",
      value: "Improving",
      href: "#profit-risks",
    },
    {
      label: "Financial Exposure",
      value: "Measured",
      href: "#consultancy-application",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-300">
            MBNCON Financial Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Costing & Profit Leakage Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Identify hidden profit leakage across costing, overtime, material
            wastage, rework, shipment penalty, inventory carrying cost,
            currency fluctuation, and operational inefficiency.
          </p>
        </div>

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-green-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-green-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review profit intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-profit-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-green-400/30 bg-green-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-green-300">
            Executive Profit Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-100">
            Margin Risk High · Leakage Control Required
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment recommends active monitoring of costing accuracy,
            overhead allocation, material wastage, overtime pressure, rework
            cost, buyer discount pressure, shipment penalties, and underquoted
            order exposure before profitability is damaged.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            id="leakage-areas"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-green-200">
              Leakage Areas
            </h2>

            <div className="mt-6 space-y-3">
              {leakageAreas.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-green-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="profit-risks"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-green-200">
              Profit Risks
            </h2>

            <div className="mt-6 space-y-4">
              {profitRisks.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-green-400/70 hover:shadow-xl"
                  >
                    <p className="font-semibold text-white">
                      {index + 1}. {item}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Measure financial impact, root cause, corrective action,
                      management response, and recovery opportunity.
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-green-400/30 bg-green-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-green-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories identify where profit is silently lost,
            which orders are becoming unprofitable, how operational inefficiency
            affects margins, and where corrective financial and operational
            action is needed.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-green-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should review every order against costing accuracy,
              actual production efficiency, material wastage, overtime, rework,
              shipment penalties, buyer discount pressure, and overhead
              recovery. Orders with weak margin should trigger executive review
              before acceptance or continuation.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}