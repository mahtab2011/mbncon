import { analyzeLineBalancing } from "@/lib/manufacturing/gpa/gpaLineBalancingEngine";
import { gpaSampleLineBalancingData } from "@/lib/manufacturing/gpa/gpaSampleLineBalancingData";

export default function GPALineBalancingPanel() {
  const analysis = analyzeLineBalancing(gpaSampleLineBalancingData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-3xl font-bold">
          AI Line Balancing Analysis
        </h2>

        <p className="mt-2 text-slate-400">
          এআই ভিত্তিক লাইন ব্যালান্সিং বিশ্লেষণ
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Line Balance Score</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-300">
            {analysis.summary.lineBalanceScore}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Average Efficiency</p>
          <h3 className="mt-2 text-3xl font-bold text-yellow-300">
            {analysis.summary.averageEfficiency}%
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Bottleneck Operations</p>
          <h3 className="mt-2 text-3xl font-bold text-red-300">
            {analysis.summary.bottleneckOperations}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Underloaded Operations</p>
          <h3 className="mt-2 text-3xl font-bold text-cyan-300">
            {analysis.summary.underloadedOperations}
          </h3>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-800 p-5">
        <h3 className="font-semibold text-emerald-300">
          Executive Summary
        </h3>

        <p className="mt-3 text-sm text-slate-300">
          {analysis.summary.executiveSummary}
        </p>

        <p className="mt-3 text-sm text-slate-400">
          {analysis.summary.bnExecutiveSummary}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {analysis.results.map((item) => (
          <div
            key={item.operationId}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {item.operationName}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Operator: {item.operatorName}
                </p>
              </div>

              <span className="rounded-full border border-emerald-700 bg-emerald-950 px-4 py-1 text-sm font-semibold text-emerald-200">
                {item.loadStatus}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Efficiency</p>
                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.efficiencyPercent}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Idle Risk</p>
                <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.idleRisk}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Overload Risk</p>
                <h4 className="mt-2 text-2xl font-bold text-red-300">
                  {item.overloadRisk}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <h4 className="mt-2 text-lg font-bold text-emerald-300">
                  {item.loadStatus}
                </h4>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Recommended Action</p>
              <p className="mt-2 text-sm text-emerald-300">
                {item.recommendedAction}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {item.bnRecommendedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}