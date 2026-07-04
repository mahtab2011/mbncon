"use client";

type QualityRecord = {
  id: string;
  date: string;
  line: string;
  style: string;
  buyer: string;
  inspector: string;
  checked: number;
  passed: number;
  rejected: number;
  dhu: number;
  majorDefect: string;
  aiRootCause: string;
};

const records: QualityRecord[] = [
  {
    id: "1",
    date: "2026-06-29",
    line: "L-001",
    style: "HNM-2401",
    buyer: "H&M",
    inspector: "Mr. Alam",
    checked: 520,
    passed: 507,
    rejected: 13,
    dhu: 2.5,
    majorDefect: "Open Seam",
    aiRootCause: "Machine tension variation",
  },
  {
    id: "2",
    date: "2026-06-29",
    line: "L-002",
    style: "ZRA-1188",
    buyer: "Zara",
    inspector: "Ms. Farzana",
    checked: 480,
    passed: 463,
    rejected: 17,
    dhu: 3.5,
    majorDefect: "Skip Stitch",
    aiRootCause: "Needle wear",
  },
  {
    id: "3",
    date: "2026-06-29",
    line: "L-003",
    style: "PRM-3307",
    buyer: "Primark",
    inspector: "Mr. Kabir",
    checked: 390,
    passed: 370,
    rejected: 20,
    dhu: 5.1,
    majorDefect: "Collar Puckering",
    aiRootCause: "Operator handling + folder setting",
  },
];

export default function QualityEntryCentre() {
  const totalChecked = records.reduce((s, r) => s + r.checked, 0);

  const totalRejected = records.reduce((s, r) => s + r.rejected, 0);

  const avgDHU =
    records.reduce((s, r) => s + r.dhu, 0) / records.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex flex-wrap items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-blue-700">
            Quality Entry Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Live inline and end-line quality monitoring.
          </p>

        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
          + New Inspection
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
          title="Pieces Checked"
          value={totalChecked.toLocaleString()}
        />

        <Card
          title="Rejected"
          value={totalRejected.toString()}
        />

        <Card
          title="Average DHU"
          value={avgDHU.toFixed(2)}
        />

        <Card
          title="Quality Rating"
          value="A"
        />

      </div>

      <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="text-2xl font-bold text-red-700">
          AI Quality Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI has detected increasing collar puckering on Line L-003.
          Machine setting verification and operator coaching are recommended
          before the next production batch.
        </p>

      </section>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">

            <tr>

              <TH>Date</TH>
              <TH>Line</TH>
              <TH>Style</TH>
              <TH>Buyer</TH>
              <TH>Inspector</TH>
              <TH>Checked</TH>
              <TH>Rejected</TH>
              <TH>DHU</TH>
              <TH>Major Defect</TH>
              <TH>AI Root Cause</TH>
              <TH>Actions</TH>

            </tr>

          </thead>

          <tbody>

            {records.map((r) => (

              <tr
                key={r.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{r.date}</TD>

                <TD>{r.line}</TD>

                <TD>{r.style}</TD>

                <TD>{r.buyer}</TD>

                <TD>{r.inspector}</TD>

                <TD>{r.checked}</TD>

                <TD>{r.rejected}</TD>

                <TD>

                  <span className="font-bold text-red-700">
                    {r.dhu}
                  </span>

                </TD>

                <TD>{r.majorDefect}</TD>

                <TD>{r.aiRootCause}</TD>

                <TD>

                  <div className="flex gap-2">

                    <Button
                      label="View"
                      color="bg-blue-600"
                    />

                    <Button
                      label="Edit"
                      color="bg-orange-500"
                    />

                    <Button
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

function Button({
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