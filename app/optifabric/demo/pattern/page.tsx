"use client";

import Link from "next/link";

const pieces = [
  { name: "Front Panel", width: 170, height: 220 },
  { name: "Back Panel", width: 170, height: 220 },
  { name: "Sleeve", width: 150, height: 120 },
  { name: "Collar", width: 150, height: 55 },
  { name: "Cuff", width: 115, height: 45 },
  { name: "Pocket", width: 70, height: 80 },
];

export default function DemoPatternPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/style" className="text-cyan-300">
          ← Back to Style Selection
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          Demo Pattern Pieces
        </h1>

        <p className="mt-3 max-w-3xl text-slate-300">
          OptiFabric AI converts garment pieces into polygons before nesting
          them on the fabric lay.
        </p>

        <section className="mt-8 rounded-3xl bg-slate-900 p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {pieces.map((piece) => (
              <div key={piece.name} className="rounded-2xl bg-slate-800 p-5">
                <div
                  className="mx-auto flex items-center justify-center rounded-xl border-2 border-cyan-300 bg-slate-950 text-sm font-bold text-cyan-200"
                  style={{
                    width: `${piece.width}px`,
                    height: `${piece.height}px`,
                  }}
                >
                  {piece.name}
                </div>

                <p className="mt-4 text-center font-semibold">
                  {piece.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <Link
            href="/optifabric/demo/layout"
            className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950"
          >
            Continue to Fabric Lay →
          </Link>
        </div>
      </div>
    </main>
  );
}