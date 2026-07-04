"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function CuttingIntelligenceCentre() {
  const [lang, setLang] = useState<Lang>("en");

  const [fabricOrdered, setFabricOrdered] = useState(10000);
  const [fabricConsumed, setFabricConsumed] = useState(9200);
  const [markerEfficiencyTarget] = useState(90);

  const fabricBalance = useMemo(
    () => fabricOrdered - fabricConsumed,
    [fabricOrdered, fabricConsumed]
  );

  const utilization = useMemo(() => {
    if (fabricOrdered === 0) return 0;
    return (fabricConsumed / fabricOrdered) * 100;
  }, [fabricOrdered, fabricConsumed]);

  const wastePercent = useMemo(() => {
    if (fabricOrdered === 0) return 0;
    return (fabricBalance / fabricOrdered) * 100;
  }, [fabricOrdered, fabricBalance]);

  const markerEfficiency = useMemo(() => {
    return 100 - wastePercent;
  }, [wastePercent]);

  const potentialSaving = useMemo(() => {
    const gap = markerEfficiencyTarget - markerEfficiency;
    if (gap <= 0) return 0;
    return (gap / 100) * fabricOrdered;
  }, [markerEfficiency, markerEfficiencyTarget, fabricOrdered]);

  const t = {
    en: {
      title: "Cutting Intelligence Centre",
      subtitle:
        "Fabric optimization, marker efficiency and waste reduction system",
      ordered: "Fabric Ordered",
      consumed: "Fabric Consumed",
      balance: "Fabric Balance",
      utilization: "Utilization %",
      waste: "Waste %",
      efficiency: "Marker Efficiency",
      target: "Target Efficiency",
      saving: "Potential Fabric Saving",
      ai: "AI Insight",
    },
    bn: {
      title: "কাটিং ইন্টেলিজেন্স সেন্টার",
      subtitle:
        "ফ্যাব্রিক অপটিমাইজেশন, মার্কার দক্ষতা ও অপচয় বিশ্লেষণ সিস্টেম",
      ordered: "অর্ডারকৃত ফ্যাব্রিক",
      consumed: "ব্যবহৃত ফ্যাব্রিক",
      balance: "অবশিষ্ট ফ্যাব্রিক",
      utilization: "ব্যবহার %",
      waste: "অপচয় %",
      efficiency: "মার্কার দক্ষতা",
      target: "লক্ষ্য দক্ষতা",
      saving: "সম্ভাব্য সাশ্রয়",
      ai: "AI বিশ্লেষণ",
    },
  }[lang];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black">{t.title}</h1>
            <p className="text-cyan-300 mt-2">{t.subtitle}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-2 rounded-xl ${
                lang === "en" ? "bg-cyan-400 text-black" : "bg-slate-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("bn")}
              className={`px-4 py-2 rounded-xl ${
                lang === "bn" ? "bg-cyan-400 text-black" : "bg-slate-800"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Inputs */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-slate-300">{t.ordered}</p>
            <input
              type="number"
              value={fabricOrdered}
              onChange={(e) => setFabricOrdered(Number(e.target.value))}
              className="mt-2 w-full p-3 rounded-xl bg-slate-900"
            />
          </div>

          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-slate-300">{t.consumed}</p>
            <input
              type="number"
              value={fabricConsumed}
              onChange={(e) => setFabricConsumed(Number(e.target.value))}
              className="mt-2 w-full p-3 rounded-xl bg-slate-900"
            />
          </div>

          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-slate-300">{t.target}</p>
            <h2 className="text-3xl font-bold text-cyan-300">
              {markerEfficiencyTarget}%
            </h2>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mt-8 grid md:grid-cols-4 gap-4">
          <KPI title={t.balance} value={fabricBalance} />
          <KPI title={t.utilization} value={utilization.toFixed(2) + "%"} />
          <KPI title={t.waste} value={wastePercent.toFixed(2) + "%"} />
          <KPI
            title={t.efficiency}
            value={markerEfficiency.toFixed(2) + "%"}
          />
        </section>

        {/* Saving */}
        <section className="mt-8 bg-cyan-400/10 border border-cyan-400/20 p-6 rounded-3xl">
          <h2 className="text-xl font-bold text-cyan-300">{t.saving}</h2>

          <p className="mt-3 text-3xl font-black">
            {potentialSaving.toFixed(2)} units
          </p>

          <p className="mt-2 text-slate-300 text-sm">
            Based on gap between current efficiency and target efficiency.
          </p>
        </section>

        {/* AI Insight */}
        <section className="mt-8 bg-white/5 p-6 rounded-3xl">
          <h2 className="text-xl font-bold text-cyan-300">{t.ai}</h2>

          <p className="mt-3 text-slate-300">
            {markerEfficiency < markerEfficiencyTarget
              ? lang === "en"
                ? "Marker efficiency is below target. Recommend re-planning marker layout and reviewing fabric utilization strategy."
                : "মার্কার দক্ষতা লক্ষ্যমাত্রার নিচে। মার্কার প্ল্যান পুনর্বিন্যাস এবং ফ্যাব্রিক ব্যবহার কৌশল পর্যালোচনা করুন।"
              : lang === "en"
              ? "Marker efficiency is within target range. Maintain current cutting standard."
              : "মার্কার দক্ষতা লক্ষ্যমাত্রার মধ্যে রয়েছে। বর্তমান কাটিং মান বজায় রাখুন।"}
          </p>
        </section>
      </div>
    </main>
  );
}

function KPI({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}