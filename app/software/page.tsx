"use client";

import Link from "next/link";

const sections = [
  {
    title: "Executive Intelligence",
    items: [
      ["Executive Command Center", "/software/executive-command-center"],
      ["Leadership Dashboard", "/software/leadership-dashboard"],
      ["AI Master Control Centre", "/software/ai-master-control-centre"],
      ["AI Global Search & Module Finder", "/software/ai-global-search-module-finder"],
      ["AI Factory Health Score Engine", "/software/ai-factory-health-score-engine"],
      ["AI Management Review Centre", "/software/ai-management-review-centre"],
      ["AI Enterprise Report Generator", "/software/ai-enterprise-report-generator"],
    ],
  },

  {
    title: "Factory Operations",
    items: [
      ["Production Planning", "/software/production-planning-line-balancing"],
      ["Machine Maintenance", "/software/machine-maintenance-intelligence"],
      ["Inventory & Stock", "/software/inventory-stock-intelligence"],
      ["Workforce Absence", "/software/workforce-absence-intelligence"],
      ["Skill Matrix & Training", "/software/skill-matrix-training-intelligence"],
      ["Lean Kaizen Dashboard", "/software/lean-kaizen-dashboard"],
      ["TQM Intelligence Centre", "/software/ai-tqm-intelligence-centre"],
    ],
  },

  {
    title: "Supply Chain & Logistics",
    items: [
      ["Supplier Performance", "/software/supplier-performance-intelligence"],
      ["Transport & Logistics", "/software/transport-logistics-intelligence"],
      ["Components Supply", "/software/components-accessories-supply-intelligence"],
      ["Warehouse Security", "/software/warehouse-security-loss-intelligence"],
      ["Shipment Delay Prediction", "/software/ai-shipment-delay-prediction-engine"],
    ],
  },

  {
    title: "Buyer & Profitability Intelligence",
    items: [
      ["Buyer Behaviour", "/software/buyer-behaviour-intelligence"],
      ["Order Cancellation Risk", "/software/order-cancellation-buyer-risk-intelligence"],
      ["AI Buyer Profitability Intelligence", "/software/ai-buyer-profitability-intelligence"],
      ["AI Order Profitability Intelligence", "/software/ai-order-profitability-intelligence"],
      ["Profit Leakage Intelligence", "/software/ai-profit-leakage-intelligence-engine"],
      ["Cashflow Risk Intelligence", "/software/ai-cashflow-risk-intelligence"],
    ],
  },

  {
    title: "Quality, Risk & Recovery",
    items: [
      ["Components Quality", "/software/components-quality-checklist"],
      ["Compliance & Audit", "/software/compliance-audit-intelligence"],
      ["Business Excellence", "/software/business-excellence-maturity"],
      ["Digital Transformation", "/software/digital-transformation-readiness"],
      ["AI Notification & Escalation Centre", "/software/ai-notification-escalation-centre"],
      ["AI Department Accountability Tracker", "/software/ai-department-accountability-tracker"],
    ],
  },

  {
    title: "Governance & Evidence Control",
    items: [
      ["AI Document & Evidence Control Centre", "/software/ai-document-evidence-control-centre"],
      ["AI User Role & Access Control Centre", "/software/ai-user-role-access-control-centre"],
      ["Adaptive Leadership", "/software/adaptive-leadership-assessment"],
      ["Sustainability & ESG", "/software/sustainability-esg-intelligence"],
      ["Training Manual", "/software/training-manual"],
    ],
    
  },
];

export default function SoftwareDashboardPage() {
  if (typeof window !== "undefined") {
    document.oncontextmenu = () => false;
    document.onselectstart = () => false;
    document.ondragstart = () => false;

    document.onkeydown = (e) => {
      if (
        e.ctrlKey &&
        ["c", "p", "s", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        return false;
      }
    };
  }

  return (
    <main className="relative min-h-screen select-none overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center opacity-[0.05]">
        <div className="-rotate-45 text-6xl font-black uppercase tracking-widest text-white">
          MBNCON Confidential
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            MBNCON Manufacturing Intelligence Platform
          </p>

          <h1 className="text-5xl font-bold">
            Enterprise Intelligence Dashboard
          </h1>

          <p className="mt-5 max-w-5xl text-lg text-slate-300">
            Integrated manufacturing intelligence, operational excellence,
            financial governance, Lean transformation, quality control,
            logistics visibility, workforce intelligence, AI escalation,
            profitability intelligence, and executive decision support platform.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-sm text-cyan-200">Platform Modules</p>
              <h2 className="mt-2 text-4xl font-bold">110+</h2>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm text-emerald-200">Enterprise Intelligence</p>
              <h2 className="mt-2 text-4xl font-bold">AI Driven</h2>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
              <p className="text-sm text-yellow-200">Operational Focus</p>
              <h2 className="mt-2 text-4xl font-bold">Real-Time</h2>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
              <p className="text-sm text-red-200">Deployment Target</p>
              <h2 className="mt-2 text-4xl font-bold">18/05/2026</h2>
            </div>
          </div>
        </div>

        <section className="mt-10 space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-white/10 bg-slate-900 p-8"
            >
              <h2 className="text-3xl font-bold text-cyan-200">
                {section.title}
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400 hover:bg-cyan-400/10"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {label}
                      </h3>

                      <span className="text-cyan-300">→</span>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      Open enterprise intelligence module
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-bold text-cyan-200">
            Strategic Platform Vision
          </h2>

          <p className="mt-4 text-slate-200">
            MBNCON is evolving into a complete enterprise manufacturing
            intelligence ecosystem integrating operations, sourcing, production,
            quality, maintenance, finance, utilities, logistics, profitability,
            governance, AI escalation, and executive decision-making into one
            unified operational command platform.
          </p>
        </section>
      </section>
    </main>
  );
}