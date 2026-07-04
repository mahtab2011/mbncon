export interface AICorrectiveActionKnowledge {
  code: string;

  issue: string;

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  recommendedActions: string[];

  responsibleDepartment: string;

  expectedCompletionHours: number;

  verificationMethod: string;

  escalationRequired: boolean;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const aiCorrectiveActionKnowledgeBase: AICorrectiveActionKnowledge[] =
[
  {
    code: "CA001",

    issue: "Skipped Stitch",

    priority: "HIGH",

    recommendedActions: [
      "Replace sewing needle.",
      "Check hook timing.",
      "Verify SPI setting.",
      "Rework affected garments.",
    ],

    responsibleDepartment: "SEWING",

    expectedCompletionHours: 2,

    verificationMethod:
      "Inline quality inspection",

    escalationRequired: false,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "CA002",

    issue: "Open Seam",

    priority: "HIGH",

    recommendedActions: [
      "Repair seam.",
      "Adjust thread tension.",
      "Verify back stitch.",
      "Inspect machine settings.",
    ],

    responsibleDepartment: "SEWING",

    expectedCompletionHours: 2,

    verificationMethod:
      "End-line inspection",

    escalationRequired: false,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "CA003",

    issue: "Shade Variation",

    priority: "CRITICAL",

    recommendedActions: [
      "Stop production immediately.",
      "Segregate dye lots.",
      "Replace affected panels.",
      "Notify fabric supplier.",
    ],

    responsibleDepartment: "FABRIC",

    expectedCompletionHours: 8,

    verificationMethod:
      "Shade box approval",

    escalationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "CA004",

    issue: "Needle Cut",

    priority: "CRITICAL",

    recommendedActions: [
      "Replace needle.",
      "Replace damaged components.",
      "Review needle policy compliance.",
    ],

    responsibleDepartment: "SEWING",

    expectedCompletionHours: 4,

    verificationMethod:
      "100% inspection",

    escalationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "CA005",

    issue: "Puckering",

    priority: "MEDIUM",

    recommendedActions: [
      "Adjust thread tension.",
      "Check differential feed.",
      "Verify operator method.",
    ],

    responsibleDepartment: "SEWING",

    expectedCompletionHours: 2,

    verificationMethod:
      "Inline inspection",

    escalationRequired: false,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },
];