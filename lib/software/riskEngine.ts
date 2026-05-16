export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RiskAssessment = {
  level: RiskLevel;
  score: number;
  message: string;
  action: string;
};

export function assessRisk(
  score: number,
  context: string = "Operational area"
): RiskAssessment {
  const safeScore = Math.max(0, Math.min(100, score));

  if (safeScore >= 85) {
    return {
      level: "Low",
      score: safeScore,
      message: `${context} is currently stable with low risk exposure.`,
      action: "Maintain monitoring and continue standard improvement activities.",
    };
  }

  if (safeScore >= 70) {
    return {
      level: "Medium",
      score: safeScore,
      message: `${context} shows moderate risk and requires management attention.`,
      action: "Review recent trend data and assign improvement ownership.",
    };
  }

  if (safeScore >= 50) {
    return {
      level: "High",
      score: safeScore,
      message: `${context} shows high operational risk and possible performance leakage.`,
      action: "Start corrective action planning and monitor daily until stabilized.",
    };
  }

  return {
    level: "Critical",
    score: safeScore,
    message: `${context} is in critical condition and may cause serious business loss.`,
    action: "Escalate immediately to senior management and launch urgent recovery plan.",
  };
}

export function assessProductionRisk(params: {
  efficiencyPercent: number;
  rejectionPercent: number;
  delayPercent: number;
}): RiskAssessment {
  const score =
    params.efficiencyPercent -
    params.rejectionPercent * 1.5 -
    params.delayPercent * 1.2;

  return assessRisk(score, "Production performance");
}

export function assessManpowerRisk(params: {
  absenteeismPercent: number;
  overtimeHours: number;
  plannedWorkers: number;
  actualWorkers: number;
}): RiskAssessment {
  const workerGap =
    params.plannedWorkers === 0
      ? 0
      : ((params.plannedWorkers - params.actualWorkers) /
          params.plannedWorkers) *
        100;

  const penalty =
    params.absenteeismPercent * 1.8 +
    workerGap * 1.5 +
    params.overtimeHours * 0.08;

  return assessRisk(100 - penalty, "Manpower stability");
}

export function assessWastageRisk(params: {
  wastagePercent: number;
  wastageQty: number;
  issuedQty: number;
}): RiskAssessment {
  const quantityImpact =
    params.issuedQty === 0 ? 0 : (params.wastageQty / params.issuedQty) * 100;

  const penalty = params.wastagePercent * 2 + quantityImpact;

  return assessRisk(100 - penalty, "Material wastage and rejection");
}

export function assessExportDelayRisk(params: {
  delayDays: number;
  orderValue: number;
  status: "On Time" | "Delayed" | "At Risk" | "Shipped";
}): RiskAssessment {
  let penalty = params.delayDays * 5;

  if (params.status === "At Risk") penalty += 15;
  if (params.status === "Delayed") penalty += 25;

  if (params.orderValue > 100000) penalty += 10;
  if (params.orderValue > 250000) penalty += 20;

  return assessRisk(100 - penalty, "Export shipment and buyer exposure");
}

export function assessUtilitiesRisk(params: {
  electricityCost: number;
  generatorFuelCost: number;
  gasCost: number;
  waterCost: number;
  productionHours: number;
}): RiskAssessment {
  const totalCost =
    params.electricityCost +
    params.generatorFuelCost +
    params.gasCost +
    params.waterCost;

  const costPerHour =
    params.productionHours === 0 ? totalCost : totalCost / params.productionHours;

  let score = 100;

  if (costPerHour > 500) score -= 15;
  if (costPerHour > 1000) score -= 25;
  if (params.generatorFuelCost > params.electricityCost * 0.5) score -= 20;

  return assessRisk(score, "Utilities consumption and energy dependency");
}

export function assessMaintenanceRisk(params: {
  downtimeHours: number;
  repairCost: number;
  breakdownCount: number;
}): RiskAssessment {
  const penalty =
    params.downtimeHours * 3 +
    params.breakdownCount * 8 +
    params.repairCost * 0.001;

  return assessRisk(100 - penalty, "Machine maintenance and downtime");
}

export function assessCashflowRisk(params: {
  receivablesDue: number;
  overdueAmount: number;
  monthlyRevenue: number;
}): RiskAssessment {
  const overdueRatio =
    params.monthlyRevenue === 0
      ? 0
      : (params.overdueAmount / params.monthlyRevenue) * 100;

  const receivablePressure =
    params.monthlyRevenue === 0
      ? 0
      : (params.receivablesDue / params.monthlyRevenue) * 100;

  const penalty = overdueRatio * 1.2 + receivablePressure * 0.6;

  return assessRisk(100 - penalty, "Cashflow and accounts receivable");
}

export function detectTrendRisk(
  currentValue: number,
  previousValue: number,
  tolerancePercent: number = 10
): RiskAssessment {
  if (previousValue === 0) {
    return assessRisk(75, "Trend comparison");
  }

  const changePercent =
    ((currentValue - previousValue) / previousValue) * 100;

  if (changePercent > tolerancePercent) {
    return {
      level: "High",
      score: 55,
      message: `Negative trend detected. Current value increased by ${changePercent.toFixed(
        2
      )}% compared with previous period.`,
      action:
        "Investigate root cause, review department performance, and apply corrective action.",
    };
  }

  if (changePercent < -tolerancePercent) {
    return {
      level: "Low",
      score: 90,
      message: `Positive improvement detected. Current value reduced by ${Math.abs(
        changePercent
      ).toFixed(2)}% compared with previous period.`,
      action: "Continue improvement actions and document best practice.",
    };
  }

  return {
    level: "Medium",
    score: 75,
    message: "Trend is stable but should remain under routine monitoring.",
    action: "Continue monitoring and compare against next period.",
  };
}

export function assessThresholdRisk(
  value: number,
  warningLimit: number,
  criticalLimit: number,
  context: string
): RiskAssessment {
  if (value >= criticalLimit) {
    return {
      level: "Critical",
      score: 35,
      message: `${context} has crossed the critical limit of ${criticalLimit}.`,
      action: "Immediate escalation and corrective action required.",
    };
  }

  if (value >= warningLimit) {
    return {
      level: "High",
      score: 55,
      message: `${context} has crossed the warning limit of ${warningLimit}.`,
      action: "Management review required before the issue becomes critical.",
    };
  }

  return {
    level: "Low",
    score: 90,
    message: `${context} is within acceptable control limits.`,
    action: "Continue normal monitoring.",
  };
}