"use client";

export default function DailyProductionReportPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-emerald-900 via-blue-900 to-violet-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Daily Production Report
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Shop-Floor Data Entry for Live Productivity Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This report captures daily operational activity from the production
            floor so that dashboards, KPI analytics, bottleneck analysis, and
            management decisions are based on real operational data.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-blue-950">
                Production Entry Form
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  "Date",
                  "Factory / Site",
                  "Department / Line",
                  "Product / Style",
                  "Shift",
                  "Supervisor",
                  "Target Output",
                  "Actual Output",
                  "Good Output",
                  "Rejected Quantity",
                  "Rework Quantity",
                  "Machine Downtime Minutes",
                  "Material Waiting Minutes",
                  "Number of Operators",
                  "Absent Staff",
                  "Overtime Hours",
                ].map((label) => (
                  <label key={label} className="block">
                    <span className="font-bold text-slate-700">{label}</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-8">
                <label className="block">
                  <span className="font-bold text-slate-700">
                    Main Operational Issues Today
                  </span>
                  <textarea
                    className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: Machine 4 downtime, material delay, operator skill gap, quality issue..."
                  />
                </label>
              </div>

              <button className="mt-8 rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-blue-800">
                Save Daily Report
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-yellow-100 p-8 shadow-md">
                <h3 className="text-3xl font-extrabold text-yellow-950">
                  Why This Data Matters
                </h3>

                <p className="mt-5 text-lg leading-relaxed text-yellow-950">
                  Daily floor reports become the foundation for productivity
                  dashboards, rejection analysis, downtime tracking, labour
                  efficiency, and AI-guided improvement recommendations.
                </p>
              </div>

              <div className="rounded-3xl bg-blue-100 p-8 shadow-md">
                <h3 className="text-3xl font-extrabold text-blue-950">
                  Dashboard Connection
                </h3>

                <p className="mt-5 text-lg leading-relaxed text-blue-950">
                  Actual output, target output, rejected quantity, downtime,
                  absenteeism, and operational issues will feed directly into
                  KPI analytics and management decision support.
                </p>
              </div>

              <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
                <h3 className="text-3xl font-extrabold text-emerald-950">
                  Future Live System
                </h3>

                <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                  Later this form can save data to Firebase, generate live
                  dashboards, trigger alerts, and create daily improvement
                  summaries for managers and supervisors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}