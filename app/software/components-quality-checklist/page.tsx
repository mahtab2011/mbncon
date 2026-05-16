"use client";

import Link from "next/link";

const garmentChecks = [
  "Fabric GSM check",
  "Fabric shrinkage test",
  "Shade variation check",
  "Fabric defects inspection",
  "Button strength check",
  "Interlining bonding check",
  "Thread quality check",
  "Zipper smoothness and strength check",
];

const shoeChecks = [
  "Leather / upper material defect check",
  "Colour consistency check",
  "Lining material quality check",
  "Last fitting accuracy",
  "Sole bonding strength",
  "Toe puff stiffness check",
  "Insole material comfort check",
  "Outsole flexibility check",
  "Lace quality check",
  "Eyelet rust risk check",
  "Counter material firmness check",
  "Socks material comfort check",
];

const packagingChecks = [
  "Inner carton quality check",
  "Outer carton bursting strength",
  "Carton moisture resistance",
  "Poly bag quality check",
  "Packing tape strength",
  "Label and barcode readability",
  "Size sticker accuracy",
  "Shipping label accuracy",
];

export default function ComponentsQualityChecklistPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            MBNCON Incoming Quality Control
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Components Quality Checklist
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Quality inspection checklist for garments, shoes, components,
            accessories, and packaging materials to reduce defects, rework,
            rejection, shipment delay, and buyer claim risk.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Garment Checks", "8"],
            ["Shoe Checks", "12"],
            ["Packaging Checks", "8"],
            ["Claim Risk", "Reduced"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <ChecklistBlock title="Garment Component Checks" items={garmentChecks} />
          <ChecklistBlock title="Shoe Component Checks" items={shoeChecks} />
          <ChecklistBlock title="Packaging Material Checks" items={packagingChecks} />
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This checklist helps factories inspect incoming materials before
            production starts, identify supplier defects early, prevent
            production disruption, reduce rejection, and protect buyer
            relationships.
          </p>
        </section>
      </section>
    </main>
  );
}

function ChecklistBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-emerald-200">{title}</h2>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
              {index + 1}
            </span>

            <span className="text-sm text-slate-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}