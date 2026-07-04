export type ImprovementCategory =
  | "MOTION"
  | "WORKPLACE"
  | "LAYOUT"
  | "MACHINE"
  | "TOOL"
  | "QUALITY"
  | "SAFETY"
  | "ERGONOMICS";

export interface MethodStudyImprovement {
  code: string;

  title: string;

  category: ImprovementCategory;

  objective: string;

  description: string;

  expectedBenefit: string;

  implementationDifficulty:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  estimatedProductivityGain: number;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const methodStudyImprovementLibrary: MethodStudyImprovement[] =
[
  {
    code: "MS001",

    title: "Reduce Hand Motions",

    category: "MOTION",

    objective:
      "Minimize unnecessary hand movements.",

    description:
      "Arrange work so both hands move efficiently with minimum reach.",

    expectedBenefit:
      "Reduced cycle time and operator fatigue.",

    implementationDifficulty: "LOW",

    estimatedProductivityGain: 8,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "MS002",

    title: "Optimize Workplace Layout",

    category: "WORKPLACE",

    objective:
      "Improve accessibility of tools and materials.",

    description:
      "Place frequently used items within normal reach zone.",

    expectedBenefit:
      "Reduced searching and walking.",

    implementationDifficulty: "LOW",

    estimatedProductivityGain: 6,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "MS003",

    title: "Improve Operator Ergonomics",

    category: "ERGONOMICS",

    objective:
      "Reduce fatigue and musculoskeletal strain.",

    description:
      "Adjust chair, table, pedal position and work height.",

    expectedBenefit:
      "Higher consistency and lower fatigue.",

    implementationDifficulty: "MEDIUM",

    estimatedProductivityGain: 10,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "MS004",

    title: "Introduce Folder or Guide",

    category: "TOOL",

    objective:
      "Standardize folding and alignment.",

    description:
      "Use suitable folders, guides or jigs to reduce variation.",

    expectedBenefit:
      "Better quality and faster operation.",

    implementationDifficulty: "MEDIUM",

    estimatedProductivityGain: 12,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "MS005",

    title: "Balance Workstation Layout",

    category: "LAYOUT",

    objective:
      "Improve material flow between operators.",

    description:
      "Reduce transport distance and bundle waiting time.",

    expectedBenefit:
      "Improved line balance and throughput.",

    implementationDifficulty: "HIGH",

    estimatedProductivityGain: 15,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },
];