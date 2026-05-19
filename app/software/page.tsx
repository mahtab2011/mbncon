"use client";

import Link from "next/link";
import { useEffect } from "react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const sections = [
  {
    title: "Executive Intelligence",
    description:
      "Director-level command, health scoring, search, review and enterprise reporting.",
    items: [
      ["Executive Command Centre", "/software/executive-command-centre"],
      ["Leadership Dashboard", "/software/leadership-dashboard"],
      ["AI Master Control Centre", "/software/ai-master-control-centre"],
      [
        "AI Global Search & Module Finder",
        "/software/ai-global-search-module-finder",
      ],
      [
        "AI Factory Health Score Engine",
        "/software/ai-factory-health-score-engine",
      ],
      ["AI Management Review Centre", "/software/ai-management-review-centre"],
      [
        "AI Enterprise Report Generator",
        "/software/ai-enterprise-report-generator",
      ],
    ],
  },
  {
    title: "Factory Operations",
    description:
      "Production, maintenance, inventory, workforce, skill, Lean, Kaizen and TQM execution.",
    items: [
      ["Production Planning", "/software/production-planning-line-balancing"],
      ["Machine Maintenance", "/software/machine-maintenance-intelligence"],
      ["Inventory & Stock", "/software/inventory-stock-intelligence"],
      ["Workforce Absence", "/software/workforce-absence-intelligence"],
      [
        "Skill Matrix & Training",
        "/software/skill-matrix-training-intelligence",
      ],
      ["Lean Kaizen Dashboard", "/software/lean-kaizen-dashboard"],
      ["TQM Intelligence Centre", "/software/ai-tqm-intelligence-centre"],
    ],
  },
  {
    title: "Supply Chain & Logistics",
    description:
      "Supplier, transport, components, warehouse and shipment-risk intelligence.",
    items: [
      [
        "Supplier Performance",
        "/software/supplier-performance-intelligence",
      ],
      [
        "Transport & Logistics",
        "/software/transport-logistics-intelligence",
      ],
      [
        "Components Supply",
        "/software/components-accessories-supply-intelligence",
      ],
      [
        "Warehouse Security",
        "/software/warehouse-security-loss-intelligence",
      ],
      [
        "Shipment Delay Prediction",
        "/software/ai-shipment-delay-prediction-engine",
      ],
    ],
  },
  {
    title: "Buyer & Profitability Intelligence",
    description:
      "Buyer behaviour, cancellation risk, cashflow, profitability and leakage control.",
    items: [
      ["Buyer Behaviour", "/software/buyer-behaviour-intelligence"],
      [
        "Order Cancellation Risk",
        "/software/order-cancellation-buyer-risk-intelligence",
      ],
      [
        "AI Buyer Profitability Intelligence",
        "/software/ai-buyer-profitability-intelligence",
      ],
      [
        "AI Order Profitability Intelligence",
        "/software/ai-order-profitability-intelligence",
      ],
      [
        "Profit Leakage Intelligence",
        "/software/ai-profit-leakage-intelligence-engine",
      ],
      [
        "Cashflow Risk Intelligence",
        "/software/ai-cashflow-risk-intelligence",
      ],
    ],
  },
  {
    title: "Quality, Risk & Recovery",
    description:
      "Quality control, compliance, maturity, transformation, escalation and accountability.",
    items: [
      ["Components Quality", "/software/components-quality-checklist"],
      ["Compliance & Audit", "/software/compliance-audit-intelligence"],
      ["Business Excellence", "/software/business-excellence-maturity"],
      [
        "Digital Transformation",
        "/software/digital-transformation-readiness",
      ],
      [
        "AI Notification & Escalation Centre",
        "/software/ai-notification-escalation-centre",
      ],
      [
        "AI Department Accountability Tracker",
        "/software/ai-department-accountability-tracker",
      ],
    ],
  },
  {
    title: "Governance & Evidence Control",
    description:
      "Evidence, access control, adaptive leadership, ESG and operational training governance.",
    items: [
      [
        "AI Document & Evidence Control Centre",
        "/software/ai-document-evidence-control-centre",
      ],
      [
        "AI User Role & Access Control Centre",
        "/software/ai-user-role-access-control-centre",
      ],
      ["Adaptive Leadership", "/software/adaptive-leadership-assessment"],
      ["Sustainability & ESG", "/software/sustainability-esg-intelligence"],
      ["Training Manual", "/software/training-manual"],
    ],
  },
];

