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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function badgeClass(level: ShipmentPrediction["riskLevel"]) {
  if (level === "Critical") {
    return "bg-red-600 text-white";
  }

  if (level === "High") {
    return "bg-orange-500 text-white";
  }

  if (level === "Medium") {
    return "bg-yellow-500 text-slate-950";
  }

  return "bg-emerald-500 text-slate-950";
}

function barClass(level: ShipmentPrediction["riskLevel"]) {
  if (level === "Critical") {
    return "bg-red-600";
  }

  if (level === "High") {
    return "bg-orange-500";
  }

  if (level === "Medium") {
    return "bg-yellow-500";
  }

  return "bg-emerald-500";
}

function generateShipmentPredictions(
  orders: RecordType[],
  productionLogs: RecordType[],
  maintenanceLogs: RecordType[],
  wastageLogs: RecordType[]
): ShipmentPrediction[] {
  const productionLoss = productionLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(
        item.lossAmount || item.delayCost || item.productionLoss
      ),
    0
  );

  const downtimeHours = maintenanceLogs.reduce(
    (sum, item) =>
      sum + numberValue(item.downtimeHours || item.breakdownHours),
    0
  );

  const wastageLoss = wastageLogs.reduce(
    (sum, item) =>
      sum +
      numberValue(
        item.wastageCost || item.lossAmount || item.materialLoss
      ),
    0
  );

  const baseRisk = Math.min(
    100,
    Math.round(
      productionLoss / 1500 + downtimeHours * 3 + wastageLoss / 2500
    )
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
      const orderQty = numberValue(
        order.orderQty || order.quantity || order.qty
      );

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
        const safeFetch = async (
          fn: () => Promise<any>
        ): Promise<RecordType[]> => {
          try {
            const result = await Promise.race([
              fn(),
              new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
            ]);

            return Array.isArray(result) ? (result as RecordType[]) : [];
          } catch {
            return [];
          }
        };

        const [buyerOrders, production, maintenance, wastage] =
          await Promise.all([
            safeFetch(() => getBuyerOrderEntries("demo-factory")),
            safeFetch(() => getProductionLogs("demo-factory")),
            safeFetch(() => getMaintenanceLogs("demo-factory")),
            safeFetch(() => getWastageLogs("demo-factory")),
          ]);

        setOrders(buyerOrders);
        setProductionLogs(production);
        setMaintenanceLogs(maintenance);
        setWastageLogs(wastage);
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

  const intelligenceCards = [
    {
      title: "Highest Delay Risk",
      value: topRisk?.orderRef || "N/A",
      description: `Probability: ${topRisk?.delayProbability || 0}%`,
      target: topRisk?.orderRef || "shipment-delay-details",
      className: "border-red-700 bg-red-950/50 text-red-200",
    },
    {
      title: "Critical Delay Risks",
      value: criticalCount.toString(),
      description: "Orders requiring immediate executive attention.",
      target: "Shipment Delay Details",
      className: "border-orange-700 bg-orange-950/50 text-orange-200",
    },
    {
      title: "High Delay Risks",
      value: highCount.toString(),
      description: "Orders requiring factory director follow-up.",
      target: "Executive Recovery Intelligence",
      className: "border-slate-700 bg-slate-900 text-slate-300",
    },
  ];

  return (
    <DashboardShell title="AI Shipment Delay Prediction">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
              MBNCON AI Export Manufacturing Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
              AI Shipment Delay Prediction Engine
            </h1>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
              This module predicts shipment delay risk using buyer orders,
              production loss, machine downtime, wastage, and operational
              pressure.
            </p>
          </section>

          {loading ? (
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-md">
              <p className="text-lg font-semibold text-slate-200">
                Loading shipment delay prediction intelligence...
              </p>

              <p className="mt-3 text-sm text-slate-400">
                Enterprise-safe Firestore loading is active with timeout
                protection.
              </p>
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {intelligenceCards.map((card) => {
                  const targetId = slugify(card.target);

                  return (
                    <a
                      key={card.title}
                      href={`#${targetId}`}
                      className={`rounded-2xl border p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-xl ${card.className}`}
                    >
                      <p className="text-sm opacity-80">{card.title}</p>

                      <h2 className="mt-2 text-3xl font-bold">
                        {card.value}
                      </h2>

                      <p className="mt-3 text-sm opacity-90">
                        {card.description}
                      </p>

                      <p className="mt-5 text-xs font-semibold opacity-70">
                        View intelligence →
                      </p>
                    </a>
                  );
                })}
              </section>

              <section
                id={slugify("Shipment Delay Details")}
                className="scroll-mt-28 space-y-5"
              >
                {predictions.map((item) => {
                  const itemId = slugify(item.orderRef);

                  return (
                    <section
                      key={item.orderRef}
                      id={itemId}
                      className="scroll-mt-28 space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-md transition duration-300 hover:border-slate-700 hover:shadow-xl"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-slate-400">
                            {item.buyer}
                          </p>

                          <h2 className="mt-1 text-3xl font-bold">
                            {item.orderRef}
                          </h2>
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${badgeClass(
                            item.riskLevel
                          )}`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">
                          Delay Probability: {item.delayProbability}%
                        </p>

                        <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-4 transition-all duration-500 ${barClass(
                              item.riskLevel
                            )}`}
                            style={{
                              width: `${item.delayProbability}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-red-300">
                            Risk Reason
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.riskReason}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-orange-300">
                            Expected Impact
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.expectedImpact}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg">
                          <h3 className="font-semibold text-sky-300">
                            Recovery Action
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.recoveryAction}
                          </p>
                        </div>
                      </div>
                    </section>
                  );
                })}
              </section>

              <section
                id={slugify("Executive Recovery Intelligence")}
                className="scroll-mt-28 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-8 shadow-md transition duration-300 hover:border-emerald-400/50 hover:shadow-xl"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Executive Recovery Intelligence
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  Shipment Protection & Recovery Layer
                </h2>

                <p className="mt-5 max-w-5xl text-lg leading-8 text-emerald-100">
                  MBNCON shipment prediction intelligence helps directors
                  identify high-risk export orders, escalate operational
                  bottlenecks, protect buyer confidence, reduce air shipment
                  exposure, and improve shipment recovery planning before delays
                  become critical.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {[
                    "Early shipment risk visibility",
                    "Executive recovery escalation",
                    "Buyer commitment protection",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">{item}</p>

                      <p className="mt-3 text-sm leading-6 text-emerald-100">
                        Consultancy-demo executive UX prepared for export
                        manufacturing intelligence and shipment recovery
                        control.
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}