export interface RollBundleRecord {
  id: string;

  rollNo: string;

  lotNo: string;

  shadeGroup: string;

  layNo: string;

  markerNo: string;

  bundleNo: string;

  style: string;

  color: string;

  size: string;

  plannedPieces: number;

  cutPieces: number;

  sewingLine: string;

  status:
    | "CUTTING"
    | "READY"
    | "ISSUED"
    | "SEWING"
    | "COMPLETED";

  aiRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  aiRecommendation: string;
}

export const rollBundleMaster: RollBundleRecord[] = [

  {
    id: "RB-001",

    rollNo: "R-001",

    lotNo: "LOT-240601",

    shadeGroup: "A",

    layNo: "LAY-001",

    markerNo: "MKR-001",

    bundleNo: "BDL-001",

    style: "PRM-3307",

    color: "Black",

    size: "M",

    plannedPieces: 120,

    cutPieces: 120,

    sewingLine: "L-01",

    status: "ISSUED",

    aiRisk: "LOW",

    aiRecommendation:
      "Bundle fully traceable and ready for sewing.",
  },

  {
    id: "RB-002",

    rollNo: "R-014",

    lotNo: "LOT-240602",

    shadeGroup: "C",

    layNo: "LAY-004",

    markerNo: "MKR-003",

    bundleNo: "BDL-008",

    style: "PRM-3307",

    color: "Navy",

    size: "L",

    plannedPieces: 100,

    cutPieces: 94,

    sewingLine: "L-03",

    status: "CUTTING",

    aiRisk: "HIGH",

    aiRecommendation:
      "Investigate missing pieces before issuing bundle.",
  },

  {
    id: "RB-003",

    rollNo: "R-020",

    lotNo: "LOT-240603",

    shadeGroup: "B",

    layNo: "LAY-006",

    markerNo: "MKR-005",

    bundleNo: "BDL-015",

    style: "PRM-4410",

    color: "White",

    size: "XL",

    plannedPieces: 150,

    cutPieces: 150,

    sewingLine: "L-05",

    status: "SEWING",

    aiRisk: "MEDIUM",

    aiRecommendation:
      "Maintain bundle integrity throughout sewing.",
  },

];