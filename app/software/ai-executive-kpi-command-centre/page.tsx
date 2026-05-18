"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type KPIRecord = {
  title: string;
  value: number;
  unit: string;
  target: number;
  status: "Excellent" | "Good" | "Warning" | "Critical";
};

const demoKpis: KPIRecord[] = [
  {
    title: "Production Efficiency",
    value: 84,
    unit: "%",
    target: 90,
    status: "Warning",
  },
  {
    title: "Shipment OTIF",
    value: 91,
    unit: "%",
    target: 95,
    status: "Good",
  },
  {
    title: "Machine Uptime",
    value: 88,
    unit: "%",
    target: 93,
    status: "Warning",
  },
  {
    title: "Compliance Score",
    value: 96,
    unit: "%",
    target: 95,
    status: "Excellent",
  },
  {
    title: "Capacity Utilization",
    value: 81,
    unit: "%",
    target: 90,
    status: "Warning",
  },
  {
    title: "Profit Margin",
    value: 18,
    unit: "%",
    target: 22,
    status: "Good",
  },
  {
    title: "Utility Cost Control",
    value: 72,
    unit: "%",
    target: 90,
    status: "Critical",
  },
  {
    title: "Buyer Risk Stability",
    value: 87,
    unit: "%",
    target: 92,
    status: "Good",
  },
];

function getStatusColor(status: KPIRecord["status"]) {
  if (status === "Excellent") {
    return "text-green-300 bg-green-950/40 border-green-700/40";
  }

  if (status === "Good") {
    return "text-blue-300 bg-blue-950/40 border-blue-700/40";
  }

  if (status === "Warning") {
    return "text-yellow-300 bg-yellow-950/40 border-yellow-700/40";
  }

  return "text-red-300 bg-red-950/40 border-red-700/40";
}

function calculateFactoryHealth(records: KPIRecord[]) {
  if (records.length === 0) return 0;

  const score =
    records.reduce((sum, item) => {
      return sum + (item.value / item.target) * 100;
    }, 0) / records.length;

  return Math.round(score);
}

function getExecutiveAssessment(score: number) {
  if (score >= 100) {
    return "Excellent Factory Performance";
  }

  if (score >= 90) {
    return "Strong Operational Stability";
  }

  if (score >= 75) {
    return "Moderate Executive Risk";
  }

  return "Executive Intervention Required";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AIExecutiveKPICommandCenterPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadKPIData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Later replace with Firestore + AI engine feeds
        const data = demoKpis;

        if (active) {
          setKpis(data);
        }
      } catch (error) {
        console.error(
          "Failed to load executive KPI command center:",
          error
        );

        if (active) {
          setKpis([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadKPIData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const excellentCount = kpis.filter(
      (k) => k.status === "Excellent"
    ).length;

    const warningCount = kpis.filter(
      (k) => k.status === "Warning"
    ).length;

    const criticalCount = kpis.filter(
      (k) => k.status === "Critical"
    ).length;

    const factoryHealthScore =
      calculateFactoryHealth(kpis);

    return {
      excellentCount,
      warningCount,
      criticalCount,
      factoryHealthScore,
      assessment:
        getExecutiveAssessment(factoryHealthScore),
    };
  }, [kpis]);

  return (
    <DashboardShell title="AI Executive KPI Command Centre">
      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-cyan-700/40 bg-linear-to-r from-cyan-950 via-slate-950 to-black p-6 shadow-2xl">

            <p className="uppercase tracking-widest text-cyan-300 text-sm">
              Module 26 · AI Executive KPI Command Centre
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Executive Manufacturing Intelligence Control Panel
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-driven executive KPI monitoring system for
              factory directors, CEOs, COOs, investors, and
              leadership teams to monitor manufacturing health,
              profitability, efficiency, shipment reliability,
              compliance, utilities, manpower, and operational
              stability in real time.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading executive KPI intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">

  <a
    href="#factory-health-score"
    className="block rounded-2xl border border-cyan-700/30 bg-cyan-950/20 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
  >
    <p className="text-cyan-300 text-sm">
      Factory Health Score
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.factoryHealthScore}
    </h2>
  </a>

  <a
    href="#excellent-kpis"
    className="block rounded-2xl border border-green-700/30 bg-green-950/20 p-5 transition hover:-translate-y-1 hover:border-green-400/40"
  >
    <p className="text-green-300 text-sm">
      Excellent KPIs
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.excellentCount}
    </h2>
  </a>

  <a
    href="#warning-kpis"
    className="block rounded-2xl border border-yellow-700/30 bg-yellow-950/20 p-5 transition hover:-translate-y-1 hover:border-yellow-400/40"
  >
    <p className="text-yellow-300 text-sm">
      Warning KPIs
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.warningCount}
    </h2>
  </a>

  <a
    href="#critical-kpis"
    className="block rounded-2xl border border-red-700/30 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >
    <p className="text-red-300 text-sm">
      Critical KPIs
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.criticalCount}
    </h2>
  </a>

  <a
    href="#executive-assessment"
    className="block rounded-2xl border border-slate-700 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
  >
    <p className="text-slate-400 text-sm">
      Executive Assessment
    </p>

    <h2 className="text-xl font-bold mt-3">
      {intelligence.assessment}
    </h2>
  </a>

