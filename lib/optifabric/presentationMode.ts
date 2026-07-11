export interface PresentationStep {
  title: string;
  titleBn: string;
 description: string;
 descriptionBn: string;
}

export const presentationSteps: PresentationStep[] = [
  {
    title: "Upload Pattern",
    titleBn: "প্যাটার্ন আপলোড",
    description: "Upload a clear pattern image.",
    descriptionBn: "পরিষ্কার প্যাটার্ন ছবি আপলোড করুন।",
  },
  {
    title: "AI Image Inspection",
    titleBn: "AI ছবি পরীক্ষা",
    description: "AI checks photo quality.",
    descriptionBn: "AI ছবির গুণগত মান পরীক্ষা করে।",
  },
  {
    title: "Boundary Tracing",
    titleBn: "বাউন্ডারি ট্রেসিং",
    description: "Trace the cutting boundary.",
    descriptionBn: "কাটিং সীমা নির্ধারণ করুন।",
  },
  {
    title: "Polygon Construction",
    titleBn: "পলিগন তৈরি",
    description: "AI builds engineering polygon.",
    descriptionBn: "AI প্রকৌশলগত পলিগন তৈরি করে।",
  },
  {
    title: "Marker Simulation",
    titleBn: "মার্কার সিমুলেশন",
    description: "AI simulates nesting.",
    descriptionBn: "AI ভার্চুয়াল নেস্টিং করে।",
  },
  {
    title: "Savings Intelligence",
    titleBn: "সেভিংস বিশ্লেষণ",
    description: "AI estimates fabric savings.",
    descriptionBn: "AI কাপড় সাশ্রয় অনুমান করে।",
  },
  {
    title: "Commercial ROI",
    titleBn: "ROI বিশ্লেষণ",
    description: "Calculate commercial benefits.",
    descriptionBn: "ব্যবসায়িক লাভ নির্ণয়।",
  },
];