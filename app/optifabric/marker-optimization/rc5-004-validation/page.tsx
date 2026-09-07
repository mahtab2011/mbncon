/**
 * OptiFabric AI
 * RC5-004-007 — Hole Filling & Compaction Validation Dashboard
 *
 * Purpose:
 * - Run the deterministic RC5-004 engineering validation.
 * - Display workflow checks and calculated performance metrics.
 * - Confirm Hole Filling, Collision Validation and Marker Compaction.
 * - Provide visual proof before live multi-solution canvas integration.
 */

import Link from "next/link";

import {
  runHoleFillingCompactionValidation,
  type HoleFillingValidationCheck,
  type HoleFillingValidationStatus,
} from "@/lib/optifabric/markerOptimization/holeFillingCompactionValidation";
function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits,
  }).format(value);
}

function formatPercentage(
  value: number,
  maximumFractionDigits = 2,
): string {
  return `${formatNumber(value, maximumFractionDigits)}%`;
}

function getStatusLabel(
  status: HoleFillingValidationStatus,
): string {
  switch (status) {
    case "passed":
      return "Passed";

    case "warning":
      return "Warning";

    case "failed":
      return "Failed";

    default:
      return "Unknown";
  }
}

function getStatusSymbol(
  status: HoleFillingValidationStatus,
): string {
  switch (status) {
    case "passed":
      return "✓";

    case "warning":
      return "!";

    case "failed":
      return "×";

    default:
      return "?";
  }
}

function getStatusClasses(
  status: HoleFillingValidationStatus,
): {
  badge: string;
  icon: string;
  panel: string;
} {
  switch (status) {
    case "passed":
      return {
        badge:
          "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
        icon:
          "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
        panel:
          "border-emerald-500/25 bg-emerald-950/20",
      };

    case "warning":
      return {
        badge:
          "border-amber-400/40 bg-amber-500/10 text-amber-200",
        icon:
          "border-amber-400/50 bg-amber-500/15 text-amber-200",
        panel:
          "border-amber-500/25 bg-amber-950/20",
      };

    case "failed":
      return {
        badge:
          "border-rose-400/40 bg-rose-500/10 text-rose-200",
        icon:
          "border-rose-400/50 bg-rose-500/15 text-rose-200",
        panel:
          "border-rose-500/25 bg-rose-950/20",
      };

    default:
      return {
        badge:
          "border-slate-400/40 bg-slate-500/10 text-slate-200",
        icon:
          "border-slate-400/50 bg-slate-500/15 text-slate-200",
        panel:
          "border-slate-500/25 bg-slate-950/20",
      };
  }
}

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly secondary?: string;
  readonly positive?: boolean;
}

function MetricCard({
  label,
  value,
  secondary,
  positive = false,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-bold ${
          positive ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>

      {secondary ? (
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {secondary}
        </p>
      ) : null}
    </article>
  );
}

interface WorkflowStageProps {
  readonly stageNumber: number;
  readonly title: string;
  readonly description: string;
  readonly value: string;
  readonly complete: boolean;
}

function WorkflowStage({
  stageNumber,
  title,
  description,
  value,
  complete,
}: WorkflowStageProps) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        complete
          ? "border-cyan-400/30 bg-cyan-950/20"
          : "border-slate-700/70 bg-slate-900/70"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
            complete
              ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-200"
              : "border-slate-600 bg-slate-800 text-slate-400"
          }`}
        >
          {stageNumber}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                complete
                  ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                  : "border-slate-600 bg-slate-800 text-slate-400"
              }`}
            >
              {value}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

interface ValidationCheckCardProps {
  readonly check: HoleFillingValidationCheck;
  readonly index: number;
}

