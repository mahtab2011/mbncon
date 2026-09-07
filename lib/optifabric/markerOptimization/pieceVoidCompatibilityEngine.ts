/**
 * OptiFabric AI
 * RC5-004-002 — Piece-to-Void Compatibility Engine
 *
 * Purpose:
 * - Match candidate pattern pieces with detected marker voids.
 * - Respect dimensions, rotation rules, grain-line restrictions and clearance.
 * - Rank engineering-safe piece-to-void combinations.
 * - Prepare insertion candidates without moving any pattern piece.
 */

import type {
  DetectedMarkerVoid,
  MarkerVoidBounds,
  MarkerVoidPoint,
} from "./markerVoidDetectionEngine";

export interface CompatibilityPatternPiece {
  readonly id: string;
  readonly name?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;

  /**
   * Existing marker position.
   *
   * These values are informational only. This engine does not move the piece.
   */
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;

  /**
   * Permitted rotations in degrees.
   *
   * Example:
   * [0, 180] for directional fabric.
   * [0, 90, 180, 270] for non-directional fabric.
   */
  readonly allowedRotations?: ReadonlyArray<number>;

  /**
   * Prevents any rotation other than the current/base orientation.
   */
  readonly rotationLocked?: boolean;

  /**
   * Indicates that the piece must preserve its grain direction.
   */
  readonly grainLineLocked?: boolean;

  /**
   * Grain-line angle in degrees relative to the piece coordinate system.
   */
  readonly grainLineAngle?: number;

  /**
   * Maximum permitted grain-line deviation from the marker length direction.
   */
  readonly maximumGrainDeviation?: number;

  /**
   * Optional quantity available for hole-filling consideration.
   */
  readonly availableQuantity?: number;

  /**
   * Pieces already committed or locked elsewhere should not be considered.
   */
  readonly locked?: boolean;

  /**
   * Optional commercial or engineering priority.
   *
   * Higher values increase ranking.
   */
  readonly priority?: number;

  /**
   * Optional piece category for reporting and future rule engines.
   */
  readonly category?: string;
}

export interface PieceVoidCompatibilityOptions {
  /**
   * Required free distance around the pattern piece.
   */
  readonly clearance?: number;

  /**
   * Minimum acceptable unused-area efficiency after insertion.
   */
  readonly minimumFitEfficiency?: number;

  /**
   * Maximum number of candidates returned for each void.
   */
  readonly maximumCandidatesPerVoid?: number;

  /**
   * Maximum total candidate count returned.
   */
  readonly maximumTotalCandidates?: number;

  /**
   * Whether mirrored placement is allowed.
   *
   * Mirroring is analysed as a compatibility state only.
   */
  readonly allowMirroring?: boolean;

  /**
   * Whether rectangular-envelope fitting is sufficient.
   *
   * When false, polygon containment checks are also performed.
   */
  readonly allowEnvelopeOnlyFit?: boolean;

  /**
   * Permit pieces to touch the effective void boundary after clearance.
   */
  readonly allowBoundaryContact?: boolean;

  /**
   * Reject pieces with missing or invalid polygons.
   */
  readonly rejectInvalidPieces?: boolean;

  /**
   * Exclude edge-connected voids and use internal holes only.
   */
  readonly internalVoidsOnly?: boolean;

  /**
   * Preferred rotations may receive a scoring bonus.
   */
  readonly preferredRotations?: ReadonlyArray<number>;
}

export interface PieceVoidCompatibilityInput {
  readonly markerId?: string;
  readonly voids: ReadonlyArray<DetectedMarkerVoid>;
  readonly pieces: ReadonlyArray<CompatibilityPatternPiece>;
  readonly options?: PieceVoidCompatibilityOptions;
}

export type PieceVoidFitType =
  | "direct"
  | "rotated"
  | "mirrored"
  | "rotatedMirrored";

export type PieceVoidRejectionReason =
  | "invalidPiece"
  | "pieceLocked"
  | "noAvailableQuantity"
  | "voidNotUsable"
  | "voidTypeRejected"
  | "pieceTooWide"
  | "pieceTooHigh"
  | "pieceTooLarge"
  | "rotationNotAllowed"
  | "grainLineViolation"
  | "clearanceViolation"
  | "polygonOutsideVoid"
  | "fitEfficiencyTooLow";

