/**
 * OptiFabric AI
 * RC5-004-006 — Hole Filling & Compaction Engineering Validation
 *
 * Purpose:
 * - Validate the complete RC5-004 optimisation workflow.
 * - Use deterministic marker geometry and expected engineering outcomes.
 * - Confirm Void Detection, Compatibility, Collision Validation,
 *   Hole Filling and Intelligent Compaction work together.
 * - Provide a reusable validation report for development and UI testing.
 */

import {
  runHoleFillingCompaction,
  type HoleFillingCandidatePiece,
  type HoleFillingCompactionInput,
  type HoleFillingCompactionResult,
  type HoleFillingSourcePlacement,
} from "./holeFillingCompactionOrchestrator";

import type {
  MarkerVoidPoint,
} from "./markerVoidDetectionEngine";

export type HoleFillingValidationStatus =
  | "passed"
  | "failed"
  | "warning";

export interface HoleFillingValidationCheck {
  readonly id: string;
  readonly title: string;
  readonly status: HoleFillingValidationStatus;
  readonly expected: string;
  readonly actual: string;
  readonly message: string;
}

export interface HoleFillingValidationDataset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly input: HoleFillingCompactionInput;
}

export interface HoleFillingValidationMetrics {
  readonly originalMarkerLength: number;
  readonly finalMarkerLength: number;
  readonly markerLengthReduction: number;
  readonly markerLengthReductionPercentage: number;
  readonly originalUtilisation: number;
  readonly finalUtilisation: number;
  readonly utilisationImprovement: number;
  readonly detectedVoidCount: number;
  readonly compatibilityCandidateCount: number;
  readonly collisionSafePlacementCount: number;
  readonly selectedHoleFillingPlacementCount: number;
  readonly compactionSolutionCount: number;
  readonly finalSolutionCount: number;
  readonly bestCombinedEngineeringScore: number;
}

export interface HoleFillingCompactionValidationReport {
  readonly datasetId: string;
  readonly datasetName: string;
  readonly result: HoleFillingCompactionResult;
  readonly checks: ReadonlyArray<HoleFillingValidationCheck>;
  readonly metrics: HoleFillingValidationMetrics;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly warningChecks: number;
  readonly overallStatus: HoleFillingValidationStatus;
  readonly engineeringValidated: boolean;
  readonly summary: string;
}

const EPSILON = 1e-8;

/**
 * Creates a rectangular polygon in marker coordinates.
 */
function createRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
): ReadonlyArray<MarkerVoidPoint> {
  return [
    {
      x,
      y,
    },
    {
      x: x + width,
      y,
    },
    {
      x: x + width,
      y: y + height,
    },
    {
      x,
      y: y + height,
    },
  ];
}

/**
 * Creates a candidate polygon using a local origin.
 */
function createLocalRectangle(
  width: number,
  height: number,
): ReadonlyArray<MarkerVoidPoint> {
  return createRectangle(
    0,
    0,
    width,
    height,
  );
}

/**
 * Deterministic RC5-004 engineering validation dataset.
 *
 * Marker:
 * - Length: 100
 * - Fabric Width: 40
 *
 * Expected behaviour:
 * - Detect usable free space.
 * - Match the Pocket Piece to a void.
 * - Validate a collision-safe insertion.
 * - Generate at least one compaction solution.
 * - Preserve collision and boundary safety.
 */
