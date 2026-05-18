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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

function getExecutiveAssessment(risky: number, lossMaking: number) {
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
  const [records, setRecords] = useState<BuyerProfitabilityRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadBuyerProfitabilityData() {
      try {
        setLoading(true);

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
            records.reduce((sum, record) => sum + record.profitMargin, 0) /
              records.length
          );

    const riskyBuyers = records.filter(
      (record) => record.profitabilityStatus === "Risky"
    ).length;

    const lossMakingBuyers = records.filter(
      (record) => record.profitabilityStatus === "Loss Making"
    ).length;

    return {
      totalRevenue,
      averageMargin,
      riskyBuyers,
      lossMakingBuyers,
      assessment: getExecutiveAssessment(riskyBuyers, lossMakingBuyers),
    };
  }, [records]);

  const kpiCards = [
    {
      label: "Total Revenue",
      value: `$${(intelligence.totalRevenue / 1000).toFixed(0)}k`,
      href: "#total-revenue",
      className: "border-cyan-700/40 bg-cyan-950/10 text-cyan-300",
    },
    {
      label: "Avg Margin",
      value: `${intelligence.averageMargin}%`,
      href: "#avg-margin",
      className: "border-green-700/40 bg-green-950/10 text-green-300",
    },
    {
      label: "Risky Buyers",
      value: String(intelligence.riskyBuyers),
      href: "#risky-buyers",
      className: "border-orange-700/40 bg-orange-950/10 text-orange-300",
    },
    {
      label: "Loss Making",
      value: String(intelligence.lossMakingBuyers),
      href: "#loss-making",
      className: "border-red-700/40 bg-red-950/10 text-red-300",
    },
  ];

  return (
    <DashboardShell title="AI Buyer Profitability Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 103 · AI Buyer Profitability Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Buyer Profitability Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              AI-powered commercial intelligence system evaluating buyer
              profitability, rejection exposure, shipment recovery cost, payment
              discipline, and operational financial risk.
            </p>
          </section>

          {loading ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading buyer profitability intelligence...
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {kpiCards.map((card, index) => (
                  <a
                    key={card.href}
                    href={card.href}
                    className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400 ${card.className}`}
                  >
                    <p className="text-xs font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <p className="mt-2 text-sm">{card.label}</p>

                    <h2 className="mt-4 text-4xl font-bold">
                      {card.value}
                    </h2>
                  </a>
                ))}
              </section>

              <section className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6">
                <p className="text-sm uppercase tracking-widest text-cyan-300">
                  Executive Commercial Assessment
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {intelligence.assessment}
                </h2>

                <p className="mt-4 text-slate-300">
                  AI continuously reviews commercial profitability, operational
                  recovery cost, buyer claims, shipment exposure, and financial
                  sustainability.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-2xl font-bold">
                  KPI Detail Sections
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {[
                    [
                      "total-revenue",
                      "Total Revenue",
                      "Total commercial revenue from all monitored buyers. This helps management understand portfolio scale and buyer dependency.",
                    ],
                    [
                      "avg-margin",
                      "Average Margin",
                      "Average profit margin across the buyer portfolio. Low margin signals commercial pressure, cost leakage, or weak pricing control.",
                    ],
                    [
                      "risky-buyers",
                      "Risky Buyers",
                      "Buyers with profitability or payment exposure requiring commercial review and recovery action.",
                    ],
                    [
                      "loss-making",
                      "Loss Making Buyers",
                      "Buyers currently creating negative commercial contribution and requiring executive intervention.",
                    ],
                  ].map(([id, title, detail]) => (
                    <section
                      key={id}
                      id={id}
                      className="scroll-mt-28 rounded-xl border border-slate-800 bg-slate-950/70 p-5"
                    >
                      <h3 className="text-xl font-bold text-cyan-300">
                        {title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {detail}
                      </p>
                    </section>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Buyer Profitability Register
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="p-4 text-left">Buyer</th>
                        <th className="p-4 text-left">Revenue</th>
                        <th className="p-4 text-left">Margin</th>
                        <th className="p-4 text-left">Rejection Cost</th>
                        <th className="p-4 text-left">Delay Cost</th>
                        <th className="p-4 text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-slate-800"
                        >
                          <td className="p-4">
                            <a
                              href={`#buyer-${slugify(record.buyer)}`}
                              className="font-semibold text-cyan-300 hover:underline"
                            >
                              {record.buyer}
                            </a>
                          </td>

                          <td className="p-4 text-cyan-300">
                            ${record.revenue.toLocaleString()}
                          </td>

                          <td className="p-4 text-green-300">
                            {record.profitMargin}%
                          </td>

                          <td className="p-4 text-red-300">
                            ${record.rejectionCost.toLocaleString()}
                          </td>

                          <td className="p-4 text-orange-300">
                            ${record.delayCost.toLocaleString()}
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

              <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {records.map((record, index) => {
                  const id = `buyer-${slugify(record.buyer)}`;

                  return (
                    <a
                      key={record.id}
                      href={`#${id}`}
                      className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400 ${getStatusStyle(
                        record.profitabilityStatus
                      )}`}
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-sm opacity-80">
                            {String(index + 1).padStart(2, "0")} ·{" "}
                            {record.country}
                          </p>

                          <h3 className="mt-1 text-2xl font-bold">
                            {record.buyer}
                          </h3>
                        </div>

                        <div className="text-right">
                          <p className="text-sm opacity-80">Orders</p>

                          <p className="text-3xl font-bold">
                            {record.totalOrders}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
                        <p className="text-xs uppercase tracking-widest opacity-70">
                          AI Commercial Observation
                        </p>

                        <p className="mt-2 text-sm text-slate-200">
                          {record.aiObservation}
                        </p>
                      </div>

                      <p className="mt-5 text-sm font-semibold text-cyan-300">
                        Open buyer detail →
                      </p>
                    </a>
                  );
                })}
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-2xl font-bold">
                  Buyer Detail Sections
                </h2>

                <div className="mt-6 space-y-5">
                  {records.map((record, index) => {
                    const id = `buyer-${slugify(record.buyer)}`;

                    return (
                      <section
                        key={record.id}
                        id={id}
                        className="scroll-mt-28 rounded-xl border border-slate-800 bg-slate-950/70 p-5"
                      >
                        <h3 className="text-xl font-bold text-cyan-300">
                          {String(index + 1).padStart(2, "0")} {record.buyer}
                        </h3>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <p className="text-sm text-slate-300">
                            Country: {record.country}
                          </p>

                          <p className="text-sm text-slate-300">
                            Orders: {record.totalOrders}
                          </p>

                          <p className="text-sm text-slate-300">
                            Revenue: ${record.revenue.toLocaleString()}
                          </p>

                          <p className="text-sm text-slate-300">
                            Profit Margin: {record.profitMargin}%
                          </p>

                          <p className="text-sm text-slate-300">
                            Rejection Cost: $
                            {record.rejectionCost.toLocaleString()}
                          </p>

                          <p className="text-sm text-slate-300">
                            Delay Cost: ${record.delayCost.toLocaleString()}
                          </p>

                          <p className="text-sm text-slate-300">
                            Payment Risk: {record.paymentRisk}
                          </p>

                          <p className="text-sm text-slate-300">
                            Profitability: {record.profitabilityStatus}
                          </p>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs uppercase tracking-widest text-cyan-300">
                            AI Commercial Observation
                          </p>

                          <p className="mt-2 text-sm leading-7 text-slate-300">
                            {record.aiObservation}
                          </p>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}