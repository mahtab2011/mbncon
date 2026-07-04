export interface ExecutiveOpportunity {

  title: string;

  estimatedBenefit: string;

  responsibleDepartment: string;

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

}

export function buildExecutiveOpportunities(): ExecutiveOpportunity[] {

  return [

    {
      title: "Improve line balancing",

      estimatedBenefit: "Increase efficiency by 4–6%",

      responsibleDepartment: "Industrial Engineering",

      priority: "HIGH",
    },

    {
      title: "Reduce machine downtime",

      estimatedBenefit: "Increase available production hours",

      responsibleDepartment: "Maintenance",

      priority: "HIGH",
    },

    {
      title: "Reduce repair rate",

      estimatedBenefit: "Lower quality cost",

      responsibleDepartment: "Quality",

      priority: "MEDIUM",
    },

    {
      title: "Improve energy efficiency",

      estimatedBenefit: "Reduce utility cost",

      responsibleDepartment: "Sustainability",

      priority: "MEDIUM",
    },

    {
      title: "Improve buyer readiness",

      estimatedBenefit: "Increase repeat orders",

      responsibleDepartment: "Compliance",

      priority: "HIGH",
    },

  ];
}