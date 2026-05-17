"use client";

import { useLanguage } from "@/components/software/LanguageProvider";

type ForecastCardProps = {
  title: string;
  current: string;
  forecast: string;
  accuracy: string;
  note?: string;
};

export default function ForecastCard({
  title,
  current,
  forecast,
  accuracy,
  note,
}: ForecastCardProps) {
  const { language } = useLanguage();

  const labels = {
    en: {
      forecastIntelligence: "Forecast Intelligence",
      current: "Current",
      forecast: "Forecast",
      accuracy: "Accuracy",
    },

    bn: {
      forecastIntelligence: "ফোরকাস্ট ইন্টেলিজেন্স",
      current: "বর্তমান",
      forecast: "পূর্বাভাস",
      accuracy: "নির্ভুলতা",
    },
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
        {labels[language].forecastIntelligence}
      </p>

      <h3 className="mt-2 text-xl font-bold text-neutral-950">
        {title}
      </h3>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs text-neutral-500">
            {labels[language].current}
          </p>

          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {current}
          </p>
        </div>

        <div>
          <p className="text-xs text-neutral-500">
            {labels[language].forecast}
          </p>

          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {forecast}
          </p>
        </div>

        <div>
          <p className="text-xs text-neutral-500">
            {labels[language].accuracy}
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {accuracy}
          </p>
        </div>
      </div>

      {note ? (
  <p className="mt-6 text-sm leading-7 text-neutral-600">
    {note}
  </p>
) : null}
    </div>
  );
}