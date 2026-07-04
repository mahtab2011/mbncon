import { ExecutiveRiskLevel } from "./executiveRiskLevelEngine";

export interface ExecutiveMorningBriefing {
  greeting: string;

  overallStatus: string;

  executiveMessage: string;

  riskLevel: ExecutiveRiskLevel;

  todaysFocus: string[];
}

export function buildExecutiveMorningBriefing(
  riskLevel: ExecutiveRiskLevel
): ExecutiveMorningBriefing {
  return {
    greeting:
      "Good Morning Managing Director.",

    overallStatus:
      "Factory operations reviewed successfully.",

    executiveMessage:
      "Production, Quality, Maintenance, Compliance and Sustainability have been analysed. Please review today's priorities below.",

    riskLevel,

    todaysFocus: [
      "Monitor production efficiency.",
      "Review preventive maintenance schedule.",
      "Verify buyer shipment readiness.",
      "Review sustainability performance.",
      "Close overdue compliance actions.",
    ],
  };
}