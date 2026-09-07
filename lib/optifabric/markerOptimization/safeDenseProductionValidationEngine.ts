/**
 * OptiFabric AI
 * RC5-004-012A — Safe Dense Production Validation Engine
 *
 * Purpose:
 * - Independently validate Safe Dense Repacking solutions.
 * - Never trust utilisation or "Engineering Ready" status by itself.
 * - Verify physical marker validity before Production Safety Gate release.
 *
 * Validation hierarchy:
 *
 * Geometry Integrity
 * ↓
 * Piece Completeness
 * ↓
 * Rotation Compliance
 * ↓
 * Grain / Rotation Lock Compliance
 * ↓
 * Fabric Width Boundary
 * ↓
 * Marker Length Boundary
 * ↓
 * Exact Polygon Collision
 * ↓
 * Cutting Gap
 * ↓
 * Utilisation Sanity
 * ↓
 * Production Validation Decision
 *
 * IMPORTANT:
 *
 * A 100% utilisation result is only a mathematical candidate until
 * every critical production validation check passes.
 */

import type {
  SafeDensePlacement,
  SafeDenseRepackingSolution,
  SafeDenseRotation,
  SafeDenseSourcePiece,
} from "./safeDenseRepackingEngine";

/* ============================================================================
 * Public types
 * ========================================================================== */

export type SafeDenseValidationDecision =
  | "productionValid"
  | "engineeringReviewRequired"
  | "rejected";

export type SafeDenseValidationSeverity =
  | "passed"
  | "warning"
  | "critical";

export type SafeDenseValidationCode =
  | "finiteGeometry"
  | "validPolygon"
  | "pieceCompleteness"
  | "duplicatePiece"
  | "rotationCompliance"
  | "grainRotationCompliance"
  | "fabricWidthBoundary"
  | "markerLengthBoundary"
  | "polygonCollision"
  | "cuttingGap"
  | "utilisationSanity"
  | "reportedUtilisation"
  | "markerArea"
  | "general";

export interface SafeDenseValidationIssue {
  readonly code: SafeDenseValidationCode;

  readonly severity: SafeDenseValidationSeverity;

  readonly title: string;

  readonly message: string;

  readonly blocksProduction: boolean;

  readonly placementIds?: ReadonlyArray<string>;
}

export interface SafeDenseProductionValidationOptions {
  /**
   * Required physical cutting clearance between polygons.
   */
  readonly requiredCuttingGap?: number;

  /**
   * Permitted numerical tolerance.
   */
  readonly geometryTolerance?: number;

  /**
   * Marker-edge clearance.
   */
  readonly boundaryClearance?: number;

  /**
   * Optional hard Marker Length limit.
   */
  readonly maximumMarkerLength?: number;

  /**
   * Difference allowed between reported and recalculated utilisation.
   */
  readonly utilisationTolerancePercent?: number;

  /**
   * Engineering target.
   * This does NOT determine safety.
   */
  readonly targetUtilisationPercent?: number;

  /**
   * If true, unknown source pieces cause rejection.
   */
  readonly rejectUnknownPieces?: boolean;
}

export interface SafeDenseProductionValidationInput {
  readonly solution: SafeDenseRepackingSolution;

  /**
   * Original engineering pieces used to create the marker.
   */
  readonly sourcePieces:
    ReadonlyArray<SafeDenseSourcePiece>;

  /**
   * Usable fabric width.
   */
  readonly fabricWidth: number;

  /**
   * Optional known pattern area.
   *
   * If omitted, source polygon area is calculated.
   */
  readonly expectedPatternArea?: number;
}

export interface SafeDenseCollisionDetail {
  readonly firstPlacementId: string;

  readonly secondPlacementId: string;

  readonly firstPieceName: string;

  readonly secondPieceName: string;
}

export interface SafeDenseGapViolation {
  readonly firstPlacementId: string;

  readonly secondPlacementId: string;

  readonly measuredGap: number;

  readonly requiredGap: number;
}

export interface SafeDenseProductionValidationResult {
  readonly solutionId: string;

  readonly decision: SafeDenseValidationDecision;

  readonly decisionLabel:
    | "PRODUCTION VALID"
    | "ENGINEERING REVIEW REQUIRED"
    | "REJECTED";

  readonly productionValid: boolean;

  readonly engineeringReviewRequired: boolean;

  readonly rejected: boolean;

  readonly expectedPieceCount: number;

  readonly placedPieceCount: number;

  readonly missingPieceCount: number;

  readonly duplicatePieceCount: number;

  readonly collisionCount: number;

  readonly cuttingGapViolationCount: number;

  readonly rotationViolationCount: number;

  readonly boundaryViolationCount: number;

  readonly finiteGeometry: boolean;

  readonly complete: boolean;

  readonly collisionFree: boolean;

  readonly cuttingGapSafe: boolean;

  readonly boundarySafe: boolean;

  readonly rotationSafe: boolean;

  readonly utilisationSane: boolean;

  readonly recalculatedMarkerLength: number;

  readonly recalculatedPatternArea: number;

  readonly recalculatedMarkerArea: number;

  readonly recalculatedUtilisationPercent: number;

  readonly reportedUtilisationPercent: number;

  readonly utilisationDifferencePercent: number;

  readonly targetUtilisationPercent: number;

  readonly targetUtilisationAchieved: boolean;

  readonly collisions:
    ReadonlyArray<SafeDenseCollisionDetail>;

  readonly gapViolations:
    ReadonlyArray<SafeDenseGapViolation>;

