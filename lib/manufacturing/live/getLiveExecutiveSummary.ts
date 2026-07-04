import {
  firestoreManufacturingCollections,
} from "@/lib/manufacturing/firestoreManufacturingCollections";

export type LiveExecutiveSummary = {
  factoryHealth: number;
  productionEfficiency: number;
  qualityScore: number;
  cuttingScore: number;
  shipmentReadiness: number;
  criticalAlerts: number;
  aiSummary: string;
};

export async function getLiveExecutiveSummary(): Promise<LiveExecutiveSummary> {
  // RC-01 temporary service.
  // Next step: replace these demo values with Firestore reads
  // from firestoreManufacturingCollections.

  
  return {
    factoryHealth: 91,
    productionEfficiency: 89,
    qualityScore: 86,
    cuttingScore: 84,
    shipmentReadiness: 78,
    criticalAlerts: 3,
    aiSummary:
      "Factory is stable. Immediate attention should focus on shipment readiness, machine reliability and cutting efficiency.",
  };
}