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

type DepartmentScore = {
  department: string;
  score: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  strengths: string[];
  concerns: string[];
  executiveAdvice: string;
};

function numberValue(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function calculateDepartmentRanking(
  productionLogs: RecordType[],
  wastageLogs: RecordType[],
  maintenanceLogs: RecordType[],
  factoryLossEntries: RecordType[],
  postOrderEntries: RecordType[]
): DepartmentScore[] {
  const departments: DepartmentScore[] = [];

  const productionOutput = productionLogs.reduce(
    (sum, item) => sum + numberValue(item.outputQty || item.productionQty || item.quantity),
    0
  );

  const productionTarget = productionLogs.reduce(
    (sum, item) => sum + numberValue(item.targetQty || item.target || item.plannedQty),
    0
  );

  const wastageCost = wastageLogs.reduce(
    (sum, item) => sum + numberValue(item.wastageCost || item.lossAmount || item.cost),
    0
  );

  const downtimeHours = maintenanceLogs.reduce(
    (sum, item) => sum + numberValue(item.downtimeHours || item.downtime),
    0
  );

  const repairCost = maintenanceLogs.reduce(
    (sum, item) => sum + numberValue(item.repairCost || item.cost),
    0
  );

  const factoryLossAmount = factoryLossEntries.reduce(
    (sum, item) => sum + numberValue(item.lossAmount || item.totalLoss || item.costImpact),
    0
  );

  const recoveryAmount = postOrderEntries.reduce(
    (sum, item) => sum + numberValue(item.recoveredAmount || item.recoveryAmount || item.savedAmount),
    0
  );

  const productionEfficiency =
    productionTarget > 0 ? Math.min(100, (productionOutput / productionTarget) * 100) : 70;

  const productionScore = Math.max(
    20,
    Math.min(100, productionEfficiency - factoryLossAmount / 10000)
  );

  departments.push({
    department: "Production",
    score: Math.round(productionScore),
    riskLevel:
      productionScore >= 80 ? "Low" : productionScore >= 60 ? "Medium" : productionScore >= 40 ? "High" : "Critical",
    strengths:
      productionScore >= 75
        ? ["Production output is reasonably aligned with planned target."]
        : ["Production data is available for executive tracking."],
    concerns:
      productionScore < 70
        ? ["Production efficiency may be affected by bottlenecks, rework, or planning gaps."]
        : ["Continue monitoring daily output variance."],
    executiveAdvice:
      productionScore < 70
        ? "Review line balancing, operator allocation, material readiness, and production bottlenecks."
        : "Maintain current production rhythm and strengthen predictive monitoring.",
  });

  const qualityScore = Math.max(20, Math.min(100, 90 - wastageCost / 5000));

  departments.push({
    department: "Quality / Wastage Control",
    score: Math.round(qualityScore),
    riskLevel:
      qualityScore >= 80 ? "Low" : qualityScore >= 60 ? "Medium" : qualityScore >= 40 ? "High" : "Critical",
    strengths:
      qualityScore >= 75
        ? ["Wastage impact appears controlled."]
        : ["Wastage records are available for root cause review."],
    concerns:
      qualityScore < 70
        ? ["High wastage cost may indicate quality failure, material misuse, or poor process discipline."]
        : ["Keep tracking rejection, rework, and defect trends."],
    executiveAdvice:
      qualityScore < 70
        ? "Start immediate root cause review for wastage, rejection, rework, and material handling."
        : "Continue preventive quality checks and supplier quality monitoring.",
  });

  const maintenanceScore = Math.max(20, Math.min(100, 90 - downtimeHours * 3 - repairCost / 10000));

  departments.push({
    department: "Maintenance",
    score: Math.round(maintenanceScore),
    riskLevel:
      maintenanceScore >= 80 ? "Low" : maintenanceScore >= 60 ? "Medium" : maintenanceScore >= 40 ? "High" : "Critical",
    strengths:
      maintenanceScore >= 75
        ? ["Machine downtime appears manageable."]
        : ["Maintenance data is available for machine reliability tracking."],
    concerns:
      maintenanceScore < 70
        ? ["Downtime or repair cost may be affecting production capacity and delivery reliability."]
        : ["Continue preventive maintenance discipline."],
    executiveAdvice:
      maintenanceScore < 70
        ? "Review high-breakdown machines, spare parts readiness, and preventive maintenance frequency."
        : "Use maintenance trends to prevent future breakdown risks.",
  });

  const commercialScore = Math.max(20, Math.min(100, 75 + recoveryAmount / 10000 - factoryLossAmount / 20000));

  departments.push({
    department: "Commercial / Post Order Recovery",
    score: Math.round(commercialScore),
    riskLevel:
      commercialScore >= 80 ? "Low" : commercialScore >= 60 ? "Medium" : commercialScore >= 40 ? "High" : "Critical",
    strengths:
      recoveryAmount > 0
        ? ["Recovery activity is helping reduce post-order financial damage."]
        : ["Commercial intelligence records are available for tracking."],
    concerns:
      commercialScore < 70
        ? ["Recovery may not be strong enough against accumulated factory losses."]
        : ["Continue tracking buyer claims, discounts, and recovery actions."],
    executiveAdvice:
      commercialScore < 70
        ? "Strengthen post-order negotiation, claim defence, buyer communication, and recovery follow-up."
        : "Use recovery intelligence to protect margin after shipment.",
  });

  return departments.sort((a, b) => b.score - a.score);
}

export default function DepartmentRankingPage() {
  const [loading, setLoading] = useState(true);
  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [factoryLossEntries, setFactoryLossEntries] = useState<RecordType[]>([]);
  const [postOrderEntries, setPostOrderEntries] = useState<RecordType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const production = await getProductionLogs("demo-factory").catch(() => []);
const wastage = await getWastageLogs("demo-factory").catch(() => []);
const maintenance = await getMaintenanceLogs("demo-factory").catch(() => []);
const factoryLoss = await getFactoryLossIntelligenceEntries("demo-factory").catch(() => []);
const postOrder = await getPostOrderIntelligenceEntries("demo-factory").catch(() => []);

        setProductionLogs(production || []);
        setWastageLogs(wastage || []);
        setMaintenanceLogs(maintenance || []);
        setFactoryLossEntries(factoryLoss || []);
        setPostOrderEntries(postOrder || []);
      } catch (error) {
        console.error("Department ranking data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const ranking = useMemo(
    () =>
      calculateDepartmentRanking(
        productionLogs,
        wastageLogs,
        maintenanceLogs,
        factoryLossEntries,
        postOrderEntries
      ),
    [productionLogs, wastageLogs, maintenanceLogs, factoryLossEntries, postOrderEntries]
  );

  const bestDepartment = ranking[0];
  const weakestDepartment = ranking[ranking.length - 1];

  return (
    <DashboardShell title="AI Department Performance Ranking">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">MBNCON AI Manufacturing Intelligence</p>
            <h1 className="text-3xl font-bold mt-2">AI Department Performance Ranking</h1>
            <p className="text-slate-300 mt-2 max-w-4xl">
              This module compares department performance using production, wastage,
              maintenance, factory loss, and post-order recovery intelligence.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading department intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">Best Performing Department</p>
                  <h2 className="text-2xl font-bold mt-2">
                    {bestDepartment?.department || "Not available"}
                  </h2>
                  <p className="text-emerald-400 mt-2">
                    Score: {bestDepartment?.score || 0}/100
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">Highest Attention Required</p>
                  <h2 className="text-2xl font-bold mt-2">
                    {weakestDepartment?.department || "Not available"}
                  </h2>
                  <p className="text-amber-400 mt-2">
                    Score: {weakestDepartment?.score || 0}/100
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">Departments Analysed</p>
                  <h2 className="text-2xl font-bold mt-2">{ranking.length}</h2>
                  <p className="text-slate-300 mt-2">
                    Production, Quality, Maintenance, and Commercial recovery.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {ranking.map((item, index) => (
                  <div
                    key={item.department}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Rank #{index + 1}</p>
                        <h2 className="text-xl font-bold">{item.department}</h2>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold">{item.score}</p>
                        <p
                          className={
                            item.riskLevel === "Low"
                              ? "text-emerald-400 text-sm"
                              : item.riskLevel === "Medium"
                              ? "text-yellow-400 text-sm"
                              : item.riskLevel === "High"
                              ? "text-orange-400 text-sm"
                              : "text-red-400 text-sm"
                          }
                        >
                          {item.riskLevel} Risk
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className="bg-emerald-500 h-3 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-emerald-300">Strengths</h3>
                      <ul className="list-disc list-inside text-slate-300 text-sm mt-2 space-y-1">
                        {item.strengths.map((strength) => (
                          <li key={strength}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-amber-300">Concerns</h3>
                      <ul className="list-disc list-inside text-slate-300 text-sm mt-2 space-y-1">
                        {item.concerns.map((concern) => (
                          <li key={concern}>{concern}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <h3 className="font-semibold text-sky-300">AI Executive Advice</h3>
                      <p className="text-slate-300 text-sm mt-2">{item.executiveAdvice}</p>
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