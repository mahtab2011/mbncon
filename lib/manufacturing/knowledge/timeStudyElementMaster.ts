export type ElementType =
  | "PREPARATION"
  | "HANDLING"
  | "POSITIONING"
  | "SEWING"
  | "INSPECTION"
  | "TRIMMING"
  | "STACKING"
  | "MOVEMENT";

export interface TimeStudyElement {
  code: string;

  elementName: string;

  elementType: ElementType;

  description: string;

  valueAdded: boolean;

  measurable: boolean;

  standardObservationRequired: boolean;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const timeStudyElementLibrary: TimeStudyElement[] = [
  {
    code: "TSE001",

    elementName: "Pick Up Bundle",

    elementType: "HANDLING",

    description:
      "Operator picks up garment bundle before starting work.",

    valueAdded: false,

    measurable: true,

    standardObservationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "TSE002",

    elementName: "Position Fabric",

    elementType: "POSITIONING",

    description:
      "Align fabric accurately before stitching.",

    valueAdded: true,

    measurable: true,

    standardObservationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "TSE003",

    elementName: "Perform Stitching",

    elementType: "SEWING",

    description:
      "Execute the required sewing operation.",

    valueAdded: true,

    measurable: true,

    standardObservationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "TSE004",

    elementName: "Trim Thread",

    elementType: "TRIMMING",

    description:
      "Trim loose thread after sewing.",

    valueAdded: false,

    measurable: true,

    standardObservationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },

  {
    code: "TSE005",

    elementName: "Stack Completed Pieces",

    elementType: "STACKING",

    description:
      "Place completed garments into the finished bundle.",

    valueAdded: false,

    measurable: true,

    standardObservationRequired: true,

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-26",
  },
];