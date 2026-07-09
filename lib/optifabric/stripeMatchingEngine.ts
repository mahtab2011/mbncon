export type StripeDirection =
  | "none"
  | "vertical"
  | "horizontal"
  | "diagonal"
  | "unknown";

export type StripeMatchingInput = {
  fabricType: string;
  stripeDirection: StripeDirection;
  stripeRepeatInches: number;
  patternPieceName: string;
  requiresMatching: boolean;
  matchingPriority: "low" | "medium" | "high";
};

export type StripeMatchingResult = {
  status: "ok" | "warning" | "critical";
  message: string;
  aiReason: string;
  recommendations: string[];
};

export function analyzeStripeMatching(
  input: StripeMatchingInput
): StripeMatchingResult {
  const recommendations: string[] = [];

  if (!input.requiresMatching) {
    return {
      status: "ok",
      message: "Stripe/check matching is not required for this pattern piece.",
      aiReason:
        "AI asks this because non-matching pieces can often be placed more freely to save fabric.",
      recommendations: [
        "Allow normal nesting for this piece.",
        "Use fabric-saving layout unless buyer specification says otherwise.",
      ],
    };
  }

  if (
    input.stripeDirection === "unknown" ||
    input.stripeDirection === "none"
  ) {
    return {
      status: "warning",
      message:
        "Stripe/check matching is required, but stripe direction is not clearly defined.",
      aiReason:
        "AI asks this because wrong stripe direction can cause visible garment defects after sewing.",
      recommendations: [
        "Take a clear fabric photo before marker planning.",
        "Confirm stripe/check direction with cutting master.",
        "Avoid final cutting until stripe direction is confirmed.",
      ],
    };
  }

  if (input.stripeRepeatInches <= 0) {
    return {
      status: "critical",
      message:
        "Stripe/check repeat value is missing. Matching cannot be calculated safely.",
      aiReason:
        "AI asks this because repeat distance controls how pattern pieces must be aligned on the fabric.",
      recommendations: [
        "Measure one full stripe/check repeat in inches.",
        "Place a 12-inch scale beside the fabric when taking the photo.",
        "Recalculate layout after repeat value is entered.",
      ],
    };
  }

  if (input.matchingPriority === "high") {
    recommendations.push(
      "Keep front panels, pockets, collars, cuffs, and visible seams aligned."
    );
    recommendations.push(
      "Allow extra marker spacing where matching is more important than fabric saving."
    );
  }

  if (input.matchingPriority === "medium") {
    recommendations.push(
      "Match major visible areas first, then optimize remaining pieces for fabric saving."
    );
  }

  if (input.matchingPriority === "low") {
    recommendations.push(
      "Use controlled matching only where visible to the buyer/customer."
    );
  }

  recommendations.push(
    `Maintain ${input.stripeRepeatInches}" repeat alignment for ${input.patternPieceName}.`
  );

  return {
    status: "ok",
    message: "Stripe/check matching data is ready for layout planning.",
    aiReason:
      "AI asks this because stripe/check garments need controlled pattern placement to prevent mismatched panels and reduce recutting.",
    recommendations,
  };
}