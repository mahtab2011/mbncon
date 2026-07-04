export type ManufacturingAppCode =
  | "GPA"
  | "GQA"
  | "GPM"
  | "GFM"
  | "GHR"
  | "GCI"
  | "GFO"
  | "GBI"
  | "GKC";

export type ManufacturingUserRole =
  | "SUPER_ADMIN"
  | "FACTORY_OWNER"
  | "GENERAL_MANAGER"
  | "IE_MANAGER"
  | "PRODUCTION_MANAGER"
  | "QUALITY_MANAGER"
  | "MAINTENANCE_MANAGER"
  | "HR_MANAGER"
  | "COMPLIANCE_MANAGER"
  | "MERCHANDISER"
  | "SUPERVISOR"
  | "VIEWER";

export type SubscriptionStatus =
  | "TRIAL_ACTIVE"
  | "TRIAL_EXPIRED"
  | "LICENSE_ACTIVE"
  | "LICENSE_EXPIRED"
  | "SUSPENDED";

export type ManufacturingFactory = {
  factoryId: string;
  factoryName: string;
  groupName: string;
  country: string;
  city: string;
  timezone: string;
  activeApps: ManufacturingAppCode[];
};

export type ManufacturingShift = {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
};

export type ManufacturingSuiteApp = {
  appCode: ManufacturingAppCode;
  appName: string;
  banglaName: string;
  shortDescription: string;
  route: string;
  status: "ACTIVE" | "COMING_SOON";
};

export type ManufacturingNavItem = {
  label: string;
  banglaLabel: string;
  route: string;
  appCode?: ManufacturingAppCode;
  section:
    | "SUITE"
    | "GPA"
    | "FACTORY"
    | "REPORTS"
    | "ADMIN"
    | "SUBSCRIPTION";
};

export type ManufacturingSubscription = {
  factoryId: string;
  status: SubscriptionStatus;
  trialStartDate: string;
  trialEndDate: string;
  licensedApps: ManufacturingAppCode[];
  planName: string;
};

export const manufacturingSuiteApps: ManufacturingSuiteApp[] = [
  {
    appCode: "GPA",
    appName: "Garments Productivity App",
    banglaName: "গার্মেন্টস প্রোডাক্টিভিটি অ্যাপ",
    shortDescription:
      "Productivity, bottleneck, line balancing, SMV, time study and Gemba intelligence.",
    route: "/manufacturing/gpa",
    status: "ACTIVE",
  },
  {
    appCode: "GQA",
    appName: "Garments Quality Assurance",
    banglaName: "গার্মেন্টস কোয়ালিটি অ্যাশিওরেন্স",
    shortDescription:
      "Quality defects, DHU, audit, root cause and corrective action intelligence.",
    route: "/manufacturing/gqa",
    status: "COMING_SOON",
  },
  {
    appCode: "GPM",
    appName: "Garments Planning & Merchandising",
    banglaName: "গার্মেন্টস প্ল্যানিং ও মার্চেন্ডাইজিং",
    shortDescription:
      "Order planning, capacity, shipment risk and merchandising control.",
    route: "/manufacturing/gpm",
    status: "COMING_SOON",
  },
  {
    appCode: "GFM",
    appName: "Garments Factory Maintenance",
    banglaName: "গার্মেন্টস ফ্যাক্টরি মেইনটেন্যান্স",
    shortDescription:
      "Machine breakdown, preventive maintenance and maintenance cost intelligence.",
    route: "/manufacturing/gfm",
    status: "COMING_SOON",
  },
  {
    appCode: "GHR",
    appName: "Garments HR & Performance",
    banglaName: "গার্মেন্টস এইচআর ও পারফরম্যান্স",
    shortDescription:
      "Operator skill, attendance, supervisor performance and HR intelligence.",
    route: "/manufacturing/ghr",
    status: "COMING_SOON",
  },
  {
    appCode: "GCI",
    appName: "Garments Compliance Intelligence",
    banglaName: "গার্মেন্টস কমপ্লায়েন্স ইন্টেলিজেন্স",
    shortDescription:
      "Audit readiness, safety, labour compliance and evidence control.",
    route: "/manufacturing/gci",
    status: "COMING_SOON",
  },
  {
    appCode: "GFO",
    appName: "Garments Fabric Optimization",
    banglaName: "গার্মেন্টস ফেব্রিক অপটিমাইজেশন",
    shortDescription:
      "Fabric loss, cutting efficiency, marker efficiency and wastage control.",
    route: "/manufacturing/gfo",
    status: "COMING_SOON",
  },
  {
    appCode: "GBI",
    appName: "Garments Business Intelligence",
    banglaName: "গার্মেন্টস বিজনেস ইন্টেলিজেন্স",
    shortDescription:
      "Factory profitability, buyer risk, order margin and executive intelligence.",
    route: "/manufacturing/gbi",
    status: "COMING_SOON",
  },
  {
    appCode: "GKC",
    appName: "Garments Knowledge Centre",
    banglaName: "গার্মেন্টস নলেজ সেন্টার",
    shortDescription:
      "Lean, IE, productivity, quality, compliance and factory learning library.",
    route: "/manufacturing/gkc",
    status: "COMING_SOON",
  },
];

