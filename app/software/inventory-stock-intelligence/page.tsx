"use client";

import Link from "next/link";

type IntelligenceItem = {
  id: string;
  title: string;
  detail: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const stockCategories: IntelligenceItem[] = [
  {
    id: "raw-materials-stock",
    title: "Raw materials stock",
    detail:
      "Monitor raw material inventory levels, ageing profile, supplier dependency, overstock risk, and shortage exposure impacting production continuity.",
  },
  {
    id: "wip-stock",
    title: "Work-in-progress (WIP) stock",
    detail:
      "Track unfinished production quantities, bottlenecks, delayed operations, and factory floor congestion affecting throughput efficiency.",
  },
  {
    id: "finished-goods-stock",
    title: "Finished goods stock",
    detail:
      "Analyse shipment readiness, warehouse holding period, buyer dispatch schedule, and excess finished inventory risk.",
  },
  {
    id: "rejected-stock",
    title: "Rejected / seconds stock",
    detail:
      "Identify defective inventory, quality rejection causes, salvage opportunities, and financial recovery potential.",
  },
  {
    id: "surplus-stock",
    title: "Surplus stock",
    detail:
      "Detect excess procurement, duplicate inventory, over-ordering patterns, and slow consumption materials.",
  },
  {
    id: "slow-moving-stock",
    title: "Slow-moving stock",
    detail:
      "Highlight low-rotation inventory, ageing stock, blocked cashflow, and potential disposal or liquidation actions.",
  },
];

const inventoryControls: IntelligenceItem[] = [
  {
    id: "shipment-date",
    title: "Probable use/completion/shipment date",
    detail:
      "Estimate expected material usage and shipment completion timeline using production planning and buyer delivery schedule.",
  },
  {
    id: "warehouse-ageing",
    title: "Warehouse ageing period",
    detail:
      "Track how long inventory remains stored and identify ageing-related operational or financial risks.",
  },
  {
    id: "three-month-alert",
    title: "Stock over 3 months alert",
    detail:
      "Automatically escalate inventory exceeding acceptable storage duration thresholds.",
  },
  {
    id: "stock-interest-cost",
    title: "Stock carrying interest cost",
    detail:
      "Calculate financing and opportunity cost associated with excess inventory holding.",
  },
];

const disposalMethods: IntelligenceItem[] = [
  {
    id: "spot-sale",
    title: "Spot sale",
    detail:
      "Immediate stock liquidation strategy for recovering blocked cash from surplus inventory.",
  },
  {
    id: "secondary-market",
    title: "Resale to secondary market",
    detail:
      "Resell slow-moving or excess stock through alternative buyers or secondary channels.",
  },
  {
    id: "discount-liquidation",
    title: "Discount liquidation",
    detail:
      "Controlled markdown disposal process to reduce ageing inventory exposure.",
  },
  {
    id: "reprocessing",
    title: "Reprocessing / reuse",
    detail:
      "Recover material value through rework, repurposing, or internal reuse opportunities.",
  },
];

const kpis = [
  ["Stock Visibility", "Live"],
  ["Warehouse Risk", "Monitored"],
  ["Financial Exposure", "Tracked"],
  ["Disposal Readiness", "Available"],
];

const intelligenceGroups = [
  {
    title: "Stock Categories",
    items: stockCategories,
  },
  {
    title: "Inventory Control Intelligence",
    items: inventoryControls,
  },
  {
    title: "Disposal Methods",
    items: disposalMethods,
  },
];

const allItems = [
  ...stockCategories,
  ...inventoryControls,
  ...disposalMethods,
];

export default function InventoryStockIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/software"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
        >
          ← Back to Dashboard
        </Link>

        <section
          id={slugify("Inventory and Stock Intelligence")}
          className="scroll-mt-28 mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
        >
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
        </section>

        <section
          id={slugify("Inventory Stock KPI Cards")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-4"
        >
          {kpis.map(([label, value]) => (
            <a
              key={label}
              href={`#${slugify(label)}`}
              id={slugify(label)}
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-yellow-300/50 hover:bg-yellow-400/10 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{label}</p>

              <p className="mt-3 text-2xl font-bold text-yellow-300">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section
          id={slugify("Inventory Intelligence Modules")}
          className="scroll-mt-28 mt-10 grid gap-6 md:grid-cols-3"
        >
          {intelligenceGroups.map((group) => (
            <section
              key={group.title}
              id={slugify(group.title)}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-yellow-200">
                {group.title}
              </h2>

              <div className="mt-6 space-y-3">
                {group.items.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-yellow-400 hover:bg-yellow-400/10"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section
          id={slugify("Detailed Inventory Intelligence")}
          className="scroll-mt-28 mt-12 space-y-6"
        >
          {allItems.map((item) => (
            <section
              key={item.id}
              id={item.id}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-yellow-300/50 hover:bg-yellow-400/10 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-yellow-200">
                {item.title}
              </h2>

              <p className="mt-4 leading-relaxed text-slate-300">
                {item.detail}
              </p>
            </section>
          ))}
        </section>

        <section
          id={slugify("Consultancy Application")}
          className="scroll-mt-28 mt-10 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-8 transition hover:-translate-y-1 hover:shadow-xl"
        >
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