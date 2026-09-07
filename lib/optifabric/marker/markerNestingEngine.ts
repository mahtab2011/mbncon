import {
  rectanglesOverlap,
  type MarkerRectangle,
} from "./markerCollisionEngine";

import {
  countPolygonCollisions,
  polygonsOverlap,
  transformPolygonToMarker,
  violatesPolygonClearance,
  type PolygonPoint,
  type PositionedPolygon,
} from "./markerPolygonCollisionEngine";



export interface NestingPattern {
  id: string;

  width: number;
  height: number;

  vertices: PolygonPoint[];

  allowedRotations?: Array<0 | 90 | 180 | 270>;
}

export interface NestedPattern {
  id: string;

  x: number;
  y: number;

  width: number;
  height: number;

  rotation: 0 | 90 | 180 | 270;
}

export interface NestingOptions {
  fabricWidth: number;

  horizontalGap?: number;
  verticalGap?: number;

  /*
   * Retained for compatibility with the Marker page.
   * This engine no longer performs fixed-step grid searching.
   */
  searchStep?: number;

  maximumMarkerHeight?: number;

  /*
   * Browser-safety guard.
   * Stops one piece from testing an excessive number of positions.
   */
  maximumCandidateTestsPerPiece?: number;

  /**
   * Minimum permitted distance between the true outlines of two pieces.
   *
   * Defaults to the larger of horizontalGap and verticalGap, so the gap the
   * caller already asked for is genuinely enforced rather than merely being
   * built into candidate coordinates.
   */
  minimumClearance?: number;

  /**
   * Height of one spatial index band, in the same units as the placement
   * coordinates.
   *
   * Placed pieces are bucketed into horizontal bands so that a candidate is
   * only compared against pieces occupying the bands it actually spans. The
   * broad phase previously scanned every placed piece on every candidate
   * test, which is quadratic in the number of pieces and made large
   * multi-garment markers unusable in a browser.
   */
  spatialBandHeight?: number;
}

export interface NestingResult {
  patterns: NestedPattern[];

  markerHeight: number;

  collisionCount: number;

  placedCount: number;
  unplacedCount: number;

  candidateTests: number;

  /** Pieces that hit the per-piece test budget rather than genuinely not fitting. */
  budgetExhaustedCount: number;
}

/**
 * RC6 polygon-aware deterministic bottom-left nesting.
 *
 * Strategy:
 *
 * 1. Sort largest pieces first.
 * 2. Try only explicitly permitted rotations.
 * 3. Generate candidate coordinates from the edges of placed pieces.
 * 4. Narrow the broad phase with a horizontal band index.
 * 5. Run true polygon collision and clearance only on surviving neighbours.
 * 6. Select the lowest and then leftmost legal placement.
 *
 * Determinism is preserved throughout: no randomness and no time-derived
 * values, so identical input always produces an identical marker.
 */
