"use client";

import {
  fabricConsumptionMaster,
} from "@/lib/manufacturing/fabric-consumption/fabricConsumptionMaster";

function riskClass(risk: string) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function FabricConsumptionPage() {
  const totalOrderQty = fabricConsumptionMaster.reduce(
    (sum, item) => sum + item.orderQty,
    0
  );

  const totalFabric = fabricConsumptionMaster.reduce(
    (sum, item) => sum + item.totalFabricWithBufferMeter,
    0
  );

  const highRisk = fabricConsumptionMaster.filter(
    (item) => item.shortageRisk === "HIGH"
  ).length;

  const averageMarkerEfficiency =
    fabricConsumptionMaster.reduce(
      (sum, item) => sum + item.markerEfficiency,
      0
    ) / fabricConsumptionMaster.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Fabric Consumption Predictor
        </h1>

        <p className="mt-2 text-gray-600">
          Predicts fabric requirement using order quantity, marker efficiency,
          shrinkage, wastage and buffer allowance.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Order Qty" value={totalOrderQty.toLocaleString()} />
        <Card title="Fabric Required" value={`${totalFabric.toLocaleString()} m`} />
        <Card title="High Risk" value={highRisk.toString()} />
        <Card title="Avg Marker Eff." value={`${averageMarkerEfficiency.toFixed(1)}%`} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Consumption Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI predicts fabric requirement by combining marker efficiency,
          shrinkage, wastage and buffer. Styles with low marker efficiency
          and high wastage are automatically flagged for shortage risk.
        </p>
      </section>

      <div className="grid gap-6">
        {fabricConsumptionMaster.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.style}
                </h2>

                <p className="text-gray-600">
                  {item.buyer} · {item.fabricType}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(
                  item.shortageRisk
                )}`}
              >
                {item.shortageRisk} RISK
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Metric title="Order Qty" value={item.orderQty.toLocaleString()} />
              <Metric title="Width" value={`${item.fabricWidthCm} cm`} />
              <Metric title="Marker Eff." value={`${item.markerEfficiency}%`} />
              <Metric title="Base Cons." value={`${item.baseConsumptionPerPcMeter} m/pc`} />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <Metric title="Shrinkage" value={`${item.shrinkagePercent}%`} />
              <Metric title="Wastage" value={`${item.wastagePercent}%`} />
              <Metric title="Buffer" value={`${item.bufferPercent}%`} />
              <Metric title="Total Fabric" value={`${item.totalFabricWithBufferMeter.toLocaleString()} m`} />
            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-2 text-gray-700">
                {item.aiRecommendation}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 font-bold">{value}</h3>
    </div>
  );
}