/**
 * OptiFabric AI
 * RC5-005-003 — DXF Unit Detection (Step 5B §5)
 *
 * Purpose:
 * - Resolve the DXF $INSUNITS header variable (when present) into a
 *   CadUnitState, per the AutoCAD DXF reference's INSUNITS code table.
 * - Never guess. A missing or unrecognised $INSUNITS code produces
 *   confidence "userConfirmationRequired", not a silent default.
 */

import type { CadUnit, CadUnitState } from "./importedPatternSetTypes";

/**
 * AutoCAD DXF $INSUNITS code table (documented AutoCAD DXF reference values).
 * Only the units OptiFabric garment patterns plausibly use are mapped to a
 * concrete CadUnit; everything else is reported, not silently coerced.
 */
const INSUNITS_TABLE: Readonly<Record<number, CadUnit | null>> = {
  0: null, // Unitless — cannot be trusted for physical dimensions.
  1: "in", // Inches
  2: null, // Feet — plausible for architectural DXF, implausible for a garment piece; flagged for confirmation rather than assumed.
  4: "mm", // Millimeters
  5: "cm", // Centimeters
  6: null, // Meters — same reasoning as feet.
};

const UNIT_LABELS: Readonly<Record<CadUnit, string>> = {
  mm: "millimetres",
  cm: "centimetres",
  in: "inches",
};

export const CM_PER_UNIT: Readonly<Record<CadUnit, number>> = {
  mm: 0.1,
  cm: 1,
  in: 2.54,
};

/**
 * Resolves unit state from a DXF header's $INSUNITS value (if present).
 * `header` is the raw dxf-parser `IDxf.header` map — untyped here on purpose
 * since dxf-parser types it loosely as `Record<string, IPoint | number>`.
 */
export function detectUnitFromDxfHeader(
  header: Record<string, unknown> | undefined
): CadUnitState {
  const rawCode = header?.["$INSUNITS"];

  if (rawCode === undefined) {
    return {
      unit: null,
      confidence: "userConfirmationRequired",
      note: "The DXF file's HEADER section did not include $INSUNITS. Units cannot be assumed — engineering confirmation is required before this file can be canonicalised.",
    };
  }

  if (typeof rawCode !== "number") {
    return {
      unit: null,
      confidence: "unsupported",
      note: `$INSUNITS was present but was not a numeric code (${JSON.stringify(
        rawCode
      )}). This file's units cannot be interpreted.`,
    };
  }

  if (!(rawCode in INSUNITS_TABLE)) {
    return {
      unit: null,
      confidence: "userConfirmationRequired",
      sourceInsUnitsCode: rawCode,
      note: `$INSUNITS code ${rawCode} is not one OptiFabric currently maps to a unit. Engineering confirmation is required.`,
    };
  }

  const unit = INSUNITS_TABLE[rawCode];

  if (unit === null) {
    return {
      unit: null,
      confidence: "userConfirmationRequired",
      sourceInsUnitsCode: rawCode,
      note: `$INSUNITS code ${rawCode} maps to a unit that is implausible for a garment pattern piece (or is itself ambiguous, e.g. "unitless"). Engineering confirmation is required rather than assuming millimetres/centimetres/inches.`,
    };
  }

  return {
    unit,
    confidence: "detected",
    sourceInsUnitsCode: rawCode,
    note: `Detected ${UNIT_LABELS[unit]} from DXF $INSUNITS code ${rawCode}.`,
  };
}

/**
 * Applies a user's explicit unit confirmation, overriding an ambiguous
 * detection. Never called automatically — only in response to a genuine
 * engineering confirmation step, per the Step 5A/5B "never silently guess"
 * requirement.
 */
export function confirmUnit(unit: CadUnit): CadUnitState {
  return {
    unit,
    confidence: "detected",
    note: `Unit confirmed by engineer as ${UNIT_LABELS[unit]}.`,
  };
}

export function convertToCentimetres(value: number, unit: CadUnit): number {
  return value * CM_PER_UNIT[unit];
}
