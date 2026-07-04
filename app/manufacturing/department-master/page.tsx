"use client";

type Department = {
  id: string;
  departmentCode: string;
  departmentName: string;
  banglaName: string;
  factoryCode: string;
  category: "PRODUCTION" | "SUPPORT" | "ADMIN" | "COMPLIANCE";
  headCount: number;
  managerName: string;
  healthScore: number;
  status: "ACTIVE" | "INACTIVE";
};

const departments: Department[] = [
  {
    id: "1",
    departmentCode: "CUT",
    departmentName: "Cutting",
    banglaName: "কাটিং",
    factoryCode: "MBN-001",
    category: "PRODUCTION",
    headCount: 180,
    managerName: "Mr. Rahman",
    healthScore: 91,
    status: "ACTIVE",
  },
  {
    id: "2",
    departmentCode: "SEW",
    departmentName: "Sewing",
    banglaName: "সুইং",
    factoryCode: "MBN-001",
    category: "PRODUCTION",
    headCount: 950,
    managerName: "Mr. Karim",
    healthScore: 86,
    status: "ACTIVE",
  },
  {
    id: "3",
    departmentCode: "FIN",
    departmentName: "Finishing",
    banglaName: "ফিনিশিং",
    factoryCode: "MBN-001",
    category: "PRODUCTION",
    headCount: 260,
    managerName: "Mr. Hasan",
    healthScore: 89,
    status: "ACTIVE",
  },
  {
    id: "4",
    departmentCode: "QLT",
    departmentName: "Quality",
    banglaName: "কোয়ালিটি",
    factoryCode: "MBN-001",
    category: "SUPPORT",
    headCount: 140,
    managerName: "Ms. Nusrat",
    healthScore: 94,
    status: "ACTIVE",
  },
  {
    id: "5",
    departmentCode: "IE",
    departmentName: "Industrial Engineering",
    banglaName: "ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং",
    factoryCode: "MBN-001",
    category: "SUPPORT",
    headCount: 35,
    managerName: "Mr. Iqbal",
    healthScore: 92,
    status: "ACTIVE",
  },
  {
    id: "6",
    departmentCode: "MNT",
    departmentName: "Maintenance",
    banglaName: "মেইনটেন্যান্স",
    factoryCode: "MBN-001",
    category: "SUPPORT",
    headCount: 75,
    managerName: "Mr. Jalal",
    healthScore: 82,
    status: "ACTIVE",
  },
  {
    id: "7",
    departmentCode: "HR",
    departmentName: "Human Resources",
    banglaName: "মানবসম্পদ",
    factoryCode: "MBN-001",
    category: "ADMIN",
    headCount: 45,
    managerName: "Ms. Farzana",
    healthScore: 90,
    status: "ACTIVE",
  },
  {
    id: "8",
    departmentCode: "CMP",
    departmentName: "Compliance",
    banglaName: "কমপ্লায়েন্স",
    factoryCode: "MBN-001",
    category: "COMPLIANCE",
    headCount: 28,
    managerName: "Mr. Alam",
    healthScore: 96,
    status: "ACTIVE",
  },
];

function categoryClass(category: Department["category"]) {
  if (category === "PRODUCTION") {
    return "bg-blue-100 text-blue-700";
  }

  if (category === "SUPPORT") {
    return "bg-purple-100 text-purple-700";
  }

  if (category === "ADMIN") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-green-100 text-green-700";
}

export default function DepartmentMasterPage() {
  const totalDepartments = departments.length;

  const totalHeadCount = departments.reduce(
    (sum, department) => sum + department.headCount,
    0
  );

  const productionDepartments = departments.filter(
    (department) => department.category === "PRODUCTION"
  ).length;

  const supportDepartments = departments.filter(
    (department) => department.category === "SUPPORT"
  ).length;

  const averageHealth =
    departments.reduce(
      (sum, department) => sum + department.healthScore,
      0
    ) / departments.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Department Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Enterprise department administration for production, support,
            administration and compliance functions.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + New Department
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white">
          List
        </button>

        <button className="rounded-lg bg-white px-5 py-2 font-semibold text-gray-700 shadow">
          Create
        </button>

        <button className="rounded-lg bg-white px-5 py-2 font-semibold text-gray-700 shadow">
          Analytics
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-5">
        <Card title="Departments" value={totalDepartments.toString()} />
        <Card title="Head Count" value={totalHeadCount.toLocaleString()} />
        <Card title="Production" value={productionDepartments.toString()} />
        <Card title="Support" value={supportDepartments.toString()} />
        <Card title="Avg Health" value={`${averageHealth.toFixed(1)}%`} />
      </div>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            placeholder="Search Department..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>All Factories</option>
            <option>MBN-001</option>
            <option>MBN-002</option>
            <option>MBN-003</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Categories</option>
            <option>PRODUCTION</option>
            <option>SUPPORT</option>
            <option>ADMIN</option>
            <option>COMPLIANCE</option>
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
              <TH>Code</TH>
              <TH>Department</TH>
              <TH>Bangla</TH>
              <TH>Factory</TH>
              <TH>Category</TH>
              <TH>Manager</TH>
              <TH>Head Count</TH>
              <TH>Health</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr
                key={department.id}
                className="border-b hover:bg-blue-50"
              >
                <TD>
                  <span className="font-semibold">
                    {department.departmentCode}
                  </span>
                </TD>

                <TD>{department.departmentName}</TD>

                <TD>{department.banglaName}</TD>

                <TD>{department.factoryCode}</TD>

                <TD>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${categoryClass(
                      department.category
                    )}`}
                  >
                    {department.category}
                  </span>
                </TD>

                <TD>{department.managerName}</TD>

                <TD>{department.headCount.toLocaleString()}</TD>

                <TD>
                  <span className="font-bold text-green-700">
                    {department.healthScore}%
                  </span>
                </TD>

                <TD>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {department.status}
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