"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addWastageLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

      cards: [
        {
          title: "Material Issue",
          value: "Tracked",
          desc: "Capture issued quantity, used quantity, and material usage visibility.",
          target: "Wastage Log Form",
          className: "border-red-200 bg-red-50 text-red-950",
        },
        {
          title: "Wastage Risk",
          value: "Visible",
          desc: "Track wastage quantity, rejection percentage, and hidden factory loss.",
          target: "Wastage Intelligence Layer",
          className: "border-orange-200 bg-orange-50 text-orange-950",
        },
        {
          title: "Financial Leakage",
          value: "Measured",
          desc: "Supports financial leakage analysis and operational recovery planning.",
          target: "Wastage Intelligence Layer",
          className: "border-cyan-200 bg-cyan-50 text-cyan-950",
        },
        {
          title: "Executive Review",
          value: "Ready",
          desc: "Prepared for executive dashboards, cost review, and management action.",
          target: "Executive Wastage UX",
          className: "border-emerald-200 bg-emerald-50 text-emerald-950",
        },
      ],

      sections: {
        form: "Wastage Log Form",
        intelligence: "Wastage Intelligence Layer",
        ux: "Executive Wastage UX",
      },
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

      cards: [
        {
          title: "মেটেরিয়াল ইস্যু",
          value: "ট্র্যাকড",
          desc: "ইস্যুকৃত পরিমাণ, ব্যবহৃত পরিমাণ এবং মেটেরিয়াল ব্যবহারের ভিজিবিলিটি সংরক্ষণ করুন।",
          target: "ওয়েস্টেজ লগ ফর্ম",
          className: "border-red-200 bg-red-50 text-red-950",
        },
        {
          title: "ওয়েস্টেজ রিস্ক",
          value: "ভিজিবল",
          desc: "ওয়েস্টেজ পরিমাণ, রিজেকশন শতাংশ এবং গোপন ক্ষতি ট্র্যাক করুন।",
          target: "ওয়েস্টেজ ইন্টেলিজেন্স লেয়ার",
          className: "border-orange-200 bg-orange-50 text-orange-950",
        },
        {
          title: "ফিনান্সিয়াল লিকেজ",
          value: "মেজার্ড",
          desc: "ফিনান্সিয়াল লিকেজ বিশ্লেষণ এবং অপারেশনাল রিকভারি পরিকল্পনা সাপোর্ট করে।",
          target: "ওয়েস্টেজ ইন্টেলিজেন্স লেয়ার",
          className: "border-cyan-200 bg-cyan-50 text-cyan-950",
        },
        {
          title: "এক্সিকিউটিভ রিভিউ",
          value: "রেডি",
          desc: "এক্সিকিউটিভ ড্যাশবোর্ড, কস্ট রিভিউ এবং ম্যানেজমেন্ট অ্যাকশনের জন্য প্রস্তুত।",
          target: "এক্সিকিউটিভ ওয়েস্টেজ UX",
          className: "border-emerald-200 bg-emerald-50 text-emerald-950",
        },
      ],

      sections: {
        form: "ওয়েস্টেজ লগ ফর্ম",
        intelligence: "ওয়েস্টেজ ইন্টেলিজেন্স লেয়ার",
        ux: "এক্সিকিউটিভ ওয়েস্টেজ UX",
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
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Wastage Intelligence
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
              Wastage, Rejection & Financial Leakage Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This entry page preserves the live addWastageLog Firestore
              function and converts material usage, wastage, and rejection
              values into structured intelligence for executive dashboards,
              hidden-loss visibility, financial leakage analysis, and factory
              recovery planning.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Material issue versus actual usage analysis",
                "Hidden wastage and rejection visibility",
                "Executive recovery and cost-control intelligence",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise-safe wastage intelligence prepared for factory
                    loss reduction and operational efficiency improvement.
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
              Consultancy-Demo Wastage Intelligence UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, IE teams,
              merchandising teams, finance users, production leaders, and
              executives a clearer demo experience with clickable intelligence
              cards, structured scroll sections, stronger hover transitions,
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