export interface PieceGeometryEnvelope {
  readonly bounds: MarkerVoidBounds;
  readonly width: number;
  readonly height: number;
  readonly area: number;
  readonly polygonArea: number;
  readonly centre: MarkerVoidPoint;
}

export interface PieceVoidPlacementCandidate {
  readonly id: string;
  readonly markerId?: string;
  readonly voidId: string;
  readonly pieceId: string;
  readonly pieceName?: string;
  readonly fitType: PieceVoidFitType;
  readonly rotation: number;
  readonly mirrored: boolean;

  /**
   * Proposed marker-space position of the transformed polygon origin.
   */
  readonly proposedX: number;
  readonly proposedY: number;

  /**
   * Final transformed polygon in marker coordinates.
   */
  readonly proposedPolygon: ReadonlyArray<MarkerVoidPoint>;

  readonly pieceEnvelope: PieceGeometryEnvelope;
  readonly requiredWidth: number;
  readonly requiredHeight: number;
  readonly voidWidth: number;
  readonly voidHeight: number;
  readonly pieceArea: number;
  readonly voidArea: number;
  readonly unusedAreaAfterPlacement: number;
  readonly fitEfficiency: number;
  readonly widthUtilisation: number;
  readonly heightUtilisation: number;
  readonly grainLineDeviation: number;
  readonly clearance: number;
  readonly compatibilityScore: number;
  readonly engineeringSafe: boolean;
}

export interface RejectedPieceVoidCombination {
  readonly voidId: string;
  readonly pieceId: string;
  readonly rotation?: number;
  readonly mirrored?: boolean;
  readonly reason: PieceVoidRejectionReason;
  readonly message: string;
}

export interface PieceVoidCompatibilityStatistics {
  readonly testedVoids: number;
  readonly testedPieces: number;
  readonly testedCombinations: number;
  readonly acceptedCandidates: number;
  readonly rejectedCombinations: number;
  readonly piecesWithCandidates: number;
  readonly voidsWithCandidates: number;
  readonly bestCompatibilityScore: number;
  readonly averageCompatibilityScore: number;
}

export interface PieceVoidCompatibilityResult {
  readonly markerId?: string;
  readonly candidates: ReadonlyArray<PieceVoidPlacementCandidate>;
  readonly candidatesByVoid: Readonly<
    Record<string, ReadonlyArray<PieceVoidPlacementCandidate>>
  >;
  readonly rejected: ReadonlyArray<RejectedPieceVoidCombination>;
  readonly statistics: PieceVoidCompatibilityStatistics;
  readonly warnings: ReadonlyArray<string>;
  readonly engineeringReady: boolean;
}

interface NormalisedCompatibilityOptions {
  readonly clearance: number;
  readonly minimumFitEfficiency: number;
  readonly maximumCandidatesPerVoid: number;
  readonly maximumTotalCandidates: number;
  readonly allowMirroring: boolean;
  readonly allowEnvelopeOnlyFit: boolean;
  readonly allowBoundaryContact: boolean;
  readonly rejectInvalidPieces: boolean;
  readonly internalVoidsOnly: boolean;
  readonly preferredRotations: ReadonlyArray<number>;
}

interface EvaluatedPieceState {
  readonly piece: CompatibilityPatternPiece;
  readonly rotation: number;
  readonly mirrored: boolean;
  readonly fitType: PieceVoidFitType;
  readonly localPolygon: ReadonlyArray<MarkerVoidPoint>;
  readonly envelope: PieceGeometryEnvelope;
  readonly grainLineDeviation: number;
}

const EPSILON = 1e-8;
const DEFAULT_CLEARANCE = 0;
const DEFAULT_MINIMUM_FIT_EFFICIENCY = 5;
const DEFAULT_MAXIMUM_CANDIDATES_PER_VOID = 25;
const DEFAULT_MAXIMUM_TOTAL_CANDIDATES = 250;

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normaliseAngle(angle: number): number {
  const normalised = angle % 360;
  return normalised < 0 ? normalised + 360 : normalised;
}

