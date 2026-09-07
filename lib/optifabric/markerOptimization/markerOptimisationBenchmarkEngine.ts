/**
 * OptiFabric AI
 * RC5-004-017 — Marker Optimisation Benchmark Engine (Step 3)
 *
 * Purpose:
 * - Run the "old engine" (createDeterministicNestedMarker, single-pass
 *   bottom-left-fill) against the new Step 3 multi-strategy optimiser
 *   (markerOptimisationOrchestrator.ts), on identical fixed pattern sets,
 *   under all three operating profiles.
 * - Report exactly: marker utilisation, marker length, waste %, number of
 *   placements, collision count, rotation violations, grain violations, nap
 *   violations, runtime, and improvement over baseline.
 * - Assert — not just report — that rotation/grain/nap violations are zero
 *   and collisions are zero for whichever candidate each engine actually
 *   returns as its best, so a regression fails loudly rather than merely
 *   showing a non-zero number in a table.
 *
 * This file defines fixed synthetic fixtures (rectangles plus one concave
 * "notched" shape, deliberately not claimed to be real garment patterns —
 * this is a geometry stress-test set, following the same fixed-dataset
 * convention as holeFillingCompactionValidation.ts) and contains no packing
 * or safety logic of its own: it only calls
 * runMarkerOptimisationBaselineOnly / runMarkerOptimisation and audits their
 * own already-independent safety numbers.
 */

import type { PolygonPoint } from "@/lib/optifabric/marker/markerPolygonCollisionEngine";

import {
  runMarkerOptimisation,
  runMarkerOptimisationBaselineOnly,
  type MarkerOptimisationCandidateMetrics,
  type MarkerOptimisationInput,
  type MarkerOptimisationSourcePiece,
} from "./markerOptimisationOrchestrator";

import {
  listMarkerOptimisationProfiles,
  type MarkerOptimisationProfile,
} from "./markerOptimisationProfileEngine";

import { REAL_PATTERN_BENCHMARK_FIXTURES } from "./markerOptimisationRealPatternFixtures";

/* ============================================================================
 * Fixtures
 * ========================================================================== */

function rectangle(width: number, height: number): PolygonPoint[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
}

/** A concave "L" test shape — exercises contour-anchor placement and difficulty scoring. */
function notchedPanel(width: number, height: number, notch: number): PolygonPoint[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height - notch },
    { x: width - notch, y: height - notch },
    { x: width - notch, y: height },
    { x: 0, y: height },
  ];
}

