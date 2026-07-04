import { analyzeTimeStudy } from "@/lib/manufacturing/gpa/gpaTimeStudyEngine";
import { gpaSampleTimeStudyData } from "@/lib/manufacturing/gpa/gpaSampleTimeStudyData";
import { gpaBn } from "@/lib/manufacturing/gpa/gpaBanglaTranslations";

export default function GPATimeStudyPanel() {
  const results = analyzeTimeStudy(gpaSampleTimeStudyData);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Time Study Intelligence
          </h2>

          <p className="mt-2 text-slate-400">
            {gpaBn.timeStudy}
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {item.operationName}
                </h3>

                <p className="text-slate-400">
                  {gpaBn.operator}: {item.operatorName}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 px-4 py-2">
                <span className="font-semibold">
                  {item.observations} Observations
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Average Time
                </p>

                <h4 className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.averageObservedTime}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Normal Time
                </p>

                <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                  {item.normalTime}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Standard Time
                </p>

                <h4 className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.standardTime}
                </h4>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">
                  Samples
                </p>

                <h4 className="mt-2 text-2xl font-bold text-purple-300">
                  {item.observations}
                </h4>
              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-4">

              <h4 className="font-semibold text-emerald-300">
                Executive Comment
              </h4>

              <p className="mt-2 text-slate-300">
                {item.executiveComment}
              </p>

              <p className="mt-2 text-slate-400">
                {item.bnExecutiveComment}
              </p>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}