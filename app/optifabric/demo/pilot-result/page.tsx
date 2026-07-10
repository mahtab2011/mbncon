"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Language = "en" | "bn";

type PilotStatus =
  | "commercial-ready"
  | "pilot-ready"
  | "review-required";

type WorkflowStep = {
  number: string;
  title: string;
  description: string;
  href: string;
  status: "completed" | "current";
};

type Translation = {
  block: string;
  title: string;
  subtitle: string;
  languageButton: string;

  back: string;
  restart: string;
  home: string;

  statusCommercialReady: string;
  statusPilotReady: string;
  statusReviewRequired: string;

  executiveTitle: string;
  executiveSummary: string;

  workflowTitle: string;
  workflowSubtitle: string;
  completed: string;
  review: string;

  stepUpload: string;
  stepUploadDescription: string;
  stepPhoto: string;
  stepPhotoDescription: string;
  stepTrace: string;
  stepTraceDescription: string;
  stepPolygon: string;
  stepPolygonDescription: string;
  stepNesting: string;
  stepNestingDescription: string;
  stepEfficiency: string;
  stepEfficiencyDescription: string;
  stepSaving: string;
  stepSavingDescription: string;
  stepRoi: string;
  stepRoiDescription: string;

  headlineTitle: string;
  markerEfficiency: string;
  improvedEfficiency: string;
  efficiencyGain: string;
  fabricSaved: string;
  financialSaving: string;
  firstYearRoi: string;
  paybackPeriod: string;
  annualNetBenefit: string;

  metres: string;
  months: string;

  assumptionsTitle: string;
  currentEfficiency: string;
  targetEfficiency: string;
  orderQuantity: string;
  markerLength: string;
  fabricCost: string;
  savingPerOrder: string;
  ordersPerMonth: string;
  monthlySubscription: string;
  currency: string;

  calculate: string;
  reset: string;

  whyTitle: string;
  whyEfficiency: string;
  whyQuantity: string;
  whyMarker: string;
  whyFabricCost: string;
  whyOrderSaving: string;
  whySubscription: string;

  aiVerdictTitle: string;
  verdictCommercialReady: string;
  verdictPilotReady: string;
  verdictReviewRequired: string;

  benefitsTitle: string;
  benefitOneTitle: string;
  benefitOneText: string;
  benefitTwoTitle: string;
  benefitTwoText: string;
  benefitThreeTitle: string;
  benefitThreeText: string;
  benefitFourTitle: string;
  benefitFourText: string;

  userTitle: string;
  cuttingMaster: string;
  cuttingMasterText: string;
  productionOfficer: string;
  productionOfficerText: string;
  factoryOwner: string;
  factoryOwnerText: string;
  bgmeaInvestor: string;
  bgmeaInvestorText: string;

  commercialTitle: string;
  commercialOne: string;
  commercialTwo: string;
  commercialThree: string;
  commercialFour: string;

  controlsTitle: string;
  controlOne: string;
  controlTwo: string;
  controlThree: string;
  controlFour: string;

  disclaimerTitle: string;
  disclaimerText: string;

  callToActionTitle: string;
  callToActionText: string;
  startAgain: string;
  viewRoi: string;
  viewSaving: string;

  pilotComplete: string;
  pilotCompleteText: string;

  validationEfficiency: string;
  validationQuantity: string;
};

