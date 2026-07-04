import { analyzeMethodStudy } from "@/lib/manufacturing/gpa/gpaMethodStudyEngine";
import { gpaSampleMethodStudyData } from "@/lib/manufacturing/gpa/gpaSampleMethodStudyData";
import { gpaBn } from "@/lib/manufacturing/gpa/gpaBanglaTranslations";

export default function GPAMethodStudyPanel() {
  const results = analyzeMethodStudy(gpaSampleMethodStudyData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Method Study Intelligence
          </h2>

          <p className="mt-2 text-slate-400">
            {gpaBn.methodStudy}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-600 px-5 py-3">
          <h2 className="text-3xl font-bold">
            {results.length}
          </h2>

          <p className="text-sm">
            Operations
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {results.map((item) => (
          <div
            key={item.operationId}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {item.operationName}
                </h3>
              </div>

              <span className="rounded-full border border-blue-700 bg-blue-950 px-4 py-1 text-sm font-semibold text-blue-200">
                {item.executivePriority}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Improvement Score
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.improvementScore}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Time Saving
                </p>

                <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.estimatedTimeSaving} min
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Efficiency Gain
                </p>

                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.estimatedEfficiencyGain}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Priority
                </p>

                <h4 className="mt-2 text-xl font-bold text-red-300">
                  {item.executivePriority}
                </h4>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-4">
              <h4 className="font-semibold text-emerald-300">
                Recommendation
              </h4>

              <p className="mt-2 text-slate-300">
                {item.recommendation}
              </p>

              <p className="mt-2 text-slate-400">
                {item.bnRecommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}