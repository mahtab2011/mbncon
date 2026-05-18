"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type OrderProfitRecord = {
  id: string;
  orderNo: string;
  buyer: string;
  product: string;
  orderValue: number;
  plannedCost: number;
  actualCost: number;
  reworkCost: number;
  delayCost: number;
  airShipmentCost: number;
  profitMargin: number;
  status: "Profitable" | "Margin Pressure" | "Risky" | "Loss Making";
  aiObservation: string;
};

const demoOrderData: OrderProfitRecord[] = [
  {
    id: "OP-001",
    orderNo: "ORD-1001",
    buyer: "Horizon Fashion Group",
    product: "Denim Jacket",
    orderValue: 120000,
    plannedCost: 92000,
    actualCost: 97000,
    reworkCost: 2500,
    delayCost: 1500,
    airShipmentCost: 0,
    profitMargin: 19,
    status: "Profitable",
    aiObservation:
      "Order remains profitable. Minor rework cost should be reviewed but commercial position is healthy.",
  },
  {
    id: "OP-002",
    orderNo: "ORD-1002",
    buyer: "Nordic Retail Alliance",
    product: "Cotton Shirt",
    orderValue: 85000,
    plannedCost: 69000,
    actualCost: 76000,
    reworkCost: 5200,
    delayCost: 3500,
    airShipmentCost: 0,
    profitMargin: 11,
    status: "Margin Pressure",
    aiObservation:
      "Profit margin is under pressure due to rework and production delay cost. Recovery control is required.",
  },
  {
    id: "OP-003",
    orderNo: "ORD-1003",
    buyer: "Urban Apparel Sourcing",
    product: "Cargo Trouser",
    orderValue: 95000,
    plannedCost: 76000,
    actualCost: 90000,
    reworkCost: 7800,
    delayCost: 6000,
    airShipmentCost: 4200,
    profitMargin: 5,
    status: "Risky",
    aiObservation:
      "Order is commercially risky. Rework, delay, and air shipment exposure are reducing profitability.",
  },
  {
    id: "OP-004",
    orderNo: "ORD-1004",
    buyer: "FastTrend Europe",
    product: "Ladies Top",
    orderValue: 68000,
    plannedCost: 57000,
    actualCost: 73000,
    reworkCost: 6800,
    delayCost: 5200,
    airShipmentCost: 3500,
    profitMargin: -7,
    status: "Loss Making",
    aiObservation:
      "Order is loss making. Immediate executive review required before accepting similar future orders.",
  },
];

function getStatusStyle(status: OrderProfitRecord["status"]) {
  if (status === "Loss Making") {
    return "border-red-700/40 bg-red-950/20 text-red-300";
  }

  if (status === "Risky") {
    return "border-orange-700/40 bg-orange-950/20 text-orange-300";
  }

  if (status === "Margin Pressure") {
    return "border-yellow-700/40 bg-yellow-950/20 text-yellow-300";
  }

  return "border-green-700/40 bg-green-950/20 text-green-300";
}

