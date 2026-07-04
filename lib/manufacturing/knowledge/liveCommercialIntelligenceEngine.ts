export interface LiveCommercialIntelligence {

  onTimeDelivery: number;

  shipmentReadiness: number;

  repeatOrderRate: number;

  customerComplaints: number;

  activeOrders: number;

  commercialRisk:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  executiveSummary: string;
}

export function buildLiveCommercialIntelligence(): LiveCommercialIntelligence {

  return {

    onTimeDelivery: 97,

    shipmentReadiness: 94,

    repeatOrderRate: 86,

    customerComplaints: 2,

    activeOrders: 38,

    commercialRisk: "LOW",

    executiveSummary:
      "Commercial performance is healthy. Continue monitoring shipment readiness and buyer satisfaction.",
  };
}