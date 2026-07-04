"use client";

type Attendance = {
  id: string;
  date: string;
  line: string;
  supervisor: string;
  required: number;
  present: number;
  absent: number;
  overtime: number;
  efficiency: number;
  aiRisk: string;
};

const attendance: Attendance[] = [
  {
    id: "1",
    date: "2026-06-29",
    line: "L-001",
    supervisor: "Rahman",
    required: 52,
    present: 51,
    absent: 1,
    overtime: 2,
    efficiency: 94,
    aiRisk: "LOW",
  },
  {
    id: "2",
    date: "2026-06-29",
    line: "L-002",
    supervisor: "Karim",
    required: 48,
    present: 43,
    absent: 5,
    overtime: 6,
    efficiency: 82,
    aiRisk: "HIGH",
  },
  {
    id: "3",
    date: "2026-06-29",
    line: "L-003",
    supervisor: "Hasan",
    required: 40,
    present: 39,
    absent: 1,
    overtime: 1,
    efficiency: 89,
    aiRisk: "LOW",
  },
];

export default function AttendanceCentre() {

  const required = attendance.reduce(
    (s, r) => s + r.required,
    0
  );

  const present = attendance.reduce(
    (s, r) => s + r.present,
    0
  );

  const absent = attendance.reduce(
    (s, r) => s + r.absent,
    0
  );

  const overtime = attendance.reduce(
    (s, r) => s + r.overtime,
    0
  );

  const avgEfficiency =
    attendance.reduce(
      (s, r) => s + r.efficiency,
      0
    ) / attendance.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-blue-700">
            Attendance & Manpower Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Live attendance, absenteeism and manpower intelligence.
          </p>

        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
          + Attendance Entry
        </button>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-5">

        <Card title="Required" value={required.toString()} />

        <Card title="Present" value={present.toString()} />

        <Card title="Absent" value={absent.toString()} />

        <Card title="OT Hours" value={overtime.toString()} />

        <Card
          title="Efficiency"
          value={`${avgEfficiency.toFixed(1)}%`}
        />

      </div>

      <section className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6">

        <h2 className="text-2xl font-bold text-yellow-700">
          AI Manpower Summary
        </h2>

        <p className="mt-3 text-gray-700">
          Line L-002 has a manpower shortage due to five absentees.
          AI recommends temporary operator balancing from Line L-003
          before overtime is increased.
        </p>

      </section>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">

            <tr>

              <TH>Date</TH>
              <TH>Line</TH>
              <TH>Supervisor</TH>
              <TH>Required</TH>
              <TH>Present</TH>
              <TH>Absent</TH>
              <TH>OT</TH>
              <TH>Efficiency</TH>
              <TH>AI Risk</TH>

            </tr>

          </thead>

          <tbody>

            {attendance.map((row)=>(

              <tr
                key={row.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{row.date}</TD>

                <TD>{row.line}</TD>

                <TD>{row.supervisor}</TD>

                <TD>{row.required}</TD>

                <TD>{row.present}</TD>

                <TD>{row.absent}</TD>

                <TD>{row.overtime}</TD>

                <TD>{row.efficiency}%</TD>

                <TD>

                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    row.aiRisk==="HIGH"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                  }`}>
                    {row.aiRisk}
                  </span>

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
}:{
  title:string;
  value:string;
}){
  return(
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
}:{
  children:React.ReactNode;
}){
  return(
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({
  children,
}:{
  children:React.ReactNode;
}){
  return(
    <td className="px-4 py-3">
      {children}
    </td>
  );
}