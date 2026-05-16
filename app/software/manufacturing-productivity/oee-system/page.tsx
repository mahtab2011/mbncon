export default function OEESystemPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl">
          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">
            OEE Intelligence • Manufacturing Analytics
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            OEE Dashboard Intelligence System
          </h1>

          <p className="mt-8 text-xl leading-9 text-slate-300">
            Monitor manufacturing effectiveness in real time through
            Availability, Performance, and Quality analytics combined with
            intelligent downtime tracking and operational visibility.
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Overall OEE",
              value: "87%",
              color: "text-emerald-400",
            },
            {
              title: "Availability",
              value: "91%",
              color: "text-cyan-400",
            },
            {
              title: "Performance",
              value: "84%",
              color: "text-yellow-400",
            },
            {
              title: "Quality",
              value: "96%",
              color: "text-pink-400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl"
            >
              <p className="text-lg text-slate-400">{item.title}</p>

              <h2 className={`mt-4 text-6xl font-extrabold ${item.color}`}>
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* LIVE FACTORY DASHBOARD */}
        <div className="mt-20 grid gap-8 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 xl:col-span-2">
            <h2 className="text-3xl font-bold">
              Live Production Intelligence
            </h2>

            <div className="mt-10 space-y-6">
              {[
                {
                  machine: "Filling Line 01",
                  status: "Running",
                  efficiency: "92%",
                  color: "bg-emerald-500",
                },
                {
                  machine: "Packaging Line 03",
                  status: "Minor Stop",
                  efficiency: "71%",
                  color: "bg-yellow-500",
                },
                {
                  machine: "Injection Machine 05",
                  status: "Running",
                  efficiency: "88%",
                  color: "bg-emerald-500",
                },
                {
                  machine: "Printing Line 02",
                  status: "Breakdown",
                  efficiency: "43%",
                  color: "bg-red-500",
                },
              ].map((item) => (
                <div
                  key={item.machine}
                  className="rounded-2xl bg-slate-900 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {item.machine}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        Current Efficiency: {item.efficiency}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full ${item.color}`} />

                      <span className="text-lg font-semibold">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOWNTIME */}
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8">
            <h2 className="text-3xl font-bold">
              Downtime Analysis
            </h2>

            <div className="mt-10 space-y-5">
              {[
                {
                  reason: "Changeover",
                  value: "21%",
                },
                {
                  reason: "Mechanical Failure",
                  value: "34%",
                },
                {
                  reason: "Material Delay",
                  value: "17%",
                },
                {
                  reason: "Operator Waiting",
                  value: "11%",
                },
                {
                  reason: "Power Interruption",
                  value: "8%",
                },
              ].map((item) => (
                <div key={item.reason}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">
                      {item.reason}
                    </span>

                    <span className="font-bold text-emerald-400">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-3 rounded-full bg-slate-700">
                    <div
                      className="h-3 rounded-full bg-emerald-400"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SMART ANALYTICS */}
        <div className="mt-20 rounded-3xl border border-slate-700 bg-slate-800 p-10">
          <h2 className="text-4xl font-extrabold">
            Smart Manufacturing Analytics
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              "real-time machine monitoring",
              "downtime intelligence",
              "production bottleneck detection",
              "availability trend analysis",
              "reject rate tracking",
              "predictive maintenance alerts",
              "operator productivity analysis",
              "live OEE dashboarding",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-900 p-6 text-lg capitalize text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* FUTURE AI */}
        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-emerald-600 p-10">
            <h2 className="text-3xl font-bold">
              Future AI Features
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-emerald-100">
              <li>• AI downtime prediction</li>
              <li>• Automatic root-cause analysis</li>
              <li>• Predictive machine health scoring</li>
              <li>• Intelligent production scheduling</li>
              <li>• AI quality risk alerts</li>
              <li>• Smart maintenance planning</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-800 p-10 border border-slate-700">
            <h2 className="text-3xl font-bold">
              Business Impact
            </h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
              <li>• Reduce downtime losses</li>
              <li>• Increase machine utilization</li>
              <li>• Improve productivity visibility</li>
              <li>• Improve production planning</li>
              <li>• Reduce operational waste</li>
              <li>• Strengthen decision-making</li>
            </ul>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-24 rounded-3xl bg-linear-to-r from-emerald-600 to-cyan-600 p-12 text-center shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            Turn Factory Data Into Operational Intelligence
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-emerald-100">
            MBN Consultancy combines lean manufacturing, operational
            excellence, AI analytics, and intelligent dashboards to help
            factories improve performance continuously.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-700 transition hover:scale-105">
            Request OEE Consultation
          </button>
        </div>
      </section>
    </main>
  );
}