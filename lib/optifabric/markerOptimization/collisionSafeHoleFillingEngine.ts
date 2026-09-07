/**
 * OptiFabric AI
 * RC5-004-003 — Collision-Safe Hole Filling Placement Engine
 *
 * Purpose:
 * - Validate actual piece insertion positions inside detected marker voids.
 * - Prevent overlap with existing marker placements.
 * - Respect marker boundaries, clearance, rotation and Grain Line rules.
 * - Rank collision-safe hole-filling placements before any marker mutation.
 *
 * Engineering note:
 * This engine is non-destructive. It proposes validated placements but does
 * not modify the existing marker layout.
 */

import type {
  DetectedMarkerVoid,
  MarkerVoidPoint,
} from "./markerVoidDetectionEngine";

import type {
  CompatibilityPatternPiece,
  PieceVoidPlacementCandidate,
} from "./pieceVoidCompatibilityEngine";

export interface ExistingMarkerPlacement {
  readonly id: string;
  readonly pieceId?: string;
  readonly pieceName?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly locked?: boolean;
}

export interface CollisionSafeHoleFillingInput {
  readonly markerId?: string;
  readonly markerLength: number;
  readonly fabricWidth: number;
  readonly voids: ReadonlyArray<DetectedMarkerVoid>;
  readonly pieces: ReadonlyArray<CompatibilityPatternPiece>;
  readonly existingPlacements: ReadonlyArray<ExistingMarkerPlacement>;
  readonly compatibilityCandidates: ReadonlyArray<PieceVoidPlacementCandidate>;
  readonly options?: CollisionSafeHoleFillingOptions;
}

export interface CollisionSafeHoleFillingOptions {
  /**
   * Required clearance around every proposed pattern piece.
   */
  readonly collisionClearance?: number;

  /**
   * Required clearance from the outer marker boundary.
   */
  readonly markerBoundaryClearance?: number;

  /**
   * Permit contact with the marker boundary after clearance is applied.
   */
  readonly allowMarkerBoundaryContact?: boolean;

  /**
   * Permit contact with another piece boundary without overlap.
   */
  readonly allowPieceBoundaryContact?: boolean;

  /**
   * Maximum number of safe placements returned.
   */
  readonly maximumPlacements?: number;

  /**
   * Maximum number of safe placements returned for one void.
   */
  readonly maximumPlacementsPerVoid?: number;

  /**
   * Exclude pieces already present in the marker.
   */
  readonly excludeExistingPieceIds?: boolean;

  /**
   * Exclude repeated use of the same piece candidate in the returned plan.
   */
  readonly uniquePiecePerPlacementPlan?: boolean;

  /**
   * Exclude repeated use of the same void in the returned plan.
   */
  readonly uniqueVoidPerPlacementPlan?: boolean;

  /**
   * Recalculate a final engineering score after collision validation.
   */
  readonly recalculateEngineeringScore?: boolean;

  /**
   * Minimum final score required for an accepted placement.
   */
  readonly minimumEngineeringScore?: number;
}

export type HoleFillingRejectionReason =
  | "invalidMarkerDimensions"
  | "missingPiece"
  | "missingVoid"
  | "invalidCandidatePolygon"
  | "outsideMarkerBoundary"
  | "outsideVoidBoundary"
  | "existingPieceCollision"
  | "pieceAlreadyPlaced"
  | "duplicatePieceSelection"
  | "duplicateVoidSelection"
  | "engineeringScoreTooLow";

export interface CollisionRecord {
  readonly existingPlacementId: string;
  readonly existingPieceId?: string;
  readonly candidateId: string;
  readonly overlapDetected: boolean;
  readonly boundaryContactDetected: boolean;
  readonly minimumDistance: number;
}

export interface CollisionSafeHoleFillingPlacement {
  readonly id: string;
  readonly markerId?: string;
  readonly candidateId: string;
  readonly voidId: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly rotation: number;
  readonly mirrored: boolean;
  readonly x: number;
  readonly y: number;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly compatibilityScore: number;
  readonly collisionScore: number;
  readonly boundaryScore: number;
  readonly voidFitScore: number;
  readonly engineeringScore: number;
  readonly collisionClearance: number;
  readonly markerBoundaryClearance: number;
  readonly minimumExistingPieceDistance: number;
  readonly minimumMarkerBoundaryDistance: number;
  readonly collisions: ReadonlyArray<CollisionRecord>;
  readonly collisionFree: true;
  readonly engineeringSafe: true;
}

