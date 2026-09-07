/**
 * OptiFabric AI
 * RC5-004-016 — Marker Optimisation Orchestrator (Step 3)
 *
 * Purpose:
 * - Compose the existing, already-validated marker pipeline into one
 *   multi-strategy, profile-driven optimiser:
 *
 *     baseline (createDeterministicNestedMarker)
 *       + N repacking strategies (runSafeDenseRepacking, one call each)
 *       + hole-filling & compaction refinement on the top-K strategies
 *       -> every resulting candidate re-audited and ranked through the
 *          unmodified Production Safety Gate (productionSafetyGateEngine.ts)
 *
 * This file contains NO new packing, geometry or safety-gate logic of its
 * own. It only:
 * 1. Resolves each piece's rotation policy once, via the canonical
 *    markerRotationPolicyEngine — the same "hard constraint" every existing
 *    nesting/repacking/hole-filling call site already uses.
 * 2. Calls the existing engines with profile-selected options.
 * 3. Independently re-derives utilisation, collision, boundary, cutting-gap
 *    and rotation/grain/nap compliance for every resulting candidate — never
 *    trusting an engine's self-reported numbers, matching the "never trust,
 *    always re-audit" convention already used throughout this codebase
 *    (see auditRotationCompliance() in the live project marker page, and
 *    safeDenseProductionValidationEngine.ts).
 * 4. Feeds every candidate through evaluateProductionSafetyGate /
 *    rankProductionSafetyGateSolutions unchanged. Nothing bypasses it.
 *
 * Computation-time control: the profile's numeric knobs bound cost by
 * candidate/pass/round counts (unchanged mechanism). As a coarse safety
 * valve, this orchestrator calls runSafeDenseRepacking once per strategy
 * (already supported via options.strategies) and checks elapsed wall-clock
 * time between calls, skipping any remaining strategies once the profile's
 * budget is exceeded. This requires no change to the strategy engine itself.
 */

import {
  createDeterministicNestedMarker,
  type NestingPattern,
  type NestingResult,
} from "@/lib/optifabric/marker/markerNestingEngine";

import {
  isRotationPermitted,
  resolveMarkerRotationPolicy,
  type MarkerGeometricRotationRule,
  type MarkerRotationAngle,
  type MarkerRotationPolicyResult,
} from "@/lib/optifabric/marker/markerRotationPolicyEngine";

import {
  polygonsOverlap,
  transformPolygonToMarker,
  violatesPolygonClearance,
  type PolygonPoint,
} from "@/lib/optifabric/marker/markerPolygonCollisionEngine";

import { computeCanonicalMarkerQualityScore } from "@/lib/optifabric/marker/markerScoringEngine";

import {
  runSafeDenseRepacking,
  type SafeDensePackingStrategy,
  type SafeDenseRepackingSolution,
  type SafeDenseSourcePiece,
} from "./safeDenseRepackingEngine";

import {
  runHoleFillingCompaction,
  type HoleFillingCandidatePiece,
  type HoleFillingCompactionSolution,
  type HoleFillingSourcePlacement,
} from "./holeFillingCompactionOrchestrator";

import {
  rankProductionSafetyGateSolutions,
  type ProductionSafetyGateInput,
  type ProductionSafetyGateRanking,
  type ProductionSafetyGateResult,
} from "./productionSafetyGateEngine";

import {
  resolveMarkerOptimisationProfile,
  type MarkerOptimisationProfile,
} from "./markerOptimisationProfileEngine";

/* ============================================================================
 * Public types
 * ========================================================================== */

export interface MarkerOptimisationSourcePiece {
  readonly id: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<PolygonPoint>;
  readonly geometricRotationRule?: MarkerGeometricRotationRule;
  readonly grainControlled?: boolean;
  readonly directionalFabric?: boolean;
  readonly napDirection?: boolean;
  readonly priority?: number;
  readonly category?: string;
}

export interface MarkerOptimisationInput {
  readonly markerId: string;
  readonly fabricWidth: number;
  /** One entry per garment instance — pre-expand quantity before calling. */
  readonly pieces: ReadonlyArray<MarkerOptimisationSourcePiece>;
  readonly cuttingGap?: number;
  readonly boundaryClearance?: number;
  readonly maximumMarkerLength?: number;
  readonly targetUtilisationPercent?: number;
}

