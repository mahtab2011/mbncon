import { EnterpriseKpi } from "./liveKpiEngine";

export type FactoryHealth = {
  score: number;
  signal:
    | "EXCELLENT"
    | "GOOD"
    | "WATCH"
    | "CRITICAL";
  summary: string;
};

export function calculateFactoryHealth(
  kpi: EnterpriseKpi
): FactoryHealth {
  const score = Math.round(
    (
      kpi.efficiency +
      kpi.quality +
      kpi.cutting +
      kpi.fabric +
      kpi.shipment +
      kpi.maintenance +
      kpi.oee
    ) / 7
  );

  if (score >= 90) {
    return {
      score,
      signal: "EXCELLENT",
      summary:
        "Factory operating at world-class performance.",
    };
  }

  if (score >= 80) {
    return {
      score,
      signal: "GOOD",
      summary:
        "Factory performing well with minor improvements possible.",
    };
  }

  if (score >= 70) {
    return {
      score,
      signal: "WATCH",
      summary:
        "Management attention recommended to prevent deterioration.",
    };
  }

  return {
    score,
    signal: "CRITICAL",
    summary:
      "Immediate executive intervention required.",
  };
}