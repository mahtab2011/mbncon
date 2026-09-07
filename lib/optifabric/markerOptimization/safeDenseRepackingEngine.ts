/**
 * OptiFabric AI
 * RC5-004-011B — Safe Dense Repacking Engine (rewrite)
 *
 * Purpose:
 * - Rebuild a complete marker from scratch.
 * - Safety ALWAYS outranks utilisation.
 * - Search several genuinely different deterministic placement strategies.
 * - Minimise Marker Length.
 * - Maximise safe Fabric Utilisation.
 *
 * Engineering coordinate system (Step 3C — canonicalised):
 *
 * X = Usable Fabric Width (bounded by fabricWidth)
 * Y = Marker Length (grows)
 *
 * This now matches the convention already authoritative in
 * markerNestingEngine.ts (createDeterministicNestedMarker — the baseline
 * engine, verified against its own candidateWidth/fabricWidth and
 * y+candidateHeight/maximumMarkerHeight checks) and in the live marker
 * page's own "canvas orientation" (canvas X = Fabric Width, canvas Y =
 * Marker Length — see app/optifabric/project/[projectId]/marker/page.tsx).
 *
 * Before Step 3C this file used the OPPOSITE convention (X = Length, Y =
 * Width) — its own internal "RC5-004 engineering orientation", which the
 * live page already knew about and explicitly adapted at the boundary
 * whenever feeding baseline placements into the hole-filling/void-detection
 * stack (which still uses the old X = Length orientation internally; see
 * markerOptimisationOrchestrator.ts's holeFillingCompactionOrchestrator
 * call sites for the matching adapter, added in the same change as this).
 * Fixing that here means this engine's own placements are now directly in
 * baseline/canvas orientation and no longer need adapting for comparison
 * against the baseline or for canvas rendering — only the hand-off into the
 * (unchanged) engineering-oriented hole-filling stack needs the adapter now.
 *
 * Ranking:
 *
 * Complete Marker
 * ↓ Collision-Free
 * ↓ Boundary Safe
 * ↓ Cutting Gap Safe
 * ↓ Shorter Marker Length
 * ↓ Higher Utilisation
 * ↓ Engineering Score
 *
 * WHAT CHANGED FROM RC5-004-011A, AND WHY
 *
 * 1. CONTOUR ANCHORS (was: bounding-box corners only)
 *    The previous engine generated candidate positions solely from the
 *    axis-aligned bounding boxes of placed pieces. For irregular garment
 *    outlines that means the concave space inside a piece's bounding box
 *    was structurally unreachable — no candidate was ever generated there,
 *    so it could never be tested, so it could never be filled. The engine
 *    packed at bounding-box density while utilisation was measured against
 *    true polygon area. That single fact set the ceiling.
 *    Anchors are now derived from the real polygon vertices of every placed
 *    piece, forward and reverse, on both axes.
 *
 * 2. CACHED ROTATED GEOMETRY (was: rotatePolygon() per candidate)
 *    Every candidate test used to re-run rotatePolygon() + getBounds() over
 *    the full vertex list. Rotation is now computed once per piece per
 *    rotation and reused, and candidate bounds are derived arithmetically.
 *    This is what makes a much larger search affordable.
 *
 * 3. SPATIAL INDEX + LAZY EXACT TEST
 *    Collision used to be O(placed) exact-polygon work per candidate. A
 *    uniform grid now returns only genuine neighbours, and the exact
 *    clearance test runs only when expanded bounding boxes actually
 *    interact. Most candidates resolve on arithmetic alone.
 *
 * 4. FIT-QUALITY OBJECTIVE (was: "leftmost wins")
 *    Selection used to minimise minX once marker length tied, which happily
 *    opens a tall void at high X rather than closing one. Scoring now
 *    combines marker-length growth, position, and contact with already-placed
 *    pieces and the fabric edges. Contact is what actually closes voids.
 *
 * 5. TWO-AXIS COMPACTION (was: single-pass, X only)
 *    Compaction now slides on both axes, coarse-to-fine, repeated until
 *    nothing moves. The old version could only recover sub-anchor slack
 *    along X because placement had already minimised X.
 *
 * 6. RUIN-AND-RECREATE IMPROVEMENT (was: absent)
 *    After construction the engine repeatedly ejects the pieces defining the
 *    marker end, re-places them into the now-holey marker and re-compacts,
 *    keeping the result only if the marker got shorter. Deterministic, seeded.
 *
 * 7. GENUINELY DISTINCT STRATEGIES
 *    compactHybrid previously summed raw area (cm², 10²–10³) against raw
 *    length and width (cm, 10¹), so area dominated and the strategy was an
 *    alias of areaDescending. Metrics are now normalised, and each strategy
 *    carries its own objective profile, so six strategies produce six layouts.
 *
 * 8. HONEST REPORTING
 *    minimumEngineeringUtilisation no longer nulls out the summary solutions.
 *    engineeringReady still respects it, but highestUtilisationSolution and
 *    shortestMarkerSolution now fall back to safe-but-below-threshold
 *    solutions instead of returning null and making the UI read "—".
 *
 * WHAT DELIBERATELY DID NOT CHANGE
 * - The utilisation formula. It is correct: true polygon area over
 *   markerLength × fabricWidth.
 * - The exact polygon clearance test. violatesPolygonClearance() remains the
 *   sole authority on whether two pieces may sit together.
 * - Every validation threshold and safety gate.
 * - Polygons are never approximated as rectangles.
 *
 * 90% remains an optimisation target and never a safety override. If the
 * geometry cannot reach it, this engine reports the truth.
 */

import {
  violatesPolygonClearance,
} from "@/lib/optifabric/marker/markerPolygonCollisionEngine";

/* ============================================================================
 * Step 3B diagnostics — read-only, opt-in, zero effect unless enabled.
 *
 * Gated behind MARKER_REPACK_DIAGNOSTICS=1 so it costs nothing in normal
 * operation (including in the live marker page) and changes no placement,
 * scoring or safety behaviour. Used only to investigate why strategies
 * converge to the same result and underperform the baseline nesting engine
 * (Step 3B root-cause diagnostic). Safe to leave in place permanently.
 * ========================================================================== */

const DIAGNOSTICS_ENABLED =
  typeof process !== "undefined" &&
  process.env?.MARKER_REPACK_DIAGNOSTICS === "1";

function logDiagnostic(event: string, data: Record<string, unknown>): void {
  if (!DIAGNOSTICS_ENABLED) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`[safeDenseRepacking:${event}]`, JSON.stringify(data));
}

/* ============================================================================
 * Public types — unchanged surface
 * ========================================================================== */

export interface SafeDensePoint {
  readonly x: number;
  readonly y: number;
}

export type SafeDenseRotation = 0 | 90 | 180 | 270;

export interface SafeDenseSourcePiece {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<SafeDensePoint>;
  readonly allowedRotations?: ReadonlyArray<SafeDenseRotation>;
  readonly rotationLocked?: boolean;
  readonly grainLineLocked?: boolean;
  readonly priority?: number;
  readonly category?: string;
  readonly locked?: boolean;
}

export interface SafeDenseRepackingInput {
  readonly markerId: string;
  readonly fabricWidth: number;
  readonly pieces: ReadonlyArray<SafeDenseSourcePiece>;

  /** Total real pattern area. Calculated from polygons if omitted. */
  readonly totalPatternArea?: number;

  /** Optional hard upper limit on Marker Length. */
  readonly maximumMarkerLength?: number;
}

export type SafeDensePackingStrategy =
  | "areaDescending"
  | "lengthDescending"
  | "widthDescending"
  | "priorityFirst"
  | "perimeterDescending"
  | "compactHybrid"
  /**
   * RC5-004-015 (Step 3) — orders pieces by a computed placement-difficulty
   * score (area + aspect-ratio extremity + rotation scarcity), not by raw
   * size or caller-supplied priority. Placing the hardest pieces first means
   * easier pieces are still available to fill whatever gaps remain.
   */
  | "difficultyDescending"
  /**
   * RC5-004-015 (Step 3) — classic Best-Fit-Decreasing: pieces are ordered
   * area-descending (the `default` branch below), and the objective profile
   * heavily rewards contact with neighbours/edges over raw length growth, so
   * placement selection favours the position that leaves the smallest
   * leftover gap rather than the position that merely minimises length.
   */
  | "bestFit";

export interface SafeDenseRepackingOptions {
  /** Required engineering clearance between pieces. */
  readonly cuttingGap?: number;

  /** Marker-edge clearance. */
  readonly boundaryClearance?: number;

  /** Placement-grid resolution, used by compaction and the grid fallback. */
  readonly searchStep?: number;

  /** Maximum candidate positions tested per piece. */
  readonly maximumCandidatesPerPiece?: number;

  /** Maximum complete solutions retained. */
  readonly maximumSolutions?: number;

  /** Target utilisation used for scoring and reporting only. */
  readonly targetUtilisationPercent?: number;

  /** Optional minimum utilisation for Engineering Ready. Safety is mandatory regardless. */
  readonly minimumEngineeringUtilisation?: number;

  readonly allowBoundaryContact?: boolean;

  /** Search beyond current Marker Length where required. */
  readonly allowMarkerLengthGrowth?: boolean;

  /** Maximum passes used by final compaction. */
  readonly compactionPasses?: number;

  /** Try alternate rotations when permitted. */
  readonly evaluateRotations?: boolean;

  /** Additional deterministic strategies. */
  readonly strategies?: ReadonlyArray<SafeDensePackingStrategy>;

  /* ---- New in RC5-004-011B. All optional, all safely defaulted. ---- */

