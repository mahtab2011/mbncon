/**
 * OptiFabric AI
 * RC5-004-004 — Intelligent Marker Compaction Engine
 *
 * Purpose:
 * - Compact an existing marker layout without changing piece geometry.
 * - Test safe leftward and vertical movement for every pattern piece.
 * - Preserve rotation, mirroring, Grain Line and locked-placement rules.
 * - Prevent collisions and marker-boundary violations.
 * - Estimate Marker Length reduction and Fabric Utilisation improvement.
 *
 * Engineering note:
 * This engine is non-destructive. It returns proposed compacted layouts.
 * The live marker must only be changed after the selected solution is approved.
 */

import type {
  MarkerVoidPoint,
} from "./markerVoidDetectionEngine";

export interface CompactionPlacement {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;

  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly mirrored?: boolean;

  /**
   * Locked placements remain fixed during compaction.
   */
  readonly locked?: boolean;

  /**
   * Optional Grain Line information for validation and reporting.
   */
  readonly grainLineLocked?: boolean;
  readonly grainLineAngle?: number;
  readonly maximumGrainDeviation?: number;

  /**
   * Optional engineering priority.
   *
   * Higher-priority pieces may be compacted earlier.
   */
  readonly priority?: number;
}

export interface IntelligentMarkerCompactionInput {
  readonly markerId?: string;
  readonly markerLength: number;
  readonly fabricWidth: number;
  readonly placements: ReadonlyArray<CompactionPlacement>;
  readonly options?: IntelligentMarkerCompactionOptions;
}

export interface IntelligentMarkerCompactionOptions {
  /**
   * Minimum distance required between pattern pieces.
   */
  readonly collisionClearance?: number;

  /**
   * Minimum clearance from marker boundaries.
   */
  readonly markerBoundaryClearance?: number;

  /**
   * Horizontal movement increment.
   */
  readonly horizontalStep?: number;

  /**
   * Vertical movement increment.
   */
  readonly verticalStep?: number;

  /**
   * Maximum leftward distance tested for one placement.
   */
  readonly maximumHorizontalMovement?: number;

  /**
   * Maximum upward or downward movement tested for one placement.
   */
  readonly maximumVerticalMovement?: number;

  /**
   * Maximum number of full compaction passes.
   */
  readonly maximumPasses?: number;

  /**
   * Maximum number of candidate positions tested per piece.
   */
  readonly maximumCandidatesPerPiece?: number;

  /**
   * Minimum Marker Length reduction required for an improved solution.
   */
  readonly minimumLengthImprovement?: number;

  /**
   * Permit touching piece boundaries when clearance is zero.
   */
  readonly allowPieceBoundaryContact?: boolean;

  /**
   * Permit touching marker boundaries when clearance is zero.
   */
  readonly allowMarkerBoundaryContact?: boolean;

  /**
   * Test vertical adjustment before leftward movement.
   */
  readonly verticalSearchBeforeHorizontal?: boolean;

  /**
   * Attempt to compact higher-priority pieces first.
   */
  readonly priorityFirst?: boolean;

  /**
   * Keep the original placement order.
   */
  readonly preservePlacementOrder?: boolean;

  /**
   * Return intermediate pass solutions.
   */
  readonly returnIntermediateSolutions?: boolean;

  /**
   * Maximum number of solutions returned.
   */
  readonly maximumSolutions?: number;

  /**
   * Minimum final Engineering Score.
   */
  readonly minimumEngineeringScore?: number;
}

export interface CompactionMovement {
  readonly placementId: string;
  readonly pieceId: string;
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
  readonly deltaX: number;
  readonly deltaY: number;
  readonly distanceMoved: number;
  readonly markerLengthBefore: number;
  readonly markerLengthAfter: number;
  readonly markerLengthReduction: number;
}

export interface CompactedMarkerPlacement {
  readonly id: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly mirrored: boolean;
  readonly locked: boolean;
  readonly priority: number;
}

export interface CompactionPassResult {
  readonly passNumber: number;
  readonly placements: ReadonlyArray<CompactedMarkerPlacement>;
  readonly movements: ReadonlyArray<CompactionMovement>;
  readonly markerLengthBefore: number;
  readonly markerLengthAfter: number;
  readonly markerLengthReduction: number;
  readonly movementCount: number;
  readonly improved: boolean;
}

export interface MarkerCompactionSolution {
  readonly id: string;
  readonly markerId?: string;
  readonly solutionNumber: number;
  readonly placements: ReadonlyArray<CompactedMarkerPlacement>;
  readonly movements: ReadonlyArray<CompactionMovement>;
  readonly passCount: number;
  readonly originalMarkerLength: number;
  readonly compactedMarkerLength: number;
  readonly markerLengthReduction: number;
  readonly markerLengthReductionPercentage: number;
  readonly originalMarkerArea: number;
  readonly compactedMarkerArea: number;
  readonly totalPatternArea: number;
  readonly originalUtilisation: number;
  readonly compactedUtilisation: number;
  readonly utilisationImprovement: number;
  readonly totalMovementDistance: number;
  readonly movedPlacementCount: number;
  readonly collisionFree: boolean;
  readonly boundarySafe: boolean;
  readonly engineeringScore: number;
  readonly engineeringReady: boolean;
}

export type CompactionRejectionReason =
  | "invalidMarkerDimensions"
  | "invalidPlacementPolygon"
  | "outsideMarkerBoundary"
  | "collisionDetected"
  | "clearanceViolation"
  | "noImprovement"
  | "engineeringScoreTooLow";

export interface RejectedCompactionCandidate {
  readonly placementId?: string;
  readonly pieceId?: string;
  readonly reason: CompactionRejectionReason;
  readonly message: string;
}

export interface IntelligentMarkerCompactionStatistics {
  readonly testedPlacements: number;
  readonly lockedPlacements: number;
  readonly testedCandidatePositions: number;
  readonly acceptedMovements: number;
  readonly rejectedCandidatePositions: number;
  readonly completedPasses: number;
  readonly generatedSolutions: number;
  readonly originalMarkerLength: number;
  readonly bestCompactedMarkerLength: number;
  readonly bestLengthReduction: number;
  readonly bestLengthReductionPercentage: number;
  readonly originalUtilisation: number;
  readonly bestUtilisation: number;
  readonly bestEngineeringScore: number;
}

