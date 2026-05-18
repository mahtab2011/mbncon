"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type KaizenRecord = {
  id: string;
  department: string;
  initiative: string;
  owner: string;
  status: "Pending" | "In Progress" | "Completed";
  estimatedSavings: number;
  actualSavings: number;
  participationScore: number;
  implementationProgress: number;
};

const demoKaizenData: KaizenRecord[] = [
  {
    id: "KZN-001",
    department: "Production",
    initiative: "Reduce bundle waiting time",
    owner: "Line Supervisor",
    status: "In Progress",
    estimatedSavings: 4200,
    actualSavings: 1800,
    participationScore: 82,
    implementationProgress: 55,
  },
  {
    id: "KZN-002",
    department: "Warehouse",
    initiative: "Optimize material movement flow",
    owner: "Warehouse Manager",
    status: "Completed",
    estimatedSavings: 2600,
    actualSavings: 3100,
    participationScore: 91,
    implementationProgress: 100,
  },
  {
    id: "KZN-003",
    department: "Quality",
    initiative: "Reduce inline rework frequency",
    owner: "QA Executive",
    status: "In Progress",
    estimatedSavings: 3800,
    actualSavings: 1200,
    participationScore: 76,
    implementationProgress: 48,
  },
  {
    id: "KZN-004",
    department: "Maintenance",
    initiative: "Reduce machine idle breakdown time",
    owner: "Maintenance Head",
    status: "Pending",
    estimatedSavings: 5100,
    actualSavings: 0,
    participationScore: 64,
    implementationProgress: 12,
  },
];

function getStatusColor(status: KaizenRecord["status"]) {
  if (status === "Completed") {
    return "text-green-300 border-green-700/40 bg-green-950/20";
  }

  if (status === "In Progress") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
}

function getKaizenAssessment(
  completed: number,
  averageParticipation: number
) {
  if (completed >= 2 && averageParticipation >= 85) {
    return "Strong Continuous Improvement Culture";
  }

  if (averageParticipation >= 75) {
    return "Moderate Kaizen Engagement";
  }

  if (averageParticipation >= 60) {
    return "Improvement Participation Needs Strengthening";
  }

  return "Weak Continuous Improvement Environment";
}

