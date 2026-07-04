export interface AILineBalancingKnowledge {
  code: string;

  situation: string;

  imbalanceIndicator: string;

  probableCauses: string[];

  balancingRecommendations: string[];

  expectedImprovement: string;

  responsibleDepartment: string;

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const aiLineBalancingKnowledgeBase: AILineBalancingKnowledge[] = [
  {
    code: "LB001",

    situation: "Operator cycle time exceeds takt time",

    imbalanceIndicator:
      "Continuous bundle accumulation before workstation",

    probableCauses: [
      "Operation has high SAM",
      "Operator skill gap",
      "Incorrect machine attachment",
    ],

    balancingRecommendations: [
      "Improve operator method.",
      "Provide skill training.",
      "Review work aids and folders.",
      "Split operation if necessary.",
    ],

    expectedImprovement:
      "Reduced bottleneck and smoother production flow.",

    responsibleDepartment: "INDUSTRIAL_ENGINEERING",

    priority: "HIGH",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "LB002",

    situation: "Operator waiting for work",

    imbalanceIndicator:
      "Frequent idle observations",

    probableCauses: [
      "Previous operation too slow",
      "Material supply delay",
      "Poor line balance",
    ],

    balancingRecommendations: [
      "Balance upstream operations.",
      "Improve bundle supply.",
      "Review production layout.",
    ],

    expectedImprovement:
      "Higher operator utilization.",

    responsibleDepartment: "INDUSTRIAL_ENGINEERING",

    priority: "MEDIUM",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "LB003",

    situation: "Large WIP accumulation",

    imbalanceIndicator:
      "Bundles waiting between operations",

    probableCauses: [
      "Uneven operator capacity",
      "Incorrect manpower allocation",
      "Layout inefficiency",
    ],

    balancingRecommendations: [
      "Redistribute operators.",
      "Review workstation layout.",
      "Reduce transport distance.",
    ],

    expectedImprovement:
      "Reduced WIP and improved line flow.",

    responsibleDepartment: "INDUSTRIAL_ENGINEERING",

    priority: "HIGH",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "LB004",

    situation: "Frequent overtime on one operation",

    imbalanceIndicator:
      "Repeated overload at workstation",

    probableCauses: [
      "Operation not balanced",
      "Insufficient manpower",
    ],

    balancingRecommendations: [
      "Reallocate manpower.",
      "Split operation.",
      "Improve method.",
    ],

    expectedImprovement:
      "Reduced overtime and balanced workload.",

    responsibleDepartment: "INDUSTRIAL_ENGINEERING",

    priority: "HIGH",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "LB005",

    situation: "Machine utilization below target",

    imbalanceIndicator:
      "Machine idle for extended periods",

    probableCauses: [
      "Poor scheduling",
      "Material shortage",
      "Operator absence",
    ],

    balancingRecommendations: [
      "Improve production scheduling.",
      "Strengthen material planning.",
      "Cross-train operators.",
    ],

    expectedImprovement:
      "Higher machine utilization.",

    responsibleDepartment: "PRODUCTION",

    priority: "MEDIUM",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },
];