/**
 * OptiFabric AI
 * RC5-004-020 — Fabric Profile Data Model (Step 4A)
 *
 * Purpose:
 * - Define the fabric-level production-constraint data model: fabric type,
 *   grain control, face direction, nap, allowable rotation, stretch,
 *   shrinkage, matching requirement, and directional-fabric flag.
 * - This is a DATA MODEL file only. It contains no nesting, geometry or
 *   safety-gate logic — see fabricPieceConstraintComposer.ts for how these
 *   fields compose with piece-level constraints before reaching the
 *   canonical markerRotationPolicyEngine.ts (the single, unchanged
 *   authority for rotation legality).
 *
 * ENFORCED vs STORED — read this before assuming a field affects nesting:
 * - Grain Control, Face Direction, Nap, Allowable Rotation, and the general
 *   Directional Fabric flag ARE composed into the effective rotation policy
 *   (see fabricPieceConstraintComposer.ts) and ARE therefore enforced by the
 *   existing Production Safety Gate exactly as piece-level constraints are.
 * - Stretch, Shrinkage, and Matching Requirement are STORED AND DISPLAYED
 *   ONLY in this step. Stretch does not grant extra rotation freedom.
 *   Shrinkage is not applied to pattern geometry (no approved
 *   shrinkage-compensation mechanism exists yet). Matching Requirement
 *   records intent only — no stripe/check/print phase-matching algorithm
 *   runs against it. Do not represent any of these three as affecting the
 *   generated marker in the UI.
 */

/* ============================================================================
 * Fabric Type
 * ========================================================================== */

export type FabricType =
  | "denim"
  | "cottonWoven"
  | "polyesterWoven"
  | "knit"
  | "jacketOuterwear"
  | "wool"
  | "woolBlend"
  | "custom";

export const FABRIC_TYPES: ReadonlyArray<{
  readonly value: FabricType;
  readonly label: string;
}> = [
  { value: "denim", label: "Denim" },
  { value: "cottonWoven", label: "Cotton Woven" },
  { value: "polyesterWoven", label: "Polyester Woven" },
  { value: "knit", label: "Knit" },
  { value: "jacketOuterwear", label: "Jacket / Outerwear Fabric" },
  { value: "wool", label: "Wool" },
  { value: "woolBlend", label: "Wool Blend" },
  { value: "custom", label: "Other / Custom" },
];

export type FabricConstruction = "woven" | "knit" | "other";

/* ============================================================================
 * Production constraint fields
 * ========================================================================== */

export type GrainControlOption = "required" | "notRequired" | "custom";

export const GRAIN_CONTROL_OPTIONS: ReadonlyArray<{
  readonly value: GrainControlOption;
  readonly label: string;
}> = [
  { value: "required", label: "Required" },
  { value: "notRequired", label: "Not Required" },
  { value: "custom", label: "Custom / Engineering Controlled" },
];

export type FaceDirectionOption =
  | "any"
  | "oneWay"
  | "faceUp"
  | "faceDown"
  | "custom";

export const FACE_DIRECTION_OPTIONS: ReadonlyArray<{
  readonly value: FaceDirectionOption;
  readonly label: string;
}> = [
  { value: "any", label: "Any Direction" },
  { value: "oneWay", label: "One-Way Face Direction" },
  { value: "faceUp", label: "Face Up" },
  { value: "faceDown", label: "Face Down" },
  { value: "custom", label: "Custom" },
];

export type NapOption =
  | "none"
  | "oneWay"
  | "twoWayPairable"
  | "unknown";

export const NAP_OPTIONS: ReadonlyArray<{
  readonly value: NapOption;
  readonly label: string;
}> = [
  { value: "none", label: "None" },
  { value: "oneWay", label: "Nap Present — One Way" },
  { value: "twoWayPairable", label: "Nap Present — Two Way / Pairable" },
  { value: "unknown", label: "Unknown / Requires Confirmation" },
];

export type AllowableRotationOption =
  | "zeroOnly"
  | "zeroOneEighty"
  | "allAngles"
  | "custom";

export const ALLOWABLE_ROTATION_OPTIONS: ReadonlyArray<{
  readonly value: AllowableRotationOption;
  readonly label: string;
}> = [
  { value: "zeroOnly", label: "0° only" },
  { value: "zeroOneEighty", label: "0° / 180°" },
  { value: "allAngles", label: "0° / 90° / 180° / 270°" },
  { value: "custom", label: "Custom / Derived from Production Constraints" },
];

export type StretchOption =
  | "none"
  | "widthwiseWeft"
  | "lengthwiseWarp"
  | "biStretch"
  | "multiDirectional"
  | "custom";

