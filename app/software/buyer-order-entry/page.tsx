"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";
import { addBuyerOrderEntry } from "@/lib/software/firestoreService";

const content = {
  en: {
    title: "Buyer Order Intelligence Entry",
    eyebrow: "MBNCON UNIVERSAL ORDER INTELLIGENCE",
    subtitle:
      "Universal buyer order sheet for garment and shoe factories with product category, style, size breakdown, price, costing, margin, readiness and risk intelligence.",
    save: "Save Buyer Order Record",
    saving: "Saving...",
    success: "Buyer order record saved successfully.",
    error:
      "Could not save. Please check Firebase permission or internet connection.",
    timeout:
      "Save timed out. Data remains on screen. Please check Firebase rules or connection.",
  },
  bn: {
    title: "বায়ার অর্ডার ইন্টেলিজেন্স এন্ট্রি",
    eyebrow: "MBNCON ইউনিভার্সাল অর্ডার ইন্টেলিজেন্স",
    subtitle:
      "গার্মেন্টস ও জুতা ফ্যাক্টরির জন্য ইউনিভার্সাল বায়ার অর্ডার শিট—প্রোডাক্ট ক্যাটাগরি, স্টাইল, সাইজ ব্রেকডাউন, প্রাইস, কস্টিং, মার্জিন, প্রস্তুতি ও ঝুঁকি ইন্টেলিজেন্স।",
    save: "বায়ার অর্ডার রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "বায়ার অর্ডার রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।",
    error:
      "সংরক্ষণ করা যায়নি। Firebase permission বা internet connection চেক করুন।",
    timeout:
      "Save timeout হয়েছে। ডাটা স্ক্রিনে আছে। Firebase rules/connection চেক করুন।",
  },
};

const garmentCategories = [
  "Shirt",
  "T-Shirt",
  "Polo Shirt",
  "Tank Top",
  "Vest",
  "Pants",
  "Trousers",
  "Jeans",
  "Shorts",
  "Jacket",
  "Blazer",
  "Sweater",
  "Hoodie",
  "Sportswear",
  "Lingerie",
  "Pantie",
  "Bra",
  "Nightwear",
  "Skirt",
  "Dress",
  "Uniform",
  "Others",
];

const shoeCategories = [
  "Business Shoes",
  "Casual Shoes",
  "Sports Shoes",
  "School Shoes",
  "Sandals",
  "Slippers",
  "Slip-on Shoes",
  "Laced Shoes",
  "Boots",
  "Half Boots",
  "Long Boots",
  "High Heel",
  "Safety Shoes",
  "Loafers",
  "Sneakers",
  "Others",
];

