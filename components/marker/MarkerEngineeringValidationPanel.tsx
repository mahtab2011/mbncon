"use client";

import type {
  MarkerEngineeringValidationResult,
} from "@/lib/optifabric/marker/markerEngineeringValidationEngine";

interface MarkerEngineeringValidationPanelProps {
  validation:
    MarkerEngineeringValidationResult | null;
}

export default function MarkerEngineeringValidationPanel({
  validation,
}: MarkerEngineeringValidationPanelProps) {
  if (!validation) {
    return (
      <section className="rounded-3xl border border-dashed border-blue-400/30 bg-blue-950/10 p-8 text-center">
        <p className="text-5xl">
          🛡️
        </p>

        <h2 className="mt-4 text-2xl font-black text-white">
          Engineering Validation Pending
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Generate a complete marker layout to run collision,
          boundary, placement and marker-quality validation.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`rounded-3xl border p-6 ${
        validation.productionReady
          ? "border-emerald-400/30 bg-emerald-950/10"
          : "border-amber-400/30 bg-amber-950/10"
      }`}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p
            className={`text-sm font-black uppercase tracking-[0.25em] ${
              validation.productionReady
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            Marker engineering validation
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Production Marker Decision
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            {validation.explanation}
          </p>
        </div>

        <ProductionStatusBadge
          productionReady={
            validation.productionReady
          }
        />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ValidationMetric
          label="Quality Grade"
          value={
            validation.qualityGrade
          }
          status={
            validation.qualityScore >= 90
              ? "pass"
              : validation.qualityScore >= 80
                ? "warning"
                : "critical"
          }
        />

        <ValidationMetric
          label="Quality Score"
          value={`${validation.qualityScore}%`}
          status={
            validation.qualityScore >= 90
              ? "pass"
              : validation.qualityScore >= 80
                ? "warning"
                : "critical"
          }
        />

        <ValidationMetric
          label="Utilisation"
          value={`${validation.utilisationPercent.toFixed(
            2
          )}%`}
          status={
            validation.utilisationPercent >= 85
              ? "pass"
              : validation.utilisationPercent >= 75
                ? "warning"
                : "critical"
          }
        />

        <ValidationMetric
          label="Waste"
          value={`${validation.wastePercent.toFixed(
            2
          )}%`}
          status={
            validation.wastePercent <= 15
              ? "pass"
              : validation.wastePercent <= 25
                ? "warning"
                : "critical"
          }
        />

        <ValidationMetric
          label="Collisions"
          value={String(
            validation.collisionCount
          )}
          status={
            validation.collisionCount === 0
              ? "pass"
              : "critical"
          }
        />

        <ValidationMetric
          label="Outside Marker"
          value={String(
            validation.outsideMarkerCount
          )}
          status={
            validation.outsideMarkerCount === 0
              ? "pass"
              : "critical"
          }
        />

        <ValidationMetric
          label="Unplaced Pieces"
          value={String(
            validation.unplacedPieceCount
          )}
          status={
            validation.unplacedPieceCount === 0
              ? "pass"
              : "critical"
          }
        />

        <ValidationMetric
          label="Validation"
          value={
            validation.valid
              ? "Complete"
              : "Invalid"
          }
          status={
            validation.valid
              ? "pass"
              : "critical"
          }
        />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
            AI Engineering Recommendation
          </p>

          {validation.recommendations.length >
          0 ? (
            <div className="mt-4 space-y-3">
              {validation.recommendations.map(
                (recommendation) => (
                  <div
                    key={recommendation}
                    className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3"
                  >
                    <span className="font-black text-cyan-300">
                      →
                    </span>

                    <p className="text-sm leading-6 text-slate-300">
                      {recommendation}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-400">
              No additional engineering recommendation is
              required.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Production Decision
          </p>

          <p
            className={`mt-3 text-2xl font-black ${
              validation.productionReady
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            {validation.productionReady
              ? "APPROVED"
              : "ENGINEERING REVIEW"}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {validation.productionReady
              ? "This marker passed the current production validation rules and may continue to fabric-consumption analysis."
              : "Do not approve this marker for production until every collision, boundary, placement and quality issue has been corrected."}
          </p>
        </section>
      </div>

      {validation.collisions.length > 0 ? (
        <section className="mt-7 rounded-2xl border border-red-400/30 bg-red-950/10 p-5">
          <p className="font-black text-red-300">
            Collision Details
          </p>

          <div className="mt-4 space-y-3">
            {validation.collisions.map(
              (collision, index) => (
                <div
                  key={`${collision.firstPieceId}-${collision.secondPieceId}-${index}`}
                  className="rounded-xl border border-red-400/20 bg-slate-950/60 px-4 py-3"
                >
                  <p className="font-black text-white">
                    {
                      collision.firstPieceName
                    }{" "}
                    ↔{" "}
                    {
                      collision.secondPieceName
                    }
                  </p>

                  <p className="mt-1 text-xs text-red-200">
                    Overlapping marker pieces require
                    repositioning.
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      ) : null}

      {validation.warnings.length > 0 ? (
        <section className="mt-7 rounded-2xl border border-amber-400/30 bg-amber-950/10 p-5">
          <p className="font-black text-amber-300">
            Validation Warnings
          </p>

          <div className="mt-4 space-y-3">
            {validation.warnings.map(
              (warning) => (
                <div
                  key={warning}
                  className="rounded-xl border border-amber-400/20 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-amber-100"
                >
                  {warning}
                </div>
              )
            )}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function ProductionStatusBadge({
  productionReady,
}: {
  productionReady: boolean;
}) {
  return (
    <div
      className={`min-w-64 rounded-2xl border px-6 py-4 ${
        productionReady
          ? "border-emerald-400/30 bg-emerald-950/30"
          : "border-amber-400/30 bg-amber-950/20"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-wider ${
          productionReady
            ? "text-emerald-300"
            : "text-amber-300"
        }`}
      >
        Production status
      </p>

      <p className="mt-1 text-2xl font-black text-white">
        {productionReady
          ? "APPROVED"
          : "REVIEW"}
      </p>
    </div>
  );
}

function ValidationMetric({
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
      className={`rounded-2xl border p-4 ${classes}`}
    >
      <p className="text-xs font-black uppercase tracking-wider opacity-70">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-black">
        {value}
      </p>
    </div>
  );
}