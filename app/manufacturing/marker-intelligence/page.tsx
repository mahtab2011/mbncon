"use client";

import { markerMaster } from "@/lib/manufacturing/marker-intelligence/markerMaster";

function statusClass(status: string) {
  switch (status) {
    case "EXCELLENT":
      return "bg-green-100 text-green-700";

    case "GOOD":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-red-100 text-red-700";
  }
}

export default function MarkerIntelligencePage() {
  const totalMarkers = markerMaster.length;

  const averageEfficiency =
    markerMaster.reduce(
      (sum, item) => sum + item.efficiency,
      0
    ) / totalMarkers;

  const averageWaste =
    markerMaster.reduce(
      (sum, item) => sum + item.fabricWastePercent,
      0
    ) / totalMarkers;

  const excellentMarkers = markerMaster.filter(
    (item) => item.status === "EXCELLENT"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          AI Marker Intelligence Centre
        </h1>

        <p className="mt-2 text-gray-600">
          AI analysis of marker efficiency, nesting quality,
          fabric utilization and cutting optimization.
        </p>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="Markers"
          value={totalMarkers.toString()}
        />

        <Card
          title="Average Efficiency"
          value={`${averageEfficiency.toFixed(1)}%`}
        />

        <Card
          title="Average Waste"
          value={`${averageWaste.toFixed(1)}%`}
        />

        <Card
          title="Excellent"
          value={excellentMarkers.toString()}
        />

      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Marker Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI evaluates marker efficiency, nesting quality,
          end loss and waste percentage before cutting.
          Optimization recommendations are generated
          automatically.
        </p>

      </section>

      <div className="grid gap-6">

        {markerMaster.map((marker) => (

          <section
            key={marker.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-blue-700">
                  {marker.markerName}
                </h2>

                <p className="text-gray-600">
                  {marker.buyer} • {marker.style}
                </p>

              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass(
                  marker.status
                )}`}
              >
                {marker.status}
              </span>

            </div>

            <div className="grid gap-4 md:grid-cols-4">

              <Metric
                title="Efficiency"
                value={`${marker.efficiency}%`}
              />

              <Metric
                title="Waste"
                value={`${marker.fabricWastePercent}%`}
              />

              <Metric
                title="End Loss"
                value={`${marker.endLossPercent}%`}
              />

              <Metric
                title="Pieces"
                value={marker.garmentPieces.toString()}
              />

            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-2 text-gray-700">
                {marker.aiRecommendation}
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
      <p className="text-sm text-gray-500">
        {title}
      </p>

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
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="mt-1 font-bold">
        {value}
      </h3>
    </div>
  );
}