export type MarkerOptimisationCandidateSource =
  | "baseline"
  | "repacking"
  | "holeFilled";

export interface MarkerOptimisationCandidateMetrics {
  readonly id: string;
  readonly label: string;
  readonly source: MarkerOptimisationCandidateSource;
  readonly strategy?: SafeDensePackingStrategy;
  readonly markerLengthCm: number;
  readonly fabricWidthCm: number;
  readonly expectedPieceCount: number;
  readonly placedPieceCount: number;
  readonly utilisationPercent: number;
  readonly wastePercent: number;
  readonly collisionCount: number;
  readonly collisionFree: boolean;
  readonly boundarySafe: boolean;
  readonly cuttingGapSafe: boolean;
  readonly rotationViolationCount: number;
  readonly grainViolationCount: number;
  readonly napViolationCount: number;
  readonly rotationSafe: boolean;
  readonly engineeringScore: number;
  readonly safetyGate: ProductionSafetyGateResult;
}

export interface MarkerOptimisationResult {
  readonly markerId: string;
  readonly profile: MarkerOptimisationProfile;
  readonly runtimeMs: number;
  readonly strategiesRun: ReadonlyArray<SafeDensePackingStrategy>;
  readonly strategiesSkippedByBudget: ReadonlyArray<SafeDensePackingStrategy>;
  readonly candidates: ReadonlyArray<MarkerOptimisationCandidateMetrics>;
  readonly ranking: ProductionSafetyGateRanking;
  readonly bestCandidate: MarkerOptimisationCandidateMetrics | null;
}

/* ============================================================================
 * Geometry helpers — generic primitives only, no business logic.
 * ========================================================================== */

const EPSILON = 1e-8;
const BOUNDARY_EPSILON = 1e-6;

function polygonArea(points: ReadonlyArray<PolygonPoint>): number {
  let sum = 0;

  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];

    sum += a.x * b.y - b.x * a.y;
  }

  return Math.abs(sum) / 2;
}

function polygonBounds(points: ReadonlyArray<PolygonPoint>) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function computeUtilisation(
  placedArea: number,
  markerLength: number,
  fabricWidth: number
): { utilisationPercent: number; wastePercent: number } {
  const markerArea = markerLength * fabricWidth;
  const utilisationPercent =
    markerArea > 0 ? Math.min(100, (placedArea / markerArea) * 100) : 0;

  return {
    utilisationPercent,
    wastePercent: Math.max(0, 100 - utilisationPercent),
  };
}

interface AbsolutePlacement {
  readonly id: string;
  readonly polygon: ReadonlyArray<PolygonPoint>;
}

function auditPairwiseSafety(
  placements: ReadonlyArray<AbsolutePlacement>,
  cuttingGap: number
): { collisionCount: number; cuttingGapSafe: boolean } {
  let collisionCount = 0;
  let cuttingGapSafe = true;

  for (let i = 0; i < placements.length; i += 1) {
    for (let j = i + 1; j < placements.length; j += 1) {
      const a = [...placements[i].polygon];
      const b = [...placements[j].polygon];

      if (polygonsOverlap(a, b)) {
        collisionCount += 1;
      }

      if (violatesPolygonClearance(a, b, cuttingGap)) {
        cuttingGapSafe = false;
      }
    }
  }

  return { collisionCount, cuttingGapSafe };
}

function boundarySafeCheck(
  placements: ReadonlyArray<AbsolutePlacement>,
  xLimit: number,
  yLimit: number,
  clearance: number
): boolean {
  for (const placement of placements) {
    const bounds = polygonBounds(placement.polygon);

    if (
      bounds.minX < -clearance - BOUNDARY_EPSILON ||
      bounds.minY < -clearance - BOUNDARY_EPSILON ||
      bounds.maxX > xLimit + clearance + BOUNDARY_EPSILON ||
      bounds.maxY > yLimit + clearance + BOUNDARY_EPSILON
    ) {
      return false;
    }
  }

  return true;
}

