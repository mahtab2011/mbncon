import { askAIProductionManager } from "./aiProductionManagerEngine";
import { askAIQualityManager } from "./aiQualityManagerEngine";
import { askAIIndustrialEngineeringManager } from "./aiIndustrialEngineeringManagerEngine";
import { askAIMaintenanceManager } from "./aiMaintenanceManagerEngine";

export interface AIProductionDirectorResponse {
  executiveSummary: string;

  keyRisks: string[];

  strategicActions: string[];

  productionAnalysis: unknown;

  qualityAnalysis: unknown;

  industrialEngineeringAnalysis: unknown;

  maintenanceAnalysis: unknown;
}

export function askAIProductionDirector(
  question: string
): AIProductionDirectorResponse {

  return {
    executiveSummary:
      "Production performance reviewed across Production, Quality, Industrial Engineering and Maintenance.",

    keyRisks: [
      "Line efficiency loss",
      "Machine downtime",
      "Quality variation",
      "Delivery risk",
    ],

    strategicActions: [
      "Increase line balancing frequency",
      "Improve preventive maintenance",
      "Strengthen inline quality control",
      "Monitor hourly production achievement",
    ],

    productionAnalysis:
      askAIProductionManager(question),

    qualityAnalysis:
      askAIQualityManager(question),

    industrialEngineeringAnalysis:
      askAIIndustrialEngineeringManager(question),

    maintenanceAnalysis:
      askAIMaintenanceManager(question),
  };
}