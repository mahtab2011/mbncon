"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addUtilitiesLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function UtilitiesEntryPage() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Utilities Intelligence Entry",
      subtitle:
        "Capture electricity, generator fuel, gas, and water costs for utilities intelligence and energy dependency analysis.",
      period: "Period",
      electricityCost: "Electricity Cost",
      generatorFuelCost: "Generator Fuel Cost",
      gasCost: "Gas Cost",
      waterCost: "Water Cost",
      save: "Save Utilities Log",
      saving: "Saving...",
      success: "Utilities log saved successfully.",
      error: "Could not save utilities log. Check Firebase settings.",
      placeholderPeriod: "May 2026",
    },
    bn: {
      title: "ইউটিলিটিজ ইন্টেলিজেন্স এন্ট্রি",
      subtitle:
        "ইউটিলিটিজ ইন্টেলিজেন্স এবং এনার্জি নির্ভরতা বিশ্লেষণের জন্য বিদ্যুৎ, জেনারেটর ফুয়েল, গ্যাস এবং পানির খরচ সংরক্ষণ করুন।",
      period: "সময়কাল",
      electricityCost: "বিদ্যুৎ খরচ",
      generatorFuelCost: "জেনারেটর ফুয়েল খরচ",
      gasCost: "গ্যাস খরচ",
      waterCost: "পানি খরচ",
      save: "ইউটিলিটিজ লগ সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      success: "ইউটিলিটিজ লগ সফলভাবে সংরক্ষণ হয়েছে।",
      error: "ইউটিলিটিজ লগ সংরক্ষণ করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।",
      placeholderPeriod: "মে ২০২৬",
    },
  };

  const t = text[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    companyId: "demo-company",
    factoryId: "demo-factory",
    period: "",
    electricityCost: "",
    generatorFuelCost: "",
    gasCost: "",
    waterCost: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await addUtilitiesLog({
        companyId: form.companyId,
        factoryId: form.factoryId,
        period: form.period,
        electricityCost: Number(form.electricityCost),
        generatorFuelCost: Number(form.generatorFuelCost),
        gasCost: Number(form.gasCost),
        waterCost: Number(form.waterCost),
      });

      setMessage(t.success);

      setForm({
        companyId: "demo-company",
        factoryId: "demo-factory",
        period: "",
        electricityCost: "",
        generatorFuelCost: "",
        gasCost: "",
        waterCost: "",
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
            label={t.electricityCost}
            value={form.electricityCost}
            onChange={(v) => updateField("electricityCost", v)}
          />

          <Input
            label={t.generatorFuelCost}
            value={form.generatorFuelCost}
            onChange={(v) => updateField("generatorFuelCost", v)}
          />

          <Input
            label={t.gasCost}
            value={form.gasCost}
            onChange={(v) => updateField("gasCost", v)}
          />

          <Input
            label={t.waterCost}
            value={form.waterCost}
            onChange={(v) => updateField("waterCost", v)}
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