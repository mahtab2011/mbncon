/**
 * OptiFabric AI
 * RC5-004-013 — Canonical Marker Scoring Engine
 *
 * SINGLE SOURCE OF TRUTH for MARKER-LAYOUT QUALITY scoring.
 *
 * Background:
 * The live marker pipeline previously computed "Engineering Score" through
 * at least five incompatible formulas depending on which candidate kind was
 * being displayed (original marker, hole-filled marker, compacted marker,
 * combined solution, and the garments-per-marker comparison table). Some of
 * those formulas normalised against sibling candidates (min/max across
 * whatever else happened to be in the batch), which means the same physical
 * marker could score differently purely because of what else was on screen.
 * This engine replaces that surface with one canonical, absolute formula.
 *
 * ARCHITECTURE — two stages, kept strictly separate:
 *
 * STAGE 1 — PRODUCTION SAFETY STATUS (hard gate)
 *   Not redefined here. `evaluateProductionSafetyGate` /
 *   `rankProductionSafetyGateSolutions` in
 *   `lib/optifabric/markerOptimization/productionSafetyGateEngine.ts`
 *   already implement this correctly: a marker that fails collision,
 *   boundary, cutting-gap or completeness checks can never outrank a safe
 *   marker on utilisation alone, and the interface already has optional
 *   slots for grain line, rotation and fabric-direction gates so those can
 *   be wired in later without another architecture change. This module
 *   re-exports it under a clearer name so callers reach both stages from
 *   one place.
 *
 * STAGE 2 — CANONICAL MARKER QUALITY SCORE (this file)
 *   `computeCanonicalMarkerQualityScore` below. It is:
 *   - ABSOLUTE: a function of one candidate's own measurements only. It
 *     never receives sibling candidates and cannot normalise against them.
 *   - REPRODUCIBLE: identical input always produces identical output.
 *   - HONEST ABOUT WHAT IT KNOWS: Marker Length only contributes a score
 *     when a genuine physical reference (the theoretical minimum Marker
 *     Length for this exact piece set and fabric width) is supplied.
 *     Nothing currently in the live pipeline threads that reference through
 *     to every candidate kind, so in practice this resolves to a
 *     utilisation-only score today. That is the honest state of the data,
 *     not a placeholder to be dressed up — see PROVISIONAL_WEIGHTS below.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * - It does not compute fragmentation / void-distribution scoring. No
 *   candidate representation in the live pipeline currently carries
 *   reliable per-void data all the way to this call site, and inventing a
 *   number here would be exactly the "fake precision" this step forbids.
 *   The interface leaves room for it (see FUTURE EXTENSION POINTS) once
 *   that data exists.
 * - It does not fold in compute time / candidate-test counts. Those remain
 *   reported separately by each algorithm (candidateTests,
 *   rejectedCandidateTests, passes, etc. on the existing engines) and must
 *   stay out of the quality score.
 * - It does not replace any algorithm-specific search/optimisation score.
 *   `intelligentMarkerCompactionEngine.ts` (movement-efficiency-aware),
 *   `safeEfficiencyRecoveryEngine.ts` (recovery-movement-aware),
 *   `holeFillingCompactionOrchestrator.ts` (hole-filling/compatibility
 *   blend) and `safeDenseRepackingEngine.ts` (its own absolute score) keep
 *   their own internal scores exactly as before — those measure "how well
 *   did this specific search algorithm do", not "how good is this marker",
 *   and conflating the two was part of the original problem. Callers that
 *   want ONE consistent "Engineering Score" across candidate kinds should
 *   use this engine's output for that purpose instead of reading those
 *   internal fields interchangeably.
 *
 * COMPATIBILITY BRIDGE
 * `ProductionSafetyGateInput.engineeringScore` / `ProductionSafetyGateResult
 * .engineeringScore` are pre-existing fields on the Stage 1 gate. They are
 * NOT renamed here (many live call sites already depend on that name/shape).
 * Callers should now populate that field from
 * `computeCanonicalMarkerQualityScore(...).overallScore` instead of an ad hoc
 * per-call-site formula. `scoreMarkerCandidate` below does exactly that.
 */

