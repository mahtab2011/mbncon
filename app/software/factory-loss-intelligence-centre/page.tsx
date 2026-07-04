"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function FactoryLossIntelligenceCentre() {
  const [lang, setLang] = useState<Lang>("en");

  const [dhuLoss, setDhuLoss] = useState(12000);
  const [reworkLoss, setReworkLoss] = useState(8000);
  const [idleManpowerLoss, setIdleManpowerLoss] = useState(6000);
  const [inventoryLoss, setInventoryLoss] = useState(15000);
  const [airShipmentLoss, setAirShipmentLoss] = useState(18000);
  const [utilityLoss, setUtilityLoss] = useState(5000);

  const totalLoss = useMemo(() => {
    return (
      dhuLoss +
      reworkLoss +
      idleManpowerLoss +
      inventoryLoss +
      airShipmentLoss +
      utilityLoss
    );
  }, [
    dhuLoss,
    reworkLoss,
    idleManpowerLoss,
    inventoryLoss,
    airShipmentLoss,
    utilityLoss,
  ]);

  const t =
    lang === "en"
      ? {
          title: "Factory Loss Intelligence Centre",
          subtitle:
            "AI-driven hidden cost and profit leakage analysis",
          total: "Total Estimated Loss",
          recommendation: "AI Recommendation",
        }
      : {
          title: "কারখানা ক্ষতি বিশ্লেষণ কেন্দ্র",
          subtitle:
            "AI-চালিত লুকানো খরচ ও মুনাফা ক্ষয় বিশ্লেষণ",
          total: "মোট আনুমানিক ক্ষতি",
          recommendation: "AI সুপারিশ",
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

          <LossCard
            title="DHU Loss"
            value={dhuLoss}
            setValue={setDhuLoss}
          />

          <LossCard
            title="Rework Loss"
            value={reworkLoss}
            setValue={setReworkLoss}
          />

          <LossCard
            title="Idle Manpower Loss"
            value={idleManpowerLoss}
            setValue={setIdleManpowerLoss}
          />

          <LossCard
            title="Inventory Carrying Cost"
            value={inventoryLoss}
            setValue={setInventoryLoss}
          />

          <LossCard
            title="Air Shipment Loss"
            value={airShipmentLoss}
            setValue={setAirShipmentLoss}
          />

          <LossCard
            title="Utility Waste"
            value={utilityLoss}
            setValue={setUtilityLoss}
          />

        </section>

        <section className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-8">

          <p className="text-sm uppercase tracking-widest text-red-300">
            {t.total}
          </p>

          <p className="mt-4 text-6xl font-black text-red-300">
            ${totalLoss.toLocaleString()}
          </p>

        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">

          <h2 className="text-2xl font-bold text-cyan-300">
            {t.recommendation}
          </h2>

          <p className="mt-4 leading-8 text-slate-200">
            {lang === "en"
              ? `Current estimated loss is $${totalLoss.toLocaleString()}. Focus on DHU reduction, inventory optimisation, air shipment prevention and manpower utilisation improvement.`
              : `বর্তমান আনুমানিক ক্ষতি $${totalLoss.toLocaleString()}। DHU হ্রাস, মজুদ অপ্টিমাইজেশন, এয়ার শিপমেন্ট নিয়ন্ত্রণ এবং জনবল ব্যবহার উন্নত করার উপর গুরুত্ব দেওয়া উচিত।`}
          </p>

        </section>

      </div>
    </main>
  );
}

function LossCard({
  title,
  value,
  setValue,
}: {
  title: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-6">
      <p>{title}</p>

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