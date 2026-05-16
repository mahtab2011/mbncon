"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Shipment Schedule Entry",
    eyebrow: "MBNCON SHIPMENT SCHEDULE INTELLIGENCE",
    subtitle:
      "Track planned shipment schedules, buyer deadlines, production readiness, packing progress, vessel cut-off dates, loading plans, and delay escalation.",
    save: "Save Shipment Schedule",
    saving: "Saving...",
    success: "Shipment schedule record saved successfully.",
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