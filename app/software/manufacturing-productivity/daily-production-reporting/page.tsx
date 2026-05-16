"use client";

export default function DailyProductionReportingPage() {
  const sections = [
    {
      title: "Production Performance",
      color: "bg-blue-100 border-blue-300 text-blue-950",
    },
    {
      title: "Quality & Rejection",
      color: "bg-red-100 border-red-300 text-red-950",
    },
    {
      title: "Machine & Downtime",
      color: "bg-orange-100 border-orange-300 text-orange-950",
    },
    {
      title: "Labour & Attendance",
      color: "bg-emerald-100 border-emerald-300 text-emerald-950",
    },
    {
      title: "Material & Inventory",
      color: "bg-violet-100 border-violet-300 text-violet-950",
    },
    {
      title: "Operational Issues",
      color: "bg-pink-100 border-pink-300 text-pink-950",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-blue-950 via-violet-900 to-emerald-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Daily Production Reporting System
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Capture Daily Shop-Floor Data for Productivity Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This module collects daily production, quality, labour, machine,
            material, inventory, and operational issue data so that productivity
            dashboards and management decisions are based on real floor-level
            information.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-8 shadow-md ${item.color}`}
              >
                <h2 className="text-2xl font-extrabold">{item.title}</h2>

                <p className="mt-5 text-lg leading-relaxed">
                  Daily input data from this area feeds the productivity
                  dashboard, KPI analytics, bottleneck review, value-added
                  calculation, and AI-guided improvement recommendations.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-3xl font-extrabold text-blue-950">
              Daily Factory Report Form
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                "Date",
                "Factory / Site",
                "Department / Line",
                "Shift",
                "Supervisor",
                "Product / Style",
                "Target Output",
                "Actual Output",
                "Good Output",
                "Rejected Quantity",
                "Rework Quantity",
                "Opening Stock",
                "Purchases",
                "Closing Stock",
                "Material Consumed",
                "Machine Downtime Minutes",
                "Material Waiting Minutes",
                "Number of Operators",
                "Absent Staff",
                "Overtime Hours",
                "Main Bottleneck",
                "Customer Complaint",
                "Corrective Action Taken",
                "Next Improvement Action",
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

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="font-bold text-slate-700">
                  Operational Issues Today
                </span>
                <textarea
                  className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                  placeholder="Describe machine problems, quality issues, labour gaps, material delays, process delays, or customer complaints..."
                />
              </label>

              <label className="block">
                <span className="font-bold text-slate-700">
                  Supervisor Notes
                </span>
                <textarea
                  className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                  placeholder="Add supervisor observation, coaching need, improvement suggestion, or follow-up action..."
                />
              </label>
            </div>

            <button className="mt-8 rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-blue-800">
              Save Daily Production Report
            </button>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Input Responsibility
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Production staff, supervisors, quality teams, machine teams,
                cashiers, store staff, and managers can enter relevant daily
                operational information.
              </p>
            </div>

            <div className="rounded-3xl bg-violet-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-violet-950">
                Management Visibility
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Productivity teams, managers, top management, and owners can
                view daily trends, value-added performance, losses, bottlenecks,
                and improvement priorities.
              </p>
            </div>

            <div className="rounded-3xl bg-yellow-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-yellow-950">
                AI Interpretation
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-yellow-950">
                Future AI support can summarise daily issues, detect recurring
                problems, suggest coaching questions, and recommend practical
                improvement actions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}