export const holeFillingCompactionValidationDataset:
  HoleFillingValidationDataset = {
  id: "rc5-004-validation-001",

  name:
    "RC5-004 Deterministic Hole Filling and Compaction Dataset",

  description:
    "A controlled marker containing usable free regions, one compatible candidate piece and movable trailing placements.",

  input: {
    markerId:
      "validation-marker-001",

    markerLength: 100,

    fabricWidth: 40,

    existingPlacements: [
      {
        id: "placement-front-top",
        pieceId: "front-top",
        pieceName: "Front Top Block",
        polygon: createRectangle(
          0,
          0,
          36,
          16,
        ),
        x: 0,
        y: 0,
        rotation: 0,
        mirrored: false,
        locked: true,
        priority: 100,
      },

      {
        id: "placement-front-bottom",
        pieceId: "front-bottom",
        pieceName: "Front Bottom Block",
        polygon: createRectangle(
          0,
          24,
          36,
          16,
        ),
        x: 0,
        y: 24,
        rotation: 0,
        mirrored: false,
        locked: true,
        priority: 100,
      },

      {
        id: "placement-middle-top",
        pieceId: "middle-top",
        pieceName: "Middle Top Block",
        polygon: createRectangle(
          42,
          0,
          22,
          14,
        ),
        x: 42,
        y: 0,
        rotation: 0,
        mirrored: false,
        locked: false,
        priority: 80,
      },

      {
        id: "placement-middle-bottom",
        pieceId: "middle-bottom",
        pieceName: "Middle Bottom Block",
        polygon: createRectangle(
          42,
          26,
          22,
          14,
        ),
        x: 42,
        y: 26,
        rotation: 0,
        mirrored: false,
        locked: false,
        priority: 80,
      },

      {
        id: "placement-trailing-top",
        pieceId: "trailing-top",
        pieceName: "Trailing Top Block",
        polygon: createRectangle(
          74,
          0,
          18,
          18,
        ),
        x: 74,
        y: 0,
        rotation: 0,
        mirrored: false,
        locked: false,
        priority: 60,
      },

      {
        id: "placement-trailing-bottom",
        pieceId: "trailing-bottom",
        pieceName: "Trailing Bottom Block",
        polygon: createRectangle(
          74,
          22,
          18,
          18,
        ),
        x: 74,
        y: 22,
        rotation: 0,
        mirrored: false,
        locked: false,
        priority: 60,
      },
    ] satisfies ReadonlyArray<HoleFillingSourcePlacement>,

    candidatePieces: [
      {
        id: "candidate-pocket",
        name: "Pocket Piece",
        polygon: createLocalRectangle(
          14,
          8,
        ),
        rotation: 0,
        allowedRotations: [
          0,
          180,
        ],
        rotationLocked: false,
        grainLineLocked: true,
        grainLineAngle: 0,
        maximumGrainDeviation: 0,
        availableQuantity: 1,
        locked: false,
        priority: 90,
        category: "pocket",
      },
    ] satisfies ReadonlyArray<HoleFillingCandidatePiece>,

    options: {
      includeHoleFillingPlacementsInCompaction: true,

      maximumFinalSolutions: 10,

      minimumCombinedEngineeringScore: 0,

      holeFillingWeight: 0.3,

      compactionWeight: 0.3,

      safetyWeight: 0.25,

      utilisationWeight: 0.15,

      voidDetection: {
        cellSize: 1,
        minimumVoidWidth: 5,
        minimumVoidHeight: 5,
        minimumVoidArea: 30,
        collisionMargin: 0,
        maximumVoids: 100,
        mergeAdjacentVoids: true,
        mergeTolerance: 1,
        internalVoidsOnly: false,
      },

      compatibility: {
        clearance: 0.5,
        minimumFitEfficiency: 3,
        maximumCandidatesPerVoid: 20,
        maximumTotalCandidates: 100,
        allowMirroring: false,
        allowEnvelopeOnlyFit: false,
        allowBoundaryContact: true,
        rejectInvalidPieces: true,
        internalVoidsOnly: false,
        preferredRotations: [
          0,
          180,
        ],
      },

      collisionValidation: {
        collisionClearance: 0.5,
        markerBoundaryClearance: 0,
        allowMarkerBoundaryContact: true,
        allowPieceBoundaryContact: true,
        maximumPlacements: 50,
        maximumPlacementsPerVoid: 10,
        excludeExistingPieceIds: true,
        uniquePiecePerPlacementPlan: true,
        uniqueVoidPerPlacementPlan: true,
        recalculateEngineeringScore: true,
        minimumEngineeringScore: 0,
      },

      compaction: {
        collisionClearance: 0.5,
        markerBoundaryClearance: 0,
        horizontalStep: 1,
        verticalStep: 1,
        maximumHorizontalMovement: 100,
        maximumVerticalMovement: 20,
        maximumPasses: 6,
        maximumCandidatesPerPiece: 500,
        minimumLengthImprovement: 0.01,
        allowPieceBoundaryContact: true,
        allowMarkerBoundaryContact: true,
        verticalSearchBeforeHorizontal: true,
        priorityFirst: true,
        preservePlacementOrder: false,
        returnIntermediateSolutions: true,
        maximumSolutions: 10,
        minimumEngineeringScore: 0,
      },
    },
  },
};

/**
 * Creates one validation result.
 */
function createCheck(
  id: string,
  title: string,
  condition: boolean,
  expected: string,
  actual: string,
  successMessage: string,
  failureMessage: string,
  warningOnly = false,
): HoleFillingValidationCheck {
  const status: HoleFillingValidationStatus =
    condition
      ? "passed"
      : warningOnly
        ? "warning"
        : "failed";

  return {
    id,
    title,
    status,
    expected,
    actual,
    message: condition
      ? successMessage
      : failureMessage,
  };
}

