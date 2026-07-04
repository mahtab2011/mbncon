import { semanticKnowledgeSearch } from "./semanticKnowledgeSearch";

export interface AIMaintenanceManagerResponse {
  query: string;

  maintenanceRisks: string[];

  rootCauses: string[];

  improvementActions: string[];

  expectedBenefits: string[];

  supportingKnowledge: unknown[];
}

export function askAIMaintenanceManager(
  query: string
): AIMaintenanceManagerResponse {

  const knowledge =
    semanticKnowledgeSearch(query);

  return {
    query,

    maintenanceRisks: [
      "Frequent machine breakdowns",
      "Low machine availability",
      "Delayed preventive maintenance",
      "High repair cost",
      "Production downtime",
    ],

    rootCauses: [
      "Preventive maintenance overdue",
      "Poor lubrication",
      "Worn machine parts",
      "Operator misuse",
      "Lack of spare parts",
    ],

    improvementActions: [
      "Complete preventive maintenance schedule",
      "Review lubrication programme",
      "Replace worn components",
      "Maintain critical spare parts inventory",
      "Train operators on machine care",
    ],

    expectedBenefits: [
      "Higher machine availability",
      "Reduced downtime",
      "Lower maintenance cost",
      "Improved production stability",
    ],

    supportingKnowledge:
      knowledge.map((item) => item.item),
  };
}