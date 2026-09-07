/**
 * OptiFabric AI
 * RC5-004-022 — Fabric + Piece Constraint Composer (Step 4A)
 *
 * Purpose:
 * - Compose fabric-level production constraints (FabricProfile) with
 *   existing piece-level constraints into ONE effective input for the
 *   canonical markerRotationPolicyEngine.ts — which remains completely
 *   unchanged and remains the sole authority on legal rotations. This file
 *   contains no rotation-legality logic of its own; it only decides what
 *   to feed into that existing engine.
 *
 * Composition rule (Step 4A §10): the MOST RESTRICTIVE compatible
 * requirement wins, computed per constraint:
 * - Geometric rotation freedom: piece's own shape-derived rule vs the
 *   fabric's confirmed Allowable Rotation setting — the more restrictive of
 *   the two (fewer legal angles) is used.
 * - Grain / directional / nap booleans: if EITHER the piece OR the fabric
 *   asserts the restriction applies, it applies (logical OR — a
 *   restriction from either source can never be relaxed by the other).
 *
 * A fabric profile's fields are always concrete (never "no opinion"), by
 * design: once a fabric profile exists for a project, it is meant to be a
 * real, confirmed production signal, not optional metadata — this is
 * exactly what Step 4A asks for ("the marker must NOT be based only on
 * pattern geometry"). The fabric type defaults in fabricProfileDefaults.ts
 * are deliberately conservative for grain/nap-sensitive families (denim,
 * wool, wool blend, jacket/outerwear) specifically so that accepting a
 * default rather than confirming it does not silently grant unsafe
 * rotation freedom.
 */

import {
  resolveMarkerRotationPolicy,
  type MarkerGeometricRotationRule,
  type MarkerRotationPolicyInput,
  type MarkerRotationPolicyResult,
} from "./markerRotationPolicyEngine";

import type { FabricProfile } from "./fabricProfileTypes";

/** The subset of MarkerRotationPolicyInput that comes from the PIECE alone. */
export interface PieceRotationConstraints {
  readonly geometricRotationRule?: MarkerGeometricRotationRule;
  readonly grainControlled?: boolean;
  readonly directionalFabric?: boolean;
  readonly napDirection?: boolean;
  readonly stripeMatch?: boolean;
  readonly checkMatch?: boolean;
}

/** Fewer legal angles = more restrictive. rotate-90 and free both resolve to all four angles. */
const GEOMETRIC_RULE_RESTRICTIVENESS: Record<MarkerGeometricRotationRule, number> = {
  fixed: 0,
  "rotate-180": 1,
  "rotate-90": 2,
  free: 2,
};

function mostRestrictiveGeometricRule(
  a: MarkerGeometricRotationRule | undefined,
  b: MarkerGeometricRotationRule | undefined
): MarkerGeometricRotationRule | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;

  return GEOMETRIC_RULE_RESTRICTIVENESS[a] <= GEOMETRIC_RULE_RESTRICTIVENESS[b]
    ? a
    : b;
}

function fabricAllowableRotationToGeometricRule(
  fabric: FabricProfile
): MarkerGeometricRotationRule {
  switch (fabric.allowableRotation) {
    case "zeroOnly":
      return "fixed";
    case "zeroOneEighty":
      return "rotate-180";
    case "allAngles":
      return "free";
    case "custom":
      return "free";
    default:
      return "free";
  }
}

/**
 * Fabric contribution to the grain restriction.
 * "custom" (Custom / Engineering Controlled) deliberately asserts nothing —
 * it defers entirely to the piece's own grainControlled flag.
 */
function fabricGrainRestricted(fabric: FabricProfile): boolean {
  return fabric.grainControl === "required";
}

/**
 * Fabric contribution to the directional (nap/face) restriction. Face
 * "One-Way", an explicit "Directional Fabric: Yes", and "Requires
 * Confirmation" (fail conservative — unconfirmed does not mean unrestricted)
 * all assert the restriction. "Face Up"/"Face Down" describe orientation,
 * not an in-plane rotation restriction the 2D engine models, so they do not
 * contribute here.
 */
function fabricDirectionalRestricted(fabric: FabricProfile): boolean {
  return (
    fabric.faceDirection === "oneWay" ||
    fabric.directionalFabric === "yes" ||
    fabric.directionalFabric === "requiresConfirmation"
  );
}

/**
 * Fabric contribution to the nap restriction. "Unknown / Requires
 * Confirmation" fails conservative (treated as one-way) rather than
 * assuming no restriction. "Two Way / Pairable" is NOT treated as a
 * restriction here — see the Known Limitations note in the Step 4A report:
 * mirrored-pair cutting is not modelled by this engine, so pairable nap is
 * represented but not specially enforced beyond avoiding the false
 * assumption that it is safe to treat as a one-way restriction.
 */
function fabricNapRestricted(fabric: FabricProfile): boolean {
  return fabric.nap === "oneWay" || fabric.nap === "unknown";
}

export interface EffectiveRotationConstraints extends MarkerRotationPolicyInput {}

/**
 * Composes fabric-level and piece-level constraints into one effective
 * input, ready to hand to the unchanged resolveMarkerRotationPolicy().
 */
export function composeFabricAndPieceRotationConstraints(
  fabric: FabricProfile,
  piece: PieceRotationConstraints
): EffectiveRotationConstraints {
  return {
    geometricRotationRule: mostRestrictiveGeometricRule(
      piece.geometricRotationRule,
      fabricAllowableRotationToGeometricRule(fabric)
    ),
    grainControlled: piece.grainControlled === true || fabricGrainRestricted(fabric),
    directionalFabric:
      piece.directionalFabric === true || fabricDirectionalRestricted(fabric),
    napDirection: piece.napDirection === true || fabricNapRestricted(fabric),
    stripeMatch: piece.stripeMatch,
    checkMatch: piece.checkMatch,
  };
}

/**
 * Convenience wrapper: compose, then resolve through the canonical engine.
 * Every nesting/repacking/hole-filling call site that has a fabric profile
 * available should call this instead of resolveMarkerRotationPolicy()
 * directly, so fabric-level rules are never accidentally skipped.
 */
export function resolveEffectiveMarkerRotationPolicy(
  fabric: FabricProfile,
  piece: PieceRotationConstraints
): MarkerRotationPolicyResult {
  return resolveMarkerRotationPolicy(
    composeFabricAndPieceRotationConstraints(fabric, piece)
  );
}
