"use client";

import { useLanguage } from "@/components/software/LanguageProvider";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  risk?: RiskLevel | string;
};

export default function KpiCard({
  title,
  value,
  change,
  risk,
}: KpiCardProps) {
  const { language } = useLanguage();

  const riskStyles: Record<RiskLevel, string> = {
    Low: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-red-100 text-red-700",
    Critical: "bg-black text-white",
  };

  const riskText: Record<"en" | "bn", Record<RiskLevel, string>> = {
    en: {
      Low: "Low Risk",
      Medium: "Medium Risk",
      High: "High Risk",
      Critical: "Critical Risk",
    },
    bn: {
      Low: "কম ঝুঁকি",
      Medium: "মাঝারি ঝুঁকি",
      High: "উচ্চ ঝুঁকি",
      Critical: "গুরুতর ঝুঁকি",
    },
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>

          <h3 className="mt-3 text-4xl font-bold text-neutral-950">
            {value}
          </h3>

          {change ? (
            <p className="mt-3 text-sm font-semibold text-cyan-700">
              {change}
            </p>
          ) : null}
        </div>

        {risk ? (
          <div
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              riskStyles[risk as RiskLevel] ||
              "bg-neutral-200 text-neutral-700"
            }`}
          >
            {riskText[language][risk as RiskLevel] || risk}
          </div>
        ) : null}
      </div>
    </div>
  );
}