interface RotationAudit {
  readonly rotationSafe: boolean;
  readonly rotationViolationCount: number;
  readonly grainViolationCount: number;
  readonly napViolationCount: number;
}

/**
 * Independently re-checks every placement's rotation against the canonical
 * policy for its piece, and attributes any violation to a structural
 * rotation error, a grain violation, or a nap/directional-fabric violation —
 * matching the composition rule documented in markerRotationPolicyEngine.ts
 * (grain removes 90°/270°, nap/direction removes 180°).
 */
function auditRotations(
  placements: ReadonlyArray<{ pieceId: string; rotation: number }>,
  policyByPieceId: ReadonlyMap<string, MarkerRotationPolicyResult>
): RotationAudit {
  let rotationViolationCount = 0;
  let grainViolationCount = 0;
  let napViolationCount = 0;

  for (const placement of placements) {
    const policy = policyByPieceId.get(placement.pieceId);

    if (!policy) {
      continue;
    }

    if (isRotationPermitted(policy, placement.rotation)) {
      continue;
    }

    const angle = placement.rotation as MarkerRotationAngle;
    const geometricallyPossible = policy.geometricRotations.includes(angle);

    if (!geometricallyPossible) {
      rotationViolationCount += 1;
    } else if ((angle === 90 || angle === 270) && policy.grainRestricted) {
      grainViolationCount += 1;
    } else if (angle === 180 && policy.directionRestricted) {
      napViolationCount += 1;
    } else {
      rotationViolationCount += 1;
    }
  }

  return {
    rotationSafe:
      rotationViolationCount === 0 &&
      grainViolationCount === 0 &&
      napViolationCount === 0,
    rotationViolationCount,
    grainViolationCount,
    napViolationCount,
  };
}

/* ============================================================================
 * Candidate construction
 * ========================================================================== */

type CandidateDraft = Omit<MarkerOptimisationCandidateMetrics, "safetyGate">;

function buildBaselineCandidate(
  result: NestingResult,
  localPolygonById: ReadonlyMap<string, ReadonlyArray<PolygonPoint>>,
  policyByPieceId: ReadonlyMap<string, MarkerRotationPolicyResult>,
  fabricWidth: number,
  cuttingGap: number,
  boundaryClearance: number,
  expectedPieceCount: number,
  theoreticalMinimumMarkerLength: number
): CandidateDraft {
  const markerLength = result.markerHeight;

  const absolutePlacements: AbsolutePlacement[] = result.patterns.map(
    (pattern) => {
      const vertices = localPolygonById.get(pattern.id) ?? [];

      return {
        id: pattern.id,
        polygon: transformPolygonToMarker({
          id: pattern.id,
          vertices: [...vertices],
          x: pattern.x,
          y: pattern.y,
          width: pattern.width,
          height: pattern.height,
          rotation: pattern.rotation,
        }),
      };
    }
  );

  const placedArea = result.patterns.reduce(
    (sum, pattern) =>
      sum + polygonArea(localPolygonById.get(pattern.id) ?? []),
    0
  );

  const { utilisationPercent, wastePercent } = computeUtilisation(
    placedArea,
    markerLength,
    fabricWidth
  );

  const { collisionCount, cuttingGapSafe } = auditPairwiseSafety(
    absolutePlacements,
    cuttingGap
  );

  /**
   * markerNestingEngine.ts's own axis convention (verified against its
   * candidate-generation logic): X is bounded by fabricWidth, Y is the
   * growing marker-length axis. Since Step 3C, safeDenseRepackingEngine.ts
   * uses this SAME convention (see its header comment), so buildDenseCandidate
   * below now audits with the identical xLimit/yLimit assignment.
   */
  const boundarySafe = boundarySafeCheck(
    absolutePlacements,
    fabricWidth,
    markerLength,
    boundaryClearance
  );

  const rotationAudit = auditRotations(
    result.patterns.map((pattern) => ({
      pieceId: pattern.id,
      rotation: pattern.rotation,
    })),
    policyByPieceId
  );

  const { overallScore } = computeCanonicalMarkerQualityScore({
    utilisationPercent,
    markerLengthCm: markerLength,
    theoreticalMinimumMarkerLengthCm: theoreticalMinimumMarkerLength,
  });

  return {
    id: "baseline",
    label: "Baseline — createDeterministicNestedMarker (single-pass bottom-left-fill)",
    source: "baseline",
    markerLengthCm: markerLength,
    fabricWidthCm: fabricWidth,
    expectedPieceCount,
    placedPieceCount: result.patterns.length,
    utilisationPercent,
    wastePercent,
    collisionCount,
    collisionFree: collisionCount === 0,
    boundarySafe,
    cuttingGapSafe,
    rotationViolationCount: rotationAudit.rotationViolationCount,
    grainViolationCount: rotationAudit.grainViolationCount,
    napViolationCount: rotationAudit.napViolationCount,
    rotationSafe: rotationAudit.rotationSafe,
    engineeringScore: overallScore,
  };
}

