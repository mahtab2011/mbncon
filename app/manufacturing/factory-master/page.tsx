"use client";

const factories = [
  {
    id: "FAC-000001",
    name: "MBN Apparel Ltd.",
    country: "Bangladesh",
    city: "Gazipur",
    lines: 24,
    employees: 1680,
    health: 94,
    status: "ACTIVE",
  },
  {
    id: "FAC-000002",
    name: "Smart Garments Ltd.",
    country: "Bangladesh",
    city: "Narayanganj",
    lines: 18,
    employees: 1245,
    health: 89,
    status: "ACTIVE",
  },
];

export default function FactoryMasterCentre() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex flex-wrap items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Factory Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Enterprise Factory Administration
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          + New Factory
        </button>

      </div>

      {/* KPI */}

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card title="Factories" value="2" />

        <Card title="Production Lines" value="42" />

        <Card title="Employees" value="2,925" />

        <Card title="Average Health" value="91.5%" />

      </div>

      {/* Search */}

      <div className="mb-6 rounded-xl bg-white p-5 shadow">

        <div className="grid gap-4 md:grid-cols-3">

          <input
            placeholder="Search Factory..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">

            <option>All Countries</option>

            <option>Bangladesh</option>

            <option>Vietnam</option>

            <option>India</option>

          </select>

          <select className="rounded-lg border p-3">

            <option>All Status</option>

            <option>ACTIVE</option>

            <option>INACTIVE</option>

          </select>

        </div>

      </div>

      {/* Factory Grid */}

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-slate-200">

            <tr>

              <TH>Factory ID</TH>

              <TH>Factory Name</TH>

              <TH>Country</TH>

              <TH>City</TH>

              <TH>Lines</TH>

              <TH>Employees</TH>

              <TH>Health</TH>

              <TH>Status</TH>

              <TH>Actions</TH>

            </tr>

          </thead>

          <tbody>

            {factories.map((factory) => (

              <tr
                key={factory.id}
                className="border-t hover:bg-slate-50"
              >

                <TD>{factory.id}</TD>

                <TD>{factory.name}</TD>

                <TD>{factory.country}</TD>

                <TD>{factory.city}</TD>

                <TD>{factory.lines}</TD>

                <TD>{factory.employees}</TD>

                <TD>{factory.health}%</TD>

                <TD>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {factory.status}
                  </span>

                </TD>

                <TD>

                  <div className="flex flex-wrap gap-2">

                    <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
                      View
                    </button>

                    <button className="rounded bg-orange-500 px-3 py-1 text-sm text-white">
                      Edit
                    </button>

                    <button className="rounded bg-green-600 px-3 py-1 text-sm text-white">
                      AI
                    </button>

                    <button className="rounded bg-purple-600 px-3 py-1 text-sm text-white">
                      Lines
                    </button>

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

      <p className="text-sm text-gray-500">
        {title}
      </p>

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