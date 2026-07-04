export type NeedlePolicyCategory =
  | "ISSUE_CONTROL"
  | "BROKEN_NEEDLE"
  | "REPLACEMENT"
  | "RECORD_KEEPING"
  | "AUDIT"
  | "SAFETY";

export interface NeedlePolicyKnowledge {
  code: string;

  category: NeedlePolicyCategory;

  policyTitle: string;

  policyRequirement: string;

  responsibleDepartment: string;

  evidenceRequired: string[];

  riskIfNotFollowed: string;

  aiRecommendation: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const needlePolicyKnowledgeLibrary: NeedlePolicyKnowledge[] = [
  {
    code: "NP001",

    category: "ISSUE_CONTROL",

    policyTitle: "Needle Issue Control",

    policyRequirement:
      "All sewing needles must be issued through authorized control with proper record keeping.",

    responsibleDepartment: "SEWING",

    evidenceRequired: [
      "Needle issue register",
      "Operator needle card",
      "Line supervisor approval",
    ],

    riskIfNotFollowed:
      "Uncontrolled needle use may create product safety risk and buyer audit failure.",

    aiRecommendation:
      "Maintain one controlled needle issue register per sewing floor.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "NP002",

    category: "BROKEN_NEEDLE",

    policyTitle: "Broken Needle Control",

    policyRequirement:
      "When a needle breaks, all broken parts must be recovered, recorded and verified before production restarts.",

    responsibleDepartment: "QUALITY",

    evidenceRequired: [
      "Broken needle record",
      "Recovered needle parts",
      "Supervisor verification",
      "Metal detector record if applicable",
    ],

    riskIfNotFollowed:
      "Needle fragments may remain in garments, creating serious customer safety risk.",

    aiRecommendation:
      "Stop production immediately and follow broken needle recovery procedure.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "NP003",

    category: "REPLACEMENT",

    policyTitle: "Scheduled Needle Replacement",

    policyRequirement:
      "Needles should be replaced according to defined usage, fabric type and buyer requirement.",

    responsibleDepartment: "SEWING",

    evidenceRequired: [
      "Needle replacement register",
      "Machine-wise replacement record",
      "Supervisor confirmation",
    ],

    riskIfNotFollowed:
      "Old or damaged needles may cause skipped stitch, needle cut or fabric damage.",

    aiRecommendation:
      "Define replacement frequency by fabric type and operation risk level.",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];