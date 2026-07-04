export type GPALineOperationInput = {
  operationId: string;
  operationName: string;
  operatorName: string;
  smv: number;
  actualCycleTime: number;
  hourlyTarget: number;
  hourlyOutput: number;
  skillLevel: "LOW" | "MEDIUM" | "HIGH" | "EXPERT";
};

export type GPALineBalancingResult = {
  operationId: string;
  operationName: string;
  operatorName: string;
  loadStatus: "UNDERLOADED" | "BALANCED" | "OVERLOADED" | "BOTTLENECK";
  efficiencyPercent: number;
  idleRisk: number;
  overloadRisk: number;
  recommendedAction: string;
  bnRecommendedAction: string;
};

export type GPALineBalancingSummary = {
  lineBalanceScore: number;
  bottleneckOperations: number;
  overloadedOperations: number;
  underloadedOperations: number;
  averageEfficiency: number;
  executiveSummary: string;
  bnExecutiveSummary: string;
};

export function analyzeLineBalancing(
  operations: GPALineOperationInput[]
): {
  results: GPALineBalancingResult[];
  summary: GPALineBalancingSummary;
} {
  const results: GPALineBalancingResult[] = operations.map((operation) => {
    const efficiencyPercent =
      operation.hourlyTarget === 0
        ? 0
        : (operation.hourlyOutput / operation.hourlyTarget) * 100;

    const cycleGap =
      operation.actualCycleTime - operation.smv;

    let loadStatus: GPALineBalancingResult["loadStatus"] = "BALANCED";
    let idleRisk = 0;
    let overloadRisk = 0;

    let recommendedAction =
      "Maintain current operation allocation.";
    let bnRecommendedAction =
      "বর্তমান অপারেশন বণ্টন বজায় রাখুন।";

    if (efficiencyPercent < 70 || cycleGap > operation.smv * 0.35) {
      loadStatus = "BOTTLENECK";
      overloadRisk = 90;
      recommendedAction =
        "Break down the operation, add support, or move a skilled operator to this point.";
      bnRecommendedAction =
        "অপারেশন ভাগ করুন, সাপোর্ট দিন অথবা দক্ষ অপারেটর এই পয়েন্টে দিন।";
    } else if (efficiencyPercent < 85 || cycleGap > operation.smv * 0.2) {
      loadStatus = "OVERLOADED";
      overloadRisk = 65;
      recommendedAction =
        "Review method, reduce unnecessary motion and consider helper support.";
      bnRecommendedAction =
        "মেথড রিভিউ করুন, অপ্রয়োজনীয় মুভমেন্ট কমান এবং হেলপার সাপোর্ট বিবেচনা করুন।";
    } else if (efficiencyPercent > 115 && cycleGap < 0) {
      loadStatus = "UNDERLOADED";
      idleRisk = 70;
      recommendedAction =
        "Move partial work from an overloaded operation to this operator.";
      bnRecommendedAction =
        "ওভারলোডেড অপারেশন থেকে কিছু কাজ এই অপারেটরের কাছে দিন।";
    }

    if (operation.skillLevel === "LOW" && loadStatus !== "UNDERLOADED") {
      recommendedAction +=
        " Provide skill training and close supervision.";
      bnRecommendedAction +=
        " স্কিল ট্রেনিং এবং ঘনিষ্ঠ তদারকি দিন।";
    }

    return {
      operationId: operation.operationId,
      operationName: operation.operationName,
      operatorName: operation.operatorName,
      loadStatus,
      efficiencyPercent: Number(efficiencyPercent.toFixed(1)),
      idleRisk,
      overloadRisk,
      recommendedAction,
      bnRecommendedAction,
    };
  });

  const bottleneckOperations = results.filter(
    (item) => item.loadStatus === "BOTTLENECK"
  ).length;

  const overloadedOperations = results.filter(
    (item) => item.loadStatus === "OVERLOADED"
  ).length;

  const underloadedOperations = results.filter(
    (item) => item.loadStatus === "UNDERLOADED"
  ).length;

  const averageEfficiency =
    results.length === 0
      ? 0
      : results.reduce(
          (sum, item) => sum + item.efficiencyPercent,
          0
        ) / results.length;

  const imbalancePenalty =
    bottleneckOperations * 18 +
    overloadedOperations * 10 +
    underloadedOperations * 6;

  const lineBalanceScore = Math.max(
    0,
    Math.min(100, averageEfficiency - imbalancePenalty)
  );

  let executiveSummary =
    "Line balance is acceptable, but continuous monitoring is required.";
  let bnExecutiveSummary =
    "লাইন ব্যালান্স গ্রহণযোগ্য, তবে নিয়মিত পর্যবেক্ষণ প্রয়োজন।";

  if (lineBalanceScore >= 85) {
    executiveSummary =
      "Line is well balanced with strong productivity flow.";
    bnExecutiveSummary =
      "লাইন ভালোভাবে ব্যালান্সড এবং উৎপাদন প্রবাহ শক্তিশালী।";
  } else if (lineBalanceScore < 60) {
    executiveSummary =
      "Line balance is weak and productivity loss is likely.";
    bnExecutiveSummary =
      "লাইন ব্যালান্স দুর্বল এবং উৎপাদন ক্ষতির সম্ভাবনা আছে।";
  }

  return {
    results,
    summary: {
      lineBalanceScore: Number(lineBalanceScore.toFixed(1)),
      bottleneckOperations,
      overloadedOperations,
      underloadedOperations,
      averageEfficiency: Number(averageEfficiency.toFixed(1)),
      executiveSummary,
      bnExecutiveSummary,
    },
  };
}