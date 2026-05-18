"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

import {
  getFactoryLossIntelligenceEntries,
  getPostOrderIntelligenceEntries,
  getProductionLogs,
  getWastageLogs,
  getMaintenanceLogs,
} from "@/lib/software/firestoreService";

import { generatePredictiveExecutiveSummary } from "@/lib/software/predictiveIntelligence";
import { generateExecutiveAnomalySummary } from "@/lib/software/anomalyDetection";
import { generateExecutiveRootCauseSummary } from "@/lib/software/rootCauseIntelligence";

type RecordType = Record<string, any>;
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ExecutiveAnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [factoryLossData, setFactoryLossData] = useState<RecordType[]>([]);
  const [postOrderData, setPostOrderData] = useState<RecordType[]>([]);
  const [productionData, setProductionData] = useState<RecordType[]>([]);
  const [wastageData, setWastageData] = useState<RecordType[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<RecordType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const factoryId = "demo-factory";

        const [loss, postOrder, production, wastage, maintenance] =
          await Promise.all([
            getFactoryLossIntelligenceEntries(factoryId),
            getPostOrderIntelligenceEntries(factoryId),
            getProductionLogs(factoryId),
            getWastageLogs(factoryId),
            getMaintenanceLogs(factoryId),
          ]);

        setFactoryLossData(loss);
        setPostOrderData(postOrder);
        setProductionData(production);
        setWastageData(wastage);
        setMaintenanceData(maintenance);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalEstimatedLoss = useMemo(() => {
    return factoryLossData.reduce(
      (sum, item) => sum + Number(item.estimatedLossValue || 0),
      0
    );
  }, [factoryLossData]);

  const totalRecoveryOpportunity = useMemo(() => {
    return (
      factoryLossData.reduce(
        (sum, item) => sum + Number(item.recoveryOpportunityValue || 0),
        0
      ) +
      postOrderData.reduce(
        (sum, item) => sum + Number(item.recoveryValue || 0),
        0
      )
    );
  }, [factoryLossData, postOrderData]);

  const totalRejections = useMemo(() => {
    return postOrderData.reduce(
      (sum, item) => sum + Number(item.rejectedQty || 0),
      0
    );
  }, [postOrderData]);

  const totalWastage = useMemo(() => {
    return wastageData.reduce(
      (sum, item) => sum + Number(item.wastageQty || 0),
      0
    );
  }, [wastageData]);

  const productionEfficiencyAverage = useMemo(() => {
    if (productionData.length === 0) return 0;

    const total = productionData.reduce(
      (sum, item) => sum + Number(item.efficiencyPercent || 0),
      0
    );

    return Math.round(total / productionData.length);
  }, [productionData]);

  const productionDelayRisk = useMemo(() => {
    return productionData.reduce(
      (sum, item) => sum + Number(item.delayPercent || 0),
      0
    );
  }, [productionData]);

  const inventoryAgeingAlerts = useMemo(() => {
    return postOrderData.filter(
      (item) => Number(item.inventoryAgeingDays || 0) > 90
    ).length;
  }, [postOrderData]);

  const machineBreakdownRisk = useMemo(() => {
    return maintenanceData.reduce(
      (sum, item) => sum + Number(item.breakdownCount || 0),
      0
    );
  }, [maintenanceData]);

  const predictiveSummary = useMemo(() => {
    return generatePredictiveExecutiveSummary({
      productionEfficiency: productionEfficiencyAverage,
      productionDelayRisk,
      inventoryAgeingAlerts,
      machineBreakdownRisk,
      totalRejections,
      totalWastage,
      totalEstimatedLoss,
    });
  }, [
    productionEfficiencyAverage,
    productionDelayRisk,
    inventoryAgeingAlerts,
    machineBreakdownRisk,
    totalRejections,
    totalWastage,
    totalEstimatedLoss,
  ]);

  const anomalySummary = useMemo(() => {
    return generateExecutiveAnomalySummary({
      totalEstimatedLoss,
      totalRejections,
      totalWastage,
      machineBreakdownRisk,
      inventoryAgeingAlerts,
      productionEfficiency: productionEfficiencyAverage,
    });
  }, [
    totalEstimatedLoss,
    totalRejections,
    totalWastage,
    machineBreakdownRisk,
    inventoryAgeingAlerts,
    productionEfficiencyAverage,
  ]);

  const rootCauseSummary = useMemo(() => {
    return generateExecutiveRootCauseSummary({
      productionEfficiency: productionEfficiencyAverage,
      productionDelayRisk,
      machineBreakdownRisk,
      totalWastage,
      totalRejections,
      inventoryAgeingAlerts,
      totalEstimatedLoss,
    });
  }, [
    productionEfficiencyAverage,
    productionDelayRisk,
    machineBreakdownRisk,
    totalWastage,
    totalRejections,
    inventoryAgeingAlerts,
    totalEstimatedLoss,
  ]);

  if (loading) {
    return (
      <DashboardShell title="Executive Analytics Dashboard">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-lg font-semibold">
          Loading analytics intelligence...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Executive Analytics Dashboard">
      <div className="space-y-8">
        <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-700">
            MBNCON VISUAL EXECUTIVE INTELLIGENCE
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Executive Analytics Dashboard
          </h1>

          <p className="mt-4 max-w-5xl text-slate-600">
            Visual operational intelligence showing production efficiency,
            operational loss, recovery opportunity, rejection exposure, wastage
            trends, predictive risk, anomaly detection, root-cause intelligence
            and management performance.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-4">
          <AnalyticsCard title="Estimated Total Loss" value={`$${totalEstimatedLoss.toLocaleString()}`} />
          <AnalyticsCard title="Recovery Opportunity" value={`$${totalRecoveryOpportunity.toLocaleString()}`} />
          <AnalyticsCard title="Rejected Quantity" value={String(totalRejections)} />
          <AnalyticsCard title="Production Efficiency" value={`${productionEfficiencyAverage}%`} />
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          <AnalyticsCard title="Detected Anomalies" value={String(anomalySummary.detectedCount)} />
          <AnalyticsCard title="Critical Anomalies" value={String(anomalySummary.criticalCount)} />
          <AnalyticsCard title="Root Cause Criticals" value={String(rootCauseSummary.criticalFindings)} />
          <AnalyticsCard title="Overall Predictive Risk" value={`${predictiveSummary.overallRisk}%`} />
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          <AnalyticsCard title="Predicted Shipment Delay" value={`${predictiveSummary.shipmentDelayRisk}%`} />
          <AnalyticsCard title="Predicted Inventory Risk" value={`${predictiveSummary.inventoryRisk}%`} />
          <AnalyticsCard title="Predicted Rejection Risk" value={`${predictiveSummary.rejectionRisk}%`} />
          <AnalyticsCard title="Profitability Risk" value={`${predictiveSummary.profitabilityRisk}%`} />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <ChartBox title="Operational Loss Trend" value={totalEstimatedLoss} maxValue={1000000} color="bg-red-500" />
          <ChartBox title="Recovery Opportunity Trend" value={totalRecoveryOpportunity} maxValue={1000000} color="bg-emerald-500" />
          <ChartBox title="Production Efficiency Trend" value={productionEfficiencyAverage} maxValue={100} color="bg-cyan-500" />
          <ChartBox title="Material Wastage Exposure" value={totalWastage} maxValue={10000} color="bg-amber-500" />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <InsightPanel
            title="AI Root Cause Findings"
            items={rootCauseSummary.findings.map(
              (item) => `${item.severity} — ${item.category}: ${item.rootCause}`
            )}
          />

          <InsightPanel
            title="Anomaly Detection Alerts"
            items={anomalySummary.anomalies.map(
              (item) => `${item.severity}: ${item.message}`
            )}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <InsightPanel
            title="Predictive Risk Intelligence"
            items={[
              `Predicted shipment delay risk: ${predictiveSummary.shipmentDelayRisk}%.`,
              `Predicted inventory risk: ${predictiveSummary.inventoryRisk}%.`,
              `Predicted rejection risk: ${predictiveSummary.rejectionRisk}%.`,
              `Predicted profitability risk: ${predictiveSummary.profitabilityRisk}%.`,
              `Overall predictive risk: ${predictiveSummary.overallRisk}%.`,
            ]}
          />

          <InsightPanel
            title="Executive Intelligence Highlights"
            items={[
              `Estimated operational loss exposure is $${totalEstimatedLoss.toLocaleString()}.`,
              `Recovery opportunity identified: $${totalRecoveryOpportunity.toLocaleString()}.`,
              `Production efficiency currently averaging ${productionEfficiencyAverage}%.`,
              `Rejected quantity exposure currently ${totalRejections}.`,
            ]}
          />
        </section>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-900">
            AI Operational Forecast
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            {predictiveSummary.operationalForecast}
          </p>
        </div>

        <div className="rounded-3xl border border-purple-200 bg-purple-50 p-8">
          <h2 className="text-2xl font-bold text-purple-900">
            AI Root Cause Executive Conclusion
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            {rootCauseSummary.executiveConclusion}
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h2 className="text-2xl font-bold text-amber-900">
            AI Anomaly Observation
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            {anomalySummary.overallStatus}
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

function AnalyticsCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      onClick={() => {
        window.location.href = `#${slugify(title)}`;
      }}
      className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-4 text-xs text-slate-400">
        Click to explore intelligence
      </p>
    </div>
  );
}
  

function ChartBox({
  title,
  value,
  maxValue,
  color,
}: {
  title: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div
  id={slugify(title)}
  className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="text-sm font-semibold text-slate-500">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="mt-8 h-6 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-6 text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function InsightPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div
  id={slugify(title)}
  className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}