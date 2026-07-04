"use client";

type Simulation = {
  id: string;
  scenario: string;
  action: string;
  currentEfficiency: number;
  simulatedEfficiency: number;
  outputGain: number;
  shipmentDaysSaved: number;
  overtimeReduction: number;
  confidence: number;
  aiConclusion: string;
};

const simulations: Simulation[] = [
  {
    id: "1",
    scenario: "Move HNM-POLO-2401 from L-001 to L-002",
    action: "Change Production Line",
    currentEfficiency: 76,
    simulatedEfficiency: 84,
    outputGain: 460,
    shipmentDaysSaved: 2,
    overtimeReduction: 10,
    confidence: 97,
    aiConclusion:
      "Recommended. Better operator skill mix and lower bottleneck probability.",
  },
  {
    id: "2",
    scenario: "Add 4 skilled Collar Attach operators",
    action: "Increase Skilled Manpower",
    currentEfficiency: 74,
    simulatedEfficiency: 86,
    outputGain: 620,
    shipmentDaysSaved: 1,
    overtimeReduction: 14,
    confidence: 96,
    aiConclusion:
      "Strongly recommended. Removes primary bottleneck and improves line balance.",
  },
  {
    id: "3",
    scenario: "Machine MC-014 unavailable",
    action: "Machine Failure Simulation",
    currentEfficiency: 82,
    simulatedEfficiency: 69,
    outputGain: -510,
    shipmentDaysSaved: -2,
    overtimeReduction: -8,
    confidence: 94,
    aiConclusion:
      "Replace immediately with standby MC-021 to minimize production loss.",
  },
];

export default function ProductionSimulationPage() {
  const avgCurrent =
    simulations.reduce(
      (sum, item) => sum + item.currentEfficiency,
      0
    ) / simulations.length;

  const avgSimulated =
    simulations.reduce(
      (sum, item) => sum + item.simulatedEfficiency,
      0
    ) / simulations.length;

  const totalGain = simulations.reduce(
    (sum, item) => sum + item.outputGain,
    0
  );

  const avgConfidence =
    simulations.reduce(
      (sum, item) => sum + item.confidence,
      0
    ) / simulations.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Production Simulation Engine
        </h1>

        <p className="mt-2 text-gray-600">
          Simulate production decisions before implementing them on the
          factory floor.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card
          title="Current Efficiency"
          value={`${avgCurrent.toFixed(1)}%`}
          color="text-orange-700"
        />

        <Card
          title="Simulated Efficiency"
          value={`${avgSimulated.toFixed(1)}%`}
          color="text-green-700"
        />

        <Card
          title="Net Output Impact"
          value={`${totalGain.toLocaleString()} pcs`}
          color="text-blue-700"
        />

        <Card
          title="AI Confidence"
          value={`${avgConfidence.toFixed(1)}%`}
          color="text-purple-700"
        />
      </div>

      <div className="grid gap-6">
        {simulations.map((item) => (
          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.scenario}
                </h2>

                <p className="text-gray-600">
                  {item.action}
                </p>
              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                {item.confidence}% Confidence
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-6">
              <Metric
                title="Current"
                value={`${item.currentEfficiency}%`}
              />

              <Metric
                title="Simulated"
                value={`${item.simulatedEfficiency}%`}
              />

              <Metric
                title="Output"
                value={`${item.outputGain} pcs`}
              />

              <Metric
                title="Days Saved"
                value={`${item.shipmentDaysSaved}`}
              />

              <Metric
                title="OT Change"
                value={`${item.overtimeReduction} hrs`}
              />

              <Metric
                title="Confidence"
                value={`${item.confidence}%`}
              />
            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-bold text-blue-700">
                AI Simulation Result
              </h3>

              <p className="mt-2 text-gray-700">
                {item.aiConclusion}
              </p>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-700">
          Executive AI Summary
        </h2>

        <p className="mt-4 text-gray-700">
          AI production simulation enables planners to evaluate operational
          changes before implementation. By comparing current and simulated
          performance, management can identify the best combination of
          production line, operators and machines while minimizing shipment
          risk and unnecessary overtime.
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