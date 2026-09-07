/**
 * OptiFabric AI
 * RC5-004-009D — Production Release Decision Engine
 *
 * Purpose:
 * - Convert Production Safety Gate results into one clear Cutting Master decision.
 * - Separate "best production-safe marker" from "highest-efficiency candidate".
 * - Prevent unsafe markers from being released simply because utilisation is higher.
 *
 * Final decisions:
 *
 * RELEASE FOR CUTTING
 * ENGINEERING REVIEW REQUIRED
 * DO NOT RELEASE
 */

import type {
  ProductionSafetyGateRanking,
  ProductionSafetyGateResult,
} from "./productionSafetyGateEngine";

export type ProductionReleaseDecision =
  | "releaseForCutting"
  | "engineeringReviewRequired"
  | "doNotRelease";

export type ProductionReleaseDecisionLabel =
  | "RELEASE FOR CUTTING"
  | "ENGINEERING REVIEW REQUIRED"
  | "DO NOT RELEASE";

export type ProductionReleaseSeverity =
  | "approved"
  | "warning"
  | "blocked";

export interface ProductionReleaseDecisionInput {
  /**
   * Full multi-solution safety ranking.
   */
  readonly safetyRanking:
    ProductionSafetyGateRanking;

  /**
   * Solution currently selected by the Cutting Master.
   */
  readonly selectedSolutionId:
    string | null;

  /**
   * Optional 90%+ optimisation target.
   */
  readonly targetUtilisationPercent?: number;

  /**
   * Require explicit Production Safety Gate release
   * before Cutting Release.
   */
  readonly requireProductionSafetyRelease?: boolean;
}

export interface ProductionReleaseDecisionResult {
  readonly decision:
    ProductionReleaseDecision;

  readonly decisionLabel:
    ProductionReleaseDecisionLabel;

  readonly severity:
    ProductionReleaseSeverity;

  readonly selectedSolution:
    ProductionSafetyGateResult | null;

  readonly bestProductionSolution:
    ProductionSafetyGateResult | null;

  readonly highestUtilisationCandidate:
    ProductionSafetyGateResult | null;

  readonly selectedIsBestProductionSolution:
    boolean;

  readonly selectedIsHighestUtilisationCandidate:
    boolean;

  readonly selectedProductionReleased:
    boolean;

  readonly selectedEngineeringReviewRequired:
    boolean;

  readonly selectedRejected:
    boolean;

  readonly targetUtilisationPercent:
    number;

  readonly selectedUtilisationPercent:
    number | null;

  readonly bestSafeUtilisationPercent:
    number | null;

  readonly highestCandidateUtilisationPercent:
    number | null;

  readonly utilisationGapToTarget:
    number | null;

  readonly safetyScore:
    number | null;

  readonly engineeringScore:
    number | null;

  readonly confidencePercent:
    number | null;

  readonly blockingReasons:
    ReadonlyArray<string>;

  readonly reviewReasons:
    ReadonlyArray<string>;

  readonly advisoryReasons:
    ReadonlyArray<string>;

  readonly releaseReasons:
    ReadonlyArray<string>;

  readonly instruction:
    string;

  readonly engineeringMessage:
    string;

  readonly efficiencyMessage:
    string;

  readonly summary:
    string;
}

const DEFAULT_TARGET_UTILISATION = 90;

/* ============================================================================
 * Helpers
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

function resolveTargetUtilisation(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return DEFAULT_TARGET_UTILISATION;
  }

  return clamp(
    value,
    0,
    100,
  );
}

function uniqueStrings(
  values: ReadonlyArray<string>,
): string[] {
  return Array.from(
    new Set(
      values.filter(
        (value) =>
          value.trim().length > 0,
      ),
    ),
  );
}

function getSelectedSolution(
  ranking:
    ProductionSafetyGateRanking,
  selectedSolutionId:
    string | null,
): ProductionSafetyGateResult | null {
  if (!selectedSolutionId) {
    return null;
  }

  return (
    ranking.evaluated.find(
      (solution) =>
        solution.id ===
        selectedSolutionId,
    ) ??
    null
  );
}

/* ============================================================================
 * Release decision
 * ========================================================================== */

