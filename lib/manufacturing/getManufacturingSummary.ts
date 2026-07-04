import {
  productionSummary,
  executiveAlerts,
  factoryHealth,
} from "./manufacturingData";

export type ManufacturingSummary = {
  production: typeof productionSummary;
  health: typeof factoryHealth;
  alerts: typeof executiveAlerts;
};

export async function getManufacturingSummary(): Promise<ManufacturingSummary> {
  // Temporary implementation.
  // In the next phase this will retrieve live Firestore data.

  return {
    production: productionSummary,
    health: factoryHealth,
    alerts: executiveAlerts,
  };
}