function smallestAngularDifference(
  firstAngle: number,
  secondAngle: number,
): number {
  const difference = Math.abs(
    normaliseAngle(firstAngle) - normaliseAngle(secondAngle),
  );

  return Math.min(difference, 360 - difference);
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
  options: PieceVoidCompatibilityOptions | undefined,
): NormalisedCompatibilityOptions {
  return {
    clearance: finiteNonNegative(
      options?.clearance,
      DEFAULT_CLEARANCE,
    ),
    minimumFitEfficiency: clamp(
      finiteNonNegative(
        options?.minimumFitEfficiency,
        DEFAULT_MINIMUM_FIT_EFFICIENCY,
      ),
      0,
      100,
    ),
    maximumCandidatesPerVoid: finitePositiveInteger(
      options?.maximumCandidatesPerVoid,
      DEFAULT_MAXIMUM_CANDIDATES_PER_VOID,
    ),
    maximumTotalCandidates: finitePositiveInteger(
      options?.maximumTotalCandidates,
      DEFAULT_MAXIMUM_TOTAL_CANDIDATES,
    ),
    allowMirroring: options?.allowMirroring ?? false,
    allowEnvelopeOnlyFit:
      options?.allowEnvelopeOnlyFit ?? false,
    allowBoundaryContact:
      options?.allowBoundaryContact ?? true,
    rejectInvalidPieces:
      options?.rejectInvalidPieces ?? true,
    internalVoidsOnly:
      options?.internalVoidsOnly ?? false,
    preferredRotations:
      options?.preferredRotations?.map(normaliseAngle) ?? [0],
  };
}

function rotatePoint(
  point: MarkerVoidPoint,
  rotation: number,
): MarkerVoidPoint {
  const radians = (rotation * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);

  return {
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
  };
}

function mirrorPoint(
  point: MarkerVoidPoint,
): MarkerVoidPoint {
  return {
    x: -point.x,
    y: point.y,
  };
}

function transformLocalPolygon(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  rotation: number,
  mirrored: boolean,
): ReadonlyArray<MarkerVoidPoint> {
  return polygon.map((point) => {
    const mirroredPoint = mirrored
      ? mirrorPoint(point)
      : point;

    return rotatePoint(
      mirroredPoint,
      rotation,
    );
  });
}

