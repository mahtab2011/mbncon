export type EmotionalResilienceRiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type EmotionalResilienceInput = {
  stressToleranceScore: number;
  recoverySpeedScore: number;
  emotionalFatigueLevel: number;
  burnoutPressureLevel: number;
  leadershipStabilityScore: number;
  conflictRecoveryScore: number;
  moraleRecoveryScore: number;
  workloadPressureLevel: number;
};

export type EmotionalResilienceResult = {
  overallScore: number;
  resilienceStatus: string;
  riskLevel: EmotionalResilienceRiskLevel;
  burnoutRisk: EmotionalResilienceRiskLevel;
  recoveryRisk: EmotionalResilienceRiskLevel;
  recommendations: string[];
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getRiskLevel(score: number): EmotionalResilienceRiskLevel {
  if (score >= 80) return "Low";
  if (score >= 60) return "Medium";
  if (score >= 40) return "High";
  return "Critical";
}

export function calculateEmotionalResilienceScore(
  input: EmotionalResilienceInput
): number {
  const positiveFactors =
    input.stressToleranceScore * 0.22 +
    input.recoverySpeedScore * 0.2 +
    input.leadershipStabilityScore * 0.18 +
    input.conflictRecoveryScore * 0.15 +
    input.moraleRecoveryScore * 0.15;

  const negativePressure =
    input.emotionalFatigueLevel * 0.35 +
    input.burnoutPressureLevel * 0.35 +
    input.workloadPressureLevel * 0.3;

  return clampScore(positiveFactors + 10 - negativePressure * 0.35);
}

export function assessBurnoutRisk(
  input: EmotionalResilienceInput
): EmotionalResilienceRiskLevel {
  const riskScore =
    input.emotionalFatigueLevel * 0.4 +
    input.burnoutPressureLevel * 0.35 +
    input.workloadPressureLevel * 0.25;

  if (riskScore >= 75) return "Critical";
  if (riskScore >= 55) return "High";
  if (riskScore >= 35) return "Medium";
  return "Low";
}

export function assessRecoveryRisk(
  input: EmotionalResilienceInput
): EmotionalResilienceRiskLevel {
  const recoveryScore =
    input.recoverySpeedScore * 0.35 +
    input.conflictRecoveryScore * 0.35 +
    input.moraleRecoveryScore * 0.3;

  return getRiskLevel(recoveryScore);
}

export function generateResilienceRecommendations(
  input: EmotionalResilienceInput
): string[] {
  const recommendations: string[] = [];

  if (input.stressToleranceScore < 60) {
    recommendations.push(
      "Introduce structured resilience coaching and operational pressure-management routines."
    );
  }

  if (input.recoverySpeedScore < 60) {
    recommendations.push(
      "Improve recovery capability after operational disruption, shipment escalation, and crisis events."
    );
  }

  if (input.emotionalFatigueLevel > 50) {
    recommendations.push(
      "Monitor emotional fatigue indicators across departments experiencing sustained operational pressure."
    );
  }

  if (input.burnoutPressureLevel > 50) {
    recommendations.push(
      "Review workload sustainability, overtime intensity, and emotional exhaustion signals."
    );
  }

  if (input.leadershipStabilityScore < 60) {
    recommendations.push(
      "Strengthen leadership calmness, communication consistency, and emotional regulation during operational instability."
    );
  }

  if (input.conflictRecoveryScore < 60) {
    recommendations.push(
      "Reduce conflict escalation duration by improving structured communication and resolution practices."
    );
  }

  if (input.moraleRecoveryScore < 60) {
    recommendations.push(
      "Support morale recovery through recognition, transparency, and team-level operational support."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Emotional resilience indicators are stable. Continue adaptive leadership and workforce support routines."
    );
  }

  return recommendations;
}

export function analyseEmotionalResilience(
  input: EmotionalResilienceInput
): EmotionalResilienceResult {
  const overallScore =
    calculateEmotionalResilienceScore(input);

  const burnoutRisk = assessBurnoutRisk(input);

  const recoveryRisk = assessRecoveryRisk(input);

  return {
    overallScore,
    burnoutRisk,
    recoveryRisk,
    riskLevel: getRiskLevel(overallScore),

    resilienceStatus:
      overallScore >= 80
        ? "Strong emotional resilience capability"
        : overallScore >= 60
        ? "Stable resilience with manageable pressure"
        : overallScore >= 40
        ? "Emotional instability and fatigue risk detected"
        : "Critical resilience breakdown risk",

    recommendations: generateResilienceRecommendations(input),
  };
}