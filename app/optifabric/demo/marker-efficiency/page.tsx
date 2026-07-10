"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Language = "en" | "bn";
type EfficiencyStatus = "excellent" | "good" | "watch" | "critical";

const translations = {
  en: {
    block: "RC1 Mini Pilot · Block 017",
    title: "Marker Efficiency Intelligence",
    subtitle:
      "OptiFabric AI evaluates how efficiently the marker uses the available fabric and explains where fabric is being lost.",
    languageButton: "বাংলা",

    back: "Back to AI Nesting",
    next: "Continue to Fabric Saving",

    inputTitle: "Marker Production Data",
    fabricWidth: "Fabric width",
    markerLength: "Marker length",
    totalPatternArea: "Total pattern area",
    cuttingGap: "Cutting gap",
    endAllowance: "Marker end allowance",
    edgeAllowance: "Fabric edge allowance",
    fabricCost: "Fabric cost per metre",
    calculate: "Calculate Marker Efficiency",
    reset: "Reset Demo",

    whyTitle: "Why does AI ask for these inputs?",
    whyFabricWidth:
      "AI needs the usable fabric width to calculate the total fabric area available inside the marker.",
    whyMarkerLength:
      "Marker length determines how much fabric is consumed for the planned cutting quantity.",
    whyPatternArea:
      "The total pattern area represents the fabric that becomes garment components instead of waste.",
    whyGap:
      "Cutting gaps protect pattern pieces from overlapping, but excessive gaps increase fabric consumption.",
    whyEndAllowance:
      "Factories normally keep small allowances at the marker start and end for spreading and cutting safety.",
    whyEdgeAllowance:
      "Fabric edges may be damaged or unusable, so AI separates usable width from the full fabric width.",
    whyFabricCost:
      "Fabric cost allows AI to convert percentage waste into an estimated financial impact.",

    dashboardTitle: "Marker Efficiency Dashboard",
    waiting:
      "Enter the marker information and click Calculate Marker Efficiency.",
    completed: "MARKER ANALYSIS COMPLETE",

    grossFabricArea: "Gross fabric area",
    usableFabricArea: "Usable marker area",
    productiveArea: "Productive pattern area",
    estimatedWasteArea: "Estimated waste area",
    grossEfficiency: "Gross marker efficiency",
    usableEfficiency: "Usable marker efficiency",
    estimatedWaste: "Estimated waste",
    fabricUsed: "Estimated fabric used",
    wasteLength: "Equivalent waste length",
    wasteCost: "Estimated waste cost",

    efficiencyScale: "Efficiency Performance Scale",
    critical: "Critical",
    watch: "Watch",
    good: "Good",
    excellent: "Excellent",

    statusExcellent: "Excellent Marker",
    statusGood: "Good Marker",
    statusWatch: "Improvement Required",
    statusCritical: "High Fabric Loss",

    coachTitle: "AI Coach",
    coachExcellent:
      "This marker is performing at a strong commercial level. Maintain the current placement discipline and verify grain-line compliance before production.",
    coachGood:
      "The marker is commercially acceptable. Small improvements may still be possible by reducing unnecessary spaces or testing alternative piece orientation.",
    coachWatch:
      "The marker requires improvement. Review large empty zones, excessive cutting gaps, edge allowances, and possible piece rotation.",
    coachCritical:
      "The marker has high fabric loss. Do not approve bulk cutting until the marker arrangement and input measurements are reviewed.",

    actionsTitle: "AI Improvement Recommendations",
    actionGap:
      "Review the cutting gap. Reduce it only when cutting accuracy and blade clearance remain safe.",
    actionRotation:
      "Test alternative pattern orientation where grain direction, checks, stripes, nap, and design direction permit.",
    actionWidth:
      "Compare this marker against available fabric widths. A different width may create a better piece combination.",
    actionEmptySpace:
      "Inspect major empty spaces and place smaller components inside usable gaps.",
    actionAllowance:
      "Confirm that edge and end allowances are based on factory requirements rather than habit.",

    commercialTitle: "Commercial Interpretation",
    commercialText:
      "A small improvement in marker efficiency can create significant savings when the same style is produced in large quantities.",
    safetyTitle: "Engineering Safety",
    safetyText:
      "AI recommendations must not violate grain line, pattern matching, nap direction, shade control, cutting tolerance, or buyer specifications.",

    demoNotice:
      "This RC1 demonstration uses marker-area mathematics. The commercial version will calculate efficiency directly from traced polygons and the generated nesting layout.",

    inches: "in",
    squareInches: "in²",
    metres: "m",
    currency: "£",
    percent: "%",
  },

  bn: {
    block: "RC1 মিনি পাইলট · ব্লক ০১৭",
    title: "মার্কার দক্ষতা বুদ্ধিমত্তা",
    subtitle:
      "OptiFabric AI মার্কারের মধ্যে কাপড় কতটা দক্ষভাবে ব্যবহার হয়েছে তা মূল্যায়ন করে এবং কোথায় কাপড় নষ্ট হচ্ছে তা ব্যাখ্যা করে।",
    languageButton: "English",

    back: "এআই নেস্টিংয়ে ফিরে যান",
    next: "কাপড় সাশ্রয়ে যান",

    inputTitle: "মার্কার উৎপাদন তথ্য",
    fabricWidth: "কাপড়ের প্রস্থ",
    markerLength: "মার্কারের দৈর্ঘ্য",
    totalPatternArea: "মোট প্যাটার্ন ক্ষেত্রফল",
    cuttingGap: "কাটিং গ্যাপ",
    endAllowance: "মার্কার শেষের অতিরিক্ত জায়গা",
    edgeAllowance: "কাপড়ের পাশের অতিরিক্ত জায়গা",
    fabricCost: "প্রতি মিটার কাপড়ের মূল্য",
    calculate: "মার্কার দক্ষতা হিসাব করুন",
    reset: "ডেমো রিসেট করুন",

    whyTitle: "এআই কেন এই তথ্যগুলো চায়?",
    whyFabricWidth:
      "মার্কারের মধ্যে মোট কতটুকু কাপড় ব্যবহার করা সম্ভব তা হিসাব করার জন্য এআই ব্যবহারযোগ্য কাপড়ের প্রস্থ জানতে চায়।",
    whyMarkerLength:
      "পরিকল্পিত কাটিংয়ের জন্য মোট কত কাপড় ব্যবহার হবে তা মার্কারের দৈর্ঘ্য নির্ধারণ করে।",
    whyPatternArea:
      "মোট প্যাটার্ন ক্ষেত্রফল বোঝায় কতটুকু কাপড় পোশাকের অংশে পরিণত হবে এবং অপচয় হবে না।",
    whyGap:
      "কাটিং গ্যাপ প্যাটার্নের অংশগুলোকে একে অপরের ওপর পড়া থেকে রক্ষা করে, তবে অতিরিক্ত গ্যাপ কাপড়ের ব্যবহার বাড়ায়।",
    whyEndAllowance:
      "স্প্রেডিং ও কাটিং নিরাপত্তার জন্য সাধারণত মার্কারের শুরু ও শেষে অল্প অতিরিক্ত জায়গা রাখা হয়।",
    whyEdgeAllowance:
      "কাপড়ের পাশ ক্ষতিগ্রস্ত বা ব্যবহার অনুপযোগী হতে পারে, তাই এআই মোট প্রস্থ থেকে ব্যবহারযোগ্য প্রস্থ আলাদা করে।",
    whyFabricCost:
      "কাপড়ের মূল্য ব্যবহার করে এআই শতকরা অপচয়কে আনুমানিক আর্থিক ক্ষতিতে রূপান্তর করে।",

    dashboardTitle: "মার্কার দক্ষতা ড্যাশবোর্ড",
    waiting:
      "মার্কারের তথ্য লিখে মার্কার দক্ষতা হিসাব করুন বাটনে ক্লিক করুন।",
    completed: "মার্কার বিশ্লেষণ সম্পন্ন",

    grossFabricArea: "মোট কাপড়ের ক্ষেত্রফল",
    usableFabricArea: "ব্যবহারযোগ্য মার্কার ক্ষেত্রফল",
    productiveArea: "কার্যকর প্যাটার্ন ক্ষেত্রফল",
    estimatedWasteArea: "আনুমানিক অপচয় ক্ষেত্রফল",
    grossEfficiency: "মোট মার্কার দক্ষতা",
    usableEfficiency: "ব্যবহারযোগ্য মার্কার দক্ষতা",
    estimatedWaste: "আনুমানিক কাপড় অপচয়",
    fabricUsed: "আনুমানিক ব্যবহৃত কাপড়",
    wasteLength: "সমপরিমাণ অপচয় দৈর্ঘ্য",
    wasteCost: "আনুমানিক অপচয়ের মূল্য",

    efficiencyScale: "দক্ষতা মূল্যায়ন স্কেল",
    critical: "সংকটপূর্ণ",
    watch: "সতর্কতা",
    good: "ভালো",
    excellent: "চমৎকার",

    statusExcellent: "চমৎকার মার্কার",
    statusGood: "ভালো মার্কার",
    statusWatch: "উন্নয়ন প্রয়োজন",
    statusCritical: "অতিরিক্ত কাপড় ক্ষতি",

    coachTitle: "এআই কোচ",
    coachExcellent:
      "এই মার্কারটি শক্তিশালী বাণিজ্যিক মানে কাজ করছে। বর্তমান প্লেসমেন্ট পদ্ধতি বজায় রাখুন এবং উৎপাদনের আগে গ্রেইন লাইন যাচাই করুন।",
    coachGood:
      "মার্কারটি বাণিজ্যিকভাবে গ্রহণযোগ্য। অপ্রয়োজনীয় ফাঁকা জায়গা কমিয়ে বা বিকল্প প্যাটার্ন দিক পরীক্ষা করে আরও উন্নতি সম্ভব হতে পারে।",
    coachWatch:
      "মার্কারটি উন্নত করা প্রয়োজন। বড় ফাঁকা জায়গা, অতিরিক্ত কাটিং গ্যাপ, পাশের অতিরিক্ত জায়গা এবং প্যাটার্ন ঘোরানোর সুযোগ পরীক্ষা করুন।",
    coachCritical:
      "এই মার্কারে কাপড়ের ক্ষতি বেশি। মার্কারের বিন্যাস ও ইনপুট মাপ পুনরায় পরীক্ষা না করে বাল্ক কাটিং অনুমোদন করবেন না।",

    actionsTitle: "এআই উন্নয়ন পরামর্শ",
    actionGap:
      "কাটিং গ্যাপ পরীক্ষা করুন। কাটিং নির্ভুলতা ও ব্লেড নিরাপত্তা বজায় থাকলেই শুধু গ্যাপ কমান।",
    actionRotation:
      "গ্রেইন লাইন, চেক, স্ট্রাইপ, ন্যাপ এবং ডিজাইনের দিক অনুমতি দিলে বিকল্প প্যাটার্ন অবস্থান পরীক্ষা করুন।",
    actionWidth:
      "উপলভ্য অন্যান্য কাপড়ের প্রস্থের সঙ্গে এই মার্কার তুলনা করুন। ভিন্ন প্রস্থে ভালো প্যাটার্ন সমন্বয় তৈরি হতে পারে।",
    actionEmptySpace:
      "বড় ফাঁকা জায়গাগুলো পরীক্ষা করুন এবং ব্যবহারযোগ্য জায়গায় ছোট প্যাটার্ন অংশ বসান।",
    actionAllowance:
      "পাশ ও শেষের অতিরিক্ত জায়গা কারখানার প্রকৃত প্রয়োজন অনুযায়ী রাখা হয়েছে কি না তা নিশ্চিত করুন।",

    commercialTitle: "বাণিজ্যিক ব্যাখ্যা",
    commercialText:
      "একই স্টাইল বড় পরিমাণে উৎপাদন করা হলে মার্কার দক্ষতার সামান্য উন্নতিও উল্লেখযোগ্য কাপড় সাশ্রয় করতে পারে।",
    safetyTitle: "ইঞ্জিনিয়ারিং নিরাপত্তা",
    safetyText:
      "এআই পরামর্শ গ্রেইন লাইন, প্যাটার্ন ম্যাচিং, ন্যাপের দিক, শেড নিয়ন্ত্রণ, কাটিং টলারেন্স অথবা ক্রেতার নির্দেশনা লঙ্ঘন করতে পারবে না।",

    demoNotice:
      "এই RC1 প্রদর্শনীতে মার্কার ক্ষেত্রফলের গাণিতিক হিসাব ব্যবহার করা হয়েছে। বাণিজ্যিক সংস্করণ ট্রেস করা পলিগন ও তৈরি করা নেস্টিং লেআউট থেকে সরাসরি দক্ষতা হিসাব করবে।",

    inches: "ইঞ্চি",
    squareInches: "বর্গইঞ্চি",
    metres: "মিটার",
    currency: "£",
    percent: "%",
  },
};