  /** Anchor coordinate quantisation, in cm. Finer = denser search. */
  readonly anchorResolution?: number;

  /** Contour vertices sampled per placed piece when building anchors. */
  readonly contourSamplesPerPiece?: number;

  /** Cap on distinct X anchor values considered per piece. */
  readonly maximumAnchorsX?: number;

  /** Cap on distinct Y anchor values considered per piece. */
  readonly maximumAnchorsY?: number;

  /** Ruin-and-recreate improvement rounds per strategy. Zero disables it. */
  readonly improvementRounds?: number;

  /** Pieces ejected and re-placed per improvement round. */
  readonly improvementEjectCount?: number;

  /**
   * When true, a piece whose grain is locked may only take rotations that
   * preserve grain direction (0 and 180). Defaults to true.
   */
  readonly enforceGrainRotationLock?: boolean;
}

export interface SafeDensePlacement {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<SafeDensePoint>;
  readonly x: number;
  readonly y: number;
  readonly rotation: SafeDenseRotation;
  readonly width: number;
  readonly height: number;
  readonly area: number;
  readonly priority: number;
  readonly category?: string;
}

export interface SafeDenseCollisionPair {
  readonly firstId: string;
  readonly secondId: string;
}

export interface SafeDenseRejectedPiece {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly reason: string;
}

export interface SafeDenseRepackingSolution {
  readonly id: string;
  readonly markerId: string;
  readonly strategy: SafeDensePackingStrategy;
  readonly placements: ReadonlyArray<SafeDensePlacement>;
  readonly rejectedPieces: ReadonlyArray<SafeDenseRejectedPiece>;
  readonly expectedPieceCount: number;
  readonly placedPieceCount: number;
  readonly complete: boolean;
  readonly collisionFree: boolean;
  readonly boundarySafe: boolean;
  readonly cuttingGapSafe: boolean;
  readonly collisionCount: number;
  readonly markerLength: number;
  readonly fabricWidth: number;
  readonly totalPatternArea: number;
  readonly markerArea: number;
  readonly utilisationPercent: number;
  readonly wastePercent: number;
  readonly targetUtilisationPercent: number;
  readonly targetUtilisationAchieved: boolean;
  readonly engineeringScore: number;
  readonly engineeringReady: boolean;
  readonly candidateTests: number;
  readonly rejectedCandidateTests: number;
  readonly compactionMoves: number;

  /* Diagnostics — additive, nothing downstream is required to read these. */
  readonly improvementRounds: number;
  readonly improvementAcceptedRounds: number;
  readonly markerLengthBeforeImprovement: number;
  readonly gridFallbackUses: number;
}

export interface SafeDenseRepackingStatistics {
  readonly strategyCount: number;
  readonly generatedSolutionCount: number;
  readonly engineeringReadySolutionCount: number;
  readonly expectedPieceCount: number;
  readonly bestPlacedPieceCount: number;
  readonly candidateTests: number;
  readonly rejectedCandidateTests: number;
  readonly bestMarkerLength: number;
  readonly bestUtilisationPercent: number;
  readonly bestWastePercent: number;
  readonly targetUtilisationPercent: number;
  readonly targetAchieved: boolean;

  /**
   * Shortest marker length that could hold this pattern area at 100%
   * utilisation across the usable width. Utilisation can never exceed
   * theoreticalMinimumMarkerLength / markerLength.
   */
  readonly theoreticalMinimumMarkerLength: number;

  /**
   * X extent of the single longest piece in its best orientation. No marker
   * can ever be shorter than this, whatever the algorithm does.
   */
  readonly longestPieceExtent: number;

  /**
   * True when the target is geometrically unreachable for this piece set at
   * this fabric width, regardless of packing quality.
   */
  readonly targetGeometricallyFeasible: boolean;
}

export interface SafeDenseRepackingResult {
  readonly markerId: string;
  readonly solutions: ReadonlyArray<SafeDenseRepackingSolution>;
  readonly bestSolution: SafeDenseRepackingSolution | null;
  readonly highestUtilisationSolution: SafeDenseRepackingSolution | null;
  readonly shortestMarkerSolution: SafeDenseRepackingSolution | null;
  readonly targetSolutions: ReadonlyArray<SafeDenseRepackingSolution>;
  readonly statistics: SafeDenseRepackingStatistics;
  readonly engineeringReady: boolean;
  readonly summary: string;
}

/* ============================================================================
 * Internal types
 * ========================================================================== */

interface DenseBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
}

interface MutablePoint {
  x: number;
  y: number;
}

interface ObjectiveProfile {
  /** Penalty per cm the marker would have to grow. Dominant term. */
  readonly lengthGrowthWeight: number;
  /** Penalty per cm of X position. */
  readonly xWeight: number;
  /** Penalty per cm of Y position. */
  readonly yWeight: number;
  /** Reward per touching neighbour. */
  readonly contactWeight: number;
  /** Reward per touching fabric edge. */
  readonly boundaryContactWeight: number;
}

interface NormalisedDenseOptions {
  readonly cuttingGap: number;
  readonly boundaryClearance: number;
  readonly searchStep: number;
  readonly maximumCandidatesPerPiece: number;
  readonly maximumSolutions: number;
  readonly targetUtilisationPercent: number;
  readonly minimumEngineeringUtilisation: number;
  readonly allowBoundaryContact: boolean;
  readonly allowMarkerLengthGrowth: boolean;
  readonly compactionPasses: number;
  readonly evaluateRotations: boolean;
  readonly strategies: ReadonlyArray<SafeDensePackingStrategy>;
  readonly anchorResolution: number;
  readonly contourSamplesPerPiece: number;
  readonly maximumAnchorsX: number;
  readonly maximumAnchorsY: number;
  readonly improvementRounds: number;
  readonly improvementEjectCount: number;
  readonly enforceGrainRotationLock: boolean;
}

/** One rotation of one piece, computed once and reused everywhere. */
interface PreparedRotation {
  readonly rotation: SafeDenseRotation;
  /** Origin-normalised: minX = 0, minY = 0. */
  readonly polygon: ReadonlyArray<SafeDensePoint>;
  readonly width: number;
  readonly height: number;
}

interface PreparedPiece {
  readonly source: SafeDenseSourcePiece;
  readonly rotations: ReadonlyArray<PreparedRotation>;
  readonly area: number;
  /** Smallest X extent across permitted rotations. */
  readonly minimumExtentX: number;
  /** Smallest Y extent across permitted rotations. */
  readonly minimumExtentY: number;
  readonly boundingLength: number;
  readonly boundingWidth: number;
}

/** A placement plus everything we would otherwise recompute constantly. */
interface WorkingPlacement {
  readonly placement: SafeDensePlacement;
  readonly bounds: DenseBounds;
  /** Mutable point array, ready to hand to the collision engine. */
  readonly collisionPolygon: MutablePoint[];
  readonly preparedIndex: number;
  readonly rotationIndex: number;
}

interface Counters {
  candidateTests: number;
  rejectedCandidateTests: number;
  gridFallbackUses: number;
}

interface StrategyBuildResult {
  readonly strategy: SafeDensePackingStrategy;
  readonly placements: SafeDensePlacement[];
  readonly rejectedPieces: SafeDenseRejectedPiece[];
  readonly candidateTests: number;
  readonly rejectedCandidateTests: number;
  readonly compactionMoves: number;
  readonly improvementRounds: number;
  readonly improvementAcceptedRounds: number;
  readonly markerLengthBeforeImprovement: number;
  readonly gridFallbackUses: number;
}

/* ============================================================================
 * Defaults
 * ========================================================================== */

const DEFAULT_CUTTING_GAP = 0.5;
const DEFAULT_BOUNDARY_CLEARANCE = 0;
const DEFAULT_SEARCH_STEP = 0.5;
const DEFAULT_MAXIMUM_CANDIDATES_PER_PIECE = 25000;
const DEFAULT_MAXIMUM_SOLUTIONS = 10;
const DEFAULT_TARGET_UTILISATION = 90;
const DEFAULT_MINIMUM_ENGINEERING_UTILISATION = 0;
const DEFAULT_COMPACTION_PASSES = 6;
const DEFAULT_CONTOUR_SAMPLES_PER_PIECE = 18;
const DEFAULT_MAXIMUM_ANCHORS_X = 220;
const DEFAULT_MAXIMUM_ANCHORS_Y = 220;
const DEFAULT_IMPROVEMENT_ROUNDS = 14;
const DEFAULT_IMPROVEMENT_EJECT_COUNT = 4;

const EPSILON = 1e-8;

/** Contact tolerance: how close counts as "touching" for scoring purposes. */
const CONTACT_TOLERANCE = 0.75;

const DEFAULT_STRATEGIES: ReadonlyArray<SafeDensePackingStrategy> = [
  "areaDescending",
  "lengthDescending",
  "widthDescending",
  "priorityFirst",
  "perimeterDescending",
  "compactHybrid",
];

/**
 * Each strategy now carries its own objective, so the six solutions explore
 * genuinely different regions instead of collapsing onto one layout.
 */
