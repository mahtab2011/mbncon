"use client";

type KPI = {
  title: string;
  value: string;
  color: string;
};

const executiveKPIs: KPI[] = [
  { title: "Factory Health", value: "92%", color: "text-green-700" },
  { title: "Production", value: "81%", color: "text-blue-700" },
  { title: "Quality", value: "98%", color: "text-green-700" },
  { title: "Shipment", value: "96%", color: "text-purple-700" },
  { title: "OEE", value: "87%", color: "text-orange-700" },
  { title: "AI Confidence", value: "95%", color: "text-indigo-700" },
];

const aiAlerts = [
  "Collar Attach bottleneck detected on Line L-002.",
  "Machine MC-014 preventive maintenance due within 48 hours.",
  "Learning curve improving for HNM-POLO-2401.",
  "Shipment confidence increased after AI optimization.",
];

const executiveActions = [
  "Approve PP sample.",
  "Move OPR-142 to Collar Attach.",
  "Replace MC-014 with standby MC-021.",
  "Reduce WIP before Collar Attach.",
];

const lineStatus = [
  { line: "L-001", efficiency: 84, status: "🟢 Running" },
  { line: "L-002", efficiency: 73, status: "🟡 Warning" },
  { line: "L-003", efficiency: 61, status: "🔴 Stopped" },
  { line: "L-004", efficiency: 91, status: "🟢 Running" },
];

export default function ManufacturingCommandWallPage() {
  return (
    <main className="min-h-screen bg-slate-900 p-8 text-white">

      <div className="mb-10 text-center">

        <h1 className="text-5xl font-bold text-cyan-400">
          Manufacturing Intelligence Command Wall
        </h1>

        <p className="mt-3 text-slate-300 text-lg">
          Enterprise AI Command Centre • Executive Decision Wall
        </p>

      </div>

      {/* Executive KPI Wall */}

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">

        {executiveKPIs.map((item) => (

          <div
            key={item.title}
            className="rounded-xl bg-slate-800 p-6 shadow-lg"
          >

            <p className="text-sm text-slate-400">
              {item.title}
            </p>

            <h2 className={`mt-3 text-4xl font-bold ${item.color}`}>
              {item.value}
            </h2>

          </div>

        ))}

      </div>

      {/* Middle Section */}

      <div className="mt-8 grid gap-8 xl:grid-cols-3">

        {/* Factory */}

        <section className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            Digital Factory
          </h2>

          <div className="space-y-4">

            {lineStatus.map((line) => (

              <div
                key={line.line}
                className="rounded-lg bg-slate-700 p-4"
              >

                <div className="flex justify-between">

                  <h3 className="font-bold">
                    {line.line}
                  </h3>

                  <span>
                    {line.status}
                  </span>

                </div>

                <p className="mt-2">
                  Efficiency : {line.efficiency}%
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* AI Alerts */}

        <section className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            AI Alerts
          </h2>

          <ul className="space-y-3">

            {aiAlerts.map((alert) => (

              <li
                key={alert}
                className="rounded-lg bg-slate-700 p-4"
              >
                {alert}
              </li>

            ))}

          </ul>

        </section>

        {/* Executive Actions */}

        <section className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-green-400">
            Executive Actions
          </h2>

          <ul className="space-y-3">

            {executiveActions.map((action) => (

              <li
                key={action}
                className="rounded-lg bg-slate-700 p-4"
              >
                ✓ {action}
              </li>

            ))}

          </ul>

        </section>

      </div>

      {/* Executive Summary */}

      <section className="mt-10 rounded-xl border border-cyan-500 bg-slate-800 p-8">

        <h2 className="text-3xl font-bold text-cyan-400">
          Executive AI Summary
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          The Manufacturing Intelligence Suite has analyzed production,
          planning, machine health, operator allocation, line optimization,
          shipment readiness, learning curves, and factory health. Current
          factory health is stable at <strong>92%</strong>. AI predicts
          continued improvement provided preventive maintenance is completed,
          the Collar Attach bottleneck is addressed, and the recommended
          operator allocation plan is implemented.
        </p>

      </section>

    </main>
  );
}