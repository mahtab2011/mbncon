/**
 * Stage 2E-1 — focused unit tests for engineeringRecommendationsEngine.ts.
 *
 * Same convention as lib/optifabric/markerFabricConsumptionEngine.test.ts
 * (Stage 2D-1): no test framework is configured anywhere in this frontend
 * project, so this is a small, dependency-free, self-executing check —
 * plain assertions against the real exported engine. Run with the same
 * transpile-and-execute technique used for that file, e.g.:
 *
 *   npx tsc --outDir <tmp> lib/optifabric/engineeringRecommendationsEngine.ts lib/optifabric/engineeringRecommendationsEngine.test.ts --module commonjs --target es2019
 *   node <tmp>/lib/optifabric/engineeringRecommendationsEngine.test.js
 *
 * No marker optimisation is invoked anywhere below — every fixture is a
 * hand-built plain object matching the real ProductionSafetyGateIssue /
 * MarkerFabricConsumptionIssue shapes.
 */
import {
  buildEngineeringRecommendations,
  type EngineeringRecommendation,
  type EngineeringRecommendationsInput,
} from "./engineeringRecommendationsEngine";

import type { ProductionSafetyGateIssue } from "./markerOptimization/productionSafetyGateEngine";
import type { MarkerFabricConsumptionIssue } from "./markerFabricConsumptionEngine";

let failures = 0;

function check(label: string, condition: boolean): void {
  if (condition) {
    console.log(`PASS: ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL: ${label}`);
  }
}

function assertEqual(label: string, actual: unknown, expected: unknown): void {
  check(`${label} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`, actual === expected);
}

function findByCodeAndSource(
  recommendations: EngineeringRecommendation[],
  source: EngineeringRecommendation["source"],
  code: string,
): EngineeringRecommendation | undefined {
  return recommendations.find((r) => r.source === source && r.code === code);
}

function baseInput(): EngineeringRecommendationsInput {
  return {
    safetyGateIssues: null,
    consumptionIssues: null,
    fabricProfile: { applicable: false, present: false },
    grainLineTrace: null,
  };
}

// -- A/B/C: Safety Gate issue maps faithfully -----------------------------------------------
{
  const safetyIssue: ProductionSafetyGateIssue = {
    code: "cuttingGap",
    severity: "critical",
    title: "Cutting Gap Violation",
    message: "Minimum cutting gap was not maintained between two pieces.",
    blocksRelease: true,
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [safetyIssue],
  });

  const mapped = findByCodeAndSource(result, "safetyGate", "cuttingGap");

  check("A: safety-gate code preserved", mapped?.code === "cuttingGap");
  check("A: safety-gate title preserved", mapped?.title === "Cutting Gap Violation");
  check(
    "A: safety-gate message preserved",
    mapped?.message === "Minimum cutting gap was not maintained between two pieces.",
  );
  check("B: blocksRelease=true maps to blocking=true", mapped?.blocking === true);
  assertEqual("A: category is 'safety'", mapped?.category, "safety");
  assertEqual("A: source is 'safetyGate'", mapped?.source, "safetyGate");
}

{
  const nonBlockingSafetyIssue: ProductionSafetyGateIssue = {
    code: "utilisationTarget",
    severity: "advisory",
    title: "Low Marker Utilisation",
    message: "Marker Utilisation is 62%.",
    blocksRelease: false,
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [nonBlockingSafetyIssue],
  });
  const mapped = findByCodeAndSource(result, "safetyGate", "utilisationTarget");

  check("B: blocksRelease=false maps to blocking=false", mapped?.blocking === false);
}

// -- C: every safety-gate severity passes through unchanged ----------------------------------
{
  const severities: ProductionSafetyGateIssue["severity"][] = ["critical", "review", "advisory", "passed"];

  for (const severity of severities) {
    const issue: ProductionSafetyGateIssue = {
      code: "general",
      severity,
      title: "Generic",
      message: "Generic message.",
      blocksRelease: severity === "critical",
    };
    const result = buildEngineeringRecommendations({ ...baseInput(), safetyGateIssues: [issue] });
    const mapped = findByCodeAndSource(result, "safetyGate", "general");
    check(`C: severity '${severity}' preserved verbatim`, mapped?.severity === severity);
  }
}