function buildDenseCandidate(
  solution: SafeDenseRepackingSolution,
  policyByPieceId: ReadonlyMap<string, MarkerRotationPolicyResult>,
  boundaryClearance: number,
  cuttingGap: number,
  theoreticalMinimumMarkerLength: number
): CandidateDraft {
  const absolutePlacements: AbsolutePlacement[] = solution.placements.map(
    (placement) => ({ id: placement.id, polygon: placement.polygon })
  );

  const placedArea = solution.placements.reduce(
    (sum, placement) => sum + placement.area,
    0
  );

  const { utilisationPercent, wastePercent } = computeUtilisation(
    placedArea,
    solution.markerLength,
    solution.fabricWidth
  );

  const { collisionCount, cuttingGapSafe } = auditPairwiseSafety(
    absolutePlacements,
    cuttingGap
  );

  /**
   * Step 3C: safeDenseRepackingEngine.ts now uses the SAME axis convention
   * as the baseline engine (X = usable fabric width, Y = marker length) —
   * see that file's header comment for the full derivation. This audit call
   * therefore now matches buildBaselineCandidate's exactly.
   */
  const boundarySafe = boundarySafeCheck(
    absolutePlacements,
    solution.fabricWidth,
    solution.markerLength,
    boundaryClearance
  );

  const rotationAudit = auditRotations(
    solution.placements.map((placement) => ({
      pieceId: placement.pieceId,
      rotation: placement.rotation,
    })),
    policyByPieceId
  );

  const { overallScore } = computeCanonicalMarkerQualityScore({
    utilisationPercent,
    markerLengthCm: solution.markerLength,
    theoreticalMinimumMarkerLengthCm: theoreticalMinimumMarkerLength,
  });

  return {
    id: `repack-${solution.strategy}-${solution.id}`,
    label: `Repacking — ${solution.strategy}`,
    source: "repacking",
    strategy: solution.strategy,
    markerLengthCm: solution.markerLength,
    fabricWidthCm: solution.fabricWidth,
    expectedPieceCount: solution.expectedPieceCount,
    placedPieceCount: solution.placedPieceCount,
    utilisationPercent,
    wastePercent,
    collisionCount,
    collisionFree: collisionCount === 0,
    boundarySafe,
    cuttingGapSafe,
    rotationViolationCount: rotationAudit.rotationViolationCount,
    grainViolationCount: rotationAudit.grainViolationCount,
    napViolationCount: rotationAudit.napViolationCount,
    rotationSafe: rotationAudit.rotationSafe,
    engineeringScore: overallScore,
  };
}

