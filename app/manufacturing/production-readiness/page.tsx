"use client";

type ReadinessCheck = {
  item: string;
  status: "READY" | "PENDING";
  remark: string;
};

const readinessChecks: ReadinessCheck[] = [
  {
    item: "Style Approved",
    status: "READY",
    remark: "Latest style bulletin approved.",
  },
  {
    item: "Fabric Available",
    status: "READY",
    remark: "Bulk fabric received.",
  },
  {
    item: "Trims Available",
    status: "READY",
    remark: "Accessories received.",
  },
  {
    item: "Production Line",
    status: "READY",
    remark: "Line L-001 allocated.",
  },
  {
    item: "Machines Ready",
    status: "READY",
    remark: "Preventive maintenance completed.",
  },
  {
    item: "Operators Assigned",
    status: "READY",
    remark: "46 operators assigned.",
  },
  {
    item: "Skill Verification",
    status: "READY",
    remark: "Required skills available.",
  },
  {
    item: "Operation Bulletin",
    status: "READY",
    remark: "AI bulletin approved.",
  },
  {
    item: "Quality Sample",
    status: "PENDING",
    remark: "PP sample approval awaited.",
  },
  {
    item: "Thread Availability",
    status: "PENDING",
    remark: "Issue remaining thread cones.",
  },
];

const readinessScore = 94;

export default function ProductionReadinessPage() {
  const readyItems = readinessChecks.filter(
    (item) => item.status === "READY"
  ).length;

  const pendingItems = readinessChecks.filter(
    (item) => item.status === "PENDING"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Production Readiness Centre
        </h1>

        <p className="mt-2 text-gray-600">
          AI verifies whether a production line is ready before starting bulk
          production.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Readiness Score
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-700">
            {readinessScore}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Status
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            READY
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Ready Items
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {readyItems}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Pending Items
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-700">
            {pendingItems}
          </h2>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">
                Verification Item
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                AI Remark
              </th>
            </tr>
          </thead>

          <tbody>
            {readinessChecks.map((check) => (
              <tr
                key={check.item}
                className="border-b hover:bg-blue-50"
              >
                <td className="px-4 py-3">
                  {check.item}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      check.status === "READY"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {check.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {check.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Recommendation
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
          <li>Approve PP sample before bulk production.</li>
          <li>Issue remaining thread cones from store.</li>
          <li>Reconfirm operator attendance before shift start.</li>
          <li>Perform a 30-minute pilot run and verify quality.</li>
        </ul>
      </div>
    </main>
  );
}