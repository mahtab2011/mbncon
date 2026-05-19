"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

import {
  getProductionLogs,
  getWastageLogs,
  getMaintenanceLogs,
  getFactoryLossIntelligenceEntries,
  getPostOrderIntelligenceEntries,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type EscalationLevel = "CEO" | "Factory Director" | "Department Head";
type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

type EscalationItem = {
  title: string;
  department: string;
  level: EscalationLevel;
  urgencyScore: number;
  priority: PriorityLevel;
  reason: string;
  action: string;
  timeline: string;
};

function numberValue(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function priority(score: number): PriorityLevel {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function level(score: number): EscalationLevel {
  if (score >= 80) return "CEO";
  if (score >= 60) return "Factory Director";
  return "Department Head";
}

function generateEscalations(
  productionLogs: RecordType[],
  wastageLogs: RecordType[],
  maintenanceLogs: RecordType[],
  factoryLossEntries: RecordType[],
  postOrderEntries: RecordType[]
): EscalationItem[] {
  const productionLoss = productionLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const wastageLoss = wastageLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
    0
  );

  const downtimeHours = maintenanceLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const repairCost = maintenanceLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.repairCost || item.maintenanceCost),
    0
  );

  const factoryLoss = factoryLossEntries.reduce(
    (sum, item) =>
      sum +
      numberValue(item.lossAmount || item.financialImpact || item.costImpact),
    0
  );

  const recoveryGap = postOrderEntries.reduce(
    (sum, item) =>
      sum +
      numberValue(
        item.unrecoveredAmount || item.balanceLoss || item.remainingLoss
      ),
    0
  );

  const productionScore = Math.min(
    100,
    Math.round(productionLoss / 1000 + downtimeHours * 2)
  );
  const qualityScore = Math.min(100, Math.round(wastageLoss / 800));
  const maintenanceScore = Math.min(
    100,
    Math.round(downtimeHours * 4 + repairCost / 5000)
  );
  const recoveryScore = Math.min(
    100,
    Math.round((factoryLoss + recoveryGap) / 2000)
  );

  const escalations: EscalationItem[] = [
    {
      title: "Production Delay and Output Instability Risk",
      department: "Production",
      level: level(productionScore),
      urgencyScore: productionScore,
      priority: priority(productionScore),
      reason:
        productionScore >= 40
          ? "Production loss or downtime may affect delivery reliability and buyer commitment."
          : "Production risk is currently under control.",
      action:
        productionScore >= 60
          ? "Review bottleneck lines, manpower allocation, material readiness, and daily output recovery plan."
          : "Continue monitoring production variance and planned output.",
      timeline:
        productionScore >= 80
          ? "Immediate CEO review today"
          : productionScore >= 60
          ? "Review within 24 hours"
          : "Monitor weekly",
    },
    {
      title: "Quality, Rejection, and Wastage Escalation Risk",
      department: "Quality / Wastage",
      level: level(qualityScore),
      urgencyScore: qualityScore,
      priority: priority(qualityScore),
      reason:
        qualityScore >= 40
          ? "Wastage or rejection may create hidden cost leakage and shipment quality risk."
          : "Quality and wastage risk is currently under control.",
      action:
        qualityScore >= 60
          ? "Launch root cause review for rejection, rework, material misuse, and operator process gaps."
          : "Continue inline inspection and wastage monitoring.",
      timeline:
        qualityScore >= 80
          ? "Immediate CEO review today"
          : qualityScore >= 60
          ? "Review within 24 hours"
          : "Monitor weekly",
    },
    {
      title: "Machine Downtime and Maintenance Escalation Risk",
      department: "Maintenance",
      level: level(maintenanceScore),
      urgencyScore: maintenanceScore,
      priority: priority(maintenanceScore),
      reason:
        maintenanceScore >= 40
          ? "Downtime or repair cost may interrupt production flow and shipment delivery."
          : "Maintenance risk is currently under control.",
      action:
        maintenanceScore >= 60
          ? "Escalate high-breakdown machines, spare parts readiness, and preventive maintenance schedule."
          : "Continue preventive maintenance tracking.",
      timeline:
        maintenanceScore >= 80
          ? "Immediate CEO review today"
          : maintenanceScore >= 60
          ? "Review within 24 hours"
          : "Monitor weekly",
    },
    {
      title: "Financial Loss and Post-Order Recovery Escalation Risk",
      department: "Commercial Recovery",
      level: level(recoveryScore),
      urgencyScore: recoveryScore,
      priority: priority(recoveryScore),
      reason:
        recoveryScore >= 40
          ? "Factory loss or unrecovered post-order value may reduce profitability."
          : "Commercial recovery risk is currently under control.",
      action:
        recoveryScore >= 60
          ? "Escalate buyer claim defence, recovery negotiation, discount control, and margin protection."
          : "Continue recovery tracking and buyer communication.",
      timeline:
        recoveryScore >= 80
          ? "Immediate CEO review today"
          : recoveryScore >= 60
          ? "Review within 24 hours"
          : "Monitor weekly",
    },
  ];

  return escalations.sort((a, b) => b.urgencyScore - a.urgencyScore);
}