export interface IntelligentMarkerCompactionResult {
  readonly markerId?: string;
  readonly originalPlacements: ReadonlyArray<CompactedMarkerPlacement>;
  readonly solutions: ReadonlyArray<MarkerCompactionSolution>;
  readonly bestSolution: MarkerCompactionSolution | null;
  readonly passes: ReadonlyArray<CompactionPassResult>;
  readonly rejected: ReadonlyArray<RejectedCompactionCandidate>;
  readonly statistics: IntelligentMarkerCompactionStatistics;
  readonly warnings: ReadonlyArray<string>;
  readonly engineeringReady: boolean;
}

interface NormalisedCompactionOptions {
  readonly collisionClearance: number;
  readonly markerBoundaryClearance: number;
  readonly horizontalStep: number;
  readonly verticalStep: number;
  readonly maximumHorizontalMovement: number;
  readonly maximumVerticalMovement: number;
  readonly maximumPasses: number;
  readonly maximumCandidatesPerPiece: number;
  readonly minimumLengthImprovement: number;
  readonly allowPieceBoundaryContact: boolean;
  readonly allowMarkerBoundaryContact: boolean;
  readonly verticalSearchBeforeHorizontal: boolean;
  readonly priorityFirst: boolean;
  readonly preservePlacementOrder: boolean;
  readonly returnIntermediateSolutions: boolean;
  readonly maximumSolutions: number;
  readonly minimumEngineeringScore: number;
}

interface MutableCompactionPlacement {
  id: string;
  pieceId: string;
  pieceName?: string;
  polygon: MarkerVoidPoint[];
  x: number;
  y: number;
  rotation: number;
  mirrored: boolean;
  locked: boolean;
  priority: number;
}

interface CandidatePosition {
  readonly x: number;
  readonly y: number;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly markerLength: number;
  readonly horizontalMovement: number;
  readonly verticalMovement: number;
  readonly totalMovement: number;
}

interface PolygonBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

const EPSILON = 1e-8;

const DEFAULT_HORIZONTAL_STEP = 1;
const DEFAULT_VERTICAL_STEP = 1;
const DEFAULT_MAXIMUM_PASSES = 6;
const DEFAULT_MAXIMUM_CANDIDATES_PER_PIECE = 500;
const DEFAULT_MAXIMUM_SOLUTIONS = 10;

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

function finitePositive(
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

  return value;
}

function finitePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  return Math.max(
    1,
    Math.floor(
      finitePositive(value, fallback),
    ),
  );
}

function normaliseOptions(
  input: IntelligentMarkerCompactionInput,
): NormalisedCompactionOptions {
  const options = input.options;

  return {
    collisionClearance: finiteNonNegative(
      options?.collisionClearance,
      0,
    ),

    markerBoundaryClearance: finiteNonNegative(
      options?.markerBoundaryClearance,
      0,
    ),

    horizontalStep: finitePositive(
      options?.horizontalStep,
      DEFAULT_HORIZONTAL_STEP,
    ),

    verticalStep: finitePositive(
      options?.verticalStep,
      DEFAULT_VERTICAL_STEP,
    ),

    maximumHorizontalMovement: finiteNonNegative(
      options?.maximumHorizontalMovement,
      input.markerLength,
    ),

    maximumVerticalMovement: finiteNonNegative(
      options?.maximumVerticalMovement,
      input.fabricWidth,
    ),

    maximumPasses: finitePositiveInteger(
      options?.maximumPasses,
      DEFAULT_MAXIMUM_PASSES,
    ),

    maximumCandidatesPerPiece: finitePositiveInteger(
      options?.maximumCandidatesPerPiece,
      DEFAULT_MAXIMUM_CANDIDATES_PER_PIECE,
    ),

    minimumLengthImprovement: finiteNonNegative(
      options?.minimumLengthImprovement,
      0.01,
    ),

    allowPieceBoundaryContact:
      options?.allowPieceBoundaryContact ?? true,

    allowMarkerBoundaryContact:
      options?.allowMarkerBoundaryContact ?? true,

    verticalSearchBeforeHorizontal:
      options?.verticalSearchBeforeHorizontal ?? true,

    priorityFirst:
      options?.priorityFirst ?? true,

    preservePlacementOrder:
      options?.preservePlacementOrder ?? false,

    returnIntermediateSolutions:
      options?.returnIntermediateSolutions ?? true,

    maximumSolutions: finitePositiveInteger(
      options?.maximumSolutions,
      DEFAULT_MAXIMUM_SOLUTIONS,
    ),

    minimumEngineeringScore: clamp(
      finiteNonNegative(
        options?.minimumEngineeringScore,
        0,
      ),
      0,
      100,
    ),
  };
}

function getPolygonBounds(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): PolygonBounds | null {
  if (polygon.length < 3) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of polygon) {
    if (
      !Number.isFinite(point.x) ||
      !Number.isFinite(point.y)
    ) {
      return null;
    }

    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  if (
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(maxY)
  ) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

function calculatePolygonArea(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): number {
  if (polygon.length < 3) {
    return 0;
  }

  let signedArea = 0;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];

    signedArea +=
      current.x * next.y -
      next.x * current.y;
  }

  return Math.abs(signedArea) / 2;
}

function translatePolygon(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  deltaX: number,
  deltaY: number,
): MarkerVoidPoint[] {
  return polygon.map((point) => ({
    x: point.x + deltaX,
    y: point.y + deltaY,
  }));
}

function crossProduct(
  first: MarkerVoidPoint,
  second: MarkerVoidPoint,
  third: MarkerVoidPoint,
): number {
  return (
    (second.x - first.x) *
      (third.y - first.y) -
    (second.y - first.y) *
      (third.x - first.x)
  );
}

