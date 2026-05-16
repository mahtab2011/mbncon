"use client";

import Link from "next/link";

const stockCategories = [
  "Raw materials stock",
  "Work-in-progress (WIP) stock",
  "Finished goods stock",
  "Rejected / seconds stock",
  "Surplus stock",
  "Slow-moving stock",
];

const inventoryControls = [
  "Probable use/completion/shipment date",
  "Warehouse ageing period",
  "Stock over 3 months alert",
  "Stock carrying interest cost",
  "Financial value of inventory",
  "Material utilisation trend",
  "Excess inventory identification",
  "Disposal recommendation",
];

const disposalMethods = [
  "Spot sale",
  "Resale to secondary market",
  "Discount liquidation",
  "Reprocessing / reuse",
  "Dump / scrap disposal",
  "Controlled destruction",
];

export default function InventoryStockIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-yellow-300">
            MBNCON Inventory Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Inventory & Stock Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Analyse inventory status, warehouse ageing, stock carrying cost,
            slow-moving inventory, financial exposure, rejects, surplus stock,
            shipment readiness, and disposal opportunities across manufacturing
            operations.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Stock Visibility", "Live"],
            ["Warehouse Risk", "Monitored"],
            ["Financial Exposure", "Tracked"],
            ["Disposal Readiness", "Available"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-yellow-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-yellow-200">
              Stock Categories
            </h2>

            <div className="mt-6 space-y-3">
              {stockCategories.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-yellow-200">
              Inventory Control Intelligence
            </h2>

            <div className="mt-6 space-y-3">
              {inventoryControls.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-yellow-200">
              Disposal Methods
            </h2>

            <div className="mt-6 space-y-3">
              {disposalMethods.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-8">
          <h2 className="text-2xl font-bold text-yellow-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps management teams understand where cash is blocked
            in inventory, which stock is ageing, what financial carrying cost
            the company is paying, which materials are slow-moving or surplus,
            and how rejected or excess stock can be recovered through resale,
            spot sale, reuse, or disposal.
          </p>
        </section>
      </section>
    </main>
  );
}