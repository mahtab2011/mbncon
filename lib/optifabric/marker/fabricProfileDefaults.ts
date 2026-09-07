/**
 * OptiFabric AI
 * RC5-004-021 — Fabric Profile Defaults (Step 4A)
 *
 * Purpose:
 * - Populate sensible RECOMMENDED defaults for a Fabric Type. These are
 *   starting points only — the marker engineer confirms or changes every
 *   field for the actual fabric on hand. Nothing here is authoritative;
 *   FabricProfile, once confirmed/edited by the engineer, is authoritative.
 * - New fabric types can be added by extending FABRIC_PROFILE_DEFAULTS below
 *   without touching the marker engine, the composer, or the rotation
 *   policy engine.
 */

import {
  type FabricProfile,
  type FabricType,
} from "./fabricProfileTypes";

const BASE_DEFAULT: Omit<FabricProfile, "fabricType" | "construction"> = {
  grainControl: "notRequired",
  faceDirection: "any",
  nap: "none",
  allowableRotation: "custom",
  stretch: "none",
  matchingRequirement: "none",
  directionalFabric: "no",
  usableFabricWidthCm: 150,
  fabricWidthUnit: "cm",
  maximumMarkerLengthOption: "notSpecified",
  maximumMarkerLengthCm: null,
};

/**
 * Examples only, per Step 4A §9 — a recommendation for a typical fabric in
 * this family, never a claim that every fabric in the family behaves this
 * way. Denim example, cotton twill example, etc. all vary in practice.
 */
export const FABRIC_PROFILE_DEFAULTS: Record<
  FabricType,
  Omit<FabricProfile, "usableFabricWidthCm">
> = {
  denim: {
    ...BASE_DEFAULT,
    fabricType: "denim",
    construction: "woven",
    grainControl: "required",
    faceDirection: "custom",
    nap: "unknown",
    allowableRotation: "custom",
  },
  cottonWoven: {
    ...BASE_DEFAULT,
    fabricType: "cottonWoven",
    construction: "woven",
    grainControl: "required",
    matchingRequirement: "none",
  },
  polyesterWoven: {
    ...BASE_DEFAULT,
    fabricType: "polyesterWoven",
    construction: "woven",
    grainControl: "required",
    faceDirection: "custom",
  },
  knit: {
    ...BASE_DEFAULT,
    fabricType: "knit",
    construction: "knit",
    grainControl: "custom",
    stretch: "biStretch",
    knitOrientation: "unspecified",
  },
  jacketOuterwear: {
    ...BASE_DEFAULT,
    fabricType: "jacketOuterwear",
    construction: "other",
    grainControl: "custom",
    faceDirection: "custom",
    nap: "unknown",
  },
  wool: {
    ...BASE_DEFAULT,
    fabricType: "wool",
    construction: "woven",
    grainControl: "required",
    nap: "unknown",
    faceDirection: "custom",
  },
  woolBlend: {
    ...BASE_DEFAULT,
    fabricType: "woolBlend",
    construction: "woven",
    grainControl: "required",
    nap: "unknown",
    faceDirection: "custom",
  },
  custom: {
    ...BASE_DEFAULT,
    fabricType: "custom",
    construction: "other",
  },
};

export function createDefaultFabricProfile(
  fabricType: FabricType,
  usableFabricWidthCm = 150
): FabricProfile {
  return {
    ...FABRIC_PROFILE_DEFAULTS[fabricType],
    usableFabricWidthCm,
  };
}