export interface RejectedHoleFillingPlacement {
  readonly candidateId: string;
  readonly voidId: string;
  readonly pieceId: string;
  readonly reason: HoleFillingRejectionReason;
  readonly message: string;
  readonly collisionPlacementIds?: ReadonlyArray<string>;
}

export interface HoleFillingPlacementPlan {
  readonly placements: ReadonlyArray<CollisionSafeHoleFillingPlacement>;
  readonly usedPieceIds: ReadonlyArray<string>;
  readonly usedVoidIds: ReadonlyArray<string>;
  readonly totalPieceArea: number;
  readonly totalVoidArea: number;
  readonly estimatedRecoveredArea: number;
  readonly averageEngineeringScore: number;
  readonly bestEngineeringScore: number;
}

export interface CollisionSafeHoleFillingStatistics {
  readonly testedCandidates: number;
  readonly acceptedPlacements: number;
  readonly rejectedPlacements: number;
  readonly collisionRejections: number;
  readonly boundaryRejections: number;
  readonly uniquePiecesAccepted: number;
  readonly uniqueVoidsAccepted: number;
  readonly averageEngineeringScore: number;
  readonly bestEngineeringScore: number;
}

export interface CollisionSafeHoleFillingResult {
  readonly markerId?: string;
  readonly placements: ReadonlyArray<CollisionSafeHoleFillingPlacement>;
  readonly rejected: ReadonlyArray<RejectedHoleFillingPlacement>;
  readonly plan: HoleFillingPlacementPlan;
  readonly statistics: CollisionSafeHoleFillingStatistics;
  readonly warnings: ReadonlyArray<string>;
  readonly engineeringReady: boolean;
}

interface NormalisedOptions {
  readonly collisionClearance: number;
  readonly markerBoundaryClearance: number;
  readonly allowMarkerBoundaryContact: boolean;
  readonly allowPieceBoundaryContact: boolean;
  readonly maximumPlacements: number;
  readonly maximumPlacementsPerVoid: number;
  readonly excludeExistingPieceIds: boolean;
  readonly uniquePiecePerPlacementPlan: boolean;
  readonly uniqueVoidPerPlacementPlan: boolean;
  readonly recalculateEngineeringScore: boolean;
  readonly minimumEngineeringScore: number;
}

interface PolygonBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

const EPSILON = 1e-8;
const DEFAULT_MAXIMUM_PLACEMENTS = 100;
const DEFAULT_MAXIMUM_PLACEMENTS_PER_VOID = 10;

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

