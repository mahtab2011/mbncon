"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function LeanBottleneckAIPredictor() {
  const [lang, setLang] = useState<Lang>("en");

  const [lineEfficiency, setLineEfficiency] = useState(75);
  const [wipLevel, setWipLevel] = useState(1200);
  const [machineDowntime, setMachineDowntime] = useState(8);
  const [materialDelay, setMaterialDelay] = useState(4);
  const [reworkRate, setReworkRate] = useState(6);
  const [shipmentDaysLeft, setShipmentDaysLeft] = useState(18);

  const bottleneckScore = useMemo(() => {
    let score = 0;

    if (lineEfficiency < 80) score += 25;
    if (wipLevel > 1000) score += 20;
    if (machineDowntime > 5) score += 20;
    if (materialDelay > 3) score += 15;
    if (reworkRate > 5) score += 10;
    if (shipmentDaysLeft < 20) score += 10;

    return Math.min(score, 100);
  }, [
    lineEfficiency,
    wipLevel,
    machineDowntime,
    materialDelay,
    reworkRate,
    shipmentDaysLeft,
  ]);

  const risk =
    bottleneckScore >= 75
      ? "CRITICAL"
      : bottleneckScore >= 50
      ? "HIGH"
      : bottleneckScore >= 25
      ? "MEDIUM"
      : "LOW";

  const financialImpact = bottleneckScore * 500;

  const t =
    lang === "en"
      ? {
          title: "Lean Bottleneck AI Predictor",
          subtitle:
            "Predict bottlenecks before they disrupt production",
          score: "Bottleneck Score",
          impact: "Estimated Financial Impact",
          ai: "AI Recommendation",
        }
      : {
          title: "লিন বটলনেক AI পূর্বাভাস কেন্দ্র",
          subtitle:
            "উৎপাদন ব্যাহত হওয়ার আগেই বটলনেক শনাক্ত করুন",
          score: "বটলনেক স্কোর",
          impact: "আনুমানিক আর্থিক প্রভাব",
          ai: "AI সুপারিশ",
        };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="flex justify-between">
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

        <section className="mt-8 grid gap-4 md:grid-cols-3">

          <InputCard
            label="Line Efficiency %"
            value={lineEfficiency}
            setValue={setLineEfficiency}
          />

          <InputCard
            label="WIP Level"
            value={wipLevel}
            setValue={setWipLevel}
          />

          <InputCard
            label="Machine Downtime (Hours)"
            value={machineDowntime}
            setValue={setMachineDowntime}
          />

          <InputCard
            label="Material Delay (Days)"
            value={materialDelay}
            setValue={setMaterialDelay}
          />

          <InputCard
            label="Rework Rate %"
            value={reworkRate}
            setValue={setReworkRate}
          />

          <InputCard
            label="Shipment Days Left"
            value={shipmentDaysLeft}
            setValue={setShipmentDaysLeft}
          />

        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <p>{t.score}</p>

            <p className="mt-3 text-5xl font-black text-red-300">
              {bottleneckScore}
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Risk Level</p>

            <p className="mt-3 text-3xl font-black">
              {risk}
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>{t.impact}</p>

            <p className="mt-3 text-3xl font-black text-yellow-300">
              ${financialImpact.toLocaleString()}
            </p>
          </div>

        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">

          <h2 className="text-2xl font-bold text-cyan-300">
            {t.ai}
          </h2>

          <p className="mt-4 leading-8 text-slate-200">
            {lang === "en"
              ? `Current bottleneck score is ${bottleneckScore}. Priority attention should be given to line efficiency, machine downtime, material availability and rework reduction to prevent shipment delays.`
              : `বর্তমান বটলনেক স্কোর ${bottleneckScore}। শিপমেন্ট বিলম্ব রোধে লাইন দক্ষতা, মেশিন ডাউনটাইম, উপকরণ প্রাপ্যতা এবং রিওয়ার্ক কমানোর উপর অগ্রাধিকার ভিত্তিতে কাজ করা উচিত।`}
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
    <div className="rounded-2xl bg-white/5 p-5">
      <p>{label}</p>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
        className="mt-3 w-full rounded-xl bg-slate-900 p-3"
      />
    </div>
  );
}