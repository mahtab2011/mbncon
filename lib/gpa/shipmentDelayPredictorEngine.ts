export type ShipmentPredictionInput = {
  shipmentReadiness: number;
  production: number;
  quality: number;
};

export type ShipmentPredictionResult = {
  delayRisk: "LOW" | "MEDIUM" | "HIGH";
  predictedReadiness: number;
  recommendation: string;
};

export function predictShipmentDelay(
  input: ShipmentPredictionInput
): ShipmentPredictionResult {
  const predictedReadiness = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (input.shipmentReadiness +
          input.production +
          input.quality) / 3
      )
    )
  );

  let delayRisk: ShipmentPredictionResult["delayRisk"];
  let recommendation: string;

  if (predictedReadiness >= 85) {
    delayRisk = "LOW";
    recommendation =
      "Shipment is on schedule. Continue monitoring.";
  } else if (predictedReadiness >= 70) {
    delayRisk = "MEDIUM";
    recommendation =
      "Review shipment planning and production progress.";
  } else {
    delayRisk = "HIGH";
    recommendation =
      "Immediate executive intervention required to avoid shipment delay.";
  }

  return {
    delayRisk,
    predictedReadiness,
    recommendation,
  };
}