"use client";

import Link from "next/link";
import AIGuidancePanel from "@/app/components/optifabric/AIGuidancePanel";
import AICoach from "@/app/components/optifabric/AICoach";

const workflow = [
  "Upload one pattern file",
  "AI checks PDF, JPG, JPEG or PNG format",
  "AI detects the 12-inch calibration scale",
  "AI traces polygon boundaries",
  "AI identifies grain line",
  "AI detects notches",
  "AI performs polygon nesting",
  "AI estimates fabric consumption",
  "AI generates engineering recommendations",
];

export default function UploadYourPatternPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/optifabric/demo/results" className="text-cyan-300">
          ← Back to Results
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            NEXT STEP
          </p>

          <h1 className="mt-4 text-5xl font-black">
            Upload Your Own Pattern
          </h1>

          <p className="mt-6 max-w-4xl text-xl text-slate-300">
            No CAD experience is required. OptiFabric AI will guide the cutting
            master step by step in English and Bangla.
          </p>

          <p className="mt-3 max-w-4xl text-lg text-cyan-100">
            CAD সফটওয়্যারের পূর্ব অভিজ্ঞতা প্রয়োজন নেই। OptiFabric AI
            প্রতিটি ধাপে সহজ ভাষায় নির্দেশনা দেবে।
          </p>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-8">
            <h2 className="text-3xl font-black">What You Upload</h2>
            <p className="mt-2 text-lg text-slate-400">আপনি যা আপলোড করবেন</p>

            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-slate-800 p-5">
                <p className="font-semibold">
                  📄 One pattern file at a time
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  এক সময়ে একটি প্যাটার্ন ফাইল
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="font-semibold">
                  ✅ Supported: PDF, JPG, JPEG, PNG
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  গ্রহণযোগ্য ফরম্যাট: PDF, JPG, JPEG, PNG
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="font-semibold">
                  📏 12-inch ruler beside the pattern
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  প্যাটার্নের পাশে ১২ ইঞ্চি স্কেল রাখুন
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="font-semibold">🧵 Fabric width</p>
                <p className="mt-1 text-sm text-slate-400">
                  কাপড়ের প্রস্থ
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="font-semibold">
                  🚫 Folder or ZIP upload is not available in this pilot
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  এই পাইলটে ফোল্ডার বা ZIP আপলোড করা যাবে না
                </p>
              </div>
            </div>
          </div>

          <AICoach
            stepNumber={1}
            totalSteps={8}
            stepTitleEn="Upload Pattern"
            stepTitleBn="প্যাটার্ন আপলোড করুন"
            instructionEn="Upload one pattern piece in PDF, JPG, JPEG or PNG format."
            instructionBn="PDF, JPG, JPEG অথবা PNG ফরম্যাটে একটি প্যাটার্ন অংশ আপলোড করুন।"
            whyEn="AI uses one clear pattern piece and the ruler to calculate the real dimensions before planning the marker."
            whyBn="AI স্কেলের সাহায্যে প্যাটার্নের প্রকৃত মাপ নির্ণয় করে মার্কার পরিকল্পনা করার জন্য একবারে একটি পরিষ্কার প্যাটার্ন অংশ চায়।"
            checklistEn={[
              "One pattern piece only",
              "PDF, JPG, JPEG or PNG",
              "12-inch ruler clearly visible",
              "Entire pattern visible",
              "Good lighting",
              "Photo taken directly from above",
            ]}
            checklistBn={[
              "শুধুমাত্র একটি প্যাটার্ন অংশ",
              "PDF, JPG, JPEG অথবা PNG",
              "১২ ইঞ্চি স্কেল স্পষ্টভাবে দৃশ্যমান",
              "সম্পূর্ণ প্যাটার্ন দৃশ্যমান",
              "পর্যাপ্ত আলো",
              "উপর থেকে সোজাভাবে তোলা ছবি",
            ]}
          />
        </section>

        <div className="mt-8">
          <AIGuidancePanel
            titleEn="Upload Pattern"
            titleBn="প্যাটার্ন আপলোড করুন"
            whatEn="Upload one pattern piece at a time in PDF, JPG, JPEG or PNG format."
            whatBn="এক সময়ে একটি প্যাটার্ন অংশ PDF, JPG, JPEG অথবা PNG ফরম্যাটে আপলোড করুন।"
            whyEn="AI needs one clear pattern piece so it can detect the boundary, measure the real size and calculate fabric consumption accurately."
            whyBn="AI সঠিকভাবে সীমানা শনাক্ত, প্রকৃত মাপ নির্ণয় এবং কাপড়ের ব্যবহার হিসাব করার জন্য একবারে একটি পরিষ্কার প্যাটার্ন অংশ চায়।"
            tipsEn={[
              "No CAD experience is required.",
              "Upload only one pattern piece at a time.",
              "Use PDF, JPG, JPEG or PNG format only.",
              "Place a 12-inch ruler beside the pattern.",
              "Keep the entire pattern inside the photo.",
              "Use good lighting.",
              "Photograph from directly above.",
              "Do not upload folded, blurry or dark images.",
            ]}
            tipsBn={[
              "CAD সফটওয়্যারের পূর্ব অভিজ্ঞতা প্রয়োজন নেই।",
              "এক সময়ে শুধুমাত্র একটি প্যাটার্ন অংশ আপলোড করুন।",
              "শুধুমাত্র PDF, JPG, JPEG অথবা PNG ফরম্যাট ব্যবহার করুন।",
              "প্যাটার্নের পাশে ১২ ইঞ্চি স্কেল রাখুন।",
              "সম্পূর্ণ প্যাটার্ন ছবির মধ্যে রাখুন।",
              "পর্যাপ্ত আলো ব্যবহার করুন।",
              "উপর থেকে সোজাভাবে ছবি তুলুন।",
              "ভাঁজ করা, ঝাপসা বা অন্ধকার ছবি আপলোড করবেন না।",
            ]}
          />
        </div>

        <section className="mt-8 rounded-3xl bg-blue-950 p-8">
          <h2 className="text-3xl font-black">What AI Does</h2>
          <p className="mt-2 text-lg text-blue-200">AI যা করবে</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {workflow.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-xl bg-blue-900 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-slate-950">
                  {index + 1}
                </div>

                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-green-950 p-8">
          <h2 className="text-3xl font-black">Expected AI Output</h2>
          <p className="mt-2 text-lg text-green-200">
            AI থেকে সম্ভাব্য ফলাফল
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl bg-green-900 p-5">
              <p className="font-semibold">✔ Polygon Area</p>
              <p className="mt-1 text-sm text-green-200">
                প্যাটার্নের ক্ষেত্রফল
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5">
              <p className="font-semibold">✔ Marker Efficiency</p>
              <p className="mt-1 text-sm text-green-200">
                মার্কারের দক্ষতা
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5">
              <p className="font-semibold">✔ Fabric Consumption</p>
              <p className="mt-1 text-sm text-green-200">
                কাপড়ের ব্যবহার
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5">
              <p className="font-semibold">✔ Fabric Saving</p>
              <p className="mt-1 text-sm text-green-200">
                কাপড় সাশ্রয়
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5">
              <p className="font-semibold">✔ AI Engineering Advice</p>
              <p className="mt-1 text-sm text-green-200">
                AI ইঞ্জিনিয়ারিং পরামর্শ
              </p>
            </div>

            <div className="rounded-xl bg-green-900 p-5">
              <p className="font-semibold">✔ Professional PDF Report</p>
              <p className="mt-1 text-sm text-green-200">
                পেশাদার PDF রিপোর্ট
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-slate-900 p-10 text-center">
          <h2 className="text-4xl font-black">Ready?</h2>
          <p className="mt-2 text-2xl font-bold text-cyan-200">
            প্রস্তুত?
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-300">
            Upload one clear pattern file and follow the bilingual AI guidance.
            The pilot will then take you to the pattern tracing workflow.
          </p>

          <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-400">
            একটি পরিষ্কার প্যাটার্ন ফাইল আপলোড করুন এবং ইংরেজি ও বাংলা
            নির্দেশনা অনুসরণ করুন। এরপর পাইলট আপনাকে প্যাটার্ন ট্রেসিং ধাপে
            নিয়ে যাবে।
          </p>

          <div className="mt-10">
            <Link
              href="/optifabric/mini-pilot/live-tracing"
              className="inline-block rounded-2xl bg-cyan-400 px-10 py-5 text-xl font-black text-slate-950 hover:bg-cyan-300"
            >
              🚀 Upload My Pattern / প্যাটার্ন আপলোড করুন
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}