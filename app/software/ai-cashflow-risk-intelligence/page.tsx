"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

import {
  getProductionLogs,
  getWastageLogs,
  getExportLogs,
  getUtilitiesLogs,
  getMaintenanceLogs,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type CashflowSignal = {
  area: string;
  value: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  reason: string;
  action: string;
};

const demoSignals: CashflowSignal[] = [
  {
    area: "Export delay exposure",
    value: 18,
    risk: "High",
    reason: "Shipment delay may slow buyer payment collection.",
    action: "Escalate delayed export orders and confirm revised shipment dates.",
  },
  {
    area: "Utilities cash pressure",
    value: 12,
    risk: "Medium",
    reason: "Utility cost is rising against output.",
    action: "Separate generator fuel cost and national grid cost for review.",
  },
  {
    area: "Maintenance cash leakage",
    value: 9,
    risk: "Medium",
    reason: "Breakdown repair cost is affecting available cash.",
    action: "Prioritise preventive maintenance for high-loss machines.",
  },
  {
    area: "Wastage cost exposure",
    value: 14,
    risk: "High",
    reason: "Material wastage is creating avoidable working capital loss.",
    action: "Start root-cause review by line, order, material and department.",
  },
];

function toNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function riskLabel(value: number): CashflowSignal["risk"] {
  if (value >= 25) return "Critical";
  if (value >= 15) return "High";
  if (value >= 8) return "Medium";
  return "Low";
}

function riskStyle(risk: CashflowSignal["risk"]) {
  if (risk === "Critical") return "border-red-500 bg-red-50 text-red-800";
  if (risk === "High") return "border-orange-500 bg-orange-50 text-orange-800";
  if (risk === "Medium") return "border-yellow-500 bg-yellow-50 text-yellow-800";
  return "border-emerald-500 bg-emerald-50 text-emerald-800";
}

export default function AICashflowRiskIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);
  const [exportLogs, setExportLogs] = useState<RecordType[]>([]);
  const [utilitiesLogs, setUtilitiesLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCashflowData() {
      setLoading(true);
      setError("");

      try {
        const factoryId = "demo-factory";

const results = await Promise.allSettled([
  getProductionLogs(factoryId),
  getWastageLogs(factoryId),
  getExportLogs(factoryId),
  getUtilitiesLogs(factoryId),
  getMaintenanceLogs(factoryId),
]);

        if (!active) return;

        setProductionLogs(
          results[0].status === "fulfilled" && Array.isArray(results[0].value)
            ? results[0].value
            : []
        );

        setWastageLogs(
          results[1].status === "fulfilled" && Array.isArray(results[1].value)
            ? results[1].value
            : []
        );

        setExportLogs(
          results[2].status === "fulfilled" && Array.isArray(results[2].value)
            ? results[2].value
            : []
        );

        setUtilitiesLogs(
          results[3].status === "fulfilled" && Array.isArray(results[3].value)
            ? results[3].value
            : []
        );

        setMaintenanceLogs(
          results[4].status === "fulfilled" && Array.isArray(results[4].value)
            ? results[4].value
            : []
        );
      } catch (err) {
        console.error("Cashflow risk loading failed:", err);
        if (active) {
          setError("Live Firestore data could not be loaded. Demo intelligence is shown.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCashflowData();

    return () => {
      active = false;
    };
  }, []);

  const signals = useMemo<CashflowSignal[]>(() => {
    const exportDelay =
      exportLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.delayDays) +
          toNumber(item.shipmentDelayDays) +
          toNumber(item.lateShipmentDays),
        0
      ) || 0;

    const utilityCost =
      utilitiesLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.utilityCost) +
          toNumber(item.electricityCost) +
          toNumber(item.generatorFuelCost),
        0
      ) || 0;

    const repairCost =
      maintenanceLogs.reduce(
        (sum, item) => sum + toNumber(item.repairCost) + toNumber(item.maintenanceCost),
        0
      ) || 0;

    const wastageCost =
      wastageLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.wastageCost) +
          toNumber(item.rejectionCost) +
          toNumber(item.reworkCost),
        0
      ) || 0;

    const outputValue =
      productionLogs.reduce(
        (sum, item) =>
          sum +
          toNumber(item.outputValue) +
          toNumber(item.productionValue) +
          toNumber(item.completedValue),
        0
      ) || 1;

    const liveSignals: CashflowSignal[] = [
      {
        area: "Export delay exposure",
        value: exportDelay,
        risk: riskLabel(exportDelay),
        reason: "Delayed shipments can delay buyer payment and increase air shipment pressure.",
        action: "Review delayed export orders and escalate buyer communication.",
      },
      {
        area: "Utilities cash pressure",
        value: Math.round((utilityCost / outputValue) * 100),
        risk: riskLabel(Math.round((utilityCost / outputValue) * 100)),
        reason: "Utility cost is being compared against production value.",
        action: "Separate national grid, generator fuel and abnormal utility cost.",
      },
      {
        area: "Maintenance cash leakage",
        value: Math.round((repairCost / outputValue) * 100),
        risk: riskLabel(Math.round((repairCost / outputValue) * 100)),
        reason: "Repair cost is reducing available operating cash.",
        action: "Prioritise preventive maintenance for repeated breakdown areas.",
      },
      {
        area: "Wastage cost exposure",
        value: Math.round((wastageCost / outputValue) * 100),
        risk: riskLabel(Math.round((wastageCost / outputValue) * 100)),
        reason: "Wastage, rejection and rework are creating avoidable cash loss.",
        action: "Run line-wise root-cause review and recover material loss.",
      },
    ];

    const hasLiveData =
      productionLogs.length ||
      wastageLogs.length ||
      exportLogs.length ||
      utilitiesLogs.length ||
      maintenanceLogs.length;

    return hasLiveData ? liveSignals : demoSignals;
  }, [productionLogs, wastageLogs, exportLogs, utilitiesLogs, maintenanceLogs]);

  const overallScore = useMemo(() => {
    const total = signals.reduce((sum, item) => sum + item.value, 0);
    return Math.min(100, Math.round(total / signals.length));
  }, [signals]);

  const overallRisk = riskLabel(overallScore);

  return (
    <DashboardShell title="AI Cashflow Risk Intelligence">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[linear(#0f172a,#020617)] px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 105
            </p>

            <h1 className="mt-3 text-3xl md:text-5xl font-bold">
              AI Cashflow Risk Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              Monitors cashflow pressure caused by export delays, utility cost,
              repair cost, wastage, rejection and rework. This helps directors
              identify where operational losses are damaging working capital.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Overall cashflow risk score</p>
              <div className="mt-2 flex items-end gap-4">
                <span className="text-6xl font-bold">{overallScore}</span>
                <span
                  className={`mb-2 rounded-full border px-4 py-1 text-sm font-semibold ${riskStyle(
                    overallRisk
                  )}`}
                >
                  {overallRisk}
                </span>
              </div>
            </div>

            {loading && (
              <p className="mt-4 text-sm text-cyan-200">
                Loading live Firestore cashflow intelligence...
              </p>
            )}

            {error && <p className="mt-4 text-sm text-yellow-300">{error}</p>}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid gap-5 md:grid-cols-2">
            {signals.map((item) => (
              <div
                key={item.area}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{item.area}</h2>
                    <p className="mt-2 text-sm text-slate-300">{item.reason}</p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskStyle(
                      item.risk
                    )}`}
                  >
                    {item.risk}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Risk value</p>
                  <p className="text-4xl font-bold text-cyan-300">{item.value}</p>
                </div>

                <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <p className="text-sm font-semibold text-cyan-200">
                    Recommended management action
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Director review checklist</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                "Which buyer payments may be delayed?",
                "Which costs are increasing faster than output?",
                "Which department owns the cash leakage?",
                "Which recovery actions are urgent this week?",
                "Which order is profitable but cash-negative?",
                "Which cost needs board-level escalation?",
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