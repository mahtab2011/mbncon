/**
 * OptiFabric AI
 * RC5-003L-001 — Engineering Dictionary Core
 *
 * Purpose:
 * - Preserve approved garment and cutting-room terminology.
 * - Prevent AI translations from changing protected engineering terms.
 * - Provide one typed source of truth for all OptiFabric languages.
 * - Support future global language packs without modifying engineering engines.
 */

export type OptiFabricLanguageCode = "en" | "bn";

export type EngineeringTermKey =
  | "marker"
  | "markerLength"
  | "fabricWidth"
  | "grainLine"
  | "notch"
  | "bundle"
  | "lay"
  | "nesting"
  | "utilisation"
  | "waste"
  | "rollLength"
  | "collision"
  | "engineeringScore"
  | "recommended"
  | "confidence"
  | "pattern"
  | "patternPiece"
  | "patternQuantity"
  | "garmentQuantity"
  | "markerQuantity"
  | "markerSolution"
  | "markerEfficiency"
  | "fabricUtilisation"
  | "fabricWaste"
  | "endLoss"
  | "cuttingWaste"
  | "fabricConsumption"
  | "fabricSaving"
  | "markerWidth"
  | "availableWidth"
  | "usableWidth"
  | "pieceWidth"
  | "pieceHeight"
  | "pieceArea"
  | "rotation"
  | "orientation"
  | "placement"
  | "compaction"
  | "holeFilling"
  | "internalHole"
  | "emptySpace"
  | "occupiedSpace"
  | "boundary"
  | "polygon"
  | "vertex"
  | "geometry"
  | "boundingBox"
  | "perimeter"
  | "area"
  | "width"
  | "height"
  | "scale"
  | "scaleCalibration"
  | "pixelsPerCentimetre"
  | "cutLine"
  | "seamAllowance"
  | "foldLine"
  | "drillMark"
  | "stripeMatching"
  | "checkMatching"
  | "fabricRepeat"
  | "shadeLot"
  | "fabricRoll"
  | "layer"
  | "layHeight"
  | "bundleSize"
  | "orderQuantity"
  | "sizeRatio"
  | "collisionFree"
  | "validPlacement"
  | "invalidPlacement"
  | "recommendedSolution"
  | "bestSolution"
  | "selectedSolution"
  | "comparison"
  | "engineeringDecision"
  | "engineeringReady"
  | "aiRecommendation"
  | "aiConfidence"
  | "aiEngineeringConsultant"
  | "sequentialBatchSolver"
  | "automaticQuantityOptimisation"
  | "markerComparisonEngine"
  | "multiSolutionCanvas"
  // Step 4C/18 — fabric profile & production status vocabulary
  | "fabric"
  | "fabricType"
  | "fabricConstruction"
  | "fabricTypeDenim"
  | "fabricTypeCottonWoven"
  | "fabricTypePolyesterWoven"
  | "fabricTypeKnit"
  | "fabricTypeJacketOuterwear"
  | "fabricTypeWool"
  | "fabricTypeWoolBlend"
  | "fabricTypeCustom"
  | "productionConstraints"
  | "grainControl"
  | "required"
  | "notRequired"
  | "faceDirection"
  | "faceDirectionOneWay"
  | "nap"
  | "napPresent"
  | "napPresentOneWay"
  | "noNap"
  | "unknownRequiresConfirmation"
  | "directionalFabric"
  | "stretch"
  | "noStretch"
  | "widthwiseStretch"
  | "lengthwiseStretch"
  | "biStretch"
  | "allowableRotation"
  | "rotationZeroOnly"
  | "rotationZeroOneEighty"
  | "rotationAllAngles"
  | "shrinkage"
  | "lengthWarpShrinkage"
  | "widthWeftShrinkage"
  | "matchingRequirement"
  | "none"
  | "stripe"
  | "checkPlaid"
  | "printRepeat"
  | "usableFabricWidth"
  | "nominalFabricWidth"
  | "maximumCuttingTableLength"
  | "patternPiecesRequired"
  | "patternPiecesPlaced"
  | "markerUtilisation"
  | "productionSafe"
  | "productionReleased"
  | "engineeringReviewRequired"
  | "productionRejected"
  | "allPhysicalSafetyChecksPassed"
  | "requiredMarkerLength"
  | "availableTableLength"
  | "difference"
  | "markerExceedsTableLength"
  | "pieceCount"
  | "notSpecified"
  | "noLimitSet"
  | "fitsTable"
  | "exceedsTable"
  | "tableStatus"
  | "fabricConfirmationStatus"
  | "confirmed"
  | "requiresConfirmation"
  | "conservativeAssumptionActive"
  | "fabricProfileSummary"
  | "enforced"
  | "enforcedConservative"
  | "storedAdvisory"
  | "engineeringRelease"
  | "safety"
  | "efficiency"
  | "uniquePatternDefinitions"
  | "totalPiecesRequired"
  | "notIndependentlyGated"
  | "passed"
  | "failed"
  | "notGated"
  | "released"
  | "rejectedShort"
  | "reviewRequiredShort"
  | "awaitingPlacement"
  | "effectiveMarkerConstraints"
  | "permitted"
  | "grainLocked"
  | "directionLocked"
  | "totalPiecesPlaced"
  | "calculatedMarkerLength"
  | "requiredPieces"
  | "placedPieces"
  | "safetyChecksPassed"
  | "unsaved"
  | "saveFabricProfile"
  | "constructionWoven"
  | "constructionKnit"
  | "constructionOther"
  | "horizontalRepeat"
  | "verticalRepeat"
  | "repeatUnit"
  | "centimetres"
  | "inches"
  | "usableMarkerWidth"
  | "cmInternal"
  | "widthUnit"
  | "nominalRollWidth"
  | "customWidth"
  | "leftEdgeExclusion"
  | "rightEdgeExclusion"
  | "garmentsPerMarker"
  | "maximumCuttingTableMarkerLength"
  | "noLimitNotSpecified"
  | "fabricRollIntelligence"
  | "noLimitButton"
  | "edgeWidthLoss"
  | "finalDecision"
  | "selectedMarker"
  | "safetyScore"
  | "targetGap90"
  | "cuttingInstruction"
  | "engineeringReviewReasons"
  | "markerArea"
  | "placedPatternArea"
  | "grossWidthUtilisation"
  | "candidateTests"
  | "searchBudgetExhausted"
  | "collisionsLabel";

