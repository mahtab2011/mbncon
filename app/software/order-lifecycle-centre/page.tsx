"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "bn";

export default function OrderLifecycleCentre() {
  const [lang, setLang] = useState<Lang>("en");

  const t = {
    en: {
      title: "Order Command Centre",
      subtitle:
        "End-to-end order lifecycle tracking from inquiry to shipment and payment",
      desc:
        "This module tracks every order movement across commercial, sourcing, production, shipment and finance with real-time risk visibility.",
      filters: "Filters",
      kpi1: "Active Orders",
      kpi2: "On Time",
      kpi3: "Delayed",
      kpi4: "Critical Risk",
      stage: "Order Stages",
    },
    bn: {
      title: "অর্ডার কমান্ড সেন্টার",
      subtitle:
        "ইনকোয়ারি থেকে শিপমেন্ট ও পেমেন্ট পর্যন্ত সম্পূর্ণ অর্ডার ট্র্যাকিং সিস্টেম",
      desc:
        "এই মডিউলটি প্রতিটি অর্ডারের কমার্শিয়াল, সোর্সিং, প্রোডাকশন, শিপমেন্ট এবং ফাইনান্স স্ট্যাটাস রিয়েল টাইমে ট্র্যাক করে।",
      filters: "ফিল্টার",
      kpi1: "সক্রিয় অর্ডার",
      kpi2: "সময়মতো",
      kpi3: "দেরি",
      kpi4: "ক্রিটিক্যাল ঝুঁকি",
      stage: "অর্ডার ধাপসমূহ",
    },
  }[lang];

  const orders = [
    {
      po: "PO-10021",
      buyer: "M&S",
      product: "Polo Shirt",
      status: "GREEN",
      risk: "LOW",
    },
    {
      po: "PO-20455",
      buyer: "Zara",
      product: "Jacket",
      status: "ORANGE",
      risk: "MEDIUM",
    },
    {
      po: "PO-30988",
      buyer: "Primark",
      product: "Trouser",
      status: "RED",
      risk: "HIGH",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black">{t.title}</h1>
            <p className="mt-2 text-cyan-300">{t.subtitle}</p>
          </div>

          {/* Language Switch */}
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

        <p className="mt-4 text-slate-300 max-w-4xl">{t.desc}</p>

        {/* KPIs */}
        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="bg-green-900 rounded-2xl p-5">
            <p>{t.kpi1}</p>
            <h2 className="text-3xl font-bold mt-2">128</h2>
          </div>

          <div className="bg-blue-900 rounded-2xl p-5">
            <p>{t.kpi2}</p>
            <h2 className="text-3xl font-bold mt-2">96</h2>
          </div>

          <div className="bg-yellow-900 rounded-2xl p-5">
            <p>{t.kpi3}</p>
            <h2 className="text-3xl font-bold mt-2">22</h2>
          </div>

          <div className="bg-red-900 rounded-2xl p-5">
            <p>{t.kpi4}</p>
            <h2 className="text-3xl font-bold mt-2">10</h2>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-cyan-300">{t.filters}</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <select className="bg-slate-950 p-3 rounded-xl">
              <option>{lang === "en" ? "All Buyers" : "সব ক্রেতা"}</option>
            </select>

            <select className="bg-slate-950 p-3 rounded-xl">
              <option>{lang === "en" ? "All Products" : "সব পণ্য"}</option>
            </select>

            <select className="bg-slate-950 p-3 rounded-xl">
              <option>{lang === "en" ? "Risk Level" : "ঝুঁকির স্তর"}</option>
            </select>

            <input type="date" className="bg-slate-950 p-3 rounded-xl" />
          </div>
        </section>

        {/* Order Table */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">{t.stage}</h2>

          <table className="w-full mt-6 text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3">PO</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Risk</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.po} className="border-b border-white/5">
                  <td className="p-3">{o.po}</td>
                  <td className="p-3">{o.buyer}</td>
                  <td className="p-3">{o.product}</td>
                  <td className="p-3">{o.risk}</td>
                  <td
                    className={`p-3 font-bold ${
                      o.status === "GREEN"
                        ? "text-green-400"
                        : o.status === "ORANGE"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {o.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* AI Insight */}
        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            AI Order Insight
          </h2>

          <p className="mt-3 text-slate-200">
            System identifies high-risk orders based on lead time, capacity,
            material delays and buyer behaviour. RED orders require executive
            intervention before confirmation.
          </p>
        </section>

      </div>
    </main>
  );
}