type PredictiveInput = {
  productionEfficiency: number;
  productionDelayRisk: number;

  inventoryAgeingAlerts: number;

  machineBreakdownRisk: number;

  totalRejections: number;
  totalWastage: number;

  totalEstimatedLoss: number;
};

function clampProbability(value: number) {
  if (value < 0) return 0;
  if (value > 100) return 100;

  return Math.round(value);
}

export function predictShipmentDelayRisk(
  productionDelayRisk: number,
  machineBreakdownRisk: number
) {
  let probability = 0;

  probability += productionDelayRisk * 0.8;
  probability += machineBreakdownRisk * 3;

  return clampProbability(probability);
}

export function predictInventoryRisk(
  inventoryAgeingAlerts: number
) {
  let probability = 0;

  probability += inventoryAgeingAlerts * 7;

  return clampProbability(probability);
}

export function predictRejectionRisk(
  totalRejections: number,
  totalWastage: number
) {
  let probability = 0;

  probability += totalRejections * 0.05;
  probability += totalWastage * 0.03;

  return clampProbability(probability);
}

export function predictProfitabilityRisk(
  totalEstimatedLoss: number,
  productionEfficiency: number
) {
  let probability = 0;

  probability += totalEstimatedLoss * 0.00005;

  probability +=
    (100 - productionEfficiency) * 1.2;

  return clampProbability(probability);
}

export function generatePredictiveExecutiveSummary(
  input: PredictiveInput
) {
  const shipmentDelayRisk =
    predictShipmentDelayRisk(
      input.productionDelayRisk,
      input.machineBreakdownRisk
    );

  const inventoryRisk =
    predictInventoryRisk(
      input.inventoryAgeingAlerts
    );

  const rejectionRisk =
    predictRejectionRisk(
      input.totalRejections,
      input.totalWastage
    );

  const profitabilityRisk =
    predictProfitabilityRisk(
      input.totalEstimatedLoss,
      input.productionEfficiency
    );

  let overallRisk = Math.round(
    (
      shipmentDelayRisk +
      inventoryRisk +
      rejectionRisk +
      profitabilityRisk
    ) / 4
  );

  let operationalForecast =
    "Operational outlook stable.";

  if (overallRisk > 75) {
    operationalForecast =
      "Critical operational instability predicted. Immediate executive action required.";
  } else if (overallRisk > 55) {
    operationalForecast =
      "High operational risk predicted. Recovery and monitoring actions required.";
  } else if (overallRisk > 35) {
    operationalForecast =
      "Moderate operational pressure predicted. Increase operational control.";
  }

  return {
    shipmentDelayRisk,
    inventoryRisk,
    rejectionRisk,
    profitabilityRisk,

    overallRisk,
    operationalForecast,
  };
}