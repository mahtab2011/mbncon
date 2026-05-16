"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

import {
  getProductionLogs,
  getWastageLogs,
  getMaintenanceLogs,
  getFactoryLossIntelligenceEntries,
  getPostOrderIntelligenceEntries,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type HeatmapDepartment = {
  department: string;
  riskScore: number;
  financialExposure: number;
  operationalSeverity: "Low" | "Medium" | "High" | "Critical";
  color: string;
  warning: string;
  recommendation: string;
};

function numberValue(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getSeverity(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getColor(score: number): string {
  if (score >= 80) return "bg-red-600";
  if (score >= 60) return "bg-orange-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-emerald-500";
}

function generateHeatmap(
  productionLogs: RecordType[],
  wastageLogs: RecordType[],
  maintenanceLogs: RecordType[],
  factoryLossEntries: RecordType[],
  postOrderEntries: RecordType[]
): HeatmapDepartment[] {
  const totalProductionLoss = productionLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const totalWastageLoss = wastageLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
    0
  );

  const totalDowntime = maintenanceLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const totalRepairCost = maintenanceLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.repairCost || item.maintenanceCost),
    0
  );

  const totalFactoryLoss = factoryLossEntries.reduce(
    (sum, item) =>
      sum +
      numberValue(item.lossAmount || item.financialImpact),
    0
  );

  const recoveryGap = postOrderEntries.reduce(
    (sum, item) =>
      sum +
      numberValue(item.unrecoveredAmount || item.balanceLoss),
    0
  );

  const departments: HeatmapDepartment[] = [
    {
      department: "Production",
      riskScore: Math.min(
        100,
        Math.round(totalProductionLoss / 1000 + totalDowntime * 2)
      ),
      financialExposure: Math.round(totalProductionLoss),
      operationalSeverity: getSeverity(
        totalProductionLoss / 1000 + totalDowntime * 2
      ),
      color: getColor(
        totalProductionLoss / 1000 + totalDowntime * 2
      ),
      warning:
        totalProductionLoss > 0
          ? "Production instability may affect shipment deadlines."
          : "Production flow currently appears stable.",
      recommendation:
        "Review line balancing, manpower allocation, bottlenecks, and production planning.",
    },

    {
      department: "Quality / Wastage",
      riskScore: Math.min(
        100,
        Math.round(totalWastageLoss / 800)
      ),
      financialExposure: Math.round(totalWastageLoss),
      operationalSeverity: getSeverity(totalWastageLoss / 800),
      color: getColor(totalWastageLoss / 800),
      warning:
        totalWastageLoss > 0
          ? "Wastage trends indicate possible process control weakness."
          : "Quality loss currently controlled.",
      recommendation:
        "Strengthen inline quality inspection, rejection analysis, and operator discipline.",
    },

    {
      department: "Maintenance",
      riskScore: Math.min(
        100,
        Math.round(totalDowntime * 4 + totalRepairCost / 5000)
      ),
      financialExposure: Math.round(totalRepairCost),
      operationalSeverity: getSeverity(
        totalDowntime * 4 + totalRepairCost / 5000
      ),
      color: getColor(
        totalDowntime * 4 + totalRepairCost / 5000
      ),
      warning:
        totalDowntime > 0
          ? "Machine downtime risk may interrupt production continuity."
          : "Machine stability currently acceptable.",
      recommendation:
        "Increase preventive maintenance frequency and monitor high-breakdown machines.",
    },

    {
      department: "Commercial Recovery",
      riskScore: Math.min(
        100,
        Math.round((totalFactoryLoss + recoveryGap) / 2000)
      ),
      financialExposure: Math.round(
        totalFactoryLoss + recoveryGap
      ),
      operationalSeverity: getSeverity(
        (totalFactoryLoss + recoveryGap) / 2000
      ),
      color: getColor(
        (totalFactoryLoss + recoveryGap) / 2000
      ),
      warning:
        recoveryGap > 0
          ? "Financial recovery gap may reduce company profitability."
          : "Recovery position currently manageable.",
      recommendation:
        "Accelerate buyer negotiation, claim recovery, and financial escalation tracking.",
    },
  ];

  return departments.sort((a, b) => b.riskScore - a.riskScore);
}

