export type ActivityCategory =
  | "VALUE_ADDED"
  | "NON_VALUE_ADDED"
  | "NECESSARY_NON_VALUE_ADDED"
  | "DELAY"
  | "WAITING"
  | "MOVEMENT"
  | "INSPECTION";

export interface ActivitySamplingRule {
  code: string;

  activityName: string;

  category: ActivityCategory;

  productive: boolean;

  description: string;

  examples: string[];

  recommendedAction: string;
}

export const activitySamplingRulesLibrary: ActivitySamplingRule[] = [
  {
    code: "AS001",

    activityName: "Sewing Operation",

    category: "VALUE_ADDED",

    productive: true,

    description:
      "Operator is performing the assigned sewing operation.",

    examples: [
      "Joining panels",
      "Top stitching",
      "Attaching collar",
    ],

    recommendedAction:
      "Maintain standard method.",
  },

  {
    code: "AS002",

    activityName: "Waiting for Bundle",

    category: "WAITING",

    productive: false,

    description:
      "Operator waiting because no work is available.",

    examples: [
      "Bundle not supplied",
      "Cutting delay",
    ],

    recommendedAction:
      "Improve line balancing and material flow.",
  },

  {
    code: "AS003",

    activityName: "Machine Breakdown",

    category: "DELAY",

    productive: false,

    description:
      "Production stopped due to machine failure.",

    examples: [
      "Needle bar issue",
      "Motor failure",
      "Timing problem",
    ],

    recommendedAction:
      "Increase preventive maintenance frequency.",
  },

  {
    code: "AS004",

    activityName: "Quality Inspection",

    category: "INSPECTION",

    productive: true,

    description:
      "Inline or end-line quality checking.",

    examples: [
      "Visual inspection",
      "Measurement checking",
    ],

    recommendedAction:
      "Follow inspection SOP.",
  },

  {
    code: "AS005",

    activityName: "Operator Walking",

    category: "MOVEMENT",

    productive: false,

    description:
      "Operator walking without adding value.",

    examples: [
      "Collecting bundle",
      "Searching tools",
    ],

    recommendedAction:
      "Improve workplace organization using 5S.",
  },
];