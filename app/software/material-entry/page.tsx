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
    title: "Material Intelligence Entry",

    subtitle:
      "Track supplier performance, material quality, delivery delays, transport cost, warehouse losses, and inventory risks through operational intelligence visibility.",

    save: "Save Material Record",
    saving: "Saving...",
    success: "Material record saved successfully.",

    intelligenceCards: [
      "Supplier Performance Intelligence",
      "Material Quality Visibility",
      "Transport Cost Monitoring",
      "Inventory Risk Intelligence",
    ],

    insights: [
      "Supplier delivery delays increase production bottleneck risk.",
      "Material rejection creates hidden operational losses.",
      "Warehouse loss directly impacts profitability.",
      "Transport instability increases lead-time uncertainty.",
      "Poor supplier quality increases rework and downtime.",
      "Inventory imbalance creates cashflow pressure.",
    ],

    fields: {
      period: "Reporting Period",
      supplier: "Supplier Name",
      material: "Material Name",
      category: "Material Category",
      orderedQty: "Ordered Quantity",
      receivedQty: "Received Quantity",
      rejectedQty: "Rejected Quantity",
      price: "Unit Price",
      transportCost: "Transport Cost",
      leadTime: "Lead Time (Days)",
      delayDays: "Delivery Delay (Days)",
      qualityScore: "Quality Score %",
      warehouseLoss: "Warehouse Loss %",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "মেটেরিয়াল ইন্টেলিজেন্স এন্ট্রি",

    subtitle:
      "সাপ্লায়ার পারফরম্যান্স, মেটেরিয়াল কোয়ালিটি, ডেলিভারি বিলম্ব, পরিবহন খরচ, ওয়্যারহাউস ক্ষতি এবং ইনভেন্টরি ঝুঁকি ট্র্যাক করুন।",

    save: "মেটেরিয়াল রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "মেটেরিয়াল রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    intelligenceCards: [
      "সাপ্লায়ার পারফরম্যান্স ইন্টেলিজেন্স",
      "মেটেরিয়াল কোয়ালিটি ভিজিবিলিটি",
      "পরিবহন খরচ মনিটরিং",
      "ইনভেন্টরি রিস্ক ইন্টেলিজেন্স",
    ],

    insights: [
      "সাপ্লায়ার বিলম্ব উৎপাদন ঝুঁকি বৃদ্ধি করে।",
      "মেটেরিয়াল রিজেকশন অপারেশনাল ক্ষতি তৈরি করে।",
      "ওয়্যারহাউস ক্ষতি সরাসরি লাভ কমায়।",
      "পরিবহন অনিশ্চয়তা লিড টাইম ঝুঁকি বাড়ায়।",
      "খারাপ কোয়ালিটি রিওয়ার্ক বৃদ্ধি করে।",
      "ইনভেন্টরি ভারসাম্যহীনতা ক্যাশফ্লো চাপ তৈরি করে।",
    ],

    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ারের নাম",
      material: "মেটেরিয়ালের নাম",
      category: "মেটেরিয়াল ক্যাটাগরি",
      orderedQty: "অর্ডার পরিমাণ",
      receivedQty: "প্রাপ্ত পরিমাণ",
      rejectedQty: "রিজেক্টেড পরিমাণ",
      price: "প্রতি ইউনিট মূল্য",
      transportCost: "পরিবহন খরচ",
      leadTime: "লিড টাইম (দিন)",
      delayDays: "ডেলিভারি বিলম্ব (দিন)",
      qualityScore: "কোয়ালিটি স্কোর %",
      warehouseLoss: "ওয়্যারহাউস ক্ষতি %",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function MaterialEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    material: "",
    category: "",
    orderedQty: "",
    receivedQty: "",
    rejectedQty: "",
    price: "",
    transportCost: "",
    leadTime: "",
    delayDays: "",
    qualityScore: "",
    warehouseLoss: "",
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

    setTimeout(() => {
      setSaving(false);

      setMessage(t.success);

      setForm({
        period: "",
        supplier: "",
        material: "",
        category: "",
        orderedQty: "",
        receivedQty: "",
        rejectedQty: "",
        price: "",
        transportCost: "",
        leadTime: "",
        delayDays: "",
        qualityScore: "",
        warehouseLoss: "",
        remarks: "",
      });
    }, 1000);
  };

  return (
    <DashboardShell title={t.title}>
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            MBNCON MATERIAL INTELLIGENCE
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
            {t.subtitle}
          </p>
        </section>

        {/* INTELLIGENCE CARDS */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {t.intelligenceCards.map((item) => {
            const id = slugify(item);

            return (
              <a
                key={item}
                href={`#${id}`}
                className="scroll-mt-28 rounded-3xl border border-cyan-100 bg-cyan-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h2
                  id={id}
                  className="text-xl font-bold text-cyan-950"
                >
                  {item}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-700">
                  Operational visibility for supplier management,
                  material quality control, inventory intelligence,
                  and logistics risk analysis.
                </p>
              </a>
            );
          })}
        </section>

        {/* INSIGHTS */}
        <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm transition duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-cyan-300">
            Material Intelligence Insights
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {t.insights.map((item) => {
              const id = slugify(item);

              return (
                <div
                  key={item}
                  id={id}
                  className="scroll-mt-28 rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/20 hover:shadow-xl"
                >
                  <p className="leading-7 text-slate-200">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Material Intelligence Entry Form
              </h2>

              <p className="mt-2 text-slate-600">
                Supplier, quality, transport, warehouse and inventory
                intelligence monitoring system.
              </p>
            </div>

            <div className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
              Manufacturing Intelligence
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {Object.entries(t.fields).map(([key, label]) => {
              const id = slugify(key);

              return (
                <div
                  key={key}
                  id={id}
                  className={`scroll-mt-28 space-y-2 ${
                    key === "remarks" ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="text-sm font-semibold text-slate-700">
                    {label}
                  </label>

                  {key === "remarks" ? (
                    <textarea
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        updateField(key, e.target.value)
                      }
                      rows={5}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:bg-white"
                      placeholder={`${label}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        updateField(key, e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition duration-300 focus:border-cyan-500 focus:bg-white"
                      placeholder={`${label}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* KPI HIGHLIGHT */}
          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Supplier Reliability",
                value: "92%",
                color: "text-emerald-700",
              },
              {
                title: "Quality Stability",
                value: "88%",
                color: "text-blue-700",
              },
              {
                title: "Delivery Accuracy",
                value: "81%",
                color: "text-orange-700",
              },
            ].map((item) => {
              const id = slugify(item.title);

              return (
                <div
                  key={item.title}
                  id={id}
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {item.title}
                  </p>

                  <h3 className={`mt-3 text-4xl font-bold ${item.color}`}>
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </section>

          {/* BUTTON */}
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-cyan-700 px-8 py-4 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-cyan-800 hover:shadow-xl disabled:opacity-60"
            >
              {saving ? t.saving : t.save}
            </button>

            {message && (
              <p className="text-sm font-semibold text-emerald-700">
                {message}
              </p>
            )}
          </div>
        </form>

        {/* CTA */}
        <section className="rounded-3xl bg-cyan-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h2 className="text-5xl font-extrabold">
            Build Smarter Material Intelligence
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-cyan-100">
            MBNCON manufacturing intelligence systems help organizations
            improve supplier reliability, reduce inventory losses,
            strengthen material quality, and improve operational
            profitability through structured intelligence visibility.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-cyan-700 transition duration-300 hover:scale-105 hover:shadow-xl">
            Request Manufacturing Consultation
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}