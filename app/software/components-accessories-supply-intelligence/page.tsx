"use client";

import Link from "next/link";

const garmentComponents = [
  "Local fabrics",
  "Imported fabrics",
  "Buttons",
  "Interlining",
  "Thread",
  "Zippers",
  "Labels and tags",
  "Elastic and tapes",
];

const shoeComponents = [
  "Leather / upper material",
  "Lining material",
  "Last",
  "Sole",
  "Toe puff sheet",
  "Insole material",
  "Outsole",
  "Lace",
  "Eyelets",
  "shanks",
  "Counter material",
  "Socks material",
  "Adhesives and chemicals",
];

const packagingMaterials = [
  "Inner cartons",
  "Outer cartons",
  "Poly bags",
  "Packing tape",
  "Tissue paper",
  "Size stickers",
  "Shipping labels",
  "Barcode labels",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ComponentsAccessoriesSupplyIntelligencePage() {
  const kpiCards = [
    {
      label: "Industry Coverage",
      value: "Garments & Shoes",
      href: "#garment-components",
    },
    {
      label: "Supply Risk",
      value: "Monitored",
      href: "#executive-supply-assessment",
    },
    {
      label: "Import Dependency",
      value: "Tracked",
      href: "#shoe-components",
    },
    {
      label: "Packaging Visibility",
      value: "Active",
      href: "#packaging-materials",
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-300">
            MBNCON Supply Chain Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Components & Accessories Supply Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Analyse components, accessories, packaging materials, supplier
            dependency, lead time, quality risk, shortage risk, and sourcing
            performance for garments and footwear manufacturing.
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
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-orange-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-xl font-bold text-orange-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review supply intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-supply-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-orange-300">
            Executive Supply Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-100">
            Supply Chain Visibility & Dependency Monitoring Active
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment tracks component dependency, imported material
            exposure, packaging shortages, supplier performance, lead-time
            instability, and material quality risk across garments and footwear
            manufacturing operations.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div
            id="garment-components"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-orange-200">
              Garment Components
            </h2>

            <div className="mt-6 space-y-3">
              {garmentComponents.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-orange-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="shoe-components"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-orange-200">
              Shoe Components
            </h2>

            <div className="mt-6 space-y-3">
              {shoeComponents.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-orange-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="packaging-materials"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold text-orange-200">
              Packaging Materials
            </h2>

            <div className="mt-6 space-y-3">
              {packagingMaterials.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-orange-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-orange-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories identify sourcing risk, imported
            material dependency, packaging shortages, supplier performance,
            material quality problems, and lead-time instability across garment
            and footwear manufacturing supply chains.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-orange-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should monitor supplier dependency, imported material
              lead times, packaging availability, quality consistency,
              alternative sourcing readiness, and high-risk material shortages
              before production planning and shipment commitment.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}