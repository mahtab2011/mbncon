"use client";

type LearningCurve = {
  id: string;
  operator: string;
  operation: string;
  style: string;
  day1: number;
  day2: number;
  day3: number;
  day5: number;
  day7: number;
  targetEfficiency: number;
  stabilizationDay: number;
  trainingHours: number;
  predictedDhu: number;
  aiRecommendation: string;
};

const learningCurves: LearningCurve[] = [
  {
    id: "1",
    operator: "OPR-142",
    operation: "Collar Attach",
    style: "HNM-POLO-2401",
    day1: 58,
    day2: 67,
    day3: 74,
    day5: 82,
    day7: 88,
    targetEfficiency: 85,
    stabilizationDay: 6,
    trainingHours: 3,
    predictedDhu: 1.8,
    aiRecommendation:
      "Ready for production after Day 5. Assign as lead operator.",
  },
  {
    id: "2",
    operator: "OPR-188",
    operation: "Sleeve Attach",
    style: "PRM-HOOD-3307",
    day1: 52,
    day2: 61,
    day3: 69,
    day5: 75,
    day7: 81,
    targetEfficiency: 80,
    stabilizationDay: 7,
    trainingHours: 6,
    predictedDhu: 2.6,
    aiRecommendation:
      "Provide coaching during first three days to accelerate learning.",
  },
  {
    id: "3",
    operator: "OPR-219",
    operation: "Shoulder Join",
    style: "ZRA-TEE-1188",
    day1: 48,
    day2: 57,
    day3: 66,
    day5: 73,
    day7: 79,
    targetEfficiency: 78,
    stabilizationDay: 7,
    trainingHours: 8,
    predictedDhu: 3.4,
    aiRecommendation:
      "Keep under mentor supervision until efficiency stabilizes.",
  },
];

export default function LearningCurvePage() {
  const avgDay1 =
    learningCurves.reduce((sum, item) => sum + item.day1, 0) /
    learningCurves.length;

  const avgDay7 =
    learningCurves.reduce((sum, item) => sum + item.day7, 0) /
    learningCurves.length;

  const avgTraining =
    learningCurves.reduce(
      (sum, item) => sum + item.trainingHours,
      0
    ) / learningCurves.length;

  const avgDhu =
    learningCurves.reduce(
      (sum, item) => sum + item.predictedDhu,
      0
    ) / learningCurves.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Learning Curve Prediction Engine
        </h1>

        <p className="mt-2 text-gray-600">
          Predicts operator learning speed, stabilization period,
          expected efficiency growth and quality performance.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Avg Day-1 Efficiency
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-700">
            {avgDay1.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Avg Day-7 Efficiency
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {avgDay7.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Avg Training Hours
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {avgTraining.toFixed(1)}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Predicted DHU
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {avgDhu.toFixed(1)}%
          </h2>
        </div>

      </div>

      <div className="grid gap-6">

        {learningCurves.map((item) => (

          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5">

              <h2 className="text-2xl font-bold text-blue-700">
                {item.operator}
              </h2>

              <p className="text-gray-600">
                {item.operation} | {item.style}
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-7">

              <Metric title="Day 1" value={`${item.day1}%`} />
              <Metric title="Day 2" value={`${item.day2}%`} />
              <Metric title="Day 3" value={`${item.day3}%`} />
              <Metric title="Day 5" value={`${item.day5}%`} />
              <Metric title="Day 7" value={`${item.day7}%`} />
              <Metric title="Target" value={`${item.targetEfficiency}%`} />
              <Metric title="DHU" value={`${item.predictedDhu}%`} />

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-lg border p-4">

                <p className="text-sm text-gray-500">
                  Stabilization Day
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Day {item.stabilizationDay}
                </h3>

              </div>

              <div className="rounded-lg border p-4">

                <p className="text-sm text-gray-500">
                  Estimated Training
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {item.trainingHours} Hours
                </h3>

              </div>

            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-5">

              <h3 className="font-bold text-blue-700">
                AI Recommendation
              </h3>

              <p className="mt-2 text-gray-700">
                {item.aiRecommendation}
              </p>

            </div>

          </section>

        ))}

      </div>

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">

        <h2 className="text-2xl font-bold text-green-700">
          AI Executive Insight
        </h2>

        <p className="mt-4 text-gray-700">
          Based on historical learning patterns, AI predicts that
          operators will improve from an average of{" "}
          <strong>{avgDay1.toFixed(1)}%</strong> efficiency on Day 1
          to <strong>{avgDay7.toFixed(1)}%</strong> by Day 7 with an
          average of <strong>{avgTraining.toFixed(1)} hours</strong> of
          focused training. These forecasts can be used to improve
          production planning, staffing, and shipment reliability.
        </p>

      </div>

    </main>
  );
}

type MetricProps = {
  title: string;
  value: string;
};

function Metric({ title, value }: MetricProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}