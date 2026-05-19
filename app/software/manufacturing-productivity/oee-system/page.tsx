"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OEESystemPage() {
  const kpiCards = [
    {
      title: "Overall Equipment Effectiveness",
      shortTitle: "Overall OEE",
      value: "87%",
      color: "text-emerald-400",
      meaning:
        "OEE means Overall Equipment Effectiveness. It measures how effectively machines, production lines, or equipment are being used by combining Availability, Performance, and Quality.",
    },
    {
      title: "Availability",
      shortTitle: "Availability",
      value: "91%",
      color: "text-cyan-400",
      meaning:
        "Availability shows how much planned production time was actually available for production after deducting breakdowns, changeovers, waiting time, and stoppages.",
    },
    {
      title: "Performance",
      shortTitle: "Performance",
      value: "84%",
      color: "text-yellow-400",
      meaning:
        "Performance shows whether the machine or line is producing at the expected speed compared with the ideal production rate.",
    },
    {
      title: "Quality",
      shortTitle: "Quality",
      value: "96%",
      color: "text-pink-400",
      meaning:
        "Quality shows the percentage of good output compared with total output after deducting defects, rejects, rework, and quality losses.",
    },
  ];

  const liveMachines = [
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
  ];

  const downtimeReasons = [
    { reason: "Changeover", value: "21%" },
    { reason: "Mechanical Failure", value: "34%" },
    { reason: "Material Delay", value: "17%" },
    { reason: "Operator Waiting", value: "11%" },
    { reason: "Power Interruption", value: "8%" },
  ];

  const smartAnalytics = [
    "real-time machine monitoring",
    "downtime intelligence",
    "production bottleneck detection",
    "availability trend analysis",
    "reject rate tracking",
    "predictive maintenance alerts",
    "operator productivity analysis",
    "live OEE dashboarding",
  ];

  const aiFeatures = [
    "AI downtime prediction",
    "Automatic root-cause analysis",
    "Predictive machine health scoring",
    "Intelligent production scheduling",
    "AI quality risk alerts",
    "Smart maintenance planning",
  ];

  const businessImpact = [
    "Reduce downtime losses",
    "Increase machine utilization",
    "Improve productivity visibility",
    "Improve production planning",
    "Reduce operational waste",
    "Strengthen decision-making",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              Overall Equipment Effectiveness Intelligence • Manufacturing Analytics
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              OEE Dashboard Intelligence System
            </h1>

            <p className="mt-8 text-xl leading-9 text-slate-300">
              OEE means <strong>Overall Equipment Effectiveness</strong>. It is
              a manufacturing performance measure that explains how effectively
              machines, production lines, and factory equipment are being used.
              It combines three important areas: Availability, Performance, and
              Quality.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              In simple language, OEE helps management understand whether the
              factory lost productivity because machines were stopped, machines
              were running slowly, or products were rejected due to quality
              problems.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-extrabold text-slate-900">
              What Does OEE Mean?
            </h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "Availability",
                  text:
                    "Was the machine available when production was planned? This is affected by breakdowns, changeovers, waiting time, setup time, and stoppages.",
                },
                {
                  title: "Performance",
                  text:
                    "Was the machine running at the correct speed? This is affected by slow running, minor stops, operator waiting, material delay, and process imbalance.",
                },
                {
                  title: "Quality",
                  text:
                    "How much good output was produced? This is affected by defects, rejection, rework, scrap, and customer quality complaints.",
                },
              ].map((item) => {
                const id = slugify(item.title);

                return (
                  <a
                    key={item.title}
                    href={`#${id}`}
                    className="scroll-mt-28 rounded-3xl bg-emerald-50 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h3
                      id={id}
                      className="text-2xl font-extrabold text-emerald-950"
                    >
                      {item.title}
                    </h3>

                    <p className="mt-4 text-lg leading-8 text-emerald-900">
                      {item.text}
                    </p>
                  </a>
                );
              })}
            </div>

            <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
              <h3 className="text-3xl font-extrabold text-cyan-300">
                Simple OEE Formula
              </h3>

              <p className="mt-5 text-2xl font-bold">
                OEE = Availability × Performance × Quality
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Example: if Availability is 91%, Performance is 84%, and
                Quality is 96%, the OEE score shows the real productive use of
                equipment after time loss, speed loss, and quality loss.
              </p>
            </div>
          </section>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-lg text-slate-400">{item.shortTitle}</p>

                  <h2 className={`mt-4 text-6xl font-extrabold ${item.color}`}>
                    {item.value}
                  </h2>

                  <p
                    id={id}
                    className="mt-5 text-sm leading-6 text-slate-300"
                  >
                    {item.meaning}
                  </p>
                </a>
              );
            })}
          </div>

          <div className="mt-20 grid gap-8 xl:grid-cols-3">
            <section className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl xl:col-span-2">
              <h2 className="text-3xl font-bold">
                Live Production Intelligence
              </h2>

              <div className="mt-10 space-y-6">
                {liveMachines.map((item) => {
                  const id = slugify(item.machine);

                  return (
                    <div
                      key={item.machine}
                      id={id}
                      className="scroll-mt-28 rounded-2xl bg-slate-100 p-6 transition duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {item.machine}
                          </h3>

                          <p className="mt-2 text-slate-600">
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
                  );
                })}
              </div>
            </section>

            <section className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <h2 className="text-3xl font-bold">
                Downtime Analysis
              </h2>

              <div className="mt-10 space-y-5">
                {downtimeReasons.map((item) => (
                  <div
                    key={item.reason}
                    className="transition duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">
                        {item.reason}
                      </span>

                      <span className="font-bold text-emerald-700">
                        {item.value}
                      </span>
                    </div>

                    <div className="mt-2 h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-emerald-500"
                        style={{ width: item.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-20 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-extrabold">
              Smart Manufacturing Analytics
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {smartAnalytics.map((item) => {
                const id = slugify(item);

                return (
                  <div
                    key={item}
                    id={id}
                    className="scroll-mt-28 rounded-2xl bg-slate-100 p-6 text-lg capitalize text-slate-800 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl bg-emerald-700 p-10 text-white shadow-xl">
              <h2 className="text-3xl font-bold">
                Future AI Features
              </h2>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-emerald-100">
                {aiFeatures.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-white/10 p-4 transition duration-300 hover:bg-white/20"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
              <h2 className="text-3xl font-bold">
                Business Impact
              </h2>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
                {businessImpact.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-white/10 p-4 transition duration-300 hover:bg-white/20"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-24 rounded-3xl bg-emerald-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              Turn Factory Data Into Operational Intelligence
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-emerald-100">
              MBN Consultancy combines lean manufacturing, operational
              excellence, AI analytics, and intelligent dashboards to help
              factories improve performance continuously through clear OEE
              visibility.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Overall Equipment Effectiveness Consultation
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}