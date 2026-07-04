import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AIComplianceConsultantResponse {
  query: string;

  complianceRisks: string[];

  correctiveActions: string[];

  expectedBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAIComplianceConsultant(
  query: string
): AIComplianceConsultantResponse {

  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    complianceRisks: [
      "Buyer audit failure",
      "Regulatory non-compliance",
      "Worker safety risk",
      "Loss of customer confidence",
    ],

    correctiveActions: [
      "Review compliance policies",
      "Verify required documentation",
      "Conduct internal compliance audit",
      "Close outstanding corrective actions",
      "Train responsible personnel",
    ],

    expectedBenefits: [
      "Improved buyer readiness",
      "Reduced compliance risk",
      "Higher audit scores",
      "Stronger factory governance",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}