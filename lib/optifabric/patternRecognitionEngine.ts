import {
  GrainDirection,
  MarkerRotationRule,
  PatternMaterialCategory,
  PatternRecognitionConfidence,
  PatternRecognitionInput,
  PatternRecognitionProjectResult,
  PatternRecognitionRestriction,
  PatternRecognitionSummary,
  PatternRecognitionWarning,
  PatternSide,
  PatternSymmetry,
  RecognisedPatternPiece,
} from "@/lib/optifabric/patternRecognitionTypes";

type RecognitionRule = {
  keywords: string[];
  recognisedName: string;
  materialCategory?: PatternMaterialCategory;
  side?: PatternSide;
  grainDirection?: GrainDirection;
  symmetry?: PatternSymmetry;
  rotationRule?: MarkerRotationRule;
  requiresPair?: boolean;
  markerEligible?: boolean;
  confidence?: number;
};

const recognitionRules: RecognitionRule[] = [
  {
    keywords: ["front panel", "shirt front", "front body", "front"],
    recognisedName: "Front",
    materialCategory: "main-fabric",
    side: "pair",
    grainDirection: "vertical",
    symmetry: "partially-symmetrical",
    rotationRule: "rotate-180",
    requiresPair: true,
    markerEligible: true,
    confidence: 0.96,
  },
  {
    keywords: ["back panel", "shirt back", "back body", "back"],
    recognisedName: "Back",
    materialCategory: "main-fabric",
    side: "centre",
    grainDirection: "vertical",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.96,
  },
  {
    keywords: ["sleeve", "long sleeve", "short sleeve"],
    recognisedName: "Sleeve",
    materialCategory: "main-fabric",
    side: "pair",
    grainDirection: "vertical",
    symmetry: "partially-symmetrical",
    rotationRule: "rotate-180",
    requiresPair: true,
    markerEligible: true,
    confidence: 0.95,
  },
  {
    keywords: ["collar stand", "neck stand"],
    recognisedName: "Collar Stand",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "horizontal",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.97,
  },
  {
    keywords: ["collar band"],
    recognisedName: "Collar Band",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "horizontal",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.95,
  },
  {
    keywords: ["upper collar", "top collar"],
    recognisedName: "Upper Collar",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "horizontal",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.95,
  },
  {
    keywords: ["under collar", "lower collar"],
    recognisedName: "Under Collar",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "bias",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.94,
  },
  {
    keywords: ["collar"],
    recognisedName: "Collar",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "horizontal",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.9,
  },
  {
    keywords: ["cuff"],
    recognisedName: "Cuff",
    materialCategory: "main-fabric",
    side: "pair",
    grainDirection: "horizontal",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: true,
    markerEligible: true,
    confidence: 0.95,
  },
  {
    keywords: ["pocket flap", "flap"],
    recognisedName: "Pocket Flap",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "vertical",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.93,
  },
  {
    keywords: ["chest pocket", "shirt pocket", "pocket"],
    recognisedName: "Pocket",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "vertical",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.92,
  },
  {
    keywords: ["front placket", "button placket", "placket"],
    recognisedName: "Front Placket",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "vertical",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.94,
  },
  {
    keywords: ["hidden placket", "concealed placket"],
    recognisedName: "Hidden Placket",
    materialCategory: "main-fabric",
    side: "not-applicable",
    grainDirection: "vertical",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.96,
  },
  {
    keywords: ["sleeve placket", "gauntlet"],
    recognisedName: "Sleeve Placket",
    materialCategory: "main-fabric",
    side: "pair",
    grainDirection: "vertical",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: true,
    markerEligible: true,
    confidence: 0.93,
  },
  {
    keywords: ["yoke"],
    recognisedName: "Back Yoke",
    materialCategory: "main-fabric",
    side: "centre",
    grainDirection: "horizontal",
    symmetry: "symmetrical",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.94,
  },
  {
    keywords: ["collar stay"],
    recognisedName: "Collar Stay",
    materialCategory: "fusing",
    side: "pair",
    grainDirection: "any",
    symmetry: "symmetrical",
    rotationRule: "free-rotation",
    requiresPair: true,
    markerEligible: true,
    confidence: 0.96,
  },
  {
    keywords: ["hem reinforcement", "hem support"],
    recognisedName: "Hem Reinforcement",
    materialCategory: "fusing",
    side: "not-applicable",
    grainDirection: "any",
    symmetry: "symmetrical",
    rotationRule: "free-rotation",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.93,
  },
  {
    keywords: ["pleat guide", "fold guide", "placement guide"],
    recognisedName: "Construction Guide",
    materialCategory: "unknown",
    side: "not-applicable",
    grainDirection: "unknown",
    symmetry: "unknown",
    rotationRule: "unknown",
    requiresPair: false,
    markerEligible: false,
    confidence: 0.88,
  },
  {
    keywords: ["lining"],
    recognisedName: "Lining Piece",
    materialCategory: "lining",
    side: "unknown",
    grainDirection: "vertical",
    symmetry: "unknown",
    rotationRule: "rotate-180",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.9,
  },
  {
    keywords: ["fusing", "fusible"],
    recognisedName: "Fusing Piece",
    materialCategory: "fusing",
    side: "unknown",
    grainDirection: "any",
    symmetry: "unknown",
    rotationRule: "free-rotation",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.9,
  },
  {
    keywords: ["interlining"],
    recognisedName: "Interlining Piece",
    materialCategory: "interlining",
    side: "unknown",
    grainDirection: "any",
    symmetry: "unknown",
    rotationRule: "free-rotation",
    requiresPair: false,
    markerEligible: true,
    confidence: 0.9,
  },
];

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function roundConfidence(value: number): number {
  return Math.round(clampConfidence(value) * 100) / 100;
}

