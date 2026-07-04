import { analyzeGembaWalk } from "@/lib/manufacturing/gpa/gpaGembaWalkEngine";
import { gpaSampleGembaWalkData } from "@/lib/manufacturing/gpa/gpaSampleGembaWalkData";
import { gpaBn } from "@/lib/manufacturing/gpa/gpaBanglaTranslations";

export default function GPAGembaWalkPanel() {
  const results = analyzeGembaWalk(gpaSampleGembaWalkData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            AI Gemba Walk & Factory Inspection
          </h2>

          <p className="mt-2 text-slate-400">
            এআই গেম্বা ওয়াক ও কারখানা পরিদর্শন
          </p>
        </div>

        <div className="rounded-xl bg-green-700 px-5 py-3">
          <h2 className="text-3xl font-bold">
            {results.length}
          </h2>

          <p className="text-sm">
            Inspection Areas
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {results.map((item) => (
          <div
            key={item.area}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <div>
                <h3 className="text-xl font-bold">
                  {item.area}
                </h3>

                <p className="mt-1 text-slate-400">
                  Inspector: {item.inspector}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 px-4 py-2">
                <span className="font-semibold text-emerald-300">
                  Health Score: {item.factoryHealthScore}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Total Findings
                </p>

                <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.totalObservations}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Critical
                </p>

                <h4 className="mt-2 text-2xl font-bold text-red-300">
                  {item.criticalIssues}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Attention
                </p>

                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.attentionIssues}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Good Practices
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.goodPractices}
                </h4>
              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-4">

              <h4 className="font-semibold text-emerald-300">
                {gpaBn.executiveSummary}
              </h4>

              <p className="mt-2 text-slate-300">
                {item.executiveRecommendation}
              </p>

              <p className="mt-2 text-slate-400">
                {item.bnExecutiveRecommendation}
              </p>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}