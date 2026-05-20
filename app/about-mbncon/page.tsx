"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "en" | "bn";

const content = {
  en: {
    badge: "MBNCON ENTERPRISE INTELLIGENCE PLATFORM",
    title: "About MBN Consulting",
    subtitle:
      "Enterprise Intelligence, Operational Excellence and AI-era business transformation for factories, SMEs and growing organisations.",
    whoTitle: "Who We Are",
    who:
      "MBN Consulting is a London-based Enterprise Intelligence and Operational Excellence initiative focused on helping businesses improve productivity, visibility, leadership decision-making and operational performance through practical AI-driven systems.",
    whyTitle: "Why We Are Here",
    why:
      "Businesses are entering a rapidly changing AI-driven environment. Traditional decision-making is no longer enough. We help enterprises keep pace with change by combining operational experience, Lean thinking, data visibility and AI-driven intelligence.",
    howTitle: "How We Work",
    how:
      "You can share your company details, problem areas and 3–5 years of relevant operational data. We analyse bottlenecks, cost leakages, productivity gaps and risk areas, then propose practical improvement actions and intelligence structures.",
    trustTitle: "Our Trust-Based Approach",
    trust:
      "We do not want rigid commercial pressure. Our aim is enterprise growth. You can implement our suggested processes and evaluate improvement over 3–6 months. If you see measurable value, we can then discuss a fair working relationship.",
    cta: "Discuss Your Operational Challenges",
    home: "Back to Home",
  },
  bn: {
    badge: "এমবিএনকন এন্টারপ্রাইজ ইন্টেলিজেন্স প্ল্যাটফর্ম",
    title: "এমবিএন কনসাল্টিং সম্পর্কে",
    subtitle:
      "কারখানা, এসএমই এবং উন্নয়নশীল প্রতিষ্ঠানের জন্য এন্টারপ্রাইজ ইন্টেলিজেন্স, অপারেশনাল এক্সেলেন্স এবং AI যুগের ব্যবসায়িক রূপান্তর।",
    whoTitle: "আমরা কারা",
    who:
      "MBN Consulting একটি লন্ডনভিত্তিক এন্টারপ্রাইজ ইন্টেলিজেন্স ও অপারেশনাল এক্সেলেন্স উদ্যোগ। আমাদের লক্ষ্য হলো AI-চালিত বাস্তবভিত্তিক সিস্টেমের মাধ্যমে ব্যবসার উৎপাদনশীলতা, দৃশ্যমানতা, নেতৃত্বের সিদ্ধান্ত এবং অপারেশনাল পারফরম্যান্স উন্নত করা।",
    whyTitle: "আমরা কেন এখানে",
    why:
      "ব্যবসা এখন দ্রুত পরিবর্তনশীল AI-চালিত পরিবেশে প্রবেশ করছে। পুরোনো সিদ্ধান্ত গ্রহণের পদ্ধতি আর যথেষ্ট নয়। আমরা প্রতিষ্ঠানগুলোকে অপারেশনাল অভিজ্ঞতা, Lean চিন্তা, ডেটা ভিজিবিলিটি এবং AI-চালিত ইন্টেলিজেন্সের মাধ্যমে প্রতিযোগিতায় এগিয়ে থাকতে সাহায্য করি।",
    howTitle: "আমরা কীভাবে কাজ করি",
    how:
      "আপনি আপনার কোম্পানির তথ্য, সমস্যা ক্ষেত্র এবং গত ৩–৫ বছরের প্রাসঙ্গিক অপারেশনাল ডেটা আমাদের দিতে পারেন। আমরা bottleneck, cost leakage, productivity gap এবং risk area বিশ্লেষণ করে বাস্তবসম্মত উন্নয়ন পরিকল্পনা ও intelligence structure প্রস্তাব করি।",
    trustTitle: "আমাদের বিশ্বাসভিত্তিক পদ্ধতি",
    trust:
      "আমরা কঠোর বাণিজ্যিক চাপ তৈরি করতে চাই না। আমাদের লক্ষ্য প্রতিষ্ঠানের উন্নতি। আপনি আমাদের প্রস্তাবিত প্রক্রিয়া বাস্তবায়ন করে ৩–৬ মাস ফলাফল মূল্যায়ন করতে পারেন। আপনি যদি উন্নতি দেখেন, তখন আমরা ন্যায্য working relationship নিয়ে আলোচনা করতে পারি।",
    cta: "আপনার অপারেশনাল চ্যালেঞ্জ আলোচনা করুন",
    home: "হোমে ফিরে যান",
  },
};

export default function AboutMBNCONPage() {
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
              className={`rounded-full px-4 py-2 text-sm ${
                language === "en"
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/20 text-slate-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("bn")}
              className={`rounded-full px-4 py-2 text-sm ${
                language === "bn"
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/20 text-slate-300"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300">
            {t.badge}
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            {t.subtitle}
          </p>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              {t.cta}
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            { title: t.whoTitle, body: t.who },
            { title: t.whyTitle, body: t.why },
            { title: t.howTitle, body: t.how },
            { title: t.trustTitle, body: t.trust },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">
                {item.title}
              </h2>
              <p className="mt-4 leading-8 text-slate-300">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-3xl font-bold text-white">
            {language === "en"
              ? "Industries We Support"
              : "যেসব খাতে আমরা সহায়তা করি"}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Manufacturing",
              "Garments & Apparel",
              "Footwear",
              "Food Processing",
              "Hospitality",
              "Retail & SMEs",
            ].map((industry) => (
              <div
                key={industry}
                className="rounded-2xl border border-cyan-400/20 bg-slate-950 p-4 text-slate-200"
              >
                {industry}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}