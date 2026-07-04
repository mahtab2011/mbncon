export type CeoMorningBriefInput = {
  totalFactories: number;
  healthyFactories: number;
  riskFactories: number;
  averageHealth: number;
  bestFactory: string;
  topProduction: number;
};

export type CeoMorningBrief = {
  headline: string;
  summary: string[];
  priorities: string[];
};

export function buildCeoMorningBrief(
  input: CeoMorningBriefInput
): CeoMorningBrief {
  const headline =
    input.riskFactories === 0
      ? "Enterprise operating within expected range."
      : `${input.riskFactories} factory(s) require executive attention.`;

  const summary = [
    `${input.totalFactories} factories monitored.`,
    `${input.healthyFactories} healthy factories.`,
    `Average enterprise health: ${input.averageHealth}%.`,
    `Best performing factory: ${input.bestFactory}.`,
    `Highest production achieved: ${input.topProduction}%.`,
  ];

  const priorities = [
    "Review shipment readiness.",
    "Monitor production efficiency.",
    "Resolve bottlenecks in risk factories.",
    "Maintain quality compliance.",
  ];

  return {
    headline,
    summary,
    priorities,
  };
}