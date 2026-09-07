/**
 * OptiFabric AI
 * RC5-004-010A — Safe Efficiency Recovery Engine
 *
 * Purpose:
 * - Recover unsafe high-efficiency marker candidates.
 * - Repair only the placements responsible for safety failure.
 * - Preserve as much utilisation as possible.
 * - Revalidate collision and marker-boundary safety.
 * - Produce one or more safer recovered candidates for the
 *   Production Safety Gate.
 *
 * Recovery philosophy:
 *
 * High Efficiency Candidate
 * ↓
 * Identify conflicting placements
 * ↓
 * Freeze unaffected placements
 * ↓
 * Search nearby safe positions
 * ↓
 * Revalidate all collisions
 * ↓
 * Revalidate marker boundary
 * ↓
 * Recalculate marker length / utilisation
 * ↓
 * Return recovered candidates
 *
 * Important:
 * This engine does NOT automatically release a recovered marker.
 * Final production approval still belongs to the Production Safety Gate.
 */

export interface SafeRecoveryPoint {
  readonly x: number;
  readonly y: number;
}

export interface SafeRecoveryPlacement {
  readonly id: string;

  readonly pieceId: string;

  readonly pieceName?: string;

  readonly polygon:
    ReadonlyArray<SafeRecoveryPoint>;

  readonly x: number;

  readonly y: number;

  readonly rotation: number;

  readonly source?:
    | "existing"
    | "holeFilling"
    | "compaction"
    | "recovery";

  readonly locked?: boolean;

  readonly priority?: number;
}

export interface SafeRecoveryMarkerInput {
  readonly markerId: string;

  /**
   * Engineering coordinate system:
   * X = Marker Length
   * Y = Fabric Width
   */
  readonly markerLength: number;

  readonly fabricWidth: number;

  readonly placements:
    ReadonlyArray<SafeRecoveryPlacement>;

  /**
   * Total real pattern area contained in the marker.
   */
  readonly totalPatternArea: number;

  /**
   * Optional pre-calculated failed placement ids.
   *
   * If omitted, the engine detects collisions automatically.
   */
  readonly failedPlacementIds?:
    ReadonlyArray<string>;
}

export interface SafeEfficiencyRecoveryOptions {
  /**
   * Clearance required between pattern envelopes.
   */
  readonly collisionClearance?: number;

  /**
   * Additional marker-boundary clearance.
   */
  readonly markerBoundaryClearance?: number;

  /**
   * Engineering search step.
   */
  readonly searchStep?: number;

  /**
   * Maximum horizontal recovery movement in Marker Length direction.
   */
  readonly maximumLengthMovement?: number;

  /**
   * Maximum vertical movement across Fabric Width.
   */
  readonly maximumWidthMovement?: number;

  /**
   * Number of recovery passes.
   */
  readonly maximumPasses?: number;

  /**
   * Hard limit on search candidates per failed placement.
   */
  readonly maximumCandidatesPerPlacement?: number;

  /**
   * Number of final recovered solutions retained.
   */
  readonly maximumSolutions?: number;

  /**
   * Allow pieces to touch the required clearance boundary.
   */
  readonly allowBoundaryContact?: boolean;

  /**
   * Search both forward and backward along Marker Length.
   */
  readonly bidirectionalLengthSearch?: boolean;

  /**
   * Prefer preserving original placement before moving farther.
   */
  readonly localRepairFirst?: boolean;

  /**
   * Minimum acceptable utilisation after recovery.
   */
  readonly minimumRecoveredUtilisation?: number;

  /**
   * Optimisation target. Used for scoring, not for safety release.
   */
  readonly targetUtilisationPercent?: number;
}

export interface SafeRecoveryCollisionPair {
  readonly firstId: string;
  readonly secondId: string;
}

export interface SafeRecoveryPlacementMove {
  readonly id: string;

  readonly originalX: number;
  readonly originalY: number;

  readonly recoveredX: number;
  readonly recoveredY: number;

  readonly movementDistance: number;
}

export interface SafeEfficiencyRecoveredSolution {
  readonly id: string;

  readonly sourceMarkerId: string;

  readonly placements:
    ReadonlyArray<SafeRecoveryPlacement>;

  readonly movedPlacements:
    ReadonlyArray<SafeRecoveryPlacementMove>;

  readonly movedPlacementCount: number;

  readonly collisionFree: boolean;

  readonly boundarySafe: boolean;

  readonly collisionCount: number;

  readonly markerLength: number;

  readonly utilisationPercent: number;

  readonly wastePercent: number;

  readonly lengthChange: number;

  readonly utilisationChange: number;

