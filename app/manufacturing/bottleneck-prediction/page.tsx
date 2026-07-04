"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type BottleneckPrediction = {
  id: string;
  process: string;
  line: string;
  currentLoad: number;
  tomorrowLoad: number;
  predictedDelay: number;
  risk: RiskLevel;
  reason: string;
  aiRecommendation: string;
};

const predictions: BottleneckPrediction[] = [
  {
    id: "1",
    process: "Collar Attach",
    line: "L-001",
    currentLoad: 82,
    tomorrowLoad: 91,
    predictedDelay: 8,
    risk: "MEDIUM",
    reason: "Higher style complexity with additional collar operations.",
    aiRecommendation:
      "Assign one experienced collar operator before shift start.",
  },
  {
    id: "2",
    process: "Hood Attach",
    line: "L-003",
    currentLoad: 93,
    tomorrowLoad: 98,
    predictedDelay: 24,
    risk: "HIGH",
    reason:
      "Material shortage and machine downtime are likely to reduce throughput.",
    aiRecommendation:
      "Complete machine maintenance and replenish hood fabric immediately.",
  },
  {
    id: "3",
    process: "Packing",
    line: "L-002",
    currentLoad: 68,
    tomorrowLoad: 72,
    predictedDelay: 2,
    risk: "LOW",
    reason: "Normal production flow expected.",
    aiRecommendation:
      "Continue current manpower allocation.",
  },
];

function riskClass(risk: RiskLevel) {
  switch (risk) {
    case "LOW":
      return "bg-green-100 text-green-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function BottleneckPredictionPage() {

  const avgLoad = (
    predictions.reduce(
      (sum, item) => sum + item.tomorrowLoad,
      0
    ) / predictions.length
  ).toFixed(1);

  const highRisk = predictions.filter(
    (item) => item.risk === "HIGH"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          AI Bottleneck Prediction Engine
        </h1>

        <p className="mt-2 text-gray-600">
          Predicts tomorrow's bottlenecks before they occur using
          production, quality, maintenance, attendance and WIP signals.
        </p>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">

        <Card
          title="Average Tomorrow Load"
          value={`${avgLoad}%`}
          color="text-blue-700"
        />

        <Card
          title="High Risk Bottlenecks"
          value={highRisk.toString()}
          color="text-red-700"
        />

        <Card
          title="Prediction Confidence"
          value="95%"
          color="text-green-700"
        />

      </div>

      <div className="grid gap-6">

        {predictions.map((item) => (

          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5 flex flex-wrap items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-blue-700">
                  {item.process}
                </h2>

                <p className="text-gray-600">
                  {item.line}
                </p>

              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(
                  item.risk
                )}`}
              >
                {item.risk} RISK
              </span>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <Metric
                title="Current Load"
                value={`${item.currentLoad}%`}
              />

              <Metric
                title="Tomorrow"
                value={`${item.tomorrowLoad}%`}
              />

              <Metric
                title="Predicted Delay"
                value={`${item.predictedDelay} min`}
              />

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-lg border p-4">

                <p className="text-sm font-semibold text-gray-500">
                  AI Reason
                </p>

                <p className="mt-2 text-gray-700">
                  {item.reason}
                </p>

              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

                <p className="text-sm font-semibold text-blue-700">
                  Recommended Action
                </p>

                <p className="mt-2 text-gray-700">
                  {item.aiRecommendation}
                </p>

              </div>

            </div>

          </section>

        ))}

      </div>

      <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="text-2xl font-bold text-red-700">
          Executive Prediction
        </h2>

        <p className="mt-4 text-gray-700">
          AI predicts that <strong>Hood Attach on Line L-003</strong>
          will become tomorrow's primary bottleneck unless preventive
          maintenance and material replenishment are completed before
          production starts.
        </p>

      </section>

    </main>
  );
}

type CardProps = {
  title: string;
  value: string;
  color: string;
};

function Card({
  title,
  value,
  color,
}: CardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

type MetricProps = {
  title: string;
  value: string;
};

function Metric({
  title,
  value,
}: MetricProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}