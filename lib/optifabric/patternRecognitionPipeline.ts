import {
  garmentCategoryMaster,
  getGarmentCategoryById,
  getPatternPieceById,
  patternPieceMaster,
  type GarmentCategoryDefinition,
  type PatternPieceDefinition,
} from "@/lib/optifabric/masters";

export type RecognitionImageQuality =
  | "excellent"
  | "good"
  | "acceptable"
  | "poor";

export type RecognitionSourceType =
  | "image"
  | "pdf"
  | "camera"
  | "engineering-dataset";

export interface PatternRecognitionInput {
  fileName: string;
  sourceType: RecognitionSourceType;

  selectedGarmentCategoryId?: string;
  expectedPatternPieceId?: string;

  visibleText?: string;
  operatorDescription?: string;

  imageQuality?: RecognitionImageQuality;

  hasScaleReference?: boolean;
  hasVisibleGrainLine?: boolean;
  hasVisibleNotches?: boolean;

  widthPixels?: number;
  heightPixels?: number;
}

export interface RecognitionCandidate {
  id: string;
  name: string;
  confidencePercent: number;
  reasons: string[];
}

export interface PatternRecognitionResult {
  status: "recognized" | "review-required" | "failed";

  garmentCategoryId?: string;
  garmentCategoryCode?: string;
  garmentCategoryName?: string;
  garmentConfidencePercent: number;

  patternPieceId?: string;
  patternPieceCode?: string;
  patternPieceName?: string;
  patternPieceConfidencePercent: number;

  garmentCandidates: RecognitionCandidate[];
  patternPieceCandidates: RecognitionCandidate[];

  engineeringWarnings: string[];
  engineeringRecommendations: string[];

  whyAiAsks: {
    title: string;
    explanation: string;
    engineeringImpact: string;
  };
}

const genericGarmentKeywords: Record<string, string[]> = {
  "garment-mens-basic-shirt": [
    "shirt",
    "mens shirt",
    "men shirt",
    "woven shirt",
    "formal shirt",
    "basic shirt",
  ],

  "garment-basic-trouser": [
    "trouser",
    "pants",
    "pant",
    "bottom",
    "waistband",
    "fly",
  ],

  "garment-polo-shirt": [
    "polo",
    "polo shirt",
    "knit polo",
    "placket",
  ],

  "garment-basic-jacket": [
    "jacket",
    "outerwear",
    "lining",
    "jacket front",
    "jacket back",
  ],

  "garment-t-shirt": [
    "t-shirt",
    "tshirt",
    "tee shirt",
    "neck rib",
  ],
};

const genericPatternPieceKeywords: Record<string, string[]> = {
  "piece-shirt-front": [
    "shirt front",
    "front panel",
    "front body",
    "front",
  ],

  "piece-shirt-back": [
    "shirt back",
    "back panel",
    "back body",
    "back",
  ],

  "piece-left-sleeve": [
    "left sleeve",
    "sleeve left",
  ],

  "piece-right-sleeve": [
    "right sleeve",
    "sleeve right",
  ],

  "piece-shirt-collar": [
    "shirt collar",
    "collar leaf",
    "collar",
  ],

  "piece-shirt-collar-stand": [
    "collar stand",
    "neck band",
  ],

  "piece-shirt-pocket": [
    "shirt pocket",
    "chest pocket",
    "pocket",
  ],

  "piece-shirt-cuff": [
    "shirt cuff",
    "sleeve cuff",
    "cuff",
  ],

  "piece-shirt-facing": [
    "shirt facing",
    "front facing",
    "facing",
  ],
};

function normalizeText(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_/\\]+/g, " ")
    .replace(/[-]+/g, " ")
    .replace(/\s+/g, " ");
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getQualityAdjustment(
  quality: RecognitionImageQuality | undefined
): number {
  switch (quality) {
    case "excellent":
      return 8;

    case "good":
      return 4;

    case "acceptable":
      return 0;

    case "poor":
      return -18;

    default:
      return 0;
  }
}

function getKeywordScore(
  searchText: string,
  keywords: string[]
): {
  score: number;
  matchedKeywords: string[];
} {
  const matchedKeywords = keywords.filter((keyword) =>
    searchText.includes(normalizeText(keyword))
  );

  return {
    score: matchedKeywords.length * 18,
    matchedKeywords,
  };
}

