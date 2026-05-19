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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function getSeverityBadgeClass(severity: LeakageItem["severity"]) {
  if (severity === "Critical") {
    return "bg-red-600 text-white";
  }

  if (severity === "High") {
    return "bg-orange-500 text-white";
  }

  if (severity === "Medium") {
    return "bg-yellow-500 text-slate-950";
  }

  return "bg-emerald-500 text-slate-950";
}

function getSeverityBarClass(severity: LeakageItem["severity"]) {
  if (severity === "Critical") {
    return "bg-red-600";
  }

  if (severity === "High") {
    return "bg-orange-500";
  }

  if (severity === "Medium") {
    return "bg-yellow-500";
  }

  return "bg-emerald-500";
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
      sum +
      numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const wastageLeakage = wastageLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
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
      sum +
      numberValue(item.lossAmount || item.financialImpact || item.costImpact),
    0
  );

  const recoveryLeakage = postOrderEntries.reduce(
    (sum, item) =>
      sum +
      numberValue(
        item.unrecoveredAmount || item.balanceLoss || item.remainingLoss
      ),
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
  const [factoryLossEntries, setFactoryLossEntries] = useState<RecordType[]>(
    []
  );
  const [postOrderEntries, setPostOrderEntries] = useState<RecordType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const safeFetch = async (fn: () => Promise<any>) => {
          try {
            const result = await Promise.race([
              fn(),
              new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
            ]);

            return Array.isArray(result) ? result : [];
          } catch {
            return [];
          }
        };

        const [
          productionResult,
          wastageResult,
          maintenanceResult,
          factoryLossResult,
          postOrderResult,
        ] = await Promise.all([
          safeFetch(() => getProductionLogs("demo-factory")),
          safeFetch(() => getWastageLogs("demo-factory")),
          safeFetch(() => getMaintenanceLogs("demo-factory")),
          safeFetch(() => getFactoryLossIntelligenceEntries("demo-factory")),
          safeFetch(() => getPostOrderIntelligenceEntries("demo-factory")),
        ]);

        setProductionLogs(productionResult);
        setWastageLogs(wastageResult);
        setMaintenanceLogs(maintenanceResult);
        setFactoryLossEntries(factoryLossResult);
        setPostOrderEntries(postOrderResult);
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

  const intelligenceCards = [
    {
      title: "Largest Leakage Area",
      value: topLeakage?.department || "N/A",
      description: `£${(topLeakage?.leakageAmount || 0).toLocaleString()}`,
      target: topLeakage?.department || "leakage-details",
      className: "border-red-700 bg-red-950/50 text-red-200",
    },
    {
      title: "Critical Leakage Areas",
      value: criticalCount.toString(),
      description: "Areas requiring executive recovery attention.",
      target: "Leakage Details",
      className: "border-orange-700 bg-orange-950/50 text-orange-200",
    },
    {
      title: "Total Estimated Leakage",
      value: `£${totalLeakage.toLocaleString()}`,
      description:
        "Combined detected leakage from available intelligence data.",
      target: "Executive Recovery Summary",
      className: "border-slate-700 bg-slate-900 text-slate-300",
    },
  ];

  return (
    <DashboardShell title="AI Profit Leakage Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
              MBNCON AI Profit Protection Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
              AI Profit Leakage Intelligence Engine
            </h1>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
              This module identifies hidden profit leakage across production,
              quality, maintenance, factory loss, and commercial recovery areas
              using live Firestore intelligence data.
            </p>
          </section>

          {loading ? (
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-md">
              <p className="text-lg font-semibold text-slate-200">
                Loading profit leakage intelligence...
              </p>

              <p className="mt-3 text-sm text-slate-400">
                Enterprise-safe Firestore loading is active with timeout
                protection.
              </p>
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {intelligenceCards.map((card) => {
                  const targetId = slugify(card.target);

                  return (
                    <a
                      key={card.title}
                      href={`#${targetId}`}
                      className={`rounded-2xl border p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-xl ${card.className}`}
                    >
                      <p className="text-sm opacity-80">{card.title}</p>

                      <h2 className="mt-2 text-3xl font-bold">
                        {card.value}
                      </h2>

                      <p className="mt-3 text-sm opacity-90">
                        {card.description}
                      </p>

                      <p className="mt-5 text-xs font-semibold opacity-70">
                        View intelligence →
                      </p>
                    </a>
                  );
                })}
              </section>

              <section
                id={slugify("Leakage Details")}
                className="scroll-mt-28 space-y-5"
              >
                {leakageItems.map((item) => {
                  const itemId = slugify(item.department);

                  return (
                    <section
                      key={item.department}
                      id={itemId}
                      className="scroll-mt-28 space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-md transition duration-300 hover:border-slate-700 hover:shadow-xl"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-slate-400">
                            Department Leakage Intelligence
                          </p>

                          <h2 className="mt-1 text-3xl font-bold">
                            {item.department}
                          </h2>
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${getSeverityBadgeClass(
                            item.severity
                          )}`}
                        >
                          {item.severity}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">
                          Leakage Score: {item.leakageScore}/100
                        </p>

                        <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-4 transition-all duration-500 ${getSeverityBarClass(
                              item.severity
                            )}`}
                            style={{ width: `${item.leakageScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-red-300">
                            Estimated Leakage
                          </h3>

                          <p className="mt-2 text-sm text-slate-300">
                            £{item.leakageAmount.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-orange-300">
                            Probable Cause
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.cause}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-sky-300">
                            Recovery Opportunity
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.recoveryOpportunity}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-emerald-300">
                            Executive Action
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.executiveAction}
                          </p>
                        </div>
                      </div>
                    </section>
                  );
                })}
              </section>

              <section
                id={slugify("Executive Recovery Summary")}
                className="scroll-mt-28 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-8 shadow-md transition duration-300 hover:border-emerald-400/50 hover:shadow-xl"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Executive Recovery Summary
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  Profit Protection Action Layer
                </h2>

                <p className="mt-5 max-w-5xl text-lg leading-8 text-emerald-100">
                  MBNCON profit leakage intelligence helps directors identify
                  where money is being lost, which departments need recovery
                  action, and where executive escalation can protect margin
                  before losses become permanent.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {[
                    "Prioritise high-value leakage recovery",
                    "Assign department-level recovery owners",
                    "Track leakage reduction through executive follow-up",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">{item}</p>

                      <p className="mt-3 text-sm leading-6 text-emerald-100">
                        Consultancy-demo executive UX prepared for margin
                        protection and operational recovery.
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}