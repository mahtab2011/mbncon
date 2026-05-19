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
    title: "Shipment Intelligence Entry",
    eyebrow: "MBNCON Shipment Intelligence",
    subtitle:
      "Track shipment readiness, buyer delivery dates, packing progress, dispatch risk, delay reasons, and shipment commitment performance.",
    save: "Save Shipment Record",
    saving: "Saving...",
    success: "Shipment intelligence record saved successfully.",

    cards: [
      {
        title: "Shipment Readiness",
        value: "Tracked",
        desc: "Capture packed quantity, pending quantity, shipment date, and dispatch readiness.",
        target: "Shipment Record Form",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Delay Risk",
        value: "Visible",
        desc: "Track delay days, delay reason, buyer impact, and shipment risk level.",
        target: "Shipment Risk Intelligence",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "Buyer Commitment",
        value: "Protected",
        desc: "Support buyer delivery commitment, dispatch control, and shipment recovery action.",
        target: "Shipment Risk Intelligence",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Executive Action",
        value: "Ready",
        desc: "Support factory leadership with shipment visibility and corrective action discipline.",
        target: "Executive Shipment UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "Shipment Record Form",
      intelligence: "Shipment Risk Intelligence",
      ux: "Executive Shipment UX",
    },

    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      orderNo: "Order Number",
      styleNo: "Style / Product Number",
      orderQty: "Order Quantity",
      packedQty: "Packed Quantity",
      pendingQty: "Pending Quantity",
      shipmentDate: "Planned Shipment Date",
      actualDispatchDate: "Actual Dispatch Date",
      shipmentMode: "Shipment Mode",
      destination: "Destination",
      delayDays: "Delay Days",
      delayReason: "Delay Reason",
      buyerImpact: "Buyer Impact",
      riskLevel: "Shipment Risk Level",
      correctiveAction: "Corrective Action",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "শিপমেন্ট ইন্টেলিজেন্স এন্ট্রি",
    eyebrow: "MBNCON শিপমেন্ট ইন্টেলিজেন্স",
    subtitle:
      "শিপমেন্ট প্রস্তুতি, বায়ার ডেলিভারি তারিখ, প্যাকিং অগ্রগতি, ডিসপ্যাচ ঝুঁকি, বিলম্বের কারণ এবং শিপমেন্ট প্রতিশ্রুতি পারফরম্যান্স ট্র্যাক করুন।",
    save: "শিপমেন্ট রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "শিপমেন্ট ইন্টেলিজেন্স রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "শিপমেন্ট প্রস্তুতি",
        value: "ট্র্যাকড",
        desc: "প্যাকড পরিমাণ, পেন্ডিং পরিমাণ, শিপমেন্ট তারিখ এবং ডিসপ্যাচ প্রস্তুতি সংরক্ষণ করুন।",
        target: "শিপমেন্ট রেকর্ড ফর্ম",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "বিলম্ব ঝুঁকি",
        value: "ভিজিবল",
        desc: "বিলম্বের দিন, বিলম্বের কারণ, বায়ার প্রভাব এবং শিপমেন্ট ঝুঁকি ট্র্যাক করুন।",
        target: "শিপমেন্ট রিস্ক ইন্টেলিজেন্স",
        className: "border-red-200 bg-red-50 text-red-950",
      },
      {
        title: "বায়ার প্রতিশ্রুতি",
        value: "প্রোটেক্টেড",
        desc: "বায়ার ডেলিভারি প্রতিশ্রুতি, ডিসপ্যাচ কন্ট্রোল এবং শিপমেন্ট রিকভারি অ্যাকশন সাপোর্ট করুন।",
        target: "শিপমেন্ট রিস্ক ইন্টেলিজেন্স",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "এক্সিকিউটিভ অ্যাকশন",
        value: "রেডি",
        desc: "শিপমেন্ট ভিজিবিলিটি এবং কারেক্টিভ অ্যাকশন ডিসিপ্লিন দিয়ে ফ্যাক্টরি নেতৃত্বকে সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ শিপমেন্ট UX",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
    ],

    sections: {
      form: "শিপমেন্ট রেকর্ড ফর্ম",
      intelligence: "শিপমেন্ট রিস্ক ইন্টেলিজেন্স",
      ux: "এক্সিকিউটিভ শিপমেন্ট UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      orderNo: "অর্ডার নম্বর",
      styleNo: "স্টাইল / পণ্য নম্বর",
      orderQty: "অর্ডার পরিমাণ",
      packedQty: "প্যাকড পরিমাণ",
      pendingQty: "পেন্ডিং পরিমাণ",
      shipmentDate: "পরিকল্পিত শিপমেন্ট তারিখ",
      actualDispatchDate: "প্রকৃত ডিসপ্যাচ তারিখ",
      shipmentMode: "শিপমেন্ট মাধ্যম",
      destination: "গন্তব্য",
      delayDays: "বিলম্বের দিন",
      delayReason: "বিলম্বের কারণ",
      buyerImpact: "বায়ারের উপর প্রভাব",
      riskLevel: "শিপমেন্ট ঝুঁকির মাত্রা",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function ShipmentEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    buyer: "",
    orderNo: "",
    styleNo: "",
    orderQty: "",
    packedQty: "",
    pendingQty: "",
    shipmentDate: "",
    actualDispatchDate: "",
    shipmentMode: "",
    destination: "",
    delayDays: "",
    delayReason: "",
    buyerImpact: "",
    riskLevel: "",
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
      buyer: "",
      orderNo: "",
      styleNo: "",
      orderQty: "",
      packedQty: "",
      pendingQty: "",
      shipmentDate: "",
      actualDispatchDate: "",
      shipmentMode: "",
      destination: "",
      delayDays: "",
      delayReason: "",
      buyerImpact: "",
      riskLevel: "",
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

                    {key === "delayReason" ||
                    key === "buyerImpact" ||
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
              Shipment Readiness, Delay Risk & Buyer Commitment Control
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures shipment readiness, planned shipment date,
              actual dispatch date, shipment mode, destination, delay days,
              delay reason, buyer impact, shipment risk level, corrective
              action, and management remarks for factory-level export
              intelligence.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Packing and dispatch readiness",
                "Delay reason and buyer impact visibility",
                "Corrective action and shipment recovery",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise shipment intelligence prepared for buyer
                    commitment protection and export recovery control.
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
              Consultancy-Demo Shipment Intelligence UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, export managers,
              production leaders, commercial teams, and executives a clearer
              demo experience with clickable intelligence cards, structured
              scroll sections, enterprise-safe JSX, stronger hover feedback,
              and practical shipment-control storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}