"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type Operator = {
  id: string;
  operatorCode: string;
  name: string;
  department: string;
  line: string;
  grade: string;
  joiningDate: string;
  bestOperation: string;
  weakestOperation: string;
  multiSkillScore: number;
  averageEfficiency: number;
  bestEfficiency: number;
  averageDhu: number;
  attendanceRate: number;
  absenteeismRisk: RiskLevel;
  fatigueRisk: RiskLevel;
  promotionReadiness: RiskLevel;
  bottleneckSuitability: RiskLevel;
  aiRecommendation: string;
};

const operators: Operator[] = [
  {
    id: "1",
    operatorCode: "OPR-142",
    name: "Nusrat Akter",
    department: "Sewing",
    line: "L-001",
    grade: "A",
    joiningDate: "2021-03-12",
    bestOperation: "Collar Attach",
    weakestOperation: "Sleeve Attach",
    multiSkillScore: 86,
    averageEfficiency: 84,
    bestEfficiency: 92,
    averageDhu: 1.8,
    attendanceRate: 96,
    absenteeismRisk: "LOW",
    fatigueRisk: "LOW",
    promotionReadiness: "HIGH",
    bottleneckSuitability: "HIGH",
    aiRecommendation:
      "Use as key operator for collar attach and train two backup operators.",
  },
  {
    id: "2",
    operatorCode: "OPR-188",
    name: "Rina Begum",
    department: "Sewing",
    line: "L-002",
    grade: "B",
    joiningDate: "2022-08-01",
    bestOperation: "Shoulder Join",
    weakestOperation: "Neck Rib Attach",
    multiSkillScore: 64,
    averageEfficiency: 72,
    bestEfficiency: 81,
    averageDhu: 3.2,
    attendanceRate: 91,
    absenteeismRisk: "MEDIUM",
    fatigueRisk: "MEDIUM",
    promotionReadiness: "MEDIUM",
    bottleneckSuitability: "MEDIUM",
    aiRecommendation:
      "Provide targeted training on neck rib attach before assigning to fashion T-shirt styles.",
  },
  {
    id: "3",
    operatorCode: "OPR-219",
    name: "Shamima Khatun",
    department: "Sewing",
    line: "L-001",
    grade: "C",
    joiningDate: "2024-01-15",
    bestOperation: "Shoulder Join",
    weakestOperation: "Collar Attach",
    multiSkillScore: 42,
    averageEfficiency: 58,
    bestEfficiency: 67,
    averageDhu: 5.4,
    attendanceRate: 88,
    absenteeismRisk: "HIGH",
    fatigueRisk: "MEDIUM",
    promotionReadiness: "LOW",
    bottleneckSuitability: "LOW",
    aiRecommendation:
      "Do not assign to critical operations yet. Continue basic operation training and close supervision.",
  },
];

function badgeClass(level: RiskLevel) {
  if (level === "LOW") {
    return "bg-green-100 text-green-700";
  }

  if (level === "MEDIUM") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

function positiveBadgeClass(level: RiskLevel) {
  if (level === "HIGH") {
    return "bg-green-100 text-green-700";
  }

  if (level === "MEDIUM") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function OperatorIntelligencePage() {
  const totalOperators = operators.length;

  const averageEfficiency =
    operators.reduce(
      (sum, operator) => sum + operator.averageEfficiency,
      0
    ) / operators.length;

  const averageAttendance =
    operators.reduce(
      (sum, operator) => sum + operator.attendanceRate,
      0
    ) / operators.length;

  const highBottleneckOperators = operators.filter(
    (operator) => operator.bottleneckSuitability === "HIGH"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Operator Intelligence Centre
          </h1>

          <p className="mt-2 text-gray-600">
            AI-ready operator skill, productivity, attendance and training
            intelligence for line balancing and bottleneck control.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + Add Operator
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Operators</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {totalOperators}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Avg Efficiency</p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {averageEfficiency.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Avg Attendance</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {averageAttendance.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Bottleneck Ready</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {highBottleneckOperators}
          </h2>
        </div>
      </div>

      <div className="grid gap-6">
        {operators.map((operator) => (
          <section
            key={operator.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {operator.operatorCode} — {operator.name}
                </h2>

                <p className="text-gray-600">
                  {operator.department} · {operator.line} · Grade{" "}
                  {operator.grade}
                </p>

                <p className="text-sm text-gray-500">
                  Joined: {operator.joiningDate}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${positiveBadgeClass(
                  operator.bottleneckSuitability
                )}`}
              >
                {operator.bottleneckSuitability} BOTTLENECK SUITABILITY
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Multi Skill</p>
                <h3 className="text-xl font-bold">
                  {operator.multiSkillScore}%
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Avg Efficiency</p>
                <h3 className="text-xl font-bold">
                  {operator.averageEfficiency}%
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Best Efficiency</p>
                <h3 className="text-xl font-bold">
                  {operator.bestEfficiency}%
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Avg DHU</p>
                <h3 className="text-xl font-bold">
                  {operator.averageDhu}%
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Attendance</p>
                <h3 className="text-xl font-bold">
                  {operator.attendanceRate}%
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Best Operation
                </p>
                <p className="mt-2 font-bold text-green-700">
                  {operator.bestOperation}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Weakest Operation
                </p>
                <p className="mt-2 font-bold text-red-700">
                  {operator.weakestOperation}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Absenteeism Risk
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                    operator.absenteeismRisk
                  )}`}
                >
                  {operator.absenteeismRisk}
                </span>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Fatigue Risk
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                    operator.fatigueRisk
                  )}`}
                >
                  {operator.fatigueRisk}
                </span>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Promotion Readiness
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${positiveBadgeClass(
                    operator.promotionReadiness
                  )}`}
                >
                  {operator.promotionReadiness}
                </span>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  AI Recommendation
                </p>
                <p className="mt-2 text-gray-700">
                  {operator.aiRecommendation}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}