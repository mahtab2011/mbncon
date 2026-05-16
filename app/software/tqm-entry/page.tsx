"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "TQM Intelligence Entry",
    eyebrow: "MBNCON TOTAL QUALITY MANAGEMENT",
    subtitle:
      "Track Total Quality Management initiatives, customer satisfaction improvement, process standardisation, preventive quality systems, and operational excellence programs.",
    save: "Save TQM Record",
    saving: "Saving...",
    success: "TQM intelligence record saved successfully.",
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
    <DashboardShell title={t.title}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            {t.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-4xl text-slate-600">{t.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
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
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-cyan-700 px-6 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-60"
            >
              {saving ? t.saving : t.save}
            </button>

            {message && (
              <p className="text-sm font-medium text-emerald-700">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}