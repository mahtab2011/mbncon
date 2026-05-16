"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type BuyerRecord = {
  id: string;
  buyer: string;
  onTimeDelivery: number;
  qualityScore: number;
  complaintCount: number;
  communicationScore: number;
  repeatOrderProbability: number;
  relationshipRisk: "Low" | "Medium" | "High" | "Critical";
};

const demoBuyerData: BuyerRecord[] = [
  {
    id: "BSI-001",
    buyer: "Zara",
    onTimeDelivery: 82,
    qualityScore: 76,
    complaintCount: 5,
    communicationScore: 72,
    repeatOrderProbability: 68,
    relationshipRisk: "High",
  },
  {
    id: "BSI-002",
    buyer: "H&M",
    onTimeDelivery: 96,
    qualityScore: 92,
    complaintCount: 1,
    communicationScore: 91,
    repeatOrderProbability: 94,
    relationshipRisk: "Low",
  },
  {
    id: "BSI-003",
    buyer: "Primark",
    onTimeDelivery: 88,
    qualityScore: 81,
    complaintCount: 3,
    communicationScore: 79,
    repeatOrderProbability: 74,
    relationshipRisk: "Medium",
  },
  {
    id: "BSI-004",
    buyer: "Next",
    onTimeDelivery: 73,
    qualityScore: 69,
    complaintCount: 6,
    communicationScore: 66,
    repeatOrderProbability: 52,
    relationshipRisk: "Critical",
  },
];

function getRiskColor(
  risk: BuyerRecord["relationshipRisk"]
) {
  if (risk === "Critical") {
    return "text-red-300 border-red-700/40 bg-red-950/20";
  }

  if (risk === "High") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  if (risk === "Medium") {
    return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
  }

  return "text-green-300 border-green-700/40 bg-green-950/20";
}

function getBuyerAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Buyer Relationship Exposure";
  }

  if (high >= 2) {
    return "High Buyer Retention Risk";
  }

  if (high >= 1) {
    return "Moderate Buyer Satisfaction Risk";
  }

  return "Buyer Relationship Environment Stable";
}

function getRecommendation(record: BuyerRecord) {
  if (record.relationshipRisk === "Critical") {
    return "Immediate executive buyer engagement required. Stabilize delivery reliability, quality consistency, and communication responsiveness.";
  }

  if (record.repeatOrderProbability < 70) {
    return "AI predicts weakened buyer confidence. Improve operational consistency and relationship management.";
  }

  if (record.complaintCount >= 5) {
    return "High complaint exposure detected. Conduct root cause review and customer recovery planning.";
  }

  return "Buyer relationship currently manageable with operational monitoring.";
}

export default function AIBuyerSatisfactionIntelligencePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    BuyerRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadBuyerData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoBuyerData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load buyer satisfaction intelligence:",
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

    loadBuyerData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const criticalRisks = records.filter(
      (r) => r.relationshipRisk === "Critical"
    ).length;

    const highRisks = records.filter(
      (r) =>
        r.relationshipRisk === "Critical" ||
        r.relationshipRisk === "High"
    ).length;

    const averageDelivery =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.onTimeDelivery,
              0
            ) / records.length
          );

    const averageRepeatProbability =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) =>
                sum + r.repeatOrderProbability,
              0
            ) / records.length
          );

    return {
      criticalRisks,
      highRisks,
      averageDelivery,
      averageRepeatProbability,
      assessment: getBuyerAssessment(
        criticalRisks,
        highRisks
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Buyer Satisfaction Intelligence">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-sky-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-sky-300 uppercase tracking-widest text-sm">
              Module 38 · AI Buyer Satisfaction Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Buyer Confidence & Relationship Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered buyer relationship intelligence
              system for monitoring delivery reliability,
              complaint exposure, quality consistency,
              buyer confidence, repeat-order probability,
              and long-term customer retention risk
              across manufacturing operations.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading buyer satisfaction intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Buyer Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5">

                  <p className="text-orange-300 text-sm">
                    High Relationship Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-sky-700/40 bg-sky-950/20 p-5">

                  <p className="text-sky-300 text-sm">
                    Avg On-Time Delivery
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageDelivery}%
                  </h2>

                </div>

                <div className="rounded-2xl border border-green-700/40 bg-green-950/20 p-5">

                  <p className="text-green-300 text-sm">
                    Avg Repeat Probability
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageRepeatProbability}%
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-sky-700/40 bg-sky-950/10 p-6">

                <p className="text-sky-300 uppercase tracking-widest text-sm">
                  Executive Buyer Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates buyer
                  satisfaction behaviour, relationship
                  stability, delivery consistency,
                  and operational performance
                  to strengthen long-term customer retention.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Buyer Satisfaction Intelligence Feed
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
                          Delivery
                        </th>

                        <th className="text-left p-4">
                          Quality
                        </th>

                        <th className="text-left p-4">
                          Complaints
                        </th>

                        <th className="text-left p-4">
                          Communication
                        </th>

                        <th className="text-left p-4">
                          Repeat Order
                        </th>

                        <th className="text-left p-4">
                          Risk
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

                          <td className="p-4 text-sky-300">
                            {record.onTimeDelivery}%
                          </td>

                          <td className="p-4 text-green-300">
                            {record.qualityScore}%
                          </td>

                          <td className="p-4 text-red-300">
                            {record.complaintCount}
                          </td>

                          <td className="p-4">
                            {record.communicationScore}%
                          </td>

                          <td className="p-4 text-orange-300">
                            {record.repeatOrderProbability}%
                          </td>

                          <td className="p-4">
                            {record.relationshipRisk}
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
                    className={`rounded-2xl border p-5 ${getRiskColor(
                      record.relationshipRisk
                    )}`}
                  >

                    <p className="text-sm opacity-80">
                      {record.buyer}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      Buyer Relationship Analysis
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">

                      <span>
                        Delivery:
                        {" "}
                        {record.onTimeDelivery}%
                      </span>

                      <span>
                        Repeat:
                        {" "}
                        {record.repeatOrderProbability}%
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