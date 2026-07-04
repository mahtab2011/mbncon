"use client";

import { useEffect, useState } from "react";

import {
  globalExecutiveMaster,
} from "@/lib/manufacturing/global-executive-dashboard/globalExecutiveMaster";

import {
  subscribeToLiveExecutiveSummary,
  LiveExecutiveSummary,
} from "../../../lib/gpa/liveExecutiveSummary";

function statusClass(status: string) {
  if (status === "GOOD") return "bg-green-100 text-green-700";
  if (status === "WATCH") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function GlobalExecutiveDashboardPage() {
  const [summary, setSummary] =
    useState<LiveExecutiveSummary>({
      factories: 0,
      production: 0,
      efficiency: 0,
      quality: 0,
      criticalAlerts: 0,
    });

 useEffect(() => {
  const unsubscribe =
    subscribeToLiveExecutiveSummary(
      (summary) => {
        setSummary(summary);
      }
    );

  return () => unsubscribe();
}, []);

  const averageScore =
    globalExecutiveMaster.reduce(
      (sum, item) => sum + item.score,
      0
    ) / globalExecutiveMaster.length;

  const criticalCount = globalExecutiveMaster.filter(
    (item) => item.status === "CRITICAL"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Global Executive Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Enterprise-wide AI manufacturing intelligence for executives,
          factory directors and BGMEA leadership.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Live Factories" value={summary.factories.toString()} />
        <Card title="Production Today" value={summary.production.toString()} />
        <Card title="Avg Efficiency" value={`${summary.efficiency}%`} />
        <Card title="Critical Alerts" value={summary.criticalAlerts.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Executive AI Summary
        </h2>

        <p className="mt-4 text-gray-700">
          GPA is now connected to live Firestore executive data.
          Current average quality score is {summary.quality}%,
          average efficiency is {summary.efficiency}%,
          and total critical alerts are {summary.criticalAlerts}.
        </p>
      </section>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card title="Prototype AI Score" value={`${averageScore.toFixed(1)}%`} />
        <Card title="Prototype Critical Areas" value={criticalCount.toString()} />
      </div>

      <div className="grid gap-6">
        {globalExecutiveMaster.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.area}
                </h2>

                <p className="text-gray-600">
                  {item.headline}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Metric title="AI Score" value={`${item.score}%`} />
              <Info title="AI Insight" value={item.aiInsight} />
              <Info title="Executive Action" value={item.nextAction} />
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
      <p className="text-sm font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-gray-700">
        {value}
      </p>
    </div>
  );
}