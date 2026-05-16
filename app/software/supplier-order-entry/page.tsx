"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Supplier Order Intelligence Entry",
    eyebrow: "MBNCON SUPPLIER ORDER INTELLIGENCE",
    subtitle:
      "Track all supplier orders, supply category, required date, delivery commitment, price, quality risk, delay risk, and production impact.",
    save: "Save Supplier Order Record",
    saving: "Saving...",
    success: "Supplier order intelligence record saved successfully.",
    fields: {
      period: "Reporting Period",
      supplier: "Supplier Name",
      supplyCategory: "Supply Category",
      itemName: "Item / Material / Service Name",
      poNumber: "PO Number",
      orderQty: "Order Quantity",
      unitPrice: "Unit Price",
      totalValue: "Total Order Value",
      orderDate: "Order Date",
      requiredDate: "Required Delivery Date",
      promisedDate: "Supplier Promised Date",
      receivedQty: "Received Quantity",
      pendingQty: "Pending Quantity",
      delayDays: "Delay Days",
      qualityRisk: "Quality Risk Level",
      priceRisk: "Price Risk Level",
      productionImpact: "Production Impact",
      correctiveAction: "Corrective Action",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "সাপ্লায়ার অর্ডার ইন্টেলিজেন্স এন্ট্রি",
    eyebrow: "MBNCON সাপ্লায়ার অর্ডার ইন্টেলিজেন্স",
    subtitle:
      "সব ধরনের সাপ্লায়ার অর্ডার, সাপ্লাই ক্যাটাগরি, প্রয়োজনীয় তারিখ, ডেলিভারি প্রতিশ্রুতি, মূল্য, কোয়ালিটি ঝুঁকি, বিলম্ব ঝুঁকি এবং প্রোডাকশন প্রভাব ট্র্যাক করুন।",
    save: "সাপ্লায়ার অর্ডার রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "সাপ্লায়ার অর্ডার ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ারের নাম",
      supplyCategory: "সাপ্লাই ক্যাটাগরি",
      itemName: "আইটেম / মেটেরিয়াল / সার্ভিসের নাম",
      poNumber: "PO নম্বর",
      orderQty: "অর্ডার পরিমাণ",
      unitPrice: "প্রতি ইউনিট মূল্য",
      totalValue: "মোট অর্ডার মূল্য",
      orderDate: "অর্ডার তারিখ",
      requiredDate: "প্রয়োজনীয় ডেলিভারি তারিখ",
      promisedDate: "সাপ্লায়ারের প্রতিশ্রুত তারিখ",
      receivedQty: "প্রাপ্ত পরিমাণ",
      pendingQty: "পেন্ডিং পরিমাণ",
      delayDays: "বিলম্বের দিন",
      qualityRisk: "কোয়ালিটি ঝুঁকির মাত্রা",
      priceRisk: "মূল্য ঝুঁকির মাত্রা",
      productionImpact: "প্রোডাকশন প্রভাব",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function SupplierOrderEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    supplyCategory: "",
    itemName: "",
    poNumber: "",
    orderQty: "",
    unitPrice: "",
    totalValue: "",
    orderDate: "",
    requiredDate: "",
    promisedDate: "",
    receivedQty: "",
    pendingQty: "",
    delayDays: "",
    qualityRisk: "",
    priceRisk: "",
    productionImpact: "",
    correctiveAction: "",
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
      supplier: "",
      supplyCategory: "",
      itemName: "",
      poNumber: "",
      orderQty: "",
      unitPrice: "",
      totalValue: "",
      orderDate: "",
      requiredDate: "",
      promisedDate: "",
      receivedQty: "",
      pendingQty: "",
      delayDays: "",
      qualityRisk: "",
      priceRisk: "",
      productionImpact: "",
      correctiveAction: "",
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

                {key === "productionImpact" ||
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