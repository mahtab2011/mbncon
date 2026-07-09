export type FabricConsumptionInput = {
  patternAreaSqInches: number;
  fabricWidthInches: number;
  markerEfficiencyPercent: number;
  quantity: number;
  matchingAllowancePercent: number;
  defectAllowancePercent: number;
};

export type FabricConsumptionResult = {
  estimatedFabricYards: number;
  estimatedWastePercent: number;
  fabricUtilizationPercent: number;
  aiReason: string;
  recommendations: string[];
};

export function calculateFabricConsumption(
  input: FabricConsumptionInput
): FabricConsumptionResult {
  const recommendations: string[] = [];

  const usableEfficiency =
    Math.max(40, Math.min(input.markerEfficiencyPercent, 95)) / 100;

  const totalArea =
    input.patternAreaSqInches * input.quantity;

  const adjustedArea =
    totalArea *
    (1 + input.matchingAllowancePercent / 100) *
    (1 + input.defectAllowancePercent / 100);

  const requiredLengthInches =
    adjustedArea /
    (input.fabricWidthInches * usableEfficiency);

  const estimatedFabricYards =
    requiredLengthInches / 36;

  const estimatedWastePercent =
    100 - input.markerEfficiencyPercent;

  if (input.markerEfficiencyPercent < 80) {
    recommendations.push(
      "Marker efficiency is below 80%. Consider rotating compatible pattern pieces or improving nesting."
    );
  }

  if (input.matchingAllowancePercent > 5) {
    recommendations.push(
      "Stripe/check matching is increasing fabric consumption. Review whether all pieces require strict matching."
    );
  }

  if (input.defectAllowancePercent > 3) {
    recommendations.push(
      "High defect allowance detected. Inspect fabric rolls before spreading."
    );
  }

  if (estimatedWastePercent > 18) {
    recommendations.push(
      "Fabric waste is relatively high. AI recommends another marker optimization pass."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Current marker assumptions are suitable for pilot production."
    );
  }

  return {
    estimatedFabricYards: Number(
      estimatedFabricYards.toFixed(2)
    ),
    estimatedWastePercent,
    fabricUtilizationPercent:
      input.markerEfficiencyPercent,
    aiReason:
      "AI estimates fabric consumption before cutting so the cutting master can compare layouts, reduce waste, improve costing, and plan fabric purchasing more accurately.",
    recommendations,
  };
}