// -- D: consumption "error" (blocking) maps correctly -----------------------------------------
{
  const consumptionError: MarkerFabricConsumptionIssue = {
    code: "marker-length-invalid",
    severity: "error",
    message: "markerLengthCm must be a finite number greater than 0.",
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    consumptionIssues: [consumptionError],
  });
  const mapped = findByCodeAndSource(result, "consumptionEngine", "marker-length-invalid");

  check("D: consumption error -> severity 'critical'", mapped?.severity === "critical");
  check("D: consumption error -> blocking true", mapped?.blocking === true);
  assertEqual("D: category is 'consumption'", mapped?.category, "consumption");
  assertEqual("D: source is 'consumptionEngine'", mapped?.source, "consumptionEngine");
}

// -- E: consumption "warning" maps correctly ----------------------------------------------------
{
  const consumptionWarning: MarkerFabricConsumptionIssue = {
    code: "roll-shorter-than-marker",
    severity: "warning",
    message: "The usable roll length is shorter than one marker — zero markers fit per roll.",
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    consumptionIssues: [consumptionWarning],
  });
  const mapped = findByCodeAndSource(result, "consumptionEngine", "roll-shorter-than-marker");

  check("E: consumption warning -> severity 'advisory'", mapped?.severity === "advisory");
  check("E: consumption warning -> blocking false", mapped?.blocking === false);
}

// -- F: consumption message/code preserved, title derived cosmetically only --------------------
{
  const issue: MarkerFabricConsumptionIssue = {
    code: "fabric-width-mismatch",
    severity: "warning",
    message: "The selected marker was generated at 145 cm fabric width, which differs from the current usable fabric width (150 cm).",
  };
  const result = buildEngineeringRecommendations({ ...baseInput(), consumptionIssues: [issue] });
  const mapped = findByCodeAndSource(result, "consumptionEngine", "fabric-width-mismatch");

  check("F: code preserved exactly", mapped?.code === "fabric-width-mismatch");
  check(
    "F: message preserved exactly",
    mapped?.message ===
      "The selected marker was generated at 145 cm fabric width, which differs from the current usable fabric width (150 cm).",
  );
  check("F: title is a readable, non-empty cosmetic label", mapped?.title === "Fabric Width Mismatch");
}

// -- G: missing FabricProfile, applicable -> completeness recommendation -----------------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    fabricProfile: { applicable: true, present: false },
  });
  const mapped = findByCodeAndSource(result, "dataCompleteness", "fabric-profile-missing");

  check("G: missing+applicable FabricProfile produces a recommendation", Boolean(mapped));
  check("G: it is severity 'critical'", mapped?.severity === "critical");
  check("G: it is blocking", mapped?.blocking === true);
  assertEqual("G: category is 'data-completeness'", mapped?.category, "data-completeness");
}

// -- G (continued): missing FabricProfile, NOT applicable -> no recommendation -----------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    fabricProfile: { applicable: false, present: false },
  });
  check(
    "G: missing FabricProfile is silent when not applicable (e.g. legacy local-only project)",
    !findByCodeAndSource(result, "dataCompleteness", "fabric-profile-missing"),
  );
}

// -- H: present FabricProfile suppresses the missing-data issue --------------------------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    fabricProfile: { applicable: true, present: true },
  });
  check(
    "H: present FabricProfile suppresses the missing-data recommendation entirely",
    !findByCodeAndSource(result, "dataCompleteness", "fabric-profile-missing"),
  );
  check("H: no other data-completeness noise is emitted for a present profile", !result.some((r) => r.category === "data-completeness"));
}

// -- I: 0 of M grain lines traced ----------------------------------------------------------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    grainLineTrace: {
      pieces: [
        { patternId: "front-body", hasTracedGrainLine: false },
        { patternId: "back-body", hasTracedGrainLine: false },
        { patternId: "sleeve", hasTracedGrainLine: false },
      ],
    },
  });
  const mapped = findByCodeAndSource(result, "dataCompleteness", "grain-line-trace-completeness");

  check("I: 0 of 3 traced -> recommendation present", Boolean(mapped));
  check("I: severity 'advisory'", mapped?.severity === "advisory");
  check("I: not blocking", mapped?.blocking === false);
  check("I: message states '3 of 3'", mapped?.message === "3 of 3 pattern pieces do not have a traced grain line.");
  assertEqual("I: evidence tracedPieceCount", mapped?.evidence?.tracedPieceCount, 0);
  assertEqual("I: evidence totalPieceCount", mapped?.evidence?.totalPieceCount, 3);
}

