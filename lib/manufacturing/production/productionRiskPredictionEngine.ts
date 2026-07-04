import { LiveProductionRecord } from "./liveProductionFeed";

export type ProductionRisk = {
  line: string;
  factory: string;
  riskScore: number;
  riskLevel:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  prediction: string;
};

export function predictProductionRisk(
  records: LiveProductionRecord[]
): ProductionRisk[] {
  return records.map((record) => {
    let score = 0;

    if (record.efficiency < 85) score += 25;

    if (record.downtime > 20) score += 25;

    if (record.defects > 10) score += 20;

    if (record.wip > 150) score += 15;

    if (record.actual < record.target) score += 15;

    let riskLevel: ProductionRisk["riskLevel"] =
      "LOW";

    if (score >= 80) riskLevel = "CRITICAL";
    else if (score >= 60) riskLevel = "HIGH";
    else if (score >= 30) riskLevel = "MEDIUM";

    let prediction =
      "Production expected to achieve today's target.";

    if (riskLevel === "MEDIUM") {
      prediction =
        "Risk of hourly target slippage. Supervisor review recommended.";
    }

    if (riskLevel === "HIGH") {
      prediction =
        "High probability of missing today's production plan.";
    }

    if (riskLevel === "CRITICAL") {
      prediction =
        "Critical production recovery required to protect shipment commitment.";
    }

    return {
      line: record.line,
      factory: record.factory,
      riskScore: score,
      riskLevel,
      prediction,
    };
  });
}