export type FactoryRankingInput = {
  factoryId: string;
  factoryName: string;
  health: number;
  production: number;
  efficiency: number;
  quality: number;
  oee: number;
};

export type RankedFactory = FactoryRankingInput & {
  rank: number;
  status: "GREEN" | "YELLOW" | "RED";
};

export function rankFactories(
  factories: FactoryRankingInput[]
): RankedFactory[] {
  return [...factories]
    .sort((a, b) => b.health - a.health)
    .map((factory, index): RankedFactory => {
      let status: RankedFactory["status"];

      if (factory.health >= 85) {
        status = "GREEN";
      } else if (factory.health >= 70) {
        status = "YELLOW";
      } else {
        status = "RED";
      }

      return {
        ...factory,
        rank: index + 1,
        status,
      };
    });
}