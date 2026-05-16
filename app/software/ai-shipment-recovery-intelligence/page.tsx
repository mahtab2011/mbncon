"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type ShipmentRecoveryRecord = {
  id: string;
  orderNo: string;
  buyer: string;
  destination: string;
  shipmentMode: string;
  shipmentDaysLeft: number;
  productionCompletion: number;
  recoveryProbability: number;
  estimatedPenalty: number;
  airShipmentCost: number;
};

const demoShipmentRecoveryData: ShipmentRecoveryRecord[] = [
  {
    id: "SRI-001",
    orderNo: "ORD-2201",
    buyer: "Zara",
    destination: "Spain",
    shipmentMode: "Sea",
    shipmentDaysLeft: 4,
    productionCompletion: 82,
    recoveryProbability: 58,
    estimatedPenalty: 12000,
    airShipmentCost: 8500,
  },
  {
    id: "SRI-002",
    orderNo: "ORD-2208",
    buyer: "H&M",
    destination: "Germany",
    shipmentMode: "Sea",
    shipmentDaysLeft: 7,
    productionCompletion: 91,
    recoveryProbability: 86,
    estimatedPenalty: 4500,
    airShipmentCost: 6200,
  },
  {
    id: "SRI-003",
    orderNo: "ORD-2217",
    buyer: "Primark",
    destination: "UK",
    shipmentMode: "Sea",
    shipmentDaysLeft: 3,
    productionCompletion: 74,
    recoveryProbability: 42,
    estimatedPenalty: 18500,
    airShipmentCost: 9700,
  },
];

function getRiskLevel(probability: number) {
  if (probability >= 85) {
    return "Shipment Stable";
  }

  if (probability >= 70) {
    return "Moderate Shipment Risk";
  }

  if (probability >= 55) {
    return "High Shipment Risk";
  }

  return "Critical Shipment Risk";
}

function getRecommendation(
  record: ShipmentRecoveryRecord
) {
  if (record.recoveryProbability < 55) {
    return "Immediate shipment recovery action required. Evaluate air shipment and executive buyer escalation.";
  }

  if (record.shipmentDaysLeft <= 4) {
    return "Shipment timeline approaching critical threshold. Daily logistics monitoring recommended.";
  }

  if (
    record.airShipmentCost <
    record.estimatedPenalty
  ) {
    return "AI recommends evaluating partial or full air shipment recovery.";
  }

  return "Shipment recovery remains operationally manageable.";
}

export default function AIShipmentRecoveryIntelligencePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    ShipmentRecoveryRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadShipmentRecoveryData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoShipmentRecoveryData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load shipment recovery intelligence:",
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

    loadShipmentRecoveryData();

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

    const criticalShipments = records.filter(
      (r) => r.recoveryProbability < 55
    ).length;

    const totalPenaltyExposure = records.reduce(
      (sum, r) => sum + r.estimatedPenalty,
      0
    );

    const totalAirRecoveryCost = records.reduce(
      (sum, r) => sum + r.airShipmentCost,
      0
    );

    return {
      totalOrders,
      averageRecoveryProbability,
      criticalShipments,
      totalPenaltyExposure,
      totalAirRecoveryCost,
      riskLevel: getRiskLevel(
        averageRecoveryProbability
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Shipment Recovery Intelligence">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-blue-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-blue-300 uppercase tracking-widest text-sm">
              Module 28 · AI Shipment Recovery Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Shipment Rescue & Logistics Recovery Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered shipment recovery system for
              estimating delivery risk, recovery feasibility,
              air shipment decisions, penalty exposure,
              and buyer escalation priorities before
              shipment disruption becomes financially critical.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading shipment recovery intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">

                  <p className="text-slate-400 text-sm">
                    Recovery Orders
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.totalOrders}
                  </h2>

                </div>

                <div className="rounded-2xl bg-red-950/20 border border-red-700/40 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Shipments
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalShipments}
                  </h2>

                </div>

                <div className="rounded-2xl bg-blue-950/20 border border-blue-700/40 p-5">

                  <p className="text-blue-300 text-sm">
                    Recovery Probability
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageRecoveryProbability}%
                  </h2>

                </div>

                <div className="rounded-2xl bg-orange-950/20 border border-orange-700/40 p-5">

                  <p className="text-orange-300 text-sm">
                    Penalty Exposure
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    £
                    {intelligence.totalPenaltyExposure.toLocaleString()}
                  </h2>

                </div>

                <div className="rounded-2xl bg-cyan-950/20 border border-cyan-700/40 p-5">

                  <p className="text-cyan-300 text-sm">
                    Air Recovery Cost
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    £
                    {intelligence.totalAirRecoveryCost.toLocaleString()}
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-blue-700/40 bg-blue-950/10 p-6">

                <p className="text-blue-300 uppercase tracking-widest text-sm">
                  AI Shipment Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.riskLevel}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates shipment
                  feasibility, logistics timing,
                  production readiness, and financial
                  recovery options to reduce export risk
                  and delivery penalties.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Shipment Recovery Intelligence Feed
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
                          Destination
                        </th>

                        <th className="text-left p-4">
                          Shipment Left
                        </th>

                        <th className="text-left p-4">
                          Completion
                        </th>

                        <th className="text-left p-4">
                          Recovery
                        </th>

                        <th className="text-left p-4">
                          Penalty
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
                            {record.destination}
                          </td>

                          <td className="p-4 text-orange-300">
                            {record.shipmentDaysLeft} days
                          </td>

                          <td className="p-4">
                            {record.productionCompletion}%
                          </td>

                          <td className="p-4">
                            {record.recoveryProbability}%
                          </td>

                          <td className="p-4 text-red-300">
                            £
                            {record.estimatedPenalty.toLocaleString()}
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

                      <span className="text-red-300">
                        Penalty:
                        {" "}
                        £
                        {record.estimatedPenalty.toLocaleString()}
                      </span>

                      <span className="text-cyan-300">
                        Air:
                        {" "}
                        £
                        {record.airShipmentCost.toLocaleString()}
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