export default function DepartmentRiskHeatmapPage() {
  const [loading, setLoading] = useState(true);

  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [factoryLossEntries, setFactoryLossEntries] = useState<RecordType[]>([]);
  const [postOrderEntries, setPostOrderEntries] = useState<RecordType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const safeFetch = async (fn: () => Promise<any>) => {
  try {
    return await Promise.race([
      fn(),
      new Promise((resolve) =>
        setTimeout(() => resolve([]), 3000)
      ),
    ]);
  } catch {
    return [];
  }
};

const production = await safeFetch(() =>
  getProductionLogs("demo-factory")
);

const wastage = await safeFetch(() =>
  getWastageLogs("demo-factory")
);

const maintenance = await safeFetch(() =>
  getMaintenanceLogs("demo-factory")
);

const factoryLoss = await safeFetch(() =>
  getFactoryLossIntelligenceEntries("demo-factory")
);

const postOrder = await safeFetch(() =>
  getPostOrderIntelligenceEntries("demo-factory")
);

        setProductionLogs(production || []);
        setWastageLogs(wastage || []);
        setMaintenanceLogs(maintenance || []);
        setFactoryLossEntries(factoryLoss || []);
        setPostOrderEntries(postOrder || []);
      } catch (error) {
        console.error("Risk heatmap loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const heatmap = useMemo(
    () =>
      generateHeatmap(
        productionLogs,
        wastageLogs,
        maintenanceLogs,
        factoryLossEntries,
        postOrderEntries
      ),
    [
      productionLogs,
      wastageLogs,
      maintenanceLogs,
      factoryLossEntries,
      postOrderEntries,
    ]
  );

  const highestRisk = heatmap[0];

  return (
    <DashboardShell title="AI Department Risk Heatmap">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Factory Early Warning Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Department Risk Heatmap
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module identifies high-risk departments, operational instability,
              financial exposure, delay probability, and emerging executive threats.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading AI risk intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
                  <p className="text-red-300 text-sm">
                    Highest Risk Department
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    {highestRisk?.department || "N/A"}
                  </h2>

                  <p className="text-red-200 mt-3">
                    Risk Score: {highestRisk?.riskScore || 0}/100
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">
                    Active Executive Risks
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {
                      heatmap.filter(
                        (item) =>
                          item.operationalSeverity === "High" ||
                          item.operationalSeverity === "Critical"
                      ).length
                    }
                  </h2>

                  <p className="text-slate-300 mt-3">
                    High-priority operational escalation points detected.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">
                    Total Financial Exposure
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    £
                    {heatmap
                      .reduce(
                        (sum, item) => sum + item.financialExposure,
                        0
                      )
                      .toLocaleString()}
                  </h2>

                  <p className="text-slate-300 mt-3">
                    Combined operational and recovery exposure.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {heatmap.map((item) => (
                  <div
                    key={item.department}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {item.department}
                        </h2>

                        <p className="text-slate-400 mt-1">
                          Severity: {item.operationalSeverity}
                        </p>
                      </div>

                      <div
                        className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${item.color}`}
                      >
                        Risk {item.riskScore}/100
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 ${item.color}`}
                        style={{
                          width: `${item.riskScore}%`,
                        }}
                      />
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <p className="text-slate-400 text-sm">
                        Financial Exposure
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        £{item.financialExposure.toLocaleString()}
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-red-300 font-semibold">
                        AI Executive Warning
                      </h3>

                      <p className="text-slate-300 mt-2 text-sm">
                        {item.warning}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sky-300 font-semibold">
                        AI Recommendation
                      </h3>

                      <p className="text-slate-300 mt-2 text-sm">
                        {item.recommendation}
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