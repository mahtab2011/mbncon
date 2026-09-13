/**
 * OptiFabric AI
 * Stage 2E-1 — Deterministic Engineering Recommendations Aggregator
 *
 * This module does NOT make any engineering judgement of its own about
 * marker safety or fabric consumption — those are owned exclusively by:
 *
 *   - lib/optifabric/markerOptimization/productionSafetyGateEngine.ts
 *     (collision, boundary, cutting gap, grain-line rotation compliance,
 *     rotation/fabric direction, piece completeness, utilisation target,
 *     engineering score, confidence, marker length)
 *
 *   - lib/optifabric/markerFabricConsumptionEngine.ts
 *     (roll/allowance/consumption validity and warnings)
 *
 * Stage 2E-1 only (a) maps each of those engines' own issues into one
 * shared, typed vocabulary without recalculating anything, and (b) adds the
 * two genuinely uncovered deterministic completeness checks the Stage 2E
 * audit identified: whether a FabricProfile exists at all, and whether each
 * relevant pattern piece has a traced grain line on file. Neither new check
 * judges quality, correctness, or production safety — both are pure
 * presence/absence checks over data the caller already has.
 *
 * Pure module: no React, no localStorage, no fetch, no DOM, no backend/
 * Prisma dependency. Every import below is type-only.
 */

import type {
  ProductionSafetyGateIssue,
} from "@/lib/optifabric/markerOptimization/productionSafetyGateEngine";

import type {
  MarkerFabricConsumptionIssue,
} from "@/lib/optifabric/markerFabricConsumptionEngine";

/* ============================================================================
 * Result shape
 * ========================================================================== */

export type EngineeringRecommendationSeverity =
  | "critical"
  | "review"
  | "advisory"
  | "passed";

export type EngineeringRecommendationCategory =
  | "safety"
  | "consumption"
  | "data-completeness";

export type EngineeringRecommendationSource =
  | "safetyGate"
  | "consumptionEngine"
  | "dataCompleteness";

export interface EngineeringRecommendation {
  code: string;
  severity: EngineeringRecommendationSeverity;
  category: EngineeringRecommendationCategory;
  title: string;
  message: string;
  blocking: boolean;
  source: EngineeringRecommendationSource;
  evidence?: Record<string, number | string>;
}

/* ============================================================================
 * Input shape
 * ========================================================================== */

export interface FabricProfileCompletenessInput {
  /**
   * Whether a FabricProfile is expected/relevant in THIS context at all —
   * e.g. false for a legacy local-only project (Stage 2C-2 never attempts
   * server FabricProfile persistence for one), or whenever the caller isn't
   * actually attempting a real project consumption analysis. When false,
   * this check is skipped entirely — no recommendation either way. This
   * exists specifically so "missing FabricProfile" is never reported in a
   * context where a FabricProfile was never expected in the first place.
   */
  applicable: boolean;

  /**
   * Whether a FabricProfile has actually been saved for this project — the
   * same presence signal marker/page.tsx's own Stage 2D-2 gating already
   * uses (`Boolean(project?.fabricProfile)`), not re-derived here.
   */
  present: boolean;
}

export interface GrainLineTraceCompletenessInput {
  /**
   * One entry per pattern piece the CALLER considers relevant to this
   * check (e.g. the current marker's own patterns) — this engine never
   * decides relevance itself, and never inspects grainLineJson directly;
   * it only counts the presence flags it's given. An empty array means
   * "nothing relevant to check" and produces no recommendation.
   */
  pieces: ReadonlyArray<{
    patternId: string;
    hasTracedGrainLine: boolean;
  }>;
}

export interface EngineeringRecommendationsInput {
  /**
   * The selected MarkerRun's safety-gate issues (ProductionSafetyGateResult
   * .issues), when a MarkerRun with a computed safety gate is available.
   * null/undefined — never fabricated — when no MarkerRun is selected.
   */
  safetyGateIssues?: ReadonlyArray<ProductionSafetyGateIssue> | null;

  /**
   * The real marker-based consumption engine's own issues
   * (MarkerFabricConsumptionResult.issues), when a consumption analysis was
   * actually run. null/undefined when not applicable.
   */
  consumptionIssues?: ReadonlyArray<MarkerFabricConsumptionIssue> | null;

  fabricProfile: FabricProfileCompletenessInput;

  grainLineTrace?: GrainLineTraceCompletenessInput | null;
}

/* ============================================================================
 * Safety-gate adapter — lossless passthrough, no recalculation.
 *
 * ProductionSafetyGateIssue.severity already uses the exact same four
 * values ("critical" | "review" | "advisory" | "passed") as this module's
 * own vocabulary, so severity is copied verbatim, never reinterpreted.
 * blocksRelease maps 1:1 to `blocking`. code/title/message are copied as-is.
 * ========================================================================== */

