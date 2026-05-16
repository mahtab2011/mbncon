"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

import {
  getBuyerOrderEntries,
  getProductionLogs,
  getMaintenanceLogs,
  getWastageLogs,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type AirShipmentRisk = {
  orderRef: string;
  buyer: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  estimatedAirFreightExposure: number;
  marginRisk: string;
  reason: string;
  rescueAction: string;
};

function numberValue(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getRiskLevel(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function generateAirShipmentRisks(
  orders: RecordType[],
  productionLogs: RecordType[],
  maintenanceLogs: RecordType[],
  wastageLogs: RecordType[]
): AirShipmentRisk[] {
  const productionLoss = productionLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.lossAmount || item.delayCost || item.productionLoss),
    0
  );

  const downtimeHours = maintenanceLogs.reduce(
    (sum, item) => sum + numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const wastageLoss = wastageLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.wastageCost || item.lossAmount || item.materialLoss),
    0
  );

  const baseRisk = Math.min(
    100,
    Math.round(productionLoss / 1200 + downtimeHours * 4 + wastageLoss / 2200)
  );

  const sourceOrders =
    orders.length > 0
      ? orders
      : [
          {
            orderRef: "Demo Export Order 001",
            buyerName: "Demo Buyer",
            orderQty: 10000,
          },
        ];

  return sourceOrders
    .map((order, index) => {
      const qty = numberValue(order.orderQty || order.quantity || order.qty);
      const qtyRisk = qty > 50000 ? 18 : qty > 20000 ? 10 : 5;
      const score = Math.min(100, baseRisk + qtyRisk + index * 2);

      const exposure = Math.round(qty * 0.85 * (score / 100));

      return {
        orderRef:
          order.orderRef ||
          order.poNumber ||
          order.styleNo ||
          order.id ||
          `Order ${index + 1}`,
        buyer:
          order.buyerName ||
          order.buyer ||
          order.customerName ||
          "Buyer not specified",
        riskScore: score,
        riskLevel: getRiskLevel(score),
        estimatedAirFreightExposure: exposure,
        marginRisk:
          score >= 80
            ? "Severe margin destruction risk"
            : score >= 60
            ? "High margin pressure"
            : score >= 40
            ? "Moderate margin exposure"
            : "Low margin exposure",
        reason:
          score >= 60
            ? "Production delay, downtime, wastage, or order pressure may force air shipment."
            : "Current operational pressure does not strongly indicate forced air shipment.",
        rescueAction:
          score >= 80
            ? "Immediate executive rescue plan: daily output recovery, shipment split review, buyer communication, and air-cost prevention."
            : score >= 60
            ? "Factory director should review production catch-up, packing readiness, and shipment feasibility within 24 hours."
            : score >= 40
            ? "Monitor shipment preparation and remove bottlenecks early."
            : "Continue normal shipment monitoring.",
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);
}

export default function AirShipmentRiskPage() {
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

        const buyerOrdersResult = await Promise.race([
  safeFetch(() => getBuyerOrderEntries("demo-factory")),
  new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
]);

const productionResult = await Promise.race([
  safeFetch(() => getProductionLogs("demo-factory")),
  new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
]);

const maintenanceResult = await Promise.race([
  safeFetch(() => getMaintenanceLogs("demo-factory")),
  new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
]);

const wastageResult = await Promise.race([
  safeFetch(() => getWastageLogs("demo-factory")),
  new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
]);

setOrders(Array.isArray(buyerOrdersResult) ? buyerOrdersResult : []);
setProductionLogs(Array.isArray(productionResult) ? productionResult : []);
setMaintenanceLogs(Array.isArray(maintenanceResult) ? maintenanceResult : []);
setWastageLogs(Array.isArray(wastageResult) ? wastageResult : []);

        
      } catch (error) {
        console.error("Air shipment risk loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const risks = useMemo(
    () =>
      generateAirShipmentRisks(
        orders,
        productionLogs,
        maintenanceLogs,
        wastageLogs
      ),
    [orders, productionLogs, maintenanceLogs, wastageLogs]
  );

  const criticalCount = risks.filter((item) => item.riskLevel === "Critical").length;
  const highCount = risks.filter((item) => item.riskLevel === "High").length;
  const totalExposure = risks.reduce(
    (sum, item) => sum + item.estimatedAirFreightExposure,
    0
  );

  const topRisk = risks[0];

  return (
    <DashboardShell title="AI Air Shipment Risk Engine">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Export Cost Protection Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Air Shipment Risk Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module predicts forced air shipment risk, estimated air freight
              exposure, margin destruction danger, and urgent production rescue actions.
            </p>
          </section>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              Loading air shipment risk intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950 border border-red-700 rounded-2xl p-5">
                  <p className="text-red-300 text-sm">Highest Air Shipment Risk</p>
                  <h2 className="text-2xl font-bold mt-2">
                    {topRisk?.orderRef || "N/A"}
                  </h2>
                  <p className="text-red-200 mt-3">
                    Risk Score: {topRisk?.riskScore || 0}/100
                  </p>
                </div>

                <div className="bg-orange-950 border border-orange-700 rounded-2xl p-5">
                  <p className="text-orange-300 text-sm">
                    High / Critical Risk Orders
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {criticalCount + highCount}
                  </h2>
                  <p className="text-orange-200 mt-3">
                    Orders that may need executive rescue action.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">
                    Estimated Air Freight Exposure
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    £{totalExposure.toLocaleString()}
                  </h2>
                  <p className="text-slate-300 mt-3">
                    Estimated margin pressure from possible air shipment.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5">
                {risks.map((item) => (
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
                        Air Shipment Risk Score: {item.riskScore}/100
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
                          style={{ width: `${item.riskScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-red-300 font-semibold">
                          Air Freight Exposure
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          £{item.estimatedAirFreightExposure.toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-amber-300 font-semibold">
                          Margin Risk
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.marginRisk}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-orange-300 font-semibold">
                          Risk Reason
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.reason}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-sky-300 font-semibold">
                          Rescue Action
                        </h3>
                        <p className="text-slate-300 text-sm mt-2">
                          {item.rescueAction}
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