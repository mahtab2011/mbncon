export type LineBalancingResult = {
  score: number;
  status: "EXCELLENT" | "GOOD" | "WATCH" | "CRITICAL";
  recommendation: string;
};

export function calculateEnterpriseLineBalancing(
  efficiency: number,
  quality: number,
  production: number
): LineBalancingResult {
  const score = Math.round(
    (efficiency * 0.4) +
    (production * 0.35) +
    (quality * 0.25)
  );

  if (score >= 90) {
    return {
      score,
      status: "EXCELLENT",
      recommendation:
        "Lines are operating at optimum balance.",
    };
  }

  if (score >= 80) {
    return {
      score,
      status: "GOOD",
      recommendation:
        "Minor balancing improvements may increase output.",
    };
  }

  if (score >= 65) {
    return {
      score,
      status: "WATCH",
      recommendation:
        "Review WIP distribution and operator allocation.",
    };
  }

  return {
    score,
    status: "CRITICAL",
    recommendation:
      "Immediate line balancing intervention required.",
  };
}