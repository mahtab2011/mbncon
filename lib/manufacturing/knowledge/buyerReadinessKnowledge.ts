export type BuyerReadinessCategory =
  | "QUALITY"
  | "SOCIAL"
  | "ENVIRONMENT"
  | "CHEMICAL"
  | "TRACEABILITY"
  | "DOCUMENTATION";

export interface BuyerReadinessKnowledge {
  code: string;

  category: BuyerReadinessCategory;

  assessmentItem: string;

  scoringWeight: number;

  minimumPassingScore: number;

  evidenceRequired: string[];

  aiRecommendation: string;

  responsibleDepartment: string;

  version: string;

  lastReviewed: string;

  isActive: boolean;
}

export const buyerReadinessKnowledgeLibrary: BuyerReadinessKnowledge[] = [
  {
    code: "BRA001",

    category: "QUALITY",

    assessmentItem:
      "Quality Management System",

    scoringWeight: 20,

    minimumPassingScore: 16,

    evidenceRequired: [
      "Quality Manual",
      "AQL Records",
      "Corrective Action Reports",
    ],

    aiRecommendation:
      "Review internal quality audit performance monthly.",

    responsibleDepartment: "QUALITY",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "BRA002",

    category: "CHEMICAL",

    assessmentItem:
      "Chemical Compliance",

    scoringWeight: 20,

    minimumPassingScore: 16,

    evidenceRequired: [
      "ZDHC Documents",
      "MRSL Reports",
      "Chemical Inventory",
    ],

    aiRecommendation:
      "Maintain complete chemical documentation and supplier approvals.",

    responsibleDepartment: "COMPLIANCE",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "BRA003",

    category: "ENVIRONMENT",

    assessmentItem:
      "Environmental Performance",

    scoringWeight: 20,

    minimumPassingScore: 16,

    evidenceRequired: [
      "Carbon Report",
      "Water Report",
      "Waste Report",
      "Energy Report",
    ],

    aiRecommendation:
      "Track monthly sustainability KPIs and investigate negative trends.",

    responsibleDepartment: "SUSTAINABILITY",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },
];