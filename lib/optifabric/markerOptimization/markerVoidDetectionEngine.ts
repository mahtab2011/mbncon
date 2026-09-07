/**
 * OptiFabric AI
 * RC5-004-001 — Marker Void Detection Engine
 *
 * Purpose:
 * - Detect usable empty rectangular spaces inside a marker.
 * - Convert irregular free space into engineering candidate regions.
 * - Exclude spaces occupied by existing pattern placements.
 * - Rank voids for future Hole Filling and Intelligent Compaction.
 *
 * Engineering note:
 * This engine uses an adaptive occupancy grid. It does not alter the marker
 * or move any pattern piece. It only analyses the current marker layout.
 */

export interface MarkerVoidPoint {
  readonly x: number;
  readonly y: number;
}

export interface MarkerVoidBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface MarkerVoidPatternPiece {
  readonly id: string;
  readonly name?: string;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly quantity?: number;
}

export interface MarkerVoidInput {
  readonly markerId?: string;
  readonly markerLength: number;
  readonly fabricWidth: number;
  readonly placements: ReadonlyArray<MarkerVoidPatternPiece>;
  readonly options?: MarkerVoidDetectionOptions;
}

export interface MarkerVoidDetectionOptions {
  /**
   * Occupancy-grid cell size in the same unit as marker dimensions.
   *
   * Smaller values improve accuracy but increase calculation cost.
   */
  readonly cellSize?: number;

  /**
   * Minimum width for a detected void.
   */
  readonly minimumVoidWidth?: number;

  /**
   * Minimum height for a detected void.
   */
  readonly minimumVoidHeight?: number;

  /**
   * Minimum area for a detected void.
   */
  readonly minimumVoidArea?: number;

  /**
   * Extra safety distance placed around existing pattern pieces.
   */
  readonly collisionMargin?: number;

  /**
   * Maximum number of voids returned after ranking.
   */
  readonly maximumVoids?: number;

  /**
   * Merge adjacent or overlapping candidate rectangles.
   */
  readonly mergeAdjacentVoids?: boolean;

  /**
   * Distance used when deciding whether two voids are adjacent.
   */
  readonly mergeTolerance?: number;

  /**
   * Reject voids touching the outer marker boundary.
   *
   * This is useful when only internal holes should be analysed.
   */
  readonly internalVoidsOnly?: boolean;
}

export type MarkerVoidType =
  | "internal"
  | "edge"
  | "leadingEdge"
  | "trailingEdge"
  | "fullWidth";

export interface DetectedMarkerVoid {
  readonly id: string;
  readonly markerId?: string;
  readonly type: MarkerVoidType;
  readonly bounds: MarkerVoidBounds;
  readonly polygon: ReadonlyArray<MarkerVoidPoint>;
  readonly width: number;
  readonly height: number;
  readonly area: number;
  readonly centre: MarkerVoidPoint;
  readonly touchesTopEdge: boolean;
  readonly touchesBottomEdge: boolean;
  readonly touchesLeadingEdge: boolean;
  readonly touchesTrailingEdge: boolean;
  readonly occupancyRatio: number;
  readonly compactnessScore: number;
  readonly fillPriorityScore: number;
  readonly engineeringUsable: boolean;
}

export interface MarkerVoidDetectionStatistics {
  readonly markerArea: number;
  readonly occupiedAreaEstimate: number;
  readonly freeAreaEstimate: number;
  readonly freeAreaPercentage: number;
  readonly gridColumns: number;
  readonly gridRows: number;
  readonly testedCells: number;
  readonly occupiedCells: number;
  readonly freeCells: number;
  readonly rawCandidateCount: number;
  readonly acceptedVoidCount: number;
  readonly totalDetectedVoidArea: number;
  readonly detectedVoidAreaPercentage: number;
}

export interface MarkerVoidDetectionResult {
  readonly markerId?: string;
  readonly markerLength: number;
  readonly fabricWidth: number;
  readonly voids: ReadonlyArray<DetectedMarkerVoid>;
  readonly statistics: MarkerVoidDetectionStatistics;
  readonly warnings: ReadonlyArray<string>;
  readonly engineeringReady: boolean;
}

