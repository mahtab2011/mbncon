import type {
  MarkerCandidate,
  RankedMarkerCandidate,
} from "./markerQuantityOptimisationEngine";

export interface MarkerComparisonRow {
  garmentsPerMarker: number;

  markerLengthCm: number;
  markerLengthMetres: number;

  utilisationPercent: number;
  wastePercent: number;

  fabricPerGarmentCm: number;
  fabricPerGarmentMetres: number;

  piecesPlaced: number;
  expectedPieces: number;

  collisionCount: number;

  candidateTests: number;

  searchBudgetExceeded: boolean;

  complete: boolean;

  engineeringScore: number | null;

  rank: number | null;

  status:
    | "recommended"
    | "valid"
    | "requested"
    | "rejected";
}

export interface MarkerComparisonSummary {
  rows: MarkerComparisonRow[];

  validRows: MarkerComparisonRow[];

  rejectedRows: MarkerComparisonRow[];

  requestedRow: MarkerComparisonRow | null;

  recommendedRow: MarkerComparisonRow | null;

  highestUtilisationRow: MarkerComparisonRow | null;

  lowestConsumptionRow: MarkerComparisonRow | null;

  shortestMarkerRow: MarkerComparisonRow | null;

  totalAnalysed: number;

  totalValid: number;

  totalRejected: number;

  utilisationImprovementPercent: number;

  fabricSavingPerGarmentCm: number;

  fabricSavingPerGarmentMetres: number;

  fabricSavingForOrderMetres: number;

  recommendationStrength:
    | "none"
    | "small"
    | "moderate"
    | "strong";
}

export interface MarkerComparisonOptions {
  requestedGarmentsPerMarker?: number | null;

  recommendedGarmentsPerMarker?: number | null;

  orderQuantity?: number | null;
}

/**
 * Converts optimiser candidates into dashboard-ready comparison rows.
 *
 * This engine does not perform nesting or ranking.
 * It prepares clear visual comparison data for the Marker dashboard.
 */
export function createMarkerComparison(
  candidates: Array<
    MarkerCandidate | RankedMarkerCandidate
  >,
  options: MarkerComparisonOptions = {}
): MarkerComparisonSummary {
  const requestedGarmentsPerMarker =
    resolvePositiveInteger(
      options.requestedGarmentsPerMarker
    );

  const recommendedGarmentsPerMarker =
    resolvePositiveInteger(
      options.recommendedGarmentsPerMarker
    );

  const orderQuantity =
    resolvePositiveInteger(
      options.orderQuantity
    );

  const rows = candidates
    .map((candidate) =>
      createComparisonRow(
        candidate,
        requestedGarmentsPerMarker,
        recommendedGarmentsPerMarker
      )
    )
    .sort(compareRows);

  const validRows = rows.filter(
    (row) => row.complete
  );

  const rejectedRows = rows.filter(
    (row) => !row.complete
  );

  const requestedRow =
    requestedGarmentsPerMarker !== null
      ? rows.find(
          (row) =>
            row.garmentsPerMarker ===
            requestedGarmentsPerMarker
        ) ?? null
      : null;

  const recommendedRow =
    recommendedGarmentsPerMarker !== null
      ? rows.find(
          (row) =>
            row.garmentsPerMarker ===
            recommendedGarmentsPerMarker
        ) ?? null
      : findBestRankedRow(validRows);

  const highestUtilisationRow =
    findMaximumRow(
      validRows,
      (row) =>
        row.utilisationPercent
    );

  const lowestConsumptionRow =
    findMinimumRow(
      validRows,
      (row) =>
        row.fabricPerGarmentCm
    );

  const shortestMarkerRow =
    findMinimumRow(
      validRows,
      (row) =>
        row.markerLengthCm
    );

  const saving =
    calculateComparisonSaving(
      requestedRow,
      recommendedRow,
      orderQuantity
    );

  return {
    rows,

    validRows,

    rejectedRows,

    requestedRow,

    recommendedRow,

    highestUtilisationRow,

    lowestConsumptionRow,

    shortestMarkerRow,

    totalAnalysed:
      rows.length,

    totalValid:
      validRows.length,

    totalRejected:
      rejectedRows.length,

    utilisationImprovementPercent:
      saving.utilisationImprovementPercent,

    fabricSavingPerGarmentCm:
      saving.fabricSavingPerGarmentCm,

    fabricSavingPerGarmentMetres:
      saving.fabricSavingPerGarmentCm /
      100,

    fabricSavingForOrderMetres:
      saving.fabricSavingForOrderMetres,

    recommendationStrength:
      determineRecommendationStrength(
        saving.fabricSavingPercent
      ),
  };
}

