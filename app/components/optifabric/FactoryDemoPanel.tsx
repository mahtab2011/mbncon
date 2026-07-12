"use client";

interface FactoryDemoPanelProps {
  currentStep: number;
  totalSteps: number;
  autoMode: boolean;
  complete: boolean;
}

export default function FactoryDemoPanel({
  currentStep,
  totalSteps,
  autoMode,
  complete,
}: FactoryDemoPanelProps) {
  const percentage = Math.round(
    (Math.min(currentStep, totalSteps) / totalSteps) * 100
  );

  return (
    <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-6 shadow-2xl">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
            Factory Demonstration
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Executive Command Panel
          </h2>

          <p className="mt-3 max-w-3xl text-slate-300">
            Demonstrates the complete commercial workflow exactly as it will be
            presented to factory owners, buyers and BGMEA.
          </p>

          <p className="mt-2 text-slate-400">
            এই স্ক্রিনে সম্পূর্ণ বাণিজ্যিক উপস্থাপনা প্রদর্শিত হয়।
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-400/30 bg-slate-900/70 p-6 text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
            Progress
          </p>

          <p className="mt-2 text-5xl font-black text-white">
            {percentage}%
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {currentStep} / {totalSteps}
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">

        <StatusCard
          title="Presentation"
          value={complete ? "Finished" : "Running"}
          color={complete ? "green" : "cyan"}
        />

        <StatusCard
          title="Mode"
          value={autoMode ? "Automatic" : "Manual"}
          color={autoMode ? "green" : "amber"}
        />

        <StatusCard
          title="Commercial"
          value="RC1"
          color="cyan"
        />

        <StatusCard
          title="Factory Ready"
          value={complete ? "YES" : "Preparing"}
          color={complete ? "green" : "amber"}
        />

      </div>

    </section>
  );
}

function StatusCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "green" | "cyan" | "amber";
}) {
  const colors = {
    green:
      "border-green-500/30 bg-green-950/30 text-green-300",
    cyan:
      "border-cyan-500/30 bg-cyan-950/30 text-cyan-300",
    amber:
      "border-amber-500/30 bg-amber-950/30 text-amber-300",
  };

  return (
    <div
      className={`rounded-2xl border p-5 text-center ${colors[color]}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em]">
        {title}
      </p>

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}