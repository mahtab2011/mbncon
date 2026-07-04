export interface ExecutiveRecommendation {
  recommendationId: string;

  title: string;

  recommendation: string;

  expectedImpact: string;

  responsibleDepartment: string;

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
}

export function buildExecutiveRecommendations(): ExecutiveRecommendation[] {
  return [
    {
      recommendationId: "REC001",

      title: "Improve Production Efficiency",

      recommendation:
        "Review low-performing lines and rebalance bottleneck operations.",

      expectedImpact:
        "Increase line efficiency and reduce production cost.",

      responsibleDepartment: "Production / IE",

      priority: "HIGH",
    },

    {
      recommendationId: "REC002",

      title: "Strengthen Preventive Maintenance",

      recommendation:
        "Review preventive maintenance compliance and critical machine status.",

      expectedImpact:
        "Reduce machine downtime and stabilize production.",

      responsibleDepartment: "Maintenance",

      priority: "HIGH",
    },

    {
      recommendationId: "REC003",

      title: "Improve Sustainability Performance",

      recommendation:
        "Review energy, water and carbon KPIs and assign monthly reduction actions.",

      expectedImpact:
        "Reduce utility cost and improve buyer ESG confidence.",

      responsibleDepartment: "Sustainability",

      priority: "MEDIUM",
    },
  ];
}