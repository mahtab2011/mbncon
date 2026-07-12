"use client";

interface ExecutiveStat {
  label: string;
  value: string;
  valueBn?: string;
}

const executiveStats: ExecutiveStat[] = [
  {
    label: "AI Modules",
    value: "7",
    valueBn: "৭",
  },
  {
    label: "Pattern Accuracy",
    value: "98%",
    valueBn: "৯৮%",
  },
  {
    label: "Estimated Saving",
    value: "2.85%",
    valueBn: "২.৮৫%",
  },
  {
    label: "Estimated ROI",
    value: "15 Days",
    valueBn: "১৫ দিন",
  },
  {
    label: "Languages",
    value: "English + বাংলা",
  },
  {
    label: "Release",
    value: "Commercial Pilot RC1",
  },
];

export default function ExecutiveRibbon() {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-4 shadow-xl sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {executiveStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
              {stat.label}
            </p>

            <p className="mt-3 text-xl font-black text-white">
              {stat.value}
            </p>

            {stat.valueBn && (
              <p className="mt-1 text-sm text-slate-400">
                {stat.valueBn}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}