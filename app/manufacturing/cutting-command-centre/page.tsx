"use client";

import { useEffect, useState } from "react";

import {
  subscribeToLiveCuttingFeed,
  LiveCuttingCommand,
} from "../../../lib/manufacturing/cutting-command-centre/liveCuttingFeed";

function severityClass(severity: string) {
  if (severity === "LOW") return "bg-green-100 text-green-700";
  if (severity === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  if (severity === "HIGH") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function CuttingCommandCentrePage() {
  const [liveFeed, setLiveFeed] =
    useState<LiveCuttingCommand[]>([]);

  useEffect(() => {
    const unsubscribe =
      subscribeToLiveCuttingFeed((feed) => {
        setLiveFeed(feed);
      });

    return () => unsubscribe();
  }, []);

  const avgEfficiency =
    liveFeed.length > 0
      ? liveFeed.reduce((sum, item) => sum + item.efficiency, 0) /
        liveFeed.length
      : 0;

  const totalBundlesPending =
    liveFeed.reduce(
      (sum, item) => sum + item.bundlesPending,
      0
    );

  const criticalAlerts =
    liveFeed.filter(
      (item) => item.severity === "CRITICAL"
    ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Cutting Command Centre
        </h1>

        <p className="mt-2 text-gray-600">
          Live cutting room intelligence for roll status, marker efficiency,
          fabric utilization, bundle readiness and AI cutting alerts.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Live Cutting Lines" value={liveFeed.length.toString()} />
        <Card title="Avg Efficiency" value={`${avgEfficiency.toFixed(1)}%`} />
        <Card title="Bundles Pending" value={totalBundlesPending.toString()} />
        <Card title="Critical Alerts" value={criticalAlerts.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Cutting Summary
        </h2>

        <p className="mt-3 text-gray-700">
          GPA is now listening to live cutting command data from Firestore.
          Cutting line efficiency, marker issues, pending bundles and AI
          recommendations will update automatically as factory data changes.
        </p>
      </section>

      <div className="grid gap-6">
        {liveFeed.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            No live cutting commands available.
          </div>
        )}

        {liveFeed.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.factory}
                </h2>

                <p className="text-gray-600">
                  Line: {item.line} | Marker: {item.marker}
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

            <div className="grid gap-4 md:grid-cols-3">
              <Metric title="Efficiency" value={`${item.efficiency}%`} />
              <Metric
                title="Bundles Pending"
                value={item.bundlesPending.toString()}
              />
              <Info
                title="AI Recommendation"
                value={item.recommendation}
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 font-bold">{value}</h3>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="mt-2 text-gray-700">{value}</p>
    </div>
  );
}