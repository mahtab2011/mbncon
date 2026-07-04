"use client";

import {
  ExecutiveDrillDown,
} from "../../../lib/gpa/executiveDrillDownEngine";

type Props = {
  factory: ExecutiveDrillDown;
};

export default function ExecutiveDrillDownPanel({
  factory,
}: Props) {
  const metrics = [
    { title: "Production", value: `${factory.production}%` },
    { title: "Efficiency", value: `${factory.efficiency}%` },
    { title: "Quality", value: `${factory.quality}%` },
    { title: "OEE", value: `${factory.oee}%` },
    { title: "Shipment", value: `${factory.shipment}%` },
    { title: "Maintenance", value: `${factory.maintenance}%` },
    { title: "Factory Health", value: `${factory.health}%` },
  ];

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Executive Factory Drill-down
          </h2>

          <p className="mt-2 text-slate-500">
            {factory.factoryName}
          </p>
        </div>

        <div className="rounded-xl bg-blue-600 px-5 py-3 text-white">
          <div className="text-sm">Factory Health</div>
          <div className="text-3xl font-bold">
            {factory.health}%
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="text-sm font-medium text-slate-500">
              {metric.title}
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-800">
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}