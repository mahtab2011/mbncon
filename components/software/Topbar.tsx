"use client";

import { useLanguage } from "@/components/software/LanguageProvider";

export default function Topbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {t.executiveDashboard}
          </p>

          <h2 className="text-xl font-bold text-neutral-900">
            {t.executiveCommandCenter}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              language === "en"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => setLanguage("bn")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              language === "bn"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            বাংলা
          </button>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {t.aiRiskActive}
          </div>

          <div className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            {t.forecastEngineReady}
          </div>

          <div className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">
            v1 Launch: 18 May 2026
          </div>
        </div>
      </div>
    </header>
  );
}