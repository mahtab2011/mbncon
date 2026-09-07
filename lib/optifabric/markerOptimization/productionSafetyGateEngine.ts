/**
 * OptiFabric AI
 * RC5-004-009A — Production Safety Gate Engine
 *
 * Purpose:
 * - Protect production from unsafe optimisation results.
 * - Ensure safety outranks Marker Utilisation.
 * - Classify every marker candidate as:
 *
 *   PRODUCTION RELEASED
 *   ENGINEERING REVIEW REQUIRED
 *   REJECTED
 *
 * Release priority:
 *
 * Collision Safety
 * ↓
 * Marker Boundary
 * ↓
 * Cutting Gap
 * ↓
 * Grain Line
 * ↓
 * Rotation / Fabric Direction
 * ↓
 * Piece Completeness
 * ↓
 * Production Feasibility
 * ↓
 * Utilisation
 * ↓
 * Engineering Score
 *
 * Important rule:
 * A high-utilisation marker must NEVER receive production release
 * when any critical engineering safety gate fails.
 */

export type ProductionSafetyGateDecision =
  | "productionReleased"
  | "engineeringReviewRequired"
  | "rejected";

export type ProductionSafetyGateSeverity =
  | "critical"
  | "review"
  | "advisory"
  | "passed";

export type ProductionSafetyGateCode =
  | "collision"
  | "markerBoundary"
  | "cuttingGap"
  | "grainLine"
  | "rotation"
  | "fabricDirection"
  | "pieceCompleteness"
  | "productionFeasibility"
  | "utilisationTarget"
  | "engineeringScore"
  | "confidence"
  | "markerLength"
  | "general";

export interface ProductionSafetyGateIssue {
  readonly code: ProductionSafetyGateCode;

  readonly severity:
    ProductionSafetyGateSeverity;

  readonly title: string;

  readonly message: string;

  /**
   * true = this condition prevents Production Release.
   */
  readonly blocksRelease: boolean;
}

export interface ProductionSafetyGateInput {
  /**
   * Unique candidate identifier.
   */
  readonly id: string;

  readonly label?: string;

  readonly markerLengthCm: number;

  readonly utilisationPercent: number;

  readonly wastePercent?: number;

  readonly engineeringScore: number;

  readonly confidencePercent?: number;

  /**
   * Collision validation.
   */
  readonly collisionFree: boolean;

  readonly collisionCount?: number;

  /**
   * Marker boundary validation.
   */
  readonly boundarySafe: boolean;

  /**
   * Cutting-gap validation.
   *
   * undefined means the system has not yet confirmed the rule.
   */
  readonly cuttingGapSafe?: boolean;

  readonly requiredCuttingGapCm?: number;

  readonly minimumMeasuredGapCm?: number;

  /**
   * Grain Line validation.
   */
  readonly grainLineSafe?: boolean;

  readonly grainLineViolationCount?: number;

  /**
   * Rotation validation.
   */
  readonly rotationSafe?: boolean;

  readonly rotationViolationCount?: number;

  /**
   * Directional / nap / one-way fabric validation.
   */
  readonly fabricDirectionSafe?: boolean;

  /**
   * Pattern-piece completeness.
   */
  readonly pieceComplete?: boolean;

  readonly expectedPieceCount?: number;

  readonly placedPieceCount?: number;

  /**
   * General production feasibility.
   *
   * This can later include:
   * - machine limits
   * - lay restrictions
   * - fabric repeat
   * - stripe/check matching
   * - order ratio feasibility
   */
  readonly productionFeasible?: boolean;

  /**
   * Optional upstream Engineering Ready flag.
   */
  readonly upstreamEngineeringReady?: boolean;

  /**
   * Optional context.
   */
  readonly source?: string;
}

export interface ProductionSafetyGateOptions {
  /**
   * OptiFabric optimisation ambition.
   *
   * This is NOT a mandatory safety threshold.
   */
  readonly targetUtilisationPercent?: number;

  /**
   * Minimum acceptable Engineering Score for automatic Production Release.
   */
  readonly minimumReleaseEngineeringScore?: number;

  /**
   * Minimum confidence for automatic Production Release.
   */
  readonly minimumReleaseConfidencePercent?: number;

