import { askAIFactoryConsultant } from "./aiFactoryConsultantEngine";
import { askAIIndustrialEngineer } from "./aiIndustrialEngineerEngine";
import { askAIQualityConsultant } from "./aiQualityConsultantEngine";
import { askAIMaintenanceConsultant } from "./aiMaintenanceConsultantEngine";

import { getManufacturingSummary } from "../getManufacturingSummary";
export interface ManufacturingIntelligenceReport {
  query: string;

  summary: Awaited<ReturnType<typeof getManufacturingSummary>>;

  factoryConsultant: ReturnType<
    typeof askAIFactoryConsultant
  >;

  industrialEngineer: ReturnType<
    typeof askAIIndustrialEngineer
  >;

  qualityConsultant: ReturnType<
    typeof askAIQualityConsultant
  >;

  maintenanceConsultant: ReturnType<
    typeof askAIMaintenanceConsultant
  >;
}

export async function buildManufacturingIntelligenceReport(
  query: string
): Promise<ManufacturingIntelligenceReport> {
  const summary =
    await getManufacturingSummary();

  return {
    query,

    summary,

    factoryConsultant:
      askAIFactoryConsultant(query),

    industrialEngineer:
      askAIIndustrialEngineer(query),

    qualityConsultant:
      askAIQualityConsultant(query),

    maintenanceConsultant:
      askAIMaintenanceConsultant(query),
  };
}