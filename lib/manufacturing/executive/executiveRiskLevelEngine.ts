export type ExecutiveRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export function calculateExecutiveRiskLevel(
  score: number
): ExecutiveRiskLevel {

  if (score >= 85) {
    return "LOW";
  }

  if (score >= 70) {
    return "MEDIUM";
  }

  if (score >= 50) {
    return "HIGH";
  }

  return "CRITICAL";
}