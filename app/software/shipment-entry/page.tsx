"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Shipment Intelligence Entry",
    eyebrow: "MBNCON SHIPMENT INTELLIGENCE",
    subtitle:
      "Track shipment readiness, buyer delivery dates, packing progress, dispatch risk, delay reasons, and shipment commitment performance.",
    save: "Save Shipment Record",
    saving: "Saving...",
    success: "Shipment intelligence record saved successfully.",
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
                key === "buyerImpact" ||
                key === "correctiveAction" ||
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