function getRecommendation(record: KaizenRecord) {
  if (record.status === "Pending") {
    return "AI recommends management review and implementation acceleration.";
  }

  if (record.implementationProgress < 50) {
    return "Kaizen initiative progressing slowly. Increase operational support and department engagement.";
  }

  if (
    record.actualSavings >
    record.estimatedSavings
  ) {
    return "Improvement initiative exceeding projected operational savings.";
  }

  return "Kaizen initiative progressing within operational expectation.";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AIKaizenImprovementTrackerPage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    KaizenRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadKaizenData() {
      try {
        setLoading(true);

        const data = demoKaizenData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load kaizen improvement tracker:",
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

    loadKaizenData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const completedProjects = records.filter(
      (r) => r.status === "Completed"
    ).length;

    const totalEstimatedSavings = records.reduce(
      (sum, r) => sum + r.estimatedSavings,
      0
    );

    const totalActualSavings = records.reduce(
      (sum, r) => sum + r.actualSavings,
      0
    );

    const averageParticipation =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.participationScore,
              0
            ) / records.length
          );

    return {
      completedProjects,
      totalEstimatedSavings,
      totalActualSavings,
      averageParticipation,
      assessment: getKaizenAssessment(
        completedProjects,
        averageParticipation
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Kaizen Improvement Tracker">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-emerald-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-emerald-300 uppercase tracking-widest text-sm">
              Module 37 · AI Kaizen Improvement Tracker
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Continuous Improvement & Kaizen Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered Kaizen management system
              for tracking improvement initiatives,
              operational savings, department participation,
              implementation progress, and continuous
              improvement culture development across
              manufacturing operations.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading Kaizen improvement intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <a
                  href="#completed-projects"
                  className="block rounded-2xl border border-green-700/40 bg-green-950/20 p-5 transition hover:-translate-y-1 hover:border-green-400/40"
                >

                  <p className="text-green-300 text-sm">
                    Completed Projects
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.completedProjects}
                  </h2>

                </a>

                <a
                  href="#estimated-savings"
                  className="block rounded-2xl border border-emerald-700/40 bg-emerald-950/20 p-5 transition hover:-translate-y-1 hover:border-emerald-400/40"
                >

                  <p className="text-emerald-300 text-sm">
                    Estimated Savings
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    £
                    {intelligence.totalEstimatedSavings.toLocaleString()}
                  </h2>

                </a>

                <a
                  href="#actual-savings"
                  className="block rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
                >

                  <p className="text-cyan-300 text-sm">
                    Actual Savings
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    £
                    {intelligence.totalActualSavings.toLocaleString()}
                  </h2>

                </a>

                <a
                  href="#average-participation"
                  className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
                >

                  <p className="text-orange-300 text-sm">
                    Avg Participation
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageParticipation}%
                  </h2>

                </a>

              </section>

              <section className="rounded-2xl border border-emerald-700/40 bg-emerald-950/10 p-6">

                <p className="text-emerald-300 uppercase tracking-widest text-sm">
                  Executive Kaizen Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates improvement
                  participation, operational Kaizen behaviour,
                  implementation progress,
                  and continuous improvement culture
                  to strengthen manufacturing excellence.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Kaizen Improvement Intelligence Feed
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
                          Initiative
                        </th>

                        <th className="text-left p-4">
                          Owner
                        </th>

                        <th className="text-left p-4">
                          Progress
                        </th>

                        <th className="text-left p-4">
                          Estimated Savings
                        </th>

                        <th className="text-left p-4">
                          Actual Savings
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
                          id={slugify(record.initiative)}
                          className="border-b border-slate-800 transition hover:bg-emerald-900/20"
                        >

                          <td className="p-4">
                            {record.department}
                          </td>

                          <td className="p-4">
                            <a
                              href={`#${slugify(record.initiative)}`}
                              className="text-cyan-300 underline hover:text-cyan-200"
                            >
                              {record.initiative}
                            </a>
                          </td>

                          <td className="p-4">
                            {record.owner}
                          </td>

                          <td className="p-4 text-orange-300">
                            {record.implementationProgress}%
                          </td>

                          <td className="p-4 text-emerald-300">
                            £
                            {record.estimatedSavings.toLocaleString()}
                          </td>

                          <td className="p-4 text-cyan-300">
                            £
                            {record.actualSavings.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {record.status}
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
                    href={`#${slugify(record.initiative)}`}
                    className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 ${getStatusColor(
                      record.status
                    )}`}
                  >

                    <p className="text-sm opacity-80">
                      {record.department}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {record.initiative}
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">

                      <span>
                        Progress:
                        {" "}
                        {record.implementationProgress}%
                      </span>

                      <span>
                        Save:
                        {" "}
                        £
                        {record.actualSavings.toLocaleString()}
                      </span>

                    </div>

                  </a>
                ))}

              </section>

              <section className="space-y-5">

                {records.map((record) => (
                  <section
                    key={record.id}
                    id={slugify(record.initiative)}
                    className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-sm uppercase tracking-widest text-emerald-300">
                          {record.department} · {record.id}
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                          {record.initiative}
                        </h2>

                      </div>

                      <div
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </div>

                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Owner
                        </p>

                        <p className="mt-2 font-semibold">
                          {record.owner}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Progress
                        </p>

                        <p className="mt-2 font-semibold text-orange-300">
                          {record.implementationProgress}%
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Estimated Savings
                        </p>

                        <p className="mt-2 font-semibold text-emerald-300">
                          £{record.estimatedSavings.toLocaleString()}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Actual Savings
                        </p>

                        <p className="mt-2 font-semibold text-cyan-300">
                          £{record.actualSavings.toLocaleString()}
                        </p>

                      </div>

                    </div>

                    <div className="mt-6 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5">

                      <p className="text-sm uppercase tracking-widest text-emerald-300">
                        AI Recommendation
                      </p>

                      <p className="mt-3 text-slate-200">
                        {getRecommendation(record)}
                      </p>

                    </div>

                  </section>
                ))}

              </section>

            </>
          )}

        </div>

      </main>

    </DashboardShell>
  );
}