const sizeTemplates: Record<string, string[]> = {
  "Men Shirt Collar - EU/UK": ["36", "38", "40", "42", "44", "46", "48"],
  "Men Shirt Collar - US/UK Inches": [
    "14",
    "14.5",
    "15",
    "15.5",
    "16",
    "16.5",
    "17",
    "17.5",
    "18",
  ],
  "Men Shirt Alpha": ["S", "M", "L", "XL", "XXL", "XXXL"],
  "Men Garments": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  "Women Garments": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  "Children Garments": ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
  "Men Shoes EU": [
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
],

"Men Shoes UK": [
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
],

"Men Shoes US": [
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
],

"Women Shoes EU": [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
],

"Women Shoes UK": [
  "3",
  "3.5",
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
],

"Women Shoes US": [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
],

"Children Shoes EU": [
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
],

"Children Shoes UK": [
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
],

"Children Shoes US": [
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
],
  "General Size": ["XS", "S", "M", "L", "XL", "XXL"],
};
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export default function BuyerOrderEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [sizeTemplate, setSizeTemplate] = useState("Men Shirt Collar - EU/UK")
  const [sizeQty, setSizeQty] = useState<Record<string, string>>({});
  const [extraSize1, setExtraSize1] = useState("");
  const [extraSize1Qty, setExtraSize1Qty] = useState("");
  const [extraSize2, setExtraSize2] = useState("");
  const [extraSize2Qty, setExtraSize2Qty] = useState("");

  const [form, setForm] = useState({
    companyId: "demo-company",
    factoryId: "demo-factory",
    period: "",
    buyer: "",
    orderNo: "",
    industryType: "Garments",
    customerGroup: "Men",
    productCategory: "Shirt",
    styleCategory: "Style 1",
    styleDescription: "",
    colour: "",
    materialType: "",
    orderQty: "",
    currency: "$",
    pricingUnit: "piece",
    unitPrice: "",
    costingPerUnit: "",
    orderReceiveDate: "",
    shipmentDate: "",
    leadTimeDays: "",
    paymentTerms: "",
    advanceReceived: "",
    materialReadiness: "Ready",
    productionReadiness: "Ready",
    buyerRiskLevel: "Low",
    priorityLevel: "Normal",
    remarks: "",
  });

  const toNumber = (value: string) => Number(value.replace(/[^\d.-]/g, "") || 0);

  const productCategoryOptions =
    form.industryType === "Shoes" ? shoeCategories : garmentCategories;

  const selectedSizes = sizeTemplates[sizeTemplate] || [];

  const totalSizeQty = useMemo(() => {
    const baseTotal = selectedSizes.reduce(
      (sum, size) => sum + toNumber(sizeQty[size] || ""),
      0
    );

    return baseTotal + toNumber(extraSize1Qty) + toNumber(extraSize2Qty);
  }, [selectedSizes, sizeQty, extraSize1Qty, extraSize2Qty]);

  const totalOrderValue = useMemo(
    () => toNumber(form.orderQty) * toNumber(form.unitPrice),
    [form.orderQty, form.unitPrice]
  );

  const totalCost = useMemo(
    () => toNumber(form.orderQty) * toNumber(form.costingPerUnit),
    [form.orderQty, form.costingPerUnit]
  );

  const expectedProfit = totalOrderValue - totalCost;

  const marginPercentage =
    totalOrderValue > 0 ? (expectedProfit / totalOrderValue) * 100 : 0;

  const quantityDifference = toNumber(form.orderQty) - totalSizeQty;
  const executiveAssessment =
  marginPercentage >= 20
    ? "Healthy Order Profitability"
    : marginPercentage >= 10
    ? "Moderate Margin Pressure"
    : "Critical Margin Exposure";