function getPolygonBounds(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): MarkerVoidBounds | null {
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

function createEnvelope(
  polygon: ReadonlyArray<MarkerVoidPoint>,
): PieceGeometryEnvelope | null {
  const bounds = getPolygonBounds(polygon);

  if (!bounds) {
    return null;
  }

  const width = Math.max(
    0,
    bounds.maxX - bounds.minX,
  );

  const height = Math.max(
    0,
    bounds.maxY - bounds.minY,
  );

  const area = width * height;
  const polygonArea = calculatePolygonArea(polygon);

  if (
    width <= EPSILON ||
    height <= EPSILON ||
    polygonArea <= EPSILON
  ) {
    return null;
  }

  return {
    bounds,
    width,
    height,
    area,
    polygonArea,
    centre: {
      x: bounds.minX + width / 2,
      y: bounds.minY + height / 2,
    },
  };
}

function resolveAllowedRotations(
  piece: CompatibilityPatternPiece,
): ReadonlyArray<number> {
  const currentRotation = normaliseAngle(
    piece.rotation ?? 0,
  );

  if (piece.rotationLocked) {
    return [currentRotation];
  }

  const suppliedRotations =
    piece.allowedRotations?.length
      ? piece.allowedRotations
      : [0, 90, 180, 270];

  return Array.from(
    new Set(
      suppliedRotations.map(normaliseAngle),
    ),
  );
}

function calculateGrainLineDeviation(
  piece: CompatibilityPatternPiece,
  rotation: number,
  mirrored: boolean,
): number {
  const baseGrainAngle =
    piece.grainLineAngle ?? 0;

  const mirroredGrainAngle = mirrored
    ? 180 - baseGrainAngle
    : baseGrainAngle;

  const finalGrainAngle = normaliseAngle(
    mirroredGrainAngle + rotation,
  );

  const parallelDeviation =
    smallestAngularDifference(
      finalGrainAngle,
      0,
    );

  const reverseParallelDeviation =
    smallestAngularDifference(
      finalGrainAngle,
      180,
    );

  return Math.min(
    parallelDeviation,
    reverseParallelDeviation,
  );
}

function grainLineIsValid(
  piece: CompatibilityPatternPiece,
  deviation: number,
): boolean {
  if (!piece.grainLineLocked) {
    return true;
  }

  const maximumDeviation =
    piece.maximumGrainDeviation ?? 0;

  return deviation <=
    Math.max(0, maximumDeviation) + EPSILON;
}

function getFitType(
  rotation: number,
  mirrored: boolean,
): PieceVoidFitType {
  const rotated =
    Math.abs(normaliseAngle(rotation)) > EPSILON;

  if (rotated && mirrored) {
    return "rotatedMirrored";
  }

  if (rotated) {
    return "rotated";
  }

  if (mirrored) {
    return "mirrored";
  }

  return "direct";
}

function createPieceStates(
  piece: CompatibilityPatternPiece,
  options: NormalisedCompatibilityOptions,
): ReadonlyArray<EvaluatedPieceState> {
  const states: EvaluatedPieceState[] = [];
  const rotations = resolveAllowedRotations(piece);
  const mirrorStates = options.allowMirroring
    ? [false, true]
    : [false];

  for (const mirrored of mirrorStates) {
    for (const rotation of rotations) {
      const localPolygon = transformLocalPolygon(
        piece.polygon,
        rotation,
        mirrored,
      );

      const envelope = createEnvelope(localPolygon);

      if (!envelope) {
        continue;
      }

      const grainLineDeviation =
        calculateGrainLineDeviation(
          piece,
          rotation,
          mirrored,
        );

      states.push({
        piece,
        rotation,
        mirrored,
        fitType: getFitType(
          rotation,
          mirrored,
        ),
        localPolygon,
        envelope,
        grainLineDeviation,
      });
    }
  }

  return states;
}

function translatePolygon(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  offsetX: number,
  offsetY: number,
): ReadonlyArray<MarkerVoidPoint> {
  return polygon.map((point) => ({
    x: point.x + offsetX,
    y: point.y + offsetY,
  }));
}

function pointInsideRectangle(
  point: MarkerVoidPoint,
  bounds: MarkerVoidBounds,
  allowBoundaryContact: boolean,
): boolean {
  if (allowBoundaryContact) {
    return (
      point.x >= bounds.minX - EPSILON &&
      point.x <= bounds.maxX + EPSILON &&
      point.y >= bounds.minY - EPSILON &&
      point.y <= bounds.maxY + EPSILON
    );
  }

  return (
    point.x > bounds.minX + EPSILON &&
    point.x < bounds.maxX - EPSILON &&
    point.y > bounds.minY + EPSILON &&
    point.y < bounds.maxY - EPSILON
  );
}

function polygonInsideRectangle(
  polygon: ReadonlyArray<MarkerVoidPoint>,
  bounds: MarkerVoidBounds,
  allowBoundaryContact: boolean,
): boolean {
  return polygon.every((point) =>
    pointInsideRectangle(
      point,
      bounds,
      allowBoundaryContact,
    ),
  );
}

function createEffectiveVoidBounds(
  voidRegion: DetectedMarkerVoid,
  clearance: number,
): MarkerVoidBounds {
  return {
    minX: voidRegion.bounds.minX + clearance,
    minY: voidRegion.bounds.minY + clearance,
    maxX: voidRegion.bounds.maxX - clearance,
    maxY: voidRegion.bounds.maxY - clearance,
  };
}

function isValidBounds(
  bounds: MarkerVoidBounds,
): boolean {
  return (
    bounds.maxX - bounds.minX > EPSILON &&
    bounds.maxY - bounds.minY > EPSILON
  );
}

function calculatePreferredRotationScore(
  rotation: number,
  preferredRotations: ReadonlyArray<number>,
): number {
  if (preferredRotations.length === 0) {
    return 50;
  }

  const bestDifference = Math.min(
    ...preferredRotations.map(
      (preferredRotation) =>
        smallestAngularDifference(
          rotation,
          preferredRotation,
        ),
    ),
  );

  return clamp(
    100 - (bestDifference / 180) * 100,
    0,
    100,
  );
}

function calculateCompatibilityScore(
  fitEfficiency: number,
  widthUtilisation: number,
  heightUtilisation: number,
  voidPriority: number,
  piecePriority: number,
  grainLineDeviation: number,
  rotationPreferenceScore: number,
  mirrored: boolean,
): number {
  const dimensionalBalance =
    100 -
    Math.abs(
      widthUtilisation - heightUtilisation,
    );

  const normalisedPiecePriority =
    clamp(piecePriority, 0, 100);

  const grainScore =
    clamp(
      100 -
        (grainLineDeviation / 90) * 100,
      0,
      100,
    );

  const mirrorPenalty = mirrored ? 5 : 0;

  return clamp(
    fitEfficiency * 0.3 +
      dimensionalBalance * 0.15 +
      voidPriority * 0.15 +
      normalisedPiecePriority * 0.1 +
      grainScore * 0.15 +
      rotationPreferenceScore * 0.15 -
      mirrorPenalty,
    0,
    100,
  );
}

function buildCandidate(
  state: EvaluatedPieceState,
  voidRegion: DetectedMarkerVoid,
  options: NormalisedCompatibilityOptions,
  markerId: string | undefined,
): PieceVoidPlacementCandidate | null {
  const effectiveBounds =
    createEffectiveVoidBounds(
      voidRegion,
      options.clearance,
    );

  if (!isValidBounds(effectiveBounds)) {
    return null;
  }

  const effectiveWidth =
    effectiveBounds.maxX -
    effectiveBounds.minX;

  const effectiveHeight =
    effectiveBounds.maxY -
    effectiveBounds.minY;

  const requiredWidth =
    state.envelope.width;

  const requiredHeight =
    state.envelope.height;

  const proposedX =
    effectiveBounds.minX -
    state.envelope.bounds.minX +
    (effectiveWidth - requiredWidth) / 2;

  const proposedY =
    effectiveBounds.minY -
    state.envelope.bounds.minY +
    (effectiveHeight - requiredHeight) / 2;

  const proposedPolygon =
    translatePolygon(
      state.localPolygon,
      proposedX,
      proposedY,
    );

  if (
    !options.allowEnvelopeOnlyFit &&
    !polygonInsideRectangle(
      proposedPolygon,
      effectiveBounds,
      options.allowBoundaryContact,
    )
  ) {
    return null;
  }

  const pieceArea =
    state.envelope.polygonArea;

  const voidArea =
    voidRegion.area;

  const unusedAreaAfterPlacement =
    Math.max(0, voidArea - pieceArea);

  const fitEfficiency =
    voidArea <= EPSILON
      ? 0
      : clamp(
          (pieceArea / voidArea) * 100,
          0,
          100,
        );

  const widthUtilisation =
    effectiveWidth <= EPSILON
      ? 0
      : clamp(
          (requiredWidth / effectiveWidth) *
            100,
          0,
          100,
        );

  const heightUtilisation =
    effectiveHeight <= EPSILON
      ? 0
      : clamp(
          (requiredHeight /
            effectiveHeight) *
            100,
          0,
          100,
        );

  const rotationPreferenceScore =
    calculatePreferredRotationScore(
      state.rotation,
      options.preferredRotations,
    );

  const compatibilityScore =
    calculateCompatibilityScore(
      fitEfficiency,
      widthUtilisation,
      heightUtilisation,
      voidRegion.fillPriorityScore,
      state.piece.priority ?? 50,
      state.grainLineDeviation,
      rotationPreferenceScore,
      state.mirrored,
    );

  return {
    id: [
      markerId ?? "marker",
      voidRegion.id,
      state.piece.id,
      normaliseAngle(state.rotation),
      state.mirrored ? "mirrored" : "standard",
    ].join("-"),
    markerId,
    voidId: voidRegion.id,
    pieceId: state.piece.id,
    pieceName: state.piece.name,
    fitType: state.fitType,
    rotation: normaliseAngle(
      state.rotation,
    ),
    mirrored: state.mirrored,
    proposedX,
    proposedY,
    proposedPolygon,
    pieceEnvelope: state.envelope,
    requiredWidth,
    requiredHeight,
    voidWidth: voidRegion.width,
    voidHeight: voidRegion.height,
    pieceArea,
    voidArea,
    unusedAreaAfterPlacement,
    fitEfficiency,
    widthUtilisation,
    heightUtilisation,
    grainLineDeviation:
      state.grainLineDeviation,
    clearance: options.clearance,
    compatibilityScore,
    engineeringSafe: true,
  };
}

function createRejection(
  voidId: string,
  pieceId: string,
  reason: PieceVoidRejectionReason,
  message: string,
  rotation?: number,
  mirrored?: boolean,
): RejectedPieceVoidCombination {
  return {
    voidId,
    pieceId,
    rotation,
    mirrored,
    reason,
    message,
  };
}

function compareCandidates(
  first: PieceVoidPlacementCandidate,
  second: PieceVoidPlacementCandidate,
): number {
  if (
    second.compatibilityScore !==
    first.compatibilityScore
  ) {
    return (
      second.compatibilityScore -
      first.compatibilityScore
    );
  }

  if (
    second.fitEfficiency !==
    first.fitEfficiency
  ) {
    return (
      second.fitEfficiency -
      first.fitEfficiency
    );
  }

  if (
    first.unusedAreaAfterPlacement !==
    second.unusedAreaAfterPlacement
  ) {
    return (
      first.unusedAreaAfterPlacement -
      second.unusedAreaAfterPlacement
    );
  }

  return first.pieceId.localeCompare(
    second.pieceId,
  );
}

/**
 * Evaluates every supplied piece against every supplied void.
 */
export function evaluatePieceVoidCompatibility(
  input: PieceVoidCompatibilityInput,
): PieceVoidCompatibilityResult {
  const options = normaliseOptions(
    input.options,
  );

  const warnings: string[] = [];
  const rejected: RejectedPieceVoidCombination[] = [];
  const acceptedCandidates: PieceVoidPlacementCandidate[] = [];

  let testedCombinations = 0;

  if (!Array.isArray(input.voids)) {
    warnings.push(
      "Detected marker voids must be supplied as an array.",
    );
  }

  if (!Array.isArray(input.pieces)) {
    warnings.push(
      "Pattern pieces must be supplied as an array.",
    );
  }

  for (const voidRegion of input.voids ?? []) {
    if (!voidRegion.engineeringUsable) {
      for (const piece of input.pieces ?? []) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "voidNotUsable",
            "The detected void is not marked as engineering usable.",
          ),
        );
      }

      continue;
    }

    if (
      options.internalVoidsOnly &&
      voidRegion.type !== "internal"
    ) {
      for (const piece of input.pieces ?? []) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "voidTypeRejected",
            "The void was rejected because internal-hole analysis is enabled.",
          ),
        );
      }

      continue;
    }

    const effectiveBounds =
      createEffectiveVoidBounds(
        voidRegion,
        options.clearance,
      );

    if (!isValidBounds(effectiveBounds)) {
      for (const piece of input.pieces ?? []) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "clearanceViolation",
            "The configured clearance consumes the available void dimensions.",
          ),
        );
      }

      continue;
    }

    const effectiveWidth =
      effectiveBounds.maxX -
      effectiveBounds.minX;

    const effectiveHeight =
      effectiveBounds.maxY -
      effectiveBounds.minY;

    for (const piece of input.pieces ?? []) {
      if (piece.locked) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "pieceLocked",
            "The pattern piece is locked and cannot be considered for relocation.",
          ),
        );

        continue;
      }

      if (
        piece.availableQuantity !== undefined &&
        piece.availableQuantity <= 0
      ) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "noAvailableQuantity",
            "No available quantity remains for this pattern piece.",
          ),
        );

        continue;
      }

      const baseEnvelope =
        createEnvelope(piece.polygon);

      if (!baseEnvelope) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "invalidPiece",
            "The pattern piece polygon is invalid or has no measurable area.",
          ),
        );

        if (options.rejectInvalidPieces) {
          continue;
        }
      }

      const states = createPieceStates(
        piece,
        options,
      );

      if (states.length === 0) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "invalidPiece",
            "No valid transformed geometry could be created for the pattern piece.",
          ),
        );

        continue;
      }

      let pieceAcceptedForVoid = false;

      for (const state of states) {
        testedCombinations += 1;

        if (
          !grainLineIsValid(
            piece,
            state.grainLineDeviation,
          )
        ) {
          rejected.push(
            createRejection(
              voidRegion.id,
              piece.id,
              "grainLineViolation",
              "The proposed rotation violates the permitted Grain Line deviation.",
              state.rotation,
              state.mirrored,
            ),
          );

          continue;
        }

        if (
          state.envelope.width >
          effectiveWidth + EPSILON
        ) {
          rejected.push(
            createRejection(
              voidRegion.id,
              piece.id,
              "pieceTooWide",
              "The transformed piece width exceeds the effective void width.",
              state.rotation,
              state.mirrored,
            ),
          );

          continue;
        }

        if (
          state.envelope.height >
          effectiveHeight + EPSILON
        ) {
          rejected.push(
            createRejection(
              voidRegion.id,
              piece.id,
              "pieceTooHigh",
              "The transformed piece height exceeds the effective void height.",
              state.rotation,
              state.mirrored,
            ),
          );

          continue;
        }

        if (
          state.envelope.polygonArea >
          voidRegion.area + EPSILON
        ) {
          rejected.push(
            createRejection(
              voidRegion.id,
              piece.id,
              "pieceTooLarge",
              "The pattern piece area exceeds the detected void area.",
              state.rotation,
              state.mirrored,
            ),
          );

          continue;
        }

        const candidate = buildCandidate(
          state,
          voidRegion,
          options,
          input.markerId,
        );

        if (!candidate) {
          rejected.push(
            createRejection(
              voidRegion.id,
              piece.id,
              "polygonOutsideVoid",
              "The transformed pattern polygon does not remain inside the effective void boundary.",
              state.rotation,
              state.mirrored,
            ),
          );

          continue;
        }

        if (
          candidate.fitEfficiency +
            EPSILON <
          options.minimumFitEfficiency
        ) {
          rejected.push(
            createRejection(
              voidRegion.id,
              piece.id,
              "fitEfficiencyTooLow",
              "The piece-to-void area efficiency is below the configured minimum.",
              state.rotation,
              state.mirrored,
            ),
          );

          continue;
        }

        acceptedCandidates.push(candidate);
        pieceAcceptedForVoid = true;
      }

      if (
        !pieceAcceptedForVoid &&
        states.every(
          (state) =>
            !resolveAllowedRotations(piece).includes(
              normaliseAngle(
                state.rotation,
              ),
            ),
        )
      ) {
        rejected.push(
          createRejection(
            voidRegion.id,
            piece.id,
            "rotationNotAllowed",
            "No permitted rotation produced a valid piece-to-void fit.",
          ),
        );
      }
    }
  }

  const sortedCandidates =
    acceptedCandidates.sort(compareCandidates);

  const candidatesByVoid: Record<
    string,
    PieceVoidPlacementCandidate[]
  > = {};

  for (const candidate of sortedCandidates) {
    const existing =
      candidatesByVoid[candidate.voidId] ?? [];

    if (
      existing.length <
      options.maximumCandidatesPerVoid
    ) {
      existing.push(candidate);
      candidatesByVoid[candidate.voidId] =
        existing;
    }
  }

  const limitedCandidates =
    Object.values(candidatesByVoid)
      .flat()
      .sort(compareCandidates)
      .slice(
        0,
        options.maximumTotalCandidates,
      );

  const finalCandidateIds = new Set(
    limitedCandidates.map(
      (candidate) => candidate.id,
    ),
  );

  const limitedCandidatesByVoid =
    Object.fromEntries(
      Object.entries(candidatesByVoid)
        .map(([voidId, candidates]) => [
          voidId,
          candidates.filter((candidate) =>
            finalCandidateIds.has(candidate.id),
          ),
        ])
        .filter(
          ([, candidates]) =>
            (
              candidates as PieceVoidPlacementCandidate[]
            ).length > 0,
        ),
    ) as Record<
      string,
      ReadonlyArray<PieceVoidPlacementCandidate>
    >;

  const uniquePieceIds = new Set(
    limitedCandidates.map(
      (candidate) => candidate.pieceId,
    ),
  );

  const uniqueVoidIds = new Set(
    limitedCandidates.map(
      (candidate) => candidate.voidId,
    ),
  );

  const totalScore =
    limitedCandidates.reduce(
      (total, candidate) =>
        total +
        candidate.compatibilityScore,
      0,
    );

  if (input.voids.length === 0) {
    warnings.push(
      "No detected marker voids were supplied.",
    );
  }

  if (input.pieces.length === 0) {
    warnings.push(
      "No pattern pieces were supplied for compatibility analysis.",
    );
  }

  if (
    input.voids.length > 0 &&
    input.pieces.length > 0 &&
    limitedCandidates.length === 0
  ) {
    warnings.push(
      "No engineering-safe piece-to-void compatibility candidate was found.",
    );
  }

  return {
    markerId: input.markerId,
    candidates: limitedCandidates,
    candidatesByVoid:
      limitedCandidatesByVoid,
    rejected,
    statistics: {
      testedVoids: input.voids.length,
      testedPieces: input.pieces.length,
      testedCombinations,
      acceptedCandidates:
        limitedCandidates.length,
      rejectedCombinations:
        rejected.length,
      piecesWithCandidates:
        uniquePieceIds.size,
      voidsWithCandidates:
        uniqueVoidIds.size,
      bestCompatibilityScore:
        limitedCandidates[0]
          ?.compatibilityScore ?? 0,
      averageCompatibilityScore:
        limitedCandidates.length === 0
          ? 0
          : totalScore /
            limitedCandidates.length,
    },
    warnings,
    engineeringReady:
      limitedCandidates.length > 0,
  };
}

