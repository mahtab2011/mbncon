import Link from "next/link";

import {
  generateMarkerLayout,
} from "@/lib/optifabric/markerLayoutEngine";

export default function MarkerLayoutPage() {
  const result = generateMarkerLayout({
    fabricWidth: 60,
    patternPieces: 8,
    totalAreaSqInches: 168,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/optifabric/cutting-assistant/pattern-area"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Pattern Area
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            Block 006 · AI Marker Layout
          </p>

          <h1 className="text-4xl font-bold mb-4">
            AI Marker Recommendation
          </h1>

          <p className="text-slate-300">
            OptiFabric AI prepares an initial cutting marker using the pattern
            geometry and fabric width.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Marker Results</h2>

            <p>Estimated Marker Length: {result.estimatedMarkerLength} inches</p>

            <p className="mt-3">
              Marker Efficiency: {result.markerEfficiency}%
            </p>

            <p className="mt-3">
              Estimated Waste: {result.estimatedWaste}%
            </p>

            <p className="mt-3">
              Confidence: {result.confidence}%
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">
              AI Recommendation
            </h2>

            <p className="text-slate-300 mb-4">
              {result.recommendedLayout}
            </p>

            <ul className="space-y-2 text-slate-300">
              {result.notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-cyan-950/40 border border-cyan-800 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI generate a marker?
          </h2>

          <p className="mt-3 text-slate-300">
            The marker determines fabric utilization, waste percentage,
            production cost, and cutting efficiency. A better marker directly
            improves factory profitability.
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/fabric-consumption"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Continue →
          </Link>
        </div>
      </div>
    </main>
  );
}