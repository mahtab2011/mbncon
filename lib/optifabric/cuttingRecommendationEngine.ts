export type CuttingRecommendationInput = {
  styleName: string;
  garmentType: string;
  fabricType: string;
  fabricWidthInches: number;
  markerEfficiencyPercent: number;
  repeatRiskScore: number;
  grainRiskScore: number;
  notchRiskScore: number;
  relationshipRiskScore: number;
  totalFabricYards: number;
};

export type CuttingRecommendationResult = {
  status: "ready" | "review" | "hold";
  overallRiskScore: number;
  executiveSummary: string;
  aiReason: string;
  recommendations: string[];
};

export function generateCuttingRecommendation(
  input: CuttingRecommendationInput
): CuttingRecommendationResult {
  const recommendations: string[] = [];

  const overallRiskScore = Math.round(
    input.repeatRiskScore * 0.25 +
      input.grainRiskScore * 0.25 +
      input.notchRiskScore * 0.2 +
      input.relationshipRiskScore * 0.2 +
      (100 - input.markerEfficiencyPercent) * 0.1
  );

  if (input.markerEfficiencyPercent < 80) {
    recommendations.push(
      "Run another marker optimization pass before cutting."
    );
  }

  if (input.repeatRiskScore >= 70) {
    recommendations.push(
      "Review fabric repeat or print matching before approving marker."
    );
  }

  if (input.grainRiskScore >= 70) {
    recommendations.push(
      "Hold cutting until grain direction is confirmed."
    );
  }

  if (input.notchRiskScore >= 70) {
    recommendations.push(
      "Hold cutting until notch condition is corrected."
    );
  }

  if (input.relationshipRiskScore >= 70) {
    recommendations.push(
      "Review linked pattern pieces before final marker approval."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Cutting plan is acceptable for pilot-level production."
    );
  }

  const status =
    overallRiskScore >= 70
      ? "hold"
      : overallRiskScore >= 40
        ? "review"
        : "ready";

  return {
    status,
    overallRiskScore,
    executiveSummary:
      `${input.styleName} / ${input.garmentType}: estimated fabric requirement is ${input.totalFabricYards} yards at ${input.markerEfficiencyPercent}% marker efficiency.`,
    aiReason:
      "AI gives this recommendation so the cutting master can decide whether to approve cutting, review the marker, or hold the plan before fabric is wasted.",
    recommendations,
  };
}