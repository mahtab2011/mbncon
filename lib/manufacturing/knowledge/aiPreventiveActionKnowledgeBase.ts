export interface AIPreventiveActionKnowledge {
  code: string;

  issue: string;

  preventiveActions: string[];

  responsibleDepartment: string;

  monitoringFrequency:
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "QUARTERLY";

  trainingRequired: boolean;

  auditRequired: boolean;

  expectedRiskReduction: number;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const aiPreventiveActionKnowledgeBase: AIPreventiveActionKnowledge[] = [
  {
    code: "PA001",

    issue: "Skipped Stitch",

    preventiveActions: [
      "Implement needle replacement schedule.",
      "Train operators on needle selection.",
      "Daily machine timing verification.",
    ],

    responsibleDepartment: "SEWING",

    monitoringFrequency: "DAILY",

    trainingRequired: true,

    auditRequired: true,

    expectedRiskReduction: 85,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "PA002",

    issue: "Open Seam",

    preventiveActions: [
      "Standardize machine settings.",
      "Verify SPI before production.",
      "Increase inline quality inspection.",
    ],

    responsibleDepartment: "SEWING",

    monitoringFrequency: "DAILY",

    trainingRequired: true,

    auditRequired: false,

    expectedRiskReduction: 80,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "PA003",

    issue: "Shade Variation",

    preventiveActions: [
      "Maintain dye lot segregation.",
      "Approve shade bands before spreading.",
      "Strengthen incoming fabric inspection.",
    ],

    responsibleDepartment: "FABRIC",

    monitoringFrequency: "WEEKLY",

    trainingRequired: true,

    auditRequired: true,

    expectedRiskReduction: 95,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "PA004",

    issue: "Needle Cut",

    preventiveActions: [
      "Enforce needle policy.",
      "Replace needles after defined usage.",
      "Perform random compliance audits.",
    ],

    responsibleDepartment: "SEWING",

    monitoringFrequency: "DAILY",

    trainingRequired: true,

    auditRequired: true,

    expectedRiskReduction: 90,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "PA005",

    issue: "Puckering",

    preventiveActions: [
      "Standardize thread tension settings.",
      "Verify feed adjustment during setup.",
      "Conduct periodic operator refresher training.",
    ],

    responsibleDepartment: "SEWING",

    monitoringFrequency: "WEEKLY",

    trainingRequired: true,

    auditRequired: false,

    expectedRiskReduction: 75,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },
];