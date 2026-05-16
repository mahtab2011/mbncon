export const firestoreCollections = {
  companies: "companies",
  factories: "factories",

  productionLogs: "productionLogs",
  wastageLogs: "wastageLogs",
  manpowerLogs: "manpowerLogs",
  exportLogs: "exportLogs",
  utilitiesLogs: "utilitiesLogs",
  maintenanceLogs: "maintenanceLogs",

  materialEntries: "materialEntries",
  qualityEntries: "qualityEntries",
  rawMaterialQualityEntries: "rawMaterialQualityEntries",

  buyerOrderEntries: "buyerOrderEntries",
  supplierOrderEntries: "supplierOrderEntries",

  localTransportBookings: "localTransportBookings",
  shippingLineBookings: "shippingLineBookings",
  shipmentSchedules: "shipmentSchedules",

  costingProfitabilityEntries: "costingProfitabilityEntries",

  leanKaizenEntries: "leanKaizenEntries",
  tqmEntries: "tqmEntries",

  postOrderIntelligenceEntries: "postOrderIntelligenceEntries",

  riskReports: "riskReports",
  executiveReports: "executiveReports",
  consultancyProjects: "consultancyProjects",
  factoryLossIntelligenceEntries: "factoryLossIntelligenceEntries",
};

export type CompanyRecord = {
  name: string;
  industry: string;
  country: string;
  city: string;
  createdAt: Date;
};

export type FactoryRecord = {
  companyId: string;
  name: string;
  location: string;
  totalWorkers: number;
  productionLines: number;
  createdAt: Date;
};

export type ProductionLog = {
  companyId: string;
  factoryId: string;
  period: string;
  plannedOutput: number;
  actualOutput: number;
  efficiencyPercent: number;
  rejectionPercent: number;
  delayPercent: number;
  createdAt: Date;
};

export type WastageLog = {
  companyId: string;
  factoryId: string;
  period: string;
  materialType: string;
  issuedQty: number;
  usedQty: number;
  wastageQty: number;
  wastagePercent: number;
  createdAt: Date;
};

export type ManpowerLog = {
  companyId: string;
  factoryId: string;
  period: string;
  plannedWorkers: number;
  actualWorkers: number;
  absenteeismPercent: number;
  overtimeHours: number;
  createdAt: Date;
};

export type ExportLog = {
  companyId: string;
  factoryId: string;
  period: string;
  buyer: string;
  orderValue: number;
  plannedShipmentDate: string;
  actualShipmentDate?: string;
  delayDays: number;
  status: "On Time" | "Delayed" | "At Risk" | "Shipped";
  createdAt: Date;
};

export type UtilitiesLog = {
  companyId: string;
  factoryId: string;
  period: string;
  electricityCost: number;
  generatorFuelCost: number;
  gasCost: number;
  waterCost: number;
  createdAt: Date;
};

export type MaintenanceLog = {
  companyId: string;
  factoryId: string;
  period: string;
  machineId: string;
  downtimeHours: number;
  repairCost: number;
  breakdownCount: number;
  createdAt: Date;
};

export type MaterialEntry = {
  companyId: string;
  factoryId: string;
  period: string;
  materialType: string;
  supplier: string;
  receivedQty: number;
  issuedQty: number;
  stockQty: number;
  createdAt: Date;
};

export type QualityEntry = {
  companyId: string;
  factoryId: string;
  period: string;
  inspectionArea: string;
  inspectedQty: number;
  rejectedQty: number;
  rejectionPercent: number;
  observation: string;
  createdAt: Date;
};

export type RawMaterialQualityEntry = {
  companyId: string;
  factoryId: string;
  period: string;
  materialType: string;
  supplier: string;
  inspectionResult: string;
  rejectedQty: number;
  remarks: string;
  createdAt: Date;
};

