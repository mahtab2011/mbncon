export type SizeQuantity = {
  size: string;
  quantity: number;
};

export type SizeAssortmentInput = {
  styleName: string;
  totalOrderQuantity: number;
  sizeQuantities: SizeQuantity[];
  fabricWidthInches: number;
  estimatedConsumptionPerPieceYards: number;
};

export type SizeAssortmentResult = {
  status: "ok" | "warning" | "critical";
  totalPlannedQuantity: number;
  quantityDifference: number;
  estimatedTotalFabricYards: number;
  aiReason: string;
  recommendations: string[];
};

export function analyzeSizeAssortment(
  input: SizeAssortmentInput
): SizeAssortmentResult {
  const totalPlannedQuantity = input.sizeQuantities.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const quantityDifference =
    totalPlannedQuantity - input.totalOrderQuantity;

  const estimatedTotalFabricYards =
    totalPlannedQuantity * input.estimatedConsumptionPerPieceYards;

  const recommendations: string[] = [];

  if (quantityDifference !== 0) {
    recommendations.push(
      "Size quantity total does not match order quantity. Recheck assortment before cutting."
    );
  }

  if (input.sizeQuantities.some((item) => item.quantity <= 0)) {
    recommendations.push(
      "One or more sizes have zero or negative quantity. Confirm whether these sizes are required."
    );
  }

  if (input.fabricWidthInches < 40) {
    recommendations.push(
      "Fabric width is narrow. Marker efficiency may be lower."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Size assortment looks consistent for pilot-level cutting planning."
    );
  }

  const status =
    quantityDifference !== 0
      ? "critical"
      : recommendations.length > 1
        ? "warning"
        : "ok";

  return {
    status,
    totalPlannedQuantity,
    quantityDifference,
    estimatedTotalFabricYards: Number(estimatedTotalFabricYards.toFixed(2)),
    aiReason:
      "AI asks for size assortment because marker planning depends on quantity by size, not only total order quantity.",
    recommendations,
  };
}