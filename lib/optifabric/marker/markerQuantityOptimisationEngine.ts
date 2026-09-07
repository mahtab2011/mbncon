import { computeCanonicalMarkerQualityScore } from "./markerScoringEngine";

export interface MarkerCandidate {
  garmentsPerMarker: number;

  markerLengthCm: number;

  utilisationPercent: number;
  wastePercent: number;

  piecesPlaced: number;
  expectedPieces: number;

  collisionCount: number;

  fabricPerGarmentCm: number;

  candidateTests?: number;

  searchBudgetExceeded: boolean;

  maximumMarkerLengthCm?: number | null;

  orderQuantity?: number | null;
}

export interface MarkerScoreBreakdown {
  utilisationScore: number;

  fabricConsumptionScore: number;

  markerLengthScore: number;

  productionBalanceScore: number;

  searchStabilityScore: number;

  overallScore: number;
}

export interface RankedMarkerCandidate extends MarkerCandidate {
  valid: boolean;

  rejectionReasons: string[];

  score: MarkerScoreBreakdown;

  rank: number;

  recommendationReason: string;
}

export interface MarkerRecommendation {
  requestedGarmentsPerMarker: number | null;

  validSolutions: RankedMarkerCandidate[];

  rejectedSolutions: RankedMarkerCandidate[];

  rankedSolutions: RankedMarkerCandidate[];

  bestUtilisation: RankedMarkerCandidate | null;

  lowestFabricConsumption: RankedMarkerCandidate | null;

  shortestMarker: RankedMarkerCandidate | null;

  bestOrderBalance: RankedMarkerCandidate | null;

  bestOverall: RankedMarkerCandidate | null;

  requestedSolution: RankedMarkerCandidate | null;

  potentialFabricSavingPerGarmentCm: number;

  potentialFabricSavingForOrderCm: number;

  potentialFabricSavingPercent: number;

  recommendationSummary: string;
}

export interface MarkerAnalysisOptions {
  requestedGarmentsPerMarker?: number | null;

  orderQuantity?: number | null;

  maximumMarkerLengthCm?: number | null;

  weights?: {
    utilisation?: number;

    fabricConsumption?: number;

    markerLength?: number;

    productionBalance?: number;

    searchStability?: number;
  };
}

const DEFAULT_WEIGHTS = {
  utilisation: 0.35,

  fabricConsumption: 0.30,

  markerLength: 0.15,

  productionBalance: 0.15,

  searchStability: 0.05,
};

const SCORE_PRECISION = 4;

