export type ExecutiveAlertLevel =
  | "INFO"
  | "WARNING"
  | "CRITICAL";

export interface ExecutiveAlert {
  alertId: string;

  level: ExecutiveAlertLevel;

  title: string;

  message: string;

  responsibleDepartment: string;

  actionRequired: boolean;
}

export function buildExecutiveAlerts(): ExecutiveAlert[] {
  return [
    {
      alertId: "ALT001",

      level: "WARNING",

      title: "Line Efficiency Watch",

      message:
        "Production efficiency should be monitored closely on underperforming lines.",

      responsibleDepartment: "Production",

      actionRequired: true,
    },

    {
      alertId: "ALT002",

      level: "INFO",

      title: "Buyer Shipment Review",

      message:
        "Upcoming shipment readiness should be reviewed with merchandising and production.",

      responsibleDepartment: "Commercial",

      actionRequired: true,
    },

    {
      alertId: "ALT003",

      level: "WARNING",

      title: "Sustainability KPI Review",

      message:
        "Energy, water and carbon KPIs should be reviewed for monthly trend performance.",

      responsibleDepartment: "Sustainability",

      actionRequired: false,
    },
  ];
}