  readonly engineeringScore: number;

  readonly targetUtilisationAchieved: boolean;

  readonly engineeringReady: boolean;
}

export interface SafeEfficiencyRecoveryStatistics {
  readonly originalCollisionCount: number;

  readonly failedPlacementCount: number;

  readonly recoveredSolutionCount: number;

  readonly bestRecoveredUtilisation: number;

  readonly bestRecoveredMarkerLength: number;

  readonly targetUtilisationPercent: number;

  readonly targetAchievedByAnySolution: boolean;

  readonly candidateTests: number;

  readonly rejectedCandidateTests: number;

  readonly recoveryPasses: number;
}

export interface SafeEfficiencyRecoveryResult {
  readonly markerId: string;

  readonly originalCollisionPairs:
    ReadonlyArray<SafeRecoveryCollisionPair>;

  readonly failedPlacementIds:
    ReadonlyArray<string>;

  readonly solutions:
    ReadonlyArray<SafeEfficiencyRecoveredSolution>;

  readonly bestSolution:
    SafeEfficiencyRecoveredSolution | null;

  readonly statistics:
    SafeEfficiencyRecoveryStatistics;

  readonly engineeringReady: boolean;

  readonly summary: string;
}

/* ============================================================================
 * Internal types
 * ========================================================================== */

interface RecoveryBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
}

interface RecoveryCandidatePosition {
  readonly x: number;
  readonly y: number;
  readonly distance: number;
}

interface NormalisedRecoveryOptions {
  readonly collisionClearance: number;

  readonly markerBoundaryClearance: number;

  readonly searchStep: number;

  readonly maximumLengthMovement: number;

  readonly maximumWidthMovement: number;

  readonly maximumPasses: number;

  readonly maximumCandidatesPerPlacement: number;

  readonly maximumSolutions: number;

  readonly allowBoundaryContact: boolean;

  readonly bidirectionalLengthSearch: boolean;

  readonly localRepairFirst: boolean;

  readonly minimumRecoveredUtilisation: number;

  readonly targetUtilisationPercent: number;
}

const DEFAULT_COLLISION_CLEARANCE = 0.5;

const DEFAULT_MARKER_BOUNDARY_CLEARANCE = 0;

const DEFAULT_SEARCH_STEP = 0.5;

const DEFAULT_MAXIMUM_PASSES = 6;

const DEFAULT_MAXIMUM_CANDIDATES = 1500;

const DEFAULT_MAXIMUM_SOLUTIONS = 8;

const DEFAULT_MINIMUM_UTILISATION = 0;

const DEFAULT_TARGET_UTILISATION = 90;

const EPSILON = 1e-8;

/* ============================================================================
 * Utility helpers
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

function finiteNumber(
  value: number | undefined,
  fallback: number
): number {
  return value !== undefined &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function finiteNonNegative(
  value: number | undefined,
  fallback: number
): number {
  return Math.max(
    0,
    finiteNumber(
      value,
      fallback
    )
  );
}

function distance(
  firstX: number,
  firstY: number,
  secondX: number,
  secondY: number
): number {
  return Math.hypot(
    secondX - firstX,
    secondY - firstY
  );
}

function normaliseOptions(
  input: SafeRecoveryMarkerInput,
  options:
    | SafeEfficiencyRecoveryOptions
    | undefined
): NormalisedRecoveryOptions {
  return {
    collisionClearance:
      finiteNonNegative(
        options?.collisionClearance,
        DEFAULT_COLLISION_CLEARANCE
      ),

    markerBoundaryClearance:
      finiteNonNegative(
        options
          ?.markerBoundaryClearance,
        DEFAULT_MARKER_BOUNDARY_CLEARANCE
      ),

    searchStep:
      Math.max(
        0.1,
        finiteNonNegative(
          options?.searchStep,
          DEFAULT_SEARCH_STEP
        )
      ),

    maximumLengthMovement:
      finiteNonNegative(
        options
          ?.maximumLengthMovement,
        input.markerLength
      ),

    maximumWidthMovement:
      finiteNonNegative(
        options
          ?.maximumWidthMovement,
        input.fabricWidth
      ),

    maximumPasses:
      Math.max(
        1,
        Math.floor(
          finiteNonNegative(
            options?.maximumPasses,
            DEFAULT_MAXIMUM_PASSES
          )
        )
      ),

    maximumCandidatesPerPlacement:
      Math.max(
        1,
        Math.floor(
          finiteNonNegative(
            options
              ?.maximumCandidatesPerPlacement,
            DEFAULT_MAXIMUM_CANDIDATES
          )
        )
      ),

    maximumSolutions:
      Math.max(
        1,
        Math.floor(
          finiteNonNegative(
            options?.maximumSolutions,
            DEFAULT_MAXIMUM_SOLUTIONS
          )
        )
      ),

    allowBoundaryContact:
      options?.allowBoundaryContact ??
      true,

    bidirectionalLengthSearch:
      options
        ?.bidirectionalLengthSearch ??
      true,

    localRepairFirst:
      options?.localRepairFirst ??
      true,

    minimumRecoveredUtilisation:
      clamp(
        finiteNumber(
          options
            ?.minimumRecoveredUtilisation,
          DEFAULT_MINIMUM_UTILISATION
        ),
        0,
        100
      ),

    targetUtilisationPercent:
      clamp(
        finiteNumber(
          options
            ?.targetUtilisationPercent,
          DEFAULT_TARGET_UTILISATION
        ),
        0,
        100
      ),
  };
}

/* ============================================================================
 * Geometry helpers
 * ========================================================================== */

