import { buildExecutiveHealthScore } from "./executiveHealthScoreEngine";
import { calculateExecutiveRiskLevel } from "./executiveRiskLevelEngine";
import { buildExecutivePriorityActions } from "./executivePriorityActionEngine";
import { buildExecutiveMorningBriefing } from "./executiveMorningBriefingEngine";
import { buildExecutiveOpportunities } from "./executiveOpportunityEngine";
import { buildExecutiveKpiSummary } from "./executiveKpiSummaryEngine";
import { buildExecutiveAlerts } from "./executiveAlertsEngine";
import { buildExecutiveRecommendations } from "./executiveRecommendationEngine";

export function buildExecutiveDashboardData() {

  const health =
    buildExecutiveHealthScore();

  const risk =
    calculateExecutiveRiskLevel(
      health.overallScore
    );

  return {

    health,

    risk,

    priorities:
      buildExecutivePriorityActions(risk),

    morningBriefing:
      buildExecutiveMorningBriefing(risk),

    opportunities:
      buildExecutiveOpportunities(),

    kpis:
      buildExecutiveKpiSummary(),

    alerts:
      buildExecutiveAlerts(),

    recommendations:
      buildExecutiveRecommendations(),
  };
}