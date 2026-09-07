/**
 * OptiFabric AI
 * RC5-004-024 — Fabric Dropdown Option Translations (Step 18)
 *
 * Purpose:
 * - Bilingual (English/Bangla) display labels for the fixed option values
 *   defined in fabricProfileTypes.ts (FABRIC_TYPES, GRAIN_CONTROL_OPTIONS,
 *   FACE_DIRECTION_OPTIONS, NAP_OPTIONS, ALLOWABLE_ROTATION_OPTIONS,
 *   STRETCH_OPTIONS, MATCHING_REQUIREMENT_OPTIONS,
 *   DIRECTIONAL_FABRIC_OPTIONS).
 * - Presentation only. The underlying option `value` strings that drive the
 *   fabric+piece constraint composer and rotation policy are never touched
 *   by this file — only the label shown to the user changes with language.
 * - Some labels below reproduce user-approved Bangla text supplied for this
 *   step; option values not explicitly supplied (e.g. "Face Up", "Custom")
 *   were translated here to keep every dropdown fully bilingual rather than
 *   partially translated — see the Step 18 engineering report for exactly
 *   which labels came from which source.
 */

import type { OptiFabricLanguageCode } from "./engineeringDictionary";

interface BilingualLabel {
  readonly en: string;
  readonly bn: string;
}

type OptionTranslationTable = Readonly<Record<string, BilingualLabel>>;

const FABRIC_TYPE: OptionTranslationTable = {
  denim: { en: "Denim", bn: "ডেনিম" },
  cottonWoven: { en: "Cotton Woven", bn: "কটন ওভেন" },
  polyesterWoven: { en: "Polyester Woven", bn: "পলিয়েস্টার ওভেন" },
  knit: { en: "Knit", bn: "নিট" },
  jacketOuterwear: {
    en: "Jacket / Outerwear Fabric",
    bn: "জ্যাকেট / আউটারওয়্যার ফ্যাব্রিক",
  },
  wool: { en: "Wool", bn: "উল" },
  woolBlend: { en: "Wool Blend", bn: "উল মিশ্রিত কাপড়" },
  custom: { en: "Other / Custom", bn: "অন্যান্য / কাস্টম" },
};

const GRAIN_CONTROL: OptionTranslationTable = {
  required: { en: "Required", bn: "আবশ্যক" },
  notRequired: { en: "Not Required", bn: "আবশ্যক নয়" },
  custom: {
    en: "Custom / Engineering Controlled",
    bn: "কাস্টম / ইঞ্জিনিয়ারিং নিয়ন্ত্রিত",
  },
};

const FACE_DIRECTION: OptionTranslationTable = {
  any: { en: "Any Direction", bn: "যেকোনো দিক" },
  oneWay: { en: "One-Way Face Direction", bn: "একমুখী ফেস ডিরেকশন" },
  faceUp: { en: "Face Up", bn: "মুখ উপরে (Face Up)" },
  faceDown: { en: "Face Down", bn: "মুখ নিচে (Face Down)" },
  custom: { en: "Custom", bn: "কাস্টম" },
};

const NAP: OptionTranslationTable = {
  none: { en: "None", bn: "ন্যাপ নেই" },
  oneWay: { en: "Nap Present — One Way", bn: "একমুখী ন্যাপ আছে" },
  twoWayPairable: {
    en: "Nap Present — Two Way / Pairable",
    bn: "দ্বিমুখী ন্যাপ আছে — জোড়াযোগ্য",
  },
  unknown: {
    en: "Unknown / Requires Confirmation",
    bn: "অনিশ্চিত / নিশ্চিত করা হয়নি",
  },
};

const ALLOWABLE_ROTATION: OptionTranslationTable = {
  zeroOnly: { en: "0° only", bn: "শুধু ০°" },
  zeroOneEighty: { en: "0° / 180°", bn: "০° / ১৮০°" },
  allAngles: { en: "0° / 90° / 180° / 270°", bn: "০° / ৯০° / ১৮০° / ২৭০°" },
  custom: {
    en: "Custom / Derived from Production Constraints",
    bn: "কাস্টম / উৎপাদন সীমাবদ্ধতা থেকে নির্ধারিত",
  },
};

const STRETCH: OptionTranslationTable = {
  none: { en: "None", bn: "স্ট্রেচ নেই" },
  widthwiseWeft: { en: "Widthwise / Weft Direction", bn: "প্রস্থের দিকে স্ট্রেচ" },
  lengthwiseWarp: { en: "Lengthwise / Warp Direction", bn: "দৈর্ঘ্যের দিকে স্ট্রেচ" },
  biStretch: { en: "Bi-Stretch", bn: "দুই দিকে স্ট্রেচ" },
  multiDirectional: { en: "Multi-Directional", bn: "বহুমুখী স্ট্রেচ" },
  custom: { en: "Custom / Unknown", bn: "কাস্টম / অনিশ্চিত" },
};

const MATCHING_REQUIREMENT: OptionTranslationTable = {
  none: { en: "None", bn: "নেই" },
  stripe: { en: "Stripe", bn: "স্ট্রাইপ" },
  checkPlaid: { en: "Check / Plaid", bn: "চেক / প্লেইড" },
  printRepeat: { en: "Print Repeat", bn: "প্রিন্ট রিপিট" },
  engineeredPlacement: {
    en: "Engineered / Placement Print",
    bn: "ইঞ্জিনিয়ার্ড / প্লেসমেন্ট প্রিন্ট",
  },
  custom: { en: "Custom", bn: "কাস্টম" },
};

const DIRECTIONAL_FABRIC: OptionTranslationTable = {
  yes: { en: "Yes", bn: "হ্যাঁ" },
  no: { en: "No", bn: "না" },
  requiresConfirmation: { en: "Requires Confirmation", bn: "নিশ্চিত করা প্রয়োজন" },
};

const OPTION_TABLES = {
  fabricType: FABRIC_TYPE,
  grainControl: GRAIN_CONTROL,
  faceDirection: FACE_DIRECTION,
  nap: NAP,
  allowableRotation: ALLOWABLE_ROTATION,
  stretch: STRETCH,
  matchingRequirement: MATCHING_REQUIREMENT,
  directionalFabric: DIRECTIONAL_FABRIC,
} as const;

export type FabricOptionField = keyof typeof OPTION_TABLES;

/**
 * Translates one fabric-profile dropdown option's display label. Falls back
 * to the English label supplied by the caller if the value is unrecognised,
 * so an option added later to fabricProfileTypes.ts without a matching entry
 * here degrades to English rather than showing a blank/missing label.
 */
export function translateFabricOptionLabel(
  field: FabricOptionField,
  value: string,
  language: OptiFabricLanguageCode,
  englishFallback: string
): string {
  const entry = OPTION_TABLES[field][value];

  if (!entry) {
    return englishFallback;
  }

  return language === "bn" ? entry.bn : entry.en;
}