function getPolygonBounds(
  polygon:
    ReadonlyArray<SafeRecoveryPoint>
): RecoveryBounds | null {
  if (polygon.length < 3) {
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

  for (const point of polygon) {
    if (
      !Number.isFinite(point.x) ||
      !Number.isFinite(point.y)
    ) {
      return null;
    }

    minX = Math.min(
      minX,
      point.x
    );

    minY = Math.min(
      minY,
      point.y
    );

    maxX = Math.max(
      maxX,
      point.x
    );

    maxY = Math.max(
      maxY,
      point.y
    );
  }

  return {
    minX,
    minY,
    maxX,
    maxY,

    width:
      Math.max(
        0,
        maxX - minX
      ),

    height:
      Math.max(
        0,
        maxY - minY
      ),
  };
}

function translatePolygon(
  polygon:
    ReadonlyArray<SafeRecoveryPoint>,
  deltaX: number,
  deltaY: number
): SafeRecoveryPoint[] {
  return polygon.map(
    (point) => ({
      x:
        point.x +
        deltaX,

      y:
        point.y +
        deltaY,
    })
  );
}

function movePlacement(
  placement:
    SafeRecoveryPlacement,
  x: number,
  y: number
): SafeRecoveryPlacement {
  const deltaX =
    x - placement.x;

  const deltaY =
    y - placement.y;

  return {
    ...placement,

    x,

    y,

    polygon:
      translatePolygon(
        placement.polygon,
        deltaX,
        deltaY
      ),

    source: "recovery",
  };
}

/* ============================================================================
 * Envelope collision checks
 *
 * RC5-004 currently passes rectangular engineering envelopes into the recovery
 * layer. This engine therefore performs deterministic envelope validation.
 *
 * When exact transformed traced polygons become available here, this collision
 * function can be replaced without changing the recovery architecture.
 * ========================================================================== */

function placementsCollide(
  first:
    SafeRecoveryPlacement,
  second:
    SafeRecoveryPlacement,
  clearance: number,
  allowBoundaryContact: boolean
): boolean {
  const firstBounds =
    getPolygonBounds(
      first.polygon
    );

  const secondBounds =
    getPolygonBounds(
      second.polygon
    );

  if (
    !firstBounds ||
    !secondBounds
  ) {
    return true;
  }

  const separatedX =
    allowBoundaryContact
      ? (
          firstBounds.maxX +
            clearance <=
            secondBounds.minX +
              EPSILON ||
          secondBounds.maxX +
            clearance <=
            firstBounds.minX +
              EPSILON
        )
      : (
          firstBounds.maxX +
            clearance <
            secondBounds.minX -
              EPSILON ||
          secondBounds.maxX +
            clearance <
            firstBounds.minX -
              EPSILON
        );

  const separatedY =
    allowBoundaryContact
      ? (
          firstBounds.maxY +
            clearance <=
            secondBounds.minY +
              EPSILON ||
          secondBounds.maxY +
            clearance <=
            firstBounds.minY +
              EPSILON
        )
      : (
          firstBounds.maxY +
            clearance <
            secondBounds.minY -
              EPSILON ||
          secondBounds.maxY +
            clearance <
            firstBounds.minY -
              EPSILON
        );

  return !(
    separatedX ||
    separatedY
  );
}

function detectCollisionPairs(
  placements:
    ReadonlyArray<SafeRecoveryPlacement>,
  clearance: number,
  allowBoundaryContact: boolean
): SafeRecoveryCollisionPair[] {
  const collisions:
    SafeRecoveryCollisionPair[] = [];

  for (
    let firstIndex = 0;
    firstIndex <
    placements.length;
    firstIndex += 1
  ) {
    const first =
      placements[firstIndex];

    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      placements.length;
      secondIndex += 1
    ) {
      const second =
        placements[secondIndex];

      if (
        placementsCollide(
          first,
          second,
          clearance,
          allowBoundaryContact
        )
      ) {
        collisions.push({
          firstId: first.id,
          secondId: second.id,
        });
      }
    }
  }

  return collisions;
}

