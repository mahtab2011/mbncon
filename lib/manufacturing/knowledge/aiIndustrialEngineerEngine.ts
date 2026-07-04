import { recommendManufacturingKnowledge } from "./knowledgeRecommendationEngine";

export interface AIIndustrialEngineerResponse {
  problem: string;

  productivityOpportunities: string[];

  methodStudyRecommendations: string[];

  estimatedImprovement: string;

  supportingKnowledge: unknown[];
}

export function askAIIndustrialEngineer(
  problem: string
): AIIndustrialEngineerResponse {
  const knowledge =
    recommendManufacturingKnowledge(problem);

  return {
    problem,

    productivityOpportunities: [
      "Reduce unnecessary motions.",
      "Review workstation layout.",
      "Review operator skill level.",
      "Check line balancing.",
    ],

    methodStudyRecommendations: [
      "Perform detailed time study.",
      "Perform activity sampling.",
      "Review SOP compliance.",
      "Evaluate ergonomic improvements.",
    ],

    estimatedImprovement:
      "Potential productivity improvement: 5–15% depending on implementation.",

    supportingKnowledge:
      knowledge.recommendations.map(
        (item) => item.item
      ),
  };
}