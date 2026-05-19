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

const logisticsAreas = [
  "Local transport behaviour",
  "Local customs behaviour",
  "Shipping agent performance",
  "Container availability",
  "Bill of lading delay",
  "Sea voyage time",
  "Destination port clearance time",
  "Air shipment performance",
  "CNF agent performance",
  "Airport warehouse damage risk",
  "Transit damage risk",
  "Bureaucracy and documentation loopholes",
];

const kpiCards = [
  {
    title: "Transport Risk",
    value: "Monitored",
    description:
      "Local transport behaviour, delay, cost pressure, and delivery reliability are monitored.",
    target: "Logistics Performance Areas",
    className: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  },
  {
    title: "Customs Delay",
    value: "Tracked",
    description:
      "Customs behaviour, clearance time, documentation loopholes, and CNF performance are tracked.",
    target: "Transport Intelligence Layer",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Shipment Mode",
    value: "Sea / Air",
    description:
      "Sea voyage time, air shipment performance, container availability, and cut-off risk are visible.",
    target: "Transport Intelligence Layer",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Damage Risk",
    value: "Measured",
    description:
      "Warehouse damage, transit damage, port handling issues, and corrective action are measured.",
    target: "Consultancy Application",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
];

export default function TransportLogisticsIntelligencePage() {
  return (
    <DashboardShell title="Transport & Logistics Intelligence">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
              MBNCON Transport & Logistics Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Transport & Logistics Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Analyse local transport, customs, shipping agents, container
              availability, bill of lading delays, sea and air shipment
              performance, clearance time, CNF agents, warehouse damage risk,
              and bureaucracy loopholes.
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

          <section
            id={slugify("Logistics Performance Areas")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-blue-200">
              Logistics Performance Areas
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {logisticsAreas.map((item, index) => {
                const itemId = slugify(item);

                return (
                  <a
                    key={item}
                    href={`#${itemId}`}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-blue-400 hover:bg-blue-400/10 hover:shadow-lg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-400 font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-semibold text-white">{item}</p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Track delay, cost, responsible party, documents,
                        damage, communication gap, and corrective action.
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Transport Intelligence Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-blue-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Transport Intelligence Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Transport, Customs, Shipping Agent & Clearance Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps factory leadership analyse local transport
              behaviour, customs behaviour, shipping agent performance,
              container availability, bill of lading delays, sea voyage time,
              destination port clearance, air shipment performance, CNF agent
              reliability, airport warehouse damage, transit damage, and
              bureaucracy or documentation loopholes.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {logisticsAreas.map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for logistics delay tracking,
                      cost exposure, shipment recovery, documentation control,
                      and accountable corrective action.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-blue-400/30 bg-blue-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-blue-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps companies identify where shipment performance
              is affected by transport delay, customs behaviour, container
              shortage, bill of lading delay, poor shipping agent service, CNF
              agent issues, port clearance problems, air cargo warehouse
              damage, sea transit delays, and documentation bureaucracy.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Logistics delay reduction",
                "Shipping and customs accountability",
                "Transit damage and cost control",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for export logistics
                    intelligence, shipment recovery, and supply chain
                    performance review.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-blue-300 transition duration-300 hover:text-blue-100"
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