  /**
   * If true, undefined safety checks require engineering review.
   */
  readonly requireConfirmedSafetyChecks?: boolean;

  /**
   * Utilisation below this level may trigger an advisory warning.
   * It does NOT by itself block production.
   */
  readonly lowUtilisationAdvisoryPercent?: number;
}

export interface ProductionSafetyGateResult {
  readonly id: string;

  readonly label: string;

  readonly decision:
    ProductionSafetyGateDecision;

  readonly decisionLabel:
    | "PRODUCTION RELEASED"
    | "ENGINEERING REVIEW REQUIRED"
    | "REJECTED";

  readonly productionReleased: boolean;

  readonly engineeringReviewRequired: boolean;

  readonly rejected: boolean;

  readonly criticalFailureCount: number;

  readonly reviewIssueCount: number;

  readonly advisoryCount: number;

  readonly passedGateCount: number;

  readonly utilisationPercent: number;

  readonly wastePercent: number;

  readonly targetUtilisationPercent: number;

  readonly targetUtilisationAchieved: boolean;

  readonly engineeringScore: number;

  readonly confidencePercent: number | null;

  readonly markerLengthCm: number;

  /**
   * Safety Score only reflects production-safety gates.
   *
   * It must not be inflated by high utilisation.
   */
  readonly safetyScore: number;

  /**
   * Final release priority score.
   *
   * Safety dominates the score.
   */
  readonly releaseScore: number;

  readonly issues:
    ReadonlyArray<ProductionSafetyGateIssue>;

  readonly blockingIssues:
    ReadonlyArray<ProductionSafetyGateIssue>;

  readonly reviewIssues:
    ReadonlyArray<ProductionSafetyGateIssue>;

  readonly advisoryIssues:
    ReadonlyArray<ProductionSafetyGateIssue>;

  readonly passedChecks:
    ReadonlyArray<ProductionSafetyGateIssue>;

  readonly releaseReasons:
    ReadonlyArray<string>;

  readonly recommendation: string;
}

export interface ProductionSafetyGateRanking {
  readonly evaluated:
    ReadonlyArray<ProductionSafetyGateResult>;

  readonly productionReleased:
    ReadonlyArray<ProductionSafetyGateResult>;

  readonly engineeringReviewRequired:
    ReadonlyArray<ProductionSafetyGateResult>;

  readonly rejected:
    ReadonlyArray<ProductionSafetyGateResult>;

  /**
   * Best candidate that is actually safe for production.
   */
  readonly bestProductionSolution:
    ProductionSafetyGateResult | null;

  /**
   * Highest-efficiency candidate regardless of release state.
   *
   * This is informational only and must never override
   * bestProductionSolution.
   */
  readonly highestUtilisationCandidate:
    ProductionSafetyGateResult | null;

  readonly target90PlusReleased:
    ReadonlyArray<ProductionSafetyGateResult>;

  readonly summary: string;
}

interface NormalisedSafetyGateOptions {
  readonly targetUtilisationPercent: number;

  readonly minimumReleaseEngineeringScore: number;

  readonly minimumReleaseConfidencePercent: number;

  readonly requireConfirmedSafetyChecks: boolean;

  readonly lowUtilisationAdvisoryPercent: number;
}

const DEFAULT_TARGET_UTILISATION = 90;

const DEFAULT_RELEASE_ENGINEERING_SCORE = 60;

const DEFAULT_RELEASE_CONFIDENCE = 70;

const DEFAULT_LOW_UTILISATION_ADVISORY = 70;

const EPSILON = 1e-8;

/* ============================================================================
 * Utility functions
 * ========================================================================== */

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

function finiteNumber(
  value: number | undefined,
  fallback: number,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return value;
}

function finiteNonNegative(
  value: number | undefined,
  fallback: number,
): number {
  return Math.max(
    0,
    finiteNumber(
      value,
      fallback,
    ),
  );
}

