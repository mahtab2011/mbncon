"use client";

export default function AIProductivityAssistantPage() {
  const insights = [
    "Rejection rate is rising in stitching operations.",
    "Operator coaching is recommended for Line 2.",
    "Machine downtime is affecting daily output.",
    "Material waiting time is creating hidden productivity loss.",
  ];

  const prompts = [
    "Explain today’s productivity loss",
    "Suggest 3 improvement actions",
    "Prepare supervisor coaching questions",
    "Summarise bottlenecks for management",
    "Translate daily report for local team",
    "Create tomorrow’s action plan",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-indigo-950 via-violet-900 to-blue-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            AI Productivity Assistant Demo
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            AI-Guided Operational Support for Managers and Supervisors
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            A concept demo showing how AI can support productivity analysis,
            coaching, bottleneck review, daily action planning, and multilingual
            operational reporting.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-violet-950">
                AI Operational Conversation
              </h2>

              <div className="mt-8 space-y-5">
                <div className="max-w-2xl rounded-3xl bg-blue-100 p-6 text-blue-950">
                  <p className="font-bold">Manager</p>
                  <p className="mt-2 text-lg">
                    Why did productivity drop today in Line 1?
                  </p>
                </div>

                <div className="ml-auto max-w-3xl rounded-3xl bg-violet-900 p-6 text-white">
                  <p className="font-bold text-yellow-300">
                    AI Productivity Assistant
                  </p>
                  <p className="mt-2 text-lg leading-relaxed">
                    Today’s productivity drop appears to be linked to three
                    factors: increased machine downtime, higher rejection in
                    stitching, and material waiting time before the second
                    operation. I recommend checking the bottleneck operation,
                    reviewing operator skill gaps, and holding a short coaching
                    discussion with the line supervisor.
                  </p>
                </div>

                <div className="max-w-2xl rounded-3xl bg-emerald-100 p-6 text-emerald-950">
                  <p className="font-bold">Supervisor</p>
                  <p className="mt-2 text-lg">
                    What should we do tomorrow morning?
                  </p>
                </div>

                <div className="ml-auto max-w-3xl rounded-3xl bg-slate-900 p-6 text-white">
                  <p className="font-bold text-cyan-300">
                    AI Productivity Assistant
                  </p>
                  <p className="mt-2 text-lg leading-relaxed">
                    Start with a 15-minute team briefing. Review yesterday’s
                    rejection causes, assign one skilled operator to support the
                    bottleneck area, check machine readiness before production,
                    and track hourly output against the target.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Suggested AI Prompts
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {prompts.map((item) => (
                  <button
                    key={item}
                    className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-left text-lg font-bold text-violet-950 shadow-sm transition hover:bg-violet-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-linear-to-br from-blue-900 to-violet-900 p-8 text-white shadow-md">
              <h2 className="text-3xl font-extrabold text-yellow-300">
                Live Insights
              </h2>

              <div className="mt-8 space-y-4">
                {insights.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 p-5">
                    <p className="text-lg leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-yellow-100 p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-yellow-950">
                Coaching Support
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-yellow-950">
                The assistant can generate GROW-model coaching questions for
                supervisors, helping teams define goals, understand reality,
                explore options, and agree practical actions.
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-emerald-950">
                Multilingual Ready
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Future versions can explain daily productivity issues in local
                languages for shop-floor teams, supervisors, managers, and
                training groups.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}