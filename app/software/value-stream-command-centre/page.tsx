"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

type StageRow = {
  stageEn: string;
  stageBn: string;
  plannedDays: number;
  actualDays: number;
  valueAddedDays: number;
  costPerDelayDay: number;
};

const initialStages: StageRow[] = [
  {
    stageEn: "Order Confirmation",
    stageBn: "অর্ডার নিশ্চিতকরণ",
    plannedDays: 2,
    actualDays: 3,
    valueAddedDays: 1,
    costPerDelayDay: 1500,
  },
  {
    stageEn: "Material Booking",
    stageBn: "উপকরণ বুকিং",
    plannedDays: 5,
    actualDays: 7,
    valueAddedDays: 2,
    costPerDelayDay: 2500,
  },
  {
    stageEn: "Material Receipt",
    stageBn: "উপকরণ গ্রহণ",
    plannedDays: 20,
    actualDays: 24,
    valueAddedDays: 2,
    costPerDelayDay: 5000,
  },
  {
    stageEn: "Cutting",
    stageBn: "কাটিং",
    plannedDays: 3,
    actualDays: 4,
    valueAddedDays: 3,
    costPerDelayDay: 3000,
  },
  {
    stageEn: "Sewing",
    stageBn: "সুইং",
    plannedDays: 12,
    actualDays: 14,
    valueAddedDays: 10,
    costPerDelayDay: 7000,
  },
  {
    stageEn: "Finishing",
    stageBn: "ফিনিশিং",
    plannedDays: 4,
    actualDays: 5,
    valueAddedDays: 3,
    costPerDelayDay: 3500,
  },
  {
    stageEn: "Packing",
    stageBn: "প্যাকিং",
    plannedDays: 2,
    actualDays: 2,
    valueAddedDays: 1,
    costPerDelayDay: 2000,
  },
  {
    stageEn: "Shipment",
    stageBn: "শিপমেন্ট",
    plannedDays: 5,
    actualDays: 6,
    valueAddedDays: 1,
    costPerDelayDay: 8000,
  },
];