export const manufacturingNavItems: ManufacturingNavItem[] = [
  {
    label: "App Suite Home",
    banglaLabel: "অ্যাপ স্যুট হোম",
    route: "/manufacturing",
    section: "SUITE",
  },
  {
    label: "GPA Dashboard",
    banglaLabel: "জিপিএ ড্যাশবোর্ড",
    route: "/manufacturing/gpa",
    appCode: "GPA",
    section: "GPA",
  },
  {
    label: "Factory Health",
    banglaLabel: "ফ্যাক্টরি হেলথ",
    route: "/manufacturing/gpa/factory-health",
    appCode: "GPA",
    section: "GPA",
  },
  {
    label: "Bottleneck Centre",
    banglaLabel: "বটলনেক সেন্টার",
    route: "/manufacturing/gpa/bottleneck-centre",
    appCode: "GPA",
    section: "GPA",
  },
  {
    label: "Line Balancing",
    banglaLabel: "লাইন ব্যালান্সিং",
    route: "/manufacturing/gpa/line-balancing",
    appCode: "GPA",
    section: "GPA",
  },
  {
    label: "SMV Intelligence",
    banglaLabel: "এসএমভি ইন্টেলিজেন্স",
    route: "/manufacturing/gpa/smv-intelligence",
    appCode: "GPA",
    section: "GPA",
  },
  {
    label: "AI Gemba Walk",
    banglaLabel: "এআই গেম্বা ওয়াক",
    route: "/manufacturing/gpa/gemba-walk",
    appCode: "GPA",
    section: "GPA",
  },
  {
    label: "Global Search",
    banglaLabel: "গ্লোবাল সার্চ",
    route: "/manufacturing/search",
    section: "SUITE",
  },
  {
    label: "Reports",
    banglaLabel: "রিপোর্টস",
    route: "/manufacturing/reports",
    section: "REPORTS",
  },
  {
    label: "Subscription & License",
    banglaLabel: "সাবস্ক্রিপশন ও লাইসেন্স",
    route: "/manufacturing/subscription",
    section: "SUBSCRIPTION",
  },
];

export const sampleManufacturingFactories: ManufacturingFactory[] = [
  {
    factoryId: "factory-001",
    factoryName: "MBN Demo Garments Factory",
    groupName: "MBN Industrial Group",
    country: "Bangladesh",
    city: "Dhaka",
    timezone: "Asia/Dhaka",
    activeApps: ["GPA"],
  },
  {
    factoryId: "factory-002",
    factoryName: "Chattogram Export Unit",
    groupName: "MBN Industrial Group",
    country: "Bangladesh",
    city: "Chattogram",
    timezone: "Asia/Dhaka",
    activeApps: ["GPA"],
  },
];

export const sampleManufacturingShifts: ManufacturingShift[] = [
  {
    shiftId: "shift-a",
    shiftName: "Shift A",
    startTime: "08:00",
    endTime: "17:00",
  },
  {
    shiftId: "shift-b",
    shiftName: "Shift B",
    startTime: "17:00",
    endTime: "02:00",
  },
  {
    shiftId: "general",
    shiftName: "General Shift",
    startTime: "09:00",
    endTime: "18:00",
  },
];

export const sampleManufacturingSubscription: ManufacturingSubscription = {
  factoryId: "factory-001",
  status: "TRIAL_ACTIVE",
  trialStartDate: "2026-06-29",
  trialEndDate: "2026-12-29",
  licensedApps: ["GPA"],
  planName: "Six Month Free Trial",
};

export function calculateTrialDaysRemaining(
  subscription: ManufacturingSubscription,
  today: Date = new Date()
): number {
  const trialEnd = new Date(subscription.trialEndDate);
  const diff = trialEnd.getTime() - today.getTime();

  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}

export function isAppLicensed(
  appCode: ManufacturingAppCode,
  subscription: ManufacturingSubscription
): boolean {
  return subscription.licensedApps.includes(appCode);
}

export function getManufacturingAppByCode(
  appCode: ManufacturingAppCode
): ManufacturingSuiteApp | undefined {
  return manufacturingSuiteApps.find((app) => app.appCode === appCode);
}

export function searchManufacturingSuite(query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  return manufacturingNavItems.filter((item) => {
    return (
      item.label.toLowerCase().includes(normalizedQuery) ||
      item.banglaLabel.includes(query)
    );
  });
}