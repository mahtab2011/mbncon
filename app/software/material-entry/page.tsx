"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Material Intelligence Entry",
    subtitle:
      "Track supplier performance, material quality, delivery delays, transport cost, and inventory risks.",
    save: "Save Material Record",
    saving: "Saving...",
    success: "Material record saved successfully.",
    fields: {
      period: "Reporting Period",
      supplier: "Supplier Name",
      material: "Material Name",
      category: "Material Category",
      orderedQty: "Ordered Quantity",
      receivedQty: "Received Quantity",
      rejectedQty: "Rejected Quantity",
      price: "Unit Price",
      transportCost: "Transport Cost",
      leadTime: "Lead Time (Days)",
      delayDays: "Delivery Delay (Days)",
      qualityScore: "Quality Score %",
      warehouseLoss: "Warehouse Loss %",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "মেটেরিয়াল ইন্টেলিজেন্স এন্ট্রি",
    subtitle:
      "সাপ্লায়ার পারফরম্যান্স, মেটেরিয়াল কোয়ালিটি, ডেলিভারি বিলম্ব, পরিবহন খরচ এবং ইনভেন্টরি ঝুঁকি ট্র্যাক করুন।",
    save: "মেটেরিয়াল রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "মেটেরিয়াল রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ারের নাম",
      material: "মেটেরিয়ালের নাম",
      category: "মেটেরিয়াল ক্যাটাগরি",
      orderedQty: "অর্ডার পরিমাণ",
      receivedQty: "প্রাপ্ত পরিমাণ",
      rejectedQty: "রিজেক্টেড পরিমাণ",
      price: "প্রতি ইউনিট মূল্য",
      transportCost: "পরিবহন খরচ",
      leadTime: "লিড টাইম (দিন)",
      delayDays: "ডেলিভারি বিলম্ব (দিন)",
      qualityScore: "কোয়ালিটি স্কোর %",
      warehouseLoss: "ওয়্যারহাউস ক্ষতি %",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function MaterialEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    material: "",
    category: "",
    orderedQty: "",
    receivedQty: "",
    rejectedQty: "",
    price: "",
    transportCost: "",
    leadTime: "",
    delayDays: "",
    qualityScore: "",
    warehouseLoss: "",
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
        supplier: "",
        material: "",
        category: "",
        orderedQty: "",
        receivedQty: "",
        rejectedQty: "",
        price: "",
        transportCost: "",
        leadTime: "",
        delayDays: "",
        qualityScore: "",
        warehouseLoss: "",
        remarks: "",
      });
    }, 1000);
  };

  return (
    <DashboardShell title={t.title}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON MATERIAL INTELLIGENCE
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

                {key === "remarks" ? (
                  <textarea
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      updateField(key, e.target.value)
                    }
                    rows={4}
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