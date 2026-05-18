"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type ConsumptionRecord = {
  id: string;
  material: string;
  productionLine: string;
  standardConsumption: number;
  actualConsumption: number;
  variancePercentage: number;
  wastageCost: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoConsumptionData: ConsumptionRecord[] = [
  {
    id: "RMCI-001",
    material: "Cotton Fabric",
    productionLine: "Line 4",
    standardConsumption: 1200,
    actualConsumption: 1380,
    variancePercentage: 15,
    wastageCost: 4200,
    riskLevel: "High",
  },
  {
    id: "RMCI-002",
    material: "Poly Thread",
    productionLine: "Line 2",
    standardConsumption: 450,
    actualConsumption: 470,
    variancePercentage: 4,
    wastageCost: 620,
    riskLevel: "Low",
  },
  {
    id: "RMCI-003",
    material: "Packaging Cartons",
    productionLine: "Packing Unit",
    standardConsumption: 820,
    actualConsumption: 980,
    variancePercentage: 19,
    wastageCost: 2800,
    riskLevel: "Critical",
  },
  {
    id: "RMCI-004",
    material: "Zippers",
    productionLine: "Line 7",
    standardConsumption: 1600,
    actualConsumption: 1740,
    variancePercentage: 9,
    wastageCost: 1350,
    riskLevel: "Medium",
  },
];

function getRiskColor(
  risk: ConsumptionRecord["riskLevel"]
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

function getConsumptionAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Material Consumption Risk";
  }

  if (high >= 2) {
    return "High Wastage Exposure";
  }

  if (high >= 1) {
    return "Moderate Consumption Variance";
  }

  return "Material Consumption Stable";
}

function getRecommendation(record: ConsumptionRecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate investigation required for abnormal material usage, potential wastage, theft, or process inefficiency.";
  }

  if (record.variancePercentage > 12) {
    return "AI recommends line-wise consumption audit and operator efficiency review.";
  }

  if (record.wastageCost > 3000) {
    return "High financial wastage detected. Executive monitoring recommended.";
  }

  return "Consumption variance remains within operational tolerance.";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AIRawMaterialConsumptionIntelligencePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    ConsumptionRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadConsumptionData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoConsumptionData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load raw material consumption intelligence:",
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

    loadConsumptionData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalWastageCost = records.reduce(
      (sum, r) => sum + r.wastageCost,
      0
    );

    const criticalItems = records.filter(
      (r) => r.riskLevel === "Critical"
    ).length;

    const highRiskItems = records.filter(
      (r) =>
        r.riskLevel === "Critical" ||
        r.riskLevel === "High"
    ).length;

    const averageVariance =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.variancePercentage,
              0
            ) / records.length
          );

    return {
      totalWastageCost,
      criticalItems,
      highRiskItems,
      averageVariance,
      assessment: getConsumptionAssessment(
        criticalItems,
        highRiskItems
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Raw Material Consumption Intelligence">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-purple-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-purple-300 uppercase tracking-widest text-sm">
              Module 31 · AI Raw Material Consumption Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Raw Material Usage & Wastage Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered raw material intelligence system
              for detecting abnormal consumption,
              hidden wastage, process inefficiency,
              material variance, operational leakage,
              and line-wise material usage risks before
              they impact profitability and production stability.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading raw material consumption intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

  <a
    href="#total-wastage-cost"
    className="block rounded-2xl bg-slate-900 border border-slate-800 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >

    <p className="text-slate-400 text-sm">
      Total Wastage Cost
    </p>

    <h2 className="text-4xl font-bold mt-3 text-red-300">
      £
      {intelligence.totalWastageCost.toLocaleString()}
    </h2>

  </a>

  <a
    href="#critical-consumption-risks"
    className="block rounded-2xl border border-red-700/40 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >

    <p className="text-red-300 text-sm">
      Critical Consumption Risks
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.criticalItems}
    </h2>

  </a>

  <a
    href="#high-risk-areas"
    className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
  >

    <p className="text-orange-300 text-sm">
      High Risk Areas
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.highRiskItems}
    </h2>

  </a>

  <a
    href="#average-consumption-variance"
    className="block rounded-2xl border border-purple-700/40 bg-purple-950/20 p-5 transition hover:-translate-y-1 hover:border-purple-400/40"
  >

    <p className="text-purple-300 text-sm">
      Average Variance
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.averageVariance}%
    </h2>

  </a>

</section>

              <section className="rounded-2xl border border-purple-700/40 bg-purple-950/10 p-6">

                <p className="text-purple-300 uppercase tracking-widest text-sm">
                  Executive Consumption Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates raw material
                  behaviour, production variance,
                  wastage patterns, and abnormal
                  consumption signals to reduce hidden
                  operational losses and material leakage.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Material Consumption Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Material
                        </th>

                        <th className="text-left p-4">
                          Production Line
                        </th>

                        <th className="text-left p-4">
                          Standard
                        </th>

                        <th className="text-left p-4">
                          Actual
                        </th>

                        <th className="text-left p-4">
                          Variance
                        </th>

                        <th className="text-left p-4">
                          Wastage Cost
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
      id={slugify(record.material)}
      className="border-b border-slate-800 transition hover:bg-purple-900/20"
    >

      <td className="p-4">
        <a
          href={`#${slugify(record.material)}`}
          className="text-cyan-300 underline hover:text-cyan-200"
        >
          {record.material}
        </a>
      </td>

      <td className="p-4">
        {record.productionLine}
      </td>

      <td className="p-4">
        {record.standardConsumption}
      </td>

      <td className="p-4">
        {record.actualConsumption}
      </td>

      <td className="p-4 text-orange-300">
        {record.variancePercentage}%
      </td>

      <td className="p-4 text-red-300">
        £
        {record.wastageCost.toLocaleString()}
      </td>

      <td className="p-4">
        {record.riskLevel}
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
      href={`#${slugify(record.material)}`}
      className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-purple-400/40 ${getRiskColor(
        record.riskLevel
      )}`}
    >

      <p className="text-sm opacity-80">
        {record.productionLine}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {record.material}
      </h3>

      <p className="mt-4 text-slate-200">
        {getRecommendation(record)}
      </p>

      <div className="mt-5 flex justify-between">

        <span>
          Variance:
          {" "}
          {record.variancePercentage}%
        </span>

        <span>
          Loss:
          {" "}
          £
          {record.wastageCost.toLocaleString()}
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