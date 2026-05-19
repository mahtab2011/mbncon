"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const content = {
  en: {
    title: "Risk Escalation Entry",
    eyebrow: "MBNCON Risk Escalation Intelligence",
    subtitle:
      "Track operational escalation, shipment risks, buyer escalation, financial exposure, unresolved critical issues, and corrective action accountability.",
    save: "Save Escalation Record",
    saving: "Saving...",
    success: "Risk escalation record saved successfully.",

    cards: [
      {
        title: "Critical Issue",
        value: "Escalated",
        desc: "Capture unresolved operational risks before they damage delivery, buyer confidence, or profitability.",
        target: "Escalation Record Form",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "Financial Exposure",
        value: "Visible",
        desc: "Track cost, claim, penalty, air shipment, and commercial exposure for executive attention.",
        target: "Risk Intelligence Layer",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Accountability",
        value: "Assigned",
        desc: "Record responsible person, target closure date, corrective action, and management decision.",
        target: "Risk Intelligence Layer",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Executive Action",
        value: "Ready",
        desc: "Support director-level escalation review and risk closure discipline.",
        target: "Executive Escalation UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "Escalation Record Form",
      intelligence: "Risk Intelligence Layer",
      ux: "Executive Escalation UX",
    },

    fields: {
      period: "Reporting Period",
      escalationId: "Escalation ID",
      escalationType: "Escalation Type",
      department: "Department",
      issueTitle: "Issue Title",
      issueDescription: "Issue Description",
      severityLevel: "Severity Level",
      financialExposure: "Financial Exposure",
      shipmentImpact: "Shipment Impact",
      buyerImpact: "Buyer Impact",
      operationalImpact: "Operational Impact",
      rootCause: "Root Cause",
      responsiblePerson: "Responsible Person",
      escalationDate: "Escalation Date",
      targetClosureDate: "Target Closure Date",
      currentStatus: "Current Status",
      correctiveAction: "Corrective Action",
      executiveDecision: "Executive Decision",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "রিস্ক এস্কেলেশন এন্ট্রি",
    eyebrow: "MBNCON রিস্ক এস্কেলেশন ইন্টেলিজেন্স",
    subtitle:
      "অপারেশনাল এস্কেলেশন, শিপমেন্ট ঝুঁকি, বায়ার এস্কেলেশন, আর্থিক ঝুঁকি, অমীমাংসিত ক্রিটিক্যাল ইস্যু এবং কারেক্টিভ অ্যাকশন দায়িত্ব ট্র্যাক করুন।",
    save: "এস্কেলেশন রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "রিস্ক এস্কেলেশন রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "ক্রিটিক্যাল ইস্যু",
        value: "এস্কেলেটেড",
        desc: "ডেলিভারি, বায়ার কনফিডেন্স বা প্রফিট ক্ষতিগ্রস্ত হওয়ার আগে অমীমাংসিত অপারেশনাল ঝুঁকি রেকর্ড করুন।",
        target: "এস্কেলেশন রেকর্ড ফর্ম",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "আর্থিক ঝুঁকি",
        value: "ভিজিবল",
        desc: "এক্সিকিউটিভ মনোযোগের জন্য কস্ট, ক্লেইম, পেনাল্টি, এয়ার শিপমেন্ট ও কমার্শিয়াল এক্সপোজার ট্র্যাক করুন।",
        target: "রিস্ক ইন্টেলিজেন্স লেয়ার",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "দায়িত্ব",
        value: "অ্যাসাইনড",
        desc: "দায়িত্বপ্রাপ্ত ব্যক্তি, টার্গেট ক্লোজার তারিখ, কারেক্টিভ অ্যাকশন এবং ম্যানেজমেন্ট সিদ্ধান্ত রেকর্ড করুন।",
        target: "রিস্ক ইন্টেলিজেন্স লেয়ার",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "এক্সিকিউটিভ অ্যাকশন",
        value: "রেডি",
        desc: "ডিরেক্টর-লেভেল এস্কেলেশন রিভিউ এবং রিস্ক ক্লোজার ডিসিপ্লিন সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ এস্কেলেশন UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "এস্কেলেশন রেকর্ড ফর্ম",
      intelligence: "রিস্ক ইন্টেলিজেন্স লেয়ার",
      ux: "এক্সিকিউটিভ এস্কেলেশন UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      escalationId: "এস্কেলেশন আইডি",
      escalationType: "এস্কেলেশনের ধরন",
      department: "বিভাগ",
      issueTitle: "ইস্যুর শিরোনাম",
      issueDescription: "ইস্যুর বর্ণনা",
      severityLevel: "গুরুত্বের মাত্রা",
      financialExposure: "আর্থিক ঝুঁকি",
      shipmentImpact: "শিপমেন্ট প্রভাব",
      buyerImpact: "বায়ার প্রভাব",
      operationalImpact: "অপারেশনাল প্রভাব",
      rootCause: "মূল কারণ",
      responsiblePerson: "দায়িত্বপ্রাপ্ত ব্যক্তি",
      escalationDate: "এস্কেলেশন তারিখ",
      targetClosureDate: "টার্গেট ক্লোজার তারিখ",
      currentStatus: "বর্তমান স্ট্যাটাস",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      executiveDecision: "এক্সিকিউটিভ সিদ্ধান্ত",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function RiskEscalationEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    escalationId: "",
    escalationType: "",
    department: "",
    issueTitle: "",
    issueDescription: "",
    severityLevel: "",
    financialExposure: "",
    shipmentImpact: "",
    buyerImpact: "",
    operationalImpact: "",
    rootCause: "",
    responsiblePerson: "",
    escalationDate: "",
    targetClosureDate: "",
    currentStatus: "",
    correctiveAction: "",
    executiveDecision: "",
    remarks: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      period: "",
      escalationId: "",
      escalationType: "",
      department: "",
      issueTitle: "",
      issueDescription: "",
      severityLevel: "",
      financialExposure: "",
      shipmentImpact: "",
      buyerImpact: "",
      operationalImpact: "",
      rootCause: "",
      responsiblePerson: "",
      escalationDate: "",
      targetClosureDate: "",
      currentStatus: "",
      correctiveAction: "",
      executiveDecision: "",
      remarks: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    setTimeout(() => {
      setSaving(false);
      setMessage(t.success);
      resetForm();
    }, 800);
  };

  return (
    <DashboardShell title={t.title} subtitle={t.subtitle}>
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
              {t.eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300 md:text-xl">
              {t.subtitle}
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.cards.map((card) => {
              const targetId = slugify(card.target);

              return (
                <a
                  key={card.title}
                  href={`#${targetId}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </h2>

                  <p className="mt-4 leading-7">{card.desc}</p>

                  <p className="mt-5 text-sm font-bold opacity-70">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section
            id={slugify(t.sections.form)}
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
                {t.sections.form}
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
                {t.title}
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-600">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(t.fields).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {label}
                    </label>

                    {key === "issueDescription" ||
                    key === "rootCause" ||
                    key === "correctiveAction" ||
                    key === "executiveDecision" ||
                    key === "remarks" ? (
                      <textarea
                        rows={4}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition duration-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      />
                    ) : (
                      <input
                        type="text"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition duration-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t.saving : t.save}
                </button>

                {message ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                    {message}
                  </p>
                ) : null}
              </div>
            </form>
          </section>

          <section
            id={slugify(t.sections.intelligence)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
              {t.sections.intelligence}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Risk Exposure, Accountability & Closure Control
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures escalation type, department ownership,
              severity level, financial exposure, shipment impact, buyer
              impact, operational impact, root cause, responsible person,
              closure deadline, current status, corrective action, executive
              decision, and management remarks for factory-level risk control.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Financial exposure visibility",
                "Department accountability tracking",
                "Executive closure discipline",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise escalation intelligence prepared for director
                    review, risk prevention, and operational recovery control.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id={slugify(t.sections.ux)}
            className="scroll-mt-28 rounded-3xl border border-red-200 bg-red-50 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-800">
              {t.sections.ux}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-red-950">
              Consultancy-Demo Executive Escalation UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-red-900">
              The stabilized layout gives factory owners, directors, risk
              committees, department heads, and commercial teams a clearer demo
              experience with clickable intelligence cards, structured scroll
              sections, enterprise-safe JSX, stronger hover feedback, and
              practical escalation-control storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}