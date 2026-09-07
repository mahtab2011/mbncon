/**
 * OptiFabric AI
 * RC5-004-005 — Hole Filling & Compaction Orchestrator
 *
 * Purpose:
 * - Connect Marker Void Detection, Piece-to-Void Compatibility,
 *   Collision-Safe Hole Filling and Intelligent Marker Compaction.
 * - Produce ranked, non-destructive final marker optimisation solutions.
 * - Preserve existing marker geometry until an engineer approves a solution.
 * - Provide one commercial workflow entry point for the UI and AI Consultant.
 */

import {
  detectMarkerVoids,
  type DetectedMarkerVoid,
  type MarkerVoidDetectionOptions,
  type MarkerVoidDetectionResult,
  type MarkerVoidPatternPiece,
  type MarkerVoidPoint,
} from "./markerVoidDetectionEngine";

import {
  evaluatePieceVoidCompatibility,
  type CompatibilityPatternPiece,
  type PieceVoidCompatibilityOptions,
  type PieceVoidCompatibilityResult,
  type PieceVoidPlacementCandidate,
} from "./pieceVoidCompatibilityEngine";

import {
  validateCollisionSafeHoleFilling,
  type CollisionSafeHoleFillingOptions,
  type CollisionSafeHoleFillingPlacement,
  type CollisionSafeHoleFillingResult,
  type ExistingMarkerPlacement,
} from "./collisionSafeHoleFillingEngine";

import {
  compactMarkerIntelligently,
  type CompactionPlacement,
  type IntelligentMarkerCompactionOptions,
  type IntelligentMarkerCompactionResult,
  type MarkerCompactionSolution,
} from "./intelligentMarkerCompactionEngine";

export interface HoleFillingSourcePlacement {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly mirrored?: boolean;
  readonly locked?: boolean;
  readonly grainLineLocked?: boolean;
  readonly grainLineAngle?: number;
  readonly maximumGrainDeviation?: number;
  readonly priority?: number;
  readonly category?: string;
}

export interface HoleFillingCandidatePiece {
  readonly id: string;
  readonly name?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly rotation?: number;
  readonly allowedRotations?: ReadonlyArray<number>;
  readonly rotationLocked?: boolean;
  readonly grainLineLocked?: boolean;
  readonly grainLineAngle?: number;
  readonly maximumGrainDeviation?: number;
  readonly availableQuantity?: number;
  readonly locked?: boolean;
  readonly priority?: number;
  readonly category?: string;
}

export interface HoleFillingCompactionOrchestratorOptions {
  readonly voidDetection?: MarkerVoidDetectionOptions;
  readonly compatibility?: PieceVoidCompatibilityOptions;
  readonly collisionValidation?: CollisionSafeHoleFillingOptions;
  readonly compaction?: IntelligentMarkerCompactionOptions;

  /**
   * Apply the selected Hole Filling placements to a temporary marker
   * before running Intelligent Marker Compaction.
   */
  readonly includeHoleFillingPlacementsInCompaction?: boolean;

  /**
   * Maximum number of final combined solutions returned.
   */
  readonly maximumFinalSolutions?: number;

  /**
   * Minimum combined Engineering Score.
   */
  readonly minimumCombinedEngineeringScore?: number;

  /**
   * Weight assigned to Hole Filling performance.
   */
  readonly holeFillingWeight?: number;

  /**
   * Weight assigned to Marker Compaction performance.
   */
  readonly compactionWeight?: number;

  /**
   * Weight assigned to collision and boundary safety.
   */
  readonly safetyWeight?: number;

  /**
   * Weight assigned to Fabric Utilisation improvement.
   */
  readonly utilisationWeight?: number;
}

export interface HoleFillingCompactionInput {
  readonly markerId?: string;
  readonly markerLength: number;
  readonly fabricWidth: number;
  readonly existingPlacements: ReadonlyArray<HoleFillingSourcePlacement>;
  readonly candidatePieces: ReadonlyArray<HoleFillingCandidatePiece>;
  readonly options?: HoleFillingCompactionOrchestratorOptions;
}

export interface AppliedHoleFillingPlacement {
  readonly id: string;
  readonly sourceCandidateId: string;
  readonly voidId: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly mirrored: boolean;
  readonly engineeringScore: number;
  readonly compatibilityScore: number;
}

export interface CombinedMarkerPlacement {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly mirrored: boolean;
  readonly locked: boolean;
  readonly source: "existing" | "holeFilling";
}

export type HoleFillingCompactionDecision =
  | "recommended"
  | "acceptable"
  | "reviewRequired"
  | "notRecommended";

