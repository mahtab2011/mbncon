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

const overtimeDrivers = [
  "Weak production planning",
  "Shipment pressure",
  "Line balancing inefficiency",
  "Machine downtime",
  "High rejection & rework",
  "Operator shortage",
  "Late material arrival",
  "Poor workflow coordination",
];

const optimizationAreas = [
  "Line balancing improvement",
  "Shift optimization",
  "Operator multi-skilling",
  "Production planning accuracy",
  "Bottleneck reduction",
  "Preventive maintenance",
  "Idle-time reduction",
  "Labour utilization improvement",
];

const executiveActions = [
  "Compare overtime hours vs output",
  "Track overtime by department",
  "Identify avoidable overtime",
  "Reduce labour-cost leakage",
  "Improve manpower allocation",
  "Strengthen planning discipline",
  "Improve shipment scheduling",
  "Monitor fatigue & productivity loss",
];

export default function OvertimeOptimizationIntelligencePage() {
  return (
    <DashboardShell title="AI Overtime Optimization Intelligence">
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* HERO */}
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
              MBNCON AI Labour Cost Protection Intelligence
            </p>

            <h1 className="mt-4 text-5xl font-extrabold leading-tight">
              AI Overtime Optimization Intelligence Engine
            </h1>

            <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
              This module analyses overtime pressure, labour-cost escalation,
              excessive overtime dependency, department imbalance, worker
              fatigue, productivity instability, shipment pressure, and labour
              optimization opportunities across manufacturing operations.
            </p>
          </section>

          {/* KPI CARDS */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Overtime Risk",
                value: "Monitoring",
                desc:
                  "Overtime optimization intelligence structure active.",
                bg: "bg-red-100 border-red-300 text-red-950",
              },
              {
                title: "Cost Pressure",
                value: "Ready",
                desc:
                  "Next step will connect overtime, manpower, and production data.",
                bg: "bg-orange-100 border-orange-300 text-orange-950",
              },
              {
                title: "Recovery Focus",
                value: "Efficiency",
                desc:
                  "Helps management reduce unnecessary overtime and improve labour efficiency.",
                bg: "bg-slate-200 border-slate-300 text-slate-950",
              },
              {
                title: "AI Visibility",
                value: "Active",
                desc:
                  "Operational intelligence monitoring prepared for expansion.",
                bg: "bg-cyan-100 border-cyan-300 text-cyan-950",
              },
            ].map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`scroll-mt-28 rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.bg}`}
                >
                  <p
                    id={id}
                    className="text-sm font-semibold uppercase tracking-wide opacity-80"
                  >
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold">
                    {item.value}
                  </h2>

                  <p className="mt-4 leading-7">
                    {item.desc}
                  </p>
                </a>
              );
            })}
          </section>

          {/* OVERTIME WARNING */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-red-950">
                AI Overtime Warning
              </h2>

              <p className="mt-5 text-lg leading-8 text-red-900">
                Excessive overtime may indicate weak planning, bottlenecks,
                poor line balancing, shipment pressure, operator shortage,
                workflow instability, machine downtime, or avoidable labour
                cost leakage.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-blue-950">
                Executive Recovery Action
              </h2>

              <p className="mt-5 text-lg leading-8 text-blue-900">
                Review overtime by department, compare overtime hours with
                output, identify avoidable overtime, reduce dependency through
                better planning and line balancing, and improve labour
                utilization discipline.
              </p>
            </div>
          </section>

          {/* OVERTIME DRIVERS */}
          <section className="rounded-3xl bg-white p-8 shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-slate-900">
              Major Overtime Drivers
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {overtimeDrivers.map((item) => {
                const id = slugify(item);

                return (
                  <div
                    key={item}
                    id={id}
                    className="scroll-mt-28 rounded-2xl border border-red-100 bg-red-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="font-semibold leading-7 text-red-950">
                      {item}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-red-900">
                      Operational factor increasing overtime dependency and
                      labour-cost pressure.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* OPTIMIZATION */}
          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-emerald-300">
              Overtime Optimization Opportunities
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {optimizationAreas.map((item) => {
                const id = slugify(item);

                return (
                  <div
                    key={item}
                    id={id}
                    className="scroll-mt-28 rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/20 hover:shadow-xl"
                  >
                    <p className="font-semibold leading-7 text-white">
                      {item}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Improvement area designed to reduce excessive overtime
                      and improve operational efficiency.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* EXECUTIVE ACTIONS */}
          <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8 shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-cyan-950">
              Executive Monitoring Actions
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {executiveActions.map((item) => {
                const id = slugify(item);

                return (
                  <div
                    key={item}
                    id={id}
                    className="scroll-mt-28 rounded-2xl border border-cyan-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="font-semibold leading-7 text-cyan-950">
                      {item}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-cyan-900">
                      Executive-level operational control and labour-cost
                      optimization visibility.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl bg-emerald-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              Reduce Overtime Dependency & Protect Profitability
            </h2>

            <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-emerald-100">
              MBNCON overtime optimization intelligence systems help
              organizations reduce labour-cost leakage, improve planning,
              strengthen workforce efficiency, reduce fatigue, and improve
              operational stability through structured AI-driven intelligence.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Overtime Optimization Consultation
            </button>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}