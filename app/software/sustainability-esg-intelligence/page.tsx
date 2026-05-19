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

const esgAreas = [
  "Carbon footprint tracking",
  "Electricity efficiency",
  "Generator fuel efficiency",
  "Water consumption",
  "Waste generation",
  "Recycling rate",
  "Chemical disposal control",
  "Environmental audit status",
  "Sustainability targets",
  "ESG reporting readiness",
];

const esgRisks = [
  "Buyer sustainability concern",
  "Higher energy cost",
  "Environmental compliance risk",
  "Waste disposal issue",
  "Water usage pressure",
  "Future ESG reporting gap",
];

const kpiCards = [
  {
    title: "ESG Readiness",
    value: "Developing",
    description:
      "Sustainability reporting readiness prepared for buyer and management review.",
    target: "Sustainability Areas",
    className: "border-green-400/30 bg-green-400/10 text-green-200",
  },
  {
    title: "Energy Efficiency",
    value: "Tracked",
    description:
      "Electricity and generator fuel efficiency visibility prepared for cost reduction.",
    target: "Sustainability Areas",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Waste Reduction",
    value: "Monitored",
    description:
      "Waste generation, recycling, chemical disposal, and audit status are monitored.",
    target: "ESG Business Risks",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Buyer Readiness",
    value: "Improving",
    description:
      "Buyer sustainability requirements and ESG reporting gaps are visible for action.",
    target: "Consultancy Application",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
];

export default function SustainabilityESGIntelligencePage() {
  return (
    <DashboardShell title="Sustainability & ESG Intelligence">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-300">
              MBNCON Sustainability Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Sustainability & ESG Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track carbon footprint, energy efficiency, water use, waste,
              recycling, chemical disposal, sustainability targets,
              environmental audit status, and ESG reporting readiness.
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
              id={slugify("Sustainability Areas")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-green-200">
                Sustainability Areas
              </h2>

              <div className="mt-6 space-y-3">
                {esgAreas.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-green-400 hover:bg-green-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-400 text-sm font-bold text-slate-950">
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
              id={slugify("ESG Business Risks")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-green-200">
                ESG Business Risks
              </h2>

              <div className="mt-6 space-y-4">
                {esgRisks.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-green-400 hover:bg-green-400/10 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">
                        {index + 1}. {item}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Track impact, buyer requirement, legal exposure,
                        improvement action, owner, target date, and evidence.
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("ESG Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-green-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
              ESG Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Environmental Performance, Cost Reduction & Buyer Readiness
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps factory leadership monitor carbon footprint,
              electricity efficiency, generator fuel efficiency, water
              consumption, waste generation, recycling rate, chemical disposal,
              environmental audit status, sustainability targets, and ESG
              reporting readiness. It connects environmental responsibility
              with cost control, buyer confidence, and future compliance
              requirements.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...esgAreas, ...esgRisks].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-green-400 hover:bg-green-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for sustainability tracking,
                      ESG evidence, buyer requirement monitoring, environmental
                      compliance, and improvement action follow-up.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-green-400/30 bg-green-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-green-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories prepare for future buyer
              requirements, reduce energy and waste costs, improve
              environmental performance, strengthen ESG reporting, and position
              themselves as responsible manufacturing partners.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "ESG readiness improvement",
                "Energy and waste cost reduction",
                "Buyer sustainability confidence",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for sustainability
                    intelligence and responsible manufacturing review.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-green-300 transition duration-300 hover:text-green-100"
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