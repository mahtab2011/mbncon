"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addManpowerLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function WorkforceEntryPage() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Workforce Intelligence Entry",
      subtitle:
        "Capture manpower planning, absenteeism, actual attendance, and overtime dependency for live workforce intelligence.",
      period: "Period",
      plannedWorkers: "Planned Workers",
      actualWorkers: "Actual Workers",
      absenteeismPercent: "Absenteeism %",
      overtimeHours: "Overtime Hours",
      save: "Save Workforce Log",
      saving: "Saving...",
      success: "Workforce log saved successfully.",
      error: "Could not save workforce log. Check Firebase settings.",
      placeholderPeriod: "May 2026",
    },
    bn: {
      title: "ওয়ার্কফোর্স ইন্টেলিজেন্স এন্ট্রি",
      subtitle:
        "লাইভ ওয়ার্কফোর্স ইন্টেলিজেন্সের জন্য জনবল পরিকল্পনা, অনুপস্থিতি, বাস্তব উপস্থিতি এবং ওভারটাইম নির্ভরতা সংরক্ষণ করুন।",
      period: "সময়কাল",
      plannedWorkers: "পরিকল্পিত কর্মী",
      actualWorkers: "বাস্তব কর্মী",
      absenteeismPercent: "অনুপস্থিতি %",
      overtimeHours: "ওভারটাইম ঘণ্টা",
      save: "ওয়ার্কফোর্স লগ সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      success: "ওয়ার্কফোর্স লগ সফলভাবে সংরক্ষণ হয়েছে।",
      error: "ওয়ার্কফোর্স লগ সংরক্ষণ করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।",
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
    plannedWorkers: "",
    actualWorkers: "",
    absenteeismPercent: "",
    overtimeHours: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await addManpowerLog({
        companyId: form.companyId,
        factoryId: form.factoryId,
        period: form.period,
        plannedWorkers: Number(form.plannedWorkers),
        actualWorkers: Number(form.actualWorkers),
        absenteeismPercent: Number(form.absenteeismPercent),
        overtimeHours: Number(form.overtimeHours),
      });

      setMessage(t.success);

      setForm({
        companyId: "demo-company",
        factoryId: "demo-factory",
        period: "",
        plannedWorkers: "",
        actualWorkers: "",
        absenteeismPercent: "",
        overtimeHours: "",
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
            label={t.plannedWorkers}
            value={form.plannedWorkers}
            onChange={(v) => updateField("plannedWorkers", v)}
          />

          <Input
            label={t.actualWorkers}
            value={form.actualWorkers}
            onChange={(v) => updateField("actualWorkers", v)}
          />

          <Input
            label={t.absenteeismPercent}
            value={form.absenteeismPercent}
            onChange={(v) => updateField("absenteeismPercent", v)}
          />

          <Input
            label={t.overtimeHours}
            value={form.overtimeHours}
            onChange={(v) => updateField("overtimeHours", v)}
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