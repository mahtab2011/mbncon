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

function numberValue(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function ExecutiveRecoveryDashboardPage() {
  const factoryId = "demo-factory";

  const [loading, setLoading] = useState(true);
  const [factoryLossData, setFactoryLossData] = useState<RecordType[]>([]);
  const [postOrderData, setPostOrderData] = useState<RecordType[]>([]);
  const [productionData, setProductionData] = useState<RecordType[]>([]);
  const [wastageData, setWastageData] = useState<RecordType[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<RecordType[]>([]);

  useEffect(() => {
    let active = true;

    async function safeFetch(fn: () => Promise<RecordType[]>) {
      try {
        const result = await Promise.race([
          fn(),
          new Promise<RecordType[]>((resolve) =>
            setTimeout(() => resolve([]), 3000)
          ),
        ]);

        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    }

    async function loadData() {
      try {
        const [loss, postOrder, production, wastage, maintenance] =
          await Promise.all([
            safeFetch(() => getFactoryLossIntelligenceEntries(factoryId)),
            safeFetch(() => getPostOrderIntelligenceEntries(factoryId)),
            safeFetch(() => getProductionLogs(factoryId)),
            safeFetch(() => getWastageLogs(factoryId)),
            safeFetch(() => getMaintenanceLogs(factoryId)),
          ]);

        if (!active) return;

        setFactoryLossData(loss);
        setPostOrderData(postOrder);
        setProductionData(production);
        setWastageData(wastage);
        setMaintenanceData(maintenance);
      } catch (error) {
        console.error("Executive recovery dashboard load error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const totalEstimatedLoss = useMemo(
    () =>
      factoryLossData.reduce(
        (sum, item) => sum + numberValue(item.estimatedLossValue),
        0
      ),
    [factoryLossData]
  );

  const totalRecoveryOpportunity = useMemo(
    () =>
      factoryLossData.reduce(
        (sum, item) => sum + numberValue(item.recoveryOpportunityValue),
        0
      ) +
      postOrderData.reduce(
        (sum, item) => sum + numberValue(item.recoveryValue),
        0
      ),
    [factoryLossData, postOrderData]
  );

  const totalReworkExposure = useMemo(
    () =>
      postOrderData.reduce(
        (sum, item) => sum + numberValue(item.reworkCost),
        0
      ),
    [postOrderData]
  );

  const totalRejectionExposure = useMemo(
    () =>
      postOrderData.reduce(
        (sum, item) => sum + numberValue(item.rejectedQty),
        0
      ),
    [postOrderData]
  );

  const criticalLossAreas = useMemo(
    () =>
      factoryLossData.filter((item) => item.priorityLevel === "Critical")
        .length,
    [factoryLossData]
  );

  const inventoryAgeingAlerts = useMemo(
    () =>
      postOrderData.filter((item) => numberValue(item.inventoryAgeingDays) > 90)
        .length,
    [postOrderData]
  );

  const machineBreakdownRisk = useMemo(
    () =>
      maintenanceData.reduce(
        (sum, item) => sum + numberValue(item.breakdownCount),
        0
      ),
    [maintenanceData]
  );

  const productionDelayRisk = useMemo(
    () =>
      productionData.reduce(
        (sum, item) => sum + numberValue(item.delayPercent),
        0
      ),
    [productionData]
  );

  const totalWastage = useMemo(
    () =>
      wastageData.reduce((sum, item) => sum + numberValue(item.wastageQty), 0),
    [wastageData]
  );

  const executiveScore = useMemo(
    () =>
      calculateExecutiveHealthScore({
        totalEstimatedLoss,
        totalRecoveryOpportunity,
        productionDelayRisk,
        inventoryAgeingAlerts,
        machineBreakdownRisk,
        totalWastage,
        totalReworkExposure,
        totalRejectionExposure,
        criticalLossAreas,
      }),
    [
      totalEstimatedLoss,
      totalRecoveryOpportunity,
      productionDelayRisk,
      inventoryAgeingAlerts,
      machineBreakdownRisk,
      totalWastage,
      totalReworkExposure,
      totalRejectionExposure,
      criticalLossAreas,
    ]
  );

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
      <DashboardShell
        title="Executive Recovery Dashboard"
        subtitle="Loading recovery, loss, inventory, production, wastage, and maintenance intelligence."
      >
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8 text-cyan-800">
          Loading executive recovery intelligence...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Executive Recovery Dashboard"
      subtitle="Executive visibility into loss recovery, production instability, inventory ageing, rework exposure, and hidden profit leakage."
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON Executive Recovery Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold text-neutral-950">
            Executive Recovery Dashboard
          </h1>

          <p className="mt-4 max-w-5xl text-lg leading-8 text-neutral-700">
            Executive visibility into operational losses, recovery
            opportunities, production instability, inventory ageing, shipment
            exposure, rework cost, and hidden profit leakage across factory
            operations.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Factory Health Score" value={`${executiveScore.finalScore}/100`} note="Overall factory recovery health" />
          <KpiCard title="Executive Grade" value={executiveScore.grade} note="Management performance signal" />
          <KpiCard title="Operational Status" value={executiveScore.status} note="Factory recovery condition" />
          <KpiCard title="Recovery Efficiency" value={`${executiveScore.recoveryScore}%`} note="Loss recovery effectiveness" />
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Production Stability" value={`${executiveScore.productionScore}%`} note="Production delay pressure" />
          <KpiCard title="Inventory Risk Score" value={`${executiveScore.inventoryScore}%`} note="Ageing inventory exposure" />
          <KpiCard title="Operational Risk Score" value={`${executiveScore.operationalScore}%`} note="Combined operating risk" />
          <KpiCard title="Recovery Score" value={`${executiveScore.recoveryScore}%`} note="Recovery opportunity status" />
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Estimated Total Loss" value={`$${totalEstimatedLoss.toLocaleString()}`} note="Current estimated factory loss" />
          <KpiCard title="Recovery Opportunity" value={`$${totalRecoveryOpportunity.toLocaleString()}`} note="Recoverable value potential" />
          <KpiCard title="Critical Loss Areas" value={String(criticalLossAreas)} note="Loss areas needing leadership focus" />
          <KpiCard title="Inventory Ageing Alerts" value={String(inventoryAgeingAlerts)} note="Inventory above 90 days" />
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Rework Exposure" value={`$${totalReworkExposure.toLocaleString()}`} note="Estimated rework cost" />
          <KpiCard title="Rejected Quantity" value={String(totalRejectionExposure)} note="Total rejection exposure" />
          <KpiCard title="Machine Breakdown Risk" value={String(machineBreakdownRisk)} note="Breakdown frequency signal" />
          <KpiCard title="Material Wastage" value={String(totalWastage)} note="Total material wastage quantity" />
        </section>

        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-900">
            Executive AI Recommendation
          </h2>

          <p className="mt-4 text-lg leading-8 text-neutral-700">
            {executiveAiRecommendation}
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
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

        <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-950">
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
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-sm"
              >
                <p className="font-medium text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function KpiCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg">
      <p className="text-sm font-semibold text-neutral-500">{title}</p>
      <h2 className="mt-4 text-3xl font-bold text-neutral-950">{value}</h2>
      <p className="mt-3 text-xs font-semibold text-cyan-700">{note}</p>
    </div>
  );
}

function InsightCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-neutral-950">{title}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <p className="text-neutral-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}