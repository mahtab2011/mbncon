export interface LiveSustainabilityIntelligence {

  sustainabilityScore: number;

  carbonPerGarment: number;

  waterPerGarment: number;

  energyPerGarment: number;

  wasteRecyclingRate: number;

  esgScore: number;

  sustainabilityRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  executiveSummary: string;
}

export function buildLiveSustainabilityIntelligence(): LiveSustainabilityIntelligence {

  return {

    sustainabilityScore: 91,

    carbonPerGarment: 0.18,

    waterPerGarment: 14.8,

    energyPerGarment: 0.62,

    wasteRecyclingRate: 84,

    esgScore: 89,

    sustainabilityRisk: "LOW",

    executiveSummary:
      "Overall sustainability performance is strong. Continue reducing carbon intensity and improving recycling performance.",
  };
}