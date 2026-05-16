"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function DashboardShell({
  title,
  subtitle,
  children,
}: DashboardShellProps) {
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const labels = {
    en: {
      platform: "MBNCON Manufacturing Intelligence Platform",
      home: "Home",
      software: "Software",
      language: "বাংলা",
      confidentiality: "Confidential Enterprise Demo",
    },

    bn: {
      platform: "এমবিএনকন ম্যানুফ্যাকচারিং ইন্টেলিজেন্স প্ল্যাটফর্ম",
      home: "হোম",
      software: "সফটওয়্যার",
      language: "English",
      confidentiality: "গোপনীয় এন্টারপ্রাইজ ডেমো",
    },
  };

  const t = labels[language];

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              {t.platform}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-neutral-950">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-3 max-w-4xl text-base text-neutral-600">
                {subtitle}
              </p>
            ) : null}

            <p className="mt-2 text-xs text-neutral-500">
              {t.confidentiality}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-cyan-500 hover:text-cyan-700"
            >
              {t.home}
            </Link>

            <Link
              href="/software"
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-cyan-500 hover:text-cyan-700"
            >
              {t.software}
            </Link>

            <button
              type="button"
              onClick={() =>
                setLanguage((current) =>
                  current === "en" ? "bn" : "en"
                )
              }
              className="rounded-full border border-cyan-300 bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-200"
            >
              {t.language}
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">{children}</div>
    </main>
  );
}