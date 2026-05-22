"use client";

import DashboardShell from "@/components/software/DashboardShell";

const activitySampling = [
  {
    activity: "Productive Work",
    percentage: "68%",
    impact: "Healthy",
  },
  {
    activity: "Waiting Time",
    percentage: "14%",
    impact: "Bottleneck Risk",
  },
  {
    activity: "Machine Downtime",
    percentage: "9%",
    impact: "Critical",
  },
  {
    activity: "Material Handling",
    percentage: "5%",
    impact: "Improvement Required",
  },
];

const bottlenecks = [
  "High WIP accumulation in sewing line",
  "Operator waiting for materials",
  "Machine breakdown affecting throughput",
  "Excess movement between workstations",
  "Imbalance between cutting and stitching",
  "Manual inspection delays",
];

const improvementAreas = [
  "Method simplification",
  "Motion reduction",
  "Layout optimization",
  "Operator balancing",
  "Cycle time reduction",
  "Idle manpower reduction",
];

export default function BottleneckIndustrialEngineeringIntelligencePage() {
  return (
    <DashboardShell title="AI Bottleneck & Industrial Engineering Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <section>
            <p className="text-sm text-slate-400">
              MBNCON Industrial Engineering Intelligence System
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Bottleneck & Industrial Engineering Intelligence Centre
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module provides operational bottleneck visibility using
              industrial engineering methodologies including activity sampling,
              method study, time study, motion study, line balancing,
              productivity analysis, and operational constraint intelligence.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                Productivity Efficiency
              </p>
              <h2 className="text-3xl font-bold mt-2 text-emerald-400">
                82%
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                Bottleneck Operations
              </p>
              <h2 className="text-3xl font-bold mt-2 text-amber-400">
                4
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                Machine Downtime
              </p>
              <h2 className="text-3xl font-bold mt-2 text-rose-400">
                9%
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                Line Balance Score
              </p>
              <h2 className="text-3xl font-bold mt-2 text-cyan-400">
                76%
              </h2>
            </div>

          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Activity Sampling Analysis
            </h2>

            <div className="mt-6 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-3">Activity</th>
                    <th className="py-3">Percentage</th>
                    <th className="py-3">Impact</th>
                  </tr>
                </thead>

                <tbody>
                  {activitySampling.map((item) => (
                    <tr
                      key={item.activity}
                      className="border-b border-white/5"
                    >
                      <td className="py-3">{item.activity}</td>
                      <td className="py-3">{item.percentage}</td>
                      <td className="py-3">{item.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
              <h2 className="text-2xl font-bold text-rose-300">
                Operational Bottlenecks
              </h2>

              <div className="mt-4 space-y-3">
                {bottlenecks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-black/30 p-4 border border-white/5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
              <h2 className="text-2xl font-bold text-cyan-300">
                Improvement Opportunities
              </h2>

              <div className="mt-4 space-y-3">
                {improvementAreas.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-black/30 p-4 border border-white/5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </section>

          <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="text-2xl font-bold text-amber-300">
              AI Executive Observation
            </h2>

            <p className="mt-4 text-slate-200 leading-8">
              The industrial engineering intelligence analysis indicates
              that production efficiency losses are primarily linked to
              waiting time, machine downtime, and workstation imbalance.
              Operational bottlenecks are restricting throughput and
              increasing lead time risk. Activity sampling suggests that
              targeted method improvement, motion reduction, and line
              balancing initiatives may significantly improve productivity,
              reduce operational waste, and increase profitability.
            </p>
          </section>

        </div>
      </main>
    </DashboardShell>
  );
}