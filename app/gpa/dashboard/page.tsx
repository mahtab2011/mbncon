import Link from "next/link";
import GPAProductionSummaryPanel from "@/app/components/gpa/GPAProductionSummaryPanel";
import GPAFactoryHealthPanel from "@/app/components/gpa/GPAFactoryHealthPanel";
import GPATOCConstraintPanel from "@/app/components/gpa/GPATOCConstraintPanel";
import GPALineBalancingSummaryPanel from "@/app/components/gpa/GPALineBalancingSummaryPanel";
import GPASMVIntelligencePanel from "@/app/components/gpa/GPASMVIntelligencePanel";
import GPATimeStudyPanel from "@/app/components/gpa/GPATimeStudyPanel";
import GPAMethodStudyPanel from "@/app/components/gpa/GPAMethodStudyPanel";
import GPAMotionEconomyPanel from "@/app/components/gpa/GPAMotionEconomyPanel";
import GPAActivitySamplingPanel from "@/app/components/gpa/GPAActivitySamplingPanel";
import GPAOEEPanel from "@/app/components/gpa/GPAOEEPanel";
import GPAGembaWalkPanel from "@/app/components/gpa/GPAGembaWalkPanel";

const productivityMetrics = [
  {
    label: "Factory Productivity Score",
    value: "78%",
    status: "Stable",
  },
  {
    label: "Average Line Efficiency",
    value: "64%",
    status: "Needs Improvement",
  },
  {
    label: "Bottleneck Lines",
    value: "3",
    status: "Action Required",
  },
  {
    label: "Manpower Utilization",
    value: "82%",
    status: "Good",
  },
];

const alerts = [
  "Line 04 output is 18% below target.",
  "Finishing section has rising WIP accumulation.",
  "Sewing Line 02 has repeated hourly production drop.",
];

export default function GPADashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              GPA Command Centre
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Garments Productivity Dashboard
            </h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Executive view of factory productivity, line efficiency,
              bottlenecks, manpower utilization and urgent corrective actions.
            </p>
          </div>

          <Link
            href="/gpa"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Back to GPA Home
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {productivityMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">{metric.label}</p>
              <h2 className="mt-3 text-4xl font-bold text-white">
                {metric.value}
              </h2>
              <p className="mt-3 text-sm font-semibold text-emerald-400">
                {metric.status}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold">Productivity Situation</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Current Factory Condition
                </p>
                <h3 className="mt-2 text-xl font-semibold text-yellow-300">
                  Controlled but under pressure
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Productivity is acceptable but several lines show repeated
                  output loss, WIP accumulation and capacity imbalance.
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Recommended Executive Focus
                </p>
                <h3 className="mt-2 text-xl font-semibold text-emerald-300">
                  Attack bottlenecks before increasing overtime
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The first improvement priority should be bottleneck
                  identification, line balancing and supervisor-level action
                  tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">AI Alerts</h2>

            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert}
                  className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-100"
                >
                  {alert}
                </div>
              ))}
            </div>

            <Link
              href="/gpa/bottleneck-centre"
              className="mt-6 block rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-bold text-slate-950 hover:bg-emerald-400"
            >
              Open Bottleneck Centre
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">GPA Execution Modules</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/gpa/bottleneck-centre"
              className="rounded-xl bg-slate-800 p-5 hover:bg-slate-700"
            >
              Bottleneck Centre
            </Link>

            <Link
              href="/gpa/mbo-centre"
              className="rounded-xl bg-slate-800 p-5 hover:bg-slate-700"
            >
              MBO Centre
            </Link>

            <Link
              href="/gpa/lean-kaizen"
              className="rounded-xl bg-slate-800 p-5 hover:bg-slate-700"
            >
              Lean Kaizen
            </Link>

            <Link
              href="/gpa/factory-health"
              className="rounded-xl bg-slate-800 p-5 hover:bg-slate-700"
            >
              Factory Health
            </Link>
          </div>
        </section>
      </section>
      <section className="mt-8">
  <GPAProductionSummaryPanel />
</section>
<section className="mt-8">
  <GPAFactoryHealthPanel />
</section>
<section className="mt-8">
  <GPATOCConstraintPanel />
</section>
<section className="mt-8">
  <GPALineBalancingSummaryPanel />
</section>
<section className="mt-8">
  <GPASMVIntelligencePanel />
</section>
<section className="mt-8">
  <GPATimeStudyPanel />
</section>
<section className="mt-8">
  <GPAMethodStudyPanel />
</section>
<section className="mt-8">
  <GPAMotionEconomyPanel />
</section>
<section className="mt-8">
  <GPAActivitySamplingPanel />
</section>
<section className="mt-8">
  <GPAOEEPanel />
</section>
<section className="mt-8">
  <GPAGembaWalkPanel />
</section>
    </main>
  );
}