function buildHoleFilledCandidate(
  solution: HoleFillingCompactionSolution,
  strategy: SafeDensePackingStrategy,
  policyByPieceId: ReadonlyMap<string, MarkerRotationPolicyResult>,
  fabricWidth: number,
  boundaryClearance: number,
  cuttingGap: number,
  expectedPieceCount: number,
  theoreticalMinimumMarkerLength: number
): CandidateDraft {
  const absolutePlacements: AbsolutePlacement[] = solution.placements.map(
    (placement) => ({ id: placement.id, polygon: placement.polygon })
  );

  const placedArea = solution.placements.reduce(
    (sum, placement) => sum + polygonArea(placement.polygon),
    0
  );

  const { utilisationPercent, wastePercent } = computeUtilisation(
    placedArea,
    solution.finalMarkerLength,
    fabricWidth
  );

  const { collisionCount, cuttingGapSafe } = auditPairwiseSafety(
    absolutePlacements,
    cuttingGap
  );

  const boundarySafe = boundarySafeCheck(
    absolutePlacements,
    solution.finalMarkerLength,
    fabricWidth,
    boundaryClearance
  );

  const rotationAudit = auditRotations(
    solution.placements.map((placement) => ({
      pieceId: placement.pieceId,
      rotation: placement.rotation,
    })),
    policyByPieceId
  );

  const { overallScore } = computeCanonicalMarkerQualityScore({
    utilisationPercent,
    markerLengthCm: solution.finalMarkerLength,
    theoreticalMinimumMarkerLengthCm: theoreticalMinimumMarkerLength,
  });

  return {
    id: `repack-${strategy}-${solution.id}-holeFilled`,
    label: `Repacking (${strategy}) + hole-filling & compaction`,
    source: "holeFilled",
    strategy,
    markerLengthCm: solution.finalMarkerLength,
    fabricWidthCm: fabricWidth,
    expectedPieceCount,
    placedPieceCount: solution.placements.length,
    utilisationPercent,
    wastePercent,
    collisionCount,
    collisionFree: collisionCount === 0,
    boundarySafe,
    cuttingGapSafe,
    rotationViolationCount: rotationAudit.rotationViolationCount,
    grainViolationCount: rotationAudit.grainViolationCount,
    napViolationCount: rotationAudit.napViolationCount,
    rotationSafe: rotationAudit.rotationSafe,
    engineeringScore: overallScore,
  };
}

/** Mirrors safeDenseRepackingEngine.ts's own compareSolutions ordering exactly. */
function compareDenseSolutions(
  first: SafeDenseRepackingSolution,
  second: SafeDenseRepackingSolution
): number {
  if (first.engineeringReady !== second.engineeringReady) {
    return second.engineeringReady ? 1 : -1;
  }

  if (first.complete !== second.complete) {
    return second.complete ? 1 : -1;
  }

  if (first.collisionFree !== second.collisionFree) {
    return second.collisionFree ? 1 : -1;
  }

  if (first.boundarySafe !== second.boundarySafe) {
    return second.boundarySafe ? 1 : -1;
  }

  if (first.cuttingGapSafe !== second.cuttingGapSafe) {
    return second.cuttingGapSafe ? 1 : -1;
  }

  if (first.targetUtilisationAchieved !== second.targetUtilisationAchieved) {
    return second.targetUtilisationAchieved ? 1 : -1;
  }

  if (Math.abs(first.utilisationPercent - second.utilisationPercent) > EPSILON) {
    return second.utilisationPercent - first.utilisationPercent;
  }

  if (Math.abs(first.markerLength - second.markerLength) > EPSILON) {
    return first.markerLength - second.markerLength;
  }

  return second.engineeringScore - first.engineeringScore;
}

/* ============================================================================
 * Orchestration
 * ========================================================================== */

interface OptimisationContext {
  readonly localPolygonById: ReadonlyMap<string, ReadonlyArray<PolygonPoint>>;
  readonly policyByPieceId: ReadonlyMap<string, MarkerRotationPolicyResult>;
  readonly theoreticalMinimumMarkerLength: number;
  readonly expectedPieceCount: number;
  readonly cuttingGap: number;
  readonly boundaryClearance: number;
  readonly targetUtilisationPercent: number;
  readonly nestingPatterns: ReadonlyArray<NestingPattern>;
  readonly safeDensePieces: ReadonlyArray<SafeDenseSourcePiece>;
}