function findRecognitionRule(name: string): RecognitionRule | undefined {
  const normalizedName = normalizeText(name);

  return recognitionRules.find((rule) =>
    rule.keywords.some((keyword) =>
      normalizedName.includes(normalizeText(keyword))
    )
  );
}

function detectMaterialCategory(
  input: PatternRecognitionInput,
  rule?: RecognitionRule
): PatternMaterialCategory {
  if (rule?.materialCategory) {
    return rule.materialCategory;
  }

  const text = normalizeText(
    `${input.name} ${input.description ?? ""} ${input.fileName ?? ""}`
  );

  if (text.includes("lining")) {
    return "lining";
  }

  if (text.includes("fusing") || text.includes("fusible")) {
    return "fusing";
  }

  if (text.includes("interlining")) {
    return "interlining";
  }

  if (text.includes("contrast")) {
    return "contrast";
  }

  if (text.includes("pocketing")) {
    return "pocketing";
  }

  if (input.custom) {
    return "unknown";
  }

  return "main-fabric";
}

function detectSide(
  input: PatternRecognitionInput,
  rule?: RecognitionRule
): PatternSide {
  if (rule?.side) {
    return rule.side;
  }

  const text = normalizeText(
    `${input.name} ${input.description ?? ""} ${input.fileName ?? ""}`
  );

  if (text.includes("left")) {
    return "left";
  }

  if (text.includes("right")) {
    return "right";
  }

  if (text.includes("centre") || text.includes("center")) {
    return "centre";
  }

  if ((input.cutQuantity ?? 1) >= 2) {
    return "pair";
  }

  return "unknown";
}

function detectGrainDirection(
  input: PatternRecognitionInput,
  rule?: RecognitionRule
): GrainDirection {
  if (rule?.grainDirection) {
    return rule.grainDirection;
  }

  const text = normalizeText(
    `${input.name} ${input.description ?? ""} ${input.fileName ?? ""}`
  );

  if (text.includes("bias")) {
    return "bias";
  }

  if (
    text.includes("horizontal grain") ||
    text.includes("cross grain") ||
    text.includes("crosswise")
  ) {
    return "horizontal";
  }

  if (
    text.includes("vertical grain") ||
    text.includes("straight grain") ||
    text.includes("lengthwise")
  ) {
    return "vertical";
  }

  if (
    text.includes("any grain") ||
    text.includes("non directional") ||
    text.includes("non-directional")
  ) {
    return "any";
  }

  return "unknown";
}

