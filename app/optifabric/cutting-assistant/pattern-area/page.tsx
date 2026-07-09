import Link from "next/link";

import {
  calculatePatternArea,
} from "@/lib/optifabric/patternAreaEngine";

export default function PatternAreaPage() {
  const result = calculatePatternArea({
    patternPieceCount: 8,
    scaleLengthInches: 12,
    pixelLengthOfScale: 600,
    estimatedPixelArea: 420000,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/optifabric/cutting-assistant/pattern-analysis"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Pattern Analysis
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            Block 005 · Pattern Area Engine
          </p>

          <h1 className="text-4xl font-bold mb-4">
            AI Pattern Area Calculation
          </h1>

          <p className="text-slate-300 max-w-3xl">
            OptiFabric AI converts the traced pattern boundary into real square
            inches using the calibrated 12-inch scale.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Area Result</h2>

            <p>Total Area: {result.totalAreaSqInches} sq inches</p>
            <p className="mt-3">Total Area: {result.totalAreaSqFeet} sq feet</p>
            <p className="mt-3">
              Area Per Piece: {result.areaPerPieceSqInches} sq inches
            </p>
            <p className="mt-3">
              Calibration Ratio: {result.calibrationRatio} inch per pixel
            </p>
            <p className="mt-3">Confidence: {result.confidence}%</p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">AI Engineering Notes</h2>

            <ul className="space-y-2 text-slate-300">
              {result.notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-cyan-950/40 border border-cyan-800 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI calculate pattern area?
          </h2>

          <p className="mt-3 text-slate-300">
            AI needs the real pattern area before it can estimate fabric
            consumption, marker efficiency, cutting waste, and possible savings.
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/marker-layout"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Continue →
          </Link>
        </div>
      </div>
    </main>
  );
}