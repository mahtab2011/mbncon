"use client";

interface PresentationSpeakerPanelProps {
  elapsedSeconds: number;
  currentStep: number;
  totalSteps: number;
  currentTitle: string;
  currentTitleBn: string;
  nextTitle?: string;
  nextTitleBn?: string;
  noteEn: string;
  noteBn: string;
  secondsPerStep: number;
  isRunning: boolean;
  isComplete: boolean;
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export default function PresentationSpeakerPanel({
  elapsedSeconds,
  currentStep,
  totalSteps,
  currentTitle,
  currentTitleBn,
  nextTitle,
  nextTitleBn,
  noteEn,
  noteBn,
  secondsPerStep,
  isRunning,
  isComplete,
}: PresentationSpeakerPanelProps) {
  const safeCurrentStep = Math.min(Math.max(currentStep, 0), totalSteps);

  const remainingSteps = Math.max(totalSteps - safeCurrentStep, 0);

  const estimatedRemainingSeconds = isComplete
    ? 0
    : remainingSteps * Math.max(secondsPerStep, 0);

  return (
    <section className="rounded-3xl border border-violet-500/30 bg-slate-900 p-5 shadow-xl sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
            Live Presentation Assistant
          </p>

          <h2 className="mt-2 break-words text-2xl font-black text-white sm:text-3xl">
            Speaker Notes & Timing
          </h2>

          <p className="mt-2 break-words text-sm leading-6 text-slate-400 sm:text-base">
            Use the suggested notes to explain each OptiFabric AI engineering
            stage clearly.
          </p>

          <p className="mt-1 break-words text-sm leading-6 text-slate-500 sm:text-base">
            প্রতিটি OptiFabric AI ইঞ্জিনিয়ারিং ধাপ সহজভাবে ব্যাখ্যা করতে
            প্রস্তাবিত বক্তব্য ব্যবহার করুন।
          </p>
        </div>

        <span
          className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${
            isComplete
              ? "border-green-400/40 bg-green-400/10 text-green-300"
              : isRunning
              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
              : "border-slate-600 bg-slate-800 text-slate-300"
          }`}
        >
          {isComplete
            ? "Presentation Complete"
            : isRunning
            ? "Timer Running"
            : "Timer Paused"}
        </span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Elapsed Time"
          labelBn="অতিবাহিত সময়"
          value={formatTime(elapsedSeconds)}
        />

        <Metric
          label="Current Step"
          labelBn="বর্তমান ধাপ"
          value={
            isComplete
              ? `${totalSteps}/${totalSteps}`
              : `${Math.min(safeCurrentStep + 1, totalSteps)}/${totalSteps}`
          }
        />

        <Metric
          label="Remaining Time"
          labelBn="অবশিষ্ট সময়"
          value={formatTime(estimatedRemainingSeconds)}
        />

        <Metric
          label="Mode"
          labelBn="মোড"
          value={isRunning ? "Automatic" : "Manual"}
        />
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Current Presentation Stage
          </p>

          <h3 className="mt-3 break-words text-xl font-black text-white sm:text-2xl">
            {isComplete ? "Commercial Pilot Complete" : currentTitle}
          </h3>

          <p className="mt-2 break-words text-base text-slate-400">
            {isComplete
              ? "বাণিজ্যিক পাইলট সম্পন্ন"
              : currentTitleBn}
          </p>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-950/20 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Next Presentation Stage
          </p>

          <h3 className="mt-3 break-words text-xl font-black text-white sm:text-2xl">
            {isComplete
              ? "Factory Demonstration Ready"
              : nextTitle ?? "Commercial Completion"}
          </h3>

          <p className="mt-2 break-words text-base text-slate-400">
            {isComplete
              ? "কারখানা প্রদর্শনের জন্য প্রস্তুত"
              : nextTitleBn ?? "বাণিজ্যিক সমাপ্তি"}
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-violet-500/20 bg-violet-950/20 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
          Suggested Speech
        </p>

        <p className="mt-4 break-words text-base leading-7 text-slate-200 sm:text-lg">
          “{isComplete ? "OptiFabric AI has now completed all seven commercial engineering stages and is ready for factory demonstration." : noteEn}”
        </p>

        <div className="mt-5 border-t border-violet-500/20 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            প্রস্তাবিত বক্তব্য
          </p>

          <p className="mt-4 break-words text-base leading-7 text-slate-300 sm:text-lg">
            “{isComplete ? "OptiFabric AI এখন সাতটি বাণিজ্যিক ইঞ্জিনিয়ারিং ধাপ সম্পন্ন করেছে এবং কারখানা প্রদর্শনের জন্য প্রস্তুত।" : noteBn}”
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  labelBn,
  value,
}: {
  label: string;
  labelBn: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-center">
      <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs text-slate-500">
        {labelBn}
      </p>

      <p className="mt-3 break-words text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}