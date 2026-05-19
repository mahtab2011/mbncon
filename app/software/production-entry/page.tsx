"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addProductionLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
      kpiTitle1: "Production Plan",
      kpiTitle2: "Actual Output",
      kpiTitle3: "Efficiency",
      kpiTitle4: "Delay Risk",
      kpiDesc1: "Capture planned output for executive production visibility.",
      kpiDesc2: "Record actual factory output for performance comparison.",
      kpiDesc3: "Track production efficiency for AI scoring and forecasting.",
      kpiDesc4: "Monitor production delay percentage for operational risk.",
      formSection: "Production Log Form",
      logicSection: "Enterprise Firestore Logic",
      uxSection: "Executive Intelligence UX",
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
      kpiTitle1: "প্রোডাকশন পরিকল্পনা",
      kpiTitle2: "বাস্তব উৎপাদন",
      kpiTitle3: "দক্ষতা",
      kpiTitle4: "বিলম্ব ঝুঁকি",
      kpiDesc1: "এক্সিকিউটিভ প্রোডাকশন ভিজিবিলিটির জন্য পরিকল্পিত উৎপাদন সংরক্ষণ করুন।",
      kpiDesc2: "পারফরম্যান্স তুলনার জন্য বাস্তব ফ্যাক্টরি আউটপুট রেকর্ড করুন।",
      kpiDesc3: "AI স্কোরিং ও ফোরকাস্টিংয়ের জন্য উৎপাদন দক্ষতা ট্র্যাক করুন।",
      kpiDesc4: "অপারেশনাল ঝুঁকির জন্য প্রোডাকশন বিলম্ব শতাংশ মনিটর করুন।",
      formSection: "প্রোডাকশন লগ ফর্ম",
      logicSection: "এন্টারপ্রাইজ Firestore লজিক",
      uxSection: "এক্সিকিউটিভ ইন্টেলিজেন্স UX",
    },
  };

  const t = text[language];

  const intelligenceCards = [
    {
      title: t.kpiTitle1,
      value: t.plannedOutput,
      description: t.kpiDesc1,
      target: t.formSection,
      className: "border-cyan-200 bg-cyan-50 text-cyan-950",
    },
    {
      title: t.kpiTitle2,
      value: t.actualOutput,
      description: t.kpiDesc2,
      target: t.formSection,
      className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    },
    {
      title: t.kpiTitle3,
      value: t.efficiencyPercent,
      description: t.kpiDesc3,
      target: t.logicSection,
      className: "border-blue-200 bg-blue-50 text-blue-950",
    },
    {
      title: t.kpiTitle4,
      value: t.delayPercent,
      description: t.kpiDesc4,
      target: t.uxSection,
      className: "border-orange-200 bg-orange-50 text-orange-950",
    },
  ];

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
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Manufacturing Intelligence
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300 md:text-xl">
              {t.subtitle}
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {intelligenceCards.map((card) => {
              const targetId = slugify(card.target);

              return (
                <a
                  key={card.title}
                  href={`#${targetId}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </h2>

                  <p className="mt-4 leading-7">{card.description}</p>

                  <p className="mt-5 text-sm font-bold opacity-70">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section
            id={slugify(t.formSection)}
            className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                {t.formSection}
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
                {t.title}
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-600">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
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
                className="mt-8 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? t.saving : t.save}
              </button>

              {message ? (
                <p className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4 text-sm font-semibold text-cyan-800">
                  {message}
                </p>
              ) : null}
            </form>
          </section>

          <section
            id={slugify(t.logicSection)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              {t.logicSection}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Firestore Production Data Pipeline
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This entry page preserves the live addProductionLog Firestore
              function and converts submitted production values into numeric
              records for executive dashboards, forecasting engines, scoring
              logic, and AI operational risk analysis.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Production planning data",
                "Actual factory output",
                "Efficiency and rejection visibility",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise-safe data capture prepared for MBNCON
                    manufacturing intelligence reporting.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id={slugify(t.uxSection)}
            className="scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
              {t.uxSection}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-cyan-950">
              Consultancy-Demo Executive UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners and executives a
              clearer demo experience with clickable intelligence cards,
              structured scroll sections, safer JSX, stronger hover feedback,
              and a clean production-data entry flow without changing the
              original business logic.
            </p>
          </section>
        </div>
      </main>
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
        className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
      />
    </label>
  );
}