const kpiCards = [
  {
    title: "Expected Profit",
    value: `${form.currency}${expectedProfit.toFixed(0)}`,
    href: "#pricing-intelligence",
  },
  {
    title: "Margin %",
    value: `${marginPercentage.toFixed(1)}%`,
    href: "#executive-assessment",
  },
  {
    title: "Qty Difference",
    value: quantityDifference,
    href: "#size-breakdown-intelligence",
  },
  {
    title: "Buyer Risk",
    value: form.buyerRiskLevel,
    href: "#risk-intelligence",
  },
];

  const updateField = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "industryType") {
        next.productCategory = value === "Shoes" ? "Business Shoes" : "Shirt";
        next.pricingUnit = value === "Shoes" ? "pair" : "piece";
      }

      return next;
    });
  };

  const updateSizeQty = (size: string, value: string) => {
    setSizeQty((prev) => ({ ...prev, [size]: value }));
  };

  const resetForm = () => {
    setForm({
      companyId: "demo-company",
      factoryId: "demo-factory",
      period: "",
      buyer: "",
      orderNo: "",
      industryType: "Garments",
      customerGroup: "Men",
      productCategory: "Shirt",
      styleCategory: "Style 1",
      styleDescription: "",
      colour: "",
      materialType: "",
      orderQty: "",
      currency: "$",
      pricingUnit: "piece",
      unitPrice: "",
      costingPerUnit: "",
      orderReceiveDate: "",
      shipmentDate: "",
      leadTimeDays: "",
      paymentTerms: "",
      advanceReceived: "",
      materialReadiness: "Ready",
      productionReadiness: "Ready",
      buyerRiskLevel: "Low",
      priorityLevel: "Normal",
      remarks: "",
    });

    setSizeTemplate("Men Shirt Collar - EU/UK");
    setSizeQty({});
    setExtraSize1("");
    setExtraSize1Qty("");
    setExtraSize2("");
    setExtraSize2Qty("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const sizeBreakdown = {
      template: sizeTemplate,
      sizes: selectedSizes.map((size) => ({
        size,
        quantity: toNumber(sizeQty[size] || ""),
      })),
      extraSizes: [
        { size: extraSize1, quantity: toNumber(extraSize1Qty) },
        { size: extraSize2, quantity: toNumber(extraSize2Qty) },
      ].filter((item) => item.size || item.quantity > 0),
      totalSizeQty,
      orderQty: toNumber(form.orderQty),
      quantityDifference,
    };

    const payload = {
      ...form,
      orderQty: toNumber(form.orderQty),
      unitPrice: toNumber(form.unitPrice),
      costingPerUnit: toNumber(form.costingPerUnit),
      totalOrderValue,
      totalCost,
      expectedProfit,
      marginPercentage: Number(marginPercentage.toFixed(2)),
      leadTimeDays: toNumber(form.leadTimeDays),
      advanceReceived: toNumber(form.advanceReceived),
      sizeTemplate,
      sizeBreakdown: JSON.stringify(sizeBreakdown),
      totalSizeQty,
      quantityDifference,
    };

    const saveResult = await Promise.race([
      addBuyerOrderEntry(payload)
        .then(() => "saved")
        .catch((error) => {
          console.error("Buyer order save error:", error);
          return "error";
        }),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve("timeout"), 8000)
      ),
    ]);

    if (saveResult === "saved") {
      setMessage(t.success);
      resetForm();
    } else if (saveResult === "timeout") {
      setMessage(t.timeout);
    } else {
      setMessage(t.error);
    }

    setSaving(false);
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

          <p className="mt-4 max-w-5xl text-slate-600">{t.subtitle}</p>
          <section
  id="enterprise-kpis"
  className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4 scroll-mt-28"
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
        Click to review intelligence
      </p>
    </a>
  ))}
</section>

<section
  id="executive-assessment"
  className="mt-8 scroll-mt-28 rounded-3xl border border-cyan-200 bg-cyan-50 p-6"
>
  <p className="text-sm uppercase tracking-widest text-cyan-700">
    Executive Order Assessment
  </p>

  <h2 className="mt-2 text-3xl font-bold text-slate-900">
    {executiveAssessment}
  </h2>

  <p className="mt-4 text-slate-700">
    AI evaluates profitability, buyer exposure, shipment readiness,
    quantity alignment, costing pressure, and operational risk before
    confirming management approval.
  </p>
</section>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div id="order-identity" className="scroll-mt-28">
  <SectionTitle title="Order Identity" />