function detectSymmetry(
  input: PatternRecognitionInput,
  rule?: RecognitionRule
): PatternSymmetry {
  if (rule?.symmetry) {
    return rule.symmetry;
  }

  const text = normalizeText(
    `${input.name} ${input.description ?? ""} ${input.fileName ?? ""}`
  );

  if (text.includes("asymmetric") || text.includes("asymmetrical")) {
    return "asymmetrical";
  }

  if (
    text.includes("symmetric") ||
    text.includes("symmetrical") ||
    input.cutOnFold
  ) {
    return "symmetrical";
  }

  return "unknown";
}

function detectRotationRule(
  input: PatternRecognitionInput,
  grainDirection: GrainDirection,
  materialCategory: PatternMaterialCategory,
  rule?: RecognitionRule
): MarkerRotationRule {
  if (rule?.rotationRule) {
    return rule.rotationRule;
  }

  const text = normalizeText(
    `${input.name} ${input.description ?? ""} ${input.fileName ?? ""}`
  );

  if (
    text.includes("fixed direction") ||
    text.includes("one way") ||
    text.includes("one-way")
  ) {
    return "fixed";
  }

  if (grainDirection === "any") {
    return "free-rotation";
  }

  if (
    materialCategory === "fusing" ||
    materialCategory === "interlining"
  ) {
    return "free-rotation";
  }

  if (grainDirection === "vertical" || grainDirection === "horizontal") {
    return "rotate-180";
  }

  return "unknown";
}

function detectRequiresPair(
  input: PatternRecognitionInput,
  side: PatternSide,
  rule?: RecognitionRule
): boolean {
  if (typeof rule?.requiresPair === "boolean") {
    return rule.requiresPair;
  }

  if (side === "pair") {
    return true;
  }

  return (input.cutQuantity ?? 1) >= 2;
}

function detectMarkerEligibility(
  input: PatternRecognitionInput,
  materialCategory: PatternMaterialCategory,
  rule?: RecognitionRule
): boolean {
  if (typeof rule?.markerEligible === "boolean") {
    return rule.markerEligible;
  }

  if (!input.uploaded) {
    return false;
  }

  if (materialCategory === "unknown" && input.custom) {
    return false;
  }

  return true;
}

function calculateGeometryConfidence(
  input: PatternRecognitionInput
): number {
  let confidence = 0.35;

  if (
    typeof input.detectedWidthPixels === "number" &&
    input.detectedWidthPixels > 0
  ) {
    confidence += 0.15;
  }

  if (
    typeof input.detectedHeightPixels === "number" &&
    input.detectedHeightPixels > 0
  ) {
    confidence += 0.15;
  }

  if (
    typeof input.calibratedWidthCm === "number" &&
    input.calibratedWidthCm > 0
  ) {
    confidence += 0.1;
  }

  if (
    typeof input.calibratedHeightCm === "number" &&
    input.calibratedHeightCm > 0
  ) {
    confidence += 0.1;
  }

  if (
    typeof input.calibratedAreaSqCm === "number" &&
    input.calibratedAreaSqCm > 0
  ) {
    confidence += 0.1;
  }

  if (
    typeof input.calibratedPerimeterCm === "number" &&
    input.calibratedPerimeterCm > 0
  ) {
    confidence += 0.05;
  }

  return roundConfidence(confidence);
}

