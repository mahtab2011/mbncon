/**
 * OptiFabric AI
 * RC5-004-015 — Marker Optimisation Profile Engine (Step 3)
 *
 * Purpose:
 * - Give the Step 3 multi-strategy optimiser three named, pre-tuned
 *   search-effort bundles, instead of requiring every SafeDenseRepackingEngine
 *   knob to be set individually on every call.
 * - FAST / QUOTATION      — minimum viable search for a quick estimate.
 * - BALANCED / PRODUCTION — strong efficiency at a reasonable, predictable
 *   runtime.
 * - MAXIMUM EFFICIENCY    — deeper search for expensive or high-volume
 *   fabric, where extra computation time pays for itself.
 *
 * This file bundles options only. It contains no packing, geometry or safety
 * logic of its own — see markerOptimisationOrchestrator.ts for how these
 * bundles are actually used, and safeDenseRepackingEngine.ts /
 * holeFillingCompactionOrchestrator.ts for what each option controls.
 *
 * wallClockBudgetMs is a coarse safety valve, not a scheduler: the
 * orchestrator checks elapsed time between strategies (never mid-strategy)
 * and skips remaining strategies once a profile's budget is exceeded.
 *
 * Step 3D — strategy/budget tuning, evidence-based:
 *
 * A direct budget sweep of every strategy against both permanent benchmark
 * fixtures (see the Step 3D engineering report) found:
 * - areaDescending, widthDescending, perimeterDescending and compactHybrid
 *   reach the geometric optimum on both fixtures once given enough
 *   candidate budget (>=3000 on the 24-piece fixture; both fixtures were
 *   already optimal well below that budget on the 12-piece fixture).
 * - lengthDescending and difficultyDescending reach the same optimum, but
 *   need the ruin-and-recreate improvement pass (not more raw candidate
 *   budget) to close the last few centimetres.
 * - priorityFirst and bestFit never reached the optimum on the 24-piece
 *   fixture at any tested budget (worst observed: 367.0cm / 342.0cm vs an
 *   optimum of 311.5cm) — they are excluded from all three default
 *   profiles below. Both strategies remain fully implemented and callable
 *   in safeDenseRepackingEngine.ts (pass them explicitly via
 *   options.strategies) for future testing on different piece geometry;
 *   only the default profile bundles drop them.
 * - The old FAST bundle (2 strategies, budget 1500, no improvement rounds)
 *   under-filled the anchor search on the 24-piece fixture and landed
 *   20-25% short of optimal (390-400cm vs 311.5cm) purely from an
 *   insufficient budget, not a bad strategy choice — areaDescending and
 *   compactHybrid both reach the exact optimum once given budget 3000.
 */

import type {
  SafeDensePackingStrategy,
  SafeDenseRepackingOptions,
} from "./safeDenseRepackingEngine";

export type MarkerOptimisationProfile = "fast" | "balanced" | "maximum";

export interface MarkerOptimisationRepackingOptions
  extends Pick<
    SafeDenseRepackingOptions,
    | "maximumCandidatesPerPiece"
    | "maximumSolutions"
    | "compactionPasses"
    | "improvementRounds"
    | "improvementEjectCount"
    | "anchorResolution"
    | "contourSamplesPerPiece"
  > {}

export interface MarkerOptimisationProfileConfig {
  readonly profile: MarkerOptimisationProfile;
  readonly label: string;
  readonly description: string;

  /** Strategies run. The orchestrator runs one at a time, in this order. */
  readonly strategies: ReadonlyArray<SafeDensePackingStrategy>;

  readonly repacking: MarkerOptimisationRepackingOptions;

  /** How many top-ranked repacking solutions get a hole-filling refinement pass. */
  readonly holeFillTopSolutions: number;

  /** Coarse wall-clock ceiling for the whole strategy sweep, in milliseconds. */
  readonly wallClockBudgetMs: number;
}

const FAST: MarkerOptimisationProfileConfig = {
  profile: "fast",
  label: "FAST / QUOTATION",
  description:
    "Minimum viable search for a quick utilisation estimate, tuned to actually reach the geometric optimum on typical piece counts rather than merely running quickly. Two consistently-best strategies, a candidate budget sized from measured evidence, no hole-filling refinement.",
  strategies: ["areaDescending", "compactHybrid"],
  repacking: {
    maximumCandidatesPerPiece: 3000,
    maximumSolutions: 2,
    compactionPasses: 1,
    improvementRounds: 0,
    improvementEjectCount: 3,
    anchorResolution: 0.5,
    contourSamplesPerPiece: 18,
  },
  holeFillTopSolutions: 0,
  wallClockBudgetMs: 2000,
};

const BALANCED: MarkerOptimisationProfileConfig = {
  profile: "balanced",
  label: "BALANCED / PRODUCTION",
  description:
    "Strong efficiency at a reasonable, predictable runtime — runs every strategy proven to reach (or, with its improvement pass, reach) the geometric optimum on the benchmark fixtures.",
  strategies: [
    "areaDescending",
    "lengthDescending",
    "widthDescending",
    "perimeterDescending",
    "compactHybrid",
    "difficultyDescending",
  ],
  repacking: {
    maximumCandidatesPerPiece: 4000,
    maximumSolutions: 6,
    compactionPasses: 3,
    improvementRounds: 2,
    improvementEjectCount: 3,
    anchorResolution: 0.5,
    contourSamplesPerPiece: 18,
  },
  holeFillTopSolutions: 1,
  wallClockBudgetMs: 6000,
};

const MAXIMUM: MarkerOptimisationProfileConfig = {
  profile: "maximum",
  label: "MAXIMUM EFFICIENCY",
  description:
    "Deeper search — higher candidate budget, more compaction and improvement rounds, more hole-filling — across the same evidence-backed strategy set as BALANCED. priorityFirst and bestFit are deliberately excluded by default: neither reached the optimum on the benchmark fixtures at any tested budget, so extra search time is spent where it has shown a return. For expensive or high-volume fabric where extra computation time is worth it.",
  strategies: [
    "areaDescending",
    "lengthDescending",
    "widthDescending",
    "perimeterDescending",
    "compactHybrid",
    "difficultyDescending",
  ],
  repacking: {
    maximumCandidatesPerPiece: 8000,
    maximumSolutions: 10,
    compactionPasses: 6,
    improvementRounds: 6,
    improvementEjectCount: 4,
    anchorResolution: 0.5,
    contourSamplesPerPiece: 18,
  },
  holeFillTopSolutions: 3,
  wallClockBudgetMs: 15000,
};

const PROFILES: Record<MarkerOptimisationProfile, MarkerOptimisationProfileConfig> =
  {
    fast: FAST,
    balanced: BALANCED,
    maximum: MAXIMUM,
  };

export function resolveMarkerOptimisationProfile(
  profile: MarkerOptimisationProfile | undefined
): MarkerOptimisationProfileConfig {
  return PROFILES[profile ?? "balanced"];
}

export function listMarkerOptimisationProfiles(): ReadonlyArray<MarkerOptimisationProfileConfig> {
  return [FAST, BALANCED, MAXIMUM];
}
