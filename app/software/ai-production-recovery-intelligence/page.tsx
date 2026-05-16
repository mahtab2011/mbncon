"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type RecoveryRecord = {
  id: string;
  orderNo: string;
  buyer: string;
  productionLine: string;
  plannedQty: number;
  completedQty: number;
  delayedHours: number;
  shipmentDaysLeft: number;
  recoveryProbability: number;
};

const demoRecoveryData: RecoveryRecord[] = [
  {
    id: "PRI-001",
    orderNo: "ORD-1450",
    buyer: "Zara",
    productionLine: "Line 4",
    plannedQty: 12000,
    completedQty: 8200,
    delayedHours: 18,
    shipmentDaysLeft: 6,
    recoveryProbability: 72,
  },
  {
    id: "PRI-002",
    orderNo: "ORD-1462",
    buyer: "H&M",
    productionLine: "Line 2",
    plannedQty: 8500,
    completedQty: 6400,
    delayedHours: 12,
    shipmentDaysLeft: 4,
    recoveryProbability: 61,
  },
  {
    id: "PRI-003",
    orderNo: "ORD-1488",
    buyer: "Primark",
    productionLine: "Line 7",
    plannedQty: 15000,
    completedQty: 14100,
    delayedHours: 5,
    shipmentDaysLeft: 8,
    recoveryProbability: 91,
  },
];

function calculateCompletion(planned: number, completed: number) {
  if (planned === 0) return 0;

  return Math.round((completed / planned) * 100);
}

function getRiskLevel(probability: number) {
  if (probability >= 85) return "Stable Recovery";
  if (probability >= 70) return "Moderate Recovery Risk";
  if (probability >= 55) return "High Recovery Risk";
  return "Critical Recovery Risk";
}

function getRecommendation(record: RecoveryRecord) {
  if (record.recoveryProbability < 55) {
    return "Urgent overtime approval, manpower balancing, and backup line allocation required immediately.";
  }

  if (record.delayedHours > 15) {
    return "AI recommends overtime balancing and production rescheduling to recover lost capacity.";
  }

  if (record.shipmentDaysLeft <= 5) {
    return "Shipment timeline approaching critical stage. Daily executive monitoring recommended.";
  }

  return "Production recovery currently manageable with operational monitoring.";
}

export default function AIProductionRecoveryIntelligencePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    RecoveryRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadRecoveryData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoRecoveryData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load production recovery intelligence:",
          error
        );

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecoveryData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalOrders = records.length;

    const averageRecoveryProbability =
      totalOrders === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.recoveryProbability,
              0
            ) / totalOrders
          );

    const totalDelayedHours = records.reduce(
      (sum, r) => sum + r.delayedHours,
      0
    );

    const criticalOrders = records.filter(
      (r) => r.recoveryProbability < 55
    ).length;

    return {
      totalOrders,
      averageRecoveryProbability,
      totalDelayedHours,
      criticalOrders,
      riskLevel: getRiskLevel(
        averageRecoveryProbability
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Production Recovery Intelligence">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-orange-700/40 bg-linear-to-r from-orange-950 via-slate-950 to-black p-6 shadow-2xl">

            <p className="text-orange-300 uppercase tracking-widest text-sm">
              Module 27 · AI Production Recovery Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Production Delay Recovery & Capacity Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered production recovery system for
              detecting schedule delays, estimating recovery
              probability, minimizing shipment risk, and
              recommending corrective operational actions
              before production disruption escalates.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading AI production recovery intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">

                  <p className="text-slate-400 text-sm">
                    Active Recovery Orders
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.totalOrders}
                  </h2>

                </div>

                <div className="rounded-2xl bg-orange-950/20 border border-orange-700/40 p-5">

                  <p className="text-orange-300 text-sm">
                    Delayed Hours
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.totalDelayedHours}
                  </h2>

                </div>

                <div className="rounded-2xl bg-red-950/20 border border-red-700/40 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Recovery Orders
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalOrders}
                  </h2>

                </div>

                <div className="rounded-2xl bg-green-950/20 border border-green-700/40 p-5">

                  <p className="text-green-300 text-sm">
                    Average Recovery Probability
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageRecoveryProbability}%
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-orange-700/40 bg-orange-950/10 p-6">

                <p className="text-orange-300 uppercase tracking-widest text-sm">
                  AI Recovery Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.riskLevel}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously monitors production delay
                  exposure, shipment pressure, and operational
                  recovery capability to prevent delivery
                  disruption and financial loss.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Production Recovery Intelligence Feed
                  </h2>
                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">
                          Order
                        </th>

                        <th className="text-left p-4">
                          Buyer
                        </th>

                        <th className="text-left p-4">
                          Line
                        </th>

                        <th className="text-left p-4">
                          Completion
                        </th>

                        <th className="text-left p-4">
                          Delay
                        </th>

                        <th className="text-left p-4">
                          Shipment Left
                        </th>

                        <th className="text-left p-4">
                          Recovery Probability
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-slate-800"
                        >
                          <td className="p-4">
                            {record.orderNo}
                          </td>

                          <td className="p-4">
                            {record.buyer}
                          </td>

                          <td className="p-4">
                            {record.productionLine}
                          </td>

                          <td className="p-4">
                            {calculateCompletion(
                              record.plannedQty,
                              record.completedQty
                            )}
                            %
                          </td>

                          <td className="p-4 text-orange-300">
                            {record.delayedHours} hrs
                          </td>

                          <td className="p-4">
                            {record.shipmentDaysLeft} days
                          </td>

                          <td className="p-4">
                            {record.recoveryProbability}%
                          </td>
                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {records.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-2xl bg-slate-900 border border-slate-800 p-5"
                  >
                    <p className="text-sm text-slate-400">
                      {record.orderNo} · {record.buyer}
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                      {getRiskLevel(
                        record.recoveryProbability
                      )}
                    </h3>

                    <p className="text-slate-300 mt-4">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">
                      <span className="text-orange-300">
                        Delay:
                        {" "}
                        {record.delayedHours} hrs
                      </span>

                      <span className="text-green-300">
                        Recovery:
                        {" "}
                        {record.recoveryProbability}%
                      </span>
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