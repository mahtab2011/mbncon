export type FactoryKpiInput = {
  factoryId: string;
  factoryName: string;
  production: number;
  efficiency: number;
  quality: number;
  cutting: number;
  fabric: number;
  shipment: number;
  maintenance: number;
  oee: number;
  factoryHealth: number;
};

export type EnterpriseKpiSummary = {
  totalFactories: number;
  avgProduction: number;
  avgEfficiency: number;
  avgQuality: number;
  avgCutting: number;
  avgFabric: number;
  avgShipment: number;
  avgMaintenance: number;
  avgOee: number;
  avgFactoryHealth: number;
  riskFactories: number;
  healthyFactories: number;
  enterpriseStatus: "HEALTHY" | "WATCH" | "RISK" | "CRITICAL";
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

export function aggregateEnterpriseKpis(
  factories: FactoryKpiInput[]
): EnterpriseKpiSummary {
  const totalFactories = factories.length;

  const avgFactoryHealth = average(
    factories.map((factory) => factory.factoryHealth)
  );

  const riskFactories = factories.filter(
    (factory) => factory.factoryHealth < 70
  ).length;

  const healthyFactories = factories.filter(
    (factory) => factory.factoryHealth >= 80
  ).length;

  let enterpriseStatus: EnterpriseKpiSummary["enterpriseStatus"] = "HEALTHY";

  if (avgFactoryHealth < 60 || riskFactories >= 3) {
    enterpriseStatus = "CRITICAL";
  } else if (avgFactoryHealth < 70 || riskFactories >= 2) {
    enterpriseStatus = "RISK";
  } else if (avgFactoryHealth < 80 || riskFactories >= 1) {
    enterpriseStatus = "WATCH";
  }

  return {
    totalFactories,
    avgProduction: average(factories.map((factory) => factory.production)),
    avgEfficiency: average(factories.map((factory) => factory.efficiency)),
    avgQuality: average(factories.map((factory) => factory.quality)),
    avgCutting: average(factories.map((factory) => factory.cutting)),
    avgFabric: average(factories.map((factory) => factory.fabric)),
    avgShipment: average(factories.map((factory) => factory.shipment)),
    avgMaintenance: average(factories.map((factory) => factory.maintenance)),
    avgOee: average(factories.map((factory) => factory.oee)),
    avgFactoryHealth,
    riskFactories,
    healthyFactories,
    enterpriseStatus,
  };
}