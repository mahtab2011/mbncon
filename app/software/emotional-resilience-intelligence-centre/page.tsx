"use client";

import DashboardShell from "@/components/software/DashboardShell";

const resilienceDrivers = [
  "Operational recovery capability",
  "Leadership calmness under pressure",
  "Emotional stability during disruption",
  "Workforce morale recovery",
  "Adaptive communication culture",
  "Crisis-response coordination",
  "Pressure-management discipline",
  "Psychological resilience behaviour",
];

const resilienceRisks = [
  "Emotional fatigue escalation",
  "Burnout pressure accumulation",
  "Conflict recovery delays",
  "Operational stress overload",
  "Leadership emotional instability",
  "Morale deterioration risk",
  "Workforce exhaustion exposure",
  "Communication breakdown under pressure",
];

const aiInsights = [
  "Operational fatigue increasing after sustained overtime pressure.",
  "Leadership emotional stability declining during shipment escalation.",
  "Recovery behaviour strongest in maintenance and planning departments.",
  "Conflict stabilization slower in high-pressure production areas.",
  "Morale recovery improving after recognition interventions.",
  "Stress resilience indicators unstable in late-night operations.",
];

const resilienceHeatmap = [
  {
    department: "Sewing",
    resilience: "Medium",
    recovery: "Stable",
    risk: "Fatigue accumulation",
  },

  {
    department: "Quality",
    resilience: "High",
    recovery: "Strong",
    risk: "Low resilience risk",
  },

  {
    department: "Cutting",
    resilience: "Medium",
    recovery: "Moderate",
    risk: "Pressure recovery delay",
  },

  {
    department: "Maintenance",
    resilience: "High",
    recovery: "Adaptive",
    risk: "Low emotional disruption",
  },
];

export default function EmotionalResilienceIntelligenceCentrePage() {
  return (
    <DashboardShell title="Emotional Resilience Intelligence Centre">
      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section>

            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              MBNCON Emotional Intelligence Architecture
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Emotional Resilience Intelligence Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300 leading-relaxed">
              This intelligence platform evaluates emotional resilience,
              operational recovery behaviour, leadership stability,
              workforce fatigue exposure, morale recovery capability,
              and organizational pressure tolerance across enterprise operations.
            </p>

          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Emotional Stability
              </p>

              <h2 className="mt-2 text-4xl font-bold text-cyan-300">
                79%
              </h2>

              <p className="mt-2 text-sm text-cyan-200">
                Stable Workforce Resilience
              </p>

            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Burnout Exposure
              </p>

              <h2 className="mt-2 text-4xl font-bold text-amber-300">
                Medium
              </h2>

              <p className="mt-2 text-sm text-amber-200">
                Overtime Fatigue Pressure
              </p>

            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Recovery Capability
              </p>

              <h2 className="mt-2 text-4xl font-bold text-rose-300">
                74%
              </h2>

              <p className="mt-2 text-sm text-rose-200">
                Moderate Recovery Strength
              </p>

            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Leadership Stability
              </p>

              <h2 className="mt-2 text-4xl font-bold text-emerald-300">
                Good
              </h2>

              <p className="mt-2 text-sm text-emerald-200">
                Calm Decision Environment
              </p>

            </div>

          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">

              <h2 className="text-2xl font-bold">
                Emotional Resilience Drivers
              </h2>

              <div className="mt-6 space-y-3">

                {resilienceDrivers.map((driver) => (
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
                Emotional Risk Indicators
              </h2>

              <div className="mt-6 space-y-3">

                {resilienceRisks.map((risk) => (
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
                  Enterprise Resilience Intelligence
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Organizational Recovery Heatmap
                </h2>

              </div>

              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                Emotional Stability Monitoring Active
              </div>

            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-175">

                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-4">Department</th>
                    <th className="pb-4">Resilience</th>
                    <th className="pb-4">Recovery</th>
                    <th className="pb-4">Primary Risk</th>
                  </tr>
                </thead>

                <tbody>

                  {resilienceHeatmap.map((item) => (
                    <tr
                      key={item.department}
                      className="border-b border-white/5"
                    >

                      <td className="py-4 font-semibold">
                        {item.department}
                      </td>

                      <td className="py-4 text-cyan-200">
                        {item.resilience}
                      </td>

                      <td className="py-4 text-emerald-200">
                        {item.recovery}
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
                  AI Emotional Intelligence
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Executive Resilience Insights
                </h2>

              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                Adaptive Emotional Intelligence Enabled
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