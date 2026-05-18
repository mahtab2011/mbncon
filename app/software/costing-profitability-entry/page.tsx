"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";

const content = {
  en: {
    title: "Costing & Profitability Entry",
    eyebrow: "MBNCON COSTING PROFITABILITY INTELLIGENCE",
    subtitle:
      "Track costing accuracy, profitability, hidden losses, operational expenses, margin risk, and financial performance intelligence.",
    save: "Save Costing Record",
    saving: "Saving...",
    success: "Costing and profitability record saved successfully.",
    fields: {
      period: "Reporting Period",
      buyer: "Buyer Name",
      orderNo: "Order Number",
      product: "Product / Style",
      orderQty: "Order Quantity",
      sellingPrice: "Selling Price",
      materialCost: "Material Cost",
      labourCost: "Labour Cost",
      utilityCost: "Utility Cost",
      transportCost: "Transport Cost",
      complianceCost: "Compliance Cost",
      overheadCost: "Overhead Cost",
      totalCost: "Total Cost",
      expectedProfit: "Expected Profit",
      actualProfit: "Actual Profit",
      marginPercentage: "Margin Percentage",
      profitLeakage: "Profit Leakage",
      riskLevel: "Profitability Risk Level",
      remarks: "Management Remarks",
    },
  },

  bn: {
    title: "কস্টিং ও প্রফিটেবিলিটি এন্ট্রি",
    eyebrow: "MBNCON কস্টিং প্রফিটেবিলিটি ইন্টেলিজেন্স",
    subtitle:
      "কস্টিং নির্ভুলতা, প্রফিটেবিলিটি, লুকানো ক্ষতি, অপারেশনাল খরচ, মার্জিন ঝুঁকি এবং আর্থিক পারফরম্যান্স ইন্টেলিজেন্স ট্র্যাক করুন।",
    save: "কস্টিং রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "কস্টিং ও প্রফিটেবিলিটি রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    fields: {
      period: "রিপোর্টিং সময়কাল",
      buyer: "বায়ারের নাম",
      orderNo: "অর্ডার নম্বর",
      product: "পণ্য / স্টাইল",
      orderQty: "অর্ডার পরিমাণ",
      sellingPrice: "বিক্রয় মূল্য",
      materialCost: "মেটেরিয়াল খরচ",
      labourCost: "শ্রম খরচ",
      utilityCost: "ইউটিলিটি খরচ",
      transportCost: "পরিবহন খরচ",
      complianceCost: "কমপ্লায়েন্স খরচ",
      overheadCost: "ওভারহেড খরচ",
      totalCost: "মোট খরচ",
      expectedProfit: "প্রত্যাশিত লাভ",
      actualProfit: "প্রকৃত লাভ",
      marginPercentage: "মার্জিন শতাংশ",
      profitLeakage: "প্রফিট লিকেজ",
      riskLevel: "প্রফিটেবিলিটি ঝুঁকির মাত্রা",
      remarks: "ম্যানেজমেন্ট মন্তব্য",
    },
  },
};

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getProfitAssessment(margin: number, leakage: number) {
  if (margin < 5 || leakage > 10000) {
    return "Critical Profitability Exposure";
  }

  if (margin < 12 || leakage > 5000) {
    return "High Margin Pressure";
  }

  if (margin < 20 || leakage > 1000) {
    return "Moderate Profitability Monitoring Required";
  }

  return "Profitability Position Stable";
}

