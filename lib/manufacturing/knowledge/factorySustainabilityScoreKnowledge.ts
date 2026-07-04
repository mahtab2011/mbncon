export type SustainabilityScoreCategory =
  | "CARBON"
  | "WATER"
  | "ENERGY"
  | "CHEMICAL"
  | "WASTE"
  | "ESG"
  | "COMPLIANCE";

export interface FactorySustainabilityScoreKnowledge {
  code: string;

  category: SustainabilityScoreCategory;

  maximumScore: number;

  scoringCriteria: string;

  businessImpact: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  version: string;

  lastReviewed: string;

  isActive: boolean;
}

export const factorySustainabilityScoreKnowledgeLibrary: FactorySustainabilityScoreKnowledge[] = [
  {
    code: "FSS001",

    category: "CARBON",

    maximumScore: 100,

    scoringCriteria:
      "Lower CO₂ per garment compared with target.",

    businessImpact:
      "Supports buyer sustainability rating and lowers environmental impact.",

    aiRecommendation:
      "Reduce electricity, fuel and idle machine emissions.",

    responsibleDepartment: "ENGINEERING",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "FSS002",

    category: "WATER",

    maximumScore: 100,

    scoringCriteria:
      "Lower litres of water consumed per garment.",

    businessImpact:
      "Reduces operating cost and improves water stewardship.",

    aiRecommendation:
      "Reduce leakage, increase recycling and monitor department-wise consumption.",

    responsibleDepartment: "ENGINEERING",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "FSS003",

    category: "CHEMICAL",

    maximumScore: 100,

    scoringCriteria:
      "ZDHC, MRSL and chemical management compliance.",

    businessImpact:
      "Improves buyer confidence and reduces chemical risk.",

    aiRecommendation:
      "Maintain approved chemicals, SDS records and supplier compliance.",

    responsibleDepartment: "COMPLIANCE",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "FSS004",

    category: "ESG",

    maximumScore: 100,

    scoringCriteria:
      "Overall environmental, social and governance performance.",

    businessImpact:
      "Improves investor confidence and long-term competitiveness.",

    aiRecommendation:
      "Review ESG indicators quarterly and assign improvement actions.",

    responsibleDepartment: "MANAGEMENT",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },
];