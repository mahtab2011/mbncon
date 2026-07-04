export type EnergyEfficiencyCategory =
  | "LIGHTING"
  | "MOTOR"
  | "COMPRESSED_AIR"
  | "HVAC"
  | "STEAM"
  | "MACHINE_IDLE_TIME"
  | "RENEWABLE_ENERGY";

export interface EnergyEfficiencyKnowledge {
  code: string;

  category: EnergyEfficiencyCategory;

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

export const energyEfficiencyKnowledgeLibrary: EnergyEfficiencyKnowledge[] = [
  {
    code: "EE001",

    category: "LIGHTING",

    title: "LED Lighting Conversion",

    description:
      "Replace inefficient lighting with LED lighting to reduce electricity consumption.",

    improvementMethods: [
      "Replace fluorescent lights with LED",
      "Install motion sensors",
      "Use daylight where possible",
    ],

    evidenceRequired: [
      "Lighting inventory",
      "Electricity bill",
      "Replacement record",
    ],

    kpi: "Lighting kWh reduction",

    aiRecommendation:
      "Prioritize high-usage production and warehouse areas for LED conversion.",

    responsibleDepartment: "ENGINEERING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "EE002",

    category: "COMPRESSED_AIR",

    title: "Compressed Air Leakage Control",

    description:
      "Reduce energy loss caused by compressed air leakage.",

    improvementMethods: [
      "Conduct leakage audit",
      "Repair air leaks",
      "Optimize compressor pressure",
    ],

    evidenceRequired: [
      "Compressor log",
      "Leak inspection checklist",
      "Repair records",
    ],

    kpi: "Compressor kWh per production hour",

    aiRecommendation:
      "Run monthly compressed air leakage inspection and track savings after repair.",

    responsibleDepartment: "MAINTENANCE",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "EE003",

    category: "MACHINE_IDLE_TIME",

    title: "Machine Idle Energy Reduction",

    description:
      "Reduce energy consumption from idle machines and equipment.",

    improvementMethods: [
      "Switch off idle machines",
      "Monitor idle time",
      "Train operators",
    ],

    evidenceRequired: [
      "Machine utilization report",
      "Energy meter data",
      "Operator training record",
    ],

    kpi: "Idle energy percentage",

    aiRecommendation:
      "Connect machine idle time with electricity usage to identify avoidable energy loss.",

    responsibleDepartment: "PRODUCTION",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];