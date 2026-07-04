"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function ProductionPlanningCommandCentre() {
  const [lang, setLang] = useState<Lang>("en");

  // Core Inputs
  const [orderQty, setOrderQty] = useState(50000);
  const [factoryCapacity, setFactoryCapacity] = useState(45000);
  const [materialDelayDays, setMaterialDelayDays] = useState(5);
  const [lineEfficiency, setLineEfficiency] = useState(78);
  const [reworkRate, setReworkRate] = useState(6);
  const [shipmentDaysLeft, setShipmentDaysLeft] = useState(20);

  // Production Pressure Score
  const productionRisk = useMemo(() => {
    let score = 0;

    if (orderQty > factoryCapacity) score += 30;
    if (materialDelayDays > 3) score += 25;
    if (lineEfficiency < 80) score += 20;
    if (reworkRate > 5) score += 15;
    if (shipmentDaysLeft < 25) score += 10;

    return Math.min(100, score);
  }, [
    orderQty,
    factoryCapacity,
    materialDelayDays,
    lineEfficiency,
    reworkRate,
    shipmentDaysLeft,
  ]);

  const status =
    productionRisk > 70
      ? "CRITICAL"
      : productionRisk > 40
      ? "RISK"
      : "STABLE";

  const t =
    lang === "en"
      ? {
          title: "Production Planning Command Centre",
          subtitle:
            "AI-driven production flow, bottleneck prevention and execution control",
          risk: "Production Risk Score",
          status: "Status",
          ai: "AI Recommendation",
        }
      : {
          title: "উৎপাদন পরিকল্পনা কমান্ড সেন্টার",
          subtitle:
            "AI-চালিত উৎপাদন প্রবাহ, বটলনেক প্রতিরোধ ও কার্যনির্বাহী নিয়ন্ত্রণ",
          risk: "উৎপাদন ঝুঁকি স্কোর",
          status: "অবস্থা",
          ai: "AI সুপারিশ",
        };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-black">{t.title}</h1>
            <p className="mt-3 text-cyan-300">{t.subtitle}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950"
            >
              EN
            </button>
            <button
              onClick={() => setLang("bn")}
              className="rounded-xl bg-slate-800 px-4 py-2 font-bold"
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Inputs */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">

          <Input label="Order Quantity" value={orderQty} setValue={setOrderQty} />
          <Input label="Factory Capacity" value={factoryCapacity} setValue={setFactoryCapacity} />
          <Input label="Material Delay (Days)" value={materialDelayDays} setValue={setMaterialDelayDays} />
          <Input label="Line Efficiency %" value={lineEfficiency} setValue={setLineEfficiency} />
          <Input label="Rework Rate %" value={reworkRate} setValue={setReworkRate} />
          <Input label="Shipment Days Left" value={shipmentDaysLeft} setValue={setShipmentDaysLeft} />

        </section>

        {/* KPI */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <p>{t.risk}</p>
            <p className="mt-3 text-5xl font-black text-red-300">
              {productionRisk}
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>{t.status}</p>
            <p className="mt-3 text-3xl font-black">{status}</p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Capacity Gap</p>
            <p className="mt-3 text-3xl font-black">
              {orderQty - factoryCapacity}
            </p>
          </div>

        </section>

        {/* AI Layer */}
        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">

          <h2 className="text-2xl font-bold text-cyan-300">
            {t.ai}
          </h2>

          <p className="mt-4 leading-8 text-slate-200">
            {lang === "en"
              ? `Production risk is ${productionRisk}/100. ${
                  status === "CRITICAL"
                    ? "Immediate intervention required: increase capacity, reduce rework, secure materials and reschedule shipment."
                    : status === "RISK"
                    ? "Monitor bottlenecks in material flow and line efficiency."
                    : "Production is stable but continuous monitoring required."
                }`
              : `উৎপাদন ঝুঁকি ${productionRisk}/100। ${
                  status === "CRITICAL"
                    ? "তাৎক্ষণিক ব্যবস্থা প্রয়োজন: ক্ষমতা বৃদ্ধি, রিওয়ার্ক কমানো, উপকরণ নিশ্চিতকরণ ও শিপমেন্ট পুনঃনির্ধারণ করুন।"
                    : status === "RISK"
                    ? "ম্যাটেরিয়াল ফ্লো ও লাইন দক্ষতা পর্যবেক্ষণ করুন।"
                    : "উৎপাদন স্থিতিশীল, তবে নিয়মিত পর্যবেক্ষণ প্রয়োজন।"
                }`}
          </p>

        </section>

      </div>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p>{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-3 w-full rounded-xl bg-slate-900 p-3"
      />
    </div>
  );
}