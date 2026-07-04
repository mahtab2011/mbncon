"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function OrderRiskIntelligencePage() {
  const [lang, setLang] = useState<Lang>("en");

  const [orderValue, setOrderValue] = useState(500000);
  const [leadTime, setLeadTime] = useState(60);
  const [capacityUtilization, setCapacityUtilization] = useState(75);
  const [profitMargin, setProfitMargin] = useState(12);
  const [buyerRisk, setBuyerRisk] = useState(20);

  const riskScore = useMemo(() => {
    let score = 0;

    if (leadTime < 45) score += 30;
    else if (leadTime < 60) score += 15;

    if (capacityUtilization > 90) score += 25;
    else if (capacityUtilization > 80) score += 15;

    if (profitMargin < 5) score += 25;
    else if (profitMargin < 10) score += 10;

    score += buyerRisk;

    return Math.min(score, 100);
  }, [
    leadTime,
    capacityUtilization,
    profitMargin,
    buyerRisk,
  ]);

  const riskLevel = useMemo(() => {
    if (riskScore >= 75) return "CRITICAL";
    if (riskScore >= 50) return "HIGH";
    if (riskScore >= 25) return "MEDIUM";
    return "LOW";
  }, [riskScore]);

  const t = {
    en: {
      title: "Order Risk Intelligence Centre",
      subtitle:
        "AI-powered order acceptance, profitability and lead-time risk analysis",

      orderValue: "Order Value ($)",
      leadTime: "Lead Time (Days)",
      capacity: "Capacity Utilization %",
      margin: "Profit Margin %",
      buyerRisk: "Buyer Risk Score",

      score: "Risk Score",
      level: "Risk Level",
      decision: "AI Decision",

      accept: "Accept Order",
      review: "Review Carefully",
      reject: "High Risk Order",

      ai: "AI Recommendation",
    },

    bn: {
      title: "অর্ডার ঝুঁকি বিশ্লেষণ কেন্দ্র",
      subtitle:
        "AI-চালিত অর্ডার গ্রহণ, মুনাফা ও লিড টাইম ঝুঁকি বিশ্লেষণ",

      orderValue: "অর্ডারের মূল্য ($)",
      leadTime: "লিড টাইম (দিন)",
      capacity: "ক্ষমতা ব্যবহার %",
      margin: "মুনাফা %",
      buyerRisk: "ক্রেতা ঝুঁকি স্কোর",

      score: "ঝুঁকি স্কোর",
      level: "ঝুঁকির মাত্রা",
      decision: "AI সিদ্ধান্ত",

      accept: "অর্ডার গ্রহণ করুন",
      review: "সতর্কভাবে পর্যালোচনা করুন",
      reject: "উচ্চ ঝুঁকিপূর্ণ অর্ডার",

      ai: "AI সুপারিশ",
    },
  }[lang];

  const decision =
    riskScore >= 75
      ? t.reject
      : riskScore >= 50
      ? t.review
      : t.accept;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <section className="flex justify-between">
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

        <section className="mt-8 grid gap-4 md:grid-cols-5">

          <InputCard
            label={t.orderValue}
            value={orderValue}
            setValue={setOrderValue}
          />

          <InputCard
            label={t.leadTime}
            value={leadTime}
            setValue={setLeadTime}
          />

          <InputCard
            label={t.capacity}
            value={capacityUtilization}
            setValue={setCapacityUtilization}
          />

          <InputCard
            label={t.margin}
            value={profitMargin}
            setValue={setProfitMargin}
          />

          <InputCard
            label={t.buyerRisk}
            value={buyerRisk}
            setValue={setBuyerRisk}
          />

        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p>{t.score}</p>

            <p className="mt-3 text-6xl font-black text-cyan-300">
              {riskScore}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p>{t.level}</p>

            <p className="mt-3 text-4xl font-black">
              {riskLevel}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p>{t.decision}</p>

            <p className="mt-3 text-3xl font-black text-yellow-300">
              {decision}
            </p>
          </div>

        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">

          <h2 className="text-xl font-bold text-cyan-300">
            {t.ai}
          </h2>

          <p className="mt-4 text-slate-200">
            {lang === "en"
              ? `Lead time ${leadTime} days, capacity utilization ${capacityUtilization}% and margin ${profitMargin}% indicate a ${riskLevel} risk profile. Management should verify capacity, cashflow, material availability and shipment feasibility before acceptance.`
              : `${leadTime} দিনের লিড টাইম, ${capacityUtilization}% ক্ষমতা ব্যবহার এবং ${profitMargin}% মুনাফা এই অর্ডারকে ${riskLevel} ঝুঁকির পর্যায়ে রাখছে। গ্রহণের আগে ক্ষমতা, নগদ প্রবাহ, উপকরণ ও শিপমেন্ট সক্ষমতা যাচাই করা উচিত।`}
          </p>

        </section>

      </div>
    </main>
  );
}

function InputCard({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
        className="mt-3 w-full rounded-xl bg-slate-950 p-3 text-white"
      />
    </div>
  );
}