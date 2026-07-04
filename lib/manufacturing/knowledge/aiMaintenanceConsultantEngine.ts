import { recommendManufacturingKnowledge } from "./knowledgeRecommendationEngine";

export interface AIMaintenanceConsultantResponse {
  issue: string;

  probableMaintenanceRisks: string[];

  recommendedChecks: string[];

  correctiveRecommendations: string[];

  preventiveRecommendations: string[];

  supportingKnowledge: unknown[];
}

export function askAIMaintenanceConsultant(
  issue: string
): AIMaintenanceConsultantResponse {
  const knowledge =
    recommendManufacturingKnowledge(issue);

  return {
    issue,

    probableMaintenanceRisks: [
      "Machine downtime",
      "Quality defects",
      "Operator idle time",
      "Production loss",
    ],

    recommendedChecks: [
      "Check machine condition.",
      "Review preventive maintenance records.",
      "Inspect needle, hook, belt and lubrication.",
      "Verify safety guards.",
    ],

    correctiveRecommendations: [
      "Repair or adjust affected machine.",
      "Replace worn parts.",
      "Verify machine setting after repair.",
    ],

    preventiveRecommendations: [
      "Increase preventive maintenance frequency.",
      "Follow daily cleaning and lubrication routine.",
      "Train mechanics and operators on early warning signs.",
    ],

    supportingKnowledge:
      knowledge.recommendations.map(
        (item) => item.item
      ),
  };
}