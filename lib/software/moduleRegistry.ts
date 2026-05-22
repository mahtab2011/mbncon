export type ModuleItem = {
  name: string;
  href: string;

  keywords: string[];

  category?: string;

  description?: string;

  riskLevel?: "low" | "medium" | "high";

  featured?: boolean;

  recentlyAdded?: boolean;
};

export const moduleRegistry: ModuleItem[] = [
  {
  name: "Executive Command Centre",

  href: "/software/executive-command-centre",

  category: "Executive Intelligence",

  description:
    "Central enterprise intelligence command hub with KPI, operational alerts, AI recommendations, and management visibility.",

  keywords: [
    "executive",
    "dashboard",
    "leadership",
    "management",
    "kpi",
    "operations",
    "alerts",
    "risk",
  ],

  riskLevel: "high",

  featured: true,

  recentlyAdded: true,
},

  {
    name: "Executive Dashboard",
    href: "/software/executive-dashboard",
    keywords: [
      "executive",
      "dashboard",
      "operations",
      "management",
    ],
  },

  {
    name: "Factory War Room Dashboard",
    href: "/software/factory-war-room-dashboard",
    keywords: [
      "war room",
      "factory",
      "alerts",
      "risk",
      "operations",
    ],
  },

  {
    name: "Bottleneck Analysis",
    href: "/software/manufacturing-productivity/bottleneck-analysis",
    keywords: [
      "bottleneck",
      "constraint",
      "productivity",
      "line",
      "delay",
    ],
  },

  {
    name: "Bottleneck & IE Intelligence",
    href: "/software/bottleneck-industrial-engineering-intelligence",
    keywords: [
      "industrial engineering",
      "activity sampling",
      "method study",
      "motion study",
      "time study",
      "bottleneck",
    ],
  },

  {
    name: "AI Production Bottleneck Intelligence",
    href: "/software/ai-production-bottleneck-intelligence",
    keywords: [
      "production",
      "bottleneck",
      "throughput",
      "constraint",
    ],
  },

  {
    name: "AI Shipment Risk",
    href: "/software/air-shipment-risk",
    keywords: [
      "shipment",
      "risk",
      "air shipment",
      "delay",
      "logistics",
    ],
  },

  {
    name: "Buyer Behavior Intelligence",
    href: "/software/buyer-behavior-intelligence",
    keywords: [
      "buyer",
      "customer",
      "behavior",
      "analytics",
    ],
  },

  {
    name: "Business Excellence Maturity",
    href: "/software/business-excellence-maturity",
    keywords: [
      "business excellence",
      "maturity",
      "lean",
      "tqm",
    ],
  },

  {
    name: "Crisis Readiness Intelligence",
    href: "/software/crisis-readiness-intelligence",
    keywords: [
      "crisis",
      "risk",
      "readiness",
      "emergency",
    ],
  },

  {
    name: "Emotional Intelligence Leadership",
    href: "/software/emotional-intelligence-leadership",
    keywords: [
      "leadership",
      "emotional intelligence",
      "people",
      "management",
    ],
  },
];