"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

type Bottleneck = {
  department: string;
  bottleneck: string;
  delayDays: number;
  affectedOrders: number;
  costPerDay: number;
};

const initialData: Bottleneck[] = [
  {
    department: "Material",
    bottleneck: "Fabric Delay",
    delayDays: 4,
    affectedOrders: 3,
    costPerDay: 3000,
  },
  {
    department: "Cutting",
    bottleneck: "Marker Inefficiency",
    delayDays: 2,
    affectedOrders: 2,
    costPerDay: 2000,
  },
  {
    department: "Sewing",
    bottleneck: "Low Line Efficiency",
    delayDays: 5,
    affectedOrders: 4,
    costPerDay: 5000,
  },
  {
    department: "Shipment",
    bottleneck: "Booking Delay",
    delayDays: 3,
    affectedOrders: 2,
    costPerDay: 7000,
  },
  {
  department: "Sample Room",
  bottleneck: "Sample Approval Delay",
  delayDays: 6,
  affectedOrders: 2,
  costPerDay: 2500,
},
{
  department: "Sample Room",
  bottleneck: "Pattern Correction Delay",
  delayDays: 3,
  affectedOrders: 2,
  costPerDay: 1800,
},
{
  department: "Commercial",
  bottleneck: "Late Buyer Meeting Arrangement",
  delayDays: 10,
  affectedOrders: 1,
  costPerDay: 2000,
},
{
  department: "Market Development",
  bottleneck: "Weak Promotion in Buyer Countries",
  delayDays: 15,
  affectedOrders: 1,
  costPerDay: 3000,
},
{
  department: "Market Development",
  bottleneck: "Untapped Africa & Arab Market Pipeline",
  delayDays: 20,
  affectedOrders: 1,
  costPerDay: 3500,
},
];

export default function BottleneckIntelligenceCentre() {
  const [lang, setLang] = useState<Lang>("en");
  const [rows, setRows] = useState(initialData);

  const totalDelay = useMemo(
    () => rows.reduce((sum, row) => sum + row.delayDays, 0),
    [rows]
  );

  const totalImpact = useMemo(
    () =>
      rows.reduce(
        (sum, row) =>
          sum + row.delayDays * row.costPerDay,
        0
      ),
    [rows]
  );

  const highestRisk = useMemo(() => {
    return [...rows].sort(
      (a, b) =>
        b.delayDays * b.costPerDay -
        a.delayDays * a.costPerDay
    )[0];
  }, [rows]);

  const t = {
    en: {
      title: "Bottleneck Intelligence Centre",
      subtitle:
        "AI-driven bottleneck detection and financial impact analysis",

      delay: "Total Delay Days",
      impact: "Financial Impact",
      highest: "Highest Risk Bottleneck",

      department: "Department",
      bottleneck: "Bottleneck",
      delayDays: "Delay Days",
      affectedOrders: "Affected Orders",
      costPerDay: "Cost / Delay Day",
      loss: "Loss",

      ai: "AI Recommendation",
    },

    bn: {
      title: "বটলনেক ইন্টেলিজেন্স সেন্টার",
      subtitle:
        "AI-চালিত বটলনেক সনাক্তকরণ ও আর্থিক প্রভাব বিশ্লেষণ",

      delay: "মোট বিলম্ব দিন",
      impact: "আর্থিক ক্ষতি",
      highest: "সর্বোচ্চ ঝুঁকিপূর্ণ বটলনেক",

      department: "বিভাগ",
      bottleneck: "বটলনেক",
      delayDays: "বিলম্ব দিন",
      affectedOrders: "প্রভাবিত অর্ডার",
      costPerDay: "প্রতি বিলম্ব দিনের খরচ",
      loss: "ক্ষতি",

      ai: "AI সুপারিশ",
    },
  }[lang];

  function updateRow(
    index: number,
    field: keyof Bottleneck,
    value: string | number
  ) {
    setRows((current) =>
      current.map((row, i) =>
        i === index
          ? { ...row, [field]: value }
          : row
      )
    );
  }

  function getRiskLevel(loss: number) {
    if (loss >= 30000) return "CRITICAL";
    if (loss >= 15000) return "HIGH";
    if (loss >= 5000) return "MEDIUM";
    return "LOW";
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <section className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black">
              {t.title}
            </h1>

            <p className="mt-3 text-cyan-300">
              {t.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "en"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLang("bn")}
              className={`rounded-xl px-4 py-2 font-bold ${
                lang === "bn"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800"
              }`}
            >
              বাংলা
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <KPI
            title={t.delay}
            value={totalDelay.toFixed(0)}
          />

          <KPI
            title={t.impact}
            value={`$${totalImpact.toFixed(0)}`}
          />

          <KPI
            title={t.highest}
            value={highestRisk?.bottleneck || "-"}
          />
        </section>

        <section className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-slate-900 p-6">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-3">{t.department}</th>
                <th className="p-3">{t.bottleneck}</th>
                <th className="p-3">{t.delayDays}</th>
                <th className="p-3">{t.affectedOrders}</th>
                <th className="p-3">{t.costPerDay}</th>
                <th className="p-3">{t.loss}</th>
                <th className="p-3">Risk</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const loss =
                  row.delayDays * row.costPerDay;

                return (
                  <tr
                    key={index}
                    className="border-b border-white/5"
                  >
                    <td className="p-3">
                      <input
                        value={row.department}
                        onChange={(e) =>
                          updateRow(
                            index,
                            "department",
                            e.target.value
                          )
                        }
                        className="rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        value={row.bottleneck}
                        onChange={(e) =>
                          updateRow(
                            index,
                            "bottleneck",
                            e.target.value
                          )
                        }
                        className="rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.delayDays}
                        onChange={(e) =>
                          updateRow(
                            index,
                            "delayDays",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.affectedOrders}
                        onChange={(e) =>
                          updateRow(
                            index,
                            "affectedOrders",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={row.costPerDay}
                        onChange={(e) =>
                          updateRow(
                            index,
                            "costPerDay",
                            Number(e.target.value)
                          )
                        }
                        className="w-28 rounded-lg bg-slate-950 p-2"
                      />
                    </td>

                    <td className="p-3 font-bold text-yellow-300">
                      ${loss}
                    </td>

                    <td className="p-3">
                      {getRiskLevel(loss)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            {t.ai}
          </h2>

          <p className="mt-4 text-slate-200">
            {highestRisk
              ? `Highest financial impact detected in "${highestRisk.bottleneck}". Review root cause, assign ownership and prepare immediate recovery action.`
              : "-"}
          </p>
        </section>
      </div>
    </main>
  );
}

function KPI({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}