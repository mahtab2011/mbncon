import { buildExecutiveDashboardData } from "./executiveDashboardDataBuilder";

export interface ExecutiveDashboardUiModel {

  pageTitle: string;

  generatedAt: string;

  dashboard: ReturnType<
    typeof buildExecutiveDashboardData
  >;
}

export function buildExecutiveDashboardUiModel():
ExecutiveDashboardUiModel {

  return {

    pageTitle:
      "AI Factory Executive Command Centre",

    generatedAt:
      new Date().toISOString(),

    dashboard:
      buildExecutiveDashboardData(),
  };
}