function buildConfidence(
  input: PatternRecognitionInput,
  rule: RecognitionRule | undefined,
  materialCategory: PatternMaterialCategory,
  side: PatternSide,
  grainDirection: GrainDirection,
  symmetry: PatternSymmetry
): PatternRecognitionConfidence {
  const base = rule?.confidence ?? (input.custom ? 0.62 : 0.72);
  const geometry = calculateGeometryConfidence(input);

  const pieceName = rule
    ? base
    : input.custom
      ? 0.55
      : 0.68;

  const materialConfidence =
    materialCategory === "unknown" ? 0.45 : Math.max(base - 0.04, 0.6);

  const sideConfidence =
    side === "unknown" ? 0.45 : Math.max(base - 0.05, 0.6);

  const grainConfidence =
    grainDirection === "unknown" ? 0.4 : Math.max(base - 0.06, 0.6);

  const symmetryConfidence =
    symmetry === "unknown" ? 0.4 : Math.max(base - 0.07, 0.6);

  const foldConfidence =
    typeof input.cutOnFold === "boolean"
      ? input.cutOnFold
        ? 0.95
        : 0.86
      : 0.5;

  const pairingConfidence =
    typeof input.cutQuantity === "number"
      ? input.cutQuantity >= 2
        ? 0.92
        : 0.84
      : 0.55;

  const values = [
    pieceName,
    materialConfidence,
    sideConfidence,
    grainConfidence,
    symmetryConfidence,
    foldConfidence,
    pairingConfidence,
    geometry,
  ];

  const overall =
    values.reduce((total, value) => total + value, 0) / values.length;

  return {
    overall: roundConfidence(overall),
    pieceName: roundConfidence(pieceName),
    materialCategory: roundConfidence(materialConfidence),
    side: roundConfidence(sideConfidence),
    grainDirection: roundConfidence(grainConfidence),
    symmetry: roundConfidence(symmetryConfidence),
    foldDetection: roundConfidence(foldConfidence),
    pairing: roundConfidence(pairingConfidence),
    geometry: roundConfidence(geometry),
  };
}

function buildRestrictions(
  input: PatternRecognitionInput,
  grainDirection: GrainDirection,
  rotationRule: MarkerRotationRule,
  requiresPair: boolean
): PatternRecognitionRestriction[] {
  const restrictions: PatternRecognitionRestriction[] = [];

  if (grainDirection !== "any" && grainDirection !== "unknown") {
    restrictions.push({
      id: `${input.patternId}-grain`,
      type: "grain",
      message: `Maintain ${grainDirection} grain direction during marker placement.`,
      blocking: true,
    });
  }

  if (input.cutOnFold) {
    restrictions.push({
      id: `${input.patternId}-fold`,
      type: "fold",
      message: "Place the identified fold edge directly on the fabric fold.",
      blocking: true,
    });
  }

  if (rotationRule === "fixed") {
    restrictions.push({
      id: `${input.patternId}-rotation-fixed`,
      type: "rotation",
      message: "This pattern must remain in its original direction.",
      blocking: true,
    });
  }

  if (rotationRule === "rotate-180") {
    restrictions.push({
      id: `${input.patternId}-rotation-180`,
      type: "rotation",
      message: "This pattern may be rotated by 180 degrees only.",
      blocking: true,
    });
  }

  if (rotationRule === "rotate-90") {
    restrictions.push({
      id: `${input.patternId}-rotation-90`,
      type: "rotation",
      message: "This pattern may be rotated in 90-degree increments.",
      blocking: true,
    });
  }

  if (requiresPair) {
    restrictions.push({
      id: `${input.patternId}-pairing`,
      type: "pairing",
      message: "Ensure that the required mirrored or paired piece is included.",
      blocking: true,
    });
  }

  return restrictions;
}