export function analyseMarkerSolutions(
  candidates: MarkerCandidate[],
  options: MarkerAnalysisOptions = {}
): MarkerRecommendation {
  const requestedGarmentsPerMarker =
    resolvePositiveInteger(
      options.requestedGarmentsPerMarker
    );

  const orderQuantity =
    resolvePositiveInteger(
      options.orderQuantity
    );

  const maximumMarkerLengthCm =
    resolvePositiveNumber(
      options.maximumMarkerLengthCm
    );

  const weights = normaliseWeights({
    ...DEFAULT_WEIGHTS,
    ...options.weights,
  });

  const validatedCandidates =
    candidates.map((candidate) =>
      validateCandidate(
        candidate,
        maximumMarkerLengthCm,
        orderQuantity
      )
    );

  const validCandidates =
    validatedCandidates.filter(
      (candidate) => candidate.valid
    );

  const rejectedCandidates =
    validatedCandidates.filter(
      (candidate) => !candidate.valid
    );

  if (validCandidates.length === 0) {
    return {
      requestedGarmentsPerMarker,

      validSolutions: [],

      rejectedSolutions:
        rejectedCandidates,

      rankedSolutions:
        rejectedCandidates,

      bestUtilisation: null,

      lowestFabricConsumption: null,

      shortestMarker: null,

      bestOrderBalance: null,

      bestOverall: null,

      requestedSolution:
        findRequestedSolution(
          validatedCandidates,
          requestedGarmentsPerMarker
        ),

      potentialFabricSavingPerGarmentCm:
        0,

      potentialFabricSavingForOrderCm:
        0,

      potentialFabricSavingPercent:
        0,

      recommendationSummary:
        "No complete, collision-free and search-stable marker solution was available for recommendation.",
    };
  }

  const scoreRanges =
    calculateScoreRanges(
      validCandidates
    );

  const scoredCandidates =
    validCandidates.map(
      (candidate) =>
        scoreCandidate(
          candidate,
          scoreRanges,
          weights,
          orderQuantity
        )
    );

  const rankedValidSolutions =
    [...scoredCandidates]
      .sort(compareRankedCandidates)
      .map((candidate, index) => ({
        ...candidate,

        rank: index + 1,

        recommendationReason:
          createCandidateReason(
            candidate,
            orderQuantity
          ),
      }));

  const rejectedSolutions =
    rejectedCandidates.map(
      (candidate) => ({
        ...candidate,

        rank: 0,

        recommendationReason:
          candidate.rejectionReasons.join(
            " "
          ),
      })
    );

  const bestUtilisation =
    findMaximum(
      rankedValidSolutions,
      (candidate) =>
        candidate.utilisationPercent
    );

  const lowestFabricConsumption =
    findMinimum(
      rankedValidSolutions,
      (candidate) =>
        candidate.fabricPerGarmentCm
    );

  const shortestMarker =
    findMinimum(
      rankedValidSolutions,
      (candidate) =>
        candidate.markerLengthCm
    );

  const bestOrderBalance =
    findMaximum(
      rankedValidSolutions,
      (candidate) =>
        candidate.score
          .productionBalanceScore
    );

  const bestOverall =
    rankedValidSolutions[0] ??
    null;

  const requestedSolution =
    findRequestedSolution(
      [
        ...rankedValidSolutions,
        ...rejectedSolutions,
      ],
      requestedGarmentsPerMarker
    );

  const saving =
    calculatePotentialSaving(
      requestedSolution,
      bestOverall,
      orderQuantity
    );

  return {
    requestedGarmentsPerMarker,

    validSolutions:
      rankedValidSolutions,

    rejectedSolutions,

    rankedSolutions: [
      ...rankedValidSolutions,
      ...rejectedSolutions,
    ],

    bestUtilisation,

    lowestFabricConsumption,

    shortestMarker,

    bestOrderBalance,

    bestOverall,

    requestedSolution,

    potentialFabricSavingPerGarmentCm:
      saving.perGarmentCm,

    potentialFabricSavingForOrderCm:
      saving.forOrderCm,

    potentialFabricSavingPercent:
      saving.percent,

    recommendationSummary:
      createRecommendationSummary(
        requestedSolution,
        bestOverall,
        saving
      ),
  };
}

function validateCandidate(
  candidate: MarkerCandidate,
  maximumMarkerLengthCm: number | null,
  orderQuantity: number | null
): RankedMarkerCandidate {
  const rejectionReasons:
    string[] = [];

  if (
    !Number.isFinite(
      candidate.garmentsPerMarker
    ) ||
    candidate.garmentsPerMarker < 1
  ) {
    rejectionReasons.push(
      "Garments per marker must be at least one."
    );
  }

  if (
    !Number.isFinite(
      candidate.markerLengthCm
    ) ||
    candidate.markerLengthCm <= 0
  ) {
    rejectionReasons.push(
      "Marker length is invalid."
    );
  }

  if (
    !Number.isFinite(
      candidate.fabricPerGarmentCm
    ) ||
    candidate.fabricPerGarmentCm <= 0
  ) {
    rejectionReasons.push(
      "Fabric consumption per garment is invalid."
    );
  }

  if (
    candidate.piecesPlaced !==
    candidate.expectedPieces
  ) {
    rejectionReasons.push(
      `${candidate.expectedPieces - candidate.piecesPlaced} required piece(s) were not placed.`
    );
  }

  if (
    candidate.collisionCount > 0
  ) {
    rejectionReasons.push(
      `${candidate.collisionCount} polygon collision(s) remain.`
    );
  }

  if (
    candidate.searchBudgetExceeded
  ) {
    rejectionReasons.push(
      "The browser-safe search budget was exhausted."
    );
  }

  const candidateMaximumLength =
    resolvePositiveNumber(
      candidate.maximumMarkerLengthCm
    );

  const effectiveMaximumLength =
    candidateMaximumLength ??
    maximumMarkerLengthCm;

  if (
    effectiveMaximumLength !== null &&
    candidate.markerLengthCm >
      effectiveMaximumLength
  ) {
    rejectionReasons.push(
      `Marker length exceeds the maximum permitted length of ${formatNumber(
        effectiveMaximumLength,
        1
      )} cm.`
    );
  }

  const effectiveOrderQuantity =
    resolvePositiveInteger(
      candidate.orderQuantity
    ) ??
    orderQuantity;

  return {
    ...candidate,

    orderQuantity:
      effectiveOrderQuantity,

    maximumMarkerLengthCm:
      effectiveMaximumLength,

    valid:
      rejectionReasons.length === 0,

    rejectionReasons,

    score: createEmptyScore(),

    rank: 0,

    recommendationReason: "",
  };
}

