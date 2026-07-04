export type FabricDefectSeverity =
  | "CRITICAL"
  | "MAJOR"
  | "MINOR";

export type FabricDefectSource =
  | "SPINNING"
  | "WEAVING"
  | "KNITTING"
  | "DYEING"
  | "FINISHING"
  | "TRANSPORT"
  | "STORAGE";

export interface FabricDefectMaster {
  code: string;

  defectName: string;

  source: FabricDefectSource;

  severity: FabricDefectSeverity;

  description: string;

  probableCauses: string[];

  correctiveActions: string[];

  preventiveActions: string[];

  inspectionMethod: string;

  imageRequired: boolean;
}

export const fabricDefectLibrary: FabricDefectMaster[] = [
  {
    code: "FAB001",

    defectName: "Hole",

    source: "KNITTING",

    severity: "CRITICAL",

    description:
      "Visible hole in fabric.",

    probableCauses: [
      "Broken yarn",
      "Mechanical damage",
    ],

    correctiveActions: [
      "Reject panel",
    ],

    preventiveActions: [
      "Machine inspection",
      "Fabric inspection",
    ],

    inspectionMethod:
      "4-Point Fabric Inspection",

    imageRequired: true,
  },

  {
    code: "FAB002",

    defectName: "Slub",

    source: "SPINNING",

    severity: "MAJOR",

    description:
      "Thick yarn section creating uneven appearance.",

    probableCauses: [
      "Yarn irregularity",
    ],

    correctiveActions: [
      "Segregate fabric",
    ],

    preventiveActions: [
      "Supplier quality control",
    ],

    inspectionMethod:
      "4-Point Fabric Inspection",

    imageRequired: true,
  },

  {
    code: "FAB003",

    defectName: "Shade Variation",

    source: "DYEING",

    severity: "CRITICAL",

    description:
      "Fabric shade differs within or between rolls.",

    probableCauses: [
      "Improper dyeing process",
      "Batch variation",
    ],

    correctiveActions: [
      "Shade segregation",
    ],

    preventiveActions: [
      "Lot control",
      "Shade band approval",
    ],

    inspectionMethod:
      "Shade Box Inspection",

    imageRequired: true,
  },
];