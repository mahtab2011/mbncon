"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const utilityAreas = [
  "National grid electricity unit consumption",
  "National grid electricity cost",
  "Generator fuel consumption",
  "Generator fuel cost during load shedding",
  "Gas unit consumption",
  "Gas cost",
  "Water unit consumption",
  "Water cost",
  "Load shedding hours",
  "Production loss due to utility interruption",
  "Utility price increase reason",
  "Abnormal consumption investigation",
];

const costRisks = [
  "Higher generator fuel expense",
  "Production delay from load shedding",
  "Machine idle time",
  "Overtime caused by utility interruption",
  "Higher cost per production unit",
  "Unexplained utility consumption increase",
];

const kpiCards = [
  {
    title: "Grid Electricity",
    value: "Separate",
    description:
      "National grid electricity unit consumption and cost are separated from generator fuel cost.",
    target: "Utility Tracking Areas",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Generator Fuel",
    value: "Tracked",
    description:
      "Generator fuel consumption and cost during load shedding are tracked for cost control.",
    target: "Utility Tracking Areas",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Load Shedding",
    value: "Measured",
    description:
      "Load shedding hours and production interruption impact are visible for management action.",
    target: "Cost & Production Risks",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Utility Cost Risk",
    value: "Monitored",
    description:
      "Abnormal gas, water, electricity, fuel, and production loss risks are monitored.",
    target: "Consultancy Application",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
];

export default function UtilitiesConsumptionIntelligencePage() {
  return (
    <DashboardShell title="Utilities Consumption Intelligence">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div id="top" />

          <Link
            href="/software"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>

          <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
              MBNCON Utility Cost Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Utilities Consumption Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track electricity, generator fuel, gas, water, load shedding,
              consumption increase, unit cost, production interruption, and
              utility-related financial impact in manufacturing operations.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => {
              const targetId = slugify(card.target);

              return (
                <a
                  key={card.title}
                  href={`#${targetId}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </p>

                  <p className="mt-4 text-sm leading-7 opacity-90">
                    {card.description}
                  </p>

                  <p className="mt-5 text-sm font-semibold opacity-80">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <section
              id={slugify("Utility Tracking Areas")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-cyan-200">
                Utility Tracking Areas
              </h2>

              <div className="mt-6 space-y-3">
                {utilityAreas.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <span className="text-sm leading-6 text-slate-200">
                        {item}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>

            <section
              id={slugify("Cost & Production Risks")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-cyan-200">
                Cost & Production Risks
              </h2>

              <div className="mt-6 space-y-4">
                {costRisks.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">
                        {index + 1}. {item}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Record unit consumption, unit price, reason for
                        increase, production effect, responsible area, and
                        corrective action.
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("Utilities Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Utilities Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Electricity, Generator Fuel, Gas, Water & Production Loss
              Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps factories separate normal grid electricity
              consumption from generator fuel cost during load shedding, monitor
              gas and water usage, identify abnormal consumption increases,
              calculate utility-related production loss, and support energy
              efficiency and cost reduction decisions.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...utilityAreas, ...costRisks].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for utility cost visibility,
                      production interruption analysis, abnormal consumption
                      investigation, and corrective action follow-up.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-cyan-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories separate normal grid electricity cost
              from generator fuel cost during load shedding, understand abnormal
              gas, water, and electricity consumption, calculate utility-related
              production loss, and identify opportunities for energy efficiency
              and cost reduction.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Grid and generator cost separation",
                "Load shedding production loss visibility",
                "Energy efficiency and cost reduction",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for utilities cost
                    control, energy management, and manufacturing productivity
                    improvement.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-cyan-300 transition duration-300 hover:text-cyan-100"
              >
                Back to top ↑
              </a>
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}