"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/software/DashboardShell";

import {
  getProductionLogs,
  getExportLogs,
  getMaintenanceLogs,
  getUtilitiesLogs,
  getRiskReports,
  getWastageLogs,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type EscalationItem = {
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  department: string;
  summary: string;
  action: string;
};

function toNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function severityStyle(severity: EscalationItem["severity"]) {
  if (severity === "Low") {
    return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
  }

  if (severity === "Medium") {
    return "border-cyan-500 bg-cyan-500/10 text-cyan-300";
  }

  if (severity === "High") {
    return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
  }

  return "border-red-500 bg-red-500/10 text-red-300";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AINotificationEscalationCentrePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [exportLogs, setExportLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [utilitiesLogs, setUtilitiesLogs] = useState<RecordType[]>([]);
  const [riskReports, setRiskReports] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);

  useEffect(() => {
    let active = true;

    async function loadEscalationData() {
      setLoading(true);
      setError("");

      try {
        const factoryId = "demo-factory";

        const results = await Promise.allSettled([
          getProductionLogs(factoryId),
          getExportLogs(factoryId),
          getMaintenanceLogs(factoryId),
          getUtilitiesLogs(factoryId),
          getRiskReports(factoryId),
          getWastageLogs(factoryId),
        ]);

        if (!active) return;

        setProductionLogs(
          results[0].status === "fulfilled" && Array.isArray(results[0].value)
            ? results[0].value
            : []
        );

        setExportLogs(
          results[1].status === "fulfilled" && Array.isArray(results[1].value)
            ? results[1].value
            : []
        );

        setMaintenanceLogs(
          results[2].status === "fulfilled" && Array.isArray(results[2].value)
            ? results[2].value
            : []
        );

        setUtilitiesLogs(
          results[3].status === "fulfilled" && Array.isArray(results[3].value)
            ? results[3].value
            : []
        );

        setRiskReports(
          results[4].status === "fulfilled" && Array.isArray(results[4].value)
            ? results[4].value
            : []
        );

        setWastageLogs(
          results[5].status === "fulfilled" && Array.isArray(results[5].value)
            ? results[5].value
            : []
        );
      } catch (err) {
        console.error("Escalation loading failed:", err);

        if (active) {
          setError(
            "Live escalation intelligence could not be loaded. Demo escalation view is shown."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEscalationData();

    return () => {
      active = false;
    };
  }, []);

  const escalationItems = useMemo<EscalationItem[]>(() => {
    const exportDelay = exportLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.delayDays) +
        toNumber(item.shipmentDelayDays),
      0
    );

    const downtime = maintenanceLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.downtimeHours) +
        toNumber(item.breakdownCount),
      0
    );

    const utilityCost = utilitiesLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.utilityCost) +
        toNumber(item.generatorFuelCost),
      0
    );

    const wastageCost = wastageLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.wastageCost) +
        toNumber(item.rejectionCost),
      0
    );

    const productionLoss = productionLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.lossValue) +
        toNumber(item.productionLoss),
      0
    );

    const riskExposure = riskReports.length;

    return [
      {
        title: "Buyer Shipment Delay Escalation",
        severity:
          exportDelay > 15
            ? "Critical"
            : exportDelay > 8
            ? "High"
            : "Medium",
        department: "Export / Merchandising",
        summary:
          "Shipment delay may impact buyer confidence and payment cycle.",
        action:
          "Escalate to management immediately and activate shipment recovery plan.",
      },
      {
        title: "Machine Breakdown Escalation",
        severity:
          downtime > 25
            ? "Critical"
            : downtime > 12
            ? "High"
            : "Medium",
        department: "Maintenance",
        summary:
          "Downtime and machine instability are affecting factory output.",
        action:
          "Prioritise preventive maintenance and emergency repair escalation.",
      },
      {
        title: "Utility Cost Spike Alert",
        severity:
          utilityCost > 25000
            ? "High"
            : utilityCost > 12000
            ? "Medium"
            : "Low",
        department: "Utilities & Energy",
        summary:
          "Utility and generator fuel cost are increasing beyond expected trend.",
        action:
          "Review abnormal usage pattern and identify energy leakage areas.",
      },
      {
        title: "Production Loss Escalation",
        severity:
          productionLoss > 20000
            ? "Critical"
            : productionLoss > 10000
            ? "High"
            : "Medium",
        department: "Production",
        summary:
          "Production loss and inefficiency require urgent operational review.",
        action:
          "Conduct line balancing, bottleneck review and manpower optimisation.",
      },
      {
        title: "Wastage & Rejection Escalation",
        severity:
          wastageCost > 15000
            ? "High"
            : wastageCost > 8000
            ? "Medium"
            : "Low",
        department: "Quality / Production",
        summary:
          "Wastage and rejection are creating avoidable operational losses.",
        action:
          "Trigger root-cause investigation and corrective action tracking.",
      },
      {
        title: "Enterprise Risk Governance Alert",
        severity:
          riskExposure > 8
            ? "Critical"
            : riskExposure > 4
            ? "High"
            : "Medium",
        department: "Executive Management",
        summary:
          "Operational and governance risks require executive review.",
        action:
          "Conduct escalation meeting and assign accountable department owners.",
      },
    ];
  }, [
    exportLogs,
    maintenanceLogs,
    utilitiesLogs,
    productionLogs,
    wastageLogs,
    riskReports,
  ]);

  const criticalAlerts = escalationItems.filter(
    (item) => item.severity === "Critical"
  ).length;

  const highAlerts = escalationItems.filter(
    (item) => item.severity === "High"
  ).length;

  return (
    <DashboardShell title="AI Notification & Escalation Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[linear(#0f172a,#020617)] px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 109
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              AI Notification & Escalation Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              Central enterprise escalation engine for operational alerts,
              shipment delays, breakdown risks, utility spikes, wastage alerts,
              profitability pressure and executive governance escalation.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
  <a
    href="#critical-escalation-alerts"
    className="block rounded-2xl border border-red-500/20 bg-red-500/10 p-6 transition hover:-translate-y-1 hover:border-red-400/40"
  >
    <p className="text-sm text-red-200">
      Critical escalation alerts
    </p>

    <h2 className="mt-3 text-5xl font-bold">
      {criticalAlerts}
    </h2>
  </a>

  <a
    href="#high-priority-alerts"
    className="block rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6 transition hover:-translate-y-1 hover:border-yellow-400/40"
  >
    <p className="text-sm text-yellow-200">
      High priority alerts
    </p>

    <h2 className="mt-3 text-5xl font-bold">
      {highAlerts}
    </h2>
  </a>

  <a
    href="#live-governance-monitoring"
    className="block rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
  >
    <p className="text-sm text-cyan-200">
      AI escalation monitoring
    </p>

    <h2 className="mt-3 text-3xl font-bold">
      Live Governance
    </h2>
  </a>
</div>

{loading && (
  <p className="mt-5 text-sm text-cyan-200">
    Loading live escalation intelligence...
  </p>
)}

{error && (
  <p className="mt-5 text-sm text-yellow-300">{error}</p>
)}
</div>
</section>

<section className="mx-auto max-w-7xl px-6 py-8">
  <div className="grid gap-6 md:grid-cols-2">
    {escalationItems.map((item) => (
      <a
        key={item.title}
        href={`#${slugify(item.title)}`}
        className="block rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl transition hover:-translate-y-1 hover:border-cyan-400/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300">
              {item.department}
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {item.title}
            </h2>
          </div>

          <div
            className={`rounded-full border px-4 py-1 text-xs font-semibold ${severityStyle(
              item.severity
            )}`}
          >
            {item.severity}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-cyan-300">
            Alert summary
          </p>

          <p className="mt-2 text-sm text-slate-200">
            {item.summary}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-red-300">
            Escalation action
          </p>

          <p className="mt-2 text-sm text-slate-200">
            {item.action}
          </p>
        </div>
      </a>
    ))}
  </div>
</section>

<section className="mx-auto max-w-7xl px-6 pb-10">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
    <h2 className="text-2xl font-bold">
      Future escalation integrations
    </h2>

    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[
        "Email escalation engine",
        "WhatsApp alert integration",
        "SMS notification gateway",
        "Director escalation workflow",
        "Factory war room alerts",
        "Buyer shipment risk notification",
        "Corrective action reminders",
        "AI risk prediction escalation",
        "Mobile push notifications",
      ].map((item) => (
        <a
          key={item}
          href={`#${slugify(item)}`}
          className="block rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200 transition hover:-translate-y-1 hover:border-cyan-400/40"
        >
          {item}
        </a>
      ))}
    </div>
  </div>
</section>
      </main>
    </DashboardShell>
  );
}