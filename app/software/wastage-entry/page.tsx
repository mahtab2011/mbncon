"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addWastageLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function WastageEntryPage() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Wastage & Rejection Intelligence Entry",
      subtitle:
        "Capture material issue, usage, wastage, rejection, and hidden loss data for financial leakage analysis.",
      period: "Period",
      materialType: "Material Type",
      issuedQty: "Issued Quantity",
      usedQty: "Used Quantity",
      wastageQty: "Wastage Quantity",
      wastagePercent: "Wastage %",
      save: "Save Wastage Log",
      saving: "Saving...",
      success: "Wastage log saved successfully.",
      error: "Could not save wastage log. Check Firebase settings.",
      placeholderPeriod: "May 2026",
      placeholderMaterial: "Fabric / Leather / Packaging",
    },
    bn: {
      title: "ওয়েস্টেজ ও রিজেকশন ইন্টেলিজেন্স এন্ট্রি",
      subtitle:
        "ফিনান্সিয়াল লিকেজ বিশ্লেষণের জন্য মেটেরিয়াল ইস্যু, ব্যবহার, অপচয়, রিজেকশন এবং গোপন ক্ষতির ডেটা সংরক্ষণ করুন।",
      period: "সময়কাল",
      materialType: "মেটেরিয়ালের ধরন",
      issuedQty: "ইস্যু করা পরিমাণ",
      usedQty: "ব্যবহৃত পরিমাণ",
      wastageQty: "অপচয়ের পরিমাণ",
      wastagePercent: "অপচয় %",
      save: "ওয়েস্টেজ লগ সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      success: "ওয়েস্টেজ লগ সফলভাবে সংরক্ষণ হয়েছে।",
      error: "ওয়েস্টেজ লগ সংরক্ষণ করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।",
      placeholderPeriod: "মে ২০২৬",
      placeholderMaterial: "ফ্যাব্রিক / লেদার / প্যাকেজিং",
    },
  };

  const t = text[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    companyId: "demo-company",
    factoryId: "demo-factory",
    period: "",
    materialType: "",
    issuedQty: "",
    usedQty: "",
    wastageQty: "",
    wastagePercent: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await addWastageLog({
        companyId: form.companyId,
        factoryId: form.factoryId,
        period: form.period,
        materialType: form.materialType,
        issuedQty: Number(form.issuedQty),
        usedQty: Number(form.usedQty),
        wastageQty: Number(form.wastageQty),
        wastagePercent: Number(form.wastagePercent),
      });

      setMessage(t.success);

      setForm({
        companyId: "demo-company",
        factoryId: "demo-factory",
        period: "",
        materialType: "",
        issuedQty: "",
        usedQty: "",
        wastageQty: "",
        wastagePercent: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(t.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title={t.title} subtitle={t.subtitle}>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label={t.period}
            value={form.period}
            onChange={(v) => updateField("period", v)}
            placeholder={t.placeholderPeriod}
          />

          <Input
            label={t.materialType}
            value={form.materialType}
            onChange={(v) => updateField("materialType", v)}
            placeholder={t.placeholderMaterial}
          />

          <Input
            label={t.issuedQty}
            value={form.issuedQty}
            onChange={(v) => updateField("issuedQty", v)}
          />

          <Input
            label={t.usedQty}
            value={form.usedQty}
            onChange={(v) => updateField("usedQty", v)}
          />

          <Input
            label={t.wastageQty}
            value={form.wastageQty}
            onChange={(v) => updateField("wastageQty", v)}
          />

          <Input
            label={t.wastagePercent}
            value={form.wastagePercent}
            onChange={(v) => updateField("wastagePercent", v)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-8 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? t.saving : t.save}
        </button>

        {message ? (
          <p className="mt-5 text-sm font-semibold text-cyan-700">
            {message}
          </p>
        ) : null}
      </form>
    </DashboardShell>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-700">
        {label}
      </span>

      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-cyan-500"
      />
    </label>
  );
}