function orientation(
  first: MarkerVoidPoint,
  second: MarkerVoidPoint,
  third: MarkerVoidPoint,
): number {
  const value = crossProduct(
    first,
    second,
    third,
  );

  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return value > 0 ? 1 : -1;
}

function pointOnSegment(
  point: MarkerVoidPoint,
  start: MarkerVoidPoint,
  end: MarkerVoidPoint,
): boolean {
  if (
    Math.abs(
      crossProduct(start, end, point),
    ) > EPSILON
  ) {
    return false;
  }

  return (
    point.x >= Math.min(start.x, end.x) - EPSILON &&
    point.x <= Math.max(start.x, end.x) + EPSILON &&
    point.y >= Math.min(start.y, end.y) - EPSILON &&
    point.y <= Math.max(start.y, end.y) + EPSILON
  );
}

function segmentsIntersect(
  firstStart: MarkerVoidPoint,
  firstEnd: MarkerVoidPoint,
  secondStart: MarkerVoidPoint,
  secondEnd: MarkerVoidPoint,
  allowBoundaryContact: boolean,
): boolean {
  const firstOrientation = orientation(
    firstStart,
    firstEnd,
    secondStart,
  );

  const secondOrientation = orientation(
    firstStart,
    firstEnd,
    secondEnd,
  );

  const thirdOrientation = orientation(
    secondStart,
    secondEnd,
    firstStart,
  );

  const fourthOrientation = orientation(
    secondStart,
    secondEnd,
    firstEnd,
  );

  if (
    firstOrientation !== secondOrientation &&
    thirdOrientation !== fourthOrientation
  ) {
    return true;
  }

  const boundaryContact =
    (firstOrientation === 0 &&
      pointOnSegment(
        secondStart,
        firstStart,
        firstEnd,
      )) ||
    (secondOrientation === 0 &&
      pointOnSegment(
        secondEnd,
        firstStart,
        firstEnd,
      )) ||
    (thirdOrientation === 0 &&
      pointOnSegment(
        firstStart,
        secondStart,
        secondEnd,
      )) ||
    (fourthOrientation === 0 &&
      pointOnSegment(
        firstEnd,
        secondStart,
        secondEnd,
      ));

  return allowBoundaryContact
    ? false
    : boundaryContact;
}