/**
 * Returns rows suitable for a dashboard chart.
 */
export function createMarkerComparisonChartData(
  summary: MarkerComparisonSummary
): Array<{
  garments: number;

  utilisation: number;

  waste: number;

  fabricPerGarmentMetres: number;

  markerLengthMetres: number;

  score: number;

  complete: boolean;
}> {
  return summary.rows.map(
    (row) => ({
      garments:
        row.garmentsPerMarker,

      utilisation:
        row.utilisationPercent,

      waste:
        row.wastePercent,

      fabricPerGarmentMetres:
        row.fabricPerGarmentMetres,

      markerLengthMetres:
        row.markerLengthMetres,

      score:
        row.engineeringScore ?? 0,

      complete:
        row.complete,
    })
  );
}

/**
 * Returns the top valid alternatives after the recommended marker.
 */
export function createMarkerAlternatives(
  summary: MarkerComparisonSummary,
  maximumAlternatives = 3
): MarkerComparisonRow[] {
  const safeMaximum =
    Math.max(
      0,
      Math.floor(
        maximumAlternatives
      )
    );

  return summary.validRows
    .filter(
      (row) =>
        row.garmentsPerMarker !==
        summary.recommendedRow
          ?.garmentsPerMarker
    )
    .sort((first, second) => {
      const firstRank =
        first.rank ??
        Number.POSITIVE_INFINITY;

      const secondRank =
        second.rank ??
        Number.POSITIVE_INFINITY;

      if (
        firstRank !==
        secondRank
      ) {
        return (
          firstRank -
          secondRank
        );
      }

      return (
        second.utilisationPercent -
        first.utilisationPercent
      );
    })
    .slice(
      0,
      safeMaximum
    );
}

function createComparisonRow(
  candidate:
    | MarkerCandidate
    | RankedMarkerCandidate,
  requestedGarmentsPerMarker:
    | number
    | null,
  recommendedGarmentsPerMarker:
    | number
    | null
): MarkerComparisonRow {
  const rankedCandidate =
    isRankedMarkerCandidate(
      candidate
    )
      ? candidate
      : null;

  const complete =
    candidate.piecesPlaced ===
      candidate.expectedPieces &&
    candidate.collisionCount === 0 &&
    !candidate.searchBudgetExceeded &&
    candidate.markerLengthCm > 0 &&
    candidate.fabricPerGarmentCm > 0;

  let status:
    MarkerComparisonRow["status"] =
      complete
        ? "valid"
        : "rejected";

  if (
    requestedGarmentsPerMarker !==
      null &&
    candidate.garmentsPerMarker ===
      requestedGarmentsPerMarker
  ) {
    status = complete
      ? "requested"
      : "rejected";
  }

  if (
    recommendedGarmentsPerMarker !==
      null &&
    candidate.garmentsPerMarker ===
      recommendedGarmentsPerMarker &&
    complete
  ) {
    status =
      "recommended";
  }

  return {
    garmentsPerMarker:
      candidate.garmentsPerMarker,

    markerLengthCm:
      candidate.markerLengthCm,

    markerLengthMetres:
      candidate.markerLengthCm /
      100,

    utilisationPercent:
      candidate.utilisationPercent,

    wastePercent:
      candidate.wastePercent,

    fabricPerGarmentCm:
      candidate.fabricPerGarmentCm,

    fabricPerGarmentMetres:
      candidate.fabricPerGarmentCm /
      100,

    piecesPlaced:
      candidate.piecesPlaced,

    expectedPieces:
      candidate.expectedPieces,

    collisionCount:
      candidate.collisionCount,

    candidateTests:
      candidate.candidateTests ?? 0,

    searchBudgetExceeded:
      candidate.searchBudgetExceeded,

    complete,

    engineeringScore:
      rankedCandidate
        ? rankedCandidate.score
            .overallScore
        : null,

    rank:
      rankedCandidate
        ? rankedCandidate.rank
        : null,

    status,
  };
}

