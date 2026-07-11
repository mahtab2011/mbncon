"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
import AIExplanationCard from "@/app/components/optifabric/AIExplanationCard";

type Language = "en" | "bn";
type RoiStatus = "excellent" | "strong" | "positive" | "review";

type Translation = {
  block: string;
  title: string;
  subtitle: string;
  languageButton: string;

  back: string;
  next: string;

  inputTitle: string;
  currency: string;
  savingPerOrder: string;
  ordersPerMonth: string;
  monthlySubscription: string;
  setupCost: string;
  trainingCost: string;
  otherAnnualCost: string;

  calculate: string;
  reset: string;

  whyTitle: string;
  whySaving: string;
  whyOrders: string;
  whySubscription: string;
  whySetup: string;
  whyTraining: string;
  whyOtherCost: string;

  dashboardTitle: string;
  waiting: string;
  completed: string;

  monthlyGrossSaving: string;
  annualGrossSaving: string;
  monthlyOperatingCost: string;
  annualOperatingCost: string;
  firstYearCost: string;
  annualNetBenefit: string;
  firstYearNetBenefit: string;
  threeYearNetBenefit: string;
  roi: string;
  firstYearRoi: string;
  paybackPeriod: string;
  benefitCostRatio: string;
  savingPerDay: string;

  months: string;
  years: string;

  statusExcellent: string;
  statusStrong: string;
  statusPositive: string;
  statusReview: string;

  coachTitle: string;
  coachExcellent: string;
  coachStrong: string;
  coachPositive: string;
  coachReview: string;

  comparisonTitle: string;
  currentCost: string;
  optifabricCost: string;
  netValue: string;

  recommendationTitle: string;
  recommendationOne: string;
  recommendationTwo: string;
  recommendationThree: string;
  recommendationFour: string;

  salesTitle: string;
  salesText: string;

  safetyTitle: string;
  safetyText: string;

  demoNotice: string;
  nextTitle: string;

  validationSaving: string;
  validationOrders: string;
};

