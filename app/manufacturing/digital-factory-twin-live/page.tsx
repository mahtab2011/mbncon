"use client";

type TwinStatus = "GOOD" | "WATCH" | "CRITICAL";

type FactoryZone = {
  id: string;
  zone: string;
  line: string;
  style: string;
  production: number;
  efficiency: number;
  dhu: number;
  attendance: number;
  downtime: number;
  materialStatus: TwinStatus;
  wipStatus: TwinStatus;
  aiStatus: TwinStatus;
  aiInsight: string;
};

const factoryZones: FactoryZone[] = [
  {
    id: "1",
    zone: "Sewing Floor 3",
    line: "L-001",
    style: "HNM-2401",
    production: 1135,
    efficiency: 94,
    dhu: 2.5,
    attendance: 98,
    downtime: 15,
    materialStatus: "GOOD",
    wipStatus: "GOOD",
    aiStatus: "GOOD",
    aiInsight: "Line is healthy. Maintain current operator and machine allocation.",
  },
  {
    id: "2",
    zone: "Sewing Floor 3",
    line: "L-002",
    style: "ZRA-1188",
    production: 902,
    efficiency: 89,
    dhu: 3.5,
    attendance: 90,
    downtime: 22,
    materialStatus: "WATCH",
    wipStatus: "WATCH",
    aiStatus: "WATCH",
    aiInsight:
      "Monitor rib material and attendance. Minor flow imbalance may appear in finishing.",
  },
  {
    id: "3",
    zone: "Sewing Floor 2",
    line: "L-003",
    style: "PRM-3307",
    production: 642,
    efficiency: 84,
    dhu: 5.1,
    attendance: 97,
    downtime: 75,
    materialStatus: "CRITICAL",
    wipStatus: "CRITICAL",
    aiStatus: "CRITICAL",
    aiInsight:
      "Critical risk. Hood fabric shortage, machine downtime and high DHU may delay shipment.",
  },
];

function statusClass(status: TwinStatus) {
  if (status === "GOOD") {
    return "bg-green-100 text-green-700";
  }

  if (status === "WATCH") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function DigitalFactoryTwinLivePage() {
  const totalProduction = factoryZones.reduce(
    (sum, zone) => sum + zone.production,
    0
  );

  const avgEfficiency =
    factoryZones.reduce((sum, zone) => sum + zone.efficiency, 0) /
    factoryZones.length;

  const avgDhu =
    factoryZones.reduce((sum, zone) => sum + zone.dhu, 0) /
    factoryZones.length;

  const criticalZones = factoryZones.filter(
    (zone) => zone.aiStatus === "CRITICAL"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Digital Factory Twin Live
          </h1>

          <p className="mt-2 text-gray-600">
            Live factory model combining production, quality, maintenance,
            attendance, material and WIP intelligence.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Refresh Twin
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Total Production" value={totalProduction.toLocaleString()} />
        <Card title="Avg Efficiency" value={`${avgEfficiency.toFixed(1)}%`} />
        <Card title="Avg DHU" value={avgDhu.toFixed(2)} />
        <Card title="Critical Zones" value={criticalZones.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Twin Summary
        </h2>

        <p className="mt-3 text-gray-700">
          The factory twin shows stable production overall, but Line L-003 is in
          critical condition due to material shortage, machine downtime and high
          DHU. AI recommends immediate material replenishment, machine recovery
          and inline quality reinforcement.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {factoryZones.map((zone) => (
          <section
            key={zone.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {zone.line}
                </h2>

                <p className="text-gray-600">
                  {zone.zone} · {zone.style}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                  zone.aiStatus
                )}`}
              >
                {zone.aiStatus}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Metric title="Production" value={zone.production.toLocaleString()} />
              <Metric title="Efficiency" value={`${zone.efficiency}%`} />
              <Metric title="DHU" value={zone.dhu.toString()} />
              <Metric title="Attendance" value={`${zone.attendance}%`} />
              <Metric title="Downtime" value={`${zone.downtime} min`} />
              <Metric title="Style" value={zone.style} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <StatusPill title="Material" status={zone.materialStatus} />
              <StatusPill title="WIP" status={zone.wipStatus} />
            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                AI Insight
              </p>

              <p className="mt-2 text-gray-700">
                {zone.aiInsight}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 font-bold">{value}</h3>
    </div>
  );
}

function StatusPill({
  title,
  status,
}: {
  title: string;
  status: TwinStatus;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>

      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusClass(
          status
        )}`}
      >
        {status}
      </span>
    </div>
  );
}