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

const securityAreas = [
  "Theft and pilferage tracking",
  "Unauthorized stock movement",
  "Carton mismatch",
  "Barcode mismatch",
  "Warehouse damage",
  "Missing inventory",
  "Dispatch discrepancy",
  "Loading and unloading loss",
  "Gate pass control",
  "CCTV / security evidence",
  "Responsible person tracking",
  "Corrective action follow-up",
];

const lossRisks = [
  "Inventory shortage",
  "Financial loss",
  "Shipment mismatch",
  "Buyer claim risk",
  "Internal control weakness",
  "Repeated warehouse leakage",
];

const kpiCards = [
  {
    title: "Security Risk",
    value: "Monitored",
    description:
      "Warehouse theft, pilferage, unauthorized movement, and security leakage are monitored.",
    target: "Warehouse Control Areas",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  },
  {
    title: "Stock Movement",
    value: "Controlled",
    description:
      "Stock movement, gate pass control, barcode mismatch, and carton accuracy are tracked.",
    target: "Warehouse Intelligence Layer",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Dispatch Accuracy",
    value: "Tracked",
    description:
      "Dispatch discrepancy, loading loss, shipment mismatch, and warehouse damage are visible.",
    target: "Warehouse Loss Risks",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Loss Exposure",
    value: "Measured",
    description:
      "Inventory shortage, financial loss, buyer claim risk, and internal control weakness are measured.",
    target: "Consultancy Application",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
];

export default function WarehouseSecurityLossIntelligencePage() {
  return (
    <DashboardShell title="Warehouse Security & Loss Intelligence">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-300">
              MBNCON Warehouse Control Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Warehouse Security & Loss Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track warehouse theft, pilferage, stock movement, carton
              mismatch, barcode mismatch, damage, dispatch discrepancy,
              loading loss, gate pass control, and internal accountability.
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
              id={slugify("Warehouse Control Areas")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-amber-200">
                Warehouse Control Areas
              </h2>

              <div className="mt-6 space-y-3">
                {securityAreas.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-950">
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
              id={slugify("Warehouse Loss Risks")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-amber-200">
                Warehouse Loss Risks
              </h2>

              <div className="mt-6 space-y-4">
                {lossRisks.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-lg"
                    >
                      <p className="font-semibold text-white">
                        {index + 1}. {item}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Track value, quantity, responsible person, evidence,
                        approval, investigation result, and corrective action.
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("Warehouse Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-amber-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Warehouse Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Warehouse Security, Dispatch Accuracy & Internal Control
              Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps management analyse warehouse theft,
              pilferage, unauthorized stock movement, carton mismatch,
              barcode mismatch, warehouse damage, dispatch discrepancy,
              loading and unloading loss, gate pass control, CCTV evidence,
              responsible person tracking, and corrective action follow-up.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...securityAreas, ...lossRisks].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for warehouse control,
                      dispatch verification, internal accountability,
                      evidence-based investigation, and operational recovery.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-amber-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories reduce warehouse leakage, prevent
              unauthorized stock movement, improve dispatch accuracy, protect
              inventory value, and strengthen internal control across
              receiving, storage, picking, packing, loading, and dispatch.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Warehouse leakage prevention",
                "Dispatch and inventory accuracy",
                "Internal control and accountability",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for warehouse
                    governance, inventory protection, operational discipline,
                    and shipment-control intelligence.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-amber-300 transition duration-300 hover:text-amber-100"
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