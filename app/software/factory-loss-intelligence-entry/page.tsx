"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";
import { useLanguage } from "@/components/software/LanguageProvider";
import { addFactoryLossIntelligenceEntry } from "@/lib/software/firestoreService";

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
    title: "Factory Loss Intelligence Entry",
    eyebrow: "MBNCON FACTORY LOSS RECOVERY SYSTEM",
    subtitle:
      "Track hidden operational losses across production, material, labour, inventory, shipment and customer claim areas.",
    save: "Save Factory Loss Record",
    saving: "Saving...",
    success: "Factory loss intelligence saved successfully.",
    error:
      "Could not save factory loss record. Please check Firebase rules or connection.",
  },

  bn: {
    title: "ফ্যাক্টরি লস ইন্টেলিজেন্স এন্ট্রি",
    eyebrow: "MBNCON ফ্যাক্টরি লস রিকভারি সিস্টেম",
    subtitle:
      "উৎপাদন, মেটেরিয়াল, শ্রম, ইনভেন্টরি, শিপমেন্ট ও কাস্টমার ক্লেইম সংক্রান্ত hidden operational loss ট্র্যাক করুন।",
    save: "ফ্যাক্টরি লস রেকর্ড সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    success: "ফ্যাক্টরি লস ইন্টেলিজেন্স সফলভাবে সংরক্ষণ হয়েছে।",
    error:
      "ফ্যাক্টরি লস রেকর্ড সংরক্ষণ করা যায়নি। Firebase rules বা connection চেক করুন।",
  },
};

const lossAreas = [
  "Material Over Ordering",
  "Poor Material Quality",
  "Transport Delay",
  "Factory Gate Waiting",
  "Excess Inventory Holding",
  "Worker Idle Time",
  "Machine Idle Time",
  "Production Rejection",
  "Rework Loss",
  "Packaging Delay",
  "Finished Goods Holding",
  "Shipment Delay Penalty",
  "Customer Claim Risk",
  "Excess Overtime",
  "Utility Wastage",
  "Emergency Air Shipment",
];

