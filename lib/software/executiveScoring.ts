type ScoreInput = {
  totalEstimatedLoss: number;
  totalRecoveryOpportunity: number;

  productionDelayRisk: number;
  inventoryAgeingAlerts: number;

  machineBreakdownRisk: number;
  totalWastage: number;

  totalReworkExposure: number;
  totalRejectionExposure: number;

  criticalLossAreas: number;
};

function clampScore(score: number) {
  if (score < 0) return 0;
  if (score > 100) return 100;

  return Math.round(score);
}

export function calculateProductionStabilityScore(
  productionDelayRisk: number,
  machineBreakdownRisk: number,
  totalWastage: number
) {
  let score = 100;

  score -= productionDelayRisk * 0.6;
  score -= machineBreakdownRisk * 2;
  score -= totalWastage * 0.05;

  return clampScore(score);
}

export function calculateRecoveryEfficiencyScore(
  totalEstimatedLoss: number,
  totalRecoveryOpportunity: number
) {
  if (totalEstimatedLoss <= 0) {
    return 100;
  }

  const recoveryRatio =
    totalRecoveryOpportunity /
    totalEstimatedLoss;

  return clampScore(recoveryRatio * 100);
}

export function calculateInventoryRiskScore(
  inventoryAgeingAlerts: number
) {
  let score = 100;

  score -= inventoryAgeingAlerts * 5;

  return clampScore(score);
}

export function calculateOperationalRiskScore(
  criticalLossAreas: number,
  totalRejectionExposure: number,
  totalReworkExposure: number
) {
  let score = 100;

  score -= criticalLossAreas * 10;
  score -= totalRejectionExposure * 0.05;
  score -= totalReworkExposure * 0.002;

  return clampScore(score);
}

export function calculateExecutiveHealthScore(
  input: ScoreInput
) {
  const productionScore =
    calculateProductionStabilityScore(
      input.productionDelayRisk,
      input.machineBreakdownRisk,
      input.totalWastage
    );

  const recoveryScore =
    calculateRecoveryEfficiencyScore(
      input.totalEstimatedLoss,
      input.totalRecoveryOpportunity
    );

  const inventoryScore =
    calculateInventoryRiskScore(
      input.inventoryAgeingAlerts
    );

  const operationalScore =
    calculateOperationalRiskScore(
      input.criticalLossAreas,
      input.totalRejectionExposure,
      input.totalReworkExposure
    );

  const finalScore =
    productionScore * 0.3 +
    recoveryScore * 0.25 +
    inventoryScore * 0.2 +
    operationalScore * 0.25;

  let grade = "A";
  let status = "Excellent";

  if (finalScore < 85) {
    grade = "B";
    status = "Stable";
  }

  if (finalScore < 70) {
    grade = "C";
    status = "Moderate Risk";
  }

  if (finalScore < 55) {
    grade = "D";
    status = "High Risk";
  }

  if (finalScore < 40) {
    grade = "F";
    status = "Critical";
  }

  return {
    finalScore: clampScore(finalScore),

    productionScore,
    recoveryScore,
    inventoryScore,
    operationalScore,

    grade,
    status,
  };
}