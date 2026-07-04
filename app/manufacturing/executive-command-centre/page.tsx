"use client";

import { useEffect, useState } from "react";

import {
  executiveCommandMaster,
} from "@/lib/manufacturing/executive-command-centre/executiveCommandMaster";

import {
  subscribeToExecutiveCommandFeed,
  LiveExecutiveCommand,
} from "../../../lib/manufacturing/executive/liveExecutiveCommandFeed";

function severityClass(severity: string) {
  if (severity === "LOW") return "bg-green-100 text-green-700";
  if (severity === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  if (severity === "HIGH") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export default function ExecutiveCommandCentrePage() {
  const [liveFeed, setLiveFeed] =
    useState<LiveExecutiveCommand[]>([]);

  useEffect(() => {
    const unsubscribe =
      subscribeToExecutiveCommandFeed((feed) => {
        setLiveFeed(feed);
      });

    return () => unsubscribe();
  }, []);

  const averageScore =
    executiveCommandMaster.reduce(
      (sum, item) => sum + item.score,
      0
    ) / executiveCommandMaster.length;

  const criticalAreas = executiveCommandMaster.filter(
    (item) => item.status === "CRITICAL"
  ).length;

  const watchAreas = executiveCommandMaster.filter(
    (item) => item.status === "WATCH"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Executive Manufacturing Command Centre
        </h1>

        <p className="mt-2 text-gray-600">
          One-screen executive view of factory health, production, quality,
          cutting, maintenance, shipment risk and AI decisions.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="AI Score" value={`${averageScore.toFixed(1)}%`} />
        <Card title="Critical Areas" value={criticalAreas.toString()} />
        <Card title="Watch Areas" value={watchAreas.toString()} />
        <Card title="Live Commands" value={liveFeed.length.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Executive Summary
        </h2>

        <p className="mt-3 text-gray-700">
          GPA is now listening to live executive command data from Firestore.
          Critical production, quality, cutting, maintenance and shipment
          decisions will appear here as soon as they are submitted.
        </p>
      </section>

      <div className="grid gap-6">
        {liveFeed.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            No live executive commands available.
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
                  {item.department}
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
              <Info title="Headline" value={item.headline} />
              <Info title="Recommendation" value={item.recommendation} />
              <Info
                title="Created"
                value={new Date(item.createdAt).toLocaleString()}
              />
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