interface ScoreRanges {
  minimumUtilisation: number;
  maximumUtilisation: number;

  minimumFabricConsumption: number;
  maximumFabricConsumption: number;

  minimumMarkerLength: number;
  maximumMarkerLength: number;

  minimumCandidateTests: number;
  maximumCandidateTests: number;
}

function calculateScoreRanges(
  candidates: RankedMarkerCandidate[]
): ScoreRanges {
  return {
    minimumUtilisation: Math.min(
      ...candidates.map(
        (candidate) =>
          candidate.utilisationPercent
      )
    ),

    maximumUtilisation: Math.max(
      ...candidates.map(
        (candidate) =>
          candidate.utilisationPercent
      )
    ),

    minimumFabricConsumption:
      Math.min(
        ...candidates.map(
          (candidate) =>
            candidate.fabricPerGarmentCm
        )
      ),

    maximumFabricConsumption:
      Math.max(
        ...candidates.map(
          (candidate) =>
            candidate.fabricPerGarmentCm
        )
      ),

    minimumMarkerLength: Math.min(
      ...candidates.map(
        (candidate) =>
          candidate.markerLengthCm
      )
    ),

    maximumMarkerLength: Math.max(
      ...candidates.map(
        (candidate) =>
          candidate.markerLengthCm
      )
    ),

    minimumCandidateTests: Math.min(
      ...candidates.map(
        (candidate) =>
          candidate.candidateTests ?? 0
      )
    ),

    maximumCandidateTests: Math.max(
      ...candidates.map(
        (candidate) =>
          candidate.candidateTests ?? 0
      )
    ),
  };
}

function scoreCandidate(
  candidate: RankedMarkerCandidate,
  ranges: ScoreRanges,
  weights: typeof DEFAULT_WEIGHTS,
  orderQuantity: number | null
): RankedMarkerCandidate {
  const utilisationScore =
    normaliseHigherIsBetter(
      candidate.utilisationPercent,
      ranges.minimumUtilisation,
      ranges.maximumUtilisation
    );

  const fabricConsumptionScore =
    normaliseLowerIsBetter(
      candidate.fabricPerGarmentCm,
      ranges.minimumFabricConsumption,
      ranges.maximumFabricConsumption
    );

  const markerLengthScore =
    normaliseLowerIsBetter(
      candidate.markerLengthCm,
      ranges.minimumMarkerLength,
      ranges.maximumMarkerLength
    );

  const productionBalanceScore =
    calculateProductionBalanceScore(
      orderQuantity,
      candidate.garmentsPerMarker
    );

  const searchStabilityScore =
    normaliseLowerIsBetter(
      candidate.candidateTests ?? 0,
      ranges.minimumCandidateTests,
      ranges.maximumCandidateTests
    );

  /**
   * overallScore is now the canonical, absolute marker-quality score (see
   * markerScoringEngine.ts) rather than a sibling-normalised blend.
   *
   * utilisationScore, fabricConsumptionScore, markerLengthScore and
   * searchStabilityScore above remain deliberately sibling-relative — they
   * answer "how does this candidate compare to the others being generated
   * right now", which is exactly what createCandidateReason() below needs
   * to write a comparative recommendation, and what the >=90 thresholds in
   * that function assume. They are optimisation/ranking-comparison metadata,
   * not the canonical marker quality score, and must not be presented to a
   * user as "Engineering Score" on their own.
   *
   * productionBalanceScore is already absolute (order-quantity divisibility
   * is a fixed arithmetic fact, not sibling-relative) and is intentionally
   * excluded from overallScore: order-batching convenience is a planning
   * concern, not a property of the marker's physical layout quality.
   */
  const overallScore =
    computeCanonicalMarkerQualityScore({
      utilisationPercent:
        candidate.utilisationPercent,
    }).overallScore;

  return {
    ...candidate,

    score: {
      utilisationScore:
        roundScore(
          utilisationScore
        ),

      fabricConsumptionScore:
        roundScore(
          fabricConsumptionScore
        ),

      markerLengthScore:
        roundScore(
          markerLengthScore
        ),

      productionBalanceScore:
        roundScore(
          productionBalanceScore
        ),

      searchStabilityScore:
        roundScore(
          searchStabilityScore
        ),

      overallScore:
        roundScore(
          overallScore
        ),
    },
  };
}

