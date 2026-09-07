export interface PolygonPoint {
  x: number;
  y: number;
}

export interface PositionedPolygon {
  id: string;

  vertices: PolygonPoint[];

  x: number;
  y: number;

  width: number;
  height: number;

  rotation: 0 | 90 | 180 | 270;
}

export interface PolygonCollisionPair {
  firstId: string;
  secondId: string;
}

interface PolygonBounds {
  minimumX: number;
  minimumY: number;

  maximumX: number;
  maximumY: number;
}

type PointPolygonRelationship =
  | "inside"
  | "outside"
  | "boundary";

const GEOMETRY_EPSILON = 0.000001;

/* ============================================================================
 * Coordinate transformation
 * ========================================================================== */

/**
 * Converts source-image polygon vertices into marker-canvas coordinates.
 *
 * The original polygon is:
 *
 * 1. Normalised against its source bounding box.
 * 2. Scaled to its placed marker dimensions.
 * 3. Rotated when required.
 * 4. Translated to its marker X/Y position.
 *
 * This keeps collision geometry aligned with the dimensions displayed
 * by the Marker page.
 */
export function transformPolygonToMarker(
  polygon: PositionedPolygon
): PolygonPoint[] {
  if (
    !Array.isArray(polygon.vertices) ||
    polygon.vertices.length < 3
  ) {
    return [];
  }

  if (
    !Number.isFinite(polygon.x) ||
    !Number.isFinite(polygon.y) ||
    !Number.isFinite(polygon.width) ||
    !Number.isFinite(polygon.height) ||
    polygon.width <= 0 ||
    polygon.height <= 0
  ) {
    return [];
  }

  const bounds =
    calculatePolygonBounds(
      polygon.vertices
    );

  const sourceWidth = Math.max(
    bounds.maximumX -
      bounds.minimumX,
    GEOMETRY_EPSILON
  );

  const sourceHeight = Math.max(
    bounds.maximumY -
      bounds.minimumY,
    GEOMETRY_EPSILON
  );

  const normalisedVertices =
    polygon.vertices.map((point) => ({
      x:
        (point.x -
          bounds.minimumX) /
        sourceWidth,

      y:
        (point.y -
          bounds.minimumY) /
        sourceHeight,
    }));

  if (polygon.rotation === 90) {
    return normalisedVertices.map(
      (point) => ({
        /*
         * 90° clockwise rotation in screen coordinates,
         * where positive Y travels downward.
         *
         * The nesting engine has already exchanged the
         * placed width and height for the rotation.
         */
        x:
          polygon.x +
          (1 - point.y) *
            polygon.width,

        y:
          polygon.y +
          point.x *
            polygon.height,
      })
    );
  }

  if (polygon.rotation === 180) {
    return normalisedVertices.map(
      (point) => ({
        /*
         * 180° rotation about the piece's own centre. Width and height are
         * NOT exchanged for 180° — the footprint keeps its original
         * orientation, only which end faces which way changes.
         */
        x:
          polygon.x +
          (1 - point.x) *
            polygon.width,

        y:
          polygon.y +
          (1 - point.y) *
            polygon.height,
      })
    );
  }

  if (polygon.rotation === 270) {
    return normalisedVertices.map(
      (point) => ({
        /*
         * 270° clockwise (= 90° counter-clockwise). The nesting engine has
         * already exchanged the placed width and height, as it does for 90°.
         */
        x:
          polygon.x +
          point.y *
            polygon.width,

        y:
          polygon.y +
          (1 - point.x) *
            polygon.height,
      })
    );
  }

  return normalisedVertices.map(
    (point) => ({
      x:
        polygon.x +
        point.x *
          polygon.width,

      y:
        polygon.y +
        point.y *
          polygon.height,
    })
  );
}

/**
 * Transforms a collection once so repeated collision checks can reuse
 * the resulting marker-coordinate polygons.
 */
export function transformManyPolygonsToMarker(
  polygons: PositionedPolygon[]
): PolygonPoint[][] {
  return polygons.map(
    transformPolygonToMarker
  );
}

/* ============================================================================
 * Polygon overlap
 * ========================================================================== */

/**
 * Checks whether two true polygon outlines overlap.
 *
 * Supports convex and concave simple polygons.
 *
 * Default engineering behaviour:
 *
 * - Proper edge crossing = collision.
 * - One polygon inside another = collision.
 * - Single-point touching = permitted.
 * - Flush shared boundary = permitted.
 *
 * Set treatTouchingAsOverlap to true when any physical contact should
 * be treated as unsafe.
 */