function getFailedPlacementIds(
  input:
    SafeRecoveryMarkerInput,
  collisionPairs:
    ReadonlyArray<SafeRecoveryCollisionPair>
): string[] {
  if (
    input.failedPlacementIds &&
    input.failedPlacementIds.length >
      0
  ) {
    return Array.from(
      new Set(
        input.failedPlacementIds
      )
    );
  }

  const ids =
    new Set<string>();

  for (
    const pair of
    collisionPairs
  ) {
    ids.add(
      pair.firstId
    );

    ids.add(
      pair.secondId
    );
  }

  return Array.from(ids);
}

/* ============================================================================
 * Boundary checks
 * ========================================================================== */

function placementWithinMarker(
  placement:
    SafeRecoveryPlacement,
  markerLength: number,
  fabricWidth: number,
  clearance: number,
  allowBoundaryContact: boolean
): boolean {
  const bounds =
    getPolygonBounds(
      placement.polygon
    );

  if (!bounds) {
    return false;
  }

  const minimumX =
    clearance;

  const minimumY =
    clearance;

  const maximumX =
    markerLength -
    clearance;

  const maximumY =
    fabricWidth -
    clearance;

  if (
    allowBoundaryContact
  ) {
    return (
      bounds.minX >=
        minimumX -
          EPSILON &&
      bounds.minY >=
        minimumY -
          EPSILON &&
      bounds.maxX <=
        maximumX +
          EPSILON &&
      bounds.maxY <=
        maximumY +
          EPSILON
    );
  }

  return (
    bounds.minX >
      minimumX +
        EPSILON &&
    bounds.minY >
      minimumY +
        EPSILON &&
    bounds.maxX <
      maximumX -
        EPSILON &&
    bounds.maxY <
      maximumY -
        EPSILON
  );
}

function allPlacementsWithinMarker(
  placements:
    ReadonlyArray<SafeRecoveryPlacement>,
  markerLength: number,
  fabricWidth: number,
  clearance: number,
  allowBoundaryContact: boolean
): boolean {
  return placements.every(
    (placement) =>
      placementWithinMarker(
        placement,
        markerLength,
        fabricWidth,
        clearance,
        allowBoundaryContact
      )
  );
}

/* ============================================================================
 * Candidate search
 * ========================================================================== */

function generateCandidatePositions(
  placement:
    SafeRecoveryPlacement,
  settings:
    NormalisedRecoveryOptions
): RecoveryCandidatePosition[] {
  const candidates:
    RecoveryCandidatePosition[] =
    [];

  const addCandidate = (
    x: number,
    y: number
  ) => {
    candidates.push({
      x,
      y,

      distance:
        distance(
          placement.x,
          placement.y,
          x,
          y
        ),
    });
  };

  /**
   * Original position is tested first.
   */
  addCandidate(
    placement.x,
    placement.y
  );

  const maximumLengthSteps =
    Math.floor(
      settings
        .maximumLengthMovement /
        settings.searchStep
    );

  const maximumWidthSteps =
    Math.floor(
      settings
        .maximumWidthMovement /
        settings.searchStep
    );

  /**
   * Local radial search.
   *
   * Search increasing distance from the original location.
   */
  const maximumRadius =
    Math.max(
      maximumLengthSteps,
      maximumWidthSteps
    );

  for (
    let radius = 1;
    radius <= maximumRadius;
    radius += 1
  ) {
    for (
      let lengthStep =
        -radius;
      lengthStep <=
      radius;
      lengthStep += 1
    ) {
      for (
        let widthStep =
          -radius;
        widthStep <=
        radius;
        widthStep += 1
      ) {
        if (
          Math.max(
            Math.abs(
              lengthStep
            ),
            Math.abs(
              widthStep
            )
          ) !== radius
        ) {
          continue;
        }

        if (
          Math.abs(
            lengthStep
          ) >
          maximumLengthSteps
        ) {
          continue;
        }

        if (
          Math.abs(
            widthStep
          ) >
          maximumWidthSteps
        ) {
          continue;
        }

        if (
          !settings
            .bidirectionalLengthSearch &&
          lengthStep < 0
        ) {
          continue;
        }

        const x =
          placement.x +
          lengthStep *
            settings.searchStep;

        const y =
          placement.y +
          widthStep *
            settings.searchStep;

        addCandidate(
          x,
          y
        );

        if (
          candidates.length >=
          settings
            .maximumCandidatesPerPlacement
        ) {
          break;
        }
      }

      if (
        candidates.length >=
        settings
          .maximumCandidatesPerPlacement
      ) {
        break;
      }
    }

    if (
      candidates.length >=
      settings
        .maximumCandidatesPerPlacement
    ) {
      break;
    }
  }

  if (
    settings.localRepairFirst
  ) {
    candidates.sort(
      (first, second) =>
        first.distance -
        second.distance
    );
  }

  return candidates.slice(
    0,
    settings
      .maximumCandidatesPerPlacement
  );
}

