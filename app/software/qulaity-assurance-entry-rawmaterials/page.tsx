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
    title: "Raw Material Quality Assurance",
    subtitle:
      "Monitor incoming raw material quality, supplier compliance, inspection failures, laboratory checks, and material approval intelligence.",

    save: "Save QA Record",
    saving: "Saving...",
    success: "Raw material QA record saved successfully.",

    cards: [
      {
        title: "Supplier Compliance",
        value: "Tracked",
        desc: "Monitor supplier quality compliance and incoming material approval.",
        target: "QA Record Form",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Inspection Failure",
        value: "Visible",
        desc: "Track inspection rejection, defects, GSM variation, and quality instability.",
        target: "Inspection Intelligence",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "Laboratory Control",
        value: "Monitored",
        desc: "Capture laboratory results, shrinkage, and technical compliance findings.",
        target: "Inspection Intelligence",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Material Recovery",
        value: "Ready",
        desc: "Support corrective action and supplier quality recovery workflow.",
        target: "Executive QA UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "QA Record Form",
      inspection: "Inspection Intelligence",
      ux: "Executive QA UX",
    },

    fields: {
      period: "Reporting Period",
      supplier: "Supplier Name",
      material: "Material Name",
      batchNo: "Batch Number",
      poNumber: "PO Number",
      receivedQty: "Received Quantity",
      inspectedQty: "Inspected Quantity",
      rejectedQty: "Rejected Quantity",
      defectType: "Defect Type",
      gsmVariation: "GSM / Thickness Variation",
      colorVariation: "Color Variation",
      shrinkage: "Shrinkage %",
      laboratoryResult: "Laboratory Result",
      complianceStatus: "Compliance Status",
      deliveryCondition: "Delivery Condition",
      approvalStatus: "Approval Status",
      correctiveAction: "Corrective Action",
      qaRemarks: "QA Remarks",
    },
  },

  bn: {
    title: "কাঁচামাল কোয়ালিটি অ্যাসিউরেন্স",
    subtitle:
      "ইনকামিং কাঁচামালের কোয়ালিটি, সাপ্লায়ার কমপ্লায়েন্স, ইন্সপেকশন ব্যর্থতা, ল্যাব টেস্ট এবং মেটেরিয়াল অনুমোদন ইন্টেলিজেন্স মনিটর করুন।",

    save: "QA রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কাঁচামাল QA রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "সাপ্লায়ার কমপ্লায়েন্স",
        value: "ট্র্যাকড",
        desc: "সাপ্লায়ার কোয়ালিটি কমপ্লায়েন্স ও ইনকামিং মেটেরিয়াল অনুমোদন মনিটর করুন।",
        target: "QA রেকর্ড ফর্ম",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "ইন্সপেকশন ব্যর্থতা",
        value: "ভিজিবল",
        desc: "ইন্সপেকশন রিজেকশন, ডিফেক্ট, GSM ভ্যারিয়েশন ও কোয়ালিটি অস্থিতিশীলতা ট্র্যাক করুন।",
        target: "ইন্সপেকশন ইন্টেলিজেন্স",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "ল্যাব কন্ট্রোল",
        value: "মনিটরড",
        desc: "ল্যাব রেজাল্ট, শ্রিংকেজ ও টেকনিক্যাল কমপ্লায়েন্স ফাইন্ডিং সংরক্ষণ করুন।",
        target: "ইন্সপেকশন ইন্টেলিজেন্স",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "মেটেরিয়াল রিকভারি",
        value: "রেডি",
        desc: "কারেক্টিভ অ্যাকশন ও সাপ্লায়ার কোয়ালিটি রিকভারি ওয়ার্কফ্লো সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ QA UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "QA রেকর্ড ফর্ম",
      inspection: "ইন্সপেকশন ইন্টেলিজেন্স",
      ux: "এক্সিকিউটিভ QA UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ারের নাম",
      material: "মেটেরিয়ালের নাম",
      batchNo: "ব্যাচ নম্বর",
      poNumber: "PO নম্বর",
      receivedQty: "প্রাপ্ত পরিমাণ",
      inspectedQty: "ইন্সপেকশন পরিমাণ",
      rejectedQty: "রিজেক্টেড পরিমাণ",
      defectType: "ত্রুটির ধরন",
      gsmVariation: "GSM / পুরুত্ব পরিবর্তন",
      colorVariation: "রঙের ভিন্নতা",
      shrinkage: "শ্রিংকেজ %",
      laboratoryResult: "ল্যাবরেটরি ফলাফল",
      complianceStatus: "কমপ্লায়েন্স স্ট্যাটাস",
      deliveryCondition: "ডেলিভারি অবস্থা",
      approvalStatus: "অনুমোদন অবস্থা",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      qaRemarks: "QA মন্তব্য",
    },
  },
};

export default function RawMaterialQualityAssurancePage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    material: "",
    batchNo: "",
    poNumber: "",
    receivedQty: "",
    inspectedQty: "",
    rejectedQty: "",
    defectType: "",
    gsmVariation: "",
    colorVariation: "",
    shrinkage: "",
    laboratoryResult: "",
    complianceStatus: "",
    deliveryCondition: "",
    approvalStatus: "",
    correctiveAction: "",
    qaRemarks: "",
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
        supplier: "",
        material: "",
        batchNo: "",
        poNumber: "",
        receivedQty: "",
        inspectedQty: "",
        rejectedQty: "",
        defectType: "",
        gsmVariation: "",
        colorVariation: "",
        shrinkage: "",
        laboratoryResult: "",
        complianceStatus: "",
        deliveryCondition: "",
        approvalStatus: "",
        correctiveAction: "",
        qaRemarks: "",
      });
    }, 1000);
  };

  return (
    <DashboardShell title={t.title} subtitle={t.subtitle}>
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              MBNCON Raw Material QA Intelligence
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

                    {key === "correctiveAction" ||
                    key === "qaRemarks" ? (
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
            id={slugify(t.sections.inspection)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {t.sections.inspection}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Incoming Material Inspection & Supplier Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures incoming raw material inspection data,
              supplier compliance, laboratory findings, GSM variation,
              shrinkage, defect type, approval status, and corrective action
              visibility for manufacturing quality assurance intelligence.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Supplier compliance monitoring",
                "Incoming material defect visibility",
                "Corrective action & approval control",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise quality assurance visibility prepared for
                    supplier recovery and operational control.
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
              Consultancy-Demo Material QA UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, QA teams, sourcing
              managers, and executives a clearer demo experience with
              clickable intelligence cards, structured scroll sections,
              enterprise-safe JSX, and stronger operational quality storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}