function buildWarnings(
  input: PatternRecognitionInput,
  materialCategory: PatternMaterialCategory,
  grainDirection: GrainDirection,
  confidence: PatternRecognitionConfidence,
  markerEligible: boolean
): PatternRecognitionWarning[] {
  const warnings: PatternRecognitionWarning[] = [];

  if (confidence.overall < 0.7) {
    warnings.push({
      id: `${input.patternId}-low-confidence`,
      code: "LOW_CONFIDENCE",
      message:
        "AI confidence is below the automatic approval threshold. Manual review is recommended.",
      severity: "warning",
    });
  }

  if (grainDirection === "unknown") {
    warnings.push({
      id: `${input.patternId}-missing-grain`,
      code: "MISSING_GRAIN_LINE",
      message:
        "The grain direction could not be confirmed and must be reviewed before marker generation.",
      severity: "warning",
    });
  }

  if (
    typeof input.calibratedWidthCm !== "number" ||
    typeof input.calibratedHeightCm !== "number"
  ) {
    warnings.push({
      id: `${input.patternId}-not-calibrated`,
      code: "DIMENSIONS_NOT_CALIBRATED",
      message:
        "Real pattern dimensions are not yet calibrated from the reference scale.",
      severity: "warning",
    });
  }

  if (materialCategory === "unknown") {
    warnings.push({
      id: `${input.patternId}-material-unknown`,
      code: "MATERIAL_UNKNOWN",
      message:
        "The material category could not be confirmed automatically.",
      severity: "warning",
    });
  }

  if (!markerEligible) {
    warnings.push({
      id: `${input.patternId}-manual-review`,
      code: "MANUAL_REVIEW_REQUIRED",
      message:
        "This piece is excluded from automatic marker planning until it is reviewed.",
      severity: "critical",
    });
  }

  return warnings;
}

function buildExplanation(
  recognisedName: string,
  materialCategory: PatternMaterialCategory,
  grainDirection: GrainDirection,
  cutOnFold: boolean,
  requiresPair: boolean,
  markerEligible: boolean
): string {
  const statements = [
    `AI recognised this piece as ${recognisedName}.`,
    `The material category is ${materialCategory.replace(/-/g, " ")}.`,
    grainDirection === "unknown"
      ? "The grain direction requires manual confirmation."
      : `The recommended grain direction is ${grainDirection}.`,
    cutOnFold
      ? "The piece must be placed on the fabric fold."
      : "The piece does not require fold placement.",
    requiresPair
      ? "A paired or mirrored piece is required."
      : "No paired piece is required.",
    markerEligible
      ? "The piece is currently eligible for marker planning."
      : "The piece requires review before marker planning.",
  ];

  return statements.join(" ");
}

export function recognisePatternPiece(
  input: PatternRecognitionInput
): RecognisedPatternPiece {
  const rule = findRecognitionRule(input.name);

  const recognisedName = rule?.recognisedName ?? input.name;
  const materialCategory = detectMaterialCategory(input, rule);
  const side = detectSide(input, rule);
  const grainDirection = detectGrainDirection(input, rule);
  const symmetry = detectSymmetry(input, rule);

  const rotationRule = detectRotationRule(
    input,
    grainDirection,
    materialCategory,
    rule
  );

  const requiresPair = detectRequiresPair(input, side, rule);

  const markerEligible = detectMarkerEligibility(
    input,
    materialCategory,
    rule
  );

  const confidence = buildConfidence(
    input,
    rule,
    materialCategory,
    side,
    grainDirection,
    symmetry
  );

  const restrictions = buildRestrictions(
    input,
    grainDirection,
    rotationRule,
    requiresPair
  );

  const warnings = buildWarnings(
    input,
    materialCategory,
    grainDirection,
    confidence,
    markerEligible
  );

  const requiresReview =
    confidence.overall < 0.7 ||
    warnings.some((warning) => warning.severity === "critical") ||
    grainDirection === "unknown" ||
    materialCategory === "unknown";

  return {
    patternId: input.patternId,
    projectId: input.projectId,

    originalName: input.name,
    recognisedName,

    materialCategory,
    side,
    grainDirection,
    symmetry,
    rotationRule,

    cutQuantity: input.cutQuantity ?? 1,
    cutOnFold: input.cutOnFold ?? false,
    requiresPair,
    markerEligible,

    status: requiresReview ? "requires-review" : "recognised",

    dimensions: {
      widthCm: input.calibratedWidthCm,
      heightCm: input.calibratedHeightCm,
      perimeterCm: input.calibratedPerimeterCm,
      areaSqCm: input.calibratedAreaSqCm,
      boundingBox:
        typeof input.detectedWidthPixels === "number" &&
        typeof input.detectedHeightPixels === "number"
          ? {
              widthPixels: input.detectedWidthPixels,
              heightPixels: input.detectedHeightPixels,
              widthCm: input.calibratedWidthCm,
              heightCm: input.calibratedHeightCm,
            }
          : undefined,
    },

    confidence,
    restrictions,
    warnings,

    explanation: buildExplanation(
      recognisedName,
      materialCategory,
      grainDirection,
      input.cutOnFold ?? false,
      requiresPair,
      markerEligible
    ),

    analysedAt: new Date().toISOString(),
  };
}