/* ============================================================================
 * Recovery validation
 * ========================================================================== */

function placementCandidateIsSafe(
  candidate:
    SafeRecoveryPlacement,
  allPlacements:
    ReadonlyArray<SafeRecoveryPlacement>,
  candidateIndex: number,
  input:
    SafeRecoveryMarkerInput,
  settings:
    NormalisedRecoveryOptions
): boolean {
  if (
    !placementWithinMarker(
      candidate,
      input.markerLength,
      input.fabricWidth,
      settings
        .markerBoundaryClearance,
      settings
        .allowBoundaryContact
    )
  ) {
    return false;
  }

  for (
    let index = 0;
    index <
    allPlacements.length;
    index += 1
  ) {
    if (
      index ===
      candidateIndex
    ) {
      continue;
    }

    if (
      placementsCollide(
        candidate,
        allPlacements[index],
        settings
          .collisionClearance,
        settings
          .allowBoundaryContact
      )
    ) {
      return false;
    }
  }

  return true;
}

/* ============================================================================
 * Marker metrics
 * ========================================================================== */

function calculateMarkerLength(
  placements:
    ReadonlyArray<SafeRecoveryPlacement>
): number {
  let maximumX = 0;

  for (
    const placement of
    placements
  ) {
    const bounds =
      getPolygonBounds(
        placement.polygon
      );

    if (!bounds) {
      continue;
    }

    maximumX =
      Math.max(
        maximumX,
        bounds.maxX
      );
  }

  return maximumX;
}

function calculateUtilisation(
  totalPatternArea: number,
  markerLength: number,
  fabricWidth: number
): number {
  const markerArea =
    markerLength *
    fabricWidth;

  if (
    markerArea <=
      EPSILON ||
    totalPatternArea <=
      EPSILON
  ) {
    return 0;
  }

  return clamp(
    (
      totalPatternArea /
      markerArea
    ) *
      100,
    0,
    100
  );
}

function calculateRecoveryScore(
  collisionFree: boolean,
  boundarySafe: boolean,
  utilisationPercent: number,
  movedPlacementCount: number,
  totalMovementDistance: number,
  targetUtilisationPercent: number
): number {
  /**
   * Safety dominates the score.
   *
   * 45% collision safety
   * 25% marker-boundary safety
   * 20% utilisation
   * 10% movement efficiency
   */

  const collisionScore =
    collisionFree
      ? 100
      : 0;

  const boundaryScore =
    boundarySafe
      ? 100
      : 0;

  const utilisationScore =
    targetUtilisationPercent >
    0
      ? clamp(
          (
            utilisationPercent /
            targetUtilisationPercent
          ) *
            100,
          0,
          100
        )
      : utilisationPercent;

  const movementPenalty =
    movedPlacementCount > 0
      ? Math.min(
          100,
          totalMovementDistance /
            movedPlacementCount *
            4
        )
      : 0;

  const movementScore =
    Math.max(
      0,
      100 -
        movementPenalty
    );

  return clamp(
    collisionScore *
      0.45 +
      boundaryScore *
        0.25 +
      utilisationScore *
        0.2 +
      movementScore *
        0.1,
    0,
    100
  );
}

/* ============================================================================
 * Recovery pass
 * ========================================================================== */

