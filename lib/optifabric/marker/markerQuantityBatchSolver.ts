import {
  createDeterministicNestedMarker,
  type NestingPattern,
  type NestingResult,
} from "./markerNestingEngine";

import {
  createMarkerQuantityCandidate,
  type MarkerQuantityCandidateBuildResult,
} from "./markerQuantityCandidateEngine";

export interface MarkerBatchSourcePattern {
  id: string;

  width: number;
  height: number;

  vertices: Array<{
    x: number;
    y: number;
  }>;

  cutQuantity: number;

  allowedRotations?: Array<0 | 90 | 180 | 270>;
}

export interface MarkerQuantityBatchSolverOptions {
  quantities: number[];

  patterns: MarkerBatchSourcePattern[];

  usableFabricWidthCm: number;

  totalPatternAreaPerGarmentCm2: number;

  expectedPiecesPerGarment: number;

  canvasPixelsPerCm: number;

  horizontalGapPixels?: number;
  verticalGapPixels?: number;

  maximumMarkerHeightPixels?: number;

  maximumCandidateTestsPerPiece?: number;

  spatialBandHeight?: number;

  maximumMarkerLengthCm?: number | null;

  orderQuantity?: number | null;

  onProgress?: (
    progress: MarkerQuantityBatchProgress
  ) => void;
}

export interface MarkerQuantityBatchProgress {
  completedCandidates: number;

  totalCandidates: number;

  activeQuantity: number;

  progressPercent: number;

  status:
    | "starting"
    | "nesting"
    | "completed"
    | "failed";
}

export interface MarkerQuantityBatchResult {
  results: MarkerQuantityBatchItem[];

  completedCount: number;

  failedCount: number;

  totalCandidateTests: number;

  elapsedMilliseconds: number;
}

export interface MarkerQuantityBatchItem {
  garmentsPerMarker: number;

  nestingResult: NestingResult | null;

  candidateResult:
    | MarkerQuantityCandidateBuildResult
    | null;

  successful: boolean;

  errorMessage: string | null;

  elapsedMilliseconds: number;
}

/**
 * Runs marker quantities one after another.
 *
 * This is deliberately sequential:
 *
 * quantity 1
 * → complete
 * → quantity 2
 * → complete
 * → quantity 3
 *
 * It is easier to debug, uses less memory, and gives us a stable
 * RC5 baseline before moving the work into Web Workers.
 */
