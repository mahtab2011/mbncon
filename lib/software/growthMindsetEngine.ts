export type GrowthMindsetRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type GrowthMindsetInput = {
  learningParticipationScore: number;
  changeReadinessScore: number;
  coachingQualityScore: number;
  feedbackCultureScore: number;
  crossTrainingScore: number;
  mistakeFearLevel: number;
  resistanceToChangeLevel: number;
  blameCultureLevel: number;
};

export type GrowthMindsetResult = {
  overallScore: number;
  riskLevel: GrowthMindsetRiskLevel;
  adaptabilityStatus: string;
  resistanceRisk: GrowthMindsetRiskLevel;
  learningCultureRisk: GrowthMindsetRiskLevel;
  recommendations: string[];
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getRiskLevel(score: number): GrowthMindsetRiskLevel {
  if (score >= 80) return "Low";
  if (score >= 60) return "Medium";
  if (score >= 40) return "High";
  return "Critical";
}

export function calculateGrowthMindsetScore(
  input: GrowthMindsetInput
): number {
  const positiveScore =
    input.learningParticipationScore * 0.22 +
    input.changeReadinessScore * 0.2 +
    input.coachingQualityScore * 0.18 +
    input.feedbackCultureScore * 0.15 +
    input.crossTrainingScore * 0.15;

  const negativePressure =
    input.mistakeFearLevel * 0.35 +
    input.resistanceToChangeLevel * 0.35 +
    input.blameCultureLevel * 0.3;

  return clampScore(positiveScore + 10 - negativePressure * 0.35);
}

export function assessResistanceRisk(
  input: GrowthMindsetInput
): GrowthMindsetRiskLevel {
  const riskScore =
    input.resistanceToChangeLevel * 0.45 +
    input.mistakeFearLevel * 0.3 +
    input.blameCultureLevel * 0.25;

  if (riskScore >= 75) return "Critical";
  if (riskScore >= 55) return "High";
  if (riskScore >= 35) return "Medium";
  return "Low";
}

export function assessLearningCultureRisk(
  input: GrowthMindsetInput
): GrowthMindsetRiskLevel {
  const cultureScore =
    input.learningParticipationScore * 0.3 +
    input.coachingQualityScore * 0.25 +
    input.feedbackCultureScore * 0.25 +
    input.crossTrainingScore * 0.2;

  return getRiskLevel(cultureScore);
}

export function generateGrowthMindsetRecommendations(
  input: GrowthMindsetInput
): string[] {
  const recommendations: string[] = [];

  if (input.learningParticipationScore < 60) {
    recommendations.push(
      "Increase employee involvement in improvement meetings, Kaizen actions, and practical learning activities."
    );
  }

  if (input.changeReadinessScore < 60) {
    recommendations.push(
      "Introduce small-step change adoption routines before major operational transformation."
    );
  }

  if (input.coachingQualityScore < 60) {
    recommendations.push(
      "Strengthen supervisor coaching skills so employees receive developmental guidance instead of pressure-only instructions."
    );
  }

  if (input.feedbackCultureScore < 60) {
    recommendations.push(
      "Improve feedback quality by linking comments to effort, method, teamwork, and improvement behaviour."
    );
  }

  if (input.crossTrainingScore < 60) {
    recommendations.push(
      "Expand cross-training and multi-skill development to reduce dependency on fixed-role capability."
    );
  }

  if (input.mistakeFearLevel > 50) {
    recommendations.push(
      "Reduce fear of mistakes by separating learning errors from careless non-compliance."
    );
  }

  if (input.resistanceToChangeLevel > 50) {
    recommendations.push(
      "Investigate change resistance drivers such as poor communication, low trust, workload pressure, or lack of involvement."
    );
  }

  if (input.blameCultureLevel > 50) {
    recommendations.push(
      "Shift from blame-based review to root-cause learning review across departments."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Adaptive learning indicators are stable. Continue coaching, feedback, cross-training, and improvement routines."
    );
  }

  return recommendations;
}

export function analyseGrowthMindset(
  input: GrowthMindsetInput
): GrowthMindsetResult {
  const overallScore = calculateGrowthMindsetScore(input);
  const resistanceRisk = assessResistanceRisk(input);
  const learningCultureRisk = assessLearningCultureRisk(input);

  return {
    overallScore,
    riskLevel: getRiskLevel(overallScore),
    resistanceRisk,
    learningCultureRisk,
    adaptabilityStatus:
      overallScore >= 80
        ? "Strong adaptive learning culture"
        : overallScore >= 60
        ? "Stable learning culture with improvement opportunity"
        : overallScore >= 40
        ? "Learning resistance and rigidity detected"
        : "Critical fixed-behaviour risk",
    recommendations: generateGrowthMindsetRecommendations(input),
  };
}