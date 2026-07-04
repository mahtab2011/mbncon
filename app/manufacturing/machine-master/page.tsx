"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type Machine = {
  id: string;
  machineNo: string;
  machineType: string;
  brand: string;
  model: string;
  serialNo: string;
  factory: string;
  department: string;
  line: string;
  ageYears: number;
  breakdownsThisMonth: number;
  mtbfHours: number;
  mttrMinutes: number;
  oee: number;
  predictedFailureRisk: RiskLevel;
  remainingUsefulLifeMonths: number;
  sparePartPrediction: string;
  aiRecommendation: string;
};

const machines: Machine[] = [
  {
    id: "1",
    machineNo: "MC-001",
    machineType: "Single Needle Lock Stitch",
    brand: "Juki",
    model: "DDL-8700",
    serialNo: "JK-8700-001",
    factory: "MBN-001",
    department: "Sewing",
    line: "L-001",
    ageYears: 3,
    breakdownsThisMonth: 1,
    mtbfHours: 220,
    mttrMinutes: 28,
    oee: 86,
    predictedFailureRisk: "LOW",
    remainingUsefulLifeMonths: 48,
    sparePartPrediction: "Needle bar set within 6 months",
    aiRecommendation:
      "Machine is stable. Continue normal preventive maintenance schedule.",
  },
  {
    id: "2",
    machineNo: "MC-014",
    machineType: "Overlock",
    brand: "Pegasus",
    model: "M752",
    serialNo: "PG-M752-014",
    factory: "MBN-001",
    department: "Sewing",
    line: "L-001",
    ageYears: 6,
    breakdownsThisMonth: 4,
    mtbfHours: 74,
    mttrMinutes: 52,
    oee: 68,
    predictedFailureRisk: "HIGH",
    remainingUsefulLifeMonths: 14,
    sparePartPrediction: "Looper and feed dog replacement likely",
    aiRecommendation:
      "Schedule urgent maintenance before next high-volume style input.",
  },
  {
    id: "3",
    machineNo: "MC-027",
    machineType: "Flatlock",
    brand: "Yamato",
    model: "VG2700",
    serialNo: "YM-VG2700-027",
    factory: "MBN-001",
    department: "Sewing",
    line: "L-002",
    ageYears: 4,
    breakdownsThisMonth: 2,
    mtbfHours: 145,
    mttrMinutes: 35,
    oee: 79,
    predictedFailureRisk: "MEDIUM",
    remainingUsefulLifeMonths: 30,
    sparePartPrediction: "Knife set and oil seal inspection needed",
    aiRecommendation:
      "Monitor vibration and stitch quality during next production run.",
  },
];

function riskBadgeClass(risk: RiskLevel) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function MachineMasterPage() {
  const totalMachines = machines.length;

  const highRiskMachines = machines.filter(
    (machine) => machine.predictedFailureRisk === "HIGH"
  ).length;

  const averageOee =
    machines.reduce((sum, machine) => sum + machine.oee, 0) /
    machines.length;

  const totalBreakdowns = machines.reduce(
    (sum, machine) => sum + machine.breakdownsThisMonth,
    0
  );

  const avgMtbf =
    machines.reduce((sum, machine) => sum + machine.mtbfHours, 0) /
    machines.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Machine Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Enterprise machine administration with OEE, maintenance,
            breakdown prediction and spare parts intelligence.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + New Machine
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {["List", "Create", "Analytics", "Import", "Export", "Print", "AI Insights"].map(
          (item) => (
            <button
              key={item}
              className={`rounded-lg px-5 py-2 font-semibold shadow ${
                item === "List"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-5">
        <Card title="Machines" value={totalMachines.toString()} />
        <Card title="Average OEE" value={`${averageOee.toFixed(1)}%`} />
        <Card title="Breakdowns" value={totalBreakdowns.toString()} />
        <Card title="Avg MTBF" value={`${avgMtbf.toFixed(0)} hrs`} />
        <Card title="High Risk" value={highRiskMachines.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Machine Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI has identified <strong>{highRiskMachines}</strong> high-risk
          machine. Average OEE is <strong>{averageOee.toFixed(1)}%</strong>.
          Immediate attention should be given to MC-014 due to repeated
          breakdowns and reduced MTBF.
        </p>
      </section>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            placeholder="Search Machine..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>All Lines</option>
            <option>L-001</option>
            <option>L-002</option>
            <option>L-003</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Machine Types</option>
            <option>Single Needle Lock Stitch</option>
            <option>Overlock</option>
            <option>Flatlock</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Risk Levels</option>
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <TH>Machine</TH>
              <TH>Type</TH>
              <TH>Brand</TH>
              <TH>Model</TH>
              <TH>Line</TH>
              <TH>Age</TH>
              <TH>OEE</TH>
              <TH>MTBF</TH>
              <TH>MTTR</TH>
              <TH>Breakdowns</TH>
              <TH>Risk</TH>
              <TH>Actions</TH>
            </tr>
          </thead>

          <tbody>
            {machines.map((machine) => (
              <tr key={machine.id} className="border-b hover:bg-blue-50">
                <TD>
                  <div className="font-semibold">{machine.machineNo}</div>
                  <div className="text-xs text-gray-500">
                    {machine.serialNo}
                  </div>
                </TD>

                <TD>{machine.machineType}</TD>
                <TD>{machine.brand}</TD>
                <TD>{machine.model}</TD>
                <TD>{machine.line}</TD>
                <TD>{machine.ageYears} yrs</TD>
                <TD>
                  <span className="font-bold text-blue-700">
                    {machine.oee}%
                  </span>
                </TD>
                <TD>{machine.mtbfHours} hrs</TD>
                <TD>{machine.mttrMinutes} min</TD>
                <TD>{machine.breakdownsThisMonth}</TD>
                <TD>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${riskBadgeClass(
                      machine.predictedFailureRisk
                    )}`}
                  >
                    {machine.predictedFailureRisk}
                  </span>
                </TD>

                <TD>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton label="View" color="bg-blue-600" />
                    <ActionButton label="Edit" color="bg-orange-500" />
                    <ActionButton label="AI" color="bg-green-600" />
                    <ActionButton label="PM" color="bg-purple-600" />
                  </div>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-blue-700">{value}</h2>
    </div>
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

function ActionButton({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <button className={`rounded px-3 py-1 text-sm text-white ${color}`}>
      {label}
    </button>
  );
}