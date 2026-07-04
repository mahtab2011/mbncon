"use client";

type ProductionLine = {
  id: string;
  lineCode: string;
  lineName: string;
  factoryCode: string;
  departmentCode: string;
  floor: string;
  supervisorName: string;
  machineCount: number;
  operatorCount: number;
  targetEfficiency: number;
  currentEfficiency: number;
  healthScore: number;
  status: "ACTIVE" | "INACTIVE";
};

const productionLines: ProductionLine[] = [
  {
    id: "1",
    lineCode: "LIN-001",
    lineName: "Sewing Line 01",
    factoryCode: "MBN-001",
    departmentCode: "SEW",
    floor: "3rd Floor",
    supervisorName: "Mr. Rahman",
    machineCount: 58,
    operatorCount: 46,
    targetEfficiency: 85,
    currentEfficiency: 81,
    healthScore: 90,
    status: "ACTIVE",
  },
  {
    id: "2",
    lineCode: "LIN-002",
    lineName: "Sewing Line 02",
    factoryCode: "MBN-001",
    departmentCode: "SEW",
    floor: "3rd Floor",
    supervisorName: "Mr. Hasan",
    machineCount: 61,
    operatorCount: 51,
    targetEfficiency: 86,
    currentEfficiency: 76,
    healthScore: 82,
    status: "ACTIVE",
  },
  {
    id: "3",
    lineCode: "LIN-003",
    lineName: "Finishing Line 01",
    factoryCode: "MBN-001",
    departmentCode: "FIN",
    floor: "Ground Floor",
    supervisorName: "Mr. Kabir",
    machineCount: 24,
    operatorCount: 29,
    targetEfficiency: 82,
    currentEfficiency: 79,
    healthScore: 88,
    status: "ACTIVE",
  },
];

export default function ProductionLineMasterCentre() {
  const totalLines = productionLines.length;

  const totalMachines = productionLines.reduce(
    (sum, line) => sum + line.machineCount,
    0
  );

  const totalOperators = productionLines.reduce(
    (sum, line) => sum + line.operatorCount,
    0
  );

  const averageEfficiency =
    productionLines.reduce(
      (sum, line) => sum + line.currentEfficiency,
      0
    ) / productionLines.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Production Line Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Enterprise production line administration for operators, machines,
            target efficiency and AI line health.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + New Line
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

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Production Lines" value={totalLines.toString()} />
        <Card title="Machines" value={totalMachines.toString()} />
        <Card title="Operators" value={totalOperators.toString()} />
        <Card title="Avg Efficiency" value={`${averageEfficiency.toFixed(1)}%`} />
      </div>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            placeholder="Search Line..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>All Factories</option>
            <option>MBN-001</option>
            <option>MBN-002</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Departments</option>
            <option>SEW</option>
            <option>FIN</option>
            <option>CUT</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Status</option>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <TH>Line Code</TH>
              <TH>Line Name</TH>
              <TH>Factory</TH>
              <TH>Dept</TH>
              <TH>Floor</TH>
              <TH>Supervisor</TH>
              <TH>Machines</TH>
              <TH>Operators</TH>
              <TH>Target</TH>
              <TH>Current</TH>
              <TH>Health</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </tr>
          </thead>

          <tbody>
            {productionLines.map((line) => (
              <tr key={line.id} className="border-b hover:bg-blue-50">
                <TD>
                  <span className="font-semibold">{line.lineCode}</span>
                </TD>
                <TD>{line.lineName}</TD>
                <TD>{line.factoryCode}</TD>
                <TD>{line.departmentCode}</TD>
                <TD>{line.floor}</TD>
                <TD>{line.supervisorName}</TD>
                <TD>{line.machineCount}</TD>
                <TD>{line.operatorCount}</TD>
                <TD>{line.targetEfficiency}%</TD>
                <TD>
                  <span className="font-bold text-blue-700">
                    {line.currentEfficiency}%
                  </span>
                </TD>
                <TD>
                  <span className="font-bold text-green-700">
                    {line.healthScore}%
                  </span>
                </TD>
                <TD>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {line.status}
                  </span>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton label="View" color="bg-blue-600" />
                    <ActionButton label="Edit" color="bg-orange-500" />
                    <ActionButton label="AI" color="bg-green-600" />
                    <ActionButton label="Operators" color="bg-purple-600" />
                    <ActionButton label="Machines" color="bg-slate-700" />
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