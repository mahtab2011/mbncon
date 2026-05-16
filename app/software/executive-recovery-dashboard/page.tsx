"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { calculateExecutiveHealthScore } from "@/lib/software/executiveScoring";
import {
  getFactoryLossIntelligenceEntries,
  getPostOrderIntelligenceEntries,
  getProductionLogs,
  getWastageLogs,
  getMaintenanceLogs,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

export default function ExecutiveRecoveryDashboardPage() {
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
        console.error("Executive recovery dashboard load error:", error);
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

  const totalReworkExposure = useMemo(() => {
    return postOrderData.reduce(
      (sum, item) => sum + Number(item.reworkCost || 0),
      0
    );
  }, [postOrderData]);

  const totalRejectionExposure = useMemo(() => {
    return postOrderData.reduce(
      (sum, item) => sum + Number(item.rejectedQty || 0),
      0
    );
  }, [postOrderData]);

  const criticalLossAreas = useMemo(() => {
    return factoryLossData.filter((item) => item.priorityLevel === "Critical")
      .length;
  }, [factoryLossData]);

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

  const productionDelayRisk = useMemo(() => {
    return productionData.reduce(
      (sum, item) => sum + Number(item.delayPercent || 0),
      0
    );
  }, [productionData]);

  const totalWastage = useMemo(() => {
    return wastageData.reduce(
      (sum, item) => sum + Number(item.wastageQty || 0),
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

  const executiveAiRecommendation = useMemo(() => {
    if (totalEstimatedLoss > 500000 || criticalLossAreas > 5) {
      return "Critical operational recovery intervention required. Launch executive task force immediately.";
    }

    if (totalEstimatedLoss > 200000 || inventoryAgeingAlerts > 10) {
      return "High operational risk detected. Prioritise inventory recovery and loss control actions.";
    }

    if (totalEstimatedLoss > 100000 || productionDelayRisk > 50) {
      return "Moderate operational instability detected. Strengthen monitoring and departmental accountability.";
    }

    return "Operational recovery risk currently manageable.";
  }, [
    totalEstimatedLoss,
    criticalLossAreas,
    inventoryAgeingAlerts,
    productionDelayRisk,
  ]);

  if (loading) {
    return (
      <DashboardShell title="Executive Recovery Dashboard">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-lg font-semibold">
          Loading executive intelligence...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Executive Recovery Dashboard">
      <div className="space-y-8">
        <div className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON EXECUTIVE RECOVERY INTELLIGENCE
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Executive Recovery Dashboard
          </h1>

          <p className="mt-4 max-w-5xl text-slate-600">
            Executive visibility into operational losses, recovery
            opportunities, production instability, inventory ageing, shipment
            exposure, rework cost, and hidden profit leakage across factory
            operations.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-4">
          <KpiCard
            title="Factory Health Score"
            value={`${executiveScore.finalScore}/100`}
          />

          <KpiCard title="Executive Grade" value={executiveScore.grade} />

          <KpiCard
            title="Operational Status"
            value={executiveScore.status}
          />

          <KpiCard
            title="Recovery Efficiency"
            value={`${executiveScore.recoveryScore}%`}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          <KpiCard
            title="Production Stability"
            value={`${executiveScore.productionScore}%`}
          />

          <KpiCard
            title="Inventory Risk Score"
            value={`${executiveScore.inventoryScore}%`}
          />

          <KpiCard
            title="Operational Risk Score"
            value={`${executiveScore.operationalScore}%`}
          />

          <KpiCard
            title="Recovery Score"
            value={`${executiveScore.recoveryScore}%`}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          <KpiCard
            title="Estimated Total Loss"
            value={`$${totalEstimatedLoss.toLocaleString()}`}
          />

          <KpiCard
            title="Recovery Opportunity"
            value={`$${totalRecoveryOpportunity.toLocaleString()}`}
          />

          <KpiCard
            title="Critical Loss Areas"
            value={String(criticalLossAreas)}
          />

          <KpiCard
            title="Inventory Ageing Alerts"
            value={String(inventoryAgeingAlerts)}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          <KpiCard
            title="Rework Exposure"
            value={`$${totalReworkExposure.toLocaleString()}`}
          />

          <KpiCard
            title="Rejected Quantity"
            value={String(totalRejectionExposure)}
          />

          <KpiCard
            title="Machine Breakdown Risk"
            value={String(machineBreakdownRisk)}
          />

          <KpiCard title="Material Wastage" value={String(totalWastage)} />
        </section>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-900">
            Executive AI Recommendation
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            {executiveAiRecommendation}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <InsightCard
            title="Operational Risk Summary"
            items={[
              `Production Delay Exposure: ${productionDelayRisk}`,
              `Critical Loss Cases: ${criticalLossAreas}`,
              `Inventory Ageing Alerts: ${inventoryAgeingAlerts}`,
              `Machine Breakdown Frequency: ${machineBreakdownRisk}`,
            ]}
          />

          <InsightCard
            title="Recovery Intelligence Summary"
            items={[
              `Estimated Recovery Opportunity: $${totalRecoveryOpportunity.toLocaleString()}`,
              `Total Rework Exposure: $${totalReworkExposure.toLocaleString()}`,
              `Rejected Quantity Exposure: ${totalRejectionExposure}`,
              `Total Wastage Quantity: ${totalWastage}`,
            ]}
          />
        </section>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Executive Leadership Action Priorities
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Reduce inventory ageing exposure.",
              "Strengthen production planning discipline.",
              "Control material over-ordering.",
              "Improve maintenance response system.",
              "Launch rework reduction initiative.",
              "Strengthen operational accountability.",
              "Improve shipment recovery process.",
              "Create monthly executive recovery reviews.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-medium text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}

function InsightCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}