export interface HoleFillingCompactionSolution {
  readonly id: string;
  readonly markerId?: string;
  readonly solutionNumber: number;
  readonly decision: HoleFillingCompactionDecision;
  readonly placements: ReadonlyArray<CombinedMarkerPlacement>;
  readonly holeFillingPlacements: ReadonlyArray<AppliedHoleFillingPlacement>;
  readonly compactionSolution: MarkerCompactionSolution | null;
  readonly originalMarkerLength: number;
  readonly finalMarkerLength: number;
  readonly markerLengthReduction: number;
  readonly markerLengthReductionPercentage: number;
  readonly originalPatternArea: number;
  readonly addedPatternArea: number;
  readonly finalPatternArea: number;
  readonly originalUtilisation: number;
  readonly finalUtilisation: number;
  readonly utilisationImprovement: number;
  readonly recoveredVoidArea: number;
  readonly holeFillingScore: number;
  readonly compactionScore: number;
  readonly safetyScore: number;
  readonly combinedEngineeringScore: number;
  readonly collisionFree: boolean;
  readonly boundarySafe: boolean;
  readonly engineeringReady: boolean;
  readonly reasons: ReadonlyArray<string>;
}

export interface HoleFillingCompactionStatistics {
  readonly existingPlacementCount: number;
  readonly candidatePieceCount: number;
  readonly detectedVoidCount: number;
  readonly compatibilityCandidateCount: number;
  readonly collisionSafePlacementCount: number;
  readonly selectedHoleFillingPlacementCount: number;
  readonly compactionSolutionCount: number;
  readonly finalSolutionCount: number;
  readonly originalMarkerLength: number;
  readonly bestFinalMarkerLength: number;
  readonly bestMarkerLengthReduction: number;
  readonly originalUtilisation: number;
  readonly bestFinalUtilisation: number;
  readonly bestCombinedEngineeringScore: number;
}

export interface HoleFillingCompactionResult {
  readonly markerId?: string;
  readonly voidDetection: MarkerVoidDetectionResult;
  readonly compatibility: PieceVoidCompatibilityResult;
  readonly collisionValidation: CollisionSafeHoleFillingResult;
  readonly compaction: IntelligentMarkerCompactionResult;
  readonly solutions: ReadonlyArray<HoleFillingCompactionSolution>;
  readonly bestSolution: HoleFillingCompactionSolution | null;
  readonly statistics: HoleFillingCompactionStatistics;
  readonly warnings: ReadonlyArray<string>;
  readonly engineeringReady: boolean;
}

interface NormalisedOrchestratorOptions {
  readonly includeHoleFillingPlacementsInCompaction: boolean;
  readonly maximumFinalSolutions: number;
  readonly minimumCombinedEngineeringScore: number;
  readonly holeFillingWeight: number;
  readonly compactionWeight: number;
  readonly safetyWeight: number;
  readonly utilisationWeight: number;
}

const EPSILON = 1e-8;
const DEFAULT_MAXIMUM_FINAL_SOLUTIONS = 10;

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function finiteNonNegative(
  value: number | undefined,
  fallback: number,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return fallback;
  }

  return value;
}

function finitePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

function normaliseWeights(
  holeFillingWeight: number,
  compactionWeight: number,
  safetyWeight: number,
  utilisationWeight: number,
): {
  holeFillingWeight: number;
  compactionWeight: number;
  safetyWeight: number;
  utilisationWeight: number;
} {
  const total =
    holeFillingWeight +
    compactionWeight +
    safetyWeight +
    utilisationWeight;

  if (total <= EPSILON) {
    return {
      holeFillingWeight: 0.3,
      compactionWeight: 0.3,
      safetyWeight: 0.25,
      utilisationWeight: 0.15,
    };
  }

  return {
    holeFillingWeight:
      holeFillingWeight / total,
    compactionWeight:
      compactionWeight / total,
    safetyWeight:
      safetyWeight / total,
    utilisationWeight:
      utilisationWeight / total,
  };
}

function normaliseOptions(
  options:
    | HoleFillingCompactionOrchestratorOptions
    | undefined,
): NormalisedOrchestratorOptions {
  const weights = normaliseWeights(
    finiteNonNegative(
      options?.holeFillingWeight,
      0.3,
    ),
    finiteNonNegative(
      options?.compactionWeight,
      0.3,
    ),
    finiteNonNegative(
      options?.safetyWeight,
      0.25,
    ),
    finiteNonNegative(
      options?.utilisationWeight,
      0.15,
    ),
  );

  return {
    includeHoleFillingPlacementsInCompaction:
      options?.includeHoleFillingPlacementsInCompaction ??
      true,

    maximumFinalSolutions:
      finitePositiveInteger(
        options?.maximumFinalSolutions,
        DEFAULT_MAXIMUM_FINAL_SOLUTIONS,
      ),

    minimumCombinedEngineeringScore:
      clamp(
        finiteNonNegative(
          options?.minimumCombinedEngineeringScore,
          0,
        ),
        0,
        100,
      ),

    ...weights,
  };
}

