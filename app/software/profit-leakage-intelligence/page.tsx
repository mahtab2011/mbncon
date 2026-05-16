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

type LeakageItem = {
  department: string;
  leakageAmount: number;
  leakageScore: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  cause: string;
  recoveryOpportunity: string;
  executiveAction: string;
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

function generateProfitLeakage(
  productionLogs: RecordType[],
  wastageLogs: RecordType[],
  maintenanceLogs: RecordType[],
  factoryLossEntries: RecordType[],
  postOrderEntries: RecordType[]
): LeakageItem[] {
  const productionLeakage = productionLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const wastageLeakage = wastageLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
    0
  );

  const maintenanceLeakage = maintenanceLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.repairCost || item.maintenanceCost) +
      numberValue(item.downtimeHours || item.breakdownHours) * 120,
    0
  );

  const factoryLossLeakage = factoryLossEntries.reduce(
    (sum, item) =>
      sum + numberValue(item.lossAmount || item.financialImpact || item.costImpact),
    0
  );

  const recoveryLeakage = postOrderEntries.reduce(
    (sum, item) =>
      sum +
      numberValue(item.unrecoveredAmount || item.balanceLoss || item.remainingLoss),
    0
  );

  const items: LeakageItem[] = [
    {
      department: "Production",
      leakageAmount: Math.round(productionLeakage),
      leakageScore: Math.min(100, Math.round(productionLeakage / 1000)),
      severity: getSeverity(productionLeakage / 1000),
      cause:
        productionLeakage > 0
          ? "Possible output loss, delay cost, idle time, rework, or production inefficiency."
          : "No significant production leakage detected from available data.",
      recoveryOpportunity:
        "Recover value through line balancing, bottleneck removal, daily output tracking, and production discipline.",
      executiveAction:
        productionLeakage > 0
          ? "Factory director should review production leakage causes and recovery plan."
          : "Continue monitoring production efficiency.",
    },
    {
      department: "Quality / Wastage",
      leakageAmount: Math.round(wastageLeakage),
      leakageScore: Math.min(100, Math.round(wastageLeakage / 800)),
      severity: getSeverity(wastageLeakage / 800),
      cause:
        wastageLeakage > 0
          ? "Material wastage, rejection, rework, poor handling, or process control weakness."
          : "No significant quality leakage detected from available data.",
      recoveryOpportunity:
        "Recover margin through inline quality control, rejection reduction, operator training, and material discipline.",
      executiveAction:
        wastageLeakage > 0
          ? "Quality head should launch wastage root cause review."
          : "Continue wastage monitoring.",
    },
    {
      department: "Maintenance",
      leakageAmount: Math.round(maintenanceLeakage),
      leakageScore: Math.min(100, Math.round(maintenanceLeakage / 900)),
      severity: getSeverity(maintenanceLeakage / 900),
      cause:
        maintenanceLeakage > 0
          ? "Repair cost, downtime, machine instability, spare parts delay, or preventive maintenance failure."
          : "No significant maintenance leakage detected from available data.",
      recoveryOpportunity:
        "Recover value through preventive maintenance, machine reliability tracking, spare readiness, and downtime reduction.",
      executiveAction:
        maintenanceLeakage > 0
          ? "Maintenance head should review high-cost machines and downtime pattern."
          : "Continue preventive maintenance tracking.",
    },
    {
      department: "Factory Loss",
      leakageAmount: Math.round(factoryLossLeakage),
      leakageScore: Math.min(100, Math.round(factoryLossLeakage / 1200)),
      severity: getSeverity(factoryLossLeakage / 1200),
      cause:
        factoryLossLeakage > 0
          ? "Recorded factory-level financial loss, operational failure, delay, quality claim, or cost overrun."
          : "No significant factory-level leakage detected from available data.",
      recoveryOpportunity:
        "Recover value through loss categorisation, responsible department tracking, corrective action, and executive follow-up.",
      executiveAction:
        factoryLossLeakage > 0
          ? "Executive team should review major loss categories and assign recovery owners."
          : "Continue factory loss intelligence tracking.",
    },
    {
      department: "Commercial Recovery",
      leakageAmount: Math.round(recoveryLeakage),
      leakageScore: Math.min(100, Math.round(recoveryLeakage / 1000)),
      severity: getSeverity(recoveryLeakage / 1000),
      cause:
        recoveryLeakage > 0
          ? "Unrecovered buyer claim, discount, chargeback, pending recovery, or margin loss."
          : "No significant commercial recovery leakage detected from available data.",
      recoveryOpportunity:
        "Recover value through buyer negotiation, claim defence, documentation, and recovery escalation.",
      executiveAction:
        recoveryLeakage > 0
          ? "Commercial team should escalate unrecovered values and protect margin."
          : "Continue recovery tracking.",
    },
  ];

  return items.sort((a, b) => b.leakageAmount - a.leakageAmount);
}