// -- J: some of M traced --------------------------------------------------------------------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    grainLineTrace: {
      pieces: [
        { patternId: "front-body", hasTracedGrainLine: true },
        { patternId: "back-body", hasTracedGrainLine: false },
        { patternId: "sleeve", hasTracedGrainLine: true },
        { patternId: "collar", hasTracedGrainLine: false },
      ],
    },
  });
  const mapped = findByCodeAndSource(result, "dataCompleteness", "grain-line-trace-completeness");

  check("J: partial trace -> advisory, non-blocking", mapped?.severity === "advisory" && mapped?.blocking === false);
  check("J: message states '2 of 4'", mapped?.message === "2 of 4 pattern pieces do not have a traced grain line.");
}

// -- K: all of M traced -> 'passed', same stable code --------------------------------------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    grainLineTrace: {
      pieces: [
        { patternId: "front-body", hasTracedGrainLine: true },
        { patternId: "back-body", hasTracedGrainLine: true },
      ],
    },
  });
  const mapped = findByCodeAndSource(result, "dataCompleteness", "grain-line-trace-completeness");

  check("K: all traced -> a recommendation IS still emitted (passed convention)", Boolean(mapped));
  check("K: severity 'passed'", mapped?.severity === "passed");
  check("K: not blocking", mapped?.blocking === false);
  check("K: same code as the advisory case (I/J)", mapped?.code === "grain-line-trace-completeness");
}

// -- L: zero relevant pieces handled safely (no fabricated recommendation) ----------------------
{
  const result = buildEngineeringRecommendations({
    ...baseInput(),
    grainLineTrace: { pieces: [] },
  });
  check(
    "L: zero relevant pieces -> no grain-line recommendation at all",
    !findByCodeAndSource(result, "dataCompleteness", "grain-line-trace-completeness"),
  );
}

// -- M: no safety gate handled safely -------------------------------------------------------------
{
  const resultUndefined = buildEngineeringRecommendations({ ...baseInput(), safetyGateIssues: undefined });
  const resultNull = buildEngineeringRecommendations({ ...baseInput(), safetyGateIssues: null });
  check("M: safetyGateIssues undefined -> no throw, empty safety recs", !resultUndefined.some((r) => r.source === "safetyGate"));
  check("M: safetyGateIssues null -> no throw, empty safety recs", !resultNull.some((r) => r.source === "safetyGate"));
}

// -- N: no consumption result handled safely -------------------------------------------------------
{
  const resultUndefined = buildEngineeringRecommendations({ ...baseInput(), consumptionIssues: undefined });
  const resultNull = buildEngineeringRecommendations({ ...baseInput(), consumptionIssues: null });
  check(
    "N: consumptionIssues undefined -> no throw, empty consumption recs",
    !resultUndefined.some((r) => r.source === "consumptionEngine"),
  );
  check(
    "N: consumptionIssues null -> no throw, empty consumption recs",
    !resultNull.some((r) => r.source === "consumptionEngine"),
  );
}

// -- O: overlapping safety/consumption concepts remain independently traceable -------------------
{
  const safetyMarkerLength: ProductionSafetyGateIssue = {
    code: "markerLength",
    severity: "critical",
    title: "Marker Length Exceeds Maximum",
    message: "Safety-gate: marker length exceeds the configured maximum.",
    blocksRelease: true,
  };
  const consumptionMarkerLength: MarkerFabricConsumptionIssue = {
    code: "marker-length-exceeds-maximum",
    severity: "error",
    message: "Consumption-engine: marker length (420 cm) exceeds the configured maximum (400 cm).",
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [safetyMarkerLength],
    consumptionIssues: [consumptionMarkerLength],
  });

  const safetyEntry = findByCodeAndSource(result, "safetyGate", "markerLength");
  const consumptionEntry = findByCodeAndSource(result, "consumptionEngine", "marker-length-exceeds-maximum");

  check("O: both overlapping-concept entries are present simultaneously", Boolean(safetyEntry) && Boolean(consumptionEntry));
  check("O: they are distinct objects with distinct messages", safetyEntry?.message !== consumptionEntry?.message);
  check("O: total count reflects BOTH, neither was merged away", result.length === 2);
}