export async function solveMarkerQuantitiesSequentially(
  options: MarkerQuantityBatchSolverOptions
): Promise<MarkerQuantityBatchResult> {
  const startedAt =
    performance.now();

  const quantities =
    normaliseQuantities(
      options.quantities
    );

  const results:
    MarkerQuantityBatchItem[] = [];

  let totalCandidateTests = 0;

  options.onProgress?.({
    completedCandidates: 0,

    totalCandidates:
      quantities.length,

    activeQuantity:
      quantities[0] ?? 0,

    progressPercent: 0,

    status: "starting",
  });

  for (
    let index = 0;
    index < quantities.length;
    index += 1
  ) {
    const garmentsPerMarker =
      quantities[index];

    const itemStartedAt =
      performance.now();

    options.onProgress?.({
      completedCandidates:
        index,

      totalCandidates:
        quantities.length,

      activeQuantity:
        garmentsPerMarker,

      progressPercent:
        calculateProgressPercent(
          index,
          quantities.length
        ),

      status: "nesting",
    });

    try {
      const nestingInput =
        createBatchNestingInput(
          options.patterns,
          garmentsPerMarker
        );

      const nestingResult =
        createDeterministicNestedMarker(
          nestingInput,
          {
            fabricWidth:
              options.usableFabricWidthCm *
              options.canvasPixelsPerCm,

            horizontalGap:
              options.horizontalGapPixels ??
              0,

            verticalGap:
              options.verticalGapPixels ??
              0,

            maximumMarkerHeight:
              options.maximumMarkerHeightPixels ??
              100000,

            maximumCandidateTestsPerPiece:
              options.maximumCandidateTestsPerPiece ??
              4000,

            spatialBandHeight:
              options.spatialBandHeight ??
              200,
          }
        );

      const candidateResult =
        createMarkerQuantityCandidate({
          garmentsPerMarker,

          nestingResult,

          usableFabricWidthCm:
            options.usableFabricWidthCm,

          totalPatternAreaPerGarmentCm2:
            options.totalPatternAreaPerGarmentCm2,

          expectedPiecesPerGarment:
            options.expectedPiecesPerGarment,

          canvasPixelsPerCm:
            options.canvasPixelsPerCm,

          maximumMarkerLengthCm:
            options.maximumMarkerLengthCm,

          orderQuantity:
            options.orderQuantity,
        });

      totalCandidateTests +=
        resolveCandidateTests(
          nestingResult
        );

      results.push({
        garmentsPerMarker,

        nestingResult,

        candidateResult,

        successful:
          candidateResult.complete,

        errorMessage: null,

        elapsedMilliseconds:
          performance.now() -
          itemStartedAt,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown marker-solver error.";

      results.push({
        garmentsPerMarker,

        nestingResult: null,

        candidateResult: null,

        successful: false,

        errorMessage,

        elapsedMilliseconds:
          performance.now() -
          itemStartedAt,
      });
    }

    options.onProgress?.({
      completedCandidates:
        index + 1,

      totalCandidates:
        quantities.length,

      activeQuantity:
        garmentsPerMarker,

      progressPercent:
        calculateProgressPercent(
          index + 1,
          quantities.length
        ),

      status:
        results[results.length - 1]
          .successful
          ? "completed"
          : "failed",
    });

    /*
     * Yield briefly to the browser after every completed quantity.
     *
     * This does not move nesting off the main thread, but it gives
     * React and the browser a chance to repaint the progress state.
     */
    await yieldToBrowser();
  }

  const completedCount =
    results.filter(
      (result) =>
        result.successful
    ).length;

  return {
    results,

    completedCount,

    failedCount:
      results.length -
      completedCount,

    totalCandidateTests,

    elapsedMilliseconds:
      performance.now() -
      startedAt,
  };
}

/**
 * Extracts optimiser-ready candidates from successful batch results.
 */
export function extractCompletedMarkerCandidates(
  batchResult: MarkerQuantityBatchResult
) {
  return batchResult.results
    .filter(
      (
        item
      ): item is MarkerQuantityBatchItem & {
        candidateResult:
          MarkerQuantityCandidateBuildResult;
      } =>
        item.successful &&
        item.candidateResult !==
          null
    )
    .map(
      (item) =>
        item.candidateResult
          .candidate
    );
}

function createBatchNestingInput(
  patterns: MarkerBatchSourcePattern[],
  garmentsPerMarker: number
): NestingPattern[] {
  return patterns.flatMap(
    (pattern) => {
      const cutQuantity =
        Math.max(
          1,
          Math.floor(
            pattern.cutQuantity
          )
        );

      const instanceCount =
        cutQuantity *
        garmentsPerMarker;

      return Array.from(
        {
          length:
            instanceCount,
        },
        (_, index) => ({
          id:
            `${pattern.id}::g${garmentsPerMarker}::${index}`,

          width:
            pattern.width,

          height:
            pattern.height,

          vertices:
            pattern.vertices,

          allowedRotations:
            pattern.allowedRotations &&
            pattern.allowedRotations.length >
              0
              ? pattern.allowedRotations
              : [0],
        })
      );
    }
  );
}

function normaliseQuantities(
  quantities: number[]
): number[] {
  return Array.from(
    new Set(
      quantities
        .filter(
          (quantity) =>
            Number.isFinite(
              quantity
            ) &&
            quantity >= 1
        )
        .map(
          (quantity) =>
            Math.floor(quantity)
        )
    )
  ).sort(
    (first, second) =>
      first - second
  );
}

function calculateProgressPercent(
  completed: number,
  total: number
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (completed / total) *
        100
    )
  );
}

function resolveCandidateTests(
  nestingResult: NestingResult
): number {
  const value =
    "candidateTests" in
    nestingResult
      ? nestingResult.candidateTests
      : 0;

  return typeof value ===
      "number" &&
    Number.isFinite(value)
    ? Math.max(
        0,
        Math.floor(value)
      )
    : 0;
}

function yieldToBrowser(): Promise<void> {
  return new Promise(
    (resolve) => {
      setTimeout(resolve, 0);
    }
  );
}