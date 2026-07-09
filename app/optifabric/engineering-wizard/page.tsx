"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { analyzeScaleDetection } from "../../../lib/optifabric/scaleDetectionEngine";
import { analyzeNotches } from "../../../lib/optifabric/notchDetectionEngine";
import { analyzeGrainLine } from "../../../lib/optifabric/grainLineDetectionEngine";
import { analyzeFabricRepeat } from "../../../lib/optifabric/fabricRepeatDetectionEngine";
import { calculateFabricConsumption } from "../../../lib/optifabric/fabricConsumptionAdvisor";

export default function EngineeringWizardPage() {
  const [patternPieceName, setPatternPieceName] = useState("Front Panel");
  const [fabricWidthInches, setFabricWidthInches] = useState(60);
  const [patternAreaSqInches, setPatternAreaSqInches] = useState(850);
  const [quantity, setQuantity] = useState(100);
  const [markerEfficiencyPercent, setMarkerEfficiencyPercent] = useState(82);

  const scaleResult = useMemo(
    () =>
      analyzeScaleDetection({
        imageHasScale: true,
        scaleType: "12-inch-ruler",
        visibleScaleLengthInches: 12,
        measuredPixelLength: 600,
        photoQuality: "clear",
      }),
    []
  );

  const notchResult = useMemo(
    () =>
      analyzeNotches({
        patternPieceName,
        notchVisible: true,
        notchCount: 4,
        expectedNotchCount: 4,
        notchQuality: "clear",
        pieceType: "front-panel",
      }),
    [patternPieceName]
  );

  const grainResult = useMemo(
    () =>
      analyzeGrainLine({
        patternPieceName,
        fabricType: "stripe",
        grainLineVisible: true,
        grainLineDirection: "lengthwise",
        pieceRequiresStrictGrain: true,
      }),
    [patternPieceName]
  );

  const repeatResult = useMemo(
    () =>
      analyzeFabricRepeat({
        fabricType: "woven",
        hasVisibleRepeat: true,
        repeatLengthInches: 2,
        repeatWidthInches: 2,
        printOrCheckType: "stripe",
        buyerRequiresRepeatMatching: true,
      }),
    []
  );

  const consumptionResult = useMemo(
    () =>
      calculateFabricConsumption({
        patternAreaSqInches,
        fabricWidthInches,
        markerEfficiencyPercent,
        quantity,
        matchingAllowancePercent: 5,
        defectAllowancePercent: 2,
      }),
    [
      patternAreaSqInches,
      fabricWidthInches,
      markerEfficiencyPercent,
      quantity,
    ]
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/optifabric/pilot-dashboard"
          className="text-sm font-semibold text-blue-700"
        >
          ← Back to Pilot Dashboard
        </Link>

        <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            RC2 Engineering Workflow
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            OptiFabric AI Engineering Wizard
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            One guided workflow that combines scale detection, notch checking,
            grain line analysis, fabric repeat risk and fabric consumption advice.
          </p>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Factory Input</h2>

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Pattern Piece Name
            </label>
            <input
              className="mt-1 w-full rounded-lg border p-3"
              value={patternPieceName}
              onChange={(e) => setPatternPieceName(e.target.value)}
            />

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Pattern Area Sq Inches
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border p-3"
              value={patternAreaSqInches}
              onChange={(e) => setPatternAreaSqInches(Number(e.target.value))}
            />

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Fabric Width Inches
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border p-3"
              value={fabricWidthInches}
              onChange={(e) => setFabricWidthInches(Number(e.target.value))}
            />

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Quantity
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border p-3"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Marker Efficiency %
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border p-3"
              value={markerEfficiencyPercent}
              onChange={(e) =>
                setMarkerEfficiencyPercent(Number(e.target.value))
              }
            />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="text-xl font-bold">AI Engineering Results</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ResultCard title="Scale Detection" status={scaleResult.status} message={scaleResult.message} />
              <ResultCard title="Notch Inspection" status={notchResult.status} message={notchResult.message} />
              <ResultCard title="Grain Line" status={grainResult.status} message={grainResult.message} />
              <ResultCard title="Fabric Repeat" status={repeatResult.status} message={repeatResult.message} />
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50 p-6">
              <h3 className="text-lg font-bold">Fabric Consumption Advisor</h3>

              <p className="mt-3 text-3xl font-bold text-blue-900">
                {consumptionResult.estimatedFabricYards} yards
              </p>

              <p className="mt-2 text-slate-700">
                Estimated waste: {consumptionResult.estimatedWastePercent}%
              </p>

              <p className="mt-4 font-semibold text-slate-800">
                Why does AI ask this?
              </p>

              <p className="mt-1 text-slate-700">
                {consumptionResult.aiReason}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                {consumptionResult.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultCard({
  title,
  status,
  message,
}: {
  title: string;
  status: string;
  message: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          {status.toUpperCase()}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">{message}</p>
    </div>
  );
}