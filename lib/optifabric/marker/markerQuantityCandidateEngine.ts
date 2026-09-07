import type {
  MarkerCandidate,
} from "./markerQuantityOptimisationEngine";

import type {
  NestingResult,
} from "./markerNestingEngine";

export interface MarkerQuantityCandidateInput {
  garmentsPerMarker: number;

  nestingResult: NestingResult;

  usableFabricWidthCm: number;

  totalPatternAreaPerGarmentCm2: number;

  expectedPiecesPerGarment: number;

  canvasPixelsPerCm: number;

  maximumMarkerLengthCm?: number | null;

  orderQuantity?: number | null;
}

export interface MarkerQuantityCandidateBuildResult {
  candidate: MarkerCandidate;

  markerLengthCm: number;

  markerAreaCm2: number;

  placedPatternAreaCm2: number;

  utilisationPercent: number;

  wastePercent: number;

  fabricPerGarmentCm: number;

  complete: boolean;
}

/**
 * Converts one completed nesting result into a marker candidate that can be
 * evaluated by markerQuantityOptimisationEngine.ts.
 *
 * This adapter performs measurement and validation preparation only.
 * It does not run nesting and it does not rank marker quantities.
 */
export function createMarkerQuantityCandidate(
  input: MarkerQuantityCandidateInput
): MarkerQuantityCandidateBuildResult {
  const garmentsPerMarker =
    resolvePositiveInteger(
      input.garmentsPerMarker
    ) ?? 1;

  const canvasPixelsPerCm =
    resolvePositiveNumber(
      input.canvasPixelsPerCm
    ) ?? 1;

  const usableFabricWidthCm =
    resolvePositiveNumber(
      input.usableFabricWidthCm
    ) ?? 0;

  const totalPatternAreaPerGarmentCm2 =
    resolveNonNegativeNumber(
      input.totalPatternAreaPerGarmentCm2
    );

  const expectedPiecesPerGarment =
    resolvePositiveInteger(
      input.expectedPiecesPerGarment
    ) ?? 0;

  const markerLengthCm =
    input.nestingResult.markerHeight >
    0
      ? input.nestingResult.markerHeight /
        canvasPixelsPerCm
      : 0;

  const markerAreaCm2 =
    usableFabricWidthCm > 0 &&
    markerLengthCm > 0
      ? usableFabricWidthCm *
        markerLengthCm
      : 0;

  const expectedPieces =
    expectedPiecesPerGarment *
    garmentsPerMarker;

  const piecesPlaced =
    Math.max(
      0,
      Math.floor(
        input.nestingResult.placedCount
      )
    );

  const placedPatternAreaCm2 =
    calculatePlacedPatternArea(
      totalPatternAreaPerGarmentCm2,
      expectedPieces,
      piecesPlaced,
      garmentsPerMarker
    );

  const utilisationPercent =
    markerAreaCm2 > 0
      ? clampPercentage(
          (
            placedPatternAreaCm2 /
            markerAreaCm2
          ) *
            100
        )
      : 0;

  const wastePercent =
    markerAreaCm2 > 0
      ? clampPercentage(
          100 -
            utilisationPercent
        )
      : 100;

  const fabricPerGarmentCm =
    garmentsPerMarker > 0 &&
    markerLengthCm > 0
      ? markerLengthCm /
        garmentsPerMarker
      : 0;

  const budgetExhaustedCount =
    resolveBudgetExhaustedCount(
      input.nestingResult
    );

  const candidateTests =
    resolveCandidateTests(
      input.nestingResult
    );

  const searchBudgetExceeded =
    budgetExhaustedCount > 0;

  const maximumMarkerLengthCm =
    resolvePositiveNumber(
      input.maximumMarkerLengthCm
    );

  const orderQuantity =
    resolvePositiveInteger(
      input.orderQuantity
    );

  const complete =
    piecesPlaced ===
      expectedPieces &&
    input.nestingResult.unplacedCount ===
      0 &&
    input.nestingResult.collisionCount ===
      0 &&
    !searchBudgetExceeded &&
    markerLengthCm > 0;

  const candidate: MarkerCandidate = {
    garmentsPerMarker,

    markerLengthCm,

    utilisationPercent,

    wastePercent,

    piecesPlaced,

    expectedPieces,

    collisionCount:
      Math.max(
        0,
        Math.floor(
          input.nestingResult
            .collisionCount
        )
      ),

    fabricPerGarmentCm,

    candidateTests,

    searchBudgetExceeded,

    maximumMarkerLengthCm,

    orderQuantity,
  };

  return {
    candidate,

    markerLengthCm,

    markerAreaCm2,

    placedPatternAreaCm2,

    utilisationPercent,

    wastePercent,

    fabricPerGarmentCm,

    complete,
  };
}

