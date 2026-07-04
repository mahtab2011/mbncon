import { LiveProductionRecord } from "./liveProductionFeed";

export type LineBalancingRecommendation = {
  line: string;
  factory: string;
  currentEfficiency: number;
  action:
    | "ADD_OPERATORS"
    | "REMOVE_OPERATORS"
    | "BALANCED";
  operatorsToAdjust: number;
  recommendation: string;
};

export function buildLineBalancingRecommendations(
  records: LiveProductionRecord[]
): LineBalancingRecommendation[] {
  return records.map((record) => {
    let action: LineBalancingRecommendation["action"] =
      "BALANCED";

    let operatorsToAdjust = 0;

    let recommendation =
      "Current manpower allocation is appropriate.";

    if (record.efficiency < 80) {
      action = "ADD_OPERATORS";

      operatorsToAdjust = Math.max(
        1,
        Math.ceil((80 - record.efficiency) / 5)
      );

      recommendation =
        "Increase operators or remove bottlenecks to improve output.";
    } else if (record.efficiency > 95) {
      action = "REMOVE_OPERATORS";

      operatorsToAdjust = Math.max(
        1,
        Math.floor((record.efficiency - 95) / 5)
      );

      recommendation =
        "Consider reallocating surplus operators to weaker lines.";
    }

    return {
      line: record.line,
      factory: record.factory,
      currentEfficiency: record.efficiency,
      action,
      operatorsToAdjust,
      recommendation,
    };
  });
}