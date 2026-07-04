export interface FabricOptimizerRecord {
  id: string;

  buyer: string;

  style: string;

  fabricType: string;

  markerEfficiency: number;

  fabricUtilization: number;

  estimatedSavingKg: number;

  estimatedSavingUSD: number;

  recommendedMarker: string;

  recommendedRoll: string;

  layPlan: string;

  confidence: number;

  aiRecommendation: string;
}

export const fabricOptimizerMaster: FabricOptimizerRecord[] = [

  {
    id: "OPT-001",

    buyer: "H&M",

    style: "HNM-2401",

    fabricType: "Cotton Jersey",

    markerEfficiency: 89.4,

    fabricUtilization: 91.2,

    estimatedSavingKg: 128,

    estimatedSavingUSD: 684,

    recommendedMarker: "MRK-018",

    recommendedRoll: "ROLL-142",

    layPlan: "Lay Plan A",

    confidence: 97,

    aiRecommendation:
      "Use Marker MRK-018 with Roll-142 for highest utilization and minimum end loss.",
  },

  {
    id: "OPT-002",

    buyer: "Zara",

    style: "ZRA-1188",

    fabricType: "Cotton Spandex",

    markerEfficiency: 87.8,

    fabricUtilization: 89.6,

    estimatedSavingKg: 95,

    estimatedSavingUSD: 505,

    recommendedMarker: "MRK-022",

    recommendedRoll: "ROLL-201",

    layPlan: "Lay Plan B",

    confidence: 94,

    aiRecommendation:
      "Group similar shade rolls before spreading to increase marker efficiency.",
  },

  {
    id: "OPT-003",

    buyer: "Primark",

    style: "PRM-3307",

    fabricType: "Fleece",

    markerEfficiency: 84.1,

    fabricUtilization: 86.3,

    estimatedSavingKg: 152,

    estimatedSavingUSD: 845,

    recommendedMarker: "MRK-031",

    recommendedRoll: "ROLL-308",

    layPlan: "Lay Plan C",

    confidence: 91,

    aiRecommendation:
      "Rebuild marker using hood nesting optimization before bulk cutting.",
  },

];