function calculatePolygonArea(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): number {
  if (polygon.length < 3) {
    return 0;
  }

  let signedArea = 0;

  for (
    let index = 0;
    index < polygon.length;
    index += 1
  ) {
    const current = polygon[index];
    const next =
      polygon[(index + 1) % polygon.length];

    signedArea +=
      current.x * next.y -
      next.x * current.y;
  }

  return Math.abs(signedArea) / 2;
}

function getPolygonMinimumPoint(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): MarkerVoidPoint {
  let minimumX = Number.POSITIVE_INFINITY;
  let minimumY = Number.POSITIVE_INFINITY;

  for (const point of polygon) {
    minimumX = Math.min(
      minimumX,
      point.x,
    );

    minimumY = Math.min(
      minimumY,
      point.y,
    );
  }

  return {
    x: Number.isFinite(minimumX)
      ? minimumX
      : 0,
    y: Number.isFinite(minimumY)
      ? minimumY
      : 0,
  };
}

function getPolygonMaximumX(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): number {
  let maximumX = 0;

  for (const point of polygon) {
    if (Number.isFinite(point.x)) {
      maximumX = Math.max(
        maximumX,
        point.x,
      );
    }
  }

  return maximumX;
}

function calculateMarkerLength(
  placements: ReadonlyArray<{
    readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  }>,
): number {
  return placements.reduce(
    (maximumLength, placement) =>
      Math.max(
        maximumLength,
        getPolygonMaximumX(
          placement.polygon,
        ),
      ),
    0,
  );
}

function calculateTotalPatternArea(
  placements: ReadonlyArray<{
    readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  }>,
): number {
  return placements.reduce(
    (total, placement) =>
      total +
      calculatePolygonArea(
        placement.polygon,
      ),
    0,
  );
}

function toMarkerVoidPlacement(
  placement: HoleFillingSourcePlacement,
): MarkerVoidPatternPiece {
  return {
    id: placement.id,
    name: placement.pieceName,
    polygon: placement.polygon,
    x: placement.x,
    y: placement.y,
    rotation: placement.rotation,
  };
}

function toCompatibilityPiece(
  piece: HoleFillingCandidatePiece,
): CompatibilityPatternPiece {
  return {
    id: piece.id,
    name: piece.name,
    polygon: piece.polygon,
    rotation: piece.rotation,
    allowedRotations:
      piece.allowedRotations,
    rotationLocked:
      piece.rotationLocked,
    grainLineLocked:
      piece.grainLineLocked,
    grainLineAngle:
      piece.grainLineAngle,
    maximumGrainDeviation:
      piece.maximumGrainDeviation,
    availableQuantity:
      piece.availableQuantity,
    locked: piece.locked,
    priority: piece.priority,
    category: piece.category,
  };
}

function toExistingPlacement(
  placement: HoleFillingSourcePlacement,
): ExistingMarkerPlacement {
  return {
    id: placement.id,
    pieceId: placement.pieceId,
    pieceName: placement.pieceName,
    polygon: placement.polygon,
    locked: placement.locked,
  };
}

function toCompactionPlacement(
  placement: HoleFillingSourcePlacement,
): CompactionPlacement {
  const minimumPoint =
    getPolygonMinimumPoint(
      placement.polygon,
    );

  return {
    id: placement.id,
    pieceId: placement.pieceId,
    pieceName: placement.pieceName,
    polygon: placement.polygon,
    x:
      placement.x ??
      minimumPoint.x,
    y:
      placement.y ??
      minimumPoint.y,
    rotation:
      placement.rotation ?? 0,
    mirrored:
      placement.mirrored ?? false,
    locked:
      placement.locked ?? false,
    grainLineLocked:
      placement.grainLineLocked,
    grainLineAngle:
      placement.grainLineAngle,
    maximumGrainDeviation:
      placement.maximumGrainDeviation,
    priority:
      placement.priority ?? 50,
  };
}

function toAppliedHoleFillingPlacement(
  placement: CollisionSafeHoleFillingPlacement,
): AppliedHoleFillingPlacement {
  return {
    id: placement.id,
    sourceCandidateId:
      placement.candidateId,
    voidId: placement.voidId,
    pieceId: placement.pieceId,
    pieceName: placement.pieceName,
    polygon: placement.polygon,
    x: placement.x,
    y: placement.y,
    rotation: placement.rotation,
    mirrored: placement.mirrored,
    engineeringScore:
      placement.engineeringScore,
    compatibilityScore:
      placement.compatibilityScore,
  };
}

function toHoleFillingCompactionPlacement(
  placement: AppliedHoleFillingPlacement,
): CompactionPlacement {
  return {
    id: placement.id,
    pieceId: placement.pieceId,
    pieceName: placement.pieceName,
    polygon: placement.polygon,
    x: placement.x,
    y: placement.y,
    rotation: placement.rotation,
    mirrored: placement.mirrored,
    locked: false,
    priority: 60,
  };
}

