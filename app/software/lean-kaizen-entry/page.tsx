"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Lean & Kaizen Entry",
    eyebrow: "MBNCON LEAN KAIZEN INTELLIGENCE",
    subtitle:
      "Track continuous improvement initiatives, waste reduction, productivity improvements, employee suggestions, lean implementation, and cost-saving actions.",
    save: "Save Lean / Kaizen Record",
    saving: "Saving...",
    success: "Lean & Kaizen record saved successfully.",
    fields: {
      period: "Reporting Period",
      department: "Department",
      improvementTitle: "Improvement Title",
      improvementType: "Improvement Type",
      wasteCategory: "Waste Category (Muda)",
      currentProblem: "Current Problem",
      rootCause: "Root Cause",
      proposedImprovement: "Proposed Improvement",
      implementationDate: "Implementation Date",
      responsiblePerson: "Responsible Person",
      estimatedSavings: "Estimated Savings",
      productivityImpact: "Productivity Impact",
      qualityImpact: "Quality Impact",
      safetyImpact: "Safety Impact",
      employeeSuggestion: "Employee Suggestion",
      implementationStatus: "Implementation Status",
      managementDecision: "Management Decision",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "লিন ও কাইজেন এন্ট্রি",
    eyebrow: "MBNCON লিন কাইজেন ইন্টেলিজেন্স",
    subtitle:
      "নিরবচ্ছিন্ন উন্নয়ন উদ্যোগ, অপচয় হ্রাস, উৎপাদনশীলতা বৃদ্ধি, কর্মচারী পরামর্শ, লিন বাস্তবায়ন এবং খরচ সাশ্রয় কার্যক্রম ট্র্যাক করুন।",
    save: "লিন / কাইজেন রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "লিন ও কাইজেন রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      department: "বিভাগ",
      improvementTitle: "উন্নয়নের শিরোনাম",
      improvementType: "উন্নয়নের ধরন",
      wasteCategory: "অপচয়ের ধরন (মুদা)",
      currentProblem: "বর্তমান সমস্যা",
      rootCause: "মূল কারণ",
      proposedImprovement: "প্রস্তাবিত উন্নয়ন",
      implementationDate: "বাস্তবায়নের তারিখ",
      responsiblePerson: "দায়িত্বপ্রাপ্ত ব্যক্তি",
      estimatedSavings: "আনুমানিক সাশ্রয়",
      productivityImpact: "উৎপাদনশীলতার প্রভাব",
      qualityImpact: "কোয়ালিটির প্রভাব",
      safetyImpact: "নিরাপত্তার প্রভাব",
      employeeSuggestion: "কর্মচারীর পরামর্শ",
      implementationStatus: "বাস্তবায়ন স্ট্যাটাস",
      managementDecision: "ম্যানেজমেন্ট সিদ্ধান্ত",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function LeanKaizenEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    department: "",
    improvementTitle: "",
    improvementType: "",
    wasteCategory: "",
    currentProblem: "",
    rootCause: "",
    proposedImprovement: "",
    implementationDate: "",
    responsiblePerson: "",
    estimatedSavings: "",
    productivityImpact: "",
    qualityImpact: "",
    safetyImpact: "",
    employeeSuggestion: "",
    implementationStatus: "",
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
      improvementTitle: "",
      improvementType: "",
      wasteCategory: "",
      currentProblem: "",
      rootCause: "",
      proposedImprovement: "",
      implementationDate: "",
      responsiblePerson: "",
      estimatedSavings: "",
      productivityImpact: "",
      qualityImpact: "",
      safetyImpact: "",
      employeeSuggestion: "",
      implementationStatus: "",
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

                {key === "currentProblem" ||
                key === "rootCause" ||
                key === "proposedImprovement" ||
                key === "employeeSuggestion" ||
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