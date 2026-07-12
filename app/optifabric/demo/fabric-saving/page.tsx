"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
import AIExplanationCard from "@/app/components/optifabric/AIExplanationCard";
import CommercialFooter from "@/app/components/optifabric/CommercialFooter";

type Language = "en" | "bn";

type SavingStatus =
  | "excellent"
  | "strong"
  | "moderate"
  | "low";

type Translation = {
  block: string;
  title: string;
  subtitle: string;
  languageButton: string;
  back: string;
  next: string;
  inputTitle: string;
  currentEfficiency: string;
  improvedEfficiency: string;
  orderQuantity: string;
  garmentsPerMarker: string;
  currentMarkerLength: string;
  fabricCost: string;
  currency: string;
  calculate: string;
  reset: string;
  whyTitle: string;
  whyCurrentEfficiency: string;
  whyImprovedEfficiency: string;
  whyOrderQuantity: string;
  whyGarmentsPerMarker: string;
  whyMarkerLength: string;
  whyFabricCost: string;
  dashboardTitle: string;
  waiting: string;
  completed: string;
  efficiencyImprovement: string;
  markersRequired: string;
  currentFabricConsumption: string;
  improvedFabricConsumption: string;
  fabricSaved: string;
  savingPerMarker: string;
  currentFabricCost: string;
  improvedFabricCost: string;
  totalFinancialSaving: string;
  savingPerGarment: string;
  wasteBefore: string;
  wasteAfter: string;
  wasteReduction: string;
  aiCoach: string;
  coachExcellent: string;
  coachStrong: string;
  coachModerate: string;
  coachLow: string;
  recommendationTitle: string;
  recommendationOne: string;
  recommendationTwo: string;
  recommendationThree: string;
  recommendationFour: string;
  commercialTitle: string;
  commercialText: string;
  safetyTitle: string;
  safetyText: string;
  demoNotice: string;
  nextTitle: string;
  metres: string;
  pieces: string;
  markers: string;
  percent: string;
  statusExcellent: string;
  statusStrong: string;
  statusModerate: string;
  statusLow: string;
  validationEfficiency: string;
  validationQuantity: string;
};