function normaliseOptions(
  options: CollisionSafeHoleFillingOptions | undefined,
): NormalisedOptions {
  return {
    collisionClearance: finiteNonNegative(
      options?.collisionClearance,
      0,
    ),
    markerBoundaryClearance: finiteNonNegative(
      options?.markerBoundaryClearance,
      0,
    ),
    allowMarkerBoundaryContact:
      options?.allowMarkerBoundaryContact ?? true,
    allowPieceBoundaryContact:
      options?.allowPieceBoundaryContact ?? true,
    maximumPlacements: finitePositiveInteger(
      options?.maximumPlacements,
      DEFAULT_MAXIMUM_PLACEMENTS,
    ),
    maximumPlacementsPerVoid: finitePositiveInteger(
      options?.maximumPlacementsPerVoid,
      DEFAULT_MAXIMUM_PLACEMENTS_PER_VOID,
    ),
    excludeExistingPieceIds:
      options?.excludeExistingPieceIds ?? true,
    uniquePiecePerPlacementPlan:
      options?.uniquePiecePerPlacementPlan ?? true,
    uniqueVoidPerPlacementPlan:
      options?.uniqueVoidPerPlacementPlan ?? true,
    recalculateEngineeringScore:
      options?.recalculateEngineeringScore ?? true,
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

function pointInsidePolygon(
  point: MarkerVoidPoint,
  polygon: ReadonlyArray<MarkerVoidPoint>,
): boolean {
  let inside = false;

  for (
    let currentIndex = 0, previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex++
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];

    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) *
          (point.y - current.y)) /
          (previous.y - current.y + EPSILON) +
          current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function crossProduct(
  first: MarkerVoidPoint,
  second: MarkerVoidPoint,
  third: MarkerVoidPoint,
): number {
  return (
    (second.x - first.x) * (third.y - first.y) -
    (second.y - first.y) * (third.x - first.x)
  );
}

function pointOnSegment(
  point: MarkerVoidPoint,
  start: MarkerVoidPoint,
  end: MarkerVoidPoint,
): boolean {
  if (
    Math.abs(crossProduct(start, end, point)) >
    EPSILON
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

function orientation(
  first: MarkerVoidPoint,
  second: MarkerVoidPoint,
  third: MarkerVoidPoint,
): number {
  const value = crossProduct(first, second, third);

  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return value > 0 ? 1 : -1;
}

function segmentsIntersect(
  firstStart: MarkerVoidPoint,
  firstEnd: MarkerVoidPoint,
  secondStart: MarkerVoidPoint,
  secondEnd: MarkerVoidPoint,
  allowBoundaryContact: boolean,
): boolean {
  const orientationOne = orientation(
    firstStart,
    firstEnd,
    secondStart,
  );

  const orientationTwo = orientation(
    firstStart,
    firstEnd,
    secondEnd,
  );

  const orientationThree = orientation(
    secondStart,
    secondEnd,
    firstStart,
  );

  const orientationFour = orientation(
    secondStart,
    secondEnd,
    firstEnd,
  );

  if (
    orientationOne !== orientationTwo &&
    orientationThree !== orientationFour
  ) {
    return true;
  }

  const boundaryContact =
    (orientationOne === 0 &&
      pointOnSegment(secondStart, firstStart, firstEnd)) ||
    (orientationTwo === 0 &&
      pointOnSegment(secondEnd, firstStart, firstEnd)) ||
    (orientationThree === 0 &&
      pointOnSegment(firstStart, secondStart, secondEnd)) ||
    (orientationFour === 0 &&
      pointOnSegment(firstEnd, secondStart, secondEnd));

  return allowBoundaryContact ? false : boundaryContact;
}

function squaredDistance(
  first: MarkerVoidPoint,
  second: MarkerVoidPoint,
): number {
  const deltaX = first.x - second.x;
  const deltaY = first.y - second.y;

  return deltaX * deltaX + deltaY * deltaY;
}

function squaredDistanceToSegment(
  point: MarkerVoidPoint,
  start: MarkerVoidPoint,
  end: MarkerVoidPoint,
): number {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;

  const segmentLengthSquared =
    segmentX * segmentX + segmentY * segmentY;

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

function polygonsIntersect(
  firstPolygon: ReadonlyArray<MarkerVoidPoint>,
  secondPolygon: ReadonlyArray<MarkerVoidPoint>,
  allowBoundaryContact: boolean,
): boolean {
  for (
    let firstIndex = 0;
    firstIndex < firstPolygon.length;
    firstIndex += 1
  ) {
    const firstStart = firstPolygon[firstIndex];
    const firstEnd =
      firstPolygon[(firstIndex + 1) % firstPolygon.length];

    for (
      let secondIndex = 0;
      secondIndex < secondPolygon.length;
      secondIndex += 1
    ) {
      const secondStart = secondPolygon[secondIndex];
      const secondEnd =
        secondPolygon[
          (secondIndex + 1) % secondPolygon.length
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
    pointInsidePolygon(firstPolygon[0], secondPolygon) ||
    pointInsidePolygon(secondPolygon[0], firstPolygon)
  ) {
    return true;
  }

  return false;
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

  let minimumDistance = Number.POSITIVE_INFINITY;

  for (
    let firstIndex = 0;
    firstIndex < firstPolygon.length;
    firstIndex += 1
  ) {
    const firstStart = firstPolygon[firstIndex];
    const firstEnd =
      firstPolygon[(firstIndex + 1) % firstPolygon.length];

    for (
      let secondIndex = 0;
      secondIndex < secondPolygon.length;
      secondIndex += 1
    ) {
      const secondStart = secondPolygon[secondIndex];
      const secondEnd =
        secondPolygon[
          (secondIndex + 1) % secondPolygon.length
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
          markerLength - clearance + EPSILON &&
        point.y <=
          fabricWidth - clearance + EPSILON
      );
    }

    return (
      point.x > clearance + EPSILON &&
      point.y > clearance + EPSILON &&
      point.x <
        markerLength - clearance - EPSILON &&
      point.y <
        fabricWidth - clearance - EPSILON
    );
  });
}

function polygonInsideVoid(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  voidRegion: DetectedMarkerVoid,
): boolean {
  return polygon.every(
    (point) =>
      point.x >= voidRegion.bounds.minX - EPSILON &&
      point.x <= voidRegion.bounds.maxX + EPSILON &&
      point.y >= voidRegion.bounds.minY - EPSILON &&
      point.y <= voidRegion.bounds.maxY + EPSILON,
  );
}

function minimumMarkerBoundaryDistance(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  markerLength: number,
  fabricWidth: number,
): number {
  let minimumDistance = Number.POSITIVE_INFINITY;

  for (const point of polygon) {
    minimumDistance = Math.min(
      minimumDistance,
      point.x,
      point.y,
      markerLength - point.x,
      fabricWidth - point.y,
    );
  }

  return Number.isFinite(minimumDistance)
    ? Math.max(0, minimumDistance)
    : 0;
}

function calculateCollisionScore(
  minimumDistance: number,
  requiredClearance: number,
): number {
  if (requiredClearance <= EPSILON) {
    return minimumDistance > EPSILON ? 100 : 90;
  }

  return clamp(
    (minimumDistance / requiredClearance) * 100,
    0,
    100,
  );
}

function calculateBoundaryScore(
  minimumDistance: number,
  requiredClearance: number,
): number {
  if (requiredClearance <= EPSILON) {
    return minimumDistance > EPSILON ? 100 : 90;
  }

  return clamp(
    (minimumDistance / requiredClearance) * 100,
    0,
    100,
  );
}

function calculateVoidFitScore(
  candidate: PieceVoidPlacementCandidate,
): number {
  const dimensionalBalance =
    100 -
    Math.abs(
      candidate.widthUtilisation -
        candidate.heightUtilisation,
    );

  return clamp(
    candidate.fitEfficiency * 0.7 +
      dimensionalBalance * 0.3,
    0,
    100,
  );
}

function calculateEngineeringScore(
  candidate: PieceVoidPlacementCandidate,
  collisionScore: number,
  boundaryScore: number,
  voidFitScore: number,
  recalculate: boolean,
): number {
  if (!recalculate) {
    return clamp(
      candidate.compatibilityScore,
      0,
      100,
    );
  }

  return clamp(
    candidate.compatibilityScore * 0.4 +
      collisionScore * 0.25 +
      boundaryScore * 0.15 +
      voidFitScore * 0.2,
    0,
    100,
  );
}

function comparePlacements(
  first: CollisionSafeHoleFillingPlacement,
  second: CollisionSafeHoleFillingPlacement,
): number {
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
    second.compatibilityScore !==
    first.compatibilityScore
  ) {
    return (
      second.compatibilityScore -
      first.compatibilityScore
    );
  }

  return first.id.localeCompare(second.id);
}

function createRejection(
  candidate: PieceVoidPlacementCandidate,
  reason: HoleFillingRejectionReason,
  message: string,
  collisionPlacementIds?: ReadonlyArray<string>,
): RejectedHoleFillingPlacement {
  return {
    candidateId: candidate.id,
    voidId: candidate.voidId,
    pieceId: candidate.pieceId,
    reason,
    message,
    collisionPlacementIds,
  };
}

export function validateCollisionSafeHoleFilling(
  input: CollisionSafeHoleFillingInput,
): CollisionSafeHoleFillingResult {
  const options = normaliseOptions(input.options);
  const warnings: string[] = [];
  const rejected: RejectedHoleFillingPlacement[] = [];
  const safePlacements: CollisionSafeHoleFillingPlacement[] = [];

  if (
    !Number.isFinite(input.markerLength) ||
    input.markerLength <= 0 ||
    !Number.isFinite(input.fabricWidth) ||
    input.fabricWidth <= 0
  ) {
    warnings.push(
      "Marker Length and Fabric Width must be finite numbers greater than zero.",
    );

    return {
      markerId: input.markerId,
      placements: [],
      rejected: input.compatibilityCandidates.map(
        (candidate) =>
          createRejection(
            candidate,
            "invalidMarkerDimensions",
            "The marker dimensions are invalid.",
          ),
      ),
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
        testedCandidates:
          input.compatibilityCandidates.length,
        acceptedPlacements: 0,
        rejectedPlacements:
          input.compatibilityCandidates.length,
        collisionRejections: 0,
        boundaryRejections:
          input.compatibilityCandidates.length,
        uniquePiecesAccepted: 0,
        uniqueVoidsAccepted: 0,
        averageEngineeringScore: 0,
        bestEngineeringScore: 0,
      },
      warnings,
      engineeringReady: false,
    };
  }

  const voidMap = new Map(
    input.voids.map((voidRegion) => [
      voidRegion.id,
      voidRegion,
    ]),
  );

  const pieceMap = new Map(
    input.pieces.map((piece) => [
      piece.id,
      piece,
    ]),
  );

  const existingPieceIds = new Set(
    input.existingPlacements
      .map((placement) => placement.pieceId)
      .filter(
        (pieceId): pieceId is string =>
          Boolean(pieceId),
      ),
  );

  for (const candidate of input.compatibilityCandidates) {
    const piece = pieceMap.get(candidate.pieceId);
    const voidRegion = voidMap.get(candidate.voidId);

    if (!piece) {
      rejected.push(
        createRejection(
          candidate,
          "missingPiece",
          "The source pattern piece could not be found.",
        ),
      );
      continue;
    }

    if (!voidRegion) {
      rejected.push(
        createRejection(
          candidate,
          "missingVoid",
          "The detected marker void could not be found.",
        ),
      );
      continue;
    }

    if (
      options.excludeExistingPieceIds &&
      existingPieceIds.has(candidate.pieceId)
    ) {
      rejected.push(
        createRejection(
          candidate,
          "pieceAlreadyPlaced",
          "The pattern piece already exists in the marker layout.",
        ),
      );
      continue;
    }

    if (
      candidate.proposedPolygon.length < 3 ||
      calculatePolygonArea(
        candidate.proposedPolygon,
      ) <= EPSILON ||
      !getPolygonBounds(candidate.proposedPolygon)
    ) {
      rejected.push(
        createRejection(
          candidate,
          "invalidCandidatePolygon",
          "The proposed placement polygon is invalid.",
        ),
      );
      continue;
    }

    if (
      !polygonInsideMarker(
        candidate.proposedPolygon,
        input.markerLength,
        input.fabricWidth,
        options.markerBoundaryClearance,
        options.allowMarkerBoundaryContact,
      )
    ) {
      rejected.push(
        createRejection(
          candidate,
          "outsideMarkerBoundary",
          "The proposed placement exceeds the permitted marker boundary.",
        ),
      );
      continue;
    }

    if (
      !polygonInsideVoid(
        candidate.proposedPolygon,
        voidRegion,
      )
    ) {
      rejected.push(
        createRejection(
          candidate,
          "outsideVoidBoundary",
          "The proposed placement does not remain inside the selected void.",
        ),
      );
      continue;
    }

    const collisionRecords: CollisionRecord[] = [];
    const collisionPlacementIds: string[] = [];
    let minimumExistingPieceDistance =
      Number.POSITIVE_INFINITY;

    for (const existingPlacement of input.existingPlacements) {
      if (existingPlacement.polygon.length < 3) {
        continue;
      }

      const overlapDetected = polygonsIntersect(
        candidate.proposedPolygon,
        existingPlacement.polygon,
        options.allowPieceBoundaryContact,
      );

      const minimumDistance = minimumPolygonDistance(
        candidate.proposedPolygon,
        existingPlacement.polygon,
      );

      const boundaryContactDetected =
        minimumDistance <= EPSILON &&
        !overlapDetected;

      minimumExistingPieceDistance = Math.min(
        minimumExistingPieceDistance,
        minimumDistance,
      );

      const clearanceViolation =
        minimumDistance + EPSILON <
        options.collisionClearance;

      if (overlapDetected || clearanceViolation) {
        collisionPlacementIds.push(
          existingPlacement.id,
        );
      }

      collisionRecords.push({
        existingPlacementId:
          existingPlacement.id,
        existingPieceId:
          existingPlacement.pieceId,
        candidateId: candidate.id,
        overlapDetected,
        boundaryContactDetected,
        minimumDistance,
      });
    }

    if (collisionPlacementIds.length > 0) {
      rejected.push(
        createRejection(
          candidate,
          "existingPieceCollision",
          "The proposed placement overlaps or violates clearance from an existing pattern piece.",
          collisionPlacementIds,
        ),
      );
      continue;
    }

    if (
      !Number.isFinite(minimumExistingPieceDistance)
    ) {
      minimumExistingPieceDistance =
        Math.min(
          input.markerLength,
          input.fabricWidth,
        );
    }

    const boundaryDistance =
      minimumMarkerBoundaryDistance(
        candidate.proposedPolygon,
        input.markerLength,
        input.fabricWidth,
      );

    const collisionScore =
      calculateCollisionScore(
        minimumExistingPieceDistance,
        options.collisionClearance,
      );

    const boundaryScore =
      calculateBoundaryScore(
        boundaryDistance,
        options.markerBoundaryClearance,
      );

    const voidFitScore =
      calculateVoidFitScore(candidate);

    const engineeringScore =
      calculateEngineeringScore(
        candidate,
        collisionScore,
        boundaryScore,
        voidFitScore,
        options.recalculateEngineeringScore,
      );

    if (
      engineeringScore + EPSILON <
      options.minimumEngineeringScore
    ) {
      rejected.push(
        createRejection(
          candidate,
          "engineeringScoreTooLow",
          "The final Engineering Score is below the configured minimum.",
        ),
      );
      continue;
    }

    safePlacements.push({
      id: `${candidate.id}-collision-safe`,
      markerId: input.markerId,
      candidateId: candidate.id,
      voidId: candidate.voidId,
      pieceId: candidate.pieceId,
      pieceName: candidate.pieceName,
      rotation: candidate.rotation,
      mirrored: candidate.mirrored,
      x: candidate.proposedX,
      y: candidate.proposedY,
      polygon: candidate.proposedPolygon,
      compatibilityScore:
        candidate.compatibilityScore,
      collisionScore,
      boundaryScore,
      voidFitScore,
      engineeringScore,
      collisionClearance:
        options.collisionClearance,
      markerBoundaryClearance:
        options.markerBoundaryClearance,
      minimumExistingPieceDistance,
      minimumMarkerBoundaryDistance:
        boundaryDistance,
      collisions: collisionRecords,
      collisionFree: true,
      engineeringSafe: true,
    });
  }

  const sortedPlacements =
    safePlacements.sort(comparePlacements);

  const placementsByVoid = new Map<
    string,
    CollisionSafeHoleFillingPlacement[]
  >();

  for (const placement of sortedPlacements) {
    const existing =
      placementsByVoid.get(placement.voidId) ?? [];

    if (
      existing.length <
      options.maximumPlacementsPerVoid
    ) {
      existing.push(placement);
      placementsByVoid.set(
        placement.voidId,
        existing,
      );
    }
  }

  const limitedPlacements =
    [...placementsByVoid.values()]
      .flat()
      .sort(comparePlacements)
      .slice(0, options.maximumPlacements);

  const selectedPlanPlacements:
    CollisionSafeHoleFillingPlacement[] = [];

  const usedPieceIds = new Set<string>();
  const usedVoidIds = new Set<string>();

  for (const placement of limitedPlacements) {
    if (
      options.uniquePiecePerPlacementPlan &&
      usedPieceIds.has(placement.pieceId)
    ) {
      rejected.push(
        createRejection(
          input.compatibilityCandidates.find(
            (candidate) =>
              candidate.id ===
              placement.candidateId,
          ) ?? {
            id: placement.candidateId,
            voidId: placement.voidId,
            pieceId: placement.pieceId,
          } as PieceVoidPlacementCandidate,
          "duplicatePieceSelection",
          "A higher-ranked placement already uses this pattern piece.",
        ),
      );
      continue;
    }

    if (
      options.uniqueVoidPerPlacementPlan &&
      usedVoidIds.has(placement.voidId)
    ) {
      rejected.push(
        createRejection(
          input.compatibilityCandidates.find(
            (candidate) =>
              candidate.id ===
              placement.candidateId,
          ) ?? {
            id: placement.candidateId,
            voidId: placement.voidId,
            pieceId: placement.pieceId,
          } as PieceVoidPlacementCandidate,
          "duplicateVoidSelection",
          "A higher-ranked placement already uses this detected void.",
        ),
      );
      continue;
    }

    selectedPlanPlacements.push(placement);
    usedPieceIds.add(placement.pieceId);
    usedVoidIds.add(placement.voidId);
  }

  const totalPieceArea =
    selectedPlanPlacements.reduce(
      (total, placement) => {
        const candidate =
          input.compatibilityCandidates.find(
            (item) =>
              item.id === placement.candidateId,
          );

        return total + (candidate?.pieceArea ?? 0);
      },
      0,
    );

  const totalVoidArea =
    selectedPlanPlacements.reduce(
      (total, placement) => {
        const voidRegion =
          voidMap.get(placement.voidId);

        return total + (voidRegion?.area ?? 0);
      },
      0,
    );

  const totalEngineeringScore =
    selectedPlanPlacements.reduce(
      (total, placement) =>
        total + placement.engineeringScore,
      0,
    );

  const averageEngineeringScore =
    selectedPlanPlacements.length === 0
      ? 0
      : totalEngineeringScore /
        selectedPlanPlacements.length;

  const bestEngineeringScore =
    selectedPlanPlacements[0]
      ?.engineeringScore ?? 0;

  if (input.compatibilityCandidates.length === 0) {
    warnings.push(
      "No piece-to-void compatibility candidates were supplied.",
    );
  }

  if (
    input.compatibilityCandidates.length > 0 &&
    selectedPlanPlacements.length === 0
  ) {
    warnings.push(
      "No collision-safe Hole Filling placement passed engineering validation.",
    );
  }

  const collisionRejections =
    rejected.filter(
      (rejection) =>
        rejection.reason ===
        "existingPieceCollision",
    ).length;

  const boundaryRejections =
    rejected.filter(
      (rejection) =>
        rejection.reason ===
          "outsideMarkerBoundary" ||
        rejection.reason ===
          "outsideVoidBoundary",
    ).length;

  return {
    markerId: input.markerId,
    placements: limitedPlacements,
    rejected,
    plan: {
      placements: selectedPlanPlacements,
      usedPieceIds: [...usedPieceIds],
      usedVoidIds: [...usedVoidIds],
      totalPieceArea,
      totalVoidArea,
      estimatedRecoveredArea: totalPieceArea,
      averageEngineeringScore,
      bestEngineeringScore,
    },
    statistics: {
      testedCandidates:
        input.compatibilityCandidates.length,
      acceptedPlacements:
        limitedPlacements.length,
      rejectedPlacements:
        rejected.length,
      collisionRejections,
      boundaryRejections,
      uniquePiecesAccepted:
        new Set(
          limitedPlacements.map(
            (placement) => placement.pieceId,
          ),
        ).size,
      uniqueVoidsAccepted:
        new Set(
          limitedPlacements.map(
            (placement) => placement.voidId,
          ),
        ).size,
      averageEngineeringScore:
        limitedPlacements.length === 0
          ? 0
          : limitedPlacements.reduce(
              (total, placement) =>
                total +
                placement.engineeringScore,
              0,
            ) / limitedPlacements.length,
      bestEngineeringScore:
        limitedPlacements[0]
          ?.engineeringScore ?? 0,
    },
    warnings,
    engineeringReady:
      selectedPlanPlacements.length > 0,
  };
}

export function getBestCollisionSafePlacement(
  result: CollisionSafeHoleFillingResult,
): CollisionSafeHoleFillingPlacement | null {
  return result.placements[0] ?? null;
}

export function getCollisionSafePlacementsForVoid(
  result: CollisionSafeHoleFillingResult,
  voidId: string,
): ReadonlyArray<CollisionSafeHoleFillingPlacement> {
  return result.placements.filter(
    (placement) =>
      placement.voidId === voidId,
  );
}

export function getCollisionSafePlacementsForPiece(
  result: CollisionSafeHoleFillingResult,
  pieceId: string,
): ReadonlyArray<CollisionSafeHoleFillingPlacement> {
  return result.placements.filter(
    (placement) =>
      placement.pieceId === pieceId,
  );
}

export function filterCollisionSafePlacements(
  placements: ReadonlyArray<CollisionSafeHoleFillingPlacement>,
  minimumEngineeringScore: number,
): ReadonlyArray<CollisionSafeHoleFillingPlacement> {
  const minimumScore = clamp(
    minimumEngineeringScore,
    0,
    100,
  );

  return placements.filter(
    (placement) =>
      placement.engineeringScore +
        EPSILON >=
      minimumScore,
  );
}