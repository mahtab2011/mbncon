"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/software/DashboardShell";

import {
  getProductionLogs,
  getManpowerLogs,
  getWastageLogs,
  getExportLogs,
  getMaintenanceLogs,
  getUtilitiesLogs,
  getRiskReports,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type ReviewItem = {
  title: string;
  status: "Excellent" | "Stable" | "Attention" | "Critical";
  summary: string;
  action: string;
};

function toNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getStatus(score: number): ReviewItem["status"] {
  if (score >= 85) return "Excellent";
  if (score >= 65) return "Stable";
  if (score >= 40) return "Attention";
  return "Critical";
}

function statusStyle(status: ReviewItem["status"]) {
  if (status === "Excellent") {
    return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "Stable") {
    return "border-cyan-500 bg-cyan-500/10 text-cyan-300";
  }

  if (status === "Attention") {
    return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
  }

  return "border-red-500 bg-red-500/10 text-red-300";
}

export default function AIManagementReviewCentrePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [manpowerLogs, setManpowerLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);
  const [exportLogs, setExportLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [utilitiesLogs, setUtilitiesLogs] = useState<RecordType[]>([]);
  const [riskReports, setRiskReports] = useState<RecordType[]>([]);

  useEffect(() => {
    let active = true;

    async function loadReviewData() {
      setLoading(true);
      setError("");

      try {
        const factoryId = "demo-factory";

        const results = await Promise.allSettled([
          getProductionLogs(factoryId),
          getManpowerLogs(factoryId),
          getWastageLogs(factoryId),
          getExportLogs(factoryId),
          getMaintenanceLogs(factoryId),
          getUtilitiesLogs(factoryId),
          getRiskReports(factoryId),
        ]);

        if (!active) return;

        setProductionLogs(
          results[0].status === "fulfilled" && Array.isArray(results[0].value)
            ? results[0].value
            : []
        );

        setManpowerLogs(
          results[1].status === "fulfilled" && Array.isArray(results[1].value)
            ? results[1].value
            : []
        );

        setWastageLogs(
          results[2].status === "fulfilled" && Array.isArray(results[2].value)
            ? results[2].value
            : []
        );

        setExportLogs(
          results[3].status === "fulfilled" && Array.isArray(results[3].value)
            ? results[3].value
            : []
        );

        setMaintenanceLogs(
          results[4].status === "fulfilled" && Array.isArray(results[4].value)
            ? results[4].value
            : []
        );

        setUtilitiesLogs(
          results[5].status === "fulfilled" && Array.isArray(results[5].value)
            ? results[5].value
            : []
        );

        setRiskReports(
          results[6].status === "fulfilled" && Array.isArray(results[6].value)
            ? results[6].value
            : []
        );
      } catch (err) {
        console.error("Management review loading failed:", err);

        if (active) {
          setError(
            "Live Firestore management review data could not be loaded. Demo review is shown."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReviewData();

    return () => {
      active = false;
    };
  }, []);

  const reviewItems = useMemo<ReviewItem[]>(() => {
    const productionValue =
      productionLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.productionValue) +
          toNumber(item.outputValue),
        0
      ) || 85000;

    const wastageValue =
      wastageLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.wastageCost) +
          toNumber(item.rejectionCost),
        0
      ) || 9000;

    const absenteeism =
      manpowerLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.absentWorkers) +
          toNumber(item.absenteeism),
        0
      ) || 12;

    const exportDelay =
      exportLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.delayDays) +
          toNumber(item.shipmentDelayDays),
        0
      ) || 8;

    const maintenanceRisk =
      maintenanceLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.breakdownCount) +
          toNumber(item.downtimeHours),
        0
      ) || 10;

    const utilityPressure =
      utilitiesLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.utilityCost) +
          toNumber(item.generatorFuelCost),
        0
      ) || 15000;

    const riskExposure =
      riskReports.length || 6;

    const productionScore = Math.max(
      20,
      Math.round(100 - wastageValue / 300)
    );

    const workforceScore = Math.max(
      20,
      Math.round(100 - absenteeism * 3)
    );

    const shipmentScore = Math.max(
      20,
      Math.round(100 - exportDelay * 5)
    );

    const maintenanceScore = Math.max(
      20,
      Math.round(100 - maintenanceRisk * 3)
    );

    const utilityScore = Math.max(
      20,
      Math.round(100 - utilityPressure / 700)
    );

    const governanceScore = Math.max(
      20,
      Math.round(100 - riskExposure * 6)
    );

    return [
      {
        title: "Production Performance Review",
        status: getStatus(productionScore),
        summary:
          "Executive review of production efficiency, wastage and output trend.",
        action:
          "Review line balancing, bottlenecks and operator productivity.",
      },
      {
        title: "Workforce Stability Review",
        status: getStatus(workforceScore),
        summary:
          "Management visibility of absenteeism, overtime and manpower pressure.",
        action:
          "Review attendance discipline and shift allocation immediately.",
      },
      {
        title: "Shipment & Export Review",
        status: getStatus(shipmentScore),
        summary:
          "Tracks export delay exposure and shipment execution risk.",
        action:
          "Escalate delayed orders and protect buyer confidence.",
      },
      {
        title: "Maintenance Governance Review",
        status: getStatus(maintenanceScore),
        summary:
          "Reviews downtime trend, breakdown frequency and repair impact.",
        action:
          "Strengthen preventive maintenance and spare readiness.",
      },
      {
        title: "Utility Cost Review",
        status: getStatus(utilityScore),
        summary:
          "Monitors electricity, generator fuel and utilities cash pressure.",
        action:
          "Separate abnormal energy spikes and investigate immediately.",
      },
      {
        title: "Enterprise Risk Governance",
        status: getStatus(governanceScore),
        summary:
          "Executive review of operational, financial and compliance exposure.",
        action:
          "Conduct cross-functional risk escalation review meeting.",
      },
    ];
  }, [
    productionLogs,
    manpowerLogs,
    wastageLogs,
    exportLogs,
    maintenanceLogs,
    utilitiesLogs,
    riskReports,
  ]);

  const executiveScore = useMemo(() => {
    const map = {
      Excellent: 92,
      Stable: 76,
      Attention: 54,
      Critical: 32,
    };

    const total = reviewItems.reduce(
      (sum, item) => sum + map[item.status],
      0
    );

    return Math.round(total / reviewItems.length);
  }, [reviewItems]);

  return (
    <DashboardShell title="AI Management Review Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[linear(#0f172a,#020617)] px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 106
            </p>

            <h1 className="mt-3 text-3xl md:text-5xl font-bold">
              AI Management Review Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              Enterprise management review centre for directors, factory heads,
              department leaders and operational review teams. Consolidates
              production, manpower, export, maintenance, utilities and risk
              governance into one executive review environment.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
              <p className="text-sm text-cyan-200">
                Executive management review score
              </p>

              <div className="mt-3 flex items-end gap-4">
                <h2 className="text-6xl font-bold">{executiveScore}</h2>

                <div className="mb-2 rounded-full border border-cyan-400/30 px-4 py-1 text-sm text-cyan-200">
                  Enterprise Governance Intelligence
                </div>
              </div>
            </div>

            {loading && (
              <p className="mt-5 text-sm text-cyan-200">
                Loading live management review intelligence...
              </p>
            )}

            {error && (
              <p className="mt-5 text-sm text-yellow-300">{error}</p>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {reviewItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm text-slate-300">
                      {item.summary}
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-4 py-1 text-xs font-semibold ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    Recommended management action
                  </p>

                  <p className="mt-2 text-sm text-slate-200">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Weekly executive review agenda
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Production bottleneck review",
                "Buyer delivery commitment review",
                "Wastage and rejection analysis",
                "Utility and energy cost escalation",
                "Factory risk escalation tracking",
                "Corrective action accountability",
                "Manpower attendance review",
                "Machine downtime governance",
                "Cashflow and profitability review",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}