function ValidationCheckCard({
  check,
  index,
}: ValidationCheckCardProps) {
  const classes = getStatusClasses(check.status);

  return (
    <article
      className={`rounded-2xl border p-5 ${classes.panel}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg font-bold ${classes.icon}`}
        >
          {getStatusSymbol(check.status)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Check {index + 1}
              </p>

              <h3 className="mt-1 font-semibold text-white">
                {check.title}
              </h3>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${classes.badge}`}
            >
              {getStatusLabel(check.status)}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {check.message}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Expected
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {check.expected}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actual
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {check.actual}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function RC5004ValidationPage() {
  const report =
    runHoleFillingCompactionValidation();

  const {
    metrics,
    result,
    overallStatus,
    engineeringValidated,
  } = report;

  const overallClasses =
    getStatusClasses(overallStatus);

  const bestSolution =
    result.bestSolution;

  const markerLengthImproved =
    metrics.markerLengthReduction > 0;

  const utilisationImproved =
    metrics.utilisationImprovement > 0;

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
                  RC5-004-007
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Hole Filling &amp; Compaction Validation
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                Deterministic engineering validation of Marker
                Void Detection, Piece-to-Void Compatibility,
                Collision-Safe Hole Filling and Intelligent Marker
                Compaction.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Dataset: {report.datasetName}
              </p>
            </div>

            <div
              className={`min-w-[230px] rounded-2xl border p-5 ${overallClasses.panel}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Validation Status
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold ${overallClasses.icon}`}
                >
                  {getStatusSymbol(overallStatus)}
                </div>

                <div>
                  <p className="text-xl font-bold text-white">
                    {getStatusLabel(overallStatus)}
                  </p>

                  <p className="text-sm text-slate-400">
                    {engineeringValidated
                      ? "Engineering Validated"
                      : "Engineering Review Required"}
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
              href="/optifabric/marker-optimization"
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Marker Optimisation
            </Link>
          </div>
        </header>

        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Passed Checks"
              value={String(report.passedChecks)}
              secondary={`${report.checks.length} total validation checks`}
              positive={report.passedChecks > 0}
            />

            <MetricCard
              label="Failed Checks"
              value={String(report.failedChecks)}
              secondary={
                report.failedChecks === 0
                  ? "No critical validation failure"
                  : "Critical issues require correction"
              }
              positive={report.failedChecks === 0}
            />

            <MetricCard
              label="Warning Checks"
              value={String(report.warningChecks)}
              secondary="Non-critical engineering observations"
            />

            <MetricCard
              label="Engineering Score"
              value={formatNumber(
                metrics.bestCombinedEngineeringScore,
              )}
              secondary="Combined Hole Filling and Compaction score"
              positive={
                metrics.bestCombinedEngineeringScore >= 60
              }
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Engineering Performance
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Original Marker vs Optimised Marker
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              The validation compares Marker Length, Fabric
              Utilisation and added pattern area after the complete
              RC5-004 workflow.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Original Marker Length"
              value={formatNumber(
                metrics.originalMarkerLength,
              )}
              secondary="Before Hole Filling and Compaction"
            />

            <MetricCard
              label="Final Marker Length"
              value={formatNumber(
                metrics.finalMarkerLength,
              )}
              secondary={
                markerLengthImproved
                  ? `${formatNumber(
                      metrics.markerLengthReduction,
                    )} length units saved`
                  : "No measurable length reduction"
              }
              positive={markerLengthImproved}
            />

            <MetricCard
              label="Original Utilisation"
              value={formatPercentage(
                metrics.originalUtilisation,
              )}
              secondary="Pattern area within original marker area"
            />

            <MetricCard
              label="Final Utilisation"
              value={formatPercentage(
                metrics.finalUtilisation,
              )}
              secondary={
                utilisationImproved
                  ? `Improved by ${formatPercentage(
                      metrics.utilisationImprovement,
                    )} points`
                  : "Utilisation maintained"
              }
              positive={
                metrics.finalUtilisation >=
                metrics.originalUtilisation
              }
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Length Reduction
              </p>

              <p className="mt-3 text-2xl font-bold text-white">
                {formatNumber(
                  metrics.markerLengthReduction,
                )}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {formatPercentage(
                  metrics.markerLengthReductionPercentage,
                )} of original Marker Length
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Added Pattern Area
              </p>

              <p className="mt-3 text-2xl font-bold text-white">
                {formatNumber(
                  bestSolution?.addedPatternArea ?? 0,
                )}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Pattern area recovered through Hole Filling
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Decision
              </p>

              <p className="mt-3 text-2xl font-bold capitalize text-white">
                {bestSolution?.decision
                  .replace(/([A-Z])/g, " $1")
                  .trim() ?? "No solution"}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                OptiFabric engineering recommendation
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
              Workflow Validation
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              RC5-004 Optimisation Chain
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <WorkflowStage
              stageNumber={1}
              title="Marker Void Detection"
              description="Scans the current marker and identifies engineering-usable empty regions."
              value={`${metrics.detectedVoidCount} voids`}
              complete={metrics.detectedVoidCount > 0}
            />

            <WorkflowStage
              stageNumber={2}
              title="Piece-to-Void Compatibility"
              description="Tests piece dimensions, permitted rotations, Grain Line and fit efficiency."
              value={`${metrics.compatibilityCandidateCount} candidates`}
              complete={
                metrics.compatibilityCandidateCount > 0
              }
            />

            <WorkflowStage
              stageNumber={3}
              title="Collision-Safe Hole Filling"
              description="Validates actual insertion positions against existing pieces and marker boundaries."
              value={`${metrics.collisionSafePlacementCount} safe`}
              complete={
                metrics.collisionSafePlacementCount > 0
              }
            />

            <WorkflowStage
              stageNumber={4}
              title="Selected Hole Filling Plan"
              description="Selects the highest-ranked non-conflicting Piece-to-Void placement."
              value={`${metrics.selectedHoleFillingPlacementCount} selected`}
              complete={
                metrics.selectedHoleFillingPlacementCount > 0
              }
            />

            <WorkflowStage
              stageNumber={5}
              title="Intelligent Marker Compaction"
              description="Tests safe leftward and vertical movement to reduce Marker Length."
              value={`${metrics.compactionSolutionCount} solutions`}
              complete={
                metrics.compactionSolutionCount > 0
              }
            />

            <WorkflowStage
              stageNumber={6}
              title="Combined Engineering Decision"
              description="Ranks the final layouts using safety, utilisation, compaction and Hole Filling scores."
              value={`${metrics.finalSolutionCount} final`}
              complete={metrics.finalSolutionCount > 0}
            />
          </div>
        </section>

        {bestSolution ? (
          <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  Best Ranked Solution
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {bestSolution.id}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Solution {bestSolution.solutionNumber} passed
                  through the complete RC5-004 orchestrator.
                </p>
              </div>

              <div
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  bestSolution.engineeringReady
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                    : "border-amber-400/40 bg-amber-500/10 text-amber-200"
                }`}
              >
                {bestSolution.engineeringReady
                  ? "Engineering Ready"
                  : "Engineering Review Required"}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Hole Filling Score"
                value={formatNumber(
                  bestSolution.holeFillingScore,
                )}
              />

              <MetricCard
                label="Compaction Score"
                value={formatNumber(
                  bestSolution.compactionScore,
                )}
              />

              <MetricCard
                label="Safety Score"
                value={formatNumber(
                  bestSolution.safetyScore,
                )}
                positive={
                  bestSolution.safetyScore === 100
                }
              />

              <MetricCard
                label="Combined Score"
                value={formatNumber(
                  bestSolution.combinedEngineeringScore,
                )}
                positive={
                  bestSolution.combinedEngineeringScore >= 60
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-5">
              <h3 className="font-semibold text-white">
                Engineering Reasons
              </h3>

              <div className="mt-4 space-y-3">
                {bestSolution.reasons.map(
                  (reason, index) => (
                    <div
                      key={`${reason}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-xs font-bold text-cyan-200">
                        {index + 1}
                      </span>

                      <p className="text-sm leading-6 text-slate-300">
                        {reason}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Detailed Checks
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Engineering Validation Results
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Every major RC5-004 output is compared against
                its expected engineering condition.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-emerald-200">
                {report.passedChecks} Passed
              </span>

              <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-amber-200">
                {report.warningChecks} Warnings
              </span>

              <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-rose-200">
                {report.failedChecks} Failed
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {report.checks.map(
              (check, index) => (
                <ValidationCheckCard
                  key={check.id}
                  check={check}
                  index={index}
                />
              ),
            )}
          </div>
        </section>

        <section
          className={`mt-8 rounded-3xl border p-6 sm:p-8 ${overallClasses.panel}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl font-bold ${overallClasses.icon}`}
            >
              {getStatusSymbol(overallStatus)}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Validation Summary
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                {engineeringValidated
                  ? "RC5-004 Engineering Validation Complete"
                  : "RC5-004 Requires Engineering Review"}
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                {report.summary}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}