/**
 * Returns all candidates for one detected void.
 */
export function getCandidatesForVoid(
  result: PieceVoidCompatibilityResult,
  voidId: string,
): ReadonlyArray<PieceVoidPlacementCandidate> {
  return result.candidatesByVoid[voidId] ?? [];
}

/**
 * Returns all candidates involving one pattern piece.
 */
export function getCandidatesForPiece(
  result: PieceVoidCompatibilityResult,
  pieceId: string,
): ReadonlyArray<PieceVoidPlacementCandidate> {
  return result.candidates.filter(
    (candidate) =>
      candidate.pieceId === pieceId,
  );
}

/**
 * Returns the highest-ranked compatibility candidate.
 */
export function getBestPieceVoidCandidate(
  result: PieceVoidCompatibilityResult,
): PieceVoidPlacementCandidate | null {
  return result.candidates[0] ?? null;
}

/**
 * Returns only candidates meeting a minimum compatibility score.
 */
export function filterCompatibilityCandidates(
  candidates: ReadonlyArray<PieceVoidPlacementCandidate>,
  minimumCompatibilityScore: number,
): ReadonlyArray<PieceVoidPlacementCandidate> {
  const minimumScore = clamp(
    minimumCompatibilityScore,
    0,
    100,
  );

  return candidates.filter(
    (candidate) =>
      candidate.compatibilityScore +
        EPSILON >=
      minimumScore,
  );
}

/**
 * Returns one best candidate for each void.
 */
export function getBestCandidatePerVoid(
  result: PieceVoidCompatibilityResult,
): ReadonlyArray<PieceVoidPlacementCandidate> {
  return Object.values(
    result.candidatesByVoid,
  )
    .map((candidates) => candidates[0])
    .filter(
      (
        candidate,
      ): candidate is PieceVoidPlacementCandidate =>
        Boolean(candidate),
    )
    .sort(compareCandidates);
}

/**
 * Returns one best candidate for each pattern piece.
 */
export function getBestCandidatePerPiece(
  result: PieceVoidCompatibilityResult,
): ReadonlyArray<PieceVoidPlacementCandidate> {
  const bestByPiece = new Map<
    string,
    PieceVoidPlacementCandidate
  >();

  for (const candidate of result.candidates) {
    const current =
      bestByPiece.get(candidate.pieceId);

    if (
      !current ||
      compareCandidates(
        candidate,
        current,
      ) < 0
    ) {
      bestByPiece.set(
        candidate.pieceId,
        candidate,
      );
    }
  }

  return [...bestByPiece.values()].sort(
    compareCandidates,
  );
}