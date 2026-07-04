import { analyzeLineBalancing } from "@/lib/manufacturing/gpa/gpaLineBalancingEngine";
import { gpaSampleLineBalancingData } from "@/lib/manufacturing/gpa/gpaSampleLineBalancingData";

export default function GPALineBalancingSummaryPanel() {
  const { summary } = analyzeLineBalancing(
    gpaSampleLineBalancingData
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Line Balancing Executive Summary
          </h2>

          <p className="mt-2 text-slate-400">
            লাইন ব্যালান্সিং নির্বাহী সারসংক্ষেপ
          </p>
        </div>

        <div className="rounded-xl bg-emerald-600 px-5 py-3">
          <h2 className="text-3xl font-bold">
            {summary.lineBalanceScore}
          </h2>

          <p className="text-sm">
            Balance Score
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Avg Efficiency
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-300">
            {summary.averageEfficiency}%
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Bottlenecks
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-300">
            {summary.bottleneckOperations}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Overloaded
          </p>

          <h3 className="mt-2 text-3xl font-bold text-yellow-300">
            {summary.overloadedOperations}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">
            Underloaded
          </p>

          <h3 className="mt-2 text-3xl font-bold text-cyan-300">
            {summary.underloadedOperations}
          </h3>
        </div>

      </div>

      <div className="mt-8 rounded-xl bg-slate-800 p-5">
        <h3 className="font-semibold text-emerald-300">
          Executive Interpretation
        </h3>

        <p className="mt-3 text-slate-300">
          {summary.executiveSummary}
        </p>

        <p className="mt-3 text-slate-400">
          {summary.bnExecutiveSummary}
        </p>
      </div>
    </section>
  );
}