export type ExecutiveScoreInput = {
  production: number;
  efficiency: number;
  quality: number;
  shipment: number;
  health: number;
};

export type ExecutiveScoreResult = {
  score: number;
  grade: "A" | "B" | "C" | "D";
  status: "EXCELLENT" | "GOOD" | "WATCH" | "CRITICAL";
};

export function calculateExecutiveScore(
  input: ExecutiveScoreInput
): ExecutiveScoreResult {
  const score = Math.round(
    (
      input.production +
      input.efficiency +
      input.quality +
      input.shipment +
      input.health
    ) / 5
  );

  let grade: ExecutiveScoreResult["grade"];
  let status: ExecutiveScoreResult["status"];

  if (score >= 90) {
    grade = "A";
    status = "EXCELLENT";
  } else if (score >= 80) {
    grade = "B";
    status = "GOOD";
  } else if (score >= 70) {
    grade = "C";
    status = "WATCH";
  } else {
    grade = "D";
    status = "CRITICAL";
  }

  return {
    score,
    grade,
    status,
  };
}