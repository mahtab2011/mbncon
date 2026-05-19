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
    title: "TQM Intelligence Entry",
    eyebrow: "MBNCON Total Quality Management",
    subtitle:
      "Track Total Quality Management initiatives, customer satisfaction improvement, process standardisation, preventive quality systems, and operational excellence programs.",
    save: "Save TQM Record",
    saving: "Saving...",
    success: "TQM intelligence record saved successfully.",

    cards: [
      {
        title: "Quality Objective",
        value: "Tracked",
        desc: "Capture TQM initiative, quality objective, customer requirement, and process area.",
        target: "TQM Record Form",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Root Cause",
        value: "Analysed",
        desc: "Record current issue, root cause, preventive action, and corrective action.",
        target: "TQM Intelligence Layer",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "Standardisation",
        value: "Monitored",
        desc: "Track process standard, employee training, quality measurement, and target improvement.",
        target: "TQM Intelligence Layer",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Management Review",
        value: "Ready",
        desc: "Support implementation status, review frequency, management decision, and executive follow-up.",
        target: "Executive TQM UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "TQM Record Form",
      intelligence: "TQM Intelligence Layer",
      ux: "Executive TQM UX",
    },

    fields: {
      period: "Reporting Period",
      department: "Department",
      tqmInitiative: "TQM Initiative",
      qualityObjective: "Quality Objective",
      customerRequirement: "Customer Requirement",
      processArea: "Process Area",
      currentIssue: "Current Issue",
      rootCause: "Root Cause",
      preventiveAction: "Preventive Action",
      correctiveAction: "Corrective Action",
      processStandard: "Process Standard",
      employeeTraining: "Employee Training",
      qualityMeasurement: "Quality Measurement",
      targetImprovement: "Target Improvement",
      implementationStatus: "Implementation Status",
      reviewFrequency: "Review Frequency",
      managementDecision: "Management Decision",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "TQM ইন্টেলিজেন্স এন্ট্রি",
    eyebrow: "MBNCON টোটাল কোয়ালিটি ম্যানেজমেন্ট",
    subtitle:
      "টোটাল কোয়ালিটি ম্যানেজমেন্ট উদ্যোগ, গ্রাহক সন্তুষ্টি উন্নয়ন, প্রসেস স্ট্যান্ডার্ডাইজেশন, প্রতিরোধমূলক কোয়ালিটি সিস্টেম এবং অপারেশনাল এক্সেলেন্স প্রোগ্রাম ট্র্যাক করুন।",
    save: "TQM রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "TQM ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "কোয়ালিটি লক্ষ্য",
        value: "ট্র্যাকড",
        desc: "TQM উদ্যোগ, কোয়ালিটি লক্ষ্য, গ্রাহকের চাহিদা এবং প্রসেস এরিয়া সংরক্ষণ করুন।",
        target: "TQM রেকর্ড ফর্ম",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "রুট কজ",
        value: "বিশ্লেষিত",
        desc: "বর্তমান সমস্যা, মূল কারণ, প্রতিরোধমূলক ব্যবস্থা এবং কারেক্টিভ অ্যাকশন রেকর্ড করুন।",
        target: "TQM ইন্টেলিজেন্স লেয়ার",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "স্ট্যান্ডার্ডাইজেশন",
        value: "মনিটরড",
        desc: "প্রসেস স্ট্যান্ডার্ড, কর্মচারী প্রশিক্ষণ, কোয়ালিটি পরিমাপ এবং লক্ষ্য উন্নয়ন ট্র্যাক করুন।",
        target: "TQM ইন্টেলিজেন্স লেয়ার",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "ম্যানেজমেন্ট রিভিউ",
        value: "রেডি",
        desc: "বাস্তবায়ন স্ট্যাটাস, রিভিউ ফ্রিকোয়েন্সি, ম্যানেজমেন্ট সিদ্ধান্ত এবং এক্সিকিউটিভ ফলোআপ সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ TQM UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "TQM রেকর্ড ফর্ম",
      intelligence: "TQM ইন্টেলিজেন্স লেয়ার",
      ux: "এক্সিকিউটিভ TQM UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      department: "বিভাগ",
      tqmInitiative: "TQM উদ্যোগ",
      qualityObjective: "কোয়ালিটি লক্ষ্য",
      customerRequirement: "গ্রাহকের চাহিদা",
      processArea: "প্রসেস এরিয়া",
      currentIssue: "বর্তমান সমস্যা",
      rootCause: "মূল কারণ",
      preventiveAction: "প্রতিরোধমূলক ব্যবস্থা",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      processStandard: "প্রসেস স্ট্যান্ডার্ড",
      employeeTraining: "কর্মচারী প্রশিক্ষণ",
      qualityMeasurement: "কোয়ালিটি পরিমাপ",
      targetImprovement: "লক্ষ্য উন্নয়ন",
      implementationStatus: "বাস্তবায়ন স্ট্যাটাস",
      reviewFrequency: "রিভিউ ফ্রিকোয়েন্সি",
      managementDecision: "ম্যানেজমেন্ট সিদ্ধান্ত",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function TqmEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    department: "",
    tqmInitiative: "",
    qualityObjective: "",
    customerRequirement: "",
    processArea: "",
    currentIssue: "",
    rootCause: "",
    preventiveAction: "",
    correctiveAction: "",
    processStandard: "",
    employeeTraining: "",
    qualityMeasurement: "",
    targetImprovement: "",
    implementationStatus: "",
    reviewFrequency: "",
    managementDecision: "",
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
      department: "",
      tqmInitiative: "",
      qualityObjective: "",
      customerRequirement: "",
      processArea: "",
      currentIssue: "",
      rootCause: "",
      preventiveAction: "",
      correctiveAction: "",
      processStandard: "",
      employeeTraining: "",
      qualityMeasurement: "",
      targetImprovement: "",
      implementationStatus: "",
      reviewFrequency: "",
      managementDecision: "",
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
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
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

                    {key === "currentIssue" ||
                    key === "rootCause" ||
                    key === "preventiveAction" ||
                    key === "correctiveAction" ||
                    key === "managementDecision" ||
                    key === "remarks" ? (
                      <textarea
                        rows={4}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />
                    ) : (
                      <input
                        type="text"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {t.sections.intelligence}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Total Quality, Preventive Action & Standardisation Control
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures TQM initiatives, quality objectives,
              customer requirements, process area, current issue, root cause,
              preventive action, corrective action, process standard, employee
              training, quality measurement, target improvement,
              implementation status, review frequency, management decision, and
              remarks for Total Quality Management intelligence.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Customer requirement and quality objective visibility",
                "Preventive and corrective action discipline",
                "Process standardisation and management review",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise TQM intelligence prepared for operational
                    excellence, quality control, customer satisfaction, and
                    leadership review.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id={slugify(t.sections.ux)}
            className="scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
              {t.sections.ux}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-cyan-950">
              Consultancy-Demo TQM Intelligence UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, quality leaders,
              operations teams, department heads, and executives a clearer demo
              experience with clickable intelligence cards, structured scroll
              sections, enterprise-safe JSX, stronger hover feedback, and
              practical Total Quality Management storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}