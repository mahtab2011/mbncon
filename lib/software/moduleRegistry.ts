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
    keywords: ["executive", "dashboard", "operations", "management"],
  },

  {
    name: "Factory War Room Dashboard",
    href: "/software/factory-war-room-dashboard",
    keywords: ["war room", "factory", "alerts", "risk", "operations"],
  },

  {
    name: "Bottleneck Analysis",
    href: "/software/manufacturing-productivity/bottleneck-analysis",
    keywords: ["bottleneck", "constraint", "productivity", "line", "delay"],
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
    keywords: ["production", "bottleneck", "throughput", "constraint"],
  },

  {
    name: "AI Shipment Risk",
    href: "/software/air-shipment-risk",
    keywords: ["shipment", "risk", "air shipment", "delay", "logistics"],
  },

  {
    name: "Buyer Behavior Intelligence",
    href: "/software/buyer-behavior-intelligence",
    keywords: ["buyer", "customer", "behavior", "analytics"],
  },

  {
    name: "Business Excellence Maturity",
    href: "/software/business-excellence-maturity",
    keywords: ["business excellence", "maturity", "lean", "tqm"],
  },

  {
    name: "Crisis Readiness Intelligence",
    href: "/software/crisis-readiness-intelligence",
    keywords: ["crisis", "risk", "readiness", "emergency"],
  },

  {
    name: "Emotional Intelligence Leadership",
    href: "/software/emotional-intelligence-leadership",
    keywords: ["leadership", "emotional intelligence", "people", "management"],
  },

  {
    name: "AI Workforce Motivation Intelligence",
    href: "/software/ai-workforce-motivation-intelligence",
    category: "Workforce & Leadership Intelligence",
    description:
      "Enterprise workforce engagement, behavioural stability, recognition, morale, burnout, and leadership influence intelligence system.",
    keywords: [
      "motivation",
      "engagement",
      "leadership",
      "burnout",
      "morale",
      "recognition",
      "workforce",
      "human intelligence",
      "employee engagement",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "Growth Mindset Intelligent Centre",
    href: "/software/growth-mindset-intelligent-centre",
    keywords: [
      "growth mindset",
      "learning culture",
      "adaptive learning",
      "coaching",
      "improvement",
      "mindset",
      "continuous improvement",
      "resilience",
    ],
  },

  {
    name: "Emotional Resilience Intelligence Centre",
    href: "/software/emotional-resilience-intelligence-centre",
    keywords: [
      "emotional resilience",
      "burnout",
      "stress",
      "fatigue",
      "morale",
      "leadership resilience",
      "recovery",
      "emotional intelligence",
    ],
  },

  {
    name: "Self Regulated Performance Intelligence",
    href: "/software/self-regulated-performance-intelligence",
    description:
      "AI-assisted intelligence engine for self-discipline, emotional control, behavioural consistency, focus stability, accountability, and long-term performance sustainability.",
    category: "Leadership & Human Intelligence",
    keywords: [
      "self regulation",
      "discipline",
      "performance",
      "focus",
      "consistency",
      "emotional control",
      "accountability",
      "motivation",
      "human intelligence",
      "leadership",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Psychological Safety Intelligence Centre",
    href: "/software/psychological-safety-intelligence",
    category: "Leadership & Human Intelligence",
    description:
      "Analyses workforce trust, emotional safety, fear pressure, collaboration culture, and leadership communication behaviour.",
    keywords: [
      "psychological safety",
      "team trust",
      "speaking up",
      "fear pressure",
      "leadership communication",
      "human intelligence",
    ],
  },

  {
    name: "AI Leadership Coaching Intelligence Centre",
    href: "/software/leadership-coaching-intelligence",
    category: "Leadership & Human Intelligence",
    description:
      "Analyses coaching culture, employee empowerment, leadership communication, development readiness, and future leadership growth.",
    keywords: [
      "leadership coaching",
      "employee empowerment",
      "feedback culture",
      "future leaders",
      "leadership communication",
      "human intelligence",
    ],
  },

  {
    name: "AI Accountability Culture Intelligence Centre",
    href: "/software/accountability-culture-intelligence",
    category: "Leadership & Human Intelligence",
    description:
      "Analyses ownership behaviour, follow-up discipline, decision clarity, excuse pressure, and corrective action accountability.",
    keywords: [
      "accountability culture",
      "ownership",
      "corrective action",
      "follow up",
      "decision clarity",
      "human intelligence",
    ],
  },

  {
    name: "AI Decision Making Intelligence Centre",
    href: "/software/decision-making-intelligence",
    category: "Leadership & Human Intelligence",
    description:
      "Analyses decision quality, escalation behaviour, emotional pressure, leadership responsiveness, and data-based decision discipline.",
    keywords: [
      "decision making",
      "leadership judgement",
      "decision quality",
      "escalation",
      "management decisions",
      "human intelligence",
    ],
  },

  {
    name: "AI Conflict Resolution Intelligence Centre",
    href: "/software/conflict-resolution-intelligence",
    category: "Leadership & Human Intelligence",
    description:
      "Analyses interpersonal conflict, collaboration pressure, communication behaviour, operational disagreements, and conflict resolution effectiveness.",
    keywords: [
      "conflict resolution",
      "team conflict",
      "communication",
      "cross functional tension",
      "collaboration",
      "human intelligence",
    ],
  },

  {
    name: "AI Strategic Thinking Intelligence Centre",
    href: "/software/strategic-thinking-intelligence",
    category: "Leadership & Human Intelligence",
    description:
      "Analyses strategic planning, leadership foresight, long-term operational thinking, and future organisational readiness.",
    keywords: [
      "strategic thinking",
      "leadership foresight",
      "future readiness",
      "strategic planning",
      "proactive management",
      "human intelligence",
    ],
  },

  {
    name: "AI Transformation Intelligence Centre",
    href: "/software/ai-transformation-intelligence-centre",
    category: "AI Transformation Division",
    description:
      "Central AI transformation hub for enterprise AI adoption, sector intelligence, automation readiness, and strategic AI roadmap development.",
    keywords: [
      "ai transformation",
      "artificial intelligence",
      "enterprise ai",
      "digital transformation",
      "ai adoption",
      "automation",
      "ai strategy",
      "intelligence centre",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "Why AI Intelligence",
    href: "/software/why-ai-intelligence",
    category: "AI Transformation Division",
    description:
      "Explains why organisations need AI intelligence, how AI changes decision-making, and how businesses can prepare for AI-driven transformation.",
    keywords: [
      "why ai",
      "artificial intelligence",
      "ai benefits",
      "ai transformation",
      "business ai",
      "future of work",
      "automation",
      "decision intelligence",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "Generative AI Intelligence",
    href: "/software/generative-ai-intelligence",
    category: "AI Transformation Division",
    description:
      "Generative AI intelligence for content creation, knowledge support, customer communication, process automation, and enterprise productivity improvement.",
    keywords: [
      "generative ai",
      "chatgpt",
      "content generation",
      "knowledge assistant",
      "automation",
      "ai productivity",
      "language model",
      "enterprise ai",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "Predictive AI Intelligence",
    href: "/software/predictive-ai-intelligence",
    category: "AI Transformation Division",
    description:
      "Predictive intelligence for forecasting, operational risk prediction, trend analysis, demand planning, and proactive business decision support.",
    keywords: [
      "predictive ai",
      "forecasting",
      "prediction",
      "trend analysis",
      "risk prediction",
      "demand forecasting",
      "future planning",
      "decision support",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Governance & Ethics",
    href: "/software/ai-governance-ethics",
    category: "AI Transformation Division",
    description:
      "Responsible AI governance, ethical AI deployment, data protection, accountability, compliance, audit control, and human oversight intelligence.",
    keywords: [
      "ai governance",
      "ai ethics",
      "responsible ai",
      "data privacy",
      "bias",
      "fairness",
      "human oversight",
      "compliance",
      "audit",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Analytics & Decision Intelligence",
    href: "/software/ai-analytics-decision-intelligence",
    category: "AI Transformation Division",
    description:
      "AI-powered analytics, executive insight generation, KPI intelligence, forecasting, risk visibility, and management decision support systems.",
    keywords: [
      "ai analytics",
      "decision intelligence",
      "business analytics",
      "executive insight",
      "kpi intelligence",
      "management decision",
      "data analytics",
      "decision support",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Smart Agriculture Intelligence",
    href: "/software/ai-smart-agriculture-intelligence",
    category: "AI Transformation Division",
    description:
      "AI intelligence for agriculture productivity, crop planning, farmer support, climate risk, market access, and agri-business transformation.",
    keywords: [
      "smart agriculture",
      "agriculture ai",
      "crop intelligence",
      "farmer support",
      "agri tech",
      "food security",
      "climate risk",
      "agri business",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Agri Marketing Intelligence",
    href: "/software/ai-agri-marketing-intelligence",
    category: "AI Transformation Division",
    description:
      "AI-powered agricultural marketing intelligence for farmer market access, buyer connection, demand visibility, and fairer agri product distribution.",
    keywords: [
      "agri marketing",
      "agriculture marketing",
      "farmer market access",
      "buyer connection",
      "agri supply chain",
      "fair price",
      "food distribution",
      "market intelligence",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Live Agri Product Price Intelligence",
    href: "/software/ai-live-agri-product-price-intelligence",
    category: "AI Transformation Division",
    description:
      "Live agricultural product price intelligence for fair pricing, public price visibility, market transparency, and reduction of price syndication risk.",
    keywords: [
      "live agri price",
      "agriculture price",
      "fair price",
      "market transparency",
      "price syndication",
      "product price",
      "farmer price",
      "consumer price",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Smart Healthcare Intelligence",
    href: "/software/ai-smart-healthcare-intelligence",
    category: "AI Transformation Division",
    description:
      "AI healthcare intelligence for patient support, diagnostic assistance, operational planning, service access, and healthcare decision improvement.",
    keywords: [
      "smart healthcare",
      "healthcare ai",
      "patient support",
      "diagnostic assistance",
      "health intelligence",
      "medical operations",
      "healthcare planning",
      "public health",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },
    {
    name: "AI Banking & Insurance Intelligence",
    href: "/software/ai-banking-insurance-intelligence",
    category: "AI Transformation Division",
    description:
      "AI intelligence for banking, insurance, customer service, fraud risk, compliance, claim processing, and operational productivity improvement.",
    keywords: [
      "banking",
      "insurance",
      "financial services",
      "fraud risk",
      "claims",
      "kyc",
      "compliance",
      "customer service",
      "ai transformation",
    ],
    riskLevel: "high",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Retail Intelligence",
    href: "/software/ai-retail-intelligence",
    category: "AI Transformation Division",
    description:
      "AI retail intelligence for sales trends, inventory visibility, customer behaviour, stockout risk, shrinkage control, and profit improvement.",
    keywords: [
      "retail",
      "sales",
      "inventory",
      "stockout",
      "customer behaviour",
      "shrinkage",
      "profit margin",
      "store productivity",
      "ai transformation",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Restaurant Intelligence",
    href: "/software/ai-restaurant-intelligence",
    category: "AI Transformation Division",
    description:
      "AI intelligence for restaurant service speed, kitchen flow, table turnover, menu profitability, food wastage, and customer satisfaction.",
    keywords: [
      "restaurant",
      "kitchen",
      "food service",
      "table turnover",
      "menu profitability",
      "food wastage",
      "customer satisfaction",
      "hospitality",
      "ai transformation",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Residential Hotel Intelligence",
    href: "/software/ai-residential-hotel-intelligence",
    category: "AI Transformation Division",
    description:
      "AI hotel intelligence for occupancy, housekeeping productivity, guest complaints, maintenance control, room revenue, and service quality.",
    keywords: [
      "hotel",
      "residential hotel",
      "hospitality",
      "occupancy",
      "housekeeping",
      "guest service",
      "maintenance",
      "room revenue",
      "ai transformation",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },

  {
    name: "AI Catering Company Intelligence",
    href: "/software/ai-catering-company-intelligence",
    category: "AI Transformation Division",
    description:
      "AI intelligence for catering event planning, menu costing, purchasing control, delivery readiness, food wastage, and profit margin protection.",
    keywords: [
      "catering",
      "event planning",
      "menu costing",
      "kitchen scheduling",
      "delivery",
      "food wastage",
      "profit margin",
      "hospitality",
      "ai transformation",
    ],
    riskLevel: "medium",
    featured: true,
    recentlyAdded: true,
  },
];