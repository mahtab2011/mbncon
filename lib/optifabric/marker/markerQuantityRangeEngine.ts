export interface MarkerQuantityRangeOptions {
  minimumGarments?: number;

  maximumGarments?: number;

  requestedGarments?: number | null;

  piecesPerGarment: number;

  maximumNestingInstances?: number;

  preferredQuantities?: number[];

  includeEveryQuantity?: boolean;
}

export interface MarkerQuantityPlan {
  requestedGarments: number | null;

  minimumGarments: number;

  maximumGarments: number;

  maximumSafeGarments: number;

  piecesPerGarment: number;

  quantities: number[];

  excludedQuantities: MarkerQuantityExclusion[];

  totalCandidates: number;
}

export interface MarkerQuantityExclusion {
  garmentsPerMarker: number;

  expectedPieces: number;

  reason:
    | "below-minimum"
    | "above-maximum"
    | "piece-limit-exceeded";
}

const DEFAULT_MINIMUM_GARMENTS = 1;
const DEFAULT_MAXIMUM_GARMENTS = 24;
const DEFAULT_MAXIMUM_NESTING_INSTANCES = 400;

const DEFAULT_PREFERRED_QUANTITIES = [
  1,
  2,
  4,
  6,
  8,
  10,
  12,
  14,
  16,
  18,
  20,
  24,
];

/**
 * Creates a safe and deterministic list of garment quantities
 * for the AI Marker Quantity Optimiser.
 *
 * This engine does not perform nesting.
 *
 * It only decides which marker quantities should be tested.
 */
export function createMarkerQuantityPlan(
  options: MarkerQuantityRangeOptions
): MarkerQuantityPlan {
  const piecesPerGarment =
    resolvePositiveInteger(
      options.piecesPerGarment
    ) ?? 1;

  const minimumGarments =
    resolvePositiveInteger(
      options.minimumGarments
    ) ??
    DEFAULT_MINIMUM_GARMENTS;

  const requestedMaximum =
    resolvePositiveInteger(
      options.maximumGarments
    ) ??
    DEFAULT_MAXIMUM_GARMENTS;

  const maximumNestingInstances =
    resolvePositiveInteger(
      options.maximumNestingInstances
    ) ??
    DEFAULT_MAXIMUM_NESTING_INSTANCES;

  const maximumSafeGarments =
    Math.max(
      1,
      Math.floor(
        maximumNestingInstances /
          piecesPerGarment
      )
    );

  const maximumGarments =
    Math.max(
      minimumGarments,
      Math.min(
        requestedMaximum,
        maximumSafeGarments
      )
    );

  const requestedGarments =
    resolvePositiveInteger(
      options.requestedGarments
    );

  const preferredQuantities =
    normalisePreferredQuantities(
      options.preferredQuantities
    );

  const quantitySet =
    new Set<number>();

  const excludedQuantities:
    MarkerQuantityExclusion[] = [];

  if (
    options.includeEveryQuantity ??
    true
  ) {
    for (
      let quantity = minimumGarments;
      quantity <= maximumGarments;
      quantity += 1
    ) {
      quantitySet.add(quantity);
    }
  } else {
    for (
      const quantity of preferredQuantities
    ) {
      if (
        quantity < minimumGarments
      ) {
        excludedQuantities.push({
          garmentsPerMarker: quantity,

          expectedPieces:
            quantity *
            piecesPerGarment,

          reason:
            "below-minimum",
        });

        continue;
      }

      if (
        quantity >
        requestedMaximum
      ) {
        excludedQuantities.push({
          garmentsPerMarker: quantity,

          expectedPieces:
            quantity *
            piecesPerGarment,

          reason:
            "above-maximum",
        });

        continue;
      }

      if (
        quantity >
        maximumSafeGarments
      ) {
        excludedQuantities.push({
          garmentsPerMarker: quantity,

          expectedPieces:
            quantity *
            piecesPerGarment,

          reason:
            "piece-limit-exceeded",
        });

        continue;
      }

      quantitySet.add(quantity);
    }
  }

  /*
   * Always include the cutting master's requested quantity
   * when it remains inside the safe engineering range.
   */
  if (
    requestedGarments !== null
  ) {
    if (
      requestedGarments <
      minimumGarments
    ) {
      excludedQuantities.push({
        garmentsPerMarker:
          requestedGarments,

        expectedPieces:
          requestedGarments *
          piecesPerGarment,

        reason:
          "below-minimum",
      });
    } else if (
      requestedGarments >
      requestedMaximum
    ) {
      excludedQuantities.push({
        garmentsPerMarker:
          requestedGarments,

        expectedPieces:
          requestedGarments *
          piecesPerGarment,

        reason:
          "above-maximum",
      });
    } else if (
      requestedGarments >
      maximumSafeGarments
    ) {
      excludedQuantities.push({
        garmentsPerMarker:
          requestedGarments,

        expectedPieces:
          requestedGarments *
          piecesPerGarment,

        reason:
          "piece-limit-exceeded",
      });
    } else {
      quantitySet.add(
        requestedGarments
      );
    }
  }

  const quantities =
    Array.from(quantitySet).sort(
      (first, second) =>
        first - second
    );

  return {
    requestedGarments,

    minimumGarments,

    maximumGarments,

    maximumSafeGarments,

    piecesPerGarment,

    quantities,

    excludedQuantities:
      removeDuplicateExclusions(
        excludedQuantities
      ),

    totalCandidates:
      quantities.length,
  };
}

