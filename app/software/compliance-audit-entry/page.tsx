"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Compliance & Audit Entry",
    eyebrow: "MBNCON COMPLIANCE INTELLIGENCE",
    subtitle:
      "Track factory compliance audits, safety findings, buyer requirements, corrective actions, certification status, and compliance risk exposure.",
    save: "Save Compliance Record",
    saving: "Saving...",
    success: "Compliance audit record saved successfully.",
    fields: {
      period: "Reporting Period",
      auditType: "Audit Type",
      buyer: "Buyer / Audit Authority",
      auditDate: "Audit Date",
      auditorName: "Auditor Name",
      factoryArea: "Factory Area",
      complianceScore: "Compliance Score",
      criticalFindings: "Critical Findings",
      majorFindings: "Major Findings",
      minorFindings: "Minor Findings",
      safetyRisk: "Safety Risk Level",
      environmentalRisk: "Environmental Risk Level",
      certificationStatus: "Certification Status",
      correctiveAction: "Corrective Action",
      responsibleDepartment: "Responsible Department",
      targetClosureDate: "Target Closure Date",
      currentStatus: "Current Status",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "কমপ্লায়েন্স ও অডিট এন্ট্রি",
    eyebrow: "MBNCON কমপ্লায়েন্স ইন্টেলিজেন্স",
    subtitle:
      "ফ্যাক্টরি কমপ্লায়েন্স অডিট, নিরাপত্তা ফাইন্ডিং, বায়ার রিকোয়ারমেন্ট, কারেক্টিভ অ্যাকশন, সার্টিফিকেশন স্ট্যাটাস এবং কমপ্লায়েন্স ঝুঁকি ট্র্যাক করুন।",
    save: "কমপ্লায়েন্স রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কমপ্লায়েন্স অডিট রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      auditType: "অডিটের ধরন",
      buyer: "বায়ার / অডিট কর্তৃপক্ষ",
      auditDate: "অডিট তারিখ",
      auditorName: "অডিটরের নাম",
      factoryArea: "ফ্যাক্টরি এরিয়া",
      complianceScore: "কমপ্লায়েন্স স্কোর",
      criticalFindings: "ক্রিটিক্যাল ফাইন্ডিং",
      majorFindings: "মেজর ফাইন্ডিং",
      minorFindings: "মাইনর ফাইন্ডিং",
      safetyRisk: "নিরাপত্তা ঝুঁকির মাত্রা",
      environmentalRisk: "পরিবেশগত ঝুঁকির মাত্রা",
      certificationStatus: "সার্টিফিকেশন স্ট্যাটাস",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      responsibleDepartment: "দায়িত্বপ্রাপ্ত বিভাগ",
      targetClosureDate: "টার্গেট ক্লোজার তারিখ",
      currentStatus: "বর্তমান স্ট্যাটাস",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function ComplianceAuditEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    auditType: "",
    buyer: "",
    auditDate: "",
    auditorName: "",
    factoryArea: "",
    complianceScore: "",
    criticalFindings: "",
    majorFindings: "",
    minorFindings: "",
    safetyRisk: "",
    environmentalRisk: "",
    certificationStatus: "",
    correctiveAction: "",
    responsibleDepartment: "",
    targetClosureDate: "",
    currentStatus: "",
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
      auditType: "",
      buyer: "",
      auditDate: "",
      auditorName: "",
      factoryArea: "",
      complianceScore: "",
      criticalFindings: "",
      majorFindings: "",
      minorFindings: "",
      safetyRisk: "",
      environmentalRisk: "",
      certificationStatus: "",
      correctiveAction: "",
      responsibleDepartment: "",
      targetClosureDate: "",
      currentStatus: "",
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

                {key === "criticalFindings" ||
                key === "majorFindings" ||
                key === "minorFindings" ||
                key === "correctiveAction" ||
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