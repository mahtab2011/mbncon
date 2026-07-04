"use client";

type LineOptimization = {
  id: string;
  line: string;
  style: string;
  currentEfficiency: number;
  optimizedEfficiency: number;
  expectedOutputGain: number;
  overtimeReduction: number;
  shipmentConfidence: number;
  bottleneck: string;
  recommendation1: string;
  recommendation2: string;
  recommendation3: string;
};

const optimizations: LineOptimization[] = [
  {
    id: "1",
    line: "L-001",
    style: "PRM-HOOD-3307",
    currentEfficiency: 71,
    optimizedEfficiency: 83,
    expectedOutputGain: 520,
    overtimeReduction: 1.6,
    shipmentConfidence: 97,
    bottleneck: "Hood Attach",
    recommendation1:
      "Move OPR-142 to Hood Attach operation.",
    recommendation2:
      "Replace MC-014 with standby machine MC-021.",
    recommendation3:
      "Reduce WIP before Hood Attach from 40 to 20 pieces.",
  },
  {
    id: "2",
    line: "L-002",
    style: "HNM-POLO-2401",
    currentEfficiency: 76,
    optimizedEfficiency: 86,
    expectedOutputGain: 470,
    overtimeReduction: 1.2,
    shipmentConfidence: 99,
    bottleneck: "Collar Attach",
    recommendation1:
      "Assign backup collar operator during peak hours.",
    recommendation2:
      "Balance feeding between Collar Attach and Sleeve Join.",
    recommendation3:
      "Monitor first-hour output every 15 minutes.",
  },
  {
    id: "3",
    line: "L-003",
    style: "ZRA-TEE-1188",
    currentEfficiency: 80,
    optimizedEfficiency: 88,
    expectedOutputGain: 390,
    overtimeReduction: 0.8,
    shipmentConfidence: 98,
    bottleneck: "Neck Rib Attach",
    recommendation1:
      "Add one trained neck rib operator.",
    recommendation2:
      "Reduce bundle size from 20 to 10 pieces.",
    recommendation3:
      "Increase inline quality checking frequency.",
  },
];

export default function LineOptimizationPage() {
  const avgCurrent =
    optimizations.reduce(
      (sum, item) => sum + item.currentEfficiency,
      0
    ) / optimizations.length;

  const avgOptimized =
    optimizations.reduce(
      (sum, item) => sum + item.optimizedEfficiency,
      0
    ) / optimizations.length;

  const totalGain = optimizations.reduce(
    (sum, item) => sum + item.expectedOutputGain,
    0
  );

  const avgShipment =
    optimizations.reduce(
      (sum, item) => sum + item.shipmentConfidence,
      0
    ) / optimizations.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Line Optimization Engine
        </h1>

        <p className="mt-2 text-gray-600">
          AI optimizes operators, machines, bottlenecks,
          workload and production flow to maximize line efficiency.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Current Efficiency
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-700">
            {avgCurrent.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Optimized Efficiency
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {avgOptimized.toFixed(1)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Total Output Gain
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {totalGain.toLocaleString()} pcs
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Shipment Confidence
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {avgShipment.toFixed(1)}%
          </h2>
        </div>

      </div>

      <div className="grid gap-6">

        {optimizations.map((line) => (

          <section
            key={line.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5 flex flex-wrap items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-blue-700">
                  {line.line}
                </h2>

                <p className="text-gray-600">
                  Style : {line.style}
                </p>

              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                +{line.optimizedEfficiency - line.currentEfficiency}% Improvement
              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-5">

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Current
                </p>

                <h3 className="text-xl font-bold">
                  {line.currentEfficiency}%
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Optimized
                </p>

                <h3 className="text-xl font-bold text-green-700">
                  {line.optimizedEfficiency}%
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Output Gain
                </p>

                <h3 className="text-xl font-bold">
                  +{line.expectedOutputGain}
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  OT Reduction
                </p>

                <h3 className="text-xl font-bold">
                  {line.overtimeReduction} hrs
                </h3>

              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-gray-500">
                  Shipment
                </p>

                <h3 className="text-xl font-bold">
                  {line.shipmentConfidence}%
                </h3>

              </div>

            </div>

            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-semibold text-red-700">
                Primary Bottleneck
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {line.bottleneck}
              </h3>

            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-5">

              <h3 className="font-bold text-blue-700">
                AI Optimization Plan
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li>{line.recommendation1}</li>
                <li>{line.recommendation2}</li>
                <li>{line.recommendation3}</li>
              </ul>

            </div>

          </section>

        ))}

      </div>

      <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-6">

        <h2 className="text-2xl font-bold text-green-700">
          Executive AI Summary
        </h2>

        <p className="mt-4 text-gray-700">
          AI predicts that implementing the recommended operator,
          machine and workflow changes can increase average line
          efficiency from <strong>{avgCurrent.toFixed(1)}%</strong> to{" "}
          <strong>{avgOptimized.toFixed(1)}%</strong>, resulting in an
          estimated additional production of{" "}
          <strong>{totalGain.toLocaleString()} pieces</strong> while
          reducing overtime and improving shipment reliability.
        </p>

      </div>

    </main>
  );
}