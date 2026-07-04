import {
  calculateGPAProductionSummary,
} from "@/lib/manufacturing/gpa/gpaProductionDataModel";

import {
  gpaSampleProductionData,
} from "@/lib/manufacturing/gpa/gpaSampleProductionData";

export default function GPAProductionSummaryPanel() {
  const summary =
    calculateGPAProductionSummary(
      gpaSampleProductionData
    );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Live Production Summary
          </h2>

          <p className="mt-2 text-slate-400">
            লাইভ উৎপাদন সারসংক্ষেপ
          </p>
        </div>

        <div className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold">
          AI LIVE
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Target
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {summary.totalTarget}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            মোট টার্গেট
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Output
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {summary.totalOutput}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            মোট উৎপাদন
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Achievement
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-400">
            {summary.achievementPercent}%
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            অর্জন
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total WIP
          </p>

          <h3 className="mt-2 text-3xl font-bold text-yellow-300">
            {summary.totalWip}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            মোট WIP
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Total Defects
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-300">
            {summary.totalDefects}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            মোট ত্রুটি
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Bottlenecks
          </p>

          <h3 className="mt-2 text-3xl font-bold text-orange-300">
            {summary.bottleneckCount}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            বটলনেক
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Critical
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-500">
            {summary.criticalBottleneckCount}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            গুরুতর বটলনেক
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Factory Status
          </p>

          <h3 className="mt-2 text-2xl font-bold text-emerald-300">
            Stable
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            কারখানার অবস্থা
          </p>
        </div>

      </div>
    </section>
  );
}