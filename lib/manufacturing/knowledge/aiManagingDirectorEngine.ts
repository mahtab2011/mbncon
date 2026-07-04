import { askAIProductionDirector } from "./aiProductionDirectorEngine";
import { askAISustainabilityDirector } from "./aiSustainabilityDirectorEngine";
import { askAICommercialDirector } from "./aiCommercialDirectorEngine";

export interface AIManagingDirectorResponse {
  executiveSummary: string;

  enterpriseRisks: string[];

  strategicPriorities: string[];

  production: unknown;

  sustainability: unknown;

  commercial: unknown;
}

export function askAIManagingDirector(
  question: string
): AIManagingDirectorResponse {

  return {

    executiveSummary:
      "Enterprise-wide factory review completed using Production, Sustainability and Commercial Directors.",

    enterpriseRisks: [
      "Production interruption",
      "Buyer dissatisfaction",
      "Compliance exposure",
      "Increasing operating cost",
      "Sustainability performance decline",
    ],

    strategicPriorities: [
      "Protect on-time delivery",
      "Increase productivity",
      "Reduce operating cost",
      "Strengthen buyer confidence",
      "Improve sustainability performance",
    ],

    production:
      askAIProductionDirector(question),

    sustainability:
      askAISustainabilityDirector(question),

    commercial:
      askAICommercialDirector(question),
  };
}