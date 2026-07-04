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

import { buildExecutiveDashboardUiModel } from "@/lib/manufacturing/executive/executiveDashboardUiModel";
import { executiveCommandCentreLayout } from "@/lib/manufacturing/executive/executiveCommandCentreLayout";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ExecutiveCommandCentrePage() {
  const model = buildExecutiveDashboardUiModel();
  const dashboard = model.dashboard;

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
      title: "Factory Health",
      value: `${dashboard.health.overallScore}/100`,
      change: dashboard.health.overallStatus,
      risk: dashboard.risk === "LOW" ? ("Low" as const) : ("Medium" as const),
      href: "#ai-factory-command-centre",
    },
    {
      title: "Production Efficiency",
      value: `${dashboard.health.production}%`,
      change: "+4.2% this month",
      risk: "Low" as const,
      href: "#executive-summary",
    },
    {
      title: "Buyer Readiness",
      value: `${dashboard.kpis.buyerReadiness}%`,
      change: "Strong buyer confidence",
      risk: "Low" as const,
      href: "#ai-recommendations",
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
      label: "Production",
      score: dashboard.health.production,
      href: "#ai-factory-command-centre",
    },
    {
      label: "Quality",
      score: dashboard.health.quality,
      href: "#ai-factory-command-centre",
    },
    {
      label: "Maintenance",
      score: dashboard.health.maintenance,
      href: "#ai-factory-command-centre",
    },
    {
      label: "Compliance",
      score: dashboard.health.compliance,
      href: "#ai-factory-command-centre",
    },
    {
      label: "Sustainability",
      score: dashboard.health.sustainability,
      href: "#ai-factory-command-centre",
    },
    {
      label: "Commercial",
      score: dashboard.health.commercial,
      href: "#ai-factory-command-centre",
    },
  ];

  return (
    <DashboardShell
      title="Executive Command Centre"
      subtitle="MBNCON AI Factory OS executive briefing, factory health, KPI intelligence, risks, opportunities, and AI recommendations."
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
        className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-2 lg:grid-cols-3"
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
        id="ai-factory-command-centre"
        className="mt-10 scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              MBNCON AI Factory OS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-neutral-950">
              {model.pageTitle}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
              {dashboard.morningBriefing.executiveMessage}
            </p>

            <p className="mt-3 text-xs text-neutral-400">
              Generated at: Executive session   
            </p>
          </div>

          <div className="rounded-3xl bg-neutral-950 p-6 text-white">
            <p className="text-sm uppercase tracking-widest text-emerald-300">
              Factory Health
            </p>

            <p className="mt-3 text-6xl font-bold">
              {dashboard.health.overallScore}
            </p>

            <p className="mt-2 text-sm text-neutral-300">
              Status: {dashboard.health.overallStatus}
            </p>

            <p className="mt-1 text-sm text-neutral-300">
              Enterprise Risk: {dashboard.risk}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.morningBriefing.todaysFocus.map((focus) => (
            <div
              key={focus}
              className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700"
            >
              {focus}
            </div>
          ))}
        </div>
      </section>

      <section
        id="executive-live-kpis"
        className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        <MiniKpi
          title="First Pass Yield"
          value={`${dashboard.kpis.firstPassYield}%`}
        />

        <MiniKpi
          title="On-Time Delivery"
          value={`${dashboard.kpis.onTimeDelivery}%`}
        />

        <MiniKpi
          title="Machine Availability"
          value={`${dashboard.kpis.machineAvailability}%`}
        />

        <MiniKpi
          title="Sustainability Score"
          value={`${dashboard.kpis.sustainabilityScore}%`}
        />
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
        {dashboard.alerts.map((alert) => (
          <div
            key={alert.alertId}
            className="transition hover:-translate-y-1 hover:scale-[1.01]"
          >
            <AlertPanel
              title={alert.title}
              message={alert.message}
              severity={
                alert.level === "CRITICAL"
                  ? "danger"
                  : alert.level === "WARNING"
                  ? "warning"
                  : "info"
              }
            />
          </div>
        ))}
      </section>

      <section
        id="ai-recommendations"
        className="mt-10 grid scroll-mt-28 gap-6 lg:grid-cols-2"
      >
        <ExecutivePanel title="Today&apos;s Priorities">
          {dashboard.priorities.map((priority) => (
            <div
              key={priority.priority}
              className="rounded-2xl bg-neutral-50 p-5"
            >
              <p className="text-sm font-bold text-neutral-900">
                {priority.priority}. {priority.action}
              </p>

              <p className="mt-2 text-xs text-neutral-500">
                Area: {priority.responsibleArea} | Urgency:{" "}
                {priority.urgency}
              </p>
            </div>
          ))}
        </ExecutivePanel>

        <ExecutivePanel title="Improvement Opportunities">
          {dashboard.opportunities.map((opportunity) => (
            <div
              key={opportunity.title}
              className="rounded-2xl bg-neutral-50 p-5"
            >
              <p className="text-sm font-bold text-neutral-900">
                {opportunity.title}
              </p>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                {opportunity.estimatedBenefit}
              </p>

              <p className="mt-2 text-xs font-semibold text-emerald-700">
                Priority: {opportunity.priority}
              </p>
            </div>
          ))}
        </ExecutivePanel>

        <ExecutivePanel title="AI Recommendations">
          {dashboard.recommendations.map((recommendation) => (
            <div
              key={recommendation.recommendationId}
              className="rounded-2xl bg-neutral-50 p-5"
            >
              <p className="text-sm font-bold text-neutral-900">
                {recommendation.title}
              </p>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                {recommendation.recommendation}
              </p>

              <p className="mt-2 text-xs font-semibold text-cyan-700">
                Impact: {recommendation.expectedImpact}
              </p>
            </div>
          ))}
        </ExecutivePanel>

        <ExecutivePanel title="Command Centre Layout Registry">
          {executiveCommandCentreLayout.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700"
            >
              {card.displayOrder}. {card.title} — {card.width}
            </div>
          ))}
        </ExecutivePanel>
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
      </section>
    </DashboardShell>
  );
}

function MiniKpi({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-neutral-50">
      <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
        {title}
      </p>

      <p className="mt-4 text-4xl font-bold text-neutral-950">
        {value}
      </p>
    </div>
  );
}

function ExecutivePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-950">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {children}
      </div>
    </section>
  );
}