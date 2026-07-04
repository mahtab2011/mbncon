export type ComplianceCategory =
  | "SOCIAL"
  | "ENVIRONMENT"
  | "HEALTH_SAFETY"
  | "LABOUR"
  | "CHEMICAL"
  | "ENERGY"
  | "WATER"
  | "WASTE";

export interface GlobalComplianceKnowledge {
  code: string;

  title: string;

  category: ComplianceCategory;

  objective: string;

  requirement: string;

  evidenceRequired: string[];

  riskIfNotFollowed: string;

  aiRecommendation: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const globalComplianceKnowledgeLibrary: GlobalComplianceKnowledge[] =
[
  {
    code: "GC001",

    title: "Carbon Emission Monitoring",

    category: "ENVIRONMENT",

    objective:
      "Monitor and reduce factory carbon emissions.",

    requirement:
      "Factory shall measure and periodically review greenhouse gas emissions.",

    evidenceRequired: [
      "Electricity bills",
      "Fuel consumption records",
      "Carbon calculation reports",
    ],

    riskIfNotFollowed:
      "Reduced buyer confidence and future regulatory risk.",

    aiRecommendation:
      "Establish monthly carbon baseline and reduction targets.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "GC002",

    title: "Water Consumption Monitoring",

    category: "WATER",

    objective:
      "Measure and reduce freshwater usage.",

    requirement:
      "Factory should monitor water use by process and identify reduction opportunities.",

    evidenceRequired: [
      "Water bills",
      "Meter readings",
      "Process consumption records",
    ],

    riskIfNotFollowed:
      "Higher operating cost and sustainability risk.",

    aiRecommendation:
      "Implement water KPI dashboard and leakage monitoring.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "GC003",

    title: "Waste Segregation",

    category: "WASTE",

    objective:
      "Segregate waste for recycling and responsible disposal.",

    requirement:
      "Separate textile, paper, plastic and hazardous waste.",

    evidenceRequired: [
      "Waste registers",
      "Disposal records",
      "Recycler certificates",
    ],

    riskIfNotFollowed:
      "Environmental non-compliance and increased disposal costs.",

    aiRecommendation:
      "Introduce colour-coded waste collection points and monthly audits.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];