function recoverPlacements(
  input:
    SafeRecoveryMarkerInput,
  failedPlacementIds:
    ReadonlyArray<string>,
  settings:
    NormalisedRecoveryOptions
): {
  placements:
    SafeRecoveryPlacement[];

  moves:
    SafeRecoveryPlacementMove[];

  candidateTests: number;

  rejectedCandidateTests: number;

  passes: number;
} {
    let workingPlacements: SafeRecoveryPlacement[] =
    input.placements.map(
      (placement): SafeRecoveryPlacement => ({
        ...placement,

        polygon:
          placement.polygon.map(
            (point) => ({
              x: point.x,
              y: point.y,
            })
          ),
      })
    );

  const moves:
    SafeRecoveryPlacementMove[] =
    [];

  let candidateTests = 0;

  let rejectedCandidateTests =
    0;

  let passes = 0;

  for (
    let pass = 0;
    pass <
    settings.maximumPasses;
    pass += 1
  ) {
    passes =
      pass + 1;

    let movedInPass =
      false;

    const currentPairs =
      detectCollisionPairs(
        workingPlacements,
        settings
          .collisionClearance,
        settings
          .allowBoundaryContact
      );

    if (
      currentPairs.length ===
      0
    ) {
      break;
    }

    const currentFailedIds =
      new Set<string>(
        failedPlacementIds
      );

    for (
      const pair of
      currentPairs
    ) {
      currentFailedIds.add(
        pair.firstId
      );

      currentFailedIds.add(
        pair.secondId
      );
    }

    /**
     * Lower-priority pieces move first.
     */
    const candidateIndexes =
      workingPlacements
        .map(
          (
            placement,
            index
          ) => ({
            placement,
            index,
          })
        )
        .filter(
          ({ placement }) =>
            currentFailedIds.has(
              placement.id
            ) &&
            !placement.locked
        )
        .sort(
          (first, second) =>
            (
              first.placement
                .priority ??
              50
            ) -
            (
              second.placement
                .priority ??
              50
            )
        );

    for (
      const candidateEntry of
      candidateIndexes
    ) {
      const original =
        workingPlacements[
          candidateEntry.index
        ];

      const candidatePositions =
        generateCandidatePositions(
          original,
          settings
        );

      let recovered:
        SafeRecoveryPlacement |
        null = null;

      for (
        const candidatePosition of
        candidatePositions
      ) {
        candidateTests += 1;

        const candidate =
          movePlacement(
            original,
            candidatePosition.x,
            candidatePosition.y
          );

        if (
          placementCandidateIsSafe(
            candidate,
            workingPlacements,
            candidateEntry.index,
            input,
            settings
          )
        ) {
          recovered =
            candidate;

          break;
        }

        rejectedCandidateTests +=
          1;
      }

      if (!recovered) {
        continue;
      }

      if (
        Math.abs(
          recovered.x -
            original.x
        ) <=
          EPSILON &&
        Math.abs(
          recovered.y -
            original.y
        ) <=
          EPSILON
      ) {
        continue;
      }

      workingPlacements[
        candidateEntry.index
      ] = recovered;

      moves.push({
        id:
          original.id,

        originalX:
          original.x,

        originalY:
          original.y,

        recoveredX:
          recovered.x,

        recoveredY:
          recovered.y,

        movementDistance:
          distance(
            original.x,
            original.y,
            recovered.x,
            recovered.y
          ),
      });

      movedInPass =
        true;
    }

    if (!movedInPass) {
      break;
    }
  }

  return {
    placements:
      workingPlacements,

    moves,

    candidateTests,

    rejectedCandidateTests,

    passes,
  };
}

/* ============================================================================
 * Solution creation
 * ========================================================================== */

function createRecoveredSolution(
  input:
    SafeRecoveryMarkerInput,
  placements:
    ReadonlyArray<SafeRecoveryPlacement>,
  moves:
    ReadonlyArray<SafeRecoveryPlacementMove>,
  index: number,
  settings:
    NormalisedRecoveryOptions
): SafeEfficiencyRecoveredSolution {
  const collisionPairs =
    detectCollisionPairs(
      placements,
      settings
        .collisionClearance,
      settings
        .allowBoundaryContact
    );

  const collisionFree =
    collisionPairs.length ===
    0;

  const recoveredMarkerLength =
    calculateMarkerLength(
      placements
    );

  const boundarySafe =
    allPlacementsWithinMarker(
      placements,
      Math.max(
        input.markerLength,
        recoveredMarkerLength
      ),
      input.fabricWidth,
      settings
        .markerBoundaryClearance,
      settings
        .allowBoundaryContact
    );

  const utilisationPercent =
    calculateUtilisation(
      input.totalPatternArea,
      recoveredMarkerLength,
      input.fabricWidth
    );

  const wastePercent =
    Math.max(
      0,
      100 -
        utilisationPercent
    );

  const totalMovementDistance =
    moves.reduce(
      (
        total,
        move
      ) =>
        total +
        move.movementDistance,
      0
    );

  const engineeringScore =
    calculateRecoveryScore(
      collisionFree,
      boundarySafe,
      utilisationPercent,
      moves.length,
      totalMovementDistance,
      settings
        .targetUtilisationPercent
    );

  const targetUtilisationAchieved =
    utilisationPercent +
      EPSILON >=
    settings
      .targetUtilisationPercent;

  const engineeringReady =
    collisionFree &&
    boundarySafe &&
    utilisationPercent +
      EPSILON >=
      settings
        .minimumRecoveredUtilisation;

  return {
    id:
      `${input.markerId}-safe-recovery-${index + 1}`,

    sourceMarkerId:
      input.markerId,

    placements,

    movedPlacements:
      moves,

    movedPlacementCount:
      moves.length,

    collisionFree,

    boundarySafe,

    collisionCount:
      collisionPairs.length,

    markerLength:
      recoveredMarkerLength,

    utilisationPercent,

    wastePercent,

    lengthChange:
      recoveredMarkerLength -
      input.markerLength,

    utilisationChange:
      utilisationPercent -
      calculateUtilisation(
        input.totalPatternArea,
        input.markerLength,
        input.fabricWidth
      ),

    engineeringScore,

    targetUtilisationAchieved,

    engineeringReady,
  };
}

