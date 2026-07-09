export type GrainLineInput = {
  patternPieceName: string;
  fabricType: string;
  grainLineVisible: boolean;
  grainLineDirection:
    | "lengthwise"
    | "crosswise"
    | "bias"
    | "unclear"
    | "not-marked";
  pieceRequiresStrictGrain: boolean;
};

export type GrainLineResult = {
  status: "ok" | "warning" | "critical";
  grainRiskScore: number;
  message: string;
  aiReason: string;
  recommendations: string[];
};

export function analyzeGrainLine(
  input: GrainLineInput
): GrainLineResult {
  const recommendations: string[] = [];
  let grainRiskScore = 0;

  if (!input.grainLineVisible || input.grainLineDirection === "not-marked") {
    return {
      status: "critical",
      grainRiskScore: 90,
      message: "Grain line is not clearly marked on this pattern piece.",
      aiReason:
        "AI asks this because wrong grain direction can twist garments, distort fit, and cause buyer rejection.",
      recommendations: [
        "Mark grain line clearly before cutting.",
        "Confirm fabric direction with the cutting master.",
        "Do not approve final marker until grain line is confirmed.",
      ],
    };
  }

  if (input.grainLineDirection === "unclear") {
    return {
      status: "warning",
      grainRiskScore: 65,
      message: "Grain line exists but direction is unclear.",
      aiReason:
        "AI asks this because unclear grain direction may cause incorrect placement during marker planning.",
      recommendations: [
        "Retake pattern photo with better lighting.",
        "Use a 12-inch scale and keep pattern flat.",
        "Ask pattern master to confirm direction.",
      ],
    };
  }

  if (input.pieceRequiresStrictGrain) {
    grainRiskScore += 35;
    recommendations.push(
      "Place this piece strictly according to grain direction."
    );
  }

  if (input.grainLineDirection === "bias") {
    grainRiskScore += 30;
    recommendations.push(
      "Bias-cut pieces require special handling and should not be freely rotated."
    );
  }

  if (
    input.fabricType === "stripe" ||
    input.fabricType === "check" ||
    input.fabricType === "directional-print"
  ) {
    grainRiskScore += 25;
    recommendations.push(
      "Coordinate grain direction with stripe/check or print direction."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Use standard grain alignment and continue marker planning."
    );
  }

  const status =
    grainRiskScore >= 70
      ? "critical"
      : grainRiskScore >= 40
        ? "warning"
        : "ok";

  return {
    status,
    grainRiskScore,
    message: "Grain line analysis completed.",
    aiReason:
      "AI asks this because grain direction affects garment balance, fit, drape, and cutting quality.",
    recommendations,
  };
}