function createCombinedPlacements(
  sourcePlacements:
    ReadonlyArray<HoleFillingSourcePlacement>,
  holeFillingPlacements:
    ReadonlyArray<AppliedHoleFillingPlacement>,
  compactionSolution:
    MarkerCompactionSolution | null,
): ReadonlyArray<CombinedMarkerPlacement> {
  if (compactionSolution) {
    const holeFillingIds = new Set(
      holeFillingPlacements.map(
        (placement) =>
          placement.id,
      ),
    );

    return compactionSolution.placements.map(
      (placement) => ({
        id: placement.id,
        pieceId: placement.pieceId,
        pieceName:
          placement.pieceName,
        polygon: placement.polygon,
        x: placement.x,
        y: placement.y,
        rotation:
          placement.rotation,
        mirrored:
          placement.mirrored,
        locked:
          placement.locked,
        source: holeFillingIds.has(
          placement.id,
        )
          ? "holeFilling"
          : "existing",
      }),
    );
  }

  const existing =
    sourcePlacements.map(
      (placement): CombinedMarkerPlacement => {
        const minimumPoint =
          getPolygonMinimumPoint(
            placement.polygon,
          );

        return {
          id: placement.id,
          pieceId:
            placement.pieceId,
          pieceName:
            placement.pieceName,
          polygon:
            placement.polygon,
          x:
            placement.x ??
            minimumPoint.x,
          y:
            placement.y ??
            minimumPoint.y,
          rotation:
            placement.rotation ??
            0,
          mirrored:
            placement.mirrored ??
            false,
          locked:
            placement.locked ??
            false,
          source: "existing",
        };
      },
    );

  const inserted =
    holeFillingPlacements.map(
      (
        placement,
      ): CombinedMarkerPlacement => ({
        id: placement.id,
        pieceId:
          placement.pieceId,
        pieceName:
          placement.pieceName,
        polygon:
          placement.polygon,
        x: placement.x,
        y: placement.y,
        rotation:
          placement.rotation,
        mirrored:
          placement.mirrored,
        locked: false,
        source: "holeFilling",
      }),
    );

  return [
    ...existing,
    ...inserted,
  ];
}

function calculateHoleFillingScore(
  placements:
    ReadonlyArray<AppliedHoleFillingPlacement>,
): number {
  if (placements.length === 0) {
    return 0;
  }

  const averageEngineeringScore =
    placements.reduce(
      (total, placement) =>
        total +
        placement.engineeringScore,
      0,
    ) / placements.length;

  const averageCompatibilityScore =
    placements.reduce(
      (total, placement) =>
        total +
        placement.compatibilityScore,
      0,
    ) / placements.length;

  return clamp(
    averageEngineeringScore * 0.65 +
      averageCompatibilityScore *
        0.35,
    0,
    100,
  );
}

function calculateSafetyScore(
  collisionFree: boolean,
  boundarySafe: boolean,
): number {
  if (
    collisionFree &&
    boundarySafe
  ) {
    return 100;
  }

  if (
    collisionFree ||
    boundarySafe
  ) {
    return 50;
  }

  return 0;
}

function calculateUtilisationScore(
  utilisationImprovement: number,
): number {
  if (
    utilisationImprovement <= 0
  ) {
    return 0;
  }

  return clamp(
    utilisationImprovement * 10,
    0,
    100,
  );
}

function calculateCombinedScore(
  holeFillingScore: number,
  compactionScore: number,
  safetyScore: number,
  utilisationImprovement: number,
  options: NormalisedOrchestratorOptions,
): number {
  const utilisationScore =
    calculateUtilisationScore(
      utilisationImprovement,
    );

  return clamp(
    holeFillingScore *
      options.holeFillingWeight +
      compactionScore *
        options.compactionWeight +
      safetyScore *
        options.safetyWeight +
      utilisationScore *
        options.utilisationWeight,
    0,
    100,
  );
}

function getSolutionDecision(
  engineeringReady: boolean,
  combinedScore: number,
  collisionFree: boolean,
  boundarySafe: boolean,
): HoleFillingCompactionDecision {
  if (
    engineeringReady &&
    combinedScore >= 80
  ) {
    return "recommended";
  }

  if (
    collisionFree &&
    boundarySafe &&
    combinedScore >= 60
  ) {
    return "acceptable";
  }

  if (
    collisionFree &&
    boundarySafe
  ) {
    return "reviewRequired";
  }

  return "notRecommended";
}

