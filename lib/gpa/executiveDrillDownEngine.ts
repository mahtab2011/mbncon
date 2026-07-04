export type ExecutiveDrillDown = {
  factoryId: string;
  factoryName: string;
  production: number;
  efficiency: number;
  quality: number;
  oee: number;
  shipment: number;
  maintenance: number;
  health: number;
};

export function buildExecutiveDrillDown(
  factory: ExecutiveDrillDown
): ExecutiveDrillDown {
  return {
    ...factory,
  };
}