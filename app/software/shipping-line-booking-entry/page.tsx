"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Shipping Line Booking Entry",
    eyebrow: "MBNCON SHIPPING LINE INTELLIGENCE",
    subtitle:
      "Track shipping line bookings, vessel details, container allocation, cut-off dates, ETD, ETA, freight cost, booking risk, and shipment delay impact.",
    save: "Save Shipping Booking",
    saving: "Saving...",
    success: "Shipping line booking record saved successfully.",
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
    <DashboardShell title={t.title}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            {t.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-4xl text-slate-600">{t.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
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
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-cyan-700 px-6 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-60"
            >
              {saving ? t.saving : t.save}
            </button>

            {message && (
              <p className="text-sm font-medium text-emerald-700">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}