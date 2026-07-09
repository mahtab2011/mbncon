import Link from "next/link";

import {
  detectPatternBoundary,
} from "@/lib/optifabric/patternBoundaryEngine";

export default function PatternAnalysisPage() {

  const result =
    detectPatternBoundary("sample-pattern.pdf");

  return (

    <main className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-6xl mx-auto">

        <Link
          href="/optifabric/cutting-assistant/fabric-specs"
          className="text-cyan-300"
        >
          ← Back
        </Link>

        <div className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">

          <h1 className="text-4xl font-bold">
            AI Pattern Boundary Detection
          </h1>

          <p className="mt-4 text-slate-300">
            OptiFabric AI analyses uploaded patterns and prepares them for
            marker generation.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4">
              Detection Result
            </h2>

            <p>Boundary Found : {result.detected ? "YES" : "NO"}</p>

            <p className="mt-3">
              Confidence : {result.confidence}%
            </p>

            <p className="mt-3">
              Estimated Pattern Pieces : {result.estimatedPieces}
            </p>

          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">

            <h2 className="text-2xl font-bold mb-4">
              AI Analysis
            </h2>

            <ul className="space-y-2">

              {result.notes.map((note) => (

                <li key={note}>
                  • {note}
                </li>

              ))}

            </ul>

          </div>

        </div>

        <div className="mt-10 rounded-2xl bg-cyan-950 border border-cyan-700 p-6">

          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI perform boundary detection?
          </h2>

          <p className="mt-3 text-slate-300">
            AI must identify the exact outline of every pattern piece before it
            can calculate fabric area, generate an efficient marker, estimate
            fabric consumption, or recommend savings.
          </p>

        </div>

        <div className="mt-10 flex justify-end">

          <Link
            href="/optifabric/cutting-assistant/pattern-area"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Continue →
          </Link>

        </div>

      </div>

    </main>

  );

}