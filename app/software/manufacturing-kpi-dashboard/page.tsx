function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const kpis = [
  { title: "Production Output", value: "18,420", note: "Units today" },
  { title: "OEE", value: "86.7%", note: "Target 90%" },
  { title: "Downtime", value: "42 min", note: "Today" },
  { title: "Defect Rate", value: "1.8%", note: "Below 2.5%" },
];

const shifts = [
  {
    shift: "Morning Shift",
    output: "7,250 units",
    efficiency: "91%",
    status: "On Target",
    color: "bg-emerald-500",
  },
  {
    shift: "Afternoon Shift",
    output: "6,180 units",
    efficiency: "83%",
    status: "Watch",
    color: "bg-yellow-500",
  },
  {
    shift: "Night Shift",
    output: "4,990 units",
    efficiency: "78%",
    status: "Needs Action",
    color: "bg-red-500",
  },
];

const losses = [
  { reason: "Machine Breakdown", value: "34%" },
  { reason: "Changeover", value: "24%" },
  { reason: "Material Waiting", value: "18%" },
  { reason: "Quality Rework", value: "14%" },
  { reason: "Operator Waiting", value: "10%" },
];

const modules = [
  "OEE dashboard",
  "downtime tracking",
  "quality loss analysis",
  "production output board",
  "shift efficiency comparison",
  "safety incident tracking",
  "maintenance priority alerts",
  "delivery performance",
  "operator productivity",
  "energy usage monitoring",
  "cost of poor quality",
  "kaizen action tracking",
];

export default function ManufacturingKPIDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <section
          id="manufacturing-kpi-overview"
          className="scroll-mt-28"
        >
          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">
            Factory KPI Dashboard • Manufacturing Intelligence
          </span>

          <h1 className="mt-6 max-w-5xl text-5xl font-extrabold leading-tight">
            Real Manufacturing KPI Dashboard
          </h1>

          <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
            Live-style factory dashboard for production output, OEE, downtime,
            quality loss, shift efficiency, safety, delivery performance, and
            continuous improvement visibility.
          </p>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <a
              key={item.title}
              href={`#${slugify(item.title)}`}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl transition hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-emerald-500/10"
            >
              <p className="text-slate-400">{item.title}</p>

              <h2 className="mt-4 text-5xl font-extrabold text-emerald-300">
                {item.value}
              </h2>

              <p className="mt-3 text-slate-500">{item.note}</p>
            </a>
          ))}
        </section>

        <div className="mt-20 grid gap-8 xl:grid-cols-3">
          <section
            id="shift-performance-board"
            className="scroll-mt-28 rounded-3xl border border-slate-800 bg-slate-900 p-8 xl:col-span-2"
          >
            <h2 className="text-3xl font-bold">
              Shift Performance Board
            </h2>

            <div className="mt-10 space-y-6">
              {shifts.map((item) => (
                <a
                  key={item.shift}
                  href={`#${slugify(item.shift)}`}
                  className="block rounded-2xl bg-slate-950 p-6 transition hover:-translate-y-1 hover:bg-slate-900"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {item.shift}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        Output: {item.output} • Efficiency:{" "}
                        {item.efficiency}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`h-4 w-4 rounded-full ${item.color}`}
                      />

                      <span className="font-bold">{item.status}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section
            id="loss-pareto"
            className="scroll-mt-28 rounded-3xl border border-slate-800 bg-slate-900 p-8"
          >
            <h2 className="text-3xl font-bold">Loss Pareto</h2>

            <div className="mt-10 space-y-5">
              {losses.map((item) => (
                <div key={item.reason}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {item.reason}
                    </span>

                    <span className="font-bold text-emerald-300">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-emerald-400"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section
          id="factory-kpi-modules"
          className="mt-20 scroll-mt-28 rounded-3xl border border-slate-800 bg-slate-900 p-10"
        >
          <h2 className="text-4xl font-extrabold">
            Factory KPI Modules
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((item) => (
              <a
                key={item}
                id={slugify(item)}
                href={`#${slugify(item)}`}
                className="rounded-2xl bg-slate-950 p-6 text-lg capitalize text-slate-200 transition hover:-translate-y-1 hover:bg-slate-800"
              >
                {item}
              </a>
            ))}
          </div>
        </section>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl bg-emerald-700 p-10">
            <h2 className="text-3xl font-bold">
              Management Benefits
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-emerald-100">
              <li>• Faster shop-floor visibility</li>
              <li>• Better daily production control</li>
              <li>• Easier accountability reviews</li>
              <li>• Improved loss prioritization</li>
              <li>• Stronger continuous improvement focus</li>
              <li>• Better cross-functional decision making</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-10">
            <h2 className="text-3xl font-bold">
              Future Intelligence
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
              <li>• AI-generated daily factory briefing</li>
              <li>• Predictive downtime alerts</li>
              <li>• Root-cause recommendation engine</li>
              <li>• Smart shift handover reports</li>
              <li>• Mobile supervisor reporting</li>
              <li>• Executive KPI summary emails</li>
            </ul>
          </section>
        </div>

        <section className="mt-24 rounded-3xl bg-emerald-700 p-12 text-center shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            Make Factory Performance Visible Every Day
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-emerald-100">
            MBN Consultancy designs KPI dashboards that help teams see
            performance, understand losses, prioritize action, and improve
            productivity continuously.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-700 transition hover:scale-105">
            Request KPI Dashboard Consultation
          </button>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <section
              key={item.title}
              id={slugify(item.title)}
              className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">
                {item.title}
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {item.value}
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                Executive KPI visibility for manufacturing leadership,
                operational control, loss monitoring, and productivity
                improvement.
              </p>
            </section>
          ))}
        </section>
      </section>
    </main>
  );
}