export interface ExecutiveCommandCentre {

  factoryHealthScore: number;

  productionScore: number;

  qualityScore: number;

  maintenanceScore: number;

  complianceScore: number;

  sustainabilityScore: number;

  commercialScore: number;

  enterpriseRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  managingDirectorBriefing: string;

  topPriorities: string[];
}

export function buildExecutiveCommandCentre(): ExecutiveCommandCentre {

  return {

    factoryHealthScore: 94,

    productionScore: 91,

    qualityScore: 95,

    maintenanceScore: 93,

    complianceScore: 96,

    sustainabilityScore: 92,

    commercialScore: 90,

    enterpriseRisk: "LOW",

    managingDirectorBriefing:
      "Factory operating normally. Continue monitoring production, quality, sustainability and buyer delivery commitments.",

    topPriorities: [
      "Monitor Line 8 efficiency",
      "Complete preventive maintenance",
      "Review buyer shipment readiness",
      "Track sustainability KPIs",
      "Verify compliance documentation",
    ],
  };
}