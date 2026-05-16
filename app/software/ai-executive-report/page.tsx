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

import {
  calculateExecutiveHealthScore,
} from "@/lib/software/executiveScoring";

type RecordType = Record<string, any>;

export default function AiExecutiveReportPage() {
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

        const [
          loss,
          postOrder,
          production,
          wastage,
          maintenance,
        ] = await Promise.all([
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
      (sum, item) =>
        sum + Number(item.estimatedLossValue || 0),
      0
    );
  }, [factoryLossData]);

  const totalRecoveryOpportunity = useMemo(() => {
    return (
      factoryLossData.reduce(
        (sum, item) =>
          sum +
          Number(item.recoveryOpportunityValue || 0),
        0
      ) +
      postOrderData.reduce(
        (sum, item) =>
          sum + Number(item.recoveryValue || 0),
        0
      )
    );
  }, [factoryLossData, postOrderData]);

  const totalReworkExposure = useMemo(() => {
    return postOrderData.reduce(
      (sum, item) =>
        sum + Number(item.reworkCost || 0),
      0
    );
  }, [postOrderData]);

  const totalRejectionExposure = useMemo(() => {
    return postOrderData.reduce(
      (sum, item) =>
        sum + Number(item.rejectedQty || 0),
      0
    );
  }, [postOrderData]);

  const criticalLossAreas = useMemo(() => {
    return factoryLossData.filter(
      (item) =>
        item.priorityLevel === "Critical"
    ).length;
  }, [factoryLossData]);

  const inventoryAgeingAlerts = useMemo(() => {
    return postOrderData.filter(
      (item) =>
        Number(item.inventoryAgeingDays || 0) > 90
    ).length;
  }, [postOrderData]);

  const machineBreakdownRisk = useMemo(() => {
    return maintenanceData.reduce(
      (sum, item) =>
        sum + Number(item.breakdownCount || 0),
      0
    );
  }, [maintenanceData]);

  const productionDelayRisk = useMemo(() => {
    return productionData.reduce(
      (sum, item) =>
        sum + Number(item.delayPercent || 0),
      0
    );
  }, [productionData]);

  const totalWastage = useMemo(() => {
    return wastageData.reduce(
      (sum, item) =>
        sum + Number(item.wastageQty || 0),
      0
    );
  }, [wastageData]);

  const executiveScore = useMemo(() => {
    return calculateExecutiveHealthScore({
      totalEstimatedLoss,
      totalRecoveryOpportunity,

      productionDelayRisk,
      inventoryAgeingAlerts,

      machineBreakdownRisk,
      totalWastage,

      totalReworkExposure,
      totalRejectionExposure,

      criticalLossAreas,
    });
  }, [
    totalEstimatedLoss,
    totalRecoveryOpportunity,
    productionDelayRisk,
    inventoryAgeingAlerts,
    machineBreakdownRisk,
    totalWastage,
    totalReworkExposure,
    totalRejectionExposure,
    criticalLossAreas,
  ]);

  const aiExecutiveSummary = useMemo(() => {
    if (executiveScore.finalScore < 40) {
      return "Factory operations are under critical operational and financial stress. Immediate executive intervention, inventory recovery, and operational restructuring are required.";
    }

    if (executiveScore.finalScore < 55) {
      return "Factory operations show high operational risk. Strong management focus is required on inventory, rework, wastage, and production stability.";
    }

    if (executiveScore.finalScore < 70) {
      return "Factory operations remain moderately stable but require tighter operational discipline and recovery monitoring.";
    }

    if (executiveScore.finalScore < 85) {
      return "Factory operational performance is generally stable with manageable recovery exposure.";
    }

    return "Factory operational performance is strong with healthy recovery capability and operational control.";
  }, [executiveScore.finalScore]);

  if (loading) {
    return (
      <DashboardShell title="AI Executive Report">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-lg font-semibold">
          Generating executive intelligence report...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="AI Executive Report">
      <div className="space-y-8">
        <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-700">
            MBNCON AI EXECUTIVE REPORTING SYSTEM
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            AI Executive Recovery Report
          </h1>

          <p className="mt-4 max-w-5xl text-slate-600">
            AI-generated executive operational recovery
            analysis combining production intelligence,
            loss exposure, recovery opportunity, shipment
            risk, maintenance risk and operational scoring.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-4">
          <ReportCard
            title="Factory Health Score"
            value={`${executiveScore.finalScore}/100`}
          />

          <ReportCard
            title="Executive Grade"
            value={executiveScore.grade}
          />

          <ReportCard
            title="Operational Status"
            value={executiveScore.status}
          />

          <ReportCard
            title="Recovery Score"
            value={`${executiveScore.recoveryScore}%`}
          />
        </section>

        <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-8">
          <h2 className="text-2xl font-bold text-indigo-900">
            AI Executive Summary
          </h2>

          <p className="mt-6 text-lg leading-9 text-slate-700">
            {aiExecutiveSummary}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <InsightPanel
            title="Operational Risk Intelligence"
            items={[
              `Critical Loss Areas: ${criticalLossAreas}`,
              `Production Delay Exposure: ${productionDelayRisk}`,
              `Inventory Ageing Alerts: ${inventoryAgeingAlerts}`,
              `Machine Breakdown Frequency: ${machineBreakdownRisk}`,
              `Material Wastage Quantity: ${totalWastage}`,
            ]}
          />

          <InsightPanel
            title="Recovery Opportunity Intelligence"
            items={[
              `Estimated Total Loss: $${totalEstimatedLoss.toLocaleString()}`,
              `Estimated Recovery Opportunity: $${totalRecoveryOpportunity.toLocaleString()}`,
              `Rework Exposure: $${totalReworkExposure.toLocaleString()}`,
              `Rejected Quantity Exposure: ${totalRejectionExposure}`,
            ]}
          />
        </section>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h2 className="text-2xl font-bold text-amber-900">
            Executive Action Priorities
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Reduce inventory ageing and dead stock exposure.",
              "Strengthen material ordering discipline.",
              "Improve production planning and shipment coordination.",
              "Reduce rejection and rework exposure.",
              "Improve maintenance response and preventive maintenance.",
              "Launch executive recovery review meetings.",
              "Strengthen accountability across departments.",
              "Improve operational reporting frequency.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-amber-200 bg-white p-4"
              >
                <p className="font-medium text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ReportCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </h2>
    </div>
  );
}

function InsightPanel({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-slate-700">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}