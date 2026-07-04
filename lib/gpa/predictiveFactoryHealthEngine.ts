export type PredictiveHealthInput = {
  currentHealth: number;
  trendChange: number;
};

export type PredictiveHealthResult = {
  predictedHealth: number;
  outlook: "IMPROVING" | "STABLE" | "DECLINING";
  recommendation: string;
};

export function predictFactoryHealth(
  input: PredictiveHealthInput
): PredictiveHealthResult {
  const predictedHealth = Math.max(
    0,
    Math.min(100, input.currentHealth + input.trendChange)
  );

  let outlook: PredictiveHealthResult["outlook"];
  let recommendation: string;

  if (input.trendChange > 1) {
    outlook = "IMPROVING";
    recommendation =
      "Maintain current operational improvements.";
  } else if (input.trendChange < -1) {
    outlook = "DECLINING";
    recommendation =
      "Immediate executive review recommended.";
  } else {
    outlook = "STABLE";
    recommendation =
      "Continue monitoring key operational KPIs.";
  }

  return {
    predictedHealth,
    outlook,
    recommendation,
  };
}