"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "bn";

export default function EnterpriseSetupCentre() {
  const [lang, setLang] = useState<Lang>("en");

  const t = {
    en: {
      title: "Enterprise Setup Centre",
      subtitle:
        "Master configuration system for factories, buyers, styles, products and operations",
      description:
        "This module controls all master data used across MBNCON including production, quality, costing, risk and supply chain intelligence.",
      sections: {
        business: "Business Structure",
        commercial: "Commercial Setup",
        supply: "Supply Chain Setup",
        production: "Production Setup",
        quality: "Quality Setup",
        hr: "Human Resource Setup",
      },
      actions: "Manage",
      add: "+ Add New",
    },

    bn: {
      title: "এন্টারপ্রাইজ সেটআপ সেন্টার",
      subtitle:
        "কারখানা, ক্রেতা, স্টাইল, পণ্য এবং অপারেশন মাস্টার কনফিগারেশন সিস্টেম",
      description:
        "এই মডিউলটি MBNCON এর সমস্ত মাস্টার ডাটা নিয়ন্ত্রণ করে যা প্রোডাকশন, কোয়ালিটি, কস্টিং, রিস্ক এবং সাপ্লাই চেইন ইন্টেলিজেন্সে ব্যবহৃত হয়।",
      sections: {
        business: "ব্যবসায়িক কাঠামো",
        commercial: "বাণিজ্যিক সেটআপ",
        supply: "সাপ্লাই চেইন সেটআপ",
        production: "উৎপাদন সেটআপ",
        quality: "মান নিয়ন্ত্রণ সেটআপ",
        hr: "মানব সম্পদ সেটআপ",
      },
      actions: "পরিচালনা",
      add: "+ নতুন যোগ করুন",
    },
  }[lang];

  const cards = [
    {
      title: lang === "en" ? "Factory Setup" : "কারখানা সেটআপ",
    },
    {
      title: lang === "en" ? "Buyer Setup" : "ক্রেতা সেটআপ",
    },
    {
      title: lang === "en" ? "Style Setup" : "স্টাইল সেটআপ",
    },
    {
      title: lang === "en" ? "Product Setup" : "পণ্য সেটআপ",
    },
    {
      title: lang === "en" ? "Supplier Setup" : "সরবরাহকারী সেটআপ",
    },
    {
      title: lang === "en" ? "Operation Setup" : "অপারেশন সেটআপ",
    },
    {
      title: lang === "en" ? "Defect Setup" : "ত্রুটি সেটআপ",
    },
    {
      title: lang === "en" ? "Employee Setup" : "কর্মচারী সেটআপ",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">{t.title}</h1>
            <p className="mt-2 text-cyan-300">{t.subtitle}</p>
          </div>

          {/* Language Switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-2 rounded-xl ${
                lang === "en" ? "bg-cyan-400 text-black" : "bg-slate-800"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLang("bn")}
              className={`px-4 py-2 rounded-xl ${
                lang === "bn" ? "bg-cyan-400 text-black" : "bg-slate-800"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-slate-300 max-w-4xl">
          {t.description}
        </p>

        {/* Setup Grid */}
        <section className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-cyan-400/40 transition"
            >
              <h3 className="text-lg font-bold">{c.title}</h3>

              <p className="mt-2 text-sm text-slate-400">
                {lang === "en"
                  ? "Manage master data"
                  : "মাস্টার ডাটা পরিচালনা করুন"}
              </p>

              <button className="mt-4 w-full rounded-xl bg-cyan-400 text-black py-2 font-bold">
                {t.actions}
              </button>
            </div>
          ))}
        </section>

        {/* Footer Insight */}
        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            {lang === "en"
              ? "Why this module matters"
              : "এই মডিউল কেন গুরুত্বপূর্ণ"}
          </h2>

          <p className="mt-3 text-sm text-slate-200">
            {lang === "en"
              ? "All production, quality, costing, risk and supply chain intelligence depend on consistent master data. This ensures no duplication, no inconsistency and clean analytics across the system."
              : "প্রোডাকশন, কোয়ালিটি, কস্টিং, রিস্ক এবং সাপ্লাই চেইন ইন্টেলিজেন্স সবই নির্ভর করে একক ও সঠিক মাস্টার ডাটার উপর। এটি ডুপ্লিকেশন এবং ডাটা অসামঞ্জস্য দূর করে।"}
          </p>
        </section>

      </div>
    </main>
  );
}