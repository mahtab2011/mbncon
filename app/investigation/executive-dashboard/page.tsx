export default function ExecutiveInvestigationDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-slate-800">
        Executive Investigation Dashboard
      </h1>

      <p className="mt-2 text-slate-600">
        Live overview of all factory performance investigations.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Total Investigations
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            24
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Ongoing
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-700">
            11
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-700">
            10
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Critical
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-700">
            3
          </h2>
        </div>

      </div>

      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Live Investigation Status
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Current factory performance investigations under review.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="p-3">Factory</th>
                <th className="p-3">Department</th>
                <th className="p-3">Investigation Type</th>
                <th className="p-3">Lead Investigator</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">MBN Sample Factory</td>
                <td className="p-3">Sewing</td>
                <td className="p-3">Method Study</td>
                <td className="p-3">IE Team</td>
                <td className="p-3 text-blue-700 font-semibold">Ongoing</td>
                <td className="p-3 text-red-700 font-semibold">High</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-medium">Dhaka Apparel Unit</td>
                <td className="p-3">Cutting</td>
                <td className="p-3">Activity Sampling</td>
                <td className="p-3">Production Head</td>
                <td className="p-3 text-yellow-700 font-semibold">Under Review</td>
                <td className="p-3 text-yellow-700 font-semibold">Medium</td>
              </tr>

              <tr>
                <td className="p-3 font-medium">Chittagong Knit Plant</td>
                <td className="p-3">Finishing</td>
                <td className="p-3">Root Cause Analysis</td>
                <td className="p-3">Consultant</td>
                <td className="p-3 text-green-700 font-semibold">Completed</td>
                <td className="p-3 text-slate-600 font-semibold">Normal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Investigation Progress by Department
        </h2>

        <div className="mt-6 space-y-5">

          <div>
            <div className="flex justify-between">
              <span>Sewing</span>
              <span>80%</span>
            </div>

            <div className="mt-2 h-3 rounded-full bg-slate-200">
              <div className="h-3 w-4/5 rounded-full bg-blue-600"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Cutting</span>
              <span>45%</span>
            </div>

            <div className="mt-2 h-3 rounded-full bg-slate-200">
              <div className="h-3 w-[45%] rounded-full bg-yellow-500"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Finishing</span>
              <span>100%</span>
            </div>

            <div className="mt-2 h-3 rounded-full bg-slate-200">
              <div className="h-3 w-full rounded-full bg-green-600"></div>
            </div>
          </div>

        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Investigation Priority Queue
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Cases requiring management attention based on urgency, risk, and factory impact.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-bold text-red-800">
              High Priority
            </h3>

            <p className="mt-2 text-sm text-red-700">
              Sewing efficiency drop requires immediate IE investigation.
            </p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <h3 className="font-bold text-yellow-800">
              Medium Priority
            </h3>

            <p className="mt-2 text-sm text-yellow-700">
              Cutting delay trend needs department-level review.
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-bold text-green-800">
              Normal Priority
            </h3>

            <p className="mt-2 text-sm text-green-700">
              Finishing investigation completed and ready for learning review.
            </p>
          </div>
        </div>
      </section>
            <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Management Action Required
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Decisions or support needed from Factory Manager, Department Head, or Owner.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Approve IE team observation trial in Sewing Line 3
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Required by: Factory Manager
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Confirm overtime data for Cutting Department
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Required by: Department Head
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Review completed RCA findings for Finishing
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Required by: Owner / Senior Management
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}