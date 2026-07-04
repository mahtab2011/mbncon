export type SustainabilityKpiCategory =
  | "CARBON"
  | "WATER"
  | "ENERGY"
  | "CHEMICAL"
  | "WASTE"
  | "ESG";

export interface SustainabilityKpiKnowledge {
  code: string;

  category: SustainabilityKpiCategory;

  kpiName: string;

  calculationMethod: string;

  targetDirection: "INCREASE" | "DECREASE";

  unit: string;

  businessImpact: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const sustainabilityKpiKnowledgeLibrary: SustainabilityKpiKnowledge[] =
[
  {
    code: "SK001",

    category: "CARBON",

    kpiName: "CO₂ per Garment",

    calculationMethod:
      "Total monthly CO₂ emissions ÷ Total garments produced",

    targetDirection: "DECREASE",

    unit: "kg CO₂ / garment",

    businessImpact:
      "Lower emissions improve buyer sustainability rating and reduce environmental impact.",

    aiRecommendation:
      "Monitor monthly trend and identify departments with abnormal increases.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "SK002",

    category: "WATER",

    kpiName: "Water per Garment",

    calculationMethod:
      "Monthly water consumption ÷ Total garments produced",

    targetDirection: "DECREASE",

    unit: "Litres / garment",

    businessImpact:
      "Lower water consumption reduces operating cost and supports buyer sustainability goals.",

    aiRecommendation:
      "Track department-wise water usage and investigate abnormal consumption.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "SK003",

    category: "ENERGY",

    kpiName: "Energy per Garment",

    calculationMethod:
      "Monthly electricity consumption ÷ Total garments produced",

    targetDirection: "DECREASE",

    unit: "kWh / garment",

    businessImpact:
      "Improved energy efficiency lowers production cost and carbon emissions.",

    aiRecommendation:
      "Correlate machine idle time with electricity consumption for improvement opportunities.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "SK004",

    category: "WASTE",

    kpiName: "Fabric Waste Percentage",

    calculationMethod:
      "Fabric waste ÷ Total fabric consumption × 100",

    targetDirection: "DECREASE",

    unit: "%",

    businessImpact:
      "Lower fabric waste directly improves factory profitability.",

    aiRecommendation:
      "Review marker efficiency and cutting performance every week.",

    responsibleDepartment: "CUTTING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];