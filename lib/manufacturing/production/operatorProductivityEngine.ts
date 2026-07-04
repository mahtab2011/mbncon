import { LiveProductionRecord } from "./liveProductionFeed";

export type OperatorProductivity = {
  line: string;
  factory: string;
  operators: number;
  helpers: number;
  piecesPerOperator: number;
  efficiency: number;
  productivitySignal:
    | "EXCELLENT"
    | "GOOD"
    | "WATCH"
    | "CRITICAL";
  recommendation: string;
};

export function buildOperatorProductivity(
  records: LiveProductionRecord[]
): OperatorProductivity[] {
  return records.map((record) => {
    const piecesPerOperator =
      record.operators > 0
        ? Math.round(record.actual / record.operators)
        : 0;

    let productivitySignal: OperatorProductivity["productivitySignal"] =
      "GOOD";

    let recommendation =
      "Maintain current manpower allocation.";

    if (record.efficiency >= 95) {
      productivitySignal = "EXCELLENT";
      recommendation =
        "Recognize high-performing team and capture best practices.";
    } else if (record.efficiency < 85) {
      productivitySignal = "WATCH";
      recommendation =
        "Review work method, operator skills and line balance.";
    }

    if (record.efficiency < 70) {
      productivitySignal = "CRITICAL";
      recommendation =
        "Immediate IE and Production Manager intervention required.";
    }

    return {
      line: record.line,
      factory: record.factory,
      operators: record.operators,
      helpers: record.helpers,
      piecesPerOperator,
      efficiency: record.efficiency,
      productivitySignal,
      recommendation,
    };
  });
}