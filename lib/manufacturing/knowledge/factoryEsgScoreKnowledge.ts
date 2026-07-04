export type FactoryEsgScoreCategory =
  | "ENVIRONMENT"
  | "SOCIAL"
  | "GOVERNANCE";

export interface FactoryEsgScoreKnowledge {
  code: string;

  category: FactoryEsgScoreCategory;

  maximumScore: number;

  scoringCriteria: string;

  keyIndicators: string[];

  businessImpact: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  version: string;

  lastReviewed: string;

  isActive: boolean;
}

export const factoryEsgScoreKnowledgeLibrary: FactoryEsgScoreKnowledge[] = [
  {
    code: "ESGS001",

    category: "ENVIRONMENT",

    maximumScore: 100,

    scoringCriteria:
      "Performance in carbon, water, energy, waste and chemical management.",

    keyIndicators: [
      "Carbon per garment",
      "Water per garment",
      "Energy per garment",
      "Waste recycling rate",
      "Chemical compliance",
    ],

    businessImpact:
      "Improves environmental performance and buyer confidence.",

    aiRecommendation:
      "Review environmental KPIs monthly and benchmark against targets.",

    responsibleDepartment: "SUSTAINABILITY",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "ESGS002",

    category: "SOCIAL",

    maximumScore: 100,

    scoringCriteria:
      "Performance in worker welfare, health & safety and labour compliance.",

    keyIndicators: [
      "Training hours",
      "Lost Time Injury Frequency Rate (LTIFR)",
      "Overtime compliance",
      "Employee turnover",
      "Worker grievances",
    ],

    businessImpact:
      "Supports workforce stability and strengthens social compliance.",

    aiRecommendation:
      "Monitor safety incidents, training effectiveness and employee engagement.",

    responsibleDepartment: "HR",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    code: "ESGS003",

    category: "GOVERNANCE",

    maximumScore: 100,

    scoringCriteria:
      "Performance in ethical management, risk control and policy compliance.",

    keyIndicators: [
      "Internal audits",
      "Policy compliance",
      "Corrective action closure",
      "Management reviews",
      "Risk register updates",
    ],

    businessImpact:
      "Strengthens governance and builds confidence with buyers and investors.",

    aiRecommendation:
      "Conduct quarterly governance reviews and monitor corrective action closure rates.",

    responsibleDepartment: "MANAGEMENT",

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },
];