function pointInsidePolygon(
  point: MarkerVoidPoint,
  polygon: ReadonlyArray<MarkerVoidPoint>,
): boolean {
  let inside = false;

  for (
    let currentIndex = 0,
      previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex++
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];

    const intersects =
      current.y > point.y !==
        previous.y > point.y &&
      point.x <
        ((previous.x - current.x) *
          (point.y - current.y)) /
          (previous.y -
            current.y +
            EPSILON) +
          current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function polygonsIntersect(
  firstPolygon: ReadonlyArray<MarkerVoidPoint>,
  secondPolygon: ReadonlyArray<MarkerVoidPoint>,
  allowBoundaryContact: boolean,
): boolean {
  const firstBounds =
    getPolygonBounds(firstPolygon);

  const secondBounds =
    getPolygonBounds(secondPolygon);

  if (!firstBounds || !secondBounds) {
    return true;
  }

  const boundsOverlap =
    firstBounds.minX <=
      secondBounds.maxX + EPSILON &&
    firstBounds.maxX + EPSILON >=
      secondBounds.minX &&
    firstBounds.minY <=
      secondBounds.maxY + EPSILON &&
    firstBounds.maxY + EPSILON >=
      secondBounds.minY;

  if (!boundsOverlap) {
    return false;
  }

  for (
    let firstIndex = 0;
    firstIndex < firstPolygon.length;
    firstIndex += 1
  ) {
    const firstStart =
      firstPolygon[firstIndex];

    const firstEnd =
      firstPolygon[
        (firstIndex + 1) %
          firstPolygon.length
      ];

    for (
      let secondIndex = 0;
      secondIndex < secondPolygon.length;
      secondIndex += 1
    ) {
      const secondStart =
        secondPolygon[secondIndex];

      const secondEnd =
        secondPolygon[
          (secondIndex + 1) %
            secondPolygon.length
        ];

      if (
        segmentsIntersect(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd,
          allowBoundaryContact,
        )
      ) {
        return true;
      }
    }
  }

  if (
    pointInsidePolygon(
      firstPolygon[0],
      secondPolygon,
    ) ||
    pointInsidePolygon(
      secondPolygon[0],
      firstPolygon,
    )
  ) {
    return true;
  }

  return false;
}

function squaredDistance(
  first: MarkerVoidPoint,
  second: MarkerVoidPoint,
): number {
  const deltaX = first.x - second.x;
  const deltaY = first.y - second.y;

  return (
    deltaX * deltaX +
    deltaY * deltaY
  );
}

function squaredDistanceToSegment(
  point: MarkerVoidPoint,
  start: MarkerVoidPoint,
  end: MarkerVoidPoint,
): number {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;

  const segmentLengthSquared =
    segmentX * segmentX +
    segmentY * segmentY;

  if (segmentLengthSquared <= EPSILON) {
    return squaredDistance(point, start);
  }

  const projection = clamp(
    ((point.x - start.x) * segmentX +
      (point.y - start.y) * segmentY) /
      segmentLengthSquared,
    0,
    1,
  );

  return squaredDistance(point, {
    x: start.x + projection * segmentX,
    y: start.y + projection * segmentY,
  });
}

function segmentDistance(
  firstStart: MarkerVoidPoint,
  firstEnd: MarkerVoidPoint,
  secondStart: MarkerVoidPoint,
  secondEnd: MarkerVoidPoint,
): number {
  if (
    segmentsIntersect(
      firstStart,
      firstEnd,
      secondStart,
      secondEnd,
      false,
    )
  ) {
    return 0;
  }

  return Math.sqrt(
    Math.min(
      squaredDistanceToSegment(
        firstStart,
        secondStart,
        secondEnd,
      ),
      squaredDistanceToSegment(
        firstEnd,
        secondStart,
        secondEnd,
      ),
      squaredDistanceToSegment(
        secondStart,
        firstStart,
        firstEnd,
      ),
      squaredDistanceToSegment(
        secondEnd,
        firstStart,
        firstEnd,
      ),
    ),
  );
}

function minimumPolygonDistance(
  firstPolygon: ReadonlyArray<MarkerVoidPoint>,
  secondPolygon: ReadonlyArray<MarkerVoidPoint>,
): number {
  if (
    polygonsIntersect(
      firstPolygon,
      secondPolygon,
      false,
    )
  ) {
    return 0;
  }

  let minimumDistance =
    Number.POSITIVE_INFINITY;

  for (
    let firstIndex = 0;
    firstIndex < firstPolygon.length;
    firstIndex += 1
  ) {
    const firstStart =
      firstPolygon[firstIndex];

    const firstEnd =
      firstPolygon[
        (firstIndex + 1) %
          firstPolygon.length
      ];

    for (
      let secondIndex = 0;
      secondIndex < secondPolygon.length;
      secondIndex += 1
    ) {
      const secondStart =
        secondPolygon[secondIndex];

      const secondEnd =
        secondPolygon[
          (secondIndex + 1) %
            secondPolygon.length
        ];

      minimumDistance = Math.min(
        minimumDistance,
        segmentDistance(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd,
        ),
      );
    }
  }

  return Number.isFinite(minimumDistance)
    ? minimumDistance
    : 0;
}

function polygonInsideMarker(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  markerLength: number,
  fabricWidth: number,
  clearance: number,
  allowBoundaryContact: boolean,
): boolean {
  return polygon.every((point) => {
    if (allowBoundaryContact) {
      return (
        point.x >= clearance - EPSILON &&
        point.y >= clearance - EPSILON &&
        point.x <=
          markerLength -
            clearance +
            EPSILON &&
        point.y <=
          fabricWidth -
            clearance +
            EPSILON
      );
    }

    return (
      point.x > clearance + EPSILON &&
      point.y > clearance + EPSILON &&
      point.x <
        markerLength -
          clearance -
          EPSILON &&
      point.y <
        fabricWidth -
          clearance -
          EPSILON
    );
  });
}

function placementIsCollisionSafe(
  candidatePolygon: ReadonlyArray<MarkerVoidPoint>,
  placementId: string,
  placements: ReadonlyArray<MutableCompactionPlacement>,
  options: NormalisedCompactionOptions,
): boolean {
  for (const placement of placements) {
    if (placement.id === placementId) {
      continue;
    }

    const intersects =
      polygonsIntersect(
        candidatePolygon,
        placement.polygon,
        options.allowPieceBoundaryContact,
      );

    if (intersects) {
      return false;
    }

    if (
      options.collisionClearance >
      EPSILON
    ) {
      const minimumDistance =
        minimumPolygonDistance(
          candidatePolygon,
          placement.polygon,
        );

      if (
        minimumDistance + EPSILON <
        options.collisionClearance
      ) {
        return false;
      }
    }
  }

  return true;
}

function calculateMarkerLength(
  placements: ReadonlyArray<{
    readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  }>,
  boundaryClearance: number,
): number {
  let maximumX = 0;

  for (const placement of placements) {
    const bounds =
      getPolygonBounds(placement.polygon);

    if (!bounds) {
      continue;
    }

    maximumX = Math.max(
      maximumX,
      bounds.maxX,
    );
  }

  return Math.max(
    0,
    maximumX + boundaryClearance,
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

function normalisePlacement(
  placement: CompactionPlacement,
): MutableCompactionPlacement | null {
  const bounds =
    getPolygonBounds(placement.polygon);

  if (!bounds) {
    return null;
  }

  return {
    id: placement.id,
    pieceId: placement.pieceId,
    pieceName: placement.pieceName,
    polygon: placement.polygon.map(
      (point) => ({ ...point }),
    ),
    x: placement.x ?? bounds.minX,
    y: placement.y ?? bounds.minY,
    rotation: placement.rotation ?? 0,
    mirrored: placement.mirrored ?? false,
    locked: placement.locked ?? false,
    priority: placement.priority ?? 50,
  };
}

function clonePlacements(
  placements: ReadonlyArray<MutableCompactionPlacement>,
): MutableCompactionPlacement[] {
  return placements.map((placement) => ({
    ...placement,
    polygon: placement.polygon.map(
      (point) => ({ ...point }),
    ),
  }));
}

function toReadonlyPlacement(
  placement: MutableCompactionPlacement,
): CompactedMarkerPlacement {
  return {
    id: placement.id,
    pieceId: placement.pieceId,
    pieceName: placement.pieceName,
    polygon: placement.polygon.map(
      (point) => ({ ...point }),
    ),
    x: placement.x,
    y: placement.y,
    rotation: placement.rotation,
    mirrored: placement.mirrored,
    locked: placement.locked,
    priority: placement.priority,
  };
}

function createSearchOffsets(
  maximumDistance: number,
  step: number,
): number[] {
  const offsets: number[] = [0];

  for (
    let distance = step;
    distance <=
    maximumDistance + EPSILON;
    distance += step
  ) {
    offsets.push(distance);
  }

  return offsets;
}

function compareCandidatePositions(
  first: CandidatePosition,
  second: CandidatePosition,
): number {
  if (
    first.markerLength !==
    second.markerLength
  ) {
    return (
      first.markerLength -
      second.markerLength
    );
  }

  if (
    first.horizontalMovement !==
    second.horizontalMovement
  ) {
    return (
      second.horizontalMovement -
      first.horizontalMovement
    );
  }

  if (
    first.totalMovement !==
    second.totalMovement
  ) {
    return (
      first.totalMovement -
      second.totalMovement
    );
  }

  return (
    Math.abs(first.verticalMovement) -
    Math.abs(second.verticalMovement)
  );
}

function createVerticalOffsets(
  maximumDistance: number,
  step: number,
): number[] {
  const offsets: number[] = [0];

  for (
    let distance = step;
    distance <=
    maximumDistance + EPSILON;
    distance += step
  ) {
    offsets.push(-distance);
    offsets.push(distance);
  }

  return offsets;
}

function createCandidatePosition(
  placement: MutableCompactionPlacement,
  deltaX: number,
  deltaY: number,
  placements: ReadonlyArray<MutableCompactionPlacement>,
  currentMarkerLength: number,
  fabricWidth: number,
  options: NormalisedCompactionOptions,
): CandidatePosition | null {
  const candidatePolygon =
    translatePolygon(
      placement.polygon,
      deltaX,
      deltaY,
    );

  if (
    !polygonInsideMarker(
      candidatePolygon,
      currentMarkerLength,
      fabricWidth,
      options.markerBoundaryClearance,
      options.allowMarkerBoundaryContact,
    )
  ) {
    return null;
  }

  if (
    !placementIsCollisionSafe(
      candidatePolygon,
      placement.id,
      placements,
      options,
    )
  ) {
    return null;
  }

  const temporaryPlacements =
    placements.map((currentPlacement) =>
      currentPlacement.id === placement.id
        ? {
            ...currentPlacement,
            polygon: candidatePolygon,
          }
        : currentPlacement,
    );

  const markerLength =
    calculateMarkerLength(
      temporaryPlacements,
      options.markerBoundaryClearance,
    );

  return {
    x: placement.x + deltaX,
    y: placement.y + deltaY,
    polygon: candidatePolygon,
    markerLength,
    horizontalMovement: Math.abs(deltaX),
    verticalMovement: deltaY,
    totalMovement: Math.hypot(
      deltaX,
      deltaY,
    ),
  };
}

function findBestPositionForPlacement(
  placement: MutableCompactionPlacement,
  placements: ReadonlyArray<MutableCompactionPlacement>,
  currentMarkerLength: number,
  fabricWidth: number,
  options: NormalisedCompactionOptions,
): {
  candidate: CandidatePosition | null;
  testedCandidates: number;
  rejectedCandidates: number;
} {
  const maximumLeftMovement =
    Math.min(
      options.maximumHorizontalMovement,
      Math.max(
        0,
        placement.x -
          options.markerBoundaryClearance,
      ),
    );

  const horizontalOffsets =
    createSearchOffsets(
      maximumLeftMovement,
      options.horizontalStep,
    );

  const verticalOffsets =
    createVerticalOffsets(
      options.maximumVerticalMovement,
      options.verticalStep,
    );

  const candidates: CandidatePosition[] = [];

  let testedCandidates = 0;
  let rejectedCandidates = 0;

  const evaluate = (
    horizontalOffset: number,
    verticalOffset: number,
  ): void => {
    if (
      horizontalOffset <= EPSILON &&
      Math.abs(verticalOffset) <= EPSILON
    ) {
      return;
    }

    if (
      testedCandidates >=
      options.maximumCandidatesPerPiece
    ) {
      return;
    }

    testedCandidates += 1;

    const candidate =
      createCandidatePosition(
        placement,
        -horizontalOffset,
        verticalOffset,
        placements,
        currentMarkerLength,
        fabricWidth,
        options,
      );

    if (!candidate) {
      rejectedCandidates += 1;
      return;
    }

    candidates.push(candidate);
  };

  if (
    options.verticalSearchBeforeHorizontal
  ) {
    for (
      const horizontalOffset of horizontalOffsets
    ) {
      for (
        const verticalOffset of verticalOffsets
      ) {
        evaluate(
          horizontalOffset,
          verticalOffset,
        );

        if (
          testedCandidates >=
          options.maximumCandidatesPerPiece
        ) {
          break;
        }
      }

      if (
        testedCandidates >=
        options.maximumCandidatesPerPiece
      ) {
        break;
      }
    }
  } else {
    for (
      const verticalOffset of verticalOffsets
    ) {
      for (
        const horizontalOffset of horizontalOffsets
      ) {
        evaluate(
          horizontalOffset,
          verticalOffset,
        );

        if (
          testedCandidates >=
          options.maximumCandidatesPerPiece
        ) {
          break;
        }
      }

      if (
        testedCandidates >=
        options.maximumCandidatesPerPiece
      ) {
        break;
      }
    }
  }

  candidates.sort(
    compareCandidatePositions,
  );

  const bestCandidate =
    candidates[0] ?? null;

  if (!bestCandidate) {
    return {
      candidate: null,
      testedCandidates,
      rejectedCandidates,
    };
  }

  const currentBounds =
    getPolygonBounds(placement.polygon);

  const candidateBounds =
    getPolygonBounds(
      bestCandidate.polygon,
    );

  if (
    !currentBounds ||
    !candidateBounds
  ) {
    return {
      candidate: null,
      testedCandidates,
      rejectedCandidates,
    };
  }

  const movedLeft =
    candidateBounds.minX <
    currentBounds.minX - EPSILON;

  const reducesMarkerLength =
    bestCandidate.markerLength <
    currentMarkerLength -
      options.minimumLengthImprovement;

  if (
    !movedLeft &&
    !reducesMarkerLength
  ) {
    return {
      candidate: null,
      testedCandidates,
      rejectedCandidates,
    };
  }

  return {
    candidate: bestCandidate,
    testedCandidates,
    rejectedCandidates,
  };
}

function orderPlacementsForPass(
  placements: ReadonlyArray<MutableCompactionPlacement>,
  options: NormalisedCompactionOptions,
): MutableCompactionPlacement[] {
  if (options.preservePlacementOrder) {
    return [...placements];
  }

  return [...placements].sort(
    (first, second) => {
      if (
        options.priorityFirst &&
        second.priority !==
          first.priority
      ) {
        return (
          second.priority -
          first.priority
        );
      }

      const firstBounds =
        getPolygonBounds(
          first.polygon,
        );

      const secondBounds =
        getPolygonBounds(
          second.polygon,
        );

      const firstTrailingEdge =
        firstBounds?.maxX ?? 0;

      const secondTrailingEdge =
        secondBounds?.maxX ?? 0;

      if (
        secondTrailingEdge !==
        firstTrailingEdge
      ) {
        return (
          secondTrailingEdge -
          firstTrailingEdge
        );
      }

      return first.id.localeCompare(
        second.id,
      );
    },
  );
}

function runCompactionPass(
  passNumber: number,
  placements: MutableCompactionPlacement[],
  currentMarkerLength: number,
  fabricWidth: number,
  options: NormalisedCompactionOptions,
): {
  pass: CompactionPassResult;
  placements: MutableCompactionPlacement[];
  testedCandidates: number;
  rejectedCandidates: number;
} {
  const workingPlacements =
    clonePlacements(placements);

  const markerLengthBefore =
    currentMarkerLength;

  const movements: CompactionMovement[] = [];

  let testedCandidates = 0;
  let rejectedCandidates = 0;

  const orderedPlacements =
    orderPlacementsForPass(
      workingPlacements,
      options,
    );

  for (
    const orderedPlacement of orderedPlacements
  ) {
    const placementIndex =
      workingPlacements.findIndex(
        (placement) =>
          placement.id ===
          orderedPlacement.id,
      );

    if (placementIndex < 0) {
      continue;
    }

    const placement =
      workingPlacements[
        placementIndex
      ];

    if (placement.locked) {
      continue;
    }

    const currentLength =
      calculateMarkerLength(
        workingPlacements,
        options.markerBoundaryClearance,
      );

    const search =
      findBestPositionForPlacement(
        placement,
        workingPlacements,
        currentLength,
        fabricWidth,
        options,
      );

    testedCandidates +=
      search.testedCandidates;

    rejectedCandidates +=
      search.rejectedCandidates;

    if (!search.candidate) {
      continue;
    }

    const markerLengthAfter =
      search.candidate.markerLength;

    const movement: CompactionMovement = {
      placementId: placement.id,
      pieceId: placement.pieceId,
      fromX: placement.x,
      fromY: placement.y,
      toX: search.candidate.x,
      toY: search.candidate.y,
      deltaX:
        search.candidate.x -
        placement.x,
      deltaY:
        search.candidate.y -
        placement.y,
      distanceMoved:
        search.candidate.totalMovement,
      markerLengthBefore:
        currentLength,
      markerLengthAfter,
      markerLengthReduction:
        Math.max(
          0,
          currentLength -
            markerLengthAfter,
        ),
    };

    workingPlacements[
      placementIndex
    ] = {
      ...placement,
      x: search.candidate.x,
      y: search.candidate.y,
      polygon:
        search.candidate.polygon.map(
          (point) => ({ ...point }),
        ),
    };

    movements.push(movement);
  }

  const markerLengthAfter =
    calculateMarkerLength(
      workingPlacements,
      options.markerBoundaryClearance,
    );

  const markerLengthReduction =
    Math.max(
      0,
      markerLengthBefore -
        markerLengthAfter,
    );

  return {
    pass: {
      passNumber,
      placements:
        workingPlacements.map(
          toReadonlyPlacement,
        ),
      movements,
      markerLengthBefore,
      markerLengthAfter,
      markerLengthReduction,
      movementCount: movements.length,
      improved:
        markerLengthReduction >=
          options.minimumLengthImprovement ||
        movements.length > 0,
    },
    placements: workingPlacements,
    testedCandidates,
    rejectedCandidates,
  };
}

function validateFinalLayout(
  placements: ReadonlyArray<MutableCompactionPlacement>,
  markerLength: number,
  fabricWidth: number,
  options: NormalisedCompactionOptions,
): {
  collisionFree: boolean;
  boundarySafe: boolean;
} {
  const boundarySafe =
    placements.every((placement) =>
      polygonInsideMarker(
        placement.polygon,
        markerLength,
        fabricWidth,
        options.markerBoundaryClearance,
        options.allowMarkerBoundaryContact,
      ),
    );

  let collisionFree = true;

  for (
    let firstIndex = 0;
    firstIndex < placements.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex < placements.length;
      secondIndex += 1
    ) {
      const first =
        placements[firstIndex];

      const second =
        placements[secondIndex];

      if (
        polygonsIntersect(
          first.polygon,
          second.polygon,
          options.allowPieceBoundaryContact,
        )
      ) {
        collisionFree = false;
        break;
      }

      if (
        options.collisionClearance >
        EPSILON
      ) {
        const distance =
          minimumPolygonDistance(
            first.polygon,
            second.polygon,
          );

        if (
          distance + EPSILON <
          options.collisionClearance
        ) {
          collisionFree = false;
          break;
        }
      }
    }

    if (!collisionFree) {
      break;
    }
  }

  return {
    collisionFree,
    boundarySafe,
  };
}

function calculateEngineeringScore(
  markerLengthReductionPercentage: number,
  utilisationImprovement: number,
  movementCount: number,
  placementCount: number,
  collisionFree: boolean,
  boundarySafe: boolean,
): number {
  const lengthScore = clamp(
    markerLengthReductionPercentage *
      8,
    0,
    100,
  );

  const utilisationScore = clamp(
    utilisationImprovement * 8,
    0,
    100,
  );

  const movementEfficiency =
    placementCount === 0
      ? 100
      : clamp(
          100 -
            (movementCount /
              placementCount) *
              35,
          0,
          100,
        );

  const safetyScore =
    collisionFree && boundarySafe
      ? 100
      : 0;

  return clamp(
    lengthScore * 0.35 +
      utilisationScore * 0.3 +
      movementEfficiency * 0.15 +
      safetyScore * 0.2,
    0,
    100,
  );
}

function createSolution(
  markerId: string | undefined,
  solutionNumber: number,
  placements: ReadonlyArray<MutableCompactionPlacement>,
  movements: ReadonlyArray<CompactionMovement>,
  passCount: number,
  originalMarkerLength: number,
  fabricWidth: number,
  totalPatternArea: number,
  options: NormalisedCompactionOptions,
): MarkerCompactionSolution {
  const compactedMarkerLength =
    calculateMarkerLength(
      placements,
      options.markerBoundaryClearance,
    );

  const markerLengthReduction =
    Math.max(
      0,
      originalMarkerLength -
        compactedMarkerLength,
    );

  const markerLengthReductionPercentage =
    originalMarkerLength <= EPSILON
      ? 0
      : (markerLengthReduction /
          originalMarkerLength) *
        100;

  const originalMarkerArea =
    originalMarkerLength *
    fabricWidth;

  const compactedMarkerArea =
    compactedMarkerLength *
    fabricWidth;

  const originalUtilisation =
    originalMarkerArea <= EPSILON
      ? 0
      : (totalPatternArea /
          originalMarkerArea) *
        100;

  const compactedUtilisation =
    compactedMarkerArea <= EPSILON
      ? 0
      : (totalPatternArea /
          compactedMarkerArea) *
        100;

  const utilisationImprovement =
    compactedUtilisation -
    originalUtilisation;

  const validation =
    validateFinalLayout(
      placements,
      compactedMarkerLength,
      fabricWidth,
      options,
    );

  const movedPlacementCount =
    new Set(
      movements.map(
        (movement) =>
          movement.placementId,
      ),
    ).size;

  const engineeringScore =
    calculateEngineeringScore(
      markerLengthReductionPercentage,
      utilisationImprovement,
      movedPlacementCount,
      placements.length,
      validation.collisionFree,
      validation.boundarySafe,
    );

  return {
    id: `${markerId ?? "marker"}-compaction-solution-${solutionNumber}`,
    markerId,
    solutionNumber,
    placements:
      placements.map(
        toReadonlyPlacement,
      ),
    movements,
    passCount,
    originalMarkerLength,
    compactedMarkerLength,
    markerLengthReduction,
    markerLengthReductionPercentage,
    originalMarkerArea,
    compactedMarkerArea,
    totalPatternArea,
    originalUtilisation,
    compactedUtilisation,
    utilisationImprovement,
    totalMovementDistance:
      movements.reduce(
        (total, movement) =>
          total +
          movement.distanceMoved,
        0,
      ),
    movedPlacementCount,
    collisionFree:
      validation.collisionFree,
    boundarySafe:
      validation.boundarySafe,
    engineeringScore,
    engineeringReady:
      markerLengthReduction >=
        options.minimumLengthImprovement &&
      validation.collisionFree &&
      validation.boundarySafe &&
      engineeringScore + EPSILON >=
        options.minimumEngineeringScore,
  };
}

function compareSolutions(
  first: MarkerCompactionSolution,
  second: MarkerCompactionSolution,
): number {
  if (
    first.compactedMarkerLength !==
    second.compactedMarkerLength
  ) {
    return (
      first.compactedMarkerLength -
      second.compactedMarkerLength
    );
  }

  if (
    second.engineeringScore !==
    first.engineeringScore
  ) {
    return (
      second.engineeringScore -
      first.engineeringScore
    );
  }

  if (
    second.compactedUtilisation !==
    first.compactedUtilisation
  ) {
    return (
      second.compactedUtilisation -
      first.compactedUtilisation
    );
  }

  return (
    first.totalMovementDistance -
    second.totalMovementDistance
  );
}

/**
 * Runs safe multi-pass marker compaction.
 */
export function compactMarkerIntelligently(
  input: IntelligentMarkerCompactionInput,
): IntelligentMarkerCompactionResult {
  const options =
    normaliseOptions(input);

  const warnings: string[] = [];
  const rejected:
    RejectedCompactionCandidate[] = [];

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

    return {
      markerId: input.markerId,
      originalPlacements: [],
      solutions: [],
      bestSolution: null,
      passes: [],
      rejected: [
        {
          reason:
            "invalidMarkerDimensions",
          message:
            "The supplied marker dimensions are invalid.",
        },
      ],
      statistics: {
        testedPlacements:
          input.placements.length,
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
      warnings,
      engineeringReady: false,
    };
  }

  const normalisedPlacements:
    MutableCompactionPlacement[] = [];

  for (const placement of input.placements) {
    const normalised =
      normalisePlacement(placement);

    if (!normalised) {
      rejected.push({
        placementId: placement.id,
        pieceId: placement.pieceId,
        reason:
          "invalidPlacementPolygon",
        message:
          "The placement polygon is invalid or has fewer than three usable points.",
      });

      continue;
    }

    if (
      !polygonInsideMarker(
        normalised.polygon,
        input.markerLength,
        input.fabricWidth,
        options.markerBoundaryClearance,
        options.allowMarkerBoundaryContact,
      )
    ) {
      rejected.push({
        placementId:
          normalised.id,
        pieceId:
          normalised.pieceId,
        reason:
          "outsideMarkerBoundary",
        message:
          "The original placement is outside the permitted marker boundary.",
      });
    }

    normalisedPlacements.push(
      normalised,
    );
  }

  const originalPlacements =
    clonePlacements(
      normalisedPlacements,
    );

  const totalPatternArea =
    calculateTotalPatternArea(
      originalPlacements,
    );

  const originalMarkerArea =
    input.markerLength *
    input.fabricWidth;

  const originalUtilisation =
    originalMarkerArea <= EPSILON
      ? 0
      : (totalPatternArea /
          originalMarkerArea) *
        100;

  let workingPlacements =
    clonePlacements(
      originalPlacements,
    );

  let currentMarkerLength =
    calculateMarkerLength(
      workingPlacements,
      options.markerBoundaryClearance,
    );

  currentMarkerLength =
    Math.min(
      input.markerLength,
      Math.max(
        currentMarkerLength,
        options.markerBoundaryClearance,
      ),
    );

  const passes:
    CompactionPassResult[] = [];

  const solutions:
    MarkerCompactionSolution[] = [];

  const allMovements:
    CompactionMovement[] = [];

  let testedCandidatePositions = 0;
  let rejectedCandidatePositions = 0;
  let acceptedMovements = 0;

  for (
    let passNumber = 1;
    passNumber <= options.maximumPasses;
    passNumber += 1
  ) {
    const passResult =
      runCompactionPass(
        passNumber,
        workingPlacements,
        currentMarkerLength,
        input.fabricWidth,
        options,
      );

    passes.push(passResult.pass);

    testedCandidatePositions +=
      passResult.testedCandidates;

    rejectedCandidatePositions +=
      passResult.rejectedCandidates;

    acceptedMovements +=
      passResult.pass.movementCount;

    allMovements.push(
      ...passResult.pass.movements,
    );

    workingPlacements =
      passResult.placements;

    currentMarkerLength =
      passResult.pass.markerLengthAfter;

    const solution =
      createSolution(
        input.markerId,
        solutions.length + 1,
        workingPlacements,
        [...allMovements],
        passNumber,
        input.markerLength,
        input.fabricWidth,
        totalPatternArea,
        options,
      );

    if (
      options.returnIntermediateSolutions ||
      passNumber ===
        options.maximumPasses
    ) {
      solutions.push(solution);
    }

    if (
      !passResult.pass.improved ||
      passResult.pass.movementCount ===
        0
    ) {
      break;
    }
  }

  const uniqueSolutions =
    solutions
      .filter(
        (
          solution,
          index,
          collection,
        ) =>
          collection.findIndex(
            (candidate) =>
              Math.abs(
                candidate.compactedMarkerLength -
                  solution.compactedMarkerLength,
              ) <= EPSILON &&
              candidate.movedPlacementCount ===
                solution.movedPlacementCount,
          ) === index,
      )
      .sort(compareSolutions)
      .slice(
        0,
        options.maximumSolutions,
      )
      .map((solution, index) => ({
        ...solution,
        solutionNumber: index + 1,
        id: `${input.markerId ?? "marker"}-compaction-solution-${index + 1}`,
      }));

  const engineeringSolutions =
    uniqueSolutions.filter(
      (solution) =>
        solution.engineeringReady,
    );

  const bestSolution =
    engineeringSolutions[0] ??
    uniqueSolutions[0] ??
    null;

  if (
    normalisedPlacements.length === 0
  ) {
    warnings.push(
      "No valid pattern placements were available for compaction.",
    );
  }

  if (
    normalisedPlacements.length > 0 &&
    !bestSolution
  ) {
    warnings.push(
      "No Marker Compaction solution was generated.",
    );
  }

  if (
    bestSolution &&
    bestSolution.markerLengthReduction <
      options.minimumLengthImprovement
  ) {
    warnings.push(
      "The generated layout did not achieve the configured minimum Marker Length improvement.",
    );

    rejected.push({
      reason: "noImprovement",
      message:
        "No meaningful Marker Length reduction was achieved.",
    });
  }

  if (
    bestSolution &&
    bestSolution.engineeringScore +
      EPSILON <
      options.minimumEngineeringScore
  ) {
    rejected.push({
      reason:
        "engineeringScoreTooLow",
      message:
        "The best compaction solution is below the configured minimum Engineering Score.",
    });
  }

  if (
    bestSolution &&
    !bestSolution.collisionFree
  ) {
    rejected.push({
      reason:
        "collisionDetected",
      message:
        "The best compaction solution failed final collision validation.",
    });
  }

  const lockedPlacements =
    normalisedPlacements.filter(
      (placement) =>
        placement.locked,
    ).length;

  return {
    markerId: input.markerId,

    originalPlacements:
      originalPlacements.map(
        toReadonlyPlacement,
      ),

    solutions:
      uniqueSolutions,

    bestSolution,

    passes,

    rejected,

    statistics: {
      testedPlacements:
        normalisedPlacements.length,

      lockedPlacements,

      testedCandidatePositions,

      acceptedMovements,

      rejectedCandidatePositions,

      completedPasses:
        passes.length,

      generatedSolutions:
        uniqueSolutions.length,

      originalMarkerLength:
        input.markerLength,

      bestCompactedMarkerLength:
        bestSolution
          ?.compactedMarkerLength ??
        input.markerLength,

      bestLengthReduction:
        bestSolution
          ?.markerLengthReduction ??
        0,

      bestLengthReductionPercentage:
        bestSolution
          ?.markerLengthReductionPercentage ??
        0,

      originalUtilisation,

      bestUtilisation:
        bestSolution
          ?.compactedUtilisation ??
        originalUtilisation,

      bestEngineeringScore:
        bestSolution
          ?.engineeringScore ??
        0,
    },

    warnings,

    engineeringReady:
      Boolean(
        bestSolution
          ?.engineeringReady,
      ),
  };
}

/**
 * Returns the highest-ranked Marker Compaction solution.
 */
export function getBestMarkerCompactionSolution(
  result: IntelligentMarkerCompactionResult,
): MarkerCompactionSolution | null {
  return result.bestSolution;
}

/**
 * Returns only Engineering Ready solutions.
 */
export function getEngineeringReadyCompactionSolutions(
  result: IntelligentMarkerCompactionResult,
): ReadonlyArray<MarkerCompactionSolution> {
  return result.solutions.filter(
    (solution) =>
      solution.engineeringReady,
  );
}

/**
 * Finds the final compacted position of one placement.
 */
export function getCompactedPlacement(
  solution: MarkerCompactionSolution,
  placementId: string,
): CompactedMarkerPlacement | null {
  return (
    solution.placements.find(
      (placement) =>
        placement.id === placementId,
    ) ?? null
  );
}

/**
 * Returns all movements made for one pattern piece.
 */
export function getCompactionMovementsForPiece(
  solution: MarkerCompactionSolution,
  pieceId: string,
): ReadonlyArray<CompactionMovement> {
  return solution.movements.filter(
    (movement) =>
      movement.pieceId === pieceId,
  );
}

/**
 * Returns solutions achieving at least the requested Marker Length reduction.
 */
export function filterCompactionSolutionsByLengthReduction(
  solutions: ReadonlyArray<MarkerCompactionSolution>,
  minimumLengthReduction: number,
): ReadonlyArray<MarkerCompactionSolution> {
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
 * Returns solutions achieving at least the requested Engineering Score.
 */
export function filterCompactionSolutionsByEngineeringScore(
  solutions: ReadonlyArray<MarkerCompactionSolution>,
  minimumEngineeringScore: number,
): ReadonlyArray<MarkerCompactionSolution> {
  const minimumScore = clamp(
    minimumEngineeringScore,
    0,
    100,
  );

  return solutions.filter(
    (solution) =>
      solution.engineeringScore +
        EPSILON >=
      minimumScore,
  );
}