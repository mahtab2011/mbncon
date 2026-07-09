export type NotchInput = {
  patternPieceName: string;
  notchVisible: boolean;
  notchCount: number;
  expectedNotchCount: number;
  notchQuality:
    | "clear"
    | "faint"
    | "misaligned"
    | "missing"
    | "unknown";
  pieceType:
    | "front-panel"
    | "back-panel"
    | "sleeve"
    | "collar"
    | "cuff"
    | "waistband"
    | "pocket"
    | "lining"
    | "other";
};

export type NotchResult = {
  status: "ok" | "warning" | "critical";
  notchRiskScore: number;
  message: string;
  aiReason: string;
  recommendations: string[];
};

export function analyzeNotches(input: NotchInput): NotchResult {
  const recommendations: string[] = [];
  let notchRiskScore = 0;

  if (!input.notchVisible || input.notchQuality === "missing") {
    return {
      status: "critical",
      notchRiskScore: 90,
      message: "Notches are missing or not visible on this pattern piece.",
      aiReason:
        "AI asks this because missing notches can cause sewing mismatch, wrong joining, rework, and quality rejection.",
      recommendations: [
        "Mark notches clearly before cutting.",
        "Compare this piece with the approved pattern master.",
        "Do not release this piece for cutting until notches are confirmed.",
      ],
    };
  }

  if (input.notchCount !== input.expectedNotchCount) {
    notchRiskScore += 40;
    recommendations.push(
      `Expected ${input.expectedNotchCount} notches, but found ${input.notchCount}. Recheck the pattern.`
    );
  }

  if (input.notchQuality === "faint") {
    notchRiskScore += 25;
    recommendations.push(
      "Notches are faint. Improve marking before cutting or digitizing."
    );
  }

  if (input.notchQuality === "misaligned") {
    notchRiskScore += 45;
    recommendations.push(
      "Notches appear misaligned. Confirm joining points with pattern master."
    );
  }

  if (
    input.pieceType === "sleeve" ||
    input.pieceType === "collar" ||
    input.pieceType === "cuff" ||
    input.pieceType === "waistband"
  ) {
    notchRiskScore += 20;
    recommendations.push(
      "This piece type is sensitive to notch accuracy during sewing assembly."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Notch condition looks acceptable for pilot-level pattern inspection."
    );
  }

  const status =
    notchRiskScore >= 70
      ? "critical"
      : notchRiskScore >= 35
        ? "warning"
        : "ok";

  return {
    status,
    notchRiskScore,
    message: "Notch inspection completed.",
    aiReason:
      "AI asks this because notches are key sewing reference points and directly affect assembly accuracy.",
    recommendations,
  };
}