"use client";

const leanSystems = [
  {
    title: "Kaizen (改善)",
    subtitle: "Continuous Improvement",
    color: "bg-emerald-100 border-emerald-300 text-emerald-950",
    text:
      "Continuous workplace improvement through small practical changes involving all employees to improve productivity, quality, safety, discipline, teamwork, and operational performance.",
  },
  {
    title: "Gemba (現場)",
    subtitle: "The Actual Place",
    color: "bg-blue-100 border-blue-300 text-blue-950",
    text:
      "Managers and improvement teams should go directly to the shop floor where value is created to observe operations, identify problems, understand workflow, and support employees.",
  },
  {
    title: "Genchi Genbutsu (現地現物)",
    subtitle: "Go And See",
    color: "bg-violet-100 border-violet-300 text-violet-950",
    text:
      "Operational decisions should be based on direct observation, actual evidence, and real operational facts rather than assumptions or reports only.",
  },
  {
    title: "Muda (無駄)",
    subtitle: "Waste Elimination",
    color: "bg-red-100 border-red-300 text-red-950",
    text:
      "Identify and eliminate non-value-added activities such as overproduction, waiting, transport, excess inventory, unnecessary movement, defects, and rework.",
  },
  {
    title: "Mura (斑)",
    subtitle: "Unevenness",
    color: "bg-yellow-100 border-yellow-300 text-yellow-950",
    text:
      "Reduce imbalance, inconsistency, unstable workflow, and uneven production loading that create inefficiency and operational instability.",
  },
  {
    title: "Muri (無理)",
    subtitle: "Overburden",
    color: "bg-orange-100 border-orange-300 text-orange-950",
    text:
      "Prevent overburdening workers, supervisors, or machines beyond sustainable operational capability to reduce stress, defects, fatigue, and breakdowns.",
  },
  {
    title: "Kanban (看板)",
    subtitle: "Visual Pull System",
    color: "bg-cyan-100 border-cyan-300 text-cyan-950",
    text:
      "Visual inventory and workflow signalling system used to trigger replenishment, reduce excess stock, and support just-in-time operations.",
  },
  {
    title: "Andon (行灯)",
    subtitle: "Visual Control",
    color: "bg-pink-100 border-pink-300 text-pink-950",
    text:
      "Visual signal system used to highlight production status, abnormalities, downtime, machine issues, or quality problems for immediate response.",
  },
  {
    title: "Poka-Yoke (ポカヨケ)",
    subtitle: "Error Proofing",
    color: "bg-lime-100 border-lime-300 text-lime-950",
    text:
      "Design operational systems and tools to prevent human error, reduce mistakes, improve consistency, and avoid defects before they occur.",
  },
  {
    title: "Jidoka (自働化)",
    subtitle: "Intelligent Automation",
    color: "bg-slate-100 border-slate-300 text-slate-950",
    text:
      "Machines or processes automatically stop when abnormalities or defects are detected so problems are addressed immediately.",
  },
  {
    title: "Heijunka (平準化)",
    subtitle: "Production Leveling",
    color: "bg-indigo-100 border-indigo-300 text-indigo-950",
    text:
      "Balance production volume and workflow to reduce instability, minimise bottlenecks, and create smoother operational flow.",
  },
  {
    title: "5S Workplace Discipline",
    subtitle: "Organised Operational Environment",
    color: "bg-teal-100 border-teal-300 text-teal-950",
    text:
      "Sort, Simplify, Sweep, Standardise, and Sustain operational discipline to improve safety, efficiency, visibility, and workplace organisation.",
  },
];

