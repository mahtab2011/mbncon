export type ForecastPoint = {
  period: string;
  actual: number;
  forecast: number;
  error: number;
  accuracy: number;
};

export type ForecastResult = {
  points: ForecastPoint[];
  nextForecast: number;
  averageAccuracy: number;
  trend: "Increasing" | "Decreasing" | "Stable";
  riskLevel: "Low" | "Medium" | "High";
  recommendation: string;
};

export function exponentialSmoothing(
  data: { period: string; actual: number }[],
  alpha: number = 0.3
): ForecastResult {
  if (!data || data.length < 2) {
    return {
      points: [],
      nextForecast: 0,
      averageAccuracy: 0,
      trend: "Stable",
      riskLevel: "Low",
      recommendation: "Not enough historical data available for forecasting.",
    };
  }

  const smoothingAlpha = Math.max(0.01, Math.min(1, alpha));
  let forecast = data[0].actual;

  const points: ForecastPoint[] = data.map((item, index) => {
    if (index === 0) {
      return {
        period: item.period,
        actual: item.actual,
        forecast: item.actual,
        error: 0,
        accuracy: 100,
      };
    }

    forecast =
      smoothingAlpha * data[index - 1].actual +
      (1 - smoothingAlpha) * forecast;

    const error = Math.abs(item.actual - forecast);
    const accuracy =
      item.actual === 0
        ? 100
        : Math.max(0, 100 - (error / item.actual) * 100);

    return {
      period: item.period,
      actual: Number(item.actual.toFixed(2)),
      forecast: Number(forecast.toFixed(2)),
      error: Number(error.toFixed(2)),
      accuracy: Number(accuracy.toFixed(2)),
    };
  });

  const lastActual = data[data.length - 1].actual;

  const nextForecast =
    smoothingAlpha * lastActual + (1 - smoothingAlpha) * forecast;

  const averageAccuracy =
    points.reduce((sum, point) => sum + point.accuracy, 0) / points.length;

  const firstValue = data[0].actual;
  const lastValue = data[data.length - 1].actual;
  const changePercent =
    firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100;

  const trend =
    changePercent > 5
      ? "Increasing"
      : changePercent < -5
      ? "Decreasing"
      : "Stable";

  const riskLevel =
    averageAccuracy >= 85 ? "Low" : averageAccuracy >= 70 ? "Medium" : "High";

  const recommendation =
    riskLevel === "Low"
      ? "Forecast accuracy is strong. Management can use this trend for resource planning with reasonable confidence."
      : riskLevel === "Medium"
      ? "Forecast accuracy is moderate. Review recent operational changes before making major resource decisions."
      : "Forecast accuracy is weak. Data volatility is high and management should investigate abnormal changes before planning.";

  return {
    points,
    nextForecast: Number(nextForecast.toFixed(2)),
    averageAccuracy: Number(averageAccuracy.toFixed(2)),
    trend,
    riskLevel,
    recommendation,
  };
}
export type GrowthForecastResult = {
  currentValue: number;
  yearlyGrowthRate: number;
  oneYearForecast: number;
  twoYearForecast: number;
  threeYearForecast: number;
  recommendation: string;
};

export function calculateGrowthForecast(
  historicalValues: number[]
): GrowthForecastResult {
  if (historicalValues.length < 2) {
    return {
      currentValue: historicalValues[0] || 0,
      yearlyGrowthRate: 0,
      oneYearForecast: historicalValues[0] || 0,
      twoYearForecast: historicalValues[0] || 0,
      threeYearForecast: historicalValues[0] || 0,
      recommendation:
        "Not enough historical data available for long-term growth forecasting.",
    };
  }

  const first = historicalValues[0];
  const last = historicalValues[historicalValues.length - 1];

  const growthRate =
    first === 0
      ? 0
      : ((last - first) / first / (historicalValues.length - 1)) * 100;

  const currentValue = last;

  const oneYearForecast =
    currentValue * (1 + growthRate / 100);

  const twoYearForecast =
    oneYearForecast * (1 + growthRate / 100);

  const threeYearForecast =
    twoYearForecast * (1 + growthRate / 100);

  let recommendation =
    "Growth trend appears stable with manageable forecasting conditions.";

  if (growthRate > 15) {
    recommendation =
      "High growth trend detected. Prepare manpower, utilities, sourcing, and production capacity expansion planning.";
  }

  if (growthRate < 0) {
    recommendation =
      "Negative growth trend detected. Review operational efficiency, commercial strategy, and market demand conditions.";
  }

  return {
    currentValue: Number(currentValue.toFixed(2)),
    yearlyGrowthRate: Number(growthRate.toFixed(2)),
    oneYearForecast: Number(oneYearForecast.toFixed(2)),
    twoYearForecast: Number(twoYearForecast.toFixed(2)),
    threeYearForecast: Number(threeYearForecast.toFixed(2)),
    recommendation,
  };
}