import {
  evaluateProductionSafetyGate,
  rankProductionSafetyGateSolutions,
  type ProductionSafetyGateInput,
  type ProductionSafetyGateOptions,
  type ProductionSafetyGateResult,
} from "../markerOptimization/productionSafetyGateEngine";

/* ============================================================================
 * Stage 1 re-export — production safety status
 *
 * Kept as a thin re-export so both stages of the canonical architecture are
 * reachable from one module, without duplicating the gate logic.
 * ========================================================================== */

export {
  evaluateProductionSafetyGate as evaluateMarkerProductionSafetyStatus,
  rankProductionSafetyGateSolutions as rankMarkerProductionSafetyStatuses,
};

export type {
  ProductionSafetyGateInput as MarkerProductionSafetyStatusInput,
  ProductionSafetyGateResult as MarkerProductionSafetyStatusResult,
};

/* ============================================================================
 * Stage 2 — canonical marker quality score
 * ========================================================================== */

export interface MarkerQualityScoreInput {
  /**
   * Fabric utilisation for this candidate, 0-100. Always required: it is
   * the only signal every live candidate representation can supply today.
   */
  readonly utilisationPercent: number;

  /**
   * This candidate's Marker Length. Optional — only used together with
   * theoreticalMinimumMarkerLengthCm to derive a length-efficiency signal.
   */
  readonly markerLengthCm?: number | null;

  /**
   * The shortest Marker Length physically possible for this exact piece set
   * at this fabric width (true polygon area / usable width). Supplying this
   * turns on the length-efficiency term. Omit it rather than guess — a
   * missing reference falls back to a utilisation-only score instead of an
   * invented one.
   */
  readonly theoreticalMinimumMarkerLengthCm?: number | null;

  /**
   * FUTURE EXTENSION POINT — not implemented in Step 1. Reserved so a later
   * step can wire in real void/fragmentation data without another interface
   * change. Any value supplied today is ignored on purpose.
   */
  readonly fragmentationScore?: number | null;

  /**
   * Overrides for the provisional weights below. Documented as provisional
   * pending benchmark calibration — see PROVISIONAL_WEIGHTS.
   */
  readonly weights?: Partial<MarkerQualityScoreWeights>;
}

export interface MarkerQualityScoreWeights {
  readonly utilisation: number;
  readonly lengthEfficiency: number;
}

export interface MarkerQualityScoreBreakdown {
  /** Utilisation taken directly — utilisation is already an absolute 0-100 measure. */
  readonly utilisationScore: number;

  /**
   * theoreticalMinimumMarkerLengthCm / markerLengthCm, clamped to 0-100.
   * `null` when no theoretical minimum was supplied — the term is then
   * excluded rather than approximated.
   */
  readonly lengthEfficiencyScore: number | null;

  /** The canonical, absolute, reproducible marker quality score, 0-100. */
  readonly overallScore: number;

  /** The weights actually applied after redistribution for missing terms. */
  readonly weightsUsed: MarkerQualityScoreWeights;

  /**
   * Always true today. Initial weights are conservative defaults, not
   * empirically calibrated — see PROVISIONAL_WEIGHTS.
   */
  readonly provisional: true;
}

/**
 * PROVISIONAL — pending benchmark calibration.
 *
 * Utilisation dominates because it is the one measurement every candidate
 * reliably supplies and it is already a true physical ratio (real pattern
 * area over real marker area), not a proxy. Length efficiency is the
 * secondary term for the cases where a genuine theoretical-minimum
 * reference is available. These weights are a conservative starting point,
 * not a tuned result — do not read precision into the specific numbers.
 */
