"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
import AIExplanationCard from "@/app/components/optifabric/AIExplanationCard";
import CommercialFooter from "@/app/components/optifabric/CommercialFooter";

type Language = "en" | "bn";

type NestingPiece = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
};

const translations = {
  en: {
    pageTitle: "AI Nesting Demonstration",
    subtitle:
      "OptiFabric AI arranges traced pattern pieces inside the fabric width to reduce unused fabric.",
    back: "Back to Polygon",
    next: "Continue to Marker Efficiency",
    language: "বাংলা",
    controlTitle: "Nesting Inputs",
    fabricWidth: "Fabric width",
    fabricWidthUnit: "inches",
    patternWidth: "Pattern width",
    patternHeight: "Pattern height",
    quantity: "Number of pieces",
    gap: "Cutting gap",
    gapUnit: "inches",
    allowRotation: "Allow pattern rotation",
    generate: "Generate AI Nesting",
    reset: "Reset Demo",
    markerPreview: "AI Marker Preview",
    fabricArea: "Fabric area used",
    patternArea: "Total pattern area",
    markerLength: "Estimated marker length",
    efficiency: "Estimated marker efficiency",
    waste: "Estimated fabric waste",
    rows: "Nesting rows",
    piecesPlaced: "Pieces placed",
    whyTitle: "Why does AI ask for these inputs?",
    whyFabric:
      "AI needs the fabric width because pattern pieces must remain inside the usable fabric area.",
    whyPattern:
      "AI needs the pattern dimensions to calculate how the pieces can be placed and rotated.",
    whyQuantity:
      "AI needs the required quantity to estimate the full marker length and total fabric consumption.",
    whyGap:
      "AI keeps a safe cutting gap so adjacent pattern pieces do not overlap during cutting.",
    whyRotation:
      "Rotation may improve fabric utilisation, but it should only be used when grain direction and fabric design permit it.",
    coachTitle: "AI Coach",
    coachGood:
      "Good nesting result. The pattern pieces are using the available fabric width efficiently.",
    coachMedium:
      "The marker is acceptable, but AI recommends testing rotation or a smaller safe cutting gap.",
    coachLow:
      "Fabric utilisation is low. Check the fabric width, pattern orientation, and cutting gap.",
    grainWarning:
      "Commercial note: Rotation should be disabled for directional fabrics, checks, stripes, nap, or mandatory grain-line control.",
    demoNotice:
      "This is a visual pilot demonstration. The commercial engine will use the exact traced polygon instead of a rectangular approximation.",
    ready: "AI nesting is ready.",
    noResult:
      "Enter the production details and click Generate AI Nesting.",
    placed: "Placed",
    notPlaced: "Not placed",
    inches: "in",
  },
  bn: {
    pageTitle: "এআই নেস্টিং প্রদর্শনী",
    subtitle:
      "OptiFabric AI কাপড়ের প্রস্থের মধ্যে ট্রেস করা প্যাটার্ন সাজিয়ে অব্যবহৃত কাপড় কমানোর চেষ্টা করে।",
    back: "পলিগনে ফিরে যান",
    next: "মার্কার দক্ষতায় যান",
    language: "English",
    controlTitle: "নেস্টিং ইনপুট",
    fabricWidth: "কাপড়ের প্রস্থ",
    fabricWidthUnit: "ইঞ্চি",
    patternWidth: "প্যাটার্নের প্রস্থ",
    patternHeight: "প্যাটার্নের উচ্চতা",
    quantity: "পিসের সংখ্যা",
    gap: "কাটিং গ্যাপ",
    gapUnit: "ইঞ্চি",
    allowRotation: "প্যাটার্ন ঘোরানোর অনুমতি দিন",
    generate: "এআই নেস্টিং তৈরি করুন",
    reset: "ডেমো রিসেট করুন",
    markerPreview: "এআই মার্কার প্রিভিউ",
    fabricArea: "ব্যবহৃত কাপড়ের ক্ষেত্রফল",
    patternArea: "মোট প্যাটার্ন ক্ষেত্রফল",
    markerLength: "আনুমানিক মার্কার দৈর্ঘ্য",
    efficiency: "আনুমানিক মার্কার দক্ষতা",
    waste: "আনুমানিক কাপড় অপচয়",
    rows: "নেস্টিং সারি",
    piecesPlaced: "স্থাপন করা পিস",
    whyTitle: "এআই কেন এই তথ্যগুলো চায়?",
    whyFabric:
      "প্যাটার্নের সব অংশ ব্যবহারযোগ্য কাপড়ের প্রস্থের ভেতরে রাখার জন্য এআই কাপড়ের প্রস্থ জানতে চায়।",
    whyPattern:
      "প্যাটার্ন কীভাবে বসানো বা ঘোরানো যাবে তা হিসাব করার জন্য এআই প্যাটার্নের মাপ জানতে চায়।",
    whyQuantity:
      "সম্পূর্ণ মার্কার দৈর্ঘ্য ও মোট কাপড়ের প্রয়োজন হিসাব করার জন্য এআই পিসের সংখ্যা জানতে চায়।",
    whyGap:
      "কাটিংয়ের সময় পাশাপাশি দুটি প্যাটার্ন যেন একে অপরের ওপর না পড়ে, তাই এআই নিরাপদ কাটিং গ্যাপ রাখে।",
    whyRotation:
      "প্যাটার্ন ঘোরালে কাপড়ের ব্যবহার উন্নত হতে পারে, তবে গ্রেইন লাইন ও কাপড়ের ডিজাইন অনুমতি দিলে তবেই এটি ব্যবহার করা উচিত।",
    coachTitle: "এআই কোচ",
    coachGood:
      "ভালো নেস্টিং ফলাফল। প্যাটার্নগুলো কাপড়ের প্রস্থ দক্ষতার সঙ্গে ব্যবহার করছে।",
    coachMedium:
      "মার্কারটি গ্রহণযোগ্য, তবে এআই ঘোরানোর বিকল্প বা নিরাপদভাবে কম গ্যাপ পরীক্ষা করার পরামর্শ দিচ্ছে।",
    coachLow:
      "কাপড়ের ব্যবহার কম। কাপড়ের প্রস্থ, প্যাটার্নের দিক এবং কাটিং গ্যাপ পরীক্ষা করুন।",
    grainWarning:
      "বাণিজ্যিক নির্দেশনা: একমুখী কাপড়, চেক, স্ট্রাইপ, ন্যাপ অথবা বাধ্যতামূলক গ্রেইন লাইনের ক্ষেত্রে রোটেশন বন্ধ রাখতে হবে।",
    demoNotice:
      "এটি একটি ভিজ্যুয়াল পাইলট প্রদর্শনী। বাণিজ্যিক ইঞ্জিন আয়তাকার অনুমানের পরিবর্তে সঠিক ট্রেস করা পলিগন ব্যবহার করবে।",
    ready: "এআই নেস্টিং প্রস্তুত হয়েছে।",
    noResult:
      "উৎপাদনের তথ্য লিখে এআই নেস্টিং তৈরি করুন বাটনে ক্লিক করুন।",
    placed: "স্থাপন হয়েছে",
    notPlaced: "স্থাপন হয়নি",
    inches: "ইঞ্চি",
  },
};

