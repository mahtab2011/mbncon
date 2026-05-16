import type { RiskAssessment } from "./riskEngine";
import type { ScoreResult } from "./scoring";
import type { ForecastResult } from "./forecasting";

export type AIObservation = {
  title: string;
  summary: string;
  recommendation: string;
  priority: "Low" | "Medium" | "High" | "Critical";
};

export function generateOperationalObservation(
  area: string,
  score: ScoreResult,
  risk: RiskAssessment
): AIObservation {
  if (risk.level === "Critical") {
    return {
      title: `${area} Critical Risk Detected`,
      summary: `${area} is showing severe operational instability with performance score ${score.score} and critical business exposure.`,
      recommendation:
        "Senior management intervention required immediately. Launch corrective action plan and monitor progress daily.",
      priority: "Critical",
    };
  }

  if (risk.level === "High") {
    return {
      title: `${area} High Risk Trend`,
      summary: `${area} is experiencing elevated operational pressure and possible performance leakage.`,
      recommendation:
        "Department leadership should investigate root causes and implement short-term stabilization measures.",
      priority: "High",
    };
  }

  if (risk.level === "Medium") {
    return {
      title: `${area} Requires Monitoring`,
      summary: `${area} remains operational but trend indicators suggest moderate management attention is necessary.`,
      recommendation:
        "Continue monitoring KPIs and apply continuous improvement initiatives where needed.",
      priority: "Medium",
    };
  }

  return {
    title: `${area} Stable Performance`,
    summary: `${area} is operating within acceptable performance and risk limits.`,
    recommendation:
      "Maintain current operational discipline and continue continuous improvement activities.",
    priority: "Low",
  };
}

export function generateForecastObservation(
  area: string,
  forecast: ForecastResult
): AIObservation {
  if (forecast.riskLevel === "High") {
    return {
      title: `${area} Forecast Volatility`,
      summary: `${area} forecasting accuracy is unstable and operational variability is increasing.`,
      recommendation:
        "Review historical data quality, investigate operational fluctuations, and avoid aggressive planning assumptions.",
      priority: "High",
    };
  }

  if (forecast.trend === "Increasing") {
    return {
      title: `${area} Growth Trend Detected`,
      summary: `${area} shows upward forecast trend with projected operational expansion.`,
      recommendation:
        "Management should prepare manpower, material, and capacity planning to support future growth.",
      priority: "Medium",
    };
  }

  if (forecast.trend === "Decreasing") {
    return {
      title: `${area} Declining Trend Detected`,
      summary: `${area} shows declining forecast pattern and may impact future operational performance.`,
      recommendation:
        "Review business drivers, operational efficiency, and commercial factors contributing to decline.",
      priority: "High",
    };
  }

  return {
    title: `${area} Stable Forecast Pattern`,
    summary: `${area} forecasting pattern remains relatively stable.`,
    recommendation:
      "Continue routine monitoring and maintain operational control discipline.",
    priority: "Low",
  };
}

export function generateExecutiveSummary(
  company: string,
  observations: AIObservation[]
): string {
  const criticalCount = observations.filter(
    (o) => o.priority === "Critical"
  ).length;

  const highCount = observations.filter(
    (o) => o.priority === "High"
  ).length;

  if (criticalCount > 0) {
    return `${company} currently faces critical operational exposure requiring immediate executive attention across multiple business functions.`;
  }

  if (highCount > 2) {
    return `${company} shows elevated operational risk trends that require structured management review and stabilization planning.`;
  }

  return `${company} is operating within manageable performance conditions with opportunities for continuous improvement and forecasting optimization.`;
}
export function generateTrendDeteriorationRecommendation(params: {
  area: string;
  currentValue: number;
  previousValue: number;
  higherIsBad?: boolean;
}): AIObservation {
  const { area, currentValue, previousValue, higherIsBad = true } = params;

  if (previousValue === 0) {
    return {
      title: `${area} Trend Requires Baseline Review`,
      summary: `${area} does not yet have enough stable previous data for reliable deterioration analysis.`,
      recommendation:
        "Collect more historical records and continue monitoring before making major management decisions.",
      priority: "Medium",
    };
  }

  const changePercent =
    ((currentValue - previousValue) / previousValue) * 100;

  const isDeteriorating = higherIsBad
    ? changePercent > 10
    : changePercent < -10;

  if (isDeteriorating) {
    return {
      title: `${area} Deterioration Warning`,
      summary: `${area} has deteriorated by ${Math.abs(
        changePercent
      ).toFixed(2)}% compared with the previous period.`,
      recommendation:
        "Management should investigate root causes, assign an accountable owner, and review corrective action progress within the next reporting cycle.",
      priority: "High",
    };
  }

  return {
    title: `${area} Trend Stable`,
    summary: `${area} trend remains within manageable variation compared with the previous period.`,
    recommendation:
      "Continue routine monitoring and maintain current operational controls.",
    priority: "Low",
  };
}

export function generateDepartmentRecommendation(params: {
  department: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}): AIObservation {
  const { department, riskLevel } = params;

  if (riskLevel === "Critical") {
    return {
      title: `${department} Critical Management Action Required`,
      summary: `${department} is showing critical risk exposure that may cause operational, financial, or delivery loss.`,
      recommendation:
        "Escalate to senior management immediately, create an urgent recovery plan, and review progress daily until stabilized.",
      priority: "Critical",
    };
  }

  if (riskLevel === "High") {
    return {
      title: `${department} High Priority Improvement Needed`,
      summary: `${department} is showing high risk and requires structured corrective action.`,
      recommendation:
        "Assign department ownership, investigate root causes, and implement short-term stabilization actions.",
      priority: "High",
    };
  }

  if (riskLevel === "Medium") {
    return {
      title: `${department} Monitoring Recommended`,
      summary: `${department} is manageable but showing early warning signals.`,
      recommendation:
        "Track the next reporting period closely and apply preventive improvement measures.",
      priority: "Medium",
    };
  }

  return {
    title: `${department} Stable`,
    summary: `${department} is currently operating within acceptable control limits.`,
    recommendation:
      "Maintain current controls and continue continuous improvement activities.",
    priority: "Low",
  };
}