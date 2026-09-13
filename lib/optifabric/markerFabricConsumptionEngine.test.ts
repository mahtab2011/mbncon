/**
 * Stage 2D-1 — focused unit tests for markerFabricConsumptionEngine.ts.
 *
 * No test framework is configured anywhere in this frontend project (no
 * Jest/Vitest in package.json, no existing *.test.ts/*.spec.ts precedent
 * under lib/ or app/) and none was installed to add one here. This file is
 * therefore a small, dependency-free, self-executing check — plain
 * assertions against the real exported engine, runnable directly with
 * Node/TypeScript and no framework:
 *
 *   npx tsc --outDir <tmp> lib/optifabric/markerFabricConsumptionEngine.ts lib/optifabric/markerFabricConsumptionEngine.test.ts --module commonjs --target es2019
 *   node <tmp>/lib/optifabric/markerFabricConsumptionEngine.test.js
 *
 * (or any equivalent transpile-and-run of this file). It exits non-zero on
 * any failed assertion, so it is CI-runnable as-is despite needing no
 * framework.
 */
import {
  calculateMarkerFabricConsumption,
  type MarkerFabricConsumptionInput,
  type MarkerFabricConsumptionResult,
} from "./markerFabricConsumptionEngine";

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

function assertClose(label: string, actual: number | null, expected: number, tolerance = 1e-6): void {
  const ok = actual !== null && Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
  check(`${label} (expected ~${expected}, got ${actual})`, ok);
}

function hasIssue(result: MarkerFabricConsumptionResult, code: string): boolean {
  return result.issues.some((issue) => issue.code === code);
}

// A realistic, fully-valid baseline scenario, hand-computed below.
//   usableRollLengthMetres = 100 - 0.5 - 0.5 - 1        = 98
//   rollLengthCm           = 9800
//   fabricConsumptionPerGarmentCm = 420 / 6             = 70
//   markersPerRoll          = floor(9800 / 420)         = 23   (420*23=9660, 420*24=10080)
//   garmentsPerRoll         = 23 * 6                    = 138
//   rollRemainderCm         = 9800 - 23*420             = 140
//   totalFabricRequiredCm   = 70 * 500                  = 35000
//   totalFabricRequiredMetres                            = 350
//   rollsRequiredForOrder   = ceil(500 / 138)            = 4    (138*3=414, 138*4=552)
//   costPerGarment          = (70/100) * 3.2             = 2.24
const BASELINE: MarkerFabricConsumptionInput = {
  markerLengthCm: 420,
  usableFabricWidthCm: 150,
  setsPerMarker: 6,
  orderQuantity: 500,
  grossRollLengthMetres: 100,
  startAllowanceMetres: 0.5,
  endAllowanceMetres: 0.5,
  defectAllowanceMetres: 1,
  fabricCost: { costPerMetre: 3.2 },
};

// -- 1. Normal valid marker (full baseline round-trip) ------------------------------------------
{
  const result = calculateMarkerFabricConsumption(BASELINE);

  assertEqual("normal valid marker: valid", result.valid, true);
  assertEqual("normal valid marker: no error issues", result.issues.some((i) => i.severity === "error"), false);
  assertClose("normal valid marker: usableRollLengthMetres", result.usableRollLengthMetres, 98);
  assertClose("consumption per garment/set", result.fabricConsumptionPerGarmentCm, 70);
  assertEqual("markers-per-roll floor behavior", result.markersPerRoll, 23);
  assertEqual("garmentsPerRoll", result.garmentsPerRoll, 138);
  assertClose("roll remainder", result.rollRemainderCm, 140);
  assertEqual("rolls-required ceil behavior", result.rollsRequiredForOrder, 4);
  assertClose("totalFabricRequiredCm", result.totalFabricRequiredCm, 35000);
  assertClose("totalFabricRequiredMetres", result.totalFabricRequiredMetres, 350);
  assertClose("cost per garment/set", result.costPerGarment, 2.24);
}

