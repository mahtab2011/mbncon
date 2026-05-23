export interface SelfRegulatedPerformanceInput {
  focusLevel: number;
  emotionalControl: number;
  consistency: number;
  accountability: number;
  discipline: number;
  stressHandling: number;
}

export interface SelfRegulatedPerformanceResult {
  score: number;
  risk: "Low" | "Medium" | "High";
  observation: string;
  recommendation: string;
}

export function analyseSelfRegulatedPerformance(
  input: SelfRegulatedPerformanceInput
): SelfRegulatedPerformanceResult {
  const values = [
    input.focusLevel,
    input.emotionalControl,
    input.consistency,
    input.accountability,
    input.discipline,
    input.stressHandling,
  ];

  const score =
    values.reduce((sum, value) => sum + value, 0) / values.length;

  let risk: "Low" | "Medium" | "High" = "Low";

  if (score < 40) {
    risk = "High";
  } else if (score < 70) {
    risk = "Medium";
  }

  let observation = "";
  let recommendation = "";

  if (risk === "High") {
    observation =
      "Performance discipline instability detected. Focus inconsistency, emotional pressure, and behavioural disruption may affect operational reliability.";

    recommendation =
      "Introduce structured coaching, emotional resilience support, workload balancing, and self-management development plans.";
  } else if (risk === "Medium") {
    observation =
      "Moderate self-regulation capability detected with opportunities for behavioural consistency improvement.";

    recommendation =
      "Strengthen accountability systems, reflective learning, focus management, and structured performance routines.";
  } else {
    observation =
      "Strong self-regulated performance capability detected with stable behavioural discipline and emotional balance.";

    recommendation =
      "Maintain leadership mentoring, continuous growth programmes, and long-term personal mastery development.";
  }

  return {
    score: Number(score.toFixed(2)),
    risk,
    observation,
    recommendation,
  };
}