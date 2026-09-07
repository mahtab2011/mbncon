import {
  calculateMarkerStatistics,
} from "@/lib/optifabric/markerStatistics";

import type {
  MarkerEfficiencyGrade,
  MarkerLayout,
  MarkerStatistics,
} from "@/lib/optifabric/markerTypes";

export type MarkerEngineeringStatus =
  | "excellent"
  | "acceptable"
  | "review"
  | "critical";

export interface MarkerStatisticsAssessment {
  statistics: MarkerStatistics;

  status: MarkerEngineeringStatus;

  productionReady: boolean;

  utilisationTargetPercent: number;

  utilisationGapPercent: number;

  estimatedUnusedAreaSqCm: number;

  estimatedUnusedLengthCm: number;

  recommendation: string;

  observations: string[];

  warnings: string[];
}

export interface MarkerComparisonResult {
  current: MarkerStatisticsAssessment;

  proposed: MarkerStatisticsAssessment;

  efficiencyImprovementPercent: number;

  wasteReductionPercent: number;

  markerLengthReductionCm: number;

  markerLengthReductionPercent: number;

  estimatedAreaSavedSqCm: number;

  improved: boolean;

  recommendation: string;
}

const DEFAULT_TARGET_EFFICIENCY_PERCENT =
  85;

function roundValue(
  value: number,
  decimalPlaces = 2
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier =
    10 ** decimalPlaces;

  return (
    Math.round(
      value * multiplier
    ) / multiplier
  );
}

function clampPercentage(
  value: number
): number {
  return Math.min(
    100,
    Math.max(0, value)
  );
}

function determineEngineeringStatus(
  efficiencyPercent: number
): MarkerEngineeringStatus {
  if (efficiencyPercent >= 90) {
    return "excellent";
  }

  if (efficiencyPercent >= 85) {
    return "acceptable";
  }

  if (efficiencyPercent >= 75) {
    return "review";
  }

  return "critical";
}

function determineProductionReadiness({
  statistics,
  status,
}: {
  statistics: MarkerStatistics;
  status: MarkerEngineeringStatus;
}): boolean {
  return (
    statistics.placedPieceCount > 0 &&
    statistics.unplacedPieceCount === 0 &&
    statistics.markerLengthCm > 0 &&
    statistics.markerAreaSqCm > 0 &&
    (
      status === "excellent" ||
      status === "acceptable"
    )
  );
}

function createEngineeringRecommendation({
  status,
  statistics,
}: {
  status: MarkerEngineeringStatus;
  statistics: MarkerStatistics;
}): string {
  if (
    statistics.unplacedPieceCount > 0
  ) {
    return `${statistics.unplacedPieceCount} pattern piece instance(s) remain unplaced. Review fabric width, permitted rotation, grain direction, spacing and maximum marker length before production approval.`;
  }

  switch (status) {
    case "excellent":
      return "The marker demonstrates excellent fabric utilisation and may proceed to final engineering approval, consumption calculation and production planning.";

    case "acceptable":
      return "The marker demonstrates commercially acceptable utilisation. A final visual review is recommended before approving fabric consumption.";

    case "review":
      return "The marker is complete, but utilisation is below the preferred target. Run marker optimisation or manually adjust placement before production approval.";

    default:
      return "The marker efficiency is critically low. Do not approve this layout for production until the placement strategy has been regenerated or optimised.";
  }
}

function createObservations(
  statistics: MarkerStatistics
): string[] {
  const observations: string[] = [];

  observations.push(
    `${statistics.placedPieceCount} pattern piece instance(s) were placed.`
  );

  observations.push(
    `The calculated marker length is ${statistics.markerLengthCm.toFixed(
      2
    )} cm on ${statistics.fabricWidthCm.toFixed(
      2
    )} cm fabric.`
  );

  observations.push(
    `Fabric utilisation is ${statistics.markerEfficiencyPercent.toFixed(
      2
    )}% and estimated waste is ${statistics.wastePercent.toFixed(
      2
    )}%.`
  );

  if (
    statistics.efficiencyGrade ===
    "A"
  ) {
    observations.push(
      "The marker achieved Grade A engineering efficiency."
    );
  } else {
    observations.push(
      `The marker achieved Grade ${statistics.efficiencyGrade} engineering efficiency.`
    );
  }

  if (
    statistics.unplacedPieceCount ===
    0
  ) {
    observations.push(
      "All requested pattern pieces were placed successfully."
    );
  }

  return observations;
}

function createWarnings(
  statistics: MarkerStatistics
): string[] {
  const warnings: string[] = [];

  if (
    statistics.unplacedPieceCount > 0
  ) {
    warnings.push(
      `${statistics.unplacedPieceCount} pattern piece instance(s) could not be placed.`
    );
  }

  if (
    statistics.markerEfficiencyPercent <
    75
  ) {
    warnings.push(
      "Marker efficiency is below the minimum preferred engineering range."
    );
  }

  if (
    statistics.wastePercent > 25
  ) {
    warnings.push(
      "Estimated marker waste exceeds 25%."
    );
  }

  if (
    statistics.markerLengthCm <= 0
  ) {
    warnings.push(
      "A valid marker length is not available."
    );
  }

  if (
    statistics.markerAreaSqCm <= 0
  ) {
    warnings.push(
      "A valid marker area is not available."
    );
  }

  if (
    statistics.placedPieceCount === 0
  ) {
    warnings.push(
      "No pattern pieces were placed in the marker."
    );
  }

  return warnings;
}