const OBJECTIVE_PROFILES:
  Record<SafeDensePackingStrategy, ObjectiveProfile> = {
    areaDescending: {
      lengthGrowthWeight: 2000,
      xWeight: 1.0,
      yWeight: 0.25,
      contactWeight: 6,
      boundaryContactWeight: 4,
    },
    lengthDescending: {
      lengthGrowthWeight: 2500,
      xWeight: 1.0,
      yWeight: 1.0,
      contactWeight: 2,
      boundaryContactWeight: 2,
    },
    widthDescending: {
      lengthGrowthWeight: 2000,
      xWeight: 0.5,
      yWeight: 1.0,
      contactWeight: 8,
      boundaryContactWeight: 5,
    },
    priorityFirst: {
      lengthGrowthWeight: 4000,
      xWeight: 1.0,
      yWeight: 0.5,
      contactWeight: 4,
      boundaryContactWeight: 3,
    },
    perimeterDescending: {
      lengthGrowthWeight: 1500,
      xWeight: 0.8,
      yWeight: 0.4,
      contactWeight: 12,
      boundaryContactWeight: 6,
    },
    compactHybrid: {
      lengthGrowthWeight: 2500,
      xWeight: 0.6,
      yWeight: 0.6,
      contactWeight: 10,
      boundaryContactWeight: 6,
    },
    difficultyDescending: {
      lengthGrowthWeight: 2200,
      xWeight: 0.7,
      yWeight: 0.5,
      contactWeight: 9,
      boundaryContactWeight: 5,
    },
    /**
     * Best-fit: leftover-gap minimisation dominates. Contact/boundary-contact
     * are weighted far above the other strategies' so the search favours the
     * position that closes the most surrounding space, not merely the
     * shortest marker.
     */
    bestFit: {
      lengthGrowthWeight: 1200,
      xWeight: 0.4,
      yWeight: 0.4,
      contactWeight: 16,
      boundaryContactWeight: 10,
    },
  };

/* ============================================================================
 * General utilities
 * ========================================================================== */

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function finiteNumber(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) ? value : fallback;
}

function finiteNonNegative(
  value: number | undefined,
  fallback: number
): number {
  return Math.max(0, finiteNumber(value, fallback));
}

/** Deterministic RNG. Engineering output must be reproducible. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;

    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function normaliseOptions(
  options: SafeDenseRepackingOptions | undefined
): NormalisedDenseOptions {
  const suppliedStrategies = options?.strategies?.length
    ? Array.from(new Set(options.strategies))
    : DEFAULT_STRATEGIES;

  const searchStep = Math.max(
    0.1,
    finiteNonNegative(options?.searchStep, DEFAULT_SEARCH_STEP)
  );

  return {
    cuttingGap: finiteNonNegative(options?.cuttingGap, DEFAULT_CUTTING_GAP),

    boundaryClearance: finiteNonNegative(
      options?.boundaryClearance,
      DEFAULT_BOUNDARY_CLEARANCE
    ),

    searchStep,

    maximumCandidatesPerPiece: Math.max(
      500,
      Math.floor(
        finiteNonNegative(
          options?.maximumCandidatesPerPiece,
          DEFAULT_MAXIMUM_CANDIDATES_PER_PIECE
        )
      )
    ),

    maximumSolutions: Math.max(
      1,
      Math.floor(
        finiteNonNegative(options?.maximumSolutions, DEFAULT_MAXIMUM_SOLUTIONS)
      )
    ),

    targetUtilisationPercent: clamp(
      finiteNumber(options?.targetUtilisationPercent, DEFAULT_TARGET_UTILISATION),
      0,
      100
    ),

    minimumEngineeringUtilisation: clamp(
      finiteNumber(
        options?.minimumEngineeringUtilisation,
        DEFAULT_MINIMUM_ENGINEERING_UTILISATION
      ),
      0,
      100
    ),

    allowBoundaryContact: options?.allowBoundaryContact ?? true,

    allowMarkerLengthGrowth: options?.allowMarkerLengthGrowth ?? true,

    compactionPasses: Math.max(
      0,
      Math.floor(
        finiteNonNegative(options?.compactionPasses, DEFAULT_COMPACTION_PASSES)
      )
    ),

    evaluateRotations: options?.evaluateRotations ?? true,

    strategies: suppliedStrategies,

    anchorResolution: Math.max(
      0.05,
      finiteNonNegative(options?.anchorResolution, searchStep)
    ),

    contourSamplesPerPiece: Math.max(
      0,
      Math.floor(
        finiteNonNegative(
          options?.contourSamplesPerPiece,
          DEFAULT_CONTOUR_SAMPLES_PER_PIECE
        )
      )
    ),

    maximumAnchorsX: Math.max(
      8,
      Math.floor(
        finiteNonNegative(options?.maximumAnchorsX, DEFAULT_MAXIMUM_ANCHORS_X)
      )
    ),

    maximumAnchorsY: Math.max(
      8,
      Math.floor(
        finiteNonNegative(options?.maximumAnchorsY, DEFAULT_MAXIMUM_ANCHORS_Y)
      )
    ),

    improvementRounds: Math.max(
      0,
      Math.floor(
        finiteNonNegative(options?.improvementRounds, DEFAULT_IMPROVEMENT_ROUNDS)
      )
    ),

    improvementEjectCount: Math.max(
      1,
      Math.floor(
        finiteNonNegative(
          options?.improvementEjectCount,
          DEFAULT_IMPROVEMENT_EJECT_COUNT
        )
      )
    ),

    enforceGrainRotationLock: options?.enforceGrainRotationLock ?? true,
  };
}

/* ============================================================================
 * Polygon geometry
 * ========================================================================== */

function getBounds(
  polygon: ReadonlyArray<SafeDensePoint>
): DenseBounds | null {
  if (polygon.length < 3) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of polygon) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      return null;
    }

    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}

function polygonArea(polygon: ReadonlyArray<SafeDensePoint>): number {
  if (polygon.length < 3) {
    return 0;
  }

  let sum = 0;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];

    sum += current.x * next.y - next.x * current.y;
  }

  return Math.abs(sum) / 2;
}

function translatePolygon(
  polygon: ReadonlyArray<SafeDensePoint>,
  deltaX: number,
  deltaY: number
): SafeDensePoint[] {
  const result: SafeDensePoint[] = new Array(polygon.length);

  for (let index = 0; index < polygon.length; index += 1) {
    result[index] = {
      x: polygon[index].x + deltaX,
      y: polygon[index].y + deltaY,
    };
  }

  return result;
}

function normalisePolygonOrigin(
  polygon: ReadonlyArray<SafeDensePoint>
): SafeDensePoint[] {
  const bounds = getBounds(polygon);

  if (!bounds) {
    return [];
  }

  return translatePolygon(polygon, -bounds.minX, -bounds.minY);
}

function rotatePolygon(
  polygon: ReadonlyArray<SafeDensePoint>,
  rotation: SafeDenseRotation
): SafeDensePoint[] {
  const normalised = normalisePolygonOrigin(polygon);

  if (rotation === 0) {
    return normalised;
  }

  const rotated = normalised.map((point) => {
    switch (rotation) {
      case 90:
        return { x: -point.y, y: point.x };

      case 180:
        return { x: -point.x, y: -point.y };

      case 270:
        return { x: point.y, y: -point.x };

      default:
        return point;
    }
  });

  return normalisePolygonOrigin(rotated);
}

function toMutablePoints(
  polygon: ReadonlyArray<SafeDensePoint>
): MutablePoint[] {
  const result: MutablePoint[] = new Array(polygon.length);

  for (let index = 0; index < polygon.length; index += 1) {
    result[index] = { x: polygon[index].x, y: polygon[index].y };
  }

  return result;
}

/* ============================================================================
 * Collision — exact polygon clearance remains the sole authority
 * ========================================================================== */

function boundsInteract(
  first: DenseBounds,
  second: DenseBounds,
  clearance: number,
  allowContact: boolean
): boolean {
  const separatedX = allowContact
    ? first.maxX + clearance <= second.minX + EPSILON ||
      second.maxX + clearance <= first.minX + EPSILON
    : first.maxX + clearance < second.minX - EPSILON ||
      second.maxX + clearance < first.minX - EPSILON;

  const separatedY = allowContact
    ? first.maxY + clearance <= second.minY + EPSILON ||
      second.maxY + clearance <= first.minY + EPSILON
    : first.maxY + clearance < second.minY - EPSILON ||
      second.maxY + clearance < first.minY - EPSILON;

  return !(separatedX || separatedY);
}

/**
 * Broad phase rejects; exact polygon clearance decides. Unchanged in substance
 * from RC5-004-011A — this logic was correct and is deliberately preserved.
 */
function polygonsViolateClearance(
  firstPolygon: MutablePoint[],
  firstBounds: DenseBounds,
  secondPolygon: MutablePoint[],
  secondBounds: DenseBounds,
  clearance: number,
  allowContact: boolean
): boolean {
  if (!boundsInteract(firstBounds, secondBounds, clearance, allowContact)) {
    return false;
  }

  const requiredClearance = allowContact
    ? Math.max(0, clearance)
    : Math.max(0, clearance) + EPSILON;

  return violatesPolygonClearance(
    firstPolygon,
    secondPolygon,
    requiredClearance
  );
}

function detectCollisions(
  placements: ReadonlyArray<SafeDensePlacement>,
  clearance: number,
  allowContact: boolean
): SafeDenseCollisionPair[] {
  const collisions: SafeDenseCollisionPair[] = [];

  const prepared = placements.map((placement) => ({
    id: placement.id,
    polygon: toMutablePoints(placement.polygon),
    bounds: getBounds(placement.polygon),
  }));

  for (let first = 0; first < prepared.length; first += 1) {
    for (let second = first + 1; second < prepared.length; second += 1) {
      const a = prepared[first];
      const b = prepared[second];

      if (!a.bounds || !b.bounds) {
        collisions.push({ firstId: a.id, secondId: b.id });
        continue;
      }

      if (
        polygonsViolateClearance(
          a.polygon,
          a.bounds,
          b.polygon,
          b.bounds,
          clearance,
          allowContact
        )
      ) {
        collisions.push({ firstId: a.id, secondId: b.id });
      }
    }
  }

  return collisions;
}

