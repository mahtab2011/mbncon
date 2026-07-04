import { EnterpriseKpi } from "./liveKpiEngine";

export type ExecutiveAlert = {
  severity:
    | "INFO"
    | "WARNING"
    | "CRITICAL";
  department: string;
  title: string;
  recommendation: string;
};

export function buildExecutiveAlerts(
  kpi: EnterpriseKpi
): ExecutiveAlert[] {
  const alerts: ExecutiveAlert[] = [];

  if (kpi.efficiency < 80) {
    alerts.push({
      severity: "WARNING",
      department: "Production",
      title: "Production efficiency below target",
      recommendation:
        "Review bottlenecks, manpower allocation and machine utilization.",
    });
  }

  if (kpi.quality < 85) {
    alerts.push({
      severity: "WARNING",
      department: "Quality",
      title: "Quality performance declining",
      recommendation:
        "Increase inline inspections and root cause analysis.",
    });
  }

  if (kpi.cutting < 85) {
    alerts.push({
      severity: "WARNING",
      department: "Cutting",
      title: "Cutting efficiency below target",
      recommendation:
        "Review marker efficiency, spreading and bundle preparation.",
    });
  }

  if (kpi.fabric < 85) {
    alerts.push({
      severity: "WARNING",
      department: "Fabric",
      title: "Fabric inspection requires attention",
      recommendation:
        "Review incoming fabric quality, GSM, shade variation and defects.",
    });
  }

  if (kpi.shipment < 80) {
    alerts.push({
      severity: "CRITICAL",
      department: "Merchandising",
      title: "Shipment readiness is critical",
      recommendation:
        "Escalate shipment recovery plan and coordinate cross-functional support.",
    });
  }

  if (kpi.maintenance < 80) {
    alerts.push({
      severity: "WARNING",
      department: "Maintenance",
      title: "Preventive maintenance behind schedule",
      recommendation:
        "Prioritize preventive maintenance to reduce breakdown risk.",
    });
  }

  if (kpi.oee < 75) {
    alerts.push({
      severity: "CRITICAL",
      department: "Operations",
      title: "Overall Equipment Effectiveness below acceptable level",
      recommendation:
        "Conduct immediate operational review and implement recovery actions.",
    });
  }

  return alerts;
}