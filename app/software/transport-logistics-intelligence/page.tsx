"use client";

import Link from "next/link";

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

export default function TransportLogisticsIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
            MBNCON Transport & Logistics Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Transport & Logistics Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Analyse local transport, customs, shipping agents, container
            availability, bill of lading delays, sea and air shipment
            performance, clearance time, CNF agents, warehouse damage risk, and
            bureaucracy loopholes.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Transport Risk", "Monitored"],
            ["Customs Delay", "Tracked"],
            ["Shipment Mode", "Sea / Air"],
            ["Damage Risk", "Measured"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-blue-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">
            Logistics Performance Areas
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {logisticsAreas.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-400 font-bold text-slate-950">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold text-white">{item}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Track delay, cost, responsible party, documents, damage,
                    communication gap, and corrective action.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-400/30 bg-blue-400/10 p-8">
          <h2 className="text-2xl font-bold text-blue-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps companies identify where shipment performance is
            affected by transport delay, customs behaviour, container shortage,
            bill of lading delay, poor shipping agent service, CNF agent issues,
            port clearance problems, air cargo warehouse damage, sea transit
            delays, and documentation bureaucracy.
          </p>
        </section>
      </section>
    </main>
  );
}