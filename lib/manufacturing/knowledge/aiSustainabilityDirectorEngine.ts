import { askAISustainabilityConsultant } from "./aiSustainabilityConsultantEngine";
import { askAIComplianceConsultant } from "./aiComplianceConsultantEngine";

export interface AISustainabilityDirectorResponse {
  executiveSummary: string;

  keyRisks: string[];

  strategicActions: string[];

  sustainabilityAnalysis: unknown;

  complianceAnalysis: unknown;
}

export function askAISustainabilityDirector(
  question: string
): AISustainabilityDirectorResponse {

  return {

    executiveSummary:
      "Factory sustainability, ESG and compliance performance reviewed.",

    keyRisks: [
      "Carbon performance deterioration",
      "Environmental compliance gap",
      "Buyer sustainability risk",
      "ESG performance decline",
    ],

    strategicActions: [
      "Reduce carbon intensity",
      "Improve water stewardship",
      "Strengthen chemical compliance",
      "Improve ESG performance",
      "Review sustainability KPIs monthly",
    ],

    sustainabilityAnalysis:
      askAISustainabilityConsultant(question),

    complianceAnalysis:
      askAIComplianceConsultant(question),
  };
}