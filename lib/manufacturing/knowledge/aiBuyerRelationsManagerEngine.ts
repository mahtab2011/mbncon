import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AIBuyerRelationsManagerResponse {
  query: string;

  buyerRisks: string[];

  rootCauses: string[];

  improvementActions: string[];

  expectedBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAIBuyerRelationsManager(
  query: string
): AIBuyerRelationsManagerResponse {

  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    buyerRisks: [
      "Shipment delay",
      "Buyer audit failure",
      "Quality complaint",
      "Low buyer confidence",
      "Repeat order risk",
    ],

    rootCauses: [
      "Late production",
      "Compliance gaps",
      "Quality issues",
      "Poor communication",
      "Documentation delays",
    ],

    improvementActions: [
      "Improve buyer communication",
      "Review shipment readiness",
      "Complete compliance documentation",
      "Resolve quality issues before shipment",
      "Conduct pre-shipment review meetings",
    ],

    expectedBenefits: [
      "Improved buyer satisfaction",
      "Higher repeat business",
      "Reduced shipment delays",
      "Stronger long-term partnerships",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}