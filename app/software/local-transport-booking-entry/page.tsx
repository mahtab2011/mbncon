"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Local Transport Booking Entry",
    eyebrow: "MBNCON LOCAL TRANSPORT INTELLIGENCE",
    subtitle:
      "Track local transport bookings, vehicle allocation, transport cost, loading status, delay risks, and logistics performance.",
    save: "Save Transport Record",
    saving: "Saving...",
    success: "Local transport booking record saved successfully.",
    fields: {
      period: "Reporting Period",
      supplier: "Supplier / Sender Name",
      bookingNo: "Booking Number",
      materialName: "Material / Goods Name",
      vehicleType: "Vehicle Type",
      vehicleNumber: "Vehicle Number",
      driverName: "Driver Name",
      driverPhone: "Driver Phone",
      pickupLocation: "Pickup Location",
      deliveryLocation: "Delivery Location",
      loadingDate: "Loading Date",
      expectedArrival: "Expected Arrival Date",
      actualArrival: "Actual Arrival Date",
      transportCost: "Transport Cost",
      delayDays: "Delay Days",
      delayReason: "Delay Reason",
      shipmentImpact: "Production / Shipment Impact",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "লোকাল ট্রান্সপোর্ট বুকিং এন্ট্রি",
    eyebrow: "MBNCON লোকাল ট্রান্সপোর্ট ইন্টেলিজেন্স",
    subtitle:
      "লোকাল ট্রান্সপোর্ট বুকিং, যানবাহন বরাদ্দ, পরিবহন খরচ, লোডিং স্ট্যাটাস, বিলম্ব ঝুঁকি এবং লজিস্টিকস পারফরম্যান্স ট্র্যাক করুন।",
    save: "ট্রান্সপোর্ট রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "লোকাল ট্রান্সপোর্ট বুকিং রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      supplier: "সাপ্লায়ার / প্রেরকের নাম",
      bookingNo: "বুকিং নম্বর",
      materialName: "মেটেরিয়াল / পণ্যের নাম",
      vehicleType: "যানবাহনের ধরন",
      vehicleNumber: "যানবাহন নম্বর",
      driverName: "ড্রাইভারের নাম",
      driverPhone: "ড্রাইভারের ফোন",
      pickupLocation: "পিকআপ লোকেশন",
      deliveryLocation: "ডেলিভারি লোকেশন",
      loadingDate: "লোডিং তারিখ",
      expectedArrival: "সম্ভাব্য পৌঁছানোর তারিখ",
      actualArrival: "প্রকৃত পৌঁছানোর তারিখ",
      transportCost: "পরিবহন খরচ",
      delayDays: "বিলম্বের দিন",
      delayReason: "বিলম্বের কারণ",
      shipmentImpact: "প্রোডাকশন / শিপমেন্ট প্রভাব",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

export default function LocalTransportBookingEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    supplier: "",
    bookingNo: "",
    materialName: "",
    vehicleType: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    pickupLocation: "",
    deliveryLocation: "",
    loadingDate: "",
    expectedArrival: "",
    actualArrival: "",
    transportCost: "",
    delayDays: "",
    delayReason: "",
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
      supplier: "",
      bookingNo: "",
      materialName: "",
      vehicleType: "",
      vehicleNumber: "",
      driverName: "",
      driverPhone: "",
      pickupLocation: "",
      deliveryLocation: "",
      loadingDate: "",
      expectedArrival: "",
      actualArrival: "",
      transportCost: "",
      delayDays: "",
      delayReason: "",
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

                {key === "delayReason" ||
                key === "shipmentImpact" ||
                key === "remarks" ? (
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