"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/software/DashboardShell";
import KpiCard from "@/components/software/KpiCard";
import ScoreRing from "@/components/software/ScoreRing";
import ForecastCard from "@/components/software/ForecastCard";
import AlertPanel from "@/components/software/AlertPanel";
import LiveTrendChart from "@/components/software/LiveTrendChart";
import KaizenActionForm from "@/components/software/KaizenActionForm";
import GembaObservationForm from "@/components/software/GembaObservationForm";
import MudaScoringForm from "@/components/software/MudaScoringForm";
import TQMImplementationForm from "@/components/software/TQMImplementationForm";
import FactoryBenchmarkForm from "@/components/software/FactoryBenchmarkForm";
import CorrectiveActionTracker from "@/components/software/CorrectiveActionTracker";
import RootCauseAnalyzer from "@/components/software/RootCauseAnalyzer";
import BuyerExecutiveSummary from "@/components/software/BuyerExecutiveSummary";
import BangladeshApparelShowcase from "@/components/software/BangladeshApparelShowcase";
import KaizenActionList from "@/components/software/KaizenActionList";
import GembaObservationList from "@/components/software/GembaObservationList";
import CorrectiveActionList from "@/components/software/CorrectiveActionList";

import {
  getProductionLogs,
  getManpowerLogs,
  getWastageLogs,
  getExportLogs,
  getUtilitiesLogs,
  getMaintenanceLogs,
  getRiskReports,
} from "@/lib/software/firestoreService";

import { exponentialSmoothing } from "@/lib/software/forecasting";
import { calculatePerformanceScore } from "@/lib/software/scoring";
import {
  assessProductionRisk,
  assessManpowerRisk,
  assessWastageRisk,
  assessExportDelayRisk,
  assessUtilitiesRisk,
  assessMaintenanceRisk,
  assessRisk,
} from "@/lib/software/riskEngine";

import {
  generateForecastObservation,
  generateOperationalObservation,
  generateExecutiveSummary,
} from "@/lib/software/aiObservations";

type AnyLog = Record<string, any> & {
  id?: string;
  period?: string;
  efficiencyPercent?: number;
};

type DashboardData = {
  productionLogs: AnyLog[];
  manpowerLogs: AnyLog[];
  wastageLogs: AnyLog[];
  exportLogs: AnyLog[];
  utilitiesLogs: AnyLog[];
  maintenanceLogs: AnyLog[];
  riskReports: AnyLog[];
};

