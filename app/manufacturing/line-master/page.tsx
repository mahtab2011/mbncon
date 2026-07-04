"use client";

type ProductionLine = {
  id: string;
  lineCode: string;
  lineName: string;
  factory: string;
  department: string;
  floor: string;
  buyer: string;
  product: string;
  targetOperators: number;
  actualOperators: number;
  targetOutput: number;
  supervisor: string;
  lineChief: string;
  machineCount: number;
  status: "ACTIVE" | "STOPPED";
};

const lines: ProductionLine[] = [
  {
    id: "1",
    lineCode: "L-001",
    lineName: "Sewing Line 01",
    factory: "MBN-001",
    department: "Sewing",
    floor: "3rd Floor",
    buyer: "H&M",
    product: "Polo Shirt",
    targetOperators: 48,
    actualOperators: 46,
    targetOutput: 1200,
    supervisor: "Rahman",
    lineChief: "Karim",
    machineCount: 58,
    status: "ACTIVE",
  },
  {
    id: "2",
    lineCode: "L-002",
    lineName: "Sewing Line 02",
    factory: "MBN-001",
    department: "Sewing",
    floor: "3rd Floor",
    buyer: "Zara",
    product: "T-Shirt",
    targetOperators: 52,
    actualOperators: 51,
    targetOutput: 1350,
    supervisor: "Hasan",
    lineChief: "Jamal",
    machineCount: 61,
    status: "ACTIVE",
  },
  {
    id: "3",
    lineCode: "L-003",
    lineName: "Finishing Line",
    factory: "MBN-001",
    department: "Finishing",
    floor: "Ground Floor",
    buyer: "Primark",
    product: "Hoodie",
    targetOperators: 30,
    actualOperators: 29,
    targetOutput: 900,
    supervisor: "Kabir",
    lineChief: "Rafiq",
    machineCount: 24,
    status: "ACTIVE",
  },
];

export default function LineMasterPage() {
  const totalLines = lines.length;

  const activeLines = lines.filter(
    (line) => line.status === "ACTIVE"
  ).length;

  const totalOperators = lines.reduce(
    (sum, line) => sum + line.actualOperators,
    0
  );

  const totalMachines = lines.reduce(
    (sum, line) => sum + line.machineCount,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Production Line Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Master database of all production lines used by the Manufacturing
            Intelligence Suite.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + Add Line
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total Lines</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {totalLines}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Active Lines</p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {activeLines}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Operators</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {totalOperators}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Machines</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {totalMachines}
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Line</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Buyer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-center">Operators</th>
              <th className="px-4 py-3 text-center">Target</th>
              <th className="px-4 py-3 text-center">Machines</th>
              <th className="px-4 py-3 text-left">Supervisor</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {lines.map((line) => (
              <tr
                key={line.id}
                className="border-b hover:bg-blue-50"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold">
                    {line.lineCode}
                  </div>

                  <div className="text-sm text-gray-500">
                    {line.lineName}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {line.department}
                </td>

                <td className="px-4 py-3">
                  {line.buyer}
                </td>

                <td className="px-4 py-3">
                  {line.product}
                </td>

                <td className="px-4 py-3 text-center">
                  {line.actualOperators}/{line.targetOperators}
                </td>

                <td className="px-4 py-3 text-center">
                  {line.targetOutput}
                </td>

                <td className="px-4 py-3 text-center">
                  {line.machineCount}
                </td>

                <td className="px-4 py-3">
                  {line.supervisor}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {line.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}