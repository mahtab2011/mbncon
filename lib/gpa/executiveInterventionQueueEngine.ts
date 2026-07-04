export type ExecutiveIntervention = {
  id: string;
  factoryName: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  issue: string;
  action: string;
};

export function buildExecutiveInterventionQueue(): ExecutiveIntervention[] {
  return [
    {
      id: "INT-001",
      factoryName: "BGMEA Pilot Factory 03",
      priority: "HIGH",
      issue: "Shipment readiness below target",
      action: "Executive intervention required",
    },
    {
      id: "INT-002",
      factoryName: "BGMEA Pilot Factory 02",
      priority: "MEDIUM",
      issue: "Efficiency below enterprise average",
      action: "Review IE and production planning",
    },
    {
      id: "INT-003",
      factoryName: "BGMEA Pilot Factory 01",
      priority: "LOW",
      issue: "Routine monitoring",
      action: "Continue current performance",
    },
  ];
}