export interface EngineeringTermTranslation {
  readonly en: string;
  readonly bn: string;
}

export type EngineeringDictionary = Readonly<
  Record<EngineeringTermKey, EngineeringTermTranslation>
>;

export const engineeringDictionary: EngineeringDictionary = {
  marker: {
    en: "Marker",
    bn: "মার্কার",
  },

  markerLength: {
    en: "Marker Length",
    bn: "মার্কারের দৈর্ঘ্য",
  },

  fabricWidth: {
    en: "Fabric Width",
    bn: "কাপড়ের প্রস্থ",
  },

  grainLine: {
    en: "Grain Line",
    bn: "গ্রেইন লাইন",
  },

  notch: {
    en: "Notch",
    bn: "নচ",
  },

  bundle: {
    en: "Bundle",
    bn: "বান্ডেল",
  },

  lay: {
    en: "Lay",
    bn: "লে",
  },

  nesting: {
    en: "Nesting",
    bn: "নেস্টিং",
  },

  utilisation: {
    en: "Utilisation",
    bn: "ব্যবহার দক্ষতা",
  },

  waste: {
    en: "Waste",
    bn: "অপচয়",
  },

  rollLength: {
    en: "Roll Length",
    bn: "রোলের দৈর্ঘ্য",
  },

  collision: {
    en: "Collision",
    bn: "সংঘর্ষ",
  },

  engineeringScore: {
    en: "Engineering Score",
    bn: "ইঞ্জিনিয়ারিং স্কোর",
  },

  recommended: {
    en: "Recommended",
    bn: "AI সুপারিশ",
  },

  confidence: {
    en: "Confidence",
    bn: "AI নির্ভরযোগ্যতা",
  },

  pattern: {
    en: "Pattern",
    bn: "প্যাটার্ন",
  },

  patternPiece: {
    en: "Pattern Piece",
    bn: "প্যাটার্ন পিস",
  },

  patternQuantity: {
    en: "Pattern Quantity",
    bn: "প্যাটার্নের পরিমাণ",
  },

  garmentQuantity: {
    en: "Garment Quantity",
    bn: "পোশাকের পরিমাণ",
  },

  markerQuantity: {
    en: "Marker Quantity",
    bn: "মার্কারের সংখ্যা",
  },

  markerSolution: {
    en: "Marker Solution",
    bn: "মার্কার সমাধান",
  },

  markerEfficiency: {
    en: "Marker Efficiency",
    bn: "মার্কার দক্ষতা",
  },

  fabricUtilisation: {
    en: "Fabric Utilisation",
    bn: "কাপড় ব্যবহারের দক্ষতা",
  },

  fabricWaste: {
    en: "Fabric Waste",
    bn: "কাপড়ের অপচয়",
  },

  endLoss: {
    en: "End Loss",
    bn: "প্রান্তিক অপচয়",
  },

  cuttingWaste: {
    en: "Cutting Waste",
    bn: "কাটিং অপচয়",
  },

  fabricConsumption: {
    en: "Fabric Consumption",
    bn: "কাপড়ের ব্যবহার",
  },

  fabricSaving: {
    en: "Fabric Saving",
    bn: "কাপড় সাশ্রয়",
  },

  markerWidth: {
    en: "Marker Width",
    bn: "মার্কারের প্রস্থ",
  },

  availableWidth: {
    en: "Available Width",
    bn: "উপলভ্য প্রস্থ",
  },

  usableWidth: {
    en: "Usable Width",
    bn: "ব্যবহারযোগ্য প্রস্থ",
  },

  pieceWidth: {
    en: "Piece Width",
    bn: "পিসের প্রস্থ",
  },

  pieceHeight: {
    en: "Piece Height",
    bn: "পিসের উচ্চতা",
  },

  pieceArea: {
    en: "Piece Area",
    bn: "পিসের ক্ষেত্রফল",
  },

  rotation: {
    en: "Rotation",
    bn: "ঘূর্ণন",
  },

  orientation: {
    en: "Orientation",
    bn: "অভিমুখ",
  },

  placement: {
    en: "Placement",
    bn: "স্থাপন",
  },

  compaction: {
    en: "Compaction",
    bn: "ঘন বিন্যাস",
  },

  holeFilling: {
    en: "Hole Filling",
    bn: "খালি স্থান পূরণ",
  },

  internalHole: {
    en: "Internal Hole",
    bn: "অভ্যন্তরীণ খালি স্থান",
  },

  emptySpace: {
    en: "Empty Space",
    bn: "খালি স্থান",
  },

  occupiedSpace: {
    en: "Occupied Space",
    bn: "ব্যবহৃত স্থান",
  },

  boundary: {
    en: "Boundary",
    bn: "সীমানা",
  },

  polygon: {
    en: "Polygon",
    bn: "পলিগন",
  },

  vertex: {
    en: "Vertex",
    bn: "শীর্ষবিন্দু",
  },

  geometry: {
    en: "Geometry",
    bn: "জ্যামিতি",
  },

  boundingBox: {
    en: "Bounding Box",
    bn: "বাউন্ডিং বক্স",
  },

  perimeter: {
    en: "Perimeter",
    bn: "পরিসীমা",
  },

  area: {
    en: "Area",
    bn: "ক্ষেত্রফল",
  },

  width: {
    en: "Width",
    bn: "প্রস্থ",
  },

  height: {
    en: "Height",
    bn: "উচ্চতা",
  },

  scale: {
    en: "Scale",
    bn: "স্কেল",
  },

  scaleCalibration: {
    en: "Scale Calibration",
    bn: "স্কেল ক্যালিব্রেশন",
  },

  pixelsPerCentimetre: {
    en: "Pixels per Centimetre",
    bn: "প্রতি সেন্টিমিটারে পিক্সেল",
  },

  cutLine: {
    en: "Cut Line",
    bn: "কাট লাইন",
  },

  seamAllowance: {
    en: "Seam Allowance",
    bn: "সিম অ্যালাউন্স",
  },

  foldLine: {
    en: "Fold Line",
    bn: "ফোল্ড লাইন",
  },

  drillMark: {
    en: "Drill Mark",
    bn: "ড্রিল মার্ক",
  },

  stripeMatching: {
    en: "Stripe Matching",
    bn: "স্ট্রাইপ ম্যাচিং",
  },

  checkMatching: {
    en: "Check Matching",
    bn: "চেক ম্যাচিং",
  },

  fabricRepeat: {
    en: "Fabric Repeat",
    bn: "ফ্যাব্রিক রিপিট",
  },

  shadeLot: {
    en: "Shade Lot",
    bn: "শেড লট",
  },

  fabricRoll: {
    en: "Fabric Roll",
    bn: "কাপড়ের রোল",
  },

  layer: {
    en: "Layer",
    bn: "লেয়ার",
  },

  layHeight: {
    en: "Lay Height",
    bn: "লে-এর উচ্চতা",
  },

  bundleSize: {
    en: "Bundle Size",
    bn: "বান্ডেলের আকার",
  },

  orderQuantity: {
    en: "Order Quantity",
    bn: "অর্ডারের পরিমাণ",
  },

  sizeRatio: {
    en: "Size Ratio",
    bn: "সাইজ অনুপাত",
  },

  collisionFree: {
    en: "Collision-Free",
    bn: "সংঘর্ষমুক্ত",
  },

  validPlacement: {
    en: "Valid Placement",
    bn: "বৈধ স্থাপন",
  },

  invalidPlacement: {
    en: "Invalid Placement",
    bn: "অবৈধ স্থাপন",
  },

  recommendedSolution: {
    en: "Recommended Solution",
    bn: "AI সুপারিশকৃত সমাধান",
  },

  bestSolution: {
    en: "Best Solution",
    bn: "সেরা সমাধান",
  },

  selectedSolution: {
    en: "Selected Solution",
    bn: "নির্বাচিত সমাধান",
  },

  comparison: {
    en: "Comparison",
    bn: "তুলনা",
  },

  engineeringDecision: {
    en: "Engineering Decision",
    bn: "ইঞ্জিনিয়ারিং সিদ্ধান্ত",
  },

  engineeringReady: {
    en: "Engineering Ready",
    bn: "ইঞ্জিনিয়ারিং প্রস্তুত",
  },

  aiRecommendation: {
    en: "AI Recommendation",
    bn: "AI সুপারিশ",
  },

  aiConfidence: {
    en: "AI Confidence",
    bn: "AI নির্ভরযোগ্যতা",
  },

  aiEngineeringConsultant: {
    en: "AI Engineering Consultant",
    bn: "AI ইঞ্জিনিয়ারিং পরামর্শক",
  },

  sequentialBatchSolver: {
    en: "Sequential Batch Solver",
    bn: "ধারাবাহিক ব্যাচ সমাধান ইঞ্জিন",
  },

  automaticQuantityOptimisation: {
    en: "Automatic Marker Quantity Optimisation",
    bn: "স্বয়ংক্রিয় মার্কার সংখ্যা অপ্টিমাইজেশন",
  },

  markerComparisonEngine: {
    en: "Marker Comparison Engine",
    bn: "মার্কার তুলনা ইঞ্জিন",
  },

  multiSolutionCanvas: {
    en: "Multi-Solution Canvas",
    bn: "মাল্টি-সলিউশন ক্যানভাস",
  },

  /* ==========================================================================
   * Step 4C/18 — fabric profile & production status vocabulary
   * ========================================================================== */

  fabric: {
    en: "Fabric",
    bn: "কাপড়",
  },

  fabricType: {
    en: "Fabric Type",
    bn: "কাপড়ের ধরন",
  },

  fabricConstruction: {
    en: "Fabric Construction",
    bn: "কাপড়ের গঠন",
  },

  fabricTypeDenim: {
    en: "Denim",
    bn: "ডেনিম",
  },

  fabricTypeCottonWoven: {
    en: "Cotton Woven",
    bn: "কটন ওভেন",
  },

  fabricTypePolyesterWoven: {
    en: "Polyester Woven",
    bn: "পলিয়েস্টার ওভেন",
  },

  fabricTypeKnit: {
    en: "Knit",
    bn: "নিট",
  },

  fabricTypeJacketOuterwear: {
    en: "Jacket / Outerwear Fabric",
    bn: "জ্যাকেট / আউটারওয়্যার ফ্যাব্রিক",
  },

  fabricTypeWool: {
    en: "Wool",
    bn: "উল",
  },

  fabricTypeWoolBlend: {
    en: "Wool Blend",
    bn: "উল মিশ্রিত কাপড়",
  },

  fabricTypeCustom: {
    en: "Other / Custom",
    bn: "অন্যান্য / কাস্টম",
  },

  productionConstraints: {
    en: "Production Constraints",
    bn: "উৎপাদন সংক্রান্ত সীমাবদ্ধতা",
  },

  grainControl: {
    en: "Grain Control",
    bn: "গ্রেইন নিয়ন্ত্রণ",
  },

  required: {
    en: "Required",
    bn: "আবশ্যক",
  },

  notRequired: {
    en: "Not Required",
    bn: "আবশ্যক নয়",
  },

  faceDirection: {
    en: "Face Direction",
    bn: "কাপড়ের মুখের দিক",
  },

  faceDirectionOneWay: {
    en: "One-Way Face Direction",
    bn: "একমুখী ফেস ডিরেকশন",
  },

  nap: {
    en: "Nap",
    bn: "ন্যাপ (Nap)",
  },

  napPresent: {
    en: "Nap Present",
    bn: "ন্যাপ আছে",
  },

  napPresentOneWay: {
    en: "Nap Present — One Way",
    bn: "একমুখী ন্যাপ আছে",
  },

  noNap: {
    en: "No Nap",
    bn: "ন্যাপ নেই",
  },

  unknownRequiresConfirmation: {
    en: "Unknown",
    bn: "অনিশ্চিত / নিশ্চিত করা হয়নি",
  },

  directionalFabric: {
    en: "Directional Fabric",
    bn: "দিক-নির্ভর কাপড়",
  },

  stretch: {
    en: "Stretch",
    bn: "স্ট্রেচ",
  },

  noStretch: {
    en: "No Stretch",
    bn: "স্ট্রেচ নেই",
  },

  widthwiseStretch: {
    en: "Widthwise Stretch",
    bn: "প্রস্থের দিকে স্ট্রেচ",
  },

  lengthwiseStretch: {
    en: "Lengthwise Stretch",
    bn: "দৈর্ঘ্যের দিকে স্ট্রেচ",
  },

  biStretch: {
    en: "Bi-Stretch",
    bn: "দুই দিকে স্ট্রেচ",
  },

  allowableRotation: {
    en: "Allowable Rotation",
    bn: "অনুমোদিত ঘূর্ণন",
  },

  rotationZeroOnly: {
    en: "0° Only",
    bn: "শুধু ০°",
  },

  rotationZeroOneEighty: {
    en: "0° / 180°",
    bn: "০° / ১৮০°",
  },

  rotationAllAngles: {
    en: "0° / 90° / 180° / 270°",
    bn: "০° / ৯০° / ১৮০° / ২৭০°",
  },

  shrinkage: {
    en: "Shrinkage",
    bn: "সংকোচন",
  },

  lengthWarpShrinkage: {
    en: "Length / Warp Shrinkage",
    bn: "দৈর্ঘ্য / ওয়ার্প (Warp) সংকোচন",
  },

  widthWeftShrinkage: {
    en: "Width / Weft Shrinkage",
    bn: "প্রস্থ / ওয়েফট (Weft) সংকোচন",
  },

  matchingRequirement: {
    en: "Matching Requirement",
    bn: "ম্যাচিংয়ের প্রয়োজন",
  },

  none: {
    en: "None",
    bn: "নেই",
  },

  stripe: {
    en: "Stripe",
    bn: "স্ট্রাইপ",
  },

  checkPlaid: {
    en: "Check / Plaid",
    bn: "চেক / প্লেইড",
  },

  printRepeat: {
    en: "Print Repeat",
    bn: "প্রিন্ট রিপিট",
  },

  usableFabricWidth: {
    en: "Usable Fabric Width",
    bn: "ব্যবহারযোগ্য কাপড়ের প্রস্থ",
  },

  nominalFabricWidth: {
    en: "Nominal Fabric Width",
    bn: "কাপড়ের নামমাত্র প্রস্থ",
  },

  maximumCuttingTableLength: {
    en: "Maximum Cutting Table Length",
    bn: "কাটিং টেবিলের সর্বোচ্চ দৈর্ঘ্য",
  },

  patternPiecesRequired: {
    en: "Pattern Pieces Required",
    bn: "প্রয়োজনীয় প্যাটার্ন পিস",
  },

  patternPiecesPlaced: {
    en: "Pattern Pieces Placed",
    bn: "স্থাপন করা প্যাটার্ন পিস",
  },

  markerUtilisation: {
    en: "Marker Utilisation",
    bn: "মার্কার ইউটিলাইজেশন",
  },

  productionSafe: {
    en: "Production Safe",
    bn: "উৎপাদনের জন্য নিরাপদ",
  },

  productionReleased: {
    en: "Production Released",
    bn: "উৎপাদনের জন্য অনুমোদিত",
  },

  engineeringReviewRequired: {
    en: "Engineering Review Required",
    bn: "ইঞ্জিনিয়ারিং পর্যালোচনা প্রয়োজন",
  },

  productionRejected: {
    en: "Production Rejected",
    bn: "উৎপাদনের জন্য অনুমোদিত নয়",
  },

  allPhysicalSafetyChecksPassed: {
    en: "All Physical Safety Checks Passed",
    bn: "সকল ফিজিক্যাল সেফটি পরীক্ষা সফল হয়েছে",
  },

  requiredMarkerLength: {
    en: "Required Marker Length",
    bn: "প্রয়োজনীয় মার্কার দৈর্ঘ্য",
  },

  availableTableLength: {
    en: "Available Table Length",
    bn: "উপলব্ধ টেবিলের দৈর্ঘ্য",
  },

  difference: {
    en: "Difference",
    bn: "পার্থক্য",
  },

  markerExceedsTableLength: {
    en: "Marker Exceeds Available Cutting Table Length",
    bn: "মার্কারের প্রয়োজনীয় দৈর্ঘ্য উপলব্ধ কাটিং টেবিলের দৈর্ঘ্যের চেয়ে বেশি",
  },

  pieceCount: {
    en: "Piece Count",
    bn: "পিসের সংখ্যা",
  },

  notSpecified: {
    en: "Not Specified",
    bn: "নির্ধারিত নয়",
  },

  noLimitSet: {
    en: "No Limit Set",
    bn: "কোনো সীমা নির্ধারিত নয়",
  },

  fitsTable: {
    en: "Fits Table",
    bn: "টেবিলে ধরে",
  },

  exceedsTable: {
    en: "Exceeds Table",
    bn: "টেবিল অতিক্রম করে",
  },

  tableStatus: {
    en: "Table Status",
    bn: "টেবিলের অবস্থা",
  },

  fabricConfirmationStatus: {
    en: "Fabric Confirmation Status",
    bn: "কাপড়ের বৈশিষ্ট্য নিশ্চিতকরণের অবস্থা",
  },

  confirmed: {
    en: "Confirmed",
    bn: "নিশ্চিত",
  },

  requiresConfirmation: {
    en: "Requires Confirmation",
    bn: "নিশ্চিত করা প্রয়োজন",
  },

  conservativeAssumptionActive: {
    en: "Conservative Assumption Active",
    bn: "সতর্কতামূলক অনুমান সক্রিয়",
  },

  fabricProfileSummary: {
    en: "Fabric Profile Summary",
    bn: "কাপড়ের প্রোফাইল সারসংক্ষেপ",
  },

  enforced: {
    en: "Enforced",
    bn: "কার্যকরভাবে প্রয়োগকৃত",
  },

  enforcedConservative: {
    en: "Enforced (Conservative)",
    bn: "প্রয়োগকৃত (সতর্কতামূলক)",
  },

  storedAdvisory: {
    en: "Stored / Advisory",
    bn: "সংরক্ষিত / পরামর্শমূলক",
  },

  engineeringRelease: {
    en: "Engineering Release",
    bn: "ইঞ্জিনিয়ারিং অনুমোদন",
  },

  safety: {
    en: "Safety",
    bn: "সেফটি",
  },

  efficiency: {
    en: "Efficiency",
    bn: "এফিসিয়েন্সি",
  },

  uniquePatternDefinitions: {
    en: "Unique Pattern Definitions",
    bn: "ইউনিক প্যাটার্নের সংখ্যা",
  },

  totalPiecesRequired: {
    en: "Total Pieces Required",
    bn: "মোট প্রয়োজনীয় পিস",
  },

  notIndependentlyGated: {
    en: "Not Independently Gated",
    bn: "স্বাধীনভাবে যাচাই করা হয়নি",
  },

  passed: {
    en: "Passed",
    bn: "সফল হয়েছে",
  },

  failed: {
    en: "Failed",
    bn: "ব্যর্থ হয়েছে",
  },

  notGated: {
    en: "Not Gated",
    bn: "যাচাই করা হয়নি",
  },

  released: {
    en: "Released",
    bn: "অনুমোদিত",
  },

  rejectedShort: {
    en: "Rejected",
    bn: "প্রত্যাখ্যাত",
  },

  reviewRequiredShort: {
    en: "Review Required",
    bn: "পর্যালোচনা প্রয়োজন",
  },

  awaitingPlacement: {
    en: "Awaiting placement",
    bn: "স্থাপনের অপেক্ষায়",
  },

  permitted: {
    en: "Permitted",
    bn: "অনুমোদিত",
  },

  grainLocked: {
    en: "Grain-Locked",
    bn: "গ্রেইন-লকড",
  },

  directionLocked: {
    en: "Direction-Locked",
    bn: "দিক-লকড",
  },

  effectiveMarkerConstraints: {
    en: "Effective Marker Constraints",
    bn: "কার্যকর মার্কার সীমাবদ্ধতা",
  },

  totalPiecesPlaced: {
    en: "Total Pieces Placed",
    bn: "মোট স্থাপিত পিস",
  },

  calculatedMarkerLength: {
    en: "Calculated Marker Length",
    bn: "হিসাবকৃত মার্কারের দৈর্ঘ্য",
  },

  requiredPieces: {
    en: "Required Pieces",
    bn: "প্রয়োজনীয় পিস",
  },

  placedPieces: {
    en: "Placed Pieces",
    bn: "স্থাপিত পিস",
  },

  safetyChecksPassed: {
    en: "Safety Checks Passed",
    bn: "সেফটি পরীক্ষা সফল",
  },

  unsaved: {
    en: "Unsaved",
    bn: "সংরক্ষিত হয়নি",
  },

  saveFabricProfile: {
    en: "Save Fabric Profile",
    bn: "কাপড়ের প্রোফাইল সংরক্ষণ করুন",
  },

  constructionWoven: {
    en: "Woven",
    bn: "ওভেন",
  },

  constructionKnit: {
    en: "Knit",
    bn: "নিট",
  },

  constructionOther: {
    en: "Other",
    bn: "অন্যান্য",
  },

  horizontalRepeat: {
    en: "Horizontal Repeat",
    bn: "অনুভূমিক রিপিট",
  },

  verticalRepeat: {
    en: "Vertical Repeat",
    bn: "উলম্ব রিপিট",
  },

  repeatUnit: {
    en: "Repeat Unit",
    bn: "রিপিট একক",
  },

  centimetres: {
    en: "Centimetres",
    bn: "সেন্টিমিটার",
  },

  inches: {
    en: "Inches",
    bn: "ইঞ্চি",
  },

  usableMarkerWidth: {
    en: "Usable Marker Width",
    bn: "ব্যবহারযোগ্য মার্কার প্রস্থ",
  },

  cmInternal: {
    en: "cm internal",
    bn: "সেমি (অভ্যন্তরীণ)",
  },

  widthUnit: {
    en: "Width Unit",
    bn: "প্রস্থের একক",
  },

  nominalRollWidth: {
    en: "Nominal Roll Width",
    bn: "কাপড়ের রোলের নামমাত্র প্রস্থ",
  },

  customWidth: {
    en: "Custom Width",
    bn: "কাস্টম প্রস্থ",
  },

  leftEdgeExclusion: {
    en: "Left Edge Exclusion",
    bn: "বাম প্রান্ত বাদ",
  },

  rightEdgeExclusion: {
    en: "Right Edge Exclusion",
    bn: "ডান প্রান্ত বাদ",
  },

  garmentsPerMarker: {
    en: "Garments per Marker",
    bn: "প্রতি মার্কারে পোশাকের সংখ্যা",
  },

  maximumCuttingTableMarkerLength: {
    en: "Maximum Cutting Table / Marker Length (m)",
    bn: "কাটিং টেবিল / মার্কারের সর্বোচ্চ দৈর্ঘ্য (মিটার)",
  },

  noLimitNotSpecified: {
    en: "No Limit / Not Specified",
    bn: "কোনো সীমা নেই / নির্ধারিত নয়",
  },

  fabricRollIntelligence: {
    en: "Fabric Roll Intelligence",
    bn: "কাপড়ের রোল বিশ্লেষণ",
  },

  noLimitButton: {
    en: "No Limit",
    bn: "কোনো সীমা নেই",
  },

  edgeWidthLoss: {
    en: "Edge Width Loss",
    bn: "প্রান্তে প্রস্থ ক্ষতি",
  },

  finalDecision: {
    en: "Final Decision",
    bn: "চূড়ান্ত সিদ্ধান্ত",
  },

  selectedMarker: {
    en: "Selected Marker",
    bn: "নির্বাচিত মার্কার",
  },

  safetyScore: {
    en: "Safety Score",
    bn: "সেফটি স্কোর",
  },

  targetGap90: {
    en: "90% Target Gap",
    bn: "৯০% লক্ষ্যমাত্রার ব্যবধান",
  },

  cuttingInstruction: {
    en: "Cutting Instruction",
    bn: "কাটিং নির্দেশনা",
  },

  engineeringReviewReasons: {
    en: "Engineering Review Reasons",
    bn: "ইঞ্জিনিয়ারিং পর্যালোচনার কারণ",
  },

  markerArea: {
    en: "Marker Area",
    bn: "মার্কারের ক্ষেত্রফল",
  },

  placedPatternArea: {
    en: "Placed Pattern Area",
    bn: "স্থাপিত প্যাটার্নের ক্ষেত্রফল",
  },

  grossWidthUtilisation: {
    en: "Gross-Width Utilisation",
    bn: "মোট-প্রস্থ ইউটিলাইজেশন",
  },

  candidateTests: {
    en: "Candidate Tests",
    bn: "প্রার্থী পরীক্ষা",
  },

  searchBudgetExhausted: {
    en: "Search Budget Exhausted",
    bn: "অনুসন্ধান বাজেট শেষ",
  },

  collisionsLabel: {
    en: "Collisions",
    bn: "সংঘর্ষ",
  },
} as const;

