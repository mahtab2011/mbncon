"use client";

type ProductionRecord = {
  id: string;
  date: string;
  factory: string;
  line: string;
  style: string;
  buyer: string;
  target: number;
  produced: number;
  rejected: number;
  efficiency: number;
  supervisor: string;
};

const production: ProductionRecord[] = [
  {
    id: "1",
    date: "2026-06-29",
    factory: "MBN-001",
    line: "L-001",
    style: "HNM-2401",
    buyer: "H&M",
    target: 1200,
    produced: 1135,
    rejected: 18,
    efficiency: 94,
    supervisor: "Rahman",
  },
  {
    id: "2",
    date: "2026-06-29",
    factory: "MBN-001",
    line: "L-002",
    style: "ZRA-1188",
    buyer: "Zara",
    target: 980,
    produced: 902,
    rejected: 21,
    efficiency: 89,
    supervisor: "Karim",
  },
  {
    id: "3",
    date: "2026-06-29",
    factory: "MBN-001",
    line: "L-003",
    style: "PRM-3307",
    buyer: "Primark",
    target: 700,
    produced: 642,
    rejected: 32,
    efficiency: 84,
    supervisor: "Hasan",
  },
];

export default function ProductionEntryCentre() {
  const totalTarget = production.reduce(
    (sum, row) => sum + row.target,
    0
  );

  const totalProduced = production.reduce(
    (sum, row) => sum + row.produced,
    0
  );

  const totalRejected = production.reduce(
    (sum, row) => sum + row.rejected,
    0
  );

  const avgEfficiency =
    production.reduce(
      (sum, row) => sum + row.efficiency,
      0
    ) / production.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Production Entry Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Live production reporting from every production line.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          + New Production Entry
        </button>

      </div>

      <div className="mb-6 flex flex-wrap gap-3">

        {[
          "List",
          "Create",
          "Analytics",
          "Import",
          "Export",
          "Print",
          "AI Insights",
        ].map((item) => (
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
        ))}

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="Target Qty"
          value={totalTarget.toLocaleString()}
        />

        <Card
          title="Produced Qty"
          value={totalProduced.toLocaleString()}
        />

        <Card
          title="Rejected"
          value={totalRejected.toString()}
        />

        <Card
          title="Efficiency"
          value={`${avgEfficiency.toFixed(1)}%`}
        />

      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Production Summary
        </h2>

        <p className="mt-3 text-gray-700">
          Overall factory efficiency is{" "}
          <strong>{avgEfficiency.toFixed(1)}%</strong>.
          Line L-003 is below the factory average due to higher rejection.
          AI recommends reviewing manpower balance, machine condition and quality checkpoints before the next production run.
        </p>

      </section>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">

        <div className="grid gap-4 md:grid-cols-4">

          <input
            placeholder="Search Production..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>All Factories</option>
            <option>MBN-001</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Lines</option>
            <option>L-001</option>
            <option>L-002</option>
            <option>L-003</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

        </div>

      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">

            <tr>

              <TH>Date</TH>
              <TH>Factory</TH>
              <TH>Line</TH>
              <TH>Style</TH>
              <TH>Buyer</TH>
              <TH>Target</TH>
              <TH>Produced</TH>
              <TH>Rejected</TH>
              <TH>Efficiency</TH>
              <TH>Supervisor</TH>
              <TH>Actions</TH>

            </tr>

          </thead>

          <tbody>

            {production.map((row) => (

              <tr
                key={row.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{row.date}</TD>

                <TD>{row.factory}</TD>

                <TD>{row.line}</TD>

                <TD>{row.style}</TD>

                <TD>{row.buyer}</TD>

                <TD>{row.target.toLocaleString()}</TD>

                <TD>{row.produced.toLocaleString()}</TD>

                <TD>{row.rejected}</TD>

                <TD>

                  <span className="font-bold text-green-700">
                    {row.efficiency}%
                  </span>

                </TD>

                <TD>{row.supervisor}</TD>

                <TD>

                  <div className="flex flex-wrap gap-2">

                    <ActionButton
                      label="View"
                      color="bg-blue-600"
                    />

                    <ActionButton
                      label="Edit"
                      color="bg-orange-500"
                    />

                    <ActionButton
                      label="AI"
                      color="bg-green-600"
                    />

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

function TH({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-4 py-3">
      {children}
    </td>
  );
}

function ActionButton({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <button
      className={`rounded px-3 py-1 text-sm text-white ${color}`}
    >
      {label}
    </button>
  );
}