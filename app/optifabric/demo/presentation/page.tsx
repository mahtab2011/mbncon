"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import CommercialFooter from "@/app/components/optifabric/CommercialFooter";
import ExecutiveHeader from "@/app/components/optifabric/ExecutiveHeader";
import ExecutiveRibbon from "@/app/components/optifabric/ExecutiveRibbon";
import PresentationReadinessBar from "@/app/components/optifabric/PresentationReadinessBar";
import PresentationSpeakerPanel from "@/app/components/optifabric/PresentationSpeakerPanel";
import FactoryDemoPanel from "@/app/components/optifabric/FactoryDemoPanel";
import AppReleaseInfo from "@/app/components/optifabric/AppReleaseInfo";

const workflow = [
  {
    title: "Pattern Upload",
    titleBn: "প্যাটার্ন আপলোড",
  },
  {
    title: "AI Photo Inspection",
    titleBn: "AI ছবি পরীক্ষা",
  },
  {
    title: "Boundary Tracing",
    titleBn: "বাউন্ডারি ট্রেসিং",
  },
  {
    title: "Polygon Construction",
    titleBn: "পলিগন নির্মাণ",
  },
  {
    title: "AI Nesting",
    titleBn: "AI নেস্টিং",
  },
  {
    title: "Fabric Saving",
    titleBn: "কাপড় সাশ্রয়",
  },
  {
    title: "ROI Intelligence",
    titleBn: "ROI বিশ্লেষণ",
  },
];
const speakerNotes = [
  {
    en: "We begin by uploading a garment pattern photograph. AI first checks whether the image quality is suitable for engineering analysis.",
    bn: "আমরা প্রথমে গার্মেন্টস প্যাটার্নের ছবি আপলোড করি। AI প্রথমে ছবির মান পরীক্ষা করে।",
  },
  {
    en: "AI analyses lighting, scale and image clarity before engineering calculations begin.",
    bn: "AI আলো, স্কেল এবং ছবির স্বচ্ছতা বিশ্লেষণ করে।",
  },
  {
    en: "The operator traces the true cutting boundary while AI continuously validates accuracy.",
    bn: "অপারেটর প্রকৃত কাটিং সীমা নির্বাচন করেন এবং AI তা যাচাই করে।",
  },
  {
    en: "OptiFabric AI converts the traced boundary into an engineering polygon.",
    bn: "OptiFabric AI নির্বাচিত সীমাকে একটি ইঞ্জিনিয়ারিং পলিগনে রূপান্তর করে।",
  },
  {
    en: "AI demonstrates intelligent nesting to reduce fabric waste.",
    bn: "AI কাপড়ের অপচয় কমানোর জন্য স্মার্ট নেস্টিং প্রদর্শন করে।",
  },
  {
    en: "Estimated fabric saving is calculated automatically.",
    bn: "সম্ভাব্য কাপড় সাশ্রয় স্বয়ংক্রিয়ভাবে গণনা করা হয়।",
  },
  {
    en: "Commercial ROI is calculated so management understands financial benefit.",
    bn: "বাণিজ্যিক ROI গণনা করা হয় যাতে ব্যবস্থাপনা আর্থিক লাভ বুঝতে পারে।",
  },
];

const presentationSpeeds = [
  {
    label: "Normal",
    labelBn: "স্বাভাবিক",
    milliseconds: 4000,
  },
  {
    label: "Fast",
    labelBn: "দ্রুত",
    milliseconds: 2500,
  },
  {
    label: "Investor Mode",
    labelBn: "ইনভেস্টর মোড",
    milliseconds: 6000,
  },
];

export default function PresentationModePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [presentationSpeed, setPresentationSpeed] = useState(4000);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pilotComplete = currentStep >= workflow.length;

  useEffect(() => {
    if (!isAutoRunning || pilotComplete) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((previousStep) =>
        Math.min(previousStep + 1, workflow.length)
      );
    }, presentationSpeed);

    return () => window.clearTimeout(timer);
  }, [currentStep, isAutoRunning, pilotComplete, presentationSpeed]);

  useEffect(() => {
    if (pilotComplete) {
      setIsAutoRunning(false);
    }
  }, [pilotComplete]);
