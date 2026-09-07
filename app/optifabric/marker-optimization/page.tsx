/**
 * OptiFabric AI
 * RC5-004-017 — Step 3 Marker Optimisation Benchmark Dashboard
 *
 * Purpose:
 * - Render the old-engine-vs-new-optimiser benchmark
 *   (markerOptimisationBenchmarkEngine.ts) for every fixed fixture, across
 *   all three operating profiles (FAST / BALANCED / MAXIMUM).
 * - Show the exact metric set Step 3 was asked to report: utilisation,
 *   marker length, waste %, placement count, collision count, rotation/
 *   grain/nap violations, runtime, and improvement over baseline.
 * - Surface any safety-violation warnings loudly — this page never hides a
 *   non-zero collision/rotation/grain/nap count behind a "looks fine" badge.
 * - Also renders the Step 3C axis-convention regression test
 *   (safeDenseAxisRegressionTest.ts) as a permanent, always-visible check.
 */

import Link from "next/link";

import {
  runAllMarkerOptimisationBenchmarks,
  type MarkerOptimisationBenchmarkMetrics,
  type MarkerOptimisationBenchmarkProfileResult,
  type MarkerOptimisationBenchmarkResult,
} from "@/lib/optifabric/markerOptimization/markerOptimisationBenchmarkEngine";

import {
  runSafeDenseAxisRegressionTest,
  type AxisRegressionCheck,
} from "@/lib/optifabric/markerOptimization/safeDenseAxisRegressionTest";

function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-GB", { maximumFractionDigits }).format(value);
}

function formatPercentage(value: number, maximumFractionDigits = 1): string {
  return `${formatNumber(value, maximumFractionDigits)}%`;
}

function formatSigned(value: number, maximumFractionDigits = 2): string {
  const formatted = formatNumber(Math.abs(value), maximumFractionDigits);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly secondary?: string;
  readonly tone?: "neutral" | "positive" | "negative";
}

