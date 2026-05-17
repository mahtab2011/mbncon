"use client";

import Link from "next/link";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function Topbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6 md:py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 md:text-xs">
            {t.executiveDashboard}
          </p>

          <h2 className="truncate text-lg font-bold text-neutral-900 md:text-xl">
            {t.executiveCommandCenter}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/software#modules"
            className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
          >
            Modules
          </Link>

          <Link
            href="/software/training-manual"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            Manual
          </Link>

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

          <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 xl:block">
            {t.aiRiskActive}
          </div>

          <div className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 xl:block">
            {t.forecastEngineReady}
          </div>

          <div className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 xl:block">
            v1 Launch: 18 May 2026
          </div>
        </div>
      </div>
    </header>
  );
}