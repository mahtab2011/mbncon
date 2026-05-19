"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";
import { addPostOrderIntelligenceEntry } from "@/lib/software/firestoreService";

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
    title: "Post Order Intelligence & Recovery Entry",
    eyebrow: "MBNCON POST ORDER RECOVERY INTELLIGENCE",

    subtitle:
      "Track surplus production, short shipment, rejected goods, seconds, rework, ageing inventory, disposal strategy and profit recovery opportunities after production or shipment.",

    save: "Save Recovery Intelligence",
    saving: "Saving...",

    success:
      "Post order recovery intelligence saved successfully.",

    error:
      "Could not save. Please check Firebase permission or internet connection.",
  },

  bn: {
    title: "পোস্ট অর্ডার ইন্টেলিজেন্স ও রিকভারি এন্ট্রি",

    eyebrow:
      "MBNCON পোস্ট অর্ডার রিকভারি ইন্টেলিজেন্স",

    subtitle:
      "উৎপাদন বা শিপমেন্টের পর surplus production, short shipment, rejected goods, seconds, rework, ageing inventory এবং recovery opportunity ট্র্যাক করুন।",

    save: "রিকভারি ইন্টেলিজেন্স সংরক্ষণ করুন",

    saving: "সংরক্ষণ হচ্ছে...",

    success:
      "পোস্ট অর্ডার রিকভারি সফলভাবে সংরক্ষিত হয়েছে।",

    error:
      "সংরক্ষণ করা যায়নি। Firebase permission বা internet connection চেক করুন।",
  },
};