function calculateUnusedLengthCm(
  statistics: MarkerStatistics
): number {
  if (
    statistics.fabricWidthCm <= 0
  ) {
    return 0;
  }

  return (
    statistics.endLossSqCm /
    statistics.fabricWidthCm
  );
}

export function assessMarkerStatistics({
  layout,
  utilisationTargetPercent =
    DEFAULT_TARGET_EFFICIENCY_PERCENT,
}: {
  layout: MarkerLayout;

  utilisationTargetPercent?: number;
}): MarkerStatisticsAssessment {
  const statistics =
    calculateMarkerStatistics(
      layout
    );

  const safeTarget =
    clampPercentage(
      utilisationTargetPercent
    );

  const status =
    determineEngineeringStatus(
      statistics.markerEfficiencyPercent
    );

  const utilisationGapPercent =
    Math.max(
      safeTarget -
        statistics.markerEfficiencyPercent,
      0
    );

  const estimatedUnusedAreaSqCm =
    Math.max(
      statistics.markerAreaSqCm -
        statistics.usedPatternAreaSqCm,
      0
    );

  const estimatedUnusedLengthCm =
    calculateUnusedLengthCm(
      statistics
    );

  const productionReady =
    determineProductionReadiness({
      statistics,
      status,
    });

  return {
    statistics,

    status,

    productionReady,

    utilisationTargetPercent:
      safeTarget,

    utilisationGapPercent:
      roundValue(
        utilisationGapPercent
      ),

    estimatedUnusedAreaSqCm:
      roundValue(
        estimatedUnusedAreaSqCm
      ),

    estimatedUnusedLengthCm:
      roundValue(
        estimatedUnusedLengthCm
      ),

    recommendation:
      createEngineeringRecommendation({
        status,
        statistics,
      }),

    observations:
      createObservations(
        statistics
      ),

    warnings:
      createWarnings(
        statistics
      ),
  };
}

export function compareMarkerLayouts({
  currentLayout,
  proposedLayout,
  utilisationTargetPercent =
    DEFAULT_TARGET_EFFICIENCY_PERCENT,
}: {
  currentLayout: MarkerLayout;

  proposedLayout: MarkerLayout;

  utilisationTargetPercent?: number;
}): MarkerComparisonResult {
  const current =
    assessMarkerStatistics({
      layout: currentLayout,
      utilisationTargetPercent,
    });

  const proposed =
    assessMarkerStatistics({
      layout: proposedLayout,
      utilisationTargetPercent,
    });

  const efficiencyImprovementPercent =
    proposed.statistics
      .markerEfficiencyPercent -
    current.statistics
      .markerEfficiencyPercent;

  const wasteReductionPercent =
    current.statistics.wastePercent -
    proposed.statistics.wastePercent;

  const markerLengthReductionCm =
    current.statistics.markerLengthCm -
    proposed.statistics.markerLengthCm;

  const markerLengthReductionPercent =
    current.statistics.markerLengthCm >
    0
      ? (
          markerLengthReductionCm /
          current.statistics
            .markerLengthCm
        ) *
        100
      : 0;

  const estimatedAreaSavedSqCm =
    current.statistics.markerAreaSqCm -
    proposed.statistics.markerAreaSqCm;

  const improved =
    efficiencyImprovementPercent > 0 ||
    markerLengthReductionCm > 0 ||
    wasteReductionPercent > 0;

  return {
    current,

    proposed,

    efficiencyImprovementPercent:
      roundValue(
        efficiencyImprovementPercent
      ),

    wasteReductionPercent:
      roundValue(
        wasteReductionPercent
      ),

    markerLengthReductionCm:
      roundValue(
        markerLengthReductionCm
      ),

    markerLengthReductionPercent:
      roundValue(
        markerLengthReductionPercent
      ),

    estimatedAreaSavedSqCm:
      roundValue(
        estimatedAreaSavedSqCm
      ),

    improved,

    recommendation:
      improved
        ? "The proposed marker improves engineering performance and should be reviewed for final production approval."
        : "The proposed marker does not provide a measurable improvement over the current layout.",
  };
}

export function getMarkerEfficiencyGrade(
  efficiencyPercent: number
): MarkerEfficiencyGrade {
  if (
    efficiencyPercent >= 90
  ) {
    return "A";
  }

  if (
    efficiencyPercent >= 85
  ) {
    return "B";
  }

  if (
    efficiencyPercent >= 80
  ) {
    return "C";
  }

  return "D";
}

export const markerStatisticsEngine = {
  assessMarkerStatistics,

  compareMarkerLayouts,

  getMarkerEfficiencyGrade,
};

export default markerStatisticsEngine;