const translations: Record<Language, Translation> = {
  en: {
    block: "RC1 Mini Pilot · Block 018",
    title: "Fabric Saving Intelligence",
    subtitle:
      "OptiFabric AI converts marker-efficiency improvement into estimated fabric metres and financial savings for the full production order.",
    languageButton: "বাংলা",

    back: "Back to Marker Efficiency",
    next: "Continue to ROI",

    inputTitle: "Production Saving Inputs",
    currentEfficiency: "Current marker efficiency",
    improvedEfficiency: "AI-improved marker efficiency",
    orderQuantity: "Total order quantity",
    garmentsPerMarker: "Garments produced per marker",
    currentMarkerLength: "Current marker length",
    fabricCost: "Fabric cost per metre",
    currency: "Currency",

    calculate: "Calculate Fabric Saving",
    reset: "Reset Demo",

    whyTitle: "Why does AI ask for these inputs?",
    whyCurrentEfficiency:
      "AI needs the present marker efficiency to understand the factory’s current fabric-use performance.",
    whyImprovedEfficiency:
      "The improved efficiency represents the expected performance after AI nesting and marker optimisation.",
    whyOrderQuantity:
      "Fabric saving becomes commercially meaningful only when the improvement is applied across the full order quantity.",
    whyGarmentsPerMarker:
      "AI needs the number of garments produced from one marker to calculate how many marker lays are required.",
    whyMarkerLength:
      "The current marker length determines how much fabric is consumed for each marker lay.",
    whyFabricCost:
      "Fabric cost allows AI to convert saved metres into an estimated financial saving.",

    dashboardTitle: "Fabric Saving Dashboard",
    waiting:
      "Enter the production details and click Calculate Fabric Saving.",
    completed: "FABRIC SAVING ANALYSIS COMPLETE",

    efficiencyImprovement: "Efficiency improvement",
    markersRequired: "Estimated markers required",
    currentFabricConsumption: "Current fabric consumption",
    improvedFabricConsumption: "AI-improved fabric consumption",
    fabricSaved: "Estimated fabric saved",
    savingPerMarker: "Saving per marker",
    currentFabricCost: "Current estimated fabric cost",
    improvedFabricCost: "Improved estimated fabric cost",
    totalFinancialSaving: "Estimated financial saving",
    savingPerGarment: "Saving per garment",
    wasteBefore: "Waste before AI",
    wasteAfter: "Waste after AI",
    wasteReduction: "Waste reduction",

    aiCoach: "AI Coach",
    coachExcellent:
      "This order shows a high-value saving opportunity. The marker should be validated with the exact traced polygons before bulk cutting approval.",
    coachStrong:
      "The expected saving is commercially strong. Confirm grain line, fabric direction, pattern matching and cutting tolerance before implementation.",
    coachModerate:
      "The saving is useful, but AI recommends testing additional nesting combinations and available fabric widths.",
    coachLow:
      "The saving opportunity is currently limited. Review the marker data, piece orientation, cutting gap and fabric width.",

    recommendationTitle: "AI Saving Recommendations",
    recommendationOne:
      "Use the exact traced polygon instead of a rectangular approximation for the final commercial calculation.",
    recommendationTwo:
      "Compare alternative fabric widths before confirming the purchase order or fabric booking.",
    recommendationThree:
      "Place smaller components inside larger unused spaces without violating grain-line requirements.",
    recommendationFour:
      "Validate the recommended marker on a sample lay before releasing bulk cutting.",

    commercialTitle: "Commercial Interpretation",
    commercialText:
      "Even a small percentage improvement can save substantial fabric when the same style is produced in thousands of garments.",

    safetyTitle: "Engineering Safety",
    safetyText:
      "Fabric saving must never override grain line, nap direction, checks, stripes, shade grouping, pattern matching, buyer requirements or cutting safety.",

    demoNotice:
      "This RC1 page provides a commercial demonstration using efficiency-based calculations. The production version will receive exact marker results directly from the nesting engine.",

    nextTitle: "Commercial ROI Intelligence",

    metres: "m",
    pieces: "pcs",
    markers: "markers",
    percent: "%",

    statusExcellent: "High-Value Saving",
    statusStrong: "Strong Saving",
    statusModerate: "Useful Saving",
    statusLow: "Limited Saving",

    validationEfficiency:
      "Improved efficiency must be higher than current efficiency.",
    validationQuantity:
      "Order quantity and garments per marker must be greater than zero.",
  },

  bn: {
    block: "RC1 মিনি পাইলট · ব্লক ০১৮",
    title: "কাপড় সাশ্রয় বুদ্ধিমত্তা",
    subtitle:
      "OptiFabric AI মার্কার দক্ষতার উন্নতিকে সম্পূর্ণ উৎপাদন অর্ডারের আনুমানিক কাপড় সাশ্রয় ও আর্থিক সাশ্রয়ে রূপান্তর করে।",
    languageButton: "English",

    back: "মার্কার দক্ষতায় ফিরে যান",
    next: "ROI-তে যান",

    inputTitle: "উৎপাদন সাশ্রয় তথ্য",
    currentEfficiency: "বর্তমান মার্কার দক্ষতা",
    improvedEfficiency: "এআই উন্নত মার্কার দক্ষতা",
    orderQuantity: "মোট অর্ডারের পরিমাণ",
    garmentsPerMarker: "প্রতি মার্কারে পোশাকের সংখ্যা",
    currentMarkerLength: "বর্তমান মার্কারের দৈর্ঘ্য",
    fabricCost: "প্রতি মিটার কাপড়ের মূল্য",
    currency: "মুদ্রা",

    calculate: "কাপড় সাশ্রয় হিসাব করুন",
    reset: "ডেমো রিসেট করুন",

    whyTitle: "এআই কেন এই তথ্যগুলো চায়?",
    whyCurrentEfficiency:
      "কারখানার বর্তমান কাপড় ব্যবহারের অবস্থা বোঝার জন্য এআই বর্তমান মার্কার দক্ষতা জানতে চায়।",
    whyImprovedEfficiency:
      "এআই নেস্টিং ও মার্কার অপ্টিমাইজেশনের পর প্রত্যাশিত দক্ষতা বোঝাতে উন্নত মার্কার দক্ষতা ব্যবহার করা হয়।",
    whyOrderQuantity:
      "সম্পূর্ণ অর্ডারের ওপর উন্নতি প্রয়োগ করলেই কাপড় সাশ্রয়ের প্রকৃত বাণিজ্যিক মূল্য বোঝা যায়।",
    whyGarmentsPerMarker:
      "কতটি মার্কার লে প্রয়োজন হবে তা হিসাব করতে প্রতি মার্কারে উৎপাদিত পোশাকের সংখ্যা প্রয়োজন।",
    whyMarkerLength:
      "প্রতি মার্কার লেতে কত কাপড় ব্যবহার হয় তা বর্তমান মার্কারের দৈর্ঘ্য নির্ধারণ করে।",
    whyFabricCost:
      "সাশ্রয় হওয়া কাপড়কে আনুমানিক আর্থিক সাশ্রয়ে রূপান্তর করার জন্য কাপড়ের মূল্য প্রয়োজন।",

    dashboardTitle: "কাপড় সাশ্রয় ড্যাশবোর্ড",
    waiting:
      "উৎপাদনের তথ্য লিখে কাপড় সাশ্রয় হিসাব করুন বাটনে ক্লিক করুন।",
    completed: "কাপড় সাশ্রয় বিশ্লেষণ সম্পন্ন",

    efficiencyImprovement: "দক্ষতার উন্নতি",
    markersRequired: "আনুমানিক প্রয়োজনীয় মার্কার",
    currentFabricConsumption: "বর্তমান কাপড় ব্যবহার",
    improvedFabricConsumption: "এআই উন্নত কাপড় ব্যবহার",
    fabricSaved: "আনুমানিক কাপড় সাশ্রয়",
    savingPerMarker: "প্রতি মার্কারে সাশ্রয়",
    currentFabricCost: "বর্তমান আনুমানিক কাপড়ের মূল্য",
    improvedFabricCost: "উন্নত আনুমানিক কাপড়ের মূল্য",
    totalFinancialSaving: "আনুমানিক আর্থিক সাশ্রয়",
    savingPerGarment: "প্রতি পোশাকে সাশ্রয়",
    wasteBefore: "এআই ব্যবহারের আগে অপচয়",
    wasteAfter: "এআই ব্যবহারের পরে অপচয়",
    wasteReduction: "অপচয় হ্রাস",

    aiCoach: "এআই কোচ",
    coachExcellent:
      "এই অর্ডারে উচ্চ-মূল্যের সাশ্রয়ের সুযোগ রয়েছে। বাল্ক কাটিং অনুমোদনের আগে সঠিক ট্রেস করা পলিগন দিয়ে মার্কার যাচাই করুন।",
    coachStrong:
      "প্রত্যাশিত সাশ্রয় বাণিজ্যিকভাবে শক্তিশালী। বাস্তবায়নের আগে গ্রেইন লাইন, কাপড়ের দিক, প্যাটার্ন ম্যাচিং ও কাটিং টলারেন্স নিশ্চিত করুন।",
    coachModerate:
      "সাশ্রয়টি কার্যকর, তবে এআই আরও নেস্টিং কম্বিনেশন এবং বিকল্প কাপড়ের প্রস্থ পরীক্ষা করার পরামর্শ দেয়।",
    coachLow:
      "বর্তমানে সাশ্রয়ের সুযোগ সীমিত। মার্কার তথ্য, প্যাটার্নের দিক, কাটিং গ্যাপ এবং কাপড়ের প্রস্থ পুনরায় পরীক্ষা করুন।",

    recommendationTitle: "এআই সাশ্রয় পরামর্শ",
    recommendationOne:
      "চূড়ান্ত বাণিজ্যিক হিসাবের জন্য আয়তাকার অনুমানের পরিবর্তে সঠিক ট্রেস করা পলিগন ব্যবহার করুন।",
    recommendationTwo:
      "কাপড় ক্রয় বা বুকিং নিশ্চিত করার আগে বিকল্প কাপড়ের প্রস্থ তুলনা করুন।",
    recommendationThree:
      "গ্রেইন লাইনের শর্ত লঙ্ঘন না করে বড় ফাঁকা জায়গার মধ্যে ছোট প্যাটার্ন অংশ বসান।",
    recommendationFour:
      "বাল্ক কাটিং ছাড়ার আগে একটি নমুনা লেতে প্রস্তাবিত মার্কার যাচাই করুন।",

    commercialTitle: "বাণিজ্যিক ব্যাখ্যা",
    commercialText:
      "একই স্টাইল হাজার হাজার পিস উৎপাদন করা হলে দক্ষতার সামান্য উন্নতিও উল্লেখযোগ্য কাপড় সাশ্রয় করতে পারে।",

    safetyTitle: "ইঞ্জিনিয়ারিং নিরাপত্তা",
    safetyText:
      "কাপড় সাশ্রয়ের জন্য গ্রেইন লাইন, ন্যাপের দিক, চেক, স্ট্রাইপ, শেড গ্রুপিং, প্যাটার্ন ম্যাচিং, ক্রেতার নির্দেশনা অথবা কাটিং নিরাপত্তা লঙ্ঘন করা যাবে না।",

    demoNotice:
      "এই RC1 পৃষ্ঠায় দক্ষতাভিত্তিক হিসাব ব্যবহার করে বাণিজ্যিক প্রদর্শনী দেখানো হয়েছে। উৎপাদন সংস্করণ নেস্টিং ইঞ্জিন থেকে সরাসরি সঠিক মার্কার ফলাফল গ্রহণ করবে।",

    nextTitle: "বাণিজ্যিক ROI বুদ্ধিমত্তা",

    metres: "মিটার",
    pieces: "পিস",
    markers: "মার্কার",
    percent: "%",

    statusExcellent: "উচ্চ-মূল্যের সাশ্রয়",
    statusStrong: "শক্তিশালী সাশ্রয়",
    statusModerate: "কার্যকর সাশ্রয়",
    statusLow: "সীমিত সাশ্রয়",

    validationEfficiency:
      "উন্নত দক্ষতা অবশ্যই বর্তমান দক্ষতার চেয়ে বেশি হতে হবে।",
    validationQuantity:
      "অর্ডারের পরিমাণ এবং প্রতি মার্কারে পোশাকের সংখ্যা শূন্যের বেশি হতে হবে।",
  },
};