const translations: Record<Language, Translation> = {
  en: {
    block: "RC1 Mini Pilot · Block 019",
    title: "Commercial ROI Intelligence",
    subtitle:
      "OptiFabric AI converts estimated fabric savings into a simple commercial case showing annual benefit, payback period and return on investment.",
    languageButton: "বাংলা",

    back: "Back to Fabric Saving",
    next: "Continue to Pilot Result",

    inputTitle: "Commercial ROI Inputs",
    currency: "Currency",
    savingPerOrder: "Estimated saving per production order",
    ordersPerMonth: "Production orders analysed per month",
    monthlySubscription: "Monthly OptiFabric subscription",
    setupCost: "One-time setup cost",
    trainingCost: "One-time training cost",
    otherAnnualCost: "Other annual operating cost",

    calculate: "Calculate Commercial ROI",
    reset: "Reset Demo",

    whyTitle: "Why does AI ask for these inputs?",
    whySaving:
      "AI needs the estimated saving from one production order to calculate the total financial benefit created by marker improvement.",
    whyOrders:
      "The number of orders analysed each month determines how frequently the saving opportunity is repeated.",
    whySubscription:
      "The monthly subscription is included so the factory can compare the software cost against the value created.",
    whySetup:
      "Initial implementation or configuration costs must be included for a realistic first-year ROI calculation.",
    whyTraining:
      "Training cost is included because cutting masters and production officers may need guided onboarding.",
    whyOtherCost:
      "Any additional annual operating cost should be included so the ROI result remains transparent and credible.",

    dashboardTitle: "Commercial ROI Dashboard",
    waiting:
      "Enter the commercial assumptions and click Calculate Commercial ROI.",
    completed: "COMMERCIAL ROI ANALYSIS COMPLETE",

    monthlyGrossSaving: "Monthly gross saving",
    annualGrossSaving: "Annual gross saving",
    monthlyOperatingCost: "Monthly operating cost",
    annualOperatingCost: "Annual operating cost",
    firstYearCost: "Total first-year cost",
    annualNetBenefit: "Annual recurring net benefit",
    firstYearNetBenefit: "First-year net benefit",
    threeYearNetBenefit: "Estimated three-year net benefit",
    roi: "Recurring annual ROI",
    firstYearRoi: "First-year ROI",
    paybackPeriod: "Estimated payback period",
    benefitCostRatio: "Benefit-to-cost ratio",
    savingPerDay: "Average saving per working day",

    months: "months",
    years: "years",

    statusExcellent: "Exceptional Business Case",
    statusStrong: "Strong Business Case",
    statusPositive: "Positive Business Case",
    statusReview: "Review Assumptions",

    coachTitle: "AI Commercial Coach",
    coachExcellent:
      "The projected financial return is exceptional. Validate the saving assumptions through a controlled factory pilot and prepare the case for wider deployment.",
    coachStrong:
      "The projected return is commercially strong. Confirm the average saving across several real production orders before approving scale-up.",
    coachPositive:
      "The business case is positive. Additional marker volume or improved fabric saving could strengthen the return further.",
    coachReview:
      "The current assumptions do not yet create a strong commercial return. Review saving per order, monthly usage and implementation cost.",

    comparisonTitle: "Annual Value Comparison",
    currentCost: "Value without OptiFabric",
    optifabricCost: "OptiFabric annual cost",
    netValue: "Net value created",

    recommendationTitle: "AI Commercial Recommendations",
    recommendationOne:
      "Validate savings across at least three different garment styles before using the result for a full factory investment decision.",
    recommendationTwo:
      "Record approved marker efficiency before and after OptiFabric so the financial benefit can be independently verified.",
    recommendationThree:
      "Start with high-volume styles because small efficiency improvements create larger total savings.",
    recommendationFour:
      "Use factory-specific fabric prices, order quantities and marker results rather than general industry assumptions.",

    salesTitle: "BGMEA and Factory Owner Message",
    salesText:
      "OptiFabric does not require the user to become a CAD expert. It gives cutting teams a simple assisted workflow to identify avoidable fabric loss and understand the financial value of improvement.",

    safetyTitle: "Commercial Integrity",
    safetyText:
      "ROI is an estimate, not a guaranteed saving. Final results depend on fabric type, pattern complexity, order quantity, marker quality, operational discipline and production approval.",

    demoNotice:
      "This RC1 commercial demonstration uses user-entered assumptions. The production version will transfer verified fabric-saving results directly from the marker and nesting engines.",

    nextTitle: "Complete Pilot Result",

    validationSaving:
      "Estimated saving per order must be greater than zero.",
    validationOrders:
      "The number of production orders per month must be greater than zero.",
  },

  bn: {
    block: "RC1 মিনি পাইলট · ব্লক ০১৯",
    title: "বাণিজ্যিক ROI বুদ্ধিমত্তা",
    subtitle:
      "OptiFabric AI আনুমানিক কাপড় সাশ্রয়কে বার্ষিক লাভ, বিনিয়োগ ফেরতের সময় এবং ROI-সহ একটি সহজ বাণিজ্যিক বিশ্লেষণে রূপান্তর করে।",
    languageButton: "English",

    back: "কাপড় সাশ্রয়ে ফিরে যান",
    next: "পাইলট ফলাফলে যান",

    inputTitle: "বাণিজ্যিক ROI তথ্য",
    currency: "মুদ্রা",
    savingPerOrder: "প্রতি উৎপাদন অর্ডারে আনুমানিক সাশ্রয়",
    ordersPerMonth: "প্রতি মাসে বিশ্লেষণ করা উৎপাদন অর্ডার",
    monthlySubscription: "মাসিক OptiFabric সাবস্ক্রিপশন",
    setupCost: "এককালীন সেটআপ খরচ",
    trainingCost: "এককালীন প্রশিক্ষণ খরচ",
    otherAnnualCost: "অন্যান্য বার্ষিক পরিচালন খরচ",

    calculate: "বাণিজ্যিক ROI হিসাব করুন",
    reset: "ডেমো রিসেট করুন",

    whyTitle: "এআই কেন এই তথ্যগুলো চায়?",
    whySaving:
      "মার্কার উন্নয়নের মাধ্যমে মোট কত আর্থিক সুবিধা তৈরি হবে তা হিসাব করতে প্রতি অর্ডারের আনুমানিক সাশ্রয় প্রয়োজন।",
    whyOrders:
      "প্রতি মাসে কতবার সাশ্রয়ের সুযোগ তৈরি হবে তা উৎপাদন অর্ডারের সংখ্যা নির্ধারণ করে।",
    whySubscription:
      "সফটওয়্যারের খরচ ও তৈরি হওয়া আর্থিক সুবিধা তুলনা করার জন্য মাসিক সাবস্ক্রিপশন প্রয়োজন।",
    whySetup:
      "বাস্তবসম্মত প্রথম বছরের ROI হিসাবের জন্য প্রাথমিক বাস্তবায়ন বা কনফিগারেশন খরচ অন্তর্ভুক্ত করা হয়।",
    whyTraining:
      "কাটিং মাস্টার ও উৎপাদন কর্মকর্তাদের প্রাথমিক নির্দেশনা প্রয়োজন হতে পারে বলে প্রশিক্ষণ খরচ অন্তর্ভুক্ত করা হয়।",
    whyOtherCost:
      "ROI ফলাফল স্বচ্ছ ও বিশ্বাসযোগ্য রাখতে অন্যান্য বার্ষিক পরিচালন খরচও অন্তর্ভুক্ত করা উচিত।",

    dashboardTitle: "বাণিজ্যিক ROI ড্যাশবোর্ড",
    waiting:
      "বাণিজ্যিক তথ্য লিখে বাণিজ্যিক ROI হিসাব করুন বাটনে ক্লিক করুন।",
    completed: "বাণিজ্যিক ROI বিশ্লেষণ সম্পন্ন",

    monthlyGrossSaving: "মাসিক মোট সাশ্রয়",
    annualGrossSaving: "বার্ষিক মোট সাশ্রয়",
    monthlyOperatingCost: "মাসিক পরিচালন খরচ",
    annualOperatingCost: "বার্ষিক পরিচালন খরচ",
    firstYearCost: "প্রথম বছরের মোট খরচ",
    annualNetBenefit: "বার্ষিক পুনরাবৃত্ত নিট সুবিধা",
    firstYearNetBenefit: "প্রথম বছরের নিট সুবিধা",
    threeYearNetBenefit: "আনুমানিক তিন বছরের নিট সুবিধা",
    roi: "পুনরাবৃত্ত বার্ষিক ROI",
    firstYearRoi: "প্রথম বছরের ROI",
    paybackPeriod: "আনুমানিক বিনিয়োগ ফেরতের সময়",
    benefitCostRatio: "সুবিধা ও খরচের অনুপাত",
    savingPerDay: "প্রতি কার্যদিবসে গড় সাশ্রয়",

    months: "মাস",
    years: "বছর",

    statusExcellent: "অসাধারণ ব্যবসায়িক সম্ভাবনা",
    statusStrong: "শক্তিশালী ব্যবসায়িক সম্ভাবনা",
    statusPositive: "ইতিবাচক ব্যবসায়িক সম্ভাবনা",
    statusReview: "তথ্য পুনরায় পরীক্ষা করুন",

    coachTitle: "এআই বাণিজ্যিক কোচ",
    coachExcellent:
      "প্রত্যাশিত আর্থিক রিটার্ন অসাধারণ। নিয়ন্ত্রিত কারখানা পাইলটের মাধ্যমে সাশ্রয়ের তথ্য যাচাই করুন এবং বৃহত্তর বাস্তবায়নের প্রস্তুতি নিন।",
    coachStrong:
      "প্রত্যাশিত রিটার্ন বাণিজ্যিকভাবে শক্তিশালী। সম্প্রসারণের আগে কয়েকটি বাস্তব উৎপাদন অর্ডারের গড় সাশ্রয় নিশ্চিত করুন।",
    coachPositive:
      "ব্যবসায়িক সম্ভাবনা ইতিবাচক। আরও বেশি মার্কার ব্যবহার বা উন্নত কাপড় সাশ্রয় ROI আরও শক্তিশালী করতে পারে।",
    coachReview:
      "বর্তমান তথ্য এখনও শক্তিশালী বাণিজ্যিক রিটার্ন দেখাচ্ছে না। প্রতি অর্ডারের সাশ্রয়, মাসিক ব্যবহার এবং বাস্তবায়ন খরচ পুনরায় পরীক্ষা করুন।",

    comparisonTitle: "বার্ষিক মূল্য তুলনা",
    currentCost: "OptiFabric ছাড়া মূল্য",
    optifabricCost: "OptiFabric বার্ষিক খরচ",
    netValue: "তৈরি হওয়া নিট মূল্য",

    recommendationTitle: "এআই বাণিজ্যিক পরামর্শ",
    recommendationOne:
      "সম্পূর্ণ কারখানা বিনিয়োগ সিদ্ধান্তের আগে অন্তত তিনটি ভিন্ন পোশাক স্টাইলে সাশ্রয় যাচাই করুন।",
    recommendationTwo:
      "আর্থিক সুবিধা স্বাধীনভাবে যাচাই করার জন্য OptiFabric ব্যবহারের আগে ও পরে অনুমোদিত মার্কার দক্ষতা সংরক্ষণ করুন।",
    recommendationThree:
      "উচ্চ পরিমাণের স্টাইল দিয়ে শুরু করুন, কারণ সামান্য দক্ষতা উন্নতিও বড় মোট সাশ্রয় তৈরি করে।",
    recommendationFour:
      "সাধারণ শিল্প অনুমানের পরিবর্তে কারখানার নিজস্ব কাপড়ের মূল্য, অর্ডার পরিমাণ এবং মার্কার ফলাফল ব্যবহার করুন।",

    salesTitle: "BGMEA ও কারখানা মালিকদের জন্য বার্তা",
    salesText:
      "OptiFabric ব্যবহার করতে কাউকে CAD বিশেষজ্ঞ হতে হবে না। এটি কাটিং টিমকে সহজ সহায়ক প্রক্রিয়ার মাধ্যমে অপ্রয়োজনীয় কাপড় ক্ষতি শনাক্ত করতে এবং উন্নতির আর্থিক মূল্য বুঝতে সাহায্য করে।",

    safetyTitle: "বাণিজ্যিক সততা",
    safetyText:
      "ROI একটি আনুমানিক হিসাব, নিশ্চিত সাশ্রয় নয়। চূড়ান্ত ফলাফল কাপড়ের ধরন, প্যাটার্নের জটিলতা, অর্ডারের পরিমাণ, মার্কার মান, পরিচালন শৃঙ্খলা এবং উৎপাদন অনুমোদনের ওপর নির্ভর করে।",

    demoNotice:
      "এই RC1 বাণিজ্যিক প্রদর্শনী ব্যবহারকারীর দেওয়া তথ্য ব্যবহার করে। উৎপাদন সংস্করণ যাচাইকৃত কাপড় সাশ্রয়ের ফলাফল সরাসরি মার্কার ও নেস্টিং ইঞ্জিন থেকে গ্রহণ করবে।",

    nextTitle: "সম্পূর্ণ পাইলট ফলাফল",

    validationSaving:
      "প্রতি অর্ডারের আনুমানিক সাশ্রয় শূন্যের বেশি হতে হবে।",
    validationOrders:
      "প্রতি মাসে উৎপাদন অর্ডারের সংখ্যা শূন্যের বেশি হতে হবে।",
  },
};

