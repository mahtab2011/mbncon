"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type SkillGap = {
  id: string;
  operation: string;
  requiredOperators: number;
  availableSkilledOperators: number;
  gap: number;
  risk: RiskLevel;
  affectedStyle: string;
  affectedLine: string;
  aiRecommendation: string;
};

const skillGaps: SkillGap[] = [
  {
    id: "1",
    operation: "Collar Attach",
    requiredOperators: 6,
    availableSkilledOperators: 4,
    gap: 2,
    risk: "HIGH",
    affectedStyle: "HNM-POLO-2401",
    affectedLine: "L-002",
    aiRecommendation:
      "Move OPR-142 to L-002 and train two backup operators before bulk input.",
  },
  {
    id: "2",
    operation: "Sleeve Attach",
    requiredOperators: 5,
    availableSkilledOperators: 4,
    gap: 1,
    risk: "MEDIUM",
    affectedStyle: "PRM-HOOD-3307",
    affectedLine: "L-001",
    aiRecommendation:
      "Assign one intermediate operator for first-day support and monitor hourly output.",
  },
  {
    id: "3",
    operation: "Shoulder Join",
    requiredOperators: 4,
    availableSkilledOperators: 6,
    gap: 0,
    risk: "LOW",
    affectedStyle: "ZRA-TEE-1188",
    affectedLine: "L-003",
    aiRecommendation:
      "Skill availability is sufficient. No immediate action required.",
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

export default function SkillGapEnginePage() {
  const totalGaps = skillGaps.reduce(
    (sum, item) => sum + item.gap,
    0
  );

  const highRiskGaps = skillGaps.filter(
    (item) => item.risk === "HIGH"
  ).length;

  const coveredOperations = skillGaps.filter(
    (item) => item.gap === 0
  ).length;

  const totalRequired = skillGaps.reduce(
    (sum, item) => sum + item.requiredOperators,
    0
  );

  const totalAvailable = skillGaps.reduce(
    (sum, item) => sum + item.availableSkilledOperators,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Skill Gap Engine
        </h1>

        <p className="mt-2 text-gray-600">
          AI compares required operation skills with available operator
          capability and recommends training or reassignment.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-5">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Required Operators</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {totalRequired}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Available Skilled</p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {totalAvailable}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total Skill Gap</p>
          <h2 className="mt-2 text-3xl font-bold text-red-700">
            {totalGaps}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">High Risk Gaps</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-700">
            {highRiskGaps}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Covered Operations</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {coveredOperations}
          </h2>
        </div>
      </div>

      <div className="grid gap-6">
        {skillGaps.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.operation}
                </h2>

                <p className="text-gray-600">
                  Style: {item.affectedStyle} · Line: {item.affectedLine}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskBadgeClass(
                  item.risk
                )}`}
              >
                {item.risk} SKILL RISK
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Required</p>
                <h3 className="text-xl font-bold">
                  {item.requiredOperators}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Available</p>
                <h3 className="text-xl font-bold">
                  {item.availableSkilledOperators}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Gap</p>
                <h3 className="text-xl font-bold text-red-700">
                  {item.gap}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Coverage</p>
                <h3 className="text-xl font-bold">
                  {Math.round(
                    (item.availableSkilledOperators /
                      item.requiredOperators) *
                      100
                  )}
                  %
                </h3>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-2 text-gray-700">
                {item.aiRecommendation}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}