function normaliseOptions(
  options:
    | ProductionSafetyGateOptions
    | undefined,
): NormalisedSafetyGateOptions {
  return {
    targetUtilisationPercent:
      clamp(
        finiteNumber(
          options
            ?.targetUtilisationPercent,
          DEFAULT_TARGET_UTILISATION,
        ),
        0,
        100,
      ),

    minimumReleaseEngineeringScore:
      clamp(
        finiteNumber(
          options
            ?.minimumReleaseEngineeringScore,
          DEFAULT_RELEASE_ENGINEERING_SCORE,
        ),
        0,
        100,
      ),

    minimumReleaseConfidencePercent:
      clamp(
        finiteNumber(
          options
            ?.minimumReleaseConfidencePercent,
          DEFAULT_RELEASE_CONFIDENCE,
        ),
        0,
        100,
      ),

    requireConfirmedSafetyChecks:
      options
        ?.requireConfirmedSafetyChecks ??
      true,

    lowUtilisationAdvisoryPercent:
      clamp(
        finiteNumber(
          options
            ?.lowUtilisationAdvisoryPercent,
          DEFAULT_LOW_UTILISATION_ADVISORY,
        ),
        0,
        100,
      ),
  };
}

function createIssue(
  code: ProductionSafetyGateCode,
  severity: ProductionSafetyGateSeverity,
  title: string,
  message: string,
  blocksRelease: boolean,
): ProductionSafetyGateIssue {
  return {
    code,
    severity,
    title,
    message,
    blocksRelease,
  };
}

function calculateWaste(
  utilisationPercent: number,
  suppliedWaste:
    | number
    | undefined,
): number {
  if (
    suppliedWaste !== undefined &&
    Number.isFinite(suppliedWaste)
  ) {
    return clamp(
      suppliedWaste,
      0,
      100,
    );
  }

  return clamp(
    100 -
      utilisationPercent,
    0,
    100,
  );
}

/* ============================================================================
 * Safety evaluation
 * ========================================================================== */

/**
 * Evaluates one marker candidate through the full Production Safety Gate.
 */
