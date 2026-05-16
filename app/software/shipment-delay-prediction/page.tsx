"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

import {
  getProductionLogs,
  getMaintenanceLogs,
  getWastageLogs,
  getBuyerOrderEntries,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type ShipmentPrediction = {
  orderRef: string;
  buyer: string;
  delayProbability: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  riskReason: string;
  expectedImpact: string;
  recoveryAction: string;
};

function numberValue(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function riskLevel(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function generateShipmentPredictions(
  orders: RecordType[],
  productionLogs: RecordType[],
  maintenanceLogs: RecordType[],
  wastageLogs: RecordType[]
): ShipmentPrediction[] {
  const productionLoss = productionLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const downtimeHours = maintenanceLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const wastageLoss = wastageLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
    0
  );

  const baseRisk = Math.min(
    100,
    Math.round(productionLoss / 1500 + downtimeHours * 3 + wastageLoss / 2500)
  );

  const sourceOrders =
    orders.length > 0
      ? orders
      : [
          {
            orderRef: "Demo Order 001",
            buyerName: "Demo Buyer",
            orderQty: 10000,
            shipmentDate: "Not available",
          },
        ];

  return sourceOrders
    .map((order, index) => {
      const orderQty = numberValue(order.orderQty || order.quantity || order.qty);
      const quantityRisk = orderQty > 50000 ? 15 : orderQty > 20000 ? 8 : 3;
      const score = Math.min(100, baseRisk + quantityRisk + index * 2);

      return {
        orderRef:
          order.orderRef ||
          order.styleNo ||
          order.poNumber ||
          order.id ||
          `Order ${index + 1}`,
        buyer:
          order.buyerName ||
          order.buyer ||
          order.customerName ||
          "Buyer not specified",
        delayProbability: score,
        riskLevel: riskLevel(score),
        riskReason:
          score >= 60
            ? "Production loss, machine downtime, wastage, or order volume may affect shipment readiness."
            : "Shipment risk is currently manageable based on available operational data.",
        expectedImpact:
          score >= 80
            ? "Possible missed shipment date, buyer escalation, air freight cost, or margin damage."
            : score >= 60
            ? "Possible production recovery pressure and management follow-up required."
            : score >= 40
            ? "Moderate monitoring required to avoid late-stage shipment pressure."
            : "No immediate shipment danger detected.",
        recoveryAction:
          score >= 80
            ? "Immediate executive review, daily production recovery plan, material readiness check, and buyer communication."
            : score >= 60
            ? "Factory director should review output gap, bottleneck lines, and shipment preparation status within 24 hours."
            : score >= 40
            ? "Monitor production progress, quality clearance, and packing readiness."
            : "Continue normal tracking.",
      };
    })
    .sort((a, b) => b.delayProbability - a.delayProbability);
}

export default function ShipmentDelayPredictionPage() {
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<RecordType[]>([]);
  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [wastageLogs, setWastageLogs] = useState<RecordType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const safeFetch = async (fn: () => Promise<any>) => {
          try {
            return await Promise.race([
              fn(),
              new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
            ]);
          } catch {
            return [];
          }
        };

        const buyerOrders = Array.isArray(
  await safeFetch(() => getBuyerOrderEntries("demo-factory"))
)
  ? ((await safeFetch(() =>
      getBuyerOrderEntries("demo-factory")
    )) as RecordType[])
  : [];

const production = Array.isArray(
  await safeFetch(() => getProductionLogs("demo-factory"))
)
  ? ((await safeFetch(() =>
      getProductionLogs("demo-factory")
    )) as RecordType[])
  : [];

const maintenance = Array.isArray(
  await safeFetch(() => getMaintenanceLogs("demo-factory"))
)
  ? ((await safeFetch(() =>
      getMaintenanceLogs("demo-factory")
    )) as RecordType[])
  : [];

const wastage = Array.isArray(
  await safeFetch(() => getWastageLogs("demo-factory"))
)
  ? ((await safeFetch(() =>
      getWastageLogs("demo-factory")
    )) as RecordType[])
  : [];

        setOrders(buyerOrders || []);
        setProductionLogs(production || []);
        setMaintenanceLogs(maintenance || []);
        setWastageLogs(wastage || []);
      } catch (error) {
        console.error("Shipment delay prediction loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const predictions = useMemo(
    () =>
      generateShipmentPredictions(
        orders,
        productionLogs,
        maintenanceLogs,
        wastageLogs
      ),
    [orders, productionLogs, maintenanceLogs, wastageLogs]
  );

  const criticalCount = predictions.filter(
    (item) => item.riskLevel === "Critical"
  ).length;

  const highCount = predictions.filter(
    (item) => item.riskLevel === "High"
  ).length;

  const topRisk = predictions[0];

  return (
    <DashboardShell title="AI Shipment Delay Prediction">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Export Manufacturing Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Shipment Delay Prediction Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module predicts shipment delay risk using buyer orders,
              production loss, machine downtime, wastage, and operational pressure.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading shipment delay prediction intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
                  <p className="text-red-300 text-sm">Highest Delay Risk</p>
                  <h2 className="text-2xl font-bold mt-2">
                    {topRisk?.orderRef || "N/A"}
                  </h2>
                  <p className="text-red-200 mt-3">
                    Probability: {topRisk?.delayProbability || 0}%
                  </p>
                </div>

                <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
                  <p className="text-orange-300 text-sm">Critical Delay Risks</p>
                  <h2 className="text-3xl font-bold mt-2">{criticalCount}</h2>
                  <p className="text-orange-200 mt-3">
                    Orders requiring immediate executive attention.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">High Delay Risks</p>
                  <h2 className="text-3xl font-bold mt-2">{highCount}</h2>
                  <p className="text-slate-300 mt-3">
                    Orders requiring factory director follow-up.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5">
                {predictions.map((item) => (
                  <div
                    key={item.orderRef}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">{item.buyer}</p>
                        <h2 className="text-2xl font-bold mt-1">
                          {item.orderRef}
                        </h2>
                      </div>

                      <span
                        className={
                          item.riskLevel === "Critical"
                            ? "px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold"
                            : item.riskLevel === "High"
                            ? "px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold"
                            : item.riskLevel === "Medium"
                            ? "px-4 py-2 rounded-full bg-yellow-500 text-slate-950 text-sm font-semibold"
                            : "px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold"
                        }
                      >
                        {item.riskLevel}
                      </span>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm">
                        Delay Probability: {item.delayProbability}%
                      </p>

                      <div className="w-full bg-slate-800 rounded-full h-4 mt-2 overflow-hidden">
                        <div
                          className={
                            item.riskLevel === "Critical"
                              ? "bg-red-600 h-4"
                              : item.riskLevel === "High"
                              ? "bg-orange-500 h-4"
                              : item.riskLevel === "Medium"
                              ? "bg-yellow-500 h-4"
                              : "bg-emerald-500 h-4"
                          }
                          style={{ width: `${item.delayProbability}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-red-300 font-semibold">
                          Risk Reason
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.riskReason}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-amber-300 font-semibold">
                          Expected Impact
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.expectedImpact}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-sky-300 font-semibold">
                          Recovery Action
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.recoveryAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}