export type GPASMVInput = {
  operationId: string;
  operationName: string;
  operatorName: string;

  standardMinuteValue: number;

  actualCycleTime: number;

  hourlyTarget: number;

  hourlyOutput: number;
};

export type GPASMVResult = {
  operationId: string;
  operationName: string;
  operatorName: string;

  smv: number;

  actualTime: number;

  variance: number;

  efficiency: number;

  lostMinutesPerHour: number;

  trainingRequired: boolean;

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  recommendation: string;

  bnRecommendation: string;
};

export function analyzeSMV(
  operations: GPASMVInput[]
): GPASMVResult[] {
  return operations.map((operation) => {
    const variance =
      operation.actualCycleTime -
      operation.standardMinuteValue;

    const efficiency =
      operation.standardMinuteValue === 0
        ? 0
        : (operation.standardMinuteValue /
            operation.actualCycleTime) *
          100;

    const lostMinutesPerHour =
      variance * operation.hourlyOutput;

    let priority:
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "CRITICAL" = "LOW";

    let recommendation =
      "Maintain current performance.";

    let bnRecommendation =
      "বর্তমান কর্মক্ষমতা বজায় রাখুন।";

    if (efficiency < 90) {
      priority = "MEDIUM";

      recommendation =
        "Observe operator and review work method.";

      bnRecommendation =
        "অপারেটর পর্যবেক্ষণ করুন এবং কাজের পদ্ধতি পর্যালোচনা করুন।";
    }

    if (efficiency < 80) {
      priority = "HIGH";

      recommendation =
        "Provide skill training and workstation improvement.";

      bnRecommendation =
        "স্কিল ট্রেনিং এবং ওয়ার্কস্টেশন উন্নয়ন করুন।";
    }

    if (efficiency < 70) {
      priority = "CRITICAL";

      recommendation =
        "Immediate IE intervention, method study and line balancing required.";

      bnRecommendation =
        "তাৎক্ষণিক IE হস্তক্ষেপ, মেথড স্টাডি এবং লাইন ব্যালান্সিং প্রয়োজন।";
    }

    return {
      operationId: operation.operationId,

      operationName: operation.operationName,

      operatorName: operation.operatorName,

      smv: operation.standardMinuteValue,

      actualTime: operation.actualCycleTime,

      variance: Number(
        variance.toFixed(2)
      ),

      efficiency: Number(
        efficiency.toFixed(1)
      ),

      lostMinutesPerHour: Number(
        lostMinutesPerHour.toFixed(2)
      ),

      trainingRequired:
        efficiency < 85,

      priority,

      recommendation,

      bnRecommendation,
    };
  });
}