</div>

          <div className="grid gap-6 md:grid-cols-2">
            <TextInput
              label="Reporting Period"
              hint="Example: June 2026"
              value={form.period}
              onChange={(v) => updateField("period", v)}
            />

            <TextInput
              label="Buyer Name"
              hint="Example: Marks & Spencer, Next, Zara, Local Buyer"
              value={form.buyer}
              onChange={(v) => updateField("buyer", v)}
            />

            <TextInput
              label="Order Number"
              hint="Example: PO-001"
              value={form.orderNo}
              onChange={(v) => updateField("orderNo", v)}
            />

            <SelectInput
              label="Industry Type"
              value={form.industryType}
              options={["Garments", "Shoes", "Others"]}
              onChange={(v) => updateField("industryType", v)}
            />

            <SelectInput
              label="Customer Group"
              value={form.customerGroup}
              options={["Men", "Women", "Children", "Boys", "Girls", "Unisex"]}
              onChange={(v) => updateField("customerGroup", v)}
            />

            <SelectInput
              label="Product Category"
              value={form.productCategory}
              options={productCategoryOptions}
              onChange={(v) => updateField("productCategory", v)}
            />

            <SelectInput
              label="Style Category"
              value={form.styleCategory}
              options={[
                "Style 1",
                "Style 2",
                "Style 3",
                "Style 4",
                "Style 5",
                "Style 6",
                "Style 7",
                "Style 8",
                "Style 9",
                "Style 10",
              ]}
              onChange={(v) => updateField("styleCategory", v)}
            />

            <TextInput
              label="Style Description"
              hint="Example: Long sleeve formal shirt, high heel sandal, leather boot"
              value={form.styleDescription}
              onChange={(v) => updateField("styleDescription", v)}
            />

            <TextInput
              label="Colour / Color"
              hint="Example: Black, Navy, White, Mixed"
              value={form.colour}
              onChange={(v) => updateField("colour", v)}
            />

            <TextInput
              label="Material Type"
              hint="Example garment: cotton, denim. Example shoes: leather, PU, rubber sole."
              value={form.materialType}
              onChange={(v) => updateField("materialType", v)}
            />

            <NumberInput
              label="Order Quantity"
              hint="Total buyer order quantity. Number only."
              value={form.orderQty}
              onChange={(v) => updateField("orderQty", v)}
            />

            <SelectInput
              label="Size Template"
              value={sizeTemplate}
              options={[
  "Men Shirt Collar - EU/UK",
  "Men Shirt Collar - US/UK Inches",
  "Men Shirt Alpha",
  "Men Garments",
  "Women Garments",
  "Children Garments",
  "Men Shoes EU",
"Men Shoes UK",
"Men Shoes US",

"Women Shoes EU",
"Women Shoes UK",
"Women Shoes US",

"Children Shoes EU",
"Children Shoes UK",
"Children Shoes US",
  "General Size",
]}
              onChange={(v) => {
                setSizeTemplate(v);
                setSizeQty({});
                setExtraSize1("");
                setExtraSize1Qty("");
                setExtraSize2("");
                setExtraSize2Qty("");
              }}
            />
          </div>

          <div
  id="size-breakdown-intelligence"
  className="mt-8 scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-6"
>
            <h2 className="text-xl font-bold text-slate-900">
              Size Breakdown Quantity
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter quantity against each size. This helps detect size shortage,
              surplus, cutting ratio, packing ratio and shipment mismatch.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {selectedSizes.map((size) => (
                <NumberInput
                  key={size}
                  label={`Size ${size}`}
                  hint="Qty"
                  value={sizeQty[size] || ""}
                  onChange={(v) => updateSizeQty(size, v)}
                />
              ))}

              <TextInput
                label="Extra Size 1"
                hint="Example: 48, 18Y, UK47"
                value={extraSize1}
                onChange={setExtraSize1}
              />

              <NumberInput
                label="Extra Size 1 Qty"
                hint="Qty"
                value={extraSize1Qty}
                onChange={setExtraSize1Qty}
              />

              <TextInput
                label="Extra Size 2"
                hint="Example: 50, custom"
                value={extraSize2}
                onChange={setExtraSize2}
              />

              <NumberInput
                label="Extra Size 2 Qty"
                hint="Qty"
                value={extraSize2Qty}
                onChange={setExtraSize2Qty}
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ReadOnly label="Total Size Quantity" value={String(totalSizeQty)} />
              <ReadOnly label="Order Quantity" value={String(toNumber(form.orderQty))} />
              <ReadOnly label="Quantity Difference" value={String(quantityDifference)} />
            </div>
          </div>

          <div id="pricing-intelligence" className="scroll-mt-28">
  <SectionTitle title="Pricing, Costing & Margin" />
