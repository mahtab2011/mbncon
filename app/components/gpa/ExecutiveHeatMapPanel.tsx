"use client";

import { HeatMapCell } from "../../../lib/gpa/executiveHeatMapEngine";

type Props = {
  factories: HeatMapCell[];
};

export default function ExecutiveHeatMapPanel({
  factories,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Executive Factory Heat Map
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Live enterprise health visualization across all factories.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {factories.map((factory) => (
          <div
            key={factory.factoryId}
            className={`rounded-xl p-5 text-white shadow ${
              factory.color === "GREEN"
                ? "bg-green-600"
                : factory.color === "YELLOW"
                ? "bg-yellow-500"
                : factory.color === "ORANGE"
                ? "bg-orange-500"
                : "bg-red-600"
            }`}
          >
            <div className="text-lg font-bold">
              {factory.factoryName}
            </div>

            <div className="mt-4 text-3xl font-extrabold">
              {factory.health}%
            </div>

            <div className="mt-2 text-sm font-semibold">
              {factory.color}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}