export type TheoryKey =
  | "platformPurpose"
  | "executiveVisibility"
  | "productionGuidance"
  | "workforceGuidance"
  | "maintenanceGuidance"
  | "utilitiesGuidance"
  | "wastageGuidance"
  | "cashflowGuidance"
  | "evidenceGuidance"
  | "governanceGuidance";

export const bnTheory: Record<TheoryKey, string> = {
  platformPurpose:
    "এই প্ল্যাটফর্মটি উৎপাদন, জনবল, খরচ, ঝুঁকি, শিপমেন্ট, কোয়ালিটি এবং এক্সিকিউটিভ সিদ্ধান্ত গ্রহণকে এক জায়গায় এনে ফ্যাক্টরির সামগ্রিক কার্যক্ষমতা উন্নত করতে সহায়তা করে।",

  executiveVisibility:
    "এই মডিউলটি পরিচালক, মালিক এবং সিনিয়র ম্যানেজমেন্টকে উৎপাদন অবস্থা, ঝুঁকি, খরচের চাপ, শিপমেন্ট সমস্যা এবং সংশোধনমূলক পদক্ষেপ দ্রুত বুঝতে সহায়তা করে।",

  productionGuidance:
    "প্রোডাকশন ডেটা নিয়মিত এন্ট্রি করলে লাইনের দক্ষতা, bottleneck, output gap এবং অপারেশনাল ক্ষতি দ্রুত শনাক্ত করা যায়।",

  workforceGuidance:
    "জনবল সংক্রান্ত তথ্য যেমন উপস্থিতি, অনুপস্থিতি, ওভারটাইম এবং manpower allocation সঠিকভাবে এন্ট্রি করলে workforce planning এবং productivity improvement সহজ হয়।",

  maintenanceGuidance:
    "মেশিন breakdown, downtime, repair cost এবং preventive maintenance তথ্য বিশ্লেষণ করলে উৎপাদন বন্ধ হওয়ার ঝুঁকি কমানো যায়।",

  utilitiesGuidance:
    "বিদ্যুৎ, জেনারেটর fuel এবং utility cost আলাদা করে দেখা গেলে abnormal cost spike, wasteful usage এবং cash pressure দ্রুত বোঝা যায়।",

  wastageGuidance:
    "ওয়েস্টেজ, rejection এবং rework তথ্য বিশ্লেষণ করলে material loss, quality issue এবং profit leakage কমানোর সুযোগ তৈরি হয়।",

  cashflowGuidance:
    "Cashflow risk intelligence delayed payment, export delay, utility pressure, repair cost এবং wastage cost থেকে working capital ঝুঁকি শনাক্ত করতে সহায়তা করে।",

  evidenceGuidance:
    "প্রতিটি risk, defect, delay, breakdown এবং corrective action-এর জন্য document evidence রাখলে audit readiness এবং management accountability শক্তিশালী হয়।",

  governanceGuidance:
    "Role-based access, evidence control, risk review এবং management approval process নিশ্চিত করলে enterprise governance ও data confidentiality বজায় থাকে।",
};

export function getBnTheory(key: TheoryKey): string {
  return bnTheory[key];
}