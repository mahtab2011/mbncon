import {
  DatasetValidationIssue,
  DatasetValidationResult,
  EngineeringDatasetDefinition,
} from "./optifabricMasterTypes";

import { getGarmentCategoryById } from "./garmentCategoryMaster";
import { getPatternPieceById } from "./patternPieceMaster";

export const engineeringDatasetMaster: EngineeringDatasetDefinition[] = [
  {
    id: "dataset-eds-001",
    code: "EDS-001",
    version: "1.0.0",
    slug: "eds-001-mens-basic-shirt",

    name: {
      en: "EDS-001 – Men's Basic Shirt",
      bn: "EDS-001 – পুরুষদের বেসিক শার্ট",
    },

    description: {
      en: "A professionally structured engineering demonstration dataset for validating the complete OptiFabric AI pattern, marker, lay-planning, consumption and reporting workflow.",
      bn: "OptiFabric AI-এর সম্পূর্ণ প্যাটার্ন, মার্কার, লে পরিকল্পনা, ফেব্রিক কনজাম্পশন এবং রিপোর্টিং কার্যপ্রবাহ যাচাইয়ের জন্য একটি পেশাদারভাবে প্রস্তুত ইঞ্জিনিয়ারিং ডেমোনস্ট্রেশন ডেটাসেট।",
    },

    garmentCategoryId: "garment-mens-basic-shirt",

    sourceType: "engineering-demonstration",
    status: "validated",

    purposes: [
      "product-demonstration",
      "engineering-validation",
      "system-testing",
      "ai-recognition-testing",
      "marker-optimization-testing",
      "user-training",
      "customer-presentation",
      "factory-onboarding",
      "benchmark-comparison",
    ],

    fabricSpecification: {
      fabricStructure: "woven",
      fabricPatternType: "solid",

      fabricWidth: 60,
      fabricWidthUnit: "inch",

      referenceLayLength: 2.4,
      layLengthUnit: "metre",

      fabricDescription: {
        en: "Reference woven shirting fabric for engineering demonstration.",
        bn: "ইঞ্জিনিয়ারিং প্রদর্শনের জন্য রেফারেন্স ওভেন শার্টিং ফেব্রিক।",
      },
    },

    orderPlan: {
      orderQuantity: 1200,

      sizeRatio: {
        S: 1,
        M: 2,
        L: 2,
        XL: 1,
      },

      plannedPlies: 100,
      bundleSize: 20,

      allowancePercent: 2,
    },

    patternPieces: [
      {
        id: "eds-001-piece-001",
        patternPieceId: "piece-shirt-front",
        quantityPerGarment: 2,
        side: "pair",
        cutInstruction: "cut-one-pair",
        rotationAllowed: true,
        mirrorAllowed: true,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-002",
        patternPieceId: "piece-shirt-back",
        quantityPerGarment: 1,
        side: "centre",
        cutInstruction: "cut-one",
        rotationAllowed: true,
        mirrorAllowed: false,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-003",
        patternPieceId: "piece-left-sleeve",
        quantityPerGarment: 1,
        side: "left",
        cutInstruction: "cut-one",
        rotationAllowed: true,
        mirrorAllowed: true,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-004",
        patternPieceId: "piece-right-sleeve",
        quantityPerGarment: 1,
        side: "right",
        cutInstruction: "cut-one",
        rotationAllowed: true,
        mirrorAllowed: true,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-005",
        patternPieceId: "piece-shirt-collar",
        quantityPerGarment: 2,
        side: "centre",
        cutInstruction: "cut-two",
        rotationAllowed: true,
        mirrorAllowed: false,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-006",
        patternPieceId: "piece-shirt-collar-stand",
        quantityPerGarment: 2,
        side: "centre",
        cutInstruction: "cut-two",
        rotationAllowed: true,
        mirrorAllowed: false,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-007",
        patternPieceId: "piece-shirt-pocket",
        quantityPerGarment: 1,
        side: "not-applicable",
        cutInstruction: "cut-one",
        rotationAllowed: true,
        mirrorAllowed: false,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-008",
        patternPieceId: "piece-shirt-cuff",
        quantityPerGarment: 2,
        side: "pair",
        cutInstruction: "cut-two",
        rotationAllowed: true,
        mirrorAllowed: true,
        placementRules: ["two-way"],
      },

      {
        id: "eds-001-piece-009",
        patternPieceId: "piece-shirt-facing",
        quantityPerGarment: 2,
        side: "pair",
        cutInstruction: "cut-one-pair",
        rotationAllowed: true,
        mirrorAllowed: true,
        placementRules: ["two-way"],
      },
    ],

    benchmark: {
      referenceMarkerLength: 2.4,
      referenceMarkerLengthUnit: "metre",

      targetMarkerEfficiencyPercent: 82,
      targetSavingsPercent: 3,

      notes: {
        en: "The initial marker length is a reference value. Final efficiency and consumption will be calculated after pattern dimensions and traced polygon areas are available.",
        bn: "প্রাথমিক মার্কার দৈর্ঘ্য একটি রেফারেন্স মান। প্যাটার্নের মাপ এবং ট্রেস করা পলিগন এরিয়া পাওয়া গেলে চূড়ান্ত দক্ষতা ও কনজাম্পশন হিসাব করা হবে।",
      },
    },

    tags: [
      "EDS-001",
      "mens-shirt",
      "woven",
      "engineering-demonstration",
      "marker-testing",
      "training",
    ],

    active: true,
    sortOrder: 10,

    createdAt: "2026-07-25T00:00:00.000Z",
    updatedAt: "2026-07-25T00:00:00.000Z",

    whyAiAsks: {
      title: {
        en: "Why does AI ask for an engineering dataset?",
        bn: "AI কেন ইঞ্জিনিয়ারিং ডেটাসেট জানতে চায়?",
      },

      explanation: {
        en: "The dataset combines garment type, pattern pieces, fabric specifications, order quantity and engineering benchmark information in one controlled record.",
        bn: "ডেটাসেটটি পোশাকের ধরন, প্যাটার্ন পিস, ফেব্রিক স্পেসিফিকেশন, অর্ডার পরিমাণ এবং ইঞ্জিনিয়ারিং বেঞ্চমার্ক তথ্যকে একটি নিয়ন্ত্রিত রেকর্ডে একত্র করে।",
      },

      engineeringImpact: {
        en: "A complete dataset allows AI to calculate piece requirements, marker plans, lay quantities, fabric consumption, efficiency and potential savings consistently.",
        bn: "একটি সম্পূর্ণ ডেটাসেট AI-কে ধারাবাহিকভাবে পিসের প্রয়োজন, মার্কার পরিকল্পনা, লে পরিমাণ, ফেব্রিক কনজাম্পশন, দক্ষতা এবং সম্ভাব্য সাশ্রয় হিসাব করতে সাহায্য করে।",
      },
    },
  },
];

