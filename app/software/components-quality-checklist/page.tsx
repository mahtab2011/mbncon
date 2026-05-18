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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ComponentsQualityChecklistPage() {
  const kpiCards = [
    {
      label: "Garment Checks",
      value: "8",
      href: "#garment-component-checks",
    },
    {
      label: "Shoe Checks",
      value: "12",
      href: "#shoe-component-checks",
    },
    {
      label: "Packaging Checks",
      value: "8",
      href: "#packaging-material-checks",
    },
    {
      label: "Claim Risk",
      value: "Reduced",
      href: "#consultancy-application",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
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

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review quality intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-quality-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-emerald-300">
            Executive Quality Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-100">
            Incoming Material Quality Monitoring Active
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment recommends strict incoming inspection for garments,
            footwear, accessories, and packaging materials to reduce supplier
            defects, prevent production disruption, and protect shipment
            quality consistency.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <ChecklistBlock
            id="garment-component-checks"
            title="Garment Component Checks"
            items={garmentChecks}
          />

          <ChecklistBlock
            id="shoe-component-checks"
            title="Shoe Component Checks"
            items={shoeChecks}
          />

          <ChecklistBlock
            id="packaging-material-checks"
            title="Packaging Material Checks"
            items={packagingChecks}
          />
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-emerald-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This checklist helps factories inspect incoming materials before
            production starts, identify supplier defects early, prevent
            production disruption, reduce rejection, and protect buyer
            relationships.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-emerald-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should implement incoming inspection standards,
              supplier quality scoring, defect escalation procedures, material
              traceability, packaging verification, and corrective action review
              before production approval and shipment planning.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function ChecklistBlock({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  return (
    <div
      id={id}
      className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
    >
      <h2 className="text-2xl font-bold text-emerald-200">
        {title}
      </h2>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => {
          const sectionId = slugify(item);

          return (
            <a
              key={item}
              id={sectionId}
              href="#consultancy-application"
              className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-xl"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                {index + 1}
              </span>

              <span className="text-sm text-slate-200">{item}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}