/* ============================================================================
 * Ranking
 * ========================================================================== */

function compareRecoveredSolutions(
  first:
    SafeEfficiencyRecoveredSolution,
  second:
    SafeEfficiencyRecoveredSolution
): number {
  /**
   * Safety first.
   */
  if (
    first.engineeringReady !==
    second.engineeringReady
  ) {
    return second
      .engineeringReady
      ? 1
      : -1;
  }

  if (
    first.collisionFree !==
    second.collisionFree
  ) {
    return second
      .collisionFree
      ? 1
      : -1;
  }

  if (
    first.boundarySafe !==
    second.boundarySafe
  ) {
    return second
      .boundarySafe
      ? 1
      : -1;
  }

  /**
   * Then target achievement.
   */
  if (
    first.targetUtilisationAchieved !==
    second.targetUtilisationAchieved
  ) {
    return second
      .targetUtilisationAchieved
      ? 1
      : -1;
  }

  /**
   * Then utilisation.
   */
  if (
    Math.abs(
      first.utilisationPercent -
      second.utilisationPercent
    ) >
    EPSILON
  ) {
    return (
      second.utilisationPercent -
      first.utilisationPercent
    );
  }

  /**
   * Then shorter Marker Length.
   */
  if (
    Math.abs(
      first.markerLength -
      second.markerLength
    ) >
    EPSILON
  ) {
    return (
      first.markerLength -
      second.markerLength
    );
  }

  /**
   * Then less movement.
   */
  if (
    first.movedPlacementCount !==
    second.movedPlacementCount
  ) {
    return (
      first.movedPlacementCount -
      second.movedPlacementCount
    );
  }

  return (
    second.engineeringScore -
    first.engineeringScore
  );
}

/* ============================================================================
 * Public engine
 * ========================================================================== */