function compareRankedCandidates(
  first: RankedMarkerCandidate,
  second: RankedMarkerCandidate
): number {
  if (
    second.score.overallScore !==
    first.score.overallScore
  ) {
    return (
      second.score.overallScore -
      first.score.overallScore
    );
  }

  if (
    first.fabricPerGarmentCm !==
    second.fabricPerGarmentCm
  ) {
    return (
      first.fabricPerGarmentCm -
      second.fabricPerGarmentCm
    );
  }

  if (
    second.utilisationPercent !==
    first.utilisationPercent
  ) {
    return (
      second.utilisationPercent -
      first.utilisationPercent
    );
  }

  return (
    first.garmentsPerMarker -
    second.garmentsPerMarker
  );
}

function calculateProductionBalanceScore(
  orderQuantity: number | null,
  garmentsPerMarker: number
): number {
  if (
    !orderQuantity ||
    orderQuantity <= 0 ||
    garmentsPerMarker <= 0
  ) {
    return 50;
  }

  const remainder =
    orderQuantity %
    garmentsPerMarker;

  if (remainder === 0) {
    return 100;
  }

  const imbalanceRatio =
    remainder /
    garmentsPerMarker;

  return Math.max(
    0,
    100 -
      imbalanceRatio * 100
  );
}

function createCandidateReason(
  candidate: RankedMarkerCandidate,
  orderQuantity: number | null
): string {
  const reasons: string[] = [];

  if (
    candidate.score
      .utilisationScore >= 90
  ) {
    reasons.push(
      "It achieves one of the strongest fabric-utilisation results."
    );
  }

  if (
    candidate.score
      .fabricConsumptionScore >= 90
  ) {
    reasons.push(
      "It has one of the lowest fabric-consumption figures per garment."
    );
  }

  if (
    candidate.score
      .markerLengthScore >= 90
  ) {
    reasons.push(
      "Its marker length is operationally compact."
    );
  }

  if (
    orderQuantity &&
    orderQuantity %
      candidate.garmentsPerMarker ===
      0
  ) {
    reasons.push(
      "It divides evenly into the saved order quantity."
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      "It provides a balanced combination of utilisation, consumption, marker length and production practicality."
    );
  }

  return reasons.join(" ");
}

function calculatePotentialSaving(
  requested:
    | RankedMarkerCandidate
    | null,
  recommended:
    | RankedMarkerCandidate
    | null,
  orderQuantity: number | null
): {
  perGarmentCm: number;
  forOrderCm: number;
  percent: number;
} {
  if (
    !requested ||
    !recommended ||
    !requested.valid ||
    !recommended.valid
  ) {
    return {
      perGarmentCm: 0,
      forOrderCm: 0,
      percent: 0,
    };
  }

  const perGarmentCm =
    Math.max(
      0,
      requested.fabricPerGarmentCm -
        recommended.fabricPerGarmentCm
    );

  const forOrderCm =
    orderQuantity
      ? perGarmentCm *
        orderQuantity
      : 0;

  const percent =
    requested.fabricPerGarmentCm >
    0
      ? (
          perGarmentCm /
          requested.fabricPerGarmentCm
        ) *
        100
      : 0;

  return {
    perGarmentCm,
    forOrderCm,
    percent,
  };
}

