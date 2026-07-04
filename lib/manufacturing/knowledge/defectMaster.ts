export type GarmentDefectCategory =
  | "CUTTING"
  | "SEWING"
  | "PRINTING"
  | "EMBROIDERY"
  | "WASHING"
  | "FINISHING"
  | "PACKING"
  | "FABRIC"
  | "TRIMS";

export type DefectClassification =
  | "WORKMANSHIP"
  | "MEASUREMENT"
  | "FABRIC"
  | "THREAD"
  | "STITCHING"
  | "APPEARANCE"
  | "SAFETY"
  | "FUNCTIONAL"
  | "PACKING"
  | "LABELING";

export interface DefectMaster {
  code: string;

  defectName: string;

  category: GarmentDefectCategory;

  classification: DefectClassification;

  severity:
    | "CRITICAL"
    | "MAJOR"
    | "MINOR";

  inspectionStage:
    | "INLINE"
    | "ENDLINE"
    | "FINAL"
    | "AUDIT";

  description: string;

  probableCauses: string[];

  correctiveActions: string[];

  preventiveActions: string[];

  imageRequired: boolean;
}

export const defectMasterLibrary: DefectMaster[] = [
  {
    code: "DEF001",

    defectName: "Open Seam",

    category: "SEWING",

    classification: "STITCHING",

    severity: "MAJOR",

    inspectionStage: "INLINE",

    description:
      "Seam not properly closed during stitching.",

    probableCauses: [
      "Incorrect SPI",
      "Thread breakage",
      "Improper machine setting",
    ],

    correctiveActions: [
      "Repair seam",
      "Adjust machine",
    ],

    preventiveActions: [
      "Daily machine check",
      "Operator training",
    ],

    imageRequired: true,
  },

  {
    code: "DEF002",

    defectName: "Skipped Stitch",

    category: "SEWING",

    classification: "STITCHING",

    severity: "MAJOR",

    inspectionStage: "INLINE",

    description:
      "Needle skipped stitches while sewing.",

    probableCauses: [
      "Bent needle",
      "Incorrect timing",
      "Wrong needle",
    ],

    correctiveActions: [
      "Replace needle",
      "Adjust timing",
    ],

    preventiveActions: [
      "Needle policy",
      "Machine maintenance",
    ],

    imageRequired: true,
  },

  {
    code: "DEF003",

    defectName: "Broken Stitch",

    category: "SEWING",

    classification: "STITCHING",

    severity: "MAJOR",

    inspectionStage: "ENDLINE",

    description:
      "Thread broken after stitching.",

    probableCauses: [
      "Poor thread quality",
      "Excessive tension",
    ],

    correctiveActions: [
      "Repair stitching",
      "Adjust tension",
    ],

    preventiveActions: [
      "Thread inspection",
      "Machine calibration",
    ],

    imageRequired: true,
  },

  {
    code: "DEF004",

    defectName: "Puckering",

    category: "SEWING",

    classification: "STITCHING",

    severity: "MAJOR",

    inspectionStage: "INLINE",

    description:
      "Wrinkled or wavy seam appearance after stitching.",

    probableCauses: [
      "Incorrect thread tension",
      "Improper feed adjustment",
      "Fabric handling issue",
    ],

    correctiveActions: [
      "Adjust tension",
      "Reset feed mechanism",
      "Repair affected seam",
    ],

    preventiveActions: [
      "Machine setting verification",
      "Operator training",
      "Use correct needle and thread combination",
    ],

    imageRequired: true,
  },

  {
    code: "DEF005",

    defectName: "Needle Cut",

    category: "SEWING",

    classification: "STITCHING",

    severity: "CRITICAL",

    inspectionStage: "FINAL",

    description:
      "Fabric yarn damaged or cut by needle during sewing.",

    probableCauses: [
      "Blunt needle",
      "Wrong needle size",
      "Excessive sewing speed",
    ],

    correctiveActions: [
      "Replace damaged panel",
      "Change needle immediately",
    ],

    preventiveActions: [
      "Needle policy compliance",
      "Scheduled needle replacement",
      "Needle damage audit",
    ],

    imageRequired: true,
  },
];