export default function CommercialRoiPage() {
  const [language, setLanguage] = useState<Language>("en");

  const [currency, setCurrency] = useState("£");
  const [savingPerOrder, setSavingPerOrder] = useState(1500);
  const [ordersPerMonth, setOrdersPerMonth] = useState(8);
  const [monthlySubscription, setMonthlySubscription] =
    useState(299);
  const [setupCost, setSetupCost] = useState(1000);
  const [trainingCost, setTrainingCost] = useState(500);
  const [otherAnnualCost, setOtherAnnualCost] = useState(250);

  const [calculated, setCalculated] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const t = translations[language];

  const result = useMemo(() => {
    const safeSavingPerOrder = Math.max(0, savingPerOrder);
    const safeOrdersPerMonth = Math.max(
      0,
      Math.floor(ordersPerMonth)
    );
    const safeSubscription = Math.max(0, monthlySubscription);
    const safeSetupCost = Math.max(0, setupCost);
    const safeTrainingCost = Math.max(0, trainingCost);
    const safeOtherAnnualCost = Math.max(0, otherAnnualCost);

    const monthlyGrossSaving =
      safeSavingPerOrder * safeOrdersPerMonth;

    const annualGrossSaving = monthlyGrossSaving * 12;

    const monthlyOperatingCost = safeSubscription;

    const annualOperatingCost =
      safeSubscription * 12 + safeOtherAnnualCost;

    const firstYearCost =
      annualOperatingCost + safeSetupCost + safeTrainingCost;

    const annualNetBenefit =
      annualGrossSaving - annualOperatingCost;

    const firstYearNetBenefit =
      annualGrossSaving - firstYearCost;

    const threeYearGrossSaving = annualGrossSaving * 3;

    const threeYearCost =
      annualOperatingCost * 3 + safeSetupCost + safeTrainingCost;

    const threeYearNetBenefit =
      threeYearGrossSaving - threeYearCost;

    const recurringRoi =
      annualOperatingCost > 0
        ? (annualNetBenefit / annualOperatingCost) * 100
        : annualNetBenefit > 0
          ? 100
          : 0;

    const firstYearRoi =
      firstYearCost > 0
        ? (firstYearNetBenefit / firstYearCost) * 100
        : firstYearNetBenefit > 0
          ? 100
          : 0;

    const monthlyNetBenefit =
      monthlyGrossSaving - monthlyOperatingCost;

    const initialInvestment = safeSetupCost + safeTrainingCost;

    const paybackPeriod =
      monthlyNetBenefit > 0
        ? initialInvestment / monthlyNetBenefit
        : 0;

    const benefitCostRatio =
      firstYearCost > 0
        ? annualGrossSaving / firstYearCost
        : 0;

    const savingPerDay = annualNetBenefit / 260;

    let status: RoiStatus = "review";

    if (firstYearRoi >= 300 && paybackPeriod <= 3) {
      status = "excellent";
    } else if (firstYearRoi >= 150 && paybackPeriod <= 6) {
      status = "strong";
    } else if (firstYearRoi > 0) {
      status = "positive";
    }

    return {
      monthlyGrossSaving,
      annualGrossSaving,
      monthlyOperatingCost,
      annualOperatingCost,
      firstYearCost,
      annualNetBenefit,
      firstYearNetBenefit,
      threeYearNetBenefit,
      recurringRoi,
      firstYearRoi,
      paybackPeriod,
      benefitCostRatio,
      savingPerDay,
      status,
    };
  }, [
    savingPerOrder,
    ordersPerMonth,
    monthlySubscription,
    setupCost,
    trainingCost,
    otherAnnualCost,
  ]);

  const statusText: Record<RoiStatus, string> = {
    excellent: t.statusExcellent,
    strong: t.statusStrong,
    positive: t.statusPositive,
    review: t.statusReview,
  };

  const coachText: Record<RoiStatus, string> = {
    excellent: t.coachExcellent,
    strong: t.coachStrong,
    positive: t.coachPositive,
    review: t.coachReview,
  };

  function handleCalculate() {
    if (savingPerOrder <= 0) {
      setValidationMessage(t.validationSaving);
      setCalculated(false);
      return;
    }

    if (ordersPerMonth <= 0) {
      setValidationMessage(t.validationOrders);
      setCalculated(false);
      return;
    }

    setValidationMessage("");
    setCalculated(true);
  }

  function handleReset() {
    setCurrency("£");
    setSavingPerOrder(1500);
    setOrdersPerMonth(8);
    setMonthlySubscription(299);
    setSetupCost(1000);
    setTrainingCost(500);
    setOtherAnnualCost(250);
    setCalculated(false);
    setValidationMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress currentStep={6} />
        <header className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 shadow-2xl sm:p-10">
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
              href="/optifabric/demo/fabric-saving"
              className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
            >
              ← {t.back}
            </Link>

            <Link
              href="/optifabric/demo/pilot-result"
              className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              {t.next} →
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[390px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-2xl font-black">
                {t.inputTitle}
              </h2>

              <div className="mt-6 space-y-5">
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

                <NumberField
                  label={t.setupCost}
                  value={setupCost}
                  min={0}
                  max={10000000}
                  step={1}
                  unit={currency}
                  onChange={setSetupCost}
                />

                <NumberField
                  label={t.trainingCost}
                  value={trainingCost}
                  min={0}
                  max={10000000}
                  step={1}
                  unit={currency}
                  onChange={setTrainingCost}
                />

                <NumberField
                  label={t.otherAnnualCost}
                  value={otherAnnualCost}
                  min={0}
                  max={10000000}
                  step={1}
                  unit={`${currency}/year`}
                  onChange={setOtherAnnualCost}
                />
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
                  title={t.savingPerOrder}
                  text={t.whySaving}
                />
                <WhyItem
                  title={t.ordersPerMonth}
                  text={t.whyOrders}
                />
                <WhyItem
                  title={t.monthlySubscription}
                  text={t.whySubscription}
                />
                <WhyItem title={t.setupCost} text={t.whySetup} />
                <WhyItem
                  title={t.trainingCost}
                  text={t.whyTraining}
                />
                <WhyItem
                  title={t.otherAnnualCost}
                  text={t.whyOtherCost}
                />
              </div>
            </section>
          </aside>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {t.dashboardTitle}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {calculated
                      ? coachText[result.status]
                      : t.waiting}
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
                  label={t.annualGrossSaving}
                  value={formatMoney(
                    currency,
                    result.annualGrossSaving
                  )}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.firstYearNetBenefit}
                  value={formatMoney(
                    currency,
                    result.firstYearNetBenefit
                  )}
                  active={calculated}
                  highlight
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
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label={t.monthlyGrossSaving}
                value={formatMoney(
                  currency,
                  result.monthlyGrossSaving
                )}
                active={calculated}
              />

              <MetricCard
                label={t.annualOperatingCost}
                value={formatMoney(
                  currency,
                  result.annualOperatingCost
                )}
                active={calculated}
              />

              <MetricCard
                label={t.firstYearCost}
                value={formatMoney(
                  currency,
                  result.firstYearCost
                )}
                active={calculated}
              />

              <MetricCard
                label={t.annualNetBenefit}
                value={formatMoney(
                  currency,
                  result.annualNetBenefit
                )}
                active={calculated}
              />

              <MetricCard
                label={t.threeYearNetBenefit}
                value={formatMoney(
                  currency,
                  result.threeYearNetBenefit
                )}
                active={calculated}
              />

              <MetricCard
                label={t.roi}
                value={`${result.recurringRoi.toFixed(1)}%`}
                active={calculated}
              />

              <MetricCard
                label={t.benefitCostRatio}
                value={`${result.benefitCostRatio.toFixed(2)} : 1`}
                active={calculated}
              />

              <MetricCard
                label={t.savingPerDay}
                value={formatMoney(currency, result.savingPerDay)}
                active={calculated}
              />

              <MetricCard
                label={t.monthlyOperatingCost}
                value={formatMoney(
                  currency,
                  result.monthlyOperatingCost
                )}
                active={calculated}
              />
            </section>

            <section className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6">
              <h2 className="text-xl font-black text-blue-200">
                {t.comparisonTitle}
              </h2>

              <div className="mt-6 space-y-5">
                <ComparisonBar
                  label={t.currentCost}
                  value={result.annualGrossSaving}
                  maximum={Math.max(
                    result.annualGrossSaving,
                    result.annualOperatingCost,
                    result.annualNetBenefit,
                    1
                  )}
                  currency={currency}
                  active={calculated}
                  type="gross"
                />

                <ComparisonBar
                  label={t.optifabricCost}
                  value={result.annualOperatingCost}
                  maximum={Math.max(
                    result.annualGrossSaving,
                    result.annualOperatingCost,
                    result.annualNetBenefit,
                    1
                  )}
                  currency={currency}
                  active={calculated}
                  type="cost"
                />

                <ComparisonBar
                  label={t.netValue}
                  value={Math.max(0, result.annualNetBenefit)}
                  maximum={Math.max(
                    result.annualGrossSaving,
                    result.annualOperatingCost,
                    result.annualNetBenefit,
                    1
                  )}
                  currency={currency}
                  active={calculated}
                  type="net"
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <h2 className="text-xl font-black text-emerald-200">
                  {t.coachTitle}
                </h2>

                <p className="mt-4 leading-7 text-emerald-50">
                  {calculated
                    ? coachText[result.status]
                    : t.waiting}
                </p>

                {calculated && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SmallResult
                      label={t.savingPerOrder}
                      value={formatMoney(currency, savingPerOrder)}
                    />

                    <SmallResult
                      label={t.ordersPerMonth}
                      value={`${ordersPerMonth}`}
                    />

                    <SmallResult
                      label={t.firstYearRoi}
                      value={`${result.firstYearRoi.toFixed(1)}%`}
                    />

                    <SmallResult
                      label={t.paybackPeriod}
                      value={`${result.paybackPeriod.toFixed(1)} ${
                        t.months
                      }`}
                    />
                  </div>
                )}
              </article>

              <article className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6">
                <h2 className="text-xl font-black text-violet-200">
                  {t.recommendationTitle}
                </h2>

                <div className="mt-4 space-y-3">
                  <Recommendation text={t.recommendationOne} />
                  <Recommendation text={t.recommendationTwo} />
                  <Recommendation text={t.recommendationThree} />
                  <Recommendation text={t.recommendationFour} />
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-6">
                <h2 className="text-xl font-black text-cyan-200">
                  {t.salesTitle}
                </h2>

                <p className="mt-4 leading-7 text-cyan-50">
                  {t.salesText}
                </p>
              </article>

              <article className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
                <h2 className="text-xl font-black text-rose-200">
                  {t.safetyTitle}
                </h2>

                <p className="mt-4 leading-7 text-rose-50">
                  {t.safetyText}
                </p>
              </article>
            </section>

            <p className="rounded-3xl border border-cyan-500/20 bg-cyan-950/40 p-5 text-sm leading-6 text-cyan-100">
              {t.demoNotice}
            </p>

            <section className="flex flex-col gap-4 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 to-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                  Next Pilot Step
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {t.nextTitle}
                </h2>
              </div>

              <Link
                href="/optifabric/demo/pilot-result"
                className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.next} →
              </Link>
            </section>
          </div>
        </section>
        <div className="mt-8">
  <AIExplanationCard
    title="Commercial ROI Intelligence"
    titleBn="বাণিজ্যিক ROI বিশ্লেষণ"

    purpose="Calculate the commercial return created by fabric savings, waste reduction and improved cutting efficiency."

    purposeBn="কাপড় সাশ্রয়, অপচয় হ্রাস এবং উন্নত কাটিং দক্ষতা থেকে সৃষ্ট বাণিজ্যিক লাভ নির্ণয় করা।"

    why="AI combines fabric cost, production volume and estimated savings to show the financial value of using OptiFabric AI."

    whyBn="AI কাপড়ের মূল্য, উৎপাদনের পরিমাণ এবং সম্ভাব্য সাশ্রয়ের তথ্য একত্র করে OptiFabric AI ব্যবহারের আর্থিক মূল্য দেখায়।"

    bestPractice="Use realistic annual production volume, verified fabric cost and confirmed saving percentages."

    bestPracticeBn="বাস্তবসম্মত বার্ষিক উৎপাদন পরিমাণ, যাচাইকৃত কাপড়ের মূল্য এবং নিশ্চিত সাশ্রয়ের হার ব্যবহার করুন।"

    commonMistake="Entering exaggerated production figures or unverified fabric prices, which may overstate the expected ROI."

    commonMistakeBn="অতিরঞ্জিত উৎপাদন পরিমাণ বা যাচাই না করা কাপড়ের মূল্য ব্যবহার করা, যার ফলে প্রত্যাশিত ROI অতিরিক্ত দেখাতে পারে।"
  />
