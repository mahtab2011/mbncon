export type GPABottleneckInput = {
  area: string;

  targetOutput: number;

  actualOutput: number;

  operators: number;

  targetOperators: number;

  waitingMinutes: number;

  wip: number;

  defects: number;
};

export type GPABottleneckResult = {
  severity:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  productivityLoss: number;

  bottleneckScore: number;

  rootCause: string;

  recommendedAction: string;

  executivePriority: string;
};

export function evaluateBottleneck(
  input: GPABottleneckInput
): GPABottleneckResult {

  const outputLoss =
    Math.max(
      0,
      input.targetOutput - input.actualOutput
    );

  const outputLossPercent =
    input.targetOutput === 0
      ? 0
      : (outputLoss / input.targetOutput) * 100;

  let score = outputLossPercent;

  score += input.waitingMinutes * 0.4;

  score += input.wip * 0.08;

  score += input.defects * 2;

  if (input.operators < input.targetOperators) {
    score +=
      (input.targetOperators - input.operators) * 4;
  }

  let severity:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL" = "LOW";

  if (score >= 80) {
    severity = "CRITICAL";
  } else if (score >= 60) {
    severity = "HIGH";
  } else if (score >= 35) {
    severity = "MEDIUM";
  }

  let rootCause =
    "Normal production variation";

  let recommendedAction =
    "Continue monitoring.";

  let executivePriority =
    "Routine Review";

  if (input.waitingMinutes > 20) {
    rootCause =
      "Material feeding delay";

    recommendedAction =
      "Improve feeding frequency and remove waiting time.";

    executivePriority =
      "Feeding Supervisor";
  }

  if (input.wip > 120) {
    rootCause =
      "Work-in-progress accumulation";

    recommendedAction =
      "Balance neighbouring operations.";

    executivePriority =
      "Industrial Engineering";
  }

  if (input.defects > 10) {
    rootCause =
      "Quality issues reducing throughput";

    recommendedAction =
      "Conduct immediate root cause analysis.";

    executivePriority =
      "Quality Manager";
  }

  if (input.operators < input.targetOperators) {
    rootCause =
      "Operator shortage";

    recommendedAction =
      "Deploy additional operators or rebalance manpower.";

    executivePriority =
      "Production Manager";
  }

  return {

    severity,

    productivityLoss:
      Number(outputLossPercent.toFixed(1)),

    bottleneckScore:
      Number(score.toFixed(1)),

    rootCause,

    recommendedAction,

    executivePriority,

  };
}