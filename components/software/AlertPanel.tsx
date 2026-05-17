"use client";

import { useLanguage } from "@/components/software/LanguageProvider";

type AlertPanelProps = {
  title: string;
  message: string;
  severity?: "info" | "warning" | "danger" | string;
};

export default function AlertPanel({
  title,
  message,
  severity = "info",
}: AlertPanelProps) {
  const { language } = useLanguage();

  const styles = {
    info: "border-cyan-200 bg-cyan-50 text-cyan-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-800",
  };

  const severityLabels = {
    en: {
      info: "Information",
      warning: "Warning",
      danger: "Critical Alert",
    },

    bn: {
      info: "তথ্য",
      warning: "সতর্কতা",
      danger: "গুরুতর সতর্কতা",
    },
  };

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${
  styles[severity as keyof typeof styles] || styles.info
}`}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold">
          {title}
        </h3>

        <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
          {
  severityLabels[language][
    severity as keyof typeof severityLabels.en
  ] || severity
}
        </div>
      </div>

      <p className="mt-3 text-sm leading-7">
        {message}
      </p>
    </div>
  );
}