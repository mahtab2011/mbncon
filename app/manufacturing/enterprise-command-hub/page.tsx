"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  subscribeEnterpriseKpi,
  EnterpriseKpi,
} from "../../../lib/gpa/liveKpiEngine";

import { calculateFactoryHealth } from "../../../lib/gpa/factoryHealthEngine";

import { buildExecutiveAlerts } from "../../../lib/gpa/executiveAlertEngine";

import { buildExecutiveRecommendations } from "../../../lib/gpa/executiveRecommendationEngine";

import { calculateProductionRisk } from "../../../lib/gpa/productionRiskEngine";

import { detectEnterpriseBottleneck } from "../../../lib/gpa/bottleneckDetectionEngine";

import { calculateEnterpriseLineBalancing } from "../../../lib/gpa/lineBalancingEngine";

import { calculateOperatorProductivity } from "../../../lib/gpa/operatorProductivityEngine";

import { buildEnterpriseNotifications } from "../../../lib/gpa/enterpriseNotificationEngine";

import {
  aggregateEnterpriseKpis,
  FactoryKpiInput,
} from "../../../lib/gpa/enterpriseKpiAggregator";

import CEOCockpit from "../../components/gpa/CEOCockpit";

import FactoryRankingPanel from "../../components/gpa/FactoryRankingPanel";

import {
  rankFactories,
} from "../../../lib/gpa/factoryRankingEngine";
import ExecutiveHeatMapPanel from "../../components/gpa/ExecutiveHeatMapPanel";

import {
  buildExecutiveHeatMap,
} from "../../../lib/gpa/executiveHeatMapEngine";
import CrossFactoryComparisonPanel from "../../components/gpa/CrossFactoryComparisonPanel";

import {
  buildCrossFactoryComparison,
} from "../../../lib/gpa/crossFactoryComparisonEngine";
import CeoMorningBriefPanel from "../../components/gpa/CeoMorningBriefPanel";

import {
  buildCeoMorningBrief,
} from "../../../lib/gpa/ceoMorningBriefEngine";
import ExecutiveDrillDownPanel from "../../components/gpa/ExecutiveDrillDownPanel";

import {
  buildExecutiveDrillDown,
} from "../../../lib/gpa/executiveDrillDownEngine";
import {
  subscribeEnterpriseFactories,
} from "../../../lib/gpa/liveEnterpriseFactoryEngine";

import {
  EnterpriseFactoryRecord,
} from "../../../lib/gpa/enterpriseFactoryRepository";
import EnterpriseHealthTrendPanel from "../../components/gpa/EnterpriseHealthTrendPanel";

import {
  calculateEnterpriseHealthTrend,
} from "../../../lib/gpa/enterpriseHealthTrendEngine";
import PredictiveFactoryHealthPanel from "../../components/gpa/PredictiveFactoryHealthPanel";

import {
  predictFactoryHealth,
} from "../../../lib/gpa/predictiveFactoryHealthEngine";
import ShipmentDelayPredictorPanel from "../../components/gpa/ShipmentDelayPredictorPanel";

import {
  predictShipmentDelay,
} from "../../../lib/gpa/shipmentDelayPredictorEngine";
import ExecutiveScorePanel from "../../components/gpa/ExecutiveScorePanel";

import {
  calculateExecutiveScore,
} from "../../../lib/gpa/enterpriseExecutiveScoreEngine";
import EnterpriseLeaderboardPanel from "../../components/gpa/EnterpriseLeaderboardPanel";

import {
  buildEnterpriseLeaderboard,
} from "../../../lib/gpa/enterpriseLeaderboardEngine";

