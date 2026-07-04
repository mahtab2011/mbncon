import { recommendManufacturingKnowledge } from "./knowledgeRecommendationEngine";

export interface AIFactoryConsultantResponse {
  query: string;

  summary: string;

  totalKnowledgeMatches: number;

  recommendedNextSteps: string[];

  relatedKnowledge: unknown[];
}

export function askAIFactoryConsultant(
  query: string
): AIFactoryConsultantResponse {
  const knowledge =
    recommendManufacturingKnowledge(query);

  return {
    query,

    summary:
      "Relevant manufacturing knowledge has been found for this issue.",

    totalKnowledgeMatches:
      knowledge.totalMatches,

    recommendedNextSteps: [
      "Review related root causes.",
      "Check corrective actions.",
      "Check preventive actions.",
      "Verify applicable SOP.",
    ],

    relatedKnowledge:
      knowledge.recommendations.map((item) => item.item),
  };
}