/**
 * Returns the approved engineering term for a selected language.
 *
 * This must be the standard resolver used by UI components,
 * reports and AI engineering explanations.
 */
export function getEngineeringTerm(
  key: EngineeringTermKey,
  language: OptiFabricLanguageCode = "en",
): string {
  const term = engineeringDictionary[key];

  if (!term) {
    return key;
  }

  return term[language] ?? term.en;
}

/**
 * Returns both approved translations for administration,
 * dictionary review and future language management screens.
 */
export function getEngineeringTermRecord(
  key: EngineeringTermKey,
): EngineeringTermTranslation {
  return engineeringDictionary[key];
}

/**
 * Confirms whether a value is a registered engineering term key.
 */
export function isEngineeringTermKey(
  value: string,
): value is EngineeringTermKey {
  return Object.prototype.hasOwnProperty.call(engineeringDictionary, value);
}

/**
 * Returns every registered engineering term key.
 */
export function getEngineeringTermKeys(): EngineeringTermKey[] {
  return Object.keys(engineeringDictionary) as EngineeringTermKey[];
}

/**
 * Returns all approved terms for one language.
 */
export function getEngineeringTermsByLanguage(
  language: OptiFabricLanguageCode,
): Readonly<Record<EngineeringTermKey, string>> {
  return getEngineeringTermKeys().reduce(
    (result, key) => {
      result[key] = getEngineeringTerm(key, language);
      return result;
    },
    {} as Record<EngineeringTermKey, string>,
  );
}

/**
 * Produces an immutable glossary that may be supplied to an AI prompt.
 *
 * The AI must be instructed to reproduce these terms exactly and must not
 * translate, paraphrase or replace them.
 */
export function getProtectedEngineeringGlossary(
  language: OptiFabricLanguageCode,
): ReadonlyArray<{
  key: EngineeringTermKey;
  source: string;
  approved: string;
}> {
  return getEngineeringTermKeys().map((key) => ({
    key,
    source: engineeringDictionary[key].en,
    approved: getEngineeringTerm(key, language),
  }));
}

/**
 * Generates a compact protected-term instruction for the
 * OptiFabric AI Engineering Consultant.
 */
export function createEngineeringTerminologyInstruction(
  language: OptiFabricLanguageCode,
): string {
  const glossary = getProtectedEngineeringGlossary(language);

  const protectedTerms = glossary
    .map(({ source, approved }) => `${source} = ${approved}`)
    .join("; ");

  return [
    "Use the following approved OptiFabric engineering terminology exactly.",
    "Never translate, paraphrase, shorten or replace these protected terms.",
    "You may translate the surrounding explanation naturally.",
    protectedTerms,
  ].join(" ");
}