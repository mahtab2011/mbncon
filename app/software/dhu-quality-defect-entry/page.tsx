"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const commonDefects = [
  "Open seam",
  "Broken stitch",
  "Skip stitch",
  "Oil mark",
  "Shade variation",
  "Measurement issue",
  "Uneven stitch",
  "Wrong label",
  "Missing button",
  "Fabric defect",
  "Puckering",
  "Needle hole",
  "Stain",
  "Wrong size label",
  "Missing care label",
  "Loose thread",
];

const initialFactories = ["MBN Demo Factory", "Factory Unit 01"];
const initialFloors = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];
const initialLines = ["Line 01", "Line 02", "Line 03", "Line 04"];
const initialSections = ["Cutting", "Sewing", "Finishing", "Packing"];
const initialOperations = [
  "Shoulder join",
  "Side seam",
  "Sleeve attach",
  "Collar attach",
  "Hem",
  "Button attach",
  "Final inspection",
];
const initialStyles = ["STYLE-001", "STYLE-002", "STYLE-003"];
const initialBuyers = ["M&S", "Primark", "Zara", "H&M", "C&A", "Next"];
const initialProducts = [
  "Knit T-Shirt",
  "Polo Shirt",
  "Shirt",
  "Trouser",
  "Denim Jeans",
  "Sweater",
  "Jacket",
  "Outerwear",
  "Sportswear",
  "Workwear",
  "Lingerie",
  "Children's Wear",
];

function addNewItem(
  label: string,
  items: string[],
  setItems: (items: string[]) => void
) {
  const value = window.prompt(`Add new ${label}`);

  if (!value) return;

  const cleanValue = value.trim();

  if (!cleanValue) return;

  if (items.some((item) => item.toLowerCase() === cleanValue.toLowerCase())) {
    window.alert(`${label} already exists.`);
    return;
  }

  setItems([...items, cleanValue]);
}

export default function DhuQualityDefectEntryPage() {
  const [checkedQty, setCheckedQty] = useState(1000);
  const [defects, setDefects] = useState<Record<string, number>>({});

  const [factories, setFactories] = useState(initialFactories);
  const [floors, setFloors] = useState(initialFloors);
  const [lines, setLines] = useState(initialLines);
  const [sections, setSections] = useState(initialSections);
  const [operations, setOperations] = useState(initialOperations);
  const [styles, setStyles] = useState(initialStyles);
  const [buyers, setBuyers] = useState(initialBuyers);
  const [products, setProducts] = useState(initialProducts);

  const totalDefects = useMemo(
    () => Object.values(defects).reduce((sum, value) => sum + value, 0),
    [defects]
  );

  const dhu = checkedQty > 0 ? (totalDefects / checkedQty) * 100 : 0;

  function updateDefect(name: string, value: number) {
    setDefects((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/software" className="text-sm font-semibold text-cyan-300">
          ← Back to Software Centre
        </Link>

        <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Quality Management
          </p>

          <h1 className="mt-3 text-4xl font-black text-white">
            DHU & Quality Defect Entry
          </h1>

          <p className="mt-4 max-w-4xl text-slate-300">
            Dynamic sheet for recording garment defects by factory, floor, line,
            product category, style, order, buyer, operation and inspector. New
            buyers, styles, lines, products and operations can be added from the
            form before Firestore master data is connected.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Checked Quantity</p>
            <p className="mt-2 text-3xl font-bold">{checkedQty}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Total Defects</p>
            <p className="mt-2 text-3xl font-bold">{totalDefects}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">DHU</p>
            <p className="mt-2 text-3xl font-bold text-cyan-300">
              {dhu.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Quality Status</p>
            <p className="mt-2 text-2xl font-bold">
              {dhu <= 2.5 ? "On Target" : "Above Target"}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold text-cyan-200">
              Defect Entry Sheet
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm text-slate-300">Factory</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {factories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      addNewItem("Factory", factories, setFactories)
                    }
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Floor</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {floors.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => addNewItem("Floor", floors, setFloors)}
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Line</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {lines.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => addNewItem("Line", lines, setLines)}
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Section</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {sections.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      addNewItem("Section", sections, setSections)
                    }
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Operation</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {operations.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      addNewItem("Operation", operations, setOperations)
                    }
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">
                  Product Category
                </span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {products.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      addNewItem("Product Category", products, setProducts)
                    }
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Style</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {styles.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => addNewItem("Style", styles, setStyles)}
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Buyer</span>
                <div className="mt-2 flex gap-2">
                  <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400">
                    {buyers.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => addNewItem("Buyer", buyers, setBuyers)}
                    className="rounded-xl bg-cyan-400 px-4 font-bold text-slate-950"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Order / PO</span>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="Order / PO"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Inspector</span>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="Inspector name"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">
                  Checked Quantity
                </span>
                <input
                  type="number"
                  value={checkedQty}
                  onChange={(event) =>
                    setCheckedQty(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-bold text-cyan-200">
                Common Defects
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {commonDefects.map((defect) => (
                  <label
                    key={defect}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950 p-4"
                  >
                    <span className="text-sm font-semibold">{defect}</span>

                    <input
                      type="number"
                      min={0}
                      value={defects[defect] || 0}
                      onChange={(event) =>
                        updateDefect(defect, Number(event.target.value))
                      }
                      className="w-24 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-right text-white outline-none focus:border-cyan-400"
                    />
                  </label>
                ))}
              </div>
            </div>

            <label className="mt-6 block">
              <span className="text-sm text-slate-300">Remarks</span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                placeholder="Write corrective action, root cause, or observation..."
              />
            </label>

            <button className="mt-6 rounded-2xl bg-cyan-400 px-6 py-3 font-bold text-slate-950">
              Save Entry
            </button>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <h2 className="text-2xl font-bold text-cyan-200">
                Quality Policy Flow
              </h2>

              <div className="mt-5 space-y-4 text-sm text-slate-200">
                {[
                  "Defect Identification",
                  "Immediate Correction",
                  "Root Cause Analysis",
                  "Corrective Action",
                  "Verification",
                  "Standardization",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4"
                  >
                    <p className="font-bold text-cyan-300">
                      {index + 1}. {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold text-white">AI Note</h2>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                If DHU is above target, the system should trigger root cause
                analysis, line-level alert, corrective action and supervisor
                verification.
              </p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}