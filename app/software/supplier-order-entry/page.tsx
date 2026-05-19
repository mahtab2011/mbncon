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
    title: "Supplier Order Intelligence Entry",
    eyebrow: "MBNCON Supplier Order Intelligence",
    subtitle:
      "Track all supplier orders, supply category, required date, delivery commitment, price, quality risk, delay risk, and production impact.",
    save: "Save Supplier Order Record",
    saving: "Saving...",
    success: "Supplier order intelligence record saved successfully.",

    cards: [
      {
        title: "Supplier Commitment",
        value: "Tracked",
        desc: "Capture supplier order, PO number, required date, promised date, received quantity, and pending quantity.",
        target: "Supplier Order Form",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Delivery Risk",
        value: "Visible",
        desc: "Track delay days, delivery commitment risk, pending supply, and production impact exposure.",
        target: "Supplier Risk Intelligence",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "Price & Quality",
        value: "Monitored",
        desc: "Monitor price risk, quality risk, total order value, and supply category performance.",
        target: "Supplier Risk Intelligence",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Executive Recovery",
        value: "Ready",
        desc: "Support sourcing, commercial, production, and director-level supplier recovery control.",
        target: "Executive Supplier UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "Supplier Order Form",
      intelligence: "Supplier Risk Intelligence",
      ux: "Executive Supplier UX",
    },

    fields: {
      period: "Reporting Period",
      supplier: "Supplier Name",
      supplyCategory: "Supply Category",
      itemName: "Item / Material / Service Name",
      poNumber: "PO Number",
      orderQty: "Order Quantity",
      unitPrice: "Unit Price",
      totalValue: "Total Order Value",
      orderDate: "Order Date",
      requiredDate: "Required Delivery Date",
      promisedDate: "Supplier Promised Date",
      receivedQty: "Received Quantity",
      pendingQty: "Pending Quantity",
      delayDays: "Delay Days",
      qualityRisk: "Quality Risk Level",
      priceRisk: "Price Risk Level",
      productionImpact: "Production Impact",
      correctiveAction: "Corrective Action",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "সাপ্লায়ার অর্ডার ইন্টেলিজেন্স এন্ট্রি",
    eyebrow: "MBNCON সাপ্লায়ার অর্ডার ইন্টেলিজেন্স",
    subtitle:
      "সব ধরনের সাপ্লায়ার অর্ডার, সাপ্লাই ক্যাটাগরি, প্রয়োজনীয় তারিখ, ডেলিভারি প্রতিশ্রুতি, মূল্য, কোয়ালিটি ঝুঁকি, বিলম্ব ঝুঁকি এবং প্রোডাকশন প্রভাব ট্র্যাক করুন।",
    save: "সাপ্লায়ার অর্ডার রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "সাপ্লায়ার অর্ডার ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "সাপ্লায়ার প্রতিশ্রুতি",
        value: "ট্র্যাকড",
        desc: "সাপ্লায়ার অর্ডার, PO নম্বর, প্রয়োজনীয় তারিখ, প্রতিশ্রুত তারিখ, প্রাপ্ত পরিমাণ এবং পেন্ডিং পরিমাণ সংরক্ষণ করুন।",
        target: "সাপ্লায়ার অর্ডার ফর্ম",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "ডেলিভারি ঝুঁকি",
        value: "ভিজিবল",
        desc: "বিলম্বের দিন, ডেলিভারি প্রতিশ্রুতি ঝুঁকি, পেন্ডিং সাপ্লাই এবং প্রোডাকশন প্রভাব ট্র্যাক করুন।",
        target: "সাপ্লায়ার রিস্ক ইন্টেলিজেন্স",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "মূল্য ও কোয়ালিটি",
        value: "মনিটরড",
        desc: "প্রাইস ঝুঁকি, কোয়ালিটি ঝুঁকি, মোট অর্ডার মূল্য এবং সাপ্লাই ক্যাটাগরি পারফরম্যান্স মনিটর করুন।",
        target: "সাপ্লায়ার রিস্ক ইন্টেলিজেন্স",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "এক্সিকিউটিভ রিকভারি",
        value: "রেডি",
        desc: "সোর্সিং, কমার্শিয়াল, প্রোডাকশন এবং ডিরেক্টর-লেভেল সাপ্লায়ার রিকভারি কন্ট্রোল সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ সাপ্লায়ার UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "সাপ্লায়ার অর্ডার ফর্ম",
      intelligence: "সাপ্লায়ার রিস্ক ইন্টেলিজেন্স",
      ux: "এক্সিকিউটিভ সাপ্লায়ার UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ারের নাম",
      supplyCategory: "সাপ্লাই ক্যাটাগরি",
      itemName: "আইটেম / মেটেরিয়াল / সার্ভিসের নাম",
      poNumber: "PO নম্বর",
      orderQty: "অর্ডার পরিমাণ",
      unitPrice: "প্রতি ইউনিট মূল্য",
      totalValue: "মোট অর্ডার মূল্য",
      orderDate: "অর্ডার তারিখ",
      requiredDate: "প্রয়োজনীয় ডেলিভারি তারিখ",
      promisedDate: "সাপ্লায়ারের প্রতিশ্রুত তারিখ",
      receivedQty: "প্রাপ্ত পরিমাণ",
      pendingQty: "পেন্ডিং পরিমাণ",
      delayDays: "বিলম্বের দিন",
      qualityRisk: "কোয়ালিটি ঝুঁকির মাত্রা",
      priceRisk: "মূল্য ঝুঁকির মাত্রা",
      productionImpact: "প্রোডাকশন প্রভাব",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function SupplierOrderEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    supplyCategory: "",
    itemName: "",
    poNumber: "",
    orderQty: "",
    unitPrice: "",
    totalValue: "",
    orderDate: "",
    requiredDate: "",
    promisedDate: "",
    receivedQty: "",
    pendingQty: "",
    delayDays: "",
    qualityRisk: "",
    priceRisk: "",
    productionImpact: "",
    correctiveAction: "",
    remarks: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      period: "",
      supplier: "",
      supplyCategory: "",
      itemName: "",
      poNumber: "",
      orderQty: "",
      unitPrice: "",
      totalValue: "",
      orderDate: "",
      requiredDate: "",
      promisedDate: "",
      receivedQty: "",
      pendingQty: "",
      delayDays: "",
      qualityRisk: "",
      priceRisk: "",
      productionImpact: "",
      correctiveAction: "",
      remarks: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    setTimeout(() => {
      setSaving(false);
      setMessage(t.success);
      resetForm();
    }, 800);
  };

  return (
    <DashboardShell title={t.title} subtitle={t.subtitle}>
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              {t.eyebrow}
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

                    {key === "productionImpact" ||
                    key === "correctiveAction" ||
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
            id={slugify(t.sections.intelligence)}
            className="scroll-mt-28 rounded-3xl bg-slate-950 p-8 text-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {t.sections.intelligence}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold">
              Supplier Delivery, Price, Quality & Production Impact Control
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures supplier, supply category, item name, PO
              number, order quantity, unit price, total value, order date,
              required date, promised date, received quantity, pending quantity,
              delay days, quality risk, price risk, production impact,
              corrective action, and management remarks for supplier order
              intelligence.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Supplier delivery commitment visibility",
                "Price and quality risk control",
                "Production impact and recovery action",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise supplier intelligence prepared for sourcing,
                    commercial, production, and executive follow-up.
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
              Consultancy-Demo Supplier Order UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, sourcing teams,
              commercial teams, production leaders, and executives a clearer
              demo experience with clickable intelligence cards, structured
              scroll sections, enterprise-safe JSX, stronger hover feedback,
              and practical supplier order control storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}