"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "en" | "bn";

const content = {
  en: {
    badge: "MBNCON ENTERPRISE CONTACT PLATFORM",
    title: "Contact MBN Consulting",
    subtitle:
      "Discuss operational challenges, productivity concerns, AI transformation opportunities and enterprise improvement initiatives.",

    introTitle: "How We Can Support",
    intro:
      "We aim to support organisations through operational intelligence, productivity improvement, executive visibility, Lean thinking and AI-driven enterprise transformation.",

    noteTitle: "Confidentiality & Trust",
    note:
      "Company information shared with us will be treated professionally and responsibly. Sensitive information should only be shared when appropriate.",

    consultTitle: "Initial Discussion Approach",
    consult:
      "You may share your operational concerns, business challenges and productivity goals. Based on the information provided, we may suggest potential improvement directions and intelligence-driven approaches.",

    formTitle: "Contact Form",

    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    subject: "Discussion Area",
    message: "Message",

    placeholders: {
      name: "Your name",
      company: "Company name",
      email: "your@email.com",
      phone: "Phone number",
      subject:
        "Example: Productivity, AI transformation, factory visibility",
      message:
        "Please describe your operational challenge, discussion request or business objective...",
    },

    submit: "Send Message",
    home: "Back to Home",
  },

  bn: {
    badge: "এমবিএনকন এন্টারপ্রাইজ কনট্যাক্ট প্ল্যাটফর্ম",
    title: "MBN Consulting এর সাথে যোগাযোগ করুন",
    subtitle:
      "অপারেশনাল সমস্যা, উৎপাদনশীলতা, AI transformation এবং enterprise improvement বিষয়ে আলোচনা করুন।",

    introTitle: "আমরা কীভাবে সহায়তা করতে পারি",
    intro:
      "আমরা operational intelligence, productivity improvement, executive visibility, Lean thinking এবং AI-driven enterprise transformation এর মাধ্যমে প্রতিষ্ঠানগুলোকে সহায়তা করতে চাই।",

    noteTitle: "গোপনীয়তা ও বিশ্বাস",
    note:
      "আপনার কোম্পানির তথ্য দায়িত্বশীলভাবে এবং পেশাদার মান বজায় রেখে পরিচালনা করা হবে। সংবেদনশীল তথ্য সতর্কতার সাথে শেয়ার করার অনুরোধ করা হচ্ছে।",

    consultTitle: "প্রাথমিক আলোচনা পদ্ধতি",
    consult:
      "আপনি আপনার operational concern, business challenge এবং productivity goal শেয়ার করতে পারেন। প্রদত্ত তথ্যের ভিত্তিতে আমরা সম্ভাব্য improvement direction এবং intelligence-driven approach প্রস্তাব করতে পারি।",

    formTitle: "যোগাযোগ ফর্ম",

    name: "নাম",
    company: "কোম্পানি",
    email: "ইমেইল",
    phone: "ফোন",
    subject: "আলোচনার ক্ষেত্র",
    message: "মেসেজ",

    placeholders: {
      name: "আপনার নাম",
      company: "কোম্পানির নাম",
      email: "your@email.com",
      phone: "ফোন নম্বর",
      subject:
        "উদাহরণ: Productivity, AI transformation, factory visibility",
      message:
        "আপনার operational challenge বা business objective লিখুন...",
    },

    submit: "মেসেজ পাঠান",
    home: "হোমে ফিরে যান",
  },
};

export default function ContactPage() {
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

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: t.introTitle,
              body: t.intro,
            },
            {
              title: t.noteTitle,
              body: t.note,
            },
            {
              title: t.consultTitle,
              body: t.consult,
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
                {t.phone}
              </label>

              <input
                type="text"
                placeholder={t.placeholders.phone}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-slate-300">
              {t.subject}
            </label>

            <input
              type="text"
              placeholder={t.placeholders.subject}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-slate-300">
              {t.message}
            </label>

            <textarea
              rows={8}
              placeholder={t.placeholders.message}
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