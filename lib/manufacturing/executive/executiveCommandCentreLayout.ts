export interface ExecutiveDashboardCard {

  id: string;

  title: string;

  width:
    | "FULL"
    | "HALF"
    | "THIRD";

  displayOrder: number;
}

export const executiveCommandCentreLayout:
ExecutiveDashboardCard[] = [

  {
    id: "health",

    title: "Factory Health",

    width: "HALF",

    displayOrder: 1,
  },

  {
    id: "briefing",

    title: "AI Morning Briefing",

    width: "FULL",

    displayOrder: 2,
  },

  {
    id: "kpis",

    title: "Executive KPIs",

    width: "HALF",

    displayOrder: 3,
  },

  {
    id: "alerts",

    title: "Executive Alerts",

    width: "HALF",

    displayOrder: 4,
  },

  {
    id: "priorities",

    title: "Today's Priorities",

    width: "HALF",

    displayOrder: 5,
  },

  {
    id: "opportunities",

    title: "Improvement Opportunities",

    width: "HALF",

    displayOrder: 6,
  },

  {
    id: "recommendations",

    title: "AI Recommendations",

    width: "FULL",

    displayOrder: 7,
  },
];