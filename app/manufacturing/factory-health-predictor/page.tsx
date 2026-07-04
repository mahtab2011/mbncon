"use client";
import {
  productionSummary,
  factoryHealth,
} from "@/lib/manufacturing/manufacturingData";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type HealthSignal = {
  id: string;
  area: string;
  todayScore: number;
  tomorrowForecast: number;
  risk: RiskLevel;
  reason: string;
  aiAction: string;
};

const healthSignals: HealthSignal[] = [
  {
    id: "1",
    area: "Production",
    todayScore: 81,
    tomorrowForecast: 86,
    risk: "LOW",
    reason: "Line optimization actions expected to improve output.",
    aiAction: "Continue monitoring Line L-002 during first 3 hours.",
  },
  {
    id: "2",
    area: "Quality",
    todayScore: 98,
    tomorrowForecast: 96,
    risk: "LOW",
    reason: "New style learning curve may slightly increase DHU.",
    aiAction: "Increase inline inspection for Collar Attach.",
  },
  {
    id: "3",
    area: "Machine Health",
    todayScore: 88,
    tomorrowForecast: 79,
    risk: "MEDIUM",
    reason: "MC-014 shows elevated failure probability.",
    aiAction: "Complete preventive maintenance before next shift.",
  },
  {
    id: "4",
    area: "Operator Readiness",
    todayScore: 94,
    tomorrowForecast: 91,
    risk: "LOW",
    reason: "Two skilled operators may be absent tomorrow.",
    aiAction: "Prepare backup operators from Line L-003.",
  },
  {
    id: "5",
    area: "Shipment Confidence",
    todayScore: 96,
    tomorrowForecast: 97,
    risk: "LOW",
    reason: "Production simulation shows recovery possible.",
    aiAction: "Approve PP sample and release bulk production.",
  },
];

function riskClass(risk: RiskLevel) {
  if (risk === "LOW") {
    return "bg-green-100 text-green-700";
  }

  if (risk === "MEDIUM") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function FactoryHealthPredictorPage() {
  const todayAverage =
    healthSignals.reduce((sum, item) => sum + item.todayScore, 0) /
    healthSignals.length;

  const tomorrowAverage =
    healthSignals.reduce(
      (sum, item) => sum + item.tomorrowForecast,
      0
    ) / healthSignals.length;

  const riskAreas = healthSignals.filter(
    (item) => item.risk !== "LOW"
  ).length;

  const improvement = tomorrowAverage - todayAverage;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Factory Health Predictor
        </h1>

        <p className="mt-2 text-gray-600">
          Forecasts tomorrow&apos;s factory health using production, quality,
          machine, operator, readiness, shipment and bottleneck signals.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card
          title="Today Health"
          value={`${factoryHealth.overallHealth}%`}
          color="text-blue-700"
        />

        <Card
          title="Tomorrow Forecast"
          value={`${Math.min(factoryHealth.overallHealth + 2, 100)}%`}
          color="text-green-700"
        />

        <Card
          title="Expected Change"
          value={`${improvement >= 0 ? "+" : ""}${improvement.toFixed(1)}%`}
          color={improvement >= 0 ? "text-green-700" : "text-red-700"}
        />

        <Card
          title="Risk Areas"
          value={productionSummary.dhu > 3 ? "2" : "1"}
          color="text-orange-700"
        />
      </div>

      <div className="grid gap-6">
        {healthSignals.map((signal) => (
          <section
            key={signal.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {signal.area}
                </h2>

                <p className="text-gray-600">
                  Today: {signal.todayScore}% · Tomorrow:{" "}
                  {signal.tomorrowForecast}%
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(
                  signal.risk
                )}`}
              >
                {signal.risk} RISK
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Metric
                title="Today Score"
                value={`${signal.todayScore}%`}
              />

              <Metric
                title="Forecast"
                value={`${signal.tomorrowForecast}%`}
              />

              <Metric
                title="Change"
                value={`${
                  signal.tomorrowForecast - signal.todayScore >= 0
                    ? "+"
                    : ""
                }${signal.tomorrowForecast - signal.todayScore}%`}
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Forecast Reason
                </p>

                <p className="mt-2 text-gray-700">
                  {signal.reason}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  AI Preventive Action
                </p>

                <p className="mt-2 text-gray-700">
                  {signal.aiAction}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-700">
          Executive Forecast
        </h2>

        <p className="mt-4 text-gray-700">
  AI predicts factory health at{" "}
  <strong>{factoryHealth.overallHealth}%</strong>.
  Current production is{" "}
  <strong>
    {productionSummary.totalProduction.toLocaleString()}
  </strong>{" "}
  pieces with an efficiency of{" "}
  <strong>{productionSummary.efficiency}%</strong>.
  Preventive maintenance and bottleneck reduction remain the highest
  priority actions for tomorrow's production plan.
</p>
      </div>
    </main>
  );
}

type CardProps = {
  title: string;
  value: string;
  color: string;
};

function Card({ title, value, color }: CardProps) {
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

function Metric({ title, value }: MetricProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}