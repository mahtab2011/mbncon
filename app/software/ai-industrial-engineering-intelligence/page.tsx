"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type IERecord = {
  id: string;
  productionLine: string;
  product: string;
  smvTarget: number;
  actualSmv: number;
  lineEfficiency: number;
  idleTimeMinutes: number;
  bottleneckOperation: string;
  manpowerUtilization: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoIEData: IERecord[] = [
  {
    id: "IEI-001",
    productionLine: "Line 4",
    product: "Ladies Top",
    smvTarget: 18,
    actualSmv: 24,
    lineEfficiency: 68,
    idleTimeMinutes: 95,
    bottleneckOperation: "Sleeve Attach",
    manpowerUtilization: 72,
    riskLevel: "Critical",
  },
  {
    id: "IEI-002",
    productionLine: "Line 2",
    product: "Kids Hoodie",
    smvTarget: 22,
    actualSmv: 23,
    lineEfficiency: 88,
    idleTimeMinutes: 28,
    bottleneckOperation: "Neck Rib",
    manpowerUtilization: 91,
    riskLevel: "Low",
  },
  {
    id: "IEI-003",
    productionLine: "Line 7",
    product: "Mens Polo",
    smvTarget: 20,
    actualSmv: 25,
    lineEfficiency: 74,
    idleTimeMinutes: 62,
    bottleneckOperation: "Placket Join",
    manpowerUtilization: 79,
    riskLevel: "High",
  },
  {
    id: "IEI-004",
    productionLine: "Line 1",
    product: "Denim Jacket",
    smvTarget: 35,
    actualSmv: 38,
    lineEfficiency: 82,
    idleTimeMinutes: 40,
    bottleneckOperation: "Pocket Attach",
    manpowerUtilization: 86,
    riskLevel: "Medium",
  },
];

function getRiskColor(risk: IERecord["riskLevel"]) {
  if (risk === "Critical") {
    return "text-red-300 border-red-700/40 bg-red-950/20";
  }

  if (risk === "High") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  if (risk === "Medium") {
    return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
  }

  return "text-green-300 border-green-700/40 bg-green-950/20";
}

function getIEAssessment(critical: number, high: number) {
  if (critical >= 1) {
    return "Critical Production Flow Instability";
  }

  if (high >= 2) {
    return "High Industrial Engineering Exposure";
  }

  if (high >= 1) {
    return "Moderate Process Optimisation Opportunity";
  }

  return "Industrial Engineering Environment Stable";
}

