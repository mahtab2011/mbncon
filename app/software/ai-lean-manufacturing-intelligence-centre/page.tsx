"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type LeanRecord = {
  id: string;
  wasteType: string;
  department: string;
  observation: string;
  estimatedLoss: number;
  improvementPotential: number;
  kaizenOpportunity: boolean;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoLeanData: LeanRecord[] = [
  {
    id: "LMI-001",
    wasteType: "Waiting Waste",
    department: "Production",
    observation:
      "Operators waiting for bundle movement between operations.",
    estimatedLoss: 4200,
    improvementPotential: 3100,
    kaizenOpportunity: true,
    riskLevel: "High",
  },
  {
    id: "LMI-002",
    wasteType: "Transport Waste",
    department: "Warehouse",
    observation:
      "Excessive movement between storage and cutting section.",
    estimatedLoss: 1800,
    improvementPotential: 1200,
    kaizenOpportunity: true,
    riskLevel: "Medium",
  },
  {
    id: "LMI-003",
    wasteType: "Overproduction",
    department: "Finishing",
    observation:
      "Production exceeding shipment requirement forecast.",
    estimatedLoss: 6500,
    improvementPotential: 4800,
    kaizenOpportunity: true,
    riskLevel: "Critical",
  },
  {
    id: "LMI-004",
    wasteType: "Defect Waste",
    department: "Quality",
    observation:
      "Repeated inline defects creating rework pressure.",
    estimatedLoss: 3700,
    improvementPotential: 2400,
    kaizenOpportunity: true,
    riskLevel: "High",
  },
];

function getRiskColor(
  risk: LeanRecord["riskLevel"]
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

function getLeanAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Lean Waste Exposure";
  }

  if (high >= 2) {
    return "High Operational Waste Environment";
  }

  if (high >= 1) {
    return "Moderate Lean Improvement Opportunity";
  }

  return "Lean Manufacturing Environment Stable";
}

function getRecommendation(record: LeanRecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate lean manufacturing intervention required. Conduct Gemba review and executive operational recovery assessment.";
  }

  if (record.improvementPotential > 3000) {
    return "AI recommends Kaizen implementation and process optimization review.";
  }

  if (record.kaizenOpportunity) {
    return "Continuous improvement opportunity detected through AI lean analysis.";
  }

  return "Operational waste currently manageable with monitoring.";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AILeanManufacturingIntelligenceCentrePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    LeanRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadLeanData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoLeanData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load lean manufacturing intelligence:",
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

    loadLeanData();

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

    const totalEstimatedLoss = records.reduce(
      (sum, r) => sum + r.estimatedLoss,
      0
    );

    const totalImprovementPotential = records.reduce(
      (sum, r) => sum + r.improvementPotential,
      0
    );

    return {
      criticalRisks,
      highRisks,
      totalEstimatedLoss,
      totalImprovementPotential,
      assessment: getLeanAssessment(
        criticalRisks,
        highRisks
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Lean Manufacturing Intelligence Centre">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-lime-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-lime-300 uppercase tracking-widest text-sm">
              Module 36 · AI Lean Manufacturing Intelligence Centre
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Lean Waste & Continuous Improvement Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered lean manufacturing intelligence
              system for detecting operational waste,
              process inefficiency, Kaizen opportunities,
              Gemba improvement areas, and hidden
              non-value-added activities before
              profitability erosion occurs.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading lean manufacturing intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

  <a
    href="#critical-lean-risks"
    className="block rounded-2xl border border-red-700/40 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >

    <p className="text-red-300 text-sm">
      Critical Lean Risks
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.criticalRisks}
    </h2>

  </a>

  <a
    href="#high-waste-exposure"
    className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
  >

    <p className="text-orange-300 text-sm">
      High Waste Exposure
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.highRisks}
    </h2>

  </a>

  <a
    href="#estimated-waste-loss"
    className="block rounded-2xl border border-lime-700/40 bg-lime-950/20 p-5 transition hover:-translate-y-1 hover:border-lime-400/40"
  >

    <p className="text-lime-300 text-sm">
      Estimated Waste Loss
    </p>

    <h2 className="text-4xl font-bold mt-3">
      £
      {intelligence.totalEstimatedLoss.toLocaleString()}
    </h2>

  </a>

  <a
    href="#improvement-potential"
    className="block rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
  >

    <p className="text-cyan-300 text-sm">
      Improvement Potential
    </p>

    <h2 className="text-4xl font-bold mt-3">
      £
      {intelligence.totalImprovementPotential.toLocaleString()}
    </h2>

  </a>

</section>

              <section className="rounded-2xl border border-lime-700/40 bg-lime-950/10 p-6">

                <p className="text-lime-300 uppercase tracking-widest text-sm">
                  Executive Lean Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates lean
                  manufacturing behaviour, operational
                  waste patterns, Kaizen opportunities,
                  and non-value-added activities
                  to improve productivity and profitability.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Lean Manufacturing Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Waste Type
                        </th>

                        <th className="text-left p-4">
                          Department
                        </th>

                        <th className="text-left p-4">
                          Observation
                        </th>

                        <th className="text-left p-4">
                          Estimated Loss
                        </th>

                        <th className="text-left p-4">
                          Improvement Potential
                        </th>

                        <th className="text-left p-4">
                          Kaizen
                        </th>
                      </tr>

                    </thead>

                    <tbody>

  {records.map((record) => (
    <tr
      key={record.id}
      id={slugify(record.wasteType)}
      className="border-b border-slate-800 transition hover:bg-lime-900/20"
    >

      <td className="p-4">
        <a
          href={`#${slugify(record.wasteType)}`}
          className="text-cyan-300 underline hover:text-cyan-200"
        >
          {record.wasteType}
        </a>
      </td>

      <td className="p-4">
        {record.department}
      </td>

      <td className="p-4">
        {record.observation}
      </td>

      <td className="p-4 text-red-300">
        £
        {record.estimatedLoss.toLocaleString()}
      </td>

      <td className="p-4 text-cyan-300">
        £
        {record.improvementPotential.toLocaleString()}
      </td>

      <td className="p-4">
        {record.kaizenOpportunity
          ? "Yes"
          : "No"}
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
      href={`#${slugify(record.wasteType)}`}
      className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-lime-400/40 ${getRiskColor(
        record.riskLevel
      )}`}
    >

      <p className="text-sm opacity-80">
        {record.department}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {record.wasteType}
      </h3>

      <p className="mt-4 text-slate-200">
        {getRecommendation(record)}
      </p>

      <div className="mt-5 flex justify-between">

        <span>
          Waste:
          {" "}
          £
          {record.estimatedLoss.toLocaleString()}
        </span>

        <span>
          Save:
          {" "}
          £
          {record.improvementPotential.toLocaleString()}
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