function createSolutionReasons(
  markerLengthReduction: number,
  utilisationImprovement: number,
  holeFillingPlacementCount: number,
  collisionFree: boolean,
  boundarySafe: boolean,
  engineeringReady: boolean,
): ReadonlyArray<string> {
  const reasons: string[] = [];

  if (
    holeFillingPlacementCount > 0
  ) {
    reasons.push(
      `${holeFillingPlacementCount} pattern piece${
        holeFillingPlacementCount === 1
          ? ""
          : "s"
      } placed into detected marker voids.`,
    );
  } else {
    reasons.push(
      "No safe Hole Filling placement was selected.",
    );
  }

  if (
    markerLengthReduction >
    EPSILON
  ) {
    reasons.push(
      `Marker Length reduced by ${markerLengthReduction.toFixed(
        2,
      )}.`,
    );
  } else {
    reasons.push(
      "No measurable Marker Length reduction was achieved.",
    );
  }

  if (
    utilisationImprovement >
    EPSILON
  ) {
    reasons.push(
      `Fabric Utilisation improved by ${utilisationImprovement.toFixed(
        2,
      )} percentage points.`,
    );
  }

  if (
    collisionFree &&
    boundarySafe
  ) {
    reasons.push(
      "Final layout passed collision and marker-boundary validation.",
    );
  } else {
    reasons.push(
      "Final layout requires engineering safety review.",
    );
  }

  if (engineeringReady) {
    reasons.push(
      "Solution is Engineering Ready.",
    );
  }

  return reasons;
}

function createFinalSolution(
  markerId: string | undefined,
  solutionNumber: number,
  originalMarkerLength: number,
  fabricWidth: number,
  originalPlacements:
    ReadonlyArray<HoleFillingSourcePlacement>,
  holeFillingPlacements:
    ReadonlyArray<AppliedHoleFillingPlacement>,
  compactionSolution:
    MarkerCompactionSolution | null,
  options: NormalisedOrchestratorOptions,
): HoleFillingCompactionSolution {
  const placements =
    createCombinedPlacements(
      originalPlacements,
      holeFillingPlacements,
      compactionSolution,
    );

  const finalMarkerLength =
    compactionSolution
      ?.compactedMarkerLength ??
    calculateMarkerLength(
      placements,
    );

  const markerLengthReduction =
    Math.max(
      0,
      originalMarkerLength -
        finalMarkerLength,
    );

  const markerLengthReductionPercentage =
    originalMarkerLength <=
    EPSILON
      ? 0
      : (markerLengthReduction /
          originalMarkerLength) *
        100;

  const originalPatternArea =
    calculateTotalPatternArea(
      originalPlacements,
    );

  const addedPatternArea =
    calculateTotalPatternArea(
      holeFillingPlacements,
    );

  const finalPatternArea =
    calculateTotalPatternArea(
      placements,
    );

  const originalMarkerArea =
    originalMarkerLength *
    fabricWidth;

  const finalMarkerArea =
    finalMarkerLength *
    fabricWidth;

  const originalUtilisation =
    originalMarkerArea <= EPSILON
      ? 0
      : (originalPatternArea /
          originalMarkerArea) *
        100;

  const finalUtilisation =
    finalMarkerArea <= EPSILON
      ? 0
      : (finalPatternArea /
          finalMarkerArea) *
        100;

  const utilisationImprovement =
    finalUtilisation -
    originalUtilisation;

  const holeFillingScore =
    calculateHoleFillingScore(
      holeFillingPlacements,
    );

  const compactionScore =
    compactionSolution
      ?.engineeringScore ?? 0;

  const collisionFree =
    compactionSolution
      ?.collisionFree ?? true;

  const boundarySafe =
    compactionSolution
      ?.boundarySafe ?? true;

  const safetyScore =
    calculateSafetyScore(
      collisionFree,
      boundarySafe,
    );

  const combinedEngineeringScore =
    calculateCombinedScore(
      holeFillingScore,
      compactionScore,
      safetyScore,
      utilisationImprovement,
      options,
    );

  const engineeringReady =
    collisionFree &&
    boundarySafe &&
    combinedEngineeringScore +
      EPSILON >=
      options.minimumCombinedEngineeringScore &&
    (holeFillingPlacements.length >
      0 ||
      markerLengthReduction >
        EPSILON);

  const decision =
    getSolutionDecision(
      engineeringReady,
      combinedEngineeringScore,
      collisionFree,
      boundarySafe,
    );

  return {
    id: `${markerId ?? "marker"}-hole-filling-compaction-${solutionNumber}`,
    markerId,
    solutionNumber,
    decision,
    placements,
    holeFillingPlacements,
    compactionSolution,
    originalMarkerLength,
    finalMarkerLength,
    markerLengthReduction,
    markerLengthReductionPercentage,
    originalPatternArea,
    addedPatternArea,
    finalPatternArea,
    originalUtilisation,
    finalUtilisation,
    utilisationImprovement,
    recoveredVoidArea:
      addedPatternArea,
    holeFillingScore,
    compactionScore,
    safetyScore,
    combinedEngineeringScore,
    collisionFree,
    boundarySafe,
    engineeringReady,
    reasons:
      createSolutionReasons(
        markerLengthReduction,
        utilisationImprovement,
        holeFillingPlacements.length,
        collisionFree,
        boundarySafe,
        engineeringReady,
      ),
  };
}

