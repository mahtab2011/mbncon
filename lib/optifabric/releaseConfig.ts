export const optiFabricReleaseConfig = {
  productName: "OptiFabric AI",

  productNameBn: "অপ্টিফ্যাব্রিক AI",

  productSubtitle:
    "AI Digital Cutting Master & Engineering Assistant",

  productSubtitleBn:
    "AI ডিজিটাল কাটিং মাস্টার ও ইঞ্জিনিয়ারিং সহকারী",

  version: "RC1",

  versionCode: 1,

  releaseName: "Commercial Pilot RC1",

  releaseNameBn: "বাণিজ্যিক পাইলট RC1",

  releaseType: "Commercial Pilot",

  releaseTypeBn: "বাণিজ্যিক পাইলট",

  releaseStatus: "Factory Demonstration Ready",

  releaseStatusBn: "কারখানা প্রদর্শনের জন্য প্রস্তুত",

  platform: "Web + Android Preparation",

  platformBn: "ওয়েব + অ্যান্ড্রয়েড প্রস্তুতি",

  supportedLanguages: [
    {
      code: "en",
      name: "English",
      nativeName: "English",
    },
    {
      code: "bn",
      name: "Bangla",
      nativeName: "বাংলা",
    },
  ],

  targetUsers: [
    {
      id: "cutting-master",
      name: "Cutting Master",
      nameBn: "কাটিং মাস্টার",
    },
    {
      id: "cutting-supervisor",
      name: "Cutting Supervisor",
      nameBn: "কাটিং সুপারভাইজার",
    },
    {
      id: "production-officer",
      name: "Production Officer",
      nameBn: "প্রোডাকশন অফিসার",
    },
    {
      id: "factory-manager",
      name: "Factory Manager",
      nameBn: "ফ্যাক্টরি ম্যানেজার",
    },
  ],

  commercialWorkflow: [
    {
      id: "upload",
      name: "Pattern Upload",
      nameBn: "প্যাটার্ন আপলোড",
      route: "/optifabric/demo/upload",
    },
    {
      id: "photo-quality",
      name: "AI Photo Inspection",
      nameBn: "AI ছবি পরীক্ষা",
      route: "/optifabric/demo/photo-quality",
    },
    {
      id: "boundary-tracing",
      name: "Boundary Tracing",
      nameBn: "বাউন্ডারি ট্রেসিং",
      route: "/optifabric/demo/boundary-tracing",
    },
    {
      id: "polygon",
      name: "Polygon Construction",
      nameBn: "পলিগন নির্মাণ",
      route: "/optifabric/demo/polygon",
    },
    {
      id: "ai-nesting",
      name: "AI Nesting",
      nameBn: "AI নেস্টিং",
      route: "/optifabric/demo/ai-nesting",
    },
    {
      id: "fabric-saving",
      name: "Fabric Saving",
      nameBn: "কাপড় সাশ্রয়",
      route: "/optifabric/demo/fabric-saving",
    },
    {
      id: "roi",
      name: "ROI Intelligence",
      nameBn: "ROI বিশ্লেষণ",
      route: "/optifabric/demo/roi",
    },
  ],

  releaseCapabilities: [
    "Pattern image and PDF guidance",
    "Photo quality intelligence",
    "Interactive boundary tracing",
    "Engineering polygon construction",
    "AI nesting demonstration",
    "Fabric-saving intelligence",
    "Commercial ROI intelligence",
    "English and Bangla guidance",
    "BGMEA presentation mode",
    "Factory demonstration mode",
    "Mobile-responsive commercial presentation",
  ],

  releaseCapabilitiesBn: [
    "প্যাটার্ন ছবি ও PDF নির্দেশনা",
    "ছবির গুণগত মান বিশ্লেষণ",
    "ইন্টারেক্টিভ বাউন্ডারি ট্রেসিং",
    "ইঞ্জিনিয়ারিং পলিগন নির্মাণ",
    "AI নেস্টিং প্রদর্শন",
    "কাপড় সাশ্রয় বিশ্লেষণ",
    "বাণিজ্যিক ROI বিশ্লেষণ",
    "ইংরেজি ও বাংলা নির্দেশনা",
    "BGMEA প্রেজেন্টেশন মোড",
    "ফ্যাক্টরি ডেমোনস্ট্রেশন মোড",
    "মোবাইল-রেসপন্সিভ বাণিজ্যিক প্রেজেন্টেশন",
  ],

  controlledPilotNotice:
    "RC1 is intended for controlled factory trials, commercial demonstrations and product validation before full public release.",

  controlledPilotNoticeBn:
    "RC1 পূর্ণাঙ্গ উন্মুক্ত রিলিজের আগে নিয়ন্ত্রিত কারখানা ট্রায়াল, বাণিজ্যিক প্রদর্শন এবং পণ্য যাচাইয়ের জন্য প্রস্তুত করা হয়েছে।",

  developer: {
    organisation: "MBN Consulting",
    website: "https://mbncon.com",
    productWebsite: "https://mahtabsiddiqui.com",
    supportEmail: "mahtab@mbncon.com",
  },

  playStore: {
    applicationId: "com.mbncon.optifabric",
    appName: "OptiFabric AI",
    shortDescription:
      "AI Digital Cutting Master for garment pattern engineering and fabric optimisation.",
    shortDescriptionBn:
      "গার্মেন্টস প্যাটার্ন ইঞ্জিনিয়ারিং ও কাপড় সাশ্রয়ের জন্য AI ডিজিটাল কাটিং মাস্টার।",
    releaseTrack: "Internal Testing",
    publicReleaseReady: false,
  },

  readiness: {
    workflowComplete: true,
    routeAuditComplete: true,
    bilingualGuidanceComplete: true,
    commercialPresentationComplete: true,
    mobilePresentationComplete: true,
    privacyPolicyComplete: false,
    termsOfUseComplete: false,
    aboutPageComplete: false,
    supportPageComplete: false,
    appIconComplete: false,
    splashScreenComplete: false,
    androidPackageComplete: false,
    playStoreListingComplete: false,
    productionSecurityReviewComplete: false,
    finalFactoryTrialComplete: false,
  },
} as const;

export type OptiFabricReleaseConfig =
  typeof optiFabricReleaseConfig;

export type OptiFabricWorkflowStep =
  (typeof optiFabricReleaseConfig.commercialWorkflow)[number];

export type OptiFabricTargetUser =
  (typeof optiFabricReleaseConfig.targetUsers)[number];