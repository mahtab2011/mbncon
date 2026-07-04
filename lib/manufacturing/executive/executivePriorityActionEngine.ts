import { ExecutiveRiskLevel } from "./executiveRiskLevelEngine";

export interface ExecutivePriorityAction {
  priority: number;

  action: string;

  responsibleArea: string;

  urgency:
    | "TODAY"
    | "THIS_WEEK"
    | "THIS_MONTH";
}

export function buildExecutivePriorityActions(
  riskLevel: ExecutiveRiskLevel
): ExecutivePriorityAction[] {

  if (riskLevel === "CRITICAL") {
    return [
      {
        priority: 1,
        action: "Call immediate executive review meeting.",
        responsibleArea: "MANAGEMENT",
        urgency: "TODAY",
      },
      {
        priority: 2,
        action: "Freeze non-essential activities until major risks are controlled.",
        responsibleArea: "OPERATIONS",
        urgency: "TODAY",
      },
    ];
  }

  if (riskLevel === "HIGH") {
    return [
      {
        priority: 1,
        action: "Review high-risk departments and assign corrective actions.",
        responsibleArea: "MANAGEMENT",
        urgency: "TODAY",
      },
      {
        priority: 2,
        action: "Monitor production, quality, compliance and delivery daily.",
        responsibleArea: "OPERATIONS",
        urgency: "THIS_WEEK",
      },
    ];
  }

  if (riskLevel === "MEDIUM") {
    return [
      {
        priority: 1,
        action: "Review weak performance areas during weekly management meeting.",
        responsibleArea: "MANAGEMENT",
        urgency: "THIS_WEEK",
      },
      {
        priority: 2,
        action: "Assign improvement actions to responsible departments.",
        responsibleArea: "DEPARTMENT_HEADS",
        urgency: "THIS_WEEK",
      },
    ];
  }

  return [
    {
      priority: 1,
      action: "Continue monitoring factory performance.",
      responsibleArea: "MANAGEMENT",
      urgency: "THIS_WEEK",
    },
    {
      priority: 2,
      action: "Maintain preventive controls and review monthly trends.",
      responsibleArea: "DEPARTMENT_HEADS",
      urgency: "THIS_MONTH",
    },
  ];
}