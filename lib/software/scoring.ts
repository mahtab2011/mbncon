export type ScoreResult = {
  score: number;
  grade: string;
  status: "Excellent" | "Good" | "Average" | "Critical";
  recommendation: string;
};

export function calculatePerformanceScore(
  values: number[],
  weights?: number[]
): ScoreResult {
  if (!values.length) {
    return {
      score: 0,
      grade: "N/A",
      status: "Critical",
      recommendation: "No operational data available for scoring.",
    };
  }

  const validWeights =
    weights && weights.length === values.length
      ? weights
      : values.map(() => 1);

  const weightedTotal = values.reduce(
    (sum, value, index) => sum + value * validWeights[index],
    0
  );

  const totalWeight = validWeights.reduce(
    (sum, weight) => sum + weight,
    0
  );

  const score = Number((weightedTotal / totalWeight).toFixed(2));

  let grade = "D";
  let status: ScoreResult["status"] = "Critical";
  let recommendation =
    "Immediate operational review and corrective action required.";

  if (score >= 90) {
    grade = "A+";
    status = "Excellent";
    recommendation =
      "Operational performance is highly stable and aligned with strategic objectives.";
  } else if (score >= 75) {
    grade = "A";
    status = "Good";
    recommendation =
      "Performance is healthy but continuous improvement opportunities remain.";
  } else if (score >= 60) {
    grade = "B";
    status = "Average";
    recommendation =
      "Moderate operational risk detected. Management should monitor performance trends closely.";
  }

  return {
    score,
    grade,
    status,
    recommendation,
  };
}

export function calculateFinancialLeakageScore(
  wastagePercent: number,
  delayPercent: number,
  rejectionPercent: number
): ScoreResult {
  const penalty =
    wastagePercent * 0.4 +
    delayPercent * 0.3 +
    rejectionPercent * 0.3;

  const finalScore = Math.max(0, 100 - penalty);

  return calculatePerformanceScore([finalScore]);
}

export function calculateWorkforceStabilityScore(
  absenteeism: number,
  turnover: number,
  overtimeDependency: number
): ScoreResult {
  const penalty =
    absenteeism * 0.4 +
    turnover * 0.3 +
    overtimeDependency * 0.3;

  const finalScore = Math.max(0, 100 - penalty);

  return calculatePerformanceScore([finalScore]);
}