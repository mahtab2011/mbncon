export type ProductionSummary = {
  totalProduction: number;
  efficiency: number;
  dhu: number;
  attendance: number;
  machineHealth: number;
  shipmentReadiness: number;
};

export const productionSummary: ProductionSummary = {
  totalProduction: 2679,
  efficiency: 89,
  dhu: 3.7,
  attendance: 96,
  machineHealth: 91,
  shipmentReadiness: 94,
};

export type ExecutiveAlert = {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export const executiveAlerts: ExecutiveAlert[] = [
  {
    id: "1",
    title: "Machine MC-014 requires immediate maintenance.",
    severity: "CRITICAL",
  },
  {
    id: "2",
    title: "Shipment SHP-PRM-3307 has elevated delay risk.",
    severity: "HIGH",
  },
  {
    id: "3",
    title: "Line L-003 efficiency below target.",
    severity: "HIGH",
  },
];

export type FactoryHealth = {
  overallHealth: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
};

export const factoryHealth: FactoryHealth = {
  overallHealth: 91,
  riskLevel: "LOW",
};