function prepareOptimisationContext(
  input: MarkerOptimisationInput
): OptimisationContext {
  const cuttingGap = input.cuttingGap ?? 0.5;
  const boundaryClearance = input.boundaryClearance ?? 0;
  const targetUtilisationPercent = input.targetUtilisationPercent ?? 90;
  const expectedPieceCount = input.pieces.length;

  const localPolygonById = new Map<string, ReadonlyArray<PolygonPoint>>();
  const policyByPieceId = new Map<string, MarkerRotationPolicyResult>();
  let totalPieceArea = 0;

  for (const piece of input.pieces) {
    localPolygonById.set(piece.id, piece.polygon);

    totalPieceArea += polygonArea(piece.polygon);

    policyByPieceId.set(
      piece.id,
      resolveMarkerRotationPolicy({
        geometricRotationRule: piece.geometricRotationRule,
        grainControlled: piece.grainControlled,
        directionalFabric: piece.directionalFabric,
        napDirection: piece.napDirection,
      })
    );
  }

  const theoreticalMinimumMarkerLength =
    totalPieceArea / Math.max(input.fabricWidth, EPSILON);

  const nestingPatterns: NestingPattern[] = input.pieces.map((piece) => {
    const bounds = polygonBounds(piece.polygon);
    const policy = policyByPieceId.get(piece.id)!;

    return {
      id: piece.id,
      width: bounds.width,
      height: bounds.height,
      vertices: [...piece.polygon],
      allowedRotations: [...policy.permittedRotations],
    };
  });

  const safeDensePieces: SafeDenseSourcePiece[] = input.pieces.map((piece) => {
    const policy = policyByPieceId.get(piece.id)!;

    return {
      id: piece.id,
      pieceId: piece.id,
      pieceName: piece.pieceName,
      polygon: piece.polygon,
      allowedRotations: policy.permittedRotations,
      grainLineLocked: piece.grainControlled === true,
      priority: piece.priority,
      category: piece.category,
    };
  });

  return {
    localPolygonById,
    policyByPieceId,
    theoreticalMinimumMarkerLength,
    expectedPieceCount,
    cuttingGap,
    boundaryClearance,
    targetUtilisationPercent,
    nestingPatterns,
    safeDensePieces,
  };
}

function computeBaselineCandidate(
  input: MarkerOptimisationInput,
  context: OptimisationContext
): CandidateDraft {
  const baselineResult = createDeterministicNestedMarker(
    [...context.nestingPatterns],
    {
      fabricWidth: input.fabricWidth,
      horizontalGap: context.cuttingGap,
      verticalGap: context.cuttingGap,
      minimumClearance: context.cuttingGap,
      maximumMarkerHeight: input.maximumMarkerLength,
    }
  );

  return buildBaselineCandidate(
    baselineResult,
    context.localPolygonById,
    context.policyByPieceId,
    input.fabricWidth,
    context.cuttingGap,
    context.boundaryClearance,
    context.expectedPieceCount,
    context.theoreticalMinimumMarkerLength
  );
}

export interface MarkerOptimisationBaselineOnlyResult {
  readonly candidate: MarkerOptimisationCandidateMetrics;
  readonly runtimeMs: number;
}

/**
 * Runs ONLY the baseline (createDeterministicNestedMarker) engine, timed in
 * isolation — the "old engine" reference point for the Step 3 benchmark.
 * The candidate is still fully, independently safety-audited (collision,
 * boundary, cutting gap, rotation/grain/nap) exactly as it would be inside
 * runMarkerOptimisation, but no repacking strategy or hole-filling runs.
 */
export function runMarkerOptimisationBaselineOnly(
  input: MarkerOptimisationInput
): MarkerOptimisationBaselineOnlyResult {
  const startedAt = Date.now();
  const context = prepareOptimisationContext(input);
  const draft = computeBaselineCandidate(input, context);

  const gate = rankProductionSafetyGateSolutions([
    {
      id: draft.id,
      label: draft.label,
      markerLengthCm: draft.markerLengthCm,
      utilisationPercent: draft.utilisationPercent,
      wastePercent: draft.wastePercent,
      engineeringScore: draft.engineeringScore,
      collisionFree: draft.collisionFree,
      collisionCount: draft.collisionCount,
      boundarySafe: draft.boundarySafe,
      cuttingGapSafe: draft.cuttingGapSafe,
      grainLineSafe: draft.grainViolationCount === 0,
      grainLineViolationCount: draft.grainViolationCount,
      rotationSafe: draft.rotationSafe,
      rotationViolationCount: draft.rotationViolationCount,
      fabricDirectionSafe: draft.napViolationCount === 0,
      pieceComplete: draft.placedPieceCount === draft.expectedPieceCount,
      expectedPieceCount: draft.expectedPieceCount,
      placedPieceCount: draft.placedPieceCount,
      productionFeasible: true,
      source: draft.source,
    },
  ]).evaluated[0];

  return {
    candidate: { ...draft, safetyGate: gate },
    runtimeMs: Date.now() - startedAt,
  };
}