/**
 * Formats numerical validation values.
 */
function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  if (!Number.isFinite(value)) {
    return "Invalid";
  }

  return new Intl.NumberFormat(
    "en-GB",
    {
      maximumFractionDigits,
    },
  ).format(value);
}

/**
 * Creates the complete validation checklist.
 */
function createValidationChecks(
  result: HoleFillingCompactionResult,
): ReadonlyArray<HoleFillingValidationCheck> {
  const bestSolution =
    result.bestSolution;

  const checks:
    HoleFillingValidationCheck[] = [];

  checks.push(
    createCheck(
      "valid-marker-input",
      "Marker dimensions accepted",
      result.statistics.originalMarkerLength > 0,
      "Marker Length greater than zero",
      formatNumber(
        result.statistics.originalMarkerLength,
      ),
      "The validation marker dimensions were accepted.",
      "The validation marker dimensions were rejected.",
    ),
  );

  checks.push(
    createCheck(
      "void-detected",
      "Usable marker void detected",
      result.statistics.detectedVoidCount > 0,
      "At least one usable void",
      String(
        result.statistics.detectedVoidCount,
      ),
      "The Marker Void Detection Engine identified usable free space.",
      "The Marker Void Detection Engine did not identify usable free space.",
    ),
  );

  checks.push(
    createCheck(
      "compatibility-found",
      "Compatible piece identified",
      result.statistics
        .compatibilityCandidateCount > 0,
      "At least one Piece-to-Void candidate",
      String(
        result.statistics
          .compatibilityCandidateCount,
      ),
      "The Piece-to-Void Compatibility Engine identified at least one valid fit.",
      "No compatible Piece-to-Void candidate was identified.",
    ),
  );

  checks.push(
    createCheck(
      "collision-safe-placement",
      "Collision-safe placement generated",
      result.statistics
        .collisionSafePlacementCount > 0,
      "At least one collision-safe placement",
      String(
        result.statistics
          .collisionSafePlacementCount,
      ),
      "The Collision-Safe Hole Filling Engine approved at least one placement.",
      "No candidate passed collision validation.",
    ),
  );

  checks.push(
    createCheck(
      "hole-filling-selected",
      "Hole Filling placement selected",
      result.statistics
        .selectedHoleFillingPlacementCount > 0,
      "At least one selected Hole Filling placement",
      String(
        result.statistics
          .selectedHoleFillingPlacementCount,
      ),
      "The orchestrator selected an engineering-safe Hole Filling placement.",
      "The orchestrator did not select a Hole Filling placement.",
    ),
  );

  checks.push(
    createCheck(
      "compaction-solution-generated",
      "Marker Compaction solution generated",
      result.statistics
        .compactionSolutionCount > 0,
      "At least one compaction solution",
      String(
        result.statistics
          .compactionSolutionCount,
      ),
      "The Intelligent Marker Compaction Engine generated a solution.",
      "No Marker Compaction solution was generated.",
    ),
  );

  checks.push(
    createCheck(
      "final-solution-generated",
      "Combined final solution generated",
      result.statistics.finalSolutionCount > 0,
      "At least one combined solution",
      String(
        result.statistics.finalSolutionCount,
      ),
      "The orchestrator generated a ranked final solution.",
      "No combined Hole Filling and Compaction solution was generated.",
    ),
  );

  checks.push(
    createCheck(
      "best-solution-available",
      "Best solution available",
      Boolean(bestSolution),
      "One highest-ranked solution",
      bestSolution
        ? bestSolution.id
        : "None",
      "The workflow returned a highest-ranked solution.",
      "The workflow did not return a best solution.",
    ),
  );

  checks.push(
    createCheck(
      "collision-free-final-layout",
      "Final layout collision-free",
      bestSolution?.collisionFree === true,
      "Collision-Free = true",
      bestSolution
        ? String(
            bestSolution.collisionFree,
          )
        : "No solution",
      "The final marker passed collision validation.",
      "The final marker did not pass collision validation.",
    ),
  );

  checks.push(
    createCheck(
      "boundary-safe-final-layout",
      "Final layout boundary-safe",
      bestSolution?.boundarySafe === true,
      "Boundary Safe = true",
      bestSolution
        ? String(
            bestSolution.boundarySafe,
          )
        : "No solution",
      "The final marker remained inside the permitted marker boundary.",
      "The final marker exceeded the permitted marker boundary.",
    ),
  );

  checks.push(
    createCheck(
      "marker-length-not-increased",
      "Marker Length not increased",
      bestSolution !== null &&
        bestSolution.finalMarkerLength <=
          bestSolution.originalMarkerLength +
            EPSILON,
      "Final Marker Length less than or equal to original",
      bestSolution
        ? `${formatNumber(
            bestSolution.finalMarkerLength,
          )} versus ${formatNumber(
            bestSolution.originalMarkerLength,
          )}`
        : "No solution",
      "The optimisation did not increase Marker Length.",
      "The optimisation increased Marker Length.",
    ),
  );

  checks.push(
    createCheck(
      "marker-length-reduced",
      "Marker Length reduction achieved",
      Boolean(
        bestSolution &&
          bestSolution.markerLengthReduction >
            EPSILON,
      ),
      "Marker Length reduction greater than zero",
      bestSolution
        ? formatNumber(
            bestSolution.markerLengthReduction,
          )
        : "No solution",
      "The final marker achieved measurable Marker Length reduction.",
      "No measurable Marker Length reduction was achieved.",
      true,
    ),
  );

  checks.push(
    createCheck(
      "utilisation-not-reduced",
      "Fabric Utilisation maintained or improved",
      bestSolution !== null &&
        bestSolution.finalUtilisation +
          EPSILON >=
          bestSolution.originalUtilisation,
      "Final Utilisation greater than or equal to original",
      bestSolution
        ? `${formatNumber(
            bestSolution.finalUtilisation,
          )}% versus ${formatNumber(
            bestSolution.originalUtilisation,
          )}%`
        : "No solution",
      "Fabric Utilisation was maintained or improved.",
      "Fabric Utilisation decreased.",
    ),
  );

  checks.push(
    createCheck(
      "pattern-piece-added",
      "Candidate pattern piece added",
      Boolean(
        bestSolution &&
          bestSolution.addedPatternArea >
            EPSILON,
      ),
      "Added pattern area greater than zero",
      bestSolution
        ? formatNumber(
            bestSolution.addedPatternArea,
          )
        : "No solution",
      "The candidate pattern piece was added to the temporary marker.",
      "No candidate pattern area was added.",
    ),
  );

  checks.push(
    createCheck(
      "engineering-score-valid",
      "Combined Engineering Score calculated",
      Boolean(
        bestSolution &&
          Number.isFinite(
            bestSolution
              .combinedEngineeringScore,
          ) &&
          bestSolution
            .combinedEngineeringScore >= 0 &&
          bestSolution
            .combinedEngineeringScore <= 100,
      ),
      "Engineering Score between 0 and 100",
      bestSolution
        ? formatNumber(
            bestSolution
              .combinedEngineeringScore,
          )
        : "No solution",
      "The final Combined Engineering Score is valid.",
      "The final Combined Engineering Score is invalid.",
    ),
  );

  checks.push(
    createCheck(
      "workflow-engineering-ready",
      "Workflow Engineering Ready",
      result.engineeringReady,
      "Engineering Ready = true",
      String(
        result.engineeringReady,
      ),
      "The complete RC5-004 workflow is Engineering Ready.",
      "The workflow requires further engineering review.",
      true,
    ),
  );

  return checks;
}

