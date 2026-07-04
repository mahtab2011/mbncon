export type GPAMethodStudyInput = {
  operationId: string;
  operationName: string;
  currentMethod: string;
  proposedMethod: string;

  unnecessaryMotions: number;
  transportationSteps: number;
  inspectionSteps: number;
  delayMinutes: number;

  operatorFatigue:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
};

export type GPAMethodStudyResult = {
  operationId: string;
  operationName: string;

  improvementScore: number;

  estimatedTimeSaving: number;

  estimatedEfficiencyGain: number;

  executivePriority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  recommendation: string;

  bnRecommendation: string;
};

export function analyzeMethodStudy(
  operations: GPAMethodStudyInput[]
): GPAMethodStudyResult[] {

  return operations.map((item) => {

    let score = 100;

    score -= item.unnecessaryMotions * 5;

    score -= item.transportationSteps * 3;

    score -= item.inspectionSteps * 2;

    score -= item.delayMinutes;

    if (item.operatorFatigue === "HIGH") {
      score -= 15;
    } else if (
      item.operatorFatigue === "MEDIUM"
    ) {
      score -= 8;
    }

    score = Math.max(0, score);

    const estimatedTimeSaving =
      Number(
        (
          item.unnecessaryMotions * 0.25 +
          item.transportationSteps * 0.18 +
          item.delayMinutes * 0.15
        ).toFixed(2)
      );

    const estimatedEfficiencyGain =
      Number(
        (
          estimatedTimeSaving * 4.5
        ).toFixed(1)
      );

    let executivePriority:
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "CRITICAL" = "LOW";

    if (score < 80) executivePriority = "MEDIUM";
    if (score < 60) executivePriority = "HIGH";
    if (score < 40) executivePriority = "CRITICAL";

    return {

      operationId: item.operationId,

      operationName: item.operationName,

      improvementScore: score,

      estimatedTimeSaving,

      estimatedEfficiencyGain,

      executivePriority,

      recommendation:
        "Simplify work sequence, reduce unnecessary motions and improve workplace layout.",

      bnRecommendation:
        "কাজের ধাপ সহজ করুন, অপ্রয়োজনীয় মুভমেন্ট কমান এবং কর্মস্থলের বিন্যাস উন্নত করুন।",
    };

  });

}