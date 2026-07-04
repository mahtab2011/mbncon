export interface AIRootCauseKnowledge {
  code: string;

  symptom: string;

  probableRootCause: string;

  department: string;

  confidence: number;

  investigationQuestions: string[];

  correctiveActions: string[];

  preventiveActions: string[];

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const aiRootCauseKnowledgeBase: AIRootCauseKnowledge[] = [
  {
    code: "RCA001",

    symptom: "Skipped Stitch",

    probableRootCause:
      "Bent or incorrect sewing needle.",

    department: "SEWING",

    confidence: 95,

    investigationQuestions: [
      "Is the needle bent?",
      "Is the correct needle size installed?",
      "Has the needle exceeded replacement policy?",
    ],

    correctiveActions: [
      "Replace the needle.",
      "Reset machine timing if required.",
      "Verify SPI.",
    ],

    preventiveActions: [
      "Follow needle replacement policy.",
      "Train operators on needle selection.",
      "Perform daily machine inspection.",
    ],

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "RCA002",

    symptom: "Open Seam",

    probableRootCause:
      "Incorrect thread tension or improper back stitch.",

    department: "SEWING",

    confidence: 90,

    investigationQuestions: [
      "Is thread tension correct?",
      "Is back stitch applied?",
      "Is thread quality acceptable?",
    ],

    correctiveActions: [
      "Adjust thread tension.",
      "Repair seam.",
      "Check machine settings.",
    ],

    preventiveActions: [
      "Daily machine calibration.",
      "Operator refresher training.",
    ],

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "RCA003",

    symptom: "Shade Variation",

    probableRootCause:
      "Fabric from different dye lots mixed together.",

    department: "FABRIC",

    confidence: 98,

    investigationQuestions: [
      "Were dye lots mixed?",
      "Was shade band verified?",
      "Was fabric inspected before cutting?",
    ],

    correctiveActions: [
      "Segregate affected lots.",
      "Replace mismatched panels.",
    ],

    preventiveActions: [
      "Implement shade segregation SOP.",
      "Verify shade band before spreading.",
    ],

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "RCA004",

    symptom: "Needle Cut",

    probableRootCause:
      "Incorrect needle size or damaged needle point.",

    department: "SEWING",

    confidence: 96,

    investigationQuestions: [
      "Is the correct needle installed?",
      "Is the needle damaged?",
      "Is sewing speed excessive?",
    ],

    correctiveActions: [
      "Replace damaged needle.",
      "Reduce sewing speed if required.",
    ],

    preventiveActions: [
      "Strict needle policy.",
      "Scheduled needle replacement.",
    ],

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "RCA005",

    symptom: "Puckering",

    probableRootCause:
      "Incorrect thread tension or differential feed setting.",

    department: "SEWING",

    confidence: 88,

    investigationQuestions: [
      "Is thread tension balanced?",
      "Is presser foot pressure correct?",
      "Is feed differential adjusted properly?",
    ],

    correctiveActions: [
      "Adjust tension.",
      "Reset feed settings.",
    ],

    preventiveActions: [
      "Machine calibration.",
      "Operator training.",
    ],

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },
];