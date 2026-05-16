type RootCauseInput = {
  productionEfficiency: number;

  productionDelayRisk: number;

  machineBreakdownRisk: number;

  totalWastage: number;

  totalRejections: number;

  inventoryAgeingAlerts: number;

  totalEstimatedLoss: number;
};

export function identifyProductionRootCause(
  productionEfficiency: number,
  machineBreakdownRisk: number
) {
  if (
    productionEfficiency < 50 &&
    machineBreakdownRisk > 20
  ) {
    return {
      category: "Production",
      severity: "Critical",
      rootCause:
        "Machine instability and operational downtime reducing production efficiency.",
    };
  }

  if (productionEfficiency < 65) {
    return {
      category: "Production",
      severity: "High",
      rootCause:
        "Production balancing and manpower efficiency issues detected.",
    };
  }

  return {
    category: "Production",
    severity: "Normal",
    rootCause:
      "Production efficiency currently stable.",
  };
}

export function identifyShipmentRootCause(
  productionDelayRisk: number,
  inventoryAgeingAlerts: number
) {
  if (
    productionDelayRisk > 50 &&
    inventoryAgeingAlerts > 10
  ) {
    return {
      category: "Shipment",
      severity: "Critical",
      rootCause:
        "Production delay and inventory congestion affecting shipment readiness.",
    };
  }

  if (productionDelayRisk > 30) {
    return {
      category: "Shipment",
      severity: "High",
      rootCause:
        "Production planning instability increasing shipment risk.",
    };
  }

  return {
    category: "Shipment",
    severity: "Normal",
    rootCause:
      "Shipment flow currently stable.",
  };
}

export function identifyQualityRootCause(
  totalRejections: number,
  totalWastage: number
) {
  if (
    totalRejections > 5000 &&
    totalWastage > 10000
  ) {
    return {
      category: "Quality",
      severity: "Critical",
      rootCause:
        "Serious process quality instability and material wastage detected.",
    };
  }

  if (totalRejections > 2000) {
    return {
      category: "Quality",
      severity: "High",
      rootCause:
        "Quality control and process discipline issues detected.",
    };
  }

  return {
    category: "Quality",
    severity: "Normal",
    rootCause:
      "Quality performance currently stable.",
  };
}

export function identifyProfitabilityRootCause(
  totalEstimatedLoss: number,
  productionEfficiency: number
) {
  if (
    totalEstimatedLoss > 500000 &&
    productionEfficiency < 60
  ) {
    return {
      category: "Profitability",
      severity: "Critical",
      rootCause:
        "High operational losses combined with low production efficiency damaging profitability.",
    };
  }

  if (totalEstimatedLoss > 250000) {
    return {
      category: "Profitability",
      severity: "High",
      rootCause:
        "Operational loss exposure significantly affecting profitability.",
    };
  }

  return {
    category: "Profitability",
    severity: "Normal",
    rootCause:
      "Profitability exposure currently manageable.",
  };
}

export function generateExecutiveRootCauseSummary(
  input: RootCauseInput
) {
  const production =
    identifyProductionRootCause(
      input.productionEfficiency,
      input.machineBreakdownRisk
    );

  const shipment =
    identifyShipmentRootCause(
      input.productionDelayRisk,
      input.inventoryAgeingAlerts
    );

  const quality =
    identifyQualityRootCause(
      input.totalRejections,
      input.totalWastage
    );

  const profitability =
    identifyProfitabilityRootCause(
      input.totalEstimatedLoss,
      input.productionEfficiency
    );

  const findings = [
    production,
    shipment,
    quality,
    profitability,
  ];

  const criticalFindings = findings.filter(
    (item) => item.severity === "Critical"
  ).length;

  let executiveConclusion =
    "Operational conditions generally stable.";

  if (criticalFindings >= 2) {
    executiveConclusion =
      "Multiple critical operational root causes detected requiring executive intervention.";
  } else if (criticalFindings >= 1) {
    executiveConclusion =
      "Critical operational weakness detected requiring urgent corrective action.";
  }

  return {
    findings,
    criticalFindings,
    executiveConclusion,
  };
}