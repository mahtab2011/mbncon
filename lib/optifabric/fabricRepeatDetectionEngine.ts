export type FabricRepeatInput = {
  fabricType: string;
  hasVisibleRepeat: boolean;
  repeatLengthInches: number;
  repeatWidthInches: number;
  printOrCheckType:
    | "none"
    | "stripe"
    | "check"
    | "floral"
    | "geometric"
    | "logo"
    | "directional-print"
    | "unknown";
  buyerRequiresRepeatMatching: boolean;
};

export type FabricRepeatResult = {
  status: "ok" | "warning" | "critical";
  repeatRiskScore: number;
  message: string;
  aiReason: string;
  recommendations: string[];
};

export function analyzeFabricRepeat(
  input: FabricRepeatInput
): FabricRepeatResult {
  const recommendations: string[] = [];
  let repeatRiskScore = 0;

  if (!input.hasVisibleRepeat || input.printOrCheckType === "none") {
    return {
      status: "ok",
      repeatRiskScore: 5,
      message: "No visible fabric repeat risk detected.",
      aiReason:
        "AI asks about fabric repeat because plain fabrics can be optimized more freely, while repeated prints or checks need controlled placement.",
      recommendations: [
        "Use normal fabric-saving marker planning.",
        "No special repeat allowance is required unless buyer specification says otherwise.",
      ],
    };
  }

  repeatRiskScore += 25;

  if (input.repeatLengthInches <= 0 || input.repeatWidthInches <= 0) {
    return {
      status: "critical",
      repeatRiskScore: 90,
      message:
        "Visible fabric repeat exists, but repeat length or width is missing.",
      aiReason:
        "AI asks this because repeat distance controls how pattern pieces must be aligned to avoid visible mismatch.",
      recommendations: [
        "Measure one full repeat in length and width.",
        "Take a clear fabric photo with a 12-inch scale beside the repeat.",
        "Do not finalize marker planning until repeat size is confirmed.",
      ],
    };
  }

  if (input.buyerRequiresRepeatMatching) {
    repeatRiskScore += 30;
    recommendations.push(
      "Apply buyer matching rules before fabric-saving optimization."
    );
  }

  if (
    input.printOrCheckType === "check" ||
    input.printOrCheckType === "logo" ||
    input.printOrCheckType === "directional-print"
  ) {
    repeatRiskScore += 25;
    recommendations.push(
      "Treat this fabric as high-risk for visible mismatch during cutting."
    );
  }

  if (input.repeatLengthInches > 4 || input.repeatWidthInches > 4) {
    repeatRiskScore += 15;
    recommendations.push(
      "Large repeat size may increase marker consumption and require extra allowance."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Use controlled placement for visible pattern pieces and optimize hidden pieces normally."
    );
  }

  const status =
    repeatRiskScore >= 75
      ? "critical"
      : repeatRiskScore >= 45
        ? "warning"
        : "ok";

  return {
    status,
    repeatRiskScore,
    message:
      "Fabric repeat analysis completed. Use this result before marker planning.",
    aiReason:
      "AI asks this because repeated fabric designs can cause panel mismatch, buyer rejection, recutting, and extra fabric consumption.",
    recommendations,
  };
}