function createRecommendationSummary(
  requested:
    | RankedMarkerCandidate
    | null,
  recommended:
    | RankedMarkerCandidate
    | null,
  saving: {
    perGarmentCm: number;
    forOrderCm: number;
    percent: number;
  }
): string {
  if (!recommended) {
    return "No valid marker solution is currently available.";
  }

  if (
    requested &&
    requested.valid &&
    requested.garmentsPerMarker ===
      recommended.garmentsPerMarker
  ) {
    return `The requested ${requested.garmentsPerMarker}-garment marker is also the best overall production solution among the valid candidates.`;
  }

  if (
    requested &&
    requested.valid
  ) {
    return `OptiFabric recommends ${recommended.garmentsPerMarker} garments per marker instead of the requested ${requested.garmentsPerMarker}. Estimated fabric saving is ${formatNumber(
      saving.perGarmentCm,
      2
    )} cm per garment, or ${formatNumber(
      saving.percent,
      2
    )}%.`;
  }

  if (
    requested &&
    !requested.valid
  ) {
    return `The requested ${requested.garmentsPerMarker}-garment marker is not engineering-valid. OptiFabric recommends the ${recommended.garmentsPerMarker}-garment solution instead.`;
  }

  return `OptiFabric recommends ${recommended.garmentsPerMarker} garments per marker as the best overall production solution.`;
}

function findRequestedSolution(
  candidates: RankedMarkerCandidate[],
  requestedGarmentsPerMarker:
    | number
    | null
): RankedMarkerCandidate | null {
  if (
    requestedGarmentsPerMarker ===
    null
  ) {
    return null;
  }

  return (
    candidates.find(
      (candidate) =>
        candidate.garmentsPerMarker ===
        requestedGarmentsPerMarker
    ) ?? null
  );
}

function findMaximum(
  candidates: RankedMarkerCandidate[],
  selector: (
    candidate: RankedMarkerCandidate
  ) => number
): RankedMarkerCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce(
    (best, candidate) =>
      selector(candidate) >
      selector(best)
        ? candidate
        : best
  );
}

function findMinimum(
  candidates: RankedMarkerCandidate[],
  selector: (
    candidate: RankedMarkerCandidate
  ) => number
): RankedMarkerCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce(
    (best, candidate) =>
      selector(candidate) <
      selector(best)
        ? candidate
        : best
  );
}

function normaliseHigherIsBetter(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (maximum === minimum) {
    return 100;
  }

  return (
    ((value - minimum) /
      (maximum - minimum)) *
    100
  );
}

function normaliseLowerIsBetter(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (maximum === minimum) {
    return 100;
  }

  return (
    ((maximum - value) /
      (maximum - minimum)) *
    100
  );
}

function normaliseWeights(
  weights: typeof DEFAULT_WEIGHTS
): typeof DEFAULT_WEIGHTS {
  const safeWeights = {
    utilisation: Math.max(
      0,
      weights.utilisation
    ),

    fabricConsumption: Math.max(
      0,
      weights.fabricConsumption
    ),

    markerLength: Math.max(
      0,
      weights.markerLength
    ),

    productionBalance: Math.max(
      0,
      weights.productionBalance
    ),

    searchStability: Math.max(
      0,
      weights.searchStability
    ),
  };

  const total =
    safeWeights.utilisation +
    safeWeights.fabricConsumption +
    safeWeights.markerLength +
    safeWeights.productionBalance +
    safeWeights.searchStability;

  if (total <= 0) {
    return DEFAULT_WEIGHTS;
  }

  return {
    utilisation:
      safeWeights.utilisation /
      total,

    fabricConsumption:
      safeWeights.fabricConsumption /
      total,

    markerLength:
      safeWeights.markerLength /
      total,

    productionBalance:
      safeWeights.productionBalance /
      total,

    searchStability:
      safeWeights.searchStability /
      total,
  };
}

function createEmptyScore(): MarkerScoreBreakdown {
  return {
    utilisationScore: 0,

    fabricConsumptionScore: 0,

    markerLengthScore: 0,

    productionBalanceScore: 0,

    searchStabilityScore: 0,

    overallScore: 0,
  };
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

function roundScore(
  value: number
): number {
  const factor =
    10 ** SCORE_PRECISION;

  return (
    Math.round(value * factor) /
    factor
  );
}

function formatNumber(
  value: number,
  decimals = 2
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString(
    "en-GB",
    {
      minimumFractionDigits:
        decimals,

      maximumFractionDigits:
        decimals,
    }
  );
}