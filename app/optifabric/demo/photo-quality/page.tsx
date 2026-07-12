"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";

import { evaluatePhotoQuality } from "@/lib/optifabric/photoQualityEngine";
import PresentationProgress from "@/app/components/optifabric/PresentationProgress";
import AIExplanationCard from "@/app/components/optifabric/AIExplanationCard";
import CommercialFooter from "@/app/components/optifabric/CommercialFooter";

type PreviewFile = {
  name: string;
  url: string;
};

export default function PhotoQualityDemoPage() {
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [hasRuler, setHasRuler] = useState(true);
  const [goodLighting, setGoodLighting] = useState(true);
  const [imageBlur, setImageBlur] = useState(12);
  const [patternVisible, setPatternVisible] = useState(96);

  const result = useMemo(
    () =>
      evaluatePhotoQuality({
        imageWidth: 1600,
        imageHeight: 1200,
        hasRuler,
        goodLighting,
        imageBlur,
        patternVisible,
      }),
    [hasRuler, goodLighting, imageBlur, patternVisible]
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!supportedTypes.includes(file.type)) {
      alert(
        "Please upload PDF, JPG, JPEG or PNG only.\n\nশুধুমাত্র PDF, JPG, JPEG অথবা PNG ফাইল আপলোড করুন।"
      );
      event.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert(
        "The file is larger than 20 MB.\n\nফাইলের আকার ২০ MB-এর বেশি।"
      );
      event.target.value = "";
      return;
    }

    if (previewFile?.url) {
      URL.revokeObjectURL(previewFile.url);
    }

    setPreviewFile({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  }

  const levelClasses = {
    EXCELLENT: "border-green-500 bg-green-950 text-green-200",
    GOOD: "border-cyan-500 bg-cyan-950 text-cyan-200",
    ACCEPTABLE: "border-amber-500 bg-amber-950 text-amber-200",
    POOR: "border-red-500 bg-red-950 text-red-200",
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <PresentationProgress currentStep={1} />
        <Link href="/optifabric/demo/upload" className="text-cyan-300">
          ← Back to Upload Guidance
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            PHOTO QUALITY CHECK
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Is This Photo Good Enough for AI?
          </h1>

          <p className="mt-4 max-w-4xl text-lg text-slate-300">
            Upload a pattern photo or PDF. OptiFabric AI will accept reasonable
            photos whenever possible and clearly explain when accuracy may be
            reduced.
          </p>

          <p className="mt-3 max-w-4xl text-lg text-cyan-100">
            প্যাটার্নের ছবি অথবা PDF আপলোড করুন। OptiFabric AI সম্ভব হলে
            গ্রহণযোগ্য ছবি ব্যবহার করবে এবং নির্ভুলতা কমতে পারে কিনা তা সহজ
            ভাষায় জানাবে।
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-black">Upload Test File</h2>
            <p className="mt-2 text-slate-400">
              পরীক্ষার জন্য ফাইল আপলোড করুন
            </p>

            <label className="mt-6 block cursor-pointer rounded-2xl border-2 border-dashed border-cyan-700 bg-slate-800 p-8 text-center hover:border-cyan-400">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />

              <p className="text-4xl">📄</p>
              <p className="mt-3 text-xl font-black">
                Choose PDF, JPG, JPEG or PNG
              </p>
              <p className="mt-2 text-slate-400">
                PDF, JPG, JPEG অথবা PNG নির্বাচন করুন
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Maximum file size: 20 MB
              </p>
            </label>

            {previewFile && (
              <div className="mt-6 rounded-2xl bg-slate-800 p-5">
                <p className="font-bold text-cyan-300">Selected File</p>
                <p className="mt-2 break-all text-slate-200">
                  {previewFile.name}
                </p>

                {previewFile.name.toLowerCase().endsWith(".pdf") ? (
                  <div className="mt-5 rounded-xl bg-slate-950 p-8 text-center">
                    <p className="text-5xl">📄</p>
                    <p className="mt-3 text-slate-300">
                      PDF selected and ready for checking.
                    </p>
                  </div>
                ) : (
                  <div className="relative mt-5 h-[420px] w-full overflow-hidden rounded-xl bg-slate-950">
  <Image
    src={previewFile.url}
    alt="Uploaded pattern preview"
    fill
    unoptimized
    className="object-contain"
  />
</div>
                )}
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-blue-950 p-5">
              <h3 className="font-black text-cyan-300">
                No CAD Experience Required
              </h3>
              <p className="mt-2 text-blue-100">
                This screen is designed to help first-time users check whether
                their photo is usable.
              </p>

              <p className="mt-4 font-black text-cyan-300">
                CAD সফটওয়্যারের পূর্ব অভিজ্ঞতা প্রয়োজন নেই
              </p>
              <p className="mt-2 text-blue-100">
                প্রথমবার ব্যবহারকারীদের ছবি গ্রহণযোগ্য কিনা বুঝতে সহায়তা করার
                জন্য এই ধাপটি তৈরি করা হয়েছে।
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <h2 className="text-2xl font-black">Pilot Quality Controls</h2>
            <p className="mt-2 text-slate-400">
              পাইলট মান যাচাই নিয়ন্ত্রণ
            </p>

            <label className="mt-6 flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <span>
                <span className="block font-bold">12-inch ruler visible</span>
                <span className="text-sm text-slate-400">
                  ১২ ইঞ্চি স্কেল দৃশ্যমান
                </span>
              </span>

              <input
                type="checkbox"
                checked={hasRuler}
                onChange={(event) => setHasRuler(event.target.checked)}
                className="h-5 w-5"
              />
            </label>

            <label className="mt-4 flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <span>
                <span className="block font-bold">Lighting is reasonable</span>
                <span className="text-sm text-slate-400">
                  আলো গ্রহণযোগ্য
                </span>
              </span>

              <input
                type="checkbox"
                checked={goodLighting}
                onChange={(event) => setGoodLighting(event.target.checked)}
                className="h-5 w-5"
              />
            </label>

            <label className="mt-5 block">
              <span className="font-bold">
                Blur level: {imageBlur}
              </span>
              <span className="ml-2 text-sm text-slate-400">
                ঝাপসার মাত্রা
              </span>

              <input
                type="range"
                min="0"
                max="100"
                value={imageBlur}
                onChange={(event) => setImageBlur(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>

            <label className="mt-5 block">
              <span className="font-bold">
                Pattern visible: {patternVisible}%
              </span>
              <span className="ml-2 text-sm text-slate-400">
                প্যাটার্ন দৃশ্যমান
              </span>

              <input
                type="range"
                min="0"
                max="100"
                value={patternVisible}
                onChange={(event) =>
                  setPatternVisible(Number(event.target.value))
                }
                className="mt-3 w-full"
              />
            </label>

            <div
              className={`mt-6 rounded-2xl border p-6 ${
                levelClasses[result.level]
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest">
                    AI Image Quality
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {result.score}%
                  </p>
                </div>

                <div className="rounded-full border border-current px-4 py-2 font-black">
                  {result.level}
                </div>
              </div>

              <p className="mt-5 font-semibold">{result.englishMessage}</p>
              <p className="mt-2">{result.banglaMessage}</p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-5">
                <h3 className="font-black text-cyan-300">
                  Suggestions
                </h3>

                {result.suggestionsEn.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {result.suggestionsEn.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-300">
                    No improvement required.
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <h3 className="font-black text-cyan-300">
                  পরামর্শ
                </h3>

                {result.suggestionsBn.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {result.suggestionsBn.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-300">
                    কোনো পরিবর্তন প্রয়োজন নেই।
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {result.canContinue ? (
                <Link
                  href="/optifabric/demo/boundary-tracing"
                  className="rounded-xl bg-green-500 px-6 py-4 font-black text-slate-950"
                >
                  Continue to AI Analysis / AI বিশ্লেষণে যান
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl bg-red-950 px-6 py-4 font-black text-red-300 opacity-70"
                >
                  Please Retake Photo / আবার ছবি তুলুন
                </button>
              )}

              {result.level === "ACCEPTABLE" && (
                <Link
                  href="/optifabric/demo/boundary-tracing"
                  className="rounded-xl border border-amber-500 px-6 py-4 font-bold text-amber-200"
                >
                  Continue Anyway / তবুও এগিয়ে যান
                </Link>
              )}
            </div>
          </div>
        </section>
        
        <div className="mt-8">
  <AIExplanationCard
    title="Photo Quality Check"
    titleBn="ছবির গুণগত মান পরীক্ষা"

    purpose="Check whether the uploaded photo is suitable for accurate AI analysis."

    purposeBn="আপলোড করা ছবিটি AI-এর সঠিক বিশ্লেষণের জন্য উপযুক্ত কিনা তা যাচাই করা।"

    why="AI needs a clear image to accurately detect the pattern boundary and avoid measurement errors."

    whyBn="AI সঠিকভাবে প্যাটার্নের সীমা শনাক্ত করতে এবং পরিমাপের ভুল এড়াতে পরিষ্কার ছবি প্রয়োজন।"

    bestPractice="Take the photo under good lighting with the full pattern and scale visible."

    bestPracticeBn="ভালো আলোতে পুরো প্যাটার্ন ও স্কেল দৃশ্যমান রেখে ছবি তুলুন।"

    commonMistake="Using blurred, dark, tilted or partially hidden images."

    commonMistakeBn="ঝাপসা, অন্ধকার, কাত করা বা আংশিক ঢাকা ছবি ব্যবহার করা।"
  />
</div>
<div className="mt-8">
  <CommercialFooter />
</div>
      </div>
    </main>
  );
}