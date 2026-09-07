"use client";

import { useMemo } from "react";

import {
  assessMarkerStatistics,
} from "@/lib/optifabric/marker/markerStatisticsEngine";

import type {
  MarkerLayout,
} from "@/lib/optifabric/markerTypes";

interface MarkerStatisticsPanelProps {
  layout: MarkerLayout | null;

  utilisationTargetPercent?: number;
}

export default function MarkerStatisticsPanel({
  layout,

  utilisationTargetPercent = 85,
}: MarkerStatisticsPanelProps) {
  const assessment = useMemo(() => {
    if (!layout) {
      return null;
    }

    return assessMarkerStatistics({
      layout,
      utilisationTargetPercent,
    });
  }, [
    layout,
    utilisationTargetPercent,
  ]);

  if (!assessment) {
    return (
      <section className="rounded-3xl border border-dashed border-emerald-400/30 bg-emerald-950/10 p-8 text-center">
        <p className="text-4xl">
          📊
        </p>

        <h2 className="mt-4 text-2xl font-black text-white">
          Marker Statistics Pending
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Generate a marker layout before calculating
          utilisation, waste, unused area and production
          readiness.
        </p>
      </section>
    );
  }

  const {
    statistics,
    status,
    productionReady,
    utilisationTargetPercent:
      targetPercent,
    utilisationGapPercent,
    estimatedUnusedAreaSqCm,
    estimatedUnusedLengthCm,
    recommendation,
    observations,
    warnings,
  } = assessment;

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Marker statistics
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Engineering Performance
          </h2>
        </div>

        <div
          className={`rounded-2xl border px-5 py-3 ${
            productionReady
              ? "border-emerald-400/30 bg-emerald-950/40"
              : "border-amber-400/30 bg-amber-950/30"
          }`}
        >
          <p
            className={`text-xs font-black uppercase tracking-wider ${
              productionReady
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            Production
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {productionReady
              ? "READY"
              : "REVIEW"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          label="Marker Efficiency"
          value={`${statistics.markerEfficiencyPercent.toFixed(
            2
          )}%`}
          emphasis
        />

        <StatisticCard
          label="Estimated Waste"
          value={`${statistics.wastePercent.toFixed(
            2
          )}%`}
        />

        <StatisticCard
          label="Marker Length"
          value={`${statistics.markerLengthCm.toFixed(
            2
          )} cm`}
        />

        <StatisticCard
          label="Fabric Width"
          value={`${statistics.fabricWidthCm.toFixed(
            2
          )} cm`}
        />

        <StatisticCard
          label="Pieces Placed"
          value={String(
            statistics.placedPieceCount
          )}
        />

        <StatisticCard
          label="Pieces Unplaced"
          value={String(
            statistics.unplacedPieceCount
          )}
        />

        <StatisticCard
          label="Pattern Area"
          value={`${statistics.usedPatternAreaSqCm.toFixed(
            2
          )} cm²`}
        />

        <StatisticCard
          label="Marker Area"
          value={`${statistics.markerAreaSqCm.toFixed(
            2
          )} cm²`}
        />

        <StatisticCard
          label="Unused Area"
          value={`${estimatedUnusedAreaSqCm.toFixed(
            2
          )} cm²`}
        />

        <StatisticCard
          label="Unused Length"
          value={`${estimatedUnusedLengthCm.toFixed(
            2
          )} cm`}
        />

        <StatisticCard
          label="Target Efficiency"
          value={`${targetPercent.toFixed(
            2
          )}%`}
        />

        <StatisticCard
          label="Efficiency Gap"
          value={`${utilisationGapPercent.toFixed(
            2
          )}%`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <StatusCard
          label="Efficiency Grade"
          value={
            statistics.efficiencyGrade
          }
          status={
            statistics.efficiencyGrade ===
              "A" ||
            statistics.efficiencyGrade ===
              "B"
              ? "pass"
              : "warning"
          }
        />

        <StatusCard
          label="Engineering Status"
          value={formatStatus(status)}
          status={
            status === "excellent" ||
            status === "acceptable"
              ? "pass"
              : "warning"
          }
        />

        <StatusCard
          label="Placement Status"
          value={
            statistics.unplacedPieceCount ===
            0
              ? "Complete"
              : "Incomplete"
          }
          status={
            statistics.unplacedPieceCount ===
            0
              ? "pass"
              : "critical"
          }
        />
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-5">
        <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
          Engineering Recommendation
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-200">
          {recommendation}
        </p>
      </div>

      {observations.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
          <p className="font-black text-white">
            Engineering Observations
          </p>

          <div className="mt-4 space-y-3">
            {observations.map(
              (observation) => (
                <div
                  key={observation}
                  className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <span className="font-black text-emerald-400">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-300">
                    {observation}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-950/10 p-5">
          <p className="font-black text-red-300">
            Engineering Warnings
          </p>

          <div className="mt-4 space-y-3">
            {warnings.map(
              (warning) => (
                <div
                  key={warning}
                  className="rounded-xl border border-red-400/20 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-red-100"
                >
                  {warning}
                </div>
              )
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function StatisticCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        emphasis
          ? "border-emerald-400/30 bg-emerald-950/30"
          : "border-slate-700 bg-slate-950/70"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-xl font-black ${
          emphasis
            ? "text-emerald-300"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status:
    | "pass"
    | "warning"
    | "critical";
}) {
  const classes =
    status === "pass"
      ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
      : status === "critical"
        ? "border-red-400/30 bg-red-950/20 text-red-300"
        : "border-amber-400/30 bg-amber-950/20 text-amber-300";

  return (
    <div
      className={`rounded-2xl border p-5 ${classes}`}
    >
      <p className="text-xs font-black uppercase tracking-wider opacity-70">
        {label}
      </p>

      <p className="mt-2 text-xl font-black">
        {value}
      </p>
    </div>
  );
}

function formatStatus(
  value: string
): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}