export function createProductionReleaseDecision(
  input:
    ProductionReleaseDecisionInput,
): ProductionReleaseDecisionResult {
  const targetUtilisationPercent =
    resolveTargetUtilisation(
      input.targetUtilisationPercent,
    );

  const requireProductionSafetyRelease =
    input.requireProductionSafetyRelease ??
    true;

  const ranking =
    input.safetyRanking;

  const selectedSolution =
    getSelectedSolution(
      ranking,
      input.selectedSolutionId,
    );

  const bestProductionSolution =
    ranking.bestProductionSolution;

  const highestUtilisationCandidate =
    ranking.highestUtilisationCandidate;

  const selectedIsBestProductionSolution =
    Boolean(
      selectedSolution &&
        bestProductionSolution &&
        selectedSolution.id ===
          bestProductionSolution.id,
    );

  const selectedIsHighestUtilisationCandidate =
    Boolean(
      selectedSolution &&
        highestUtilisationCandidate &&
        selectedSolution.id ===
          highestUtilisationCandidate.id,
    );

  const selectedProductionReleased =
    selectedSolution?.productionReleased ??
    false;

  const selectedEngineeringReviewRequired =
    selectedSolution
      ?.engineeringReviewRequired ??
    false;

  const selectedRejected =
    selectedSolution?.rejected ??
    false;

  const selectedUtilisationPercent =
    selectedSolution
      ?.utilisationPercent ??
    null;

  const bestSafeUtilisationPercent =
    bestProductionSolution
      ?.utilisationPercent ??
    null;

  const highestCandidateUtilisationPercent =
    highestUtilisationCandidate
      ?.utilisationPercent ??
    null;

  const utilisationGapToTarget =
    selectedUtilisationPercent ===
    null
      ? null
      : Math.max(
          0,
          targetUtilisationPercent -
            selectedUtilisationPercent,
        );

  const safetyScore =
    selectedSolution?.safetyScore ??
    null;

  const engineeringScore =
    selectedSolution
      ?.engineeringScore ??
    null;

  const confidencePercent =
    selectedSolution
      ?.confidencePercent ??
    null;

  const blockingReasons =
    selectedSolution
      ? uniqueStrings(
          selectedSolution
            .blockingIssues
            .map(
              (issue) =>
                issue.message,
            ),
        )
      : [];

  const reviewReasons =
    selectedSolution
      ? uniqueStrings(
          selectedSolution
            .reviewIssues
            .map(
              (issue) =>
                issue.message,
            ),
        )
      : [];

  const advisoryReasons =
    selectedSolution
      ? uniqueStrings(
          selectedSolution
            .advisoryIssues
            .map(
              (issue) =>
                issue.message,
            ),
        )
      : [];

  let decision:
    ProductionReleaseDecision;

  let decisionLabel:
    ProductionReleaseDecisionLabel;

  let severity:
    ProductionReleaseSeverity;

  let instruction: string;

  let engineeringMessage: string;

  let efficiencyMessage: string;

  const releaseReasons:
    string[] = [];

  /* --------------------------------------------------------------------------
   * No selected solution
   * ----------------------------------------------------------------------- */

  if (!selectedSolution) {
    decision =
      "engineeringReviewRequired";

    decisionLabel =
      "ENGINEERING REVIEW REQUIRED";

    severity = "warning";

    instruction =
      "Select a marker solution before making a production release decision.";

    engineeringMessage =
      "No marker is currently selected for Cutting Release.";

    efficiencyMessage =
      bestProductionSolution
        ? `${bestProductionSolution.label} is currently the highest-ranked production-safe marker.`
        : "No marker is currently eligible for Production Release.";

    return {
      decision,
      decisionLabel,
      severity,
      selectedSolution,
      bestProductionSolution,
      highestUtilisationCandidate,
      selectedIsBestProductionSolution,
      selectedIsHighestUtilisationCandidate,
      selectedProductionReleased,
      selectedEngineeringReviewRequired,
      selectedRejected,
      targetUtilisationPercent,
      selectedUtilisationPercent,
      bestSafeUtilisationPercent,
      highestCandidateUtilisationPercent,
      utilisationGapToTarget,
      safetyScore,
      engineeringScore,
      confidencePercent,
      blockingReasons,
      reviewReasons,
      advisoryReasons,
      releaseReasons,
      instruction,
      engineeringMessage,
      efficiencyMessage,
      summary:
        "Select a marker solution before production release can be evaluated.",
    };
  }

  /* --------------------------------------------------------------------------
   * Rejected
   * ----------------------------------------------------------------------- */

  if (selectedRejected) {
    decision =
      "doNotRelease";

    decisionLabel =
      "DO NOT RELEASE";

    severity = "blocked";

    instruction =
      "Do not release this marker for cutting. Correct the failed engineering conditions and rerun validation.";

    engineeringMessage =
      blockingReasons.length > 0
        ? blockingReasons.join(" ")
        : "The selected marker contains a critical Production Safety Gate failure.";

    efficiencyMessage =
      selectedIsHighestUtilisationCandidate
        ? `This marker has the highest observed utilisation at ${selectedSolution.utilisationPercent.toFixed(
            2,
          )}%, but efficiency cannot override production safety.`
        : `Marker Utilisation is ${selectedSolution.utilisationPercent.toFixed(
            2,
          )}%, but this result is not eligible for production release.`;
  }

  /* --------------------------------------------------------------------------
   * Engineering review
   * ----------------------------------------------------------------------- */

  else if (
    selectedEngineeringReviewRequired ||
    (
      requireProductionSafetyRelease &&
      !selectedProductionReleased
    )
  ) {
    decision =
      "engineeringReviewRequired";

    decisionLabel =
      "ENGINEERING REVIEW REQUIRED";

    severity = "warning";

    instruction =
      "Do not release this marker automatically. A Cutting Master or authorised engineer must review and clear the outstanding conditions.";

    engineeringMessage =
      reviewReasons.length > 0
        ? reviewReasons.join(" ")
        : "The selected marker has not completed all required Production Safety Gate checks.";

    efficiencyMessage =
      selectedIsHighestUtilisationCandidate
        ? `This is the highest-efficiency candidate at ${selectedSolution.utilisationPercent.toFixed(
            2,
          )}% utilisation, but it is not Production Released.`
        : `Marker Utilisation is ${selectedSolution.utilisationPercent.toFixed(
            2,
          )}%. Safety validation remains the priority.`;
  }

  /* --------------------------------------------------------------------------
   * Production released
   * ----------------------------------------------------------------------- */

  else {
    decision =
      "releaseForCutting";

    decisionLabel =
      "RELEASE FOR CUTTING";

    severity = "approved";

    instruction =
      "This marker has passed the currently connected Production Safety Gate and may proceed to controlled cutting release.";

    releaseReasons.push(
      "Production Safety Gate passed.",
    );

    releaseReasons.push(
      "No critical blocking condition is present.",
    );

    releaseReasons.push(
      "The selected marker is eligible for controlled production release.",
    );

    engineeringMessage =
      selectedIsBestProductionSolution
        ? "This is currently the highest-ranked production-safe marker."
        : bestProductionSolution
          ? `${bestProductionSolution.label} ranks higher as the current production-safe recommendation.`
          : "The selected marker is Production Released.";

    if (
      selectedSolution.utilisationPercent >=
      targetUtilisationPercent
    ) {
      efficiencyMessage =
        `Marker Utilisation is ${selectedSolution.utilisationPercent.toFixed(
          2,
        )}% and meets the ${targetUtilisationPercent.toFixed(
          0,
        )}%+ optimisation target.`;
    } else {
      efficiencyMessage =
        `Marker Utilisation is ${selectedSolution.utilisationPercent.toFixed(
          2,
        )}%. The marker is safe for production, but optimisation may continue toward ${targetUtilisationPercent.toFixed(
          0,
        )}% where physically feasible.`;
    }
  }

  /* ==========================================================================
   * Summary
   * ======================================================================== */

  let summary: string;

  if (
    decision ===
    "releaseForCutting"
  ) {
    summary =
      `${selectedSolution.label} is eligible for Cutting Release at ${selectedSolution.utilisationPercent.toFixed(
        2,
      )}% utilisation.`;
  } else if (
    decision ===
    "engineeringReviewRequired"
  ) {
    summary =
      `${selectedSolution.label} requires engineering review before Cutting Release.`;
  } else {
    summary =
      `${selectedSolution.label} must not be released for cutting.`;
  }

  return {
    decision,
    decisionLabel,
    severity,

    selectedSolution,

    bestProductionSolution,

    highestUtilisationCandidate,

    selectedIsBestProductionSolution,

    selectedIsHighestUtilisationCandidate,

    selectedProductionReleased,

    selectedEngineeringReviewRequired,

    selectedRejected,

    targetUtilisationPercent,

    selectedUtilisationPercent,

    bestSafeUtilisationPercent,

    highestCandidateUtilisationPercent,

    utilisationGapToTarget,

    safetyScore,

    engineeringScore,

    confidencePercent,

    blockingReasons,

    reviewReasons,

    advisoryReasons,

    releaseReasons,

    instruction,

    engineeringMessage,

    efficiencyMessage,

    summary,
  };
}

/* ============================================================================
 * Convenience helpers
 * ========================================================================== */

export function canReleaseMarkerForCutting(
  decision:
    ProductionReleaseDecisionResult,
): boolean {
  return (
    decision.decision ===
      "releaseForCutting" &&
    decision.selectedProductionReleased
  );
}

export function requiresEngineeringReview(
  decision:
    ProductionReleaseDecisionResult,
): boolean {
  return (
    decision.decision ===
    "engineeringReviewRequired"
  );
}

export function mustBlockProductionRelease(
  decision:
    ProductionReleaseDecisionResult,
): boolean {
  return (
    decision.decision ===
    "doNotRelease"
  );
}

export function getProductionReleaseInstruction(
  decision:
    ProductionReleaseDecisionResult,
): string {
  return decision.instruction;
}