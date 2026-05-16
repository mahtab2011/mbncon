"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addProductionLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function ProductionEntryPage() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Production Intelligence Entry",
      subtitle:
        "Capture production data for live Firestore reporting, forecasting, scoring, and AI risk analysis.",
      period: "Period",
      plannedOutput: "Planned Output",
      actualOutput: "Actual Output",
      efficiencyPercent: "Efficiency %",
      rejectionPercent: "Rejection %",
      delayPercent: "Delay %",
      save: "Save Production Log",
      saving: "Saving...",
      success: "Production log saved successfully.",
      error: "Could not save production log. Check Firebase settings.",
      placeholderPeriod: "May 2026",
    },
    bn: {
      title: "প্রোডাকশন ইন্টেলিজেন্স এন্ট্রি",
      subtitle:
        "লাইভ Firestore রিপোর্টিং, ফোরকাস্টিং, স্কোরিং এবং AI ঝুঁকি বিশ্লেষণের জন্য প্রোডাকশন ডেটা সংরক্ষণ করুন।",
      period: "সময়কাল",
      plannedOutput: "পরিকল্পিত উৎপাদন",
      actualOutput: "বাস্তব উৎপাদন",
      efficiencyPercent: "দক্ষতা %",
      rejectionPercent: "রিজেকশন %",
      delayPercent: "বিলম্ব %",
      save: "প্রোডাকশন লগ সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      success: "প্রোডাকশন লগ সফলভাবে সংরক্ষণ হয়েছে।",
      error: "প্রোডাকশন লগ সংরক্ষণ করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।",
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
    plannedOutput: "",
    actualOutput: "",
    efficiencyPercent: "",
    rejectionPercent: "",
    delayPercent: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await addProductionLog({
        companyId: form.companyId,
        factoryId: form.factoryId,
        period: form.period,
        plannedOutput: Number(form.plannedOutput),
        actualOutput: Number(form.actualOutput),
        efficiencyPercent: Number(form.efficiencyPercent),
        rejectionPercent: Number(form.rejectionPercent),
        delayPercent: Number(form.delayPercent),
      });

      setMessage(t.success);

      setForm({
        companyId: "demo-company",
        factoryId: "demo-factory",
        period: "",
        plannedOutput: "",
        actualOutput: "",
        efficiencyPercent: "",
        rejectionPercent: "",
        delayPercent: "",
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
            label={t.plannedOutput}
            value={form.plannedOutput}
            onChange={(v) => updateField("plannedOutput", v)}
          />

          <Input
            label={t.actualOutput}
            value={form.actualOutput}
            onChange={(v) => updateField("actualOutput", v)}
          />

          <Input
            label={t.efficiencyPercent}
            value={form.efficiencyPercent}
            onChange={(v) => updateField("efficiencyPercent", v)}
          />

          <Input
            label={t.rejectionPercent}
            value={form.rejectionPercent}
            onChange={(v) => updateField("rejectionPercent", v)}
          />

          <Input
            label={t.delayPercent}
            value={form.delayPercent}
            onChange={(v) => updateField("delayPercent", v)}
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