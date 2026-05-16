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

type EscalationItem = {
  title: string;
  department: string;
  level: "CEO" | "Factory Director" | "Department Head";
  urgencyScore: number;
  priority: "Low" | "Medium" | "High" | "Critical";
  reason: string;
  action: string;
  timeline: string;
};

function numberValue(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function priority(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function level(score: number): "CEO" | "Factory Director" | "Department Head" {
  if (score >= 80) return "CEO";
  if (score >= 60) return "Factory Director";
  return "Department Head";
}

function generateEscalations(
  productionLogs: RecordType[],
  wastageLogs: RecordType[],
  maintenanceLogs: RecordType[],
  factoryLossEntries: RecordType[],
  postOrderEntries: RecordType[]
): EscalationItem[] {
  const productionLoss = productionLogs.reduce(
    (sum, item) => sum + numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const wastageLoss = wastageLogs.reduce(
    (sum, item) => sum + numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
    0
  );

  const downtimeHours = maintenanceLogs.reduce(
    (sum, item) => sum + numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const repairCost = maintenanceLogs.reduce(
    (sum, item) => sum + numberValue(item.repairCost || item.maintenanceCost),
    0
  );

  const factoryLoss = factoryLossEntries.reduce(
    (sum, item) => sum + numberValue(item.lossAmount || item.financialImpact || item.costImpact),
    0
  );

  const recoveryGap = postOrderEntries.reduce(
    (sum, item) => sum + numberValue(item.unrecoveredAmount || item.balanceLoss || item.remainingLoss),
    0
  );

  const productionScore = Math.min(100, Math.round(productionLoss / 1000 + downtimeHours * 2));
  const qualityScore = Math.min(100, Math.round(wastageLoss / 800));
  const maintenanceScore = Math.min(100, Math.round(downtimeHours * 4 + repairCost / 5000));
  const recoveryScore = Math.min(100, Math.round((factoryLoss + recoveryGap) / 2000));

  const escalations: EscalationItem[] = [
    {
      title: "Production delay and output instability risk",
      department: "Production",
      level: level(productionScore),
      urgencyScore: productionScore,
      priority: priority(productionScore),
      reason:
        productionScore >= 40
          ? "Production loss or downtime may affect delivery reliability and buyer commitment."
          : "Production risk is currently under control.",
      action:
        productionScore >= 60
          ? "Review bottleneck lines, manpower allocation, material readiness, and daily output recovery plan."
          : "Continue monitoring production variance and planned output.",
      timeline:
        productionScore >= 80 ? "Immediate CEO review today" : productionScore >= 60 ? "Review within 24 hours" : "Monitor weekly",
    },
    {
      title: "Quality, rejection, and wastage escalation risk",
      department: "Quality / Wastage",
      level: level(qualityScore),
      urgencyScore: qualityScore,
      priority: priority(qualityScore),
      reason:
        qualityScore >= 40
          ? "Wastage or rejection may create hidden cost leakage and shipment quality risk."
          : "Quality and wastage risk is currently under control.",
      action:
        qualityScore >= 60
          ? "Launch root cause review for rejection, rework, material misuse, and operator process gaps."
          : "Continue inline inspection and wastage monitoring.",
      timeline:
        qualityScore >= 80 ? "Immediate CEO review today" : qualityScore >= 60 ? "Review within 24 hours" : "Monitor weekly",
    },
    {
      title: "Machine downtime and maintenance escalation risk",
      department: "Maintenance",
      level: level(maintenanceScore),
      urgencyScore: maintenanceScore,
      priority: priority(maintenanceScore),
      reason:
        maintenanceScore >= 40
          ? "Downtime or repair cost may interrupt production flow and shipment delivery."
          : "Maintenance risk is currently under control.",
      action:
        maintenanceScore >= 60
          ? "Escalate high-breakdown machines, spare parts readiness, and preventive maintenance schedule."
          : "Continue preventive maintenance tracking.",
      timeline:
        maintenanceScore >= 80 ? "Immediate CEO review today" : maintenanceScore >= 60 ? "Review within 24 hours" : "Monitor weekly",
    },
    {
      title: "Financial loss and post-order recovery escalation risk",
      department: "Commercial Recovery",
      level: level(recoveryScore),
      urgencyScore: recoveryScore,
      priority: priority(recoveryScore),
      reason:
        recoveryScore >= 40
          ? "Factory loss or unrecovered post-order value may reduce profitability."
          : "Commercial recovery risk is currently under control.",
      action:
        recoveryScore >= 60
          ? "Escalate buyer claim defence, recovery negotiation, discount control, and margin protection."
          : "Continue recovery tracking and buyer communication.",
      timeline:
        recoveryScore >= 80 ? "Immediate CEO review today" : recoveryScore >= 60 ? "Review within 24 hours" : "Monitor weekly",
    },
  ];

  return escalations.sort((a, b) => b.urgencyScore - a.urgencyScore);
};

export default function ExecutiveEscalationEnginePage() {
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

        const production = (await safeFetch(() =>
  getProductionLogs("demo-factory")
)) as RecordType[];

const wastage = (await safeFetch(() =>
  getWastageLogs("demo-factory")
)) as RecordType[];

const maintenance = (await safeFetch(() =>
  getMaintenanceLogs("demo-factory")
)) as RecordType[];

const factoryLoss = (await safeFetch(() =>
  getFactoryLossIntelligenceEntries("demo-factory")
)) as RecordType[];

const postOrder = (await safeFetch(() =>
  getPostOrderIntelligenceEntries("demo-factory")
)) as RecordType[];

        setProductionLogs(production || []);
        setWastageLogs(wastage || []);
        setMaintenanceLogs(maintenance || []);
        setFactoryLossEntries(factoryLoss || []);
        setPostOrderEntries(postOrder || []);
      } catch (error) {
        console.error("Executive escalation loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const escalations = useMemo(
    () =>
      generateEscalations(
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

  const criticalCount = escalations.filter((item) => item.priority === "Critical").length;
  const highCount = escalations.filter((item) => item.priority === "High").length;
  const ceoCount = escalations.filter((item) => item.level === "CEO").length;

  return (
    <DashboardShell title="AI Executive Escalation Engine">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Executive Manufacturing Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Executive Escalation Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module converts factory risks into executive escalation priorities,
              showing who should act, how urgent the matter is, and what action is required.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading AI executive escalation intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
                  <p className="text-red-300 text-sm">CEO Escalations</p>
                  <h2 className="text-3xl font-bold mt-2">{ceoCount}</h2>
                  <p className="text-red-200 mt-3">
                    Issues requiring highest executive attention.
                  </p>
                </div>

                <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
                  <p className="text-orange-300 text-sm">Critical Risks</p>
                  <h2 className="text-3xl font-bold mt-2">{criticalCount}</h2>
                  <p className="text-orange-200 mt-3">
                    Risks that may damage delivery, quality, or profitability.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">High Risks</p>
                  <h2 className="text-3xl font-bold mt-2">{highCount}</h2>
                  <p className="text-slate-300 mt-3">
                    Risks that require director or department-head follow-up.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5">
                {escalations.map((item) => (
                  <div
                    key={item.title}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">{item.department}</p>
                        <h2 className="text-2xl font-bold mt-1">{item.title}</h2>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 rounded-full bg-slate-800 text-slate-200 text-sm">
                          {item.level}
                        </span>

                        <span
                          className={
                            item.priority === "Critical"
                              ? "px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold"
                              : item.priority === "High"
                              ? "px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold"
                              : item.priority === "Medium"
                              ? "px-4 py-2 rounded-full bg-yellow-500 text-slate-950 text-sm font-semibold"
                              : "px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold"
                          }
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">
                        Urgency Score: {item.urgencyScore}/100
                      </p>
                      <div className="w-full bg-slate-800 rounded-full h-4 mt-2 overflow-hidden">
                        <div
                          className={
                            item.priority === "Critical"
                              ? "bg-red-600 h-4"
                              : item.priority === "High"
                              ? "bg-orange-500 h-4"
                              : item.priority === "Medium"
                              ? "bg-yellow-500 h-4"
                              : "bg-emerald-500 h-4"
                          }
                          style={{ width: `${item.urgencyScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-red-300 font-semibold">Reason</h3>
                        <p className="text-slate-300 text-sm mt-2">{item.reason}</p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-sky-300 font-semibold">Required Action</h3>
                        <p className="text-slate-300 text-sm mt-2">{item.action}</p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-amber-300 font-semibold">Timeline</h3>
                        <p className="text-slate-300 text-sm mt-2">{item.timeline}</p>
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