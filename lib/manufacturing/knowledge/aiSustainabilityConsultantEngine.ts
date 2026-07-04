import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AISustainabilityConsultantResponse {
  query: string;

  sustainabilityRisks: string[];

  improvementOpportunities: string[];

  expectedBusinessBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAISustainabilityConsultant(
  query: string
): AISustainabilityConsultantResponse {
  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    sustainabilityRisks: [
      "Higher operating costs",
      "Reduced buyer confidence",
      "Lower ESG score",
      "Regulatory compliance risk",
    ],

    improvementOpportunities: [
      "Reduce carbon emissions",
      "Improve water stewardship",
      "Increase energy efficiency",
      "Strengthen waste recycling",
      "Improve chemical compliance",
    ],

    expectedBusinessBenefits: [
      "Lower production cost",
      "Improved buyer sustainability rating",
      "Higher ESG score",
      "Reduced environmental impact",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}