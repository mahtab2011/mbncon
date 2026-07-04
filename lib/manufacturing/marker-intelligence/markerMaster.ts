export interface MarkerMaster {
  id: string;

  buyer: string;

  style: string;

  markerName: string;

  fabricWidthCm: number;

  markerLengthCm: number;

  garmentPieces: number;

  fabricAreaSqCm: number;

  markerAreaSqCm: number;

  efficiency: number;

  endLossPercent: number;

  fabricWastePercent: number;

  aiRecommendation: string;

  status:
    | "EXCELLENT"
    | "GOOD"
    | "NEEDS_IMPROVEMENT";
}

export const markerMaster: MarkerMaster[] = [

  {
    id: "MRK-001",

    buyer: "H&M",

    style: "HNM-2401",

    markerName: "Front + Back",

    fabricWidthCm: 180,

    markerLengthCm: 320,

    garmentPieces: 24,

    fabricAreaSqCm: 57600,

    markerAreaSqCm: 49750,

    efficiency: 86.4,

    endLossPercent: 2.1,

    fabricWastePercent: 11.5,

    aiRecommendation:
      "Marker efficiency is good. Maintain current placement strategy.",

    status: "GOOD",
  },

  {
    id: "MRK-002",

    buyer: "Zara",

    style: "ZRA-1188",

    markerName: "Complete Set",

    fabricWidthCm: 175,

    markerLengthCm: 340,

    garmentPieces: 20,

    fabricAreaSqCm: 59500,

    markerAreaSqCm: 53280,

    efficiency: 89.5,

    endLossPercent: 1.4,

    fabricWastePercent: 9.1,

    aiRecommendation:
      "Excellent marker. Continue with current nesting arrangement.",

    status: "EXCELLENT",
  },

  {
    id: "MRK-003",

    buyer: "Primark",

    style: "PRM-3307",

    markerName: "Hoodie Marker",

    fabricWidthCm: 185,

    markerLengthCm: 365,

    garmentPieces: 18,

    fabricAreaSqCm: 67525,

    markerAreaSqCm: 54580,

    efficiency: 80.8,

    endLossPercent: 4.3,

    fabricWastePercent: 14.9,

    aiRecommendation:
      "Rearrange sleeve and hood pieces to improve utilization by approximately 4%.",

    status: "NEEDS_IMPROVEMENT",
  },

];