"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function DemoRoiPage() {
  const [monthlyProduction, setMonthlyProduction] = useState(40000);
  const [savingPerPieceYards, setSavingPerPieceYards] = useState(0.24);
  const [fabricCostPerYard, setFabricCostPerYard] = useState(2.75);

  const result = useMemo(() => {
    const monthlyFabricSaved = monthlyProduction * savingPerPieceYards;
    const monthlyMoneySaved = monthlyFabricSaved * fabricCostPerYard;
    const yearlyMoneySaved = monthlyMoneySaved * 12;

    return {
      monthlyFabricSaved,
      monthlyMoneySaved,
      yearlyMoneySaved,
    };
  }, [monthlyProduction, savingPerPieceYards, fabricCostPerYard]);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/results" className="text-cyan-300">
          ← Back to Results
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Factory ROI Calculator
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Estimate Your Fabric Saving
          </h1>

          <p className="mt-3 max-w-3xl text-slate-300">
            Enter simple factory numbers and see how small marker improvements
            can become large monthly and annual savings.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Factory Inputs</h2>

            <label className="mt-5 block text-sm font-bold text-slate-300">
              Monthly Production Pieces
            </label>
            <input
              type="number"
              className="mt-2 w-full rounded-xl bg-slate-800 p-4 text-white"
              value={monthlyProduction}
              onChange={(e) => setMonthlyProduction(Number(e.target.value))}
            />

            <label className="mt-5 block text-sm font-bold text-slate-300">
              Estimated Saving Per Piece/Yard
            </label>
            <input
              type="number"
              step="0.01"
              className="mt-2 w-full rounded-xl bg-slate-800 p-4 text-white"
              value={savingPerPieceYards}
              onChange={(e) => setSavingPerPieceYards(Number(e.target.value))}
            />

            <label className="mt-5 block text-sm font-bold text-slate-300">
              Fabric Cost Per Yard ($)
            </label>
            <input
              type="number"
              step="0.01"
              className="mt-2 w-full rounded-xl bg-slate-800 p-4 text-white"
              value={fabricCostPerYard}
              onChange={(e) => setFabricCostPerYard(Number(e.target.value))}
            />

            <div className="mt-6 rounded-2xl bg-blue-950 p-5">
              <h3 className="font-bold text-cyan-300">
                Why does AI ask this?
              </h3>
              <p className="mt-2 text-blue-100">
                AI asks these business inputs because marker efficiency only
                becomes meaningful when converted into fabric yards and money.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Estimated Impact</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-xl bg-cyan-950 p-5">
                <p className="text-cyan-300">Monthly Fabric Saved</p>
                <p className="mt-2 text-4xl font-black">
                  {result.monthlyFabricSaved.toLocaleString()} yd
                </p>
              </div>

              <div className="rounded-xl bg-green-950 p-5">
                <p className="text-green-300">Monthly Cost Saving</p>
                <p className="mt-2 text-4xl font-black">
                  ${result.monthlyMoneySaved.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-green-900 p-6 text-center">
                <p className="text-green-200">Estimated Annual Saving</p>
                <p className="mt-2 text-6xl font-black">
                  ${result.yearlyMoneySaved.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-800 p-5">
              <h3 className="font-bold text-cyan-300">
                AI Commercial Message
              </h3>
              <p className="mt-2 text-slate-200">
                Even a small improvement in marker efficiency can become a major
                annual saving when repeated across thousands of garments.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-slate-900 p-8 text-center">
          <h2 className="text-3xl font-black">
            Ready to Try Your Own Pattern?
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/optifabric/mini-pilot/live-tracing"
              className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950"
            >
              Upload My Pattern
            </Link>

            <Link
              href="/optifabric/demo"
              className="rounded-xl border border-slate-500 px-8 py-4 text-lg font-bold"
            >
              Replay AI Demo
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}