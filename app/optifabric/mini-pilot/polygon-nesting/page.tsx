"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { fabricPatternTypes } from "@/lib/optifabric/fabricPatternTypes";

export default function PolygonNestingPage() {
  const [fabricType, setFabricType] = useState("solid");
  const [fabricWidth, setFabricWidth] = useState(60);
  const [patternArea, setPatternArea] = useState(168);
  const [orderQuantity, setOrderQuantity] = useState(5000);
  const [fabricPrice, setFabricPrice] = useState(2.5);

  const selectedFabric = fabricPatternTypes.find(
    (item) => item.id === fabricType
  );

  const result = useMemo(() => {
    const restrictionFactor =
      fabricType === "solid" ? 1.12 : fabricType === "directional" ? 1.25 : 1.32;

    const markerArea = patternArea * restrictionFactor;
    const airArea = markerArea - patternArea;
    const efficiency = (patternArea / markerArea) * 100;
    const markerLength = markerArea / fabricWidth;
    const consumptionPerGarmentYards = markerLength / 36;
    const totalYards = consumptionPerGarmentYards * orderQuantity;
    const currentEfficiency = fabricType === "solid" ? 82 : 76;
    const aiSavingPercent = efficiency - currentEfficiency;
    const savedYards = totalYards * (aiSavingPercent / 100);
    const savedMoney = savedYards * fabricPrice;

    return {
      markerArea: Number(markerArea.toFixed(2)),
      airArea: Number(airArea.toFixed(2)),
      efficiency: Number(efficiency.toFixed(2)),
      markerLength: Number(markerLength.toFixed(2)),
      consumptionPerGarmentYards: Number(consumptionPerGarmentYards.toFixed(4)),
      totalYards: Number(totalYards.toFixed(2)),
      currentEfficiency,
      aiSavingPercent: Number(aiSavingPercent.toFixed(2)),
      savedYards: Number(savedYards.toFixed(2)),
      savedMoney: Number(savedMoney.toFixed(2)),
    };
  }, [fabricType, fabricWidth, patternArea, orderQuantity, fabricPrice]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/optifabric/mini-pilot/live-tracing"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Live Tracing
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            Mini Pilot · AI Polygon Nesting
          </p>

          <h1 className="text-4xl font-bold mb-4">
            AI Polygon Nesting & Marker Saving
          </h1>

          <p className="text-slate-300 max-w-3xl">
            OptiFabric AI estimates how a traced pattern can be nested inside the
            usable fabric width and converts marker efficiency into fabric and
            money savings.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Nesting Inputs</h2>

            <label className="block mb-2 text-sm font-semibold">
              Fabric Pattern Type
            </label>
            <select
              value={fabricType}
              onChange={(event) => setFabricType(event.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300 mb-5"
            >
              {fabricPatternTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-semibold">
              Fabric Width / Usable Width (inches)
            </label>
            <input
              type="number"
              value={fabricWidth}
              onChange={(event) => setFabricWidth(Number(event.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300 mb-5"
            />

            <label className="block mb-2 text-sm font-semibold">
              Traced Pattern Area (sq inches)
            </label>
            <input
              type="number"
              value={patternArea}
              onChange={(event) => setPatternArea(Number(event.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300 mb-5"
            />

            <label className="block mb-2 text-sm font-semibold">
              Order Quantity (pcs)
            </label>
            <input
              type="number"
              value={orderQuantity}
              onChange={(event) => setOrderQuantity(Number(event.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300 mb-5"
            />

            <label className="block mb-2 text-sm font-semibold">
              Fabric Price Per Yard
            </label>
            <input
              type="number"
              value={fabricPrice}
              onChange={(event) => setFabricPrice(Number(event.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4 text-slate-300"
            />

            <div className="mt-5 rounded-xl bg-cyan-950/40 border border-cyan-800 p-4">
              <p className="text-sm font-semibold text-cyan-300 mb-1">
                Why does AI ask fabric type?
              </p>
              <p className="text-sm text-slate-300">
                {selectedFabric?.aiLogic}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">AI Marker Result</h2>

            <p>Marker Area: {result.markerArea} sq inches</p>
            <p className="mt-3">Air Area: {result.airArea} sq inches</p>
            <p className="mt-3">AI Marker Efficiency: {result.efficiency}%</p>
            <p className="mt-3">Marker Length: {result.markerLength} inches</p>
            <p className="mt-3">
              Consumption / Garment: {result.consumptionPerGarmentYards} yards
            </p>
            <p className="mt-3">Total Fabric: {result.totalYards} yards</p>

            <div className="mt-6 rounded-xl bg-green-950/40 border border-green-700 p-5">
              <h3 className="text-xl font-bold text-green-300">
                Estimated Saving
              </h3>

              <p className="mt-3">
                Current Factory Efficiency: {result.currentEfficiency}%
              </p>
              <p className="mt-3">
                AI Improvement: {result.aiSavingPercent}%
              </p>
              <p className="mt-3">Fabric Saved: {result.savedYards} yards</p>
              <p className="mt-3 font-bold text-green-300">
                Money Saved: ${result.savedMoney}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-amber-950/40 border border-amber-700 p-5">
              <h3 className="font-bold text-amber-200">
                AI Engineering Explanation
              </h3>
              <p className="mt-3 text-sm text-amber-100">
                Solid fabric allows freer nesting and higher efficiency.
                Stripe, check, printed and directional fabrics require
                restricted rotation and matching allowance, so AI reduces the
                expected efficiency to protect quality.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}