export type BuyerOrderEntry = {
  companyId: string;
  factoryId: string;

  period: string;
  buyer: string;
  orderNo: string;

  industryType: string;
  customerGroup: string;
  productCategory: string;

  styleCategory: string;
  styleDescription: string;

  colour: string;
  materialType: string;

  orderQty: number;

  currency: string;
  pricingUnit: string;

  unitPrice: number;
  costingPerUnit: number;

  totalOrderValue: number;
  totalCost: number;
  expectedProfit: number;
  marginPercentage: number;

  orderReceiveDate: string;
  shipmentDate: string;

  leadTimeDays: number;

  paymentTerms: string;
  advanceReceived: number;

  materialReadiness: string;
  productionReadiness: string;

  buyerRiskLevel: string;
  priorityLevel: string;

  sizeTemplate: string;
  sizeBreakdown: string;

  totalSizeQty: number;
  quantityDifference: number;

  remarks: string;

  createdAt: Date;
};

export type SupplierOrderEntry = {
  companyId: string;
  factoryId: string;
  supplier: string;
  materialType: string;
  orderedQty: number;
  receivedQty: number;
  pendingQty: number;
  deliveryDate: string;
  remarks: string;
  createdAt: Date;
};

export type LocalTransportBooking = {
  companyId: string;
  factoryId: string;
  transporter: string;
  vehicleType: string;
  bookingDate: string;
  deliveryLocation: string;
  transportCost: number;
  createdAt: Date;
};

export type ShippingLineBooking = {
  companyId: string;
  factoryId: string;
  shippingLine: string;
  containerType: string;
  etd: string;
  eta: string;
  freightCost: number;
  createdAt: Date;
};

export type ShipmentSchedule = {
  companyId: string;
  factoryId: string;
  buyer: string;
  shipmentDate: string;
  containerCount: number;
  shipmentValue: number;
  status: string;
  createdAt: Date;
};

export type CostingProfitabilityEntry = {
  companyId: string;
  factoryId: string;
  buyer: string;
  style: string;
  totalCost: number;
  totalRevenue: number;
  profit: number;
  marginPercent: number;
  createdAt: Date;
};

export type LeanKaizenEntry = {
  companyId: string;
  factoryId: string;
  department: string;
  improvementType: string;
  observation: string;
  savingAmount: number;
  createdAt: Date;
};

export type TqmEntry = {
  companyId: string;
  factoryId: string;
  department: string;
  issue: string;
  correctiveAction: string;
  responsiblePerson: string;
  createdAt: Date;
};

export type PostOrderIntelligenceEntry = {
  companyId: string;
  factoryId: string;

  buyer: string;
  orderNo: string;

  surplusQty: number;
  shortQty: number;

  secondsQty: number;
  rejectedQty: number;

  reworkQty: number;
  reworkCost: number;
  reworkTimeHours: number;

  ageingDays: number;

  disposalMethod: string;

  recoveryValue: number;

  recommendation: string;

  createdAt: Date;
};
export type FactoryLossIntelligenceEntry = {
  companyId: string;
  factoryId: string;
  period: string;
  department: string;
  lossArea: string;
  rootCause: string;
  observation: string;
  estimatedLossValue: number;
  recoveryOpportunityValue: number;
  estimatedNetRecovery: number;
  frequency: string;
  riskLevel: string;
  priorityLevel: string;
  responsibleDepartment: string;
  responsiblePerson: string;
  correctiveAction: string;
  preventiveAction: string;
  targetRecoveryDate: string;
  remarks: string;
  createdAt: Date;
};
export type RiskReport = {
  companyId: string;
  factoryId: string;
  period: string;
  area: string;
  score: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  observation: string;
  recommendation: string;
  createdAt: Date;
};

export type ExecutiveReport = {
  companyId: string;
  factoryId: string;
  period: string;
  executiveSummary: string;
  productionScore: number;
  workforceScore: number;
  wastageScore: number;
  exportScore: number;
  utilitiesScore: number;
  overallScore: number;
  createdAt: Date;
};