export type CarbonEmissionCategory =
  | "ELECTRICITY"
  | "BOILER"
  | "GENERATOR"
  | "TRANSPORT"
  | "STEAM"
  | "PRODUCTION";

export interface CarbonEmissionKnowledge {
  code: string;

  category: CarbonEmissionCategory;

  source: string;

  emissionDescription: string;

  reductionMethods: string[];

  evidenceRequired: string[];

  kpi: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const carbonEmissionKnowledgeLibrary: CarbonEmissionKnowledge[] = [
  {
    code: "CE001",

    category: "ELECTRICITY",

    source: "Grid Electricity",

    emissionDescription:
      "Carbon emissions generated from electricity consumed by production and supporting facilities.",

    reductionMethods: [
      "Install LED lighting",
      "Reduce idle machine time",
      "Use energy-efficient motors",
      "Install rooftop solar panels",
    ],

    evidenceRequired: [
      "Monthly electricity bill",
      "Energy meter readings",
      "Production report",
    ],

    kpi: "kWh per garment",

    aiRecommendation:
      "Track electricity consumption by department and compare with production output every month.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "CE002",

    category: "BOILER",

    source: "Steam Boiler",

    emissionDescription:
      "Carbon emissions generated from fuel used in steam boilers.",

    reductionMethods: [
      "Improve boiler efficiency",
      "Recover condensate",
      "Repair steam leaks",
      "Improve insulation",
    ],

    evidenceRequired: [
      "Fuel consumption log",
      "Steam production record",
      "Boiler efficiency report",
    ],

    kpi: "Fuel per kg steam",

    aiRecommendation:
      "Monitor boiler efficiency weekly and investigate abnormal fuel consumption immediately.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "CE003",

    category: "TRANSPORT",

    source: "Company Vehicles",

    emissionDescription:
      "Carbon emissions generated from transportation of employees and goods.",

    reductionMethods: [
      "Optimize delivery routes",
      "Use fuel-efficient vehicles",
      "Increase vehicle maintenance",
      "Promote shared transportation",
    ],

    evidenceRequired: [
      "Fuel purchase records",
      "Vehicle mileage logs",
      "Transport schedule",
    ],

    kpi: "CO₂ per km",

    aiRecommendation:
      "Track monthly fuel efficiency for every vehicle and identify improvement opportunities.",

    responsibleDepartment: "LOGISTICS",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];