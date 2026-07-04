export interface FabricShadeRecord {
  id: string;
  buyer: string;
  style: string;
  fabricType: string;
  color: string;
  lotNo: string;
  rollNo: string;
  shadeGroup: "A" | "B" | "C" | "D";
  shadeBand: string;
  assignedLay: string;
  assignedBundleRange: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  status: "APPROVED" | "HOLD" | "REJECTED";
  aiRecommendation: string;
}

export const fabricShadeMaster: FabricShadeRecord[] = [
  {
    id: "FSM-001",
    buyer: "H&M",
    style: "HNM-2401",
    fabricType: "Single Jersey",
    color: "Black",
    lotNo: "LOT-240601",
    rollNo: "R-001",
    shadeGroup: "A",
    shadeBand: "A1",
    assignedLay: "LAY-001",
    assignedBundleRange: "BDL-001 to BDL-050",
    riskLevel: "LOW",
    status: "APPROVED",
    aiRecommendation:
      "Shade is stable. Use with same group rolls only.",
  },
  {
    id: "FSM-002",
    buyer: "Zara",
    style: "ZRA-1188",
    fabricType: "Cotton Spandex",
    color: "Navy",
    lotNo: "LOT-240602",
    rollNo: "R-014",
    shadeGroup: "C",
    shadeBand: "C2",
    assignedLay: "LAY-004",
    assignedBundleRange: "BDL-051 to BDL-090",
    riskLevel: "HIGH",
    status: "HOLD",
    aiRecommendation:
      "Do not mix with Shade A or B. Reconfirm shade approval before cutting.",
  },
  {
    id: "FSM-003",
    buyer: "Primark",
    style: "PRM-3307",
    fabricType: "Fleece",
    color: "Grey Melange",
    lotNo: "LOT-240603",
    rollNo: "R-020",
    shadeGroup: "B",
    shadeBand: "B1",
    assignedLay: "LAY-006",
    assignedBundleRange: "BDL-091 to BDL-130",
    riskLevel: "MEDIUM",
    status: "APPROVED",
    aiRecommendation:
      "Use only with matching B shade group and maintain bundle separation.",
  },
];