  readonly issues:
    ReadonlyArray<SafeDenseValidationIssue>;

  readonly criticalIssues:
    ReadonlyArray<SafeDenseValidationIssue>;

  readonly warnings:
    ReadonlyArray<SafeDenseValidationIssue>;

  readonly passedChecks:
    ReadonlyArray<SafeDenseValidationIssue>;

  readonly validationScore: number;

  readonly recommendation: string;

  readonly summary: string;
}

/* ============================================================================
 * Internal types / defaults
 * ========================================================================== */

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Bounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

interface NormalisedOptions {
  readonly requiredCuttingGap: number;

  readonly geometryTolerance: number;

  readonly boundaryClearance: number;

  readonly maximumMarkerLength:
    number | null;

  readonly utilisationTolerancePercent: number;

  readonly targetUtilisationPercent: number;

  readonly rejectUnknownPieces: boolean;
}

const DEFAULT_CUTTING_GAP = 0.5;

const DEFAULT_GEOMETRY_TOLERANCE = 0.0001;

const DEFAULT_UTILISATION_TOLERANCE = 0.25;

const DEFAULT_TARGET_UTILISATION = 90;

/* ============================================================================
 * Utility
 * ========================================================================== */

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );
}

function normaliseOptions(
  options:
    | SafeDenseProductionValidationOptions
    | undefined
): NormalisedOptions {
  return {
    requiredCuttingGap:
      Math.max(
        0,
        options?.requiredCuttingGap ??
          DEFAULT_CUTTING_GAP
      ),

    geometryTolerance:
      Math.max(
        0.0000001,
        options?.geometryTolerance ??
          DEFAULT_GEOMETRY_TOLERANCE
      ),

    boundaryClearance:
      Math.max(
        0,
        options?.boundaryClearance ??
          0
      ),

    maximumMarkerLength:
      options?.maximumMarkerLength !== undefined &&
      Number.isFinite(
        options.maximumMarkerLength
      ) &&
      options.maximumMarkerLength > 0
        ? options.maximumMarkerLength
        : null,

    utilisationTolerancePercent:
      Math.max(
        0,
        options?.utilisationTolerancePercent ??
          DEFAULT_UTILISATION_TOLERANCE
      ),

    targetUtilisationPercent:
      clamp(
        options?.targetUtilisationPercent ??
          DEFAULT_TARGET_UTILISATION,
        0,
        100
      ),

    rejectUnknownPieces:
      options?.rejectUnknownPieces ??
      true,
  };
}

function issue(
  code: SafeDenseValidationCode,
  severity: SafeDenseValidationSeverity,
  title: string,
  message: string,
  blocksProduction: boolean,
  placementIds?: ReadonlyArray<string>
): SafeDenseValidationIssue {
  return {
    code,
    severity,
    title,
    message,
    blocksProduction,
    placementIds,
  };
}

/* ============================================================================
 * Geometry integrity
 * ========================================================================== */

function pointIsFinite(
  point: Point
): boolean {
  return (
    Number.isFinite(point.x) &&
    Number.isFinite(point.y)
  );
}

function polygonIsFinite(
  polygon:
    ReadonlyArray<Point>
): boolean {
  return (
    polygon.length >= 3 &&
    polygon.every(
      pointIsFinite
    )
  );
}

function polygonArea(
  polygon:
    ReadonlyArray<Point>
): number {
  if (
    polygon.length < 3
  ) {
    return 0;
  }

  let total = 0;

  for (
    let index = 0;
    index < polygon.length;
    index += 1
  ) {
    const current =
      polygon[index];

    const next =
      polygon[
        (index + 1) %
        polygon.length
      ];

    total +=
      current.x *
        next.y -
      next.x *
        current.y;
  }

  return Math.abs(
    total / 2
  );
}