export const STRETCH_OPTIONS: ReadonlyArray<{
  readonly value: StretchOption;
  readonly label: string;
}> = [
  { value: "none", label: "None" },
  { value: "widthwiseWeft", label: "Widthwise / Weft Direction" },
  { value: "lengthwiseWarp", label: "Lengthwise / Warp Direction" },
  { value: "biStretch", label: "Bi-Stretch" },
  { value: "multiDirectional", label: "Multi-Directional" },
  { value: "custom", label: "Custom / Unknown" },
];

/** Knit-specific orientation, representable even though not yet used by any algorithm. */
export type KnitOrientation = "wale" | "course" | "unspecified";

export type MatchingRequirementOption =
  | "none"
  | "stripe"
  | "checkPlaid"
  | "printRepeat"
  | "engineeredPlacement"
  | "custom";

export const MATCHING_REQUIREMENT_OPTIONS: ReadonlyArray<{
  readonly value: MatchingRequirementOption;
  readonly label: string;
}> = [
  { value: "none", label: "None" },
  { value: "stripe", label: "Stripe" },
  { value: "checkPlaid", label: "Check / Plaid" },
  { value: "printRepeat", label: "Print Repeat" },
  { value: "engineeredPlacement", label: "Engineered / Placement Print" },
  { value: "custom", label: "Custom" },
];

export type RepeatUnit = "cm" | "in";

export type DirectionalFabricOption = "yes" | "no" | "requiresConfirmation";

export const DIRECTIONAL_FABRIC_OPTIONS: ReadonlyArray<{
  readonly value: DirectionalFabricOption;
  readonly label: string;
}> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "requiresConfirmation", label: "Requires Confirmation" },
];

/* ============================================================================
 * Fabric width
 * ========================================================================== */

export type FabricWidthUnit = "cm" | "in";

/**
 * Convenience examples only — never a declaration that a fabric always has
 * this width. The engineer's confirmed usable width is authoritative.
 */
export const FABRIC_WIDTH_PRESETS_CM: ReadonlyArray<number> = [
  110, 120, 140, 145, 150, 152, 160, 180,
];

/* ============================================================================
 * Maximum cutting table / marker length
 * ========================================================================== */

export type MaximumMarkerLengthOption =
  | "notSpecified"
  | "10m"
  | "15m"
  | "20m"
  | "25m"
  | "30m"
  | "40m"
  | "50m"
  | "custom";

export const MAXIMUM_MARKER_LENGTH_OPTIONS: ReadonlyArray<{
  readonly value: MaximumMarkerLengthOption;
  readonly label: string;
  readonly metres: number | null;
}> = [
  { value: "notSpecified", label: "No Limit / Not Specified", metres: null },
  { value: "10m", label: "10 m", metres: 10 },
  { value: "15m", label: "15 m", metres: 15 },
  { value: "20m", label: "20 m", metres: 20 },
  { value: "25m", label: "25 m", metres: 25 },
  { value: "30m", label: "30 m", metres: 30 },
  { value: "40m", label: "40 m", metres: 40 },
  { value: "50m", label: "50 m", metres: 50 },
  { value: "custom", label: "Custom", metres: null },
];

/* ============================================================================
 * The fabric profile itself
 * ========================================================================== */

export interface FabricProfile {
  readonly fabricType: FabricType;
  readonly construction: FabricConstruction;

  readonly grainControl: GrainControlOption;
  readonly faceDirection: FaceDirectionOption;
  readonly nap: NapOption;
  readonly allowableRotation: AllowableRotationOption;
  readonly stretch: StretchOption;
  readonly knitOrientation?: KnitOrientation;

  /** Stored/displayed only — see file header. Not applied to geometry. */
  readonly lengthWarpShrinkagePercent?: number;
  readonly widthWeftShrinkagePercent?: number;

  /** Stored/displayed only — see file header. No matching algorithm runs. */
  readonly matchingRequirement: MatchingRequirementOption;
  readonly horizontalRepeat?: number;
  readonly verticalRepeat?: number;
  readonly repeatUnit?: RepeatUnit;

  readonly directionalFabric: DirectionalFabricOption;

  readonly nominalFabricWidthCm?: number;
  readonly usableFabricWidthCm: number;
  readonly fabricWidthUnit: FabricWidthUnit;

  readonly maximumMarkerLengthOption: MaximumMarkerLengthOption;
  /** Resolved centimetre value when a limit applies; null when not specified. */
  readonly maximumMarkerLengthCm: number | null;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}
