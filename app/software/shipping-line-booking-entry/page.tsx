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
    title: "Shipping Line Booking Entry",
    eyebrow: "MBNCON Shipping Line Intelligence",
    subtitle:
      "Track shipping line bookings, vessel details, container allocation, cut-off dates, ETD, ETA, freight cost, booking risk, and shipment delay impact.",
    save: "Save Shipping Booking",
    saving: "Saving...",
    success: "Shipping line booking record saved successfully.",

    cards: [
      {
        title: "Booking Control",
        value: "Tracked",
        desc: "Capture shipping line, booking number, vessel, voyage, container type, and container allocation.",
        target: "Shipping Booking Form",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "Cut-off Visibility",
        value: "Monitored",
        desc: "Track cut-off date, ETD, ETA, loading port, discharge port, and shipment schedule readiness.",
        target: "Booking Risk Intelligence",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
      {
        title: "Freight Exposure",
        value: "Measured",
        desc: "Monitor freight cost, booking status, delay risk, and shipment impact for management control.",
        target: "Booking Risk Intelligence",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "Executive Follow-up",
        value: "Ready",
        desc: "Support export, commercial, logistics, and director-level booking escalation visibility.",
        target: "Executive Shipping UX",
        className: "border-red-200 bg-red-50 text-red-950",
      },
    ],

    sections: {
      form: "Shipping Booking Form",
      intelligence: "Booking Risk Intelligence",
      ux: "Executive Shipping UX",
    },

    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      orderNo: "Order Number",
      shippingLine: "Shipping Line",
      bookingNo: "Booking Number",
      vesselName: "Vessel Name",
      voyageNo: "Voyage Number",
      containerType: "Container Type",
      containerQty: "Container Quantity",
      portOfLoading: "Port of Loading",
      portOfDischarge: "Port of Discharge",
      cutOffDate: "Cut-off Date",
      etd: "ETD",
      eta: "ETA",
      freightCost: "Freight Cost",
      bookingStatus: "Booking Status",
      delayRisk: "Delay Risk Level",
      shipmentImpact: "Shipment Impact",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "শিপিং লাইন বুকিং এন্ট্রি",
    eyebrow: "MBNCON শিপিং লাইন ইন্টেলিজেন্স",
    subtitle:
      "শিপিং লাইন বুকিং, ভেসেল তথ্য, কন্টেইনার বরাদ্দ, কাট-অফ তারিখ, ETD, ETA, ফ্রেইট খরচ, বুকিং ঝুঁকি এবং শিপমেন্ট বিলম্বের প্রভাব ট্র্যাক করুন।",
    save: "শিপিং বুকিং সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "শিপিং লাইন বুকিং রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",

    cards: [
      {
        title: "বুকিং কন্ট্রোল",
        value: "ট্র্যাকড",
        desc: "শিপিং লাইন, বুকিং নম্বর, ভেসেল, ভয়েজ, কন্টেইনার টাইপ এবং কন্টেইনার বরাদ্দ সংরক্ষণ করুন।",
        target: "শিপিং বুকিং ফর্ম",
        className: "border-cyan-200 bg-cyan-50 text-cyan-950",
      },
      {
        title: "কাট-অফ ভিজিবিলিটি",
        value: "মনিটরড",
        desc: "কাট-অফ তারিখ, ETD, ETA, লোডিং পোর্ট, ডিসচার্জ পোর্ট এবং শিপমেন্ট সিডিউল প্রস্তুতি ট্র্যাক করুন।",
        target: "বুকিং রিস্ক ইন্টেলিজেন্স",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      },
      {
        title: "ফ্রেইট এক্সপোজার",
        value: "মেজারড",
        desc: "ম্যানেজমেন্ট কন্ট্রোলের জন্য ফ্রেইট খরচ, বুকিং স্ট্যাটাস, বিলম্ব ঝুঁকি এবং শিপমেন্ট প্রভাব মনিটর করুন।",
        target: "বুকিং রিস্ক ইন্টেলিজেন্স",
        className: "border-orange-200 bg-orange-50 text-orange-950",
      },
      {
        title: "এক্সিকিউটিভ ফলোআপ",
        value: "রেডি",
        desc: "এক্সপোর্ট, কমার্শিয়াল, লজিস্টিকস এবং ডিরেক্টর-লেভেল বুকিং এস্কেলেশন ভিজিবিলিটি সাপোর্ট করুন।",
        target: "এক্সিকিউটিভ শিপিং UX",
        className: "border-red-200 bg-red-50 text-red-950",
      },
    ],

    sections: {
      form: "শিপিং বুকিং ফর্ম",
      intelligence: "বুকিং রিস্ক ইন্টেলিজেন্স",
      ux: "এক্সিকিউটিভ শিপিং UX",
    },

    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      orderNo: "অর্ডার নম্বর",
      shippingLine: "শিপিং লাইন",
      bookingNo: "বুকিং নম্বর",
      vesselName: "ভেসেলের নাম",
      voyageNo: "ভয়েজ নম্বর",
      containerType: "কন্টেইনার টাইপ",
      containerQty: "কন্টেইনার সংখ্যা",
      portOfLoading: "লোডিং পোর্ট",
      portOfDischarge: "ডিসচার্জ পোর্ট",
      cutOffDate: "কাট-অফ তারিখ",
      etd: "ETD",
      eta: "ETA",
      freightCost: "ফ্রেইট খরচ",
      bookingStatus: "বুকিং স্ট্যাটাস",
      delayRisk: "বিলম্ব ঝুঁকির মাত্রা",
      shipmentImpact: "শিপমেন্ট প্রভাব",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function ShippingLineBookingEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    buyer: "",
    orderNo: "",
    shippingLine: "",
    bookingNo: "",
    vesselName: "",
    voyageNo: "",
    containerType: "",
    containerQty: "",
    portOfLoading: "",
    portOfDischarge: "",
    cutOffDate: "",
    etd: "",
    eta: "",
    freightCost: "",
    bookingStatus: "",
    delayRisk: "",
    shipmentImpact: "",
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
      shippingLine: "",
      bookingNo: "",
      vesselName: "",
      voyageNo: "",
      containerType: "",
      containerQty: "",
      portOfLoading: "",
      portOfDischarge: "",
      cutOffDate: "",
      etd: "",
      eta: "",
      freightCost: "",
      bookingStatus: "",
      delayRisk: "",
      shipmentImpact: "",
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

                    {key === "shipmentImpact" || key === "remarks" ? (
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
              Shipping Booking, Freight Cost & Cut-off Risk Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module captures shipping line booking details, vessel and
              voyage information, container allocation, port of loading, port
              of discharge, cut-off date, ETD, ETA, freight cost, booking
              status, delay risk, shipment impact, and management remarks for
              export logistics control.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Shipping line booking visibility",
                "Container and cut-off control",
                "Freight exposure and delay impact",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Enterprise shipping intelligence prepared for export
                    logistics visibility and director-level follow-up.
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
              Consultancy-Demo Shipping Line UX
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-cyan-900">
              The stabilized layout gives factory owners, export managers,
              logistics teams, commercial teams, and executives a clearer demo
              experience with clickable intelligence cards, structured scroll
              sections, enterprise-safe JSX, stronger hover feedback, and
              practical shipping-line booking control storytelling.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}