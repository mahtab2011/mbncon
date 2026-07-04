"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function ExecutiveDecisionBrainCentre() {
  const [lang, setLang] = useState<Lang>("en");

  const [factoryHealth] = useState(68);
  const [buyerRisk] = useState(72);
  const [supplierRisk] = useState(58);
  const [shipmentRisk] = useState(81);
  const [inventoryRisk] = useState(55);
  const [qualityRisk] = useState(47);

  const overallRisk = useMemo(() => {
    return Math.round(
      (
        buyerRisk +
        supplierRisk +
        shipmentRisk +
        inventoryRisk +
        qualityRisk
      ) / 5
    );
  }, [
    buyerRisk,
    supplierRisk,
    shipmentRisk,
    inventoryRisk,
    qualityRisk,
  ]);

  const decision =
    overallRisk >= 75
      ? "EXECUTIVE INTERVENTION REQUIRED"
      : overallRisk >= 60
      ? "MONITOR CLOSELY"
      : "NORMAL OPERATION";

  const estimatedLoss = overallRisk * 1500;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">

        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-black text-cyan-300">
              {lang === "en"
                ? "Executive Decision Brain Centre"
                : "এক্সিকিউটিভ ডিসিশন ব্রেইন সেন্টার"}
            </h1>

            <p className="mt-3 text-slate-300">
              {lang === "en"
                ? "AI assisted strategic decision support platform"
                : "এআই সহায়তায় কৌশলগত সিদ্ধান্ত গ্রহণ প্ল্যাটফর্ম"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-black"
            >
              EN
            </button>

            <button
              onClick={() => setLang("bn")}
              className="rounded-xl bg-slate-800 px-4 py-2"
            >
              বাংলা
            </button>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl bg-cyan-400/10 p-6">
            <p>
              {lang === "en"
                ? "Factory Health"
                : "ফ্যাক্টরি হেলথ"}
            </p>

            <p className="mt-3 text-5xl font-black text-cyan-300">
              {factoryHealth}
            </p>
          </div>

          <div className="rounded-3xl bg-red-400/10 p-6">
            <p>
              {lang === "en"
                ? "Overall Risk"
                : "সামগ্রিক ঝুঁকি"}
            </p>

            <p className="mt-3 text-5xl font-black text-red-300">
              {overallRisk}
            </p>
          </div>

          <div className="rounded-3xl bg-yellow-400/10 p-6">
            <p>
              {lang === "en"
                ? "Estimated Loss"
                : "আনুমানিক ক্ষতি"}
            </p>

            <p className="mt-3 text-3xl font-black text-yellow-300">
              ${estimatedLoss.toLocaleString()}
            </p>
          </div>

          <div className="rounded-3xl bg-emerald-400/10 p-6">
            <p>
              {lang === "en"
                ? "Decision Status"
                : "সিদ্ধান্ত অবস্থা"}
            </p>

            <p className="mt-3 text-xl font-black text-emerald-300">
              {decision}
            </p>
          </div>

        </section>

        <section className="mt-10 rounded-3xl bg-white/5 p-8">

          <h2 className="text-2xl font-bold text-cyan-300">
            {lang === "en"
              ? "Executive Risk Dashboard"
              : "এক্সিকিউটিভ রিস্ক ড্যাশবোর্ড"}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-5">

            {[
              ["Buyer Risk", buyerRisk],
              ["Supplier Risk", supplierRisk],
              ["Shipment Risk", shipmentRisk],
              ["Inventory Risk", inventoryRisk],
              ["Quality Risk", qualityRisk],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl bg-slate-900 p-5"
              >
                <p>{label}</p>

                <p className="mt-3 text-3xl font-bold text-cyan-300">
                  {value}
                </p>
              </div>
            ))}

          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">

          <h2 className="text-2xl font-bold text-cyan-300">
            {lang === "en"
              ? "AI Recommended Actions"
              : "এআই সুপারিশ"}
          </h2>

          <ul className="mt-6 space-y-4 text-slate-200">

            <li>
              • Review high-risk buyers before accepting rush orders
            </li>

            <li>
              • Escalate shipment delay exposure immediately
            </li>

            <li>
              • Reduce inventory holding period
            </li>

            <li>
              • Improve supplier delivery consistency
            </li>

            <li>
              • Launch corrective action for recurring quality defects
            </li>

          </ul>

        </section>

      </div>
    </main>
  );
}