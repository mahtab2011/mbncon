"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Lang = "en" | "bn";

export default function ExecutiveCommandWarRoom() {
  const [lang, setLang] = useState<Lang>("en");

  // --- Core Inputs ---
  const [supplierRisk] = useState(65);
  const [buyerRisk] = useState(70);
  const [bottleneckRisk] = useState(55);
  const [dhuRisk] = useState(40);
  const [inventoryRisk] = useState(60);
  const [shipmentRisk] = useState(75);

  // --- Factory Health Score ---
  const factoryHealth = useMemo(() => {
    const avg =
      (100 -
        (supplierRisk +
          buyerRisk +
          bottleneckRisk +
          dhuRisk +
          inventoryRisk +
          shipmentRisk) /
          6);

    return Math.max(0, Math.min(100, Math.round(avg)));
  }, [
    supplierRisk,
    buyerRisk,
    bottleneckRisk,
    dhuRisk,
    inventoryRisk,
    shipmentRisk,
  ]);

  const riskLevel =
    factoryHealth >= 75
      ? "STABLE"
      : factoryHealth >= 50
      ? "WARNING"
      : "CRITICAL";

  const financialLoss = (100 - factoryHealth) * 1200;

  const t =
    lang === "en"
      ? {
          title: "Executive Command War Room",
          subtitle: "Real-time factory intelligence control center",
          health: "Factory Health Score",
          risk: "Risk Level",
          loss: "Estimated Financial Exposure",
          ai: "AI Executive Directive",
        }
      : {
          title: "এক্সিকিউটিভ কমান্ড ওয়ার রুম",
          subtitle: "রিয়েল-টাইম ফ্যাক্টরি ইন্টেলিজেন্স কন্ট্রোল সেন্টার",
          health: "ফ্যাক্টরি হেলথ স্কোর",
          risk: "ঝুঁকির স্তর",
          loss: "আনুমানিক আর্থিক ক্ষতি",
          ai: "AI এক্সিকিউটিভ নির্দেশনা",
        };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-cyan-300">
              {t.title}
            </h1>
            <p className="mt-2 text-slate-300">{t.subtitle}</p>
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
              className="rounded-xl bg-slate-800 px-4 py-2 font-bold"
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* BACK */}
        <div className="mt-6">
          <Link
            href="/software"
            className="text-sm text-cyan-300 hover:text-cyan-100"
          >
            ← Back to Software Centre
          </Link>
        </div>

        {/* SCORE GRID */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-cyan-400/10 border border-cyan-400/20 p-6">
            <p className="text-sm">{t.health}</p>
            <p className="text-5xl font-black text-cyan-300 mt-3">
              {factoryHealth}
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p className="text-sm">{t.risk}</p>
            <p className="text-3xl font-black mt-3">
              {riskLevel}
            </p>
          </div>

          <div className="rounded-3xl bg-red-400/10 border border-red-400/20 p-6">
            <p className="text-sm">{t.loss}</p>
            <p className="text-3xl font-black text-red-300 mt-3">
              ${financialLoss.toLocaleString()}
            </p>
          </div>

        </section>

        {/* RISK BREAKDOWN */}
        <section className="mt-10 rounded-3xl bg-white/5 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Risk Breakdown
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { label: "Supplier Risk", value: supplierRisk },
              { label: "Buyer Risk", value: buyerRisk },
              { label: "Bottleneck Risk", value: bottleneckRisk },
              { label: "DHU Quality Risk", value: dhuRisk },
              { label: "Inventory Risk", value: inventoryRisk },
              { label: "Shipment Risk", value: shipmentRisk },
            ].map((r) => (
              <div
                key={r.label}
                className="rounded-2xl bg-slate-900 p-4"
              >
                <p>{r.label}</p>
                <p className="text-2xl font-bold text-yellow-300">
                  {r.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AI DECISION ENGINE */}
        <section className="mt-10 rounded-3xl bg-cyan-400/10 border border-cyan-400/20 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            {t.ai}
          </h2>

          <p className="mt-4 leading-8 text-slate-200">
            {lang === "en"
              ? factoryHealth < 50
                ? "CRITICAL ALERT: Immediate executive intervention required. Review production load, supplier delays, and shipment risk before further orders."
                : factoryHealth < 75
                ? "WARNING: System under pressure. Optimize bottlenecks, reduce WIP, and improve supplier coordination."
                : "SYSTEM STABLE: Maintain current flow. Focus on incremental efficiency improvement."
              : factoryHealth < 50
              ? "গুরুত্বপূর্ণ সতর্কতা: অবিলম্বে ব্যবস্থাপনা হস্তক্ষেপ প্রয়োজন।"
              : factoryHealth < 75
              ? "সতর্কতা: সিস্টেম চাপের মধ্যে। অপারেশন অপ্টিমাইজ করুন।"
              : "সিস্টেম স্থিতিশীল। বর্তমান অপারেশন বজায় রাখুন।"}
          </p>
        </section>

      </div>
    </main>
  );
}