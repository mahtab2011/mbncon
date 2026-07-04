"use client";
import {
  productionSummary,
  factoryHealth,
} from "@/lib/manufacturing/manufacturingData";

type FactoryLine = {
  id: string;
  line: string;
  style: string;
  efficiency: number;
  status: "RUNNING" | "WARNING" | "STOPPED";
  bottleneck: string;
  output: number;
};

const lines: FactoryLine[] = [
  {
    id: "1",
    line: "L-001",
    style: "PRM-HOOD-3307",
    efficiency: 84,
    status: "RUNNING",
    bottleneck: "None",
    output: 4150,
  },
  {
    id: "2",
    line: "L-002",
    style: "HNM-POLO-2401",
    efficiency: 73,
    status: "WARNING",
    bottleneck: "Collar Attach",
    output: 3620,
  },
  {
    id: "3",
    line: "L-003",
    style: "ZRA-TEE-1188",
    efficiency: 61,
    status: "STOPPED",
    bottleneck: "Machine Breakdown",
    output: 2480,
  },
  {
    id: "4",
    line: "L-004",
    style: "Basic Polo",
    efficiency: 91,
    status: "RUNNING",
    bottleneck: "None",
    output: 4620,
  },
];

function statusColor(status: FactoryLine["status"]) {
  switch (status) {
    case "RUNNING":
      return "bg-green-100 text-green-700";
    case "WARNING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function DigitalFactoryTwinPage() {
  const totalOutput = lines.reduce(
    (sum, line) => sum + line.output,
    0
  );

  const averageEfficiency =
    lines.reduce(
      (sum, line) => sum + line.efficiency,
      0
    ) / lines.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Digital Factory Twin
        </h1>

        <p className="mt-2 text-gray-600">
          Live digital representation of the factory with AI-powered
          production visibility.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <DashboardCard
          title="Factory Health"
          value={`${factoryHealth.overallHealth}%`}
          color="text-green-700"
        />

        <DashboardCard
          title="Average Efficiency"
          value={`${productionSummary.efficiency}%`}
          color="text-blue-700"
        />

        <DashboardCard
          title="Today's Output"
          value={`${productionSummary.shipmentReadiness}%`}
          color="text-purple-700"
        />

        <DashboardCard
          title="Shipment Confidence"
          value={`${productionSummary.shipmentReadiness}%`}
          color="text-orange-700"
        />

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {lines.map((line) => (

          <div
            key={line.id}
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
          >

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-blue-700">
                {line.line}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor(
                  line.status
                )}`}
              >
                {line.status}
              </span>

            </div>

            <p className="text-gray-600">
              Style
            </p>

            <h3 className="mb-4 font-semibold">
              {line.style}
            </h3>

            <div className="space-y-3">

              <Info
                title="Efficiency"
                value={`${line.efficiency}%`}
              />

              <Info
                title="Today's Output"
                value={`${line.output.toLocaleString()} pcs`}
              />

              <Info
                title="Bottleneck"
                value={line.bottleneck}
              />

            </div>

            <button className="mt-6 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
              View Line Details
            </button>

          </div>

        ))}

      </div>

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Factory Summary
        </h2>

        <p className="mt-4 text-gray-700">
          The digital factory twin continuously combines production,
          operators, machines, quality and planning into one live
          operational model. Currently one line requires immediate
          attention due to a machine-related stoppage, while the
          remaining lines are operating within acceptable limits.
        </p>

      </div>

    </main>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
  color: string;
};

function DashboardCard({
  title,
  value,
  color,
}: DashboardCardProps) {
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

type InfoProps = {
  title: string;
  value: string;
};

function Info({
  title,
  value,
}: InfoProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="font-semibold">
        {value}
      </h3>
    </div>
  );
}