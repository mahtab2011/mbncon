export interface MarkerRecommendationInput {
  requestedGarments: number;

  recommendedGarments: number;

  requestedUtilisation: number;
  recommendedUtilisation: number;

  requestedWaste: number;
  recommendedWaste: number;

  requestedMarkerLength: number;
  recommendedMarkerLength: number;

  fabricWidth: number;

  rollLength: number;

  costPerMetre: number;

  orderQuantity: number;
}

export interface RecommendationItem {
  title: string;
  value: string;
}

export interface MarkerRecommendation {
  score: number;

  stars: number;

  recommendation: string;

  savingsPercent: number;

  estimatedFabricSaving: number;

  estimatedCostSaving: number;

  items: RecommendationItem[];
}

export function createMarkerRecommendation(
  input: MarkerRecommendationInput
): MarkerRecommendation {

  const savingsPercent =
    input.requestedWaste -
    input.recommendedWaste;

  const metresSavedPerGarment =
    (input.requestedMarkerLength -
      input.recommendedMarkerLength) / 100;

  const estimatedFabricSaving =
    metresSavedPerGarment *
    input.orderQuantity;

  const estimatedCostSaving =
    estimatedFabricSaving *
    input.costPerMetre;

  let stars = 3;

  if (savingsPercent > 2)
    stars = 4;

  if (savingsPercent > 5)
    stars = 5;

  const score =
    Math.round(
      input.recommendedUtilisation
    );

  return {

    score,

    stars,

    recommendation:

      input.recommendedGarments ===
      input.requestedGarments

        ? "Requested marker is already close to optimum."

        : `AI recommends ${input.recommendedGarments} garments instead of ${input.requestedGarments}.`,

    savingsPercent,

    estimatedFabricSaving,

    estimatedCostSaving,

    items: [

      {
        title:
          "Requested",

        value:
          `${input.requestedGarments} garments`
      },

      {
        title:
          "Recommended",

        value:
          `${input.recommendedGarments} garments`
      },

      {
        title:
          "Utilisation",

        value:
          `${input.recommendedUtilisation.toFixed(1)} %`
      },

      {
        title:
          "Waste",

        value:
          `${input.recommendedWaste.toFixed(1)} %`
      },

      {
        title:
          "Fabric Saving",

        value:
          `${estimatedFabricSaving.toFixed(2)} m`
      },

      {
        title:
          "Estimated Saving",

        value:
          `£${estimatedCostSaving.toFixed(2)}`
      }

    ]

  };

}