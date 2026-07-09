"use client";

import Link from "next/link";

export default function DemoResultsPage() {
  const monthlyProduction = 40000;
  const savingPerPieceYards = 0.24;
  const fabricCostPerYard = 2.75;

  const monthlyFabricSaved = monthlyProduction * savingPerPieceYards;
  const monthlyMoneySaved = monthlyFabricSaved * fabricCostPerYard;
  const yearlyMoneySaved = monthlyMoneySaved * 12;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/ai" className="text-cyan-300">
          ← Back to AI Layout
        </Link>

        <h1 className="mt-6 text-4xl font-black">
          AI Fabric Savings Result
        </h1>

        <p className="mt-3 max-w-3xl text-slate-300">
          OptiFabric AI compares the manual marker with the optimized polygon
          nesting layout and estimates the commercial impact.
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Marker Comparison</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-slate-400">Manual Marker Efficiency</p>
                <p className="text-4xl font-black">82%</p>
              </div>

              <div className="rounded-xl bg-cyan-950 p-5">
                <p className="text-cyan-300">AI Marker Efficiency</p>
                <p className="text-4xl font-black">86.5%</p>
              </div>

              <div className="rounded-xl bg-green-950 p-5">
                <p className="text-green-300">Efficiency Improvement</p>
                <p className="text-4xl font-black">+4.5%</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Estimated Saving</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-slate-400">Manual Fabric Used</p>
                <p className="text-4xl font-black">4.58 yd</p>
              </div>

              <div className="rounded-xl bg-cyan-950 p-5">
                <p className="text-cyan-300">AI Fabric Used</p>
                <p className="text-4xl font-black">4.34 yd</p>
              </div>

              <div className="rounded-xl bg-green-950 p-5">
                <p className="text-green-300">Saving Per Marker</p>
                <p className="text-4xl font-black">0.24 yd</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-blue-950 p-8">
          <h2 className="text-3xl font-black">
            What Could This Mean for a Factory?
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-blue-900 p-5">
              <p className="text-blue-200">Monthly Production</p>
              <p className="text-3xl font-black">
                {monthlyProduction.toLocaleString()} pcs
              </p>
            </div>

            <div className="rounded-xl bg-blue-900 p-5">
              <p className="text-blue-200">Fabric Cost</p>
              <p className="text-3xl font-black">
                ${fabricCostPerYard}/yd
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5">
              <p className="text-green-200">Estimated Monthly Saving</p>
              <p className="text-3xl font-black">
                ${monthlyMoneySaved.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-green-950 p-6 text-center">
            <p className="text-green-300">Estimated Annual Saving</p>
            <p className="mt-2 text-5xl font-black">
              ${yearlyMoneySaved.toLocaleString()}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-slate-900 p-8 text-center">
          <h2 className="text-3xl font-black">
            Ready to Try Your Own Pattern?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            This demonstration uses a built-in sample style. The next step is to
            upload your own pattern photo or PDF and let OptiFabric AI estimate
            the possible saving.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/optifabric/mini-pilot/live-tracing"
              className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950"
            >
              Upload My Pattern
            </Link>
<Link
  href="/optifabric/demo/roi"
  className="rounded-xl bg-green-500 px-8 py-4 text-lg font-black text-slate-950"
>
  Calculate My Saving
</Link>
            <Link
              href="/optifabric/demo"
              className="rounded-xl border border-slate-500 px-8 py-4 text-lg font-bold text-white"
            >
              Replay Demo
            </Link>
          </div>
          
        </section>
      </div>
    </main>
  );
}