import {
  MarkerDecision,
  MarkerDecisionCandidate,
  MarkerPriority,
  decideBestMarker,
} from "./markerDecisionEngine";

import {
  MarkerRecommendation,
  MarkerRecommendationInput,
  createMarkerRecommendation,
} from "./markerRecommendationEngine";

export interface EngineeringConsultantInput {
  priority: MarkerPriority;

  requestedGarments: number;

  candidates: MarkerDecisionCandidate[];

  rollLength: number;

  fabricWidth: number;

  orderQuantity: number;

  costPerMetre: number;
}

export interface EngineeringConsultantReport {
  decision: MarkerDecision;

  recommendation: MarkerRecommendation;

  generatedAt: Date;

  version: string;
}

export function createEngineeringConsultantReport(
  input: EngineeringConsultantInput
): EngineeringConsultantReport {

  if (input.candidates.length === 0) {
    throw new Error("No engineering candidates available.");
  }

  const decision = decideBestMarker(
    input.candidates,
    input.priority
  );

  const requestedCandidate =
    input.candidates.find(
      c => c.garments === input.requestedGarments
    ) ?? decision.selected;

  const recommendationInput: MarkerRecommendationInput = {

    requestedGarments:
      requestedCandidate.garments,

    recommendedGarments:
      decision.selected.garments,

    requestedUtilisation:
      requestedCandidate.utilisation,

    recommendedUtilisation:
      decision.selected.utilisation,

    requestedWaste:
      requestedCandidate.waste,

    recommendedWaste:
      decision.selected.waste,

    requestedMarkerLength:
      requestedCandidate.markerLength,

    recommendedMarkerLength:
      decision.selected.markerLength,

    fabricWidth:
      input.fabricWidth,

    rollLength:
      input.rollLength,

    costPerMetre:
      input.costPerMetre,

    orderQuantity:
      input.orderQuantity,

  };

  const recommendation =
    createMarkerRecommendation(
      recommendationInput
    );

  return {

    decision,

    recommendation,

    generatedAt:
      new Date(),

    version:
      "RC4-017"

  };

}