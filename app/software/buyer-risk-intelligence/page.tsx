"use client";

import DashboardShell from "@/components/software/DashboardShell";

const buyerRiskAreas = [
  {
    title: "Delayed Payment Risk",
    detail:
      "Buyer payment behaviour, overdue exposure, LC delay, TT delay, and cashflow pressure should be monitored before accepting large orders.",
  },
  {
    title: "Claim & Complaint Risk",
    detail:
      "Repeated claims, quality complaints, discount requests, and post-shipment disputes can reduce profitability and damage buyer relationship stability.",
  },
  {
    title: "Shipment Escalation Risk",
    detail:
      "Unrealistic lead times, urgent shipment pressure, delayed approvals, and frequent order changes may force air shipment or margin loss.",
  },
  {
    title: "Margin Pressure Risk",
    detail:
      "Excessive negotiation, price sensitivity, rework cost, recovery cost, and penalty exposure can create commercial instability.",
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

export default function BuyerRiskIntelligencePage() {
  const kpiCards = [
    {
      title: "Buyer Risk",
      value: "Monitoring",
      href: "#buyer-risk-feed",
      className: "bg-red-950 border-red-700 text-red-200",
    },
    {
      title: "Commercial Pressure",
      value: "Ready",
      href: "#executive-commercial-assessment",
      className: "bg-orange-950 border-orange-700 text-orange-200",
    },
    {
      title: "Recovery Focus",
      value: "Margin Protection",
      href: "#ai-recommendation",
      className: "bg-slate-900 border-slate-800 text-slate-200",
    },
  ];

  return (
    <DashboardShell title="AI Buyer Risk Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section>
            <p className="text-sm text-slate-400">
              MBNCON AI Commercial & Buyer Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-2">
              AI Buyer Risk Intelligence Engine
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              This module analyses buyer-related commercial risks including delayed
              payment, excessive discount pressure, repeated claims, shipment escalation,
              unrealistic lead times, frequent order changes, and profitability pressure.
            </p>
          </section>

          <section
            id="enterprise-kpis"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-28"
          >
            {kpiCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl ${card.className}`}
              >
                <p className="text-sm opacity-80">{card.title}</p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

                <p className="mt-3 text-xs opacity-60">
                  Click to review buyer intelligence
                </p>
              </a>
            ))}
          </section>

          <section
            id="executive-commercial-assessment"
            className="scroll-mt-28 rounded-2xl border border-orange-700/40 bg-orange-950/20 p-6"
          >
            <p className="text-sm uppercase tracking-widest text-orange-300">
              Executive Commercial Assessment
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Buyer Risk Monitoring Active
            </h2>

            <p className="mt-4 text-slate-300">
              AI evaluates delayed payment exposure, buyer claim probability,
              excessive price pressure, shipment escalation risk, order change
              behaviour, and profitability erosion before management accepts
              commercially sensitive orders.
            </p>
          </section>

          <section
            id="buyer-risk-feed"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-mt-28"
          >
            {buyerRiskAreas.map((item) => {
              const sectionId = slugify(item.title);

              return (
                <a
                  key={item.title}
                  id={sectionId}
                  href="#ai-recommendation"
                  className="scroll-mt-28 bg-slate-900 border border-slate-800 rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
                >
                  <h2 className="text-xl font-bold">{item.title}</h2>

                  <p className="text-slate-300 mt-3">
                    {item.detail}
                  </p>

                  <p className="mt-4 text-xs text-slate-500">
                    Click to review AI recommendation
                  </p>
                </a>
              );
            })}

            <a
              href="#ai-recommendation"
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
            >
              <h2 className="text-xl font-bold">AI Buyer Warning</h2>

              <p className="text-slate-300 mt-3">
                Repeated claims, unrealistic shipment pressure, frequent style changes,
                delayed approvals, and excessive negotiations may create commercial instability
                and margin erosion.
              </p>
            </a>

            <a
              href="#ai-recommendation"
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
            >
              <h2 className="text-xl font-bold">
                Executive Commercial Action
              </h2>

              <p className="text-slate-300 mt-3">
                Track buyer claim history, payment behaviour, lead-time pressure,
                recovery performance, and profitability before accepting high-risk orders.
              </p>
            </a>
          </section>

          <section
            id="ai-recommendation"
            className="scroll-mt-28 rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-6"
          >
            <p className="text-sm uppercase tracking-widest text-cyan-300">
              AI Recommendation
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Protect Margin Before Accepting Risky Buyer Orders
            </h2>

            <p className="mt-4 text-slate-300">
              Management should review buyer payment discipline, claim history,
              approval speed, lead-time pressure, discount behaviour, shipment
              escalation pattern, and previous profitability before accepting
              large or urgent buyer orders. High-risk buyers should trigger
              executive approval, stricter payment terms, and documented
              commercial protection.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}