const emptyDashboardData: DashboardData = {
  productionLogs: [],
  manpowerLogs: [],
  wastageLogs: [],
  exportLogs: [],
  utilitiesLogs: [],
  maintenanceLogs: [],
  riskReports: [],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const navigationCards = [
  "Executive Intelligence",
  "Operational Risks",
  "Trend Monitoring",
  "Forecast Intelligence",
  "Lean, Kaizen & TQM",
  "Corrective Actions",
  "Root Cause Analysis",
  "Buyer Intelligence",
  "Bangladesh Apparel",
  "Executive AI Summary",
].map((title, index) => ({
  number: String(index + 1).padStart(2, "0"),
  title,
  href: `#${slugify(title)}`,
}));

function numberValue(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function latest(logs: AnyLog[]) {
  return logs[0] || {};
}

function severityFromRisk(level: string) {
  if (level === "Critical" || level === "High") return "danger";
  if (level === "Medium") return "warning";
  return "info";
}

export default function ExecutiveDashboardPage() {
  const factoryId = "demo-factory";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData>(emptyDashboardData);

  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [
          productionLogs,
          manpowerLogs,
          wastageLogs,
          exportLogs,
          utilitiesLogs,
          maintenanceLogs,
          riskReports,
        ] = await Promise.all([
          getProductionLogs(factoryId),
          getManpowerLogs(factoryId),
          getWastageLogs(factoryId),
          getExportLogs(factoryId),
          getUtilitiesLogs(factoryId),
          getMaintenanceLogs(factoryId),
          getRiskReports(factoryId),
        ]);

        if (!active) return;

        setData({
          productionLogs,
          manpowerLogs,
          wastageLogs,
          exportLogs,
          utilitiesLogs,
          maintenanceLogs,
          riskReports,
        });
      } catch (err) {
        console.error("Executive dashboard loading error:", err);

        if (!active) return;

        setError(
          "Live Firestore data could not be loaded. Safe demo values are being used."
        );
        setData(emptyDashboardData);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const dashboard = useMemo(() => {
    const {
      productionLogs,
      manpowerLogs,
      wastageLogs,
      exportLogs,
      utilitiesLogs,
      maintenanceLogs,
      riskReports,
    } = data;

    const production = latest(productionLogs);
    const manpower = latest(manpowerLogs);
    const wastage = latest(wastageLogs);
    const exportLog = latest(exportLogs);
    const utilities = latest(utilitiesLogs);
    const maintenance = latest(maintenanceLogs);

    const productionData =
      productionLogs.length > 1
        ? [...productionLogs].reverse().map((log: AnyLog, index: number) => ({
            period: String(log.period || `P${index + 1}`),
            actual: numberValue(log.efficiencyPercent, 0),
          }))
        : [
            { period: "Jan", actual: 78 },
            { period: "Feb", actual: 82 },
            { period: "Mar", actual: 85 },
            { period: "Apr", actual: 87 },
            { period: "May", actual: 90 },
          ];

    const productionForecast = exponentialSmoothing(productionData);

    const productionRisk = assessProductionRisk({
      efficiencyPercent: numberValue(production.efficiencyPercent, 88),
      rejectionPercent: numberValue(production.rejectionPercent, 4),
      delayPercent: numberValue(production.delayPercent, 5),
    });

    const manpowerRisk = assessManpowerRisk({
      absenteeismPercent: numberValue(manpower.absenteeismPercent, 6),
      overtimeHours: numberValue(manpower.overtimeHours, 120),
      plannedWorkers: numberValue(manpower.plannedWorkers, 500),
      actualWorkers: numberValue(manpower.actualWorkers, 470),
    });

    const wastageRisk = assessWastageRisk({
      wastagePercent: numberValue(wastage.wastagePercent, 5),
      wastageQty: numberValue(wastage.wastageQty, 120),
      issuedQty: numberValue(wastage.issuedQty, 2500),
    });

    const exportRisk = assessExportDelayRisk({
      delayDays: numberValue(exportLog.delayDays, 2),
      orderValue: numberValue(exportLog.orderValue, 90000),
      status:
        exportLog.status === "On Time" ||
        exportLog.status === "Delayed" ||
        exportLog.status === "At Risk" ||
        exportLog.status === "Shipped"
          ? exportLog.status
          : "At Risk",
    });

    const utilitiesRisk = assessUtilitiesRisk({
      electricityCost: numberValue(utilities.electricityCost, 15000),
      generatorFuelCost: numberValue(utilities.generatorFuelCost, 5000),
      gasCost: numberValue(utilities.gasCost, 4000),
      waterCost: numberValue(utilities.waterCost, 1000),
      productionHours: numberValue(utilities.productionHours, 160),
    });

    const maintenanceRisk = assessMaintenanceRisk({
      downtimeHours: numberValue(maintenance.downtimeHours, 10),
      repairCost: numberValue(maintenance.repairCost, 3000),
      breakdownCount: numberValue(maintenance.breakdownCount, 2),
    });

    const executiveScore = calculatePerformanceScore([
      productionRisk.score,
      manpowerRisk.score,
      wastageRisk.score,
      exportRisk.score,
      utilitiesRisk.score,
      maintenanceRisk.score,
    ]);

    const executiveRisk = assessRisk(
      executiveScore.score,
      "Live Executive Operations"
    );

    const operationalObservation = generateOperationalObservation(
      "Live Executive Operations",
      executiveScore,
      executiveRisk
    );

    const forecastObservation = generateForecastObservation(
      "Production Planning",
      productionForecast
    );

    const executiveSummary = generateExecutiveSummary("MBNCON Demo Factory", [
      operationalObservation,
      forecastObservation,
    ]);

    const liveRecordCount =
      productionLogs.length +
      manpowerLogs.length +
      wastageLogs.length +
      exportLogs.length +
      utilitiesLogs.length +
      maintenanceLogs.length +
      riskReports.length;

    return {
      productionLogs,
      manpowerLogs,
      wastageLogs,
      exportLogs,
      utilitiesLogs,
      maintenanceLogs,
      riskReports,
      productionData,
      productionForecast,
      productionRisk,
      manpowerRisk,
      wastageRisk,
      exportRisk,
      utilitiesRisk,
      maintenanceRisk,
      executiveScore,
      executiveRisk,
      operationalObservation,
      forecastObservation,
      executiveSummary,
      liveRecordCount,
    };
  }, [data]);

  if (loading) {
    return (
      <DashboardShell
        title="Executive Dashboard"
        subtitle="Loading live executive intelligence from Firestore."
      >
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8 text-cyan-800">
          Loading executive dashboard intelligence...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Executive Dashboard"
      subtitle="Live Firestore-powered executive intelligence dashboard for factory performance, forecasting, risk scoring, and consultancy insights."
    >
      {error ? (
        <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          {error}
        </div>
      ) : null}

      <section id={slugify("Executive Intelligence")} className="scroll-mt-28">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div
            onClick={() => {
              window.location.href = `#${slugify("Executive AI Summary")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <KpiCard
              title="Live Records"
              value={String(dashboard.liveRecordCount)}
              change="Firestore connected"
              risk={dashboard.liveRecordCount > 0 ? "Low" : "Medium"}
            />
          </div>

          <div
            onClick={() => {
              window.location.href = `#${slugify("Executive AI Summary")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <KpiCard
              title="Overall Score"
              value={`${dashboard.executiveScore.score}%`}
              change={dashboard.executiveScore.status}
              risk={dashboard.executiveRisk.level}
            />
          </div>

          <div
            onClick={() => {
              window.location.href = `#${slugify("Forecast Intelligence")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <KpiCard
              title="Production Forecast"
              value={`${dashboard.productionForecast.nextForecast}%`}
              change={dashboard.productionForecast.trend}
              risk={dashboard.productionForecast.riskLevel}
            />
          </div>

          <div
            onClick={() => {
              window.location.href = `#${slugify("Forecast Intelligence")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <KpiCard
              title="Forecast Accuracy"
              value={`${dashboard.productionForecast.averageAccuracy}%`}
              change="Exponential smoothing"
              risk={dashboard.productionForecast.riskLevel}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {navigationCards.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
            >
              <p className="text-sm font-black text-cyan-700">{item.number}</p>

              <h3 className="mt-2 text-base font-bold text-neutral-950">
                {item.title}
              </h3>

              <p className="mt-2 text-xs text-neutral-500">
                Open detail section
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div
            onClick={() => {
              window.location.href = `#${slugify("Executive AI Summary")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <ScoreRing
              label="Executive Score"
              score={Math.round(dashboard.executiveScore.score)}
            />
          </div>

          <div
            onClick={() => {
              window.location.href = `#${slugify("Forecast Intelligence")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <ScoreRing
              label="Forecast Accuracy"
              score={Math.round(dashboard.productionForecast.averageAccuracy)}
            />
          </div>

          <div
            onClick={() => {
              window.location.href = `#${slugify("Operational Risks")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <ScoreRing
              label="Risk Score"
              score={dashboard.executiveRisk.score}
            />
          </div>
        </div>
      </section>

      <section id={slugify("Operational Risks")} className="scroll-mt-28">
        <SectionHeader
          label="02 Operational Risks"
          title="Factory Risk Intelligence"
          description="Live risk scoring across production, manpower, wastage, export, utilities, and maintenance."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <RiskClickCard title="Production Risk" risk={dashboard.productionRisk} />
          <RiskClickCard title="Manpower Risk" risk={dashboard.manpowerRisk} />
          <RiskClickCard title="Wastage Risk" risk={dashboard.wastageRisk} />
          <RiskClickCard title="Export Risk" risk={dashboard.exportRisk} />
          <RiskClickCard title="Utilities Risk" risk={dashboard.utilitiesRisk} />
          <RiskClickCard title="Maintenance Risk" risk={dashboard.maintenanceRisk} />
        </div>
      </section>

      <section id={slugify("Trend Monitoring")} className="scroll-mt-28">
        <SectionHeader
          label="03 Trend Monitoring"
          title="Operational Trend Monitoring"
          description="Charts read factory records from Firestore and convert production, workforce, wastage, export, utilities, and maintenance data into management intelligence trends."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartClickCard target="Forecast Intelligence">
            <LiveTrendChart
              title="Production Efficiency Trend"
              data={dashboard.productionData.map((item) => ({
                period: item.period,
                value: item.actual,
              }))}
            />
          </ChartClickCard>

          <ChartClickCard target="Operational Risks">
            <LiveTrendChart
              title="Workforce Absenteeism Trend"
              data={
                dashboard.manpowerLogs.length > 0
                  ? [...dashboard.manpowerLogs]
                      .reverse()
                      .map((log: AnyLog, index: number) => ({
                        period: String(log.period || `P${index + 1}`),
                        value: numberValue(log.absenteeismPercent, 0),
                      }))
                  : [
                      { period: "Jan", value: 6 },
                      { period: "Feb", value: 7 },
                      { period: "Mar", value: 5 },
                      { period: "Apr", value: 8 },
                      { period: "May", value: 6 },
                    ]
              }
            />
          </ChartClickCard>

          <ChartClickCard target="Operational Risks">
            <LiveTrendChart
              title="Wastage % Trend"
              data={
                dashboard.wastageLogs.length > 0
                  ? [...dashboard.wastageLogs]
                      .reverse()
                      .map((log: AnyLog, index: number) => ({
                        period: String(log.period || `P${index + 1}`),
                        value: numberValue(log.wastagePercent, 0),
                      }))
                  : [
                      { period: "Jan", value: 4 },
                      { period: "Feb", value: 5 },
                      { period: "Mar", value: 6 },
                      { period: "Apr", value: 5 },
                      { period: "May", value: 4 },
                    ]
              }
            />
          </ChartClickCard>

          <ChartClickCard target="Operational Risks">
            <LiveTrendChart
              title="Export Delay Days Trend"
              data={
                dashboard.exportLogs.length > 0
                  ? [...dashboard.exportLogs]
                      .reverse()
                      .map((log: AnyLog, index: number) => ({
                        period: String(log.period || `P${index + 1}`),
                        value: numberValue(log.delayDays, 0),
                      }))
                  : [
                      { period: "Jan", value: 1 },
                      { period: "Feb", value: 3 },
                      { period: "Mar", value: 2 },
                      { period: "Apr", value: 5 },
                      { period: "May", value: 2 },
                    ]
              }
            />
          </ChartClickCard>

          <ChartClickCard target="Operational Risks">
            <LiveTrendChart
              title="Utilities Cost Trend"
              data={
                dashboard.utilitiesLogs.length > 0
                  ? [...dashboard.utilitiesLogs]
                      .reverse()
                      .map((log: AnyLog, index: number) => ({
                        period: String(log.period || `P${index + 1}`),
                        value:
                          numberValue(log.electricityCost, 0) +
                          numberValue(log.generatorFuelCost, 0) +
                          numberValue(log.gasCost, 0) +
                          numberValue(log.waterCost, 0),
                      }))
                  : [
                      { period: "Jan", value: 21000 },
                      { period: "Feb", value: 23000 },
                      { period: "Mar", value: 24000 },
                      { period: "Apr", value: 22000 },
                      { period: "May", value: 25000 },
                    ]
              }
            />
          </ChartClickCard>

          <ChartClickCard target="Operational Risks">
            <LiveTrendChart
              title="Maintenance Downtime Trend"
              data={
                dashboard.maintenanceLogs.length > 0
                  ? [...dashboard.maintenanceLogs]
                      .reverse()
                      .map((log: AnyLog, index: number) => ({
                        period: String(log.period || `P${index + 1}`),
                        value: numberValue(log.downtimeHours, 0),
                      }))
                  : [
                      { period: "Jan", value: 8 },
                      { period: "Feb", value: 12 },
                      { period: "Mar", value: 10 },
                      { period: "Apr", value: 14 },
                      { period: "May", value: 9 },
                    ]
              }
            />
          </ChartClickCard>
        </div>
      </section>

      <section id={slugify("Forecast Intelligence")} className="scroll-mt-28">
        <SectionHeader
          label="04 Forecast Intelligence"
          title="Production Forecasting Engine"
          description="Exponential smoothing forecast intelligence for executive planning and early warning."
        />

        <div
          onClick={() => {
            window.location.href = `#${slugify("Executive AI Summary")}`;
          }}
          className="mt-6 cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
        >
          <ForecastCard
            title="Live Production Forecasting Engine"
            current={`${
              dashboard.productionData[dashboard.productionData.length - 1]
                ?.actual || 0
            }%`}
            forecast={`${dashboard.productionForecast.nextForecast}%`}
            accuracy={`${dashboard.productionForecast.averageAccuracy}%`}
            note={dashboard.productionForecast.recommendation}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div
            onClick={() => {
              window.location.href = `#${slugify("Executive AI Summary")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <AlertPanel
              title={dashboard.operationalObservation.title}
              message={dashboard.operationalObservation.summary}
              severity={severityFromRisk(
                dashboard.operationalObservation.priority
              )}
            />
          </div>

          <div
            onClick={() => {
              window.location.href = `#${slugify("Executive AI Summary")}`;
            }}
            className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <AlertPanel
              title={dashboard.forecastObservation.title}
              message={dashboard.forecastObservation.summary}
              severity={severityFromRisk(dashboard.forecastObservation.priority)}
            />
          </div>
        </div>
      </section>

            <section id={slugify("Lean, Kaizen & TQM")} className="scroll-mt-28">
        <SectionHeader
          label="05 Lean, Kaizen & TQM"
          title="Operational Excellence Execution"
          description="Executive overview only. Detailed forms remain in their own operational entry modules."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ModuleSummaryCard
            title="Kaizen Actions"
            description="Review continuous improvement actions, owners, deadlines, and execution status."
            href="/software/lean-kaizen-entry"
          />

          <ModuleSummaryCard
            title="Gemba Observations"
            description="Monitor shop-floor observations, recurring issues, and escalation requirements."
            href="/software/gemba-observation-entry"
          />

          <ModuleSummaryCard
            title="Muda / Waste Scoring"
            description="Summarise waste, waiting, motion, rework, overproduction, and cost leakage signals."
            href="/software/muda-scoring-entry"
          />

          <ModuleSummaryCard
            title="TQM Implementation"
            description="Track quality discipline, department ownership, corrective progress, and audit readiness."
            href="/software/tqm-entry"
          />

          <ModuleSummaryCard
            title="Factory Benchmarking"
            description="Compare productivity, quality, delivery, cost, compliance, and improvement performance."
            href="/software/factory-benchmark-entry"
          />

          <ModuleSummaryCard
            title="Improvement Governance"
            description="Use the executive dashboard to review progress, risks, overdue actions, and leadership decisions."
            href={`#${slugify("Executive AI Summary")}`}
          />
        </div>

        <div className="mt-8 space-y-8">
          <KaizenActionList />
          <GembaObservationList />
        </div>
      </section>
      <section id={slugify("Corrective Actions")} className="scroll-mt-28">
        <SectionHeader
          label="06 Corrective Actions"
          title="Corrective Action Tracking"
          description="Structured follow-up for improvement ownership, accountability, and execution discipline."
        />

        <div className="mt-6 space-y-8">
          <CorrectiveActionTracker />
          <CorrectiveActionList />
        </div>
      </section>

      <section id={slugify("Root Cause Analysis")} className="scroll-mt-28">
        <SectionHeader
          label="07 Root Cause Analysis"
          title="Root Cause Intelligence"
          description="Structured problem solving for production, quality, delivery, workforce, and cost issues."
        />

        <div className="mt-6">
          <RootCauseAnalyzer />
        </div>
      </section>

      <section id={slugify("Buyer Intelligence")} className="scroll-mt-28">
        <SectionHeader
          label="08 Buyer Intelligence"
          title="Buyer Executive Summary"
          description="Buyer-facing executive intelligence for performance, delivery, recovery, and commercial confidence."
        />

        <div className="mt-6">
          <BuyerExecutiveSummary />
        </div>
      </section>

      <section id={slugify("Bangladesh Apparel")} className="scroll-mt-28">
        <SectionHeader
          label="09 Bangladesh Apparel"
          title="Bangladesh Apparel Showcase"
          description="Factory capability and apparel-sector positioning for future marketplace and buyer-facing demonstrations."
        />

        <div className="mt-6">
          <BangladeshApparelShowcase />
        </div>
      </section>

      <section id={slugify("Executive AI Summary")} className="scroll-mt-28">
        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            10 Live Executive AI Summary
          </p>

          <h2 className="mt-2 text-3xl font-bold text-neutral-950">
            Management Intelligence Observation
          </h2>

          <p className="mt-6 text-lg leading-9 text-neutral-700">
            {dashboard.executiveSummary}
          </p>

          <div className="mt-8 rounded-2xl bg-neutral-50 p-6">
            <h3 className="text-lg font-bold text-neutral-900">
              Firestore Status
            </h3>

            <p className="mt-4 text-sm leading-8 text-neutral-600">
              This dashboard reads live Firestore records. If no live record is
              available yet, safe demo fallback values are used so the dashboard
              remains stable.
            </p>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-12 rounded-3xl border border-cyan-200 bg-cyan-50 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
        {label}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-neutral-950">{title}</h2>

      <p className="mt-4 max-w-4xl text-base leading-8 text-neutral-700">
        {description}
      </p>
    </div>
  );
}
function ModuleSummaryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-neutral-950">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-neutral-600">
        {description}
      </p>

      <p className="mt-4 text-xs font-semibold text-cyan-700">
        Open detailed module
      </p>
    </a>
  );
}
function ChartClickCard({
  target,
  children,
}: {
  target: string;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={() => {
        window.location.href = `#${slugify(target)}`;
      }}
      className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
    >
      {children}
    </div>
  );
}

function RiskClickCard({
  title,
  risk,
}: {
  title: string;
  risk: {
    level: "Low" | "Medium" | "High" | "Critical";
    score: number;
    message: string;
    action: string;
  };
}) {
  return (
    <div
      onClick={() => {
        window.location.href = `#${slugify("Executive AI Summary")}`;
      }}
      className="cursor-pointer transition hover:-translate-y-1 hover:scale-[1.01]"
    >
      <RiskCard title={title} risk={risk} />
    </div>
  );
}

function RiskCard({
  title,
  risk,
}: {
  title: string;
  risk: {
    level: "Low" | "Medium" | "High" | "Critical";
    score: number;
    message: string;
    action: string;
  };
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-cyan-300 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-neutral-950">{title}</h3>

        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">
          {risk.level}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-neutral-950">{risk.score}</p>

      <p className="mt-4 text-sm leading-7 text-neutral-600">
        {risk.message}
      </p>

      <p className="mt-4 text-sm font-semibold leading-7 text-cyan-700">
        {risk.action}
      </p>

      <p className="mt-4 text-xs text-neutral-500">
        Click to review executive AI summary
      </p>
    </div>
  );
}