export function runSafeEfficiencyRecovery(
  input:
    SafeRecoveryMarkerInput,
  options?:
    SafeEfficiencyRecoveryOptions
): SafeEfficiencyRecoveryResult {
  const settings =
    normaliseOptions(
      input,
      options
    );

  const originalCollisionPairs =
    detectCollisionPairs(
      input.placements,
      settings
        .collisionClearance,
      settings
        .allowBoundaryContact
    );

  const failedPlacementIds =
    getFailedPlacementIds(
      input,
      originalCollisionPairs
    );

  /**
   * Nothing to recover.
   */
  if (
    originalCollisionPairs.length ===
      0 &&
    failedPlacementIds.length ===
      0
  ) {
    const unchangedSolution =
      createRecoveredSolution(
        input,
        input.placements,
        [],
        0,
        settings
      );

    return {
      markerId:
        input.markerId,

      originalCollisionPairs,

      failedPlacementIds,

      solutions: [
        unchangedSolution,
      ],

      bestSolution:
        unchangedSolution,

      statistics: {
        originalCollisionCount:
          0,

        failedPlacementCount:
          0,

        recoveredSolutionCount:
          1,

        bestRecoveredUtilisation:
          unchangedSolution
            .utilisationPercent,

        bestRecoveredMarkerLength:
          unchangedSolution
            .markerLength,

        targetUtilisationPercent:
          settings
            .targetUtilisationPercent,

        targetAchievedByAnySolution:
          unchangedSolution
            .targetUtilisationAchieved,

        candidateTests:
          0,

        rejectedCandidateTests:
          0,

        recoveryPasses:
          0,
      },

      engineeringReady:
        unchangedSolution
          .engineeringReady,

      summary:
        "The marker is already collision-free. No Safe Efficiency Recovery movement was required.",
    };
  }

  const recovery =
    recoverPlacements(
      input,
      failedPlacementIds,
      settings
    );

  const solutions:
    SafeEfficiencyRecoveredSolution[] =
    [];

  /**
   * Main recovered solution.
   */
  solutions.push(
    createRecoveredSolution(
      input,
      recovery.placements,
      recovery.moves,
      0,
      settings
    )
  );

  /**
   * If we made multiple moves, build incremental rollback alternatives.
   *
   * This gives the ranking layer more than one recovery option without
   * performing an uncontrolled combinatorial explosion.
   */
  if (
    recovery.moves.length >
    1
  ) {
    for (
      let rollbackCount = 1;
      rollbackCount <
      recovery.moves.length;
      rollbackCount += 1
    ) {
      if (
        solutions.length >=
        settings.maximumSolutions
      ) {
        break;
      }

      const rollbackIds =
        new Set(
          recovery.moves
            .slice(
              recovery.moves.length -
              rollbackCount
            )
            .map(
              (move) =>
                move.id
            )
        );

      const rollbackPlacements =
        recovery.placements.map(
          (placement) => {
            if (
              !rollbackIds.has(
                placement.id
              )
            ) {
              return placement;
            }

            const original =
              input.placements.find(
                (candidate) =>
                  candidate.id ===
                  placement.id
              );

            return (
              original ??
              placement
            );
          }
        );

      const retainedMoves =
        recovery.moves.filter(
          (move) =>
            !rollbackIds.has(
              move.id
            )
        );

      solutions.push(
        createRecoveredSolution(
          input,
          rollbackPlacements,
          retainedMoves,
          solutions.length,
          settings
        )
      );
    }
  }

  const rankedSolutions =
    solutions
      .sort(
        compareRecoveredSolutions
      )
      .slice(
        0,
        settings.maximumSolutions
      );

  const bestSolution =
    rankedSolutions[0] ??
    null;

  const targetAchievedByAnySolution =
    rankedSolutions.some(
      (solution) =>
        solution
          .engineeringReady &&
        solution
          .targetUtilisationAchieved
    );

  return {
    markerId:
      input.markerId,

    originalCollisionPairs,

    failedPlacementIds,

    solutions:
      rankedSolutions,

    bestSolution,

    statistics: {
      originalCollisionCount:
        originalCollisionPairs.length,

      failedPlacementCount:
        failedPlacementIds.length,

      recoveredSolutionCount:
        rankedSolutions.length,

      bestRecoveredUtilisation:
        bestSolution
          ?.utilisationPercent ??
        0,

      bestRecoveredMarkerLength:
        bestSolution
          ?.markerLength ??
        input.markerLength,

      targetUtilisationPercent:
        settings
          .targetUtilisationPercent,

      targetAchievedByAnySolution,

      candidateTests:
        recovery.candidateTests,

      rejectedCandidateTests:
        recovery
          .rejectedCandidateTests,

      recoveryPasses:
        recovery.passes,
    },

    engineeringReady:
      Boolean(
        bestSolution
          ?.engineeringReady
      ),

    summary:
      bestSolution
        ? bestSolution.engineeringReady
          ? `Safe Efficiency Recovery produced an engineering-ready solution at ${bestSolution.utilisationPercent.toFixed(
              2
            )}% utilisation.`
          : `Safe Efficiency Recovery completed, but the best recovered solution still requires engineering review at ${bestSolution.utilisationPercent.toFixed(
              2
            )}% utilisation.`
        : "Safe Efficiency Recovery could not generate a recovered marker solution.",
  };
}

/* ============================================================================
 * Convenience helpers
 * ========================================================================== */

export function getBestSafeRecoveredSolution(
  result:
    SafeEfficiencyRecoveryResult
): SafeEfficiencyRecoveredSolution | null {
  return result.bestSolution;
}

export function getEngineeringReadyRecoveredSolutions(
  result:
    SafeEfficiencyRecoveryResult
): ReadonlyArray<SafeEfficiencyRecoveredSolution> {
  return result.solutions.filter(
    (solution) =>
      solution.engineeringReady
  );
}

export function getTargetRecoveredSolutions(
  result:
    SafeEfficiencyRecoveryResult
): ReadonlyArray<SafeEfficiencyRecoveredSolution> {
  return result.solutions.filter(
    (solution) =>
      solution.engineeringReady &&
      solution
        .targetUtilisationAchieved
  );
}