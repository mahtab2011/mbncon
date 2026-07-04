export type FactoryComparisonInput = {
  factoryId: string;
  factoryName: string;
  production: number;
  efficiency: number;
  quality: number;
  oee: number;
  health: number;
};

export type FactoryComparisonSummary = {
  bestProduction: FactoryComparisonInput;
  bestEfficiency: FactoryComparisonInput;
  bestQuality: FactoryComparisonInput;
  bestOee: FactoryComparisonInput;
  healthiestFactory: FactoryComparisonInput;
};

function highest(
  factories: FactoryComparisonInput[],
  selector: (factory: FactoryComparisonInput) => number
): FactoryComparisonInput {
  return [...factories].sort(
    (a, b) => selector(b) - selector(a)
  )[0];
}

export function buildCrossFactoryComparison(
  factories: FactoryComparisonInput[]
): FactoryComparisonSummary {
  return {
    bestProduction: highest(
      factories,
      (factory) => factory.production
    ),

    bestEfficiency: highest(
      factories,
      (factory) => factory.efficiency
    ),

    bestQuality: highest(
      factories,
      (factory) => factory.quality
    ),

    bestOee: highest(
      factories,
      (factory) => factory.oee
    ),

    healthiestFactory: highest(
      factories,
      (factory) => factory.health
    ),
  };
}