function compareFinalSolutions(
  first: HoleFillingCompactionSolution,
  second: HoleFillingCompactionSolution,
): number {
  if (
    second.engineeringReady !==
    first.engineeringReady
  ) {
    return second.engineeringReady
      ? 1
      : -1;
  }

  if (
    second.combinedEngineeringScore !==
    first.combinedEngineeringScore
  ) {
    return (
      second.combinedEngineeringScore -
      first.combinedEngineeringScore
    );
  }

  if (
    first.finalMarkerLength !==
    second.finalMarkerLength
  ) {
    return (
      first.finalMarkerLength -
      second.finalMarkerLength
    );
  }

  if (
    second.finalUtilisation !==
    first.finalUtilisation
  ) {
    return (
      second.finalUtilisation -
      first.finalUtilisation
    );
  }

  return (
    second.holeFillingPlacements.length -
    first.holeFillingPlacements.length
  );
}

function createEmptyCompatibilityResult(
  markerId?: string,
): PieceVoidCompatibilityResult {
  return {
    markerId,
    candidates: [],
    candidatesByVoid: {},
    rejected: [],
    statistics: {
      testedVoids: 0,
      testedPieces: 0,
      testedCombinations: 0,
      acceptedCandidates: 0,
      rejectedCombinations: 0,
      piecesWithCandidates: 0,
      voidsWithCandidates: 0,
      bestCompatibilityScore: 0,
      averageCompatibilityScore: 0,
    },
    warnings: [],
    engineeringReady: false,
  };
}

function createEmptyCollisionResult(
  markerId?: string,
): CollisionSafeHoleFillingResult {
  return {
    markerId,
    placements: [],
    rejected: [],
    plan: {
      placements: [],
      usedPieceIds: [],
      usedVoidIds: [],
      totalPieceArea: 0,
      totalVoidArea: 0,
      estimatedRecoveredArea: 0,
      averageEngineeringScore: 0,
      bestEngineeringScore: 0,
    },
    statistics: {
      testedCandidates: 0,
      acceptedPlacements: 0,
      rejectedPlacements: 0,
      collisionRejections: 0,
      boundaryRejections: 0,
      uniquePiecesAccepted: 0,
      uniqueVoidsAccepted: 0,
      averageEngineeringScore: 0,
      bestEngineeringScore: 0,
    },
    warnings: [],
    engineeringReady: false,
  };
}

function createEmptyCompactionResult(
  input: HoleFillingCompactionInput,
): IntelligentMarkerCompactionResult {
  return {
    markerId: input.markerId,
    originalPlacements: [],
    solutions: [],
    bestSolution: null,
    passes: [],
    rejected: [],
    statistics: {
      testedPlacements: 0,
      lockedPlacements: 0,
      testedCandidatePositions: 0,
      acceptedMovements: 0,
      rejectedCandidatePositions: 0,
      completedPasses: 0,
      generatedSolutions: 0,
      originalMarkerLength:
        input.markerLength,
      bestCompactedMarkerLength:
        input.markerLength,
      bestLengthReduction: 0,
      bestLengthReductionPercentage: 0,
      originalUtilisation: 0,
      bestUtilisation: 0,
      bestEngineeringScore: 0,
    },
    warnings: [],
    engineeringReady: false,
  };
}

/**
 * Runs the complete Hole Filling and Intelligent Compaction workflow.
 */
