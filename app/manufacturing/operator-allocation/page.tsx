"use client";

type Allocation = {
  id: string;
  operation: string;
  recommendedOperator: string;
  backupOperator: string;
  confidence: number;
  expectedEfficiency: number;
  expectedDhu: number;
  line: string;
  style: string;
  reason: string;
};

const allocations: Allocation[] = [
  {
    id: "1",
    operation: "Collar Attach",
    recommendedOperator: "OPR-142",
    backupOperator: "OPR-188",
    confidence: 98,
    expectedEfficiency: 88,
    expectedDhu: 1.8,
    line: "L-002",
    style: "HNM-POLO-2401",
    reason:
      "Highest historical efficiency with lowest DHU on collar operations.",
  },
  {
    id: "2",
    operation: "Sleeve Attach",
    recommendedOperator: "OPR-188",
    backupOperator: "OPR-219",
    confidence: 91,
    expectedEfficiency: 81,
    expectedDhu: 2.6,
    line: "L-001",
    style: "PRM-HOOD-3307",
    reason:
      "Balanced productivity and quality with moderate learning requirement.",
  },
  {
    id: "3",
    operation: "Shoulder Join",
    recommendedOperator: "OPR-219",
    backupOperator: "OPR-142",
    confidence: 87,
    expectedEfficiency: 76,
    expectedDhu: 2.1,
    line: "L-003",
    style: "ZRA-TEE-1188",
    reason:
      "Suitable operation for current competency level and style complexity.",
  },
];

export default function OperatorAllocationPage() {
  const averageConfidence =
    allocations.reduce(
      (sum, item) => sum + item.confidence,
      0
    ) / allocations.length;

  const averageEfficiency =
    allocations.reduce(
      (sum, item) => sum + item.expectedEfficiency,
      0
    ) / allocations.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Operator Allocation Engine
        </h1>

        <p className="mt-2 text-gray-600">
          AI automatically recommends the best operator for every operation
          based on historical performance, skill, efficiency and quality.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Planned Operations
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {allocations.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Avg Confidence
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {averageConfidence.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Expected Efficiency
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {averageEfficiency.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            AI Status
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            READY
          </h2>
        </div>
      </div>

      <div className="grid gap-6">
        {allocations.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.operation}
                </h2>

                <p className="text-gray-600">
                  Style: {item.style} | Line: {item.line}
                </p>
              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                {item.confidence}% Confidence
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Recommended
                </p>

                <h3 className="text-xl font-bold">
                  {item.recommendedOperator}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Backup
                </p>

                <h3 className="text-xl font-bold">
                  {item.backupOperator}
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Expected Efficiency
                </p>

                <h3 className="text-xl font-bold">
                  {item.expectedEfficiency}%
                </h3>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Expected DHU
                </p>

                <h3 className="text-xl font-bold">
                  {item.expectedDhu}%
                </h3>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                AI Allocation Reason
              </p>

              <p className="mt-2 text-gray-700">
                {item.reason}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}