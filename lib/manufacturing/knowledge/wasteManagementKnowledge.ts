export type WasteManagementCategory =
  | "TEXTILE_WASTE"
  | "PLASTIC_WASTE"
  | "PAPER_WASTE"
  | "HAZARDOUS_WASTE"
  | "RECYCLING"
  | "DISPOSAL";

export interface WasteManagementKnowledge {
  code: string;

  category: WasteManagementCategory;

  title: string;

  description: string;

  improvementMethods: string[];

  evidenceRequired: string[];

  kpi: string;

  aiRecommendation: string;

  responsibleDepartment: string;

  isActive: boolean;

  version: string;

  lastReviewed: string;
}

export const wasteManagementKnowledgeLibrary: WasteManagementKnowledge[] = [
  {
    code: "WM001",

    category: "TEXTILE_WASTE",

    title: "Textile Waste Reduction",

    description:
      "Reduce fabric waste generated during cutting and sewing operations.",

    improvementMethods: [
      "Improve marker efficiency",
      "Optimize cutting layouts",
      "Reuse offcuts where possible",
      "Monitor cutting waste daily",
    ],

    evidenceRequired: [
      "Fabric consumption report",
      "Marker efficiency report",
      "Waste register",
    ],

    kpi: "Fabric waste (%)",

    aiRecommendation:
      "Review marker efficiency weekly and investigate abnormal fabric wastage.",

    responsibleDepartment: "CUTTING",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "WM002",

    category: "RECYCLING",

    title: "Recycling Programme",

    description:
      "Separate recyclable materials and maximize recycling opportunities.",

    improvementMethods: [
      "Segregate waste at source",
      "Partner with certified recyclers",
      "Track recycling rates",
    ],

    evidenceRequired: [
      "Recycling records",
      "Recycler certificates",
      "Waste segregation checklist",
    ],

    kpi: "Recycling rate (%)",

    aiRecommendation:
      "Implement colour-coded bins and review recycling performance monthly.",

    responsibleDepartment: "COMPLIANCE",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },

  {
    code: "WM003",

    category: "HAZARDOUS_WASTE",

    title: "Hazardous Waste Management",

    description:
      "Manage hazardous waste safely in accordance with legal and buyer requirements.",

    improvementMethods: [
      "Store hazardous waste separately",
      "Use licensed disposal contractors",
      "Maintain disposal records",
    ],

    evidenceRequired: [
      "Hazardous waste register",
      "Disposal certificates",
      "Storage inspection reports",
    ],

    kpi: "Hazardous waste compliance score",

    aiRecommendation:
      "Conduct monthly audits of hazardous waste storage and disposal practices.",

    responsibleDepartment: "EHS",

    isActive: true,

    version: "1.0",

    lastReviewed: "2026-06-27",
  },
];