const overviewCards = [
  {
    title: "Platform Modules",
    value: "110+",
    description: "Enterprise manufacturing intelligence modules.",
    target: "modules",
    className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Enterprise Intelligence",
    value: "AI Driven",
    description: "AI-guided executive visibility and risk escalation.",
    target: "strategic-platform-vision",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
  {
    title: "Operational Focus",
    value: "Real-Time",
    description: "Production, quality, workforce, logistics and finance.",
    target: "modules",
    className: "border-yellow-400/20 bg-yellow-400/10 text-yellow-200",
  },
  {
    title: "Deployment Target",
    value: "18/05/2026",
    description: "Launch-readiness and consultancy-demo target.",
    target: "strategic-platform-vision",
    className: "border-red-400/20 bg-red-400/10 text-red-200",
  },
];

export default function SoftwareDashboardPage() {
  useEffect(() => {
    const previousContextMenu = document.oncontextmenu;
    const previousSelectStart = document.onselectstart;
    const previousDragStart = document.ondragstart;
    const previousKeyDown = document.onkeydown;

    document.oncontextmenu = () => false;
    document.onselectstart = () => false;
    document.ondragstart = () => false;

    document.onkeydown = (event) => {
      const blockedKeys = ["c", "p", "s", "u"];

      if (event.ctrlKey && blockedKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
        return false;
      }

      return previousKeyDown ? previousKeyDown.call(document, event) : null;
    };

    return () => {
      document.oncontextmenu = previousContextMenu;
      document.onselectstart = previousSelectStart;
      document.ondragstart = previousDragStart;
      document.onkeydown = previousKeyDown;
    };
  }, []);

  return (
    <main className="relative min-h-screen select-none overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 z-50 hidden items-center justify-center opacity-[0.05] md:flex">
        <div className="-rotate-45 text-4xl font-black uppercase tracking-widest text-white lg:text-6xl">
          MBNCON Confidential
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
        <div id="top" />

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl transition duration-300 hover:border-cyan-400/30 hover:shadow-cyan-950/20 sm:p-8 lg:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-300 sm:text-sm">
            MBNCON Manufacturing Intelligence Platform
          </p>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Enterprise Intelligence Dashboard
          </h1>

          <p className="mt-5 max-w-5xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Integrated manufacturing intelligence, operational excellence,
            financial governance, Lean transformation, quality control,
            logistics visibility, workforce intelligence, AI escalation,
            profitability intelligence, and executive decision support platform.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <Link
                key={card.title}
                href={`#${slugify(card.target)}`}
                className={`block min-w-0 rounded-2xl border p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-xl ${card.className}`}
              >
                <p className="text-sm opacity-90">{card.title}</p>

                <h2 className="mt-2 break-words text-3xl font-bold leading-tight sm:text-4xl">
                  {card.value}
                </h2>

                <p className="mt-3 text-sm leading-6 opacity-80">
                  {card.description}
                </p>

                <p className="mt-5 text-xs font-semibold opacity-70">
                  View section →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="modules"
          className="mt-8 scroll-mt-28 space-y-8 sm:mt-10 sm:space-y-10"
        >
          {sections.map((section) => {
            const sectionId = slugify(section.title);

            return (
              <section
                key={section.title}
                id={sectionId}
                className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-md transition duration-300 hover:border-cyan-400/30 hover:shadow-xl sm:p-8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Enterprise Module Group
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-cyan-200 sm:text-3xl">
                      {section.title}
                    </h2>

                    <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                      {section.description}
                    </p>
                  </div>

                  <a
                    href="#top"
                    className="text-sm font-semibold text-cyan-300 transition duration-300 hover:text-cyan-100"
                  >
                    Back to top ↑
                  </a>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {section.items.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                    >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <h3 className="min-w-0 break-words text-base font-semibold leading-7 text-white sm:text-lg">
                          {label}
                        </h3>

                        <span className="shrink-0 text-cyan-300 transition duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Open enterprise intelligence module
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        <section
          id="strategic-platform-vision"
          className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 shadow-md transition duration-300 hover:border-cyan-300/40 hover:shadow-xl sm:mt-12 sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Strategic Platform Vision
          </p>

          <h2 className="mt-3 text-2xl font-bold text-cyan-200">
            Complete Enterprise Manufacturing Intelligence Ecosystem
          </h2>

          <p className="mt-4 max-w-5xl text-base leading-relaxed text-slate-200">
            MBNCON is evolving into a complete enterprise manufacturing
            intelligence ecosystem integrating operations, sourcing, production,
            quality, maintenance, finance, utilities, logistics, profitability,
            governance, AI escalation, and executive decision-making into one
            unified operational command platform.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Executive decision support",
              "Operational excellence governance",
              "Consultancy-demo enterprise UX",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
              >
                <p className="font-semibold text-white">{item}</p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Enterprise-ready dashboard control prepared for module
                  navigation, launch-readiness, and executive presentation.
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}