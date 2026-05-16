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

type ReportSection = {
  title: string;
  status: "Strong" | "Stable" | "Needs Review" | "Critical";
  summary: string;
  recommendation: string;
};

function toNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function statusStyle(status: ReportSection["status"]) {
  if (status === "Strong") {
    return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "Stable") {
    return "border-cyan-500 bg-cyan-500/10 text-cyan-300";
  }

  if (status === "Needs Review") {
    return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
  }

  return "border-red-500 bg-red-500/10 text-red-300";
}

function getStatus(score: number): ReportSection["status"] {
  if (score >= 85) return "Strong";
  if (score >= 65) return "Stable";
  if (score >= 40) return "Needs Review";
  return "Critical";
}

export default function AIEnterpriseReportGeneratorPage() {
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

    async function loadReportData() {
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
        console.error("Enterprise report loading failed:", err);

        if (active) {
          setError(
            "Live Firestore enterprise report data could not be loaded. Demo report is shown."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReportData();

    return () => {
      active = false;
    };
  }, []);

  const reportSections = useMemo<ReportSection[]>(() => {
    const productionValue =
      productionLogs.reduce(
        (sum, item) =>
          sum + toNumber(item.productionValue) + toNumber(item.outputValue),
        0
      ) || 90000;

    const absenteeism =
      manpowerLogs.reduce(
        (sum, item) =>
          sum + toNumber(item.absentWorkers) + toNumber(item.absenteeism),
        0
      ) || 9;

    const wastageCost =
      wastageLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.wastageCost) +
          toNumber(item.rejectionCost) +
          toNumber(item.reworkCost),
        0
      ) || 8500;

    const exportDelay =
      exportLogs.reduce(
        (sum, item) =>
          sum + toNumber(item.delayDays) + toNumber(item.shipmentDelayDays),
        0
      ) || 6;

    const downtime =
      maintenanceLogs.reduce(
        (sum, item) =>
          sum + toNumber(item.downtimeHours) + toNumber(item.breakdownCount),
        0
      ) || 8;

    const utilityCost =
      utilitiesLogs.reduce(
        (sum, item) =>
          sum + toNumber(item.utilityCost) + toNumber(item.generatorFuelCost),
        0
      ) || 12000;

    const governanceRisk = riskReports.length || 4;

    const productionScore = Math.max(20, Math.round(100 - wastageCost / 400));
    const manpowerScore = Math.max(20, Math.round(100 - absenteeism * 4));
    const shipmentScore = Math.max(20, Math.round(100 - exportDelay * 6));
    const maintenanceScore = Math.max(20, Math.round(100 - downtime * 4));
    const utilityScore = Math.max(
      20,
      Math.round(100 - utilityCost / Math.max(productionValue, 1) * 100)
    );
    const governanceScore = Math.max(20, Math.round(100 - governanceRisk * 7));

    return [
      {
        title: "Executive Production Summary",
        status: getStatus(productionScore),
        summary:
          "Production performance is reviewed against output value, wastage, rejection and operational loss indicators.",
        recommendation:
          "Focus on bottleneck removal, line balancing, supervisor accountability and daily output evidence.",
      },
      {
        title: "Workforce & Manpower Summary",
        status: getStatus(manpowerScore),
        summary:
          "Manpower performance is reviewed through absenteeism, attendance pressure and workforce stability.",
        recommendation:
          "Strengthen attendance discipline, shift planning, overtime control and department-level accountability.",
      },
      {
        title: "Wastage, Rejection & Rework Summary",
        status: getStatus(productionScore),
        summary:
          "Material loss, rejection and rework are analysed as direct threats to profitability and cashflow.",
        recommendation:
          "Open corrective action records for repeated defects and assign root-cause owners immediately.",
      },
      {
        title: "Shipment & Export Risk Summary",
        status: getStatus(shipmentScore),
        summary:
          "Shipment execution, export delay and buyer confidence risks are reviewed for management escalation.",
        recommendation:
          "Escalate delayed orders, confirm revised shipment dates and protect buyer communication records.",
      },
      {
        title: "Maintenance & Downtime Summary",
        status: getStatus(maintenanceScore),
        summary:
          "Machine downtime and breakdown pattern are reviewed against production continuity and repair cost.",
        recommendation:
          "Prioritise preventive maintenance, spare planning and repeated breakdown investigation.",
      },
      {
        title: "Utilities & Energy Cost Summary",
        status: getStatus(utilityScore),
        summary:
          "Electricity, generator fuel and utility cost are reviewed against production value and operating pressure.",
        recommendation:
          "Separate national grid cost, generator fuel cost and abnormal usage for management review.",
      },
      {
        title: "Enterprise Governance Summary",
        status: getStatus(governanceScore),
        summary:
          "Risk reports, audit readiness, evidence control and management review exposure are consolidated.",
        recommendation:
          "Run weekly executive governance review and assign accountable owners for unresolved risks.",
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

  const enterpriseScore = useMemo(() => {
    const map = {
      Strong: 92,
      Stable: 74,
      "Needs Review": 52,
      Critical: 28,
    };

    const total = reportSections.reduce(
      (sum, item) => sum + map[item.status],
      0
    );

    return Math.round(total / reportSections.length);
  }, [reportSections]);

  return (
    <DashboardShell title="AI Enterprise Report Generator">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[linear(#0f172a,#020617)] px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 110
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              AI Enterprise Report Generator
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              Generates a director-level enterprise intelligence report from
              production, manpower, wastage, export, maintenance, utilities and
              risk governance data.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
              <p className="text-sm text-cyan-200">
                Enterprise report intelligence score
              </p>

              <div className="mt-3 flex items-end gap-4">
                <h2 className="text-6xl font-bold">{enterpriseScore}</h2>

                <div className="mb-2 rounded-full border border-cyan-400/30 px-4 py-1 text-sm text-cyan-200">
                  Board Report Readiness
                </div>
              </div>
            </div>

            {loading && (
              <p className="mt-5 text-sm text-cyan-200">
                Loading live enterprise report intelligence...
              </p>
            )}

            {error && <p className="mt-5 text-sm text-yellow-300">{error}</p>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {reportSections.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-semibold">{item.title}</h2>

                  <div
                    className={`rounded-full border px-4 py-1 text-xs font-semibold ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    Report summary
                  </p>

                  <p className="mt-2 text-sm text-slate-200">{item.summary}</p>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-yellow-300">
                    Recommendation
                  </p>

                  <p className="mt-2 text-sm text-slate-200">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Future report generator functions
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "PDF board report export",
                "Buyer-facing summary report",
                "Department accountability report",
                "Weekly management review report",
                "Profit recovery action report",
                "Risk escalation report",
                "Audit evidence report",
                "Bangla report generation",
                "Email report distribution",
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