"use client";
import {
  productionSummary,
  executiveAlerts,
  factoryHealth,
} from "@/lib/manufacturing/manufacturingData";

type DecisionPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type ExecutiveDecision = {
  id: string;
  title: string;
  department: string;
  priority: DecisionPriority;
  expectedBenefit: string;
  confidence: number;
  estimatedSaving: number;
  decision: string;
};

const decisions: ExecutiveDecision[] = [
  {
    id: "1",
    title: "Move 2 Operators to Line L-003",
    department: "Production",
    priority: "HIGH",
    expectedBenefit: "+4% Efficiency",
    confidence: 96,
    estimatedSaving: 2400,
    decision:
      "Temporary operator balancing will remove the sewing bottleneck.",
  },
  {
    id: "2",
    title: "Approve Preventive Maintenance for MC-014",
    department: "Maintenance",
    priority: "CRITICAL",
    expectedBenefit: "-72% Downtime",
    confidence: 98,
    estimatedSaving: 3800,
    decision:
      "Immediate maintenance will prevent repeated breakdowns.",
  },
  {
    id: "3",
    title: "Release Hood Fabric",
    department: "Stores",
    priority: "CRITICAL",
    expectedBenefit: "-46% Shipment Risk",
    confidence: 95,
    estimatedSaving: 5100,
    decision:
      "Immediate fabric issue will restore production flow.",
  },
  {
    id: "4",
    title: "Increase Inline QC by 1 Inspector",
    department: "Quality",
    priority: "MEDIUM",
    expectedBenefit: "-1.2 DHU",
    confidence: 91,
    estimatedSaving: 1450,
    decision:
      "Extra inline inspection will reduce rework and repairs.",
  },
];

function priorityClass(priority: DecisionPriority) {
  switch (priority) {
    case "LOW":
      return "bg-green-100 text-green-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function ExecutiveDecisionCentrePage() {

  const totalSaving = decisions.reduce(
    (sum, item) => sum + item.estimatedSaving,
    0
  );

  const averageConfidence =
    decisions.reduce(
      (sum, item) => sum + item.confidence,
      0
    ) / decisions.length;

  const criticalActions = decisions.filter(
    (item) => item.priority === "CRITICAL"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          Executive Decision Centre
        </h1>

        <p className="mt-2 text-gray-600">
          AI-generated executive decisions ranked by business impact,
          confidence and financial benefit.
        </p>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="AI Decisions"
          value={executiveAlerts.length.toString()}
          color="text-blue-700"
        />

        <Card
          title="Critical"
          value={
  executiveAlerts
    .filter(a => a.severity === "CRITICAL")
    .length
    .toString()
}
          color="text-red-700"
        />

        <Card
          title="Confidence"
          value={`${factoryHealth.overallHealth}%`}
          color="text-green-700"
        />

        <Card
          title="Potential Saving"
          value={`$${totalSaving.toLocaleString()}`}
          color="text-purple-700"
        />

      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Executive Summary
        </h2>

        <p className="mt-4 text-gray-700">
  AI has generated{" "}
  <strong>{executiveAlerts.length}</strong>{" "}
  executive recommendations.

  Factory health is currently{" "}
  <strong>{factoryHealth.overallHealth}%</strong>.

  Production efficiency is{" "}
  <strong>{productionSummary.efficiency}%</strong>.

  The highest priorities remain machine recovery,
  shipment readiness and bottleneck elimination.
</p>

      </section>

      <div className="grid gap-6">

        {decisions.map((item) => (

          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5 flex flex-wrap items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-blue-700">
                  {item.title}
                </h2>

                <p className="text-gray-600">
                  {item.department}
                </p>

              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${priorityClass(
                  item.priority
                )}`}
              >
                {item.priority}
              </span>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <Metric
                title="Business Benefit"
                value={item.expectedBenefit}
              />

              <Metric
                title="Confidence"
                value={`${item.confidence}%`}
              />

              <Metric
                title="Estimated Saving"
                value={`$${item.estimatedSaving.toLocaleString()}`}
              />

            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-5">

              <p className="font-semibold text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-3 text-gray-700">
                {item.decision}
              </p>

            </div>

            <div className="mt-6 flex gap-4">

              <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
                ✓ Approve
              </button>

              <button className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
                ✕ Reject
              </button>

              <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                View Details
              </button>

            </div>

          </section>

        ))}

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
      <p className="text-sm text-gray-500">
        {title}
      </p>

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
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-xl font-bold">
        {value}
      </h3>
    </div>
  );
}