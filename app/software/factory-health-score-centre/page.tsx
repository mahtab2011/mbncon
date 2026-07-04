"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

type HealthInput = {
  production: number;
  quality: number;
  inventory: number;
  shipment: number;
  workforce: number;
  finance: number;
};

export default function FactoryHealthScoreCentre() {
  const [lang, setLang] = useState<Lang>("en");

  const [scores, setScores] = useState<HealthInput>({
    production: 84,
    quality: 76,
    inventory: 71,
    shipment: 90,
    workforce: 82,
    finance: 79,
  });

  const overallScore = useMemo(() => {
    const values = Object.values(scores);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [scores]);

  const healthZone = useMemo(() => {
    if (overallScore >= 90) return "WORLD CLASS";
    if (overallScore >= 80) return "STRONG";
    if (overallScore >= 70) return "STABLE";
    if (overallScore >= 60) return "WARNING";
    return "CRITICAL";
  }, [overallScore]);

  const weakestArea = useMemo(() => {
    return Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
  }, [scores]);

  const t = {
    en: {
      title: "Factory Health Score Centre",
      subtitle:
        "Unified operational, quality, inventory, shipment, workforce and financial health scoring system",
      overall: "Overall Factory Health Score",
      zone: "Health Zone",
      weakest: "Weakest Area",
      production: "Production Health",
      quality: "Quality Health",
      inventory: "Inventory Health",
      shipment: "Shipment Health",
      workforce: "Workforce Health",
      finance: "Financial Health",
      ai: "AI Executive Recommendation",
    },
    bn: {
      title: "কারখানা স্বাস্থ্য সূচক কেন্দ্র",
      subtitle:
        "উৎপাদন, মান, ইনভেন্টরি, শিপমেন্ট, কর্মী ও আর্থিক স্বাস্থ্য স্কোরিং সিস্টেম",
      overall: "সামগ্রিক কারখানা স্বাস্থ্য স্কোর",
      zone: "স্বাস্থ্য অবস্থা",
      weakest: "সবচেয়ে দুর্বল ক্ষেত্র",
      production: "উৎপাদন স্বাস্থ্য",
      quality: "মান স্বাস্থ্য",
      inventory: "ইনভেন্টরি স্বাস্থ্য",
      shipment: "শিপমেন্ট স্বাস্থ্য",
      workforce: "কর্মী স্বাস্থ্য",
      finance: "আর্থিক স্বাস্থ্য",
      ai: "AI নির্বাহী সুপারিশ",
    },
  }[lang];

  function updateScore(field: keyof HealthInput, value: number) {
    const safeValue = Math.max(0, Math.min(100, value));

    setScores((current) => ({
      ...current,
      [field]: safeValue,
    }));
  }

  function getLabel(key: string) {
    const labels: Record<string, string> = {
      production: t.production,
      quality: t.quality,
      inventory: t.inventory,
      shipment: t.shipment,
      workforce: t.workforce,
      finance: t.finance,
    };

    return labels[key] || key;
  }

  function getZoneColor() {
    if (overallScore >= 90) return "text-emerald-300";
    if (overallScore >= 80) return "text-cyan-300";
    if (overallScore >= 70) return "text-yellow-300";
    if (overallScore >= 60) return "text-orange-300";
    return "text-red-300";
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">{t.title}</h1>
            <p className="mt-3 max-w-4xl text-cyan-300">{t.subtitle}</p>
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

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="text-sm text-slate-300">{t.overall}</p>
            <p className="mt-3 text-6xl font-black text-cyan-300">
              {overallScore.toFixed(0)}
            </p>
            <p className="mt-2 text-sm text-slate-400">/ 100</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-300">{t.zone}</p>
            <p className={`mt-3 text-4xl font-black ${getZoneColor()}`}>
              {healthZone}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-300">{t.weakest}</p>
            <p className="mt-3 text-3xl font-black text-red-300">
              {getLabel(weakestArea[0])}
            </p>
            <p className="mt-2 text-slate-400">{weakestArea[1]} / 100</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(scores) as [keyof HealthInput, number][]).map(
            ([key, value]) => (
              <div
                key={key}
                className="rounded-3xl border border-white/10 bg-slate-900 p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-cyan-200">
                    {getLabel(key)}
                  </h2>

                  <span className="text-2xl font-black">{value}</span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(event) =>
                    updateScore(key, Number(event.target.value))
                  }
                  className="mt-5 w-full"
                />

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(event) =>
                    updateScore(key, Number(event.target.value))
                  }
                  className="mt-4 w-full rounded-xl bg-slate-950 p-3 text-white"
                />
              </div>
            )
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-bold text-cyan-300">{t.ai}</h2>

          <p className="mt-4 text-slate-200">
            {lang === "en"
              ? `${getLabel(
                  weakestArea[0]
                )} is currently pulling down the overall factory health score. Management should review root causes, assign ownership and prepare a short-term recovery action plan.`
              : `${getLabel(
                  weakestArea[0]
                )} বর্তমানে সামগ্রিক কারখানা স্বাস্থ্য স্কোর কমিয়ে দিচ্ছে। ব্যবস্থাপনাকে মূল কারণ পর্যালোচনা করে দায়িত্ব নির্ধারণ এবং স্বল্পমেয়াদী রিকভারি অ্যাকশন প্ল্যান তৈরি করতে হবে।`}
          </p>
        </section>
      </div>
    </main>
  );
}