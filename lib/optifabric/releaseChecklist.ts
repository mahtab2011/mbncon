export interface ReleaseChecklistItem {
  id: string;
  category: string;
  title: string;
  titleBn: string;
  completed: boolean;
  mandatory: boolean;
}

export const releaseChecklist: ReleaseChecklistItem[] = [
  // Core Engineering
  {
    id: "workflow",
    category: "Engineering",
    title: "Commercial Workflow Complete",
    titleBn: "বাণিজ্যিক কার্যপ্রবাহ সম্পন্ন",
    completed: true,
    mandatory: true,
  },
  {
    id: "navigation",
    category: "Engineering",
    title: "Route Audit Complete",
    titleBn: "রুট অডিট সম্পন্ন",
    completed: true,
    mandatory: true,
  },
  {
    id: "mobile",
    category: "Engineering",
    title: "Mobile Optimised",
    titleBn: "মোবাইল অপ্টিমাইজড",
    completed: true,
    mandatory: true,
  },

  // Presentation
  {
    id: "presentation",
    category: "Presentation",
    title: "BGMEA Presentation Ready",
    titleBn: "BGMEA উপস্থাপনা প্রস্তুত",
    completed: true,
    mandatory: true,
  },
  {
    id: "factory-demo",
    category: "Presentation",
    title: "Factory Demonstration Ready",
    titleBn: "কারখানা প্রদর্শনের জন্য প্রস্তুত",
    completed: true,
    mandatory: true,
  },

  // Documentation
  {
    id: "manual",
    category: "Documentation",
    title: "Bangla User Manual",
    titleBn: "বাংলা ব্যবহারকারী নির্দেশিকা",
    completed: false,
    mandatory: true,
  },
  {
    id: "privacy",
    category: "Documentation",
    title: "Privacy Policy",
    titleBn: "গোপনীয়তা নীতি",
    completed: false,
    mandatory: true,
  },
  {
    id: "terms",
    category: "Documentation",
    title: "Terms & Conditions",
    titleBn: "ব্যবহারের শর্তাবলী",
    completed: false,
    mandatory: true,
  },

  // Play Store
  {
    id: "icon",
    category: "Play Store",
    title: "Application Icon",
    titleBn: "অ্যাপ আইকন",
    completed: false,
    mandatory: true,
  },
  {
    id: "splash",
    category: "Play Store",
    title: "Splash Screen",
    titleBn: "স্প্ল্যাশ স্ক্রিন",
    completed: false,
    mandatory: true,
  },
  {
    id: "android",
    category: "Play Store",
    title: "Android Build",
    titleBn: "অ্যান্ড্রয়েড বিল্ড",
    completed: false,
    mandatory: true,
  },
  {
    id: "listing",
    category: "Play Store",
    title: "Play Store Listing",
    titleBn: "প্লে স্টোর লিস্টিং",
    completed: false,
    mandatory: true,
  },

  // Factory Validation
  {
    id: "pilot",
    category: "Validation",
    title: "Factory Pilot Validation",
    titleBn: "কারখানা পাইলট যাচাই",
    completed: false,
    mandatory: true,
  },
];

export function getReleaseCompletionPercentage() {
  const completed = releaseChecklist.filter(
    (item) => item.completed
  ).length;

  return Math.round(
    (completed / releaseChecklist.length) * 100
  );
}

export function mandatoryItemsRemaining() {
  return releaseChecklist.filter(
    (item) =>
      item.mandatory &&
      !item.completed
  );
}