export default function KaizenSystemPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      <section className="bg-linear-to-r from-emerald-950 via-blue-900 to-violet-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Lean Manufacturing & Kaizen System
          </p>

          <h1 className="max-w-6xl text-5xl font-extrabold leading-tight">
            Workplace Organisation, Continuous Improvement & Lean Operational Excellence
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            This system combines Kaizen philosophy, Lean Manufacturing tools,
            operational discipline, workplace organisation, waste elimination,
            visual management, and continuous improvement methodologies to
            improve productivity, quality, operational stability, teamwork,
            leadership, and business performance.
          </p>

        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl bg-white p-10 shadow-md">

            <h2 className="text-4xl font-extrabold text-emerald-950">
              Kaizen Philosophy
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              Kaizen means continuous improvement through small practical
              changes involving all employees. It combines workplace
              organisation, operational discipline, employee involvement,
              teamwork, leadership participation, and continuous improvement
              culture to create sustainable operational excellence.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl bg-emerald-100 p-6">
                <h3 className="text-2xl font-extrabold text-emerald-950">
                  Small Improvements
                </h3>

                <p className="mt-4 text-emerald-950">
                  Continuous small improvements often create major long-term
                  productivity gains.
                </p>
              </div>

              <div className="rounded-2xl bg-blue-100 p-6">
                <h3 className="text-2xl font-extrabold text-blue-950">
                  Employee Involvement
                </h3>

                <p className="mt-4 text-blue-950">
                  All employees participate in identifying problems and
                  suggesting improvement opportunities.
                </p>
              </div>

              <div className="rounded-2xl bg-violet-100 p-6">
                <h3 className="text-2xl font-extrabold text-violet-950">
                  Workplace Discipline
                </h3>

                <p className="mt-4 text-violet-950">
                  Cleanliness, organisation, standardisation, and operational
                  discipline create sustainable efficiency.
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-100 p-6">
                <h3 className="text-2xl font-extrabold text-yellow-950">
                  Continuous Learning
                </h3>

                <p className="mt-4 text-yellow-950">
                  Teams learn from operational problems and continuously improve
                  systems, methods, and behaviour.
                </p>
              </div>

            </div>
          </div>

          <div className="mt-14">

            <h2 className="text-4xl font-extrabold text-slate-900">
              Lean Manufacturing Operational Systems
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {leanSystems.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-3xl border p-8 shadow-md ${item.color}`}
                >
                  <h3 className="text-3xl font-extrabold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-lg font-bold opacity-80">
                    {item.subtitle}
                  </p>

                  <p className="mt-5 text-lg leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}

            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-slate-900 p-10 text-white shadow-md">

            <h2 className="text-4xl font-extrabold text-cyan-300">
              5S Workplace Organisation Methodology
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

              {[
                {
                  title: "Seiri",
                  subtitle: "Sort",
                },
                {
                  title: "Seiton",
                  subtitle: "Simplify",
                },
                {
                  title: "Seiso",
                  subtitle: "Sweep",
                },
                {
                  title: "Seiketsu",
                  subtitle: "Standardise",
                },
                {
                  title: "Shitsuke",
                  subtitle: "Sustain",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/10 p-6"
                >
                  <h3 className="text-3xl font-extrabold text-yellow-300">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xl font-bold text-white">
                    {item.subtitle}
                  </p>

                  <p className="mt-4 text-slate-300">
                    Workplace organisation discipline to improve operational
                    visibility, safety, productivity, and sustainability.
                  </p>
                </div>
              ))}

            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-white p-10 shadow-md">

            <h2 className="text-4xl font-extrabold text-slate-900">
              Lean Manufacturing Governance
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              {[
                "Top management commitment",
                "Employee participation",
                "Daily operational discipline",
                "Continuous improvement culture",
                "Visual management",
                "Standard work systems",
                "Shop-floor observation",
                "Operational measurement",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {item}
                  </h3>

                  <p className="mt-4 text-slate-700">
                    Important operational requirement for successful Lean
                    Manufacturing implementation and sustainment.
                  </p>
                </div>
              ))}

            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-orange-100 p-10 shadow-md">

            <h2 className="text-4xl font-extrabold text-orange-950">
              Future Expansion
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-orange-950">
              This Lean Manufacturing ecosystem can later connect with AI
              productivity assistants, live dashboards, digital Andon systems,
              OEE intelligence, bottleneck analysis, operational coaching,
              energy productivity, maintenance intelligence, and factory-wide
              continuous improvement tracking.
            </p>

          </div>

        </div>
      </section>

    </main>
  );
}