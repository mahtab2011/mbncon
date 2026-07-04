export type GPAActivitySample = {
  observationNo: number;
  activity:
    | "WORKING"
    | "WAITING"
    | "WALKING"
    | "SEARCHING"
    | "IDLE"
    | "BREAK";
};

export type GPAActivitySamplingInput = {
  operatorId: string;
  operatorName: string;
  operationName: string;
  observations: GPAActivitySample[];
};

export type GPAActivitySamplingResult = {
  operatorId: string;
  operatorName: string;
  operationName: string;

  utilizationPercent: number;

  waitingPercent: number;

  idlePercent: number;

  workingPercent: number;

  recommendation: string;

  bnRecommendation: string;
};

export function analyzeActivitySampling(
  operators: GPAActivitySamplingInput[]
): GPAActivitySamplingResult[] {

  return operators.map((item) => {

    const total = item.observations.length;

    const working =
      item.observations.filter(
        x => x.activity === "WORKING"
      ).length;

    const waiting =
      item.observations.filter(
        x => x.activity === "WAITING"
      ).length;

    const idle =
      item.observations.filter(
        x => x.activity === "IDLE"
      ).length;

    const utilization =
      total === 0
        ? 0
        : (working / total) * 100;

    let recommendation =
      "Maintain present work utilization.";

    let bnRecommendation =
      "বর্তমান কাজের ব্যবহার বজায় রাখুন।";

    if (utilization < 85) {

      recommendation =
        "Investigate waiting time, workstation layout and work allocation.";

      bnRecommendation =
        "অপেক্ষার সময়, কর্মস্থলের বিন্যাস এবং কাজের বণ্টন বিশ্লেষণ করুন।";

    }

    return {

      operatorId: item.operatorId,

      operatorName: item.operatorName,

      operationName: item.operationName,

      utilizationPercent:
        Number(utilization.toFixed(1)),

      waitingPercent:
        Number(
          ((waiting / total) * 100).toFixed(1)
        ),

      idlePercent:
        Number(
          ((idle / total) * 100).toFixed(1)
        ),

      workingPercent:
        Number(
          ((working / total) * 100).toFixed(1)
        ),

      recommendation,

      bnRecommendation,

    };

  });

}