/**
 * Produces the number of physical pattern instances required
 * for every garment quantity in a generated plan.
 */
export function createMarkerQuantityWorkload(
  plan: MarkerQuantityPlan
): Array<{
  garmentsPerMarker: number;

  expectedPieces: number;
}> {
  return plan.quantities.map(
    (garmentsPerMarker) => ({
      garmentsPerMarker,

      expectedPieces:
        garmentsPerMarker *
        plan.piecesPerGarment,
    })
  );
}

/**
 * Returns whether a requested quantity can safely be nested
 * within the current browser-side piece ceiling.
 */
export function isMarkerQuantitySafe(
  garmentsPerMarker: number,
  piecesPerGarment: number,
  maximumNestingInstances =
    DEFAULT_MAXIMUM_NESTING_INSTANCES
): boolean {
  const garments =
    resolvePositiveInteger(
      garmentsPerMarker
    );

  const pieces =
    resolvePositiveInteger(
      piecesPerGarment
    );

  const limit =
    resolvePositiveInteger(
      maximumNestingInstances
    );

  if (
    garments === null ||
    pieces === null ||
    limit === null
  ) {
    return false;
  }

  return (
    garments * pieces <=
    limit
  );
}

/**
 * Calculates the highest garment quantity that remains
 * under the permitted physical-piece limit.
 */
export function calculateMaximumSafeGarments(
  piecesPerGarment: number,
  maximumNestingInstances =
    DEFAULT_MAXIMUM_NESTING_INSTANCES
): number {
  const pieces =
    resolvePositiveInteger(
      piecesPerGarment
    ) ?? 1;

  const limit =
    resolvePositiveInteger(
      maximumNestingInstances
    ) ??
    DEFAULT_MAXIMUM_NESTING_INSTANCES;

  return Math.max(
    1,
    Math.floor(
      limit / pieces
    )
  );
}

function normalisePreferredQuantities(
  quantities?: number[]
): number[] {
  const source =
    quantities &&
    quantities.length > 0
      ? quantities
      : DEFAULT_PREFERRED_QUANTITIES;

  return Array.from(
    new Set(
      source
        .map(
          resolvePositiveInteger
        )
        .filter(
          (
            quantity
          ): quantity is number =>
            quantity !== null
        )
    )
  ).sort(
    (first, second) =>
      first - second
  );
}

function removeDuplicateExclusions(
  exclusions:
    MarkerQuantityExclusion[]
): MarkerQuantityExclusion[] {
  const seen =
    new Set<string>();

  const result:
    MarkerQuantityExclusion[] = [];

  for (
    const exclusion of exclusions
  ) {
    const key =
      `${exclusion.garmentsPerMarker}-${exclusion.reason}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    result.push(exclusion);
  }

  return result.sort(
    (first, second) =>
      first.garmentsPerMarker -
      second.garmentsPerMarker
  );
}

function resolvePositiveInteger(
  value: unknown
): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 1
  ) {
    return null;
  }

  return Math.floor(value);
}