export default function EnterpriseCommandHubPage() {
  const [kpi, setKpi] = useState<EnterpriseKpi>({
    factories: 0,
    production: 0,
    efficiency: 0,
    quality: 0,
    cutting: 0,
    fabric: 0,
    shipment: 0,
    maintenance: 0,
    oee: 0,
    factoryHealth: 0,
  });
const [enterpriseFactories, setEnterpriseFactories] =
  useState<EnterpriseFactoryRecord[]>([]);
  useEffect(() => {
    const unsubscribe = subscribeEnterpriseKpi((data) => {
      setKpi(data);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
  const unsubscribe =
    subscribeEnterpriseFactories(
      (factories) => {
        setEnterpriseFactories(factories);
      }
    );

  return () => unsubscribe();
}, []);

  const health = calculateFactoryHealth(kpi);

  const demoFactoryKpiData: FactoryKpiInput[] = [
    {
      factoryId: "factory-001",
      factoryName: "BGMEA Pilot Factory 01",
      production: kpi.production,
      efficiency: kpi.efficiency,
      quality: kpi.quality,
      cutting: kpi.cutting,
      fabric: kpi.fabric,
      shipment: kpi.shipment,
      maintenance: kpi.maintenance,
      oee: kpi.oee,
      factoryHealth: health.score,
    },
    {
      factoryId: "factory-002",
      factoryName: "BGMEA Pilot Factory 02",
      production: 84,
      efficiency: 81,
      quality: 78,
      cutting: 80,
      fabric: 76,
      shipment: 74,
      maintenance: 82,
      oee: 79,
      factoryHealth: 78,
    },
    {
      factoryId: "factory-003",
      factoryName: "BGMEA Pilot Factory 03",
      production: 71,
      efficiency: 69,
      quality: 72,
      cutting: 68,
      fabric: 70,
      shipment: 65,
      maintenance: 73,
      oee: 67,
      factoryHealth: 69,
    },
  ];
const factoryKpiData: FactoryKpiInput[] =
  enterpriseFactories.length > 0
    ? enterpriseFactories.map((factory): FactoryKpiInput => ({
        factoryId: factory.factoryId,
        factoryName: factory.factoryName,
        production: factory.production,
        efficiency: factory.efficiency,
        quality: factory.quality,
        cutting: factory.cutting,
        fabric: factory.fabric,
        shipment: factory.shipment,
        maintenance: factory.maintenance,
        oee: factory.oee,
        factoryHealth: factory.factoryHealth,
      }))
    : demoFactoryKpiData;
  const enterpriseSummary = aggregateEnterpriseKpis(factoryKpiData);
  
  const rankedFactories =
  rankFactories(
    factoryKpiData.map((factory) => ({
      factoryId: factory.factoryId,
      factoryName: factory.factoryName,
      health: factory.factoryHealth,
      production: factory.production,
      efficiency: factory.efficiency,
      quality: factory.quality,
      oee: factory.oee,
    }))
  );
  const executiveHeatMap = buildExecutiveHeatMap(
  factoryKpiData.map((factory) => ({
    factoryId: factory.factoryId,
    factoryName: factory.factoryName,
    health: factory.factoryHealth,
  }))
);
const crossFactoryComparison =
  buildCrossFactoryComparison(
    factoryKpiData.map((factory) => ({
      factoryId: factory.factoryId,
      factoryName: factory.factoryName,
      production: factory.production,
      efficiency: factory.efficiency,
      quality: factory.quality,
      oee: factory.oee,
      health: factory.factoryHealth,
    }))
  );
  const ceoMorningBrief = buildCeoMorningBrief({
  totalFactories: enterpriseSummary.totalFactories,
  healthyFactories: enterpriseSummary.healthyFactories,
  riskFactories: enterpriseSummary.riskFactories,
  averageHealth: enterpriseSummary.avgFactoryHealth,
  bestFactory:
    crossFactoryComparison.healthiestFactory.factoryName,
  topProduction:
    crossFactoryComparison.bestProduction.production,
});

  const selectedFactoryData = factoryKpiData[0];
  const executiveDrillDown = buildExecutiveDrillDown({
  factoryId: selectedFactoryData.factoryId,
  factoryName: selectedFactoryData.factoryName,
  production: selectedFactoryData.production,
  efficiency: selectedFactoryData.efficiency,
  quality: selectedFactoryData.quality,
  oee: selectedFactoryData.oee,
  shipment: selectedFactoryData.shipment,
  maintenance: selectedFactoryData.maintenance,
  health: selectedFactoryData.factoryHealth,
});
const enterpriseHealthTrend =
  calculateEnterpriseHealthTrend([
    {
      timestamp: "Yesterday",
      health: Math.max(
        enterpriseSummary.avgFactoryHealth - 2,
        0
      ),
    },
    {
      timestamp: "Today",
      health: enterpriseSummary.avgFactoryHealth,
    },
  ]);
const predictiveHealth =
  predictFactoryHealth({
    currentHealth:
      enterpriseSummary.avgFactoryHealth,
    trendChange:
      enterpriseHealthTrend.change,
  });
  const shipmentPrediction =
  predictShipmentDelay({
    shipmentReadiness:
      enterpriseSummary.avgShipment,
    production:
      enterpriseSummary.avgProduction,
    quality:
      enterpriseSummary.avgQuality,
  });
  const executiveScore =
  calculateExecutiveScore({
    production: enterpriseSummary.avgProduction,
    efficiency: enterpriseSummary.avgEfficiency,
    quality: enterpriseSummary.avgQuality,
    shipment: enterpriseSummary.avgShipment,
    health: enterpriseSummary.avgFactoryHealth,
  });
  const enterpriseLeaderboard =
  buildEnterpriseLeaderboard(
    factoryKpiData.map((factory) => ({
      factoryId: factory.factoryId,
      factoryName: factory.factoryName,
      executiveScore: Math.round(
        (
          factory.production +
          factory.efficiency +
          factory.quality +
          factory.shipment +
          factory.factoryHealth
        ) / 5
      ),
    }))
  );
  const alerts = buildExecutiveAlerts(kpi);
  const recommendations = buildExecutiveRecommendations(alerts);

  const productionRisk = calculateProductionRisk({
    production: kpi.production,
    efficiency: kpi.efficiency,
    quality: kpi.quality,
    factoryHealth: health.score,
  });

  const bottleneck = detectEnterpriseBottleneck(
    kpi.efficiency,
    kpi.cutting,
    kpi.fabric,
    kpi.shipment
  );

  const lineBalancing = calculateEnterpriseLineBalancing(
    kpi.efficiency,
    kpi.quality,
    kpi.production
  );

  const operatorProductivity = calculateOperatorProductivity(
    kpi.production,
    kpi.efficiency,
    kpi.quality
  );

  const notifications = buildEnterpriseNotifications(
    productionRisk.riskLevel,
    bottleneck.area,
    lineBalancing.status,
    operatorProductivity.status
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            BGMEA Pilot RC1-A06
          </p>

          <h1 className="mt-2 text-4xl font-bold text-blue-700">
            GPA Enterprise Command Hub
          </h1>

          <p className="mt-2 max-w-4xl text-gray-600">
            Unified executive command centre combining factory health,
            production risk, bottlenecks, cutting, fabric, shipment,
            alerts and AI recommendations.
          </p>
        </div>

        
      </div>

      <section className="mb-8 rounded-2xl bg-slate-900 p-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Enterprise Status
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {enterpriseSummary.enterpriseStatus}
            </h2>

            <p className="mt-2 text-slate-300">
              {enterpriseSummary.totalFactories} factories monitored •{" "}
              {enterpriseSummary.healthyFactories} healthy •{" "}
              {enterpriseSummary.riskFactories} at risk
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4 text-right">
            <p className="text-sm text-slate-300">Average Factory Health</p>
            <p className="text-4xl font-bold">
              {enterpriseSummary.avgFactoryHealth}%
            </p>
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Factory Health" value={`${health.score}%`} />
        <Card title="Factories" value={enterpriseSummary.totalFactories.toString()} />
        <Card title="Avg Production" value={`${enterpriseSummary.avgProduction}%`} />
        <Card title="Avg OEE" value={`${enterpriseSummary.avgOee}%`} />
      </div>

      <div className="mb-8">
        <CEOCockpit
          factoryHealth={health.score}
          productionRisk={productionRisk.riskLevel}
          bottleneck={bottleneck.area}
          lineBalancing={lineBalancing.score}
          operatorProductivity={operatorProductivity.score}
          executiveAlerts={alerts.length}
          executiveRecommendations={recommendations.length}
        />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Enterprise Factory Health
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card title="Health Score" value={`${health.score}%`} />
          <Card title="Enterprise Status" value={health.signal} />
          <Card title="AI Summary" value={health.summary} />
        </div>
      </section>

      <section className="mb-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-slate-800">
          Selected Factory Snapshot
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current view: {selectedFactoryData.factoryName}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Production" value={`${selectedFactoryData.production}%`} />
          <Card title="Efficiency" value={`${selectedFactoryData.efficiency}%`} />
          <Card title="Quality" value={`${selectedFactoryData.quality}%`} />
          <Card title="Shipment" value={`${selectedFactoryData.shipment}%`} />
        </div>
      </section>

      <section className="mb-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-slate-800">
          Multi-Factory Performance Table
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="p-3">Factory</th>
                <th className="p-3">Production</th>
                <th className="p-3">Efficiency</th>
                <th className="p-3">Quality</th>
                <th className="p-3">Shipment</th>
                <th className="p-3">OEE</th>
                <th className="p-3">Health</th>
              </tr>
            </thead>

            <tbody>
              {factoryKpiData.map((factory) => (
                <tr key={factory.factoryId} className="border-b">
                  <td className="p-3 font-semibold text-slate-800">
                    {factory.factoryName}
                  </td>
                  <td className="p-3">{factory.production}%</td>
                  <td className="p-3">{factory.efficiency}%</td>
                  <td className="p-3">{factory.quality}%</td>
                  <td className="p-3">{factory.shipment}%</td>
                  <td className="p-3">{factory.oee}%</td>
                  <td className="p-3 font-bold">{factory.factoryHealth}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

<FactoryRankingPanel
  factories={rankedFactories}
/>
<div className="mt-8">
  <ExecutiveHeatMapPanel
    factories={executiveHeatMap}
  />
  <div className="mt-8">
  <CrossFactoryComparisonPanel
    comparison={crossFactoryComparison}
  />
  <div className="mt-8">
  <CeoMorningBriefPanel
    brief={ceoMorningBrief}
  />
  <div className="mt-8">
  <ExecutiveDrillDownPanel
    factory={executiveDrillDown}
  />
  <div className="mt-8">
  <EnterpriseHealthTrendPanel
    trend={enterpriseHealthTrend}
  />
  <div className="mt-8">
  <PredictiveFactoryHealthPanel
    prediction={predictiveHealth}
  />
  <div className="mt-8">
  <ShipmentDelayPredictorPanel
    prediction={shipmentPrediction}
  />
  <div className="mt-8">
  <ExecutiveScorePanel
    score={executiveScore}
  />
  <div className="mt-8">
  <EnterpriseLeaderboardPanel
    entries={enterpriseLeaderboard}
  />
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-blue-700">
          Operational Intelligence Cards
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <IntelligenceCard
            title="Production Risk"
            value={`${productionRisk.score}%`}
            badge={productionRisk.riskLevel}
            message={productionRisk.message}
            tone={productionRisk.riskLevel}
          />

          <IntelligenceCard
            title="Enterprise Bottleneck"
            value={bottleneck.area}
            badge={bottleneck.severity}
            message={bottleneck.recommendation}
            tone={bottleneck.severity}
          />

          <IntelligenceCard
            title="Line Balancing"
            value={`${lineBalancing.score}%`}
            badge={lineBalancing.status}
            message={lineBalancing.recommendation}
            tone={lineBalancing.status}
          />

          <IntelligenceCard
            title="Operator Productivity"
            value={`${operatorProductivity.score}%`}
            badge={operatorProductivity.status}
            message={operatorProductivity.recommendation}
            tone={operatorProductivity.status}
          />
        </div>
      </section>

      <section className="mb-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-slate-800">
          Enterprise Notification Centre
        </h2>

        <div className="mt-4 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border-l-4 p-4 ${
                item.level === "CRITICAL"
                  ? "border-red-600 bg-red-50"
                  : item.level === "WARNING"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-green-600 bg-green-50"
              }`}
            >
              <div className="font-bold">{item.title}</div>
              <div className="text-sm text-slate-600">{item.message}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-blue-700">
          Live Executive Alerts
        </h2>

        {alerts.length === 0 ? (
          <p className="mt-4 text-green-600">No executive alerts.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="font-bold text-red-700">
                  {alert.severity} — {alert.department}
                </h3>

                <p className="mt-2 font-semibold">{alert.title}</p>

                <p className="mt-2 text-gray-600">
                  {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Executive Priorities
        </h2>

        {recommendations.length === 0 ? (
          <p className="mt-4 text-green-600">
            No urgent executive actions required.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {recommendations.map((item, index) => (
              <div key={index} className="rounded-lg border p-4">
                <p className="font-bold text-blue-700">
                  Priority {item.priority}
                </p>

                <h3 className="mt-2 font-semibold">{item.title}</h3>

                <p className="mt-2 text-gray-600">{item.action}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          BGMEA Pilot Executive View
        </h2>

        <p className="mt-3 text-gray-700">
          This hub is becoming the main GPA demonstration screen,
          showing how live factory data is converted into executive
          decisions, risk signals and recovery actions.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <QuickLink
            title="Global Executive Dashboard"
            href="/manufacturing/global-executive-dashboard"
          />

          <QuickLink
            title="Executive Command Centre"
            href="/manufacturing/executive-command-centre"
          />

          <QuickLink
            title="Cutting Command Centre"
            href="/manufacturing/cutting-command-centre"
          />

          <QuickLink
            title="Fabric Inspection"
            href="/manufacturing/fabric-inspection"
          />
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}

function IntelligenceCard({
  title,
  value,
  badge,
  message,
  tone,
}: {
  title: string;
  value: string;
  badge: string;
  message: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      <div className="mt-4 text-3xl font-extrabold text-slate-900">
        {value}
      </div>

      <div
        className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-bold ${
          tone === "LOW" || tone === "GOOD" || tone === "EXCELLENT"
            ? "bg-green-100 text-green-700"
            : tone === "MEDIUM" || tone === "WATCH"
            ? "bg-yellow-100 text-yellow-700"
            : tone === "HIGH"
            ? "bg-orange-100 text-orange-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {badge}
      </div>

      <p className="mt-4 text-sm text-slate-600">{message}</p>
    </div>
  );
}

function QuickLink({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-white p-4 font-semibold text-blue-700 shadow hover:bg-blue-50"
    >
      {title}
    </Link>
  );
}