export function polygonsOverlap(
  firstPolygon: PolygonPoint[],
  secondPolygon: PolygonPoint[],
  treatTouchingAsOverlap = false
): boolean {
  if (
    firstPolygon.length < 3 ||
    secondPolygon.length < 3
  ) {
    return false;
  }

  const firstBounds =
    calculatePolygonBounds(
      firstPolygon
    );

  const secondBounds =
    calculatePolygonBounds(
      secondPolygon
    );

  if (
    !polygonBoundsOverlap(
      firstBounds,
      secondBounds,
      treatTouchingAsOverlap
    )
  ) {
    return false;
  }

  let overlappingCollinearEdges = 0;

  for (
    let firstIndex = 0;
    firstIndex <
    firstPolygon.length;
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
      secondIndex <
      secondPolygon.length;
      secondIndex += 1
    ) {
      const secondStart =
        secondPolygon[secondIndex];

      const secondEnd =
        secondPolygon[
          (secondIndex + 1) %
            secondPolygon.length
        ];

      if (treatTouchingAsOverlap) {
        if (
          lineSegmentsIntersect(
            firstStart,
            firstEnd,
            secondStart,
            secondEnd
          )
        ) {
          return true;
        }

        continue;
      }

      if (
        lineSegmentsProperlyCross(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd
        )
      ) {
        return true;
      }

      if (
        collinearSegmentsOverlapByDistance(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd
        )
      ) {
        overlappingCollinearEdges += 1;
      }
    }
  }

  /*
   * Two pieces may safely share one boundary edge.
   *
   * Multiple coincident edges usually indicate that one polygon
   * has been placed directly on top of another, rather than merely
   * touching it along a cutting boundary.
   */
  if (
    overlappingCollinearEdges >= 2
  ) {
    return true;
  }

  /*
   * Edge checks alone do not detect one polygon lying completely
   * inside another, so test all vertices for strict containment.
   */
  for (const point of firstPolygon) {
    if (
      classifyPointAgainstPolygon(
        point,
        secondPolygon
      ) === "inside"
    ) {
      return true;
    }
  }

  for (const point of secondPolygon) {
    if (
      classifyPointAgainstPolygon(
        point,
        firstPolygon
      ) === "inside"
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Tests one candidate against already positioned polygons.
 *
 * preTransformedPlaced may be supplied by an optimisation loop to avoid
 * transforming every existing polygon repeatedly.
 */
export function overlapsAnyPolygon(
  candidate: PositionedPolygon,
  placedPatterns: PositionedPolygon[],
  preTransformedPlaced?: PolygonPoint[][]
): boolean {
  const candidateVertices =
    transformPolygonToMarker(
      candidate
    );

  if (
    candidateVertices.length < 3
  ) {
    return false;
  }

  const placedVertexSets =
    preTransformedPlaced ??
    transformManyPolygonsToMarker(
      placedPatterns
    );

  return placedVertexSets.some(
    (placedVertices) =>
      polygonsOverlap(
        candidateVertices,
        placedVertices
      )
  );
}

/**
 * Counts genuine polygon collisions in a completed marker.
 */
export function countPolygonCollisions(
  patterns: PositionedPolygon[]
): number {
  const transformed =
    transformManyPolygonsToMarker(
      patterns
    );

  let collisionCount = 0;

  for (
    let firstIndex = 0;
    firstIndex <
    transformed.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      transformed.length;
      secondIndex += 1
    ) {
      if (
        polygonsOverlap(
          transformed[firstIndex],
          transformed[secondIndex]
        )
      ) {
        collisionCount += 1;
      }
    }
  }

  return collisionCount;
}

/**
 * Returns the actual pattern pairs involved in polygon collisions.
 */
export function findPolygonCollisionPairs(
  patterns: PositionedPolygon[]
): PolygonCollisionPair[] {
  const transformed =
    transformManyPolygonsToMarker(
      patterns
    );

  const pairs:
    PolygonCollisionPair[] = [];

  for (
    let firstIndex = 0;
    firstIndex <
    transformed.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      transformed.length;
      secondIndex += 1
    ) {
      if (
        polygonsOverlap(
          transformed[firstIndex],
          transformed[secondIndex]
        )
      ) {
        pairs.push({
          firstId:
            patterns[firstIndex].id,

          secondId:
            patterns[secondIndex].id,
        });
      }
    }
  }

  return pairs;
}

/* ============================================================================
 * Polygon clearance
 * ========================================================================== */

