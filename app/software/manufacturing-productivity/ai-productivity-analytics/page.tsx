export default function AIProductivityAnalyticsPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-indigo-950 to-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-300">
          AI Productivity Analytics • Manufacturing Intelligence
        </span>

        <h1 className="mt-6 max-w-5xl text-5xl font-extrabold leading-tight">
          Turn Operational Data Into AI-Powered Productivity Decisions
        </h1>

        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          MBN Consultancy helps factories use AI analytics to understand
          productivity losses, detect bottlenecks, predict risks, improve
          labour efficiency, reduce waste, and support faster management
          decisions.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Productivity Score", value: "88%" },
            { title: "Waste Risk", value: "Medium" },
            { title: "Bottleneck Alert", value: "Line 03" },
            { title: "AI Saving Estimate", value: "£18.4k" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-indigo-800 bg-slate-900 p-8 shadow-2xl"
            >
              <p className="text-slate-400">{item.title}</p>
              <h2 className="mt-4 text-4xl font-extrabold text-indigo-300">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-indigo-800 bg-slate-900 p-8 lg:col-span-2">
            <h2 className="text-3xl font-bold">AI Insight Engine</h2>

            <div className="mt-8 space-y-5">
              {[
                "Line 03 shows repeated minor stops during afternoon shift.",
                "Material waiting time increased by 12% this week.",
                "Operator movement pattern suggests layout improvement opportunity.",
                "Defect risk is rising in Batch A-204 due to process variation.",
                "Maintenance should inspect Packaging Machine 02 within 48 hours.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-800 bg-indigo-900/40 p-8">
            <h2 className="text-3xl font-bold">AI Decision Support</h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-indigo-100">
              <li>• Prioritize bottlenecks</li>
              <li>• Recommend corrective actions</li>
              <li>• Predict downtime risk</li>
              <li>• Identify waste hotspots</li>
              <li>• Support manager decisions</li>
              <li>• Improve daily accountability</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-indigo-800 bg-slate-900 p-10">
          <h2 className="text-4xl font-extrabold">
            Productivity Intelligence Modules
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              "AI bottleneck analysis",
              "labour productivity scoring",
              "machine performance prediction",
              "waste heatmap intelligence",
              "quality risk detection",
              "maintenance priority ranking",
              "shift performance comparison",
              "management action tracking",
              "cost saving estimation",
              "root cause suggestion",
              "daily performance briefing",
              "continuous improvement analytics",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-indigo-950 p-6 text-lg capitalize text-indigo-100"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-indigo-700 p-10">
            <h2 className="text-3xl font-bold">Business Benefits</h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-indigo-100">
              <li>• Faster management decisions</li>
              <li>• Reduced operational waste</li>
              <li>• Better labour utilization</li>
              <li>• Improved production stability</li>
              <li>• Earlier risk detection</li>
              <li>• Stronger continuous improvement culture</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-indigo-800 bg-slate-900 p-10">
            <h2 className="text-3xl font-bold">Future AI Capabilities</h2>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
              <li>• Voice-based factory reporting</li>
              <li>• AI coaching for supervisors</li>
              <li>• Predictive quality alerts</li>
              <li>• AI-generated kaizen plans</li>
              <li>• Smart workforce planning</li>
              <li>• Executive productivity briefing</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 rounded-3xl bg-linear-to-r from-indigo-600 to-cyan-600 p-12 text-center shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            AI Makes Productivity Visible
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-indigo-100">
            MBN Consultancy combines operational excellence, behavioural
            systems, lean manufacturing, and AI analytics to help organizations
            improve performance continuously.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-indigo-700 transition hover:scale-105">
            Request AI Productivity Consultation
          </button>
        </div>
      </section>
    </main>
  );
}