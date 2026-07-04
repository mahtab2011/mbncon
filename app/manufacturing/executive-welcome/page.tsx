"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getLiveExecutiveSummary,
  type LiveExecutiveSummary,
} from "@/lib/manufacturing/live/getLiveExecutiveSummary";

const quickLinks = [
  {
    title: "Global Executive Dashboard",
    href: "/manufacturing/global-executive-dashboard",
  },
  {
    title: "Executive Command Centre",
    href: "/manufacturing/executive-command-centre",
  },
  {
    title: "Pilot Navigation Hub",
    href: "/manufacturing/pilot-navigation-hub",
  },
  {
    title: "Fabric Optimizer",
    href: "/manufacturing/fabric-optimizer",
  },
];

function statusClass(status: string) {
  if (status === "GOOD") return "bg-green-100 text-green-700";
  if (status === "WATCH") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function getStatus(value: number) {
  if (value >= 88) return "GOOD";
  if (value >= 80) return "WATCH";
  return "CRITICAL";
}

export default function ExecutiveWelcomePage() {
  const [summary, setSummary] =
    useState<LiveExecutiveSummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      const data = await getLiveExecutiveSummary();
      setSummary(data);
    }

    loadSummary();
  }, []);

  const kpis = summary
    ? [
        {
          title: "Factory Health",
          value: `${summary.factoryHealth}%`,
          status: getStatus(summary.factoryHealth),
        },
        {
          title: "Production Efficiency",
          value: `${summary.productionEfficiency}%`,
          status: getStatus(summary.productionEfficiency),
        },
        {
          title: "Quality Score",
          value: `${summary.qualityScore}%`,
          status: getStatus(summary.qualityScore),
        },
        {
          title: "Cutting Score",
          value: `${summary.cuttingScore}%`,
          status: getStatus(summary.cuttingScore),
        },
        {
          title: "Shipment Readiness",
          value: `${summary.shipmentReadiness}%`,
          status: getStatus(summary.shipmentReadiness),
        },
        {
          title: "AI Alerts",
          value: summary.criticalAlerts.toString(),
          status:
            summary.criticalAlerts > 0 ? "CRITICAL" : "GOOD",
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mb-8 rounded-2xl bg-blue-700 p-8 text-white shadow">
        <h1 className="text-4xl font-bold">
          Good Morning, Executive Team
        </h1>

        <p className="mt-3 text-blue-100">
          GPA is monitoring production, cutting, quality, maintenance,
          shipment readiness and AI risks for today&apos;s factory operation.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/manufacturing/global-executive-dashboard"
            className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700"
          >
            Open Executive Dashboard
          </Link>

          <Link
            href="/manufacturing/pilot-navigation-hub"
            className="rounded-lg bg-blue-900 px-5 py-3 font-semibold text-white"
          >
            Start BGMEA Demo
          </Link>
        </div>
      </section>

      <div className="mb-8 grid gap-6 md:grid-cols-3 xl:grid-cols-6">
        {summary ? (
          kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="rounded-xl bg-white p-5 shadow"
            >
              <p className="text-sm text-gray-500">{kpi.title}</p>

              <h2 className="mt-2 text-3xl font-bold text-blue-700">
                {kpi.value}
              </h2>

              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                  kpi.status
                )}`}
              >
                {kpi.status}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-white p-5 shadow">
            Loading executive summary...
          </div>
        )}
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Morning Brief
        </h2>

        <p className="mt-3 text-gray-700">
          {summary
            ? summary.aiSummary
            : "Loading AI executive brief..."}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-blue-700">
              {link.title}
            </h2>

            <p className="mt-4 font-semibold text-blue-600">
              Open →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}