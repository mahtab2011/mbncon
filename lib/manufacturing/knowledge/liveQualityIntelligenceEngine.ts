export interface LiveQualityIntelligence {

  dhu: number;

  firstPassYield: number;

  repairRate: number;

  rejectionRate: number;

  topDefect: string;

  qualityRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  executiveSummary: string;
}

export function buildLiveQualityIntelligence(): LiveQualityIntelligence {

  return {

    dhu: 4.2,

    firstPassYield: 95.6,

    repairRate: 2.4,

    rejectionRate: 0.5,

    topDefect: "Open Seam",

    qualityRisk: "LOW",

    executiveSummary:
      "Quality performance is stable. Continue monitoring DHU, repair trends and recurring defects.",
  };
}