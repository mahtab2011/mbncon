"use client";

import { useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { addExportLog } from "@/lib/software/firestoreService";
import { useLanguage } from "@/components/software/LanguageProvider";

type ShipmentStatus = "On Time" | "Delayed" | "At Risk" | "Shipped";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ExportEntryPage() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Export Intelligence Entry",
      subtitle:
        "Capture buyer, order value, shipment timing, delay days, and export risk status for live commercial intelligence.",
      period: "Period",
      buyer: "Buyer",
      orderValue: "Order Value",
      plannedShipmentDate: "Planned Shipment Date",
      actualShipmentDate: "Actual Shipment Date",
      delayDays: "Delay Days",
      shipmentStatus: "Shipment Status",
      onTime: "On Time",
      delayed: "Delayed",
      atRisk: "At Risk",
      shipped: "Shipped",
      save: "Save Export Log",
      saving: "Saving...",
      success: "Export log saved successfully.",
      error: "Could not save export log. Check Firebase settings.",
      placeholderPeriod: "May 2026",
      placeholderBuyer: "Buyer name",
      placeholderPlanned: "2026-05-18",
      placeholderActual: "2026-05-20",
      formTitle: "Commercial Export Data",
      formNote:
        "Use this form to record shipment performance, buyer exposure, and export delay risk.",
    },
    bn: {
      title: "এক্সপোর্ট ইন্টেলিজেন্স এন্ট্রি",
      subtitle:
        "লাইভ কমার্শিয়াল ইন্টেলিজেন্সের জন্য বায়ার, অর্ডার ভ্যালু, শিপমেন্ট সময়, বিলম্ব দিন এবং এক্সপোর্ট ঝুঁকি স্ট্যাটাস সংরক্ষণ করুন।",
      period: "সময়কাল",
      buyer: "বায়ার",
      orderValue: "অর্ডার ভ্যালু",
      plannedShipmentDate: "পরিকল্পিত শিপমেন্ট তারিখ",
      actualShipmentDate: "বাস্তব শিপমেন্ট তারিখ",
      delayDays: "বিলম্ব দিন",
      shipmentStatus: "শিপমেন্ট স্ট্যাটাস",
      onTime: "সময়মতো",
      delayed: "বিলম্বিত",
      atRisk: "ঝুঁকিতে",
      shipped: "শিপড",
      save: "এক্সপোর্ট লগ সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      success: "এক্সপোর্ট লগ সফলভাবে সংরক্ষণ হয়েছে।",
      error: "এক্সপোর্ট লগ সংরক্ষণ করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।",
      placeholderPeriod: "মে ২০২৬",
      placeholderBuyer: "বায়ারের নাম",
      placeholderPlanned: "2026-05-18",
      placeholderActual: "2026-05-20",
      formTitle: "কমার্শিয়াল এক্সপোর্ট ডাটা",
      formNote:
        "শিপমেন্ট পারফরম্যান্স, বায়ার এক্সপোজার এবং এক্সপোর্ট বিলম্ব ঝুঁকি রেকর্ড করতে এই ফর্ম ব্যবহার করুন।",
    },
  };

  const t = text[language];

  const statusLabels: Record<ShipmentStatus, string> = {
    "On Time": t.onTime,
    Delayed: t.delayed,
    "At Risk": t.atRisk,
    Shipped: t.shipped,
  };

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    companyId: "demo-company",
    factoryId: "demo-factory",
    period: "",
    buyer: "",
    orderValue: "",
    plannedShipmentDate: "",
    actualShipmentDate: "",
    delayDays: "",
    status: "At Risk" as ShipmentStatus,
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      companyId: "demo-company",
      factoryId: "demo-factory",
      period: "",
      buyer: "",
      orderValue: "",
      plannedShipmentDate: "",
      actualShipmentDate: "",
      delayDays: "",
      status: "At Risk",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await addExportLog({
        companyId: form.companyId,
        factoryId: form.factoryId,
        period: form.period,
        buyer: form.buyer,
        orderValue: Number(form.orderValue),
        plannedShipmentDate: form.plannedShipmentDate,
        actualShipmentDate: form.actualShipmentDate,
        delayDays: Number(form.delayDays),
        status: form.status,
      });

      setMessage(t.success);
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage(t.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title={t.title} subtitle={t.subtitle}>
      <section
        id={slugify(t.title)}
        className="scroll-mt-28 max-w-5xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-8 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
            MBNCON Export Intelligence
          </p>

          <h1 className="mt-3 text-3xl font-black text-neutral-950">
            {t.formTitle}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
            {t.formNote}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label={t.period}
              value={form.period}
              onChange={(v) => updateField("period", v)}
              placeholder={t.placeholderPeriod}
            />

            <Input
              label={t.buyer}
              value={form.buyer}
              onChange={(v) => updateField("buyer", v)}
              placeholder={t.placeholderBuyer}
            />

            <Input
              label={t.orderValue}
              value={form.orderValue}
              onChange={(v) => updateField("orderValue", v)}
              inputMode="decimal"
              type="number"
            />

            <Input
              label={t.plannedShipmentDate}
              value={form.plannedShipmentDate}
              onChange={(v) => updateField("plannedShipmentDate", v)}
              placeholder={t.placeholderPlanned}
              type="date"
            />

            <Input
              label={t.actualShipmentDate}
              value={form.actualShipmentDate}
              onChange={(v) => updateField("actualShipmentDate", v)}
              placeholder={t.placeholderActual}
              type="date"
            />

            <Input
              label={t.delayDays}
              value={form.delayDays}
              onChange={(v) => updateField("delayDays", v)}
              inputMode="numeric"
              type="number"
            />
          </div>

          <label
            id={slugify(t.shipmentStatus)}
            className="mt-6 block scroll-mt-28"
          >
            <span className="text-sm font-semibold text-neutral-700">
              {t.shipmentStatus}
            </span>

            <select
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as ShipmentStatus)
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-cyan-500"
            >
              {(["On Time", "Delayed", "At Risk", "Shipped"] as const).map(
                (status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-neutral-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? t.saving : t.save}
            </button>

            {message ? (
              <p className="text-sm font-semibold text-cyan-700">{message}</p>
            ) : null}
          </div>
        </form>
      </section>
    </DashboardShell>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const id = slugify(label);

  return (
    <label id={id} className="block scroll-mt-28">
      <span className="text-sm font-semibold text-neutral-700">{label}</span>

      <input
        required
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-cyan-500"
      />
    </label>
  );
}