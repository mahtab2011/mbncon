"use client";

import { useLanguage } from "@/components/software/LanguageProvider";

type ScoreRingProps = {
  label: string;
  score: number;
};

export default function ScoreRing({
  label,
  score,
}: ScoreRingProps) {
  const { language } = useLanguage();

  const safeScore = Math.max(
    0,
    Math.min(100, score)
  );

  const scoreLabels = {
    en: {
      excellent: "Excellent",
      good: "Good",
      average: "Average",
      critical: "Critical",
    },

    bn: {
      excellent: "চমৎকার",
      good: "ভাল",
      average: "মাঝারি",
      critical: "গুরুতর",
    },
  };

  let status = scoreLabels[language].critical;

  if (safeScore >= 85) {
    status = scoreLabels[language].excellent;
  } else if (safeScore >= 70) {
    status = scoreLabels[language].good;
  } else if (safeScore >= 50) {
    status = scoreLabels[language].average;
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full border-14 border-cyan-500 bg-cyan-50">
        <span className="text-3xl font-bold text-neutral-950">
          {safeScore}%
        </span>

        <span className="mt-1 text-xs font-bold uppercase tracking-wider text-cyan-700">
          {status}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-neutral-500">
        {label}
      </p>
    </div>
  );
}