// -- 2. markers-per-roll floor behavior (simple, exactly-divisible-minus-one case) ---------------
{
  const result = calculateMarkerFabricConsumption({
    ...BASELINE,
    grossRollLengthMetres: 10,
    startAllowanceMetres: 0,
    endAllowanceMetres: 0,
    defectAllowanceMetres: 0,
    markerLengthCm: 300,
  });
  // usableRollLengthMetres=10 -> rollLengthCm=1000; floor(1000/300)=3, remainder=1000-900=100
  assertEqual("simple markersPerRoll floor", result.markersPerRoll, 3);
  assertClose("simple rollRemainderCm", result.rollRemainderCm, 100);
}

// -- 3. orderQuantity zero -----------------------------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({ ...BASELINE, orderQuantity: 0 });
  assertEqual("orderQuantity=0: valid", result.valid, true);
  assertEqual("orderQuantity=0: rollsRequiredForOrder", result.rollsRequiredForOrder, 0);
  assertClose("orderQuantity=0: totalFabricRequiredCm", result.totalFabricRequiredCm, 0);
  // Unaffected figures still compute normally.
  assertEqual("orderQuantity=0: markersPerRoll unaffected", result.markersPerRoll, 23);
}

// -- 4. roll shorter than one marker --------------------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({
    ...BASELINE,
    grossRollLengthMetres: 3,
    startAllowanceMetres: 0,
    endAllowanceMetres: 0,
    defectAllowanceMetres: 0,
  });
  // usableRollLengthMetres=3 -> rollLengthCm=300 < markerLengthCm=420
  assertEqual("roll shorter than marker: valid (warning, not error)", result.valid, true);
  assertEqual("roll shorter than marker: markersPerRoll", result.markersPerRoll, 0);
  assertEqual("roll shorter than marker: garmentsPerRoll", result.garmentsPerRoll, 0);
  assertEqual("roll shorter than marker: rollsRequiredForOrder", result.rollsRequiredForOrder, 0);
  assertClose("roll shorter than marker: rollRemainderCm equals full roll", result.rollRemainderCm, 300);
  check("roll shorter than marker: warning present", hasIssue(result, "roll-shorter-than-marker"));
}

// -- 5. allowances exhausting (exceeding) the roll --------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({
    ...BASELINE,
    grossRollLengthMetres: 2,
    startAllowanceMetres: 1,
    endAllowanceMetres: 1,
    defectAllowanceMetres: 0.5,
  });
  assertClose("allowances exceed roll: usableRollLengthMetres clamps to 0", result.usableRollLengthMetres, 0);
  check("allowances exceed roll: warning present", hasIssue(result, "allowances-exceed-gross-roll"));
  assertEqual("allowances exceed roll: markersPerRoll 0", result.markersPerRoll, 0);
  assertClose("allowances exceed roll: rollRemainderCm 0", result.rollRemainderCm, 0);
}

// -- 6. negative allowance is clamped, not propagated ------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({ ...BASELINE, startAllowanceMetres: -5 });
  check("negative allowance: warning present", hasIssue(result, "negative-allowance-clamped"));
  // -5 treated as 0 -> usableRollLengthMetres = 100 - 0 - 0.5 - 1 = 98.5
  assertClose("negative allowance: clamped to 0, not subtracted", result.usableRollLengthMetres, 98.5);
}

// -- 7. zero marker length ------------------------------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({ ...BASELINE, markerLengthCm: 0 });
  assertEqual("zero marker length: invalid", result.valid, false);
  check("zero marker length: error code present", hasIssue(result, "marker-length-invalid"));
  assertEqual("zero marker length: consumption null", result.fabricConsumptionPerGarmentCm, null);
  assertEqual("zero marker length: markersPerRoll null", result.markersPerRoll, null);
  // Roll-length-only figure is still computed even when the marker itself is invalid.
  assertClose("zero marker length: usableRollLengthMetres still computed", result.usableRollLengthMetres, 98);
}

