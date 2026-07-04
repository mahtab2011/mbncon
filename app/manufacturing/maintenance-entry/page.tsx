"use client";

type MaintenanceRecord = {
  id: string;
  date: string;
  machineNo: string;
  machineType: string;
  line: string;
  issue: string;
  maintenanceType: "PREVENTIVE" | "BREAKDOWN";
  downtimeMinutes: number;
  technician: string;
  status: "OPEN" | "COMPLETED";
  aiPrediction: string;
};

const records: MaintenanceRecord[] = [
  {
    id: "1",
    date: "2026-06-29",
    machineNo: "MC-001",
    machineType: "Single Needle",
    line: "L-001",
    issue: "Needle breakage",
    maintenanceType: "PREVENTIVE",
    downtimeMinutes: 15,
    technician: "Mr. Jalal",
    status: "COMPLETED",
    aiPrediction: "Normal wear. Replace needle every 8 hours.",
  },
  {
    id: "2",
    date: "2026-06-29",
    machineNo: "MC-014",
    machineType: "Overlock",
    line: "L-002",
    issue: "Looper damage",
    maintenanceType: "BREAKDOWN",
    downtimeMinutes: 75,
    technician: "Mr. Karim",
    status: "OPEN",
    aiPrediction: "High probability of repeated failure within 5 days.",
  },
  {
    id: "3",
    date: "2026-06-29",
    machineNo: "MC-027",
    machineType: "Flatlock",
    line: "L-003",
    issue: "Oil leakage",
    maintenanceType: "PREVENTIVE",
    downtimeMinutes: 25,
    technician: "Mr. Hasan",
    status: "COMPLETED",
    aiPrediction: "Inspect oil seal during next PM cycle.",
  },
];

export default function MaintenanceEntryCentre() {

  const totalDowntime = records.reduce(
    (sum, r) => sum + r.downtimeMinutes,
    0
  );

  const openCases = records.filter(
    (r) => r.status === "OPEN"
  ).length;

  const breakdowns = records.filter(
    (r) => r.maintenanceType === "BREAKDOWN"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex flex-wrap items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-blue-700">
            Maintenance Entry Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Live maintenance and breakdown management.
          </p>

        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
          + New Maintenance
        </button>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="Total Downtime"
          value={`${totalDowntime} min`}
        />

        <Card
          title="Breakdowns"
          value={breakdowns.toString()}
        />

        <Card
          title="Open Cases"
          value={openCases.toString()}
        />

        <Card
          title="Machine Health"
          value="92%"
        />

      </div>

      <section className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-6">

        <h2 className="text-2xl font-bold text-orange-700">
          AI Maintenance Summary
        </h2>

        <p className="mt-3 text-gray-700">
          MC-014 has experienced repeated breakdowns.
          AI recommends immediate preventive overhaul and spare looper replacement before the next production cycle.
        </p>

      </section>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">

            <tr>
              <TH>Date</TH>
              <TH>Machine</TH>
              <TH>Line</TH>
              <TH>Issue</TH>
              <TH>Type</TH>
              <TH>Downtime</TH>
              <TH>Technician</TH>
              <TH>Status</TH>
              <TH>AI Prediction</TH>
            </tr>

          </thead>

          <tbody>

            {records.map((r) => (

              <tr
                key={r.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{r.date}</TD>

                <TD>{r.machineNo}</TD>

                <TD>{r.line}</TD>

                <TD>{r.issue}</TD>

                <TD>{r.maintenanceType}</TD>

                <TD>{r.downtimeMinutes} min</TD>

                <TD>{r.technician}</TD>

                <TD>{r.status}</TD>

                <TD>{r.aiPrediction}</TD>

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