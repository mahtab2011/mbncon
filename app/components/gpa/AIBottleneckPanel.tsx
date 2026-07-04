import {
  evaluateBottleneck,
  GPABottleneckInput,
} from "@/lib/manufacturing/gpa/bottleneckEngine";

const sampleInputs: GPABottleneckInput[] = [
  {
    area: "Sewing Line 04",
    targetOutput: 100,
    actualOutput: 76,
    operators: 31,
    targetOperators: 35,
    waitingMinutes: 24,
    wip: 150,
    defects: 8,
  },
  {
    area: "Finishing Section",
    targetOutput: 120,
    actualOutput: 108,
    operators: 18,
    targetOperators: 18,
    waitingMinutes: 8,
    wip: 170,
    defects: 5,
  },
  {
    area: "Cutting Input",
    targetOutput: 90,
    actualOutput: 82,
    operators: 12,
    targetOperators: 14,
    waitingMinutes: 18,
    wip: 85,
    defects: 3,
  },
];

export default function AIBottleneckPanel() {
  const results = sampleInputs.map((input) => ({
    ...input,
    result: evaluateBottleneck(input),
  }));

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold">
        AI Bottleneck Analysis / এআই বটলনেক বিশ্লেষণ
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Engine-generated analysis based on target output, actual output,
        waiting time, WIP, defects and manpower gap.
      </p>

      <div className="mt-6 space-y-5">
        {results.map((item) => (
          <div
            key={item.area}
            className="rounded-2xl border border-slate-800 bg-slate-800 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{item.area}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Target: {item.targetOutput} | Actual: {item.actualOutput} |
                  WIP: {item.wip}
                </p>
              </div>

              <span className="rounded-full border border-emerald-700 bg-emerald-950 px-4 py-1 text-sm font-semibold text-emerald-200">
                {item.result.severity}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Productivity Loss</p>
                <p className="mt-2 text-2xl font-bold text-yellow-300">
                  {item.result.productivityLoss}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Bottleneck Score</p>
                <p className="mt-2 text-2xl font-bold text-red-300">
                  {item.result.bottleneckScore}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Executive Owner</p>
                <p className="mt-2 font-semibold text-emerald-300">
                  {item.result.executivePriority}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Root Cause</p>
                <p className="mt-2 text-sm text-slate-200">
                  {item.result.rootCause}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Recommended Action</p>
                <p className="mt-2 text-sm text-emerald-300">
                  {item.result.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}