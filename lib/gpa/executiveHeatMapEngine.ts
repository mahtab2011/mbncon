export type HeatMapFactory = {
  factoryId: string;
  factoryName: string;
  health: number;
};

export type HeatMapCell = HeatMapFactory & {
  color: "GREEN" | "YELLOW" | "ORANGE" | "RED";
};

export function buildExecutiveHeatMap(
  factories: HeatMapFactory[]
): HeatMapCell[] {
  return factories.map((factory): HeatMapCell => {
    let color: HeatMapCell["color"];

    if (factory.health >= 90) {
      color = "GREEN";
    } else if (factory.health >= 80) {
      color = "YELLOW";
    } else if (factory.health >= 70) {
      color = "ORANGE";
    } else {
      color = "RED";
    }

    return {
      ...factory,
      color,
    };
  });
}