export type GarmentComplianceCategory =
  | "SOCIAL_COMPLIANCE"
  | "HEALTH_AND_SAFETY"
  | "ENVIRONMENT"
  | "FIRE_SAFETY"
  | "SECURITY"
  | "BUYER_REQUIREMENT"
  | "DOCUMENT_CONTROL";

export interface GarmentComplianceKnowledge {
  code: string;

  category: GarmentComplianceCategory;

  complianceTitle: string;

  objective: string;

  requirement: string;

  responsibleDepartment: string;

  evidenceRequired: string[];

  riskIfNotComplied: string;

  aiRecommendation: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const garmentComplianceKnowledgeLibrary: GarmentComplianceKnowledge[] = [
  {
    code: "GCM001",

    category: "SOCIAL_COMPLIANCE",

    complianceTitle: "Working Hours Compliance",

    objective:
      "Ensure employees work within legal and buyer-approved limits.",

    requirement:
      "Maintain accurate attendance and overtime records and comply with applicable labour regulations.",

    responsibleDepartment: "HR",

    evidenceRequired: [
      "Attendance records",
      "Overtime register",
      "Payroll records",
    ],

    riskIfNotComplied:
      "Buyer audit failure, legal penalties and worker dissatisfaction.",

    aiRecommendation:
      "Monitor overtime weekly and generate automatic compliance alerts.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "GCM002",

    category: "FIRE_SAFETY",

    complianceTitle: "Emergency Exit Readiness",

    objective:
      "Maintain safe evacuation routes for all employees.",

    requirement:
      "Emergency exits shall remain unlocked, unobstructed and clearly marked during operating hours.",

    responsibleDepartment: "ADMIN",

    evidenceRequired: [
      "Daily exit inspection checklist",
      "Fire drill records",
      "Emergency evacuation plan",
    ],

    riskIfNotComplied:
      "Life safety risk and immediate buyer audit failure.",

    aiRecommendation:
      "Carry out daily exit inspections and quarterly evacuation drills.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "GCM003",

    category: "ENVIRONMENT",

    complianceTitle: "Environmental Management",

    objective:
      "Reduce environmental impact through controlled resource management.",

    requirement:
      "Monitor energy, water, waste and emissions, and implement continuous improvement plans.",

    responsibleDepartment: "COMPLIANCE",

    evidenceRequired: [
      "Energy reports",
      "Water reports",
      "Waste records",
      "Environmental action plan",
    ],

    riskIfNotComplied:
      "Environmental non-compliance, reduced buyer confidence and higher operating costs.",

    aiRecommendation:
      "Review environmental KPIs monthly and assign improvement actions.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];