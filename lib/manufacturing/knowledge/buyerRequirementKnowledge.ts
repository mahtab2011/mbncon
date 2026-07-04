export type BuyerRequirementCategory =
  | "QUALITY"
  | "COMPLIANCE"
  | "SUSTAINABILITY"
  | "PACKAGING"
  | "DOCUMENTATION"
  | "DELIVERY"
  | "TRACEABILITY";

export interface BuyerRequirementKnowledge {
  code: string;

  buyerName: string;

  category: BuyerRequirementCategory;

  requirementTitle: string;

  requirementDescription: string;

  evidenceRequired: string[];

  factoryRiskIfMissed: string;

  aiRecommendation: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const buyerRequirementKnowledgeLibrary: BuyerRequirementKnowledge[] = [
  {
    code: "BR001",

    buyerName: "Global Buyer Standard",

    category: "QUALITY",

    requirementTitle: "Final Inspection Readiness",

    requirementDescription:
      "Factory must ensure goods are fully completed, packed and internally checked before buyer final inspection.",

    evidenceRequired: [
      "Internal final inspection report",
      "Packing list",
      "AQL report",
    ],

    factoryRiskIfMissed:
      "Buyer inspection failure, shipment delay and possible chargeback.",

    aiRecommendation:
      "Run internal final audit before requesting buyer inspection.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "BR002",

    buyerName: "Global Buyer Standard",

    category: "SUSTAINABILITY",

    requirementTitle: "Environmental Data Availability",

    requirementDescription:
      "Factory should maintain records of energy, water, chemical and waste data for sustainability review.",

    evidenceRequired: [
      "Energy records",
      "Water records",
      "Chemical inventory",
      "Waste disposal records",
    ],

    factoryRiskIfMissed:
      "Factory may lose sustainability score or fail buyer review.",

    aiRecommendation:
      "Maintain monthly sustainability evidence file.",
      
    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];