/**
 * Returns the shortest distance between two outlines.
 *
 * Returns zero when the polygons overlap or touch.
 */
export function calculatePolygonClearance(
  firstPolygon: PolygonPoint[],
  secondPolygon: PolygonPoint[]
): number {
  if (
    firstPolygon.length < 2 ||
    secondPolygon.length < 2
  ) {
    return Number.POSITIVE_INFINITY;
  }

  if (
    polygonsOverlap(
      firstPolygon,
      secondPolygon,
      true
    )
  ) {
    return 0;
  }

  let shortestDistance =
    Number.POSITIVE_INFINITY;

  for (
    let firstIndex = 0;
    firstIndex <
    firstPolygon.length;
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
      secondIndex <
      secondPolygon.length;
      secondIndex += 1
    ) {
      const secondStart =
        secondPolygon[secondIndex];

      const secondEnd =
        secondPolygon[
          (secondIndex + 1) %
            secondPolygon.length
        ];

      const distance =
        segmentToSegmentDistance(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd
        );

      shortestDistance = Math.min(
        shortestDistance,
        distance
      );

      if (
        shortestDistance <=
        GEOMETRY_EPSILON
      ) {
        return 0;
      }
    }
  }

  return shortestDistance;
}

/**
 * Determines whether two polygons violate a required real-outline gap.
 */
export function violatesPolygonClearance(
  firstPolygon: PolygonPoint[],
  secondPolygon: PolygonPoint[],
  requiredClearance: number
): boolean {
  if (
    requiredClearance <= 0
  ) {
    return polygonsOverlap(
      firstPolygon,
      secondPolygon
    );
  }

  if (
    firstPolygon.length < 3 ||
    secondPolygon.length < 3
  ) {
    return false;
  }

  const firstBounds =
    calculatePolygonBounds(
      firstPolygon
    );

  const secondBounds =
    calculatePolygonBounds(
      secondPolygon
    );

  const safelySeparated =
    firstBounds.maximumX +
      requiredClearance <=
      secondBounds.minimumX ||

    secondBounds.maximumX +
      requiredClearance <=
      firstBounds.minimumX ||

    firstBounds.maximumY +
      requiredClearance <=
      secondBounds.minimumY ||

    secondBounds.maximumY +
      requiredClearance <=
      firstBounds.minimumY;

  if (safelySeparated) {
    return false;
  }

  return (
    calculatePolygonClearance(
      firstPolygon,
      secondPolygon
    ) <
    requiredClearance
  );
}

/* ============================================================================
 * Polygon measurement
 * ========================================================================== */

/**
 * Shoelace polygon area in the units of the supplied coordinate system.
 */
export function calculatePolygonArea(
  vertices: PolygonPoint[]
): number {
  if (vertices.length < 3) {
    return 0;
  }

  let signedArea = 0;

  for (
    let index = 0;
    index < vertices.length;
    index += 1
  ) {
    const current =
      vertices[index];

    const next =
      vertices[
        (index + 1) %
          vertices.length
      ];

    signedArea +=
      current.x * next.y -
      next.x * current.y;
  }

  return Math.abs(
    signedArea
  ) / 2;
}

/* ============================================================================
 * Internal geometry helpers
 * ========================================================================== */

function calculatePolygonBounds(
  vertices: PolygonPoint[]
): PolygonBounds {
  let minimumX =
    Number.POSITIVE_INFINITY;

  let minimumY =
    Number.POSITIVE_INFINITY;

  let maximumX =
    Number.NEGATIVE_INFINITY;

  let maximumY =
    Number.NEGATIVE_INFINITY;

  for (const vertex of vertices) {
    minimumX = Math.min(
      minimumX,
      vertex.x
    );

    minimumY = Math.min(
      minimumY,
      vertex.y
    );

    maximumX = Math.max(
      maximumX,
      vertex.x
    );

    maximumY = Math.max(
      maximumY,
      vertex.y
    );
  }

  return {
    minimumX,
    minimumY,
    maximumX,
    maximumY,
  };
}

