/**
 * OptiFabric AI
 * Global Demo 001
 *
 * Shared master-data types for:
 * - Garment categories
 * - Pattern pieces
 * - Engineering Demonstration Datasets
 * - Future factory datasets
 */

export type OptiFabricLanguageCode =
  | "en"
  | "bn"
  | "es"
  | "fr"
  | "de"
  | "ar"
  | "zh"
  | "ja"
  | "ko"
  | "hi"
  | "ur"
  | "ta"
  | "am"
  | "ti"
  | "sw"
  | "km"
  | "vi"
  | "id";

export type LocalizedText = {
  en: string;
  bn?: string;
  [languageCode: string]: string | undefined;
};

export type GarmentConstructionType =
  | "woven"
  | "knit"
  | "denim"
  | "mixed"
  | "non-apparel"
  | "other";

export type GarmentProductGroup =
  | "tops"
  | "bottoms"
  | "outerwear"
  | "dresses"
  | "sportswear"
  | "workwear"
  | "uniforms"
  | "childrenswear"
  | "ladieswear"
  | "menswear"
  | "lingerie"
  | "accessories"
  | "other";

export type PatternPieceSide =
  | "left"
  | "right"
  | "pair"
  | "centre"
  | "not-applicable";

export type PatternCutInstruction =
  | "cut-one"
  | "cut-one-pair"
  | "cut-two"
  | "cut-on-fold"
  | "cut-as-required";

export type GrainLineRequirement =
  | "required"
  | "recommended"
  | "not-required";

export type PatternPiecePlacementRule =
  | "one-way"
  | "two-way"
  | "nap-sensitive"
  | "stripe-sensitive"
  | "check-sensitive"
  | "directional-print-sensitive"
  | "unrestricted";

export type DatasetStatus =
  | "draft"
  | "validated"
  | "approved"
  | "archived";

export type DatasetPurpose =
  | "product-demonstration"
  | "engineering-validation"
  | "system-testing"
  | "ai-recognition-testing"
  | "marker-optimization-testing"
  | "user-training"
  | "customer-presentation"
  | "factory-onboarding"
  | "benchmark-comparison";

export type DatasetSourceType =
  | "engineering-demonstration"
  | "factory-upload"
  | "customer-training"
  | "benchmark"
  | "research";

export type FabricStructure =
  | "woven"
  | "knit"
  | "denim"
  | "nonwoven"
  | "mixed"
  | "other";

export type FabricPatternType =
  | "solid"
  | "stripe"
  | "check"
  | "directional-print"
  | "non-directional-print"
  | "nap"
  | "pile"
  | "other";

export type MeasurementUnit =
  | "mm"
  | "cm"
  | "inch"
  | "metre"
  | "square-centimetre"
  | "square-inch"
  | "square-metre";

export interface WhyAiAsksExplanation {
  title: LocalizedText;
  explanation: LocalizedText;
  engineeringImpact: LocalizedText;
}

export interface GarmentCategoryDefinition {
  id: string;
  code: string;
  slug: string;

  name: LocalizedText;
  shortName?: LocalizedText;
  description: LocalizedText;

  constructionType: GarmentConstructionType;
  productGroups: GarmentProductGroup[];

  defaultPatternPieceIds: string[];
  optionalPatternPieceIds: string[];

  supportsSizeRatioPlanning: boolean;
  supportsStripeMatching: boolean;
  supportsCheckMatching: boolean;
  supportsNapControl: boolean;
  supportsDirectionalPrintControl: boolean;

  active: boolean;
  sortOrder: number;

  whyAiAsks: WhyAiAsksExplanation;
}

export interface PatternPieceDefinition {
  id: string;
  code: string;
  slug: string;

  name: LocalizedText;
  aliases: LocalizedText;

  description: LocalizedText;

  applicableGarmentCategoryIds: string[];

  side: PatternPieceSide;
  cutInstruction: PatternCutInstruction;
  grainLineRequirement: GrainLineRequirement;

  defaultPlacementRules: PatternPiecePlacementRule[];

  canBeCutOnFold: boolean;
  canBeMirrored: boolean;
  requiresPairMatching: boolean;
  requiresNotchDetection: boolean;
  requiresDrillMarkDetection: boolean;

  active: boolean;
  sortOrder: number;

  whyAiAsks: WhyAiAsksExplanation;
}

export interface DatasetPatternPiece {
  id: string;

  patternPieceId: string;

  displayName?: LocalizedText;

  quantityPerGarment: number;

  cutInstruction?: PatternCutInstruction;
  side?: PatternPieceSide;

  sizeCode?: string;
  sourceFileName?: string;
  sourceFileUrl?: string;

  width?: number;
  height?: number;
  area?: number;

  dimensionUnit?: MeasurementUnit;
  areaUnit?: MeasurementUnit;

  rotationAllowed?: boolean;
  mirrorAllowed?: boolean;

  placementRules?: PatternPiecePlacementRule[];

  notes?: LocalizedText;
}

export interface DatasetFabricSpecification {
  fabricStructure: FabricStructure;
  fabricPatternType: FabricPatternType;

  fabricWidth: number;
  fabricWidthUnit: "inch" | "cm";

  referenceLayLength?: number;
  layLengthUnit?: "metre" | "yard";

  gsm?: number;
  thicknessMm?: number;

  shrinkageLengthPercent?: number;
  shrinkageWidthPercent?: number;

  usableWidthReduction?: number;
  usableWidthReductionUnit?: "inch" | "cm";

  fabricDescription?: LocalizedText;
}

export interface DatasetOrderPlan {
  orderQuantity: number;

  sizeRatio?: Record<string, number>;

  colours?: Array<{
    colourCode: string;
    colourName: LocalizedText;
    quantity: number;
  }>;

  plannedPlies?: number;
  bundleSize?: number;

  allowancePercent?: number;
}

export interface DatasetBenchmark {
  referenceMarkerLength?: number;
  referenceMarkerLengthUnit?: "metre" | "yard";

  referenceMarkerEfficiencyPercent?: number;
  referenceFabricConsumptionPerGarment?: number;
  referenceConsumptionUnit?: "metre" | "yard";

  targetMarkerEfficiencyPercent?: number;
  targetSavingsPercent?: number;

  notes?: LocalizedText;
}

export interface EngineeringDatasetDefinition {
  id: string;
  code: string;
  version: string;
  slug: string;

  name: LocalizedText;
  description: LocalizedText;

  garmentCategoryId: string;

  sourceType: DatasetSourceType;
  status: DatasetStatus;

  purposes: DatasetPurpose[];

  fabricSpecification: DatasetFabricSpecification;
  orderPlan: DatasetOrderPlan;

  patternPieces: DatasetPatternPiece[];

  benchmark?: DatasetBenchmark;

  tags: string[];

  active: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;

  whyAiAsks: WhyAiAsksExplanation;
}

export interface DatasetValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface DatasetValidationResult {
  valid: boolean;
  errors: DatasetValidationIssue[];
  warnings: DatasetValidationIssue[];
}