/* ============================================================================
 * Spatial index
 *
 * Placed pieces are bucketed into a uniform grid so a candidate only tests
 * genuine neighbours. Without this the exact clearance test made a wide
 * search unaffordable, which is why the previous engine had to cap itself
 * at a few thousand candidates.
 * ========================================================================== */

class SpatialIndex {
  private readonly cellSize: number;

  private readonly cells: Map<string, number[]> = new Map();

  constructor(cellSize: number) {
    this.cellSize = Math.max(1, cellSize);
  }

  private key(cellX: number, cellY: number): string {
    return `${cellX}:${cellY}`;
  }

  insert(index: number, bounds: DenseBounds): void {
    const minCellX = Math.floor(bounds.minX / this.cellSize);
    const maxCellX = Math.floor(bounds.maxX / this.cellSize);
    const minCellY = Math.floor(bounds.minY / this.cellSize);
    const maxCellY = Math.floor(bounds.maxY / this.cellSize);

    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
        const key = this.key(cellX, cellY);

        const bucket = this.cells.get(key);

        if (bucket) {
          bucket.push(index);
        } else {
          this.cells.set(key, [index]);
        }
      }
    }
  }

  query(bounds: DenseBounds, margin: number): number[] {
    const minCellX = Math.floor((bounds.minX - margin) / this.cellSize);
    const maxCellX = Math.floor((bounds.maxX + margin) / this.cellSize);
    const minCellY = Math.floor((bounds.minY - margin) / this.cellSize);
    const maxCellY = Math.floor((bounds.maxY + margin) / this.cellSize);

    const seen = new Set<number>();
    const result: number[] = [];

    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
        const bucket = this.cells.get(this.key(cellX, cellY));

        if (!bucket) {
          continue;
        }

        for (const index of bucket) {
          if (!seen.has(index)) {
            seen.add(index);
            result.push(index);
          }
        }
      }
    }

    return result;
  }

  static build(
    placements: ReadonlyArray<WorkingPlacement>,
    cellSize: number
  ): SpatialIndex {
    const index = new SpatialIndex(cellSize);

    for (let position = 0; position < placements.length; position += 1) {
      index.insert(position, placements[position].bounds);
    }

    return index;
  }
}

/* ============================================================================
 * Piece preparation
 * ========================================================================== */

function resolveRotations(
  piece: SafeDenseSourcePiece,
  options: NormalisedDenseOptions
): SafeDenseRotation[] {
  const fallback: SafeDenseRotation = 0;

  let allowed: SafeDenseRotation[] =
    piece.allowedRotations && piece.allowedRotations.length > 0
      ? Array.from(new Set<SafeDenseRotation>(piece.allowedRotations))
      : [fallback];

  /**
   * Grain safety. A 90° or 270° turn rotates the grain line across the
   * fabric, which a grain-locked piece may not do. 0 and 180 preserve it.
   * The previous engine carried grainLineLocked on the type and never
   * enforced it.
   */
  if (options.enforceGrainRotationLock && piece.grainLineLocked) {
    const grainSafe = allowed.filter(
      (rotation) => rotation === 0 || rotation === 180
    );

    allowed = grainSafe.length > 0 ? grainSafe : [fallback];
  }

  if (piece.rotationLocked) {
    return [allowed[0] ?? fallback];
  }

  if (!options.evaluateRotations) {
    return [allowed[0] ?? fallback];
  }

  return allowed;
}

function preparePiece(
  piece: SafeDenseSourcePiece,
  options: NormalisedDenseOptions
): PreparedPiece | null {
  if (piece.polygon.length < 3) {
    return null;
  }

  const rotations: PreparedRotation[] = [];

  for (const rotation of resolveRotations(piece, options)) {
    const polygon = rotatePolygon(piece.polygon, rotation);
    const bounds = getBounds(polygon);

    if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
      continue;
    }

    rotations.push({
      rotation,
      polygon,
      width: bounds.width,
      height: bounds.height,
    });
  }

  if (rotations.length === 0) {
    return null;
  }

  const baseBounds = getBounds(normalisePolygonOrigin(piece.polygon));

  return {
    source: piece,
    rotations,
    area: polygonArea(piece.polygon),
    minimumExtentX: Math.min(...rotations.map((entry) => entry.width)),
    minimumExtentY: Math.min(...rotations.map((entry) => entry.height)),
    boundingLength: baseBounds?.width ?? 0,
    boundingWidth: baseBounds?.height ?? 0,
  };
}

function makeWorkingPlacement(
  prepared: PreparedPiece,
  preparedIndex: number,
  rotationIndex: number,
  x: number,
  y: number
): WorkingPlacement {
  const rotation = prepared.rotations[rotationIndex];

  const polygon = translatePolygon(rotation.polygon, x, y);

  const placement: SafeDensePlacement = {
    id: prepared.source.id,
    pieceId: prepared.source.pieceId,
    pieceName: prepared.source.pieceName,
    polygon,
    x,
    y,
    rotation: rotation.rotation,
    width: rotation.width,
    height: rotation.height,
    area: prepared.area,
    priority: prepared.source.priority ?? 50,
    category: prepared.source.category,
  };

  return {
    placement,
    bounds: {
      minX: x,
      minY: y,
      maxX: x + rotation.width,
      maxY: y + rotation.height,
      width: rotation.width,
      height: rotation.height,
    },
    collisionPolygon: toMutablePoints(polygon),
    preparedIndex,
    rotationIndex,
  };
}

/* ============================================================================
 * Strategy ordering
 * ========================================================================== */

function sortPreparedPieces(
  pieces: ReadonlyArray<PreparedPiece>,
  strategy: SafeDensePackingStrategy
): PreparedPiece[] {
  const copy = [...pieces];

  if (strategy === "compactHybrid") {
    /**
     * Metrics are normalised to 0..1 before weighting. Previously area (cm²,
     * 10²–10³) was summed against length and width (cm, 10¹), so area
     * dominated completely and compactHybrid was an alias of areaDescending.
     */
    const maxArea = Math.max(...copy.map((piece) => piece.area), 1);
    const maxLength = Math.max(...copy.map((piece) => piece.boundingLength), 1);
    const maxWidth = Math.max(...copy.map((piece) => piece.boundingWidth), 1);
    const maxPriority = Math.max(
      ...copy.map((piece) => piece.source.priority ?? 50),
      1
    );

    const score = (piece: PreparedPiece) =>
      (piece.area / maxArea) * 0.5 +
      (piece.boundingLength / maxLength) * 0.2 +
      (piece.boundingWidth / maxWidth) * 0.2 +
      ((piece.source.priority ?? 50) / maxPriority) * 0.1;

    copy.sort((first, second) => score(second) - score(first));

    return copy;
  }

  if (strategy === "difficultyDescending") {
    /**
     * "Difficulty" is a normalised blend of size, aspect-ratio extremity and
     * rotation scarcity — pieces that are large, awkwardly shaped and/or
     * have few legal rotations are hardest to place late, so they go first.
     * `piece.rotations` is already filtered to this piece's legal set
     * (resolveRotations, above), so it directly reflects how much freedom
     * the placer actually has for this piece.
     */
    const aspectRatio = (piece: PreparedPiece) =>
      Math.max(piece.boundingLength, piece.boundingWidth) /
      Math.max(Math.min(piece.boundingLength, piece.boundingWidth), EPSILON);

    const maxArea = Math.max(...copy.map((piece) => piece.area), 1);
    const maxAspectRatio = Math.max(...copy.map(aspectRatio), 1);
    const maxRotationCount = Math.max(
      ...copy.map((piece) => piece.rotations.length),
      1
    );

    const score = (piece: PreparedPiece) =>
      (piece.area / maxArea) * 0.45 +
      (aspectRatio(piece) / maxAspectRatio) * 0.3 +
      (1 - piece.rotations.length / maxRotationCount) * 0.25;

    copy.sort((first, second) => score(second) - score(first));

    return copy;
  }

  copy.sort((first, second) => {
    switch (strategy) {
      case "areaDescending":
        return second.area - first.area;

      /**
       * bestFit has no dedicated ordering of its own: Best-Fit-Decreasing is
       * area-descending order combined with a leftover-gap-minimising
       * placement objective (see OBJECTIVE_PROFILES.bestFit). It falls
       * through to the `default` branch below, which is area-descending.
       */

      case "lengthDescending":
        return (
          second.boundingLength - first.boundingLength ||
          second.area - first.area
        );

      case "widthDescending":
        return (
          second.boundingWidth - first.boundingWidth ||
          second.area - first.area
        );

      case "priorityFirst":
        return (
          (second.source.priority ?? 50) - (first.source.priority ?? 50) ||
          second.area - first.area
        );

      case "perimeterDescending":
        return (
          2 * (second.boundingLength + second.boundingWidth) -
            2 * (first.boundingLength + first.boundingWidth) ||
          second.area - first.area
        );

      default:
        return second.area - first.area;
    }
  });

  return copy;
}

/* ============================================================================
 * Safety
 * ========================================================================== */

