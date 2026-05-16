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

export default async function ExecutiveDashboardPage() {
  const factoryId = "demo-factory";

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

  const production = latest(productionLogs);
  const manpower = latest(manpowerLogs);
  const wastage = latest(wastageLogs);
  const exportLog = latest(exportLogs);
  const utilities = latest(utilitiesLogs);
  const maintenance = latest(maintenanceLogs);

  const productionData =
    productionLogs.length > 1
      ? [...productionLogs]
          .reverse()
          .map((log: AnyLog, index: number) => ({
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

  return (
    <DashboardShell
      title="Executive Dashboard"
      subtitle="Live Firestore-powered executive intelligence dashboard for factory performance, forecasting, risk scoring, and consultancy insights."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Live Records"
          value={String(liveRecordCount)}
          change="Firestore connected"
          risk={liveRecordCount > 0 ? "Low" : "Medium"}
        />

        <KpiCard
          title="Overall Score"
          value={`${executiveScore.score}%`}
          change={executiveScore.status}
          risk={executiveRisk.level}
        />

        <KpiCard
          title="Production Forecast"
          value={`${productionForecast.nextForecast}%`}
          change={productionForecast.trend}
          risk={productionForecast.riskLevel}
        />

        <KpiCard
          title="Forecast Accuracy"
          value={`${productionForecast.averageAccuracy}%`}
          change="Exponential smoothing"
          risk={productionForecast.riskLevel}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <ScoreRing
          label="Executive Score"
          score={Math.round(executiveScore.score)}
        />

        <ScoreRing
          label="Forecast Accuracy"
          score={Math.round(productionForecast.averageAccuracy)}
        />

        <ScoreRing label="Risk Score" score={executiveRisk.score} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RiskCard title="Production Risk" risk={productionRisk} />
        <RiskCard title="Manpower Risk" risk={manpowerRisk} />
        <RiskCard title="Wastage Risk" risk={wastageRisk} />
        <RiskCard title="Export Risk" risk={exportRisk} />
        <RiskCard title="Utilities Risk" risk={utilitiesRisk} />
        <RiskCard title="Maintenance Risk" risk={maintenanceRisk} />
      </div>

      <div className="mt-12 rounded-3xl border border-cyan-200 bg-cyan-50 p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
          Live Firestore Chart Intelligence
        </p>

        <h2 className="mt-2 text-3xl font-bold text-neutral-950">
          Operational Trend Monitoring
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-8 text-neutral-700">
          These charts are designed to read live factory records from Firestore
          and convert production, workforce, wastage, export, utilities, and
          maintenance data into management intelligence trends.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <LiveTrendChart
          title="Production Efficiency Trend"
          data={productionData.map((item) => ({
            period: item.period,
            value: item.actual,
          }))}
        />

        <LiveTrendChart
          title="Workforce Absenteeism Trend"
          data={
            manpowerLogs.length > 0
              ? [...manpowerLogs]
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

        <LiveTrendChart
          title="Wastage % Trend"
          data={
            wastageLogs.length > 0
              ? [...wastageLogs]
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

        <LiveTrendChart
          title="Export Delay Days Trend"
          data={
            exportLogs.length > 0
              ? [...exportLogs]
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

        <LiveTrendChart
          title="Utilities Cost Trend"
          data={
            utilitiesLogs.length > 0
              ? [...utilitiesLogs]
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

        <LiveTrendChart
          title="Maintenance Downtime Trend"
          data={
            maintenanceLogs.length > 0
              ? [...maintenanceLogs]
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
      </div>

      <div className="mt-10">
        <ForecastCard
          title="Live Production Forecasting Engine"
          current={`${productionData[productionData.length - 1].actual}%`}
          forecast={`${productionForecast.nextForecast}%`}
          accuracy={`${productionForecast.averageAccuracy}%`}
          note={productionForecast.recommendation}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <AlertPanel
          title={operationalObservation.title}
          message={operationalObservation.summary}
          severity={severityFromRisk(operationalObservation.priority)}
        />

        <AlertPanel
          title={forecastObservation.title}
          message={forecastObservation.summary}
          severity={severityFromRisk(forecastObservation.priority)}
        />
      </div>
<div className="mt-8">
  <KaizenActionForm />
</div>
<div className="mt-8">
  <KaizenActionList />
</div>
<div className="mt-8">
  <GembaObservationForm />
</div>
<div className="mt-8">
  <GembaObservationList />
</div>
<div className="mt-8">
  <MudaScoringForm />
</div>
<div className="mt-8">
  <TQMImplementationForm />
</div>
<div className="mt-8">
  <FactoryBenchmarkForm />
</div>
<div className="mt-8">
  <CorrectiveActionTracker />
  <div className="mt-8">
  <CorrectiveActionList />
</div>
</div>
<div className="mt-8">
  <RootCauseAnalyzer />
</div>
<div className="mt-8">
  <BuyerExecutiveSummary />
</div>
<div className="mt-8">
  <BangladeshApparelShowcase />
</div>
      <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
          Live Executive AI Summary
        </p>

        <h2 className="mt-2 text-3xl font-bold text-neutral-950">
          Management Intelligence Observation
        </h2>

        <p className="mt-6 text-lg leading-9 text-neutral-700">
          {executiveSummary}
        </p>

        <div className="mt-8 rounded-2xl bg-neutral-50 p-6">
          <h3 className="text-lg font-bold text-neutral-900">
            Firestore Status
          </h3>

          <p className="mt-4 text-sm leading-8 text-neutral-600">
            This dashboard is now reading live Firestore records. If no live
            record is available yet, safe demo fallback values are used so the
            dashboard remains stable.
          </p>
        </div>
      </div>
    </DashboardShell>
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
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
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
    </div>
  );
}