function compareRows(
  first: MarkerComparisonRow,
  second: MarkerComparisonRow
): number {
  return (
    first.garmentsPerMarker -
    second.garmentsPerMarker
  );
}

function calculateComparisonSaving(
  requestedRow:
    | MarkerComparisonRow
    | null,
  recommendedRow:
    | MarkerComparisonRow
    | null,
  orderQuantity: number | null
): {
  utilisationImprovementPercent: number;

  fabricSavingPerGarmentCm: number;

  fabricSavingForOrderMetres: number;

  fabricSavingPercent: number;
} {
  if (
    !requestedRow ||
    !recommendedRow ||
    !requestedRow.complete ||
    !recommendedRow.complete
  ) {
    return {
      utilisationImprovementPercent:
        0,

      fabricSavingPerGarmentCm:
        0,

      fabricSavingForOrderMetres:
        0,

      fabricSavingPercent:
        0,
    };
  }

  const utilisationImprovementPercent =
    recommendedRow
      .utilisationPercent -
    requestedRow
      .utilisationPercent;

  const fabricSavingPerGarmentCm =
    Math.max(
      0,
      requestedRow
        .fabricPerGarmentCm -
        recommendedRow
          .fabricPerGarmentCm
    );

  const fabricSavingForOrderMetres =
    orderQuantity
      ? (
          fabricSavingPerGarmentCm *
          orderQuantity
        ) /
        100
      : 0;

  const fabricSavingPercent =
    requestedRow
      .fabricPerGarmentCm >
    0
      ? (
          fabricSavingPerGarmentCm /
          requestedRow
            .fabricPerGarmentCm
        ) *
        100
      : 0;

  return {
    utilisationImprovementPercent,

    fabricSavingPerGarmentCm,

    fabricSavingForOrderMetres,

    fabricSavingPercent,
  };
}

function determineRecommendationStrength(
  savingPercent: number
): MarkerComparisonSummary["recommendationStrength"] {
  if (
    !Number.isFinite(
      savingPercent
    ) ||
    savingPercent <= 0
  ) {
    return "none";
  }

  if (savingPercent < 0.5) {
    return "small";
  }

  if (savingPercent < 1.5) {
    return "moderate";
  }

  return "strong";
}

function findBestRankedRow(
  rows: MarkerComparisonRow[]
): MarkerComparisonRow | null {
  if (rows.length === 0) {
    return null;
  }

  return [...rows].sort(
    (first, second) => {
      const firstRank =
        first.rank ??
        Number.POSITIVE_INFINITY;

      const secondRank =
        second.rank ??
        Number.POSITIVE_INFINITY;

      if (
        firstRank !==
        secondRank
      ) {
        return (
          firstRank -
          secondRank
        );
      }

      const firstScore =
        first.engineeringScore ??
        0;

      const secondScore =
        second.engineeringScore ??
        0;

      return (
        secondScore -
        firstScore
      );
    }
  )[0];
}

function findMaximumRow(
  rows: MarkerComparisonRow[],
  selector: (
    row: MarkerComparisonRow
  ) => number
): MarkerComparisonRow | null {
  if (rows.length === 0) {
    return null;
  }

  return rows.reduce(
    (best, row) =>
      selector(row) >
      selector(best)
        ? row
        : best
  );
}

function findMinimumRow(
  rows: MarkerComparisonRow[],
  selector: (
    row: MarkerComparisonRow
  ) => number
): MarkerComparisonRow | null {
  if (rows.length === 0) {
    return null;
  }

  return rows.reduce(
    (best, row) =>
      selector(row) <
      selector(best)
        ? row
        : best
  );
}

function isRankedMarkerCandidate(
  candidate:
    | MarkerCandidate
    | RankedMarkerCandidate
): candidate is RankedMarkerCandidate {
  return (
    "score" in candidate &&
    "rank" in candidate &&
    typeof candidate.rank ===
      "number"
  );
}

function resolvePositiveInteger(
  value: unknown
): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 1
  ) {
    return null;
  }

  return Math.floor(value);
}