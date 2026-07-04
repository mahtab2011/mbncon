export type GPAGembaObservation = {
  category:
    | "PRODUCTION"
    | "QUALITY"
    | "IE"
    | "MAINTENANCE"
    | "LEAN"
    | "SAFETY";

  observation: string;

  status: "GOOD" | "ATTENTION" | "CRITICAL";

  responsibleDepartment: string;
};

export type GPAGembaWalkInput = {
  area: string;

  inspector: string;

  observations: GPAGembaObservation[];
};

export type GPAGembaWalkResult = {
  area: string;

  inspector: string;

  totalObservations: number;

  criticalIssues: number;

  attentionIssues: number;

  goodPractices: number;

  factoryHealthScore: number;

  executiveRecommendation: string;

  bnExecutiveRecommendation: string;
};

export function analyzeGembaWalk(
  inspections: GPAGembaWalkInput[]
): GPAGembaWalkResult[] {

  return inspections.map((inspection) => {

    const total =
      inspection.observations.length;

    const critical =
      inspection.observations.filter(
        x => x.status === "CRITICAL"
      ).length;

    const attention =
      inspection.observations.filter(
        x => x.status === "ATTENTION"
      ).length;

    const good =
      inspection.observations.filter(
        x => x.status === "GOOD"
      ).length;

    const healthScore =
      Math.max(
        0,
        100 -
          critical * 15 -
          attention * 5
      );

    let executiveRecommendation =
      "Continue routine monitoring.";

    let bnExecutiveRecommendation =
      "নিয়মিত পর্যবেক্ষণ অব্যাহত রাখুন।";

    if (critical > 0) {

      executiveRecommendation =
        "Immediate corrective action and management follow-up required.";

      bnExecutiveRecommendation =
        "তাৎক্ষণিক সংশোধনমূলক ব্যবস্থা এবং ব্যবস্থাপনার ফলো-আপ প্রয়োজন।";

    } else if (attention > 2) {

      executiveRecommendation =
        "Review operational practices and implement corrective actions.";

      bnExecutiveRecommendation =
        "কার্যপ্রণালী পর্যালোচনা করে সংশোধনমূলক ব্যবস্থা গ্রহণ করুন।";

    }

    return {

      area: inspection.area,

      inspector: inspection.inspector,

      totalObservations: total,

      criticalIssues: critical,

      attentionIssues: attention,

      goodPractices: good,

      factoryHealthScore: healthScore,

      executiveRecommendation,

      bnExecutiveRecommendation,

    };

  });

}