function polygonBoundsOverlap(
  first: PolygonBounds,
  second: PolygonBounds,
  treatTouchingAsOverlap: boolean
): boolean {
  if (treatTouchingAsOverlap) {
    return !(
      first.maximumX <
        second.minimumX -
          GEOMETRY_EPSILON ||

      second.maximumX <
        first.minimumX -
          GEOMETRY_EPSILON ||

      first.maximumY <
        second.minimumY -
          GEOMETRY_EPSILON ||

      second.maximumY <
        first.minimumY -
          GEOMETRY_EPSILON
    );
  }

  return !(
    first.maximumX <=
      second.minimumX +
        GEOMETRY_EPSILON ||

    second.maximumX <=
      first.minimumX +
        GEOMETRY_EPSILON ||

    first.maximumY <=
      second.minimumY +
        GEOMETRY_EPSILON ||

    second.maximumY <=
      first.minimumY +
        GEOMETRY_EPSILON
  );
}

/**
 * Proper crossing only.
 *
 * Endpoint touching and collinear contact are deliberately excluded.
 */
function lineSegmentsProperlyCross(
  firstStart: PolygonPoint,
  firstEnd: PolygonPoint,
  secondStart: PolygonPoint,
  secondEnd: PolygonPoint
): boolean {
  const firstOrientation =
    crossProduct(
      firstStart,
      firstEnd,
      secondStart
    );

  const secondOrientation =
    crossProduct(
      firstStart,
      firstEnd,
      secondEnd
    );

  const thirdOrientation =
    crossProduct(
      secondStart,
      secondEnd,
      firstStart
    );

  const fourthOrientation =
    crossProduct(
      secondStart,
      secondEnd,
      firstEnd
    );

  const firstCrosses =
    (
      firstOrientation >
        GEOMETRY_EPSILON &&
      secondOrientation <
        -GEOMETRY_EPSILON
    ) ||
    (
      firstOrientation <
        -GEOMETRY_EPSILON &&
      secondOrientation >
        GEOMETRY_EPSILON
    );

  const secondCrosses =
    (
      thirdOrientation >
        GEOMETRY_EPSILON &&
      fourthOrientation <
        -GEOMETRY_EPSILON
    ) ||
    (
      thirdOrientation <
        -GEOMETRY_EPSILON &&
      fourthOrientation >
        GEOMETRY_EPSILON
    );

  return (
    firstCrosses &&
    secondCrosses
  );
}

/**
 * Inclusive segment intersection.
 *
 * Used for clearance calculations, where touching means zero distance.
 */
function lineSegmentsIntersect(
  firstStart: PolygonPoint,
  firstEnd: PolygonPoint,
  secondStart: PolygonPoint,
  secondEnd: PolygonPoint
): boolean {
  if (
    lineSegmentsProperlyCross(
      firstStart,
      firstEnd,
      secondStart,
      secondEnd
    )
  ) {
    return true;
  }

  const firstOrientation =
    crossProduct(
      firstStart,
      firstEnd,
      secondStart
    );

  const secondOrientation =
    crossProduct(
      firstStart,
      firstEnd,
      secondEnd
    );

  const thirdOrientation =
    crossProduct(
      secondStart,
      secondEnd,
      firstStart
    );

  const fourthOrientation =
    crossProduct(
      secondStart,
      secondEnd,
      firstEnd
    );

  if (
    Math.abs(firstOrientation) <=
      GEOMETRY_EPSILON &&
    pointOnSegment(
      firstStart,
      secondStart,
      firstEnd
    )
  ) {
    return true;
  }

  if (
    Math.abs(secondOrientation) <=
      GEOMETRY_EPSILON &&
    pointOnSegment(
      firstStart,
      secondEnd,
      firstEnd
    )
  ) {
    return true;
  }

  if (
    Math.abs(thirdOrientation) <=
      GEOMETRY_EPSILON &&
    pointOnSegment(
      secondStart,
      firstStart,
      secondEnd
    )
  ) {
    return true;
  }

  if (
    Math.abs(fourthOrientation) <=
      GEOMETRY_EPSILON &&
    pointOnSegment(
      secondStart,
      firstEnd,
      secondEnd
    )
  ) {
    return true;
  }

  return false;
}

