"use client";

interface PresentationReadinessBarProps {
  completedSteps: number;
  totalSteps: number;
}

export default function PresentationReadinessBar({
  completedSteps,
  totalSteps,
}: PresentationReadinessBarProps) {
  const safeTotal = Math.max(totalSteps, 1);

  const safeCompleted = Math.min(
    Math.max(completedSteps, 0),
    safeTotal
  );

  const progressPercentage = Math.round(
    (safeCompleted / safeTotal) * 100
  );

  const remainingSteps = Math.max(
    safeTotal - safeCompleted,
    0
  );

  const isComplete = safeCompleted >= safeTotal;

  return (
    <section className="rounded-3xl border border-cyan-500/30 bg-slate-900 p-5 shadow-xl sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            Presentation Readiness
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {isComplete
              ? "Factory Demonstration Ready"
              : "Commercial Presentation in Progress"}
          </h2>

          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            {isComplete
              ? "All commercial workflow stages have been completed."
              : "Complete each AI engineering stage to finish the presentation."}
          </p>

          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            {isComplete
              ? "সকল বাণিজ্যিক কার্যপ্রবাহের ধাপ সম্পন্ন হয়েছে।"
              : "প্রেজেন্টেশন সম্পন্ন করতে প্রতিটি AI ইঞ্জিনিয়ারিং ধাপ শেষ করুন।"}
          </p>
        </div>

        <div
          className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 text-center shadow-lg ${
            isComplete
              ? "border-green-400 bg-green-950/50"
              : "border-cyan-400 bg-cyan-950/50"
          }`}
        >
          <div>
            <p
              className={`text-2xl font-black ${
                isComplete
                  ? "text-green-300"
                  : "text-cyan-300"
              }`}
            >
              {progressPercentage}%
            </p>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ready
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-4 text-sm">
          <p className="font-semibold text-slate-300">
            Commercial Pilot Progress
          </p>

          <p className="font-bold text-cyan-300">
            {safeCompleted} / {safeTotal}
          </p>
        </div>

        <div className="h-4 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isComplete
                ? "bg-green-400"
                : "bg-cyan-400"
            }`}
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-green-500/20 bg-green-950/20 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-300">
            Completed
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {safeCompleted}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            Remaining
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {remainingSteps}
          </p>
        </div>

        <div
          className={`rounded-2xl border p-4 text-center ${
            isComplete
              ? "border-green-500/30 bg-green-950/30"
              : "border-cyan-500/20 bg-cyan-950/20"
          }`}
        >
          <p
            className={`text-xs font-bold uppercase tracking-[0.18em] ${
              isComplete
                ? "text-green-300"
                : "text-cyan-300"
            }`}
          >
            Status
          </p>

          <p className="mt-2 text-lg font-black text-white">
            {isComplete ? "Factory Ready" : "In Progress"}
          </p>
        </div>
      </div>

      {isComplete && (
        <div className="mt-6 rounded-2xl border border-green-400/30 bg-green-950/30 p-5 text-center">
          <p className="text-lg font-black text-green-300">
            ✓ RC1 Commercial Pilot Complete
          </p>

          <p className="mt-2 text-sm text-slate-300">
            The presentation is ready for BGMEA, factory owners,
            buyers and investors.
          </p>

          <p className="mt-1 text-sm text-slate-400">
            প্রেজেন্টেশনটি BGMEA, কারখানার মালিক, ক্রেতা এবং
            বিনিয়োগকারীদের সামনে প্রদর্শনের জন্য প্রস্তুত।
          </p>
        </div>
      )}
    </section>
  );
}