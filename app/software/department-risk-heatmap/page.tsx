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

function getColor(score: number): string {
  if (score >= 80) return "bg-red-600";
  if (score >= 60) return "bg-orange-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getExecutiveAssessment(highestRisk?: HeatmapDepartment) {
  if (!highestRisk) return "Department Risk Intelligence Not Available";

  if (highestRisk.operationalSeverity === "Critical") {
    return "Critical Department Risk Intervention Required";
  }

  if (highestRisk.operationalSeverity === "High") {
    return "High Department Risk Escalation Required";
  }

  if (highestRisk.operationalSeverity === "Medium") {
    return "Moderate Department Risk Monitoring Required";
  }

  return "Department Risk Environment Stable";
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
      sum + numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const totalRepairCost = maintenanceLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.repairCost || item.maintenanceCost),
    0
  );

  const totalFactoryLoss = factoryLossEntries.reduce(
    (sum, item) =>
      sum + numberValue(item.lossAmount || item.financialImpact),
    0
  );

  const recoveryGap = postOrderEntries.reduce(
    (sum, item) =>
      sum + numberValue(item.unrecoveredAmount || item.balanceLoss),
    0
  );

  const productionRisk = totalProductionLoss / 1000 + totalDowntime * 2;
  const wastageRisk = totalWastageLoss / 800;
  const maintenanceRisk = totalDowntime * 4 + totalRepairCost / 5000;
  const commercialRisk = (totalFactoryLoss + recoveryGap) / 2000;

  const departments: HeatmapDepartment[] = [
    {
      department: "Production",
      riskScore: Math.min(100, Math.round(productionRisk)),
      financialExposure: Math.round(totalProductionLoss),
      operationalSeverity: getSeverity(productionRisk),
      color: getColor(productionRisk),
      warning:
        totalProductionLoss > 0
          ? "Production instability may affect shipment deadlines."
          : "Production flow currently appears stable.",
      recommendation:
        "Review line balancing, manpower allocation, bottlenecks, and production planning.",
    },
    {
      department: "Quality / Wastage",
      riskScore: Math.min(100, Math.round(wastageRisk)),
      financialExposure: Math.round(totalWastageLoss),
      operationalSeverity: getSeverity(wastageRisk),
      color: getColor(wastageRisk),
      warning:
        totalWastageLoss > 0
          ? "Wastage trends indicate possible process control weakness."
          : "Quality loss currently controlled.",
      recommendation:
        "Strengthen inline quality inspection, rejection analysis, and operator discipline.",
    },
    {
      department: "Maintenance",
      riskScore: Math.min(100, Math.round(maintenanceRisk)),
      financialExposure: Math.round(totalRepairCost),
      operationalSeverity: getSeverity(maintenanceRisk),
      color: getColor(maintenanceRisk),
      warning:
        totalDowntime > 0
          ? "Machine downtime risk may interrupt production continuity."
          : "Machine stability currently acceptable.",
      recommendation:
        "Increase preventive maintenance frequency and monitor high-breakdown machines.",
    },
    {
      department: "Commercial Recovery",
      riskScore: Math.min(100, Math.round(commercialRisk)),
      financialExposure: Math.round(totalFactoryLoss + recoveryGap),
      operationalSeverity: getSeverity(commercialRisk),
      color: getColor(commercialRisk),
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

        setProductionLogs(Array.isArray(production) ? production : []);
        setWastageLogs(Array.isArray(wastage) ? wastage : []);
        setMaintenanceLogs(Array.isArray(maintenance) ? maintenance : []);
        setFactoryLossEntries(Array.isArray(factoryLoss) ? factoryLoss : []);
        setPostOrderEntries(Array.isArray(postOrder) ? postOrder : []);
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

  const activeExecutiveRisks = heatmap.filter(
    (item) =>
      item.operationalSeverity === "High" ||
      item.operationalSeverity === "Critical"
  ).length;

  const totalFinancialExposure = heatmap.reduce(
    (sum, item) => sum + item.financialExposure,
    0
  );

  const executiveAssessment = getExecutiveAssessment(highestRisk);

  const kpiCards = [
    {
      title: "Highest Risk Department",
      value: highestRisk?.department || "N/A",
      href: "#risk-heatmap-feed",
      className: "bg-red-950 border-red-700 text-red-200",
    },
    {
      title: "Active Executive Risks",
      value: activeExecutiveRisks,
      href: "#executive-risk-assessment",
      className: "bg-slate-900 border-slate-800 text-slate-200",
    },
    {
      title: "Financial Exposure",
      value: `£${totalFinancialExposure.toLocaleString()}`,
      href: "#financial-exposure-assessment",
      className: "bg-slate-900 border-slate-800 text-slate-200",
    },
  ];

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
              This module identifies high-risk departments, operational
              instability, financial exposure, delay probability, and emerging
              executive threats.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading AI risk intelligence...
            </div>
          ) : (
            <>
              <section
                id="enterprise-kpis"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-28"
              >
                {kpiCards.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-sky-400/70 hover:shadow-xl ${card.className}`}
                  >
                    <p className="text-sm opacity-80">{card.title}</p>

                    <h2 className="text-2xl font-bold mt-2">
                      {card.value}
                    </h2>

                    <p className="mt-3 text-xs opacity-60">
                      Click to review heatmap intelligence
                    </p>
                  </a>
                ))}
              </section>

              <section
                id="executive-risk-assessment"
                className="scroll-mt-28 rounded-2xl border border-sky-700/40 bg-sky-950/20 p-6"
              >
                <p className="text-sm uppercase tracking-widest text-sky-300">
                  Executive Risk Assessment
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {executiveAssessment}
                </h2>

                <p className="mt-4 text-slate-300">
                  AI compares production instability, quality loss, machine
                  downtime, factory loss, and commercial recovery gaps to
                  identify where management should intervene first.
                </p>
              </section>

              <section
                id="financial-exposure-assessment"
                className="scroll-mt-28 rounded-2xl border border-red-700/40 bg-red-950/20 p-6"
              >
                <p className="text-sm uppercase tracking-widest text-red-300">
                  Financial Exposure Assessment
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  £{totalFinancialExposure.toLocaleString()}
                </h2>

                <p className="mt-4 text-slate-300">
                  This represents combined operational and recovery exposure
                  across production, wastage, maintenance, and commercial
                  recovery areas. High exposure should trigger immediate
                  executive review.
                </p>
              </section>

              <section
                id="risk-heatmap-feed"
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-mt-28"
              >
                {heatmap.map((item) => {
                  const sectionId = slugify(item.department);

                  return (
                    <a
                      key={item.department}
                      id={sectionId}
                      href="#consultancy-application"
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 transition hover:-translate-y-1 hover:border-sky-400/70 hover:shadow-xl"
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

                      <p className="text-xs text-slate-500">
                        Click to review consultancy application
                      </p>
                    </a>
                  );
                })}
              </section>

              <section
                id="consultancy-application"
                className="scroll-mt-28 rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-6"
              >
                <p className="text-sm uppercase tracking-widest text-cyan-300">
                  Consultancy Application
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Executive Department Risk Control
                </h2>

                <p className="mt-4 text-slate-300">
                  This module helps executives prioritise departmental risk
                  reviews, assign corrective action ownership, identify where
                  losses are emerging, and focus recovery activity on the most
                  financially exposed areas.
                </p>

                <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-sm uppercase tracking-widest text-cyan-300">
                    AI Recommendation
                  </p>

                  <p className="mt-3 text-slate-300">
                    Management should review the highest-risk department first,
                    confirm the financial exposure, identify root cause, assign
                    corrective ownership, and monitor the department weekly
                    until risk score and loss exposure reduce.
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}