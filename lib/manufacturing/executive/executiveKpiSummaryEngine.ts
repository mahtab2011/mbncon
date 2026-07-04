export interface ExecutiveKpiSummary {

  productionEfficiency: number;

  firstPassYield: number;

  onTimeDelivery: number;

  machineAvailability: number;

  buyerReadiness: number;

  sustainabilityScore: number;

  factoryHealthScore: number;
}

export function buildExecutiveKpiSummary(): ExecutiveKpiSummary {

  return {

    productionEfficiency: 91,

    firstPassYield: 96,

    onTimeDelivery: 97,

    machineAvailability: 98,

    buyerReadiness: 95,

    sustainabilityScore: 92,

    factoryHealthScore: 94,
  };
}