function mapSafetyGateIssue(
  issue: ProductionSafetyGateIssue,
): EngineeringRecommendation {
  return {
    code: issue.code,
    severity: issue.severity,
    category: "safety",
    title: issue.title,
    message: issue.message,
    blocking: issue.blocksRelease,
    source: "safetyGate",
  };
}

/* ============================================================================
 * Consumption adapter
 *
 * MarkerFabricConsumptionIssue only ever has severity "error" | "warning" —
 * a strict binary, confirmed by inspecting markerFabricConsumptionEngine.ts
 * directly (MarkerFabricConsumptionIssueSeverity) and by its own
 * MarkerFabricConsumptionResult.valid doc comment: "False when at least one
 * 'error'-severity issue is present." An "error" therefore means the whole
 * consumption result is unusable — nothing can be reported — which is the
 * same real-world severity as the safety gate's "critical" (blocksRelease:
 * true), not the softer "review" tier (which implies a still-usable result
 * pending human judgement — the consumption engine has no such tier).
 * "warning" is always non-blocking (the result stays valid), matching
 * "advisory". There is no consumption-side equivalent of "review" or
 * "passed" — this module does not invent one.
 * ========================================================================== */

// MarkerFabricConsumptionIssue has no title field of its own (only
// code/severity/message) — this derives a purely cosmetic, human-readable
// label from its kebab-case code (e.g. "marker-length-exceeds-maximum" ->
// "Marker Length Exceeds Maximum"). This is text formatting only, never a
// judgement: the underlying code/severity/message driving the actual
// decision are preserved verbatim from the source engine.
function titleCaseFromKebabCode(code: string): string {
  return code
    .split("-")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mapConsumptionIssue(
  issue: MarkerFabricConsumptionIssue,
): EngineeringRecommendation {
  const isBlocking = issue.severity === "error";

  return {
    code: issue.code,
    severity: isBlocking ? "critical" : "advisory",
    category: "consumption",
    title: titleCaseFromKebabCode(issue.code),
    message: issue.message,
    blocking: isBlocking,
    source: "consumptionEngine",
  };
}

/* ============================================================================
 * FabricProfile completeness
 *
 * A missing FabricProfile is a hard blocker for consumption analysis today
 * — marker/page.tsx's own Stage 2D-2 gating never even attempts a
 * calculateMarkerFabricConsumption() call without one; the whole
 * consumption section renders an explanatory message instead. This
 * recommendation mirrors that reality: "critical" / blocking: true, the
 * same severity a safety-gate condition uses when it prevents an outcome
 * entirely. This is a presence check only — it says nothing about whether
 * the profile's own field values (once saved) are suitable.
 *
 * Per instruction: a *present* profile produces no "passed" counterpart —
 * only its absence is ever reported. This is a deliberate asymmetry from
 * the grain-line check below (which does emit a "passed" case), not an
 * inconsistency — there is no analogous "grain line was successfully
 * traced" moment to mirror for a profile that simply already exists.
 * ========================================================================== */

const FABRIC_PROFILE_MISSING_CODE = "fabric-profile-missing";

function buildFabricProfileCompletenessRecommendations(
  input: FabricProfileCompletenessInput,
): EngineeringRecommendation[] {
  if (!input.applicable || input.present) {
    return [];
  }

  return [
    {
      code: FABRIC_PROFILE_MISSING_CODE,
      severity: "critical",
      category: "data-completeness",
      title: "Fabric Profile Not Saved",
      message:
        "No Fabric Profile has been saved for this project. Marker-based " +
        "fabric consumption cannot be calculated until one is completed " +
        "and saved.",
      blocking: true,
      source: "dataCompleteness",
    },
  ];
}

/* ============================================================================
 * Grain-line trace completeness
 *
 * Presence-only: this never inspects grainLineJson content, never claims
 * grain-line compliance, correct angle, or rotation compliance — those
 * concepts belong entirely to the safety gate / rotation-policy pipeline,
 * which the Stage 2E audit confirmed does NOT currently read traced
 * grain-line geometry at all. This check only counts how many of the
 * caller-supplied pieces have a traced grain line on file.
 *
 * Same stable code for both outcomes (mirrors the safety gate's own
 * convention, e.g. "utilisationTarget" being reused for both its "passed"
 * and "advisory" cases) — only severity/title/message differ:
 *   - one or more pieces untraced -> "advisory", non-blocking
 *   - every relevant piece traced -> "passed"
 *   - zero relevant pieces        -> no recommendation at all (nothing to
 *     report; a fabricated "0 of 0 traced" pass would be noise, not signal)
 * ========================================================================== */

const GRAIN_LINE_TRACE_COMPLETENESS_CODE = "grain-line-trace-completeness";

function buildGrainLineTraceRecommendations(
  input: GrainLineTraceCompletenessInput | null | undefined,
): EngineeringRecommendation[] {
  const pieces = Array.isArray(input?.pieces) ? input.pieces : [];

  if (pieces.length === 0) {
    return [];
  }

  const tracedCount = pieces.filter(
    (piece) => piece && piece.hasTracedGrainLine === true,
  ).length;

  const totalCount = pieces.length;
  const untracedCount = totalCount - tracedCount;

  const evidence: Record<string, number | string> = {
    tracedPieceCount: tracedCount,
    totalPieceCount: totalCount,
  };

  if (untracedCount === 0) {
    return [
      {
        code: GRAIN_LINE_TRACE_COMPLETENESS_CODE,
        severity: "passed",
        category: "data-completeness",
        title: "Grain Line Traced",
        message: `All ${totalCount} of ${totalCount} pattern pieces have a traced grain line.`,
        blocking: false,
        source: "dataCompleteness",
        evidence,
      },
    ];
  }

  return [
    {
      code: GRAIN_LINE_TRACE_COMPLETENESS_CODE,
      severity: "advisory",
      category: "data-completeness",
      title: "Grain Line Not Fully Traced",
      message: `${untracedCount} of ${totalCount} pattern pieces do not have a traced grain line.`,
      blocking: false,
      source: "dataCompleteness",
      evidence,
    },
  ];
}

/* ============================================================================
 * Duplicate/identity policy
 *
 * Identity is (source, code) — never code alone. Two engines are free to
 * use the same literal code string (e.g. a hypothetical future
 * safety-gate/consumption code collision on "markerLength") without ever
 * being treated as the same recommendation; they are different authorities
 * making different judgements. Within a single source, an exact duplicate
 * (same source AND same code) is defensively collapsed to its first
 * occurrence — neither productionSafetyGateEngine.ts nor
 * markerFabricConsumptionEngine.ts is currently capable of emitting two
 * issues with the same code in one result (confirmed by inspection: every
 * code is emitted from at most one guarded call site), so this is a safety
 * net against a future change to either engine, not a condition that fires
 * today. It never merges distinct authoritative judgements from different
 * sources.
 * ========================================================================== */

function deduplicateWithinSource(
  recommendations: EngineeringRecommendation[],
): EngineeringRecommendation[] {
  const seen = new Set<string>();
  const result: EngineeringRecommendation[] = [];

  for (const recommendation of recommendations) {
    const identity = `${recommendation.source}:${recommendation.code}`;

    if (seen.has(identity)) {
      continue;
    }

    seen.add(identity);
    result.push(recommendation);
  }

  return result;
}

/* ============================================================================
 * Ordering policy
 *
 * Stable sort by severity rank (critical, review, advisory, passed — most
 * urgent first), then by a fixed source order (safetyGate, consumptionEngine,
 * dataCompleteness) as a tiebreaker, preserving each source's own original
 * issue order within that group. Deterministic given the same inputs.
 * ========================================================================== */

const SEVERITY_ORDER: Record<EngineeringRecommendationSeverity, number> = {
  critical: 0,
  review: 1,
  advisory: 2,
  passed: 3,
};

const SOURCE_ORDER: Record<EngineeringRecommendationSource, number> = {
  safetyGate: 0,
  consumptionEngine: 1,
  dataCompleteness: 2,
};

function orderRecommendations(
  recommendations: EngineeringRecommendation[],
): EngineeringRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const severityDelta = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (severityDelta !== 0) return severityDelta;

    return SOURCE_ORDER[a.source] - SOURCE_ORDER[b.source];
  });
}

/* ============================================================================
 * Public entry point
 * ========================================================================== */

export function buildEngineeringRecommendations(
  input: EngineeringRecommendationsInput,
): EngineeringRecommendation[] {
  const safetyGateRecommendations = Array.isArray(input.safetyGateIssues)
    ? input.safetyGateIssues.map(mapSafetyGateIssue)
    : [];

  const consumptionRecommendations = Array.isArray(input.consumptionIssues)
    ? input.consumptionIssues.map(mapConsumptionIssue)
    : [];

  const fabricProfileRecommendations = buildFabricProfileCompletenessRecommendations(
    input.fabricProfile ?? { applicable: false, present: false },
  );

  const grainLineRecommendations = buildGrainLineTraceRecommendations(
    input.grainLineTrace,
  );

  const combined = [
    ...safetyGateRecommendations,
    ...consumptionRecommendations,
    ...fabricProfileRecommendations,
    ...grainLineRecommendations,
  ];

  return orderRecommendations(deduplicateWithinSource(combined));
}
