"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function KPIAnalyticsDemoPage() {
  const kpis = [
    {
      title: "Daily Output",
      value: "842 units",
      note: "+12% vs last week",
    },
    {
      title: "Efficiency",
      value: "84%",
      note: "Target: 90%",
    },
    {
      title: "Rejection Rate",
      value: "3.8%",
      note: "Target: below 2%",
    },
    {
      title: "Downtime",
      value: "46 min",
      note: "Main loss: Machine 4",
    },
    {
      title: "Wastage Cost",
      value: "$1,240",
      note: "Weekly estimate",
    },
    {
      title: "Training Need",
      value: "6 staff",
      note: "Skill gap detected",
    },
  ];

  const paretoData = [
    ["Stitching", 78],
    ["Skiving", 52],
    ["Leather Selection", 35],
    ["Moulding", 22],
    ["Finishing", 14],
  ];

  const aiInsights = [
    "Stitching and skiving are contributing the majority of quality losses. These areas should be prioritised for skill review, standard method training, and supervisor coaching.",
    "Machine 4 downtime is creating an output gap. Preventive maintenance and pre-shift readiness checks are recommended.",
    "Six employees may need targeted training based on efficiency and rejection pattern comparison.",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
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

      {/* KPI CARDS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {kpis.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                    {item.title}
                  </p>

                  <h2
                    id={id}
                    className="mt-5 text-4xl font-extrabold text-blue-950"
                  >
                    {item.value}
                  </h2>

                  <p className="mt-4 text-lg text-slate-700">
                    {item.note}
                  </p>
                </a>
              );
            })}
          </div>

          {/* ANALYTICS GRID */}
          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            {/* PARETO */}
            <section
              id={slugify("Rejection Pareto View")}
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md"
            >
              <h2 className="text-3xl font-extrabold text-slate-900">
                Rejection Pareto View
              </h2>

              <div className="mt-8 space-y-5">
                {paretoData.map(([label, value]) => (
                  <div
                    key={label as string}
                    className="transition duration-300 hover:scale-[1.01]"
                  >
                    <div className="mb-2 flex justify-between text-lg font-bold">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>

                    <div className="h-5 rounded-full bg-slate-200">
                      <div
                        className="h-5 rounded-full bg-red-500 transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI INTERPRETATION */}
            <section
              id={slugify("AI Analytics Interpretation")}
              className="scroll-mt-28 rounded-3xl bg-slate-900 p-8 text-white shadow-md"
            >
              <h2 className="text-3xl font-extrabold text-cyan-300">
                AI Analytics Interpretation
              </h2>

              <div className="mt-8 space-y-5">
                {aiInsights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/20 hover:shadow-lg"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* MANAGEMENT SUPPORT */}
          <section
            id={slugify("Management Decision Support")}
            className="scroll-mt-28 mt-10 rounded-3xl bg-violet-100 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-3xl font-extrabold text-violet-950">
              Management Decision Support
            </h2>

            <p className="mt-5 max-w-5xl text-xl leading-relaxed text-violet-900">
              KPI analytics can help management identify where productivity is
              lost, which problems should be solved first, what training is
              required, where costs are increasing, and which improvement
              actions should be prioritised for measurable impact.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}