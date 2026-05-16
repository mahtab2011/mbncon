"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type HealthArea = {
  id: string;
  area: string;
  score: number;
  weight: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  finding: string;
  recommendation: string;
};

const demoHealthData: HealthArea[] = [
  {
    id: "FH-001",
    area: "Production",
    score: 76,
    weight: 20,
    risk: "Medium",
    finding: "Production output is acceptable but bottleneck risk remains.",
    recommendation: "Review line balancing and daily recovery actions.",
  },
  {
    id: "FH-002",
    area: "Quality",
    score: 68,
    weight: 18,
    risk: "High",
    finding: "Quality variation and rework exposure are affecting stability.",
    recommendation: "Strengthen inline inspection and root cause review.",
  },
  {
    id: "FH-003",
    area: "Delivery",
    score: 72,
    weight: 15,
    risk: "Medium",
    finding: "Shipment timeline is under moderate pressure.",
    recommendation: "Monitor buyer deadlines and shipment recovery actions.",
  },
  {
    id: "FH-004",
    area: "Workforce",
    score: 81,
    weight: 12,
    risk: "Low",
    finding: "Workforce availability is broadly stable.",
    recommendation: "Continue attendance monitoring and skill matrix review.",
  },
  {
    id: "FH-005",
    area: "Cost & Profitability",
    score: 64,
    weight: 15,
    risk: "High",
    finding: "Profit leakage exists through rework, overtime, and wastage.",
    recommendation: "Review costing, overtime, wastage, and recovery controls.",
  },
  {
    id: "FH-006",
    area: "Compliance",
    score: 78,
    weight: 10,
    risk: "Medium",
    finding: "Compliance system is functioning with some audit follow-up actions.",
    recommendation: "Close CAPA actions before due date with evidence.",
  },
  {
    id: "FH-007",
    area: "Utilities & Maintenance",
    score: 70,
    weight: 10,
    risk: "Medium",
    finding: "Utility cost and machine downtime require continued attention.",
    recommendation: "Track energy use, generator cost, and preventive maintenance.",
  },
];

function getRiskStyle(risk: HealthArea["risk"]) {
  if (risk === "Critical") {
    return "border-red-700/40 bg-red-950/20 text-red-300";
  }

  if (risk === "High") {
    return "border-orange-700/40 bg-orange-950/20 text-orange-300";
  }

  if (risk === "Medium") {
    return "border-yellow-700/40 bg-yellow-950/20 text-yellow-300";
  }

  return "border-green-700/40 bg-green-950/20 text-green-300";
}

function getFactoryStatus(score: number) {
  if (score >= 85) return "Strong Factory Health";
  if (score >= 75) return "Stable but Needs Monitoring";
  if (score >= 65) return "Moderate Risk Factory";
  if (score >= 50) return "High Recovery Required";
  return "Critical Factory Intervention Required";
}

function getExecutiveSummary(score: number, highRiskAreas: number) {
  if (score < 60 || highRiskAreas >= 3) {
    return "Factory health requires immediate executive intervention. Multiple operating areas are creating risk to production, quality, delivery, and profitability.";
  }

  if (score < 75 || highRiskAreas >= 1) {
    return "Factory health is acceptable but not yet strong. Management should focus on high-risk areas, cost leakage, quality discipline, and delivery recovery.";
  }

  return "Factory health is stable. Leadership should continue daily monitoring, preventive action, and continuous improvement discipline.";
}

export default function AIFactoryHealthScoreEnginePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<HealthArea[]>([]);

  useEffect(() => {
    let active = true;

    async function loadFactoryHealthData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore integration can combine:
        // productionLogs, qualityEntries, manpowerLogs,
        // shipmentSchedules, utilityLogs, maintenanceLogs,
        // complianceAuditRecords, costingProfitabilityEntries.
        const data = demoHealthData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load factory health score data:", error);

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFactoryHealthData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalWeight = records.reduce((sum, r) => sum + r.weight, 0);

    const weightedScore =
      totalWeight === 0
        ? 0
        : Math.round(
            records.reduce((sum, r) => {
              return sum + r.score * r.weight;
            }, 0) / totalWeight
          );

    const highRiskAreas = records.filter(
      (r) => r.risk === "High" || r.risk === "Critical"
    ).length;

    const lowestArea = records.length
      ? [...records].sort((a, b) => a.score - b.score)[0]
      : null;

    return {
      weightedScore,
      highRiskAreas,
      lowestArea,
      status: getFactoryStatus(weightedScore),
      summary: getExecutiveSummary(weightedScore, highRiskAreas),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Factory Health Score Engine">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm">
              Module 101 · AI Factory Health Score Engine
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Unified Factory Health Score
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              A single factory health score combining production, quality,
              delivery, workforce, cost, compliance, utilities, and maintenance
              performance into one executive intelligence view.
            </p>
          </section>

          {loading ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading factory health intelligence...
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6 md:col-span-2">
                  <p className="text-cyan-300 text-sm uppercase tracking-widest">
                    Overall Factory Health Score
                  </p>

                  <h2 className="text-7xl font-bold mt-4">
                    {intelligence.weightedScore}
                    <span className="text-3xl text-slate-400">/100</span>
                  </h2>

                  <p className="text-slate-300 mt-4">
                    {intelligence.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/10 p-6">
                  <p className="text-orange-300 text-sm uppercase tracking-widest">
                    High Risk Areas
                  </p>

                  <h2 className="text-6xl font-bold mt-5">
                    {intelligence.highRiskAreas}
                  </h2>
                </div>

                <div className="rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-6">
                  <p className="text-fuchsia-300 text-sm uppercase tracking-widest">
                    Weakest Area
                  </p>

                  <h2 className="text-3xl font-bold mt-5">
                    {intelligence.lowestArea?.area || "N/A"}
                  </h2>
                </div>
              </section>

              <section className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6">
                <p className="text-cyan-300 uppercase tracking-widest text-sm">
                  Executive Factory Health Summary
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.status}
                </h2>

                <p className="text-slate-300 mt-4">
                  {intelligence.summary}
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className={`rounded-2xl border p-5 ${getRiskStyle(
                      record.risk
                    )}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm opacity-80">{record.id}</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {record.area}
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="text-sm opacity-80">Score</p>
                        <p className="text-3xl font-bold">{record.score}</p>
                      </div>
                    </div>

                    <div className="mt-5 h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-current"
                        style={{ width: `${record.score}%` }}
                      />
                    </div>

                    <p className="mt-5 text-slate-200">
                      {record.finding}
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-widest opacity-70">
                        AI Recommendation
                      </p>
                      <p className="text-sm text-slate-200 mt-2">
                        {record.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}