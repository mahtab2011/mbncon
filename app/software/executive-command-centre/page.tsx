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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const kpiCards = [
    {
      title: "Production Efficiency",
      value: "88%",
      change: "+4.2% this month",
      risk: "Low" as const,
      href: "#executive-summary",
    },
    {
      title: "Shipment Stability",
      value: "92%",
      change: "Strong delivery trend",
      risk: "Low" as const,
      href: "#forecast-intelligence",
    },
    {
      title: "Operational Risk",
      value: String(operationalRisk.score),
      change: operationalRisk.level,
      risk: operationalRisk.level,
      href: "#operational-alerts",
    },
    {
      title: "Forecast Accuracy",
      value: `${productionForecast.averageAccuracy}%`,
      change: productionForecast.trend,
      risk: productionForecast.riskLevel,
      href: "#forecast-intelligence",
    },
  ];

  const scoreCards = [
    {
      label: "Operational Score",
      score: Math.round(performance.score),
      href: "#executive-summary",
    },
    {
      label: "Forecast Accuracy",
      score: Math.round(productionForecast.averageAccuracy),
      href: "#forecast-intelligence",
    },
    {
      label: "Risk Stability",
      score: operationalRisk.score,
      href: "#operational-alerts",
    },
  ];

  return (
    <DashboardShell
      title="Executive Command Centre"
      subtitle="AI-assisted manufacturing intelligence, operational forecasting, executive scoring, and consultancy decision-support system."
    >
      <section
        id="command-centre-kpis"
        className="grid scroll-mt-28 gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {kpiCards.map((card) => (
          <div
            key={card.title}
            onClick={() => {
              window.location.href = card.href;
            }}
            id={slugify(card.title)}
            className="cursor-pointer scroll-mt-28 transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <KpiCard
              title={card.title}
              value={card.value}
              change={card.change}
              risk={card.risk}
            />
          </div>
        ))}
      </section>

      <section
        id="score-intelligence"
        className="mt-10 grid scroll-mt-28 gap-6 lg:grid-cols-3"
      >
        {scoreCards.map((card) => (
          <div
            key={card.label}
            onClick={() => {
              window.location.href = card.href;
            }}
            id={slugify(card.label)}
            className="cursor-pointer scroll-mt-28 transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <ScoreRing label={card.label} score={card.score} />
          </div>
        ))}
      </section>

      <section
        id="forecast-intelligence"
        className="mt-10 scroll-mt-28 transition hover:-translate-y-1 hover:scale-[1.01]"
      >
        <ForecastCard
          title="Production Forecast Intelligence"
          current="91%"
          forecast={`${productionForecast.nextForecast}%`}
          accuracy={`${productionForecast.averageAccuracy}%`}
          note={productionForecast.recommendation}
        />
      </section>

      <section
        id="operational-alerts"
        className="mt-10 grid scroll-mt-28 gap-6 lg:grid-cols-2"
      >
        <div className="transition hover:-translate-y-1 hover:scale-[1.01]">
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
        </div>

        <div className="transition hover:-translate-y-1 hover:scale-[1.01]">
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
      </section>

      <section
        id="executive-summary"
        className="mt-10 scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
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
          <div className="rounded-2xl bg-neutral-50 p-6 transition hover:-translate-y-1 hover:bg-neutral-100">
            <h3 className="text-lg font-bold text-neutral-900">
              Operational Recommendation
            </h3>

            <p className="mt-4 text-sm leading-8 text-neutral-600">
              {operationalObservation.recommendation}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-6 transition hover:-translate-y-1 hover:bg-neutral-100">
            <h3 className="text-lg font-bold text-neutral-900">
              Forecast Recommendation
            </h3>

            <p className="mt-4 text-sm leading-8 text-neutral-600">
              {forecastObservation.recommendation}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            AI Recommendation
          </p>

          <p className="mt-4 text-sm leading-8 text-neutral-700">
            Management should review operational score, forecast accuracy, risk
            stability, and production forecast together before making
            production, shipment, manpower, or corrective action decisions.
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}