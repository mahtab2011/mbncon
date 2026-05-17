"use client";
import DashboardShell from "@/components/software/DashboardShell";
import KpiCard from "@/components/software/KpiCard";
import ScoreRing from "@/components/software/ScoreRing";
import ForecastCard from "@/components/software/ForecastCard";
import AlertPanel from "@/components/software/AlertPanel";
import RiskBadge from "@/components/software/RiskBadge";

import { exponentialSmoothing } from "@/lib/software/forecasting";
import { calculatePerformanceScore } from "@/lib/software/scoring";
import { assessRisk } from "@/lib/software/riskEngine";
import {
  generateForecastObservation,
  generateOperationalObservation,
  generateExecutiveSummary,
} from "@/lib/software/aiObservations";

export default function ExecutiveCommandCentrePage() {
  const productionForecast = exponentialSmoothing([
    { period: "Jan", actual: 82 },
    { period: "Feb", actual: 85 },
    { period: "Mar", actual: 88 },
    { period: "Apr", actual: 86 },
    { period: "May", actual: 91 },
  ]);

  const performance = calculatePerformanceScore([82, 78, 91, 88]);

  const operationalRisk = assessRisk(
    performance.score,
    "Production Operations"
  );

  const operationalObservation = generateOperationalObservation(
    "Production Operations",
    performance,
    operationalRisk
  );

  const forecastObservation = generateForecastObservation(
    "Production Forecast",
    productionForecast
  );

  const executiveSummary = generateExecutiveSummary("MBNCON Demo Factory", [
    operationalObservation,
    forecastObservation,
  ]);

  return (
    <DashboardShell
      title="Executive Command Centre"
      subtitle="AI-assisted manufacturing intelligence, operational forecasting, executive scoring, and consultancy decision-support system."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Production Efficiency"
          value="88%"
          change="+4.2% this month"
          risk="Low"
        />

        <KpiCard
          title="Shipment Stability"
          value="92%"
          change="Strong delivery trend"
          risk="Low"
        />

        <KpiCard
          title="Operational Risk"
          value={String(operationalRisk.score)}
          change={operationalRisk.level}
          risk={operationalRisk.level}
        />

        <KpiCard
          title="Forecast Accuracy"
          value={`${productionForecast.averageAccuracy}%`}
          change={productionForecast.trend}
          risk={productionForecast.riskLevel}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <ScoreRing
          label="Operational Score"
          score={Math.round(performance.score)}
        />

        <ScoreRing
          label="Forecast Accuracy"
          score={Math.round(productionForecast.averageAccuracy)}
        />

        <ScoreRing
          label="Risk Stability"
          score={operationalRisk.score}
        />
      </div>

      <div className="mt-10">
        <ForecastCard
          title="Production Forecast Intelligence"
          current="91%"
          forecast={`${productionForecast.nextForecast}%`}
          accuracy={`${productionForecast.averageAccuracy}%`}
          note={productionForecast.recommendation}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <AlertPanel
          title={operationalObservation.title}
          message={operationalObservation.summary}
          severity={
            operationalObservation.priority === "Critical"
              ? "danger"
              : operationalObservation.priority === "High"
              ? "warning"
              : "info"
          }
        />

        <AlertPanel
          title={forecastObservation.title}
          message={forecastObservation.summary}
          severity={
            forecastObservation.priority === "High"
              ? "warning"
              : "info"
          }
        />
      </div>

      <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Executive Intelligence Summary
            </p>

            <h2 className="mt-2 text-3xl font-bold text-neutral-950">
              AI Executive Observation
            </h2>
          </div>

          <RiskBadge level={operationalRisk.level} />
        </div>

        <p className="mt-6 text-lg leading-9 text-neutral-700">
          {executiveSummary}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-neutral-50 p-6">
            <h3 className="text-lg font-bold text-neutral-900">
              Operational Recommendation
            </h3>

            <p className="mt-4 text-sm leading-8 text-neutral-600">
              {operationalObservation.recommendation}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-6">
            <h3 className="text-lg font-bold text-neutral-900">
              Forecast Recommendation
            </h3>

            <p className="mt-4 text-sm leading-8 text-neutral-600">
              {forecastObservation.recommendation}
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}