export default function FactoryLossIntelligenceEntryPage() {
  const { language } = useLanguage();
  const t = content[language];

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    period: "",
    department: "",
    lossArea: "Material Over Ordering",

    rootCause: "",
    observation: "",

    estimatedLossValue: "",
    recoveryOpportunityValue: "",

    frequency: "Medium",
    riskLevel: "Medium",

    responsibleDepartment: "",
    responsiblePerson: "",

    correctiveAction: "",
    preventiveAction: "",

    targetRecoveryDate: "",

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
      department: "",
      lossArea: "Material Over Ordering",

      rootCause: "",
      observation: "",

      estimatedLossValue: "",
      recoveryOpportunityValue: "",

      frequency: "Medium",
      riskLevel: "Medium",

      responsibleDepartment: "",
      responsiblePerson: "",

      correctiveAction: "",
      preventiveAction: "",

      targetRecoveryDate: "",

      remarks: "",
    });
  };

  const toNumber = (value: string) =>
    Number(value.replace(/[^\d.-]/g, "") || 0);

  const estimatedNetRecovery = useMemo(() => {
    return (
      toNumber(form.recoveryOpportunityValue) -
      toNumber(form.estimatedLossValue)
    );
  }, [form.recoveryOpportunityValue, form.estimatedLossValue]);

  const priorityLevel = useMemo(() => {
    const loss = toNumber(form.estimatedLossValue);

    if (loss > 100000) return "Critical";
    if (loss > 50000) return "High";
    if (loss > 10000) return "Medium";

    return "Low";
  }, [form.estimatedLossValue]);

  const aiRecommendation = useMemo(() => {
    const loss = toNumber(form.estimatedLossValue);

    if (loss > 100000) {
      return "Immediate executive management intervention required. Launch urgent operational recovery project.";
    }

    if (loss > 50000) {
      return "Assign cross-functional recovery team and monitor weekly.";
    }

    if (loss > 10000) {
      return "Department-level corrective action recommended.";
    }

    return "Continue monitoring and preventive control.";
  }, [form.estimatedLossValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await addFactoryLossIntelligenceEntry({
        companyId: "demo-company",
        factoryId: "demo-factory",

        ...form,

        estimatedLossValue: toNumber(form.estimatedLossValue),
        recoveryOpportunityValue: toNumber(form.recoveryOpportunityValue),
        estimatedNetRecovery,
        priorityLevel,
      });

      setMessage(t.success);
      resetForm();
    } catch (error) {
      console.error("Factory loss save error:", error);
      setMessage(t.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title={t.title}>
      <div className="space-y-6">
        <section
          id={slugify(t.title)}
          className="scroll-mt-28 rounded-3xl border border-red-100 bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
            {t.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {t.title}
          </h1>

          <p className="mt-4 max-w-5xl text-slate-600">{t.subtitle}</p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <SectionTitle title="Loss Identification" />

          <div className="grid gap-6 md:grid-cols-2">
            <TextInput
              label="Reporting Period"
              hint="Example: June 2026"
              value={form.period}
              onChange={(v) => updateField("period", v)}
            />

            <TextInput
              label="Department"
              hint="Example: Production, Cutting, Warehouse"
              value={form.department}
              onChange={(v) => updateField("department", v)}
            />

            <SelectInput
              label="Loss Area"
              value={form.lossArea}
              options={lossAreas}
              onChange={(v) => updateField("lossArea", v)}
            />

            <TextInput
              label="Root Cause"
              hint="Example: Poor planning, delay, lack of monitoring"
              value={form.rootCause}
              onChange={(v) => updateField("rootCause", v)}
            />
          </div>

          <SectionTitle title="Financial Loss Intelligence" />

          <div className="grid gap-6 md:grid-cols-2">
            <NumberInput
              label="Estimated Loss Value"
              hint="Estimated monetary loss."
              value={form.estimatedLossValue}
              onChange={(v) => updateField("estimatedLossValue", v)}
            />

            <NumberInput
              label="Recovery Opportunity Value"
              hint="Potential recovery amount."
              value={form.recoveryOpportunityValue}
              onChange={(v) =>
                updateField("recoveryOpportunityValue", v)
              }
            />

            <ReadOnly
              label="Net Recovery Potential"
              value={String(estimatedNetRecovery)}
            />

            <ReadOnly label="Priority Level" value={priorityLevel} />
          </div>

          <SectionTitle title="Operational Risk and Ownership" />

          <div className="grid gap-6 md:grid-cols-2">
            <SelectInput
              label="Frequency"
              value={form.frequency}
              options={["Low", "Medium", "High", "Very High"]}
              onChange={(v) => updateField("frequency", v)}
            />

            <SelectInput
              label="Risk Level"
              value={form.riskLevel}
              options={["Low", "Medium", "High", "Critical"]}
              onChange={(v) => updateField("riskLevel", v)}
            />

            <TextInput
              label="Responsible Department"
              hint="Department responsible for action."
              value={form.responsibleDepartment}
              onChange={(v) =>
                updateField("responsibleDepartment", v)
              }
            />

            <TextInput
              label="Responsible Person"
              hint="Manager or owner."
              value={form.responsiblePerson}
              onChange={(v) => updateField("responsiblePerson", v)}
            />

            <DateInput
              label="Target Recovery Date"
              value={form.targetRecoveryDate}
              onChange={(v) =>
                updateField("targetRecoveryDate", v)
              }
            />
          </div>

          <section
            id={slugify("AI Operational Recommendation")}
            className="scroll-mt-28 mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-2xl font-bold text-red-900">
              AI Operational Recommendation
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-700">
              {aiRecommendation}
            </p>
          </section>

          <SectionTitle title="Corrective and Preventive Actions" />

          <div className="grid gap-6">
            <TextArea
              label="Observation"
              hint="Detailed operational observation."
              value={form.observation}
              onChange={(v) => updateField("observation", v)}
            />

            <TextArea
              label="Corrective Action"
              hint="Immediate recovery action."
              value={form.correctiveAction}
              onChange={(v) =>
                updateField("correctiveAction", v)
              }
            />

            <TextArea
              label="Preventive Action"
              hint="Long-term prevention strategy."
              value={form.preventiveAction}
              onChange={(v) =>
                updateField("preventiveAction", v)
              }
            />

            <TextArea
              label="Management Remarks"
              hint="Additional management comments."
              value={form.remarks}
              onChange={(v) => updateField("remarks", v)}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-red-800 hover:shadow-lg disabled:opacity-60"
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

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      id={slugify(title)}
      className="scroll-mt-28 mb-6 mt-10 border-b border-slate-200 pb-3"
    >
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
  onChange: (value: string) => void;
}) {
  return (
    <div
      id={slugify(label)}
      className="scroll-mt-28 space-y-2"
    >
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500"
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
    <div
      id={slugify(label)}
      className="scroll-mt-28 space-y-2"
    >
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="number"
        step="any"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500"
      />

      <p className="text-xs text-slate-500">{hint}</p>
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
    <div
      id={slugify(label)}
      className="scroll-mt-28 space-y-2"
    >
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
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
    <div
      id={slugify(label)}
      className="scroll-mt-28 space-y-2"
    >
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500"
      />

      <p className="text-xs text-slate-500">Select date.</p>
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
    <div
      id={slugify(label)}
      className="scroll-mt-28 space-y-2"
    >
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500"
      />

      <p className="text-xs text-slate-500">{hint}</p>
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
    <div
      id={slugify(label)}
      className="scroll-mt-28 space-y-2"
    >
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