export function runMarkerOptimisation(
  input: MarkerOptimisationInput,
  profile: MarkerOptimisationProfile = "balanced"
): MarkerOptimisationResult {
  const startedAt = Date.now();
  const config = resolveMarkerOptimisationProfile(profile);
  const context = prepareOptimisationContext(input);

  const {
    localPolygonById,
    policyByPieceId,
    theoreticalMinimumMarkerLength,
    expectedPieceCount,
    cuttingGap,
    boundaryClearance,
    targetUtilisationPercent,
    safeDensePieces,
  } = context;

  const candidates: CandidateDraft[] = [];

  /* -------------------------------------------------------------------
   * 1. Baseline
   * ----------------------------------------------------------------- */

  candidates.push(computeBaselineCandidate(input, context));

  /* -------------------------------------------------------------------
   * 2. Multi-strategy repacking, one runSafeDenseRepacking call per
   *    strategy so a coarse wall-clock ceiling can be enforced between
   *    them without touching the engine's internals.
   * ----------------------------------------------------------------- */

  const strategiesRun: SafeDensePackingStrategy[] = [];
  const strategiesSkippedByBudget: SafeDensePackingStrategy[] = [];
  const denseSolutions: SafeDenseRepackingSolution[] = [];

  for (const strategy of config.strategies) {
    if (Date.now() - startedAt > config.wallClockBudgetMs) {
      strategiesSkippedByBudget.push(strategy);
      continue;
    }

    strategiesRun.push(strategy);

    const result = runSafeDenseRepacking(
      {
        markerId: input.markerId,
        fabricWidth: input.fabricWidth,
        pieces: safeDensePieces,
        maximumMarkerLength: input.maximumMarkerLength,
      },
      {
        cuttingGap,
        boundaryClearance,
        targetUtilisationPercent,
        strategies: [strategy],
        maximumCandidatesPerPiece: config.repacking.maximumCandidatesPerPiece,
        maximumSolutions: 1,
        compactionPasses: config.repacking.compactionPasses,
        improvementRounds: config.repacking.improvementRounds,
        improvementEjectCount: config.repacking.improvementEjectCount,
        anchorResolution: config.repacking.anchorResolution,
        contourSamplesPerPiece: config.repacking.contourSamplesPerPiece,
        evaluateRotations: true,
        enforceGrainRotationLock: true,
      }
    );

    denseSolutions.push(...result.solutions);
  }

  denseSolutions.sort(compareDenseSolutions);

  for (const solution of denseSolutions) {
    candidates.push(
      buildDenseCandidate(
        solution,
        policyByPieceId,
        boundaryClearance,
        cuttingGap,
        theoreticalMinimumMarkerLength
      )
    );
  }

  /* -------------------------------------------------------------------
   * 3. Hole-filling & compaction refinement on the top-K solutions.
   *    Non-destructive: holeFillingCompactionOrchestrator only proposes.
   * ----------------------------------------------------------------- */

  const topSolutions = denseSolutions.slice(0, config.holeFillTopSolutions);

  for (const solution of topSolutions) {
    /**
     * Axis adapter (Step 3C): solution.placements are now in the same
     * "canvas/baseline" orientation as the rest of this orchestrator
     * (X = usable fabric width, Y = marker length). The hole-filling stack
     * (markerVoidDetectionEngine and friends) still uses the older "RC5-004
     * engineering" orientation (X = marker length, Y = fabric width) —
     * exactly the same duality the live marker page documents and adapts
     * for at its own hole-filling call site. A plain X/Y swap of every
     * point is a reflection (an isometry), so it changes no distance,
     * overlap or clearance calculation inside the hole-filling stack — it
     * only relabels which axis is which, correctly, for that stack's own
     * convention.
     */
    const toEngineeringOrientation = (point: PolygonPoint): PolygonPoint => ({
      x: point.y,
      y: point.x,
    });

    const existingPlacements: HoleFillingSourcePlacement[] =
      solution.placements.map((placement) => ({
        id: placement.id,
        pieceId: placement.pieceId,
        pieceName: placement.pieceName,
        polygon: placement.polygon.map(toEngineeringOrientation),
        x: placement.y,
        y: placement.x,
        rotation: placement.rotation,
        grainLineLocked:
          policyByPieceId.get(placement.pieceId)?.grainRestricted ?? false,
        priority: placement.priority,
        category: placement.category,
      }));

    const candidatePieces: HoleFillingCandidatePiece[] = solution.rejectedPieces
      .map((rejected): HoleFillingCandidatePiece | null => {
        const polygon = localPolygonById.get(rejected.pieceId);

        if (!polygon) {
          return null;
        }

        const policy = policyByPieceId.get(rejected.pieceId);

        return {
          id: rejected.pieceId,
          name: rejected.pieceName,
          polygon,
          allowedRotations: policy?.permittedRotations,
          grainLineLocked: policy?.grainRestricted ?? false,
        };
      })
      .filter((piece): piece is HoleFillingCandidatePiece => piece !== null);

    const holeFillResult = runHoleFillingCompaction({
      markerId: input.markerId,
      markerLength: solution.markerLength,
      fabricWidth: input.fabricWidth,
      existingPlacements,
      candidatePieces,
    });

    if (holeFillResult.bestSolution) {
      candidates.push(
        buildHoleFilledCandidate(
          holeFillResult.bestSolution,
          solution.strategy,
          policyByPieceId,
          input.fabricWidth,
          boundaryClearance,
          cuttingGap,
          expectedPieceCount,
          theoreticalMinimumMarkerLength
        )
      );
    }
  }

  /* -------------------------------------------------------------------
   * 4. Production Safety Gate — unmodified. Every candidate goes through
   *    the same 8 gates, safety-first ranking, as Step 2 requires.
   * ----------------------------------------------------------------- */

  const gateInputs: ProductionSafetyGateInput[] = candidates.map(
    (candidate) => ({
      id: candidate.id,
      label: candidate.label,
      markerLengthCm: candidate.markerLengthCm,
      utilisationPercent: candidate.utilisationPercent,
      wastePercent: candidate.wastePercent,
      engineeringScore: candidate.engineeringScore,
      collisionFree: candidate.collisionFree,
      collisionCount: candidate.collisionCount,
      boundarySafe: candidate.boundarySafe,
      cuttingGapSafe: candidate.cuttingGapSafe,
      grainLineSafe: candidate.grainViolationCount === 0,
      grainLineViolationCount: candidate.grainViolationCount,
      rotationSafe: candidate.rotationSafe,
      rotationViolationCount: candidate.rotationViolationCount,
      fabricDirectionSafe: candidate.napViolationCount === 0,
      pieceComplete: candidate.placedPieceCount === candidate.expectedPieceCount,
      expectedPieceCount: candidate.expectedPieceCount,
      placedPieceCount: candidate.placedPieceCount,
      productionFeasible: true,
      source: candidate.source,
    })
  );

  const ranking = rankProductionSafetyGateSolutions(gateInputs, {
    targetUtilisationPercent,
  });

  const gateById = new Map<string, ProductionSafetyGateResult>(
    ranking.evaluated.map((result) => [result.id, result])
  );

  const candidatesWithGate: MarkerOptimisationCandidateMetrics[] = candidates
    .map((candidate) => {
      const gate = gateById.get(candidate.id);
      return gate ? { ...candidate, safetyGate: gate } : null;
    })
    .filter(
      (candidate): candidate is MarkerOptimisationCandidateMetrics =>
        candidate !== null
    );

  const bestCandidate =
    candidatesWithGate.find(
      (candidate) => candidate.id === ranking.bestProductionSolution?.id
    ) ?? null;

  return {
    markerId: input.markerId,
    profile,
    runtimeMs: Date.now() - startedAt,
    strategiesRun,
    strategiesSkippedByBudget,
    candidates: candidatesWithGate,
    ranking,
    bestCandidate,
  };
}
