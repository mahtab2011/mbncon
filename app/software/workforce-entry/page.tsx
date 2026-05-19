"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addManpowerLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

      cards: [
        {
          title: "Manpower Planning",
          value: "Tracked",
          desc: "Capture planned workers and actual workers for workforce planning visibility.",
          target: "Workforce Log Form",
          className: "border-cyan-200 bg-cyan-50 text-cyan-950",
        },
        {
          title: "Absenteeism Risk",
          value: "Visible",
          desc: "Track absenteeism percentage and workforce availability pressure.",
          target: "Workforce Intelligence Layer",
          className: "border-red-200 bg-red-50 text-red-950",
        },
        {
          title: "Overtime Dependency",
          value: "Measured",
          desc: "Record overtime hours for labour cost and production recovery analysis.",
          target: "Workforce Intelligence Layer",
          className: "border-orange-200 bg-orange-50 text-orange-950",
        },
        {
          title: "Executive Review",
          value: "Ready",
          desc: "Support executive dashboards, workforce risk review, and management action.",
          target: "Executive Workforce UX",
          className: "border-emerald-200 bg-emerald-50 text-emerald-950",
        },
      ],

      sections: {
        form: "Workforce Log Form",
        intelligence: "Workforce Intelligence Layer",
        ux: "Executive Workforce UX",
      },
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

      cards: [
        {
          title: "জনবল পরিকল্পনা",
          value: "ট্র্যাকড",
          desc: "ওয়ার্কফোর্স পরিকল্পনার জন্য পরিকল্পিত কর্মী ও বাস্তব কর্মী সংরক্ষণ করুন।",
          target: "ওয়ার্কফোর্স লগ ফর্ম",
          className: "border-cyan-200 bg-cyan-50 text-cyan-950",
        },
        {
          title: "অনুপস্থিতি ঝুঁকি",
          value: "ভিজিবল",
          desc: "অনুপস্থিতি শতাংশ এবং কর্মী উপস্থিতির চাপ ট্র্যাক করুন।",
          target: "ওয়ার্কফোর্স ইন্টেলিজেন্স লেয়ার",
          className: "border-red-200 bg-red-50 text-red-950",
        },
        {
          title: "ওভারটাইম নির্ভরতা",
          value: "মেজার্ড",
          desc: "শ্রম খরচ এবং প্রোডাকশন রিকভারি বিশ্লেষণের জন্য ওভারটাইম ঘণ্টা রেকর্ড করুন।",
          target: "ওয়ার্কফোর্স ইন্টেলিজেন্স লেয়ার",
          className: "border-orange-200 bg-orange-50 text-orange-950",
        },
        {
          title: "এক্সিকিউটিভ রিভিউ",
          value: "রেডি",
          desc: "এক্সিকিউটিভ ড্যাশবোর্ড, ওয়ার্কফোর্স ঝুঁকি রিভিউ এবং ম্যানেজমেন্ট অ্যাকশন সাপোর্ট করুন।",
          target: "এক্সিকিউটিভ ওয়ার্কফোর্স UX",
          className: "border-emerald-200 bg-emerald-50 text-emerald-950",
        },
      ],

      sections: {
        form: "ওয়ার্কফোর্স লগ ফর্ম",
        intelligence: "ওয়ার্কফোর্স ইন্টেলিজেন্স লেয়ার",
        ux: "এক্সিকিউটিভ ওয়ার্কফোর্স UX",
      },
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
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Workforce Intelligence
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-300 md:text-xl">
              {t.subtitle}
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.cards.map((card) => {
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

                  <p className="mt-4 leading-7">{card.desc}</p>

                  <p className="mt-5 text-sm font-bold opacity-70">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section
            id={slugify(t.sections.form)}
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                {t.sections.form}
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
                className="mt-8 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
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
            id={slugify(t.sections.intelligence)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {t.sections.intelligence}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Manpower Planning, Absenteeism & Overtime Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This entry page preserves the live addManpowerLog Firestore
              function and converts workforce planning, attendance,
              absenteeism, and overtime values into numeric records for
              executive dashboards, workforce risk analysis, production
              stability review, and labour cost visibility.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Planned versus actual manpower visibility",
                "Absenteeism and attendance risk analysis",
                "Overtime dependency and labour cost tracking",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise-safe workforce intelligence prepared for
                    production continuity, staffing discipline, and executive
                    action.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id={slugify(t.sections.ux)}
            className="scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
              {t.sections.ux}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-cyan-950">
              Consultancy-Demo Workforce Intelligence UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, HR teams, production
              leaders, line supervisors, finance users, and executives a
              clearer demo experience with clickable intelligence cards,
              structured scroll sections, stronger hover transitions,
              enterprise-safe JSX, and preserved Firestore business logic.
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