export default function AiNestingDemoPage() {
  const [language, setLanguage] = useState<Language>("en");

  const [fabricWidth, setFabricWidth] = useState(60);
  const [patternWidth, setPatternWidth] = useState(18);
  const [patternHeight, setPatternHeight] = useState(26);
  const [quantity, setQuantity] = useState(8);
  const [gap, setGap] = useState(0.5);
  const [allowRotation, setAllowRotation] = useState(true);

  const [generated, setGenerated] = useState(false);

  const t = translations[language];

  const nestingResult = useMemo(() => {
    const safeFabricWidth = Math.max(1, fabricWidth);
    const safePatternWidth = Math.max(1, patternWidth);
    const safePatternHeight = Math.max(1, patternHeight);
    const safeQuantity = Math.max(1, Math.floor(quantity));
    const safeGap = Math.max(0, gap);

    const normalAcross = Math.max(
      1,
      Math.floor(
        (safeFabricWidth + safeGap) / (safePatternWidth + safeGap)
      )
    );

    const rotatedAcross = Math.max(
      1,
      Math.floor(
        (safeFabricWidth + safeGap) / (safePatternHeight + safeGap)
      )
    );

    const useRotated =
      allowRotation &&
      rotatedAcross > normalAcross &&
      safePatternHeight <= safeFabricWidth;

    const pieceWidth = useRotated ? safePatternHeight : safePatternWidth;
    const pieceHeight = useRotated ? safePatternWidth : safePatternHeight;

    const piecesPerRow = Math.max(
      1,
      Math.floor((safeFabricWidth + safeGap) / (pieceWidth + safeGap))
    );

    const rows = Math.ceil(safeQuantity / piecesPerRow);

    const markerLength =
      rows * pieceHeight + Math.max(0, rows - 1) * safeGap;

    const patternArea =
      safePatternWidth * safePatternHeight * safeQuantity;

    const fabricArea = safeFabricWidth * markerLength;

    const efficiency =
      fabricArea > 0
        ? Math.min(100, (patternArea / fabricArea) * 100)
        : 0;

    const waste = Math.max(0, 100 - efficiency);

    const pieces: NestingPiece[] = [];

    for (let index = 0; index < safeQuantity; index += 1) {
      const row = Math.floor(index / piecesPerRow);
      const column = index % piecesPerRow;

      pieces.push({
        id: index + 1,
        x: column * (pieceWidth + safeGap),
        y: row * (pieceHeight + safeGap),
        width: pieceWidth,
        height: pieceHeight,
        rotated: useRotated,
      });
    }

    return {
      pieces,
      piecesPerRow,
      rows,
      markerLength,
      patternArea,
      fabricArea,
      efficiency,
      waste,
      useRotated,
      placedPieces: pieces.length,
    };
  }, [
    allowRotation,
    fabricWidth,
    gap,
    patternHeight,
    patternWidth,
    quantity,
  ]);

  const coachMessage =
    nestingResult.efficiency >= 80
      ? t.coachGood
      : nestingResult.efficiency >= 65
        ? t.coachMedium
        : t.coachLow;

  const markerScaleX = 760 / Math.max(1, fabricWidth);
  const markerScaleY = Math.min(
    2.7,
    450 / Math.max(1, nestingResult.markerLength)
  );

  const markerHeight = Math.max(
    180,
    nestingResult.markerLength * markerScaleY
  );

  function handleGenerate() {
    setGenerated(true);
  }

  function handleReset() {
    setFabricWidth(60);
    setPatternWidth(18);
    setPatternHeight(26);
    setQuantity(8);
    setGap(0.5);
    setAllowRotation(true);
    setGenerated(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress currentStep={4} />
        <header className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 shadow-2xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                RC1 Mini Pilot · Block 016
              </p>

              <h1 className="text-3xl font-black sm:text-5xl">
                {t.pageTitle}
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
              {t.language}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/optifabric/demo/polygon"
              className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
            >
              ← {t.back}
            </Link>

            <Link
              href="/optifabric/demo/marker-efficiency"
              className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              {t.next} →
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[390px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-2xl font-black">{t.controlTitle}</h2>

              <div className="mt-6 space-y-5">
                <NumberField
                  label={t.fabricWidth}
                  value={fabricWidth}
                  min={20}
                  max={120}
                  step={1}
                  unit={t.fabricWidthUnit}
                  onChange={setFabricWidth}
                />

                <NumberField
                  label={t.patternWidth}
                  value={patternWidth}
                  min={1}
                  max={100}
                  step={0.5}
                  unit={t.inches}
                  onChange={setPatternWidth}
                />

                <NumberField
                  label={t.patternHeight}
                  value={patternHeight}
                  min={1}
                  max={100}
                  step={0.5}
                  unit={t.inches}
                  onChange={setPatternHeight}
                />

                <NumberField
                  label={t.quantity}
                  value={quantity}
                  min={1}
                  max={100}
                  step={1}
                  onChange={setQuantity}
                />

                <NumberField
                  label={t.gap}
                  value={gap}
                  min={0}
                  max={3}
                  step={0.1}
                  unit={t.gapUnit}
                  onChange={setGap}
                />

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950 p-4">
                  <span className="font-semibold text-slate-200">
                    {t.allowRotation}
                  </span>

                  <input
                    type="checkbox"
                    checked={allowRotation}
                    onChange={(event) =>
                      setAllowRotation(event.target.checked)
                    }
                    className="h-5 w-5 accent-cyan-400"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-4 text-lg font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.generate}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                {t.reset}
              </button>
            </div>

            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
              <h2 className="text-xl font-black text-amber-200">
                {t.whyTitle}
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-6 text-amber-50/90">
                <WhyItem title={t.fabricWidth} text={t.whyFabric} />
                <WhyItem
                  title={`${t.patternWidth} / ${t.patternHeight}`}
                  text={t.whyPattern}
                />
                <WhyItem title={t.quantity} text={t.whyQuantity} />
                <WhyItem title={t.gap} text={t.whyGap} />
                <WhyItem
                  title={t.allowRotation}
                  text={t.whyRotation}
                />
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {t.markerPreview}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {generated ? t.ready : t.noResult}
                  </p>
                </div>

                {generated && (
                  <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                    AI NESTING COMPLETE
                  </div>
                )}
              </div>

              <div className="mt-6 overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div
                  className="relative mx-auto overflow-hidden rounded-xl border-2 border-dashed border-cyan-400/60 bg-gradient-to-b from-slate-800 to-slate-900"
                  style={{
                    width: "760px",
                    height: generated ? `${markerHeight}px` : "300px",
                    maxWidth: "100%",
                  }}
                >
                  <div className="absolute left-3 top-3 z-20 rounded-lg bg-slate-950/90 px-3 py-2 text-xs font-bold text-cyan-200">
                    {fabricWidth} {t.inches}
                  </div>

                  {!generated && (
                    <div className="flex h-full items-center justify-center px-8 text-center text-slate-500">
                      {t.noResult}
                    </div>
                  )}

                  {generated &&
                    nestingResult.pieces.map((piece) => {
                      const left = piece.x * markerScaleX;
                      const top = piece.y * markerScaleY;
                      const width = piece.width * markerScaleX;
                      const height = piece.height * markerScaleY;

                      return (
                        <div
                          key={piece.id}
                          className="absolute flex items-center justify-center rounded-lg border-2 border-cyan-300 bg-cyan-400/20 text-xs font-black text-cyan-100 shadow-lg"
                          style={{
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${Math.max(20, width)}px`,
                            height: `${Math.max(20, height)}px`,
                          }}
                        >
                          <div className="text-center">
                            <div>P{piece.id}</div>
                            {piece.rotated && (
                              <div className="mt-1 text-[10px] text-amber-200">
                                90°
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <p className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm leading-6 text-blue-100">
                {t.demoNotice}
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label={t.markerLength}
                value={`${nestingResult.markerLength.toFixed(1)} ${t.inches}`}
                active={generated}
              />

              <MetricCard
                label={t.efficiency}
                value={`${nestingResult.efficiency.toFixed(1)}%`}
                active={generated}
              />

              <MetricCard
                label={t.waste}
                value={`${nestingResult.waste.toFixed(1)}%`}
                active={generated}
              />

              <MetricCard
                label={t.patternArea}
                value={`${nestingResult.patternArea.toFixed(0)} in²`}
                active={generated}
              />

              <MetricCard
                label={t.fabricArea}
                value={`${nestingResult.fabricArea.toFixed(0)} in²`}
                active={generated}
              />

              <MetricCard
                label={t.rows}
                value={`${nestingResult.rows}`}
                active={generated}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <h2 className="text-xl font-black text-emerald-200">
                  {t.coachTitle}
                </h2>

                <p className="mt-4 leading-7 text-emerald-50">
                  {generated ? coachMessage : t.noResult}
                </p>

                {generated && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SmallResult
                      label={t.piecesPlaced}
                      value={`${nestingResult.placedPieces}/${quantity}`}
                    />

                    <SmallResult
                      label={t.rows}
                      value={`${nestingResult.rows}`}
                    />

                    <SmallResult
                      label="Pieces / Row"
                      value={`${nestingResult.piecesPerRow}`}
                    />

                    <SmallResult
                      label="Rotation"
                      value={nestingResult.useRotated ? "90°" : "0°"}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
                <h2 className="text-xl font-black text-rose-200">
                  Engineering Safety
                </h2>

                <p className="mt-4 leading-7 text-rose-50">
                  {t.grainWarning}
                </p>
              </div>
            </section>

            <div className="flex flex-col gap-3 rounded-3xl border border-cyan-500/20 bg-cyan-950/40 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                  Next Pilot Step
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Marker Efficiency Intelligence
                </h2>
              </div>

              <Link
                href="/optifabric/demo/marker-efficiency"
                className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
              >
                {t.next} →
              </Link>
            </div>
          </div>
        </section>
        <div className="mt-8">
  <AIExplanationCard
    title="AI Nesting"
    titleBn="AI নেস্টিং"

    purpose="Arrange pattern pieces to maximise fabric utilisation while maintaining correct engineering rules."

    purposeBn="প্রকৌশলগত নিয়ম বজায় রেখে প্যাটার্নগুলো এমনভাবে সাজানো যাতে কাপড়ের সর্বোচ্চ ব্যবহার নিশ্চিত হয়।"

    why="AI analyses the shape and orientation of every pattern piece to reduce fabric waste and improve marker efficiency."

    whyBn="AI প্রতিটি প্যাটার্নের আকৃতি ও অবস্থান বিশ্লেষণ করে কাপড়ের অপচয় কমায় এবং মার্কারের দক্ষতা বৃদ্ধি করে।"

    bestPractice="Use accurate pattern boundaries and the correct fabric width before generating the nesting layout."

    bestPracticeBn="নেস্টিং করার আগে সঠিক প্যাটার্ন সীমা এবং সঠিক কাপড়ের প্রস্থ নিশ্চিত করুন।"

    commonMistake="Using incomplete pattern boundaries or incorrect fabric width."

    commonMistakeBn="অসম্পূর্ণ প্যাটার্ন সীমা অথবা ভুল কাপড়ের প্রস্থ ব্যবহার করা।"
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
          <span className="border-l border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400">
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
      <p className="mt-1">{text}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <p className="text-sm font-semibold text-slate-400">{label}</p>

      <p
        className={`mt-3 text-3xl font-black ${
          active ? "text-cyan-300" : "text-slate-600"
        }`}
      >
        {active ? value : "—"}
      </p>
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