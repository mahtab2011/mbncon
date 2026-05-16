export interface RootCauseResult {
  issue: string;
  possibleCauses: string[];
  recommendation: string;
}

export function analyzeRootCause(
  issue: string
): RootCauseResult {
  const normalized =
    issue.toLowerCase();

  if (
    normalized.includes("delay") ||
    normalized.includes("late")
  ) {
    return {
      issue,
      possibleCauses: [
        "Production bottleneck",
        "Machine downtime",
        "Material shortage",
        "Poor production planning",
      ],
      recommendation:
        "Review production scheduling and monitor line balancing.",
    };
  }

  if (
    normalized.includes("defect") ||
    normalized.includes("quality")
  ) {
    return {
      issue,
      possibleCauses: [
        "Operator inconsistency",
        "Insufficient quality inspection",
        "Machine calibration issue",
        "Poor raw material quality",
      ],
      recommendation:
        "Increase inline quality checks and inspect machine settings.",
    };
  }

  if (
    normalized.includes("waste") ||
    normalized.includes("rejection")
  ) {
    return {
      issue,
      possibleCauses: [
        "Cutting inaccuracies",
        "Excess inventory movement",
        "Improper handling",
        "Weak process control",
      ],
      recommendation:
        "Review operational handling and reduce unnecessary movement.",
    };
  }

  return {
    issue,
    possibleCauses: [
      "Insufficient operational visibility",
      "Communication gap",
      "Lack of process standardization",
    ],
    recommendation:
      "Conduct detailed operational assessment and Gemba review.",
  };
}