</section>

              <section className="rounded-2xl border border-cyan-700/30 bg-cyan-950/10 p-6">

                <p className="text-cyan-300 uppercase tracking-widest text-sm">
                  Executive AI Summary
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  Real-Time Manufacturing Leadership Visibility
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates manufacturing
                  performance indicators across production,
                  shipment, compliance, utilities, manpower,
                  profitability, machine utilization, and
                  operational risk exposure to support
                  executive decision-making.
                </p>

              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-5">

  {kpis.map((kpi) => (
    <a
      key={kpi.title}
      href={`#${slugify(kpi.title)}`}
      className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400/40 ${getStatusColor(
        kpi.status
      )}`}
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm opacity-80">
            KPI Indicator
          </p>

          <h3 className="text-2xl font-bold mt-1">
            {kpi.title}
          </h3>
        </div>

        <span className="text-sm font-semibold">
          {kpi.status}
        </span>

      </div>

      <div className="mt-6 flex items-end justify-between">

        <div>
          <p className="text-sm opacity-80">
            Current
          </p>

          <h2 className="text-5xl font-bold">
            {kpi.value}
            {kpi.unit}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-80">
            Target
          </p>

          <p className="text-2xl font-semibold">
            {kpi.target}
            {kpi.unit}
          </p>
        </div>

      </div>

      <div className="mt-6">
        <div className="h-3 w-full rounded-full bg-black/30 overflow-hidden">

          <div
            className="h-full rounded-full bg-white"
            style={{
              width: `${Math.min(
                (kpi.value / kpi.target) * 100,
                100
              )}%`,
            }}
          />

        </div>
      </div>

    </a>
  ))}

</section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Executive KPI Intelligence Table
                  </h2>
                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">
                          KPI
                        </th>

                        <th className="text-left p-4">
                          Current
                        </th>

                        <th className="text-left p-4">
                          Target
                        </th>

                        <th className="text-left p-4">
                          Achievement
                        </th>

                        <th className="text-left p-4">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>

  {kpis.map((kpi) => {
    const achievement = Math.round(
      (kpi.value / kpi.target) * 100
    );

    return (
      <tr
        key={kpi.title}
        id={slugify(kpi.title)}
        className="border-b border-slate-800 transition hover:bg-cyan-900/20"
      >
        <td className="p-4 font-medium">
          <a
            href={`#${slugify(kpi.title)}`}
            className="text-cyan-300 underline hover:text-cyan-200"
          >
            {kpi.title}
          </a>
        </td>

        <td className="p-4">
          {kpi.value}
          {kpi.unit}
        </td>

        <td className="p-4">
          {kpi.target}
          {kpi.unit}
        </td>

        <td className="p-4">
          {achievement}%
        </td>

        <td className="p-4">
          {kpi.status}
        </td>
      </tr>
    );
  })}

</tbody>

                  </table>

                </div>

              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}