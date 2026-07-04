"use client";

type Difficulty = "LOW" | "MEDIUM" | "HIGH";

type Operation = {
  id: string;
  operationCode: string;
  sequence: number;
  operationName: string;
  banglaName: string;
  machine: string;
  sam: number;
  smv: number;
  targetPerHour: number;
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  difficulty: Difficulty;
  critical: boolean;
  bottleneckProbability: number;
  learningDays: number;
  inlineQc: boolean;
  safetyRisk: "LOW" | "MEDIUM" | "HIGH";
  commonDefect: string;
  aiRecommendation: string;
};

const operations: Operation[] = [
  {
    id: "1",
    operationCode: "OP-001",
    sequence: 10,
    operationName: "Shoulder Join",
    banglaName: "শোল্ডার জয়েন",
    machine: "4 Thread Overlock",
    sam: 0.42,
    smv: 0.42,
    targetPerHour: 143,
    skillLevel: "BEGINNER",
    difficulty: "LOW",
    critical: false,
    bottleneckProbability: 12,
    learningDays: 1,
    inlineQc: false,
    safetyRisk: "LOW",
    commonDefect: "Open seam",
    aiRecommendation:
      "Suitable for newly trained operators.",
  },
  {
    id: "2",
    operationCode: "OP-015",
    sequence: 30,
    operationName: "Collar Attach",
    banglaName: "কলার সংযোজন",
    machine: "SNLS",
    sam: 0.82,
    smv: 0.82,
    targetPerHour: 73,
    skillLevel: "EXPERT",
    difficulty: "HIGH",
    critical: true,
    bottleneckProbability: 84,
    learningDays: 4,
    inlineQc: true,
    safetyRisk: "LOW",
    commonDefect: "Twisted Collar",
    aiRecommendation:
      "Assign experienced operators and reduce bundle size to 10 pieces.",
  },
  {
    id: "3",
    operationCode: "OP-024",
    sequence: 45,
    operationName: "Sleeve Attach",
    banglaName: "স্লিভ সংযোজন",
    machine: "Overlock",
    sam: 0.74,
    smv: 0.74,
    targetPerHour: 81,
    skillLevel: "INTERMEDIATE",
    difficulty: "MEDIUM",
    critical: true,
    bottleneckProbability: 58,
    learningDays: 2,
    inlineQc: true,
    safetyRisk: "LOW",
    commonDefect: "Uneven sleeve",
    aiRecommendation:
      "Monitor first-hour output and provide inline coaching.",
  },
];

function badgeColor(level: Difficulty) {
  switch (level) {
    case "LOW":
      return "bg-green-100 text-green-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function OperationBulletinMasterPage() {
  const averageSam =
    operations.reduce((sum, op) => sum + op.sam, 0) /
    operations.length;

  const criticalOperations = operations.filter(
    (op) => op.critical
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            AI Operation Bulletin Master
          </h1>

          <p className="mt-2 text-gray-600">
            Central operation knowledge base for SMV, SAM, AI productivity,
            bottleneck prediction and training.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + Add Operation
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Operations</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {operations.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Average SAM</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {averageSam.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Critical Operations
          </p>
          <h2 className="mt-2 text-3xl font-bold text-red-700">
            {criticalOperations}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            AI Knowledge Base
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            Ready
          </h2>
        </div>
      </div>

      <div className="grid gap-6">
        {operations.map((operation) => (
          <div
            key={operation.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {operation.operationCode} — {operation.operationName}
                </h2>

                <p className="text-gray-500">
                  {operation.banglaName}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${badgeColor(
                  operation.difficulty
                )}`}
              >
                {operation.difficulty}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Machine</p>
                <h3 className="font-bold">{operation.machine}</h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">SAM</p>
                <h3 className="font-bold">{operation.sam}</h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Target / Hour
                </p>
                <h3 className="font-bold">
                  {operation.targetPerHour}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Skill Level
                </p>
                <h3 className="font-bold">
                  {operation.skillLevel}
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Bottleneck Probability
                </p>

                <h3 className="mt-2 text-xl font-bold text-red-700">
                  {operation.bottleneckProbability}%
                </h3>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Expected Learning Time
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {operation.learningDays} Days
                </h3>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Common Defect
                </p>

                <h3 className="mt-2 font-bold">
                  {operation.commonDefect}
                </h3>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  AI Recommendation
                </p>

                <p className="mt-2 text-gray-700">
                  {operation.aiRecommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}