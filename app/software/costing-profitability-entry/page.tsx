"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Costing & Profitability Entry",
    eyebrow: "MBNCON COSTING PROFITABILITY INTELLIGENCE",
    subtitle:
      "Track costing accuracy, profitability, hidden losses, operational expenses, margin risk, and financial performance intelligence.",
    save: "Save Costing Record",
    saving: "Saving...",
    success: "Costing and profitability record saved successfully.",
    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      orderNo: "Order Number",
      product: "Product / Style",
      orderQty: "Order Quantity",
      sellingPrice: "Selling Price",
      materialCost: "Material Cost",
      labourCost: "Labour Cost",
      utilityCost: "Utility Cost",
      transportCost: "Transport Cost",
      complianceCost: "Compliance Cost",
      overheadCost: "Overhead Cost",
      totalCost: "Total Cost",
      expectedProfit: "Expected Profit",
      actualProfit: "Actual Profit",
      marginPercentage: "Margin Percentage",
      profitLeakage: "Profit Leakage",
      riskLevel: "Profitability Risk Level",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "কস্টিং ও প্রফিটেবিলিটি এন্ট্রি",
    eyebrow: "MBNCON কস্টিং প্রফিটেবিলিটি ইন্টেলিজেন্স",
    subtitle:
      "কস্টিং নির্ভুলতা, প্রফিটেবিলিটি, লুকানো ক্ষতি, অপারেশনাল খরচ, মার্জিন ঝুঁকি এবং আর্থিক পারফরম্যান্স ইন্টেলিজেন্স ট্র্যাক করুন।",
    save: "কস্টিং রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কস্টিং ও প্রফিটেবিলিটি রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      orderNo: "অর্ডার নম্বর",
      product: "পণ্য / স্টাইল",
      orderQty: "অর্ডার পরিমাণ",
      sellingPrice: "বিক্রয় মূল্য",
      materialCost: "মেটেরিয়াল খরচ",
      labourCost: "শ্রম খরচ",
      utilityCost: "ইউটিলিটি খরচ",
      transportCost: "পরিবহন খরচ",
      complianceCost: "কমপ্লায়েন্স খরচ",
      overheadCost: "ওভারহেড খরচ",
      totalCost: "মোট খরচ",
      expectedProfit: "প্রত্যাশিত লাভ",
      actualProfit: "প্রকৃত লাভ",
      marginPercentage: "মার্জিন শতাংশ",
      profitLeakage: "প্রফিট লিকেজ",
      riskLevel: "প্রফিটেবিলিটি ঝুঁকির মাত্রা",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function CostingProfitabilityEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    buyer: "",
    orderNo: "",
    product: "",
    orderQty: "",
    sellingPrice: "",
    materialCost: "",
    labourCost: "",
    utilityCost: "",
    transportCost: "",
    complianceCost: "",
    overheadCost: "",
    totalCost: "",
    expectedProfit: "",
    actualProfit: "",
    marginPercentage: "",
    profitLeakage: "",
    riskLevel: "",
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
      buyer: "",
      orderNo: "",
      product: "",
      orderQty: "",
      sellingPrice: "",
      materialCost: "",
      labourCost: "",
      utilityCost: "",
      transportCost: "",
      complianceCost: "",
      overheadCost: "",
      totalCost: "",
      expectedProfit: "",
      actualProfit: "",
      marginPercentage: "",
      profitLeakage: "",
      riskLevel: "",
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

                {key === "remarks" ? (
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