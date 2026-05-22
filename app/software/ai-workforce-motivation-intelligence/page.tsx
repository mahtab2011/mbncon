"use client";

import DashboardShell from "@/components/software/DashboardShell";

const motivationDrivers = [
  "Workforce ownership culture",
  "Recognition and appreciation",
  "Supervisor communication quality",
  "Team collaboration environment",
  "Learning and growth opportunity",
  "Purpose-driven operational culture",
  "Workplace psychological safety",
  "Leadership trust and fairness",
];

const workforceRisks = [
  "Low workforce engagement",
  "High absenteeism trend",
  "Burnout and fatigue pressure",
  "Pressure-dependent productivity",
  "Low initiative behaviour",
  "Recognition imbalance",
  "Supervisor conflict escalation",
  "Emotional disengagement risk",
];

const aiRecommendations = [
  "Increase non-financial recognition visibility across departments.",
  "Reduce dependency on pressure-driven supervision methods.",
  "Improve coaching and feedback quality for line supervisors.",
  "Strengthen workforce involvement in operational problem-solving.",
  "Monitor burnout signals in overtime-intensive departments.",
  "Build adaptive learning and engagement culture.",
];

const departmentHeatmap = [
  {
    department: "Sewing",
    engagement: "Medium",
    risk: "High",
    issue: "Pressure-driven productivity dependency",
  },

  {
    department: "Cutting",
    engagement: "Good",
    risk: "Low",
    issue: "Stable workforce participation",
  },

  {
    department: "Quality",
    engagement: "Medium",
    risk: "Medium",
    issue: "Recognition inconsistency",
  },

  {
    department: "Maintenance",
    engagement: "Low",
    risk: "High",
    issue: "Fatigue and reactive workload pressure",
  },
];

export default function AIWorkforceMotivationIntelligencePage() {
  return (
    <DashboardShell title="AI Workforce Motivation Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <section>
            <p className="text-sm text-cyan-400 uppercase tracking-[0.2em]">
              MBNCON Human Intelligence Framework
            </p>

            <h1 className="text-4xl font-bold mt-3">
              AI Workforce Motivation Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl leading-relaxed">
              This intelligence engine evaluates workforce engagement,
              ownership culture, behavioural stability, recognition systems,
              leadership influence, morale patterns, and operational motivation
              sustainability across enterprise departments.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Workforce Engagement
              </p>

              <h2 className="text-4xl font-bold mt-2 text-cyan-300">
                78%
              </h2>

              <p className="text-sm text-cyan-200 mt-2">
                Stable Motivation
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Burnout Risk
              </p>

              <h2 className="text-4xl font-bold mt-2 text-amber-300">
                Medium
              </h2>

              <p className="text-sm text-amber-200 mt-2">
                Overtime Pressure Increasing
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Leadership Dependency
              </p>

              <h2 className="text-4xl font-bold mt-2 text-rose-300">
                High
              </h2>

              <p className="text-sm text-rose-200 mt-2">
                Supervisor Pressure Reliance
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Recognition Stability
              </p>

              <h2 className="text-4xl font-bold mt-2 text-emerald-300">
                Good
              </h2>

              <p className="text-sm text-emerald-200 mt-2">
                Positive Reinforcement Active
              </p>
            </div>

          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Workforce Motivation Drivers
              </h2>

              <div className="mt-6 space-y-3">
                {motivationDrivers.map((driver) => (
                  <div
                    key={driver}
                    className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4"
                  >
                    {driver}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Workforce Risk Intelligence
              </h2>

              <div className="mt-6 space-y-3">
                {workforceRisks.map((risk) => (
                  <div
                    key={risk}
                    className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4"
                  >
                    {risk}
                  </div>
                ))}
              </div>
            </div>

          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  Department Behaviour Intelligence
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Workforce Engagement Heatmap
                </h2>
              </div>

              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                AI Behaviour Monitoring Active
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-4">Department</th>
                    <th className="pb-4">Engagement</th>
                    <th className="pb-4">Risk</th>
                    <th className="pb-4">Primary Issue</th>
                  </tr>
                </thead>

                <tbody>
                  {departmentHeatmap.map((item) => (
                    <tr
                      key={item.department}
                      className="border-b border-white/5"
                    >
                      <td className="py-4 font-semibold">
                        {item.department}
                      </td>

                      <td className="py-4 text-cyan-200">
                        {item.engagement}
                      </td>

                      <td className="py-4 text-amber-200">
                        {item.risk}
                      </td>

                      <td className="py-4 text-slate-300">
                        {item.issue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div>
                <p className="text-sm text-slate-400">
                  AI Operational Guidance
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Executive Recommendations
                </h2>
              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                Adaptive Workforce Intelligence Enabled
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

              {aiRecommendations.map((recommendation) => (
                <div
                  key={recommendation}
                  className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5"
                >
                  {recommendation}
                </div>
              ))}

            </div>

          </section>

        </div>
      </main>
    </DashboardShell>
  );
}