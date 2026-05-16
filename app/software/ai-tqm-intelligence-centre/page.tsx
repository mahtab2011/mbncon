"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type TQMRecord = {
  id: string;
  department: string;
  auditFinding: string;
  correctiveAction: string;
  preventiveAction: string;
  complianceScore: number;
  implementationProgress: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoTQMData: TQMRecord[] = [
  {
    id: "TQM-001",
    department: "Production",
    auditFinding:
      "Process variation causing inconsistent stitching quality.",
    correctiveAction:
      "Retrain operators and standardize operation methods.",
    preventiveAction:
      "Introduce inline process verification checkpoints.",
    complianceScore: 68,
    implementationProgress: 54,
    riskLevel: "Critical",
  },
  {
    id: "TQM-002",
    department: "Quality",
    auditFinding:
      "Inline inspection documentation incomplete.",
    correctiveAction:
      "Strengthen inspection recording discipline.",
    preventiveAction:
      "Digitize quality audit documentation flow.",
    complianceScore: 82,
    implementationProgress: 76,
    riskLevel: "Medium",
  },
  {
    id: "TQM-003",
    department: "Maintenance",
    auditFinding:
      "Preventive maintenance intervals inconsistently followed.",
    correctiveAction:
      "Reinforce preventive maintenance scheduling.",
    preventiveAction:
      "Automate maintenance reminder escalation.",
    complianceScore: 74,
    implementationProgress: 61,
    riskLevel: "High",
  },
  {
    id: "TQM-004",
    department: "Warehouse",
    auditFinding:
      "Material identification inconsistency detected.",
    correctiveAction:
      "Improve inventory labeling controls.",
    preventiveAction:
      "Implement barcode-based warehouse tracking.",
    complianceScore: 89,
    implementationProgress: 88,
    riskLevel: "Low",
  },
];

function getRiskColor(
  risk: TQMRecord["riskLevel"]
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

function getTQMAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Quality System Exposure";
  }

  if (high >= 2) {
    return "High TQM Stabilization Required";
  }

  if (high >= 1) {
    return "Moderate Quality Management Risk";
  }

  return "TQM Environment Stable";
}

function getRecommendation(record: TQMRecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate executive quality intervention required. Strengthen process discipline and cross-functional quality coordination.";
  }

  if (record.complianceScore < 75) {
    return "AI recommends urgent corrective and preventive action escalation.";
  }

  if (record.implementationProgress < 60) {
    return "Improvement implementation progressing slowly. Increase management monitoring.";
  }

  return "TQM implementation progressing within operational expectation.";
}

export default function AITQMIntelligenceCentrePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    TQMRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadTQMData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoTQMData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load TQM intelligence centre:",
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

    loadTQMData();

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

    const averageCompliance =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.complianceScore,
              0
            ) / records.length
          );

    const averageProgress =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) =>
                sum + r.implementationProgress,
              0
            ) / records.length
          );

    return {
      criticalRisks,
      highRisks,
      averageCompliance,
      averageProgress,
      assessment: getTQMAssessment(
        criticalRisks,
        highRisks
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI TQM Intelligence Centre">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-fuchsia-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-fuchsia-300 uppercase tracking-widest text-sm">
              Module 41 · AI TQM Intelligence Centre
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Total Quality Management Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered total quality management
              intelligence system for monitoring
              corrective actions, preventive actions,
              audit findings, compliance gaps,
              quality culture maturity,
              and enterprise-wide continuous quality improvement.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading TQM intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Quality Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5">

                  <p className="text-orange-300 text-sm">
                    High TQM Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/20 p-5">

                  <p className="text-fuchsia-300 text-sm">
                    Avg Compliance
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageCompliance}%
                  </h2>

                </div>

                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-5">

                  <p className="text-cyan-300 text-sm">
                    Avg Progress
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageProgress}%
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-6">

                <p className="text-fuchsia-300 uppercase tracking-widest text-sm">
                  Executive TQM Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates quality
                  management behaviour, audit exposure,
                  process discipline,
                  and preventive quality systems
                  to strengthen enterprise operational excellence.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    TQM Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Department
                        </th>

                        <th className="text-left p-4">
                          Audit Finding
                        </th>

                        <th className="text-left p-4">
                          Compliance
                        </th>

                        <th className="text-left p-4">
                          Progress
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
                            {record.department}
                          </td>

                          <td className="p-4">
                            {record.auditFinding}
                          </td>

                          <td className="p-4 text-fuchsia-300">
                            {record.complianceScore}%
                          </td>

                          <td className="p-4 text-cyan-300">
                            {record.implementationProgress}%
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
                  <div
                    key={record.id}
                    className={`rounded-2xl border p-5 ${getRiskColor(
                      record.riskLevel
                    )}`}
                  >

                    <p className="text-sm opacity-80">
                      {record.department}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      Quality System Analysis
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">

                      <span>
                        Compliance:
                        {" "}
                        {record.complianceScore}%
                      </span>

                      <span>
                        Progress:
                        {" "}
                        {record.implementationProgress}%
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