const translations: Record<Language, Translation> = {
  en: {
    block: "RC1 Mini Pilot · Block 020",
    title: "Complete Pilot Result",
    subtitle:
      "The full OptiFabric AI commercial journey is now connected—from pattern upload to fabric saving and return on investment.",
    languageButton: "বাংলা",

    back: "Back to ROI",
    restart: "Restart Pilot",
    home: "OptiFabric Home",

    statusCommercialReady: "Commercial Demonstration Ready",
    statusPilotReady: "Factory Pilot Ready",
    statusReviewRequired: "Engineering Review Required",

    executiveTitle: "Executive Pilot Summary",
    executiveSummary:
      "OptiFabric AI enables a cutting master or production officer to move from a pattern image to an understandable marker, fabric-saving estimate and commercial ROI without requiring advanced CAD experience.",

    workflowTitle: "Complete AI Workflow",
    workflowSubtitle:
      "Visitors can now experience the complete commercial pilot from upload to ROI.",
    completed: "Completed",
    review: "Open Step",

    stepUpload: "Pattern Upload",
    stepUploadDescription:
      "The user uploads a pattern photo or document using a simple guided workflow.",

    stepPhoto: "Photo Quality Intelligence",
    stepPhotoDescription:
      "AI checks whether the pattern image is clear enough for tracing and explains how to improve it.",

    stepTrace: "Boundary Tracing",
    stepTraceDescription:
      "The user identifies the pattern boundary without needing CAD knowledge.",

    stepPolygon: "AI Polygon Construction",
    stepPolygonDescription:
      "The traced points are converted into an engineering-ready digital shape.",

    stepNesting: "AI Nesting",
    stepNestingDescription:
      "AI demonstrates how pattern pieces may be arranged inside the available fabric width.",

    stepEfficiency: "Marker Efficiency",
    stepEfficiencyDescription:
      "The system calculates productive area, waste and marker-efficiency performance.",

    stepSaving: "Fabric Saving",
    stepSavingDescription:
      "Efficiency improvement is converted into estimated metres of fabric and financial savings.",

    stepRoi: "Commercial ROI",
    stepRoiDescription:
      "Savings are converted into annual benefit, payback period and return on investment.",

    headlineTitle: "Commercial Pilot Headline Results",
    markerEfficiency: "Current efficiency",
    improvedEfficiency: "AI-improved efficiency",
    efficiencyGain: "Efficiency improvement",
    fabricSaved: "Estimated fabric saved",
    financialSaving: "Estimated order saving",
    firstYearRoi: "First-year ROI",
    paybackPeriod: "Payback period",
    annualNetBenefit: "Annual net benefit",

    metres: "m",
    months: "months",

    assumptionsTitle: "Pilot Result Assumptions",
    currentEfficiency: "Current marker efficiency",
    targetEfficiency: "AI-improved efficiency",
    orderQuantity: "Production order quantity",
    markerLength: "Current marker length",
    fabricCost: "Fabric cost per metre",
    savingPerOrder: "Estimated saving per order",
    ordersPerMonth: "Orders analysed per month",
    monthlySubscription: "Monthly subscription",
    currency: "Currency",

    calculate: "Update Pilot Result",
    reset: "Reset Demonstration",

    whyTitle: "Why does AI ask for this?",
    whyEfficiency:
      "AI compares present and improved efficiency to estimate the reduction in fabric consumption.",
    whyQuantity:
      "Order quantity determines whether a small percentage improvement creates a meaningful commercial saving.",
    whyMarker:
      "Marker length helps estimate how much fabric is used before and after optimisation.",
    whyFabricCost:
      "Fabric price converts saved metres into financial value.",
    whyOrderSaving:
      "Saving per order is used to calculate monthly and annual commercial benefit.",
    whySubscription:
      "Software cost is included so the ROI remains transparent and realistic.",

    aiVerdictTitle: "AI Commercial Verdict",
    verdictCommercialReady:
      "The demonstration shows a strong commercial case. The next step is to validate the result with real pattern polygons and actual factory production data.",
    verdictPilotReady:
      "The result is positive and suitable for a controlled factory pilot. More real marker samples should be tested before wider deployment.",
    verdictReviewRequired:
      "The current assumptions do not yet produce a strong commercial result. Review marker efficiency, order volume, fabric cost and expected usage.",

    benefitsTitle: "What the Pilot Demonstrates",
    benefitOneTitle: "No CAD Experience Required",
    benefitOneText:
      "The user follows a guided visual process instead of operating a complex CAD system.",

    benefitTwoTitle: "Engineering Explanation",
    benefitTwoText:
      "Every input includes a simple explanation of why AI requires it.",

    benefitThreeTitle: "Commercial Visibility",
    benefitThreeText:
      "Marker improvement is translated into fabric metres, money and ROI.",

    benefitFourTitle: "English and Bangla Guidance",
    benefitFourText:
      "Cutting teams and decision-makers can understand the workflow in simple language.",

    userTitle: "Value for Each User",
    cuttingMaster: "Cutting Master",
    cuttingMasterText:
      "Receives a simple guided process for tracing, nesting and marker improvement.",

    productionOfficer: "Production Officer",
    productionOfficerText:
      "Receives measurable efficiency, waste and fabric-consumption information.",

    factoryOwner: "Factory Owner",
    factoryOwnerText:
      "Receives estimated savings, investment payback and annual financial benefit.",

    bgmeaInvestor: "BGMEA, Buyer or Investor",
    bgmeaInvestorText:
      "Sees a scalable commercial solution for factories that cannot maintain advanced CAD expertise.",

    commercialTitle: "Recommended Factory Pilot",
    commercialOne:
      "Select three garment styles with different pattern complexity.",
    commercialTwo:
      "Record the approved existing marker efficiency and fabric consumption.",
    commercialThree:
      "Run the same styles through OptiFabric AI and compare the results.",
    commercialFour:
      "Approve wider use only after engineering and production validation.",

    controlsTitle: "Production Controls",
    controlOne:
      "Never violate grain line, nap direction, checks, stripes or print direction.",
    controlTwo:
      "Maintain buyer specifications, cutting tolerance and shade grouping.",
    controlThree:
      "Validate AI recommendations on a sample lay before bulk cutting.",
    controlFour:
      "Use exact traced polygons for commercial production calculations.",

    disclaimerTitle: "Commercial and Engineering Disclaimer",
    disclaimerText:
      "This RC1 Mini Pilot is a commercial demonstration. Calculated savings are estimates based on the entered assumptions. Production approval must be based on exact pattern geometry, fabric characteristics, buyer requirements and factory validation.",

    callToActionTitle: "The RC1 Mini Pilot Journey Is Complete",
    callToActionText:
      "The visitor can now experience the full commercial story: Upload → Photo Quality → Boundary Tracing → Polygon → AI Nesting → Marker Efficiency → Fabric Saving → ROI.",

    startAgain: "Run Full Demo Again",
    viewRoi: "Review ROI",
    viewSaving: "Review Fabric Saving",

    pilotComplete: "RC1 MINI PILOT COMPLETE",
    pilotCompleteText:
      "OptiFabric AI now has a connected commercial demonstration suitable for factory owners, BGMEA representatives, investors and garment-manufacturing professionals.",

    validationEfficiency:
      "AI-improved efficiency must be higher than current efficiency.",
    validationQuantity:
      "Order quantity and marker length must be greater than zero.",
  },

  bn: {
    block: "RC1 মিনি পাইলট · ব্লক ০২০",
    title: "সম্পূর্ণ পাইলট ফলাফল",
    subtitle:
      "প্যাটার্ন আপলোড থেকে কাপড় সাশ্রয় ও বিনিয়োগের রিটার্ন পর্যন্ত OptiFabric AI-এর সম্পূর্ণ বাণিজ্যিক যাত্রা এখন সংযুক্ত।",
    languageButton: "English",

    back: "ROI-তে ফিরে যান",
    restart: "পাইলট আবার শুরু করুন",
    home: "OptiFabric হোম",

    statusCommercialReady: "বাণিজ্যিক প্রদর্শনীর জন্য প্রস্তুত",
    statusPilotReady: "কারখানা পাইলটের জন্য প্রস্তুত",
    statusReviewRequired: "ইঞ্জিনিয়ারিং পর্যালোচনা প্রয়োজন",

    executiveTitle: "নির্বাহী পাইলট সারসংক্ষেপ",
    executiveSummary:
      "OptiFabric AI একটি কাটিং মাস্টার বা উৎপাদন কর্মকর্তাকে উন্নত CAD অভিজ্ঞতা ছাড়াই প্যাটার্ন ছবি থেকে সহজ মার্কার, কাপড় সাশ্রয়ের হিসাব এবং বাণিজ্যিক ROI পর্যন্ত পৌঁছাতে সহায়তা করে।",

    workflowTitle: "সম্পূর্ণ এআই কার্যপ্রবাহ",
    workflowSubtitle:
      "দর্শনার্থীরা এখন আপলোড থেকে ROI পর্যন্ত সম্পূর্ণ বাণিজ্যিক পাইলট ব্যবহার করতে পারবেন।",
    completed: "সম্পন্ন",
    review: "ধাপ খুলুন",

    stepUpload: "প্যাটার্ন আপলোড",
    stepUploadDescription:
      "ব্যবহারকারী সহজ নির্দেশিত প্রক্রিয়ায় প্যাটার্নের ছবি বা ডকুমেন্ট আপলোড করেন।",

    stepPhoto: "ছবির মান বুদ্ধিমত্তা",
    stepPhotoDescription:
      "এআই ট্রেসিংয়ের জন্য ছবিটি যথেষ্ট পরিষ্কার কি না পরীক্ষা করে এবং উন্নতির নির্দেশনা দেয়।",

    stepTrace: "সীমানা ট্রেসিং",
    stepTraceDescription:
      "CAD জ্ঞান ছাড়াই ব্যবহারকারী প্যাটার্নের সীমানা চিহ্নিত করেন।",

    stepPolygon: "এআই পলিগন নির্মাণ",
    stepPolygonDescription:
      "ট্রেস করা পয়েন্টগুলোকে ইঞ্জিনিয়ারিং-উপযোগী ডিজিটাল আকারে রূপান্তর করা হয়।",

    stepNesting: "এআই নেস্টিং",
    stepNestingDescription:
      "উপলভ্য কাপড়ের প্রস্থে প্যাটার্ন কীভাবে সাজানো যায় তা এআই প্রদর্শন করে।",

    stepEfficiency: "মার্কার দক্ষতা",
    stepEfficiencyDescription:
      "সিস্টেম কার্যকর ক্ষেত্রফল, অপচয় এবং মার্কার দক্ষতা হিসাব করে।",

    stepSaving: "কাপড় সাশ্রয়",
    stepSavingDescription:
      "দক্ষতার উন্নতিকে আনুমানিক কাপড়ের মিটার ও আর্থিক সাশ্রয়ে রূপান্তর করা হয়।",

    stepRoi: "বাণিজ্যিক ROI",
    stepRoiDescription:
      "সাশ্রয়কে বার্ষিক সুবিধা, বিনিয়োগ ফেরতের সময় ও ROI-তে রূপান্তর করা হয়।",

    headlineTitle: "বাণিজ্যিক পাইলটের প্রধান ফলাফল",
    markerEfficiency: "বর্তমান দক্ষতা",
    improvedEfficiency: "এআই উন্নত দক্ষতা",
    efficiencyGain: "দক্ষতার উন্নতি",
    fabricSaved: "আনুমানিক কাপড় সাশ্রয়",
    financialSaving: "আনুমানিক অর্ডার সাশ্রয়",
    firstYearRoi: "প্রথম বছরের ROI",
    paybackPeriod: "বিনিয়োগ ফেরতের সময়",
    annualNetBenefit: "বার্ষিক নিট সুবিধা",

    metres: "মিটার",
    months: "মাস",

    assumptionsTitle: "পাইলট ফলাফলের তথ্য",
    currentEfficiency: "বর্তমান মার্কার দক্ষতা",
    targetEfficiency: "এআই উন্নত দক্ষতা",
    orderQuantity: "উৎপাদন অর্ডারের পরিমাণ",
    markerLength: "বর্তমান মার্কারের দৈর্ঘ্য",
    fabricCost: "প্রতি মিটার কাপড়ের মূল্য",
    savingPerOrder: "প্রতি অর্ডারে আনুমানিক সাশ্রয়",
    ordersPerMonth: "প্রতি মাসে বিশ্লেষিত অর্ডার",
    monthlySubscription: "মাসিক সাবস্ক্রিপশন",
    currency: "মুদ্রা",

    calculate: "পাইলট ফলাফল আপডেট করুন",
    reset: "প্রদর্শনী রিসেট করুন",

    whyTitle: "এআই কেন এই তথ্য চায়?",
    whyEfficiency:
      "কাপড় ব্যবহার কতটা কমতে পারে তা হিসাব করতে এআই বর্তমান ও উন্নত দক্ষতা তুলনা করে।",
    whyQuantity:
      "সামান্য দক্ষতার উন্নতি বাণিজ্যিকভাবে কত বড় সাশ্রয় তৈরি করবে তা অর্ডারের পরিমাণ নির্ধারণ করে।",
    whyMarker:
      "অপ্টিমাইজেশনের আগে ও পরে কাপড় ব্যবহারের হিসাবের জন্য মার্কারের দৈর্ঘ্য প্রয়োজন।",
    whyFabricCost:
      "কাপড়ের মূল্য সাশ্রয় হওয়া মিটারকে আর্থিক মূল্যে রূপান্তর করে।",
    whyOrderSaving:
      "প্রতি অর্ডারের সাশ্রয় থেকে মাসিক ও বার্ষিক বাণিজ্যিক সুবিধা হিসাব করা হয়।",
    whySubscription:
      "ROI স্বচ্ছ ও বাস্তবসম্মত রাখতে সফটওয়্যারের খরচ অন্তর্ভুক্ত করা হয়।",

    aiVerdictTitle: "এআই বাণিজ্যিক সিদ্ধান্ত",
    verdictCommercialReady:
      "প্রদর্শনীটি শক্তিশালী বাণিজ্যিক সম্ভাবনা দেখাচ্ছে। পরবর্তী ধাপ হলো বাস্তব প্যাটার্ন পলিগন ও কারখানার উৎপাদন তথ্য দিয়ে ফলাফল যাচাই করা।",
    verdictPilotReady:
      "ফলাফল ইতিবাচক এবং নিয়ন্ত্রিত কারখানা পাইলটের জন্য উপযুক্ত। বড় পরিসরে ব্যবহারের আগে আরও বাস্তব মার্কার পরীক্ষা করা উচিত।",
    verdictReviewRequired:
      "বর্তমান তথ্য এখনও শক্তিশালী বাণিজ্যিক ফলাফল দিচ্ছে না। মার্কার দক্ষতা, অর্ডারের পরিমাণ, কাপড়ের মূল্য ও প্রত্যাশিত ব্যবহার পুনরায় পরীক্ষা করুন।",

    benefitsTitle: "পাইলট কী প্রদর্শন করে",
    benefitOneTitle: "CAD অভিজ্ঞতা প্রয়োজন নেই",
    benefitOneText:
      "জটিল CAD পরিচালনার পরিবর্তে ব্যবহারকারী নির্দেশিত ভিজ্যুয়াল প্রক্রিয়া অনুসরণ করেন।",

    benefitTwoTitle: "ইঞ্জিনিয়ারিং ব্যাখ্যা",
    benefitTwoText:
      "প্রতিটি ইনপুটের সঙ্গে এআই কেন তথ্যটি চায় তার সহজ ব্যাখ্যা দেওয়া হয়।",

    benefitThreeTitle: "বাণিজ্যিক দৃশ্যমানতা",
    benefitThreeText:
      "মার্কার উন্নতিকে কাপড়ের মিটার, অর্থ ও ROI-তে রূপান্তর করা হয়।",

    benefitFourTitle: "ইংরেজি ও বাংলা নির্দেশনা",
    benefitFourText:
      "কাটিং টিম ও সিদ্ধান্ত গ্রহণকারীরা সহজ ভাষায় কার্যপ্রবাহ বুঝতে পারেন।",

    userTitle: "প্রতিটি ব্যবহারকারীর জন্য মূল্য",
    cuttingMaster: "কাটিং মাস্টার",
    cuttingMasterText:
      "ট্রেসিং, নেস্টিং ও মার্কার উন্নতির জন্য সহজ নির্দেশিত প্রক্রিয়া পান।",

    productionOfficer: "উৎপাদন কর্মকর্তা",
    productionOfficerText:
      "দক্ষতা, অপচয় ও কাপড় ব্যবহারের পরিমাপযোগ্য তথ্য পান।",

    factoryOwner: "কারখানা মালিক",
    factoryOwnerText:
      "আনুমানিক সাশ্রয়, বিনিয়োগ ফেরতের সময় ও বার্ষিক আর্থিক সুবিধা দেখতে পান।",

    bgmeaInvestor: "BGMEA, ক্রেতা বা বিনিয়োগকারী",
    bgmeaInvestorText:
      "উন্নত CAD বিশেষজ্ঞ রাখতে না পারা কারখানার জন্য একটি সম্প্রসারণযোগ্য বাণিজ্যিক সমাধান দেখতে পান।",

    commercialTitle: "প্রস্তাবিত কারখানা পাইলট",
    commercialOne:
      "ভিন্ন জটিলতার প্যাটার্নসহ তিনটি পোশাক স্টাইল নির্বাচন করুন।",
    commercialTwo:
      "বর্তমান অনুমোদিত মার্কার দক্ষতা ও কাপড় ব্যবহার সংরক্ষণ করুন।",
    commercialThree:
      "একই স্টাইল OptiFabric AI-এর মাধ্যমে চালিয়ে ফলাফল তুলনা করুন।",
    commercialFour:
      "ইঞ্জিনিয়ারিং ও উৎপাদন যাচাইয়ের পরই বড় পরিসরে ব্যবহার অনুমোদন করুন।",

    controlsTitle: "উৎপাদন নিয়ন্ত্রণ",
    controlOne:
      "গ্রেইন লাইন, ন্যাপের দিক, চেক, স্ট্রাইপ বা প্রিন্টের দিক লঙ্ঘন করা যাবে না।",
    controlTwo:
      "ক্রেতার নির্দেশনা, কাটিং টলারেন্স ও শেড গ্রুপিং বজায় রাখতে হবে।",
    controlThree:
      "বাল্ক কাটিংয়ের আগে নমুনা লেতে এআই পরামর্শ যাচাই করতে হবে।",
    controlFour:
      "বাণিজ্যিক উৎপাদন হিসাবের জন্য সঠিক ট্রেস করা পলিগন ব্যবহার করতে হবে।",

    disclaimerTitle: "বাণিজ্যিক ও ইঞ্জিনিয়ারিং ঘোষণা",
    disclaimerText:
      "এই RC1 মিনি পাইলট একটি বাণিজ্যিক প্রদর্শনী। হিসাব করা সাশ্রয় ব্যবহারকারীর দেওয়া তথ্যের ভিত্তিতে আনুমানিক। উৎপাদন অনুমোদন সঠিক প্যাটার্ন জ্যামিতি, কাপড়ের বৈশিষ্ট্য, ক্রেতার নির্দেশনা এবং কারখানার যাচাইয়ের ওপর নির্ভর করবে।",

    callToActionTitle: "RC1 মিনি পাইলট যাত্রা সম্পন্ন",
    callToActionText:
      "দর্শনার্থীরা এখন সম্পূর্ণ বাণিজ্যিক কার্যপ্রবাহ ব্যবহার করতে পারবেন: আপলোড → ছবির মান → সীমানা ট্রেসিং → পলিগন → এআই নেস্টিং → মার্কার দক্ষতা → কাপড় সাশ্রয় → ROI।",

    startAgain: "সম্পূর্ণ ডেমো আবার চালান",
    viewRoi: "ROI দেখুন",
    viewSaving: "কাপড় সাশ্রয় দেখুন",

    pilotComplete: "RC1 মিনি পাইলট সম্পন্ন",
    pilotCompleteText:
      "OptiFabric AI এখন কারখানা মালিক, BGMEA প্রতিনিধি, বিনিয়োগকারী ও পোশাক উৎপাদন পেশাজীবীদের জন্য একটি সংযুক্ত বাণিজ্যিক প্রদর্শনী।",

    validationEfficiency:
      "এআই উন্নত দক্ষতা বর্তমান দক্ষতার চেয়ে বেশি হতে হবে।",
    validationQuantity:
      "অর্ডারের পরিমাণ ও মার্কারের দৈর্ঘ্য শূন্যের বেশি হতে হবে।",
  },
};

