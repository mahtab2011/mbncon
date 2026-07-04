import { GPAProductionRecord } from "./gpaProductionDataModel";

export type GPATOCConstraintType =
  | "OUTPUT_CONSTRAINT"
  | "WIP_CONSTRAINT"
  | "QUALITY_CONSTRAINT"
  | "MANPOWER_CONSTRAINT"
  | "WAITING_CONSTRAINT"
  | "MACHINE_CONSTRAINT";

export type GPATOCResult = {
  area: string;
  constraintType: GPATOCConstraintType;
  lostOutput: number;
  lostOutputPercent: number;
  constraintScore: number;
  estimatedGainIfResolved: number;
  executivePriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rootCause: string;
  bnRootCause: string;
  recommendedAction: string;
  bnRecommendedAction: string;
};

export function analyzeTOCConstraints(
  records: GPAProductionRecord[]
): GPATOCResult[] {
  return records
    .map((record) => {
      const lostOutput = Math.max(
        0,
        record.hourlyTarget - record.hourlyOutput
      );

      const lostOutputPercent =
        record.hourlyTarget === 0
          ? 0
          : (lostOutput / record.hourlyTarget) * 100;

      let constraintType: GPATOCConstraintType = "OUTPUT_CONSTRAINT";
      let rootCause = "Output is below target.";
      let bnRootCause = "উৎপাদন টার্গেটের চেয়ে কম।";
      let recommendedAction =
        "Review operation flow, hourly target achievement and supervisor follow-up.";
      let bnRecommendedAction =
        "অপারেশন ফ্লো, ঘণ্টাভিত্তিক টার্গেট অর্জন এবং সুপারভাইজার ফলোআপ পর্যালোচনা করুন।";

      let constraintScore =
        lostOutputPercent * 1.5 +
        record.waitingMinutes * 0.6 +
        record.defects * 3 +
        record.wip * 0.12;

      if (record.wip > 150) {
        constraintType = "WIP_CONSTRAINT";
        rootCause = "WIP accumulation is blocking production flow.";
        bnRootCause = "WIP জমা উৎপাদন প্রবাহ বাধাগ্রস্ত করছে।";
        recommendedAction =
          "Reduce WIP pile-up and balance upstream/downstream operations.";
        bnRecommendedAction =
          "WIP জমা কমান এবং আগের/পরের অপারেশন ব্যালান্স করুন।";
      }

      if (record.defects > 8) {
        constraintType = "QUALITY_CONSTRAINT";
        rootCause = "Quality defects are reducing usable output.";
        bnRootCause = "কোয়ালিটি ত্রুটির কারণে ব্যবহারযোগ্য উৎপাদন কমছে।";
        recommendedAction =
          "Start immediate defect root-cause review and quality containment.";
        bnRecommendedAction =
          "তাৎক্ষণিক ত্রুটির মূল কারণ বিশ্লেষণ এবং কোয়ালিটি কন্টেইনমেন্ট শুরু করুন।";
      }

      if (record.operators < record.targetOperators) {
        constraintType = "MANPOWER_CONSTRAINT";
        rootCause = "Operator shortage is limiting throughput.";
        bnRootCause = "অপারেটর ঘাটতির কারণে উৎপাদন ক্ষমতা সীমিত হচ্ছে।";
        recommendedAction =
          "Reallocate operators or adjust line balancing plan.";
        bnRecommendedAction =
          "অপারেটর পুনর্বণ্টন করুন অথবা লাইন ব্যালান্সিং পরিকল্পনা পরিবর্তন করুন।";
        constraintScore +=
          (record.targetOperators - record.operators) * 6;
      }

      if (record.waitingMinutes > 20) {
        constraintType = "WAITING_CONSTRAINT";
        rootCause = "Waiting time is creating lost production capacity.";
        bnRootCause = "ওয়েটিং টাইম উৎপাদন ক্ষমতা নষ্ট করছে।";
        recommendedAction =
          "Remove feeding delays and ensure materials are ready before hour start.";
        bnRecommendedAction =
          "ফিডিং বিলম্ব দূর করুন এবং প্রতি ঘণ্টা শুরুর আগে ম্যাটেরিয়াল প্রস্তুত রাখুন।";
      }

      if (
        record.machineStatus === "BREAKDOWN" ||
        record.machineStatus === "MAINTENANCE"
      ) {
        constraintType = "MACHINE_CONSTRAINT";
        rootCause = "Machine condition is restricting production flow.";
        bnRootCause = "মেশিন সমস্যার কারণে উৎপাদন প্রবাহ সীমিত হচ্ছে।";
        recommendedAction =
          "Escalate maintenance response and arrange standby machine support.";
        bnRecommendedAction =
          "মেইনটেন্যান্স দ্রুত করুন এবং স্ট্যান্ডবাই মেশিন সাপোর্ট দিন।";
        constraintScore += 25;
      }

      let executivePriority: GPATOCResult["executivePriority"] = "LOW";

      if (constraintScore >= 90) {
        executivePriority = "CRITICAL";
      } else if (constraintScore >= 65) {
        executivePriority = "HIGH";
      } else if (constraintScore >= 40) {
        executivePriority = "MEDIUM";
      }

      return {
        area: `${record.department} - ${record.lineName}`,
        constraintType,
        lostOutput,
        lostOutputPercent: Number(lostOutputPercent.toFixed(1)),
        constraintScore: Number(constraintScore.toFixed(1)),
        estimatedGainIfResolved: Math.round(lostOutput * 0.75),
        executivePriority,
        rootCause,
        bnRootCause,
        recommendedAction,
        bnRecommendedAction,
      };
    })
    .sort((a, b) => b.constraintScore - a.constraintScore);
}