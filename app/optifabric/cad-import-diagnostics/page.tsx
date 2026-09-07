/**
 * OptiFabric AI — Step 5B CAD Import Diagnostics
 *
 * A permanent, isolated engineering dashboard for the DXF/CAD import
 * foundation built in lib/optifabric/cadImport/. This page is NOT part of
 * the production marker workflow, is not linked from the live project
 * pages, and does not feed anything into the live marker page, the
 * nesting/optimisation engines, or the Production Safety Gate.
 *
 * All fixtures rendered here are synthetic engineering test fixtures, not
 * real factory CAD files — see lib/optifabric/cadImport/testFixtures/.
 */

import {
  runDxfImportValidationSuite,
  summariseValidationSuite,
} from "@/lib/optifabric/cadImport/dxfImportValidationSuite";

export default function CadImportDiagnosticsPage() {
  const results = runDxfImportValidationSuite();
  const summary = summariseValidationSuite(results);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Step 5B · Isolated Engineering Diagnostics
        </p>

        <h1 className="mt-3 text-3xl font-black">DXF/CAD Import Validation Suite</h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-200">
          All fixtures below are hand-authored ENGINEERING TEST FIXTURES —
          NOT real factory CAD files. This page does not feed into the live
          marker page or any production engine.
        </p>

        <div
          className={`mt-6 rounded-2xl border p-4 text-lg font-black ${
            summary.allPassed
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-red-400/40 bg-red-500/10 text-red-200"
          }`}
        >
          {summary.passed} / {summary.total} checks passed
          {summary.failed > 0 ? ` — ${summary.failed} FAILED` : ""}
        </div>

        <div className="mt-6 space-y-2">
          {results.map((result) => (
            <div
              key={result.name}
              className={`rounded-xl border p-3 text-sm ${
                result.passed
                  ? "border-slate-700 bg-slate-900/60"
                  : "border-red-500/40 bg-red-950/30"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold">{result.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-black uppercase ${
                    result.passed
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {result.passed ? "Pass" : "Fail"}
                </span>
              </div>

              <p className="mt-1 break-all text-xs text-slate-500">{result.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