/**
 * Builds several optimiser-ready candidates from completed nesting results.
 */
export function createMarkerQuantityCandidates(
  inputs: MarkerQuantityCandidateInput[]
): MarkerQuantityCandidateBuildResult[] {
  return inputs.map(
    createMarkerQuantityCandidate
  );
}

/**
 * Returns only engineering-complete candidates.
 *
 * The main optimiser performs its own full validation, but this helper is
 * useful when the page needs a quick list of completed markers.
 */
export function filterCompleteMarkerCandidates(
  results: MarkerQuantityCandidateBuildResult[]
): MarkerQuantityCandidateBuildResult[] {
  return results.filter(
    (result) => result.complete
  );
}

/**
 * Finds the candidate corresponding to the cutting master's requested
 * garments-per-marker quantity.
 */
export function findMarkerQuantityCandidate(
  results: MarkerQuantityCandidateBuildResult[],
  garmentsPerMarker: number
): MarkerQuantityCandidateBuildResult | null {
  const resolvedQuantity =
    resolvePositiveInteger(
      garmentsPerMarker
    );

  if (resolvedQuantity === null) {
    return null;
  }

  return (
    results.find(
      (result) =>
        result.candidate
          .garmentsPerMarker ===
        resolvedQuantity
    ) ?? null
  );
}

/**
 * Calculates area represented by successfully placed pieces.
 *
 * When every required piece is placed, this is the full area of all garment
 * sets. When the marker is incomplete, the area is reduced proportionally so
 * the diagnostic utilisation does not falsely count missing pieces.
 */
function calculatePlacedPatternArea(
  areaPerGarmentCm2: number,
  expectedPieces: number,
  piecesPlaced: number,
  garmentsPerMarker: number
): number {
  if (
    areaPerGarmentCm2 <= 0 ||
    garmentsPerMarker <= 0 ||
    expectedPieces <= 0 ||
    piecesPlaced <= 0
  ) {
    return 0;
  }

  const completeMarkerArea =
    areaPerGarmentCm2 *
    garmentsPerMarker;

  if (
    piecesPlaced >=
    expectedPieces
  ) {
    return completeMarkerArea;
  }

  const placementRatio =
    piecesPlaced /
    expectedPieces;

  return (
    completeMarkerArea *
    placementRatio
  );
}

/**
 * Supports the current spatial-band nesting engine while remaining compatible
 * with an earlier engine version that may omit these diagnostics.
 */
function resolveBudgetExhaustedCount(
  nestingResult: NestingResult
): number {
  const value =
    "budgetExhaustedCount" in
    nestingResult
      ? nestingResult
          .budgetExhaustedCount
      : 0;

  return typeof value === "number" &&
    Number.isFinite(value)
    ? Math.max(
        0,
        Math.floor(value)
      )
    : 0;
}

function resolveCandidateTests(
  nestingResult: NestingResult
): number {
  const value =
    "candidateTests" in
    nestingResult
      ? nestingResult.candidateTests
      : 0;

  return typeof value === "number" &&
    Number.isFinite(value)
    ? Math.max(
        0,
        Math.floor(value)
      )
    : 0;
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

function resolvePositiveNumber(
  value: unknown
): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return null;
  }

  return value;
}

function resolveNonNegativeNumber(
  value: unknown
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return value;
}

function clampPercentage(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, value)
  );
}