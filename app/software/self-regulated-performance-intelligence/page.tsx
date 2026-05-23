"use client";

import DashboardShell from "@/components/software/DashboardShell";

const performanceDrivers = [
  "Self-management discipline",
  "Focus and attention stability",
  "Emotional control under pressure",
  "Personal accountability behaviour",
  "Planning and follow-up consistency",
  "Problem-solving ownership",
  "Learning reflection habit",
  "Operational execution reliability",
];

const performanceRisks = [
  "Low follow-up discipline",
  "Emotional reaction under pressure",
  "Inconsistent task ownership",
  "Weak planning behaviour",
  "Poor accountability culture",
  "Distraction and focus instability",
  "Low initiative after setbacks",
  "Dependency on supervisor reminders",
];

const aiInsights = [
  "Follow-up discipline weakening in high-pressure departments.",
  "Self-management behaviour stronger where supervisors use coaching routines.",
  "Accountability consistency improving after daily review meetings.",
  "Focus instability detected during overtime-heavy periods.",
  "Problem-solving ownership increasing in maintenance and quality teams.",
  "Supervisor reminder dependency remains high in selected production areas.",
];

const performanceHeatmap = [
  {
    department: "Sewing",
    ownership: "Medium",
    consistency: "Moderate",
    risk: "Supervisor reminder dependency",
  },
  {
    department: "Quality",
    ownership: "High",
    consistency: "Strong",
    risk: "Low self-management risk",
  },
  {
    department: "Cutting",
    ownership: "Medium",
    consistency: "Stable",
    risk: "Follow-up inconsistency",
  },
  {
    department: "Maintenance",
    ownership: "High",
    consistency: "Adaptive",
    risk: "Low execution risk",
  },
];

export default function SelfRegulatedPerformanceIntelligencePage() {
  return (
    <DashboardShell title="Self Regulated Performance Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              MBNCON Self-Management Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Self Regulated Performance Intelligence
            </h1>

            <p className="mt-4 max-w-4xl leading-relaxed text-slate-300">
              This intelligence module evaluates workforce self-management,
              focus discipline, emotional control, personal accountability,
              follow-up behaviour, ownership culture, and execution reliability
              across operational teams.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Self-Management Score</p>
              <h2 className="mt-2 text-4xl font-bold text-cyan-300">81%</h2>
              <p className="mt-2 text-sm text-cyan-200">
                Stable Execution Discipline
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Follow-up Risk</p>
              <h2 className="mt-2 text-4xl font-bold text-amber-300">
                Medium
              </h2>
              <p className="mt-2 text-sm text-amber-200">
                Reminder Dependency Present
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Focus Stability</p>
              <h2 className="mt-2 text-4xl font-bold text-rose-300">73%</h2>
              <p className="mt-2 text-sm text-rose-200">
                Pressure Sensitivity Detected
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Accountability Culture</p>
              <h2 className="mt-2 text-4xl font-bold text-emerald-300">
                Good
              </h2>
              <p className="mt-2 text-sm text-emerald-200">
                Ownership Behaviour Active
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Self-Regulated Performance Drivers
              </h2>

              <div className="mt-6 space-y-3">
                {performanceDrivers.map((driver) => (
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
                Self-Management Risk Indicators
              </h2>

              <div className="mt-6 space-y-3">
                {performanceRisks.map((risk) => (
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  Enterprise Execution Intelligence
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Self-Management Heatmap
                </h2>
              </div>

              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                Behavioural Execution Monitoring Active
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-4">Department</th>
                    <th className="pb-4">Ownership</th>
                    <th className="pb-4">Consistency</th>
                    <th className="pb-4">Primary Risk</th>
                  </tr>
                </thead>

                <tbody>
                  {performanceHeatmap.map((item) => (
                    <tr
                      key={item.department}
                      className="border-b border-white/5"
                    >
                      <td className="py-4 font-semibold">{item.department}</td>
                      <td className="py-4 text-cyan-200">{item.ownership}</td>
                      <td className="py-4 text-emerald-200">
                        {item.consistency}
                      </td>
                      <td className="py-4 text-slate-300">{item.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  AI Performance Intelligence
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Executive Self-Regulation Insights
                </h2>
              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                AI Self-Management Intelligence Enabled
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {aiInsights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5"
                >
                  {insight}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}