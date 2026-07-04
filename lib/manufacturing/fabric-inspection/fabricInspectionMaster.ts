export interface FabricInspectionRecord {
  id: string;

  supplier: string;

  fabricType: string;

  color: string;

  lotNo: string;

  rollNo: string;

  gsm: number;

  width: number;

  length: number;

  fourPointScore: number;

  shadeGroup: string;

  defects: string[];

  inspectionStatus:
    | "PASS"
    | "HOLD"
    | "REJECT";

  aiRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  aiRecommendation: string;
}

export const fabricInspectionMaster: FabricInspectionRecord[] = [
  {
    id: "FI-001",

    supplier: "ABC Textiles",

    fabricType: "Single Jersey",

    color: "Black",

    lotNo: "LOT-240601",

    rollNo: "R-001",

    gsm: 180,

    width: 72,

    length: 95,

    fourPointScore: 12,

    shadeGroup: "A",

    defects: [
      "Minor Slub",
      "Small Oil Spot",
    ],

    inspectionStatus: "PASS",

    aiRisk: "LOW",

    aiRecommendation:
      "Suitable for bulk cutting.",
  },

  {
    id: "FI-002",

    supplier: "XYZ Knitting",

    fabricType: "Fleece",

    color: "Navy",

    lotNo: "LOT-240602",

    rollNo: "R-014",

    gsm: 320,

    width: 68,

    length: 82,

    fourPointScore: 31,

    shadeGroup: "C",

    defects: [
      "Hole",
      "Needle Line",
      "Shade Variation",
    ],

    inspectionStatus: "HOLD",

    aiRisk: "HIGH",

    aiRecommendation:
      "Segregate roll for technical review before cutting.",
  },

  {
    id: "FI-003",

    supplier: "Global Fabrics",

    fabricType: "Interlock",

    color: "White",

    lotNo: "LOT-240603",

    rollNo: "R-020",

    gsm: 220,

    width: 70,

    length: 88,

    fourPointScore: 18,

    shadeGroup: "B",

    defects: [
      "Thick Yarn",
    ],

    inspectionStatus: "PASS",

    aiRisk: "MEDIUM",

    aiRecommendation:
      "Use with same shade group only.",
  },
];