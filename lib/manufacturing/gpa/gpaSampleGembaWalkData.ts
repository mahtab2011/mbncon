import {
  GPAGembaWalkInput,
} from "./gpaGembaWalkEngine";

export const gpaSampleGembaWalkData: GPAGembaWalkInput[] = [
  {
    area: "Sewing Line 04",

    inspector: "Production Manager",

    observations: [
      {
        category: "PRODUCTION",
        observation: "Feeding delay observed.",
        status: "ATTENTION",
        responsibleDepartment: "Cutting",
      },

      {
        category: "QUALITY",
        observation: "First-piece approval completed.",
        status: "GOOD",
        responsibleDepartment: "Quality",
      },

      {
        category: "IE",
        observation: "Line balancing needs review.",
        status: "ATTENTION",
        responsibleDepartment: "Industrial Engineering",
      },

      {
        category: "LEAN",
        observation: "Excess WIP between operations.",
        status: "CRITICAL",
        responsibleDepartment: "Production",
      },

      {
        category: "SAFETY",
        observation: "Emergency exit unobstructed.",
        status: "GOOD",
        responsibleDepartment: "Safety",
      },
    ],
  },

  {
    area: "Finishing Section",

    inspector: "Factory Manager",

    observations: [
      {
        category: "QUALITY",
        observation: "Inspection table overloaded.",
        status: "ATTENTION",
        responsibleDepartment: "Quality",
      },

      {
        category: "MAINTENANCE",
        observation: "Thread trimmer malfunction.",
        status: "ATTENTION",
        responsibleDepartment: "Maintenance",
      },

      {
        category: "LEAN",
        observation: "Good housekeeping maintained.",
        status: "GOOD",
        responsibleDepartment: "Production",
      },

      {
        category: "SAFETY",
        observation: "PPE compliance satisfactory.",
        status: "GOOD",
        responsibleDepartment: "Safety",
      },
    ],
  },
];