import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AIQualityManagerResponse {
  query: string;

  qualityRisks: string[];

  rootCauses: string[];

  correctiveActions: string[];

  preventiveActions: string[];

  expectedBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAIQualityManager(
  query: string
): AIQualityManagerResponse {

  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    qualityRisks: [
      "Customer complaints",
      "High DHU",
      "Buyer rejection",
      "Shipment delay",
    ],

    rootCauses: [
      "Operator skill gap",
      "Incorrect machine setting",
      "Needle problem",
      "Method variation",
      "Fabric defect",
    ],

    correctiveActions: [
      "Repair defective garments",
      "Adjust machine settings",
      "Replace damaged needle",
      "Retrain operator",
    ],

    preventiveActions: [
      "Strengthen inline inspection",
      "Improve operator certification",
      "Verify SOP compliance",
      "Review preventive maintenance",
    ],

    expectedBenefits: [
      "Lower DHU",
      "Higher First Pass Yield",
      "Improved buyer satisfaction",
      "Reduced repair cost",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}