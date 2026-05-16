"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Raw Material Quality Assurance",
    subtitle:
      "Monitor incoming raw material quality, supplier compliance, inspection failures, laboratory checks, and material approval intelligence.",

    save: "Save QA Record",
    saving: "Saving...",
    success: "Raw material QA record saved successfully.",

    fields: {
      period: "Reporting Period",
      supplier: "Supplier Name",
      material: "Material Name",
      batchNo: "Batch Number",
      poNumber: "PO Number",
      receivedQty: "Received Quantity",
      inspectedQty: "Inspected Quantity",
      rejectedQty: "Rejected Quantity",
      defectType: "Defect Type",
      gsmVariation: "GSM / Thickness Variation",
      colorVariation: "Color Variation",
      shrinkage: "Shrinkage %",
      laboratoryResult: "Laboratory Result",
      complianceStatus: "Compliance Status",
      deliveryCondition: "Delivery Condition",
      approvalStatus: "Approval Status",
      correctiveAction: "Corrective Action",
      qaRemarks: "QA Remarks",
    },
  },

  bn: {
    title: "কাঁচামাল কোয়ালিটি অ্যাসিউরেন্স",
    subtitle:
      "ইনকামিং কাঁচামালের কোয়ালিটি, সাপ্লায়ার কমপ্লায়েন্স, ইন্সপেকশন ব্যর্থতা, ল্যাব টেস্ট এবং মেটেরিয়াল অনুমোদন ইন্টেলিজেন্স মনিটর করুন।",

    save: "QA রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কাঁচামাল QA রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ারের নাম",
      material: "মেটেরিয়ালের নাম",
      batchNo: "ব্যাচ নম্বর",
      poNumber: "PO নম্বর",
      receivedQty: "প্রাপ্ত পরিমাণ",
      inspectedQty: "ইন্সপেকশন পরিমাণ",
      rejectedQty: "রিজেক্টেড পরিমাণ",
      defectType: "ত্রুটির ধরন",
      gsmVariation: "GSM / পুরুত্ব পরিবর্তন",
      colorVariation: "রঙের ভিন্নতা",
      shrinkage: "শ্রিংকেজ %",
      laboratoryResult: "ল্যাবরেটরি ফলাফল",
      complianceStatus: "কমপ্লায়েন্স স্ট্যাটাস",
      deliveryCondition: "ডেলিভারি অবস্থা",
      approvalStatus: "অনুমোদন অবস্থা",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      qaRemarks: "QA মন্তব্য",
    },
  },
};

export default function RawMaterialQualityAssurancePage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    material: "",
    batchNo: "",
    poNumber: "",
    receivedQty: "",
    inspectedQty: "",
    rejectedQty: "",
    defectType: "",
    gsmVariation: "",
    colorVariation: "",
    shrinkage: "",
    laboratoryResult: "",
    complianceStatus: "",
    deliveryCondition: "",
    approvalStatus: "",
    correctiveAction: "",
    qaRemarks: "",
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
        supplier: "",
        material: "",
        batchNo: "",
        poNumber: "",
        receivedQty: "",
        inspectedQty: "",
        rejectedQty: "",
        defectType: "",
        gsmVariation: "",
        colorVariation: "",
        shrinkage: "",
        laboratoryResult: "",
        complianceStatus: "",
        deliveryCondition: "",
        approvalStatus: "",
        correctiveAction: "",
        qaRemarks: "",
      });
    }, 1000);
  };

  return (
    <DashboardShell title={t.title}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON RAW MATERIAL QA
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

                {(key === "correctiveAction" ||
                  key === "qaRemarks") ? (
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