export interface CuttingCommandRecord {
  id: string;
  date: string;
  buyer: string;
  style: string;
  fabricType: string;
  rollStatus: "RECEIVED" | "INSPECTED" | "RELAXED" | "READY" | "CUTTING" | "COMPLETED";
  markerEfficiency: number;
  fabricUtilization: number;
  endLossPercent: number;
  wastagePercent: number;
  plannedPieces: number;
  cutPieces: number;
  bundlesReady: number;
  cuttingEfficiency: number;
  aiAlert: "NONE" | "WATCH" | "CRITICAL";
  aiRecommendation: string;
}

export const cuttingCommandMaster: CuttingCommandRecord[] = [
  {
    id: "CUT-001",
    date: "2026-06-29",
    buyer: "H&M",
    style: "HNM-2401",
    fabricType: "100% Cotton Jersey",
    rollStatus: "COMPLETED",
    markerEfficiency: 86.4,
    fabricUtilization: 88.5,
    endLossPercent: 2.1,
    wastagePercent: 11.5,
    plannedPieces: 25000,
    cutPieces: 23800,
    bundlesReady: 1190,
    cuttingEfficiency: 95,
    aiAlert: "NONE",
    aiRecommendation:
      "Cutting flow is stable. Maintain current marker and spreading plan.",
  },
  {
    id: "CUT-002",
    date: "2026-06-29",
    buyer: "Zara",
    style: "ZRA-1188",
    fabricType: "Cotton Spandex",
    rollStatus: "CUTTING",
    markerEfficiency: 89.5,
    fabricUtilization: 90.9,
    endLossPercent: 1.4,
    wastagePercent: 9.1,
    plannedPieces: 18000,
    cutPieces: 14200,
    bundlesReady: 710,
    cuttingEfficiency: 91,
    aiAlert: "WATCH",
    aiRecommendation:
      "Monitor cutting progress and confirm bundle transfer before sewing input.",
  },
  {
    id: "CUT-003",
    date: "2026-06-29",
    buyer: "Primark",
    style: "PRM-3307",
    fabricType: "Fleece",
    rollStatus: "RELAXED",
    markerEfficiency: 80.8,
    fabricUtilization: 85.1,
    endLossPercent: 4.3,
    wastagePercent: 14.9,
    plannedPieces: 12000,
    cutPieces: 6400,
    bundlesReady: 320,
    cuttingEfficiency: 78,
    aiAlert: "CRITICAL",
    aiRecommendation:
      "Marker efficiency is below target. Review lay plan, hood panels and roll utilization before continuing bulk cutting.",
  },
];