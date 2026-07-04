import { ExecutiveAlert } from "./executiveAlertEngine";

export type ExecutiveRecommendation = {
  priority: number;
  title: string;
  action: string;
};

export function buildExecutiveRecommendations(
  alerts: ExecutiveAlert[]
): ExecutiveRecommendation[] {
  return alerts
    .map((alert) => ({
      priority:
        alert.severity === "CRITICAL"
          ? 1
          : alert.severity === "WARNING"
          ? 2
          : 3,
      title: alert.title,
      action: alert.recommendation,
    }))
    .sort((a, b) => a.priority - b.priority);
}