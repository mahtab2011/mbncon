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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSignalRecommendation(signal: string) {
  if (signal.toLowerCase().includes("complaint")) {
    return "Track complaint frequency by buyer, style, product category, and factory department.";
  }

  if (signal.toLowerCase().includes("claim")) {
    return "Estimate claim probability early and protect margin through preventive quality control.";
  }

  if (signal.toLowerCase().includes("payment")) {
    return "Monitor payment discipline, overdue exposure, and commercial risk before accepting large repeat orders.";
  }

  if (signal.toLowerCase().includes("future")) {
    return "Use future order potential to prioritise strategic account management and buyer relationship investment.";
  }

  return "Use this signal to strengthen buyer profiling, commercial planning, and relationship control.";
}

export default function BuyerBehaviourIntelligencePage() {
  const kpiCards = [
    {
      label: "Repeat Potential",
      value: "High",
      href: "#buyer-behaviour-signals",
    },
    {
      label: "Complaint Risk",
      value: "Monitored",
      href: "#buyer-risk-assessment",
    },
    {
      label: "Claim Probability",
      value: "Measured",
      href: "#buyer-behaviour-signals",
    },
    {
      label: "Future Opportunity",
      value: "Strong",
      href: "#consultancy-application",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
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

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-pink-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-pink-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review buyer intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="buyer-risk-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-pink-400/30 bg-pink-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-pink-300">
            Executive Buyer Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-pink-100">
            Strong Opportunity · Monitored Risk
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment indicates that buyer relationships can become more
            profitable when complaint behaviour, payment discipline, repeat
            order pattern, claim probability, and communication responsiveness
            are monitored together.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            id="buyer-behaviour-signals"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">
              Buyer Behaviour Signals
            </h2>

            <div className="mt-6 space-y-3">
              {buyerSignals.map((item, index) => {
                const sectionId = slugify(item);

                return (
                  <a
                    key={item}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-pink-400/70 hover:shadow-xl"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-400 font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <div>
                      <p className="text-slate-200">{item}</p>

                      <p className="mt-2 text-sm text-slate-400">
                        {getSignalRecommendation(item)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            id="buyer-classification"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
          >
            <h2 className="text-2xl font-bold">
              Buyer Classification
            </h2>

            <div className="mt-6 space-y-4">
              {buyerTypes.map((buyer) => {
                const sectionId = slugify(buyer.type);

                return (
                  <a
                    key={buyer.type}
                    id={sectionId}
                    href="#consultancy-application"
                    className="scroll-mt-28 block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-pink-400/70 hover:shadow-xl"
                  >
                    <h3 className="text-lg font-bold text-pink-200">
                      {buyer.type}
                    </h3>

                    <p className="mt-2 text-sm text-slate-300">
                      {buyer.insight}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Click to review consultancy application
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-pink-400/30 bg-pink-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-pink-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories and business teams understand which
            buyers are profitable, which buyers need careful follow-up, which
            buyers may create future claim risk, and which buyers can become
            long-term strategic customers.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-pink-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Segment buyers by repeat potential, complaint history, payment
              behaviour, claim exposure, communication pattern, and future order
              value. This will help management protect margin and prioritise
              strategic buyer relationships.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}