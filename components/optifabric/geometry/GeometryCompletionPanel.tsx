"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  sortGeometryCompletionPieces,
  type GeometryCompletionSummary,
} from "@/lib/optifabric/geometry/geometryCompletionEngine";

interface GeometryCompletionPanelProps {
  summary: GeometryCompletionSummary;

  projectName?: string;
}

export default function GeometryCompletionPanel({
  summary,

  projectName = "Engineering Project",
}: GeometryCompletionPanelProps) {
  const sortedPieces = useMemo(
    () =>
      sortGeometryCompletionPieces(
        summary.pieces
      ),
    [summary.pieces]
  );

  return (
    <section className="mt-10 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/30 p-6 sm:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-violet-300">
            Geometry completion queue
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Complete Production Geometry
          </h2>

          <p className="mt-2 text-xl font-black text-violet-100">
            {projectName}
          </p>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Every marker-eligible pattern piece must contain
            valid saved engineering geometry before the
            production marker can be generated.
          </p>
        </div>

        <div
  className={`min-w-64 rounded-2xl border px-6 py-4 ${
    summary.markerReady
      ? "border-emerald-400/30 bg-emerald-950/30"
      : "border-amber-400/30 bg-amber-950/20"
  }`}
>
  <p
    className={`text-xs font-black uppercase tracking-wider ${
      summary.markerReady
        ? "text-emerald-300"
        : "text-amber-300"
    }`}
  >
    Production marker
  </p>

  <p className="mt-1 text-2xl font-black text-white">
    {summary.markerReady
      ? "READY"
      : "LOCKED"}
  </p>

  <p
    className={`mt-2 text-sm font-bold leading-5 ${
      summary.markerReady
        ? "text-emerald-200"
        : "text-amber-200"
    }`}
  >
    {summary.markerReady
      ? "All required geometry is complete."
      : `${summary.pendingPieces + summary.invalidPieces} of ${summary.markerEligiblePieces} required pieces still need engineering completion.`}
  </p>
</div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Total Pieces"
          value={String(
            summary.totalPieces
          )}
        />

        <SummaryCard
          label="Marker Eligible"
          value={String(
            summary.markerEligiblePieces
          )}
        />

        <SummaryCard
          label="Geometry Ready"
          value={String(
            summary.readyPieces
          )}
          emphasis="ready"
        />

        <SummaryCard
          label="Pending"
          value={String(
            summary.pendingPieces
          )}
          emphasis="pending"
        />

        <SummaryCard
          label="Invalid"
          value={String(
            summary.invalidPieces
          )}
          emphasis={
            summary.invalidPieces > 0
              ? "critical"
              : undefined
          }
        />
      </div>

      <div className="mt-7 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              Completion progress
            </p>

            <p className="mt-2 text-2xl font-black text-white">
              {summary.completionPercent.toFixed(
                1
              )}
              %
            </p>
          </div>

          <p className="text-right text-sm font-bold text-slate-400">
            {summary.readyPieces} of{" "}
            {summary.markerEligiblePieces} required pieces
            ready
          </p>
        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${
              summary.markerReady
                ? "bg-emerald-400"
                : "bg-violet-400"
            }`}
            style={{
              width: `${summary.completionPercent}%`,
            }}
          />
        </div>
      </div>

      {summary.nextPiece ? (
        <div className="mt-7 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
            Recommended next piece
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-white">
                {summary.nextPiece.patternName}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Status:{" "}
                {formatStatus(
                  summary.nextPiece.status
                )}
              </p>
            </div>

            <Link
              href={
                summary.nextPiece.traceHref
              }
              className="rounded-xl bg-cyan-400 px-5 py-3 text-center font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Open Tracing Workspace
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 p-5">
          <p className="text-xl font-black text-emerald-300">
            ✓ All production geometry is complete
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            The project may now proceed to marker generation
            and fabric-consumption analysis.
          </p>
        </div>
      )}

      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-700">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[minmax(260px,1fr)_130px_140px_130px] gap-4 bg-slate-900 px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
            <span>Pattern Piece</span>

            <span>Vertices</span>

            <span>Status</span>

            <span className="text-right">
              Action
            </span>
          </div>

          <div className="divide-y divide-slate-800 bg-slate-950/60">
            {sortedPieces.map(
              (piece) => (
                <div
                  key={piece.patternId}
                  className="grid grid-cols-[minmax(260px,1fr)_130px_140px_130px] items-center gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-white">
                      {piece.patternName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      ID: {piece.patternId}
                    </p>

                    {piece.pieceType ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Type: {piece.pieceType}
                      </p>
                    ) : null}

                    {!piece.markerEligible ? (
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        Not required for marker generation
                      </p>
                    ) : null}
                  </div>

                  <p className="font-black text-slate-300">
                    {piece.vertexCount > 0
                      ? piece.vertexCount
                      : "—"}
                  </p>

                  <StatusBadge
                    status={piece.status}
                    markerEligible={
                      piece.markerEligible
                    }
                  />

                  <div className="text-right">
                    {piece.markerEligible &&
                    piece.status !== "ready" ? (
                      <Link
                        href={
                          piece.traceHref
                        }
                        className="inline-block rounded-lg border border-cyan-400/30 bg-cyan-950/20 px-3 py-2 text-xs font-black text-cyan-300 transition hover:bg-cyan-950/40"
                      >
                        Trace
                      </Link>
                    ) : piece.status ===
                      "ready" ? (
                      <span className="text-xs font-black text-emerald-400">
                        Complete
                      </span>
                    ) : (
                      <span className="text-xs font-black text-slate-500">
                        Optional
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  emphasis,
}: {
  label: string;

  value: string;

  emphasis?:
    | "ready"
    | "pending"
    | "critical";
}) {
  const classes =
    emphasis === "ready"
      ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
      : emphasis === "pending"
        ? "border-amber-400/30 bg-amber-950/20 text-amber-300"
        : emphasis === "critical"
          ? "border-red-400/30 bg-red-950/20 text-red-300"
          : "border-slate-700 bg-slate-950/60 text-white";

  return (
    <div
      className={`rounded-2xl border p-4 ${classes}`}
    >
      <p className="text-xs font-black uppercase tracking-wider opacity-70">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
  markerEligible,
}: {
  status:
    | "ready"
    | "pending"
    | "invalid";

  markerEligible: boolean;
}) {
  if (!markerEligible) {
    return (
      <span className="w-fit rounded-full bg-slate-700/40 px-3 py-1 text-xs font-black text-slate-400">
        OPTIONAL
      </span>
    );
  }

  const classes =
    status === "ready"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "invalid"
        ? "bg-red-500/15 text-red-300"
        : "bg-amber-500/15 text-amber-300";

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-black ${classes}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

function formatStatus(
  status:
    | "ready"
    | "pending"
    | "invalid"
): string {
  if (status === "ready") {
    return "Geometry ready";
  }

  if (status === "invalid") {
    return "Geometry requires correction";
  }

  return "Tracing required";
}