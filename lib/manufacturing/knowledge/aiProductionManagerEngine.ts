import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AIProductionManagerResponse {
  query: string;

  productionRisks: string[];

  rootCauses: string[];

  improvementActions: string[];

  expectedBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAIProductionManager(
  query: string
): AIProductionManagerResponse {

  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    productionRisks: [
      "Low line efficiency",
      "Production target not achieved",
      "High work-in-progress",
      "Shipment delay risk",
      "Operator imbalance",
    ],

    rootCauses: [
      "Poor production planning",
      "Machine downtime",
      "Material shortage",
      "Operator absenteeism",
      "Line bottleneck",
    ],

    improvementActions: [
      "Review hourly production",
      "Balance operators",
      "Remove bottlenecks",
      "Improve production planning",
      "Coordinate with maintenance and IE",
    ],

    expectedBenefits: [
      "Higher production efficiency",
      "Better on-time delivery",
      "Lower production cost",
      "Improved customer satisfaction",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}