function MetricCard({ label, value, secondary, tone = "neutral" }: MetricCardProps) {
  const valueClass =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-rose-300"
        : "text-white";

  return (
    <article className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-bold ${valueClass}`}>{value}</p>
      {secondary ? (
        <p className="mt-2 text-sm leading-6 text-slate-400">{secondary}</p>
      ) : null}
    </article>
  );
}

function decisionBadgeClasses(released: boolean): string {
  return released
    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
    : "border-amber-400/40 bg-amber-500/10 text-amber-200";
}

function violationCellClass(count: number): string {
  return count === 0 ? "text-emerald-300" : "text-rose-300 font-semibold";
}

interface MetricsRow {
  readonly label: string;
  readonly metrics: MarkerOptimisationBenchmarkMetrics;
  readonly improvementUtilisationPts?: number;
  readonly improvementLengthPercent?: number;
  readonly candidateLabel?: string;
  readonly strategiesRun?: number;
  readonly strategiesSkipped?: number;
}

function BenchmarkTable({ rows }: { readonly rows: ReadonlyArray<MetricsRow> }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700/70">
      <table className="w-full min-w-[1100px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-700/70 bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3">Engine / Profile</th>
            <th className="px-4 py-3">Utilisation</th>
            <th className="px-4 py-3">Marker Length</th>
            <th className="px-4 py-3">Waste</th>
            <th className="px-4 py-3">Placed / Expected</th>
            <th className="px-4 py-3">Collisions</th>
            <th className="px-4 py-3">Rotation Viol.</th>
            <th className="px-4 py-3">Grain Viol.</th>
            <th className="px-4 py-3">Nap Viol.</th>
            <th className="px-4 py-3">Runtime</th>
            <th className="px-4 py-3">Gate Decision</th>
            <th className="px-4 py-3">vs Baseline</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-slate-800/70 text-slate-200 last:border-b-0 odd:bg-slate-950/30"
            >
              <td className="px-4 py-3 align-top">
                <p className="font-semibold text-white">{row.label}</p>
                {row.candidateLabel ? (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {row.candidateLabel}
                  </p>
                ) : null}
                {row.strategiesRun !== undefined ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {row.strategiesRun} strategies run
                    {row.strategiesSkipped ? `, ${row.strategiesSkipped} skipped (time budget)` : ""}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 align-top">
                {formatPercentage(row.metrics.utilisationPercent)}
              </td>
              <td className="px-4 py-3 align-top">
                {formatNumber(row.metrics.markerLengthCm)} cm
              </td>
              <td className="px-4 py-3 align-top">
                {formatPercentage(row.metrics.wastePercent)}
              </td>
              <td className="px-4 py-3 align-top">
                {row.metrics.placedPieceCount} / {row.metrics.expectedPieceCount}
              </td>
              <td className={`px-4 py-3 align-top ${violationCellClass(row.metrics.collisionCount)}`}>
                {row.metrics.collisionCount}
              </td>
              <td className={`px-4 py-3 align-top ${violationCellClass(row.metrics.rotationViolationCount)}`}>
                {row.metrics.rotationViolationCount}
              </td>
              <td className={`px-4 py-3 align-top ${violationCellClass(row.metrics.grainViolationCount)}`}>
                {row.metrics.grainViolationCount}
              </td>
              <td className={`px-4 py-3 align-top ${violationCellClass(row.metrics.napViolationCount)}`}>
                {row.metrics.napViolationCount}
              </td>
              <td className="px-4 py-3 align-top">{formatNumber(row.metrics.runtimeMs, 0)} ms</td>
              <td className="px-4 py-3 align-top">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${decisionBadgeClasses(
                    row.metrics.productionReleased
                  )}`}
                >
                  {row.metrics.productionReleased ? "Released" : "Review"}
                </span>
              </td>
              <td className="px-4 py-3 align-top text-xs leading-5">
                {row.improvementUtilisationPts !== undefined ? (
                  <>
                    <p>
                      Utilisation{" "}
                      <span
                        className={
                          row.improvementUtilisationPts >= 0
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }
                      >
                        {formatSigned(row.improvementUtilisationPts)} pts
                      </span>
                    </p>
                    <p>
                      Length{" "}
                      <span
                        className={
                          (row.improvementLengthPercent ?? 0) >= 0
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }
                      >
                        {formatSigned(row.improvementLengthPercent ?? 0)}%
                      </span>
                    </p>
                  </>
                ) : (
                  <span className="text-slate-500">reference</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FixtureReport({ report }: { readonly report: MarkerOptimisationBenchmarkResult }) {
  const rows: MetricsRow[] = [
    { label: "Baseline (old engine)", metrics: report.baseline },
    ...report.profiles.map(
      (profile: MarkerOptimisationBenchmarkProfileResult): MetricsRow => ({
        label: profile.label,
        metrics: profile.metrics,
        improvementUtilisationPts: profile.utilisationImprovementPercentagePoints,
        improvementLengthPercent: profile.markerLengthReductionPercent,
        candidateLabel: profile.bestCandidateLabel,
        strategiesRun: profile.strategiesRun.length,
        strategiesSkipped: profile.strategiesSkippedByBudget.length,
      })
    ),
  ];

  return (
    <section className="mt-8 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold text-white">{report.fixtureName}</h2>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            report.safetyChecksPassed
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-400/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {report.safetyChecksPassed ? "All safety checks passed" : "Safety violation detected"}
        </span>
      </div>

      <p className="max-w-4xl text-sm leading-6 text-slate-400">{report.fixtureDescription}</p>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {report.expectedPieceCount} piece instances
      </p>

      <BenchmarkTable rows={rows} />

      {report.warnings.length > 0 ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-950/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            Warnings
          </p>
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-amber-100">
            {report.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function AxisRegressionCheckRow({ check }: { readonly check: AxisRegressionCheck }) {
  const passed = check.status === "passed";

  return (
    <li
      className={`rounded-xl border p-4 ${
        passed
          ? "border-emerald-500/25 bg-emerald-950/20"
          : "border-rose-500/25 bg-rose-950/20"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-white">{check.title}</p>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            passed
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-400/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {passed ? "Passed" : "Failed"}
        </span>
      </div>
      <p className="mt-2 font-mono text-xs leading-5 text-slate-400">{check.detail}</p>
    </li>
  );
}

function AxisRegressionSection() {
  const report = runSafeDenseAxisRegressionTest();

  return (
    <section className="mt-10 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold text-white">
          Step 3C — Axis-Convention Regression (RC5-004-018)
        </h2>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            report.allPassed
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-400/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {report.allPassed ? "All checks passed" : "Regression failed"}
        </span>
      </div>

      <p className="max-w-4xl text-sm leading-6 text-slate-400">
        Permanent regression coverage for the Step 3B finding that
        safeDenseRepackingEngine.ts once used the opposite fabric-width/
        length axis convention to the baseline engine. Cases A/B/C are the
        exact diagnostic fixtures that proved the mismatch — Case B
        deliberately mirrors Case A&apos;s panel proportions to prove any fix
        is a genuine axis correction, not a fixture-specific patch.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-700/70">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700/70 bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Baseline length</th>
              <th className="px-4 py-3">Dense length</th>
              <th className="px-4 py-3">Ratio (dense/baseline)</th>
              <th className="px-4 py-3">Dense safe &amp; complete</th>
            </tr>
          </thead>
          <tbody>
            {report.results.map((result) => (
              <tr
                key={result.id}
                className="border-b border-slate-800/70 text-slate-200 last:border-b-0 odd:bg-slate-950/30"
              >
                <td className="px-4 py-3 align-top">
                  <p className="font-semibold text-white">Case {result.id}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{result.name}</p>
                </td>
                <td className="px-4 py-3 align-top">{formatNumber(result.baselineLength, 1)} cm</td>
                <td className="px-4 py-3 align-top">
                  {result.denseLength === null ? "—" : `${formatNumber(result.denseLength, 1)} cm`}
                </td>
                <td className="px-4 py-3 align-top">
                  {result.ratio === null ? "—" : formatNumber(result.ratio, 2)}
                </td>
                <td className="px-4 py-3 align-top">
                  {result.denseComplete && result.denseCollisionFree && result.denseBoundarySafe
                    ? "Yes"
                    : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3">
        {report.checks.map((check) => (
          <AxisRegressionCheckRow key={check.id} check={check} />
        ))}
      </ul>
    </section>
  );
}

export default function MarkerOptimisationBenchmarkPage() {
  const reports = runAllMarkerOptimisationBenchmarks();

  const allSafe = reports.every((report) => report.safetyChecksPassed);
  const bestUtilisationGain = reports.reduce((max, report) => {
    const gain = Math.max(
      ...report.profiles.map((profile) => profile.utilisationImprovementPercentagePoints)
    );
    return Math.max(max, gain);
  }, -Infinity);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  OptiFabric AI
                </span>
                <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
                  Step 3 · RC5-004-015/016/017
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Multi-Strategy Marker Optimisation Benchmark
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                Old engine (single-pass bottom-left-fill) versus the Step 3
                multi-strategy optimiser — FAST / QUOTATION, BALANCED /
                PRODUCTION and MAXIMUM EFFICIENCY — on identical pattern
                sets. Every candidate from every engine passes through the
                unmodified Step 2 Production Safety Gate before it can be
                shown here as production-safe.
              </p>
            </div>

            <div
              className={`min-w-[230px] rounded-2xl border p-5 ${
                allSafe
                  ? "border-emerald-500/25 bg-emerald-950/20"
                  : "border-rose-500/25 bg-rose-950/20"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Step 2 Safety Guarantee
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold ${
                    allSafe
                      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
                      : "border-rose-400/50 bg-rose-500/15 text-rose-200"
                  }`}
                >
                  {allSafe ? "✓" : "×"}
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {allSafe ? "Intact" : "Violated"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {allSafe
                      ? "Zero collisions / rotation / grain / nap violations"
                      : "See warnings below"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/optifabric"
              className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:bg-slate-800"
            >
              Back to OptiFabric
            </Link>
            <Link
              href="/optifabric/marker-optimization/rc5-004-validation"
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Hole-Filling &amp; Compaction Validation
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Fixtures Benchmarked"
            value={String(reports.length)}
            secondary="Fixed synthetic pattern sets"
          />
          <MetricCard
            label="Safety Checks"
            value={allSafe ? "All Passed" : "Violation Found"}
            tone={allSafe ? "positive" : "negative"}
            secondary="Collision / rotation / grain / nap"
          />
          <MetricCard
            label="Best Utilisation Gain"
            value={
              Number.isFinite(bestUtilisationGain)
                ? formatSigned(bestUtilisationGain, 1) + " pts"
                : "—"
            }
            tone={bestUtilisationGain > 0 ? "positive" : "neutral"}
            secondary="Best profile vs baseline, any fixture"
          />
          <MetricCard
            label="Operating Profiles"
            value="3"
            secondary="FAST · BALANCED · MAXIMUM"
          />
        </section>

        {reports.map((report) => (
          <FixtureReport key={report.fixtureName} report={report} />
        ))}

        <AxisRegressionSection />
      </div>
    </main>
  );
}
