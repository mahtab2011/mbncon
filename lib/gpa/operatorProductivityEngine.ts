export type OperatorProductivityResult = {
  score: number;
  status: "EXCELLENT" | "GOOD" | "WATCH" | "CRITICAL";
  recommendation: string;
};

export function calculateOperatorProductivity(
  production: number,
  efficiency: number,
  quality: number
): OperatorProductivityResult {
  const score = Math.round(
    production * 0.45 +
    efficiency * 0.35 +
    quality * 0.20
  );

  if (score >= 90) {
    return {
      score,
      status: "EXCELLENT",
      recommendation:
        "Operator productivity is excellent across the enterprise.",
    };
  }

  if (score >= 80) {
    return {
      score,
      status: "GOOD",
      recommendation:
        "Maintain current supervision and coaching.",
    };
  }

  if (score >= 65) {
    return {
      score,
      status: "WATCH",
      recommendation:
        "Provide additional coaching and review work allocation.",
    };
  }

  return {
    score,
    status: "CRITICAL",
    recommendation:
      "Immediate intervention required. Review staffing, skills and training.",
    };
}