useEffect(() => {
  if (!isAutoRunning) {
    return;
  }

  const timer = window.setInterval(() => {
    setElapsedSeconds((previous) => previous + 1);
  }, 1000);

  return () => window.clearInterval(timer);
}, [isAutoRunning]);
  function handleNext() {
    setIsAutoRunning(false);

    setCurrentStep((previousStep) =>
      Math.min(previousStep + 1, workflow.length)
    );
  }

  function handlePrevious() {
    setIsAutoRunning(false);

    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  }

  function handleReset() {
  setIsAutoRunning(false);
  setCurrentStep(0);
  setElapsedSeconds(0);
}
  function handleStartAutoDemo() {
    if (pilotComplete) {
      setCurrentStep(0);
    }

    setIsAutoRunning(true);
  }

  function handlePauseAutoDemo() {
    setIsAutoRunning(false);
  }

  function handleSpeedChange(value: string) {
    setPresentationSpeed(Number(value));
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-3 py-4 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/optifabric"
            className="text-cyan-300 hover:text-cyan-200"
          >
            ← Back to OptiFabric
          </Link>

          <div className="flex flex-wrap gap-2">
            <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
              RC1 Commercial Pilot
            </span>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${
                isAutoRunning
                  ? "border-green-400/40 bg-green-400/10 text-green-300"
                  : "border-slate-600 bg-slate-800 text-slate-300"
              }`}
            >
              {isAutoRunning ? "● Auto Demo Running" : "○ Auto Demo Paused"}
            </span>
          </div>
        </div>

        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-6 shadow-2xl sm:p-8 lg:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            BGMEA Presentation Mode
          </p>

          <h1 className="mt-4 break-words text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            OptiFabric AI
          </h1>

          <p className="mt-4 break-words text-lg font-bold leading-7 text-cyan-200 sm:text-2xl">
            AI Digital Cutting Master & Engineering Assistant
          </p>

          <p className="mt-3 break-words text-base leading-7 text-slate-300 sm:text-lg">
            AI ডিজিটাল কাটিং মাস্টার ও ইঞ্জিনিয়ারিং সহকারী
          </p>

          <p className="mt-6 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg">
            A simplified commercial demonstration for BGMEA, garment factories,
            buyers and investors.
          </p>
        </section>

        <div className="mt-8">
          <ExecutiveHeader />
        </div>

        <div className="mt-8">
          <ExecutiveRibbon />
        </div>

        <div className="mt-8">
          <PresentationReadinessBar
            completedSteps={Math.min(currentStep, workflow.length)}
            totalSteps={workflow.length}
          />
        </div>
<div className="mt-8">
  <PresentationSpeakerPanel
    elapsedSeconds={elapsedSeconds}
    currentStep={currentStep}
    totalSteps={workflow.length}
    currentTitle={
      workflow[Math.min(currentStep, workflow.length - 1)]?.title ??
      "Commercial Complete"
    }
    currentTitleBn={
      workflow[Math.min(currentStep, workflow.length - 1)]?.titleBn ??
      "বাণিজ্যিক সমাপ্তি"
    }
    nextTitle={workflow[currentStep + 1]?.title}
    nextTitleBn={workflow[currentStep + 1]?.titleBn}
    noteEn={
      speakerNotes[Math.min(currentStep, speakerNotes.length - 1)]?.en ??
      ""
    }
    noteBn={
      speakerNotes[Math.min(currentStep, speakerNotes.length - 1)]?.bn ??
      ""
    }
    secondsPerStep={presentationSpeed / 1000}
    isRunning={isAutoRunning}
    isComplete={pilotComplete}
  />
</div>
<div className="mt-8">
  <FactoryDemoPanel
    currentStep={Math.min(currentStep, workflow.length)}
    totalSteps={workflow.length}
    autoMode={isAutoRunning}
    complete={pilotComplete}
  />
</div>
<div className="mt-8">
  <AppReleaseInfo />
</div>
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Estimated Saving" value="2.85%" />

          <MetricCard title="Estimated ROI" value="15 Days" />

          <MetricCard
            title="Progress"
            value={`${Math.min(currentStep, workflow.length)}/${
              workflow.length
            }`}
          />

          <MetricCard
            title="Status"
            value={pilotComplete ? "Factory Ready" : "In Progress"}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="break-words text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                Live Demonstration Controller
              </p>

              <h2 className="mt-2 break-words text-2xl font-black sm:text-3xl">
                Commercial Workflow
              </h2>

              <p className="mt-2 break-words leading-6 text-slate-400">
                Present manually or allow Auto Demo Mode to advance through all
                seven AI engineering stages.
              </p>

              <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                ম্যানুয়ালি উপস্থাপন করুন অথবা অটো ডেমো মোড ব্যবহার করে সাতটি
                AI ইঞ্জিনিয়ারিং ধাপ স্বয়ংক্রিয়ভাবে দেখান।
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
              <p>
                Completed:{" "}
                <span className="font-bold text-green-300">
                  {Math.min(currentStep, workflow.length)}
                </span>
              </p>

              <p className="mt-1">
                Remaining:{" "}
                <span className="font-bold text-amber-300">
                  {Math.max(workflow.length - currentStep, 0)}
                </span>
              </p>

              <p className="mt-1">
                Mode:{" "}
                <span
                  className={`font-bold ${
                    isAutoRunning ? "text-green-300" : "text-cyan-300"
                  }`}
                >
                  {isAutoRunning ? "Automatic" : "Manual"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-4 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Automatic Demo Mode
                </p>

                <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                  Start, pause or control presentation speed
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  অটো ডেমো চালু, বিরতি অথবা উপস্থাপনার গতি নির্বাচন করুন।
                </p>
              </div>

              <div className="w-full lg:w-64">
                <label
                  htmlFor="presentation-speed"
                  className="block text-sm font-bold text-slate-300"
                >
                  Presentation Speed / গতি
                </label>

                <select
                  id="presentation-speed"
                  value={presentationSpeed}
                  onChange={(event) => handleSpeedChange(event.target.value)}
                  disabled={isAutoRunning}
                  className="mt-2 min-h-14 w-full rounded-2xl border border-slate-600 bg-slate-950 px-4 py-3 font-bold text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {presentationSpeeds.map((speed) => (
                    <option
                      key={speed.label}
                      value={speed.milliseconds}
                    >
                      {speed.label} / {speed.labelBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleStartAutoDemo}
                disabled={isAutoRunning}
                className="min-h-14 w-full touch-manipulation rounded-2xl bg-green-500 px-4 py-4 font-black text-white hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                ▶ Start Auto Demo
              </button>

              <button
                type="button"
                onClick={handlePauseAutoDemo}
                disabled={!isAutoRunning}
                className="min-h-14 w-full touch-manipulation rounded-2xl border border-amber-500/40 bg-amber-950/30 px-4 py-4 font-black text-amber-300 hover:bg-amber-900/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ⏸ Pause Demo
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="min-h-14 w-full touch-manipulation rounded-2xl border border-slate-600 bg-slate-800 px-4 py-4 font-black text-white hover:bg-slate-700"
              >
                ⏹ Reset Demo
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-bold text-slate-300">
                  Auto Demo Status
                </p>

                <p
                  className={`font-black ${
                    isAutoRunning ? "text-green-300" : "text-slate-400"
                  }`}
                >
                  {isAutoRunning
                    ? "Running / চলছে"
                    : pilotComplete
                    ? "Complete / সম্পন্ন"
                    : "Paused / বিরত"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {workflow.map((step, index) => {
              const completed = index < currentStep;
              const active = index === currentStep && !pilotComplete;
              const pending = !completed && !active;

              return (
                <div
                  key={step.title}
                  className={`flex min-w-0 flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                    completed
                      ? "border-green-500/40 bg-green-950/30"
                      : active
                      ? "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/30"
                      : "border-slate-700 bg-slate-800/60"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-black ${
                        completed
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`break-words font-bold ${
                          completed
                            ? "text-green-300"
                            : active
                            ? "text-cyan-300"
                            : "text-slate-300"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                        {step.titleBn}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
                      completed
                        ? "bg-green-600 text-white"
                        : active
                        ? "bg-cyan-400 text-slate-950"
                        : pending
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {completed ? "Complete" : active ? "Current" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-slate-700 pt-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Manual Presentation Controls
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isAutoRunning}
                className="min-h-14 w-full touch-manipulation rounded-2xl border border-slate-600 bg-slate-800 px-4 py-4 font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous Step
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="min-h-14 w-full touch-manipulation rounded-2xl border border-amber-500/40 bg-amber-950/30 px-4 py-4 font-bold text-amber-300 hover:bg-amber-900/40"
              >
                Reset Presentation
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={pilotComplete || isAutoRunning}
                className="min-h-14 w-full touch-manipulation rounded-2xl bg-cyan-400 px-4 py-4 font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {currentStep === workflow.length - 1
                  ? "Complete Pilot ✓"
                  : pilotComplete
                  ? "Pilot Complete"
                  : "Next Step →"}
              </button>
            </div>
          </div>
        </section>

        <section
          className={`mt-8 rounded-3xl border p-6 text-center transition-all sm:p-10 ${
            pilotComplete
              ? "border-green-400/40 bg-gradient-to-r from-emerald-900 to-green-900"
              : "border-blue-500/30 bg-gradient-to-r from-blue-950 to-slate-900"
          }`}
        >
          <p className="break-words text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
            Commercial Readiness
          </p>

          <h2 className="mt-4 break-words text-2xl font-black leading-tight sm:text-4xl">
            {pilotComplete
              ? "Ready for Factory Demonstration"
              : isAutoRunning
              ? "Automatic Presentation Running"
              : "Presentation in Progress"}
          </h2>

          <p className="mt-4 break-words text-base leading-7 text-slate-200 sm:text-lg">
            {pilotComplete
              ? "All seven AI engineering stages have been demonstrated."
              : isAutoRunning
              ? "OptiFabric AI is automatically advancing through the commercial workflow."
              : "Continue through the workflow to complete the commercial pilot."}
          </p>

          <p className="mt-2 break-words text-base leading-7 text-slate-300">
            {pilotComplete
              ? "সকল সাতটি AI ইঞ্জিনিয়ারিং ধাপ সফলভাবে প্রদর্শিত হয়েছে।"
              : isAutoRunning
              ? "OptiFabric AI স্বয়ংক্রিয়ভাবে বাণিজ্যিক কার্যপ্রবাহের ধাপগুলো প্রদর্শন করছে।"
              : "বাণিজ্যিক পাইলট সম্পন্ন করতে পরবর্তী ধাপে এগিয়ে যান।"}
          </p>

          {pilotComplete && (
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/optifabric/demo/upload"
                className="w-full touch-manipulation rounded-2xl bg-white px-5 py-4 text-center font-black text-slate-950 hover:bg-slate-200 sm:w-auto sm:px-7"
              >
                Open Full Factory Demo
              </Link>

              <Link
                href="/optifabric/demo/roi"
                className="w-full touch-manipulation rounded-2xl border border-white/40 px-5 py-4 text-center font-black text-white hover:bg-white/10 sm:w-auto sm:px-7"
              >
                View ROI Intelligence
              </Link>
            </div>
          )}
        </section>

        <div className="mt-8">
          <CommercialFooter />
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-3xl border border-slate-700 bg-slate-900 p-5 text-center shadow-xl sm:p-6">
      <p className="break-words text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
        {title}
      </p>

      <h2 className="mt-4 break-words text-2xl font-black sm:text-4xl">
        {value}
      </h2>
    </div>
  );
}