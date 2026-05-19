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

const utilityAreas = [
  "Electricity consumption",
  "Generator fuel dependency",
  "Gas overconsumption",
  "Steam leakage",
  "Compressed air leakage",
  "Idle machine energy waste",
  "Production-to-utility efficiency",
  "Utility spike monitoring",
  "Load shedding impact",
  "Energy-saving opportunity",
];

const executiveActions = [
  "Separate national grid electricity from generator fuel cost",
  "Compare utility cost against production output",
  "Monitor abnormal utility spikes",
  "Identify avoidable energy leakage",
  "Reduce idle machine running time",
  "Control compressed air leakage",
];

const kpiCards = [
  {
    title: "Utility Cost Risk",
    value: "Monitoring",
    description:
      "Utility cost intelligence structure prepared for operational monitoring and executive review.",
    target: "Utility Intelligence Areas",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Energy Leakage",
    value: "Ready",
    description:
      "Electricity, generator, gas, steam, and production efficiency analysis structure is ready.",
    target: "AI Utility Warning",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Recovery Focus",
    value: "Cost Saving",
    description:
      "Supports management in reducing abnormal utility cost and improving energy efficiency.",
    target: "Executive Saving Actions",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Production Efficiency",
    value: "Tracked",
    description:
      "Production-to-utility efficiency and abnormal consumption behaviour are monitored.",
    target: "Utility Intelligence Layer",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
];

export default function UtilityCostIntelligencePage() {
  return (
    <DashboardShell title="AI Utility Cost Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-8">
          <div id="top" />

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              MBNCON AI Energy & Utility Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
              AI Utility Cost Intelligence Engine
            </h1>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module analyses electricity, generator fuel, gas, steam,
              compressed air, water, utility spikes, abnormal consumption,
              and production-to-utility efficiency.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

                  <h2 className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </h2>

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

          <section
            id={slugify("Utility Intelligence Areas")}
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-cyan-200">
              Utility Intelligence Areas
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {utilityAreas.map((item, index) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <div>
                        <h3 className="font-semibold text-white">{item}</h3>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          Utility intelligence prepared for abnormal
                          consumption tracking, operational analysis, and
                          executive decision-making.
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <section
              id={slugify("AI Utility Warning")}
              className="scroll-mt-28 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-orange-200">
                AI Utility Warning
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-200">
                Utility cost may rise silently through generator fuel
                dependency, compressed air leakage, idle machine running,
                steam loss, gas overconsumption, or poor production
                scheduling.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Generator fuel dependency risk",
                  "Compressed air leakage risk",
                  "Idle machine energy waste",
                  "Steam and gas overconsumption",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10 hover:shadow-lg"
                  >
                    <p className="font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id={slugify("Executive Saving Actions")}
              className="scroll-mt-28 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-cyan-200">
                Executive Saving Actions
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-200">
                Compare utility cost against production output, separate
                national grid electricity from generator fuel cost, monitor
                abnormal spikes, and identify avoidable energy leakage.
              </p>

              <div className="mt-8 space-y-4">
                {executiveActions.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10 hover:shadow-lg"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-semibold text-white">{item}</p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Executive intelligence prepared for utility cost
                        reduction, production efficiency, and operational
                        recovery planning.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <section
            id={slugify("Utility Intelligence Layer")}
            className="scroll-mt-28 rounded-3xl border border-cyan-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Utility Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Energy Efficiency, Utility Leakage & Production Cost Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This intelligence engine helps management analyse utility
              behaviour across electricity, generator fuel, gas, steam,
              compressed air, and water usage. It supports abnormal
              consumption analysis, production-to-utility efficiency review,
              utility spike investigation, and executive cost-saving action.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...utilityAreas, ...executiveActions].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for utility monitoring,
                      energy efficiency improvement, cost reduction, and
                      executive operational review.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-200">
              Consultancy Application
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-200">
              This module helps factories identify hidden energy loss,
              generator dependency, abnormal utility consumption, idle-machine
              wastage, compressed-air leakage, and avoidable production
              utility cost. It supports executive energy-saving strategy,
              operational efficiency, and manufacturing cost optimisation.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Energy leakage visibility",
                "Production-to-utility efficiency analysis",
                "Executive cost-saving intelligence",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for utility-cost
                    recovery, energy governance, and operational excellence.
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
        </div>
      </main>
    </DashboardShell>
  );
}