export default function PilotResultPage() {
  const [language, setLanguage] = useState<Language>("en");

  const [currentEfficiency, setCurrentEfficiency] = useState(72);
  const [improvedEfficiency, setImprovedEfficiency] = useState(82);
  const [orderQuantity, setOrderQuantity] = useState(10000);
  const [markerLength, setMarkerLength] = useState(2.65);
  const [fabricCost, setFabricCost] = useState(4.5);

  const [savingPerOrder, setSavingPerOrder] = useState(1500);
  const [ordersPerMonth, setOrdersPerMonth] = useState(8);
  const [monthlySubscription, setMonthlySubscription] =
    useState(299);

  const [currency, setCurrency] = useState("£");
  const [calculated, setCalculated] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  const t = translations[language];

  const result = useMemo(() => {
    const safeCurrentEfficiency = Math.max(
      1,
      Math.min(100, currentEfficiency)
    );

    const safeImprovedEfficiency = Math.max(
      1,
      Math.min(100, improvedEfficiency)
    );

    const safeOrderQuantity = Math.max(0, orderQuantity);
    const safeMarkerLength = Math.max(0, markerLength);
    const safeFabricCost = Math.max(0, fabricCost);

    const garmentsPerMarker = 8;

    const markersRequired = Math.ceil(
      safeOrderQuantity / garmentsPerMarker
    );

    const currentFabricConsumption =
      markersRequired * safeMarkerLength;

    const improvedMarkerLength =
      safeMarkerLength *
      (safeCurrentEfficiency / safeImprovedEfficiency);

    const improvedFabricConsumption =
      markersRequired * improvedMarkerLength;

    const fabricSaved = Math.max(
      0,
      currentFabricConsumption - improvedFabricConsumption
    );

    const calculatedOrderSaving =
      fabricSaved * safeFabricCost;

    const effectiveSavingPerOrder =
      savingPerOrder > 0 ? savingPerOrder : calculatedOrderSaving;

    const monthlyGrossSaving =
      effectiveSavingPerOrder * Math.max(0, ordersPerMonth);

    const annualGrossSaving = monthlyGrossSaving * 12;

    const annualSubscription =
      Math.max(0, monthlySubscription) * 12;

    const setupAndTrainingCost = 1500;

    const firstYearCost =
      annualSubscription + setupAndTrainingCost;

    const firstYearNetBenefit =
      annualGrossSaving - firstYearCost;

    const firstYearRoi =
      firstYearCost > 0
        ? (firstYearNetBenefit / firstYearCost) * 100
        : 0;

    const monthlyNetBenefit =
      monthlyGrossSaving - Math.max(0, monthlySubscription);

    const paybackPeriod =
      monthlyNetBenefit > 0
        ? setupAndTrainingCost / monthlyNetBenefit
        : 0;

    const annualNetBenefit =
      annualGrossSaving - annualSubscription;

    const efficiencyGain = Math.max(
      0,
      safeImprovedEfficiency - safeCurrentEfficiency
    );

    let status: PilotStatus = "review-required";

    if (
      efficiencyGain >= 5 &&
      firstYearRoi >= 200 &&
      paybackPeriod <= 6
    ) {
      status = "commercial-ready";
    } else if (
      efficiencyGain > 0 &&
      firstYearNetBenefit > 0
    ) {
      status = "pilot-ready";
    }

    return {
      markersRequired,
      currentFabricConsumption,
      improvedFabricConsumption,
      fabricSaved,
      calculatedOrderSaving,
      effectiveSavingPerOrder,
      efficiencyGain,
      monthlyGrossSaving,
      annualGrossSaving,
      firstYearCost,
      firstYearNetBenefit,
      firstYearRoi,
      paybackPeriod,
      annualNetBenefit,
      status,
    };
  }, [
    currentEfficiency,
    improvedEfficiency,
    orderQuantity,
    markerLength,
    fabricCost,
    savingPerOrder,
    ordersPerMonth,
    monthlySubscription,
  ]);

  const workflowSteps: WorkflowStep[] = [
    {
      number: "01",
      title: t.stepUpload,
      description: t.stepUploadDescription,
      href: "/optifabric/demo/upload",
      status: "completed",
    },
    {
      number: "02",
      title: t.stepPhoto,
      description: t.stepPhotoDescription,
      href: "/optifabric/demo/photo-quality",
      status: "completed",
    },
    {
      number: "03",
      title: t.stepTrace,
      description: t.stepTraceDescription,
      href: "/optifabric/demo/live-tracing",
      status: "completed",
    },
    {
      number: "04",
      title: t.stepPolygon,
      description: t.stepPolygonDescription,
      href: "/optifabric/demo/ai-polygon",
      status: "completed",
    },
    {
      number: "05",
      title: t.stepNesting,
      description: t.stepNestingDescription,
      href: "/optifabric/demo/ai-nesting",
      status: "completed",
    },
    {
      number: "06",
      title: t.stepEfficiency,
      description: t.stepEfficiencyDescription,
      href: "/optifabric/demo/marker-efficiency",
      status: "completed",
    },
    {
      number: "07",
      title: t.stepSaving,
      description: t.stepSavingDescription,
      href: "/optifabric/demo/fabric-saving",
      status: "completed",
    },
    {
      number: "08",
      title: t.stepRoi,
      description: t.stepRoiDescription,
      href: "/optifabric/demo/roi",
      status: "completed",
    },
  ];

  const statusText: Record<PilotStatus, string> = {
    "commercial-ready": t.statusCommercialReady,
    "pilot-ready": t.statusPilotReady,
    "review-required": t.statusReviewRequired,
  };

  const verdictText: Record<PilotStatus, string> = {
    "commercial-ready": t.verdictCommercialReady,
    "pilot-ready": t.verdictPilotReady,
    "review-required": t.verdictReviewRequired,
  };

  function handleCalculate() {
    if (improvedEfficiency <= currentEfficiency) {
      setValidationMessage(t.validationEfficiency);
      setCalculated(false);
      return;
    }

    if (orderQuantity <= 0 || markerLength <= 0) {
      setValidationMessage(t.validationQuantity);
      setCalculated(false);
      return;
    }

    setValidationMessage("");
    setCalculated(true);
  }

  function handleReset() {
    setCurrentEfficiency(72);
    setImprovedEfficiency(82);
    setOrderQuantity(10000);
    setMarkerLength(2.65);
    setFabricCost(4.5);
    setSavingPerOrder(1500);
    setOrdersPerMonth(8);
    setMonthlySubscription(299);
    setCurrency("£");
    setCalculated(true);
    setValidationMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 shadow-2xl">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                  {t.block}
                </p>

                <h1 className="text-3xl font-black sm:text-5xl">
                  {t.title}
                </h1>

                <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-xl">
                  {t.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setLanguage((current) =>
                    current === "en" ? "bn" : "en"
                  )
                }
                className="w-fit rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                {t.languageButton}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/optifabric/demo/roi"
                className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
              >
                ← {t.back}
              </Link>

              <Link
                href="/optifabric/demo"
                className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.restart} →
              </Link>

              <Link
                href="/optifabric"
                className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                {t.home}
              </Link>
            </div>
          </div>

          <div className="border-t border-cyan-400/20 bg-cyan-400/10 px-6 py-5 sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  {t.pilotComplete}
                </p>

                <p className="mt-2 max-w-4xl leading-7 text-cyan-50">
                  {t.pilotCompleteText}
                </p>
              </div>

              <StatusBadge
                status={result.status}
                text={statusText[result.status]}
              />
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h2 className="text-2xl font-black">
            {t.executiveTitle}
          </h2>

          <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-300">
            {t.executiveSummary}
          </p>
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-3xl font-black">{t.workflowTitle}</h2>

            <p className="mt-3 text-slate-400">
              {t.workflowSubtitle}
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step) => (
              <WorkflowCard
                key={step.number}
                step={step}
                completedText={t.completed}
                reviewText={t.review}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[390px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-2xl font-black">
                {t.assumptionsTitle}
              </h2>

              <div className="mt-6 space-y-5">
                <NumberField
                  label={t.currentEfficiency}
                  value={currentEfficiency}
                  min={1}
                  max={99}
                  step={0.1}
                  unit="%"
                  onChange={setCurrentEfficiency}
                />

                <NumberField
                  label={t.targetEfficiency}
                  value={improvedEfficiency}
                  min={1}
                  max={100}
                  step={0.1}
                  unit="%"
                  onChange={setImprovedEfficiency}
                />

                <NumberField
                  label={t.orderQuantity}
                  value={orderQuantity}
                  min={1}
                  max={10000000}
                  step={1}
                  unit="pcs"
                  onChange={setOrderQuantity}
                />

                <NumberField
                  label={t.markerLength}
                  value={markerLength}
                  min={0.1}
                  max={1000}
                  step={0.01}
                  unit={t.metres}
                  onChange={setMarkerLength}
                />

                <NumberField
                  label={t.fabricCost}
                  value={fabricCost}
                  min={0}
                  max={10000}
                  step={0.01}
                  unit={`${currency}/${t.metres}`}
                  onChange={setFabricCost}
                />

                <NumberField
                  label={t.savingPerOrder}
                  value={savingPerOrder}
                  min={0}
                  max={10000000}
                  step={1}
                  unit={currency}
                  onChange={setSavingPerOrder}
                />

                <NumberField
                  label={t.ordersPerMonth}
                  value={ordersPerMonth}
                  min={1}
                  max={10000}
                  step={1}
                  onChange={setOrdersPerMonth}
                />

                <NumberField
                  label={t.monthlySubscription}
                  value={monthlySubscription}
                  min={0}
                  max={1000000}
                  step={1}
                  unit={`${currency}/month`}
                  onChange={setMonthlySubscription}
                />

                <label className="block">
                  <span className="mb-2 block font-semibold text-slate-200">
                    {t.currency}
                  </span>

                  <select
                    value={currency}
                    onChange={(event) =>
                      setCurrency(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-bold text-white outline-none focus:border-cyan-400"
                  >
                    <option value="£">£ GBP</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="৳">৳ BDT</option>
                  </select>
                </label>
              </div>

              {validationMessage && (
                <p className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold leading-6 text-rose-200">
                  {validationMessage}
                </p>
              )}

              <button
                type="button"
                onClick={handleCalculate}
                className="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-4 text-lg font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.calculate}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                {t.reset}
              </button>
            </section>

            <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
              <h2 className="text-xl font-black text-amber-200">
                {t.whyTitle}
              </h2>

              <div className="mt-4 space-y-4">
                <WhyItem
                  title={`${t.currentEfficiency} / ${t.targetEfficiency}`}
                  text={t.whyEfficiency}
                />

                <WhyItem
                  title={t.orderQuantity}
                  text={t.whyQuantity}
                />

                <WhyItem
                  title={t.markerLength}
                  text={t.whyMarker}
                />

                <WhyItem
                  title={t.fabricCost}
                  text={t.whyFabricCost}
                />

                <WhyItem
                  title={t.savingPerOrder}
                  text={t.whyOrderSaving}
                />

                <WhyItem
                  title={t.monthlySubscription}
                  text={t.whySubscription}
                />
              </div>
            </section>
          </aside>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {t.headlineTitle}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {calculated
                      ? verdictText[result.status]
                      : validationMessage}
                  </p>
                </div>

                {calculated && (
                  <StatusBadge
                    status={result.status}
                    text={statusText[result.status]}
                  />
                )}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label={t.markerEfficiency}
                  value={`${currentEfficiency.toFixed(1)}%`}
                  active={calculated}
                />

                <MetricCard
                  label={t.improvedEfficiency}
                  value={`${improvedEfficiency.toFixed(1)}%`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.efficiencyGain}
                  value={`${result.efficiencyGain.toFixed(1)}%`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.fabricSaved}
                  value={`${result.fabricSaved.toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2,
                    }
                  )} ${t.metres}`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.financialSaving}
                  value={formatMoney(
                    currency,
                    result.effectiveSavingPerOrder
                  )}
                  active={calculated}
                />

                <MetricCard
                  label={t.firstYearRoi}
                  value={`${result.firstYearRoi.toFixed(1)}%`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.paybackPeriod}
                  value={`${result.paybackPeriod.toFixed(1)} ${
                    t.months
                  }`}
                  active={calculated}
                />

                <MetricCard
                  label={t.annualNetBenefit}
                  value={formatMoney(
                    currency,
                    result.annualNetBenefit
                  )}
                  active={calculated}
                  highlight
                />
              </div>
            </section>

            <section
              className={`rounded-3xl border p-6 ${
                result.status === "commercial-ready"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : result.status === "pilot-ready"
                    ? "border-cyan-500/30 bg-cyan-500/10"
                    : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <h2 className="text-2xl font-black">
                {t.aiVerdictTitle}
              </h2>

              <p className="mt-4 max-w-5xl text-lg leading-8">
                {calculated
                  ? verdictText[result.status]
                  : validationMessage}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black">
                {t.benefitsTitle}
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <BenefitCard
                  number="01"
                  title={t.benefitOneTitle}
                  text={t.benefitOneText}
                />

                <BenefitCard
                  number="02"
                  title={t.benefitTwoTitle}
                  text={t.benefitTwoText}
                />

                <BenefitCard
                  number="03"
                  title={t.benefitThreeTitle}
                  text={t.benefitThreeText}
                />

                <BenefitCard
                  number="04"
                  title={t.benefitFourTitle}
                  text={t.benefitFourText}
                />
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black">{t.userTitle}</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <AudienceCard
                  title={t.cuttingMaster}
                  text={t.cuttingMasterText}
                />

                <AudienceCard
                  title={t.productionOfficer}
                  text={t.productionOfficerText}
                />

                <AudienceCard
                  title={t.factoryOwner}
                  text={t.factoryOwnerText}
                />

                <AudienceCard
                  title={t.bgmeaInvestor}
                  text={t.bgmeaInvestorText}
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6">
                <h2 className="text-2xl font-black text-violet-200">
                  {t.commercialTitle}
                </h2>

                <div className="mt-5 space-y-4">
                  <ChecklistItem
                    number="1"
                    text={t.commercialOne}
                    theme="violet"
                  />
                  <ChecklistItem
                    number="2"
                    text={t.commercialTwo}
                    theme="violet"
                  />
                  <ChecklistItem
                    number="3"
                    text={t.commercialThree}
                    theme="violet"
                  />
                  <ChecklistItem
                    number="4"
                    text={t.commercialFour}
                    theme="violet"
                  />
                </div>
              </article>

              <article className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
                <h2 className="text-2xl font-black text-rose-200">
                  {t.controlsTitle}
                </h2>

                <div className="mt-5 space-y-4">
                  <ChecklistItem
                    number="1"
                    text={t.controlOne}
                    theme="rose"
                  />
                  <ChecklistItem
                    number="2"
                    text={t.controlTwo}
                    theme="rose"
                  />
                  <ChecklistItem
                    number="3"
                    text={t.controlThree}
                    theme="rose"
                  />
                  <ChecklistItem
                    number="4"
                    text={t.controlFour}
                    theme="rose"
                  />
                </div>
              </article>
            </section>

            <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
              <h2 className="text-xl font-black text-amber-200">
                {t.disclaimerTitle}
              </h2>

              <p className="mt-4 leading-7 text-amber-50">
                {t.disclaimerText}
              </p>
            </section>

            <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                {t.pilotComplete}
              </p>

              <h2 className="mt-3 text-3xl font-black">
                {t.callToActionTitle}
              </h2>

              <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-300">
                {t.callToActionText}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/optifabric/demo"
                  className="rounded-2xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  {t.startAgain}
                </Link>

                <Link
                  href="/optifabric/demo/roi"
                  className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-6 py-4 font-bold text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {t.viewRoi}
                </Link>

                <Link
                  href="/optifabric/demo/fabric-saving"
                  className="rounded-2xl border border-slate-600 bg-slate-900 px-6 py-4 font-bold text-slate-200 transition hover:border-cyan-400"
                >
                  {t.viewSaving}
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkflowCard({
  step,
  completedText,
  reviewText,
}: {
  step: WorkflowStep;
  completedText: string;
  reviewText: string;
}) {
  return (
    <Link
      href={step.href}
      className="group rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-cyan-400/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
          {step.number}
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-300">
          {step.status === "completed"
            ? completedText
            : reviewText}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-black transition group-hover:text-cyan-300">
        {step.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {step.description}
      </p>

      <p className="mt-5 text-sm font-bold text-cyan-300">
        Open →
      </p>
    </Link>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
};

function NumberField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-slate-200">
        {label}
      </span>

      <div className="flex items-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            if (Number.isFinite(nextValue)) {
              onChange(nextValue);
            }
          }}
          className="w-full bg-transparent px-4 py-3 text-lg font-bold text-white outline-none"
        />

        {unit && (
          <span className="whitespace-nowrap border-l border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

function MetricCard({
  label,
  value,
  active,
  highlight = false,
}: {
  label: string;
  value: string;
  active: boolean;
  highlight?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-lg ${
        highlight
          ? "border-cyan-500/30 bg-cyan-500/10"
          : "border-slate-800 bg-slate-950"
      }`}
    >
      <p className="text-sm font-semibold text-slate-400">
        {label}
      </p>

      <p
        className={`mt-3 break-words text-3xl font-black ${
          active
            ? highlight
              ? "text-cyan-200"
              : "text-white"
            : "text-slate-600"
        }`}
      >
        {active ? value : "—"}
      </p>
    </article>
  );
}

function StatusBadge({
  status,
  text,
}: {
  status: PilotStatus;
  text: string;
}) {
  const styles: Record<PilotStatus, string> = {
    "commercial-ready":
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    "pilot-ready":
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
    "review-required":
      "border-rose-500/40 bg-rose-500/10 text-rose-200",
  };

  return (
    <div
      className={`w-fit rounded-full border px-4 py-2 text-sm font-black uppercase tracking-wide ${styles[status]}`}
    >
      {text}
    </div>
  );
}

function WhyItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-slate-950/30 p-4">
      <h3 className="font-bold text-amber-200">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-amber-50/90">
        {text}
      </p>
    </div>
  );
}

function BenefitCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 font-black text-blue-200">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{text}</p>
    </article>
  );
}

function AudienceCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-cyan-500/20 bg-cyan-950/30 p-5">
      <h3 className="text-xl font-black text-cyan-200">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-cyan-50/80">
        {text}
      </p>
    </article>
  );
}

function ChecklistItem({
  number,
  text,
  theme,
}: {
  number: string;
  text: string;
  theme: "violet" | "rose";
}) {
  const numberStyle =
    theme === "violet"
      ? "bg-violet-400 text-slate-950"
      : "bg-rose-400 text-slate-950";

  const borderStyle =
    theme === "violet"
      ? "border-violet-400/20"
      : "border-rose-400/20";

  return (
    <div
      className={`flex gap-3 rounded-2xl border bg-slate-950/30 p-4 ${borderStyle}`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${numberStyle}`}
      >
        {number}
      </div>

      <p className="text-sm leading-6 text-slate-100">
        {text}
      </p>
    </div>
  );
}

function formatMoney(currency: string, value: number) {
  return `${currency}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}