interface MutableRectangle {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface GridRectangle {
  startColumn: number;
  endColumn: number;
  startRow: number;
  endRow: number;
}

interface NormalisedOptions {
  readonly cellSize: number;
  readonly minimumVoidWidth: number;
  readonly minimumVoidHeight: number;
  readonly minimumVoidArea: number;
  readonly collisionMargin: number;
  readonly maximumVoids: number;
  readonly mergeAdjacentVoids: boolean;
  readonly mergeTolerance: number;
  readonly internalVoidsOnly: boolean;
}

const DEFAULT_CELL_SIZE = 1;
const DEFAULT_MINIMUM_VOID_WIDTH = 3;
const DEFAULT_MINIMUM_VOID_HEIGHT = 3;
const DEFAULT_MINIMUM_VOID_AREA = 12;
const DEFAULT_MAXIMUM_VOIDS = 100;
const DEFAULT_MERGE_TOLERANCE = 1;
const EPSILON = 1e-8;

/**
 * Restricts a value to a numerical range.
 */
function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * Returns a finite positive number or a supplied fallback.
 */
function positiveNumberOrFallback(
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

/**
 * Returns a finite non-negative number or a supplied fallback.
 */
function nonNegativeNumberOrFallback(
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

/**
 * Normalises all engine options.
 */
function normaliseOptions(
  options: MarkerVoidDetectionOptions | undefined,
  markerLength: number,
  fabricWidth: number,
): NormalisedOptions {
  const smallerDimension = Math.max(
    EPSILON,
    Math.min(markerLength, fabricWidth),
  );

  const adaptiveMaximumCellSize = Math.max(
    0.25,
    smallerDimension / 20,
  );

  const requestedCellSize = positiveNumberOrFallback(
    options?.cellSize,
    DEFAULT_CELL_SIZE,
  );

  const cellSize = Math.min(
    requestedCellSize,
    adaptiveMaximumCellSize,
  );

  return {
    cellSize,
    minimumVoidWidth: positiveNumberOrFallback(
      options?.minimumVoidWidth,
      DEFAULT_MINIMUM_VOID_WIDTH,
    ),
    minimumVoidHeight: positiveNumberOrFallback(
      options?.minimumVoidHeight,
      DEFAULT_MINIMUM_VOID_HEIGHT,
    ),
    minimumVoidArea: positiveNumberOrFallback(
      options?.minimumVoidArea,
      DEFAULT_MINIMUM_VOID_AREA,
    ),
    collisionMargin: nonNegativeNumberOrFallback(
      options?.collisionMargin,
      0,
    ),
    maximumVoids: Math.max(
      1,
      Math.floor(
        positiveNumberOrFallback(
          options?.maximumVoids,
          DEFAULT_MAXIMUM_VOIDS,
        ),
      ),
    ),
    mergeAdjacentVoids: options?.mergeAdjacentVoids ?? true,
    mergeTolerance: nonNegativeNumberOrFallback(
      options?.mergeTolerance,
      DEFAULT_MERGE_TOLERANCE,
    ),
    internalVoidsOnly: options?.internalVoidsOnly ?? false,
  };
}

/**
 * Converts degrees to radians.
 */
function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Rotates a point around the local origin.
 */
function rotatePoint(
  point: MarkerVoidPoint,
  rotation: number,
): MarkerVoidPoint {
  if (Math.abs(rotation) <= EPSILON) {
    return point;
  }

  const radians = degreesToRadians(rotation);
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);

  return {
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
  };
}

/**
 * Converts a local piece polygon into marker coordinates.
 */
function transformPolygon(
  placement: MarkerVoidPatternPiece,
): MarkerVoidPoint[] {
  const offsetX = placement.x ?? 0;
  const offsetY = placement.y ?? 0;
  const rotation = placement.rotation ?? 0;

  return placement.polygon.map((point) => {
    const rotatedPoint = rotatePoint(point, rotation);

    return {
      x: rotatedPoint.x + offsetX,
      y: rotatedPoint.y + offsetY,
    };
  });
}

/**
 * Calculates polygon bounds.
 */
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
      continue;
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

/**
 * Tests whether a point lies inside a polygon.
 *
 * Boundary points are treated as occupied.
 */
function pointInPolygon(
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

/**
 * Returns the squared distance between a point and a line segment.
 */
function squaredDistanceToSegment(
  point: MarkerVoidPoint,
  start: MarkerVoidPoint,
  end: MarkerVoidPoint,
): number {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;

  const pointX = point.x - start.x;
  const pointY = point.y - start.y;

  const segmentLengthSquared =
    segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared <= EPSILON) {
    return pointX * pointX + pointY * pointY;
  }

  const projection = clamp(
    (pointX * segmentX + pointY * segmentY) /
      segmentLengthSquared,
    0,
    1,
  );

  const closestX = start.x + projection * segmentX;
  const closestY = start.y + projection * segmentY;

  const distanceX = point.x - closestX;
  const distanceY = point.y - closestY;

  return distanceX * distanceX + distanceY * distanceY;
}

/**
 * Tests whether a point is within the configured safety margin
 * of a polygon boundary.
 */
function pointWithinPolygonMargin(
  point: MarkerVoidPoint,
  polygon: ReadonlyArray<MarkerVoidPoint>,
  margin: number,
): boolean {
  if (margin <= EPSILON || polygon.length < 2) {
    return false;
  }

  const squaredMargin = margin * margin;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];

    if (
      squaredDistanceToSegment(point, current, next) <=
      squaredMargin
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Tests whether a cell centre is occupied by a pattern piece.
 */
function isCellOccupied(
  point: MarkerVoidPoint,
  polygons: ReadonlyArray<ReadonlyArray<MarkerVoidPoint>>,
  bounds: ReadonlyArray<MarkerVoidBounds>,
  collisionMargin: number,
): boolean {
  for (let index = 0; index < polygons.length; index += 1) {
    const polygonBounds = bounds[index];

    if (
      point.x <
        polygonBounds.minX - collisionMargin ||
      point.x >
        polygonBounds.maxX + collisionMargin ||
      point.y <
        polygonBounds.minY - collisionMargin ||
      point.y >
        polygonBounds.maxY + collisionMargin
    ) {
      continue;
    }

    const polygon = polygons[index];

    if (
      pointInPolygon(point, polygon) ||
      pointWithinPolygonMargin(
        point,
        polygon,
        collisionMargin,
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Builds an occupancy grid for the marker.
 */
function createOccupancyGrid(
  markerLength: number,
  fabricWidth: number,
  placements: ReadonlyArray<MarkerVoidPatternPiece>,
  options: NormalisedOptions,
): {
  grid: boolean[][];
  columns: number;
  rows: number;
  occupiedCells: number;
  warnings: string[];
} {
  const columns = Math.max(
    1,
    Math.ceil(markerLength / options.cellSize),
  );

  const rows = Math.max(
    1,
    Math.ceil(fabricWidth / options.cellSize),
  );

  const warnings: string[] = [];
  const polygons: MarkerVoidPoint[][] = [];
  const polygonBounds: MarkerVoidBounds[] = [];

  for (const placement of placements) {
    const transformedPolygon = transformPolygon(placement);
    const bounds = getPolygonBounds(transformedPolygon);

    if (!bounds) {
      warnings.push(
        `Placement "${placement.id}" was ignored because its polygon is invalid.`,
      );
      continue;
    }

    polygons.push(transformedPolygon);
    polygonBounds.push(bounds);
  }

  const grid: boolean[][] = Array.from(
    { length: rows },
    () => Array.from({ length: columns }, () => false),
  );

  let occupiedCells = 0;

  for (let row = 0; row < rows; row += 1) {
    const cellMinY = row * options.cellSize;
    const cellMaxY = Math.min(
      fabricWidth,
      cellMinY + options.cellSize,
    );

    const centreY = (cellMinY + cellMaxY) / 2;

    for (
      let column = 0;
      column < columns;
      column += 1
    ) {
      const cellMinX = column * options.cellSize;
      const cellMaxX = Math.min(
        markerLength,
        cellMinX + options.cellSize,
      );

      const centreX = (cellMinX + cellMaxX) / 2;

      const occupied = isCellOccupied(
        {
          x: centreX,
          y: centreY,
        },
        polygons,
        polygonBounds,
        options.collisionMargin,
      );

      grid[row][column] = occupied;

      if (occupied) {
        occupiedCells += 1;
      }
    }
  }

  return {
    grid,
    columns,
    rows,
    occupiedCells,
    warnings,
  };
}

/**
 * Finds maximal free rectangles in the occupancy grid.
 *
 * A histogram-and-stack algorithm is used for every grid row.
 */
function findFreeGridRectangles(
  grid: ReadonlyArray<ReadonlyArray<boolean>>,
  rows: number,
  columns: number,
): GridRectangle[] {
  const rectangles: GridRectangle[] = [];
  const heights = Array.from(
    { length: columns },
    () => 0,
  );

  for (let row = 0; row < rows; row += 1) {
    for (
      let column = 0;
      column < columns;
      column += 1
    ) {
      heights[column] = grid[row][column]
        ? 0
        : heights[column] + 1;
    }

    const stack: number[] = [];

    for (
      let column = 0;
      column <= columns;
      column += 1
    ) {
      const currentHeight =
        column === columns ? 0 : heights[column];

      while (
        stack.length > 0 &&
        heights[stack[stack.length - 1]] >
          currentHeight
      ) {
        const heightIndex = stack.pop();

        if (heightIndex === undefined) {
          continue;
        }

        const rectangleHeight = heights[heightIndex];

        if (rectangleHeight <= 0) {
          continue;
        }

        const startColumn =
          stack.length === 0
            ? 0
            : stack[stack.length - 1] + 1;

        const endColumn = column - 1;
        const endRow = row;
        const startRow =
          row - rectangleHeight + 1;

        rectangles.push({
          startColumn,
          endColumn,
          startRow,
          endRow,
        });
      }

      stack.push(column);
    }
  }

  return rectangles;
}

/**
 * Converts a grid rectangle into marker dimensions.
 */
function convertGridRectangleToBounds(
  rectangle: GridRectangle,
  cellSize: number,
  markerLength: number,
  fabricWidth: number,
): MarkerVoidBounds {
  return {
    minX: rectangle.startColumn * cellSize,
    minY: rectangle.startRow * cellSize,
    maxX: Math.min(
      markerLength,
      (rectangle.endColumn + 1) * cellSize,
    ),
    maxY: Math.min(
      fabricWidth,
      (rectangle.endRow + 1) * cellSize,
    ),
  };
}

/**
 * Calculates the area of a rectangular bounds object.
 */
function rectangleArea(
  bounds: MarkerVoidBounds,
): number {
  return Math.max(0, bounds.maxX - bounds.minX) *
    Math.max(0, bounds.maxY - bounds.minY);
}

/**
 * Tests whether one rectangle completely contains another.
 */
function rectangleContains(
  outer: MarkerVoidBounds,
  inner: MarkerVoidBounds,
): boolean {
  return (
    outer.minX <= inner.minX + EPSILON &&
    outer.minY <= inner.minY + EPSILON &&
    outer.maxX >= inner.maxX - EPSILON &&
    outer.maxY >= inner.maxY - EPSILON
  );
}

/**
 * Removes duplicate and fully contained rectangles.
 */
function removeRedundantRectangles(
  rectangles: ReadonlyArray<MarkerVoidBounds>,
): MarkerVoidBounds[] {
  const sorted = [...rectangles].sort(
    (first, second) =>
      rectangleArea(second) - rectangleArea(first),
  );

  const accepted: MarkerVoidBounds[] = [];

  for (const rectangle of sorted) {
    const duplicateOrContained = accepted.some(
      (acceptedRectangle) =>
        rectangleContains(
          acceptedRectangle,
          rectangle,
        ),
    );

    if (!duplicateOrContained) {
      accepted.push(rectangle);
    }
  }

  return accepted;
}

/**
 * Tests whether two rectangles overlap or nearly touch.
 */
function rectanglesCanMerge(
  first: MarkerVoidBounds,
  second: MarkerVoidBounds,
  tolerance: number,
): boolean {
  const horizontalOverlap =
    first.minX <= second.maxX + tolerance &&
    first.maxX + tolerance >= second.minX;

  const verticalOverlap =
    first.minY <= second.maxY + tolerance &&
    first.maxY + tolerance >= second.minY;

  return horizontalOverlap && verticalOverlap;
}

/**
 * Returns a rectangle enclosing both supplied rectangles.
 */
function mergeRectangleBounds(
  first: MarkerVoidBounds,
  second: MarkerVoidBounds,
): MarkerVoidBounds {
  return {
    minX: Math.min(first.minX, second.minX),
    minY: Math.min(first.minY, second.minY),
    maxX: Math.max(first.maxX, second.maxX),
    maxY: Math.max(first.maxY, second.maxY),
  };
}

/**
 * Checks whether a merged rectangular region is fully free.
 */
function isRectangleFree(
  bounds: MarkerVoidBounds,
  grid: ReadonlyArray<ReadonlyArray<boolean>>,
  cellSize: number,
  rows: number,
  columns: number,
): boolean {
  const startColumn = clamp(
    Math.floor(bounds.minX / cellSize),
    0,
    columns - 1,
  );

  const endColumn = clamp(
    Math.ceil(bounds.maxX / cellSize) - 1,
    0,
    columns - 1,
  );

  const startRow = clamp(
    Math.floor(bounds.minY / cellSize),
    0,
    rows - 1,
  );

  const endRow = clamp(
    Math.ceil(bounds.maxY / cellSize) - 1,
    0,
    rows - 1,
  );

  for (
    let row = startRow;
    row <= endRow;
    row += 1
  ) {
    for (
      let column = startColumn;
      column <= endColumn;
      column += 1
    ) {
      if (grid[row][column]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Merges adjacent free rectangles where the enclosing rectangle
 * remains fully unoccupied.
 */
function mergeAdjacentRectangles(
  rectangles: ReadonlyArray<MarkerVoidBounds>,
  grid: ReadonlyArray<ReadonlyArray<boolean>>,
  options: NormalisedOptions,
  rows: number,
  columns: number,
): MarkerVoidBounds[] {
  const working = rectangles.map(
    (rectangle) => ({ ...rectangle }),
  );

  let changed = true;

  while (changed) {
    changed = false;

    outerLoop: for (
      let firstIndex = 0;
      firstIndex < working.length;
      firstIndex += 1
    ) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < working.length;
        secondIndex += 1
      ) {
        const first = working[firstIndex];
        const second = working[secondIndex];

        if (
          !rectanglesCanMerge(
            first,
            second,
            options.mergeTolerance,
          )
        ) {
          continue;
        }

        const merged = mergeRectangleBounds(
          first,
          second,
        );

        if (
          !isRectangleFree(
            merged,
            grid,
            options.cellSize,
            rows,
            columns,
          )
        ) {
          continue;
        }

        working[firstIndex] = merged;
        working.splice(secondIndex, 1);
        changed = true;
        break outerLoop;
      }
    }
  }

  return removeRedundantRectangles(working);
}

/**
 * Determines the engineering type of a detected void.
 */
function classifyVoid(
  bounds: MarkerVoidBounds,
  markerLength: number,
  fabricWidth: number,
  tolerance: number,
): MarkerVoidType {
  const touchesLeadingEdge =
    bounds.minX <= tolerance;

  const touchesTrailingEdge =
    bounds.maxX >= markerLength - tolerance;

  const touchesTopEdge =
    bounds.minY <= tolerance;

  const touchesBottomEdge =
    bounds.maxY >= fabricWidth - tolerance;

  if (
    touchesTopEdge &&
    touchesBottomEdge
  ) {
    return "fullWidth";
  }

  if (touchesLeadingEdge) {
    return "leadingEdge";
  }

  if (touchesTrailingEdge) {
    return "trailingEdge";
  }

  if (
    touchesTopEdge ||
    touchesBottomEdge
  ) {
    return "edge";
  }

  return "internal";
}

/**
 * Calculates a rectangular compactness value.
 *
 * A square approaches 100. Very narrow regions score lower.
 */
function calculateCompactnessScore(
  width: number,
  height: number,
): number {
  const longerSide = Math.max(width, height);
  const shorterSide = Math.min(width, height);

  if (longerSide <= EPSILON) {
    return 0;
  }

  return clamp(
    (shorterSide / longerSide) * 100,
    0,
    100,
  );
}

/**
 * Calculates the priority of a void for future piece insertion.
 */
function calculateFillPriorityScore(
  area: number,
  markerArea: number,
  compactnessScore: number,
  type: MarkerVoidType,
): number {
  const areaScore =
    markerArea <= EPSILON
      ? 0
      : clamp(
          (area / markerArea) * 500,
          0,
          100,
        );

  const typeScore: Record<MarkerVoidType, number> = {
    internal: 100,
    edge: 75,
    leadingEdge: 60,
    trailingEdge: 85,
    fullWidth: 50,
  };

  return clamp(
    areaScore * 0.5 +
      compactnessScore * 0.25 +
      typeScore[type] * 0.25,
    0,
    100,
  );
}

/**
 * Converts rectangle bounds to a four-point polygon.
 */
function boundsToPolygon(
  bounds: MarkerVoidBounds,
): ReadonlyArray<MarkerVoidPoint> {
  return [
    {
      x: bounds.minX,
      y: bounds.minY,
    },
    {
      x: bounds.maxX,
      y: bounds.minY,
    },
    {
      x: bounds.maxX,
      y: bounds.maxY,
    },
    {
      x: bounds.minX,
      y: bounds.maxY,
    },
  ];
}

/**
 * Builds the final engineering void object.
 */
function createDetectedVoid(
  bounds: MarkerVoidBounds,
  index: number,
  markerId: string | undefined,
  markerLength: number,
  fabricWidth: number,
  options: NormalisedOptions,
): DetectedMarkerVoid {
  const width = Math.max(
    0,
    bounds.maxX - bounds.minX,
  );

  const height = Math.max(
    0,
    bounds.maxY - bounds.minY,
  );

  const area = width * height;
  const markerArea = markerLength * fabricWidth;

  const touchesTopEdge =
    bounds.minY <= options.cellSize + EPSILON;

  const touchesBottomEdge =
    bounds.maxY >=
    fabricWidth - options.cellSize - EPSILON;

  const touchesLeadingEdge =
    bounds.minX <= options.cellSize + EPSILON;

  const touchesTrailingEdge =
    bounds.maxX >=
    markerLength - options.cellSize - EPSILON;

  const type = classifyVoid(
    bounds,
    markerLength,
    fabricWidth,
    options.cellSize + EPSILON,
  );

  const compactnessScore =
    calculateCompactnessScore(width, height);

  const fillPriorityScore =
    calculateFillPriorityScore(
      area,
      markerArea,
      compactnessScore,
      type,
    );

  const occupancyRatio =
    markerArea <= EPSILON
      ? 0
      : clamp(area / markerArea, 0, 1);

  const engineeringUsable =
    width + EPSILON >= options.minimumVoidWidth &&
    height + EPSILON >=
      options.minimumVoidHeight &&
    area + EPSILON >= options.minimumVoidArea &&
    (!options.internalVoidsOnly ||
      type === "internal");

  return {
    id: `${markerId ?? "marker"}-void-${index + 1}`,
    markerId,
    type,
    bounds,
    polygon: boundsToPolygon(bounds),
    width,
    height,
    area,
    centre: {
      x: bounds.minX + width / 2,
      y: bounds.minY + height / 2,
    },
    touchesTopEdge,
    touchesBottomEdge,
    touchesLeadingEdge,
    touchesTrailingEdge,
    occupancyRatio,
    compactnessScore,
    fillPriorityScore,
    engineeringUsable,
  };
}

/**
 * Validates the main engine input.
 */
function validateInput(
  input: MarkerVoidInput,
): string[] {
  const warnings: string[] = [];

  if (
    !Number.isFinite(input.markerLength) ||
    input.markerLength <= 0
  ) {
    warnings.push(
      "Marker Length must be a finite number greater than zero.",
    );
  }

  if (
    !Number.isFinite(input.fabricWidth) ||
    input.fabricWidth <= 0
  ) {
    warnings.push(
      "Fabric Width must be a finite number greater than zero.",
    );
  }

  if (!Array.isArray(input.placements)) {
    warnings.push(
      "Pattern placements must be supplied as an array.",
    );
  }

  return warnings;
}

/**
 * Detects and ranks usable empty spaces inside a marker.
 */
export function detectMarkerVoids(
  input: MarkerVoidInput,
): MarkerVoidDetectionResult {
  const inputWarnings = validateInput(input);

  if (
    !Number.isFinite(input.markerLength) ||
    input.markerLength <= 0 ||
    !Number.isFinite(input.fabricWidth) ||
    input.fabricWidth <= 0
  ) {
    return {
      markerId: input.markerId,
      markerLength: input.markerLength,
      fabricWidth: input.fabricWidth,
      voids: [],
      statistics: {
        markerArea: 0,
        occupiedAreaEstimate: 0,
        freeAreaEstimate: 0,
        freeAreaPercentage: 0,
        gridColumns: 0,
        gridRows: 0,
        testedCells: 0,
        occupiedCells: 0,
        freeCells: 0,
        rawCandidateCount: 0,
        acceptedVoidCount: 0,
        totalDetectedVoidArea: 0,
        detectedVoidAreaPercentage: 0,
      },
      warnings: inputWarnings,
      engineeringReady: false,
    };
  }

  const options = normaliseOptions(
    input.options,
    input.markerLength,
    input.fabricWidth,
  );

  const occupancy = createOccupancyGrid(
    input.markerLength,
    input.fabricWidth,
    input.placements,
    options,
  );

  const rawGridRectangles =
    findFreeGridRectangles(
      occupancy.grid,
      occupancy.rows,
      occupancy.columns,
    );

  const convertedRectangles =
    rawGridRectangles.map((rectangle) =>
      convertGridRectangleToBounds(
        rectangle,
        options.cellSize,
        input.markerLength,
        input.fabricWidth,
      ),
    );

  const nonRedundantRectangles =
    removeRedundantRectangles(convertedRectangles);

  const finalRectangles =
    options.mergeAdjacentVoids
      ? mergeAdjacentRectangles(
          nonRedundantRectangles,
          occupancy.grid,
          options,
          occupancy.rows,
          occupancy.columns,
        )
      : nonRedundantRectangles;

  const detectedVoids = finalRectangles
    .map((bounds, index) =>
      createDetectedVoid(
        bounds,
        index,
        input.markerId,
        input.markerLength,
        input.fabricWidth,
        options,
      ),
    )
    .filter((voidRegion) => voidRegion.engineeringUsable)
    .sort((first, second) => {
      if (
        second.fillPriorityScore !==
        first.fillPriorityScore
      ) {
        return (
          second.fillPriorityScore -
          first.fillPriorityScore
        );
      }

      return second.area - first.area;
    })
    .slice(0, options.maximumVoids)
    .map((voidRegion, index) => ({
      ...voidRegion,
      id: `${input.markerId ?? "marker"}-void-${index + 1}`,
    }));

  const markerArea =
    input.markerLength * input.fabricWidth;

  const testedCells =
    occupancy.rows * occupancy.columns;

  const freeCells =
    testedCells - occupancy.occupiedCells;

  const occupiedAreaEstimate =
    markerArea *
    (testedCells === 0
      ? 0
      : occupancy.occupiedCells / testedCells);

  const freeAreaEstimate =
    Math.max(0, markerArea - occupiedAreaEstimate);

  const totalDetectedVoidArea =
    detectedVoids.reduce(
      (total, voidRegion) =>
        total + voidRegion.area,
      0,
    );

  const warnings = [
    ...inputWarnings,
    ...occupancy.warnings,
  ];

  if (input.placements.length === 0) {
    warnings.push(
      "No pattern placements were supplied. The complete marker is treated as free space.",
    );
  }

  if (detectedVoids.length === 0) {
    warnings.push(
      "No void satisfied the configured minimum engineering dimensions.",
    );
  }

  return {
    markerId: input.markerId,
    markerLength: input.markerLength,
    fabricWidth: input.fabricWidth,
    voids: detectedVoids,
    statistics: {
      markerArea,
      occupiedAreaEstimate,
      freeAreaEstimate,
      freeAreaPercentage:
        markerArea <= EPSILON
          ? 0
          : (freeAreaEstimate / markerArea) * 100,
      gridColumns: occupancy.columns,
      gridRows: occupancy.rows,
      testedCells,
      occupiedCells: occupancy.occupiedCells,
      freeCells,
      rawCandidateCount: rawGridRectangles.length,
      acceptedVoidCount: detectedVoids.length,
      totalDetectedVoidArea,
      detectedVoidAreaPercentage:
        markerArea <= EPSILON
          ? 0
          : (totalDetectedVoidArea /
              markerArea) *
            100,
    },
    warnings,
    engineeringReady:
      detectedVoids.length > 0 &&
      occupancy.warnings.length === 0,
  };
}

/**
 * Returns only internal holes from a complete detection result.
 */
export function getInternalMarkerVoids(
  result: MarkerVoidDetectionResult,
): ReadonlyArray<DetectedMarkerVoid> {
  return result.voids.filter(
    (voidRegion) =>
      voidRegion.type === "internal",
  );
}

/**
 * Returns only edge-connected free spaces.
 */
export function getEdgeMarkerVoids(
  result: MarkerVoidDetectionResult,
): ReadonlyArray<DetectedMarkerVoid> {
  return result.voids.filter(
    (voidRegion) =>
      voidRegion.type !== "internal",
  );
}

/**
 * Returns the highest-priority void.
 */
export function getBestMarkerVoid(
  result: MarkerVoidDetectionResult,
): DetectedMarkerVoid | null {
  return result.voids[0] ?? null;
}

/**
 * Filters detected voids by minimum engineering dimensions.
 */
export function filterMarkerVoidsByDimensions(
  voids: ReadonlyArray<DetectedMarkerVoid>,
  minimumWidth: number,
  minimumHeight: number,
  minimumArea = 0,
): ReadonlyArray<DetectedMarkerVoid> {
  return voids.filter(
    (voidRegion) =>
      voidRegion.width + EPSILON >= minimumWidth &&
      voidRegion.height + EPSILON >= minimumHeight &&
      voidRegion.area + EPSILON >= minimumArea,
  );
}

/**
 * Finds voids that could contain a rectangular piece envelope.
 *
 * Rotation may optionally be permitted.
 */
export function findVoidsForPieceEnvelope(
  voids: ReadonlyArray<DetectedMarkerVoid>,
  pieceWidth: number,
  pieceHeight: number,
  allowRotation = true,
  clearance = 0,
): ReadonlyArray<DetectedMarkerVoid> {
  const requiredWidth =
    Math.max(0, pieceWidth) +
    Math.max(0, clearance) * 2;

  const requiredHeight =
    Math.max(0, pieceHeight) +
    Math.max(0, clearance) * 2;

  return voids.filter((voidRegion) => {
    const directFit =
      voidRegion.width + EPSILON >=
        requiredWidth &&
      voidRegion.height + EPSILON >=
        requiredHeight;

    const rotatedFit =
      allowRotation &&
      voidRegion.width + EPSILON >=
        requiredHeight &&
      voidRegion.height + EPSILON >=
        requiredWidth;

    return directFit || rotatedFit;
  });
}