export const plannedEngineeringDatasets = [
  {
    code: "EDS-002",
    garmentCategoryId: "garment-basic-trouser",
    name: "Basic Trouser",
    status: "planned",
  },
  {
    code: "EDS-003",
    garmentCategoryId: "garment-polo-shirt",
    name: "Polo Shirt",
    status: "planned",
  },
  {
    code: "EDS-004",
    garmentCategoryId: "garment-basic-jacket",
    name: "Basic Jacket",
    status: "planned",
  },
] as const;

export function getActiveEngineeringDatasets(): EngineeringDatasetDefinition[] {
  return engineeringDatasetMaster
    .filter((dataset) => dataset.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getEngineeringDatasetById(
  id: string
): EngineeringDatasetDefinition | undefined {
  return engineeringDatasetMaster.find((dataset) => dataset.id === id);
}

export function getEngineeringDatasetByCode(
  code: string
): EngineeringDatasetDefinition | undefined {
  return engineeringDatasetMaster.find(
    (dataset) => dataset.code.toLowerCase() === code.toLowerCase()
  );
}

export function getEngineeringDatasetBySlug(
  slug: string
): EngineeringDatasetDefinition | undefined {
  return engineeringDatasetMaster.find(
    (dataset) => dataset.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getDatasetsForGarmentCategory(
  garmentCategoryId: string
): EngineeringDatasetDefinition[] {
  return engineeringDatasetMaster
    .filter(
      (dataset) =>
        dataset.active &&
        dataset.garmentCategoryId === garmentCategoryId
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function validateEngineeringDataset(
  dataset: EngineeringDatasetDefinition
): DatasetValidationResult {
  const errors: DatasetValidationIssue[] = [];
  const warnings: DatasetValidationIssue[] = [];

  if (!dataset.id.trim()) {
    errors.push({
      field: "id",
      message: "Dataset ID is required.",
      severity: "error",
    });
  }

  if (!dataset.code.trim()) {
    errors.push({
      field: "code",
      message: "Dataset code is required.",
      severity: "error",
    });
  }

  const garmentCategory = getGarmentCategoryById(
    dataset.garmentCategoryId
  );

  if (!garmentCategory) {
    errors.push({
      field: "garmentCategoryId",
      message: `Unknown garment category: ${dataset.garmentCategoryId}`,
      severity: "error",
    });
  }

  if (dataset.fabricSpecification.fabricWidth <= 0) {
    errors.push({
      field: "fabricSpecification.fabricWidth",
      message: "Fabric width must be greater than zero.",
      severity: "error",
    });
  }

  if (dataset.orderPlan.orderQuantity <= 0) {
    errors.push({
      field: "orderPlan.orderQuantity",
      message: "Order quantity must be greater than zero.",
      severity: "error",
    });
  }

  if (dataset.patternPieces.length === 0) {
    errors.push({
      field: "patternPieces",
      message: "At least one pattern piece is required.",
      severity: "error",
    });
  }

  const datasetPieceIds = new Set<string>();

  dataset.patternPieces.forEach((datasetPiece, index) => {
    if (datasetPieceIds.has(datasetPiece.id)) {
      errors.push({
        field: `patternPieces[${index}].id`,
        message: `Duplicate dataset pattern-piece ID: ${datasetPiece.id}`,
        severity: "error",
      });
    }

    datasetPieceIds.add(datasetPiece.id);

    const patternPiece = getPatternPieceById(
      datasetPiece.patternPieceId
    );

    if (!patternPiece) {
      errors.push({
        field: `patternPieces[${index}].patternPieceId`,
        message: `Unknown pattern-piece ID: ${datasetPiece.patternPieceId}`,
        severity: "error",
      });

      return;
    }

    if (
      garmentCategory &&
      !patternPiece.applicableGarmentCategoryIds.includes(
        garmentCategory.id
      )
    ) {
      warnings.push({
        field: `patternPieces[${index}].patternPieceId`,
        message:
          `${patternPiece.name.en} is not currently registered for ` +
          `${garmentCategory.name.en}.`,
        severity: "warning",
      });
    }

    if (datasetPiece.quantityPerGarment <= 0) {
      errors.push({
        field: `patternPieces[${index}].quantityPerGarment`,
        message: `${patternPiece.name.en} must have a quantity greater than zero.`,
        severity: "error",
      });
    }

    if (
      datasetPiece.area !== undefined &&
      datasetPiece.area <= 0
    ) {
      errors.push({
        field: `patternPieces[${index}].area`,
        message: `${patternPiece.name.en} area must be greater than zero.`,
        severity: "error",
      });
    }

    if (
      datasetPiece.area !== undefined &&
      !datasetPiece.areaUnit
    ) {
      warnings.push({
        field: `patternPieces[${index}].areaUnit`,
        message: `${patternPiece.name.en} has an area but no area unit.`,
        severity: "warning",
      });
    }
  });

  if (garmentCategory) {
    const includedPatternPieceIds = new Set(
      dataset.patternPieces.map((piece) => piece.patternPieceId)
    );

    garmentCategory.defaultPatternPieceIds.forEach(
      (requiredPatternPieceId) => {
        if (!includedPatternPieceIds.has(requiredPatternPieceId)) {
          const missingPiece =
            getPatternPieceById(requiredPatternPieceId);

          warnings.push({
            field: "patternPieces",
            message:
              `${missingPiece?.name.en ?? requiredPatternPieceId} ` +
              `is registered as a standard piece for ` +
              `${garmentCategory.name.en} but is missing from this dataset.`,
            severity: "warning",
          });
        }
      }
    );
  }

  const sizeRatio = dataset.orderPlan.sizeRatio;

  if (sizeRatio) {
    const ratioTotal = Object.values(sizeRatio).reduce(
      (total, ratioValue) => total + ratioValue,
      0
    );

    if (ratioTotal <= 0) {
      errors.push({
        field: "orderPlan.sizeRatio",
        message: "The size-ratio total must be greater than zero.",
        severity: "error",
      });
    }
  } else {
    warnings.push({
      field: "orderPlan.sizeRatio",
      message:
        "No size ratio has been entered. Size-ratio marker planning will be unavailable.",
      severity: "warning",
    });
  }

  if (
    dataset.fabricSpecification.referenceLayLength === undefined
  ) {
    warnings.push({
      field: "fabricSpecification.referenceLayLength",
      message:
        "No reference lay length has been entered.",
      severity: "warning",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateAllEngineeringDatasets(): Array<{
  datasetCode: string;
  result: DatasetValidationResult;
}> {
  return engineeringDatasetMaster.map((dataset) => ({
    datasetCode: dataset.code,
    result: validateEngineeringDataset(dataset),
  }));
}