function collinearSegmentsOverlapByDistance(
  firstStart: PolygonPoint,
  firstEnd: PolygonPoint,
  secondStart: PolygonPoint,
  secondEnd: PolygonPoint
): boolean {
  const firstOrientation =
    crossProduct(
      firstStart,
      firstEnd,
      secondStart
    );

  const secondOrientation =
    crossProduct(
      firstStart,
      firstEnd,
      secondEnd
    );

  if (
    Math.abs(firstOrientation) >
      GEOMETRY_EPSILON ||
    Math.abs(secondOrientation) >
      GEOMETRY_EPSILON
  ) {
    return false;
  }

  const overlapX =
    Math.min(
      Math.max(
        firstStart.x,
        firstEnd.x
      ),
      Math.max(
        secondStart.x,
        secondEnd.x
      )
    ) -
    Math.max(
      Math.min(
        firstStart.x,
        firstEnd.x
      ),
      Math.min(
        secondStart.x,
        secondEnd.x
      )
    );

  const overlapY =
    Math.min(
      Math.max(
        firstStart.y,
        firstEnd.y
      ),
      Math.max(
        secondStart.y,
        secondEnd.y
      )
    ) -
    Math.max(
      Math.min(
        firstStart.y,
        firstEnd.y
      ),
      Math.min(
        secondStart.y,
        secondEnd.y
      )
    );

  return (
    overlapX >
      GEOMETRY_EPSILON ||
    overlapY >
      GEOMETRY_EPSILON
  );
}

function crossProduct(
  first: PolygonPoint,
  second: PolygonPoint,
  third: PolygonPoint
): number {
  return (
    (second.x - first.x) *
      (third.y - first.y) -
    (second.y - first.y) *
      (third.x - first.x)
  );
}

function pointOnSegment(
  start: PolygonPoint,
  point: PolygonPoint,
  end: PolygonPoint
): boolean {
  return (
    point.x <=
      Math.max(
        start.x,
        end.x
      ) +
        GEOMETRY_EPSILON &&

    point.x >=
      Math.min(
        start.x,
        end.x
      ) -
        GEOMETRY_EPSILON &&

    point.y <=
      Math.max(
        start.y,
        end.y
      ) +
        GEOMETRY_EPSILON &&

    point.y >=
      Math.min(
        start.y,
        end.y
      ) -
        GEOMETRY_EPSILON
  );
}

function classifyPointAgainstPolygon(
  point: PolygonPoint,
  polygon: PolygonPoint[]
): PointPolygonRelationship {
  let inside = false;

  for (
    let currentIndex = 0,
      previousIndex =
        polygon.length - 1;

    currentIndex <
    polygon.length;

    previousIndex =
      currentIndex,
      currentIndex += 1
  ) {
    const current =
      polygon[currentIndex];

    const previous =
      polygon[previousIndex];

    if (
      Math.abs(
        crossProduct(
          previous,
          current,
          point
        )
      ) <= GEOMETRY_EPSILON &&
      pointOnSegment(
        previous,
        point,
        current
      )
    ) {
      return "boundary";
    }

    const crossesHorizontalRay =
      current.y > point.y !==
      previous.y > point.y;

    if (!crossesHorizontalRay) {
      continue;
    }

    const intersectionX =
      ((previous.x - current.x) *
        (point.y - current.y)) /
        (previous.y - current.y) +
      current.x;

    if (
      point.x <
      intersectionX
    ) {
      inside = !inside;
    }
  }

  return inside
    ? "inside"
    : "outside";
}

function pointToSegmentDistance(
  point: PolygonPoint,
  start: PolygonPoint,
  end: PolygonPoint
): number {
  const deltaX =
    end.x - start.x;

  const deltaY =
    end.y - start.y;

  const lengthSquared =
    deltaX * deltaX +
    deltaY * deltaY;

  if (
    lengthSquared <=
    GEOMETRY_EPSILON
  ) {
    return Math.hypot(
      point.x - start.x,
      point.y - start.y
    );
  }

  let projection =
    (
      (point.x - start.x) *
        deltaX +
      (point.y - start.y) *
        deltaY
    ) /
    lengthSquared;

  projection = Math.max(
    0,
    Math.min(
      1,
      projection
    )
  );

  const closestX =
    start.x +
    projection * deltaX;

  const closestY =
    start.y +
    projection * deltaY;

  return Math.hypot(
    point.x - closestX,
    point.y - closestY
  );
}

function segmentToSegmentDistance(
  firstStart: PolygonPoint,
  firstEnd: PolygonPoint,
  secondStart: PolygonPoint,
  secondEnd: PolygonPoint
): number {
  if (
    lineSegmentsIntersect(
      firstStart,
      firstEnd,
      secondStart,
      secondEnd
    )
  ) {
    return 0;
  }

  return Math.min(
    pointToSegmentDistance(
      firstStart,
      secondStart,
      secondEnd
    ),

    pointToSegmentDistance(
      firstEnd,
      secondStart,
      secondEnd
    ),

    pointToSegmentDistance(
      secondStart,
      firstStart,
      firstEnd
    ),

    pointToSegmentDistance(
      secondEnd,
      firstStart,
      firstEnd
    )
  );
}