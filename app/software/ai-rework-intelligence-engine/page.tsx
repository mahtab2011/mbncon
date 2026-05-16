"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type ReworkRecord = {
  id: string;
  productionLine: string;
  buyer: string;
  product: string;
  reworkPieces: number;
  productionPieces: number;
  reworkRate: number;
  estimatedLoss: number;
  rootCause: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoReworkData: ReworkRecord[] = [
  {
    id: "RWI-001",
    productionLine: "Line 4",
    buyer: "Zara",
    product: "Ladies Top",
    reworkPieces: 420,
    productionPieces: 3200,
    reworkRate: 13,
    estimatedLoss: 5400,
    rootCause: "Stitching inconsistency",
    riskLevel: "Critical",
  },
  {
    id: "RWI-002",
    productionLine: "Line 2",
    buyer: "H&M",
    product: "Kids Hoodie",
    reworkPieces: 120,
    productionPieces: 2800,
    reworkRate: 4,
    estimatedLoss: 950,
    rootCause: "Minor print alignment issue",
    riskLevel: "Low",
  },
  {
    id: "RWI-003",
    productionLine: "Line 7",
    buyer: "Primark",
    product: "Mens Polo",
    reworkPieces: 260,
    productionPieces: 3100,
    reworkRate: 8,
    estimatedLoss: 3100,
    rootCause: "Measurement variation",
    riskLevel: "High",
  },
  {
    id: "RWI-004",
    productionLine: "Line 1",
    buyer: "Next",
    product: "Denim Jacket",
    reworkPieces: 180,
    productionPieces: 2900,
    reworkRate: 6,
    estimatedLoss: 1800,
    rootCause: "Operator handling issue",
    riskLevel: "Medium",
  },
];

function getRiskColor(
  risk: ReworkRecord["riskLevel"]
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

function getReworkAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Rework Instability Detected";
  }

  if (high >= 2) {
    return "High Rework Exposure";
  }

  if (high >= 1) {
    return "Moderate Rework Risk";
  }

  return "Rework Environment Stable";
}

function getRecommendation(record: ReworkRecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate production intervention required. Conduct root cause analysis, operator retraining, and inline quality escalation.";
  }

  if (record.reworkRate > 10) {
    return "AI recommends urgent line performance review and process stabilization.";
  }

  if (record.estimatedLoss > 3000) {
    return "High profitability erosion detected due to rework exposure.";
  }

  return "Rework risk currently manageable with operational monitoring.";
}

export default function AIReworkIntelligenceEnginePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    ReworkRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadReworkData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoReworkData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load rework intelligence engine:",
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

    loadReworkData();

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

    const totalReworkLoss = records.reduce(
      (sum, r) => sum + r.estimatedLoss,
      0
    );

    const averageReworkRate =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.reworkRate,
              0
            ) / records.length
          );

    return {
      criticalRisks,
      highRisks,
      totalReworkLoss,
      averageReworkRate,
      assessment: getReworkAssessment(
        criticalRisks,
        highRisks
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Rework Intelligence Engine">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-rose-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-rose-300 uppercase tracking-widest text-sm">
              Module 33 · AI Rework Intelligence Engine
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Rework Loss & Process Instability Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered rework intelligence system
              for detecting hidden profitability erosion,
              process instability, operational inefficiency,
              root-cause-driven rework exposure,
              and line-wise quality recovery opportunities.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading rework intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Rework Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5">

                  <p className="text-orange-300 text-sm">
                    High Rework Exposure
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-rose-700/40 bg-rose-950/20 p-5">

                  <p className="text-rose-300 text-sm">
                    Total Rework Loss
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    £
                    {intelligence.totalReworkLoss.toLocaleString()}
                  </h2>

                </div>

                <div className="rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5">

                  <p className="text-yellow-300 text-sm">
                    Avg Rework Rate
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageReworkRate}%
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-rose-700/40 bg-rose-950/10 p-6">

                <p className="text-rose-300 uppercase tracking-widest text-sm">
                  Executive Rework Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates production
                  instability, rework behaviour,
                  operational inefficiency,
                  and profitability erosion to reduce
                  hidden manufacturing losses.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Rework Intelligence Feed
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
                          Rework Pieces
                        </th>

                        <th className="text-left p-4">
                          Rework Rate
                        </th>

                        <th className="text-left p-4">
                          Estimated Loss
                        </th>

                        <th className="text-left p-4">
                          Root Cause
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
                            {record.productionLine}
                          </td>

                          <td className="p-4">
                            {record.buyer}
                          </td>

                          <td className="p-4">
                            {record.product}
                          </td>

                          <td className="p-4">
                            {record.reworkPieces}
                          </td>

                          <td className="p-4 text-orange-300">
                            {record.reworkRate}%
                          </td>

                          <td className="p-4 text-red-300">
                            £
                            {record.estimatedLoss.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {record.rootCause}
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
                        Rework:
                        {" "}
                        {record.reworkRate}%
                      </span>

                      <span>
                        Loss:
                        {" "}
                        £
                        {record.estimatedLoss.toLocaleString()}
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