</div>

          <div className="grid gap-6 md:grid-cols-2">
            <SelectInput
              label="Currency"
              value={form.currency}
              options={["$", "€", "£"]}
              onChange={(v) => updateField("currency", v)}
            />

            <SelectInput
              label="Price / Cost Unit"
              value={form.pricingUnit}
              options={["piece", "dozen", "pair"]}
              onChange={(v) => updateField("pricingUnit", v)}
            />

            <NumberInput
              label="Selling Price Per Unit"
              hint="Number only. Example: 6"
              value={form.unitPrice}
              onChange={(v) => updateField("unitPrice", v)}
            />

            <NumberInput
              label="Costing Per Unit"
              hint="Number only. Example: 5.5"
              value={form.costingPerUnit}
              onChange={(v) => updateField("costingPerUnit", v)}
            />

            <ReadOnly
              label="Total Order Value"
              value={`${form.currency}${totalOrderValue.toFixed(2)}`}
            />

            <ReadOnly
              label="Total Cost"
              value={`${form.currency}${totalCost.toFixed(2)}`}
            />

            <ReadOnly
              label="Expected Profit"
              value={`${form.currency}${expectedProfit.toFixed(2)}`}
            />

            <ReadOnly
              label="Margin %"
              value={`${marginPercentage.toFixed(2)}%`}
            />
          </div>

          <div id="risk-intelligence" className="scroll-mt-28">
  <SectionTitle title="Dates, Readiness & Risk" />
</div>
          <div className="grid gap-6 md:grid-cols-2">
            <DateInput
              label="Order Receive Date"
              value={form.orderReceiveDate}
              onChange={(v) => updateField("orderReceiveDate", v)}
            />

            <DateInput
              label="Shipment Date"
              value={form.shipmentDate}
              onChange={(v) => updateField("shipmentDate", v)}
            />

            <NumberInput
              label="Lead Time (Days)"
              hint="Number only. Example: 45"
              value={form.leadTimeDays}
              onChange={(v) => updateField("leadTimeDays", v)}
            />

            <TextInput
              label="Payment Terms"
              hint="Example: LC, TT, 30 days credit"
              value={form.paymentTerms}
              onChange={(v) => updateField("paymentTerms", v)}
            />

            <NumberInput
              label="Advance Received"
              hint="Number only. Leave 0 if none."
              value={form.advanceReceived}
              onChange={(v) => updateField("advanceReceived", v)}
            />

            <SelectInput
              label="Material Readiness"
              value={form.materialReadiness}
              options={["Ready", "Partly Ready", "Not Ready", "At Risk"]}
              onChange={(v) => updateField("materialReadiness", v)}
            />

            <SelectInput
              label="Production Readiness"
              value={form.productionReadiness}
              options={["Ready", "Partly Ready", "Not Ready", "At Risk"]}
              onChange={(v) => updateField("productionReadiness", v)}
            />

            <SelectInput
              label="Buyer Risk Level"
              value={form.buyerRiskLevel}
              options={["Low", "Medium", "High", "Critical"]}
              onChange={(v) => updateField("buyerRiskLevel", v)}
            />

            <SelectInput
              label="Management Priority Level"
              value={form.priorityLevel}
              options={["Normal", "High", "Top", "Urgent"]}
              onChange={(v) => updateField("priorityLevel", v)}
            />

            <TextArea
              label="Management Remarks"
              hint="Example: Good buyer, urgent order, monitor shipment date."
              value={form.remarks}
              onChange={(v) => updateField("remarks", v)}
            />
          </div>
<div className="mt-10 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
  <p className="text-sm uppercase tracking-widest text-cyan-700">
    AI Recommendation
  </p>

  <p className="mt-3 text-slate-700">
    Management should validate order profitability, shipment readiness,
    size alignment, buyer risk exposure, and margin sustainability before
    final production approval. Orders with low margin and high shipment
    pressure should trigger executive review.
  </p>
</div>
          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-cyan-700 px-6 py-3 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
            >
              {saving ? t.saving : t.save}
            </button>

            {message && (
              <p className="text-sm font-medium text-emerald-700">{message}</p>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-6 mt-10 border-b border-slate-200 pb-3">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function TextInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
      />
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function NumberInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="number"
        step="any"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
      />
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
      />
      <p className="text-xs text-slate-500">Select date from calendar.</p>
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500">Select from dropdown.</p>
    </div>
  );
}

function TextArea({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
      />
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">
        {value}
      </div>
      <p className="text-xs text-slate-500">Auto calculated by the system.</p>
    </div>
  );
}