function getRecommendation(record: IERecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate industrial engineering intervention required. Rebalance manpower, optimize bottleneck operation, and stabilize production flow.";
  }

  if (record.lineEfficiency < 75) {
    return "AI recommends line balancing and operation flow optimization.";
  }

  if (record.idleTimeMinutes > 60) {
    return "High idle time detected. Review process sequencing and manpower coordination.";
  }

  return "Production flow currently manageable with operational monitoring.";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AIIndustrialEngineeringIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<IERecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadIEData() {
      try {
        setLoading(true);

        const data = demoIEData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load industrial engineering intelligence:",
          error
        );

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadIEData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const criticalRisks = records.filter(
      (r) => r.riskLevel === "Critical"
    ).length;

    const highRisks = records.filter(
      (r) => r.riskLevel === "Critical" || r.riskLevel === "High"
    ).length;

    const averageEfficiency =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce((sum, r) => sum + r.lineEfficiency, 0) /
              records.length
          );

    const totalIdleTime = records.reduce(
      (sum, r) => sum + r.idleTimeMinutes,
      0
    );

    return {
      criticalRisks,
      highRisks,
      averageEfficiency,
      totalIdleTime,
      assessment: getIEAssessment(criticalRisks, highRisks),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Industrial Engineering Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl border border-teal-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-teal-300 uppercase tracking-widest text-sm">
              Module 35 · AI Industrial Engineering Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Production Flow & Industrial Engineering Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered industrial engineering system for detecting
              bottlenecks, production flow instability, manpower imbalance, SMV
              inefficiency, idle time exposure, and operational throughput
              optimization opportunities before production loss occurs.
            </p>
          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading industrial engineering intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a
                  href="#critical-flow-risks"
                  className="block rounded-2xl border border-red-700/40 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
                >
                  <p className="text-red-300 text-sm">
                    Critical Flow Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalRisks}
                  </h2>
                </a>

                <a
                  href="#high-process-risks"
                  className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
                >
                  <p className="text-orange-300 text-sm">
                    High Process Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRisks}
                  </h2>
                </a>

                <a
                  href="#average-line-efficiency"
                  className="block rounded-2xl border border-teal-700/40 bg-teal-950/20 p-5 transition hover:-translate-y-1 hover:border-teal-400/40"
                >
                  <p className="text-teal-300 text-sm">
                    Avg Line Efficiency
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageEfficiency}%
                  </h2>
                </a>

                <a
                  href="#total-idle-time"
                  className="block rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5 transition hover:-translate-y-1 hover:border-yellow-400/40"
                >
                  <p className="text-yellow-300 text-sm">
                    Total Idle Time
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.totalIdleTime}
                  </h2>

                  <p className="text-xs mt-1">Minutes</p>
                </a>
              </section>

              <section className="rounded-2xl border border-teal-700/40 bg-teal-950/10 p-6">
                <p className="text-teal-300 uppercase tracking-widest text-sm">
                  Executive IE Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates production flow behaviour,
                  operation balancing, manpower utilization, idle time, and
                  bottleneck instability to optimize throughput and factory
                  efficiency.
                </p>
              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Industrial Engineering Intelligence Feed
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">Line</th>
                        <th className="text-left p-4">Product</th>
                        <th className="text-left p-4">SMV Target</th>
                        <th className="text-left p-4">Actual SMV</th>
                        <th className="text-left p-4">Efficiency</th>
                        <th className="text-left p-4">Idle Time</th>
                        <th className="text-left p-4">Bottleneck</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          id={slugify(`${record.productionLine}-${record.product}`)}
                          className="border-b border-slate-800 transition hover:bg-teal-900/20"
                        >
                          <td className="p-4">
                            <a
                              href={`#${slugify(
                                `${record.productionLine}-${record.product}`
                              )}`}
                              className="text-cyan-300 underline hover:text-cyan-200"
                            >
                              {record.productionLine}
                            </a>
                          </td>

                          <td className="p-4">{record.product}</td>
                          <td className="p-4">{record.smvTarget}</td>

                          <td className="p-4 text-orange-300">
                            {record.actualSmv}
                          </td>

                          <td className="p-4 text-teal-300">
                            {record.lineEfficiency}%
                          </td>

                          <td className="p-4 text-yellow-300">
                            {record.idleTimeMinutes} min
                          </td>

                          <td className="p-4">
                            {record.bottleneckOperation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <a
                    key={record.id}
                    href={`#${slugify(`${record.productionLine}-${record.product}`)}`}
                    className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-teal-400/40 ${getRiskColor(
                      record.riskLevel
                    )}`}
                  >
                    <p className="text-sm opacity-80">
                      {record.productionLine}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {record.product}
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">
                      <span>Efficiency: {record.lineEfficiency}%</span>
                      <span>Idle: {record.idleTimeMinutes} min</span>
                    </div>
                  </a>
                ))}
              </section>

              <section className="space-y-5">
                {records.map((record) => (
                  <section
                    key={record.id}
                    id={slugify(`${record.productionLine}-${record.product}`)}
                    className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-widest text-teal-300">
                          {record.productionLine} · {record.id}
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                          {record.product}
                        </h2>
                      </div>

                      <div
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskColor(
                          record.riskLevel
                        )}`}
                      >
                        {record.riskLevel} Risk
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <div className="rounded-xl bg-slate-950/70 p-4">
                        <p className="text-sm text-slate-400">
                          SMV Target
                        </p>
                        <p className="mt-2 font-semibold">
                          {record.smvTarget}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">
                        <p className="text-sm text-slate-400">Actual SMV</p>
                        <p className="mt-2 font-semibold text-orange-300">
                          {record.actualSmv}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">
                        <p className="text-sm text-slate-400">
                          Line Efficiency
                        </p>
                        <p className="mt-2 font-semibold text-teal-300">
                          {record.lineEfficiency}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">
                        <p className="text-sm text-slate-400">
                          Idle Time
                        </p>
                        <p className="mt-2 font-semibold text-yellow-300">
                          {record.idleTimeMinutes} min
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-5">
                        <p className="text-xs uppercase tracking-widest text-teal-300">
                          Bottleneck Operation
                        </p>

                        <p className="mt-3 text-slate-200">
                          {record.bottleneckOperation}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-5">
                        <p className="text-xs uppercase tracking-widest text-cyan-300">
                          Manpower Utilization
                        </p>

                        <p className="mt-3 text-slate-200">
                          {record.manpowerUtilization}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-teal-700/30 bg-teal-950/20 p-5">
                      <p className="text-sm uppercase tracking-widest text-teal-300">
                        AI Recommendation
                      </p>

                      <p className="mt-3 text-slate-200">
                        {getRecommendation(record)}
                      </p>
                    </div>
                  </section>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}