export function runHoleFillingCompaction(
  input: HoleFillingCompactionInput,
): HoleFillingCompactionResult {
  const options =
    normaliseOptions(input.options);

  const warnings: string[] = [];

  if (
    !Number.isFinite(
      input.markerLength,
    ) ||
    input.markerLength <= 0 ||
    !Number.isFinite(
      input.fabricWidth,
    ) ||
    input.fabricWidth <= 0
  ) {
    warnings.push(
      "Marker Length and Fabric Width must be finite numbers greater than zero.",
    );

    const voidDetection =
      detectMarkerVoids({
        markerId:
          input.markerId,
        markerLength:
          input.markerLength,
        fabricWidth:
          input.fabricWidth,
        placements: [],
        options:
          input.options
            ?.voidDetection,
      });

    return {
      markerId:
        input.markerId,
      voidDetection,
      compatibility:
        createEmptyCompatibilityResult(
          input.markerId,
        ),
      collisionValidation:
        createEmptyCollisionResult(
          input.markerId,
        ),
      compaction:
        createEmptyCompactionResult(
          input,
        ),
      solutions: [],
      bestSolution: null,
      statistics: {
        existingPlacementCount:
          input.existingPlacements.length,
        candidatePieceCount:
          input.candidatePieces.length,
        detectedVoidCount: 0,
        compatibilityCandidateCount: 0,
        collisionSafePlacementCount: 0,
        selectedHoleFillingPlacementCount: 0,
        compactionSolutionCount: 0,
        finalSolutionCount: 0,
        originalMarkerLength:
          input.markerLength,
        bestFinalMarkerLength:
          input.markerLength,
        bestMarkerLengthReduction: 0,
        originalUtilisation: 0,
        bestFinalUtilisation: 0,
        bestCombinedEngineeringScore: 0,
      },
      warnings,
      engineeringReady: false,
    };
  }

  const voidDetection =
    detectMarkerVoids({
      markerId: input.markerId,
      markerLength:
        input.markerLength,
      fabricWidth:
        input.fabricWidth,
      placements:
        input.existingPlacements.map(
          toMarkerVoidPlacement,
        ),
      options:
        input.options?.voidDetection,
    });

  warnings.push(
    ...voidDetection.warnings,
  );

  const compatibility =
    evaluatePieceVoidCompatibility({
      markerId: input.markerId,
      voids:
        voidDetection.voids,
      pieces:
        input.candidatePieces.map(
          toCompatibilityPiece,
        ),
      options:
        input.options
          ?.compatibility,
    });

  warnings.push(
    ...compatibility.warnings,
  );

  const collisionValidation =
    validateCollisionSafeHoleFilling({
      markerId: input.markerId,
      markerLength:
        input.markerLength,
      fabricWidth:
        input.fabricWidth,
      voids:
        voidDetection.voids,
      pieces:
        input.candidatePieces.map(
          toCompatibilityPiece,
        ),
      existingPlacements:
        input.existingPlacements.map(
          toExistingPlacement,
        ),
      compatibilityCandidates:
        compatibility.candidates,
      options:
        input.options
          ?.collisionValidation,
    });

  warnings.push(
    ...collisionValidation.warnings,
  );

  const selectedHoleFillingPlacements =
    collisionValidation.plan.placements.map(
      toAppliedHoleFillingPlacement,
    );

  const baseCompactionPlacements =
    input.existingPlacements.map(
      toCompactionPlacement,
    );

  const compactionPlacements =
    options.includeHoleFillingPlacementsInCompaction
      ? [
          ...baseCompactionPlacements,
          ...selectedHoleFillingPlacements.map(
            toHoleFillingCompactionPlacement,
          ),
        ]
      : baseCompactionPlacements;

  const compaction =
    compactMarkerIntelligently({
      markerId: input.markerId,
      markerLength:
        input.markerLength,
      fabricWidth:
        input.fabricWidth,
      placements:
        compactionPlacements,
      options:
        input.options?.compaction,
    });

  warnings.push(
    ...compaction.warnings,
  );

  const solutions:
    HoleFillingCompactionSolution[] = [];

  if (
    compaction.solutions.length >
    0
  ) {
    for (
      const compactionSolution of
        compaction.solutions
    ) {
      solutions.push(
        createFinalSolution(
          input.markerId,
          solutions.length + 1,
          input.markerLength,
          input.fabricWidth,
          input.existingPlacements,
          selectedHoleFillingPlacements,
          compactionSolution,
          options,
        ),
      );
    }
  } else {
    solutions.push(
      createFinalSolution(
        input.markerId,
        1,
        input.markerLength,
        input.fabricWidth,
        input.existingPlacements,
        selectedHoleFillingPlacements,
        null,
        options,
      ),
    );
  }

  const rankedSolutions =
    solutions
      .filter(
        (solution) =>
          solution.combinedEngineeringScore +
            EPSILON >=
          options.minimumCombinedEngineeringScore,
      )
      .sort(compareFinalSolutions)
      .slice(
        0,
        options.maximumFinalSolutions,
      )
      .map(
        (solution, index) => ({
          ...solution,
          solutionNumber:
            index + 1,
          id: `${input.markerId ?? "marker"}-hole-filling-compaction-${index + 1}`,
        }),
      );

  const bestSolution =
    rankedSolutions[0] ??
    null;

  if (
    voidDetection.voids.length ===
    0
  ) {
    warnings.push(
      "No usable marker void was detected.",
    );
  }

  if (
    compatibility.candidates.length ===
    0
  ) {
    warnings.push(
      "No compatible Piece-to-Void candidate was found.",
    );
  }

  if (
    collisionValidation.plan
      .placements.length === 0
  ) {
    warnings.push(
      "No collision-safe Hole Filling placement was selected.",
    );
  }

  if (
    rankedSolutions.length ===
    0
  ) {
    warnings.push(
      "No final Hole Filling and Compaction solution met the configured Engineering Score.",
    );
  }

  const originalPatternArea =
    calculateTotalPatternArea(
      input.existingPlacements,
    );

  const originalMarkerArea =
    input.markerLength *
    input.fabricWidth;

  const originalUtilisation =
    originalMarkerArea <= EPSILON
      ? 0
      : (originalPatternArea /
          originalMarkerArea) *
        100;

  return {
    markerId: input.markerId,
    voidDetection,
    compatibility,
    collisionValidation,
    compaction,
    solutions:
      rankedSolutions,
    bestSolution,
    statistics: {
      existingPlacementCount:
        input.existingPlacements.length,

      candidatePieceCount:
        input.candidatePieces.length,

      detectedVoidCount:
        voidDetection.voids.length,

      compatibilityCandidateCount:
        compatibility.candidates.length,

      collisionSafePlacementCount:
        collisionValidation.placements.length,

      selectedHoleFillingPlacementCount:
        collisionValidation.plan.placements.length,

      compactionSolutionCount:
        compaction.solutions.length,

      finalSolutionCount:
        rankedSolutions.length,

      originalMarkerLength:
        input.markerLength,

      bestFinalMarkerLength:
        bestSolution
          ?.finalMarkerLength ??
        input.markerLength,

      bestMarkerLengthReduction:
        bestSolution
          ?.markerLengthReduction ??
        0,

      originalUtilisation,

      bestFinalUtilisation:
        bestSolution
          ?.finalUtilisation ??
        originalUtilisation,

      bestCombinedEngineeringScore:
        bestSolution
          ?.combinedEngineeringScore ??
        0,
    },
    warnings:
      Array.from(
        new Set(warnings),
      ),
    engineeringReady:
      Boolean(
        bestSolution
          ?.engineeringReady,
      ),
  };
}

