"use client";

export default function DashboardDemoPage() {
  const kpis = [
    {
      title: "Production Efficiency",
      value: "82%",
      color: "bg-emerald-100 border-emerald-300 text-emerald-950",
    },
    {
      title: "Rejection Rate",
      value: "5.2%",
      color: "bg-red-100 border-red-300 text-red-950",
    },
    {
      title: "Machine Downtime",
      value: "11%",
      color: "bg-orange-100 border-orange-300 text-orange-950",
    },
    {
      title: "On-Time Delivery",
      value: "91%",
      color: "bg-blue-100 border-blue-300 text-blue-950",
    },
  ];

  const bottlenecks = [
    "Cutting Section Delay",
    "Operator Skill Gap",
    "Machine Maintenance Delay",
    "Material Waiting Time",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* HERO */}
      <section className="bg-linear-to-r from-blue-900 via-violet-800 to-red-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Dashboard Demo
          </p>

          <h1 className="text-5xl font-extrabold leading-tight">
            Manufacturing Productivity Intelligence Dashboard
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/90">
            Example operational visibility dashboard combining productivity
            tracking, bottleneck analysis, quality visibility, workflow
            monitoring, and AI-guided operational insights.
          </p>

        </div>
      </section>

      {/* KPI CARDS */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {kpis.map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-8 shadow-md ${item.color}`}
              >
                <p className="text-lg font-bold uppercase tracking-wide">
                  {item.title}
                </p>

                <h2 className="mt-6 text-5xl font-extrabold">
                  {item.value}
                </h2>

                <p className="mt-4 text-lg">
                  Real-time operational visibility and measurable
                  productivity tracking.
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* DASHBOARD GRID */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">

            {/* PRODUCTIVITY TREND */}
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h3 className="text-3xl font-extrabold text-slate-900">
                Productivity Trend
              </h3>

              <div className="mt-10 flex h-72 items-end gap-4 rounded-2xl bg-slate-100 p-6">

                {[55, 68, 61, 74, 78, 82, 88].map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div
                      className="w-full rounded-t-2xl bg-linear-to-t from-blue-700 to-cyan-400"
                      style={{ height: `${height * 2}px` }}
                    />

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      W{index + 1}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* OPERATOR TABLE */}
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h3 className="text-3xl font-extrabold text-slate-900">
                Operator Productivity Visibility
              </h3>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-200 text-left">
                      <th className="rounded-l-xl p-4">Operator</th>
                      <th className="p-4">Efficiency</th>
                      <th className="p-4">Rejections</th>
                      <th className="rounded-r-xl p-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      ["Rahman", "88%", "1.5%", "Excellent"],
                      ["Karim", "76%", "3.2%", "Needs Coaching"],
                      ["Fatema", "91%", "1.1%", "Excellent"],
                      ["Sadia", "69%", "5.4%", "Training Required"],
                    ].map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-200"
                      >
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className="p-4 text-lg"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* AI PANEL */}
            <div className="rounded-3xl bg-linear-to-br from-violet-900 to-blue-900 p-8 text-white shadow-md">
              <h3 className="text-3xl font-extrabold text-cyan-300">
                AI Productivity Assistant
              </h3>

              <div className="mt-8 space-y-4">

                {[
                  "Cutting section delay increasing by 12%",
                  "Operator training recommended in stitching line",
                  "Rejection trend improved for Line 3",
                  "Machine downtime alert triggered",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/10 p-4"
                  >
                    <p className="text-lg leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* BOTTLENECKS */}
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h3 className="text-3xl font-extrabold text-slate-900">
                Current Bottlenecks
              </h3>

              <div className="mt-8 space-y-4">

                {bottlenecks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-red-200 bg-red-100 p-5"
                  >
                    <p className="text-lg font-bold text-red-950">
                      {item}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* CONTINUOUS IMPROVEMENT */}
            <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
              <h3 className="text-3xl font-extrabold text-emerald-950">
                Continuous Improvement
              </h3>

              <p className="mt-6 text-lg leading-relaxed text-emerald-950">
                14 active improvement projects currently under review.
                6 operational improvements successfully sustained
                this quarter.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}