"use client";

import {
  fabricOptimizerMaster,
} from "../../../lib/manufacturing/fabric-optimizer/fabricOptimizerMaster";

export default function FabricOptimizerPage() {
  const totalSavingKg = fabricOptimizerMaster.reduce(
    (sum, item) => sum + item.estimatedSavingKg,
    0
  );

  const totalSavingUSD = fabricOptimizerMaster.reduce(
    (sum, item) => sum + item.estimatedSavingUSD,
    0
  );

  const avgMarkerEfficiency =
    fabricOptimizerMaster.reduce(
      (sum, item) => sum + item.markerEfficiency,
      0
    ) / fabricOptimizerMaster.length;

  const avgConfidence =
    fabricOptimizerMaster.reduce(
      (sum, item) => sum + item.confidence,
      0
    ) / fabricOptimizerMaster.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Fabric Optimizer
        </h1>

        <p className="mt-2 text-gray-600">
          AI recommends the best marker, roll and lay plan to reduce
          fabric wastage and maximize cutting-room savings.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Saving KG" value={totalSavingKg.toLocaleString()} />
        <Card title="Saving USD" value={`$${totalSavingUSD.toLocaleString()}`} />
        <Card title="Marker Eff." value={`${avgMarkerEfficiency.toFixed(1)}%`} />
        <Card title="AI Confidence" value={`${avgConfidence.toFixed(1)}%`} />
      </div>

      <section className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-700">
          AI Optimization Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI has identified fabric saving opportunities across active
          styles. Optimized roll selection, shade grouping, marker choice
          and lay planning can reduce fabric loss before cutting starts.
        </p>
      </section>

      <div className="grid gap-6">
        {fabricOptimizerMaster.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.id} — {item.style}
                </h2>

                <p className="text-gray-600">
                  {item.buyer} · {item.fabricType}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                {item.confidence}% CONFIDENCE
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Metric title="Marker Eff." value={`${item.markerEfficiency}%`} />
              <Metric title="Fabric Util." value={`${item.fabricUtilization}%`} />
              <Metric title="Saving KG" value={`${item.estimatedSavingKg} kg`} />
              <Metric title="Saving USD" value={`$${item.estimatedSavingUSD}`} />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Info title="Recommended Marker" value={item.recommendedMarker} />
              <Info title="Recommended Roll" value={item.recommendedRoll} />
              <Info title="Lay Plan" value={item.layPlan} />
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

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="mt-2 text-gray-700">{value}</p>
    </div>
  );
}