function getBounds(
  polygon:
    ReadonlyArray<Point>
): Bounds | null {
  if (
    !polygonIsFinite(
      polygon
    )
  ) {
    return null;
  }

  let minX =
    Number.POSITIVE_INFINITY;

  let minY =
    Number.POSITIVE_INFINITY;

  let maxX =
    Number.NEGATIVE_INFINITY;

  let maxY =
    Number.NEGATIVE_INFINITY;

  for (
    const point of polygon
  ) {
    minX =
      Math.min(
        minX,
        point.x
      );

    minY =
      Math.min(
        minY,
        point.y
      );

    maxX =
      Math.max(
        maxX,
        point.x
      );

    maxY =
      Math.max(
        maxY,
        point.y
      );
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

/* ============================================================================
 * Exact polygon intersection
 * ========================================================================== */

function orientation(
  a: Point,
  b: Point,
  c: Point,
  tolerance: number
): number {
  const value =
    (
      b.y -
      a.y
    ) *
      (
        c.x -
        b.x
      ) -
    (
      b.x -
      a.x
    ) *
      (
        c.y -
        b.y
      );

  if (
    Math.abs(value) <=
    tolerance
  ) {
    return 0;
  }

  return value > 0
    ? 1
    : 2;
}

function pointOnSegment(
  point: Point,
  start: Point,
  end: Point,
  tolerance: number
): boolean {
  if (
    orientation(
      start,
      point,
      end,
      tolerance
    ) !== 0
  ) {
    return false;
  }

  return (
    point.x <=
      Math.max(
        start.x,
        end.x
      ) +
        tolerance &&
    point.x >=
      Math.min(
        start.x,
        end.x
      ) -
        tolerance &&
    point.y <=
      Math.max(
        start.y,
        end.y
      ) +
        tolerance &&
    point.y >=
      Math.min(
        start.y,
        end.y
      ) -
        tolerance
  );
}

function segmentsIntersect(
  firstStart: Point,
  firstEnd: Point,
  secondStart: Point,
  secondEnd: Point,
  tolerance: number
): boolean {
  const o1 =
    orientation(
      firstStart,
      firstEnd,
      secondStart,
      tolerance
    );

  const o2 =
    orientation(
      firstStart,
      firstEnd,
      secondEnd,
      tolerance
    );

  const o3 =
    orientation(
      secondStart,
      secondEnd,
      firstStart,
      tolerance
    );

  const o4 =
    orientation(
      secondStart,
      secondEnd,
      firstEnd,
      tolerance
    );

  if (
    o1 !== o2 &&
    o3 !== o4
  ) {
    return true;
  }

  if (
    o1 === 0 &&
    pointOnSegment(
      secondStart,
      firstStart,
      firstEnd,
      tolerance
    )
  ) {
    return true;
  }

  if (
    o2 === 0 &&
    pointOnSegment(
      secondEnd,
      firstStart,
      firstEnd,
      tolerance
    )
  ) {
    return true;
  }

  if (
    o3 === 0 &&
    pointOnSegment(
      firstStart,
      secondStart,
      secondEnd,
      tolerance
    )
  ) {
    return true;
  }

  return (
    o4 === 0 &&
    pointOnSegment(
      firstEnd,
      secondStart,
      secondEnd,
      tolerance
    )
  );
}

function pointInsidePolygon(
  point: Point,
  polygon:
    ReadonlyArray<Point>,
  tolerance: number
): boolean {
  let inside = false;

  for (
    let first = 0,
      second =
        polygon.length -
        1;
    first <
    polygon.length;
    second = first++
  ) {
    const a =
      polygon[first];

    const b =
      polygon[second];

    if (
      pointOnSegment(
        point,
        a,
        b,
        tolerance
      )
    ) {
      return true;
    }

    const crosses =
      (
        a.y >
        point.y
      ) !==
        (
          b.y >
          point.y
        ) &&
      point.x <
        (
          (
            b.x -
            a.x
          ) *
            (
              point.y -
              a.y
            )
        ) /
          (
            b.y -
              a.y ||
            tolerance
          ) +
          a.x;

    if (crosses) {
      inside =
        !inside;
    }
  }

  return inside;
}

function polygonsIntersect(
  first:
    ReadonlyArray<Point>,
  second:
    ReadonlyArray<Point>,
  tolerance: number
): boolean {
  const firstBounds =
    getBounds(first);

  const secondBounds =
    getBounds(second);

  if (
    !firstBounds ||
    !secondBounds
  ) {
    return true;
  }

  if (
    firstBounds.maxX <
      secondBounds.minX -
        tolerance ||
    secondBounds.maxX <
      firstBounds.minX -
        tolerance ||
    firstBounds.maxY <
      secondBounds.minY -
        tolerance ||
    secondBounds.maxY <
      firstBounds.minY -
        tolerance
  ) {
    return false;
  }

  for (
    let firstIndex = 0;
    firstIndex <
    first.length;
    firstIndex += 1
  ) {
    const firstStart =
      first[firstIndex];

    const firstEnd =
      first[
        (
          firstIndex +
          1
        ) %
        first.length
      ];

    for (
      let secondIndex = 0;
      secondIndex <
      second.length;
      secondIndex += 1
    ) {
      const secondStart =
        second[
          secondIndex
        ];

      const secondEnd =
        second[
          (
            secondIndex +
            1
          ) %
          second.length
        ];

      if (
        segmentsIntersect(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd,
          tolerance
        )
      ) {
        return true;
      }
    }
  }

  return (
    pointInsidePolygon(
      first[0],
      second,
      tolerance
    ) ||
    pointInsidePolygon(
      second[0],
      first,
      tolerance
    )
  );
}

/* ============================================================================
 * Exact polygon distance
 * ========================================================================== */

function pointSegmentDistance(
  point: Point,
  start: Point,
  end: Point
): number {
  const dx =
    end.x -
    start.x;

  const dy =
    end.y -
    start.y;

  const denominator =
    dx * dx +
    dy * dy;

  if (
    denominator <=
    Number.EPSILON
  ) {
    return Math.hypot(
      point.x -
        start.x,
      point.y -
        start.y
    );
  }

  const projection =
    clamp(
      (
        (
          point.x -
          start.x
        ) *
          dx +
        (
          point.y -
          start.y
        ) *
          dy
      ) /
        denominator,
      0,
      1
    );

  const nearestX =
    start.x +
    projection *
      dx;

  const nearestY =
    start.y +
    projection *
      dy;

  return Math.hypot(
    point.x -
      nearestX,
    point.y -
      nearestY
  );
}

function segmentDistance(
  firstStart: Point,
  firstEnd: Point,
  secondStart: Point,
  secondEnd: Point,
  tolerance: number
): number {
  if (
    segmentsIntersect(
      firstStart,
      firstEnd,
      secondStart,
      secondEnd,
      tolerance
    )
  ) {
    return 0;
  }

  return Math.min(
    pointSegmentDistance(
      firstStart,
      secondStart,
      secondEnd
    ),

    pointSegmentDistance(
      firstEnd,
      secondStart,
      secondEnd
    ),

    pointSegmentDistance(
      secondStart,
      firstStart,
      firstEnd
    ),

    pointSegmentDistance(
      secondEnd,
      firstStart,
      firstEnd
    )
  );
}

function polygonDistance(
  first:
    ReadonlyArray<Point>,
  second:
    ReadonlyArray<Point>,
  tolerance: number
): number {
  if (
    polygonsIntersect(
      first,
      second,
      tolerance
    )
  ) {
    return 0;
  }

  let minimum =
    Number.POSITIVE_INFINITY;

  for (
    let firstIndex = 0;
    firstIndex <
    first.length;
    firstIndex += 1
  ) {
    const firstStart =
      first[firstIndex];

    const firstEnd =
      first[
        (
          firstIndex +
          1
        ) %
        first.length
      ];

    for (
      let secondIndex = 0;
      secondIndex <
      second.length;
      secondIndex += 1
    ) {
      const secondStart =
        second[
          secondIndex
        ];

      const secondEnd =
        second[
          (
            secondIndex +
            1
          ) %
          second.length
        ];

      minimum =
        Math.min(
          minimum,
          segmentDistance(
            firstStart,
            firstEnd,
            secondStart,
            secondEnd,
            tolerance
          )
        );
    }
  }

  return minimum;
}

/* ============================================================================
 * Source-piece matching
 * ========================================================================== */

function getSourcePieceMap(
  sourcePieces:
    ReadonlyArray<SafeDenseSourcePiece>
): Map<string, SafeDenseSourcePiece> {
  const result =
    new Map<
      string,
      SafeDenseSourcePiece
    >();

  for (
    const piece of
    sourcePieces
  ) {
    result.set(
      piece.id,
      piece
    );
  }

  return result;
}

function rotationIsAllowed(
  placement:
    SafeDensePlacement,
  source:
    SafeDenseSourcePiece
): boolean {
  const allowed:
    ReadonlyArray<SafeDenseRotation> =
    source.allowedRotations &&
    source.allowedRotations.length >
      0
      ? source.allowedRotations
      : [0];

  if (
    source.rotationLocked
  ) {
    return (
      placement.rotation ===
      (
        allowed[0] ??
        0
      )
    );
  }

  return allowed.includes(
    placement.rotation
  );
}

/* ============================================================================
 * Main validator
 * ========================================================================== */

export function validateSafeDenseProductionSolution(
  input:
    SafeDenseProductionValidationInput,
  options?:
    SafeDenseProductionValidationOptions
): SafeDenseProductionValidationResult {
  const settings =
    normaliseOptions(
      options
    );

  const {
    solution,
    sourcePieces,
  } = input;

  const issues:
    SafeDenseValidationIssue[] =
    [];

  const collisions:
    SafeDenseCollisionDetail[] =
    [];

  const gapViolations:
    SafeDenseGapViolation[] =
    [];

  const expectedPieceCount =
    sourcePieces.length;

  const placedPieceCount =
    solution.placements.length;

  /* --------------------------------------------------------------------------
   * Geometry integrity
   * ----------------------------------------------------------------------- */

  const invalidGeometryPlacements =
    solution.placements.filter(
      (placement) =>
        !polygonIsFinite(
          placement.polygon
        ) ||
        polygonArea(
          placement.polygon
        ) <=
          settings.geometryTolerance
    );

  const finiteGeometry =
    invalidGeometryPlacements.length ===
    0;

  if (finiteGeometry) {
    issues.push(
      issue(
        "finiteGeometry",
        "passed",
        "Geometry Integrity",
        "All placed polygons contain finite engineering coordinates.",
        false
      )
    );
  } else {
    issues.push(
      issue(
        "finiteGeometry",
        "critical",
        "Invalid Geometry",
        `${invalidGeometryPlacements.length} placement${
          invalidGeometryPlacements.length ===
          1
            ? ""
            : "s"
        } contain invalid or zero-area polygon geometry.`,
        true,
        invalidGeometryPlacements.map(
          (placement) =>
            placement.id
        )
      )
    );
  }

  /* --------------------------------------------------------------------------
   * Piece completeness
   * ----------------------------------------------------------------------- */

  const expectedIds =
    new Set(
      sourcePieces.map(
        (piece) =>
          piece.id
      )
    );

  const placementIds =
    solution.placements.map(
      (placement) =>
        placement.id
    );

  const placedIdSet =
    new Set(
      placementIds
    );

  const missingIds =
    Array.from(
      expectedIds
    ).filter(
      (id) =>
        !placedIdSet.has(id)
    );

  const duplicateIds =
    placementIds.filter(
      (
        id,
        index
      ) =>
        placementIds.indexOf(
          id
        ) !== index
    );

  const uniqueDuplicateIds =
    Array.from(
      new Set(
        duplicateIds
      )
    );

  const unknownIds =
    placementIds.filter(
      (id) =>
        !expectedIds.has(id)
    );

  const complete =
    missingIds.length ===
      0 &&
    uniqueDuplicateIds.length ===
      0 &&
    (
      !settings.rejectUnknownPieces ||
      unknownIds.length ===
        0
    ) &&
    placedPieceCount ===
      expectedPieceCount;

  if (complete) {
    issues.push(
      issue(
        "pieceCompleteness",
        "passed",
        "Piece Completeness",
        `All ${expectedPieceCount} required physical marker pieces are present exactly once.`,
        false
      )
    );
  } else {
    issues.push(
      issue(
        "pieceCompleteness",
        "critical",
        "Piece Completeness Failed",
        `Expected ${expectedPieceCount} pieces, placed ${placedPieceCount}, missing ${missingIds.length}, duplicates ${uniqueDuplicateIds.length}, unknown ${unknownIds.length}.`,
        true,
        [
          ...missingIds,
          ...uniqueDuplicateIds,
          ...unknownIds,
        ]
      )
    );
  }

  /* --------------------------------------------------------------------------
   * Rotation / Grain restrictions
   * ----------------------------------------------------------------------- */

  const sourceMap =
    getSourcePieceMap(
      sourcePieces
    );

  const rotationViolations:
    string[] = [];

  for (
    const placement of
    solution.placements
  ) {
    const source =
      sourceMap.get(
        placement.id
      );

    if (!source) {
      if (
        settings.rejectUnknownPieces
      ) {
        rotationViolations.push(
          placement.id
        );
      }

      continue;
    }

    if (
      !rotationIsAllowed(
        placement,
        source
      )
    ) {
      rotationViolations.push(
        placement.id
      );
    }
  }

  const rotationSafe =
    rotationViolations.length ===
    0;

  if (rotationSafe) {
    issues.push(
      issue(
        "rotationCompliance",
        "passed",
        "Rotation Compliance",
        "All placements comply with their permitted pattern rotation rules.",
        false
      )
    );
  } else {
    issues.push(
      issue(
        "rotationCompliance",
        "critical",
        "Rotation Rule Violation",
        `${rotationViolations.length} placement${
          rotationViolations.length ===
          1
            ? ""
            : "s"
        } violate permitted engineering rotation rules.`,
        true,
        rotationViolations
      )
    );
  }

  /* --------------------------------------------------------------------------
   * Fabric width / marker boundary
   * ----------------------------------------------------------------------- */

  const boundaryViolationIds:
    string[] = [];

  let recalculatedMarkerLength =
    0;

  for (
    const placement of
    solution.placements
  ) {
    const bounds =
      getBounds(
        placement.polygon
      );

    if (!bounds) {
      boundaryViolationIds.push(
        placement.id
      );

      continue;
    }

    /**
     * Step 4 fix: safeDenseRepackingEngine.ts's coordinate convention was
     * canonicalised in Step 3C to match the baseline/canvas engine — X is
     * now the bounded usable-fabric-width axis and Y is the growing
     * marker-length axis (see that engine's header comment for the full
     * derivation). This independent re-validation must audit the same
     * axes the engine itself now produces, or it silently re-checks the
     * wrong dimensions against the wrong limits.
     */
    recalculatedMarkerLength =
      Math.max(
        recalculatedMarkerLength,
        bounds.maxY
      );

    const widthSafe =
      bounds.minX >=
        settings.boundaryClearance -
          settings.geometryTolerance &&
      bounds.maxX <=
        input.fabricWidth -
          settings.boundaryClearance +
          settings.geometryTolerance;

    const startSafe =
      bounds.minY >=
      settings.boundaryClearance -
        settings.geometryTolerance;

    const endSafe =
      settings.maximumMarkerLength ===
      null
        ? true
        : bounds.maxY <=
          settings.maximumMarkerLength -
            settings.boundaryClearance +
            settings.geometryTolerance;

    if (
      !widthSafe ||
      !startSafe ||
      !endSafe
    ) {
      boundaryViolationIds.push(
        placement.id
      );
    }
  }

  const boundarySafe =
    boundaryViolationIds.length ===
    0;

  if (boundarySafe) {
    issues.push(
      issue(
        "fabricWidthBoundary",
        "passed",
        "Marker Boundary",
        "Every placement remains inside the permitted usable fabric and marker boundaries.",
        false
      )
    );
  } else {
    issues.push(
      issue(
        "fabricWidthBoundary",
        "critical",
        "Marker Boundary Violation",
        `${boundaryViolationIds.length} placement${
          boundaryViolationIds.length ===
          1
            ? ""
            : "s"
        } exceed the permitted marker boundary.`,
        true,
        boundaryViolationIds
      )
    );
  }

  /* --------------------------------------------------------------------------
   * Exact collision and gap validation
   * ----------------------------------------------------------------------- */

  for (
    let firstIndex = 0;
    firstIndex <
    solution.placements.length;
    firstIndex += 1
  ) {
    const first =
      solution.placements[
        firstIndex
      ];

    for (
      let secondIndex =
        firstIndex +
        1;
      secondIndex <
      solution.placements.length;
      secondIndex += 1
    ) {
      const second =
        solution.placements[
          secondIndex
        ];

      if (
        !polygonIsFinite(
          first.polygon
        ) ||
        !polygonIsFinite(
          second.polygon
        )
      ) {
        continue;
      }

      const intersects =
        polygonsIntersect(
          first.polygon,
          second.polygon,
          settings.geometryTolerance
        );

      if (intersects) {
        collisions.push({
          firstPlacementId:
            first.id,

          secondPlacementId:
            second.id,

          firstPieceName:
            first.pieceName ??
            first.pieceId,

          secondPieceName:
            second.pieceName ??
            second.pieceId,
        });

        continue;
      }

      const gap =
        polygonDistance(
          first.polygon,
          second.polygon,
          settings.geometryTolerance
        );

      if (
        gap +
          settings.geometryTolerance <
        settings.requiredCuttingGap
      ) {
        gapViolations.push({
          firstPlacementId:
            first.id,

          secondPlacementId:
            second.id,

          measuredGap:
            gap,

          requiredGap:
            settings.requiredCuttingGap,
        });
      }
    }
  }

  const collisionFree =
    collisions.length ===
    0;

  if (collisionFree) {
    issues.push(
      issue(
        "polygonCollision",
        "passed",
        "Exact Polygon Collision",
        "No polygon intersection was detected between placed marker pieces.",
        false
      )
    );
  } else {
    issues.push(
      issue(
        "polygonCollision",
        "critical",
        "Polygon Collision Detected",
        `${collisions.length} exact polygon collision${
          collisions.length ===
          1
            ? ""
            : "s"
        } detected.`,
        true,
        Array.from(
          new Set(
            collisions.flatMap(
              (collision) => [
                collision.firstPlacementId,
                collision.secondPlacementId,
              ]
            )
          )
        )
      )
    );
  }

  const cuttingGapSafe =
    collisionFree &&
    gapViolations.length ===
      0;

  if (cuttingGapSafe) {
    issues.push(
      issue(
        "cuttingGap",
        "passed",
        "Cutting Gap",
        `All pattern pieces maintain at least ${settings.requiredCuttingGap.toFixed(
          2
        )} engineering units of clearance.`,
        false
      )
    );
  } else if (
    gapViolations.length >
    0
  ) {
    issues.push(
      issue(
        "cuttingGap",
        "critical",
        "Cutting Gap Insufficient",
        `${gapViolations.length} piece pair${
          gapViolations.length ===
          1
            ? ""
            : "s"
        } do not maintain the required cutting clearance.`,
        true,
        Array.from(
          new Set(
            gapViolations.flatMap(
              (violation) => [
                violation.firstPlacementId,
                violation.secondPlacementId,
              ]
            )
          )
        )
      )
    );
  }

  /* --------------------------------------------------------------------------
   * Independent utilisation calculation
   * ----------------------------------------------------------------------- */

  const recalculatedPatternArea =
    input.expectedPatternArea !==
      undefined &&
    Number.isFinite(
      input.expectedPatternArea
    ) &&
    input.expectedPatternArea >
      0
      ? input.expectedPatternArea
      : sourcePieces.reduce(
          (
            total,
            piece
          ) =>
            total +
            polygonArea(
              piece.polygon
            ),
          0
        );

  const recalculatedMarkerArea =
    recalculatedMarkerLength *
    input.fabricWidth;

  const recalculatedUtilisationPercent =
    recalculatedMarkerArea >
      settings.geometryTolerance
      ? clamp(
          (
            recalculatedPatternArea /
            recalculatedMarkerArea
          ) *
            100,
          0,
          100
        )
      : 0;

  const reportedUtilisationPercent =
    clamp(
      solution.utilisationPercent,
      0,
      100
    );

  const utilisationDifferencePercent =
    Math.abs(
      recalculatedUtilisationPercent -
      reportedUtilisationPercent
    );

  const utilisationSane =
    recalculatedPatternArea >
      0 &&
    recalculatedMarkerArea >
      0 &&
    recalculatedUtilisationPercent >=
      0 &&
    recalculatedUtilisationPercent <=
      100 +
        settings.geometryTolerance &&
    utilisationDifferencePercent <=
      settings.utilisationTolerancePercent;

  if (utilisationSane) {
    issues.push(
      issue(
        "utilisationSanity",
        "passed",
        "Utilisation Verification",
        `Independent utilisation calculation confirms ${recalculatedUtilisationPercent.toFixed(
          2
        )}%.`,
        false
      )
    );
  } else {
    issues.push(
      issue(
        "utilisationSanity",
        "critical",
        "Utilisation Validation Failed",
        `Reported utilisation is ${reportedUtilisationPercent.toFixed(
          2
        )}% while independent calculation returns ${recalculatedUtilisationPercent.toFixed(
          2
        )}%. Difference: ${utilisationDifferencePercent.toFixed(
          2
        )} percentage points.`,
        true
      )
    );
  }

  const targetUtilisationAchieved =
    recalculatedUtilisationPercent +
      settings.geometryTolerance >=
    settings.targetUtilisationPercent;

  /* ==========================================================================
   * Final decision
   * ======================================================================== */

  const criticalIssues =
    issues.filter(
      (item) =>
        item.severity ===
        "critical"
    );

  const warnings =
    issues.filter(
      (item) =>
        item.severity ===
        "warning"
    );

  const passedChecks =
    issues.filter(
      (item) =>
        item.severity ===
        "passed"
    );

  let decision:
    SafeDenseValidationDecision;

  if (
    criticalIssues.length >
    0
  ) {
    decision =
      "rejected";
  } else if (
    warnings.length >
    0
  ) {
    decision =
      "engineeringReviewRequired";
  } else {
    decision =
      "productionValid";
  }

  const productionValid =
    decision ===
    "productionValid";

  const engineeringReviewRequired =
    decision ===
    "engineeringReviewRequired";

  const rejected =
    decision ===
    "rejected";

  const safetyChecks = [
    finiteGeometry,
    complete,
    rotationSafe,
    boundarySafe,
    collisionFree,
    cuttingGapSafe,
    utilisationSane,
  ];

  const passedSafetyChecks =
    safetyChecks.filter(
      Boolean
    ).length;

  const validationScore =
    clamp(
      (
        passedSafetyChecks /
        safetyChecks.length
      ) *
        100,
      0,
      100
    );

  const decisionLabel:
    SafeDenseProductionValidationResult["decisionLabel"] =
    productionValid
      ? "PRODUCTION VALID"
      : engineeringReviewRequired
        ? "ENGINEERING REVIEW REQUIRED"
        : "REJECTED";

  let recommendation: string;

  if (productionValid) {
    recommendation =
      targetUtilisationAchieved
        ? "Dense marker independently passed production validation and achieved the utilisation target. It may proceed to the Production Safety Gate for final release."
        : "Dense marker independently passed production validation. It may proceed to the Production Safety Gate, while further safe optimisation can continue.";
  } else if (
    engineeringReviewRequired
  ) {
    recommendation =
      "Dense marker requires engineering review before it can become a production candidate.";
  } else {
    recommendation =
      "Reject this dense candidate. Do not release or promote it to the production marker until all critical validation failures are corrected.";
  }

  const summary =
    productionValid
      ? `Safe Dense Production Validation passed at ${recalculatedUtilisationPercent.toFixed(
          2
        )}% independently verified utilisation.`
      : rejected
        ? `Safe Dense Production Validation rejected the ${reportedUtilisationPercent.toFixed(
            2
          )}% candidate because ${criticalIssues.length} critical validation condition${
            criticalIssues.length ===
            1
              ? ""
              : "s"
          } failed.`
        : `Safe Dense Production Validation requires engineering review before the candidate can proceed.`;

  return {
    solutionId:
      solution.id,

    decision,

    decisionLabel,

    productionValid,

    engineeringReviewRequired,

    rejected,

    expectedPieceCount,

    placedPieceCount,

    missingPieceCount:
      missingIds.length,

    duplicatePieceCount:
      uniqueDuplicateIds.length,

    collisionCount:
      collisions.length,

    cuttingGapViolationCount:
      gapViolations.length,

    rotationViolationCount:
      rotationViolations.length,

    boundaryViolationCount:
      boundaryViolationIds.length,

    finiteGeometry,

    complete,

    collisionFree,

    cuttingGapSafe,

    boundarySafe,

    rotationSafe,

    utilisationSane,

    recalculatedMarkerLength,

    recalculatedPatternArea,

    recalculatedMarkerArea,

    recalculatedUtilisationPercent,

    reportedUtilisationPercent,

    utilisationDifferencePercent,

    targetUtilisationPercent:
      settings.targetUtilisationPercent,

    targetUtilisationAchieved,

    collisions,

    gapViolations,

    issues,

    criticalIssues,

    warnings,

    passedChecks,

    validationScore,

    recommendation,

    summary,
  };
}

/* ============================================================================
 * Multi-solution validation
 * ========================================================================== */

export interface SafeDenseValidationRanking {
  readonly evaluated:
    ReadonlyArray<SafeDenseProductionValidationResult>;

  readonly productionValid:
    ReadonlyArray<SafeDenseProductionValidationResult>;

  readonly reviewRequired:
    ReadonlyArray<SafeDenseProductionValidationResult>;

  readonly rejected:
    ReadonlyArray<SafeDenseProductionValidationResult>;

  readonly bestProductionValid:
    SafeDenseProductionValidationResult | null;

  readonly highestValidatedUtilisation:
    number;

  readonly targetAchieved:
    boolean;

  readonly summary: string;
}

export function validateSafeDenseProductionSolutions(
  solutions:
    ReadonlyArray<SafeDenseRepackingSolution>,
  sourcePieces:
    ReadonlyArray<SafeDenseSourcePiece>,
  fabricWidth: number,
  options?:
    SafeDenseProductionValidationOptions
): SafeDenseValidationRanking {
  const evaluated =
    solutions.map(
      (solution) =>
        validateSafeDenseProductionSolution(
          {
            solution,
            sourcePieces,
            fabricWidth,
          },
          options
        )
    );

  const productionValid =
    evaluated
      .filter(
        (result) =>
          result.productionValid
      )
      .sort(
        (
          first,
          second
        ) =>
          second.recalculatedUtilisationPercent -
          first.recalculatedUtilisationPercent
      );

  const reviewRequired =
    evaluated.filter(
      (result) =>
        result.engineeringReviewRequired
    );

  const rejected =
    evaluated.filter(
      (result) =>
        result.rejected
    );

  const bestProductionValid =
    productionValid[0] ??
    null;

  const highestValidatedUtilisation =
    bestProductionValid
      ?.recalculatedUtilisationPercent ??
    0;

  const targetAchieved =
    Boolean(
      bestProductionValid
        ?.targetUtilisationAchieved
    );

  let summary: string;

  if (
    bestProductionValid
  ) {
    summary =
      targetAchieved
        ? `A production-valid dense marker achieved ${highestValidatedUtilisation.toFixed(
            2
          )}% utilisation and reached the target.`
        : `The best production-valid dense marker achieved ${highestValidatedUtilisation.toFixed(
            2
          )}% utilisation.`;
  } else {
    summary =
      `No dense candidate currently passes independent production validation. ${rejected.length} candidate${
        rejected.length === 1
          ? ""
          : "s"
      } rejected and ${reviewRequired.length} require review.`;
  }

  return {
    evaluated,

    productionValid,

    reviewRequired,

    rejected,

    bestProductionValid,

    highestValidatedUtilisation,

    targetAchieved,

    summary,
  };
}

/* ============================================================================
 * Convenience helpers
 * ========================================================================== */

export function getBestValidatedDenseSolution(
  ranking:
    SafeDenseValidationRanking
): SafeDenseProductionValidationResult | null {
  return ranking.bestProductionValid;
}

export function hasValidated90PlusDenseMarker(
  ranking:
    SafeDenseValidationRanking
): boolean {
  return (
    ranking.targetAchieved &&
    ranking.highestValidatedUtilisation >=
      90
  );
}

export function canPromoteDenseCandidateToSafetyGate(
  result:
    SafeDenseProductionValidationResult
): boolean {
  return (
    result.productionValid &&
    result.collisionFree &&
    result.cuttingGapSafe &&
    result.boundarySafe &&
    result.complete &&
    result.rotationSafe &&
    result.utilisationSane
  );
}

/* ============================================================================
 * RC5-004-013 — Production Validation Diagnostics
 * ========================================================================== */

export interface SafeDenseValidationFailureDiagnostic {
  readonly solutionId: string;
  readonly reportedUtilisationPercent: number;
  readonly recalculatedUtilisationPercent: number;
  readonly validationScore: number;
  readonly decision: SafeDenseValidationDecision;
  readonly criticalFailureCount: number;
  readonly criticalFailureTitles: ReadonlyArray<string>;
  readonly criticalFailureMessages: ReadonlyArray<string>;
  readonly collisionCount: number;
  readonly cuttingGapViolationCount: number;
  readonly rotationViolationCount: number;
  readonly boundaryViolationCount: number;
  readonly missingPieceCount: number;
  readonly duplicatePieceCount: number;
  readonly utilisationSane: boolean;
}

export interface SafeDenseValidationDiagnosticSummary {
  readonly evaluatedSolutions: number;
  readonly productionValidSolutions: number;
  readonly reviewRequiredSolutions: number;
  readonly rejectedSolutions: number;

  readonly collisionRejectedSolutions: number;
  readonly cuttingGapRejectedSolutions: number;
  readonly rotationRejectedSolutions: number;
  readonly boundaryRejectedSolutions: number;
  readonly completenessRejectedSolutions: number;
  readonly utilisationRejectedSolutions: number;

  readonly diagnostics:
    ReadonlyArray<SafeDenseValidationFailureDiagnostic>;

  readonly primaryFailureReason: string;
}

export function buildSafeDenseValidationDiagnostics(
  ranking: SafeDenseValidationRanking
): SafeDenseValidationDiagnosticSummary {
  const diagnostics =
    ranking.evaluated.map(
      (
        result
      ): SafeDenseValidationFailureDiagnostic => ({
        solutionId:
          result.solutionId,

        reportedUtilisationPercent:
          result.reportedUtilisationPercent,

        recalculatedUtilisationPercent:
          result.recalculatedUtilisationPercent,

        validationScore:
          result.validationScore,

        decision:
          result.decision,

        criticalFailureCount:
          result.criticalIssues.length,

        criticalFailureTitles:
          result.criticalIssues.map(
            (item) =>
              item.title
          ),

        criticalFailureMessages:
          result.criticalIssues.map(
            (item) =>
              item.message
          ),

        collisionCount:
          result.collisionCount,

        cuttingGapViolationCount:
          result.cuttingGapViolationCount,

        rotationViolationCount:
          result.rotationViolationCount,

        boundaryViolationCount:
          result.boundaryViolationCount,

        missingPieceCount:
          result.missingPieceCount,

        duplicatePieceCount:
          result.duplicatePieceCount,

        utilisationSane:
          result.utilisationSane,
      })
    );

  const collisionRejectedSolutions =
    ranking.evaluated.filter(
      (result) =>
        result.collisionCount > 0
    ).length;

  const cuttingGapRejectedSolutions =
    ranking.evaluated.filter(
      (result) =>
        result.cuttingGapViolationCount > 0
    ).length;

  const rotationRejectedSolutions =
    ranking.evaluated.filter(
      (result) =>
        result.rotationViolationCount > 0
    ).length;

  const boundaryRejectedSolutions =
    ranking.evaluated.filter(
      (result) =>
        result.boundaryViolationCount > 0
    ).length;

  const completenessRejectedSolutions =
    ranking.evaluated.filter(
      (result) =>
        !result.complete
    ).length;

  const utilisationRejectedSolutions =
    ranking.evaluated.filter(
      (result) =>
        !result.utilisationSane
    ).length;

  const failureCounts = [
    {
      label: "Polygon Collision",
      count: collisionRejectedSolutions,
    },
    {
      label: "Cutting Gap",
      count: cuttingGapRejectedSolutions,
    },
    {
      label: "Rotation Compliance",
      count: rotationRejectedSolutions,
    },
    {
      label: "Marker Boundary",
      count: boundaryRejectedSolutions,
    },
    {
      label: "Piece Completeness",
      count: completenessRejectedSolutions,
    },
    {
      label: "Utilisation Validation",
      count: utilisationRejectedSolutions,
    },
  ];

  const primaryFailure =
    failureCounts.reduce(
      (
        best,
        current
      ) =>
        current.count >
        best.count
          ? current
          : best,
      {
        label:
          "No Critical Failure",
        count:
          0,
      }
    );

  return {
    evaluatedSolutions:
      ranking.evaluated.length,

    productionValidSolutions:
      ranking.productionValid.length,

    reviewRequiredSolutions:
      ranking.reviewRequired.length,

    rejectedSolutions:
      ranking.rejected.length,

    collisionRejectedSolutions,

    cuttingGapRejectedSolutions,

    rotationRejectedSolutions,

    boundaryRejectedSolutions,

    completenessRejectedSolutions,

    utilisationRejectedSolutions,

    diagnostics,

    primaryFailureReason:
      primaryFailure.count > 0
        ? `${primaryFailure.label} (${primaryFailure.count}/${ranking.evaluated.length} solutions)`
        : "No critical production-validation failure detected.",
  };
}