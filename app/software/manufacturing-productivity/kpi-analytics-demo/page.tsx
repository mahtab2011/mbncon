"use client";

export default function KPIAnalyticsDemoPage() {
  const kpis = [
    { title: "Daily Output", value: "842 units", note: "+12% vs last week" },
    { title: "Efficiency", value: "84%", note: "Target: 90%" },
    { title: "Rejection Rate", value: "3.8%", note: "Target: below 2%" },
    { title: "Downtime", value: "46 min", note: "Main loss: Machine 4" },
    { title: "Wastage Cost", value: "$1,240", note: "Weekly estimate" },
    { title: "Training Need", value: "6 staff", note: "Skill gap detected" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-blue-950 via-slate-900 to-emerald-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            KPI & Analytics Demo
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Manufacturing KPI, Cost, Quality & Productivity Analytics
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            A concept dashboard showing how managers can monitor output,
            efficiency, rejection, downtime, wastage cost, skill gaps, and
            operational improvement priorities.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {kpis.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md"
              >
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-5 text-4xl font-extrabold text-blue-950">
                  {item.value}
                </h2>

                <p className="mt-4 text-lg text-slate-700">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Rejection Pareto View
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  ["Stitching", 78],
                  ["Skiving", 52],
                  ["Leather Selection", 35],
                  ["Moulding", 22],
                  ["Finishing", 14],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex justify-between text-lg font-bold">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-5 rounded-full bg-slate-200">
                      <div
                        className="h-5 rounded-full bg-linear-to-r from-red-600 to-orange-400"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-md">
              <h2 className="text-3xl font-extrabold text-cyan-300">
                AI Analytics Interpretation
              </h2>

              <div className="mt-8 space-y-5">
                <div className="rounded-2xl bg-white/10 p-5">
                  Stitching and skiving are contributing the majority of quality
                  losses. These areas should be prioritised for skill review,
                  standard method training, and supervisor coaching.
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  Machine 4 downtime is creating an output gap. Preventive
                  maintenance and pre-shift readiness checks are recommended.
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  Six employees may need targeted training based on efficiency
                  and rejection pattern comparison.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-linear-to-r from-violet-100 via-blue-100 to-emerald-100 p-8 shadow-md">
            <h2 className="text-3xl font-extrabold text-violet-950">
              Management Decision Support
            </h2>

            <p className="mt-5 max-w-5xl text-xl leading-relaxed text-violet-900">
              KPI analytics can help management identify where productivity is
              lost, which problems should be solved first, what training is
              required, where costs are increasing, and which improvement
              actions should be prioritised for measurable impact.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}