export default function FabricSavingPage() {
  const [language, setLanguage] = useState<Language>("en");

  const [currentEfficiency, setCurrentEfficiency] = useState(72);
  const [improvedEfficiency, setImprovedEfficiency] = useState(82);
  const [orderQuantity, setOrderQuantity] = useState(10000);
  const [garmentsPerMarker, setGarmentsPerMarker] = useState(8);
  const [currentMarkerLength, setCurrentMarkerLength] =
    useState(2.65);
  const [fabricCost, setFabricCost] = useState(4.5);
  const [currency, setCurrency] = useState("£");

  const [calculated, setCalculated] = useState(false);
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

    const safeOrderQuantity = Math.max(
      0,
      Math.floor(orderQuantity)
    );

    const safeGarmentsPerMarker = Math.max(
      1,
      Math.floor(garmentsPerMarker)
    );

    const safeMarkerLength = Math.max(0, currentMarkerLength);
    const safeFabricCost = Math.max(0, fabricCost);

    const markersRequired = Math.ceil(
      safeOrderQuantity / safeGarmentsPerMarker
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

    const savingPerMarker = Math.max(
      0,
      safeMarkerLength - improvedMarkerLength
    );

    const currentFabricCost =
      currentFabricConsumption * safeFabricCost;

    const improvedFabricCost =
      improvedFabricConsumption * safeFabricCost;

    const totalFinancialSaving = Math.max(
      0,
      currentFabricCost - improvedFabricCost
    );

    const savingPerGarment =
      safeOrderQuantity > 0
        ? totalFinancialSaving / safeOrderQuantity
        : 0;

    const efficiencyImprovement = Math.max(
      0,
      safeImprovedEfficiency - safeCurrentEfficiency
    );

    const wasteBefore = Math.max(
      0,
      100 - safeCurrentEfficiency
    );

    const wasteAfter = Math.max(
      0,
      100 - safeImprovedEfficiency
    );

    const wasteReduction = Math.max(0, wasteBefore - wasteAfter);

    const savingPercentage =
      currentFabricConsumption > 0
        ? (fabricSaved / currentFabricConsumption) * 100
        : 0;

    let status: SavingStatus = "low";

    if (savingPercentage >= 10) {
      status = "excellent";
    } else if (savingPercentage >= 6) {
      status = "strong";
    } else if (savingPercentage >= 3) {
      status = "moderate";
    }

    return {
      markersRequired,
      currentFabricConsumption,
      improvedMarkerLength,
      improvedFabricConsumption,
      fabricSaved,
      savingPerMarker,
      currentFabricCost,
      improvedFabricCost,
      totalFinancialSaving,
      savingPerGarment,
      efficiencyImprovement,
      wasteBefore,
      wasteAfter,
      wasteReduction,
      savingPercentage,
      status,
    };
  }, [
    currentEfficiency,
    improvedEfficiency,
    orderQuantity,
    garmentsPerMarker,
    currentMarkerLength,
    fabricCost,
  ]);

  const statusText: Record<SavingStatus, string> = {
    excellent: t.statusExcellent,
    strong: t.statusStrong,
    moderate: t.statusModerate,
    low: t.statusLow,
  };

  const coachText: Record<SavingStatus, string> = {
    excellent: t.coachExcellent,
    strong: t.coachStrong,
    moderate: t.coachModerate,
    low: t.coachLow,
  };

  function handleCalculate() {
    if (improvedEfficiency <= currentEfficiency) {
      setValidationMessage(t.validationEfficiency);
      setCalculated(false);
      return;
    }

    if (orderQuantity <= 0 || garmentsPerMarker <= 0) {
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
    setGarmentsPerMarker(8);
    setCurrentMarkerLength(2.65);
    setFabricCost(4.5);
    setCurrency("£");
    setCalculated(false);
    setValidationMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress currentStep={5} />
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
              href="/optifabric/demo/marker-efficiency"
              className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
            >
              ← {t.back}
            </Link>

            <Link
              href="/optifabric/demo/roi"
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
                  label={t.improvedEfficiency}
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
                  unit={t.pieces}
                  onChange={setOrderQuantity}
                />

                <NumberField
                  label={t.garmentsPerMarker}
                  value={garmentsPerMarker}
                  min={1}
                  max={1000}
                  step={1}
                  unit={t.pieces}
                  onChange={setGarmentsPerMarker}
                />

                <NumberField
                  label={t.currentMarkerLength}
                  value={currentMarkerLength}
                  min={0.1}
                  max={1000}
                  step={0.01}
                  unit={t.metres}
                  onChange={setCurrentMarkerLength}
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
                  title={t.currentEfficiency}
                  text={t.whyCurrentEfficiency}
                />

                <WhyItem
                  title={t.improvedEfficiency}
                  text={t.whyImprovedEfficiency}
                />

                <WhyItem
                  title={t.orderQuantity}
                  text={t.whyOrderQuantity}
                />

                <WhyItem
                  title={t.garmentsPerMarker}
                  text={t.whyGarmentsPerMarker}
                />

                <WhyItem
                  title={t.currentMarkerLength}
                  text={t.whyMarkerLength}
                />

                <WhyItem
                  title={t.fabricCost}
                  text={t.whyFabricCost}
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
                  label={t.efficiencyImprovement}
                  value={`${result.efficiencyImprovement.toFixed(
                    1
                  )}%`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.fabricSaved}
                  value={`${result.fabricSaved.toFixed(2)} ${
                    t.metres
                  }`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.totalFinancialSaving}
                  value={`${currency}${result.totalFinancialSaving.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.savingPerGarment}
                  value={`${currency}${result.savingPerGarment.toFixed(
                    4
                  )}`}
                  active={calculated}
                />
              </div>

              <div className="mt-8">
                <SavingComparison
                  current={result.currentFabricConsumption}
                  improved={result.improvedFabricConsumption}
                  active={calculated}
                  currentLabel={t.currentFabricConsumption}
                  improvedLabel={t.improvedFabricConsumption}
                  unit={t.metres}
                />
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label={t.markersRequired}
                value={`${result.markersRequired.toLocaleString()} ${
                  t.markers
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.currentFabricConsumption}
                value={`${result.currentFabricConsumption.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                  }
                )} ${t.metres}`}
                active={calculated}
              />

              <MetricCard
                label={t.improvedFabricConsumption}
                value={`${result.improvedFabricConsumption.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                  }
                )} ${t.metres}`}
                active={calculated}
              />

              <MetricCard
                label={t.savingPerMarker}
                value={`${result.savingPerMarker.toFixed(3)} ${
                  t.metres
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.currentFabricCost}
                value={`${currency}${result.currentFabricCost.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
                active={calculated}
              />

              <MetricCard
                label={t.improvedFabricCost}
                value={`${currency}${result.improvedFabricCost.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
                active={calculated}
              />
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <WasteCard
                label={t.wasteBefore}
                value={result.wasteBefore}
                active={calculated}
              />

              <WasteCard
                label={t.wasteAfter}
                value={result.wasteAfter}
                active={calculated}
              />

              <WasteCard
                label={t.wasteReduction}
                value={result.wasteReduction}
                active={calculated}
                positive
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <h2 className="text-xl font-black text-emerald-200">
                  {t.aiCoach}
                </h2>

                <p className="mt-4 leading-7 text-emerald-50">
                  {calculated
                    ? coachText[result.status]
                    : t.waiting}
                </p>

                {calculated && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SmallResult
                      label={t.currentEfficiency}
                      value={`${currentEfficiency}%`}
                    />

                    <SmallResult
                      label={t.improvedEfficiency}
                      value={`${improvedEfficiency}%`}
                    />

                    <SmallResult
                      label={t.orderQuantity}
                      value={`${orderQuantity.toLocaleString()} ${
                        t.pieces
                      }`}
                    />

                    <SmallResult
                      label={t.fabricSaved}
                      value={`${result.fabricSaved.toFixed(2)} ${
                        t.metres
                      }`}
                    />
                  </div>
                )}
              </article>

              <article className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6">
                <h2 className="text-xl font-black text-blue-200">
                  {t.recommendationTitle}
                </h2>

                <div className="mt-4 space-y-3">
                  <Recommendation
                    text={t.recommendationOne}
                  />
                  <Recommendation
                    text={t.recommendationTwo}
                  />
                  <Recommendation
                    text={t.recommendationThree}
                  />
                  <Recommendation
                    text={t.recommendationFour}
                  />
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6">
                <h2 className="text-xl font-black text-violet-200">
                  {t.commercialTitle}
                </h2>

                <p className="mt-4 leading-7 text-violet-50">
                  {t.commercialText}
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
                href="/optifabric/demo/roi"
                className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.next} →
              </Link>
            </section>
          </div>
        </section>
        <div className="mt-8">
  <AIExplanationCard
    title="Fabric Saving Intelligence"
    titleBn="কাপড় সাশ্রয় বিশ্লেষণ"

    purpose="Estimate how much fabric can be saved by improving marker efficiency and reducing avoidable waste."

    purposeBn="মার্কার দক্ষতা বৃদ্ধি এবং অনাকাঙ্ক্ষিত অপচয় কমিয়ে কত কাপড় সাশ্রয় করা সম্ভব তা নির্ণয় করা।"

    why="AI compares the current marker result with the improved nesting result to calculate potential fabric savings."

    whyBn="AI বর্তমান মার্কার ফলাফল এবং উন্নত নেস্টিং ফলাফল তুলনা করে সম্ভাব্য কাপড় সাশ্রয় নির্ণয় করে।"

    bestPractice="Use verified fabric width, pattern area and marker efficiency data before reviewing the savings result."

    bestPracticeBn="সাশ্রয়ের ফলাফল দেখার আগে সঠিক কাপড়ের প্রস্থ, প্যাটার্ন ক্ষেত্রফল এবং মার্কার দক্ষতার তথ্য নিশ্চিত করুন।"

    commonMistake="Using estimated or incorrect production data, which may produce unrealistic savings figures."

    commonMistakeBn="অনুমানভিত্তিক বা ভুল উৎপাদন তথ্য ব্যবহার করা, যার ফলে অবাস্তব সাশ্রয়ের হিসাব হতে পারে।"
  />
</div>
<div className="mt-8">
  <CommercialFooter />
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

function WasteCard({
  label,
  value,
  active,
  positive = false,
}: {
  label: string;
  value: number;
  active: boolean;
  positive?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-5 ${
        positive
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-rose-500/20 bg-rose-500/10"
      }`}
    >
      <p className="text-sm font-semibold text-slate-300">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${
          active
            ? positive
              ? "text-emerald-200"
              : "text-rose-200"
            : "text-slate-600"
        }`}
      >
        {active ? `${value.toFixed(1)}%` : "—"}
      </p>
    </article>
  );
}

function SavingComparison({
  current,
  improved,
  active,
  currentLabel,
  improvedLabel,
  unit,
}: {
  current: number;
  improved: number;
  active: boolean;
  currentLabel: string;
  improvedLabel: string;
  unit: string;
}) {
  const maximum = Math.max(current, improved, 1);

  const currentWidth = active ? (current / maximum) * 100 : 0;
  const improvedWidth = active
    ? (improved / maximum) * 100
    : 0;

  return (
    <div className="space-y-5 rounded-3xl border border-slate-700 bg-slate-950 p-5">
      <ComparisonBar
        label={currentLabel}
        value={current}
        width={currentWidth}
        unit={unit}
        active={active}
        type="current"
      />

      <ComparisonBar
        label={improvedLabel}
        value={improved}
        width={improvedWidth}
        unit={unit}
        active={active}
        type="improved"
      />
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  width,
  unit,
  active,
  type,
}: {
  label: string;
  value: number;
  width: number;
  unit: string;
  active: boolean;
  type: "current" | "improved";
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-300">
          {label}
        </span>

        <span className="text-sm font-black text-white">
          {active
            ? `${value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} ${unit}`
            : "—"}
        </span>
      </div>

      <div className="h-7 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            type === "current"
              ? "bg-rose-400"
              : "bg-emerald-400"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  text,
}: {
  status: SavingStatus;
  text: string;
}) {
  const styles: Record<SavingStatus, string> = {
    excellent:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    strong:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
    moderate:
      "border-amber-500/40 bg-amber-500/10 text-amber-200",
    low: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  };

  return (
    <div
      className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-wide ${styles[status]}`}
    >
      {text}
    </div>
  );
}

function Recommendation({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-blue-400/20 bg-slate-950/30 p-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-400 font-black text-slate-950">
        ✓
      </div>

      <p className="text-sm leading-6 text-blue-50">{text}</p>
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