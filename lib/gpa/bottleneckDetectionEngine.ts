export type BottleneckResult = {
  area: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  recommendation: string;
};

export function detectEnterpriseBottleneck(
  efficiency: number,
  cutting: number,
  fabric: number,
  shipment: number
): BottleneckResult {
  const lowest = Math.min(
    efficiency,
    cutting,
    fabric,
    shipment
  );

  if (lowest === shipment) {
    return {
      area: "Shipment",
      severity: "HIGH",
      recommendation:
        "Expedite logistics and coordinate dispatch immediately.",
    };
  }

  if (lowest === fabric) {
    return {
      area: "Fabric",
      severity: "HIGH",
      recommendation:
        "Increase fabric availability and supplier coordination.",
    };
  }

  if (lowest === cutting) {
    return {
      area: "Cutting",
      severity: "MEDIUM",
      recommendation:
        "Improve cutting utilization and machine scheduling.",
    };
  }

  return {
    area: "Production Efficiency",
    severity: "LOW",
    recommendation:
      "Maintain current operational control.",
  };
}