"use client";

import { useLanguage } from "@/components/software/LanguageProvider";

export default function ExecutiveDashboardHeader() {
  const { t } = useLanguage();

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
        {t.mbnconIntelligenceModule}
      </p>

      <h1 className="mt-4 text-4xl font-bold text-neutral-900">
        {t.executiveDashboard}
      </h1>

      <p className="mt-5 max-w-5xl text-lg leading-8 text-neutral-600">
        {t.executiveDashboardDescription}
      </p>
    </div>
  );
}