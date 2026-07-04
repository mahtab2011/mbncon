import {
  GPAProductionRecord,
  calculateGPAProductionSummary,
} from "./gpaProductionDataModel";

export type GPAFactoryHealthStatus =
  | "EXCELLENT"
  | "GOOD"
  | "STABLE"
  | "UNDER_PRESSURE"
  | "CRITICAL";

export type GPAFactoryHealthResult = {
  healthScore: number;
  status: GPAFactoryHealthStatus;
  productivityScore: number;
  qualityScore: number;
  wipScore: number;
  bottleneckScore: number;
  manpowerScore: number;
  machineScore: number;
  executiveSummary: string;
  bnExecutiveSummary: string;
  recommendedAction: string;
  bnRecommendedAction: string;
};

export function calculateGPAFactoryHealth(
  records: GPAProductionRecord[]
): GPAFactoryHealthResult {
  const summary = calculateGPAProductionSummary(records);

  const productivityScore = Math.min(
    100,
    Math.max(0, summary.achievementPercent)
  );

  const defectRate =
    summary.totalOutput === 0
      ? 0
      : (summary.totalDefects / summary.totalOutput) * 100;

  const qualityScore = Math.max(0, 100 - defectRate * 10);

  const averageWip =
    records.length === 0
      ? 0
      : summary.totalWip / records.length;

  const wipScore = Math.max(0, 100 - averageWip * 0.35);

  const bottleneckPenalty =
    summary.bottleneckCount * 12 +
    summary.criticalBottleneckCount * 18;

  const bottleneckScore = Math.max(0, 100 - bottleneckPenalty);

  const manpowerGaps = records.reduce((sum, item) => {
    const gap = Math.max(0, item.targetOperators - item.operators);
    return sum + gap;
  }, 0);

  const totalTargetOperators = records.reduce(
    (sum, item) => sum + item.targetOperators,
    0
  );

  const manpowerGapPercent =
    totalTargetOperators === 0
      ? 0
      : (manpowerGaps / totalTargetOperators) * 100;

  const manpowerScore = Math.max(0, 100 - manpowerGapPercent * 4);

  const machineProblems = records.filter(
    (item) =>
      item.machineStatus === "BREAKDOWN" ||
      item.machineStatus === "MAINTENANCE" ||
      item.machineStatus === "IDLE"
  ).length;

  const machineProblemPercent =
    records.length === 0
      ? 0
      : (machineProblems / records.length) * 100;

  const machineScore = Math.max(0, 100 - machineProblemPercent * 2);

  const healthScore = Number(
    (
      productivityScore * 0.3 +
      qualityScore * 0.15 +
      wipScore * 0.15 +
      bottleneckScore * 0.2 +
      manpowerScore * 0.1 +
      machineScore * 0.1
    ).toFixed(1)
  );

  let status: GPAFactoryHealthStatus = "CRITICAL";

  if (healthScore >= 90) {
    status = "EXCELLENT";
  } else if (healthScore >= 80) {
    status = "GOOD";
  } else if (healthScore >= 65) {
    status = "STABLE";
  } else if (healthScore >= 50) {
    status = "UNDER_PRESSURE";
  }

  let executiveSummary =
    "Factory is under pressure and needs management attention.";
  let bnExecutiveSummary =
    "কারখানা চাপের মধ্যে আছে এবং ব্যবস্থাপনার মনোযোগ প্রয়োজন।";
  let recommendedAction =
    "Review bottlenecks, WIP, manpower gaps and hourly output performance.";
  let bnRecommendedAction =
    "বটলনেক, WIP, জনবল ঘাটতি এবং ঘণ্টাভিত্তিক উৎপাদন পারফরম্যান্স পর্যালোচনা করুন।";

  if (status === "EXCELLENT") {
    executiveSummary =
      "Factory performance is excellent with strong productivity control.";
    bnExecutiveSummary =
      "কারখানার পারফরম্যান্স চমৎকার এবং উৎপাদন নিয়ন্ত্রণ শক্তিশালী।";
    recommendedAction =
      "Maintain discipline and replicate best practices across all lines.";
    bnRecommendedAction =
      "শৃঙ্খলা বজায় রাখুন এবং ভালো পদ্ধতি সব লাইনে ছড়িয়ে দিন।";
  } else if (status === "GOOD") {
    executiveSummary =
      "Factory performance is good, but selected areas should be monitored.";
    bnExecutiveSummary =
      "কারখানার পারফরম্যান্স ভালো, তবে কিছু নির্দিষ্ট এলাকা পর্যবেক্ষণ করা প্রয়োজন।";
    recommendedAction =
      "Monitor WIP, defects and line-level productivity gaps.";
    bnRecommendedAction =
      "WIP, ত্রুটি এবং লাইনভিত্তিক উৎপাদন ঘাটতি পর্যবেক্ষণ করুন।";
  } else if (status === "STABLE") {
    executiveSummary =
      "Factory is stable, but bottlenecks may reduce future performance.";
    bnExecutiveSummary =
      "কারখানা স্থিতিশীল, তবে বটলনেক ভবিষ্যৎ পারফরম্যান্স কমাতে পারে।";
    recommendedAction =
      "Focus on bottleneck lines and supervisor-level action tracking.";
    bnRecommendedAction =
      "বটলনেক লাইন এবং সুপারভাইজার পর্যায়ের করণীয় ট্র্যাকিংয়ে গুরুত্ব দিন।";
  } else if (status === "UNDER_PRESSURE") {
    executiveSummary =
      "Factory is under pressure due to productivity loss, WIP and bottlenecks.";
    bnExecutiveSummary =
      "উৎপাদন ঘাটতি, WIP এবং বটলনেকের কারণে কারখানা চাপের মধ্যে আছে।";
    recommendedAction =
      "Open daily bottleneck review and assign action owners immediately.";
    bnRecommendedAction =
      "দৈনিক বটলনেক রিভিউ চালু করুন এবং দ্রুত দায়িত্বপ্রাপ্ত ব্যক্তি নির্ধারণ করুন।";
  }

  return {
    healthScore,
    status,
    productivityScore: Number(productivityScore.toFixed(1)),
    qualityScore: Number(qualityScore.toFixed(1)),
    wipScore: Number(wipScore.toFixed(1)),
    bottleneckScore: Number(bottleneckScore.toFixed(1)),
    manpowerScore: Number(manpowerScore.toFixed(1)),
    machineScore: Number(machineScore.toFixed(1)),
    executiveSummary,
    bnExecutiveSummary,
    recommendedAction,
    bnRecommendedAction,
  };
}