export default function PostOrderIntelligenceEntryPage() {
  const { language } = useLanguage();

  const t = content[language];

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    companyId: "demo-company",
    factoryId: "demo-factory",

    buyer: "",
    orderNo: "",

    productCategory: "",
    customerGroup: "",

    orderedQty: "",
    shippedQty: "",

    surplusQty: "",
    shortShipmentQty: "",

    rejectedQty: "",
    secondsQty: "",

    reworkQty: "",
    reworkCost: "",
    reworkHours: "",

    inventoryAgeingDays: "",

    disposalMethod: "Online Clearance",

    recoveryValue: "",

    cancellationRisk: "Low",

    recommendation: "",
    remarks: "",
  });

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toNumber = (value: string) =>
    Number(value.replace(/[^\d.-]/g, "") || 0);

  const productionGap = useMemo(() => {
    return (
      toNumber(form.orderedQty) -
      toNumber(form.shippedQty)
    );
  }, [form.orderedQty, form.shippedQty]);

  const recoveryRiskLevel = useMemo(() => {
    const ageing = toNumber(
      form.inventoryAgeingDays
    );

    const rejected = toNumber(form.rejectedQty);

    const surplus = toNumber(form.surplusQty);

    if (
      ageing > 180 ||
      rejected > 500 ||
      surplus > 2000
    ) {
      return "Critical";
    }

    if (
      ageing > 90 ||
      rejected > 200 ||
      surplus > 1000
    ) {
      return "High";
    }

    if (ageing > 45 || rejected > 100) {
      return "Medium";
    }

    return "Low";
  }, [
    form.inventoryAgeingDays,
    form.rejectedQty,
    form.surplusQty,
  ]);

  const estimatedRecoveryRecommendation =
    useMemo(() => {
      const ageing = toNumber(
        form.inventoryAgeingDays
      );

      if (ageing > 180) {
        return "Immediate stock clearance required through lot sale, discount liquidation or export recovery.";
      }

      if (ageing > 90) {
        return "Prioritise online clearance, secondary market resale and buyer recovery negotiation.";
      }

      if (ageing > 45) {
        return "Monitor ageing carefully and plan controlled disposal strategy.";
      }

      return "Recovery risk manageable.";
    }, [form.inventoryAgeingDays]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);

    setMessage("");

    try {
      await addPostOrderIntelligenceEntry({
        ...form,

        orderedQty: toNumber(
          form.orderedQty
        ),

        shippedQty: toNumber(
          form.shippedQty
        ),

        surplusQty: toNumber(
          form.surplusQty
        ),

        shortShipmentQty: toNumber(
          form.shortShipmentQty
        ),

        rejectedQty: toNumber(
          form.rejectedQty
        ),

        secondsQty: toNumber(
          form.secondsQty
        ),

        reworkQty: toNumber(
          form.reworkQty
        ),

        reworkCost: toNumber(
          form.reworkCost
        ),

        reworkHours: toNumber(
          form.reworkHours
        ),

        inventoryAgeingDays: toNumber(
          form.inventoryAgeingDays
        ),

        recoveryValue: toNumber(
          form.recoveryValue
        ),

        productionGap,

        recoveryRiskLevel,
      });

      setMessage(t.success);

      setForm({
        companyId: "demo-company",
        factoryId: "demo-factory",

        buyer: "",
        orderNo: "",

        productCategory: "",
        customerGroup: "",

        orderedQty: "",
        shippedQty: "",

        surplusQty: "",
        shortShipmentQty: "",

        rejectedQty: "",
        secondsQty: "",

        reworkQty: "",
        reworkCost: "",
        reworkHours: "",

        inventoryAgeingDays: "",

        disposalMethod: "Online Clearance",

        recoveryValue: "",

        cancellationRisk: "Low",

        recommendation: "",
        remarks: "",
      });
    } catch (error) {
      console.error(error);

      setMessage(t.error);
    }

    setSaving(false);
  };

  return (
    <DashboardShell title={t.title}>
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            {t.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-600">
            {t.subtitle}
          </p>
        </section>

        {/* KPI CARDS */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Recovery Visibility",
              value: "Active",
              desc:
                "Recovery intelligence monitoring operational.",
            },
            {
              title: "Inventory Risk",
              value: recoveryRiskLevel,
              desc:
                "Calculated using ageing, rejection, and surplus exposure.",
            },
            {
              title: "Production Gap",
              value: String(productionGap),
              desc:
                "Difference between ordered and shipped quantity.",
            },
            {
              title: "Recovery Planning",
              value: "Enabled",
              desc:
                "Supports disposal and resale strategy planning.",
            },
          ].map((item) => {
            const id = slugify(item.title);

            return (
              <div
                key={item.title}
                id={id}
                className="scroll-mt-28 rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-amber-950">
                  {item.value}
                </h2>

                <p className="mt-4 leading-7 text-slate-700">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </section>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl"
        >
          <SectionTitle title="Order Recovery Identity" />

          <div className="grid gap-6 md:grid-cols-2">
            <TextInput
              label="Buyer Name"
              hint="Example: Zara, H&M, M&S"
              value={form.buyer}
              onChange={(v) =>
                updateField("buyer", v)
              }
            />

            <TextInput
              label="Order Number"
              hint="Example: PO-2026-01"
              value={form.orderNo}
              onChange={(v) =>
                updateField("orderNo", v)
              }
            />

            <TextInput
              label="Product Category"
              hint="Example: Shirt, Jacket, Shoes"
              value={form.productCategory}
              onChange={(v) =>
                updateField(
                  "productCategory",
                  v
                )
              }
            />

            <SelectInput
              label="Customer Group"
              value={form.customerGroup}
              options={[
                "Men",
                "Women",
                "Children",
                "Boys",
                "Girls",
                "Unisex",
              ]}
              onChange={(v) =>
                updateField(
                  "customerGroup",
                  v
                )
              }
            />
          </div>

          <SectionTitle title="Production & Shipment Recovery" />

          <div className="grid gap-6 md:grid-cols-2">
            <NumberInput
              label="Ordered Quantity"
              hint="Original buyer order quantity."
              value={form.orderedQty}
              onChange={(v) =>
                updateField(
                  "orderedQty",
                  v
                )
              }
            />

            <NumberInput
              label="Shipped Quantity"
              hint="Actual shipped quantity."
              value={form.shippedQty}
              onChange={(v) =>
                updateField(
                  "shippedQty",
                  v
                )
              }
            />

            <ReadOnly
              label="Production / Shipment Gap"
              value={String(productionGap)}
            />

            <NumberInput
              label="Surplus Quantity"
              hint="Excess production quantity."
              value={form.surplusQty}
              onChange={(v) =>
                updateField(
                  "surplusQty",
                  v
                )
              }
            />

            <NumberInput
              label="Short Shipment Quantity"
              hint="Shipment shortage quantity."
              value={form.shortShipmentQty}
              onChange={(v) =>
                updateField(
                  "shortShipmentQty",
                  v
                )
              }
            />

            <NumberInput
              label="Rejected Quantity"
              hint="Rejected or failed inspection quantity."
              value={form.rejectedQty}
              onChange={(v) =>
                updateField(
                  "rejectedQty",
                  v
                )
              }
            />

            <NumberInput
              label="Seconds / B-Grade Quantity"
              hint="Factory seconds or lower-grade goods."
              value={form.secondsQty}
              onChange={(v) =>
                updateField(
                  "secondsQty",
                  v
                )
              }
            />
          </div>

          <SectionTitle title="Rework & Recovery Intelligence" />

          <div className="grid gap-6 md:grid-cols-2">
            <NumberInput
              label="Rework Quantity"
              hint="Quantity requiring repair or correction."
              value={form.reworkQty}
              onChange={(v) =>
                updateField(
                  "reworkQty",
                  v
                )
              }
            />

            <NumberInput
              label="Rework Cost"
              hint="Repair/rework cost amount."
              value={form.reworkCost}
              onChange={(v) =>
                updateField(
                  "reworkCost",
                  v
                )
              }
            />

            <NumberInput
              label="Rework Hours"
              hint="Estimated repair/rework hours."
              value={form.reworkHours}
              onChange={(v) =>
                updateField(
                  "reworkHours",
                  v
                )
              }
            />

            <NumberInput
              label="Inventory Ageing Days"
              hint="Days stock remained unsold or unshipped."
              value={form.inventoryAgeingDays}
              onChange={(v) =>
                updateField(
                  "inventoryAgeingDays",
                  v
                )
              }
            />

            <SelectInput
              label="Disposal Method"
              value={form.disposalMethod}
              options={[
                "Online Clearance",
                "Lot Sale",
                "Secondary Market",
                "Discount Liquidation",
                "Export Recovery",
                "Reprocessing",
                "Controlled Destruction",
              ]}
              onChange={(v) =>
                updateField(
                  "disposalMethod",
                  v
                )
              }
            />

            <NumberInput
              label="Expected Recovery Value"
              hint="Estimated recovery amount."
              value={form.recoveryValue}
              onChange={(v) =>
                updateField(
                  "recoveryValue",
                  v
                )
              }
            />

            <SelectInput
              label="Buyer Cancellation Risk"
              value={form.cancellationRisk}
              options={[
                "Low",
                "Medium",
                "High",
                "Critical",
              ]}
              onChange={(v) =>
                updateField(
                  "cancellationRisk",
                  v
                )
              }
            />

            <ReadOnly
              label="Recovery Risk Level"
              value={recoveryRiskLevel}
            />
          </div>

          {/* AI RECOVERY */}
          <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 transition duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-amber-900">
              AI Recovery Recommendation
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-700">
              {estimatedRecoveryRecommendation}
            </p>
          </section>

          {/* TEXT AREAS */}
          <div className="mt-10 grid gap-6">
            <TextArea
              label="Management Recommendation"
              hint="Recovery action, buyer negotiation, resale strategy, disposal recommendation etc."
              value={form.recommendation}
              onChange={(v) =>
                updateField(
                  "recommendation",
                  v
                )
              }
            />

            <TextArea
              label="Management Remarks"
              hint="Internal management observation."
              value={form.remarks}
              onChange={(v) =>
                updateField(
                  "remarks",
                  v
                )
              }
            />
          </div>

          {/* BUTTON */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-amber-700 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-amber-800 disabled:opacity-60"
            >
              {saving
                ? t.saving
                : t.save}
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

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-6 mt-10 border-b border-slate-200 pb-3">
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
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
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
      />

      <p className="text-xs text-slate-500">
        {hint}
      </p>
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
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="number"
        step="any"
        min="0"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
      />

      <p className="text-xs text-slate-500">
        {hint}
      </p>
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
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <p className="text-xs text-slate-500">
        Select from dropdown.
      </p>
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
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        rows={4}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
      />

      <p className="text-xs text-slate-500">
        {hint}
      </p>
    </div>
  );
}

function ReadOnly({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">
        {value}
      </div>

      <p className="text-xs text-slate-500">
        Auto calculated by the system.
      </p>
    </div>
  );
}