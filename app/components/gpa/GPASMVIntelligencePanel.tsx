import { analyzeSMV } from "@/lib/manufacturing/gpa/gpaSMVIntelligenceEngine";
import { gpaSampleSMVData } from "@/lib/manufacturing/gpa/gpaSampleSMVData";

export default function GPASMVIntelligencePanel() {
  const results = analyzeSMV(gpaSampleSMVData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            AI SMV Intelligence
          </h2>

          <p className="mt-2 text-slate-400">
            এআই ভিত্তিক SMV বিশ্লেষণ
          </p>
        </div>

        <div className="rounded-xl bg-blue-600 px-5 py-3">
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
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {item.operationName}
                </h3>

                <p className="mt-1 text-slate-400">
                  {item.operatorName}
                </p>
              </div>

              <span className="rounded-full border border-red-700 bg-red-950 px-4 py-1 text-sm font-semibold text-red-200">
                {item.priority}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-5">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  SMV
                </p>

                <h4 className="mt-2 text-2xl font-bold">
                  {item.smv}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Actual
                </p>

                <h4 className="mt-2 text-2xl font-bold">
                  {item.actualTime}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Variance
                </p>

                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.variance}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Efficiency
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.efficiency}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Lost Minutes
                </p>

                <h4 className="mt-2 text-2xl font-bold text-red-300">
                  {item.lostMinutesPerHour}
                </h4>
              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-4">

              <p className="text-sm text-slate-400">
                Recommendation
              </p>

              <p className="mt-2 text-sm text-emerald-300">
                {item.recommendation}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {item.bnRecommendation}
              </p>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}