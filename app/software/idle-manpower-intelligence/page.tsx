"use client";

import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const manpowerInsights = [
  "Idle operator detection",
  "Labour balancing intelligence",
  "Overtime dependency analysis",
  "Skill gap visibility",
  "Production bottleneck manpower mapping",
  "Attendance and absenteeism intelligence",
  "Operator productivity monitoring",
  "Line balancing improvement opportunities",
  "Department-level workforce utilization",
];

const kpis = [
  ["Workforce Visibility", "Live"],
  ["Idle Labour Monitoring", "Active"],
  ["Recovery Focus", "Productivity"],
  ["Operational Readiness", "AI Enabled"],
];

export default function IdleManpowerIntelligencePage() {
  return (
    <DashboardShell title="AI Idle Manpower Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-8">
          <section
            id={slugify("AI Idle Manpower Intelligence")}
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
              MBNCON AI Workforce Productivity Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              AI Idle Manpower Intelligence Engine
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              This module analyses idle operators, overloaded manpower,
              labour imbalance, overtime dependency, manpower bottlenecks,
              and workforce productivity recovery opportunities.
            </p>
          </section>

          <section
            id={slugify("Idle Manpower KPI")}
            className="scroll-mt-28 grid gap-6 md:grid-cols-4"
          >
            {kpis.map(([label, value]) => (
              <a
                key={label}
                href={`#${slugify(label)}`}
                id={slugify(label)}
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-red-300/40 hover:bg-red-500/10 hover:shadow-xl"
              >
                <p className="text-sm text-slate-400">{label}</p>

                <p className="mt-3 text-2xl font-bold text-red-300">
                  {value}
                </p>
              </a>
            ))}
          </section>

          <section
            id={slugify("AI Workforce Intelligence Modules")}
            className="scroll-mt-28 grid gap-6 md:grid-cols-3"
          >
            <div className="rounded-2xl border border-red-700 bg-red-950 p-5 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm text-red-300">Manpower Risk</p>

              <h2 className="mt-2 text-2xl font-bold">
                Monitoring
              </h2>

              <p className="mt-3 text-red-200">
                Idle manpower intelligence structure active.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-700 bg-orange-950 p-5 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm text-orange-300">
                Labour Balance
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Ready
              </h2>

              <p className="mt-3 text-orange-200">
                Next step will connect manpower, overtime,
                and production data.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm text-slate-400">
                Recovery Focus
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Productivity
              </h2>

              <p className="mt-3 text-slate-300">
                Helps management reduce idle labour and improve
                workforce utilization.
              </p>
            </div>
          </section>

          <section
            id={slugify("Workforce Productivity Intelligence Areas")}
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
                  AI Workforce Intelligence
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  Idle Manpower Analysis Areas
                </h2>
              </div>

              <div className="rounded-2xl bg-red-500/20 px-4 py-2 text-sm font-bold text-red-200">
                Executive Monitoring
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {manpowerInsights.map((item, index) => (
                <a
                  key={item}
                  href={`#${slugify(item)}`}
                  id={slugify(item)}
                  className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-red-300/40 hover:bg-red-500/10 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {item}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        AI-driven workforce productivity visibility,
                        manpower optimization, and operational recovery
                        intelligence.
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="scroll-mt-28 rounded-3xl border border-red-400/30 bg-red-500/10 p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-red-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-200">
              This intelligence engine helps MBNCON identify workforce
              inefficiencies, idle manpower risks, overtime dependency,
              and labour productivity improvement opportunities to support
              factory recovery, cost reduction, and operational excellence.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}