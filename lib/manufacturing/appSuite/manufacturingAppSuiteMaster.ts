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

export type ManufacturingAppStatus =
  | "PLANNED"
  | "IN_DEVELOPMENT"
  | "PILOT_READY"
  | "PLAY_STORE_READY"
  | "PAID";

export type ManufacturingAppModule = {
  code: ManufacturingAppCode;
  name: string;
  bnName: string;
  tagline: string;
  bnTagline: string;
  status: ManufacturingAppStatus;
  freeTrialMonths: number;
  route: string;
};

export const manufacturingAppSuite: ManufacturingAppModule[] = [
  {
    code: "GPA",
    name: "Garments Productivity App",
    bnName: "গার্মেন্টস প্রোডাক্টিভিটি অ্যাপ",
    tagline: "AI-powered productivity, IE and lean manufacturing control.",
    bnTagline:
      "এআই ভিত্তিক প্রোডাক্টিভিটি, IE এবং লিন ম্যানুফ্যাকচারিং নিয়ন্ত্রণ।",
    status: "IN_DEVELOPMENT",
    freeTrialMonths: 6,
    route: "/gpa",
  },
  {
    code: "GQA",
    name: "Garments Quality Assurance",
    bnName: "গার্মেন্টস কোয়ালিটি অ্যাসিউরেন্স",
    tagline: "Inline, endline, DHU, defect and CAPA intelligence.",
    bnTagline:
      "ইনলাইন, এন্ডলাইন, DHU, ডিফেক্ট এবং CAPA ইন্টেলিজেন্স।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gqa",
  },
  {
    code: "GPM",
    name: "Garments Planning & Merchandising",
    bnName: "গার্মেন্টস প্ল্যানিং ও মার্চেন্ডাইজিং",
    tagline: "Capacity, T&A, order and shipment planning.",
    bnTagline:
      "ক্যাপাসিটি, T&A, অর্ডার এবং শিপমেন্ট প্ল্যানিং।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gpm",
  },
  {
    code: "GFM",
    name: "Garments Factory Maintenance",
    bnName: "গার্মেন্টস ফ্যাক্টরি মেইনটেন্যান্স",
    tagline: "TPM, preventive maintenance and breakdown intelligence.",
    bnTagline:
      "TPM, প্রিভেন্টিভ মেইনটেন্যান্স এবং ব্রেকডাউন ইন্টেলিজেন্স।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gfm",
  },
  {
    code: "GHR",
    name: "Garments HR & Performance",
    bnName: "গার্মেন্টস HR ও পারফরম্যান্স",
    tagline: "Skill matrix, productivity passport and training intelligence.",
    bnTagline:
      "স্কিল ম্যাট্রিক্স, প্রোডাক্টিভিটি পাসপোর্ট এবং ট্রেনিং ইন্টেলিজেন্স।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/ghr",
  },
  {
    code: "GCI",
    name: "Garments Compliance Intelligence",
    bnName: "গার্মেন্টস কমপ্লায়েন্স ইন্টেলিজেন্স",
    tagline: "Safety, social, fire, chemical and buyer compliance.",
    bnTagline:
      "সেফটি, সোশ্যাল, ফায়ার, কেমিক্যাল এবং বায়ার কমপ্লায়েন্স।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gci",
  },
  {
    code: "GFO",
    name: "Garments Fabric Optimization",
    bnName: "গার্মেন্টস ফেব্রিক অপটিমাইজেশন",
    tagline: "AI marker planning, fabric saving and shade control.",
    bnTagline:
      "এআই মার্কার প্ল্যানিং, ফেব্রিক সেভিং এবং শেড কন্ট্রোল।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gfo",
  },
  {
    code: "GBI",
    name: "Garments Business Intelligence",
    bnName: "গার্মেন্টস বিজনেস ইন্টেলিজেন্স",
    tagline: "CEO dashboard, profitability and executive AI briefing.",
    bnTagline:
      "CEO ড্যাশবোর্ড, প্রফিটেবিলিটি এবং নির্বাহী এআই ব্রিফিং।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gbi",
  },
  {
    code: "GKC",
    name: "Garments Knowledge Centre",
    bnName: "গার্মেন্টস নলেজ সেন্টার",
    tagline: "Bangla and English training, SOP, quiz and certification.",
    bnTagline:
      "বাংলা ও ইংরেজি ট্রেনিং, SOP, কুইজ এবং সার্টিফিকেশন।",
    status: "PLANNED",
    freeTrialMonths: 6,
    route: "/gkc",
  },
];

export function getManufacturingAppByCode(
  code: ManufacturingAppCode
): ManufacturingAppModule | undefined {
  return manufacturingAppSuite.find((app) => app.code === code);
}