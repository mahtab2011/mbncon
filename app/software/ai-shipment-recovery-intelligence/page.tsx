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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRiskLevel(probability: number) {
  if (probability >= 85) return "Shipment Stable";
  if (probability >= 70) return "Moderate Shipment Risk";
  if (probability >= 55) return "High Shipment Risk";
  return "Critical Shipment Risk";
}

function getRecommendation(record: ShipmentRecoveryRecord) {
  if (record.recoveryProbability < 55) {
    return "Immediate shipment recovery action required. Evaluate air shipment, production recovery, and executive buyer escalation.";
  }

  if (record.shipmentDaysLeft <= 4) {
    return "Shipment timeline is approaching a critical threshold. Daily logistics monitoring and recovery ownership are recommended.";
  }

  if (record.airShipmentCost < record.estimatedPenalty) {
    return "AI recommends evaluating partial or full air shipment recovery because penalty exposure is higher than recovery cost.";
  }

  return "Shipment recovery remains operationally manageable with normal monitoring and logistics coordination.";
}

export default function AIShipmentRecoveryIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ShipmentRecoveryRecord[]>([]);

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
        console.error("Failed to load shipment recovery intelligence:", error);

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
            records.reduce((sum, r) => sum + r.recoveryProbability, 0) /
              totalOrders
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
      riskLevel: getRiskLevel(averageRecoveryProbability),
    };
  }, [records]);

  const kpiCards = [
    {
      label: "Recovery Orders",
      value: intelligence.totalOrders,
      href: "#shipment-recovery-feed",
      className: "bg-slate-900 border-slate-800",
    },
    {
      label: "Critical Shipments",
      value: intelligence.criticalShipments,
      href: "#ai-shipment-assessment",
      className: "bg-red-950/20 border-red-700/40",
    },
    {
      label: "Recovery Probability",
      value: `${intelligence.averageRecoveryProbability}%`,
      href: "#ai-recommendations",
      className: "bg-blue-950/20 border-blue-700/40",
    },
    {
      label: "Penalty Exposure",
      value: `£${intelligence.totalPenaltyExposure.toLocaleString()}`,
      href: "#financial-recovery-assessment",
      className: "bg-orange-950/20 border-orange-700/40",
    },
    {
      label: "Air Recovery Cost",
      value: `£${intelligence.totalAirRecoveryCost.toLocaleString()}`,
      href: "#financial-recovery-assessment",
      className: "bg-cyan-950/20 border-cyan-700/40",
    },
  ];

  return (
    <DashboardShell title="AI Shipment Recovery Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-2xl border border-blue-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-widest text-blue-300">
              Module 28 · AI Shipment Recovery Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Shipment Rescue & Logistics Recovery Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              AI-powered shipment recovery system for estimating delivery risk,
              recovery feasibility, air shipment decisions, penalty exposure,
              and buyer escalation priorities before shipment disruption becomes
              financially critical.
            </p>
          </section>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading shipment recovery intelligence...
            </div>
          ) : (
            <>
              <section
                id="executive-kpis"
                className="grid scroll-mt-28 grid-cols-1 gap-4 md:grid-cols-5"
              >
                {kpiCards.map((card) => (
                  <a
                    key={card.label}
                    href={card.href}
                    className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-blue-400/70 hover:shadow-xl ${card.className}`}
                  >
                    <p className="text-sm text-slate-300">{card.label}</p>
                    <h2 className="mt-3 text-4xl font-bold">{card.value}</h2>
                    <p className="mt-3 text-xs text-slate-500">
                      Click to review details
                    </p>
                  </a>
                ))}
              </section>

              <section
                id="ai-shipment-assessment"
                className="scroll-mt-28 rounded-2xl border border-blue-700/40 bg-blue-950/10 p-6"
              >
                <p className="text-sm uppercase tracking-widest text-blue-300">
                  AI Shipment Assessment
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {intelligence.riskLevel}
                </h2>

                <p className="mt-4 text-slate-300">
                  AI continuously evaluates shipment feasibility, logistics
                  timing, production readiness, and financial recovery options to
                  reduce export risk and delivery penalties.
                </p>
              </section>

              <section
                id="financial-recovery-assessment"
                className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm uppercase tracking-widest text-cyan-300">
                  Financial Recovery Assessment
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Penalty vs Air Shipment Recovery Decision
                </h2>

                <p className="mt-4 text-slate-300">
                  Total penalty exposure is{" "}
                  <span className="font-semibold text-orange-300">
                    £{intelligence.totalPenaltyExposure.toLocaleString()}
                  </span>
                  , while estimated air recovery cost is{" "}
                  <span className="font-semibold text-cyan-300">
                    £{intelligence.totalAirRecoveryCost.toLocaleString()}
                  </span>
                  . Management should compare the recovery cost against buyer
                  penalty, relationship risk, future order risk, and shipment
                  delay exposure.
                </p>
              </section>

              <section
                id="shipment-recovery-feed"
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
              >
                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Shipment Recovery Intelligence Feed
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="p-4 text-left">Order</th>
                        <th className="p-4 text-left">Buyer</th>
                        <th className="p-4 text-left">Destination</th>
                        <th className="p-4 text-left">Shipment Left</th>
                        <th className="p-4 text-left">Completion</th>
                        <th className="p-4 text-left">Recovery</th>
                        <th className="p-4 text-left">Penalty</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record) => {
                        const sectionId = slugify(
                          `${record.orderNo}-${record.buyer}`
                        );

                        return (
                          <tr
                            key={record.id}
                            onClick={() => {
                              document
                                .getElementById(sectionId)
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            }}
                            className="cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/70"
                          >
                            <td className="p-4 font-semibold">
                              {record.orderNo}
                            </td>
                            <td className="p-4">{record.buyer}</td>
                            <td className="p-4">{record.destination}</td>
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
                              £{record.estimatedPenalty.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                id="ai-recommendations"
                className="grid scroll-mt-28 grid-cols-1 gap-4 md:grid-cols-2"
              >
                {records.map((record) => {
                  const sectionId = slugify(`${record.orderNo}-${record.buyer}`);

                  return (
                    <a
                      key={record.id}
                      id={sectionId}
                      href="#shipment-recovery-feed"
                      className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-blue-400/70 hover:shadow-xl"
                    >
                      <p className="text-sm text-slate-400">
                        {record.orderNo} · {record.buyer} ·{" "}
                        {record.destination}
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        {getRiskLevel(record.recoveryProbability)}
                      </h3>

                      <p className="mt-4 text-slate-300">
                        {getRecommendation(record)}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-xl border border-red-700/40 bg-red-950/20 p-4">
                          <p className="text-slate-400">Penalty Exposure</p>
                          <p className="mt-1 text-lg font-bold text-red-300">
                            £{record.estimatedPenalty.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-4">
                          <p className="text-slate-400">Air Recovery Cost</p>
                          <p className="mt-1 text-lg font-bold text-cyan-300">
                            £{record.airShipmentCost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-500">
                        Click to return to shipment recovery feed
                      </p>
                    </a>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}