export function recogniseProjectPatterns(
  projectId: string,
  inputs: PatternRecognitionInput[]
): PatternRecognitionProjectResult {
  const projectInputs = inputs.filter(
    (input) => input.projectId === projectId
  );

  const patterns = projectInputs.map((input) =>
    recognisePatternPiece(input)
  );

  const recognisedPatterns = patterns.filter(
    (pattern) => pattern.status === "recognised"
  ).length;

  const reviewRequired = patterns.filter(
    (pattern) => pattern.status === "requires-review"
  ).length;

  const rejectedPatterns = patterns.filter(
    (pattern) => pattern.status === "rejected"
  ).length;

  const markerEligiblePatterns = patterns.filter(
    (pattern) => pattern.markerEligible
  ).length;

  const averageConfidence =
    patterns.length > 0
      ? patterns.reduce(
          (total, pattern) => total + pattern.confidence.overall,
          0
        ) / patterns.length
      : 0;

  return {
    projectId,
    totalPatterns: patterns.length,
    recognisedPatterns,
    reviewRequired,
    rejectedPatterns,
    markerEligiblePatterns,
    averageConfidence: roundConfidence(averageConfidence),
    patterns,
    completedAt: new Date().toISOString(),
  };
}

export function calculatePatternRecognitionSummary(
  patterns: RecognisedPatternPiece[]
): PatternRecognitionSummary {
  const totalPatterns = patterns.length;

  const averageConfidence =
    totalPatterns > 0
      ? patterns.reduce(
          (total, pattern) => total + pattern.confidence.overall,
          0
        ) / totalPatterns
      : 0;

  return {
    totalPatterns,

    mainFabricPatterns: patterns.filter(
      (pattern) => pattern.materialCategory === "main-fabric"
    ).length,

    liningPatterns: patterns.filter(
      (pattern) => pattern.materialCategory === "lining"
    ).length,

    fusingPatterns: patterns.filter(
      (pattern) =>
        pattern.materialCategory === "fusing" ||
        pattern.materialCategory === "interlining"
    ).length,

    foldPatterns: patterns.filter((pattern) => pattern.cutOnFold).length,

    pairedPatterns: patterns.filter(
      (pattern) => pattern.requiresPair
    ).length,

    markerEligiblePatterns: patterns.filter(
      (pattern) => pattern.markerEligible
    ).length,

    reviewRequired: patterns.filter(
      (pattern) => pattern.status === "requires-review"
    ).length,

    averageConfidence: roundConfidence(averageConfidence),
  };
}

export function getRecognisedPatternsForMarker(
  patterns: RecognisedPatternPiece[]
): RecognisedPatternPiece[] {
  return patterns.filter(
    (pattern) =>
      pattern.markerEligible &&
      pattern.status !== "rejected" &&
      pattern.cutQuantity > 0
  );
}

export function getPatternsRequiringReview(
  patterns: RecognisedPatternPiece[]
): RecognisedPatternPiece[] {
  return patterns.filter(
    (pattern) =>
      pattern.status === "requires-review" ||
      pattern.warnings.some(
        (warning) =>
          warning.severity === "warning" ||
          warning.severity === "critical"
      )
  );
}

export function calculateRecognitionPercentage(
  result: PatternRecognitionProjectResult
): number {
  if (result.totalPatterns === 0) {
    return 0;
  }

  return Math.round(
    (result.recognisedPatterns / result.totalPatterns) * 100
  );
}

export const patternRecognitionEngine = {
  recognisePatternPiece,
  recogniseProjectPatterns,
  calculatePatternRecognitionSummary,
  getRecognisedPatternsForMarker,
  getPatternsRequiringReview,
  calculateRecognitionPercentage,
};

export default patternRecognitionEngine;