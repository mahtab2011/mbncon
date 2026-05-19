"use client";

import Link from "next/link";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const maintenanceAreas = [
  "Preventive maintenance schedule",
  "Machine breakdown history",
  "Downtime minutes",
  "Maintenance response time",
  "Spare parts availability",
  "Lubrication tracking",
  "Calibration status",
  "Maintenance cost trend",
  "Repeated breakdown pattern",
  "Machine efficiency impact",
];

const businessRisks = [
  "Production downtime",
  "Idle labour cost",
  "Unplanned overtime",
  "Quality defect risk",
  "Shipment delay",
  "Higher repair cost",
];

const kpis = [
  ["Breakdown Risk", "Monitored"],
  ["Downtime Impact", "Tracked"],
  ["Spare Parts", "Visible"],
  ["Cost Trend", "Measured"],
];

export default function MachineMaintenanceIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <section
          id="machine-maintenance-overview"
          className="mt-8 scroll-mt-28 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-300">
            MBNCON Maintenance Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Machine Maintenance Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track preventive maintenance, breakdowns, downtime, response time,
            spare parts, lubrication, calibration, maintenance cost, repeated
            failures, and machine efficiency impact.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {kpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-slate-300/50 hover:bg-white/10 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-200">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <section
            id="maintenance-control-areas"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-200">
              Maintenance Control Areas
            </h2>

            <div className="mt-6 space-y-3">
              {maintenanceAreas.map((item, index) => (
                <a
                  key={item}
                  id={slugify(item)}
                  href={`#${slugify(item)}`}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-slate-300/50 hover:bg-white/10"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </a>
              ))}
            </div>
          </section>

          <section
            id="business-risks"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-200">
              Business Risks
            </h2>

            <div className="mt-6 space-y-4">
              {businessRisks.map((item, index) => (
                <a
                  key={item}
                  id={slugify(item)}
                  href={`#${slugify(item)}`}
                  className="block scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-slate-300/50 hover:bg-white/10"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Measure lost time, repair cost, production impact, quality
                    risk, responsible area, and corrective action.
                  </p>
                </a>
              ))}
            </div>
          </section>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-slate-400/30 bg-slate-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories reduce unplanned breakdowns, control
            spare parts, improve machine uptime, reduce idle labour, prevent
            quality problems, and protect production and shipment commitments.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([label, value]) => (
            <section
              key={label}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-200">
                {value}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Used by management to identify machine risk, downtime impact,
                spare-part pressure, and maintenance cost exposure.
              </p>
            </section>
          ))}
        </section>
      </section>
    </main>
  );
}