function getExecutiveAssessment(risky: number, lossMaking: number) {
  if (lossMaking >= 1) {
    return "Order-Level Profit Recovery Required";
  }

  if (risky >= 2) {
    return "Order Portfolio Under Margin Pressure";
  }

  if (risky >= 1) {
    return "Selected Orders Need Commercial Monitoring";
  }

  return "Order Profitability Stable";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AIOrderProfitabilityIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<OrderProfitRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadOrderProfitabilityData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore integration:
        // buyerOrderEntries, costingProfitabilityEntries,
        // wastageLogs, reworkRecords, shipmentRecoveryCosts,
        // airShipmentRisk, factoryLossIntelligenceEntries.
        const data = demoOrderData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load order profitability intelligence:", error);

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrderProfitabilityData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalOrderValue = records.reduce(
      (sum, record) => sum + record.orderValue,
      0
    );

    const totalActualCost = records.reduce(
      (sum, record) => sum + record.actualCost,
      0
    );

    const totalLeakage = records.reduce(
      (sum, record) =>
        sum + record.reworkCost + record.delayCost + record.airShipmentCost,
      0
    );

    const averageMargin =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce((sum, record) => sum + record.profitMargin, 0) /
              records.length
          );

    const riskyOrders = records.filter(
      (record) => record.status === "Risky"
    ).length;

    const lossMakingOrders = records.filter(
      (record) => record.status === "Loss Making"
    ).length;

    return {
      totalOrderValue,
      totalActualCost,
      totalLeakage,
      averageMargin,
      riskyOrders,
      lossMakingOrders,
      assessment: getExecutiveAssessment(riskyOrders, lossMakingOrders),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Order Profitability Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm">
              Module 104 · AI Order Profitability Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Order-Level Profitability Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered order profitability control system for tracking planned
              cost, actual cost, rework cost, delay cost, air shipment cost,
              margin pressure, and order-level commercial risk.
            </p>
          </section>

          {loading ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading order profitability intelligence...
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">

  <a
    href="#total-order-value"
    className="block rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
  >

    <p className="text-cyan-300 text-sm">
      Order Value
    </p>

    <h2 className="text-4xl font-bold mt-4">
      ${(intelligence.totalOrderValue / 1000).toFixed(0)}k
    </h2>

  </a>

  <a
    href="#actual-order-cost"
    className="block rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-5 transition hover:-translate-y-1 hover:border-fuchsia-400/40"
  >

    <p className="text-fuchsia-300 text-sm">
      Actual Cost
    </p>

    <h2 className="text-4xl font-bold mt-4">
      ${(intelligence.totalActualCost / 1000).toFixed(0)}k
    </h2>

  </a>

  <a
    href="#profit-leakage"
    className="block rounded-2xl border border-red-700/40 bg-red-950/10 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >

    <p className="text-red-300 text-sm">
      Profit Leakage
    </p>

    <h2 className="text-4xl font-bold mt-4">
      ${intelligence.totalLeakage.toLocaleString()}
    </h2>

  </a>

  <a
    href="#average-margin"
    className="block rounded-2xl border border-green-700/40 bg-green-950/10 p-5 transition hover:-translate-y-1 hover:border-green-400/40"
  >

    <p className="text-green-300 text-sm">
      Avg Margin
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.averageMargin}%
    </h2>

  </a>

  <a
    href="#risky-orders"
    className="block rounded-2xl border border-orange-700/40 bg-orange-950/10 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
  >

    <p className="text-orange-300 text-sm">
      Risky/Loss Orders
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.riskyOrders + intelligence.lossMakingOrders}
    </h2>

  </a>

</section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Order Profitability Register
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">Order</th>
                        <th className="text-left p-4">Buyer</th>
                        <th className="text-left p-4">Value</th>
                        <th className="text-left p-4">Actual Cost</th>
                        <th className="text-left p-4">Leakage</th>
                        <th className="text-left p-4">Margin</th>
                        <th className="text-left p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>

  {records.map((record) => {
    const leakage =
      record.reworkCost +
      record.delayCost +
      record.airShipmentCost;

    return (
      <tr
        key={record.id}
        id={slugify(record.orderNo)}
        className="border-b border-slate-800 transition hover:bg-cyan-900/20"
      >

        <td className="p-4">
          <a
            href={`#${slugify(record.orderNo)}`}
            className="text-cyan-300 underline hover:text-cyan-200"
          >
            {record.orderNo}
          </a>
        </td>

        <td className="p-4">
          {record.buyer}
        </td>

        <td className="p-4 text-cyan-300">
          ${record.orderValue.toLocaleString()}
        </td>

        <td className="p-4 text-fuchsia-300">
          ${record.actualCost.toLocaleString()}
        </td>

        <td className="p-4 text-red-300">
          ${leakage.toLocaleString()}
        </td>

        <td className="p-4 text-green-300">
          {record.profitMargin}%
        </td>

        <td className="p-4">
          {record.status}
        </td>

      </tr>
    );
  })}

</tbody>
                  </table>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {records.map((record) => (
    <a
      key={record.id}
      href={`#${slugify(record.orderNo)}`}
      className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400/40 ${getStatusStyle(
        record.status
      )}`}
    >

      <div className="flex justify-between gap-4">

        <div>

          <p className="text-sm opacity-80">
            {record.orderNo}
          </p>

          <h3 className="text-2xl font-bold mt-1">
            {record.product}
          </h3>

          <p className="text-sm opacity-80 mt-1">
            {record.buyer}
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm opacity-80">
            Margin
          </p>

          <p className="text-3xl font-bold">
            {record.profitMargin}%
          </p>

        </div>

      </div>

      <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">

        <p className="text-xs uppercase tracking-widest opacity-70">
          AI Order Observation
        </p>

        <p className="text-sm text-slate-200 mt-2">
          {record.aiObservation}
        </p>

      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">

        <div>

          <p className="opacity-70">
            Rework
          </p>

          <p className="font-semibold">
            ${record.reworkCost.toLocaleString()}
          </p>

        </div>

        <div>

          <p className="opacity-70">
            Delay
          </p>

          <p className="font-semibold">
            ${record.delayCost.toLocaleString()}
          </p>

        </div>

        <div>

          <p className="opacity-70">
            Air
          </p>

          <p className="font-semibold">
            ${record.airShipmentCost.toLocaleString()}
          </p>

        </div>

      </div>

    </a>
  ))}

</section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}