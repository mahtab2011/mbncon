"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type WarRoomRecord = {
  id: string;
  area: string;
  issue: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  impact: number;
  status: string;
};

const demoWarRoomData: WarRoomRecord[] = [
  {
    id: "WR-001",
    area: "Production",
    issue: "Line efficiency dropped below target",
    severity: "High",
    impact: 12000,
    status: "Open",
  },
  {
    id: "WR-002",
    area: "Shipment",
    issue: "Buyer shipment delay risk detected",
    severity: "Critical",
    impact: 25000,
    status: "Escalated",
  },
  {
    id: "WR-003",
    area: "Maintenance",
    issue: "Machine downtime increasing",
    severity: "Medium",
    impact: 6500,
    status: "Monitoring",
  },
  {
    id: "WR-004",
    area: "Compliance",
    issue: "Critical audit finding unresolved",
    severity: "Critical",
    impact: 18000,
    status: "Open",
  },
  {
    id: "WR-005",
    area: "Utilities",
    issue: "Generator fuel consumption spike",
    severity: "High",
    impact: 7200,
    status: "Investigating",
  },
];

function getSeverityScore(
  severity: WarRoomRecord["severity"]
): number {
  if (severity === "Critical") return 100;
  if (severity === "High") return 75;
  if (severity === "Medium") return 45;
  return 20;
}

function getExecutivePriority(score: number) {
  if (score >= 80) return "Executive Emergency";
  if (score >= 60) return "High Priority";
  if (score >= 35) return "Operational Risk";
  return "Controlled";
}

export default function AIFactoryWarRoomDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<WarRoomRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadWarRoomData() {
      try {
        setLoading(true);

        // Enterprise-safe async block
        // Later connect with Firestore live intelligence feeds
        const data = demoWarRoomData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load war room dashboard:", error);

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWarRoomData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalIssues = records.length;

    const criticalIssues = records.filter(
      (r) => r.severity === "Critical"
    ).length;

    const highIssues = records.filter(
      (r) => r.severity === "High"
    ).length;

    const totalImpact = records.reduce(
      (sum, r) => sum + r.impact,
      0
    );

    const averageRisk =
      totalIssues === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + getSeverityScore(r.severity),
              0
            ) / totalIssues
          );

    return {
      totalIssues,
      criticalIssues,
      highIssues,
      totalImpact,
      averageRisk,
      priority: getExecutivePriority(averageRisk),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Factory War Room Dashboard">
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-red-700/40 bg-linear-to-r from-red-950 via-slate-950 to-black p-6 shadow-2xl">
            <p className="text-red-300 uppercase tracking-widest text-sm">
              Module 25 · AI Factory War Room Dashboard
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Executive Manufacturing Command Center
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              Centralized AI-powered war room for monitoring
              production disruption, shipment risks, compliance
              exposure, maintenance escalation, utility spikes,
              manpower instability, bottlenecks, and executive
              emergency conditions in real time.
            </p>
          </section>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading executive war room intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">
                    Total Active Risks
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {intelligence.totalIssues}
                  </h2>
                </div>

                <div className="rounded-2xl bg-red-950/40 border border-red-700/40 p-5">
                  <p className="text-red-300 text-sm">
                    Critical Alerts
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-red-400">
                    {intelligence.criticalIssues}
                  </h2>
                </div>

                <div className="rounded-2xl bg-yellow-950/30 border border-yellow-700/40 p-5">
                  <p className="text-yellow-300 text-sm">
                    High Risks
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-yellow-300">
                    {intelligence.highIssues}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">
                    AI Executive Risk Score
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {intelligence.averageRisk}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">
                    Financial Exposure
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-red-300">
                    £{intelligence.totalImpact.toLocaleString()}
                  </h2>
                </div>

              </section>

              <section className="rounded-2xl border border-red-700/40 bg-red-950/20 p-6">
                <p className="text-red-300 uppercase tracking-widest text-sm">
                  Executive Priority Status
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.priority}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI has detected factory-level operational
                  instability requiring leadership monitoring
                  and cross-department escalation management.
                </p>
              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Live War Room Intelligence Feed
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Area</th>
                        <th className="text-left p-4">Issue</th>
                        <th className="text-left p-4">Severity</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Impact</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-slate-800"
                        >
                          <td className="p-4">
                            {record.id}
                          </td>

                          <td className="p-4">
                            {record.area}
                          </td>

                          <td className="p-4 text-slate-300">
                            {record.issue}
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-red-900/40 text-red-200">
                              {record.severity}
                            </span>
                          </td>

                          <td className="p-4">
                            {record.status}
                          </td>

                          <td className="p-4 text-red-300">
                            £{record.impact.toLocaleString()}
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
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <p className="text-sm text-slate-400">
                      {record.area}
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                      {record.issue}
                    </h3>

                    <p className="mt-4 text-slate-300">
                      AI recommends immediate operational review,
                      accountability assignment, and executive
                      monitoring until this issue is stabilized.
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-red-300 font-semibold">
                        {record.severity}
                      </span>

                      <span className="text-slate-400 text-sm">
                        Estimated Impact:
                        {" "}
                        £{record.impact.toLocaleString()}
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