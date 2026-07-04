import { analyzeTOCConstraints } from "@/lib/manufacturing/gpa/gpaTOCEngine";
import { gpaSampleProductionData } from "@/lib/manufacturing/gpa/gpaSampleProductionData";

export default function GPATOCConstraintPanel() {
  const constraints = analyzeTOCConstraints(gpaSampleProductionData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-3xl font-bold">
          Theory of Constraints Analysis
        </h2>

        <p className="mt-2 text-slate-400">
          থিওরি অব কনস্ট্রেইন্টস ভিত্তিক উৎপাদন বাধা বিশ্লেষণ
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {constraints.map((item) => (
          <div
            key={`${item.area}-${item.constraintType}`}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {item.area}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Constraint Type: {item.constraintType}
                </p>
              </div>

              <span className="rounded-full border border-red-700 bg-red-950 px-4 py-1 text-sm font-semibold text-red-200">
                {item.executivePriority}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Lost Output</p>
                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.lostOutput}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Loss %</p>
                <h4 className="mt-2 text-2xl font-bold text-orange-300">
                  {item.lostOutputPercent}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Constraint Score</p>
                <h4 className="mt-2 text-2xl font-bold text-red-300">
                  {item.constraintScore}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Estimated Gain</p>
                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.estimatedGainIfResolved}
                </h4>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Root Cause</p>
                <p className="mt-2 text-sm text-slate-200">
                  {item.rootCause}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {item.bnRootCause}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Recommended Action</p>
                <p className="mt-2 text-sm text-emerald-300">
                  {item.recommendedAction}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {item.bnRecommendedAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}