export type GPAOEEInput = {
  machineId: string;
  machineName: string;

  availability: number;
  performance: number;
  quality: number;
};

export type GPAOEEResult = {
  machineId: string;
  machineName: string;

  oee: number;

  rating:
    | "WORLD CLASS"
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "POOR";

  recommendation: string;

  bnRecommendation: string;
};

export function analyzeOEE(
  machines: GPAOEEInput[]
): GPAOEEResult[] {

  return machines.map((machine) => {

    const oee =
      (machine.availability *
        machine.performance *
        machine.quality) /
      10000;

    let rating:
      | "WORLD CLASS"
      | "EXCELLENT"
      | "GOOD"
      | "FAIR"
      | "POOR" = "POOR";

    if (oee >= 85)
      rating = "WORLD CLASS";
    else if (oee >= 75)
      rating = "EXCELLENT";
    else if (oee >= 65)
      rating = "GOOD";
    else if (oee >= 50)
      rating = "FAIR";

    let recommendation =
      "Immediate improvement required.";

    let bnRecommendation =
      "তাৎক্ষণিক উন্নয়ন প্রয়োজন।";

    if (rating === "GOOD") {

      recommendation =
        "Improve availability through preventive maintenance.";

      bnRecommendation =
        "প্রিভেন্টিভ মেইনটেন্যান্সের মাধ্যমে অ্যাভেইলেবিলিটি বৃদ্ধি করুন।";

    }

    if (
      rating === "EXCELLENT" ||
      rating === "WORLD CLASS"
    ) {

      recommendation =
        "Maintain current performance and continue continuous improvement.";

      bnRecommendation =
        "বর্তমান কর্মক্ষমতা বজায় রেখে ধারাবাহিক উন্নয়ন চালিয়ে যান।";

    }

    return {

      machineId: machine.machineId,

      machineName: machine.machineName,

      oee: Number(oee.toFixed(1)),

      rating,

      recommendation,

      bnRecommendation,

    };

  });

}