</div>
      </div>
    </main>
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
          : "border-slate-800 bg-slate-900"
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
  status: RoiStatus;
  text: string;
}) {
  const styles: Record<RoiStatus, string> = {
    excellent:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    strong:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
    positive:
      "border-amber-500/40 bg-amber-500/10 text-amber-200",
    review:
      "border-rose-500/40 bg-rose-500/10 text-rose-200",
  };

  return (
    <div
      className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-wide ${styles[status]}`}
    >
      {text}
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  maximum,
  currency,
  active,
  type,
}: {
  label: string;
  value: number;
  maximum: number;
  currency: string;
  active: boolean;
  type: "gross" | "cost" | "net";
}) {
  const width = active
    ? Math.max(0, Math.min(100, (value / maximum) * 100))
    : 0;

  const barStyle = {
    gross: "bg-cyan-400",
    cost: "bg-rose-400",
    net: "bg-emerald-400",
  }[type];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-blue-50">
          {label}
        </span>

        <span className="text-sm font-black text-white">
          {active ? formatMoney(currency, value) : "—"}
        </span>
      </div>

      <div className="h-7 overflow-hidden rounded-full bg-slate-950">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barStyle}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function Recommendation({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-violet-400/20 bg-slate-950/30 p-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-400 font-black text-slate-950">
        ✓
      </div>

      <p className="text-sm leading-6 text-violet-50">{text}</p>
    </div>
  );
}

function SmallResult({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-slate-950/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/70">
        {label}
      </p>

      <p className="mt-2 break-words text-xl font-black text-white">
        {value}
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