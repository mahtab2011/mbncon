export type ChemicalManagementCategory =
  | "ZDHC"
  | "MRSL"
  | "RSL"
  | "CHEMICAL_STORAGE"
  | "SDS"
  | "CHEMICAL_HANDLING"
  | "SPILL_RESPONSE";

export interface ChemicalManagementKnowledge {
  code: string;

  category: ChemicalManagementCategory;

  title: string;

  description: string;

  improvementMethods: string[];

  evidenceRequired: string[];

  kpi: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const chemicalManagementKnowledgeLibrary: ChemicalManagementKnowledge[] = [
  {
    code: "CM001",

    category: "ZDHC",

    title: "ZDHC Chemical Compliance",

    description:
      "Ensure chemicals used in manufacturing comply with ZDHC requirements.",

    improvementMethods: [
      "Purchase approved chemicals",
      "Review supplier declarations",
      "Maintain chemical inventory",
    ],

    evidenceRequired: [
      "ZDHC conformance certificate",
      "Supplier declaration",
      "Chemical inventory",
    ],

    kpi: "ZDHC compliant chemicals (%)",

    aiRecommendation:
      "Review chemical inventory monthly and replace non-conforming products.",

    responsibleDepartment: "COMPLIANCE",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "CM002",

    category: "MRSL",

    title: "Manufacturing Restricted Substances List",

    description:
      "Verify chemicals do not contain restricted manufacturing substances.",

    improvementMethods: [
      "Screen incoming chemicals",
      "Approve suppliers",
      "Conduct laboratory testing",
    ],

    evidenceRequired: [
      "MRSL test report",
      "Supplier approval",
      "Laboratory report",
    ],

    kpi: "MRSL compliance (%)",

    aiRecommendation:
      "Only procure chemicals supported by valid MRSL documentation.",

    responsibleDepartment: "LAB",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "CM003",

    category: "CHEMICAL_STORAGE",

    title: "Safe Chemical Storage",

    description:
      "Store chemicals safely with correct segregation, labeling and spill prevention.",

    improvementMethods: [
      "Label all containers",
      "Provide spill kits",
      "Separate incompatible chemicals",
    ],

    evidenceRequired: [
      "Storage inspection checklist",
      "SDS availability",
      "Warehouse audit report",
    ],

    kpi: "Storage compliance score",

    aiRecommendation:
      "Conduct weekly chemical storage inspections and maintain up-to-date Safety Data Sheets.",

    responsibleDepartment: "WAREHOUSE",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];