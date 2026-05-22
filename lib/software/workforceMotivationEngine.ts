export type MotivationRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type WorkforceMotivationInput = {
  engagementScore: number;
  absenteeismRate: number;
  overtimePressure: number;
  recognitionScore: number;
  supervisorSupportScore: number;
  learningOpportunityScore: number;
  conflictLevel: number;
};

export type WorkforceMotivationResult = {
  overallScore: number;
  riskLevel: MotivationRiskLevel;
  engagementStatus: string;
  burnoutRisk: MotivationRiskLevel;
  leadershipDependency: MotivationRiskLevel;
  recommendations: string[];
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getRiskLevel(score: number): MotivationRiskLevel {
  if (score >= 80) return "Low";
  if (score >= 60) return "Medium";
  if (score >= 40) return "High";
  return "Critical";
}

export function calculateWorkforceMotivationScore(
  input: WorkforceMotivationInput
): number {
  const positiveScore =
    input.engagementScore * 0.3 +
    input.recognitionScore * 0.2 +
    input.supervisorSupportScore * 0.2 +
    input.learningOpportunityScore * 0.15;

  const negativePressure =
    input.absenteeismRate * 0.5 +
    input.overtimePressure * 0.25 +
    input.conflictLevel * 0.25;

  return clampScore(positiveScore + 15 - negativePressure);
}

export function assessBurnoutRisk(
  input: WorkforceMotivationInput
): MotivationRiskLevel {
  const riskScore =
    input.overtimePressure * 0.45 +
    input.absenteeismRate * 0.35 +
    input.conflictLevel * 0.2;

  if (riskScore >= 75) return "Critical";
  if (riskScore >= 55) return "High";
  if (riskScore >= 35) return "Medium";
  return "Low";
}

export function assessLeadershipDependency(
  input: WorkforceMotivationInput
): MotivationRiskLevel {
  const dependencyScore =
    (100 - input.supervisorSupportScore) * 0.4 +
    (100 - input.recognitionScore) * 0.3 +
    input.conflictLevel * 0.3;

  if (dependencyScore >= 75) return "Critical";
  if (dependencyScore >= 55) return "High";
  if (dependencyScore >= 35) return "Medium";
  return "Low";
}

export function generateMotivationRecommendations(
  input: WorkforceMotivationInput
): string[] {
  const recommendations: string[] = [];

  if (input.engagementScore < 60) {
    recommendations.push(
      "Increase workforce involvement in daily improvement discussions and problem-solving routines."
    );
  }

  if (input.recognitionScore < 60) {
    recommendations.push(
      "Improve recognition quality by giving specific feedback linked to effort, learning, teamwork, and operational contribution."
    );
  }

  if (input.supervisorSupportScore < 60) {
    recommendations.push(
      "Strengthen supervisor coaching behaviour and reduce pressure-only management practices."
    );
  }

  if (input.overtimePressure > 60) {
    recommendations.push(
      "Review overtime pressure, fatigue signals, workload balance, and recovery time across high-pressure departments."
    );
  }

  if (input.absenteeismRate > 30) {
    recommendations.push(
      "Investigate absenteeism patterns, morale decline, transport barriers, health pressure, and department-level disengagement."
    );
  }

  if (input.learningOpportunityScore < 60) {
    recommendations.push(
      "Create more visible learning opportunities, cross-training, skill development, and career-growth pathways."
    );
  }

  if (input.conflictLevel > 50) {
    recommendations.push(
      "Escalate team conflict patterns for leadership review and introduce structured communication routines."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Workforce motivation indicators are stable. Continue recognition, coaching, and engagement routines."
    );
  }

  return recommendations;
}

export function analyseWorkforceMotivation(
  input: WorkforceMotivationInput
): WorkforceMotivationResult {
  const overallScore = calculateWorkforceMotivationScore(input);
  const riskLevel = getRiskLevel(overallScore);
  const burnoutRisk = assessBurnoutRisk(input);
  const leadershipDependency = assessLeadershipDependency(input);

  return {
    overallScore,
    riskLevel,
    burnoutRisk,
    leadershipDependency,
    engagementStatus:
      overallScore >= 80
        ? "Strong workforce ownership culture"
        : overallScore >= 60
        ? "Stable but improvement needed"
        : overallScore >= 40
        ? "Motivation instability detected"
        : "Critical disengagement risk",
    recommendations: generateMotivationRecommendations(input),
  };
}