"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type BuyerProfitabilityRecord = {
  id: string;
  buyer: string;
  country: string;
  totalOrders: number;
  revenue: number;
  profitMargin: number;
  rejectionCost: number;
  delayCost: number;
  paymentRisk: "Low" | "Medium" | "High";
  profitabilityStatus: "Excellent" | "Stable" | "Risky" | "Loss Making";
  aiObservation: string;
};

const demoBuyerData: BuyerProfitabilityRecord[] = [
  {
    id: "BP-001",
    buyer: "Horizon Fashion Group",
    country: "UK",
    totalOrders: 18,
    revenue: 480000,
    profitMargin: 21,
    rejectionCost: 12000,
    delayCost: 8000,
    paymentRisk: "Low",
    profitabilityStatus: "Excellent",
    aiObservation:
      "Strong profitability with stable payment discipline and low operational exposure.",
  },
  {
    id: "BP-002",
    buyer: "Nordic Retail Alliance",
    country: "Germany",
    totalOrders: 11,
    revenue: 350000,
    profitMargin: 14,
    rejectionCost: 28000,
    delayCost: 24000,
    paymentRisk: "Medium",
    profitabilityStatus: "Stable",
    aiObservation:
      "Moderate profitability. Shipment delay and quality recovery cost are reducing margin strength.",
  },
  {
    id: "BP-003",
    buyer: "Urban Apparel Sourcing",
    country: "USA",
    totalOrders: 9,
    revenue: 250000,
    profitMargin: 6,
    rejectionCost: 42000,
    delayCost: 30000,
    paymentRisk: "High",
    profitabilityStatus: "Risky",
    aiObservation:
      "Buyer profitability is under pressure due to repeated claims, air shipment exposure, and payment delay risk.",
  },
  {
    id: "BP-004",
    buyer: "FastTrend Europe",
    country: "France",
    totalOrders: 7,
    revenue: 190000,
    profitMargin: -2,
    rejectionCost: 37000,
    delayCost: 26000,
    paymentRisk: "High",
    profitabilityStatus: "Loss Making",
    aiObservation:
      "Buyer relationship is generating operational and financial loss. Executive commercial review recommended.",
  },
];

function getStatusStyle(
  status: BuyerProfitabilityRecord["profitabilityStatus"]
) {
  if (status === "Loss Making") {
    return "border-red-700/40 bg-red-950/20 text-red-300";
  }

  if (status === "Risky") {
    return "border-orange-700/40 bg-orange-950/20 text-orange-300";
  }

  if (status === "Stable") {
    return "border-yellow-700/40 bg-yellow-950/20 text-yellow-300";
  }

  return "border-green-700/40 bg-green-950/20 text-green-300";
}

function getExecutiveAssessment(
  risky: number,
  lossMaking: number
) {
  if (lossMaking >= 1) {
    return "Commercial Recovery Intervention Required";
  }

  if (risky >= 2) {
    return "Buyer Profitability Under Pressure";
  }

  return "Buyer Portfolio Financially Stable";
}

export default function AIBuyerProfitabilityIntelligencePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    BuyerProfitabilityRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadBuyerProfitabilityData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore integration:
        // buyerOrders, costingEntries,
        // shipmentRecoveryCost,
        // qualityClaimCost,
        // paymentDelayRisk,
        // profitLeakageReports.
        const data = demoBuyerData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load buyer profitability intelligence:",
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

    loadBuyerProfitabilityData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalRevenue = records.reduce(
      (sum, record) => sum + record.revenue,
      0
    );

    const averageMargin =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, record) =>
                sum + record.profitMargin,
              0
            ) / records.length
          );

    const riskyBuyers = records.filter(
      (record) =>
        record.profitabilityStatus === "Risky"
    ).length;

    const lossMakingBuyers = records.filter(
      (record) =>
        record.profitabilityStatus === "Loss Making"
    ).length;

    return {
      totalRevenue,
      averageMargin,
      riskyBuyers,
      lossMakingBuyers,
      assessment: getExecutiveAssessment(
        riskyBuyers,
        lossMakingBuyers
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Buyer Profitability Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm">
              Module 103 · AI Buyer Profitability Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Buyer Profitability Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered commercial intelligence system
              evaluating buyer profitability,
              rejection exposure,
              shipment recovery cost,
              payment discipline,
              and operational financial risk.
            </p>

          </section>

          {loading ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading buyer profitability intelligence...
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-5">

                  <p className="text-cyan-300 text-sm">
                    Total Revenue
                  </p>

                  <h2 className="text-4xl font-bold mt-4">
                    $
                    {(
                      intelligence.totalRevenue / 1000
                    ).toFixed(0)}
                    k
                  </h2>

                </div>

                <div className="rounded-2xl border border-green-700/40 bg-green-950/10 p-5">

                  <p className="text-green-300 text-sm">
                    Avg Margin
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageMargin}%
                  </h2>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/10 p-5">

                  <p className="text-orange-300 text-sm">
                    Risky Buyers
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.riskyBuyers}
                  </h2>

                </div>

                <div className="rounded-2xl border border-red-700/40 bg-red-950/10 p-5">

                  <p className="text-red-300 text-sm">
                    Loss Making
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.lossMakingBuyers}
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6">

                <p className="text-cyan-300 uppercase tracking-widest text-sm">
                  Executive Commercial Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously reviews commercial
                  profitability, operational recovery cost,
                  buyer claims, shipment exposure,
                  and financial sustainability.
                </p>

              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Buyer Profitability Register
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>

                        <th className="text-left p-4">
                          Buyer
                        </th>

                        <th className="text-left p-4">
                          Revenue
                        </th>

                        <th className="text-left p-4">
                          Margin
                        </th>

                        <th className="text-left p-4">
                          Rejection Cost
                        </th>

                        <th className="text-left p-4">
                          Delay Cost
                        </th>

                        <th className="text-left p-4">
                          Status
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
                            {record.buyer}
                          </td>

                          <td className="p-4 text-cyan-300">
                            $
                            {record.revenue.toLocaleString()}
                          </td>

                          <td className="p-4 text-green-300">
                            {record.profitMargin}%
                          </td>

                          <td className="p-4 text-red-300">
                            $
                            {record.rejectionCost.toLocaleString()}
                          </td>

                          <td className="p-4 text-orange-300">
                            $
                            {record.delayCost.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {record.profitabilityStatus}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {records.map((record) => (
                  <article
                    key={record.id}
                    className={`rounded-2xl border p-5 ${getStatusStyle(
                      record.profitabilityStatus
                    )}`}
                  >

                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="text-sm opacity-80">
                          {record.country}
                        </p>

                        <h3 className="text-2xl font-bold mt-1">
                          {record.buyer}
                        </h3>

                      </div>

                      <div className="text-right">

                        <p className="text-sm opacity-80">
                          Orders
                        </p>

                        <p className="text-3xl font-bold">
                          {record.totalOrders}
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">

                      <p className="text-xs uppercase tracking-widest opacity-70">
                        AI Commercial Observation
                      </p>

                      <p className="text-sm text-slate-200 mt-2">
                        {record.aiObservation}
                      </p>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

                      <div>

                        <p className="opacity-70">
                          Payment Risk
                        </p>

                        <p className="font-semibold">
                          {record.paymentRisk}
                        </p>

                      </div>

                      <div>

                        <p className="opacity-70">
                          Profitability
                        </p>

                        <p className="font-semibold">
                          {record.profitabilityStatus}
                        </p>

                      </div>

                    </div>

                  </article>
                ))}

              </section>

            </>
          )}

        </div>

      </main>
    </DashboardShell>
  );
}