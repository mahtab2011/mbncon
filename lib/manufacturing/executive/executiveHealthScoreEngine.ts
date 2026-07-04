export interface ExecutiveHealthScore {

  overallScore: number;

  production: number;

  quality: number;

  maintenance: number;

  compliance: number;

  sustainability: number;

  commercial: number;

  overallStatus:
    | "EXCELLENT"
    | "GOOD"
    | "ATTENTION"
    | "CRITICAL";
}

export function buildExecutiveHealthScore(): ExecutiveHealthScore {

  return {

    overallScore: 94,

    production: 91,

    quality: 95,

    maintenance: 93,

    compliance: 96,

    sustainability: 92,

    commercial: 90,

    overallStatus: "EXCELLENT",
  };
}