"use client";

import { presentationSteps } from "@/lib/optifabric/presentationMode";

interface PresentationProgressProps {
  currentStep: number;
}

export default function PresentationProgress({
  currentStep,
}: PresentationProgressProps) {
  return (
    <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">
          Commercial Pilot Progress
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Follow the complete AI engineering workflow from image upload to
          commercial ROI.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          ছবি আপলোড থেকে ROI পর্যন্ত সম্পূর্ণ AI প্রক্রিয়া।
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {presentationSteps.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={step.title}
                className="flex items-center"
              >
                <div
                  className={`rounded-2xl border px-4 py-3 transition-all duration-300 min-w-[180px]
                  ${
                    completed
                      ? "border-green-500 bg-green-900/40"
                      : active
                      ? "border-cyan-500 bg-cyan-900/40"
                      : "border-slate-700 bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold
                      ${
                        completed
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <div>
                      <h3
                        className={`font-bold
                        ${
                          completed
                            ? "text-green-300"
                            : active
                            ? "text-cyan-300"
                            : "text-slate-300"
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p className="text-xs text-slate-400">
                        {step.titleBn}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-slate-300">
                      {step.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {step.descriptionBn}
                    </p>
                  </div>
                </div>

                {index < presentationSteps.length - 1 && (
                  <div className="mx-2 h-1 w-8 rounded-full bg-slate-700">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        completed ? "w-full bg-green-500" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-800 bg-cyan-950/30 p-4">
        <h3 className="font-bold text-cyan-300">
          Why AI shows this workflow?
        </h3>

        <p className="mt-2 text-sm text-slate-300">
          The progress indicator helps Cutting Masters and Production teams
          understand exactly where they are in the AI engineering process.
          Each completed step increases confidence that the final nesting,
          fabric saving and ROI calculations are based on verified engineering
          data.
        </p>

        <h3 className="mt-4 font-bold text-cyan-300">
          AI এই ধাপগুলো কেন দেখায়?
        </h3>

        <p className="mt-2 text-sm text-slate-300">
          এই অগ্রগতি নির্দেশকটি কাটিং মাস্টার, কাটিং সুপারভাইজার এবং
          প্রোডাকশন টিমকে বুঝতে সাহায্য করে যে তারা AI প্রক্রিয়ার কোন ধাপে
          আছেন। প্রতিটি সম্পন্ন ধাপ নিশ্চিত করে যে পরবর্তী মার্কার, কাপড়
          সাশ্রয় এবং ROI বিশ্লেষণ নির্ভরযোগ্য প্রকৌশলগত তথ্যের উপর ভিত্তি করে
          তৈরি হয়েছে।
        </p>
      </div>
    </section>
  );
}