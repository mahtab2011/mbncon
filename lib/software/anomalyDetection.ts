type AnomalyInput = {
  totalEstimatedLoss: number;

  totalRejections: number;

  totalWastage: number;

  machineBreakdownRisk: number;

  inventoryAgeingAlerts: number;

  productionEfficiency: number;
};

export function detectLossAnomaly(
  totalEstimatedLoss: number
) {
  if (totalEstimatedLoss > 500000) {
    return {
      detected: true,
      severity: "Critical",
      message:
        "Abnormally high operational loss detected.",
    };
  }

  if (totalEstimatedLoss > 250000) {
    return {
      detected: true,
      severity: "High",
      message:
        "Operational loss level significantly above expected range.",
    };
  }

  return {
    detected: false,
    severity: "Normal",
    message: "Operational loss within expected range.",
  };
}

export function detectRejectionAnomaly(
  totalRejections: number
) {
  if (totalRejections > 5000) {
    return {
      detected: true,
      severity: "Critical",
      message:
        "Extreme rejection spike detected.",
    };
  }

  if (totalRejections > 2000) {
    return {
      detected: true,
      severity: "High",
      message:
        "Rejection quantity significantly elevated.",
    };
  }

  return {
    detected: false,
    severity: "Normal",
    message:
      "Rejection quantity within expected range.",
  };
}

export function detectWastageAnomaly(
  totalWastage: number
) {
  if (totalWastage > 10000) {
    return {
      detected: true,
      severity: "Critical",
      message:
        "Critical material wastage anomaly detected.",
    };
  }

  if (totalWastage > 5000) {
    return {
      detected: true,
      severity: "High",
      message:
        "Material wastage significantly elevated.",
    };
  }

  return {
    detected: false,
    severity: "Normal",
    message:
      "Material wastage within expected range.",
  };
}

export function detectMachineBreakdownAnomaly(
  machineBreakdownRisk: number
) {
  if (machineBreakdownRisk > 50) {
    return {
      detected: true,
      severity: "Critical",
      message:
        "Severe machine breakdown frequency detected.",
    };
  }

  if (machineBreakdownRisk > 20) {
    return {
      detected: true,
      severity: "High",
      message:
        "Machine breakdown frequency above acceptable range.",
    };
  }

  return {
    detected: false,
    severity: "Normal",
    message:
      "Machine breakdown level acceptable.",
  };
}

export function detectInventoryAgeingAnomaly(
  inventoryAgeingAlerts: number
) {
  if (inventoryAgeingAlerts > 20) {
    return {
      detected: true,
      severity: "Critical",
      message:
        "Severe inventory ageing exposure detected.",
    };
  }

  if (inventoryAgeingAlerts > 10) {
    return {
      detected: true,
      severity: "High",
      message:
        "Inventory ageing increasing rapidly.",
    };
  }

  return {
    detected: false,
    severity: "Normal",
    message:
      "Inventory ageing under control.",
  };
}

export function detectEfficiencyAnomaly(
  productionEfficiency: number
) {
  if (productionEfficiency < 45) {
    return {
      detected: true,
      severity: "Critical",
      message:
        "Production efficiency critically low.",
    };
  }

  if (productionEfficiency < 65) {
    return {
      detected: true,
      severity: "High",
      message:
        "Production efficiency below operational target.",
    };
  }

  return {
    detected: false,
    severity: "Normal",
    message:
      "Production efficiency acceptable.",
  };
}

export function generateExecutiveAnomalySummary(
  input: AnomalyInput
) {
  const anomalies = [
    detectLossAnomaly(
      input.totalEstimatedLoss
    ),

    detectRejectionAnomaly(
      input.totalRejections
    ),

    detectWastageAnomaly(
      input.totalWastage
    ),

    detectMachineBreakdownAnomaly(
      input.machineBreakdownRisk
    ),

    detectInventoryAgeingAnomaly(
      input.inventoryAgeingAlerts
    ),

    detectEfficiencyAnomaly(
      input.productionEfficiency
    ),
  ];

  const detectedCount = anomalies.filter(
    (item) => item.detected
  ).length;

  const criticalCount = anomalies.filter(
    (item) => item.severity === "Critical"
  ).length;

  let overallStatus = "Stable";

  if (criticalCount >= 2) {
    overallStatus =
      "Critical operational instability detected.";
  } else if (detectedCount >= 3) {
    overallStatus =
      "High operational anomaly exposure detected.";
  } else if (detectedCount >= 1) {
    overallStatus =
      "Moderate operational anomalies detected.";
  }

  return {
    anomalies,
    detectedCount,
    criticalCount,
    overallStatus,
  };
}