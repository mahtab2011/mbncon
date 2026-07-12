"use client";

interface AppReleaseInfoProps {
  compact?: boolean;
}

const releaseItems = [
  {
    label: "Product",
    labelBn: "পণ্য",
    value: "OptiFabric AI",
  },
  {
    label: "Version",
    labelBn: "সংস্করণ",
    value: "RC1",
  },
  {
    label: "Release Type",
    labelBn: "রিলিজ ধরন",
    value: "Commercial Pilot",
  },
  {
    label: "Platform",
    labelBn: "প্ল্যাটফর্ম",
    value: "Web + Android Preparation",
  },
  {
    label: "Languages",
    labelBn: "ভাষা",
    value: "English + বাংলা",
  },
  {
    label: "Status",
    labelBn: "অবস্থা",
    value: "Factory Demonstration Ready",
  },
];

export default function AppReleaseInfo({
  compact = false,
}: AppReleaseInfoProps) {
  return (
    <section className="rounded-3xl border border-blue-500/30 bg-slate-900 p-5 shadow-xl sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
            App Release Information
          </p>

          <h2 className="mt-2 break-words text-2xl font-black text-white sm:text-3xl">
            OptiFabric AI Commercial Release
          </h2>

          <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-slate-300 sm:text-base">
            Release information for factory demonstrations, BGMEA
            presentations, Play Store preparation and controlled pilot use.
          </p>

          <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-slate-400 sm:text-base">
            কারখানা প্রদর্শন, BGMEA উপস্থাপনা, Play Store প্রস্তুতি এবং
            নিয়ন্ত্রিত পাইলট ব্যবহারের জন্য রিলিজ তথ্য।
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-green-400/30 bg-green-950/30 px-6 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
            Release Status
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            RC1
          </p>

          <p className="mt-1 font-bold text-green-300">
            Commercial Pilot
          </p>
        </div>
      </div>

      <div
        className={`mt-7 grid gap-4 ${
          compact
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {releaseItems.map((item) => (
          <div
            key={item.label}
            className="min-w-0 rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
          >
            <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              {item.label}
            </p>

            <p className="mt-1 break-words text-xs text-slate-500">
              {item.labelBn}
            </p>

            <p className="mt-3 break-words text-lg font-black text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5">
          <p className="font-bold text-amber-300">
            Controlled Pilot Notice
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-slate-300">
            RC1 is intended for demonstrations, controlled factory trials and
            commercial validation before full public release.
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-slate-400">
            RC1 পূর্ণাঙ্গ উন্মুক্ত রিলিজের আগে প্রদর্শন, নিয়ন্ত্রিত কারখানা
            ট্রায়াল এবং বাণিজ্যিক যাচাইয়ের জন্য প্রস্তুত করা হয়েছে।
          </p>
        </div>
      )}
    </section>
  );
}