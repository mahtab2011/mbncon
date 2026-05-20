"use client";

import Link from "next/link";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function Topbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/98 px-4 py-3 backdrop-blur md:px-6 md:py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/about-mbncon"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            About MBNCON
          </Link>

          <Link
            href="/insights-discussion"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            Insights & Discussion
          </Link>

          <Link
            href="/software#modules"
            className="rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
          >
            Modules
          </Link>

          <Link
            href="/software/training-manual"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            Manual
          </Link>
        </div>

        <div className="min-w-0 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 md:text-xs">
            {t.executiveDashboard}
          </p>

          <h2 className="break-words text-lg font-bold text-neutral-900 md:text-xl">
            {t.executiveCommandCenter}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
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
            type="button"
            onClick={() => setLanguage("bn")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              language === "bn"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            বাংলা
          </button>

          <Link
            href="/contact"
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Contact Us
          </Link>

          <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 2xl:block">
            {t.aiRiskActive}
          </div>

          <div className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 2xl:block">
            {t.forecastEngineReady}
          </div>

          <div className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 2xl:block">
            v1 Launch: 18 May 2026
          </div>
        </div>
      </div>
    </header>
  );
}