export function createDeterministicNestedMarker(
  patterns: NestingPattern[],
  options: NestingOptions
): NestingResult {
  const horizontalGap = Math.max(options.horizontalGap ?? 0, 0);

  const verticalGap = Math.max(options.verticalGap ?? 0, 0);

  const maximumMarkerHeight = options.maximumMarkerHeight ?? 10000;

  const maximumCandidateTestsPerPiece =
    options.maximumCandidateTestsPerPiece ?? 2500;

  const minimumClearance = Math.max(
    options.minimumClearance ?? Math.max(horizontalGap, verticalGap),
    0
  );

  const spatialBandHeight = Math.max(options.spatialBandHeight ?? 200, 1);

  const sortedPatterns = [...patterns].sort((first, second) => {
    const firstArea = first.width * first.height;
    const secondArea = second.width * second.height;

    if (secondArea !== firstArea) {
      return secondArea - firstArea;
    }

    /*
     * Deterministic tie-break:
     * equal-sized pieces always retain a repeatable order.
     */
    return first.id.localeCompare(second.id);
  });

  const placed: NestedPattern[] = [];

  const placedPolygons: PositionedPolygon[] = [];

  /*
   * Marker-coordinate outlines of every placed piece, transformed once.
   */
  const placedOutlines: PolygonPoint[][] = [];

  const placedBounds: MarkerRectangle[] = [];

  /* ---------------------------- Spatial index ---------------------------- */

  const bandIndex = new Map<number, number[]>();

  const bandRange = (
    top: number,
    bottom: number
  ): { first: number; last: number } => ({
    first: Math.floor(top / spatialBandHeight),
    last: Math.floor(bottom / spatialBandHeight),
  });

  const addToBandIndex = (
    placedIndex: number,
    rectangle: MarkerRectangle
  ): void => {
    const { first, last } = bandRange(
      rectangle.y,
      rectangle.y + rectangle.height
    );

    for (let band = first; band <= last; band += 1) {
      const bucket = bandIndex.get(band);

      if (bucket) {
        bucket.push(placedIndex);
      } else {
        bandIndex.set(band, [placedIndex]);
      }
    }
  };

  const collectNearbyIndexes = (
    candidateBounds: MarkerRectangle
  ): number[] => {
    const { first, last } = bandRange(
      candidateBounds.y,
      candidateBounds.y + candidateBounds.height
    );

    const seen = new Set<number>();
    const nearby: number[] = [];

    for (let band = first; band <= last; band += 1) {
      const bucket = bandIndex.get(band);

      if (!bucket) {
        continue;
      }

      for (const placedIndex of bucket) {
        if (seen.has(placedIndex)) {
          continue;
        }

        seen.add(placedIndex);

        if (rectanglesOverlap(candidateBounds, placedBounds[placedIndex])) {
          nearby.push(placedIndex);
        }
      }
    }

    return nearby;
  };

  /* ------------------------------ Placement ------------------------------ */

  let markerHeight = 0;
  let totalCandidateTests = 0;
  let budgetExhaustedCount = 0;

  for (const pattern of sortedPatterns) {
    const rotations: Array<0 | 90 | 180 | 270> =
      pattern.allowedRotations && pattern.allowedRotations.length > 0
        ? pattern.allowedRotations
        : [0];

    let bestCandidate: NestedPattern | null = null;

    let bestY = Number.POSITIVE_INFINITY;
    let bestX = Number.POSITIVE_INFINITY;

    let candidateTestsForPiece = 0;
    let budgetExhausted = false;

    /*
     * Candidate coordinates come from the real boundaries of pieces already
     * placed. BOTH edges of every placed piece are contributed, so a piece
     * can align with a neighbour's left or top edge — the most common tight
     * nesting position — and not only sit after it.
     */
    const xCandidates = new Set<number>([0]);
    const yCandidates = new Set<number>([0]);

    for (const placedPattern of placed) {
      xCandidates.add(roundCoordinate(placedPattern.x));

      xCandidates.add(
        roundCoordinate(
          placedPattern.x + placedPattern.width + horizontalGap
        )
      );

      yCandidates.add(roundCoordinate(placedPattern.y));

      yCandidates.add(
        roundCoordinate(
          placedPattern.y + placedPattern.height + verticalGap
        )
      );
    }

    const sortedX = Array.from(xCandidates)
      .filter((value) => Number.isFinite(value) && value >= 0)
      .sort((first, second) => first - second);

    const sortedY = Array.from(yCandidates)
      .filter((value) => Number.isFinite(value) && value >= 0)
      .sort((first, second) => first - second);

    rotationLoop: for (const rotation of rotations) {
      /*
       * 90° and 270° exchange the footprint's width and height. 180° keeps
       * the original footprint dimensions — only the outline orientation
       * changes (see transformPolygonToMarker).
       */
      const exchangesDimensions = rotation === 90 || rotation === 270;

      const candidateWidth =
        exchangesDimensions ? pattern.height : pattern.width;

      const candidateHeight =
        exchangesDimensions ? pattern.width : pattern.height;

      if (
        !Number.isFinite(candidateWidth) ||
        !Number.isFinite(candidateHeight) ||
        candidateWidth <= 0 ||
        candidateHeight <= 0
      ) {
        continue;
      }

      if (candidateWidth > options.fabricWidth) {
        continue;
      }

      for (const y of sortedY) {
        if (y + candidateHeight > maximumMarkerHeight) {
          break;
        }

        /*
         * sortedY is ascending.
         * No later row can improve an already lower result.
         */
        if (y > bestY) {
          break;
        }

        let validCandidateFoundOnRow = false;

        for (const x of sortedX) {
          if (candidateTestsForPiece >= maximumCandidateTestsPerPiece) {
            budgetExhausted = true;
            break rotationLoop;
          }

          candidateTestsForPiece += 1;
          totalCandidateTests += 1;

          if (x + candidateWidth > options.fabricWidth) {
            break;
          }

          if (y === bestY && x >= bestX) {
            break;
          }

          const candidate: NestedPattern = {
            id: pattern.id,

            x,
            y,

            width: candidateWidth,
            height: candidateHeight,

            rotation,
          };

          /*
           * BROAD PHASE
           *
           * Bounds are inflated by the clearance so a neighbour sitting just
           * outside the raw rectangle is still examined — a piece close
           * enough to breach the cutting gap would otherwise be skipped.
           */
          const candidateBounds: MarkerRectangle = {
            id: candidate.id,

            x: candidate.x - minimumClearance,
            y: candidate.y - minimumClearance,

            width: candidate.width + minimumClearance * 2,
            height: candidate.height + minimumClearance * 2,
          };

          const nearbyIndexes = collectNearbyIndexes(candidateBounds);

          /*
           * NARROW PHASE
           *
           * Exact polygon work runs only against pieces that survived the
           * band index and the rectangle test.
           */
          if (nearbyIndexes.length > 0) {
            const candidatePolygon: PositionedPolygon = {
              id: candidate.id,

              vertices: pattern.vertices,

              x: candidate.x,
              y: candidate.y,

              width: candidate.width,
              height: candidate.height,

              rotation: candidate.rotation,
            };

            const candidateOutline =
              transformPolygonToMarker(candidatePolygon);

            if (candidateOutline.length < 3) {
              continue;
            }

            let rejected = false;

            for (const index of nearbyIndexes) {
              const placedOutline = placedOutlines[index];

              if (
                minimumClearance > 0
                  ? violatesPolygonClearance(
                      candidateOutline,
                      placedOutline,
                      minimumClearance
                    )
                  : polygonsOverlap(candidateOutline, placedOutline)
              ) {
                rejected = true;
                break;
              }
            }

            if (rejected) {
              continue;
            }
          }

          /*
           * Legal candidate found. x is ascending, so this is already the
           * leftmost legal candidate on this row.
           */
          bestCandidate = candidate;

          bestY = candidate.y;
          bestX = candidate.x;

          validCandidateFoundOnRow = true;

          break;
        }

        /*
         * y is ascending, so the first valid row is the highest legal row for
         * this rotation. Continue to the next rotation so 0° and 90° can
         * still compete against each other.
         */
        if (validCandidateFoundOnRow) {
          break;
        }
      }
    }

    if (!bestCandidate) {
      if (budgetExhausted) {
        budgetExhaustedCount += 1;
      }

      continue;
    }

    const placedIndex = placed.length;

    placed.push(bestCandidate);

    const bounds: MarkerRectangle = {
      id: bestCandidate.id,

      x: bestCandidate.x,
      y: bestCandidate.y,

      width: bestCandidate.width,
      height: bestCandidate.height,
    };

    placedBounds.push(bounds);

    addToBandIndex(placedIndex, bounds);

    const placedPolygon: PositionedPolygon = {
      id: bestCandidate.id,

      vertices: pattern.vertices,

      x: bestCandidate.x,
      y: bestCandidate.y,

      width: bestCandidate.width,
      height: bestCandidate.height,

      rotation: bestCandidate.rotation,
    };

    placedPolygons.push(placedPolygon);

    placedOutlines.push(transformPolygonToMarker(placedPolygon));

    markerHeight = Math.max(
      markerHeight,
      bestCandidate.y + bestCandidate.height
    );
  }

  return {
    patterns: placed,

    markerHeight,

    collisionCount: countPolygonCollisions(placedPolygons),

    placedCount: placed.length,

    unplacedCount: patterns.length - placed.length,

    candidateTests: totalCandidateTests,

    budgetExhaustedCount,
  };
}

function roundCoordinate(value: number): number {
  return Math.round(value * 1000) / 1000;
}