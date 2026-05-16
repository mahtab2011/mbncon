"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm">
      <span className="font-semibold text-neutral-600">{t.language}</span>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 font-semibold ${
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
        className={`rounded-full px-3 py-1 font-semibold ${
          language === "bn"
            ? "bg-black text-white"
            : "bg-neutral-100 text-neutral-700"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}