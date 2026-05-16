"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/software/DashboardShell";

import {
  getRiskReports,
  getMaintenanceLogs,
  getWastageLogs,
  getExportLogs,
  getProductionLogs,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type EvidenceItem = {
  title: string;
  category: string;
  owner: string;
  status: "Controlled" | "Review Needed" | "Missing Evidence" | "Escalate";
  reason: string;
  action: string;
};

function toNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function statusStyle(status: EvidenceItem["status"]) {
  if (status === "Controlled") {
    return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "Review Needed") {
    return "border-cyan-500 bg-cyan-500/10 text-cyan-300";
  }

  if (status === "Missing Evidence") {
    return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
  }

  return "border-red-500 bg-red-500/10 text-red-300";
}

export default function AIDocumentEvidenceControlCentrePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [riskReports, setRiskReports] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);
  const [exportLogs, setExportLogs] = useState<RecordType[]>([]);
  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);

  useEffect(() => {
    let active = true;

    async function loadEvidenceData() {
      setLoading(true);
      setError("");

      try {
        const factoryId = "demo-factory";

        const results = await Promise.allSettled([
          getRiskReports(factoryId),
          getMaintenanceLogs(factoryId),
          getWastageLogs(factoryId),
          getExportLogs(factoryId),
          getProductionLogs(factoryId),
        ]);

        if (!active) return;

        setRiskReports(
          results[0].status === "fulfilled" && Array.isArray(results[0].value)
            ? results[0].value
            : []
        );

        setMaintenanceLogs(
          results[1].status === "fulfilled" && Array.isArray(results[1].value)
            ? results[1].value
            : []
        );

        setWastageLogs(
          results[2].status === "fulfilled" && Array.isArray(results[2].value)
            ? results[2].value
            : []
        );

        setExportLogs(
          results[3].status === "fulfilled" && Array.isArray(results[3].value)
            ? results[3].value
            : []
        );

        setProductionLogs(
          results[4].status === "fulfilled" && Array.isArray(results[4].value)
            ? results[4].value
            : []
        );
      } catch (err) {
        console.error("Document evidence loading failed:", err);

        if (active) {
          setError(
            "Live Firestore document evidence data could not be loaded. Demo control view is shown."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvidenceData();

    return () => {
      active = false;
    };
  }, []);

  const evidenceItems = useMemo<EvidenceItem[]>(() => {
    const riskCount = riskReports.length;
    const maintenanceCount = maintenanceLogs.length;
    const wastageCount = wastageLogs.length;
    const exportCount = exportLogs.length;
    const productionCount = productionLogs.length;

    const breakdownHours = maintenanceLogs.reduce(
      (sum, item) => sum + toNumber(item.downtimeHours),
      0
    );

    const wastageCost = wastageLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.wastageCost) +
        toNumber(item.rejectionCost) +
        toNumber(item.reworkCost),
      0
    );

    const exportDelay = exportLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.delayDays) +
        toNumber(item.shipmentDelayDays) +
        toNumber(item.lateShipmentDays),
      0
    );

    const productionValue = productionLogs.reduce(
      (sum, item) =>
        sum +
        toNumber(item.productionValue) +
        toNumber(item.outputValue) +
        toNumber(item.completedValue),
      0
    );

    return [
      {
        title: "Risk Report Evidence Control",
        category: "Governance",
        owner: "Factory Management / Compliance",
        status:
          riskCount > 5
            ? "Review Needed"
            : riskCount > 0
            ? "Controlled"
            : "Missing Evidence",
        reason:
          riskCount > 0
            ? `${riskCount} risk record(s) found for management review.`
            : "No risk evidence found for current factory review.",
        action:
          "Ensure each risk has owner, date, root cause, corrective action and closure evidence.",
      },
      {
        title: "Maintenance Breakdown Evidence",
        category: "Maintenance",
        owner: "Maintenance Manager",
        status:
          breakdownHours > 20
            ? "Escalate"
            : maintenanceCount > 0
            ? "Controlled"
            : "Missing Evidence",
        reason:
          maintenanceCount > 0
            ? `${maintenanceCount} maintenance record(s), ${breakdownHours} downtime hour(s).`
            : "No maintenance evidence found.",
        action:
          "Attach breakdown reason, repair note, spare usage and preventive action proof.",
      },
      {
        title: "Wastage & Rejection Evidence",
        category: "Quality / Production",
        owner: "Quality Manager / Production Head",
        status:
          wastageCost > 15000
            ? "Escalate"
            : wastageCount > 0
            ? "Review Needed"
            : "Missing Evidence",
        reason:
          wastageCount > 0
            ? `${wastageCount} wastage record(s), estimated loss ${wastageCost}.`
            : "No wastage evidence found.",
        action:
          "Keep photos, inspection notes, defect reason, department owner and recovery action.",
      },
      {
        title: "Shipment Delay Evidence",
        category: "Export",
        owner: "Export / Merchandising Team",
        status:
          exportDelay > 12
            ? "Escalate"
            : exportCount > 0
            ? "Controlled"
            : "Missing Evidence",
        reason:
          exportCount > 0
            ? `${exportCount} export record(s), ${exportDelay} delay day(s).`
            : "No export delay evidence found.",
        action:
          "Attach buyer communication, shipment plan, revised date and delay approval note.",
      },
      {
        title: "Production Output Evidence",
        category: "Production",
        owner: "Production Manager",
        status:
          productionValue > 0
            ? "Controlled"
            : productionCount > 0
            ? "Review Needed"
            : "Missing Evidence",
        reason:
          productionCount > 0
            ? `${productionCount} production record(s), output value ${productionValue}.`
            : "No production output evidence found.",
        action:
          "Maintain daily output proof, line report, supervisor sign-off and exception notes.",
      },
    ];
  }, [riskReports, maintenanceLogs, wastageLogs, exportLogs, productionLogs]);

  const controlledCount = evidenceItems.filter(
    (item) => item.status === "Controlled"
  ).length;

  const evidenceScore = Math.round(
    (controlledCount / evidenceItems.length) * 100
  );

  return (
    <DashboardShell title="AI Document & Evidence Control Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[linear(#0f172a,#020617)] px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 107
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              AI Document & Evidence Control Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              Central control centre for operational evidence, audit documents,
              corrective action proof, shipment delay records, maintenance
              proof, wastage evidence and management review documentation.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
              <p className="text-sm text-cyan-200">
                Evidence control readiness score
              </p>

              <div className="mt-3 flex items-end gap-4">
                <h2 className="text-6xl font-bold">{evidenceScore}</h2>

                <div className="mb-2 rounded-full border border-cyan-400/30 px-4 py-1 text-sm text-cyan-200">
                  Audit & Governance Readiness
                </div>
              </div>
            </div>

            {loading && (
              <p className="mt-5 text-sm text-cyan-200">
                Loading live document evidence intelligence...
              </p>
            )}

            {error && <p className="mt-5 text-sm text-yellow-300">{error}</p>}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {evidenceItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                      {item.category}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Owner: {item.owner}
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-4 py-1 text-xs font-semibold ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    Evidence position
                  </p>

                  <p className="mt-2 text-sm text-slate-200">{item.reason}</p>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-yellow-300">
                    Required control action
                  </p>

                  <p className="mt-2 text-sm text-slate-200">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Evidence control checklist
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Document title and version",
                "Responsible department owner",
                "Date and time of evidence",
                "Root cause and corrective action",
                "Photo or attachment reference",
                "Management approval status",
                "Closure date and verification",
                "Buyer or audit reference",
                "Confidentiality and access control",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}