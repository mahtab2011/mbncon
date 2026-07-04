export interface FabricConsumptionRecord {
  id: string;
  buyer: string;
  style: string;
  fabricType: string;
  orderQty: number;
  fabricWidthCm: number;
  markerEfficiency: number;
  baseConsumptionPerPcMeter: number;
  shrinkagePercent: number;
  wastagePercent: number;
  bufferPercent: number;
  requiredFabricMeter: number;
  totalFabricWithBufferMeter: number;
  shortageRisk: "LOW" | "MEDIUM" | "HIGH";
  aiRecommendation: string;
}

export const fabricConsumptionMaster: FabricConsumptionRecord[] = [
  {
    id: "FCN-001",
    buyer: "H&M",
    style: "HNM-2401",
    fabricType: "100% Cotton Jersey",
    orderQty: 25000,
    fabricWidthCm: 180,
    markerEfficiency: 86.4,
    baseConsumptionPerPcMeter: 0.82,
    shrinkagePercent: 4,
    wastagePercent: 3,
    bufferPercent: 2,
    requiredFabricMeter: 21935,
    totalFabricWithBufferMeter: 22374,
    shortageRisk: "LOW",
    aiRecommendation:
      "Consumption is stable. Maintain current marker and fabric issue plan.",
  },
  {
    id: "FCN-002",
    buyer: "Zara",
    style: "ZRA-1188",
    fabricType: "Cotton Spandex",
    orderQty: 18000,
    fabricWidthCm: 175,
    markerEfficiency: 89.5,
    baseConsumptionPerPcMeter: 0.74,
    shrinkagePercent: 5,
    wastagePercent: 2.5,
    bufferPercent: 2,
    requiredFabricMeter: 14319,
    totalFabricWithBufferMeter: 14605,
    shortageRisk: "LOW",
    aiRecommendation:
      "Good marker efficiency. Fabric requirement appears controlled.",
  },
  {
    id: "FCN-003",
    buyer: "Primark",
    style: "PRM-3307",
    fabricType: "Fleece",
    orderQty: 12000,
    fabricWidthCm: 185,
    markerEfficiency: 80.8,
    baseConsumptionPerPcMeter: 1.45,
    shrinkagePercent: 6,
    wastagePercent: 5,
    bufferPercent: 3,
    requiredFabricMeter: 19314,
    totalFabricWithBufferMeter: 19893,
    shortageRisk: "HIGH",
    aiRecommendation:
      "High shortage risk. Improve marker efficiency and secure additional fleece before bulk cutting.",
  },
];