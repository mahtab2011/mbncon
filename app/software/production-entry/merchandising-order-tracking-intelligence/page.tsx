"use client";

import Link from "next/link";

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

export default function MerchandisingOrderTrackingIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-300">
            MBNCON Merchandising Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Merchandising & Order Tracking Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track buyer approvals, T&A calendar, BOM, material booking, sample
            approval, lab dip approval, LC status, shipment readiness, margin,
            and communication delays across export manufacturing orders.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["T&A Visibility", "Active"],
            ["Approval Risk", "Tracked"],
            ["Shipment Readiness", "Monitored"],
            ["Margin Control", "Visible"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-purple-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-purple-200">
              Merchandising Control Areas
            </h2>

            <div className="mt-6 space-y-3">
              {merchandisingAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-purple-200">
              Order Execution Risks
            </h2>

            <div className="mt-6 space-y-4">
              {orderRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Track delay reason, responsible party, buyer response,
                    production impact, shipment risk, and corrective action.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-purple-400/30 bg-purple-400/10 p-8">
          <h2 className="text-2xl font-bold text-purple-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps merchandising, sourcing, production, commercial,
            and shipment teams stay aligned so buyer approvals, material
            booking, LC, production start, and shipment commitments do not fall
            behind schedule.
          </p>
        </section>
      </section>
    </main>
  );
}