const PROVISIONAL_WEIGHTS: MarkerQualityScoreWeights = {
  utilisation: 0.7,
  lengthEfficiency: 0.3,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function finiteOrNull(value: number | null | undefined): number | null {
  return value !== null && value !== undefined && Number.isFinite(value)
    ? value
    : null;
}

/**
 * Computes the canonical marker quality score for exactly one candidate.
 *
 * ABSOLUTE by construction: the signature accepts a single candidate's own
 * measurements and nothing else, so there is no sibling data available to
 * normalise against, even by accident.
 */
export function computeCanonicalMarkerQualityScore(
  input: MarkerQualityScoreInput
): MarkerQualityScoreBreakdown {
  const utilisationPercent = clamp(
    finiteOrNull(input.utilisationPercent) ?? 0,
    0,
    100
  );

  const utilisationScore = utilisationPercent;

  const markerLengthCm = finiteOrNull(input.markerLengthCm ?? null);

  const theoreticalMinimumMarkerLengthCm = finiteOrNull(
    input.theoreticalMinimumMarkerLengthCm ?? null
  );

  const lengthEfficiencyScore =
    markerLengthCm !== null &&
    markerLengthCm > 0 &&
    theoreticalMinimumMarkerLengthCm !== null &&
    theoreticalMinimumMarkerLengthCm > 0
      ? clamp(
          (theoreticalMinimumMarkerLengthCm / markerLengthCm) * 100,
          0,
          100
        )
      : null;

  const requestedWeights: MarkerQualityScoreWeights = {
    utilisation: Math.max(
      0,
      input.weights?.utilisation ?? PROVISIONAL_WEIGHTS.utilisation
    ),
    lengthEfficiency: Math.max(
      0,
      input.weights?.lengthEfficiency ?? PROVISIONAL_WEIGHTS.lengthEfficiency
    ),
  };

  /**
   * Honest redistribution: when length efficiency is unavailable, utilisation
   * carries the full weight rather than silently scoring the missing term as
   * zero (which would penalise a marker for data it never had a chance to
   * supply).
   */
  const weightsUsed: MarkerQualityScoreWeights =
    lengthEfficiencyScore === null
      ? { utilisation: 1, lengthEfficiency: 0 }
      : normaliseWeights(requestedWeights);

  const overallScore = clamp(
    utilisationScore * weightsUsed.utilisation +
      (lengthEfficiencyScore ?? 0) * weightsUsed.lengthEfficiency,
    0,
    100
  );

  return {
    utilisationScore,
    lengthEfficiencyScore,
    overallScore,
    weightsUsed,
    provisional: true,
  };
}

function normaliseWeights(
  weights: MarkerQualityScoreWeights
): MarkerQualityScoreWeights {
  const total = weights.utilisation + weights.lengthEfficiency;

  if (total <= 0) {
    return PROVISIONAL_WEIGHTS;
  }

  return {
    utilisation: weights.utilisation / total,
    lengthEfficiency: weights.lengthEfficiency / total,
  };
}

/* ============================================================================
 * Composition helper — both stages for one candidate
 * ========================================================================== */

export interface MarkerScoringInput {
  readonly quality: MarkerQualityScoreInput;

  /**
   * Everything Stage 1 needs, EXCEPT engineeringScore — that field is
   * supplied automatically from the Stage 2 result below so the two stages
   * cannot drift out of sync at a call site.
   */
  readonly safety: Omit<ProductionSafetyGateInput, "engineeringScore">;

  readonly safetyOptions?: ProductionSafetyGateOptions;
}

export interface MarkerScoringResult {
  readonly quality: MarkerQualityScoreBreakdown;
  readonly safety: ProductionSafetyGateResult;
}

/**
 * Scores one marker candidate through both stages: the canonical Stage 2
 * quality score, then the Stage 1 hard gate using that score as its
 * `engineeringScore` input. This is the single entry point new call sites
 * should use; existing call sites are migrated incrementally.
 */
export function scoreMarkerCandidate(
  input: MarkerScoringInput
): MarkerScoringResult {
  const quality = computeCanonicalMarkerQualityScore(input.quality);

  const safety = evaluateProductionSafetyGate(
    {
      ...input.safety,
      engineeringScore: quality.overallScore,
    },
    input.safetyOptions
  );

  return { quality, safety };
}
