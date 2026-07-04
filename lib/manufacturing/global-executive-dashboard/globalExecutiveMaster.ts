export interface GlobalExecutiveMetric {
  id: string;
  area: string;
  score: number;
  status: "GOOD" | "WATCH" | "CRITICAL";
  headline: string;
  aiInsight: string;
  nextAction: string;
}

export const globalExecutiveMaster: GlobalExecutiveMetric[] = [
  {
    id: "GED-001",
    area: "Factory Health",
    score: 91,
    status: "GOOD",
    headline: "Factory operating steadily",
    aiInsight:
      "Overall factory health remains stable with manageable risks in cutting and maintenance.",
    nextAction:
      "Continue current plan and monitor high-risk areas every two hours.",
  },
  {
    id: "GED-002",
    area: "Production",
    score: 89,
    status: "GOOD",
    headline: "Production close to target",
    aiInsight:
      "Most lines are performing well, but Line L-003 needs bottleneck support.",
    nextAction:
      "Move skilled operators to L-003 before the next production cycle.",
  },
  {
    id: "GED-003",
    area: "Quality",
    score: 86,
    status: "WATCH",
    headline: "DHU slightly above comfort level",
    aiInsight:
      "Collar and hood operations are contributing to elevated defect risk.",
    nextAction:
      "Increase inline inspection and review operator handling.",
  },
  {
    id: "GED-004",
    area: "Cutting & Fabric",
    score: 84,
    status: "WATCH",
    headline: "Fabric saving opportunity identified",
    aiInsight:
      "Marker efficiency and fleece utilization can be improved before bulk cutting continues.",
    nextAction:
      "Review marker plan and use AI fabric optimizer recommendations.",
  },
  {
    id: "GED-005",
    area: "Maintenance",
    score: 82,
    status: "WATCH",
    headline: "Machine reliability needs attention",
    aiInsight:
      "MC-014 remains a recurring downtime risk.",
    nextAction:
      "Approve preventive maintenance before the next shift.",
  },
  {
    id: "GED-006",
    area: "Shipment",
    score: 78,
    status: "CRITICAL",
    headline: "Primark shipment requires escalation",
    aiInsight:
      "Delay risk is elevated due to material, quality and machine factors.",
    nextAction:
      "Start shipment recovery action immediately.",
  },
  {
    id: "GED-007",
    area: "Profit Leakage",
    score: 81,
    status: "WATCH",
    headline: "Hidden leakage from downtime and low efficiency",
    aiInsight:
      "Main leakage drivers are machine downtime, low line efficiency and rework.",
    nextAction:
      "Prioritize top three leakage drivers for immediate savings.",
  },
];