function priorityClasses(priorityLevel: PriorityLevel) {
  if (priorityLevel === "Critical") {
    return {
      badge: "bg-red-600 text-white",
      bar: "bg-red-600",
      card: "border-red-300 bg-red-50",
      text: "text-red-700",
    };
  }

  if (priorityLevel === "High") {
    return {
      badge: "bg-orange-500 text-white",
      bar: "bg-orange-500",
      card: "border-orange-300 bg-orange-50",
      text: "text-orange-700",
    };
  }

  if (priorityLevel === "Medium") {
    return {
      badge: "bg-amber-500 text-slate-950",
      bar: "bg-amber-500",
      card: "border-amber-300 bg-amber-50",
      text: "text-amber-700",
    };
  }

  return {
    badge: "bg-emerald-500 text-slate-950",
    bar: "bg-emerald-500",
    card: "border-emerald-300 bg-emerald-50",
    text: "text-emerald-700",
  };
}

export default function ExecutiveEscalationEnginePage() {
  const [loading, setLoading] = useState(true);

  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [factoryLossEntries, setFactoryLossEntries] = useState<RecordType[]>(
    []
  );
  const [postOrderEntries, setPostOrderEntries] = useState<RecordType[]>([]);

  useEffect(() => {
    let active = true;

    const safeFetch = async (fn: () => Promise<RecordType[]>) => {
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
    };

    const loadData = async () => {
      try {
        const [
          production,
          wastage,
          maintenance,
          factoryLoss,
          postOrder,
        ] = await Promise.all([
          safeFetch(() => getProductionLogs("demo-factory")),
          safeFetch(() => getWastageLogs("demo-factory")),
          safeFetch(() => getMaintenanceLogs("demo-factory")),
          safeFetch(() => getFactoryLossIntelligenceEntries("demo-factory")),
          safeFetch(() => getPostOrderIntelligenceEntries("demo-factory")),
        ]);

        if (!active) return;

        setProductionLogs(production);
        setWastageLogs(wastage);
        setMaintenanceLogs(maintenance);
        setFactoryLossEntries(factoryLoss);
        setPostOrderEntries(postOrder);
      } catch (error) {
        console.error("Executive escalation loading error:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const escalations = useMemo(
    () =>
      generateEscalations(
        productionLogs,
        wastageLogs,
        maintenanceLogs,
        factoryLossEntries,
        postOrderEntries
      ),
    [
      productionLogs,
      wastageLogs,
      maintenanceLogs,
      factoryLossEntries,
      postOrderEntries,
    ]
  );

  const criticalCount = escalations.filter(
    (item) => item.priority === "Critical"
  ).length;
  const highCount = escalations.filter((item) => item.priority === "High")
    .length;
  const ceoCount = escalations.filter((item) => item.level === "CEO").length;

  const averageUrgency =
    escalations.length > 0
      ? Math.round(
          escalations.reduce((sum, item) => sum + item.urgencyScore, 0) /
            escalations.length
        )
      : 0;

  return (
    <DashboardShell
      title="AI Executive Escalation Engine"
      subtitle="AI-supported escalation intelligence for CEO, directors, and department heads."
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON AI Executive Manufacturing Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold text-neutral-950">
            AI Executive Escalation Engine
          </h1>

          <p className="mt-4 max-w-5xl text-lg leading-8 text-neutral-700">
            This module converts factory risks into executive escalation
            priorities, showing who should act, how urgent the matter is, and
            what action is required. It supports CEO review, director-level
            follow-up, and department ownership.
          </p>
        </section>

        {loading ? (
          <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8 text-cyan-800">
            Loading AI executive escalation intelligence...
          </section>
        ) : (
          <>
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                title="CEO Escalations"
                value={String(ceoCount)}
                description="Issues requiring highest executive attention."
              />

              <SummaryCard
                title="Critical Risks"
                value={String(criticalCount)}
                description="Risks that may damage delivery, quality, or profitability."
              />

              <SummaryCard
                title="High Risks"
                value={String(highCount)}
                description="Risks requiring director or department-head follow-up."
              />

              <SummaryCard
                title="Average Urgency"
                value={`${averageUrgency}/100`}
                description="Combined escalation pressure across current risk signals."
              />
            </section>

            <section className="grid gap-6">
              {escalations.map((item) => {
                const colors = priorityClasses(item.priority);

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-neutral-500">
                          {item.department}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-neutral-950">
                          {item.title}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                          {item.level}
                        </span>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${colors.badge}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-neutral-500">
                        Urgency Score: {item.urgencyScore}/100
                      </p>

                      <div className="mt-3 h-4 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className={`h-4 ${colors.bar}`}
                          style={{ width: `${item.urgencyScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <InsightBox
                        title="Reason"
                        value={item.reason}
                        tone="danger"
                      />

                      <InsightBox
                        title="Required Action"
                        value={item.action}
                        tone="info"
                      />

                      <InsightBox
                        title="Timeline"
                        value={item.timeline}
                        tone="warning"
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg">
      <p className="text-sm font-semibold text-neutral-500">{title}</p>

      <p className="mt-3 text-4xl font-bold text-neutral-950">{value}</p>

      <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
    </div>
  );
}

function InsightBox({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "danger" | "info" | "warning";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-7">{value}</p>
    </div>
  );
}