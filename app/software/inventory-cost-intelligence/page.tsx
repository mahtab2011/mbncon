"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function InventoryCostIntelligence() {
  const [lang, setLang] = useState<Lang>("en");

  const [rawMaterialValue, setRawMaterialValue] = useState(500000);
  const [wipValue, setWipValue] = useState(300000);
  const [finishedGoodsValue, setFinishedGoodsValue] = useState(200000);

  const [rawDays, setRawDays] = useState(12);
  const [wipDays, setWipDays] = useState(8);
  const [fgDays, setFgDays] = useState(10);

  const interestRate = 12; // yearly %

  const totalInventoryValue = useMemo(() => {
    return rawMaterialValue + wipValue + finishedGoodsValue;
  }, [rawMaterialValue, wipValue, finishedGoodsValue]);

  const avgInventoryDays = useMemo(() => {
    return (rawDays + wipDays + fgDays) / 3;
  }, [rawDays, wipDays, fgDays]);

  const dailyInterestCost = useMemo(() => {
    return (totalInventoryValue * (interestRate / 100)) / 365;
  }, [totalInventoryValue]);

  const totalHoldingCost = useMemo(() => {
    return dailyInterestCost * avgInventoryDays;
  }, [dailyInterestCost, avgInventoryDays]);

  const targetDays = 10;

  const excessDays = useMemo(() => {
    return Math.max(0, avgInventoryDays - targetDays);
  }, [avgInventoryDays]);

  const potentialSaving = useMemo(() => {
    return dailyInterestCost * excessDays;
  }, [dailyInterestCost, excessDays]);

  const t = {
    en: {
      title: "Inventory Cost Intelligence Centre",
      subtitle:
        "Working capital, holding cost and inventory optimization system",

      raw: "Raw Material Value",
      wip: "WIP Value",
      fg: "Finished Goods Value",

      rawDays: "Raw Material Days",
      wipDays: "WIP Days",
      fgDays: "Finished Goods Days",

      total: "Total Inventory Value",
      avgDays: "Average Inventory Days",

      interest: "Interest Cost (Daily)",
      holding: "Total Holding Cost",
      saving: "Potential Saving",
    },

    bn: {
      title: "ইনভেন্টরি খরচ বুদ্ধিমত্তা কেন্দ্র",
      subtitle:
        "ওয়ার্কিং ক্যাপিটাল, হোল্ডিং খরচ ও ইনভেন্টরি অপটিমাইজেশন সিস্টেম",

      raw: "কাঁচামাল মূল্য",
      wip: "চলমান উৎপাদন মূল্য",
      fg: "সমাপ্ত পণ্য মূল্য",

      rawDays: "কাঁচামাল দিনের সংখ্যা",
      wipDays: "চলমান উৎপাদন দিন",
      fgDays: "সমাপ্ত পণ্য দিন",

      total: "মোট ইনভেন্টরি মূল্য",
      avgDays: "গড় ইনভেন্টরি দিন",

      interest: "দৈনিক সুদের খরচ",
      holding: "মোট হোল্ডিং খরচ",
      saving: "সম্ভাব্য সাশ্রয়",
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
          <Input label={t.raw} value={rawMaterialValue} setValue={setRawMaterialValue} />
          <Input label={t.wip} value={wipValue} setValue={setWipValue} />
          <Input label={t.fg} value={finishedGoodsValue} setValue={setFinishedGoodsValue} />
        </section>

        {/* Days */}
        <section className="mt-6 grid md:grid-cols-3 gap-4">
          <Input label={t.rawDays} value={rawDays} setValue={setRawDays} />
          <Input label={t.wipDays} value={wipDays} setValue={setWipDays} />
          <Input label={t.fgDays} value={fgDays} setValue={setFgDays} />
        </section>

        {/* KPI */}
        <section className="mt-8 grid md:grid-cols-4 gap-4">
          <KPI title={t.total} value={totalInventoryValue} />
          <KPI title={t.avgDays} value={avgInventoryDays.toFixed(2)} />
          <KPI title={t.interest} value={dailyInterestCost.toFixed(2)} />
          <KPI title={t.holding} value={totalHoldingCost.toFixed(2)} />
        </section>

        {/* Saving */}
        <section className="mt-8 bg-cyan-400/10 border border-cyan-400/20 p-6 rounded-3xl">
          <h2 className="text-xl font-bold text-cyan-300">{t.saving}</h2>

          <p className="text-3xl font-black mt-3">
            {potentialSaving.toFixed(2)}
          </p>

          <p className="text-slate-300 mt-2 text-sm">
            Based on reducing inventory days below target ({targetDays} days).
          </p>
        </section>

      </div>
    </main>
  );
}

function KPI({ title, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl">
      <p className="text-slate-300">{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-2 w-full p-3 rounded-xl bg-slate-900"
      />
    </div>
  );
}