"use client";

import {
  FactoryComparisonSummary,
} from "../../../lib/gpa/crossFactoryComparisonEngine";

type Props = {
  comparison: FactoryComparisonSummary;
};

export default function CrossFactoryComparisonPanel({
  comparison,
}: Props) {
  const cards = [
    {
      title: "Best Production",
      factory: comparison.bestProduction,
      value: `${comparison.bestProduction.production}%`,
    },
    {
      title: "Best Efficiency",
      factory: comparison.bestEfficiency,
      value: `${comparison.bestEfficiency.efficiency}%`,
    },
    {
      title: "Best Quality",
      factory: comparison.bestQuality,
      value: `${comparison.bestQuality.quality}%`,
    },
    {
      title: "Best OEE",
      factory: comparison.bestOee,
      value: `${comparison.bestOee.oee}%`,
    },
    {
      title: "Healthiest Factory",
      factory: comparison.healthiestFactory,
      value: `${comparison.healthiestFactory.health}%`,
    },
  ];

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Cross-Factory Comparison
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Top-performing factories across key enterprise KPIs.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm font-semibold text-slate-500">
              {card.title}
            </p>

            <h3 className="mt-3 text-lg font-bold text-slate-800">
              {card.factory.factoryName}
            </h3>

            <div className="mt-4 text-3xl font-extrabold text-blue-700">
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}