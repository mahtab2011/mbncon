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

const merchandisingAreas = [
  "T&A calendar tracking",
  "Buyer approval status",
  "BOM status",
  "Material booking status",
  "Sample approval",
  "Lab dip approval",
  "Fit / size set approval",
  "LC status",
  "Ex-factory date",
  "Shipment readiness",
  "Margin tracking",
  "Buyer communication delay",
];

const orderRisks = [
  "Late buyer approval",
  "Material booking delay",
  "Sample rejection",
  "LC opening delay",
  "Production start delay",
  "Shipment commitment risk",
];

const intelligenceAreas = [
  "Buyer communication visibility",
  "Critical path monitoring",
  "Factory coordination intelligence",
  "Approval escalation tracking",
  "Margin protection visibility",
  "Production readiness analysis",
  "Commercial follow-up visibility",
  "Shipment deadline risk analysis",
];

export default function MerchandisingOrderTrackingIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/20 px-5 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-300">
              MBNCON Merchandising Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Merchandising & Order Tracking Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track buyer approvals, T&A calendar, BOM, material booking,
              sample approval, lab dip approval, LC status, shipment readiness,
              operational delays, merchandising risks, communication gaps,
              and export order execution visibility across manufacturing
              operations.
            </p>
          </div>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["T&A Visibility", "Active"],
              ["Approval Risk", "Tracked"],
              ["Shipment Readiness", "Monitored"],
              ["Margin Control", "Visible"],
            ].map(([label, value]) => {
              const id = slugify(label);

              return (
                <a
                  key={label}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-2xl border border-purple-100 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <p
                    id={id}
                    className="text-sm font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-purple-700">
                    {value}
                  </p>
                </a>
              );
            })}
          </div>

          {/* CONTROL AREAS */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-purple-900">
                Merchandising Control Areas
              </h2>

              <div className="mt-8 space-y-4">
                {merchandisingAreas.map((item, index) => {
                  const id = slugify(item);

                  return (
                    <div
                      key={item}
                      id={id}
                      className="scroll-mt-28 flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {item}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Operational merchandising visibility and execution
                          control area for buyer order management.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ORDER RISKS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-red-900">
                Order Execution Risks
              </h2>

              <div className="mt-8 space-y-5">
                {orderRisks.map((item, index) => {
                  const id = slugify(item);

                  return (
                    <div
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-2xl border border-red-100 bg-red-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <p className="text-lg font-bold text-red-950">
                        {index + 1}. {item}
                      </p>

                      <p className="mt-3 leading-7 text-red-900">
                        Track delay reasons, responsible party, buyer response,
                        operational impact, shipment exposure, corrective
                        actions, and escalation follow-up.
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* INTELLIGENCE AREAS */}
          <section className="mt-10 rounded-3xl bg-slate-900 p-8 text-white shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-cyan-300">
              Merchandising Intelligence Visibility
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
                    <p className="leading-7 text-slate-200">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CONSULTANCY APPLICATION */}
          <section className="mt-10 rounded-3xl border border-purple-200 bg-purple-50 p-8 shadow-md transition duration-300 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-purple-950">
              Consultancy Application
            </h2>

            <p className="mt-5 text-lg leading-8 text-purple-900">
              This module helps merchandising, sourcing, production,
              commercial, quality, planning, and shipment teams remain aligned
              so that approvals, material booking, LC opening, production
              readiness, shipment preparation, and buyer commitments stay under
              operational control.
            </p>

            <p className="mt-5 text-lg leading-8 text-purple-900">
              Management can use this intelligence system to identify hidden
              delays, improve coordination, strengthen follow-up discipline,
              reduce buyer dissatisfaction, improve shipment reliability,
              protect profit margins, and reduce operational risk exposure.
            </p>
          </section>

          {/* CTA */}
          <section className="mt-10 rounded-3xl bg-purple-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              Improve Merchandising Visibility & Shipment Control
            </h2>

            <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-purple-100">
              MBNCON merchandising intelligence systems help export
              manufacturers improve buyer coordination, reduce approval delays,
              strengthen shipment reliability, and improve operational
              visibility across the entire order execution process.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-purple-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Merchandising Intelligence Consultation
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}