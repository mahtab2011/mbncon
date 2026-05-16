"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Risk Escalation Entry",
    eyebrow: "MBNCON RISK ESCALATION INTELLIGENCE",
    subtitle:
      "Track operational escalation, shipment risks, buyer escalation, financial exposure, unresolved critical issues, and corrective action accountability.",
    save: "Save Escalation Record",
    saving: "Saving...",
    success: "Risk escalation record saved successfully.",
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

                {key === "issueDescription" ||
                key === "rootCause" ||
                key === "correctiveAction" ||
                key === "executiveDecision" ||
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