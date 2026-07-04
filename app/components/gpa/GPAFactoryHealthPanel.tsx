import { calculateGPAFactoryHealth } from "@/lib/manufacturing/gpa/gpaFactoryHealthEngine";
import { gpaSampleProductionData } from "@/lib/manufacturing/gpa/gpaSampleProductionData";

export default function GPAFactoryHealthPanel() {
  const health = calculateGPAFactoryHealth(gpaSampleProductionData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Factory Health Score
          </h2>

          <p className="mt-2 text-slate-400">
            কারখানার সামগ্রিক স্বাস্থ্য মূল্যায়ন
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-600 px-6 py-4 text-center">
          <p className="text-sm">AI HEALTH SCORE</p>

          <h2 className="text-5xl font-bold">
            {health.healthScore}
          </h2>

          <p className="mt-2 font-semibold">
            {health.status}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-6">

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Productivity
          </p>

          <h3 className="mt-2 text-2xl font-bold text-emerald-300">
            {health.productivityScore}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Quality
          </p>

          <h3 className="mt-2 text-2xl font-bold text-cyan-300">
            {health.qualityScore}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            WIP
          </p>

          <h3 className="mt-2 text-2xl font-bold text-yellow-300">
            {health.wipScore}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Bottlenecks
          </p>

          <h3 className="mt-2 text-2xl font-bold text-red-300">
            {health.bottleneckScore}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Manpower
          </p>

          <h3 className="mt-2 text-2xl font-bold text-purple-300">
            {health.manpowerScore}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Machines
          </p>

          <h3 className="mt-2 text-2xl font-bold text-orange-300">
            {health.machineScore}
          </h3>
        </div>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl bg-slate-800 p-5">
          <h3 className="font-semibold text-emerald-300">
            Executive Summary
          </h3>

          <p className="mt-3 text-sm text-slate-300">
            {health.executiveSummary}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            {health.bnExecutiveSummary}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <h3 className="font-semibold text-yellow-300">
            Recommended Action
          </h3>

          <p className="mt-3 text-sm text-slate-300">
            {health.recommendedAction}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            {health.bnRecommendedAction}
          </p>
        </div>

      </div>
    </section>
  );
}