"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "en" | "bn";

const content = {
  en: {
    badge: "MBNCON ENTERPRISE DISCUSSION PLATFORM",
    title: "Operational Insights & Discussion",
    subtitle:
      "A professional space where enterprises, managers, factory owners and professionals can discuss operational challenges, productivity concerns and AI-era business transformation ideas.",

    introTitle: "Why This Space Exists",
    intro:
      "Many businesses face operational challenges but do not always have a structured platform to discuss them openly. This initiative aims to encourage knowledge sharing, operational learning and practical problem-solving discussions.",

    optionalIdentity: "Identity disclosure is optional.",
    optionalIdentityText:
      "You may share your operational concerns anonymously if preferred. Sensitive company details should not be publicly disclosed.",

    approvalTitle: "Admin Approval & Professional Standards",
    approvalText:
      "All discussions, articles and operational submissions are subject to admin review before public visibility to maintain professionalism, confidentiality and constructive engagement.",

    futureTitle: "Future Vision",
    futureText:
      "Over time, this platform aims to become a collaborative enterprise intelligence ecosystem for operational excellence, AI transformation, manufacturing productivity and leadership learning.",

    formTitle: "Share Your Operational Challenge",

    name: "Name (Optional)",
    company: "Company Name (Optional)",
    email: "Email (Optional)",
    problem: "Problem Area",
    details: "Operational Challenge / Discussion",
    submit: "Submit Discussion",

    placeholders: {
      name: "Your name",
      company: "Company or industry",
      email: "your@email.com",
      problem: "Example: Productivity, shipment delay, wastage, workforce issue",
      details:
        "Describe your operational challenge, productivity concern, business transformation idea or discussion topic...",
    },

    home: "Back to Home",
  },

  bn: {
    badge: "এমবিএনকন এন্টারপ্রাইজ ডিসকাশন প্ল্যাটফর্ম",
    title: "অপারেশনাল ইনসাইটস ও আলোচনা",
    subtitle:
      "একটি পেশাদার প্ল্যাটফর্ম যেখানে প্রতিষ্ঠান, ফ্যাক্টরি মালিক, ম্যানেজার এবং পেশাজীবীরা অপারেশনাল সমস্যা, উৎপাদনশীলতা এবং AI যুগের ব্যবসায়িক রূপান্তর নিয়ে আলোচনা করতে পারবেন।",

    introTitle: "এই প্ল্যাটফর্ম কেন",
    intro:
      "অনেক প্রতিষ্ঠান অপারেশনাল সমস্যার সম্মুখীন হয় কিন্তু খোলামেলা ও গঠনমূলকভাবে আলোচনা করার উপযুক্ত প্ল্যাটফর্ম পায় না। এই উদ্যোগের লক্ষ্য হলো জ্ঞান বিনিময়, অপারেশনাল শিক্ষা এবং বাস্তবভিত্তিক সমস্যা সমাধানকে উৎসাহিত করা।",

    optionalIdentity: "পরিচয় প্রকাশ বাধ্যতামূলক নয়।",
    optionalIdentityText:
      "আপনি চাইলে পরিচয় গোপন রেখে আপনার অপারেশনাল সমস্যা শেয়ার করতে পারেন। সংবেদনশীল কোম্পানি তথ্য প্রকাশ না করার অনুরোধ করা হচ্ছে।",

    approvalTitle: "অ্যাডমিন অনুমোদন ও পেশাদার মান",
    approvalText:
      "সকল আলোচনা, আর্টিকেল এবং অপারেশনাল সাবমিশন পাবলিক হওয়ার আগে অ্যাডমিন রিভিউয়ের মাধ্যমে যাবে যাতে পেশাদারিত্ব, গোপনীয়তা এবং গঠনমূলক পরিবেশ বজায় থাকে।",

    futureTitle: "ভবিষ্যৎ পরিকল্পনা",
    futureText:
      "ভবিষ্যতে এই প্ল্যাটফর্ম অপারেশনাল এক্সেলেন্স, AI ট্রান্সফরমেশন, উৎপাদনশীলতা এবং নেতৃত্ব উন্নয়নের জন্য একটি collaborative enterprise intelligence ecosystem এ পরিণত হবে।",

    formTitle: "আপনার অপারেশনাল সমস্যা শেয়ার করুন",

    name: "নাম (ঐচ্ছিক)",
    company: "কোম্পানির নাম (ঐচ্ছিক)",
    email: "ইমেইল (ঐচ্ছিক)",
    problem: "সমস্যার ক্ষেত্র",
    details: "অপারেশনাল সমস্যা / আলোচনা",
    submit: "আলোচনা সাবমিট করুন",

    placeholders: {
      name: "আপনার নাম",
      company: "কোম্পানি বা ইন্ডাস্ট্রি",
      email: "your@email.com",
      problem: "উদাহরণ: উৎপাদনশীলতা, shipment delay, wastage",
      details:
        "আপনার অপারেশনাল সমস্যা, productivity concern বা discussion topic লিখুন...",
    },

    home: "হোমে ফিরে যান",
  },
};

export default function InsightsDiscussionPage() {
  const [language, setLanguage] = useState<Language>("en");

  const t = content[language];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            ← {t.home}
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                language === "en"
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/20 text-slate-300"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLanguage("bn")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                language === "bn"
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/20 text-slate-300"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-8">
          <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300">
            {t.badge}
          </p>

          <h1 className="mt-6 text-4xl font-bold md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300">
            {t.subtitle}
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              title: t.introTitle,
              body: t.intro,
            },
            {
              title: t.optionalIdentity,
              body: t.optionalIdentityText,
            },
            {
              title: t.approvalTitle,
              body: t.approvalText,
            },
            {
              title: t.futureTitle,
              body: t.futureText,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">
                {item.title}
              </h2>

              <p className="mt-4 leading-8 text-slate-300">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-3xl font-bold text-white">
            {t.formTitle}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t.name}
              </label>

              <input
                type="text"
                placeholder={t.placeholders.name}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t.company}
              </label>

              <input
                type="text"
                placeholder={t.placeholders.company}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t.email}
              </label>

              <input
                type="email"
                placeholder={t.placeholders.email}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t.problem}
              </label>

              <input
                type="text"
                placeholder={t.placeholders.problem}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-slate-300">
              {t.details}
            </label>

            <textarea
              rows={8}
              placeholder={t.placeholders.details}
              className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="mt-8">
            <button className="rounded-full bg-cyan-400 px-8 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
              {t.submit}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}