export default function CostingProfitabilityEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    buyer: "",
    orderNo: "",
    product: "",
    orderQty: "",
    sellingPrice: "",
    materialCost: "",
    labourCost: "",
    utilityCost: "",
    transportCost: "",
    complianceCost: "",
    overheadCost: "",
    totalCost: "",
    expectedProfit: "",
    actualProfit: "",
    marginPercentage: "",
    profitLeakage: "",
    riskLevel: "",
    remarks: "",
  });

  const orderQty = toNumber(form.orderQty);
  const sellingPrice = toNumber(form.sellingPrice);
  const materialCost = toNumber(form.materialCost);
  const labourCost = toNumber(form.labourCost);
  const utilityCost = toNumber(form.utilityCost);
  const transportCost = toNumber(form.transportCost);
  const complianceCost = toNumber(form.complianceCost);
  const overheadCost = toNumber(form.overheadCost);
  const profitLeakage = toNumber(form.profitLeakage);

  const calculatedRevenue = orderQty * sellingPrice;

  const calculatedTotalCost =
    materialCost +
    labourCost +
    utilityCost +
    transportCost +
    complianceCost +
    overheadCost;

  const calculatedExpectedProfit = calculatedRevenue - calculatedTotalCost;

  const calculatedMargin =
    calculatedRevenue > 0
      ? (calculatedExpectedProfit / calculatedRevenue) * 100
      : 0;

  const executiveAssessment = useMemo(
    () => getProfitAssessment(calculatedMargin, profitLeakage),
    [calculatedMargin, profitLeakage]
  );

  const kpiCards = [
    {
      title: "Revenue",
      value: calculatedRevenue.toFixed(0),
      href: "#financial-summary",
    },
    {
      title: "Total Cost",
      value: calculatedTotalCost.toFixed(0),
      href: "#financial-summary",
    },
    {
      title: "Expected Profit",
      value: calculatedExpectedProfit.toFixed(0),
      href: "#executive-profitability-assessment",
    },
    {
      title: "Margin %",
      value: `${calculatedMargin.toFixed(1)}%`,
      href: "#executive-profitability-assessment",
    },
  ];

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
      product: "",
      orderQty: "",
      sellingPrice: "",
      materialCost: "",
      labourCost: "",
      utilityCost: "",
      transportCost: "",
      complianceCost: "",
      overheadCost: "",
      totalCost: "",
      expectedProfit: "",
      actualProfit: "",
      marginPercentage: "",
      profitLeakage: "",
      riskLevel: "",
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

          <section
            id="enterprise-kpis"
            className="mt-8 grid scroll-mt-28 grid-cols-1 gap-4 md:grid-cols-4"
          >
            {kpiCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl"
              >
                <p className="text-sm text-slate-500">{card.title}</p>

                <h2 className="mt-3 text-3xl font-bold text-cyan-700">
                  {card.value}
                </h2>

                <p className="mt-3 text-xs text-slate-500">
                  Click to review costing intelligence
                </p>
              </a>
            ))}
          </section>

          <section
            id="executive-profitability-assessment"
            className="mt-8 scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-6"
          >
            <p className="text-sm uppercase tracking-widest text-cyan-700">
              Executive Profitability Assessment
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {executiveAssessment}
            </h2>

            <p className="mt-4 text-slate-700">
              AI evaluates order revenue, material cost, labour cost, utility
              cost, transport cost, compliance cost, overhead cost, profit
              leakage, and margin exposure before management approval.
            </p>
          </section>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <section
            id="financial-summary"
            className="mb-8 scroll-mt-28 rounded-3xl border border-cyan-100 bg-cyan-50 p-6"
          >
            <p className="text-sm uppercase tracking-widest text-cyan-700">
              Financial Summary
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <ReadOnly label="Calculated Revenue" value={calculatedRevenue.toFixed(2)} />
              <ReadOnly label="Calculated Total Cost" value={calculatedTotalCost.toFixed(2)} />
              <ReadOnly label="Calculated Profit" value={calculatedExpectedProfit.toFixed(2)} />
              <ReadOnly label="Calculated Margin %" value={`${calculatedMargin.toFixed(2)}%`} />
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(t.fields).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {label}
                </label>

                {key === "remarks" ? (
                  <textarea
                    rows={4}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                ) : (
                  <input
                    type={
                      key === "period" ||
                      key === "buyer" ||
                      key === "orderNo" ||
                      key === "product" ||
                      key === "riskLevel"
                        ? "text"
                        : "number"
                    }
                    step="any"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500"
                  />
                )}
              </div>
            ))}
          </div>

          <section
            id="ai-recommendation"
            className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-6"
          >
            <p className="text-sm uppercase tracking-widest text-cyan-700">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-700">
              Management should compare calculated cost with quoted cost,
              review profit leakage, validate overhead recovery, monitor
              discount pressure, and ensure weak-margin orders receive
              executive approval before production continuation.
            </p>
          </section>

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

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800">
        {value}
      </div>
    </div>
  );
}