// -- P: same raw code string from two different sources cannot collide ----------------------------
{
  const safetyIssue: ProductionSafetyGateIssue = {
    code: "markerLength", // deliberately the same literal string as below
    severity: "review",
    title: "Safety: Marker Length",
    message: "Safety-gate message.",
    blocksRelease: false,
  };
  // Fabricate a consumption issue using the exact same literal code string,
  // purely to prove the aggregator's identity is (source, code), not code
  // alone -- the real consumption engine does not actually use this code.
  const consumptionIssue: MarkerFabricConsumptionIssue = {
    code: "markerLength",
    severity: "warning",
    message: "Consumption-engine message.",
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [safetyIssue],
    consumptionIssues: [consumptionIssue],
  });

  const matches = result.filter((r) => r.code === "markerLength");
  check("P: identical raw code from two sources produces TWO distinct entries, not one", matches.length === 2);
  check(
    "P: the two entries have different `source`",
    matches[0]?.source !== matches[1]?.source,
  );
}

// -- Within-source exact duplicate collapses to one (defensive dedup) -----------------------------
{
  const duplicateIssue: ProductionSafetyGateIssue = {
    code: "collision",
    severity: "critical",
    title: "Collision Detected",
    message: "Two pieces overlap.",
    blocksRelease: true,
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [duplicateIssue, { ...duplicateIssue }],
  });

  const matches = result.filter((r) => r.source === "safetyGate" && r.code === "collision");
  check("Within-source exact duplicate (same source+code) collapses to exactly one entry", matches.length === 1);
}

// -- Q: malformed/partial optional input does not throw ---------------------------------------------
{
  let threw = false;
  let result: EngineeringRecommendation[] = [];
  try {
    result = buildEngineeringRecommendations({
      // fabricProfile deliberately omitted entirely (not even present as a key)
      safetyGateIssues: "not-an-array" as unknown as ProductionSafetyGateIssue[],
      consumptionIssues: 42 as unknown as MarkerFabricConsumptionIssue[],
      grainLineTrace: { pieces: [null as unknown as { patternId: string; hasTracedGrainLine: boolean }] },
    } as unknown as EngineeringRecommendationsInput);
  } catch {
    threw = true;
  }
  check("Q: malformed/garbage optional input does not throw", !threw);
  check("Q: malformed input yields a safe (non-crashing) result array", Array.isArray(result));
}

// -- R: deterministic ordering ------------------------------------------------------------------------
{
  const safetyAdvisory: ProductionSafetyGateIssue = {
    code: "utilisationTarget",
    severity: "advisory",
    title: "Low Utilisation",
    message: "m1",
    blocksRelease: false,
  };
  const safetyCritical: ProductionSafetyGateIssue = {
    code: "collision",
    severity: "critical",
    title: "Collision",
    message: "m2",
    blocksRelease: true,
  };
  const consumptionCritical: MarkerFabricConsumptionIssue = {
    code: "marker-length-invalid",
    severity: "error",
    message: "m3",
  };
  const consumptionAdvisory: MarkerFabricConsumptionIssue = {
    code: "roll-shorter-than-marker",
    severity: "warning",
    message: "m4",
  };

  const result = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [safetyAdvisory, safetyCritical],
    consumptionIssues: [consumptionCritical, consumptionAdvisory],
    fabricProfile: { applicable: true, present: false }, // adds a "critical" data-completeness item
    grainLineTrace: { pieces: [{ patternId: "p1", hasTracedGrainLine: true }] }, // adds a "passed" item
  });

  const severityOrder = result.map((r) => r.severity);
  const criticalCount = severityOrder.filter((s) => s === "critical").length;
  const firstAdvisoryIndex = severityOrder.indexOf("advisory");
  const lastCriticalIndex = severityOrder.lastIndexOf("critical");
  const passedIndex = severityOrder.indexOf("passed");

  check("R: all criticals precede all advisories", lastCriticalIndex < firstAdvisoryIndex);
  check("R: 'passed' items sort last", passedIndex === severityOrder.length - 1);
  check("R: exactly 3 criticals present (safety + consumption + fabric-profile)", criticalCount === 3);

  // Re-running with the identical input must produce the identical order (determinism).
  const result2 = buildEngineeringRecommendations({
    ...baseInput(),
    safetyGateIssues: [safetyAdvisory, safetyCritical],
    consumptionIssues: [consumptionCritical, consumptionAdvisory],
    fabricProfile: { applicable: true, present: false },
    grainLineTrace: { pieces: [{ patternId: "p1", hasTracedGrainLine: true }] },
  });
  check(
    "R: identical input produces identical order on repeat calls",
    JSON.stringify(result.map((r) => `${r.source}:${r.code}`)) === JSON.stringify(result2.map((r) => `${r.source}:${r.code}`)),
  );
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
