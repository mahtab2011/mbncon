"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const manualPieces = [
  { name: "Front", x: 30, y: 30, w: 150, h: 220 },
  { name: "Back", x: 210, y: 30, w: 150, h: 220 },
  { name: "Sleeve", x: 390, y: 30, w: 150, h: 120 },
  { name: "Sleeve", x: 570, y: 30, w: 150, h: 120 },
  { name: "Collar", x: 390, y: 180, w: 150, h: 55 },
  { name: "Cuff", x: 570, y: 180, w: 115, h: 45 },
  { name: "Pocket", x: 720, y: 180, w: 70, h: 80 },
];

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

const thinkingSteps = [
  "Analysing polygon boundaries...",
  "Checking grain direction...",
  "Testing rotation options...",
  "Searching better nesting positions...",
  "Comparing marker utilization...",
  "Best layout found.",
];

export default function DemoTheatrePage() {
  const [optimized, setOptimized] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((current) =>
        current < thinkingSteps.length - 1 ? current + 1 : current
      );
    }, 900);

    const progressTimer = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          setOptimized(true);
          return 100;
        }

        return current + 11;
      });
    }, 650);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const pieces = optimized ? aiPieces : manualPieces;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/layout" className="text-cyan-300">
          ← Back to Manual Marker
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            OptiFabric AI Theatre
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Watch AI Optimize This Marker
          </h1>

          <p className="mt-3 max-w-3xl text-slate-300">
            The same pattern pieces are rearranged to reduce fabric waste while
            keeping practical cutting rules.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-4 flex justify-between text-sm text-slate-300">
              <span>Solid Fabric Lay: 60 inches</span>
              <span>{optimized ? "AI Optimized Marker" : "Manual Marker"}</span>
              <span>{optimized ? "86.5% Efficiency" : "82% Efficiency"}</span>
            </div>

            <div className="relative h-[330px] overflow-x-auto rounded-2xl border-4 border-cyan-400 bg-white">
              <div className="absolute left-0 top-0 h-full w-[900px] bg-slate-100">
                {pieces.map((piece, index) => (
                  <div
                    key={`${piece.name}-${index}`}
                    className={`absolute flex items-center justify-center rounded-xl border-2 text-sm font-bold text-slate-900 transition-all duration-1000 ${
                      optimized
                        ? "border-cyan-700 bg-cyan-100"
                        : "border-slate-700 bg-slate-300"
                    }`}
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

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Optimization progress: {progress}%
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              AI Engineering Decision
            </h2>

            <div className="mt-5 rounded-2xl bg-blue-950 p-5">
              <p className="text-cyan-300">
                {thinkingSteps[stepIndex]}
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-slate-400">Manual Efficiency</p>
                <p className="text-3xl font-black">82%</p>
              </div>

              <div className="rounded-xl bg-cyan-950 p-4">
                <p className="text-cyan-300">AI Efficiency</p>
                <p className="text-3xl font-black">
                  {optimized ? "86.5%" : "Calculating..."}
                </p>
              </div>

              <div className="rounded-xl bg-green-950 p-4">
                <p className="text-green-300">Estimated Saving</p>
                <p className="text-3xl font-black">
                  {optimized ? "5.2%" : "Running..."}
                </p>
              </div>
            </div>

            {optimized && (
              <div className="mt-6 rounded-2xl bg-slate-800 p-5">
                <h3 className="font-bold text-cyan-300">
                  Why AI improved this layout
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li>✔ Sleeve placement compacted</li>
                  <li>✔ Pocket moved into open space</li>
                  <li>✔ Collar and cuff grouped efficiently</li>
                  <li>✔ Edge waste reduced</li>
                  <li>✔ Marker length reduced</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <Link
            href="/optifabric/demo/results"
            className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950"
          >
            Continue to Savings →
          </Link>
        </div>
      </div>
    </main>
  );
}