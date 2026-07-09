"use client";

import Link from "next/link";

const manualPieces = [
  { name: "Front", x: 30, y: 30, w: 150, h: 220 },
  { name: "Back", x: 210, y: 30, w: 150, h: 220 },
  { name: "Sleeve", x: 390, y: 30, w: 150, h: 120 },
  { name: "Sleeve", x: 570, y: 30, w: 150, h: 120 },
  { name: "Collar", x: 390, y: 180, w: 150, h: 55 },
  { name: "Cuff", x: 570, y: 180, w: 115, h: 45 },
  { name: "Pocket", x: 720, y: 180, w: 70, h: 80 },
];

export default function DemoLayoutPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/pattern" className="text-cyan-300">
          ← Back to Pattern Pieces
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          Solid Fabric Lay — Manual Marker
        </h1>

        <p className="mt-3 max-w-3xl text-slate-300">
          First, we show a normal manual marker on a solid 60-inch fabric lay.
          AI will try to improve this layout in the next step.
        </p>

        <section className="mt-8 rounded-3xl bg-slate-900 p-6">
          <div className="mb-4 flex justify-between text-sm text-slate-300">
            <span>Fabric Width: 60 inches</span>
            <span>Manual Marker Length: 4.58 yd</span>
            <span>Efficiency: 82%</span>
          </div>

          <div className="relative h-[330px] overflow-x-auto rounded-2xl border-4 border-slate-600 bg-white">
            <div className="absolute left-0 top-0 h-full w-[900px] bg-slate-100">
              {manualPieces.map((piece, index) => (
                <div
                  key={`${piece.name}-${index}`}
                  className="absolute flex items-center justify-center rounded-xl border-2 border-slate-700 bg-slate-300 text-sm font-bold text-slate-900"
                  style={{
                    left: piece.x,
                    top: piece.y,
                    width: piece.w,
                    height: piece.h,
                  }}
                >
                  {piece.name}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Marker Efficiency</p>
              <p className="text-3xl font-black">82%</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Fabric Used</p>
              <p className="text-3xl font-black">4.58 yd</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Unused Space</p>
              <p className="text-3xl font-black">18%</p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <Link
            href="/optifabric/demo/theatre"
            className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950"
          >
            Run AI Optimization →
          </Link>
        </div>
      </div>
    </main>
  );
}