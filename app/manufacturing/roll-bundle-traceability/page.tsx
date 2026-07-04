"use client";

import {
  rollBundleMaster,
} from "@/lib/manufacturing/roll-bundle-traceability/rollBundleMaster";

function statusClass(status: string) {
  if (status === "COMPLETED") return "bg-green-100 text-green-700";
  if (status === "SEWING") return "bg-blue-100 text-blue-700";
  if (status === "ISSUED") return "bg-purple-100 text-purple-700";
  if (status === "READY") return "bg-yellow-100 text-yellow-700";
  return "bg-orange-100 text-orange-700";
}

function riskClass(risk: string) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function RollBundleTraceabilityPage() {
  const totalBundles = rollBundleMaster.length;

  const issuedBundles = rollBundleMaster.filter(
    (item) => item.status === "ISSUED"
  ).length;

  const sewingBundles = rollBundleMaster.filter(
    (item) => item.status === "SEWING"
  ).length;

  const highRiskBundles = rollBundleMaster.filter(
    (item) => item.aiRisk === "HIGH"
  ).length;

  const totalPlannedPieces = rollBundleMaster.reduce(
    (sum, item) => sum + item.plannedPieces,
    0
  );

  const totalCutPieces = rollBundleMaster.reduce(
    (sum, item) => sum + item.cutPieces,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Roll & Bundle Traceability
        </h1>

        <p className="mt-2 text-gray-600">
          Tracks every roll from lot and shade group through lay, marker,
          bundle and sewing line.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-6">
        <Card title="Bundles" value={totalBundles.toString()} />
        <Card title="Issued" value={issuedBundles.toString()} />
        <Card title="In Sewing" value={sewingBundles.toString()} />
        <Card title="High Risk" value={highRiskBundles.toString()} />
        <Card title="Planned Pcs" value={totalPlannedPieces.toLocaleString()} />
        <Card title="Cut Pcs" value={totalCutPieces.toLocaleString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Traceability Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI monitors roll-to-bundle traceability to prevent shade mixing,
          missing pieces, bundle loss and sewing line mismatch. High-risk
          bundles should be investigated before issue to sewing.
        </p>
      </section>

      <div className="grid gap-6">
        {rollBundleMaster.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.bundleNo} — {item.style}
                </h2>

                <p className="text-gray-600">
                  Roll {item.rollNo} · Lot {item.lotNo} · Shade{" "}
                  {item.shadeGroup}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(
                    item.aiRisk
                  )}`}
                >
                  {item.aiRisk} RISK
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Metric title="Lay No" value={item.layNo} />
              <Metric title="Marker No" value={item.markerNo} />
              <Metric title="Color" value={item.color} />
              <Metric title="Size" value={item.size} />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <Metric title="Planned" value={item.plannedPieces.toString()} />
              <Metric title="Cut" value={item.cutPieces.toString()} />
              <Metric title="Variance" value={`${item.cutPieces - item.plannedPieces}`} />
              <Metric title="Sewing Line" value={item.sewingLine} />
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