/**
 * Runs the deterministic RC5-004 validation.
 */
export function runHoleFillingCompactionValidation(
  dataset: HoleFillingValidationDataset =
    holeFillingCompactionValidationDataset,
): HoleFillingCompactionValidationReport {
  const result =
    runHoleFillingCompaction(
      dataset.input,
    );

  const checks =
    createValidationChecks(result);

  const passedChecks =
    checks.filter(
      (
        check: HoleFillingValidationCheck,
      ) => check.status === "passed",
    ).length;

  const failedChecks =
    checks.filter(
      (
        check: HoleFillingValidationCheck,
      ) => check.status === "failed",
    ).length;

  const warningChecks =
    checks.filter(
      (
        check: HoleFillingValidationCheck,
      ) => check.status === "warning",
    ).length;

  const bestSolution =
    result.bestSolution;

  const metrics:
    HoleFillingValidationMetrics = {
    originalMarkerLength:
      result.statistics
        .originalMarkerLength,

    finalMarkerLength:
      bestSolution
        ?.finalMarkerLength ??
      result.statistics
        .originalMarkerLength,

    markerLengthReduction:
      bestSolution
        ?.markerLengthReduction ??
      0,

    markerLengthReductionPercentage:
      bestSolution
        ?.markerLengthReductionPercentage ??
      0,

    originalUtilisation:
      result.statistics
        .originalUtilisation,

    finalUtilisation:
      bestSolution
        ?.finalUtilisation ??
      result.statistics
        .originalUtilisation,

    utilisationImprovement:
      bestSolution
        ?.utilisationImprovement ??
      0,

    detectedVoidCount:
      result.statistics
        .detectedVoidCount,

    compatibilityCandidateCount:
      result.statistics
        .compatibilityCandidateCount,

    collisionSafePlacementCount:
      result.statistics
        .collisionSafePlacementCount,

    selectedHoleFillingPlacementCount:
      result.statistics
        .selectedHoleFillingPlacementCount,

    compactionSolutionCount:
      result.statistics
        .compactionSolutionCount,

    finalSolutionCount:
      result.statistics
        .finalSolutionCount,

    bestCombinedEngineeringScore:
      result.statistics
        .bestCombinedEngineeringScore,
  };

  const engineeringValidated =
    failedChecks === 0 &&
    Boolean(bestSolution) &&
    bestSolution?.collisionFree === true &&
    bestSolution?.boundarySafe === true;

  const overallStatus:
    HoleFillingValidationStatus =
    failedChecks > 0
      ? "failed"
      : warningChecks > 0
        ? "warning"
        : "passed";

  const summary = engineeringValidated
    ? [
        "RC5-004 validation completed successfully.",
        `${passedChecks} checks passed.`,
        `${warningChecks} checks produced engineering warnings.`,
        `Final Marker Length: ${formatNumber(
          metrics.finalMarkerLength,
        )}.`,
        `Final Utilisation: ${formatNumber(
          metrics.finalUtilisation,
        )}%.`,
        `Engineering Score: ${formatNumber(
          metrics.bestCombinedEngineeringScore,
        )}.`,
      ].join(" ")
    : [
        "RC5-004 validation requires review.",
        `${passedChecks} checks passed.`,
        `${failedChecks} checks failed.`,
        `${warningChecks} checks produced warnings.`,
      ].join(" ");

  return {
    datasetId: dataset.id,
    datasetName: dataset.name,
    result,
    checks,
    metrics,
    passedChecks,
    failedChecks,
    warningChecks,
    overallStatus,
    engineeringValidated,
    summary,
  };
}

