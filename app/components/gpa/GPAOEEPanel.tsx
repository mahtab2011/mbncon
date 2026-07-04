import { analyzeOEE } from "@/lib/manufacturing/gpa/gpaOEEEngine";
import { gpaSampleOEEData } from "@/lib/manufacturing/gpa/gpaSampleOEEData";
import { gpaBn } from "@/lib/manufacturing/gpa/gpaBanglaTranslations";

export default function GPAOEEPanel() {
  const results = analyzeOEE(gpaSampleOEEData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Overall Equipment Effectiveness (OEE)
          </h2>

          <p className="mt-2 text-slate-400">
            সামগ্রিক যন্ত্রপাতি কার্যকারিতা (OEE)
          </p>
        </div>

        <div className="rounded-xl bg-orange-600 px-5 py-3">
          <h2 className="text-3xl font-bold">
            {results.length}
          </h2>

          <p className="text-sm">
            Machines
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {results.map((item) => (
          <div
            key={item.machineId}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {item.machineName}
                </h3>
              </div>

              <span className="rounded-full border border-orange-700 bg-orange-950 px-4 py-1 text-sm font-semibold text-orange-200">
                {item.rating}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  OEE Score
                </p>

                <h4 className="mt-2 text-3xl font-bold text-emerald-300">
                  {item.oee}%
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Rating
                </p>

                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.rating}
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