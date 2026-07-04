export type ProductionRiskInput = {
  production: number;
  efficiency: number;
  quality: number;
  factoryHealth: number;
};

export type ProductionRiskResult = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  score: number;
  message: string;
};

export function calculateProductionRisk(
  input: ProductionRiskInput
): ProductionRiskResult {
  const score = Math.round(
    (input.production * 0.3) +
      (input.efficiency * 0.25) +
      (input.quality * 0.25) +
      (input.factoryHealth * 0.2)
  );

  if (score >= 85) {
    return {
      riskLevel: "LOW",
      score,
      message: "Production is stable and factory execution is healthy.",
    };
  }

  if (score >= 70) {
    return {
      riskLevel: "MEDIUM",
      score,
      message: "Production requires management attention to avoid delay.",
    };
  }

  if (score >= 55) {
    return {
      riskLevel: "HIGH",
      score,
      message: "Production risk is high. Immediate corrective action required.",
    };
  }

  return {
    riskLevel: "CRITICAL",
    score,
    message: "Critical production risk detected. CEO-level intervention required.",
  };
}