export default function ValueStreamCommandCentre() {
  const [lang, setLang] = useState<Lang>("en");
  const [stages, setStages] = useState(initialStages);

  const totalPlannedDays = useMemo(
    () => stages.reduce((sum, row) => sum + row.plannedDays, 0),
    [stages]
  );

  const totalActualDays = useMemo(
    () => stages.reduce((sum, row) => sum + row.actualDays, 0),
    [stages]
  );

  const totalDelayDays = useMemo(
    () =>
      stages.reduce(
        (sum, row) => sum + Math.max(0, row.actualDays - row.plannedDays),
        0
      ),
    [stages]
  );

  const totalValueAddedDays = useMemo(
    () => stages.reduce((sum, row) => sum + row.valueAddedDays, 0),
    [stages]
  );

  const nonValueAddedDays = useMemo(
    () => Math.max(0, totalActualDays - totalValueAddedDays),
    [totalActualDays, totalValueAddedDays]
  );

  const valueAddedPercent = useMemo(() => {
    if (totalActualDays === 0) return 0;
    return (totalValueAddedDays / totalActualDays) * 100;
  }, [totalActualDays, totalValueAddedDays]);

  const totalDelayCost = useMemo(
    () =>
      stages.reduce((sum, row) => {
        const delay = Math.max(0, row.actualDays - row.plannedDays);
        return sum + delay * row.costPerDelayDay;
      }, 0),
    [stages]
  );

  const worstBottleneck = useMemo(() => {
    return stages
      .map((row) => ({
        ...row,
        delay: Math.max(0, row.actualDays - row.plannedDays),
      }))
      .sort((a, b) => b.delay - a.delay)[0];
  }, [stages]);

  const t = {
    en: {
      title: "Value Stream Command Centre",
      subtitle:
        "Lean value-stream intelligence from order confirmation to shipment",
      planned: "Total Planned Days",
      actual: "Total Actual Days",
      delay: "Total Delay Days",
      va: "Value Added Days",
      nva: "Non-Value Added Days",
      vaPercent: "Value Added %",
      delayCost: "Estimated Delay Cost",
      stage: "Stage",
      plannedDays: "Planned Days",
      actualDays: "Actual Days",
      valueAddedDays: "Value Added Days",
      delayDays: "Delay Days",
      costPerDay: "Cost / Delay Day",
      financialImpact: "Financial Impact",
      aiTitle: "AI Bottleneck Insight",
      aiGood:
        "The value stream is within an acceptable range. Continue monitoring stage-level delays.",
      aiBad:
        "The value stream has significant delays. Management should immediately review the highest bottleneck stage and prepare recovery action.",
      worst: "Highest Bottleneck",
    },
    bn: {
      title: "ভ্যালু স্ট্রিম কমান্ড সেন্টার",
      subtitle:
        "অর্ডার নিশ্চিতকরণ থেকে শিপমেন্ট পর্যন্ত লিন ভ্যালু স্ট্রিম ইন্টেলিজেন্স",
      planned: "মোট পরিকল্পিত দিন",
      actual: "মোট বাস্তব দিন",
      delay: "মোট বিলম্ব দিন",
      va: "মূল্য সংযোজন দিন",
      nva: "অমূল্য দিন",
      vaPercent: "মূল্য সংযোজন %",
      delayCost: "আনুমানিক বিলম্ব খরচ",
      stage: "ধাপ",
      plannedDays: "পরিকল্পিত দিন",
      actualDays: "বাস্তব দিন",
      valueAddedDays: "মূল্য সংযোজন দিন",
      delayDays: "বিলম্ব দিন",
      costPerDay: "প্রতি বিলম্ব দিনের খরচ",
      financialImpact: "আর্থিক প্রভাব",
      aiTitle: "AI বটলনেক বিশ্লেষণ",
      aiGood:
        "ভ্যালু স্ট্রিম গ্রহণযোগ্য পর্যায়ে রয়েছে। ধাপভিত্তিক বিলম্ব নিয়মিত পর্যবেক্ষণ করুন।",
      aiBad:
        "ভ্যালু স্ট্রিমে উল্লেখযোগ্য বিলম্ব রয়েছে। ব্যবস্থাপনাকে অবিলম্বে সর্বোচ্চ বটলনেক ধাপ পর্যালোচনা করে রিকভারি অ্যাকশন নিতে হবে।",
      worst: "সর্বোচ্চ বটলনেক",
    },
  }[lang];

  function updateStage(
    index: number,
    field: "plannedDays" | "actualDays" | "valueAddedDays" | "costPerDelayDay",
    value: number
  ) {
    setStages((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">{t.title}</h1>
            <p className="mt-2 max-w-4xl text-cyan-300">{t.subtitle}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "en" ? "bg-cyan-400 text-slate-950" : "bg-slate-800"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLang("bn")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "bn" ? "bg-cyan-400 text-slate-950" : "bg-slate-800"
              }`}
            >
              বাংলা
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <KPI title={t.planned} value={totalPlannedDays.toFixed(1)} />
          <KPI title={t.actual} value={totalActualDays.toFixed(1)} />
          <KPI title={t.delay} value={totalDelayDays.toFixed(1)} />
          <KPI title={t.delayCost} value={`$${totalDelayCost.toFixed(0)}`} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <KPI title={t.va} value={totalValueAddedDays.toFixed(1)} />
          <KPI title={t.nva} value={nonValueAddedDays.toFixed(1)} />
          <KPI title={t.vaPercent} value={`${valueAddedPercent.toFixed(1)}%`} />
        </section>

        <section className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            {lang === "en" ? "Stage-Level Value Stream" : "ধাপভিত্তিক ভ্যালু স্ট্রিম"}
          </h2>

          <table className="mt-6 min-w-[900px] w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm text-slate-300">
                <th className="p-3">{t.stage}</th>
                <th className="p-3">{t.plannedDays}</th>
                <th className="p-3">{t.actualDays}</th>
                <th className="p-3">{t.valueAddedDays}</th>
                <th className="p-3">{t.delayDays}</th>
                <th className="p-3">{t.costPerDay}</th>
                <th className="p-3">{t.financialImpact}</th>
              </tr>
            </thead>

            <tbody>
              {stages.map((row, index) => {
                const delay = Math.max(0, row.actualDays - row.plannedDays);
                const impact = delay * row.costPerDelayDay;

                return (
                  <tr key={row.stageEn} className="border-b border-white/5">
                    <td className="p-3 font-semibold">
                      {lang === "en" ? row.stageEn : row.stageBn}
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.plannedDays}
                        onChange={(event) =>
                          updateStage(
                            index,
                            "plannedDays",
                            Number(event.target.value)
                          )
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.actualDays}
                        onChange={(event) =>
                          updateStage(
                            index,
                            "actualDays",
                            Number(event.target.value)
                          )
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.valueAddedDays}
                        onChange={(event) =>
                          updateStage(
                            index,
                            "valueAddedDays",
                            Number(event.target.value)
                          )
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td
                      className={`p-3 font-bold ${
                        delay > 0 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {delay.toFixed(1)}
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.costPerDelayDay}
                        onChange={(event) =>
                          updateStage(
                            index,
                            "costPerDelayDay",
                            Number(event.target.value)
                          )
                        }
                        className="w-28 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td
                      className={`p-3 font-bold ${
                        impact > 0 ? "text-yellow-300" : "text-green-400"
                      }`}
                    >
                      ${impact.toFixed(0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-bold text-cyan-300">{t.aiTitle}</h2>

          <p className="mt-3 text-slate-200">
            {totalDelayDays > 3 ? t.aiBad : t.aiGood}
          </p>

          <p className="mt-4 font-bold text-white">
            {t.worst}:{" "}
            <span className="text-cyan-300">
              {lang === "en" ? worstBottleneck.stageEn : worstBottleneck.stageBn}
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}