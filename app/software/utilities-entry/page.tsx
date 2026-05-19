"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addUtilitiesLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

      cards: [
        {
          title: "Electricity Cost",
          value: "Grid",
          desc: "Capture national grid electricity cost separately for utility-cost visibility.",
          target: "Utilities Log Form",
          className: "border-cyan-200 bg-cyan-50 text-cyan-950",
        },
        {
          title: "Generator Fuel",
          value: "Load Shedding",
          desc: "Track generator fuel cost separately during load shedding and power interruption.",
          target: "Utilities Intelligence Layer",
          className: "border-orange-200 bg-orange-50 text-orange-950",
        },
        {
          title: "Gas & Water",
          value: "Tracked",
          desc: "Record gas and water costs for utilities dependency and abnormal consumption review.",
          target: "Utilities Intelligence Layer",
          className: "border-blue-200 bg-blue-50 text-blue-950",
        },
        {
          title: "Executive Review",
          value: "Ready",
          desc: "Support management with energy cost, utility pressure, and corrective action visibility.",
          target: "Executive Utilities UX",
          className: "border-emerald-200 bg-emerald-50 text-emerald-950",
        },
      ],

      sections: {
        form: "Utilities Log Form",
        intelligence: "Utilities Intelligence Layer",
        ux: "Executive Utilities UX",
      },
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

      cards: [
        {
          title: "বিদ্যুৎ খরচ",
          value: "গ্রিড",
          desc: "ইউটিলিটি-কস্ট ভিজিবিলিটির জন্য জাতীয় গ্রিড বিদ্যুৎ খরচ আলাদাভাবে সংরক্ষণ করুন।",
          target: "ইউটিলিটিজ লগ ফর্ম",
          className: "border-cyan-200 bg-cyan-50 text-cyan-950",
        },
        {
          title: "জেনারেটর ফুয়েল",
          value: "লোডশেডিং",
          desc: "লোডশেডিং ও পাওয়ার interruption সময় জেনারেটর ফুয়েল খরচ আলাদাভাবে ট্র্যাক করুন।",
          target: "ইউটিলিটিজ ইন্টেলিজেন্স লেয়ার",
          className: "border-orange-200 bg-orange-50 text-orange-950",
        },
        {
          title: "গ্যাস ও পানি",
          value: "ট্র্যাকড",
          desc: "ইউটিলিটিজ dependency এবং abnormal consumption review এর জন্য গ্যাস ও পানির খরচ রেকর্ড করুন।",
          target: "ইউটিলিটিজ ইন্টেলিজেন্স লেয়ার",
          className: "border-blue-200 bg-blue-50 text-blue-950",
        },
        {
          title: "এক্সিকিউটিভ রিভিউ",
          value: "রেডি",
          desc: "এনার্জি কস্ট, ইউটিলিটি pressure এবং corrective action visibility দিয়ে management কে support করুন।",
          target: "এক্সিকিউটিভ ইউটিলিটিজ UX",
          className: "border-emerald-200 bg-emerald-50 text-emerald-950",
        },
      ],

      sections: {
        form: "ইউটিলিটিজ লগ ফর্ম",
        intelligence: "ইউটিলিটিজ ইন্টেলিজেন্স লেয়ার",
        ux: "এক্সিকিউটিভ ইউটিলিটিজ UX",
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
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Utilities Intelligence
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
            id={slugify(t.sections.intelligence)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {t.sections.intelligence}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Utility Cost, Energy Dependency & Firestore Data Pipeline
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This entry page preserves the live addUtilitiesLog Firestore
              function and converts submitted utilities values into numeric
              records for executive dashboards, utilities intelligence,
              forecasting, energy dependency analysis, cost pressure review,
              and operational risk monitoring.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Grid electricity cost visibility",
                "Generator fuel cost separation",
                "Gas and water cost tracking",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise-safe utilities data capture prepared for
                    manufacturing energy cost and operational risk analysis.
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
              Consultancy-Demo Utilities Intelligence UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, finance users,
              utility managers, maintenance teams, production leaders, and
              executives a clearer demo experience with clickable intelligence
              cards, structured scroll sections, safer JSX, stronger hover
              feedback, and a clean utilities-cost entry flow without changing
              the original Firestore business logic.
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