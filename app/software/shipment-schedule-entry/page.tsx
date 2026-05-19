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
    title: "Shipment Schedule Entry",
    eyebrow: "MBNCON Shipment Schedule Intelligence",
    subtitle:
      "Track planned shipment schedules, buyer deadlines, production readiness, packing progress, vessel cut-off dates, loading plans, and delay escalation.",
    save: "Save Shipment Schedule",
    saving: "Saving...",
    success: "Shipment schedule record saved successfully.",

    cards: [
      {
        title: "Schedule Control",
        value: "Tracked",
        desc: "Capture planned shipment date, buyer deadline, ETD, ETA, and vessel cut-off visibility.",
        target: "Shipment Schedule Form",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Readiness Status",
        value: "Visible",
        desc: "Track production, packing, inspection, and loading plan readiness before shipment risk increases.",
        target: "Schedule Risk Intelligence",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
      {
        title: "Delay Escalation",
        value: "Monitored",
        desc: "Capture schedule risk, delay reason, escalation owner, and corrective action for management follow-up.",
        target: "Schedule Risk Intelligence",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Buyer Deadline",
        value: "Protected",
        desc: "Support buyer commitment protection through stronger schedule visibility and escalation discipline.",
        target: "Executive Schedule UX",
        className: "border-red-200 bg-red-50 text-red-950",
      },
    ],

    sections: {
      form: "Shipment Schedule Form",
      intelligence: "Schedule Risk Intelligence",
      ux: "Executive Schedule UX",
    },

    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      orderNo: "Order Number",
      styleNo: "Style / Product Number",
      orderQty: "Order Quantity",
      plannedShipmentDate: "Planned Shipment Date",
      buyerDeadline: "Buyer Deadline",
      productionStatus: "Production Status",
      packingStatus: "Packing Status",
      inspectionStatus: "Inspection Status",
      loadingPlanDate: "Loading Plan Date",
      vesselCutOffDate: "Vessel Cut-off Date",
      etd: "ETD",
      eta: "ETA",
      scheduleRisk: "Schedule Risk Level",
      delayReason: "Delay Reason",
      escalationOwner: "Escalation Owner",
      correctiveAction: "Corrective Action",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "শিপমেন্ট সিডিউল এন্ট্রি",
    eyebrow: "MBNCON শিপমেন্ট সিডিউল ইন্টেলিজেন্স",
    subtitle:
      "পরিকল্পিত শিপমেন্ট সিডিউল, বায়ার ডেডলাইন, প্রোডাকশন প্রস্তুতি, প্যাকিং অগ্রগতি, ভেসেল কাট-অফ তারিখ, লোডিং প্ল্যান এবং বিলম্ব এস্কেলেশন ট্র্যাক করুন।",
    save: "শিপমেন্ট সিডিউল সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "শিপমেন্ট সিডিউল রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "সিডিউল কন্ট্রোল",
        value: "ট্র্যাকড",
        desc: "পরিকল্পিত শিপমেন্ট তারিখ, বায়ার ডেডলাইন, ETD, ETA এবং ভেসেল কাট-অফ ভিজিবিলিটি সংরক্ষণ করুন।",
        target: "শিপমেন্ট সিডিউল ফর্ম",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "প্রস্তুতি স্ট্যাটাস",
        value: "ভিজিবল",
        desc: "শিপমেন্ট ঝুঁকি বাড়ার আগে প্রোডাকশন, প্যাকিং, ইন্সপেকশন এবং লোডিং প্ল্যান প্রস্তুতি ট্র্যাক করুন।",
        target: "সিডিউল রিস্ক ইন্টেলিজেন্স",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
      {
        title: "বিলম্ব এস্কেলেশন",
        value: "মনিটরড",
        desc: "ম্যানেজমেন্ট ফলোআপের জন্য সিডিউল ঝুঁকি, বিলম্বের কারণ, এস্কেলেশন মালিক এবং কারেক্টিভ অ্যাকশন সংরক্ষণ করুন।",
        target: "সিডিউল রিস্ক ইন্টেলিজেন্স",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "বায়ার ডেডলাইন",
        value: "প্রোটেক্টেড",
        desc: "শক্তিশালী সিডিউল ভিজিবিলিটি এবং এস্কেলেশন ডিসিপ্লিনের মাধ্যমে বায়ার প্রতিশ্রুতি রক্ষা করুন।",
        target: "এক্সিকিউটিভ সিডিউল UX",
        className: "border-red-200 bg-red-50 text-red-950",
      },
    ],

    sections: {
      form: "শিপমেন্ট সিডিউল ফর্ম",
      intelligence: "সিডিউল রিস্ক ইন্টেলিজেন্স",
      ux: "এক্সিকিউটিভ সিডিউল UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      orderNo: "অর্ডার নম্বর",
      styleNo: "স্টাইল / পণ্য নম্বর",
      orderQty: "অর্ডার পরিমাণ",
      plannedShipmentDate: "পরিকল্পিত শিপমেন্ট তারিখ",
      buyerDeadline: "বায়ার ডেডলাইন",
      productionStatus: "প্রোডাকশন স্ট্যাটাস",
      packingStatus: "প্যাকিং স্ট্যাটাস",
      inspectionStatus: "ইন্সপেকশন স্ট্যাটাস",
      loadingPlanDate: "লোডিং প্ল্যান তারিখ",
      vesselCutOffDate: "ভেসেল কাট-অফ তারিখ",
      etd: "ETD",
      eta: "ETA",
      scheduleRisk: "সিডিউল ঝুঁকির মাত্রা",
      delayReason: "বিলম্বের কারণ",
      escalationOwner: "এস্কেলেশন দায়িত্বপ্রাপ্ত ব্যক্তি",
      correctiveAction: "কারেক্টিভ অ্যাকশন",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function ShipmentScheduleEntryPage() {
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
    plannedShipmentDate: "",
    buyerDeadline: "",
    productionStatus: "",
    packingStatus: "",
    inspectionStatus: "",
    loadingPlanDate: "",
    vesselCutOffDate: "",
    etd: "",
    eta: "",
    scheduleRisk: "",
    delayReason: "",
    escalationOwner: "",
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
      plannedShipmentDate: "",
      buyerDeadline: "",
      productionStatus: "",
      packingStatus: "",
      inspectionStatus: "",
      loadingPlanDate: "",
      vesselCutOffDate: "",
      etd: "",
      eta: "",
      scheduleRisk: "",
      delayReason: "",
      escalationOwner: "",
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
              Shipment Schedule, Readiness & Escalation Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures planned shipment date, buyer deadline,
              production status, packing status, inspection status, loading
              plan date, vessel cut-off date, ETD, ETA, schedule risk, delay
              reason, escalation owner, corrective action, and management
              remarks for factory-level shipment schedule control.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Buyer deadline and vessel cut-off visibility",
                "Production, packing, and inspection readiness",
                "Delay escalation ownership and corrective action",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise shipment schedule intelligence prepared for
                    export commitment protection and executive follow-up.
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
              Consultancy-Demo Shipment Schedule UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, export managers,
              production leaders, commercial teams, logistics teams, and
              executives a clearer demo experience with clickable intelligence
              cards, structured scroll sections, enterprise-safe JSX, stronger
              hover feedback, and practical shipment schedule-control
              storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}