export type FactoryKnowledgePackType =
  | "GLOBAL_STANDARD"
  | "FACTORY_CUSTOM"
  | "BUYER_SPECIFIC"
  | "COMPLIANCE_SPECIFIC"
  | "SUSTAINABILITY_SPECIFIC";

export interface FactoryKnowledgePack {
  packId: string;

  factoryId: string;

  factoryName: string;

  packName: string;

  packType: FactoryKnowledgePackType;

  description: string;

  applicableDepartments: string[];

  knowledgeLibraries: string[];

  effectiveFrom: string;

  effectiveTo?: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const factoryKnowledgePackLibrary: FactoryKnowledgePack[] = [
  {
    packId: "FKP001",

    factoryId: "GLOBAL",

    factoryName: "Global Apparel Factory Standard",

    packName: "Global Manufacturing Knowledge Pack",

    packType: "GLOBAL_STANDARD",

    description:
      "Default global manufacturing knowledge pack used as baseline for all factories.",

    applicableDepartments: [
      "CUTTING",
      "SEWING",
      "FINISHING",
      "QUALITY",
      "MAINTENANCE",
      "WAREHOUSE",
    ],

    knowledgeLibraries: [
      "defectMasterLibrary",
      "fabricDefectLibrary",
      "measurementPointLibrary",
      "operationSOPLibrary",
      "machinePreventiveMaintenanceLibrary",
    ],

    effectiveFrom: "2026-06-27",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    packId: "FKP002",

    factoryId: "FACTORY_DEMO_001",

    factoryName: "Demo Knit Garment Factory",

    packName: "Knitwear Factory Knowledge Pack",

    packType: "FACTORY_CUSTOM",

    description:
      "Factory-specific knowledge pack for knitwear operations, quality and maintenance.",

    applicableDepartments: [
      "CUTTING",
      "SEWING",
      "FINISHING",
      "QUALITY",
    ],

    knowledgeLibraries: [
      "defectMasterLibrary",
      "fabricDefectLibrary",
      "measurementPointLibrary",
      "activitySamplingRulesLibrary",
      "timeStudyElementLibrary",
    ],

    effectiveFrom: "2026-06-27",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];