export function evaluateProductionSafetyGate(
  input: ProductionSafetyGateInput,
  options?: ProductionSafetyGateOptions,
): ProductionSafetyGateResult {
  const settings =
    normaliseOptions(options);

  const issues:
    ProductionSafetyGateIssue[] = [];

  const utilisationPercent =
    clamp(
      finiteNumber(
        input.utilisationPercent,
        0,
      ),
      0,
      100,
    );

  const wastePercent =
    calculateWaste(
      utilisationPercent,
      input.wastePercent,
    );

  const engineeringScore =
    clamp(
      finiteNumber(
        input.engineeringScore,
        0,
      ),
      0,
      100,
    );

  const confidencePercent =
    input.confidencePercent ===
      undefined
      ? null
      : clamp(
          finiteNumber(
            input.confidencePercent,
            0,
          ),
          0,
          100,
        );

  const markerLengthCm =
    finiteNonNegative(
      input.markerLengthCm,
      0,
    );

  /* --------------------------------------------------------------------------
   * Gate 1 — Collision Safety
   * ----------------------------------------------------------------------- */

  if (
    input.collisionFree &&
    finiteNonNegative(
      input.collisionCount,
      0,
    ) === 0
  ) {
    issues.push(
      createIssue(
        "collision",
        "passed",
        "Collision Safety",
        "No pattern collision was detected.",
        false,
      ),
    );
  } else {
    const collisionCount =
      finiteNonNegative(
        input.collisionCount,
        input.collisionFree
          ? 0
          : 1,
      );

    issues.push(
      createIssue(
        "collision",
        "critical",
        "Collision Detected",
        `${collisionCount} collision${
          collisionCount === 1
            ? ""
            : "s"
        } detected. Production Release is prohibited.`,
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 2 — Marker Boundary
   * ----------------------------------------------------------------------- */

  if (input.boundarySafe) {
    issues.push(
      createIssue(
        "markerBoundary",
        "passed",
        "Marker Boundary",
        "All pattern placements remain within the permitted marker boundary.",
        false,
      ),
    );
  } else {
    issues.push(
      createIssue(
        "markerBoundary",
        "critical",
        "Marker Boundary Exceeded",
        "One or more placements exceed the permitted marker or usable fabric boundary.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 3 — Cutting Gap
   * ----------------------------------------------------------------------- */

  if (
    input.cuttingGapSafe ===
    true
  ) {
    issues.push(
      createIssue(
        "cuttingGap",
        "passed",
        "Cutting Gap",
        "Required cutting clearance is maintained between pattern pieces.",
        false,
      ),
    );
  } else if (
    input.cuttingGapSafe ===
    false
  ) {
    const required =
      finiteNonNegative(
        input.requiredCuttingGapCm,
        0,
      );

    const measured =
      finiteNonNegative(
        input.minimumMeasuredGapCm,
        0,
      );

    issues.push(
      createIssue(
        "cuttingGap",
        "critical",
        "Cutting Gap Insufficient",
        `Minimum measured gap is ${measured.toFixed(
          2,
        )} cm while the required cutting gap is ${required.toFixed(
          2,
        )} cm.`,
        true,
      ),
    );
  } else if (
    settings.requireConfirmedSafetyChecks
  ) {
    issues.push(
      createIssue(
        "cuttingGap",
        "review",
        "Cutting Gap Not Confirmed",
        "Cutting-gap compliance has not yet been explicitly confirmed.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 4 — Grain Line
   * ----------------------------------------------------------------------- */

  if (
    input.grainLineSafe ===
    true
  ) {
    issues.push(
      createIssue(
        "grainLine",
        "passed",
        "Grain Line",
        "All grain-line constraints are satisfied.",
        false,
      ),
    );
  } else if (
    input.grainLineSafe ===
    false
  ) {
    const violations =
      finiteNonNegative(
        input.grainLineViolationCount,
        1,
      );

    issues.push(
      createIssue(
        "grainLine",
        "critical",
        "Grain Line Violation",
        `${violations} Grain Line violation${
          violations === 1
            ? ""
            : "s"
        } detected.`,
        true,
      ),
    );
  } else if (
    settings.requireConfirmedSafetyChecks
  ) {
    issues.push(
      createIssue(
        "grainLine",
        "review",
        "Grain Line Not Confirmed",
        "Grain Line compliance has not yet been explicitly confirmed.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 5 — Rotation
   * ----------------------------------------------------------------------- */

  if (
    input.rotationSafe === true
  ) {
    issues.push(
      createIssue(
        "rotation",
        "passed",
        "Pattern Rotation",
        "All pattern rotations comply with engineering rules.",
        false,
      ),
    );
  } else if (
    input.rotationSafe === false
  ) {
    const violations =
      finiteNonNegative(
        input.rotationViolationCount,
        1,
      );

    issues.push(
      createIssue(
        "rotation",
        "critical",
        "Rotation Rule Violation",
        `${violations} pattern rotation violation${
          violations === 1
            ? ""
            : "s"
        } detected.`,
        true,
      ),
    );
  } else if (
    settings.requireConfirmedSafetyChecks
  ) {
    issues.push(
      createIssue(
        "rotation",
        "review",
        "Rotation Rules Not Confirmed",
        "Pattern rotation compliance has not yet been explicitly confirmed.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 6 — Fabric Direction
   * ----------------------------------------------------------------------- */

  if (
    input.fabricDirectionSafe ===
    true
  ) {
    issues.push(
      createIssue(
        "fabricDirection",
        "passed",
        "Fabric Direction",
        "Directional, nap and one-way fabric rules are satisfied.",
        false,
      ),
    );
  } else if (
    input.fabricDirectionSafe ===
    false
  ) {
    issues.push(
      createIssue(
        "fabricDirection",
        "critical",
        "Fabric Direction Violation",
        "One or more placements violate the permitted fabric direction.",
        true,
      ),
    );
  } else if (
    settings.requireConfirmedSafetyChecks
  ) {
    issues.push(
      createIssue(
        "fabricDirection",
        "review",
        "Fabric Direction Not Confirmed",
        "Fabric-direction compliance has not yet been explicitly confirmed.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 7 — Piece Completeness
   * ----------------------------------------------------------------------- */

  const expectedPieceCount =
    finiteNonNegative(
      input.expectedPieceCount,
      0,
    );

  const placedPieceCount =
    finiteNonNegative(
      input.placedPieceCount,
      0,
    );

  const inferredPieceComplete =
    expectedPieceCount > 0
      ? placedPieceCount +
          EPSILON >=
        expectedPieceCount
      : undefined;

  const pieceComplete =
    input.pieceComplete ??
    inferredPieceComplete;

  if (pieceComplete === true) {
    issues.push(
      createIssue(
        "pieceCompleteness",
        "passed",
        "Pattern Piece Completeness",
        "All required pattern pieces are present in the marker.",
        false,
      ),
    );
  } else if (
    pieceComplete === false
  ) {
    const missing =
      expectedPieceCount > 0
        ? Math.max(
            0,
            expectedPieceCount -
              placedPieceCount,
          )
        : 1;

    issues.push(
      createIssue(
        "pieceCompleteness",
        "critical",
        "Pattern Pieces Incomplete",
        `${missing} required pattern piece${
          missing === 1
            ? ""
            : "s"
        } missing from the marker.`,
        true,
      ),
    );
  } else if (
    settings.requireConfirmedSafetyChecks
  ) {
    issues.push(
      createIssue(
        "pieceCompleteness",
        "review",
        "Pattern Completeness Not Confirmed",
        "The marker has not yet confirmed that all required physical pattern pieces are present.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Gate 8 — Production Feasibility
   * ----------------------------------------------------------------------- */

  if (
    input.productionFeasible ===
    true
  ) {
    issues.push(
      createIssue(
        "productionFeasibility",
        "passed",
        "Production Feasibility",
        "The marker satisfies the currently available production-feasibility checks.",
        false,
      ),
    );
  } else if (
    input.productionFeasible ===
    false
  ) {
    issues.push(
      createIssue(
        "productionFeasibility",
        "critical",
        "Production Feasibility Failed",
        "The marker does not satisfy one or more production constraints.",
        true,
      ),
    );
  } else if (
    settings.requireConfirmedSafetyChecks
  ) {
    issues.push(
      createIssue(
        "productionFeasibility",
        "review",
        "Production Feasibility Not Confirmed",
        "The marker requires engineering confirmation of production feasibility.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Upstream Engineering Ready
   * ----------------------------------------------------------------------- */

  if (
    input.upstreamEngineeringReady ===
    false
  ) {
    issues.push(
      createIssue(
        "general",
        "review",
        "Upstream Engineering Review",
        "The upstream optimisation engine has not marked this candidate Engineering Ready.",
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Utilisation
   *
   * Utilisation is deliberately evaluated AFTER safety.
   * ----------------------------------------------------------------------- */

  const targetUtilisationAchieved =
    utilisationPercent +
      EPSILON >=
    settings.targetUtilisationPercent;

  if (targetUtilisationAchieved) {
    issues.push(
      createIssue(
        "utilisationTarget",
        "passed",
        "Utilisation Target Achieved",
        `Marker Utilisation of ${utilisationPercent.toFixed(
          2,
        )}% meets or exceeds the ${settings.targetUtilisationPercent.toFixed(
          0,
        )}% optimisation target.`,
        false,
      ),
    );
  } else if (
    utilisationPercent <
    settings.lowUtilisationAdvisoryPercent
  ) {
    issues.push(
      createIssue(
        "utilisationTarget",
        "advisory",
        "Low Marker Utilisation",
        `Marker Utilisation is ${utilisationPercent.toFixed(
          2,
        )}%. Continue optimisation toward the ${settings.targetUtilisationPercent.toFixed(
          0,
        )}% target where physically feasible.`,
        false,
      ),
    );
  } else {
    issues.push(
      createIssue(
        "utilisationTarget",
        "advisory",
        "Further Optimisation Available",
        `Marker Utilisation is ${utilisationPercent.toFixed(
          2,
        )}%, below the ${settings.targetUtilisationPercent.toFixed(
          0,
        )}% target.`,
        false,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Engineering Score
   * ----------------------------------------------------------------------- */

  if (
    engineeringScore +
      EPSILON >=
    settings.minimumReleaseEngineeringScore
  ) {
    issues.push(
      createIssue(
        "engineeringScore",
        "passed",
        "Engineering Score",
        `Engineering Score ${engineeringScore.toFixed(
          2,
        )} meets the automatic-release threshold.`,
        false,
      ),
    );
  } else {
    issues.push(
      createIssue(
        "engineeringScore",
        "review",
        "Engineering Score Below Release Threshold",
        `Engineering Score ${engineeringScore.toFixed(
          2,
        )} is below the ${settings.minimumReleaseEngineeringScore.toFixed(
          0,
        )} automatic-release threshold.`,
        true,
      ),
    );
  }

  /* --------------------------------------------------------------------------
   * Confidence
   * ----------------------------------------------------------------------- */

  if (
    confidencePercent !== null
  ) {
    if (
      confidencePercent +
        EPSILON >=
      settings.minimumReleaseConfidencePercent
    ) {
      issues.push(
        createIssue(
          "confidence",
          "passed",
          "AI Confidence",
          `AI Confidence is ${confidencePercent.toFixed(
            0,
          )}%.`,
          false,
        ),
      );
    } else {
      issues.push(
        createIssue(
          "confidence",
          "review",
          "AI Confidence Below Release Threshold",
          `AI Confidence of ${confidencePercent.toFixed(
            0,
          )}% requires engineering review.`,
          true,
        ),
      );
    }
  }

  /* --------------------------------------------------------------------------
   * Marker Length
   * ----------------------------------------------------------------------- */

  if (markerLengthCm > 0) {
    issues.push(
      createIssue(
        "markerLength",
        "passed",
        "Marker Length",
        `Calculated Marker Length is ${markerLengthCm.toFixed(
          2,
        )} cm.`,
        false,
      ),
    );
  } else {
    issues.push(
      createIssue(
        "markerLength",
        "critical",
        "Invalid Marker Length",
        "Marker Length must be greater than zero.",
        true,
      ),
    );
  }

  /* ==========================================================================
   * Decision
   * ======================================================================== */

  const criticalIssues =
    issues.filter(
      (issue) =>
        issue.severity ===
        "critical",
    );

  const reviewIssues =
    issues.filter(
      (issue) =>
        issue.severity ===
        "review",
    );

  const advisoryIssues =
    issues.filter(
      (issue) =>
        issue.severity ===
        "advisory",
    );

  const passedChecks =
    issues.filter(
      (issue) =>
        issue.severity ===
        "passed",
    );

  const blockingIssues =
    issues.filter(
      (issue) =>
        issue.blocksRelease,
    );

  let decision:
    ProductionSafetyGateDecision;

  if (
    criticalIssues.length > 0
  ) {
    decision = "rejected";
  } else if (
    reviewIssues.length > 0 ||
    blockingIssues.length > 0
  ) {
    decision =
      "engineeringReviewRequired";
  } else {
    decision =
      "productionReleased";
  }

  const productionReleased =
    decision ===
    "productionReleased";

  const engineeringReviewRequired =
    decision ===
    "engineeringReviewRequired";

  const rejected =
    decision === "rejected";

  /* ==========================================================================
   * Safety Score
   *
   * Safety is intentionally calculated independently of utilisation.
   * ======================================================================== */

  const safetyGateIssues =
    issues.filter(
      (issue) =>
        [
          "collision",
          "markerBoundary",
          "cuttingGap",
          "grainLine",
          "rotation",
          "fabricDirection",
          "pieceCompleteness",
          "productionFeasibility",
        ].includes(issue.code),
    );

  const safetyGateCount =
    Math.max(
      1,
      safetyGateIssues.length,
    );

  const safetyPenalty =
    safetyGateIssues.reduce(
      (total, issue) => {
        if (
          issue.severity ===
          "critical"
        ) {
          return total + 100;
        }

        if (
          issue.severity ===
          "review"
        ) {
          return total + 25;
        }

        return total;
      },
      0,
    );

  const safetyScore =
    clamp(
      100 -
        safetyPenalty /
          safetyGateCount,
      0,
      100,
    );

  /**
   * Release Score deliberately gives safety most of the weight.
   *
   * 70% Safety
   * 15% Engineering Score
   * 10% Utilisation
   * 5% Confidence
   */
  const confidenceForScore =
    confidencePercent ??
    50;

  let releaseScore =
    safetyScore * 0.7 +
    engineeringScore * 0.15 +
    utilisationPercent * 0.1 +
    confidenceForScore * 0.05;

  /**
   * A rejected solution cannot numerically outrank a released solution.
   */
  if (rejected) {
    releaseScore =
      Math.min(
        releaseScore,
        39.99,
      );
  } else if (
    engineeringReviewRequired
  ) {
    releaseScore =
      Math.min(
        releaseScore,
        69.99,
      );
  } else {
    releaseScore =
      Math.max(
        releaseScore,
        70,
      );
  }

  const decisionLabel:
    ProductionSafetyGateResult["decisionLabel"] =
    productionReleased
      ? "PRODUCTION RELEASED"
      : engineeringReviewRequired
        ? "ENGINEERING REVIEW REQUIRED"
        : "REJECTED";

  const releaseReasons:
    string[] = [];

  if (productionReleased) {
    releaseReasons.push(
      "All required production safety gates passed.",
    );

    releaseReasons.push(
      "The marker is eligible for production release subject to factory validation procedures.",
    );
  }

  if (rejected) {
    releaseReasons.push(
      "One or more critical engineering safety conditions failed.",
    );

    releaseReasons.push(
      "Production Release is prohibited until the failed conditions are corrected and revalidated.",
    );
  }

  if (
    engineeringReviewRequired
  ) {
    releaseReasons.push(
      "No confirmed critical rejection is present, but one or more engineering checks require review.",
    );

    releaseReasons.push(
      "The marker must not be automatically released to production.",
    );
  }

  if (targetUtilisationAchieved) {
    releaseReasons.push(
      `The ${settings.targetUtilisationPercent.toFixed(
        0,
      )}%+ Marker Utilisation target has been achieved.`,
    );
  } else {
    releaseReasons.push(
      `Current utilisation is ${utilisationPercent.toFixed(
        2,
      )}%; optimisation may continue toward ${settings.targetUtilisationPercent.toFixed(
        0,
      )}% where physically feasible.`,
    );
  }

  const recommendation =
    productionReleased
      ? targetUtilisationAchieved
        ? "Production-safe marker with target utilisation achieved. Eligible for controlled production release."
        : "Production-safe marker. Continue optimisation only if additional fabric saving can be achieved without reducing engineering safety."
      : rejected
        ? "Reject this marker for production. Correct critical engineering failures before further optimisation or release."
        : "Engineering review required. Do not release this marker to production until all review conditions are confirmed.";

  return {
    id: input.id,

    label:
      input.label ??
      input.id,

    decision,

    decisionLabel,

    productionReleased,

    engineeringReviewRequired,

    rejected,

    criticalFailureCount:
      criticalIssues.length,

    reviewIssueCount:
      reviewIssues.length,

    advisoryCount:
      advisoryIssues.length,

    passedGateCount:
      passedChecks.length,

    utilisationPercent,

    wastePercent,

    targetUtilisationPercent:
      settings.targetUtilisationPercent,

    targetUtilisationAchieved,

    engineeringScore,

    confidencePercent,

    markerLengthCm,

    safetyScore,

    releaseScore:
      clamp(
        releaseScore,
        0,
        100,
      ),

    issues,

    blockingIssues,

    reviewIssues,

    advisoryIssues,

    passedChecks,

    releaseReasons,

    recommendation,
  };
}

/* ============================================================================
 * Multi-solution ranking
 * ========================================================================== */

function compareProductionCandidates(
  first: ProductionSafetyGateResult,
  second: ProductionSafetyGateResult,
): number {
  /**
   * Absolute priority:
   *
   * Production Released
   * >
   * Engineering Review
   * >
   * Rejected
   */

  const decisionRank = (
    decision:
      ProductionSafetyGateDecision,
  ): number => {
    switch (decision) {
      case "productionReleased":
        return 3;

      case "engineeringReviewRequired":
        return 2;

      case "rejected":
        return 1;
    }
  };

  const firstRank =
    decisionRank(
      first.decision,
    );

  const secondRank =
    decisionRank(
      second.decision,
    );

  if (
    firstRank !==
    secondRank
  ) {
    return (
      secondRank -
      firstRank
    );
  }

  /**
   * Within the same safety class,
   * prefer higher Safety Score.
   */
  if (
    first.safetyScore !==
    second.safetyScore
  ) {
    return (
      second.safetyScore -
      first.safetyScore
    );
  }

  /**
   * Then prefer target utilisation.
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
    first.utilisationPercent !==
    second.utilisationPercent
  ) {
    return (
      second.utilisationPercent -
      first.utilisationPercent
    );
  }

  /**
   * Then Engineering Score.
   */
  if (
    first.engineeringScore !==
    second.engineeringScore
  ) {
    return (
      second.engineeringScore -
      first.engineeringScore
    );
  }

  /**
   * Then AI confidence.
   */
  return (
    (second.confidencePercent ??
      0) -
    (first.confidencePercent ??
      0)
  );
}

/**
 * Evaluates and ranks multiple Marker Solutions.
 *
 * IMPORTANT:
 *
 * A safe 75% marker always outranks an unsafe 95% marker.
 */
export function rankProductionSafetyGateSolutions(
  inputs:
    ReadonlyArray<ProductionSafetyGateInput>,
  options?: ProductionSafetyGateOptions,
): ProductionSafetyGateRanking {
  const evaluated =
    inputs
      .map((input) =>
        evaluateProductionSafetyGate(
          input,
          options,
        ),
      )
      .sort(
        compareProductionCandidates,
      );

  const productionReleased =
    evaluated.filter(
      (result) =>
        result.productionReleased,
    );

  const engineeringReviewRequired =
    evaluated.filter(
      (result) =>
        result.engineeringReviewRequired,
    );

  const rejected =
    evaluated.filter(
      (result) =>
        result.rejected,
    );

  const bestProductionSolution =
    productionReleased[0] ??
    null;

  const highestUtilisationCandidate =
    [...evaluated].sort(
      (first, second) =>
        second.utilisationPercent -
        first.utilisationPercent,
    )[0] ?? null;

  const target90PlusReleased =
    productionReleased.filter(
      (result) =>
        result.targetUtilisationAchieved,
    );

  let summary: string;

  if (
    bestProductionSolution
  ) {
    if (
      bestProductionSolution
        .targetUtilisationAchieved
    ) {
      summary =
        `${bestProductionSolution.label} is the highest-ranked Production Released marker and achieves ${bestProductionSolution.utilisationPercent.toFixed(
          2,
        )}% utilisation.`;
    } else {
      summary =
        `${bestProductionSolution.label} is currently the highest-ranked Production Released marker at ${bestProductionSolution.utilisationPercent.toFixed(
          2,
        )}% utilisation. Further optimisation may continue toward the target without compromising safety.`;
    }
  } else if (
    engineeringReviewRequired.length >
    0
  ) {
    summary =
      "No marker is currently eligible for Production Release. Engineering review is required before production.";
  } else {
    summary =
      "No marker is currently eligible for Production Release. Critical engineering failures must be corrected.";
  }

  return {
    evaluated,

    productionReleased,

    engineeringReviewRequired,

    rejected,

    bestProductionSolution,

    highestUtilisationCandidate,

    target90PlusReleased,

    summary,
  };
}

/**
 * Returns only markers eligible for Production Release.
 */
export function getProductionReleasedSolutions(
  ranking:
    ProductionSafetyGateRanking,
): ReadonlyArray<ProductionSafetyGateResult> {
  return ranking.productionReleased;
}

/**
 * Returns the safest highest-ranked production marker.
 */
export function getBestProductionReleasedSolution(
  ranking:
    ProductionSafetyGateRanking,
): ProductionSafetyGateResult | null {
  return ranking.bestProductionSolution;
}

/**
 * Returns the highest-utilisation marker regardless of safety.
 *
 * WARNING:
 * This must never be used as the production recommendation
 * without checking Production Safety Gate status.
 */
export function getHighestUtilisationCandidate(
  ranking:
    ProductionSafetyGateRanking,
): ProductionSafetyGateResult | null {
  return ranking.highestUtilisationCandidate;
}

/**
 * Returns markers that are both:
 *
 * - Production Released
 * - >= target utilisation
 */
export function getTargetUtilisationProductionSolutions(
  ranking:
    ProductionSafetyGateRanking,
): ReadonlyArray<ProductionSafetyGateResult> {
  return ranking.target90PlusReleased;
}