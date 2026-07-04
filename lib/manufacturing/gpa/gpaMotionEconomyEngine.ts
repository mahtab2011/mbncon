export type GPAMotionEconomyInput = {
  operationId: string;
  operationName: string;

  leftHandMotions: number;
  rightHandMotions: number;

  bodyTurns: number;

  walkingDistanceMeters: number;

  unnecessaryReaches: number;

  toolSearchSeconds: number;

  fatigueLevel:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
};

export type GPAMotionEconomyResult = {
  operationId: string;

  operationName: string;

  motionScore: number;

  wastedMotionSeconds: number;

  ergonomicRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  expectedEfficiencyGain: number;

  recommendation: string;

  bnRecommendation: string;
};

export function analyzeMotionEconomy(
  operations: GPAMotionEconomyInput[]
): GPAMotionEconomyResult[] {

  return operations.map((item) => {

    let score = 100;

    score -= item.bodyTurns * 4;

    score -= item.walkingDistanceMeters * 2;

    score -= item.unnecessaryReaches * 3;

    score -= item.toolSearchSeconds * 0.8;

    if (item.fatigueLevel === "HIGH") {
      score -= 15;
    } else if (
      item.fatigueLevel === "MEDIUM"
    ) {
      score -= 8;
    }

    score = Math.max(0, score);

    const wastedMotionSeconds =
      Number(
        (
          item.bodyTurns * 0.9 +
          item.walkingDistanceMeters * 1.2 +
          item.unnecessaryReaches * 0.7 +
          item.toolSearchSeconds
        ).toFixed(1)
      );

    const expectedEfficiencyGain =
      Number(
        (
          wastedMotionSeconds * 0.6
        ).toFixed(1)
      );

    let ergonomicRisk:
      | "LOW"
      | "MEDIUM"
      | "HIGH" = "LOW";

    if (score < 80)
      ergonomicRisk = "MEDIUM";

    if (score < 60)
      ergonomicRisk = "HIGH";

    return {

      operationId: item.operationId,

      operationName: item.operationName,

      motionScore: score,

      wastedMotionSeconds,

      ergonomicRisk,

      expectedEfficiencyGain,

      recommendation:
        "Reduce body movement, improve workstation layout, position tools within normal reach and apply motion economy principles.",

      bnRecommendation:
        "শরীরের অপ্রয়োজনীয় নড়াচড়া কমান, কর্মস্থলের বিন্যাস উন্নত করুন, প্রয়োজনীয় সরঞ্জাম সহজ নাগালের মধ্যে রাখুন এবং মোশন ইকোনমির নীতি অনুসরণ করুন।",
    };

  });

}