/**
 * Returns only failed checks.
 */
export function getFailedHoleFillingValidationChecks(
  report: HoleFillingCompactionValidationReport,
): ReadonlyArray<HoleFillingValidationCheck> {
  return report.checks.filter(
    (
      check: HoleFillingValidationCheck,
    ) => check.status === "failed",
  );
}

/**
 * Returns only warning checks.
 */
export function getWarningHoleFillingValidationChecks(
  report: HoleFillingCompactionValidationReport,
): ReadonlyArray<HoleFillingValidationCheck> {
  return report.checks.filter(
    (
      check: HoleFillingValidationCheck,
    ) => check.status === "warning",
  );
}

/**
 * Returns only passed checks.
 */
export function getPassedHoleFillingValidationChecks(
  report: HoleFillingCompactionValidationReport,
): ReadonlyArray<HoleFillingValidationCheck> {
  return report.checks.filter(
    (
      check: HoleFillingValidationCheck,
    ) => check.status === "passed",
  );
}

/**
 * Creates a console-friendly validation report.
 */
export function createHoleFillingValidationConsoleSummary(
  report: HoleFillingCompactionValidationReport,
): string {
  const checkLines =
    report.checks.map(
      (
        check: HoleFillingValidationCheck,
      ) => {
        const symbol =
          check.status === "passed"
            ? "✓"
            : check.status === "warning"
              ? "⚠"
              : "✗";

        return [
          symbol,
          check.title,
          `Expected: ${check.expected}`,
          `Actual: ${check.actual}`,
        ].join(" | ");
      },
    );

  return [
    "OptiFabric AI RC5-004 Validation",
    `Dataset: ${report.datasetName}`,
    `Overall Status: ${report.overallStatus.toUpperCase()}`,
    `Engineering Validated: ${String(
      report.engineeringValidated,
    )}`,
    "",
    ...checkLines,
    "",
    report.summary,
  ].join("\n");
}

/**
 * Runs and logs the validation during development.
 */
export function logHoleFillingCompactionValidation():
  HoleFillingCompactionValidationReport {
  const report =
    runHoleFillingCompactionValidation();

  console.group(
    "OptiFabric AI RC5-004 Engineering Validation",
  );

  console.log(
    createHoleFillingValidationConsoleSummary(
      report,
    ),
  );

  console.log(
    "Full validation report:",
    report,
  );

  console.groupEnd();

  return report;
}