// -- 8. zero usable width -------------------------------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({ ...BASELINE, usableFabricWidthCm: 0 });
  assertEqual("zero usable width: invalid", result.valid, false);
  check("zero usable width: error code present", hasIssue(result, "usable-width-invalid"));
  assertEqual("zero usable width: rollsRequiredForOrder null", result.rollsRequiredForOrder, null);
}

// -- 9. zero setsPerMarker -------------------------------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({ ...BASELINE, setsPerMarker: 0 });
  assertEqual("zero setsPerMarker: invalid", result.valid, false);
  check("zero setsPerMarker: error code present", hasIssue(result, "sets-per-marker-invalid"));
}

// -- 10. incomplete marker -------------------------------------------------------------------------
{
  const result = calculateMarkerFabricConsumption({
    ...BASELINE,
    expectedPieceCount: 48,
    placedPieceCount: 42,
  });
  assertEqual("incomplete marker: invalid", result.valid, false);
  check("incomplete marker: error code present", hasIssue(result, "marker-incomplete"));
  assertEqual("incomplete marker: no misleading rollsRequiredForOrder", result.rollsRequiredForOrder, null);

  // A complete marker (placed === expected) must NOT trigger this.
  const complete = calculateMarkerFabricConsumption({
    ...BASELINE,
    expectedPieceCount: 48,
    placedPieceCount: 48,
  });
  assertEqual("complete marker: valid", complete.valid, true);
  check("complete marker: no marker-incomplete issue", !hasIssue(complete, "marker-incomplete"));
}

// -- 11. marker length exceeding configured maximum ----------------------------------------------
{
  const result = calculateMarkerFabricConsumption({ ...BASELINE, maximumMarkerLengthCm: 400 });
  assertEqual("exceeds maximum length: invalid", result.valid, false);
  check("exceeds maximum length: error code present", hasIssue(result, "marker-length-exceeds-maximum"));

  // Exactly at the maximum must be accepted (not exceeding).
  const atLimit = calculateMarkerFabricConsumption({ ...BASELINE, maximumMarkerLengthCm: 420 });
  assertEqual("at maximum length exactly: valid", atLimit.valid, true);

  // 0 / absent means "no configured limit".
  const noLimit = calculateMarkerFabricConsumption({ ...BASELINE, maximumMarkerLengthCm: 0 });
  assertEqual("maximumMarkerLengthCm=0 means no limit: valid", noLimit.valid, true);
}

// -- 12. marker width mismatch ---------------------------------------------------------------------
{
  const mismatched = calculateMarkerFabricConsumption({ ...BASELINE, markerFabricWidthCm: 145 });
  assertEqual("width mismatch: still valid (warning only)", mismatched.valid, true);
  check("width mismatch: warning present", hasIssue(mismatched, "fabric-width-mismatch"));
  // The calculation itself is unaffected — usableFabricWidthCm remains authoritative.
  assertEqual("width mismatch: markersPerRoll unchanged", mismatched.markersPerRoll, 23);

  const withinTolerance = calculateMarkerFabricConsumption({ ...BASELINE, markerFabricWidthCm: 149.8 });
  check("width within tolerance: no mismatch warning", !hasIssue(withinTolerance, "fabric-width-mismatch"));
}

// -- 13. optional cost absent ------------------------------------------------------------------------
{
  const withoutCost: MarkerFabricConsumptionInput = { ...BASELINE, fabricCost: undefined };
  const result = calculateMarkerFabricConsumption(withoutCost);
  assertEqual("no fabric cost: valid", result.valid, true);
  assertEqual("no fabric cost: costPerGarment is null, not 0", result.costPerGarment, null);
  check(
    "no fabric cost: absence itself is not an issue",
    !result.issues.some((issue) => issue.message.toLowerCase().includes("cost")),
  );
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
