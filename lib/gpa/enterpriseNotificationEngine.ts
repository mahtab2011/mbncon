export type EnterpriseNotification = {
  id: number;
  level: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
};

export function buildEnterpriseNotifications(
  productionRisk: string,
  bottleneck: string,
  lineStatus: string,
  operatorStatus: string
): EnterpriseNotification[] {
  const notifications: EnterpriseNotification[] = [];

  if (productionRisk === "CRITICAL") {
    notifications.push({
      id: 1,
      level: "CRITICAL",
      title: "Production Risk",
      message: "Critical production risk detected.",
    });
  }

  if (bottleneck !== "Production Efficiency") {
    notifications.push({
      id: 2,
      level: "WARNING",
      title: "Enterprise Bottleneck",
      message: `${bottleneck} requires immediate attention.`,
    });
  }

  if (
    lineStatus === "WATCH" ||
    lineStatus === "CRITICAL"
  ) {
    notifications.push({
      id: 3,
      level: "WARNING",
      title: "Line Balancing",
      message: "Line balancing efficiency has deteriorated.",
    });
  }

  if (
    operatorStatus === "WATCH" ||
    operatorStatus === "CRITICAL"
  ) {
    notifications.push({
      id: 4,
      level: "WARNING",
      title: "Operator Productivity",
      message: "Operator productivity is below target.",
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      id: 99,
      level: "INFO",
      title: "Enterprise Status",
      message: "All operational indicators are healthy.",
    });
  }

  return notifications;
}