function boundsInsideFabric(
  bounds: DenseBounds,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions
): boolean {
  /* X = usable fabric width (bounded), Y = marker length (grows from 0). */
  const minimum = options.boundaryClearance;
  const maximum = input.fabricWidth - options.boundaryClearance;

  if (options.allowBoundaryContact) {
    if (bounds.minX < minimum - EPSILON) return false;
    if (bounds.maxX > maximum + EPSILON) return false;
    if (bounds.minY < -EPSILON) return false;
  } else {
    if (bounds.minX <= minimum + EPSILON) return false;
    if (bounds.maxX >= maximum - EPSILON) return false;
    if (bounds.minY <= EPSILON) return false;
  }

  if (
    input.maximumMarkerLength !== undefined &&
    input.maximumMarkerLength > 0 &&
    bounds.maxY > input.maximumMarkerLength + EPSILON
  ) {
    return false;
  }

  return true;
}

function candidateIsSafe(
  candidate: WorkingPlacement,
  placements: ReadonlyArray<WorkingPlacement>,
  index: SpatialIndex,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  skipPosition: number
): boolean {
  if (!boundsInsideFabric(candidate.bounds, input, options)) {
    return false;
  }

  const neighbours = index.query(candidate.bounds, options.cuttingGap + 1);

  for (const position of neighbours) {
    if (position === skipPosition) {
      continue;
    }

    const existing = placements[position];

    if (
      polygonsViolateClearance(
        candidate.collisionPolygon,
        candidate.bounds,
        existing.collisionPolygon,
        existing.bounds,
        options.cuttingGap,
        options.allowBoundaryContact
      )
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Cheap contact estimate for scoring only. Never used for safety.
 * Counts neighbours and fabric edges the candidate is nearly touching —
 * a candidate that hugs three neighbours is closing a void, which is what
 * we actually want and what "leftmost wins" could not express.
 */
function countContacts(
  candidate: WorkingPlacement,
  placements: ReadonlyArray<WorkingPlacement>,
  index: SpatialIndex,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  skipPosition: number
): { pieces: number; boundaries: number } {
  const reach = options.cuttingGap + CONTACT_TOLERANCE;

  const neighbours = index.query(candidate.bounds, reach + 1);

  let pieces = 0;

  for (const position of neighbours) {
    if (position === skipPosition) {
      continue;
    }

    if (
      boundsInteract(
        candidate.bounds,
        placements[position].bounds,
        reach,
        true
      )
    ) {
      pieces += 1;
    }
  }

  /* X = usable fabric width (two real fabric edges), Y = marker length
   * (only the start, y=0, is a meaningful "edge" to hug — the far end is
   * wherever the marker currently ends, not a fixed boundary). */
  let boundaries = 0;

  if (candidate.bounds.minX <= options.boundaryClearance + CONTACT_TOLERANCE) {
    boundaries += 1;
  }

  if (
    candidate.bounds.maxX >=
    input.fabricWidth - options.boundaryClearance - CONTACT_TOLERANCE
  ) {
    boundaries += 1;
  }

  if (candidate.bounds.minY <= CONTACT_TOLERANCE) {
    boundaries += 1;
  }

  return { pieces, boundaries };
}

function scoreCandidate(
  candidate: WorkingPlacement,
  currentMarkerLength: number,
  contacts: { pieces: number; boundaries: number },
  profile: ObjectiveProfile
): number {
  /* Y is now the growing marker-length axis (Step 3C canonicalisation). */
  const growth = Math.max(0, candidate.bounds.maxY - currentMarkerLength);

  return (
    growth * profile.lengthGrowthWeight +
    candidate.bounds.minX * profile.xWeight +
    candidate.bounds.minY * profile.yWeight -
    contacts.pieces * profile.contactWeight -
    contacts.boundaries * profile.boundaryContactWeight
  );
}

/* ============================================================================
 * Anchor generation
 *
 * THE core fix. Anchors now come from real polygon vertices, not only from
 * bounding-box corners, so the concave space inside a piece's bounding box
 * becomes reachable.
 * ========================================================================== */

function sampleContour(
  polygon: ReadonlyArray<SafeDensePoint>,
  samples: number
): ReadonlyArray<SafeDensePoint> {
  if (samples <= 0) {
    return [];
  }

  if (polygon.length <= samples) {
    return polygon;
  }

  const stride = polygon.length / samples;
  const result: SafeDensePoint[] = [];

  for (let index = 0; index < samples; index += 1) {
    result.push(polygon[Math.floor(index * stride)]);
  }

  return result;
}

function thinSorted(values: number[], maximum: number): number[] {
  if (values.length <= maximum) {
    return values;
  }

  const stride = values.length / maximum;
  const result: number[] = [];

  for (let index = 0; index < maximum; index += 1) {
    result.push(values[Math.floor(index * stride)]);
  }

  const last = values[values.length - 1];

  if (result[result.length - 1] !== last) {
    result[result.length - 1] = last;
  }

  return result;
}

function collectAnchors(
  rotation: PreparedRotation,
  placements: ReadonlyArray<WorkingPlacement>,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions
): { xValues: number[]; yValues: number[] } {
  const step = options.anchorResolution;
  const gap = options.cuttingGap;

  /* X = usable fabric width (bounded, two real edges). */
  const lowestX = options.boundaryClearance;
  const highestX = input.fabricWidth - options.boundaryClearance;

  /* Y = marker length (grows from 0; only capped if the caller set one). */
  const hardMaximumY =
    input.maximumMarkerLength !== undefined && input.maximumMarkerLength > 0
      ? input.maximumMarkerLength
      : Number.POSITIVE_INFINITY;

  const xSet = new Set<number>();
  const ySet = new Set<number>();

  const quantise = (value: number) => Math.round(value / step) * step;

  const addX = (value: number) => {
    if (!Number.isFinite(value)) return;

    const x = quantise(Math.max(lowestX, value));

    if (x < lowestX - EPSILON) return;
    if (x + rotation.width > highestX + EPSILON) return;

    xSet.add(x);
  };

  const addY = (value: number) => {
    if (!Number.isFinite(value)) return;

    const y = quantise(Math.max(0, value));

    if (y + rotation.height > hardMaximumY + EPSILON) return;

    ySet.add(y);
  };

  addX(lowestX);
  addX(highestX - rotation.width);
  addY(0);

  for (const working of placements) {
    const bounds = working.bounds;

    /* Bounding-box anchors — forward, reverse and aligned. */
    addX(bounds.minX);
    addX(bounds.maxX + gap);
    addX(bounds.minX - rotation.width - gap);

    addY(bounds.minY);
    addY(bounds.maxY + gap);
    addY(bounds.minY - rotation.height - gap);

    /* Contour anchors — this is what reaches concave space. */
    for (const vertex of sampleContour(
      working.placement.polygon,
      options.contourSamplesPerPiece
    )) {
      addX(vertex.x);
      addX(vertex.x + gap);
      addX(vertex.x - rotation.width - gap);

      addY(vertex.y);
      addY(vertex.y + gap);
      addY(vertex.y - rotation.height - gap);
    }
  }

  const xValues = thinSorted(
    Array.from(xSet).sort((a, b) => a - b),
    options.maximumAnchorsX
  );

  const yValues = thinSorted(
    Array.from(ySet).sort((a, b) => a - b),
    options.maximumAnchorsY
  );

  return { xValues, yValues };
}

/* ============================================================================
 * Placement search
 * ========================================================================== */

function currentMarkerLength(
  placements: ReadonlyArray<WorkingPlacement>
): number {
  /* Y is the growing marker-length axis (Step 3C canonicalisation). */
  let maximum = 0;

  for (const working of placements) {
    if (working.bounds.maxY > maximum) {
      maximum = working.bounds.maxY;
    }
  }

  return maximum;
}

/**
 * Guaranteed-safe fallback: append the piece past the current marker end.
 *
 * RC5-004-011A generated this candidate but then sorted it to the very end
 * and sliced it away with maximumCandidatesPerPiece, so on a congested marker
 * the engine could lose its only certain option and drop into a grid scan
 * that then died on its own budget. It is now evaluated first and never
 * discarded.
 */
function findAppendPlacement(
  prepared: PreparedPiece,
  preparedIndex: number,
  placements: ReadonlyArray<WorkingPlacement>,
  index: SpatialIndex,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  counters: Counters
): WorkingPlacement | null {
  /* Y = marker length (grows); X = usable fabric width (fixed edge). */
  const startY =
    placements.length === 0
      ? 0
      : currentMarkerLength(placements) + options.cuttingGap;

  const lowestX = options.boundaryClearance;
  const highestX = input.fabricWidth - options.boundaryClearance;

  let best: WorkingPlacement | null = null;

  for (
    let rotationIndex = 0;
    rotationIndex < prepared.rotations.length;
    rotationIndex += 1
  ) {
    const rotation = prepared.rotations[rotationIndex];

    if (rotation.width > highestX - lowestX + EPSILON) {
      continue;
    }

    const candidate = makeWorkingPlacement(
      prepared,
      preparedIndex,
      rotationIndex,
      lowestX,
      startY
    );

    counters.candidateTests += 1;

    if (!candidateIsSafe(candidate, placements, index, input, options, -1)) {
      counters.rejectedCandidateTests += 1;
      continue;
    }

    if (best === null || candidate.bounds.maxY < best.bounds.maxY) {
      best = candidate;
    }
  }

  return best;
}

function findGridPlacement(
  prepared: PreparedPiece,
  preparedIndex: number,
  placements: ReadonlyArray<WorkingPlacement>,
  index: SpatialIndex,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  counters: Counters
): WorkingPlacement | null {
  /* X = usable fabric width (bounded); Y = marker length (grows). */
  const lowestX = options.boundaryClearance;
  const highestX = input.fabricWidth - options.boundaryClearance;

  const existingLength = currentMarkerLength(placements);

  const longestRotation = Math.max(
    ...prepared.rotations.map((rotation) => rotation.height),
    1
  );

  const searchLimit =
    input.maximumMarkerLength !== undefined && input.maximumMarkerLength > 0
      ? input.maximumMarkerLength
      : existingLength + longestRotation * 3 + 50;

  /**
   * Budget accounting fix. Previously the counter incremented in the inner
   * fabric-width loop, which runs hundreds of iterations per length step, so
   * the scan died after roughly six centimetres of marker and returned null
   * — rejecting pieces for no geometric reason. The budget is now spent per
   * length-axis row.
   */
  const rows = Math.max(
    1,
    Math.floor(options.maximumCandidatesPerPiece / 64)
  );

  let rowsTested = 0;

  for (let y = 0; y <= searchLimit + EPSILON; y += options.searchStep) {
    if (rowsTested >= rows) {
      break;
    }

    rowsTested += 1;

    for (
      let rotationIndex = 0;
      rotationIndex < prepared.rotations.length;
      rotationIndex += 1
    ) {
      const rotation = prepared.rotations[rotationIndex];

      if (rotation.width > highestX - lowestX + EPSILON) {
        continue;
      }

      for (
        let x = lowestX;
        x + rotation.width <= highestX + EPSILON;
        x += options.searchStep
      ) {
        const candidate = makeWorkingPlacement(
          prepared,
          preparedIndex,
          rotationIndex,
          x,
          y
        );

        counters.candidateTests += 1;

        if (candidateIsSafe(candidate, placements, index, input, options, -1)) {
          return candidate;
        }

        counters.rejectedCandidateTests += 1;
      }
    }
  }

  return null;
}

function findBestPlacement(
  prepared: PreparedPiece,
  preparedIndex: number,
  placements: ReadonlyArray<WorkingPlacement>,
  index: SpatialIndex,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  profile: ObjectiveProfile,
  counters: Counters
): WorkingPlacement | null {
  const markerLength = currentMarkerLength(placements);

  let best: WorkingPlacement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestSource: "append" | "anchor" | null = null;

  const consider = (candidate: WorkingPlacement, source: "append" | "anchor") => {
    const contacts = countContacts(
      candidate,
      placements,
      index,
      input,
      options,
      -1
    );

    const score = scoreCandidate(candidate, markerLength, contacts, profile);

    if (score < bestScore) {
      bestScore = score;
      best = candidate;
      bestSource = source;
    }

    return score;
  };

  /* 1 — the certain option, evaluated first and never discarded. */
  const appended = findAppendPlacement(
    prepared,
    preparedIndex,
    placements,
    index,
    input,
    options,
    counters
  );

  let appendScore: number | null = null;

  if (appended) {
    appendScore = consider(appended, "append");
  }

  /* 2 — anchored search within budget. */
  let budget = options.maximumCandidatesPerPiece;

  /* X = usable fabric width (bounded); Y = marker length (grows). */
  const lowestX = options.boundaryClearance;
  const highestX = input.fabricWidth - options.boundaryClearance;

  let anchorGridSize = 0;
  let anchorCandidatesConsidered = 0;
  let bestAnchorScore = Number.POSITIVE_INFINITY;

  for (
    let rotationIndex = 0;
    rotationIndex < prepared.rotations.length && budget > 0;
    rotationIndex += 1
  ) {
    const rotation = prepared.rotations[rotationIndex];

    if (rotation.width > highestX - lowestX + EPSILON) {
      continue;
    }

    const { xValues, yValues } = collectAnchors(
      rotation,
      placements,
      input,
      options
    );

    anchorGridSize += xValues.length * yValues.length;

    /* Anchors are swept Y (length) ascending as the OUTER loop, so
     * exhausting the budget loses only the far end of the marker — which
     * the append candidate already covers. Losing the near end, or losing
     * fabric-width coverage at a given length, would be the harmful
     * direction. */
    for (const y of yValues) {
      if (budget <= 0) break;

      for (const x of xValues) {
        if (budget <= 0) break;

        budget -= 1;
        counters.candidateTests += 1;

        const candidate = makeWorkingPlacement(
          prepared,
          preparedIndex,
          rotationIndex,
          x,
          y
        );

        if (!candidateIsSafe(candidate, placements, index, input, options, -1)) {
          counters.rejectedCandidateTests += 1;
          continue;
        }

        anchorCandidatesConsidered += 1;

        const score = consider(candidate, "anchor");

        if (score < bestAnchorScore) {
          bestAnchorScore = score;
        }
      }
    }
  }

  logDiagnostic("placement", {
    pieceId: prepared.source.id,
    markerLengthBefore: markerLength,
    appendScore,
    bestAnchorScore:
      bestAnchorScore === Number.POSITIVE_INFINITY ? null : bestAnchorScore,
    anchorGridSize,
    anchorCandidatesConsidered,
    winner: bestSource,
    winnerX: best ? (best as WorkingPlacement).bounds.minX : null,
    winnerY: best ? (best as WorkingPlacement).bounds.minY : null,
  });

  if (best) {
    return best;
  }

  if (!options.allowMarkerLengthGrowth) {
    return null;
  }

  counters.gridFallbackUses += 1;

  return findGridPlacement(
    prepared,
    preparedIndex,
    placements,
    index,
    input,
    options,
    counters
  );
}

/* ============================================================================
 * Two-axis compaction
 *
 * RC5-004-011A slid pieces along X only, in one pass, at fixed Y. Because
 * placement had already minimised X for that Y band, it could recover almost
 * nothing. Compaction now works both axes, coarse to fine, until settled.
 * ========================================================================== */

function slidePlacement(
  working: WorkingPlacement,
  position: number,
  placements: ReadonlyArray<WorkingPlacement>,
  index: SpatialIndex,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  prepared: ReadonlyArray<PreparedPiece>
): WorkingPlacement {
  const steps: number[] = [];

  for (
    let step = Math.max(options.searchStep, options.searchStep * 8);
    step >= options.searchStep - EPSILON;
    step /= 2
  ) {
    steps.push(step);
  }

  let best = working;
  let moved = true;
  let guard = 0;

  while (moved && guard < 64) {
    moved = false;
    guard += 1;

    /* Slide toward (boundaryClearance, 0): X = usable fabric width (lower
     * edge is boundaryClearance), Y = marker length (origin is 0). */
    for (const axis of [0, 1] as const) {
      for (const step of steps) {
        for (;;) {
          const nextX = axis === 0 ? best.bounds.minX - step : best.bounds.minX;
          const nextY = axis === 1 ? best.bounds.minY - step : best.bounds.minY;

          if (nextX < options.boundaryClearance - EPSILON) break;
          if (nextY < -EPSILON) break;

          const candidate = makeWorkingPlacement(
            prepared[best.preparedIndex],
            best.preparedIndex,
            best.rotationIndex,
            Math.max(options.boundaryClearance, nextX),
            Math.max(0, nextY)
          );

          if (
            !candidateIsSafe(
              candidate,
              placements,
              index,
              input,
              options,
              position
            )
          ) {
            break;
          }

          best = candidate;
          moved = true;
        }
      }
    }
  }

  return best;
}

function compactPlacements(
  placements: ReadonlyArray<WorkingPlacement>,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  prepared: ReadonlyArray<PreparedPiece>,
  cellSize: number
): { placements: WorkingPlacement[]; moves: number } {
  const working = [...placements];

  let moves = 0;

  for (let pass = 0; pass < options.compactionPasses; pass += 1) {
    let movedInPass = false;

    const order = working
      .map((entry, position) => ({ position, key: entry.bounds.minX + entry.bounds.minY }))
      .sort((first, second) => first.key - second.key);

    for (const entry of order) {
      const index = SpatialIndex.build(working, cellSize);

      const current = working[entry.position];

      const slid = slidePlacement(
        current,
        entry.position,
        working,
        index,
        input,
        options,
        prepared
      );

      if (
        slid.bounds.minX + EPSILON < current.bounds.minX ||
        slid.bounds.minY + EPSILON < current.bounds.minY
      ) {
        working[entry.position] = slid;
        moves += 1;
        movedInPass = true;
      }
    }

    if (!movedInPass) {
      break;
    }
  }

  return { placements: working, moves };
}

/* ============================================================================
 * Strategy execution — construct, compact, then ruin and recreate
 * ========================================================================== */

function placeAll(
  order: ReadonlyArray<PreparedPiece>,
  preparedIndexOf: Map<SafeDenseSourcePiece, number>,
  prepared: ReadonlyArray<PreparedPiece>,
  seed: ReadonlyArray<WorkingPlacement>,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions,
  profile: ObjectiveProfile,
  counters: Counters,
  cellSize: number
): { placements: WorkingPlacement[]; failed: PreparedPiece[] } {
  const placements: WorkingPlacement[] = [...seed];
  const failed: PreparedPiece[] = [];

  for (const piece of order) {
    const index = SpatialIndex.build(placements, cellSize);

    const placement = findBestPlacement(
      piece,
      preparedIndexOf.get(piece.source) ?? 0,
      placements,
      index,
      input,
      options,
      profile,
      counters
    );

    if (!placement) {
      failed.push(piece);
      continue;
    }

    placements.push(placement);
  }

  return { placements, failed };
}

function buildStrategy(
  input: SafeDenseRepackingInput,
  strategy: SafeDensePackingStrategy,
  prepared: ReadonlyArray<PreparedPiece>,
  invalidPieces: ReadonlyArray<SafeDenseRejectedPiece>,
  options: NormalisedDenseOptions
): StrategyBuildResult {
  const profile = OBJECTIVE_PROFILES[strategy];

  const counters: Counters = {
    candidateTests: 0,
    rejectedCandidateTests: 0,
    gridFallbackUses: 0,
  };

  const preparedIndexOf = new Map<SafeDenseSourcePiece, number>();

  prepared.forEach((piece, position) => {
    preparedIndexOf.set(piece.source, position);
  });

  /* minimumExtentY: Y is now the marker-length axis (Step 3C). */
  const averageExtent =
    prepared.reduce((total, piece) => total + piece.minimumExtentY, 0) /
    Math.max(1, prepared.length);

  const cellSize = Math.max(2, averageExtent);

  const order = sortPreparedPieces(prepared, strategy);

  /* ---- Construction ---- */

  const constructed = placeAll(
    order,
    preparedIndexOf,
    prepared,
    [],
    input,
    options,
    profile,
    counters,
    cellSize
  );

  let working = constructed.placements;

  const constructionLength = currentMarkerLength(constructed.placements);

  const rejectedPieces: SafeDenseRejectedPiece[] = [
    ...invalidPieces,
    ...constructed.failed.map((piece) => ({
      id: piece.source.id,
      pieceId: piece.source.pieceId,
      pieceName: piece.source.pieceName,
      reason:
        "No collision-safe placement was found within the permitted search envelope.",
    })),
  ];

  /* ---- Compaction ---- */

  const compacted = compactPlacements(
    working,
    input,
    options,
    prepared,
    cellSize
  );

  working = compacted.placements;

  let compactionMoves = compacted.moves;

  const markerLengthBeforeImprovement = currentMarkerLength(working);

  /* ---- Ruin and recreate ----
   *
   * Eject the pieces that define the marker end, re-place them into the
   * now-holey marker, re-compact, and keep the result only if the marker
   * actually got shorter. Deterministic: same input, same output, always.
   */

  const random = createRandom(seedFromString(`${input.markerId}:${strategy}`));

  let improvementAccepted = 0;

  const rounds = constructed.failed.length === 0 ? options.improvementRounds : 0;

  for (let round = 0; round < rounds; round += 1) {
    const ejectCount = Math.min(
      options.improvementEjectCount,
      Math.max(1, working.length - 1)
    );

    /* The marker "end" is now the Y (length) extreme (Step 3C). */
    const ranked = working
      .map((entry, position) => ({ position, reach: entry.bounds.maxY }))
      .sort((first, second) => second.reach - first.reach);

    const ejected = new Set<number>();

    /* Half the ejections target the marker end, half are seeded-random, so
     * the search escapes local minima instead of retrying the same move. */
    for (let taken = 0; taken < ejectCount; taken += 1) {
      if (taken % 2 === 0 && taken / 2 < ranked.length) {
        ejected.add(ranked[Math.floor(taken / 2)].position);
      } else {
        ejected.add(Math.floor(random() * working.length));
      }
    }

    const kept: WorkingPlacement[] = [];
    const removed: PreparedPiece[] = [];

    working.forEach((entry, position) => {
      if (ejected.has(position)) {
        removed.push(prepared[entry.preparedIndex]);
      } else {
        kept.push(entry);
      }
    });

    if (removed.length === 0) {
      continue;
    }

    /* Largest first when reinserting — small pieces slot into what is left. */
    const reinsertOrder = [...removed].sort(
      (first, second) => second.area - first.area
    );

    const retry = placeAll(
      reinsertOrder,
      preparedIndexOf,
      prepared,
      kept,
      input,
      options,
      profile,
      counters,
      cellSize
    );

    if (retry.failed.length > 0) {
      continue;
    }

    const retryCompacted = compactPlacements(
      retry.placements,
      input,
      options,
      prepared,
      cellSize
    );

    const candidateLength = currentMarkerLength(retryCompacted.placements);

    if (candidateLength + EPSILON < currentMarkerLength(working)) {
      working = retryCompacted.placements;
      compactionMoves += retryCompacted.moves;
      improvementAccepted += 1;
    }
  }

  logDiagnostic("strategy", {
    strategy,
    order: order.map((piece) => piece.source.id),
    constructionLength,
    compactionLengthBeforeImprovement: markerLengthBeforeImprovement,
    finalLength: currentMarkerLength(working),
    compactionMoves,
    improvementRounds: rounds,
    improvementAcceptedRounds: improvementAccepted,
    candidateTests: counters.candidateTests,
    rejectedCandidateTests: counters.rejectedCandidateTests,
    gridFallbackUses: counters.gridFallbackUses,
    failedCount: constructed.failed.length,
  });

  return {
    strategy,
    placements: working.map((entry) => entry.placement),
    rejectedPieces,
    candidateTests: counters.candidateTests,
    rejectedCandidateTests: counters.rejectedCandidateTests,
    compactionMoves,
    improvementRounds: rounds,
    improvementAcceptedRounds: improvementAccepted,
    markerLengthBeforeImprovement,
    gridFallbackUses: counters.gridFallbackUses,
  };
}

/* ============================================================================
 * Metrics
 * ========================================================================== */

function calculateTotalPatternArea(
  input: SafeDenseRepackingInput,
  prepared: ReadonlyArray<PreparedPiece>
): number {
  if (
    input.totalPatternArea !== undefined &&
    Number.isFinite(input.totalPatternArea) &&
    input.totalPatternArea > 0
  ) {
    return input.totalPatternArea;
  }

  return prepared.reduce((total, piece) => total + piece.area, 0);
}

/** Unchanged and deliberately so: true polygon area over true marker area. */
function calculateUtilisation(
  totalPatternArea: number,
  markerLength: number,
  fabricWidth: number
): number {
  const markerArea = markerLength * fabricWidth;

  if (markerArea <= EPSILON) {
    return 0;
  }

  return clamp((totalPatternArea / markerArea) * 100, 0, 100);
}

function calculateEngineeringScore(
  complete: boolean,
  collisionFree: boolean,
  boundarySafe: boolean,
  cuttingGapSafe: boolean,
  utilisationPercent: number,
  targetUtilisationPercent: number
): number {
  const utilisationScore =
    targetUtilisationPercent > 0
      ? clamp((utilisationPercent / targetUtilisationPercent) * 100, 0, 100)
      : utilisationPercent;

  return clamp(
    (complete ? 25 : 0) +
      (collisionFree ? 25 : 0) +
      (boundarySafe ? 20 : 0) +
      (cuttingGapSafe ? 15 : 0) +
      utilisationScore * 0.15,
    0,
    100
  );
}

function markerBoundarySafe(
  placements: ReadonlyArray<SafeDensePlacement>,
  input: SafeDenseRepackingInput,
  options: NormalisedDenseOptions
): boolean {
  for (const placement of placements) {
    const bounds = getBounds(placement.polygon);

    if (!bounds || !boundsInsideFabric(bounds, input, options)) {
      return false;
    }
  }

  return true;
}

/* ============================================================================
 * Solution construction
 * ========================================================================== */

function createSolution(
  input: SafeDenseRepackingInput,
  build: StrategyBuildResult,
  index: number,
  prepared: ReadonlyArray<PreparedPiece>,
  options: NormalisedDenseOptions
): SafeDenseRepackingSolution {
  const collisions = detectCollisions(
    build.placements,
    options.cuttingGap,
    options.allowBoundaryContact
  );

  const collisionFree = collisions.length === 0;

  const boundarySafe = markerBoundarySafe(build.placements, input, options);

  const cuttingGapSafe = collisionFree;

  const expectedPieceCount = input.pieces.length;
  const placedPieceCount = build.placements.length;

  const complete =
    placedPieceCount === expectedPieceCount &&
    build.rejectedPieces.length === 0;

  /* Y is the marker-length axis (Step 3C). */
  let markerLength = 0;

  for (const placement of build.placements) {
    const bounds = getBounds(placement.polygon);

    if (bounds && bounds.maxY > markerLength) {
      markerLength = bounds.maxY;
    }
  }

  const totalPatternArea = calculateTotalPatternArea(input, prepared);

  const markerArea = markerLength * input.fabricWidth;

  const utilisationPercent = calculateUtilisation(
    totalPatternArea,
    markerLength,
    input.fabricWidth
  );

  const wastePercent = Math.max(0, 100 - utilisationPercent);

  const targetUtilisationAchieved =
    utilisationPercent + EPSILON >= options.targetUtilisationPercent;

  const engineeringScore = calculateEngineeringScore(
    complete,
    collisionFree,
    boundarySafe,
    cuttingGapSafe,
    utilisationPercent,
    options.targetUtilisationPercent
  );

  const engineeringReady =
    complete &&
    collisionFree &&
    boundarySafe &&
    cuttingGapSafe &&
    utilisationPercent + EPSILON >= options.minimumEngineeringUtilisation;

  return {
    id: `${input.markerId}-dense-${index + 1}`,
    markerId: input.markerId,
    strategy: build.strategy,
    placements: build.placements,
    rejectedPieces: build.rejectedPieces,
    expectedPieceCount,
    placedPieceCount,
    complete,
    collisionFree,
    boundarySafe,
    cuttingGapSafe,
    collisionCount: collisions.length,
    markerLength,
    fabricWidth: input.fabricWidth,
    totalPatternArea,
    markerArea,
    utilisationPercent,
    wastePercent,
    targetUtilisationPercent: options.targetUtilisationPercent,
    targetUtilisationAchieved,
    engineeringScore,
    engineeringReady,
    candidateTests: build.candidateTests,
    rejectedCandidateTests: build.rejectedCandidateTests,
    compactionMoves: build.compactionMoves,
    improvementRounds: build.improvementRounds,
    improvementAcceptedRounds: build.improvementAcceptedRounds,
    markerLengthBeforeImprovement: build.markerLengthBeforeImprovement,
    gridFallbackUses: build.gridFallbackUses,
  };
}

/* ============================================================================
 * Ranking — safety first, unchanged in priority order
 * ========================================================================== */

function compareSolutions(
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

  if (
    Math.abs(first.utilisationPercent - second.utilisationPercent) > EPSILON
  ) {
    return second.utilisationPercent - first.utilisationPercent;
  }

  if (Math.abs(first.markerLength - second.markerLength) > EPSILON) {
    return first.markerLength - second.markerLength;
  }

  return second.engineeringScore - first.engineeringScore;
}

function emptyResult(
  input: SafeDenseRepackingInput,
  settings: NormalisedDenseOptions,
  summary: string
): SafeDenseRepackingResult {
  return {
    markerId: input.markerId,
    solutions: [],
    bestSolution: null,
    highestUtilisationSolution: null,
    shortestMarkerSolution: null,
    targetSolutions: [],
    statistics: {
      strategyCount: 0,
      generatedSolutionCount: 0,
      engineeringReadySolutionCount: 0,
      expectedPieceCount: input.pieces.length,
      bestPlacedPieceCount: 0,
      candidateTests: 0,
      rejectedCandidateTests: 0,
      bestMarkerLength: 0,
      bestUtilisationPercent: 0,
      bestWastePercent: 100,
      targetUtilisationPercent: settings.targetUtilisationPercent,
      targetAchieved: false,
      theoreticalMinimumMarkerLength: 0,
      longestPieceExtent: 0,
      targetGeometricallyFeasible: false,
    },
    engineeringReady: false,
    summary,
  };
}

/* ============================================================================
 * Public engine
 * ========================================================================== */

export function runSafeDenseRepacking(
  input: SafeDenseRepackingInput,
  options?: SafeDenseRepackingOptions
): SafeDenseRepackingResult {
  const settings = normaliseOptions(options);

  if (!Number.isFinite(input.fabricWidth) || input.fabricWidth <= 0) {
    return emptyResult(
      input,
      settings,
      "Safe Dense Repacking could not start because Fabric Width is invalid."
    );
  }

  if (input.pieces.length === 0) {
    return emptyResult(
      input,
      settings,
      "Safe Dense Repacking received no pattern pieces."
    );
  }

  /* ---- Prepare geometry once, reuse across all strategies ---- */

  const prepared: PreparedPiece[] = [];
  const invalidPieces: SafeDenseRejectedPiece[] = [];

  for (const piece of input.pieces) {
    const preparedPiece = preparePiece(piece, settings);

    if (!preparedPiece) {
      invalidPieces.push({
        id: piece.id,
        pieceId: piece.pieceId,
        pieceName: piece.pieceName,
        reason:
          "Pattern polygon contains fewer than three valid vertices, or produced zero-extent geometry.",
      });

      continue;
    }

    prepared.push(preparedPiece);
  }

  if (prepared.length === 0) {
    return emptyResult(
      input,
      settings,
      "Safe Dense Repacking received no usable pattern geometry."
    );
  }

  const totalPatternArea = calculateTotalPatternArea(input, prepared);

  const usableWidth = input.fabricWidth - settings.boundaryClearance * 2;

  const theoreticalMinimumMarkerLength =
    usableWidth > 0 ? totalPatternArea / usableWidth : 0;

  /* Y-extent: no marker can be shorter than the longest piece's minimum
   * extent along the length axis, which is now Y (Step 3C). */
  const longestPieceExtent = Math.max(
    ...prepared.map((piece) => piece.minimumExtentY),
    0
  );

  /**
   * Honest feasibility check. Utilisation can never exceed
   * theoreticalMinimum / actualLength, and actualLength can never fall below
   * the longest single piece. If the target demands a marker shorter than the
   * longest piece, no algorithm can reach it and the engine says so rather
   * than implying the search failed.
   */
  const lengthRequiredForTarget =
    settings.targetUtilisationPercent > 0 && usableWidth > 0
      ? totalPatternArea /
        (usableWidth * (settings.targetUtilisationPercent / 100))
      : Number.POSITIVE_INFINITY;

  const targetGeometricallyFeasible =
    lengthRequiredForTarget + EPSILON >= longestPieceExtent;

  /* ---- Run strategies ---- */

  const solutions = settings.strategies
    .map((strategy) =>
      buildStrategy(input, strategy, prepared, invalidPieces, settings)
    )
    .map((build, index) =>
      createSolution(input, build, index, prepared, settings)
    )
    .sort(compareSolutions)
    .slice(0, settings.maximumSolutions);

  const engineeringReadySolutions = solutions.filter(
    (solution) => solution.engineeringReady
  );

  const bestSolution = engineeringReadySolutions[0] ?? solutions[0] ?? null;

  /**
   * Reporting fix. These used to filter on engineeringReady, so a
   * minimumEngineeringUtilisation of 70 nulled both and the panel read "—"
   * even though six perfectly safe solutions existed. Safety-complete
   * solutions now qualify, with engineering-ready preferred.
   */
  const reportable = solutions.filter(
    (solution) =>
      solution.complete &&
      solution.collisionFree &&
      solution.boundarySafe &&
      solution.cuttingGapSafe
  );

  const reportingPool =
    engineeringReadySolutions.length > 0
      ? engineeringReadySolutions
      : reportable.length > 0
        ? reportable
        : solutions;

  const highestUtilisationSolution =
    [...reportingPool].sort(
      (first, second) =>
        second.utilisationPercent - first.utilisationPercent
    )[0] ?? null;

  const shortestMarkerSolution =
    [...reportingPool].sort(
      (first, second) => first.markerLength - second.markerLength
    )[0] ?? null;

  const targetSolutions = solutions.filter(
    (solution) =>
      solution.engineeringReady && solution.targetUtilisationAchieved
  );

  const candidateTests = solutions.reduce(
    (total, solution) => total + solution.candidateTests,
    0
  );

  const rejectedCandidateTests = solutions.reduce(
    (total, solution) => total + solution.rejectedCandidateTests,
    0
  );

  const bestPlacedPieceCount = solutions.reduce(
    (maximum, solution) => Math.max(maximum, solution.placedPieceCount),
    0
  );

  const targetAchieved = targetSolutions.length > 0;

  let summary: string;

  if (bestSolution?.engineeringReady) {
    if (bestSolution.targetUtilisationAchieved) {
      summary =
        `Safe Dense Repacking produced a complete collision-free marker at ` +
        `${bestSolution.utilisationPercent.toFixed(2)}% utilisation and achieved ` +
        `the ${settings.targetUtilisationPercent.toFixed(0)}%+ target.`;
    } else if (!targetGeometricallyFeasible) {
      summary =
        `Safe Dense Repacking produced a complete collision-free marker at ` +
        `${bestSolution.utilisationPercent.toFixed(2)}% utilisation. The ` +
        `${settings.targetUtilisationPercent.toFixed(0)}% target is not reachable ` +
        `for this piece set at this fabric width: it would require a marker ` +
        `${lengthRequiredForTarget.toFixed(1)} cm long, but the longest single ` +
        `piece already measures ${longestPieceExtent.toFixed(1)} cm. Increase the ` +
        `garments per marker to raise the achievable ceiling.`;
    } else {
      summary =
        `Safe Dense Repacking produced a complete collision-free marker at ` +
        `${bestSolution.utilisationPercent.toFixed(2)}% utilisation. Further safe ` +
        `optimisation may continue toward the ` +
        `${settings.targetUtilisationPercent.toFixed(0)}% target.`;
    }
  } else if (bestSolution) {
    summary =
      `Safe Dense Repacking generated ${solutions.length} candidate solution` +
      `${solutions.length === 1 ? "" : "s"}, but none currently satisfies every ` +
      `engineering release condition.`;
  } else {
    summary = "Safe Dense Repacking did not generate a valid marker solution.";
  }

  return {
    markerId: input.markerId,
    solutions,
    bestSolution,
    highestUtilisationSolution,
    shortestMarkerSolution,
    targetSolutions,
    statistics: {
      strategyCount: settings.strategies.length,
      generatedSolutionCount: solutions.length,
      engineeringReadySolutionCount: engineeringReadySolutions.length,
      expectedPieceCount: input.pieces.length,
      bestPlacedPieceCount,
      candidateTests,
      rejectedCandidateTests,
      bestMarkerLength: bestSolution?.markerLength ?? 0,
      bestUtilisationPercent: bestSolution?.utilisationPercent ?? 0,
      bestWastePercent: bestSolution?.wastePercent ?? 100,
      targetUtilisationPercent: settings.targetUtilisationPercent,
      targetAchieved,
      theoreticalMinimumMarkerLength,
      longestPieceExtent,
      targetGeometricallyFeasible,
    },
    engineeringReady: Boolean(bestSolution?.engineeringReady),
    summary,
  };
}

/* ============================================================================
 * Convenience helpers — unchanged
 * ========================================================================== */

export function getBestSafeDenseSolution(
  result: SafeDenseRepackingResult
): SafeDenseRepackingSolution | null {
  return result.bestSolution;
}

export function getSafeDenseTargetSolutions(
  result: SafeDenseRepackingResult
): ReadonlyArray<SafeDenseRepackingSolution> {
  return result.targetSolutions;
}

export function getSafeDenseEngineeringReadySolutions(
  result: SafeDenseRepackingResult
): ReadonlyArray<SafeDenseRepackingSolution> {
  return result.solutions.filter((solution) => solution.engineeringReady);
}

export function safeDenseTargetAchieved(
  result: SafeDenseRepackingResult
): boolean {
  return result.statistics.targetAchieved;
}