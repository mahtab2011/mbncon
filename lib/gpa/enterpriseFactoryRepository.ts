export type EnterpriseFactoryRecord = {
  factoryId: string;
  factoryName: string;
  location: string;

  production: number;
  efficiency: number;
  quality: number;
  cutting: number;
  fabric: number;
  shipment: number;
  maintenance: number;
  oee: number;

  factoryHealth: number;

  updatedAt: string;
};

export function getDemoEnterpriseFactories(): EnterpriseFactoryRecord[] {
  return [
    {
      factoryId: "factory-001",
      factoryName: "BGMEA Pilot Factory 01",
      location: "Dhaka",
      production: 92,
      efficiency: 89,
      quality: 91,
      cutting: 90,
      fabric: 88,
      shipment: 86,
      maintenance: 87,
      oee: 89,
      factoryHealth: 90,
      updatedAt: new Date().toISOString(),
    },
    {
      factoryId: "factory-002",
      factoryName: "BGMEA Pilot Factory 02",
      location: "Gazipur",
      production: 84,
      efficiency: 81,
      quality: 79,
      cutting: 80,
      fabric: 78,
      shipment: 75,
      maintenance: 82,
      oee: 79,
      factoryHealth: 78,
      updatedAt: new Date().toISOString(),
    },
    {
      factoryId: "factory-003",
      factoryName: "BGMEA Pilot Factory 03",
      location: "Narayanganj",
      production: 72,
      efficiency: 69,
      quality: 71,
      cutting: 70,
      fabric: 68,
      shipment: 66,
      maintenance: 73,
      oee: 68,
      factoryHealth: 69,
      updatedAt: new Date().toISOString(),
    },
  ];
}