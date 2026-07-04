export type WaterStewardshipCategory =
  | "CONSUMPTION"
  | "CONSERVATION"
  | "RECYCLING"
  | "LEAKAGE"
  | "MONITORING"
  | "EFFLUENT";

export interface WaterStewardshipKnowledge {
  code: string;

  category: WaterStewardshipCategory;

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

export const waterStewardshipKnowledgeLibrary: WaterStewardshipKnowledge[] = [
  {
    code: "WS001",

    category: "CONSUMPTION",

    title: "Factory Water Consumption",

    description:
      "Monitor total freshwater consumption used in production and utilities.",

    improvementMethods: [
      "Install digital water meters",
      "Monitor department-wise consumption",
      "Identify high consumption processes",
      "Set monthly reduction targets",
    ],

    evidenceRequired: [
      "Water bills",
      "Meter readings",
      "Production report",
    ],

    kpi: "Litres per garment",

    aiRecommendation:
      "Monitor litres consumed per garment every month and compare against previous performance.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "WS002",

    category: "LEAKAGE",

    title: "Water Leakage Control",

    description:
      "Identify and eliminate water leakages across the factory.",

    improvementMethods: [
      "Weekly leakage inspection",
      "Repair leaking valves",
      "Monitor abnormal consumption",
    ],

    evidenceRequired: [
      "Leak inspection checklist",
      "Maintenance records",
    ],

    kpi: "Leak incidents per month",

    aiRecommendation:
      "Generate automatic alerts for unusual water consumption patterns.",

    responsibleDepartment: "MAINTENANCE",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "WS003",

    category: "RECYCLING",

    title: "Water Recycling",

    description:
      "Promote recycling and reuse of treated water wherever technically feasible.",

    improvementMethods: [
      "Reuse treated water",
      "Optimize ETP performance",
      "Increase recycling percentage",
    ],

    evidenceRequired: [
      "ETP report",
      "Water recycling report",
      "Laboratory analysis",
    ],

    kpi: "Recycled water percentage",

    aiRecommendation:
      "Increase treated water reuse while maintaining required quality standards.",

    responsibleDepartment: "COMPLIANCE",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];