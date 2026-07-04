"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type PlanningScenario = {
  id: string;
  styleNo: string;
  buyer: string;
  orderQty: number;
  recommendedLine: string;
  secondBestLine: string;
  expectedEfficiency: number;
  dailyCapacity: number;
  estimatedDays: number;
  shipmentConfidence: number;
  bottleneckForecast: string;
  overtimeRequired: boolean;
  qualityRisk: RiskLevel;
  shipmentRisk: RiskLevel;
  aiRecommendation: string;
};

const scenarios: PlanningScenario[] = [
  {
    id: "1",
    styleNo: "HNM-POLO-2401",
    buyer: "H&M",
    orderQty: 25000,
    recommendedLine: "L-002",
    secondBestLine: "L-001",
    expectedEfficiency: 81,
    dailyCapacity: 4200,
    estimatedDays: 6,
    shipmentConfidence: 97,
    bottleneckForecast: "Collar Attach",
    overtimeRequired: false,
    qualityRisk: "LOW",
    shipmentRisk: "LOW",
    aiRecommendation:
      "Allocate to L-002. This line has stronger collar operators and lower bottleneck probability.",
  },
  {
    id: "2",
    styleNo: "PRM-HOOD-3307",
    buyer: "Primark",
    orderQty: 12000,
    recommendedLine: "L-001",
    secondBestLine: "L-003",
    expectedEfficiency: 68,
    dailyCapacity: 1850,
    estimatedDays: 7,
    shipmentConfidence: 84,
    bottleneckForecast: "Hood Attach",
    overtimeRequired: true,
    qualityRisk: "MEDIUM",
    shipmentRisk: "MEDIUM",
    aiRecommendation:
      "Run pilot before bulk. Assign senior supervisor and arrange overtime on Day 5 if efficiency stays below 65%.",
  },
  {
    id: "3",
    styleNo: "ZRA-TEE-1188",
    buyer: "Zara",
    orderQty: 18000,
    recommendedLine: "L-003",
    secondBestLine: "L-002",
    expectedEfficiency: 78,
    dailyCapacity: 3600,
    estimatedDays: 5,
    shipmentConfidence: 93,
    bottleneckForecast: "Neck Rib Attach",
    overtimeRequired: false,
    qualityRisk: "LOW",
    shipmentRisk: "LOW",
    aiRecommendation:
      "Allocate to L-003 with one backup rib attach operator ready during first production day.",
  },
];

function riskBadgeClass(risk: RiskLevel) {
  if (risk === "LOW") {
    return "bg-green-100 text-green-700";
  }

  if (risk === "MEDIUM") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function ProductionPlanningPage() {
  const totalOrderQty = scenarios.reduce(
    (sum, scenario) => sum + scenario.orderQty,
    0
  );

  const averageEfficiency =
    scenarios.reduce(
      (sum, scenario) => sum + scenario.expectedEfficiency,
      0
    ) / scenarios.length;

  const averageShipmentConfidence =
    scenarios.reduce(
      (sum, scenario) => sum + scenario.shipmentConfidence,
      0
    ) / scenarios.length;

  const overtimeStyles = scenarios.filter(
    (scenario) => scenario.overtimeRequired
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            AI Production Planning Centre
          </h1>

          <p className="mt-2 text-gray-600">
            AI recommends best line allocation, capacity plan, bottleneck
            forecast and shipment confidence.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + New Plan
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Planned Quantity</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {totalOrderQty.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Avg Efficiency</p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {averageEfficiency.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Shipment Confidence
          </p>
          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {averageShipmentConfidence.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Overtime Required
          </p>
          <h2 className="mt-2 text-3xl font-bold text-orange-700">
            {overtimeStyles}
          </h2>
        </div>
      </div>

      <div className="grid gap-6">
        {scenarios.map((scenario) => (
          <section
            key={scenario.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {scenario.styleNo}
                </h2>

                <p className="text-gray-600">
                  {scenario.buyer} · Order Qty:{" "}
                  {scenario.orderQty.toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskBadgeClass(
                  scenario.shipmentRisk
                )}`}
              >
                {scenario.shipmentRisk} SHIPMENT RISK
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Recommended Line
                </p>
                <h3 className="text-xl font-bold">
                  {scenario.recommendedLine}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Expected Efficiency
                </p>
                <h3 className="text-xl font-bold">
                  {scenario.expectedEfficiency}%
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Daily Capacity
                </p>
                <h3 className="text-xl font-bold">
                  {scenario.dailyCapacity.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Est. Days
                </p>
                <h3 className="text-xl font-bold">
                  {scenario.estimatedDays}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Confidence
                </p>
                <h3 className="text-xl font-bold">
                  {scenario.shipmentConfidence}%
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Second Best Line
                </p>
                <p className="mt-2 font-bold">
                  {scenario.secondBestLine}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Bottleneck Forecast
                </p>
                <p className="mt-2 font-bold text-red-700">
                  {scenario.bottleneckForecast}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Quality Risk
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${riskBadgeClass(
                    scenario.qualityRisk
                  )}`}
                >
                  {scenario.qualityRisk}
                </span>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Overtime Required
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    scenario.overtimeRequired
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {scenario.overtimeRequired ? "YES" : "NO"}
                </span>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 md:col-span-2">
                <p className="text-sm font-semibold text-blue-700">
                  AI Planning Recommendation
                </p>

                <p className="mt-2 text-gray-700">
                  {scenario.aiRecommendation}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}