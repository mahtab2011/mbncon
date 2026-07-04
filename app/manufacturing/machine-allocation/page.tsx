"use client";

type MachineAllocation = {
  id: string;
  operation: string;
  machineNo: string;
  machineType: string;
  line: string;
  style: string;
  confidence: number;
  expectedOee: number;
  remainingLifeMonths: number;
  setupTimeMinutes: number;
  changeoverMinutes: number;
  reason: string;
};

const allocations: MachineAllocation[] = [
  {
    id: "1",
    operation: "Collar Attach",
    machineNo: "MC-014",
    machineType: "Single Needle Lock Stitch",
    line: "L-002",
    style: "HNM-POLO-2401",
    confidence: 96,
    expectedOee: 89,
    remainingLifeMonths: 14,
    setupTimeMinutes: 18,
    changeoverMinutes: 12,
    reason:
      "Highest stitch consistency for collar operation with current fabric.",
  },
  {
    id: "2",
    operation: "Sleeve Attach",
    machineNo: "MC-027",
    machineType: "Overlock",
    line: "L-001",
    style: "PRM-HOOD-3307",
    confidence: 92,
    expectedOee: 84,
    remainingLifeMonths: 30,
    setupTimeMinutes: 12,
    changeoverMinutes: 9,
    reason:
      "Machine has stable overlock quality and acceptable maintenance history.",
  },
  {
    id: "3",
    operation: "Shoulder Join",
    machineNo: "MC-005",
    machineType: "4 Thread Overlock",
    line: "L-003",
    style: "ZRA-TEE-1188",
    confidence: 94,
    expectedOee: 91,
    remainingLifeMonths: 42,
    setupTimeMinutes: 10,
    changeoverMinutes: 6,
    reason:
      "Fast setup with excellent productivity for knit shoulder joining.",
  },
];

export default function MachineAllocationPage() {
  const avgConfidence =
    allocations.reduce(
      (sum, item) => sum + item.confidence,
      0
    ) / allocations.length;

  const avgOee =
    allocations.reduce(
      (sum, item) => sum + item.expectedOee,
      0
    ) / allocations.length;

  const avgSetup =
    allocations.reduce(
      (sum, item) => sum + item.setupTimeMinutes,
      0
    ) / allocations.length;

  const avgChangeover =
    allocations.reduce(
      (sum, item) => sum + item.changeoverMinutes,
      0
    ) / allocations.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Machine Allocation Engine
        </h1>

        <p className="mt-2 text-gray-600">
          AI recommends the most suitable machine based on OEE,
          maintenance history, setup time, changeover time,
          remaining useful life and machine capability.
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
            {avgConfidence.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Expected OEE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {avgOee.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Avg Setup Time
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-700">
            {avgSetup.toFixed(0)} min
          </h2>

        </div>

      </div>

      <div className="grid gap-6">

        {allocations.map((machine) => (

          <section
            key={machine.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5 flex flex-wrap items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-blue-700">
                  {machine.operation}
                </h2>

                <p className="text-gray-600">
                  Style : {machine.style} | Line : {machine.line}
                </p>

              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                {machine.confidence}% Confidence
              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-5">

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Machine
                </p>

                <h3 className="font-bold">
                  {machine.machineNo}
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Type
                </p>

                <h3 className="font-bold">
                  {machine.machineType}
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Expected OEE
                </p>

                <h3 className="font-bold">
                  {machine.expectedOee}%
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Setup
                </p>

                <h3 className="font-bold">
                  {machine.setupTimeMinutes} min
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Changeover
                </p>

                <h3 className="font-bold">
                  {machine.changeoverMinutes} min
                </h3>

              </div>

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-lg border p-4">

                <p className="text-sm font-semibold text-gray-500">
                  Remaining Useful Life
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {machine.remainingLifeMonths} Months
                </h3>

              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

                <p className="text-sm font-semibold text-blue-700">
                  AI Recommendation
                </p>

                <p className="mt-2 text-gray-700">
                  {machine.reason}
                </p>

              </div>

            </div>

          </section>

        ))}

      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Summary
        </h2>

        <p className="mt-4 text-gray-700">
          Average machine confidence is{" "}
          <strong>{avgConfidence.toFixed(1)}%</strong>.
          Average expected OEE is{" "}
          <strong>{avgOee.toFixed(1)}%</strong>.
          Average setup time is{" "}
          <strong>{avgSetup.toFixed(0)} minutes</strong>,
          while average changeover time is{" "}
          <strong>{avgChangeover.toFixed(0)} minutes</strong>.
          Current machine allocation supports the planned production with
          low operational risk.
        </p>

      </div>

    </main>
  );
}