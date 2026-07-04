"use client";

type AlertLevel = "CRITICAL" | "WARNING" | "GOOD";

type DashboardKPI = {
  title: string;
  value: string;
  note: string;
  color: string;
};

type LiveLine = {
  id: string;
  line: string;
  style: string;
  buyer: string;
  target: number;
  produced: number;
  efficiency: number;
  dhu: number;
  attendance: number;
  downtime: number;
  materialRisk: AlertLevel;
  aiStatus: AlertLevel;
};

const lines: LiveLine[] = [
  {
    id: "1",
    line: "L-001",
    style: "HNM-2401",
    buyer: "H&M",
    target: 1200,
    produced: 1135,
    efficiency: 94,
    dhu: 2.5,
    attendance: 98,
    downtime: 15,
    materialRisk: "GOOD",
    aiStatus: "GOOD",
  },
  {
    id: "2",
    line: "L-002",
    style: "ZRA-1188",
    buyer: "Zara",
    target: 980,
    produced: 902,
    efficiency: 89,
    dhu: 3.5,
    attendance: 90,
    downtime: 22,
    materialRisk: "WARNING",
    aiStatus: "WARNING",
  },
  {
    id: "3",
    line: "L-003",
    style: "PRM-3307",
    buyer: "Primark",
    target: 700,
    produced: 642,
    efficiency: 84,
    dhu: 5.1,
    attendance: 97,
    downtime: 75,
    materialRisk: "CRITICAL",
    aiStatus: "CRITICAL",
  },
];

function badgeClass(level: AlertLevel) {
  if (level === "GOOD") {
    return "bg-green-100 text-green-700";
  }

  if (level === "WARNING") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function LiveProductionDashboardPage() {
  const totalTarget = lines.reduce((sum, line) => sum + line.target, 0);

  const totalProduced = lines.reduce(
    (sum, line) => sum + line.produced,
    0
  );

  const avgEfficiency =
    lines.reduce((sum, line) => sum + line.efficiency, 0) / lines.length;

  const avgDhu =
    lines.reduce((sum, line) => sum + line.dhu, 0) / lines.length;

  const avgAttendance =
    lines.reduce((sum, line) => sum + line.attendance, 0) / lines.length;

  const totalDowntime = lines.reduce(
    (sum, line) => sum + line.downtime,
    0
  );

  const criticalLines = lines.filter(
    (line) => line.aiStatus === "CRITICAL"
  ).length;

  const kpis: DashboardKPI[] = [
    {
      title: "Today Target",
      value: totalTarget.toLocaleString(),
      note: "Total planned output",
      color: "text-blue-700",
    },
    {
      title: "Today Produced",
      value: totalProduced.toLocaleString(),
      note: "Actual production",
      color: "text-green-700",
    },
    {
      title: "Efficiency",
      value: `${avgEfficiency.toFixed(1)}%`,
      note: "Factory average",
      color: "text-purple-700",
    },
    {
      title: "DHU",
      value: avgDhu.toFixed(2),
      note: "Defects per hundred units",
      color: "text-red-700",
    },
    {
      title: "Attendance",
      value: `${avgAttendance.toFixed(1)}%`,
      note: "Average attendance",
      color: "text-orange-700",
    },
    {
      title: "Downtime",
      value: `${totalDowntime} min`,
      note: "Machine downtime",
      color: "text-red-700",
    },
    {
      title: "Critical Lines",
      value: criticalLines.toString(),
      note: "Need immediate attention",
      color: "text-red-700",
    },
    {
      title: "Factory Health",
      value: "91%",
      note: "AI combined score",
      color: "text-green-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Executive Live Production Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Unified live view of production, quality, maintenance,
            attendance, material risk, WIP and AI factory health.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Refresh Live Data
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4 xl:grid-cols-8">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">{kpi.title}</p>

            <h2 className={`mt-2 text-3xl font-bold ${kpi.color}`}>
              {kpi.value}
            </h2>

            <p className="mt-2 text-xs text-gray-500">{kpi.note}</p>
          </div>
        ))}
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Executive Summary
        </h2>

        <p className="mt-3 text-gray-700">
          Factory health is currently stable at <strong>91%</strong>. Line L-003
          requires immediate attention due to high DHU, machine downtime and
          critical material risk. AI recommends replenishing hood fabric,
          completing machine maintenance, and increasing inline quality control
          before the next production cycle.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow xl:col-span-2">
          <h2 className="mb-5 text-2xl font-bold text-blue-700">
            Live Line Status
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <TH>Line</TH>
                  <TH>Style</TH>
                  <TH>Buyer</TH>
                  <TH>Target</TH>
                  <TH>Produced</TH>
                  <TH>Eff.</TH>
                  <TH>DHU</TH>
                  <TH>Attendance</TH>
                  <TH>Downtime</TH>
                  <TH>Material</TH>
                  <TH>AI</TH>
                </tr>
              </thead>

              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-b hover:bg-blue-50">
                    <TD>{line.line}</TD>
                    <TD>{line.style}</TD>
                    <TD>{line.buyer}</TD>
                    <TD>{line.target.toLocaleString()}</TD>
                    <TD>{line.produced.toLocaleString()}</TD>
                    <TD>{line.efficiency}%</TD>
                    <TD>{line.dhu}</TD>
                    <TD>{line.attendance}%</TD>
                    <TD>{line.downtime} min</TD>
                    <TD>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                          line.materialRisk
                        )}`}
                      >
                        {line.materialRisk}
                      </span>
                    </TD>
                    <TD>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                          line.aiStatus
                        )}`}
                      >
                        {line.aiStatus}
                      </span>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-bold text-red-700">
            AI Priority Actions
          </h2>

          <ul className="space-y-4 text-gray-700">
            <li className="rounded-lg bg-red-50 p-4">
              Replenish hood fabric for Line L-003 immediately.
            </li>

            <li className="rounded-lg bg-orange-50 p-4">
              Complete maintenance work on machine MC-014.
            </li>

            <li className="rounded-lg bg-yellow-50 p-4">
              Add one inline quality inspector to Line L-003.
            </li>

            <li className="rounded-lg bg-green-50 p-4">
              Maintain current manpower balance on Line L-001.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}