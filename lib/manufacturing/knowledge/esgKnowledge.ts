export type ESGCategory =
  | "ENVIRONMENT"
  | "SOCIAL"
  | "GOVERNANCE";

export interface ESGKnowledge {
  code: string;

  category: ESGCategory;

  title: string;

  description: string;

  objectives: string[];

  evidenceRequired: string[];

  businessBenefit: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const esgKnowledgeLibrary: ESGKnowledge[] = [
  {
    code: "ESG001",

    category: "ENVIRONMENT",

    title: "Environmental Sustainability",

    description:
      "Reduce environmental impact through efficient use of natural resources.",

    objectives: [
      "Reduce carbon emissions",
      "Reduce water consumption",
      "Improve waste recycling",
      "Improve energy efficiency",
    ],

    evidenceRequired: [
      "Carbon report",
      "Water report",
      "Energy report",
      "Waste report",
    ],

    businessBenefit:
      "Improves buyer confidence and supports long-term sustainability.",

    aiRecommendation:
      "Track environmental KPIs monthly and compare with factory targets.",

    responsibleDepartment: "SUSTAINABILITY",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "ESG002",

    category: "SOCIAL",

    title: "Worker Welfare",

    description:
      "Promote employee wellbeing, safety and fair working conditions.",

    objectives: [
      "Safe workplace",
      "Fair wages",
      "Training",
      "Worker engagement",
    ],

    evidenceRequired: [
      "Training records",
      "Payroll records",
      "Safety reports",
      "Worker survey",
    ],

    businessBenefit:
      "Higher productivity, lower turnover and stronger buyer confidence.",

    aiRecommendation:
      "Monitor training, safety incidents and employee satisfaction regularly.",

    responsibleDepartment: "HR",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "ESG003",

    category: "GOVERNANCE",

    title: "Corporate Governance",

    description:
      "Ensure transparent, ethical and accountable factory management.",

    objectives: [
      "Legal compliance",
      "Ethical sourcing",
      "Risk management",
      "Business integrity",
    ],

    evidenceRequired: [
      "Policies",
      "Audit reports",
      "Management review minutes",
      "Risk register",
    ],

    businessBenefit:
      "Improves investor confidence and supports long-term business growth.",

    aiRecommendation:
      "Conduct quarterly governance reviews and track corrective actions.",

    responsibleDepartment: "MANAGEMENT",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];