export default function MarkerEfficiencyPage() {
  const [language, setLanguage] = useState<Language>("en");

  const [fabricWidth, setFabricWidth] = useState(60);
  const [markerLength, setMarkerLength] = useState(104.5);
  const [totalPatternArea, setTotalPatternArea] = useState(3744);
  const [cuttingGap, setCuttingGap] = useState(0.5);
  const [endAllowance, setEndAllowance] = useState(1);
  const [edgeAllowance, setEdgeAllowance] = useState(0.5);
  const [fabricCost, setFabricCost] = useState(4.5);

  const [calculated, setCalculated] = useState(false);

  const t = translations[language];

  const result = useMemo(() => {
    const safeWidth = Math.max(1, fabricWidth);
    const safeLength = Math.max(1, markerLength);
    const safePatternArea = Math.max(0, totalPatternArea);
    const safeGap = Math.max(0, cuttingGap);
    const safeEndAllowance = Math.max(0, endAllowance);
    const safeEdgeAllowance = Math.max(0, edgeAllowance);
    const safeFabricCost = Math.max(0, fabricCost);

    const grossFabricArea = safeWidth * safeLength;

    const usableWidth = Math.max(
      1,
      safeWidth - safeEdgeAllowance * 2
    );

    const usableLength = Math.max(
      1,
      safeLength - safeEndAllowance * 2
    );

    const usableFabricArea = usableWidth * usableLength;

    const adjustedPatternArea = Math.min(
      safePatternArea,
      usableFabricArea
    );

    const grossEfficiency =
      grossFabricArea > 0
        ? Math.min(100, (adjustedPatternArea / grossFabricArea) * 100)
        : 0;

    const usableEfficiency =
      usableFabricArea > 0
        ? Math.min(
            100,
            (adjustedPatternArea / usableFabricArea) * 100
          )
        : 0;

    const estimatedWasteArea = Math.max(
      0,
      grossFabricArea - adjustedPatternArea
    );

    const wastePercentage = Math.max(0, 100 - grossEfficiency);

    const fabricUsedMetres = safeLength * 0.0254;

    const wasteLengthInches =
      safeWidth > 0 ? estimatedWasteArea / safeWidth : 0;

    const wasteLengthMetres = wasteLengthInches * 0.0254;

    const estimatedWasteCost = wasteLengthMetres * safeFabricCost;

    const gapPenalty = Math.min(8, safeGap * 3);

    const opportunityScore = Math.max(
      0,
      Math.min(100, usableEfficiency - gapPenalty)
    );

    let status: EfficiencyStatus = "critical";

    if (grossEfficiency >= 85) {
      status = "excellent";
    } else if (grossEfficiency >= 75) {
      status = "good";
    } else if (grossEfficiency >= 65) {
      status = "watch";
    }

    return {
      grossFabricArea,
      usableFabricArea,
      adjustedPatternArea,
      estimatedWasteArea,
      grossEfficiency,
      usableEfficiency,
      wastePercentage,
      fabricUsedMetres,
      wasteLengthMetres,
      estimatedWasteCost,
      opportunityScore,
      status,
      usableWidth,
      usableLength,
    };
  }, [
    fabricWidth,
    markerLength,
    totalPatternArea,
    cuttingGap,
    endAllowance,
    edgeAllowance,
    fabricCost,
  ]);

  const statusText = {
    excellent: t.statusExcellent,
    good: t.statusGood,
    watch: t.statusWatch,
    critical: t.statusCritical,
  }[result.status];

  const coachText = {
    excellent: t.coachExcellent,
    good: t.coachGood,
    watch: t.coachWatch,
    critical: t.coachCritical,
  }[result.status];

  function handleCalculate() {
    setCalculated(true);
  }

  function handleReset() {
    setFabricWidth(60);
    setMarkerLength(104.5);
    setTotalPatternArea(3744);
    setCuttingGap(0.5);
    setEndAllowance(1);
    setEdgeAllowance(0.5);
    setFabricCost(4.5);
    setCalculated(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
              href="/optifabric/demo/ai-nesting"
              className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
            >
              ← {t.back}
            </Link>

            <Link
              href="/optifabric/demo/fabric-saving"
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
                  label={t.fabricWidth}
                  value={fabricWidth}
                  min={20}
                  max={120}
                  step={1}
                  unit={t.inches}
                  onChange={setFabricWidth}
                />

                <NumberField
                  label={t.markerLength}
                  value={markerLength}
                  min={1}
                  max={1000}
                  step={0.5}
                  unit={t.inches}
                  onChange={setMarkerLength}
                />

                <NumberField
                  label={t.totalPatternArea}
                  value={totalPatternArea}
                  min={1}
                  max={100000}
                  step={1}
                  unit={t.squareInches}
                  onChange={setTotalPatternArea}
                />

                <NumberField
                  label={t.cuttingGap}
                  value={cuttingGap}
                  min={0}
                  max={3}
                  step={0.1}
                  unit={t.inches}
                  onChange={setCuttingGap}
                />

                <NumberField
                  label={t.endAllowance}
                  value={endAllowance}
                  min={0}
                  max={10}
                  step={0.1}
                  unit={t.inches}
                  onChange={setEndAllowance}
                />

                <NumberField
                  label={t.edgeAllowance}
                  value={edgeAllowance}
                  min={0}
                  max={5}
                  step={0.1}
                  unit={t.inches}
                  onChange={setEdgeAllowance}
                />

                <NumberField
                  label={t.fabricCost}
                  value={fabricCost}
                  min={0}
                  max={100}
                  step={0.1}
                  unit={`${t.currency}/${t.metres}`}
                  onChange={setFabricCost}
                />
              </div>

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
                  title={t.fabricWidth}
                  text={t.whyFabricWidth}
                />

                <WhyItem
                  title={t.markerLength}
                  text={t.whyMarkerLength}
                />

                <WhyItem
                  title={t.totalPatternArea}
                  text={t.whyPatternArea}
                />

                <WhyItem
                  title={t.cuttingGap}
                  text={t.whyGap}
                />

                <WhyItem
                  title={t.endAllowance}
                  text={t.whyEndAllowance}
                />

                <WhyItem
                  title={t.edgeAllowance}
                  text={t.whyEdgeAllowance}
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
                    {calculated ? coachText : t.waiting}
                  </p>
                </div>

                {calculated && (
                  <StatusBadge
                    status={result.status}
                    text={statusText}
                  />
                )}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label={t.grossEfficiency}
                  value={`${result.grossEfficiency.toFixed(1)}%`}
                  active={calculated}
                  highlight
                />

                <MetricCard
                  label={t.usableEfficiency}
                  value={`${result.usableEfficiency.toFixed(1)}%`}
                  active={calculated}
                />

                <MetricCard
                  label={t.estimatedWaste}
                  value={`${result.wastePercentage.toFixed(1)}%`}
                  active={calculated}
                />

                <MetricCard
                  label={t.wasteCost}
                  value={`${t.currency}${result.estimatedWasteCost.toFixed(
                    2
                  )}`}
                  active={calculated}
                />
              </div>

              <div className="mt-8">
                <EfficiencyGauge
                  efficiency={result.grossEfficiency}
                  active={calculated}
                />

                <div className="mt-3 grid grid-cols-4 text-center text-xs font-bold">
                  <span className="text-rose-300">{t.critical}</span>
                  <span className="text-amber-300">{t.watch}</span>
                  <span className="text-blue-300">{t.good}</span>
                  <span className="text-emerald-300">
                    {t.excellent}
                  </span>
                </div>

                <p className="mt-4 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
                  {t.efficiencyScale}
                </p>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label={t.grossFabricArea}
                value={`${result.grossFabricArea.toFixed(0)} ${
                  t.squareInches
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.usableFabricArea}
                value={`${result.usableFabricArea.toFixed(0)} ${
                  t.squareInches
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.productiveArea}
                value={`${result.adjustedPatternArea.toFixed(0)} ${
                  t.squareInches
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.estimatedWasteArea}
                value={`${result.estimatedWasteArea.toFixed(0)} ${
                  t.squareInches
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.fabricUsed}
                value={`${result.fabricUsedMetres.toFixed(2)} ${
                  t.metres
                }`}
                active={calculated}
              />

              <MetricCard
                label={t.wasteLength}
                value={`${result.wasteLengthMetres.toFixed(2)} ${
                  t.metres
                }`}
                active={calculated}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <h2 className="text-xl font-black text-emerald-200">
                  {t.coachTitle}
                </h2>

                <p className="mt-4 leading-7 text-emerald-50">
                  {calculated ? coachText : t.waiting}
                </p>

                {calculated && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SmallResult
                      label={t.fabricWidth}
                      value={`${fabricWidth} ${t.inches}`}
                    />

                    <SmallResult
                      label={t.markerLength}
                      value={`${markerLength} ${t.inches}`}
                    />

                    <SmallResult
                      label={t.edgeAllowance}
                      value={`${edgeAllowance} ${t.inches}`}
                    />

                    <SmallResult
                      label={t.endAllowance}
                      value={`${endAllowance} ${t.inches}`}
                    />
                  </div>
                )}
              </article>

              <article className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6">
                <h2 className="text-xl font-black text-blue-200">
                  {t.actionsTitle}
                </h2>

                <div className="mt-4 space-y-3">
                  <Recommendation text={t.actionGap} />
                  <Recommendation text={t.actionRotation} />
                  <Recommendation text={t.actionWidth} />
                  <Recommendation text={t.actionEmptySpace} />
                  <Recommendation text={t.actionAllowance} />
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
                  Fabric Saving Intelligence
                </h2>
              </div>

              <Link
                href="/optifabric/demo/fabric-saving"
                className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.next} →
              </Link>
            </section>
          </div>
        </section>
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
        className={`mt-3 text-3xl font-black ${
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

function EfficiencyGauge({
  efficiency,
  active,
}: {
  efficiency: number;
  active: boolean;
}) {
  const safeEfficiency = Math.max(0, Math.min(100, efficiency));

  return (
    <div className="relative h-8 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
      <div className="absolute inset-0 grid grid-cols-4">
        <div className="bg-rose-500/30" />
        <div className="bg-amber-500/30" />
        <div className="bg-blue-500/30" />
        <div className="bg-emerald-500/30" />
      </div>

      {active && (
        <div
          className="absolute bottom-0 left-0 top-0 bg-white/30 transition-all duration-700"
          style={{ width: `${safeEfficiency}%` }}
        />
      )}

      {active && (
        <div
          className="absolute top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)] transition-all duration-700"
          style={{ left: `${safeEfficiency}%` }}
        />
      )}

      <div className="relative z-10 flex h-full items-center justify-center text-sm font-black text-white">
        {active ? `${safeEfficiency.toFixed(1)}%` : "—"}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  text,
}: {
  status: EfficiencyStatus;
  text: string;
}) {
  const styles = {
    excellent:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    good: "border-blue-500/40 bg-blue-500/10 text-blue-200",
    watch:
      "border-amber-500/40 bg-amber-500/10 text-amber-200",
    critical:
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

      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}