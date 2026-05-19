"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addMaintenanceLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MaintenanceEntryPage() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Maintenance Intelligence Entry",
      subtitle:
        "Capture machine downtime, repair cost, and breakdown frequency for maintenance risk and productivity loss analysis.",
      period: "Period",
      machineId: "Machine ID",
      downtimeHours: "Downtime Hours",
      repairCost: "Repair Cost",
      breakdownCount: "Breakdown Count",
      save: "Save Maintenance Log",
      saving: "Saving...",
      success: "Maintenance log saved successfully.",
      error: "Could not save maintenance log. Check Firebase settings.",
      placeholderPeriod: "May 2026",
      placeholderMachine: "Sewing-01 / Boiler-02",
    },

    bn: {
      title: "মেইনটেন্যান্স ইন্টেলিজেন্স এন্ট্রি",
      subtitle:
        "মেইনটেন্যান্স ঝুঁকি এবং উৎপাদনশীলতা ক্ষতি বিশ্লেষণের জন্য মেশিন ডাউনটাইম, রিপেয়ার খরচ এবং ব্রেকডাউন ফ্রিকোয়েন্সি সংরক্ষণ করুন।",
      period: "সময়কাল",
      machineId: "মেশিন আইডি",
      downtimeHours: "ডাউনটাইম ঘণ্টা",
      repairCost: "রিপেয়ার খরচ",
      breakdownCount: "ব্রেকডাউন সংখ্যা",
      save: "মেইনটেন্যান্স লগ সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      success: "মেইনটেন্যান্স লগ সফলভাবে সংরক্ষণ হয়েছে।",
      error:
        "মেইনটেন্যান্স লগ সংরক্ষণ করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।",
      placeholderPeriod: "মে ২০২৬",
      placeholderMachine: "সুইং-০১ / বয়লার-০২",
    },
  };

  const t = text[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    companyId: "demo-company",
    factoryId: "demo-factory",
    period: "",
    machineId: "",
    downtimeHours: "",
    repairCost: "",
    breakdownCount: "",
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
    setMessage("");

    try {
      await addMaintenanceLog({
        companyId: form.companyId,
        factoryId: form.factoryId,
        period: form.period,
        machineId: form.machineId,
        downtimeHours: Number(form.downtimeHours),
        repairCost: Number(form.repairCost),
        breakdownCount: Number(form.breakdownCount),
      });

      setMessage(t.success);

      setForm({
        companyId: "demo-company",
        factoryId: "demo-factory",
        period: "",
        machineId: "",
        downtimeHours: "",
        repairCost: "",
        breakdownCount: "",
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
      <div className="space-y-6">
        <section
          id="maintenance-intelligence-overview"
          className="scroll-mt-28 rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON Maintenance Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-4xl text-slate-600">
            {t.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              t.period,
              t.machineId,
              t.downtimeHours,
              t.repairCost,
              t.breakdownCount,
            ].map((item) => (
              <a
                key={item}
                href={`#${slugify(item)}`}
                className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 transition hover:-translate-y-1 hover:bg-cyan-100"
              >
                {item}
              </a>
            ))}
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              id={slugify(t.period)}
              label={t.period}
              value={form.period}
              onChange={(v) => updateField("period", v)}
              placeholder={t.placeholderPeriod}
            />

            <Input
              id={slugify(t.machineId)}
              label={t.machineId}
              value={form.machineId}
              onChange={(v) => updateField("machineId", v)}
              placeholder={t.placeholderMachine}
            />

            <Input
              id={slugify(t.downtimeHours)}
              label={t.downtimeHours}
              value={form.downtimeHours}
              onChange={(v) => updateField("downtimeHours", v)}
            />

            <Input
              id={slugify(t.repairCost)}
              label={t.repairCost}
              value={form.repairCost}
              onChange={(v) => updateField("repairCost", v)}
            />

            <Input
              id={slugify(t.breakdownCount)}
              label={t.breakdownCount}
              value={form.breakdownCount}
              onChange={(v) => updateField("breakdownCount", v)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? t.saving : t.save}
          </button>

          {message ? (
            <p className="mt-5 text-sm font-semibold text-cyan-700">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </DashboardShell>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-neutral-100 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-md"
    >
      <label className="block">
        <span className="text-sm font-semibold text-neutral-700">
          {label}
        </span>

        <input
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-cyan-500"
        />
      </label>
    </section>
  );
}