"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "bn";

export default function BuyerProfitabilityIntelligencePage() {
  const [lang, setLang] = useState<Lang>("en");

  const [buyerName, setBuyerName] = useState("ZARA");
  const [annualRevenue, setAnnualRevenue] = useState(12000000);
  const [grossMargin, setGrossMargin] = useState(14);
  const [lateChanges, setLateChanges] = useState(12);
  const [airShipments, setAirShipments] = useState(4);
  const [paymentDelayDays, setPaymentDelayDays] = useState(25);

  const profitabilityScore = useMemo(() => {
    let score = grossMargin * 5;

    score -= lateChanges;
    score -= airShipments * 3;
    score -= paymentDelayDays / 2;

    return Math.max(0, Math.min(100, score));
  }, [
    grossMargin,
    lateChanges,
    airShipments,
    paymentDelayDays,
  ]);

  const rating =
    profitabilityScore >= 80
      ? "Excellent"
      : profitabilityScore >= 60
      ? "Good"
      : profitabilityScore >= 40
      ? "Watch"
      : "High Risk";

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-black">
              {lang === "en"
                ? "Buyer Profitability Intelligence"
                : "ক্রেতা লাভজনকতা বিশ্লেষণ"}
            </h1>

            <p className="mt-3 text-cyan-300">
              {lang === "en"
                ? "Revenue, margin, risk and hidden cost visibility"
                : "রাজস্ব, মুনাফা, ঝুঁকি ও লুকানো খরচ বিশ্লেষণ"}
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

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Buyer</p>
            <input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="mt-3 w-full rounded-xl bg-slate-900 p-3"
            />
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Annual Revenue ($)</p>
            <input
              type="number"
              value={annualRevenue}
              onChange={(e) =>
                setAnnualRevenue(Number(e.target.value))
              }
              className="mt-3 w-full rounded-xl bg-slate-900 p-3"
            />
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Gross Margin %</p>
            <input
              type="number"
              value={grossMargin}
              onChange={(e) =>
                setGrossMargin(Number(e.target.value))
              }
              className="mt-3 w-full rounded-xl bg-slate-900 p-3"
            />
          </div>

        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Late Changes</p>
            <input
              type="number"
              value={lateChanges}
              onChange={(e) =>
                setLateChanges(Number(e.target.value))
              }
              className="mt-3 w-full rounded-xl bg-slate-900 p-3"
            />
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Air Shipments</p>
            <input
              type="number"
              value={airShipments}
              onChange={(e) =>
                setAirShipments(Number(e.target.value))
              }
              className="mt-3 w-full rounded-xl bg-slate-900 p-3"
            />
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Payment Delay Days</p>
            <input
              type="number"
              value={paymentDelayDays}
              onChange={(e) =>
                setPaymentDelayDays(Number(e.target.value))
              }
              className="mt-3 w-full rounded-xl bg-slate-900 p-3"
            />
          </div>

        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
            <p>Profitability Score</p>

            <p className="mt-3 text-5xl font-black text-cyan-300">
              {profitabilityScore.toFixed(0)}
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Buyer Rating</p>

            <p className="mt-3 text-3xl font-black">
              {rating}
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-6">
            <p>Revenue</p>

            <p className="mt-3 text-3xl font-black">
              ${annualRevenue.toLocaleString()}
            </p>
          </div>

        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            AI Recommendation
          </h2>

          <p className="mt-4 leading-8 text-slate-200">
            Buyer {buyerName} currently has a profitability score of{" "}
            {profitabilityScore.toFixed(0)}.
            Management should review pricing, payment terms,
            style changes, air shipment history and dependency
            before increasing business volume.
          </p>
        </section>

      </div>
    </main>
  );
}