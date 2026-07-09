"use client";

import Link from "next/link";

const aiPieces = [
  { name: "Front", x: 25, y: 25, w: 150, h: 220 },
  { name: "Back", x: 185, y: 25, w: 150, h: 220 },
  { name: "Sleeve", x: 345, y: 25, w: 150, h: 120 },
  { name: "Sleeve", x: 345, y: 155, w: 150, h: 120 },
  { name: "Collar", x: 505, y: 25, w: 150, h: 55 },
  { name: "Cuff", x: 505, y: 90, w: 115, h: 45 },
  { name: "Cuff", x: 505, y: 145, w: 115, h: 45 },
  { name: "Pocket", x: 630, y: 25, w: 70, h: 80 },
];

export default function DemoAIPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/layout" className="text-cyan-300">
          ← Back to Manual Marker
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          AI Optimized Polygon Nesting
        </h1>

        <p className="mt-3 max-w-3xl text-slate-300">
          OptiFabric AI rearranges the same pattern pieces to reduce unused
          fabric area while preserving practical cutting rules.
        </p>

        <section className="mt-8 rounded-3xl bg-slate-900 p-6">
          <div className="mb-4 flex justify-between text-sm text-slate-300">
            <span>Fabric Width: 60 inches</span>
            <span>AI Marker Length: 4.34 yd</span>
            <span>Efficiency: 86.5%</span>
          </div>

          <div className="relative h-[330px] overflow-x-auto rounded-2xl border-4 border-cyan-400 bg-white">
            <div className="absolute left-0 top-0 h-full w-[760px] bg-slate-100">
              {aiPieces.map((piece, index) => (
                <div
                  key={`${piece.name}-${index}`}
                  className="absolute flex items-center justify-center rounded-xl border-2 border-cyan-700 bg-cyan-100 text-sm font-bold text-slate-900 transition-all duration-700"
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
            <div className="rounded-xl bg-cyan-950 p-4">
              <p className="text-sm text-cyan-300">Marker Efficiency</p>
              <p className="text-3xl font-black">86.5%</p>
            </div>

            <div className="rounded-xl bg-cyan-950 p-4">
              <p className="text-sm text-cyan-300">Fabric Used</p>
              <p className="text-3xl font-black">4.34 yd</p>
            </div>

            <div className="rounded-xl bg-green-950 p-4">
              <p className="text-sm text-green-300">Fabric Saving</p>
              <p className="text-3xl font-black">5.2%</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-950 p-5">
            <h2 className="text-xl font-bold">Why did AI improve this?</h2>

            <ul className="mt-4 space-y-2 text-blue-100">
              <li>✔ Reduced unused edge area</li>
              <li>✔ Nested smaller pieces into open spaces</li>
              <li>✔ Kept major panels aligned for practical cutting</li>
              <li>✔ Improved marker efficiency from 82% to 86.5%</li>
            </ul>
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <Link
            href="/optifabric/demo/results"
            className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950"
          >
            View Savings Result →
          </Link>
        </div>
      </div>
    </main>
  );
}