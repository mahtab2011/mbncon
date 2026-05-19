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
    title: "Inventory Intelligence Entry",
    subtitle:
      "Track stock ageing, warehouse loss, excess inventory, shortage risk, dead stock, and production readiness.",
    eyebrow: "MBNCON INVENTORY INTELLIGENCE",
    save: "Save Inventory Record",
    saving: "Saving...",
    success: "Inventory intelligence record saved successfully.",

    fields: {
      period: "Reporting Period",
      itemName: "Item Name",
      category: "Inventory Category",
      openingStock: "Opening Stock",
      receivedQty: "Received Quantity",
      issuedQty: "Issued to Production",
      closingStock: "Closing Stock",
      ageingDays: "Stock Ageing (Days)",
      deadStockQty: "Dead Stock Quantity",
      shortageQty: "Shortage Quantity",
      excessQty: "Excess Quantity",
      warehouseLoss: "Warehouse Loss / Damage",
      stockValue: "Stock Value",
      reorderLevel: "Reorder Level",
      productionImpact: "Production Impact",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "ইনভেন্টরি ইন্টেলিজেন্স এন্ট্রি",
    subtitle:
      "স্টক এজিং, ওয়্যারহাউস ক্ষতি, অতিরিক্ত ইনভেন্টরি, ঘাটতি ঝুঁকি, ডেড স্টক এবং প্রোডাকশন প্রস্তুতি ট্র্যাক করুন।",
    eyebrow: "MBNCON ইনভেন্টরি ইন্টেলিজেন্স",
    save: "ইনভেন্টরি রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "ইনভেন্টরি ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    fields: {
      period: "রিপোর্টিং সময়কাল",
      itemName: "আইটেমের নাম",
      category: "ইনভেন্টরি ক্যাটাগরি",
      openingStock: "ওপেনিং স্টক",
      receivedQty: "প্রাপ্ত পরিমাণ",
      issuedQty: "প্রোডাকশনে ইস্যু করা পরিমাণ",
      closingStock: "ক্লোজিং স্টক",
      ageingDays: "স্টক এজিং (দিন)",
      deadStockQty: "ডেড স্টক পরিমাণ",
      shortageQty: "ঘাটতি পরিমাণ",
      excessQty: "অতিরিক্ত পরিমাণ",
      warehouseLoss: "ওয়্যারহাউস ক্ষতি / ড্যামেজ",
      stockValue: "স্টক মূল্য",
      reorderLevel: "রিঅর্ডার লেভেল",
      productionImpact: "প্রোডাকশন প্রভাব",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

const inventoryInsights = [
  "Stock ageing intelligence",
  "Dead stock monitoring",
  "Warehouse damage analysis",
  "Inventory shortage prediction",
  "Excess stock visibility",
  "Production readiness monitoring",
  "Reorder risk intelligence",
  "Inventory carrying cost analysis",
];

export default function InventoryEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    itemName: "",
    category: "",
    openingStock: "",
    receivedQty: "",
    issuedQty: "",
    closingStock: "",
    ageingDays: "",
    deadStockQty: "",
    shortageQty: "",
    excessQty: "",
    warehouseLoss: "",
    stockValue: "",
    reorderLevel: "",
    productionImpact: "",
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
      itemName: "",
      category: "",
      openingStock: "",
      receivedQty: "",
      issuedQty: "",
      closingStock: "",
      ageingDays: "",
      deadStockQty: "",
      shortageQty: "",
      excessQty: "",
      warehouseLoss: "",
      stockValue: "",
      reorderLevel: "",
      productionImpact: "",
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
        <section
          id={slugify(t.title)}
          className="scroll-mt-28 rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            {t.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-4xl text-slate-600">
            {t.subtitle}
          </p>
        </section>

        <section
          id={slugify("Inventory Intelligence Areas")}
          className="scroll-mt-28 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {inventoryInsights.map((item, index) => (
            <a
              key={item}
              href={`#${slugify(item)}`}
              id={slugify(item)}
              className="scroll-mt-28 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-100 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-700 font-bold text-white">
                  {index + 1}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {item}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Executive inventory visibility and operational
                    intelligence tracking.
                  </p>
                </div>
              </div>
            </a>
          ))}
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(t.fields).map(([key, label]) => (
              <div
                key={key}
                id={slugify(label)}
                className="scroll-mt-28 space-y-2"
              >
                <label className="text-sm font-semibold text-slate-700">
                  {label}
                </label>

                {key === "productionImpact" || key === "remarks" ? (
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

                <p className="text-xs text-slate-500">
                  Inventory intelligence data entry.
                </p>
              </div>
            ))}
          </div>

          <section
            id={slugify("Inventory Intelligence Recommendation")}
            className="scroll-mt-28 mt-10 rounded-3xl border border-cyan-200 bg-cyan-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-cyan-900">
              Executive Inventory Recommendation
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-700">
              Use inventory intelligence to reduce stock ageing,
              warehouse losses, dead stock exposure, and shortage risk
              while improving production readiness, cashflow stability,
              and operational efficiency.
            </p>
          </section>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-cyan-700 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-cyan-800 hover:shadow-lg disabled:opacity-60"
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