/**
 * Returns the highest-ranked combined solution.
 */
export function getBestHoleFillingCompactionSolution(
  result: HoleFillingCompactionResult,
): HoleFillingCompactionSolution | null {
  return result.bestSolution;
}

/**
 * Returns only Engineering Ready combined solutions.
 */
export function getEngineeringReadyHoleFillingCompactionSolutions(
  result: HoleFillingCompactionResult,
): ReadonlyArray<HoleFillingCompactionSolution> {
  return result.solutions.filter(
    (solution) =>
      solution.engineeringReady,
  );
}

/**
 * Returns all final solutions containing a specific pattern piece.
 */
export function getHoleFillingCompactionSolutionsForPiece(
  result: HoleFillingCompactionResult,
  pieceId: string,
): ReadonlyArray<HoleFillingCompactionSolution> {
  return result.solutions.filter(
    (solution) =>
      solution.placements.some(
        (placement) =>
          placement.pieceId ===
          pieceId,
      ),
  );
}

/**
 * Returns final solutions meeting a minimum Engineering Score.
 */
export function filterHoleFillingCompactionSolutionsByScore(
  solutions:
    ReadonlyArray<HoleFillingCompactionSolution>,
  minimumEngineeringScore: number,
): ReadonlyArray<HoleFillingCompactionSolution> {
  const minimumScore = clamp(
    minimumEngineeringScore,
    0,
    100,
  );

  return solutions.filter(
    (solution) =>
      solution.combinedEngineeringScore +
        EPSILON >=
      minimumScore,
  );
}

/**
 * Returns final solutions achieving a minimum Marker Length reduction.
 */
export function filterHoleFillingCompactionSolutionsByLengthReduction(
  solutions:
    ReadonlyArray<HoleFillingCompactionSolution>,
  minimumLengthReduction: number,
): ReadonlyArray<HoleFillingCompactionSolution> {
  const minimumReduction =
    Math.max(
      0,
      minimumLengthReduction,
    );

  return solutions.filter(
    (solution) =>
      solution.markerLengthReduction +
        EPSILON >=
      minimumReduction,
  );
}

/**
 * Returns final solutions achieving a minimum Fabric Utilisation.
 */
export function filterHoleFillingCompactionSolutionsByUtilisation(
  solutions:
    ReadonlyArray<HoleFillingCompactionSolution>,
  minimumUtilisation: number,
): ReadonlyArray<HoleFillingCompactionSolution> {
  const minimumValue =
    Math.max(
      0,
      minimumUtilisation,
    );

  return solutions.filter(
    (solution) =>
      solution.finalUtilisation +
        EPSILON >=
      minimumValue,
  );
}

/**
 * Finds a detected void by ID from the full workflow result.
 */
export function findDetectedVoid(
  result: HoleFillingCompactionResult,
  voidId: string,
): DetectedMarkerVoid | null {
  return (
    result.voidDetection.voids.find(
      (voidRegion) =>
        voidRegion.id === voidId,
    ) ?? null
  );
}

/**
 * Finds a compatibility candidate by ID.
 */
export function findCompatibilityCandidate(
  result: HoleFillingCompactionResult,
  candidateId: string,
): PieceVoidPlacementCandidate | null {
  return (
    result.compatibility.candidates.find(
      (candidate) =>
        candidate.id === candidateId,
    ) ?? null
  );
}