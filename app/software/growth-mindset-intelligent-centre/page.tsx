"use client";

import DashboardShell from "@/components/software/DashboardShell";

const growthDrivers = [
  "Continuous learning culture",
  "Cross-functional skill development",
  "Adaptive problem-solving capability",
  "Improvement participation mindset",
  "Constructive operational feedback",
  "Coaching-oriented leadership",
  "Innovation acceptance behaviour",
  "Resilience during operational pressure",
];

const mindsetRisks = [
  "Fear-driven mistake avoidance",
  "Resistance to operational change",
  "Low improvement participation",
  "Blame-oriented communication culture",
  "Learning disengagement",
  "Rigid departmental thinking",
  "Low confidence in experimentation",
  "Operational stagnation risk",
];

const aiInsights = [
  "Improvement participation declining in finishing department.",
  "Cross-training readiness below healthy operational threshold.",
  "Leadership coaching quality inconsistent across supervisors.",
  "Adaptive learning culture stronger in maintenance division.",
  "Operational experimentation confidence declining after audit pressure.",
  "Employee learning engagement recovering after coaching interventions.",
];

const learningHeatmap = [
  {
    department: "Sewing",
    adaptability: "Medium",
    learningCulture: "Stable",
    risk: "Resistance to process changes",
  },

  {
    department: "Quality",
    adaptability: "High",
    learningCulture: "Strong",
    risk: "Low operational resistance",
  },

  {
    department: "Cutting",
    adaptability: "Medium",
    learningCulture: "Moderate",
    risk: "Skill development inconsistency",
  },

  {
    department: "Maintenance",
    adaptability: "High",
    learningCulture: "Adaptive",
    risk: "Low learning risk",
  },
];

export default function GrowthMindsetIntelligentCentrePage() {
  return (
    <DashboardShell title="Growth Mindset Intelligent Centre">
      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              MBNCON Adaptive Learning Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Growth Mindset Intelligent Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300 leading-relaxed">
              This intelligence platform evaluates workforce adaptability,
              operational learning culture, resilience under pressure,
              coaching effectiveness, innovation behaviour, and continuous
              improvement participation across enterprise operations.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Learning Adaptability
              </p>

              <h2 className="mt-2 text-4xl font-bold text-cyan-300">
                82%
              </h2>

              <p className="mt-2 text-sm text-cyan-200">
                Adaptive Workforce Culture
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Resistance Risk
              </p>

              <h2 className="mt-2 text-4xl font-bold text-amber-300">
                Medium
              </h2>

              <p className="mt-2 text-sm text-amber-200">
                Process Change Sensitivity
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Innovation Confidence
              </p>

              <h2 className="mt-2 text-4xl font-bold text-rose-300">
                71%
              </h2>

              <p className="mt-2 text-sm text-rose-200">
                Moderate Experimentation Behaviour
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Coaching Stability
              </p>

              <h2 className="mt-2 text-4xl font-bold text-emerald-300">
                Good
              </h2>

              <p className="mt-2 text-sm text-emerald-200">
                Leadership Support Active
              </p>
            </div>

          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">

              <h2 className="text-2xl font-bold">
                Adaptive Growth Drivers
              </h2>

              <div className="mt-6 space-y-3">

                {growthDrivers.map((driver) => (
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
                Organizational Mindset Risks
              </h2>

              <div className="mt-6 space-y-3">

                {mindsetRisks.map((risk) => (
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
                  Enterprise Learning Intelligence
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Organizational Learning Heatmap
                </h2>
              </div>

              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                AI Learning Behaviour Monitoring Active
              </div>

            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-175">

                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-4">Department</th>
                    <th className="pb-4">Adaptability</th>
                    <th className="pb-4">Learning Culture</th>
                    <th className="pb-4">Primary Risk</th>
                  </tr>
                </thead>

                <tbody>

                  {learningHeatmap.map((item) => (
                    <tr
                      key={item.department}
                      className="border-b border-white/5"
                    >
                      <td className="py-4 font-semibold">
                        {item.department}
                      </td>

                      <td className="py-4 text-cyan-200">
                        {item.adaptability}
                      </td>

                      <td className="py-4 text-emerald-200">
                        {item.learningCulture}
                      </td>

                      <td className="py-4 text-slate-300">
                        {item.risk}
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
                  AI Adaptive Intelligence
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Executive Learning Insights
                </h2>
              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                Adaptive Learning Intelligence Enabled
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

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