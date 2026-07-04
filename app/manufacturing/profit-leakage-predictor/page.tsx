"use client";
import {
  productionSummary,
  factoryHealth,
  executiveAlerts,
} from "@/lib/manufacturing/manufacturingData";


type LeakageRisk = "LOW" | "MEDIUM" | "HIGH";

type LeakageItem = {
  id: string;
  category: string;
  leakageAmount: number;
  risk: LeakageRisk;
  rootCause: string;
  aiRecommendation: string;
};

const leakageItems: LeakageItem[] = [
  {
    id: "1",
    category: "Low Efficiency",
    leakageAmount: 6830,
    risk: "HIGH",
    rootCause: "Line L-003 is operating below target due to bottleneck and manpower imbalance.",
    aiRecommendation:
      "Rebalance operators, reduce WIP before sewing, and move one skilled operator to Line L-003.",
  },
  {
    id: "2",
    category: "Machine Downtime",
    leakageAmount: 4250,
    risk: "HIGH",
    rootCause: "MC-014 breakdown caused 75 minutes of lost production time.",
    aiRecommendation:
      "Complete preventive overhaul and replace high-risk spare parts before next shift.",
  },
  {
    id: "3",
    category: "High DHU / Rework",
    leakageAmount: 2640,
    risk: "MEDIUM",
    rootCause: "Collar puckering and skip stitch increased rework on Line L-003.",
    aiRecommendation:
      "Increase inline inspection and retrain operators on critical operations.",
  },
  {
    id: "4",
    category: "Material Waste",
    leakageAmount: 1480,
    risk: "MEDIUM",
    rootCause: "Hood fabric shortage and inefficient material issue created avoidable waste.",
    aiRecommendation:
      "Improve material reconciliation and issue next batch before balance reaches critical level.",
  },
  {
    id: "5",
    category: "Overtime",
    leakageAmount: 3210,
    risk: "MEDIUM",
    rootCause: "Overtime increased to recover lost output from low-efficiency lines.",
    aiRecommendation:
      "Recover output during regular hours through line optimization before approving overtime.",
  },
  {
    id: "6",
    category: "Shipment Risk",
    leakageAmount: 5950,
    risk: "HIGH",
    rootCause: "SHP-PRM-3307 has high delay probability and possible buyer penalty exposure.",
    aiRecommendation:
      "Escalate shipment recovery plan to executive level immediately.",
  },
];

function riskClass(risk: LeakageRisk) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function ProfitLeakagePredictorPage() {
  const totalLeakage = leakageItems.reduce(
    (sum, item) => sum + item.leakageAmount,
    0
  );

  const highRiskItems = leakageItems.filter(
    (item) => item.risk === "HIGH"
  ).length;

  const monthlyProjection = totalLeakage * 22;

  const topLeakage = leakageItems.reduce((top, item) =>
    item.leakageAmount > top.leakageAmount ? item : top
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Profit Leakage Predictor
        </h1>

        <p className="mt-2 text-gray-600">
          Predicts hidden operational profit leakage from efficiency loss,
          rework, downtime, overtime, material waste and shipment risk.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card
          title="Today Leakage"
          value={`$${(
  (100 - productionSummary.efficiency) * 350
).toLocaleString()}`}
          color="text-red-700"
        />

        <Card
  title="Monthly Projection"
  value={`$${(
    ((100 - productionSummary.efficiency) * 350) * 22
  ).toLocaleString()}`}
  color="text-orange-700"
/>

        <Card
          title="High Risk Drivers"
value={executiveAlerts.length.toString()}
          color="text-red-700"
        />

        <Card
          title="Top Leakage"
          value={topLeakage.category}
          color="text-blue-700"
        />
      </div>

      <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-2xl font-bold text-red-700">
          Executive Leakage Summary
        </h2>

        <p className="mt-4 text-gray-700">
  AI estimates today's hidden profit leakage primarily from reduced
  production efficiency, machine availability and shipment risk.

  Factory health is currently{" "}
  <strong>{factoryHealth.overallHealth}%</strong>.

  Current efficiency is{" "}
  <strong>{productionSummary.efficiency}%</strong>.

  AI is monitoring{" "}
  <strong>{executiveAlerts.length}</strong> executive alerts that
  could influence today's profitability.
</p>
      </section>

      <div className="grid gap-6">
        {leakageItems.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.category}
                </h2>

                <p className="text-gray-600">
                  Estimated Leakage:{" "}
                  <strong>${item.leakageAmount.toLocaleString()}</strong>
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  AI Root Cause
                </p>

                <p className="mt-2 text-gray-700">
                  {item.rootCause}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  AI Recovery Recommendation
                </p>

                <p className="mt-2 text-gray-700">
                  {item.aiRecommendation}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-700">
          AI Savings Opportunity
        </h2>

        <p className="mt-4 text-gray-700">
  Based on the current factory efficiency of{" "}
  <strong>{productionSummary.efficiency}%</strong>, AI estimates that
  improving efficiency by only 5 percentage points could recover
  approximately{" "}
  <strong>
    ${((100 - productionSummary.efficiency) * 200).toLocaleString()}
  </strong>{" "}
  per day. Combined with reductions in downtime, rework and shipment
  risk, the projected monthly savings opportunity exceeds{" "}
  <strong>
    ${(
      ((100 - productionSummary.efficiency) * 200) * 22
    ).toLocaleString()}
  </strong>.
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

function Card({ title, value, color }: CardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`mt-2 text-2xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}