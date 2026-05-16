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

export default function ComponentsAccessoriesSupplyIntelligencePage() {
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

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Industry Coverage", "Garments & Shoes"],
            ["Supply Risk", "Monitored"],
            ["Import Dependency", "Tracked"],
            ["Packaging Visibility", "Active"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-xl font-bold text-orange-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-orange-200">
              Garment Components
            </h2>

            <div className="mt-6 space-y-3">
              {garmentComponents.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-orange-200">
              Shoe Components
            </h2>

            <div className="mt-6 space-y-3">
              {shoeComponents.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-orange-200">
              Packaging Materials
            </h2>

            <div className="mt-6 space-y-3">
              {packagingMaterials.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8">
          <h2 className="text-2xl font-bold text-orange-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories identify sourcing risk, imported
            material dependency, packaging shortages, supplier performance,
            material quality problems, and lead-time instability across garment
            and footwear manufacturing supply chains.
          </p>
        </section>
      </section>
    </main>
  );
}