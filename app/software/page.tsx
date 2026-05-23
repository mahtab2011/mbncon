"use client";

import Link from "next/link";
import { useEffect } from "react";
import InternalSearch from "@/components/software/InternalSearch";

type ModuleLink = {
  name: string;
  href: string;
};

type ModuleGroup = {
  title: string;
  description: string;
  modules: ModuleLink[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const moduleGroups: ModuleGroup[] = [
  {
    title: "Leadership, Human Performance & Skill Development",
    description:
      "Leadership capability, mindset, skill development, empowerment, coaching, resilience, management discipline and human performance improvement.",
    modules: [
      {
        name: "Adaptive Leadership",
        href: "/software/adaptive-leadership-assessment",
      },
      {
        name: "Leadership Dashboard",
        href: "/software/leadership-dashboard",
      },
      {
        name: "Leadership Intelligence",
        href: "/software/leadership-intelligence",
      },
      {
        name: "Leadership Coaching Form",
        href: "/software/manufacturing-productivity/leadership-coaching-form",
      },
      {
        name: "Inner Game of Tennis",
        href: "/software/manufacturing-productivity/management-excellence/inner-game-of-tennis",
      },
      {
        name: "Inner Game of Management",
        href: "/software/manufacturing-productivity/management-excellence/inner-game-of-management",
      },
      {
        name: "Leadership Challenge Resilience",
        href: "/software/manufacturing-productivity/management-excellence/leadership-challenge-resilience",
      },
      {
        name: "Management Assessment Form",
        href: "/software/manufacturing-productivity/management-excellence/management-assessment-form",
      },
      {
        name: "Skill Matrix Training Intelligence",
        href: "/software/skill-matrix-training-intelligence",
      },
      {
        name: "Staff Skill Matrix",
        href: "/software/manufacturing-productivity/staff-skill-matrix",
      },
      {
        name: "Employee Empowerment Intelligence",
        href: "/software/employee-empowerment-intelligence",
      },
      {
        name: "Empowerment Intelligence",
        href: "/software/empowerment-intelligence",
      },
      {
        name: "Future Improvement Programme",
        href: "/software/future-improvement-programme",
      },
    ],
  },
  {
    title: "Productivity Improvement & Operational Excellence",
    description:
      "Productivity improvement, value-added work, waste reduction, bottleneck control, OEE, Lean, Kaizen, Gemba, Muda and continuous improvement systems.",
    modules: [
      {
        name: "Manufacturing Productivity",
        href: "/software/manufacturing-productivity",
      },
      {
        name: "Value Added Productivity",
        href: "/software/manufacturing-productivity/value-added-productivity",
      },
      {
        name: "Value Stream Assessment",
        href: "/software/manufacturing-value-stream-assessment",
      },
      {
        name: "Bottleneck Analysis",
        href: "/software/manufacturing-productivity/bottleneck-analysis",
      },
      {
        name: "Production Bottleneck Intelligence",
        href: "/software/production-entry/production-bottleneck-intelligence",
      },
      {
        name: "Production Capacity Intelligence",
        href: "/software/production-entry/production-capacity-intelligence",
      },
      {
        name: "Line Balancing Intelligence",
        href: "/software/line-balancing-intelligence",
      },
      {
        name: "OEE System",
        href: "/software/manufacturing-productivity/oee-system",
      },
      {
        name: "Muda Intelligence",
        href: "/software/manufacturing-productivity/muda-intelligence",
      },
      {
        name: "Gemba Audit System",
        href: "/software/manufacturing-productivity/gemba-audit-system",
      },
      {
        name: "Lean Manufacturing System",
        href: "/software/lean-manufacturing-system",
      },
      {
        name: "Lean Audit Checklist",
        href: "/software/lean-audit-checklist",
      },
      {
        name: "Lean Kaizen Dashboard",
        href: "/software/lean-kaizen-dashboard",
      },
      {
        name: "Lean Kaizen Entry",
        href: "/software/lean-kaizen-entry",
      },
      {
        name: "Kaizen System",
        href: "/software/manufacturing-productivity/kaizen-system",
      },
      {
        name: "AI Kaizen Improvement Tracker",
        href: "/software/ai-kaizen-improvement-tracker",
      },
      {
        name: "Continuous Improvement Tracker",
        href: "/software/continuous-improvement-tracker",
      },
      {
        name: "Root Cause Analysis",
        href: "/software/root-cause-analysis",
      },
      {
        name: "Corrective Action System",
        href: "/software/corrective-action-system",
      },
      {
        name: "Problem Solving Workflow",
        href: "/software/manufacturing-productivity/problem-solving-workflow",
      },
    ],
  },
  {
    title: "Executive Intelligence & Enterprise Control",
    description:
      "Executive dashboards, command centres, enterprise reports, management review, factory health and strategic control systems.",
    modules: [
      {
        name: "Executive Dashboard",
        href: "/software/executive-dashboard",
      },
      {
        name: "Executive Command Centre",
        href: "/software/executive-command-centre",
      },
      {
        name: "Executive Decision Dashboard",
        href: "/software/executive-decision-dashboard",
      },
      {
        name: "Executive Analytics Dashboard",
        href: "/software/executive-analytics-dashboard",
      },
      {
        name: "Executive Recovery Dashboard",
        href: "/software/executive-recovery-dashboard",
      },
      {
        name: "Executive Report Generator",
        href: "/software/executive-report-generator",
      },
      {
        name: "AI Executive Report",
        href: "/software/ai-executive-report",
      },
      {
        name: "AI Executive KPI Command Centre",
        href: "/software/ai-executive-kpi-command-centre",
      },
      {
        name: "AI Enterprise Report Generator",
        href: "/software/ai-enterprise-report-generator",
      },
      {
        name: "AI Master Control Centre",
        href: "/software/ai-master-control-centre",
      },
      {
        name: "AI Management Review Centre",
        href: "/software/ai-management-review-centre",
      },
      {
        name: "AI Factory Health Engine",
        href: "/software/ai-factory-health-engine",
      },
      {
        name: "AI Factory War Room Dashboard",
        href: "/software/ai-factory-war-room-dashboard",
      },
      {
        name: "AI Factory War Room Command Centre",
        href: "/software/ai-factory-war-room-command-centre",
      },
      {
        name: "AI Global Search Module Finder",
        href: "/software/ai-global-search-module-finder",
      },
    ],
  },
  {
    title: "Production, Maintenance & Factory Operations",
    description:
      "Core factory execution including production entry, planning, machine use, downtime, maintenance, forecasting, recovery and daily management.",
    modules: [
      {
        name: "Production Entry",
        href: "/software/production-entry",
      },
      {
        name: "Production Planning Line Balancing",
        href: "/software/production-planning-line-balancing",
      },
      {
        name: "Manufacturing KPI Dashboard",
        href: "/software/manufacturing-kpi-dashboard",
      },
      {
        name: "Forecasting",
        href: "/software/forecasting",
      },
      {
        name: "Daily Management System",
        href: "/software/manufacturing-productivity/daily-management-system",
      },
      {
        name: "Daily Production Report",
        href: "/software/manufacturing-productivity/daily-production-report",
      },
      {
        name: "Daily Production Reporting",
        href: "/software/manufacturing-productivity/daily-production-reporting",
      },
      {
        name: "Machine Utilization Intelligence",
        href: "/software/machine-utilization-intelligence",
      },
      {
        name: "Machine Maintenance Intelligence",
        href: "/software/machine-maintenance-intelligence",
      },
      {
        name: "Machine Downtime",
        href: "/software/manufacturing-productivity/machine-downtime",
      },
      {
        name: "Maintenance Entry",
        href: "/software/maintenance-entry",
      },
      {
        name: "Preventive Maintenance Intelligence",
        href: "/software/production-entry/preventive-maintenance-intelligence",
      },
      {
        name: "AI Production Recovery Intelligence",
        href: "/software/ai-production-recovery-intelligence",
      },
      {
        name: "Factory Loss Intelligence",
        href: "/software/factory-loss-intelligence",
      },
      {
        name: "Factory Loss Intelligence Entry",
        href: "/software/factory-loss-intelligence-entry",
      },
      {
        name: "Post Order Intelligence Entry",
        href: "/software/production-entry/post-order-intelligence-entry",
      },
    ],
  },
  {
    title: "Workforce, Accountability & Department Performance",
    description:
      "Workforce entry, absence, idle manpower, overtime, department ranking, accountability and performance visibility.",
    modules: [
      {
        name: "Workforce Entry",
        href: "/software/workforce-entry",
      },
      {
        name: "Workforce Absence Intelligence",
        href: "/software/workforce-absence-intelligence",
      },
      {
        name: "Idle Manpower Intelligence",
        href: "/software/idle-manpower-intelligence",
      },
      {
        name: "Overtime Optimization Intelligence",
        href: "/software/production-entry/overtime-optimization-intelligence",
      },
      {
        name: "Department Ranking",
        href: "/software/department-ranking",
      },
      {
        name: "Department Risk Heatmap",
        href: "/software/department-risk-heatmap",
      },
      {
        name: "AI Department Accountability Tracker",
        href: "/software/ai-department-accountability-tracker",
      },
      {
        name: "AI Industrial Engineering Intelligence",
        href: "/software/ai-industrial-engineering-intelligence",
      },
    ],
  },
  {
    title: "Quality, TQM, Compliance & Business Excellence",
    description:
      "Quality assurance, defect prevention, rework reduction, compliance, TQM, raw material quality and business excellence maturity.",
    modules: [
      {
        name: "Quality Entry",
        href: "/software/quality-entry",
      },
      {
        name: "Raw Material Quality Entry",
        href: "/software/qulaity-assurance-entry-rawmaterials",
      },
      {
        name: "AI Quality Failure Prediction Engine",
        href: "/software/ai-quality-failure-prediction-engine",
      },
      {
        name: "AI Rework Intelligence Engine",
        href: "/software/ai-rework-intelligence-engine",
      },
      {
        name: "AI Raw Material Consumption Intelligence",
        href: "/software/ai-raw-material-consumption-intelligence",
      },
      {
        name: "Components Quality Checklist",
        href: "/software/components-quality-checklist",
      },
      {
        name: "Compliance Audit Entry",
        href: "/software/compliance-audit-entry",
      },
      {
        name: "Compliance Audit Intelligence",
        href: "/software/compliance-audit-intelligence",
      },
      {
        name: "AI Compliance Risk Intelligence",
        href: "/software/ai-compliance-risk-intelligence",
      },
      {
        name: "TQM Entry",
        href: "/software/tqm-entry",
      },
      {
        name: "TQM Forms",
        href: "/software/tqm-forms",
      },
      {
        name: "TQM System",
        href: "/software/tqm-system",
      },
      {
        name: "Manufacturing Productivity TQM System",
        href: "/software/manufacturing-productivity/tqm-system",
      },
      {
        name: "AI TQM Intelligence Centre",
        href: "/software/ai-tqm-intelligence-centre",
      },
      {
        name: "Business Excellence Maturity",
        href: "/software/business-excellence-maturity",
      },
    ],
  },
  {
    title: "Buyer, Commercial & Profitability Intelligence",
    description:
      "Buyer risk, buyer behaviour, order profitability, profit leakage, cashflow, merchandising and commercial decision intelligence.",
    modules: [
      {
        name: "Buyer Order Entry",
        href: "/software/buyer-order-entry",
      },
      {
        name: "Buyer Risk Intelligence",
        href: "/software/buyer-risk-intelligence",
      },
      {
        name: "Buyer Behaviour Intelligence",
        href: "/software/buyer-behaviour-intelligence",
      },
      {
        name: "AI Buyer Satisfaction Intelligence",
        href: "/software/ai-buyer-satisfaction-intelligence",
      },
      {
        name: "AI Buyer Profitability Intelligence",
        href: "/software/ai-buyer-profitability-intelligence",
      },
      {
        name: "AI Order Profitability Intelligence",
        href: "/software/ai-order-profitability-intelligence",
      },
      {
        name: "Profit Leakage Intelligence",
        href: "/software/profit-leakage-intelligence",
      },
      {
        name: "Costing Profit Leakage Intelligence",
        href: "/software/costing-profit-leakage-intelligence",
      },
      {
        name: "Costing Profitability Entry",
        href: "/software/costing-profitability-entry",
      },
      {
        name: "Accounts Receivable Cashflow Intelligence",
        href: "/software/accounts-receivable-cashflow-intelligence",
      },
      {
        name: "Order Cancellation Buyer Risk Intelligence",
        href: "/software/production-entry/order-cancellation-buyer-risk-intelligence",
      },
      {
        name: "Merchandising Order Tracking Intelligence",
        href: "/software/production-entry/merchandising-order-tracking-intelligence",
      },
      {
        name: "Sample Development Intelligence",
        href: "/software/sample-development-intelligence",
      },
    ],
  },
  {
    title: "Supply Chain, Logistics, Inventory & Materials",
    description:
      "Supplier performance, shipment, warehouse, transport, inventory, components, raw materials and logistics coordination.",
    modules: [
      {
        name: "Supplier Order Entry",
        href: "/software/supplier-order-entry",
      },
      {
        name: "Supplier Performance Intelligence",
        href: "/software/supplier-performance-intelligence",
      },
      {
        name: "AI Supplier Performance Intelligence Centre",
        href: "/software/ai-supplier-performance-intelligence-centre",
      },
      {
        name: "Material Entry",
        href: "/software/material-entry",
      },
      {
        name: "Components Accessories Supply Intelligence",
        href: "/software/components-accessories-supply-intelligence",
      },
      {
        name: "Inventory Entry",
        href: "/software/inventory-entry",
      },
      {
        name: "Inventory Stock Intelligence",
        href: "/software/inventory-stock-intelligence",
      },
      {
        name: "AI Inventory Intelligence Engine",
        href: "/software/ai-inventory-intelligence-engine",
      },
      {
        name: "Shipment Entry",
        href: "/software/shipment-entry",
      },
      {
        name: "Shipment Schedule Entry",
        href: "/software/shipment-schedule-entry",
      },
      {
        name: "Shipping Line Booking Entry",
        href: "/software/shipping-line-booking-entry",
      },
      {
        name: "Local Transport Booking Entry",
        href: "/software/local-transport-booking-entry",
      },
      {
        name: "Transport Logistics Intelligence",
        href: "/software/transport-logistics-intelligence",
      },
      {
        name: "Warehouse Security Loss Intelligence",
        href: "/software/warehouse-security-loss-intelligence",
      },
    ],
  },
  {
    title: "Risk, Recovery, Alerts & Transformation",
    description:
      "Risk escalation, shipment risk, cashflow risk, notification, transformation readiness, recovery and enterprise resilience.",
    modules: [
      {
        name: "Risk Escalation Entry",
        href: "/software/risk-escalation-entry",
      },
      {
        name: "AI Cashflow Risk Intelligence",
        href: "/software/ai-cashflow-risk-intelligence",
      },
      {
        name: "Shipment Delay Prediction",
        href: "/software/shipment-delay-prediction",
      },
      {
        name: "AI Shipment Recovery Intelligence",
        href: "/software/ai-shipment-recovery-intelligence",
      },
      {
        name: "Air Shipment Risk",
        href: "/software/air-shipment-risk",
      },
      {
        name: "Executive Escalation Engine",
        href: "/software/executive-escalation-engine",
      },
      {
        name: "AI Notification Escalation Centre",
        href: "/software/ai-notification-escalation-centre",
      },
      {
        name: "Change Management Intelligence",
        href: "/software/change-management-intelligence",
      },
      {
        name: "Digital Transformation Readiness",
        href: "/software/digital-transformation-readiness",
      },
    ],
  },
  {
    title: "Energy, Sustainability, Governance & Security",
    description:
      "ESG, utilities, energy optimisation, cost reduction, evidence control, role access, governance and enterprise security.",
    modules: [
      {
        name: "Sustainability ESG Intelligence",
        href: "/software/sustainability-esg-intelligence",
      },
      {
        name: "Utilities Entry",
        href: "/software/utilities-entry",
      },
      {
        name: "Utility Cost Intelligence",
        href: "/software/utility-cost-intelligence",
      },
      {
        name: "Utilities Consumption Intelligence",
        href: "/software/utilities-consumption-intelligence",
      },
      {
        name: "AI Factory Energy Optimisation Engine",
        href: "/software/ai-factory-energy-optimisation-engine",
      },
      {
        name: "AI Cost Reduction Intelligence",
        href: "/software/ai-cost-reduction-intelligence",
      },
      {
        name: "AI Document Evidence Control Centre",
        href: "/software/ai-document-evidence-control-centre",
      },
      {
        name: "AI User Role Access Control Centre",
        href: "/software/ai-user-role-access-control-centre",
      },
      {
        name: "Training Manual",
        href: "/software/training-manual",
      },
    ],
  },
    {
    title: "AI Transformation Division",
    description:
      "AI transformation, industry intelligence, enterprise AI adoption, predictive systems, governance, analytics and sector-specific AI operational intelligence.",
    modules: [
      {
        name: "AI Transformation Intelligence Centre",
        href: "/software/ai-transformation-intelligence-centre",
      },
      {
        name: "Why AI Intelligence",
        href: "/software/why-ai-intelligence",
      },
      {
        name: "Generative AI Intelligence",
        href: "/software/generative-ai-intelligence",
      },
      {
        name: "Predictive AI Intelligence",
        href: "/software/predictive-ai-intelligence",
      },
      {
        name: "AI Governance & Ethics",
        href: "/software/ai-governance-ethics",
      },
      {
        name: "AI Analytics & Decision Intelligence",
        href: "/software/ai-analytics-decision-intelligence",
      },
      {
        name: "AI Smart Agriculture Intelligence",
        href: "/software/ai-smart-agriculture-intelligence",
      },
      {
        name: "AI Agri Marketing Intelligence",
        href: "/software/ai-agri-marketing-intelligence",
      },
      {
        name: "AI Live Agri Product Price Intelligence",
        href: "/software/ai-live-agri-product-price-intelligence",
      },
      {
        name: "AI Smart Healthcare Intelligence",
        href: "/software/ai-smart-healthcare-intelligence",
      },
      {
        name: "AI Banking & Insurance Intelligence",
        href: "/software/ai-banking-insurance-intelligence",
      },
      {
        name: "AI Retail Intelligence",
        href: "/software/ai-retail-intelligence",
      },
      {
        name: "AI Restaurant Intelligence",
        href: "/software/ai-restaurant-intelligence",
      },
      {
        name: "AI Residential Hotel Intelligence",
        href: "/software/ai-residential-hotel-intelligence",
      },
      {
        name: "AI Catering Company Intelligence",
        href: "/software/ai-catering-company-intelligence",
      },
    ],
  },
];

const overviewCards = [
  {
    title: "Enterprise Module Explorer",
    value: "100+",
    description: "Grouped access to nested and enterprise modules.",
    target: "module-explorer",
    className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Leadership & Skills",
    value: "People",
    description: "Leadership, skill, mindset and human performance systems.",
    target: "leadership-human-performance-and-skill-development",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
  {
    title: "Productivity Improvement",
    value: "Flow",
    description: "Root cause, bottleneck, value stream and value-added work.",
    target: "productivity-improvement-and-operational-excellence",
    className: "border-yellow-400/20 bg-yellow-400/10 text-yellow-200",
  },
  {
    title: "Industry 4.0 Readiness",
    value: "AI Era",
    description: "Enterprise intelligence for the next industrial evolution.",
    target: "why-we-built-this-platform",
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
      <InternalSearch />
      <div className="pointer-events-none fixed inset-0 z-50 hidden items-center justify-center opacity-[0.05] md:flex">
        <div className="-rotate-45 text-4xl font-black uppercase tracking-widest text-white lg:text-6xl">
          MBNCON Confidential
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
        <div id="top" />

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl transition duration-300 hover:border-cyan-400/30 hover:shadow-cyan-950/20 sm:p-8 lg:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-300 sm:text-sm">
            MBNCON Enterprise Intelligence Platform
          </p>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Enterprise Control Centre for Manufacturing Intelligence,
            Productivity, Leadership and Operational Excellence
          </h1>

          <p className="mt-5 max-w-5xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A grouped navigation system for executive intelligence, production
            control, productivity improvement, leadership development, workforce
            capability, quality, compliance, supply chain, profitability, ESG,
            risk recovery and enterprise transformation.
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
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="why-we-built-this-platform"
          className="mt-8 scroll-mt-28 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 shadow-md transition duration-300 hover:border-cyan-300/40 hover:shadow-xl sm:mt-10 sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Why We Built This Platform
          </p>

          <h2 className="mt-3 text-2xl font-bold text-cyan-200 sm:text-3xl">
            Enterprise Readiness for the Fourth Industrial Revolution and AI
            Evolution
          </h2>

          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-200">
            <p>
              Manufacturing and enterprise operations are entering a new era
              shaped by artificial intelligence, automation, connected data,
              predictive decision systems and Industry 4.0 transformation.
              Organisations can no longer depend only on manual reporting,
              delayed visibility or isolated departmental decisions.
            </p>

            <p>
              MBNCON Enterprise Intelligence Platform was built to help
              organisations improve productivity, strengthen leadership,
              develop workforce capability, reduce waste, identify bottlenecks,
              control quality, manage risk, improve profitability and support
              faster executive decision-making through structured operational
              intelligence.
            </p>

            <p>
              The platform connects human performance, operational excellence,
              quality, logistics, finance, governance and sustainability into a
              single enterprise navigation and intelligence ecosystem, so
              leaders and teams can act earlier, learn faster and improve more
              consistently.
            </p>
          </div>
        </section>

        <section
          id="module-explorer"
          className="mt-8 scroll-mt-28 space-y-8 sm:mt-10 sm:space-y-10"
        >
          {moduleGroups.map((group) => {
            const groupId = slugify(group.title);

            return (
              <section
                key={group.title}
                id={groupId}
                className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-md transition duration-300 hover:border-cyan-400/30 hover:shadow-xl sm:p-8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Enterprise Module Group
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-cyan-200 sm:text-3xl">
                      {group.title}
                    </h2>

                    <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-400 sm:text-base">
                      {group.description}
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
                  {group.modules.map((module) => (
                    <Link
                      key={`${group.title}-${module.href}`}
                      href={module.href}
                      className="group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg"
                    >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <h3 className="min-w-0 break-words text-base font-semibold leading-7 text-white sm:text-lg">
                          {module.name}
                        </h3>

                        <span className="shrink-0 text-cyan-300 transition duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Open module
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </section>
      </section>
    </main>
  );
}