export default function ProfitLeakageIntelligencePage() {
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
              new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
            ]);
          } catch {
            return [];
          }
        };

        const productionResult = Array.isArray(
  await Promise.race([
    safeFetch(() => getProductionLogs("demo-factory")),
    new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
  ])
)
  ? await Promise.race([
      safeFetch(() => getProductionLogs("demo-factory")),
      new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
    ])
  : [];

const wastageResult = Array.isArray(
  await Promise.race([
    safeFetch(() => getWastageLogs("demo-factory")),
    new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
  ])
)
  ? await Promise.race([
      safeFetch(() => getWastageLogs("demo-factory")),
      new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
    ])
  : [];

const maintenanceResult = Array.isArray(
  await Promise.race([
    safeFetch(() => getMaintenanceLogs("demo-factory")),
    new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
  ])
)
  ? await Promise.race([
      safeFetch(() => getMaintenanceLogs("demo-factory")),
      new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
    ])
  : [];

const factoryLossResult = Array.isArray(
  await Promise.race([
    safeFetch(() => getFactoryLossIntelligenceEntries("demo-factory")),
    new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
  ])
)
  ? await Promise.race([
      safeFetch(() => getFactoryLossIntelligenceEntries("demo-factory")),
      new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
    ])
  : [];

const postOrderResult = Array.isArray(
  await Promise.race([
    safeFetch(() => getPostOrderIntelligenceEntries("demo-factory")),
    new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
  ])
)
  ? await Promise.race([
      safeFetch(() => getPostOrderIntelligenceEntries("demo-factory")),
      new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
    ])
  : [];

        setProductionLogs(Array.isArray(productionResult) ? productionResult : []);
        setWastageLogs(Array.isArray(wastageResult) ? wastageResult : []);
        setMaintenanceLogs(Array.isArray(maintenanceResult) ? maintenanceResult : []);
        setFactoryLossEntries(Array.isArray(factoryLossResult) ? factoryLossResult : []);
        setPostOrderEntries(Array.isArray(postOrderResult) ? postOrderResult : []);
      } catch (error) {
        console.error("Profit leakage intelligence loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const leakageItems = useMemo(
    () =>
      generateProfitLeakage(
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

  const totalLeakage = leakageItems.reduce(
    (sum, item) => sum + item.leakageAmount,
    0
  );

  const criticalCount = leakageItems.filter(
    (item) => item.severity === "Critical"
  ).length;

  const topLeakage = leakageItems[0];

  return (
    <DashboardShell title="AI Profit Leakage Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Profit Protection Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Profit Leakage Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module identifies hidden profit leakage across production,
              quality, maintenance, factory loss, and commercial recovery areas.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading profit leakage intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
                  <p className="text-red-300 text-sm">Largest Leakage Area</p>
                  <h2 className="text-2xl font-bold mt-2">
                    {topLeakage?.department || "N/A"}
                  </h2>
                  <p className="text-red-200 mt-3">
                    £{topLeakage?.leakageAmount.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
                  <p className="text-orange-300 text-sm">Critical Leakage Areas</p>
                  <h2 className="text-3xl font-bold mt-2">{criticalCount}</h2>
                  <p className="text-orange-200 mt-3">
                    Areas requiring executive recovery attention.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">Total Estimated Leakage</p>
                  <h2 className="text-3xl font-bold mt-2">
                    £{totalLeakage.toLocaleString()}
                  </h2>
                  <p className="text-slate-300 mt-3">
                    Combined detected leakage from available intelligence data.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5">
                {leakageItems.map((item) => (
                  <div
                    key={item.department}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">
                          Department Leakage Intelligence
                        </p>
                        <h2 className="text-2xl font-bold mt-1">
                          {item.department}
                        </h2>
                      </div>

                      <span
                        className={
                          item.severity === "Critical"
                            ? "px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold"
                            : item.severity === "High"
                            ? "px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold"
                            : item.severity === "Medium"
                            ? "px-4 py-2 rounded-full bg-yellow-500 text-slate-950 text-sm font-semibold"
                            : "px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold"
                        }
                      >
                        {item.severity}
                      </span>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">
                        Leakage Score: {item.leakageScore}/100
                      </p>

                      <div className="w-full bg-slate-800 rounded-full h-4 mt-2 overflow-hidden">
                        <div
                          className={
                            item.severity === "Critical"
                              ? "bg-red-600 h-4"
                              : item.severity === "High"
                              ? "bg-orange-500 h-4"
                              : item.severity === "Medium"
                              ? "bg-yellow-500 h-4"
                              : "bg-emerald-500 h-4"
                          }
                          style={{ width: `${item.leakageScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-red-300 font-semibold">
                          Estimated Leakage
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          £{item.leakageAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-orange-300 font-semibold">
                          Probable Cause
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.cause}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-sky-300 font-semibold">
                          Recovery Opportunity
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.recoveryOpportunity}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-emerald-300 font-semibold">
                          Executive Action
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.executiveAction}
                        </p>
                      </div>
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