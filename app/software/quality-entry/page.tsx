"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Quality Intelligence Entry",
    subtitle:
      "Monitor rejection, rework, DHU, buyer complaints, audit findings, and corrective action performance.",
    save: "Save Quality Record",
    saving: "Saving...",
    success: "Quality intelligence record saved successfully.",

    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      product: "Product / Style",
      line: "Production Line",
      inspectionQty: "Inspection Quantity",
      rejectedQty: "Rejected Quantity",
      reworkQty: "Rework Quantity",
      dhu: "DHU %",
      inlineDefects: "Inline Defects",
      finishingDefects: "Finishing Defects",
      buyerComplaints: "Buyer Complaints",
      auditFindings: "Audit Findings",
      rootCause: "Root Cause Analysis",
      correctiveAction: "Corrective Action",
      kaizenImprovement: "Kaizen Improvement",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "কোয়ালিটি ইন্টেলিজেন্স এন্ট্রি",
    subtitle:
      "রিজেকশন, রিওয়ার্ক, DHU, বায়ার অভিযোগ, অডিট ফাইন্ডিং এবং কারেক্টিভ অ্যাকশন পারফরম্যান্স মনিটর করুন।",
    save: "কোয়ালিটি রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কোয়ালিটি ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      product: "পণ্য / স্টাইল",
      line: "প্রোডাকশন লাইন",
      inspectionQty: "ইন্সপেকশন পরিমাণ",
      rejectedQty: "রিজেক্টেড পরিমাণ",
      reworkQty: "রিওয়ার্ক পরিমাণ",
      dhu: "DHU %",
      inlineDefects: "ইনলাইন ত্রুটি",
      finishingDefects: "ফিনিশিং ত্রুটি",
      buyerComplaints: "বায়ার অভিযোগ",
      auditFindings: "অডিট ফাইন্ডিং",
      rootCause: "রুট কজ অ্যানালাইসিস",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      kaizenImprovement: "কাইজেন উন্নয়ন",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function QualityEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    buyer: "",
    product: "",
    line: "",
    inspectionQty: "",
    rejectedQty: "",
    reworkQty: "",
    dhu: "",
    inlineDefects: "",
    finishingDefects: "",
    buyerComplaints: "",
    auditFindings: "",
    rootCause: "",
    correctiveAction: "",
    kaizenImprovement: "",
    remarks: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    setTimeout(() => {
      setSaving(false);

      setMessage(t.success);

      setForm({
        period: "",
        buyer: "",
        product: "",
        line: "",
        inspectionQty: "",
        rejectedQty: "",
        reworkQty: "",
        dhu: "",
        inlineDefects: "",
        finishingDefects: "",
        buyerComplaints: "",
        auditFindings: "",
        rootCause: "",
        correctiveAction: "",
        kaizenImprovement: "",
        remarks: "",
      });
    }, 1000);
  };

  return (
    <DashboardShell title={t.title}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON QUALITY INTELLIGENCE
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-4xl text-slate-600">
            {t.subtitle}
          </p>
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

                {(key === "rootCause" ||
                  key === "correctiveAction" ||
                  key === "kaizenImprovement" ||
                  key === "remarks") ? (
                  <textarea
                    rows={4}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      updateField(key, e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      updateField(key, e.target.value)
                    }
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