function instance(
  baseId: string,
  count: number,
  build: (index: number) => Omit<MarkerOptimisationSourcePiece, "id">
): MarkerOptimisationSourcePiece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${baseId}-${index + 1}`,
    ...build(index),
  }));
}

export interface MarkerOptimisationBenchmarkFixture {
  readonly name: string;
  readonly description: string;
  readonly fabricWidth: number;
  readonly cuttingGap?: number;
  readonly pieces: ReadonlyArray<MarkerOptimisationSourcePiece>;
}

/**
 * Twelve instances: grain-controlled body/sleeve rectangles (0°/180° only),
 * directional-fabric notched panels (0°/90°/270° only), free-rotation small
 * pieces, and one high-priority pocket — enough variety to exercise every
 * strategy, both new packing strategies, and every rotation-policy branch.
 */
const MIXED_GARMENT_SET: MarkerOptimisationBenchmarkFixture = {
  name: "mixed-garment-set-12",
  description:
    "12 synthetic pieces: 2 grain-controlled body panels, 2 grain-controlled sleeves, 2 directional-fabric notched panels, 4 free-rotation cuffs, 1 free-rotation pocket, plus 1 large grain-controlled panel to stress marker length.",
  fabricWidth: 150,
  cuttingGap: 0.5,
  pieces: [
    ...instance("body", 2, () => ({
      polygon: rectangle(60, 80),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    })),
    {
      id: "body-large-1",
      polygon: rectangle(70, 95),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 65,
      category: "body",
    },
    ...instance("sleeve", 2, () => ({
      polygon: rectangle(25, 55),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "sleeve",
    })),
    ...instance("notched-panel", 2, () => ({
      polygon: notchedPanel(30, 30, 15),
      geometricRotationRule: "rotate-90",
      directionalFabric: true,
      priority: 50,
      category: "panel",
    })),
    ...instance("cuff", 4, () => ({
      polygon: rectangle(12, 8),
      geometricRotationRule: "free",
      priority: 40,
      category: "cuff",
    })),
    {
      id: "pocket-1",
      polygon: rectangle(10, 10),
      geometricRotationRule: "free",
      priority: 80,
      category: "pocket",
    },
  ],
};

/**
 * Larger, denser variant of the same piece vocabulary (24 instances instead
 * of 12) — enough piece-count pressure to let ordering actually matter and
 * to give hole-filling real rejected pieces to work with, unlike the small
 * fixture above where every strategy converges on the same layout.
 */
const DENSE_GARMENT_SET: MarkerOptimisationBenchmarkFixture = {
  name: "dense-garment-set-24",
  description:
    "24 synthetic pieces (double the mixed set): 4 grain-controlled body panels, 2 large body panels, 4 grain-controlled sleeves, 4 directional-fabric notched panels, 8 free-rotation cuffs, 2 free-rotation pockets — enough piece-count pressure for strategy ordering to matter.",
  fabricWidth: 150,
  cuttingGap: 0.5,
  pieces: [
    ...instance("dg-body", 4, () => ({
      polygon: rectangle(60, 80),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    })),
    ...instance("dg-body-large", 2, () => ({
      polygon: rectangle(70, 95),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 65,
      category: "body",
    })),
    ...instance("dg-sleeve", 4, () => ({
      polygon: rectangle(25, 55),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "sleeve",
    })),
    ...instance("dg-notched-panel", 4, () => ({
      polygon: notchedPanel(30, 30, 15),
      geometricRotationRule: "rotate-90",
      directionalFabric: true,
      priority: 50,
      category: "panel",
    })),
    ...instance("dg-cuff", 8, () => ({
      polygon: rectangle(12, 8),
      geometricRotationRule: "free",
      priority: 40,
      category: "cuff",
    })),
    ...instance("dg-pocket", 2, () => ({
      polygon: rectangle(10, 10),
      geometricRotationRule: "free",
      priority: 80,
      category: "pocket",
    })),
  ],
};

export const MARKER_OPTIMISATION_BENCHMARK_FIXTURES: ReadonlyArray<MarkerOptimisationBenchmarkFixture> =
  [MIXED_GARMENT_SET, DENSE_GARMENT_SET, ...REAL_PATTERN_BENCHMARK_FIXTURES];

/* ============================================================================
 * Result types
 * ========================================================================== */

export interface MarkerOptimisationBenchmarkMetrics {
  readonly utilisationPercent: number;
  readonly markerLengthCm: number;
  readonly wastePercent: number;
  readonly placedPieceCount: number;
  readonly expectedPieceCount: number;
  readonly collisionCount: number;
  readonly rotationViolationCount: number;
  readonly grainViolationCount: number;
  readonly napViolationCount: number;
  readonly runtimeMs: number;
  readonly productionReleased: boolean;
}

export interface MarkerOptimisationBenchmarkProfileResult {
  readonly profile: MarkerOptimisationProfile;
  readonly label: string;
  readonly metrics: MarkerOptimisationBenchmarkMetrics;
  readonly bestCandidateSource: string;
  readonly bestCandidateLabel: string;
  readonly strategiesRun: ReadonlyArray<string>;
  readonly strategiesSkippedByBudget: ReadonlyArray<string>;
  readonly candidateCount: number;
  readonly utilisationImprovementPercentagePoints: number;
  readonly markerLengthReductionPercent: number;
}

export interface MarkerOptimisationBenchmarkResult {
  readonly fixtureName: string;
  readonly fixtureDescription: string;
  readonly expectedPieceCount: number;
  readonly baseline: MarkerOptimisationBenchmarkMetrics;
  readonly profiles: ReadonlyArray<MarkerOptimisationBenchmarkProfileResult>;
  readonly safetyChecksPassed: boolean;
  readonly warnings: ReadonlyArray<string>;
}

function toMetrics(
  candidate: MarkerOptimisationCandidateMetrics,
  runtimeMs: number
): MarkerOptimisationBenchmarkMetrics {
  return {
    utilisationPercent: candidate.utilisationPercent,
    markerLengthCm: candidate.markerLengthCm,
    wastePercent: candidate.wastePercent,
    placedPieceCount: candidate.placedPieceCount,
    expectedPieceCount: candidate.expectedPieceCount,
    collisionCount: candidate.collisionCount,
    rotationViolationCount: candidate.rotationViolationCount,
    grainViolationCount: candidate.grainViolationCount,
    napViolationCount: candidate.napViolationCount,
    runtimeMs,
    productionReleased: candidate.safetyGate.productionReleased,
  };
}

function toInput(fixture: MarkerOptimisationBenchmarkFixture): MarkerOptimisationInput {
  return {
    markerId: fixture.name,
    fabricWidth: fixture.fabricWidth,
    pieces: fixture.pieces,
    cuttingGap: fixture.cuttingGap,
  };
}

/**
 * Runs one fixture through the old engine and all three Step 3 profiles,
 * and hard-asserts (via warnings, surfaced to the caller/UI — this file
 * never throws) that whichever candidate each run actually returns as best
 * has zero collisions and zero rotation/grain/nap violations.
 */
export function runMarkerOptimisationBenchmark(
  fixture: MarkerOptimisationBenchmarkFixture
): MarkerOptimisationBenchmarkResult {
  const input = toInput(fixture);
  const warnings: string[] = [];

  const baselineRun = runMarkerOptimisationBaselineOnly(input);
  const baseline = toMetrics(baselineRun.candidate, baselineRun.runtimeMs);

  assertSafe(baseline, "baseline", warnings);

  const profiles = listMarkerOptimisationProfiles().map((config) => {
    const result = runMarkerOptimisation(input, config.profile);
    const chosen = result.bestCandidate ?? result.candidates[0] ?? null;

    if (!chosen) {
      warnings.push(
        `${config.label}: produced no candidates at all for fixture "${fixture.name}".`
      );

      const empty: MarkerOptimisationBenchmarkMetrics = {
        utilisationPercent: 0,
        markerLengthCm: 0,
        wastePercent: 100,
        placedPieceCount: 0,
        expectedPieceCount: fixture.pieces.length,
        collisionCount: 0,
        rotationViolationCount: 0,
        grainViolationCount: 0,
        napViolationCount: 0,
        runtimeMs: result.runtimeMs,
        productionReleased: false,
      };

      return {
        profile: config.profile,
        label: config.label,
        metrics: empty,
        bestCandidateSource: "none",
        bestCandidateLabel: "No candidate produced",
        strategiesRun: result.strategiesRun,
        strategiesSkippedByBudget: result.strategiesSkippedByBudget,
        candidateCount: result.candidates.length,
        utilisationImprovementPercentagePoints: 0,
        markerLengthReductionPercent: 0,
      };
    }

    if (!result.bestCandidate) {
      warnings.push(
        `${config.label}: no candidate reached Production Released on fixture "${fixture.name}" — reporting the highest-ranked candidate instead (${chosen.safetyGate.decisionLabel}).`
      );
    }

    const metrics = toMetrics(chosen, result.runtimeMs);
    assertSafe(metrics, config.label, warnings);

    return {
      profile: config.profile,
      label: config.label,
      metrics,
      bestCandidateSource: chosen.source,
      bestCandidateLabel: chosen.label,
      strategiesRun: result.strategiesRun,
      strategiesSkippedByBudget: result.strategiesSkippedByBudget,
      candidateCount: result.candidates.length,
      utilisationImprovementPercentagePoints:
        metrics.utilisationPercent - baseline.utilisationPercent,
      markerLengthReductionPercent:
        baseline.markerLengthCm > 0
          ? ((baseline.markerLengthCm - metrics.markerLengthCm) /
              baseline.markerLengthCm) *
            100
          : 0,
    };
  });

  return {
    fixtureName: fixture.name,
    fixtureDescription: fixture.description,
    expectedPieceCount: fixture.pieces.length,
    baseline,
    profiles,
    safetyChecksPassed: warnings.every((warning) => !warning.includes("VIOLATION")),
    warnings,
  };
}

function assertSafe(
  metrics: MarkerOptimisationBenchmarkMetrics,
  label: string,
  warnings: string[]
): void {
  if (metrics.collisionCount !== 0) {
    warnings.push(
      `SAFETY VIOLATION: ${label} best candidate reports ${metrics.collisionCount} collision(s).`
    );
  }

  if (metrics.rotationViolationCount !== 0) {
    warnings.push(
      `SAFETY VIOLATION: ${label} best candidate reports ${metrics.rotationViolationCount} rotation violation(s).`
    );
  }

  if (metrics.grainViolationCount !== 0) {
    warnings.push(
      `SAFETY VIOLATION: ${label} best candidate reports ${metrics.grainViolationCount} grain violation(s).`
    );
  }

  if (metrics.napViolationCount !== 0) {
    warnings.push(
      `SAFETY VIOLATION: ${label} best candidate reports ${metrics.napViolationCount} nap violation(s).`
    );
  }
}

export function runAllMarkerOptimisationBenchmarks(): ReadonlyArray<MarkerOptimisationBenchmarkResult> {
  return MARKER_OPTIMISATION_BENCHMARK_FIXTURES.map(runMarkerOptimisationBenchmark);
}
