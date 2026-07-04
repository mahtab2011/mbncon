import { analyzeMotionEconomy } from "@/lib/manufacturing/gpa/gpaMotionEconomyEngine";
import { gpaSampleMotionEconomyData } from "@/lib/manufacturing/gpa/gpaSampleMotionEconomyData";
import { gpaBn } from "@/lib/manufacturing/gpa/gpaBanglaTranslations";

export default function GPAMotionEconomyPanel() {
  const results = analyzeMotionEconomy(
    gpaSampleMotionEconomyData
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Motion Economy Intelligence
          </h2>

          <p className="mt-2 text-slate-400">
            মোশন ইকোনমি বিশ্লেষণ
          </p>
        </div>

        <div className="rounded-xl bg-indigo-600 px-5 py-3">
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
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <div>
                <h3 className="text-xl font-bold">
                  {item.operationName}
                </h3>
              </div>

              <span className="rounded-full border border-blue-700 bg-blue-950 px-4 py-1 text-sm font-semibold text-blue-200">
                {item.ergonomicRisk}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Motion Score
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.motionScore}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Wasted Seconds
                </p>

                <h4 className="mt-2 text-2xl font-bold text-red-300">
                  {item.wastedMotionSeconds}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Ergonomic Risk
                </p>

                <h4 className="mt-2 text-xl font-bold text-yellow-300">
                  {item.ergonomicRisk}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Expected Gain
                </p>

                <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.expectedEfficiencyGain}%
                </h4>
              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-4">
              <h4 className="font-semibold text-emerald-300">
                {gpaBn.recommendedAction}
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