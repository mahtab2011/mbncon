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

const maintenanceRisks = [
  "Weak preventive maintenance discipline",
  "Repeated machine breakdowns",
  "Poor spare-part readiness",
  "Machine ageing risk",
  "Operator misuse",
  "Unplanned downtime escalation",
  "Maintenance scheduling gaps",
  "Hidden production disruption",
];

const intelligenceAreas = [
  "Downtime probability monitoring",
  "Preventive maintenance compliance",
  "Spare-part intelligence visibility",
  "Machine risk scoring",
  "Breakdown trend analysis",
  "Maintenance planning intelligence",
  "Failure pattern visibility",
  "Production protection intelligence",
];

const executiveActions = [
  "Track high-risk machines",
  "Monitor downtime frequency",
  "Verify maintenance completion",
  "Prepare spare parts before failure",
  "Reduce emergency repair dependency",
  "Improve maintenance scheduling",
  "Strengthen machine inspections",
  "Protect shipment continuity",
];

export default function PreventiveMaintenanceIntelligencePage() {
  return (
    <DashboardShell title="AI Preventive Maintenance Intelligence">
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
              MBNCON AI Predictive Maintenance Intelligence
            </p>

            <h1 className="mt-4 text-5xl font-extrabold leading-tight">
              AI Preventive Maintenance Intelligence Engine
            </h1>

            <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
              This module analyses breakdown trends, preventive maintenance
              compliance, high-risk machines, downtime probability, spare-part
              exposure, maintenance scheduling intelligence, production
              disruption risks, and operational recovery visibility.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Breakdown Risk",
                value: "Monitoring",
                desc: "Preventive maintenance intelligence structure active.",
                bg: "bg-red-100 border-red-300 text-red-950",
              },
              {
                title: "Failure Pattern",
                value: "Ready",
                desc:
                  "Maintenance, downtime, machine, and spare-part visibility prepared.",
                bg: "bg-orange-100 border-orange-300 text-orange-950",
              },
              {
                title: "Recovery Focus",
                value: "Downtime Prevention",
                desc: "Helps management reduce unplanned machine stoppage.",
                bg: "bg-slate-200 border-slate-300 text-slate-950",
              },
              {
                title: "AI Maintenance",
                value: "Active",
                desc: "Operational maintenance intelligence visibility enabled.",
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

                  <p className="mt-4 leading-7">{item.desc}</p>
                </a>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-red-950">
                AI Maintenance Warning
              </h2>

              <p className="mt-5 text-lg leading-8 text-red-900">
                Repeated breakdowns may indicate weak preventive maintenance,
                poor spare readiness, operator misuse, machine ageing risk,
                lubrication failure, maintenance scheduling gaps, or hidden
                production disruption.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-blue-950">
                Executive Maintenance Action
              </h2>

              <p className="mt-5 text-lg leading-8 text-blue-900">
                Track high-risk machines, monitor downtime frequency, verify
                preventive maintenance completion, prepare spare parts before
                failure, and strengthen inspection discipline to protect
                production output and shipment flow.
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-slate-900">
              Maintenance Risk Drivers
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {maintenanceRisks.map((item) => {
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
                      Operational factor increasing breakdown probability,
                      downtime exposure, and production disruption risk.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-orange-300">
              Preventive Maintenance Intelligence Areas
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {intelligenceAreas.map((item) => {
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
                      Maintenance intelligence visibility designed to prevent
                      avoidable breakdowns and protect factory output.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

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
                      Executive-level maintenance control action to reduce
                      downtime risk and protect shipment reliability.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl bg-emerald-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              Prevent Breakdowns Before They Stop Production
            </h2>

            <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-emerald-100">
              MBNCON preventive maintenance intelligence systems help factories
              reduce breakdown dependency, improve machine reliability,
              strengthen spare-part readiness, protect shipment flow, and
              improve operational stability through structured AI-driven
              maintenance visibility.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Preventive Maintenance Consultation
            </button>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}