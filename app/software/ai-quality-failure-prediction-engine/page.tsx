"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type QualityFailureRecord = {
  id: string;
  productionLine: string;
  buyer: string;
  product: string;
  rejectionRate: number;
  reworkRate: number;
  materialVariance: number;
  operatorEfficiency: number;
  predictedFailureProbability: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoQualityFailureData: QualityFailureRecord[] = [
  {
    id: "QFP-001",
    productionLine: "Line 4",
    buyer: "Zara",
    product: "Ladies Top",
    rejectionRate: 7,
    reworkRate: 11,
    materialVariance: 15,
    operatorEfficiency: 72,
    predictedFailureProbability: 84,
    riskLevel: "Critical",
  },
  {
    id: "QFP-002",
    productionLine: "Line 2",
    buyer: "H&M",
    product: "Kids Hoodie",
    rejectionRate: 4,
    reworkRate: 6,
    materialVariance: 5,
    operatorEfficiency: 88,
    predictedFailureProbability: 42,
    riskLevel: "Low",
  },
  {
    id: "QFP-003",
    productionLine: "Line 7",
    buyer: "Primark",
    product: "Mens Polo",
    rejectionRate: 6,
    reworkRate: 9,
    materialVariance: 12,
    operatorEfficiency: 76,
    predictedFailureProbability: 71,
    riskLevel: "High",
  },
  {
    id: "QFP-004",
    productionLine: "Line 1",
    buyer: "Next",
    product: "Denim Jacket",
    rejectionRate: 5,
    reworkRate: 7,
    materialVariance: 8,
    operatorEfficiency: 81,
    predictedFailureProbability: 58,
    riskLevel: "Medium",
  },
];

function getRiskColor(
  risk: QualityFailureRecord["riskLevel"]
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

function getQualityAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Quality Instability Detected";
  }

  if (high >= 2) {
    return "High Quality Failure Exposure";
  }

  if (high >= 1) {
    return "Moderate Quality Risk";
  }

  return "Quality Environment Stable";
}

function getRecommendation(record: QualityFailureRecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate quality intervention required. Conduct root cause analysis, operator review, inline inspection escalation, and material audit.";
  }

  if (record.predictedFailureProbability > 70) {
    return "AI recommends increased inline quality checkpoints and production monitoring.";
  }

  if (record.materialVariance > 10) {
    return "Material inconsistency detected. Review raw material consumption and process stability.";
  }

  return "Quality risk currently manageable with operational monitoring.";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AIQualityFailurePredictionEnginePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    QualityFailureRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadQualityFailureData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoQualityFailureData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load quality failure prediction engine:",
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

    loadQualityFailureData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const criticalRisks = records.filter(
      (r) => r.riskLevel === "Critical"
    ).length;

    const highRisks = records.filter(
      (r) =>
        r.riskLevel === "Critical" ||
        r.riskLevel === "High"
    ).length;

    const averageFailureProbability =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) =>
                sum + r.predictedFailureProbability,
              0
            ) / records.length
          );

    const averageRejection =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.rejectionRate,
              0
            ) / records.length
          );

    return {
      criticalRisks,
      highRisks,
      averageFailureProbability,
      averageRejection,
      assessment: getQualityAssessment(
        criticalRisks,
        highRisks
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Quality Failure Prediction Engine">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-pink-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-pink-300 uppercase tracking-widest text-sm">
              Module 32 · AI Quality Failure Prediction Engine
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Predictive Quality Failure Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered predictive quality system
              for identifying future rejection risks,
              process instability, material inconsistency,
              rework exposure, and operational quality
              failures before they impact shipment,
              profitability, and buyer confidence.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading quality failure prediction intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

  <a
    href="#critical-quality-risks"
    className="block rounded-2xl border border-red-700/40 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >

    <p className="text-red-300 text-sm">
      Critical Quality Risks
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.criticalRisks}
    </h2>

  </a>

  <a
    href="#high-quality-exposure"
    className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
  >

    <p className="text-orange-300 text-sm">
      High Quality Exposure
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.highRisks}
    </h2>

  </a>

  <a
    href="#failure-probability"
    className="block rounded-2xl border border-pink-700/40 bg-pink-950/20 p-5 transition hover:-translate-y-1 hover:border-pink-400/40"
  >

    <p className="text-pink-300 text-sm">
      Avg Failure Probability
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.averageFailureProbability}%
    </h2>

  </a>

  <a
    href="#rejection-rate"
    className="block rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5 transition hover:-translate-y-1 hover:border-yellow-400/40"
  >

    <p className="text-yellow-300 text-sm">
      Avg Rejection Rate
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.averageRejection}%
    </h2>

  </a>

</section>

              <section className="rounded-2xl border border-pink-700/40 bg-pink-950/10 p-6">

                <p className="text-pink-300 uppercase tracking-widest text-sm">
                  Executive Quality Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates production
                  behaviour, rejection patterns,
                  material variance, and operator
                  efficiency to predict future
                  quality failures before shipment
                  disruption occurs.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Predictive Quality Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Line
                        </th>

                        <th className="text-left p-4">
                          Buyer
                        </th>

                        <th className="text-left p-4">
                          Product
                        </th>

                        <th className="text-left p-4">
                          Rejection
                        </th>

                        <th className="text-left p-4">
                          Rework
                        </th>

                        <th className="text-left p-4">
                          Material Variance
                        </th>

                        <th className="text-left p-4">
                          Failure Prediction
                        </th>
                      </tr>

                    </thead>

                    <tbody>

  {records.map((record) => (
    <tr
      key={record.id}
      id={slugify(record.product)}
      className="border-b border-slate-800 transition hover:bg-pink-900/20"
    >

      <td className="p-4">
        {record.productionLine}
      </td>

      <td className="p-4">
        {record.buyer}
      </td>

      <td className="p-4">
        <a
          href={`#${slugify(record.product)}`}
          className="text-cyan-300 underline hover:text-cyan-200"
        >
          {record.product}
        </a>
      </td>

      <td className="p-4 text-red-300">
        {record.rejectionRate}%
      </td>

      <td className="p-4 text-orange-300">
        {record.reworkRate}%
      </td>

      <td className="p-4">
        {record.materialVariance}%
      </td>

      <td className="p-4 text-pink-300">
        {record.predictedFailureProbability}%
      </td>

    </tr>
  ))}

</tbody>

                  </table>

                </div>

              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {records.map((record) => (
    <a
      key={record.id}
      href={`#${slugify(record.product)}`}
      className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-pink-400/40 ${getRiskColor(
        record.riskLevel
      )}`}
    >

      <p className="text-sm opacity-80">
        {record.productionLine} · {record.buyer}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {record.product}
      </h3>

      <p className="mt-4 text-slate-200">
        {getRecommendation(record)}
      </p>

      <div className="mt-5 flex justify-between">

        <span>
          Rejection:
          {" "}
          {record.rejectionRate}%
        </span>

        <span>
          Failure Risk:
          {" "}
          {record.predictedFailureProbability}%
        </span>

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