function createGarmentCandidate(
  category: GarmentCategoryDefinition,
  searchText: string,
  input: PatternRecognitionInput
): RecognitionCandidate {
  let score = 20;
  const reasons: string[] = [];

  const keywords =
    genericGarmentKeywords[category.id] ?? [];

  const keywordResult = getKeywordScore(
    searchText,
    keywords
  );

  score += keywordResult.score;

  if (keywordResult.matchedKeywords.length > 0) {
    reasons.push(
      `Matched garment terms: ${keywordResult.matchedKeywords.join(
        ", "
      )}.`
    );
  }

  if (
    input.selectedGarmentCategoryId ===
    category.id
  ) {
    score += 45;

    reasons.push(
      "Matched the garment category selected in the active engineering dataset."
    );
  }

  if (
    searchText.includes(
      normalizeText(category.name.en)
    )
  ) {
    score += 25;

    reasons.push(
      `Matched the registered garment name ${category.name.en}.`
    );
  }

  score += getQualityAdjustment(
    input.imageQuality
  );

  if (input.imageQuality === "poor") {
    reasons.push(
      "Image quality reduced the recognition confidence."
    );
  }

  return {
    id: category.id,
    name: category.name.en,
    confidencePercent: clampConfidence(score),
    reasons,
  };
}

function createPatternPieceCandidate(
  piece: PatternPieceDefinition,
  searchText: string,
  input: PatternRecognitionInput,
  selectedGarmentCategoryId?: string
): RecognitionCandidate {
  let score = 12;
  const reasons: string[] = [];

  const keywords =
    genericPatternPieceKeywords[piece.id] ?? [
      piece.name.en,
      piece.slug,
      piece.code,
    ];

  const aliasKeywords = [
    piece.name.en,
    piece.slug,
    piece.code,
    ...piece.aliases.en
      .split(",")
      .map((alias) => alias.trim()),
  ];

  const keywordResult = getKeywordScore(
    searchText,
    [...keywords, ...aliasKeywords]
  );

  score += keywordResult.score;

  if (keywordResult.matchedKeywords.length > 0) {
    reasons.push(
      `Matched pattern-piece terms: ${[
        ...new Set(
          keywordResult.matchedKeywords
        ),
      ].join(", ")}.`
    );
  }

  if (
    input.expectedPatternPieceId === piece.id
  ) {
    score += 48;

    reasons.push(
      "Matched the pattern piece expected by the active engineering dataset."
    );
  }

  if (
    selectedGarmentCategoryId &&
    piece.applicableGarmentCategoryIds.includes(
      selectedGarmentCategoryId
    )
  ) {
    score += 18;

    reasons.push(
      "The pattern piece is registered for the recognised garment category."
    );
  }

  score += getQualityAdjustment(
    input.imageQuality
  );

  if (input.hasVisibleGrainLine) {
    score += 4;
    reasons.push(
      "A visible grain line supports engineering recognition."
    );
  }

  if (input.hasVisibleNotches) {
    score += 4;
    reasons.push(
      "Visible notches support pattern-piece verification."
    );
  }

  return {
    id: piece.id,
    name: piece.name.en,
    confidencePercent: clampConfidence(score),
    reasons,
  };
}

function sortCandidates(
  candidates: RecognitionCandidate[]
): RecognitionCandidate[] {
  return [...candidates].sort(
    (a, b) =>
      b.confidencePercent -
      a.confidencePercent
  );
}

