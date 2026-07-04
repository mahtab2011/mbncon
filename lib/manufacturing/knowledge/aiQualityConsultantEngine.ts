import { recommendManufacturingKnowledge } from "./knowledgeRecommendationEngine";

export interface AIQualityConsultantResponse {
  issue: string;

  probableQualityRisks: string[];

  recommendedInspectionActivities: string[];

  correctiveRecommendations: string[];

  preventiveRecommendations: string[];

  supportingKnowledge: unknown[];
}

export function askAIQualityConsultant(
  issue: string
): AIQualityConsultantResponse {
  const knowledge =
    recommendManufacturingKnowledge(issue);

  return {
    issue,

    probableQualityRisks: [
      "Customer rejection",
      "Rework increase",
      "DHU increase",
      "Shipment delay",
    ],

    recommendedInspectionActivities: [
      "Perform inline inspection.",
      "Verify measurement.",
      "Inspect workmanship.",
      "Review defect history.",
    ],

    correctiveRecommendations: [
      "Apply approved corrective actions.",
      "Verify root cause.",
      "Monitor rework effectiveness.",
    ],

    preventiveRecommendations: [
      "Strengthen operator training.",
      "Review SOP compliance.",
      "Increase audit frequency.",
    ],

    supportingKnowledge:
      knowledge.recommendations.map(
        (item) => item.item
      ),
  };
}