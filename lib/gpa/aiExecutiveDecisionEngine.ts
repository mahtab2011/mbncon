export type ExecutiveDecision = {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  recommendation: string;
};

export function buildExecutiveDecisions(): ExecutiveDecision[] {
  return [
    {
      id: "DEC-001",
      title: "Improve Shipment Performance",
      priority: "HIGH",
      recommendation:
        "Allocate additional production resources to delayed factories.",
    },
    {
      id: "DEC-002",
      title: "Increase Line Efficiency",
      priority: "MEDIUM",
      recommendation:
        "Review bottlenecks and rebalance production lines.",
    },
    {
      id: "DEC-003",
      title: "Maintain Quality Stability",
      priority: "LOW",
      recommendation:
        "Continue current quality assurance programme.",
    },
  ];
}