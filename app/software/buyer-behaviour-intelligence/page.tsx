"use client";

import Link from "next/link";

const buyerSignals = [
  "Order history and repeat pattern",
  "Buyer communication behaviour",
  "Complaint frequency",
  "Claim probability",
  "Payment behaviour",
  "Price sensitivity",
  "Quality expectation level",
  "Delivery expectation level",
  "Future order potential",
  "Relationship risk",
];

const buyerTypes = [
  {
    type: "High Potential Buyer",
    insight: "Strong repeat potential, stable communication, low complaint risk.",
  },
  {
    type: "Sensitive Buyer",
    insight: "Needs close quality, delivery, and communication follow-up.",
  },
  {
    type: "Risk Buyer",
    insight: "Higher complaint, claim, late payment, or cancellation probability.",
  },
  {
    type: "Strategic Buyer",
    insight: "Can become long-term partner with strong account management.",
  },
];

export default function BuyerBehaviourIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-300">
            MBNCON Buyer Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Buyer Behaviour Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Analyse buyer behaviour, complaint trends, claim probability,
            payment discipline, communication style, repeat order potential,
            relationship risk, and future business opportunity.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Repeat Potential", "High"],
            ["Complaint Risk", "Monitored"],
            ["Claim Probability", "Measured"],
            ["Future Opportunity", "Strong"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-pink-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Buyer Behaviour Signals</h2>

            <div className="mt-6 space-y-3">
              {buyerSignals.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-400 font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Buyer Classification</h2>

            <div className="mt-6 space-y-4">
              {buyerTypes.map((buyer) => (
                <div
                  key={buyer.type}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-bold text-pink-200">
                    {buyer.type}
                  </h3>

                  <p className="mt-2 text-sm text-slate-300">
                    {buyer.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-pink-400/30 bg-pink-400/10 p-8">
          <h2 className="text-2xl font-bold text-pink-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories and business teams understand which
            buyers are profitable, which buyers need careful follow-up, which
            buyers may create future claim risk, and which buyers can become
            long-term strategic customers.
          </p>
        </section>
      </section>
    </main>
  );
}