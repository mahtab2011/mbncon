import { analyzeActivitySampling } from "@/lib/manufacturing/gpa/gpaActivitySamplingEngine";
import { gpaSampleActivitySamplingData } from "@/lib/manufacturing/gpa/gpaSampleActivitySamplingData";
import { gpaBn } from "@/lib/manufacturing/gpa/gpaBanglaTranslations";

export default function GPAActivitySamplingPanel() {
  const results = analyzeActivitySampling(
    gpaSampleActivitySamplingData
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Activity Sampling Intelligence
          </h2>

          <p className="mt-2 text-slate-400">
            কার্যক্রম নমুনা বিশ্লেষণ
          </p>
        </div>

        <div className="rounded-xl bg-teal-600 px-5 py-3">
          <h2 className="text-3xl font-bold">
            {results.length}
          </h2>

          <p className="text-sm">
            Operators
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {results.map((item) => (
          <div
            key={item.operatorId}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {item.operatorName}
                </h3>

                <p className="mt-1 text-slate-400">
                  {item.operationName}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 px-4 py-2">
                <span className="font-semibold text-emerald-300">
                  {item.utilizationPercent}% Utilization
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Working
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.workingPercent}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Waiting
                </p>

                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.waitingPercent}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Idle
                </p>

                <h4 className="mt-2 text-2xl font-bold text-red-300">
                  {item.idlePercent}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Utilization
                </p>

                <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.utilizationPercent}%
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