function buildRecognitionSearchText(
  input: PatternRecognitionInput
): string {
  return normalizeText(
    [
      input.fileName,
      input.visibleText,
      input.operatorDescription,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function createWarnings(
  input: PatternRecognitionInput,
  garmentConfidence: number,
  patternConfidence: number
): string[] {
  const warnings: string[] = [];

  if (input.imageQuality === "poor") {
    warnings.push(
      "The uploaded image quality is poor. Retake the photograph from directly above with stronger lighting and a plain background."
    );
  }

  if (!input.hasScaleReference) {
    warnings.push(
      "No physical scale reference is confirmed. Real measurements and pattern area cannot be finalised until scale calibration is completed."
    );
  }

  if (!input.hasVisibleGrainLine) {
    warnings.push(
      "The grain line is not confirmed. Marker rotation and fabric-direction rules require engineering review."
    );
  }

  if (!input.hasVisibleNotches) {
    warnings.push(
      "Pattern notches are not confirmed. Sewing alignment and pattern-piece verification may require manual inspection."
    );
  }

  if (garmentConfidence < 65) {
    warnings.push(
      "Garment-category confidence is below the automatic approval level."
    );
  }

  if (patternConfidence < 65) {
    warnings.push(
      "Pattern-piece confidence is below the automatic approval level."
    );
  }

  return warnings;
}

function createRecommendations(
  input: PatternRecognitionInput,
  garmentConfidence: number,
  patternConfidence: number
): string[] {
  const recommendations: string[] = [];

  if (!input.hasScaleReference) {
    recommendations.push(
      "Place a 12-inch ruler or 30-centimetre scale beside the pattern and upload the image again."
    );
  }

  if (
    input.imageQuality === "poor" ||
    input.imageQuality === "acceptable"
  ) {
    recommendations.push(
      "Use a plain contrasting background and photograph the complete pattern from directly above."
    );
  }

  if (!input.hasVisibleGrainLine) {
    recommendations.push(
      "Mark or confirm the grain line before marker optimisation."
    );
  }

  if (garmentConfidence < 80) {
    recommendations.push(
      "Confirm the recognised garment category before continuing."
    );
  }

  if (patternConfidence < 80) {
    recommendations.push(
      "Confirm the recognised pattern piece before tracing and area calculation."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Recognition quality is suitable for the next engineering stage."
    );
  }

  return recommendations;
}

export function recognizePatternPiece(
  input: PatternRecognitionInput
): PatternRecognitionResult {
  const searchText =
    buildRecognitionSearchText(input);

  const garmentCandidates = sortCandidates(
    garmentCategoryMaster
      .filter((category) => category.active)
      .map((category) =>
        createGarmentCandidate(
          category,
          searchText,
          input
        )
      )
  );

  const bestGarmentCandidate =
    garmentCandidates[0];

  const recognizedGarmentCategory =
    bestGarmentCandidate
      ? getGarmentCategoryById(
          bestGarmentCandidate.id
        )
      : undefined;

  const patternPieceCandidates =
    sortCandidates(
      patternPieceMaster
        .filter((piece) => piece.active)
        .filter((piece) => {
          if (!recognizedGarmentCategory) {
            return true;
          }

          return (
            piece.applicableGarmentCategoryIds.includes(
              recognizedGarmentCategory.id
            ) ||
            input.expectedPatternPieceId ===
              piece.id
          );
        })
        .map((piece) =>
          createPatternPieceCandidate(
            piece,
            searchText,
            input,
            recognizedGarmentCategory?.id
          )
        )
    );

  const bestPatternCandidate =
    patternPieceCandidates[0];

  const recognizedPatternPiece =
    bestPatternCandidate
      ? getPatternPieceById(
          bestPatternCandidate.id
        )
      : undefined;

  const garmentConfidence =
    bestGarmentCandidate
      ?.confidencePercent ?? 0;

  const patternConfidence =
    bestPatternCandidate
      ?.confidencePercent ?? 0;

  const engineeringWarnings =
    createWarnings(
      input,
      garmentConfidence,
      patternConfidence
    );

  const engineeringRecommendations =
    createRecommendations(
      input,
      garmentConfidence,
      patternConfidence
    );

  let status: PatternRecognitionResult["status"] =
    "failed";

  if (
    recognizedGarmentCategory &&
    recognizedPatternPiece &&
    garmentConfidence >= 80 &&
    patternConfidence >= 80
  ) {
    status = "recognized";
  } else if (
    recognizedGarmentCategory ||
    recognizedPatternPiece
  ) {
    status = "review-required";
  }

  return {
    status,

    garmentCategoryId:
      recognizedGarmentCategory?.id,

    garmentCategoryCode:
      recognizedGarmentCategory?.code,

    garmentCategoryName:
      recognizedGarmentCategory?.name.en,

    garmentConfidencePercent:
      garmentConfidence,

    patternPieceId:
      recognizedPatternPiece?.id,

    patternPieceCode:
      recognizedPatternPiece?.code,

    patternPieceName:
      recognizedPatternPiece?.name.en,

    patternPieceConfidencePercent:
      patternConfidence,

    garmentCandidates:
      garmentCandidates.slice(0, 3),

    patternPieceCandidates:
      patternPieceCandidates.slice(0, 5),

    engineeringWarnings,
    engineeringRecommendations,

    whyAiAsks: {
      title:
        "Why does AI ask for the garment and pattern piece?",

      explanation:
        "The garment category and pattern-piece identity determine the expected quantity, grain direction, pairing rule, notch requirement and marker-placement controls.",

      engineeringImpact:
        "Incorrect recognition can create missing pieces, wrong cut quantities, unsuitable rotation, sewing imbalance and inaccurate fabric-consumption results.",
    },
  };
}