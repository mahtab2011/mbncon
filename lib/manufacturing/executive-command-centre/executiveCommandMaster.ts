export interface ExecutiveCommandRecord {
  id: string;
  area: string;
  score: number;
  status: "GOOD" | "WATCH" | "CRITICAL";
  keyMetric: string;
  aiInsight: string;
  executiveAction: string;
}

export const executiveCommandMaster: ExecutiveCommandRecord[] = [
  {
    id: "ECC-001",
    area: "Factory Health",
    score: 91,
    status: "GOOD",
    keyMetric: "Overall health 91%",
    aiInsight:
      "Factory is stable, but cutting and machine reliability need monitoring.",
    executiveAction:
      "Maintain current production plan and monitor risk alerts.",
  },
  {
    id: "ECC-002",
    area: "Production",
    score: 89,
    status: "GOOD",
    keyMetric: "2,679 pcs produced",
    aiInsight:
      "Production output is acceptable, but Line L-003 remains below target.",
    executiveAction:
      "Rebalance operators and review bottleneck operation.",
  },
  {
    id: "ECC-003",
    area: "Quality",
    score: 86,
    status: "WATCH",
    keyMetric: "Average DHU 3.7",
    aiInsight:
      "DHU is slightly elevated due to collar and hood attach defects.",
    executiveAction:
      "Increase inline inspection for critical operations.",
  },
  {
    id: "ECC-004",
    area: "Cutting",
    score: 84,
    status: "WATCH",
    keyMetric: "Marker efficiency 85.6%",
    aiInsight:
      "Fabric utilization can improve through marker optimization and better roll selection.",
    executiveAction:
      "Review Primark fleece marker before continuing bulk cutting.",
  },
  {
    id: "ECC-005",
    area: "Maintenance",
    score: 82,
    status: "WATCH",
    keyMetric: "MC-014 high risk",
    aiInsight:
      "Repeated machine downtime may affect shipment confidence.",
    executiveAction:
      "Approve preventive maintenance before next shift.",
  },
  {
    id: "ECC-006",
    area: "Shipment",
    score: 78,
    status: "CRITICAL",
    keyMetric: "Primark shipment risk 82%",
    aiInsight:
      "Shipment risk is high due to material shortage, DHU and machine downtime.",
    executiveAction:
      "Escalate shipment recovery plan to management immediately.",
  },
];
