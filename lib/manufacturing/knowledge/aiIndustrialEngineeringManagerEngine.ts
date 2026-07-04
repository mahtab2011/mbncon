import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AIIndustrialEngineeringManagerResponse {
  query: string;

  productivityRisks: string[];

  rootCauses: string[];

  improvementActions: string[];

  expectedBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAIIndustrialEngineeringManager(
  query: string
): AIIndustrialEngineeringManagerResponse {

  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    productivityRisks: [
      "Low line efficiency",
      "High operator idle time",
      "Unbalanced production line",
      "Poor workstation layout",
    ],

    rootCauses: [
      "Improper method",
      "Incorrect SMV",
      "Unbalanced workload",
      "Poor operator allocation",
      "Material waiting time",
    ],

    improvementActions: [
      "Conduct method study",
      "Update time study",
      "Rebalance production line",
      "Optimize workstation layout",
      "Review operator skill matrix",
    ],

    expectedBenefits: [
      "Higher line efficiency",
      "Lower production cost",
      "Improved throughput",
      "Reduced bottlenecks",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}