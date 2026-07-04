"use client";

import { useEffect, useState } from "react";

import {
  subscribeToLiveFabricInspection,
  LiveFabricInspection,
} from "../../../lib/manufacturing/fabric-inspection/liveFabricInspectionFeed";

function severityClass(severity: string) {
  if (severity === "LOW") return "bg-green-100 text-green-700";
  if (severity === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  if (severity === "HIGH") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function FabricInspectionPage() {
  const [liveInspection, setLiveInspection] =
    useState<LiveFabricInspection[]>([]);

  useEffect(() => {
    const unsubscribe =
      subscribeToLiveFabricInspection((inspection) => {
        setLiveInspection(inspection);
      });

    return () => unsubscribe();
  }, []);

  const totalRolls = liveInspection.length;

  const criticalRolls =
    liveInspection.filter(
      (item) => item.severity === "CRITICAL"
    ).length;

  const highRiskRolls =
    liveInspection.filter(
      (item) => item.severity === "HIGH"
    ).length;

  const avgPassRate =
    liveInspection.length > 0
      ? liveInspection.reduce(
          (sum, item) => sum + item.passRate,
          0
        ) / liveInspection.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Fabric Inspection Centre
        </h1>

        <p className="mt-2 text-gray-600">
          Live AI-assisted four-point inspection, shade grouping,
          defect intelligence and cutting suitability.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Live Rolls" value={totalRolls.toString()} />
        <Card title="Avg Pass Rate" value={`${avgPassRate.toFixed(1)}%`} />
        <Card title="High Risk" value={highRiskRolls.toString()} />
        <Card title="Critical Rolls" value={criticalRolls.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Inspection Summary
        </h2>

        <p className="mt-3 text-gray-700">
          GPA is now listening to live fabric inspection data from Firestore.
          Roll quality, GSM, shade variation, supplier risk, defect count and
          AI recommendations will update automatically.
        </p>
      </section>

      <div className="grid gap-6">
        {liveInspection.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            No live fabric inspections available.
          </div>
        )}

        {liveInspection.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.rollNo}
                </h2>

                <p className="text-gray-600">
                  {item.factory} · {item.fabric} · Supplier: {item.supplier}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${severityClass(
                  item.severity
                )}`}
              >
                {item.severity}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Metric title="GSM" value={item.gsm.toString()} />
              <Metric title="Shade" value={item.shade} />
              <Metric title="Defects" value={item.defects.toString()} />
              <Metric title="Pass Rate" value={`${item.passRate}%`} />
            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-2 text-gray-700">
                {item.recommendation}
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