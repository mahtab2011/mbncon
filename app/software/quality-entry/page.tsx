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
    title: "Quality Intelligence Entry",
    subtitle:
      "Monitor rejection, rework, DHU, buyer complaints, audit findings, and corrective action performance.",
    save: "Save Quality Record",
    saving: "Saving...",
    success: "Quality intelligence record saved successfully.",

    cards: [
      {
        title: "Rejection Control",
        value: "Quality Risk",
        desc: "Track rejected quantity, rework quantity, and DHU for early quality visibility.",
        target: "Quality Record Form",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "Buyer Complaint",
        value: "Monitored",
        desc: "Capture buyer complaints and audit findings for executive quality action.",
        target: "Corrective Action Intelligence",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Root Cause",
        value: "Analysed",
        desc: "Record root cause, corrective action, and Kaizen improvement discipline.",
        target: "Corrective Action Intelligence",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Quality Recovery",
        value: "Ready",
        desc: "Support consultancy-demo quality recovery and continuous improvement workflow.",
        target: "Executive Quality UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "Quality Record Form",
      corrective: "Corrective Action Intelligence",
      ux: "Executive Quality UX",
    },

    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      product: "Product / Style",
      line: "Production Line",
      inspectionQty: "Inspection Quantity",
      rejectedQty: "Rejected Quantity",
      reworkQty: "Rework Quantity",
      dhu: "DHU %",
      inlineDefects: "Inline Defects",
      finishingDefects: "Finishing Defects",
      buyerComplaints: "Buyer Complaints",
      auditFindings: "Audit Findings",
      rootCause: "Root Cause Analysis",
      correctiveAction: "Corrective Action",
      kaizenImprovement: "Kaizen Improvement",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "কোয়ালিটি ইন্টেলিজেন্স এন্ট্রি",
    subtitle:
      "রিজেকশন, রিওয়ার্ক, DHU, বায়ার অভিযোগ, অডিট ফাইন্ডিং এবং কারেক্টিভ অ্যাকশন পারফরম্যান্স মনিটর করুন।",
    save: "কোয়ালিটি রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কোয়ালিটি ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "রিজেকশন কন্ট্রোল",
        value: "কোয়ালিটি ঝুঁকি",
        desc: "প্রাথমিক কোয়ালিটি ভিজিবিলিটির জন্য রিজেক্টেড পরিমাণ, রিওয়ার্ক ও DHU ট্র্যাক করুন।",
        target: "কোয়ালিটি রেকর্ড ফর্ম",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "বায়ার অভিযোগ",
        value: "মনিটরড",
        desc: "এক্সিকিউটিভ কোয়ালিটি অ্যাকশনের জন্য বায়ার অভিযোগ ও অডিট ফাইন্ডিং সংরক্ষণ করুন।",
        target: "কারেক্টিভ অ্যাকশন ইন্টেলিজেন্স",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "রুট কজ",
        value: "বিশ্লেষিত",
        desc: "রুট কজ, কারেক্টিভ অ্যাকশন এবং কাইজেন উন্নয়ন ডিসিপ্লিন রেকর্ড করুন।",
        target: "কারেক্টিভ অ্যাকশন ইন্টেলিজেন্স",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "কোয়ালিটি রিকভারি",
        value: "রেডি",
        desc: "কনসালটেন্সি-ডেমো কোয়ালিটি রিকভারি ও কন্টিনিউয়াস ইমপ্রুভমেন্ট ওয়ার্কফ্লো সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ কোয়ালিটি UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "কোয়ালিটি রেকর্ড ফর্ম",
      corrective: "কারেক্টিভ অ্যাকশন ইন্টেলিজেন্স",
      ux: "এক্সিকিউটিভ কোয়ালিটি UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      product: "পণ্য / স্টাইল",
      line: "প্রোডাকশন লাইন",
      inspectionQty: "ইন্সপেকশন পরিমাণ",
      rejectedQty: "রিজেক্টেড পরিমাণ",
      reworkQty: "রিওয়ার্ক পরিমাণ",
      dhu: "DHU %",
      inlineDefects: "ইনলাইন ত্রুটি",
      finishingDefects: "ফিনিশিং ত্রুটি",
      buyerComplaints: "বায়ার অভিযোগ",
      auditFindings: "অডিট ফাইন্ডিং",
      rootCause: "রুট কজ অ্যানালাইসিস",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      kaizenImprovement: "কাইজেন উন্নয়ন",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function QualityEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    buyer: "",
    product: "",
    line: "",
    inspectionQty: "",
    rejectedQty: "",
    reworkQty: "",
    dhu: "",
    inlineDefects: "",
    finishingDefects: "",
    buyerComplaints: "",
    auditFindings: "",
    rootCause: "",
    correctiveAction: "",
    kaizenImprovement: "",
    remarks: "",
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

    setTimeout(() => {
      setSaving(false);

      setMessage(t.success);

      setForm({
        period: "",
        buyer: "",
        product: "",
        line: "",
        inspectionQty: "",
        rejectedQty: "",
        reworkQty: "",
        dhu: "",
        inlineDefects: "",
        finishingDefects: "",
        buyerComplaints: "",
        auditFindings: "",
        rootCause: "",
        correctiveAction: "",
        kaizenImprovement: "",
        remarks: "",
      });
    }, 1000);
  };

  return (
    <DashboardShell title={t.title} subtitle={t.subtitle}>
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Quality Intelligence
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
                {Object.entries(t.fields).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {label}
                    </label>

                    {key === "rootCause" ||
                    key === "correctiveAction" ||
                    key === "kaizenImprovement" ||
                    key === "remarks" ? (
                      <textarea
                        rows={4}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />
                    ) : (
                      <input
                        type="text"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t.saving : t.save}
                </button>

                {message ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                    {message}
                  </p>
                ) : null}
              </div>
            </form>
          </section>

          <section
            id={slugify(t.sections.corrective)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {t.sections.corrective}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Quality Root Cause & Recovery Discipline
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures inspection results, rejection volume,
              rework pressure, DHU, buyer complaints, audit findings, root
              cause analysis, corrective action, Kaizen improvement, and
              management remarks for factory-level quality intelligence.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Defect and rework visibility",
                "Buyer complaint tracking",
                "Corrective action discipline",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise quality intelligence prepared for audit,
                    management review, and continuous improvement control.
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
              Consultancy-Demo Quality Intelligence UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, quality heads, and
              executives a clearer demo experience with clickable intelligence
              cards, scroll-linked sections, safer JSX, stronger hover
              feedback, and structured quality recovery storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}