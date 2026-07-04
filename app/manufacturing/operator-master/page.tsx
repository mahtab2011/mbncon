"use client";

type SkillGrade = "A+" | "A" | "B" | "C";

type Operator = {
  id: string;
  employeeId: string;
  operatorName: string;
  department: string;
  line: string;
  operation: string;
  skillGrade: SkillGrade;
  efficiency: number;
  attendance: number;
  aiScore: number;
  trainingStatus: string;
  status: "ACTIVE" | "INACTIVE";
};

const operators: Operator[] = [
  {
    id: "1",
    employeeId: "EMP-1001",
    operatorName: "Rahim Uddin",
    department: "Sewing",
    line: "L-001",
    operation: "Collar Attach",
    skillGrade: "A+",
    efficiency: 94,
    attendance: 99,
    aiScore: 97,
    trainingStatus: "Certified",
    status: "ACTIVE",
  },
  {
    id: "2",
    employeeId: "EMP-1002",
    operatorName: "Salma Begum",
    department: "Sewing",
    line: "L-001",
    operation: "Sleeve Attach",
    skillGrade: "A",
    efficiency: 88,
    attendance: 96,
    aiScore: 91,
    trainingStatus: "Certified",
    status: "ACTIVE",
  },
  {
    id: "3",
    employeeId: "EMP-1003",
    operatorName: "Karim Mia",
    department: "Finishing",
    line: "L-002",
    operation: "Thread Trimming",
    skillGrade: "B",
    efficiency: 80,
    attendance: 92,
    aiScore: 84,
    trainingStatus: "Needs Refresh",
    status: "ACTIVE",
  },
];

function gradeColor(grade: SkillGrade) {
  switch (grade) {
    case "A+":
      return "bg-green-100 text-green-700";
    case "A":
      return "bg-blue-100 text-blue-700";
    case "B":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function OperatorMasterPage() {
  const totalOperators = operators.length;

  const avgEfficiency =
    operators.reduce((sum, op) => sum + op.efficiency, 0) /
    operators.length;

  const avgAttendance =
    operators.reduce((sum, op) => sum + op.attendance, 0) /
    operators.length;

  const avgAi =
    operators.reduce((sum, op) => sum + op.aiScore, 0) /
    operators.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Operator Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Enterprise operator administration with AI performance,
            efficiency, attendance and skill intelligence.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + New Operator
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

        <Card title="Operators" value={totalOperators.toString()} />

        <Card
          title="Avg Efficiency"
          value={`${avgEfficiency.toFixed(1)}%`}
        />

        <Card
          title="Attendance"
          value={`${avgAttendance.toFixed(1)}%`}
        />

        <Card
          title="AI Score"
          value={`${avgAi.toFixed(1)}%`}
        />

      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Operator Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI recommends assigning A+ operators to critical operations.
          Current average efficiency is{" "}
          <strong>{avgEfficiency.toFixed(1)}%</strong>.
          Two operators are ready for cross-training to increase production flexibility.
        </p>

      </section>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">

        <div className="grid gap-4 md:grid-cols-4">

          <input
            placeholder="Search Operator..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>All Departments</option>
            <option>Sewing</option>
            <option>Finishing</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Skill Grades</option>
            <option>A+</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
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
              <TH>Employee ID</TH>
              <TH>Name</TH>
              <TH>Department</TH>
              <TH>Line</TH>
              <TH>Operation</TH>
              <TH>Skill</TH>
              <TH>Efficiency</TH>
              <TH>Attendance</TH>
              <TH>AI Score</TH>
              <TH>Training</TH>
              <TH>Actions</TH>
            </tr>

          </thead>

          <tbody>

            {operators.map((op) => (
              <tr key={op.id} className="border-b hover:bg-blue-50">

                <TD>
                  <span className="font-semibold">
                    {op.employeeId}
                  </span>
                </TD>

                <TD>{op.operatorName}</TD>

                <TD>{op.department}</TD>

                <TD>{op.line}</TD>

                <TD>{op.operation}</TD>

                <TD>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${gradeColor(
                      op.skillGrade
                    )}`}
                  >
                    {op.skillGrade}
                  </span>
                </TD>

                <TD>{op.efficiency}%</TD>

                <TD>{op.attendance}%</TD>

                <TD>
                  <span className="font-bold text-green-700">
                    {op.aiScore}%
                  </span>
                </TD>

                <TD>{op.trainingStatus}</TD>

                <TD>

                  <div className="flex flex-wrap gap-2">

                    <ActionButton label="View" color="bg-blue-600" />

                    <ActionButton label="Edit" color="bg-orange-500" />

                    <ActionButton label="AI" color="bg-green-600" />

                    <ActionButton label="Training" color="bg-purple-600" />

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
    <button
      className={`rounded px-3 py-1 text-sm text-white ${color}`}
    >
      {label}
    </button>
  );
}