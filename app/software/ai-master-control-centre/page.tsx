"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

const MODULE_GROUPS = [
  {
    title: "Executive Intelligence",
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
        name: "Executive Escalation Engine",
        href: "/software/executive-escalation-engine",
      },
    ],
  },

  {
    title: "Manufacturing Intelligence",
    modules: [
      {
        name: "Production Bottleneck Intelligence",
        href: "/software/production-bottleneck-intelligence",
      },
      {
        name: "Production Capacity Intelligence",
        href: "/software/production-capacity-intelligence",
      },
      {
        name: "Line Balancing Intelligence",
        href: "/software/line-balancing-intelligence",
      },
      {
        name: "Machine Utilization Intelligence",
        href: "/software/machine-utilization-intelligence",
      },
      {
        name: "Preventive Maintenance Intelligence",
        href: "/software/preventive-maintenance-intelligence",
      },
    ],
  },

  {
    title: "Lean • Kaizen • TQM",
    modules: [
      {
        name: "Lean Manufacturing System",
        href: "/software/lean-manufacturing-system",
      },
      {
        name: "Lean Kaizen Dashboard",
        href: "/software/lean-kaizen-dashboard",
      },
      {
        name: "AI Kaizen Improvement Tracker",
        href: "/software/ai-kaizen-improvement-tracker",
      },
      {
        name: "AI TQM Intelligence Centre",
        href: "/software/ai-tqm-intelligence-centre",
      },
      {
        name: "Continuous Improvement Tracker",
        href: "/software/continuous-improvement-tracker",
      },
    ],
  },

  {
    title: "Risk • Recovery • Compliance",
    modules: [
      {
        name: "Compliance Audit Intelligence",
        href: "/software/compliance-audit-intelligence",
      },
      {
        name: "Risk Escalation Entry",
        href: "/software/risk-escalation-entry",
      },
      {
        name: "Factory Loss Intelligence",
        href: "/software/factory-loss-intelligence",
      },
      {
        name: "AI Production Recovery Intelligence",
        href: "/software/ai-production-recovery-intelligence",
      },
      {
        name: "AI Shipment Recovery Intelligence",
        href: "/software/ai-shipment-recovery-intelligence",
      },
    ],
  },

  {
    title: "Buyer • Supply Chain • Logistics",
    modules: [
      {
        name: "Buyer Risk Intelligence",
        href: "/software/buyer-risk-intelligence",
      },
      {
        name: "Supplier Performance Intelligence",
        href: "/software/supplier-performance-intelligence",
      },
      {
        name: "Shipment Delay Prediction",
        href: "/software/shipment-delay-prediction",
      },
      {
        name: "Transport Logistics Intelligence",
        href: "/software/transport-logistics-intelligence",
      },
      {
        name: "Inventory Stock Intelligence",
        href: "/software/inventory-stock-intelligence",
      },
    ],
  },

  {
    title: "Workforce • Leadership • HR",
    modules: [
      {
        name: "Leadership Intelligence",
        href: "/software/leadership-intelligence",
      },
      {
        name: "Leadership Dashboard",
        href: "/software/leadership-dashboard",
      },
      {
        name: "Workforce Absence Intelligence",
        href: "/software/workforce-absence-intelligence",
      },
      {
        name: "Skill Matrix Training Intelligence",
        href: "/software/skill-matrix-training-intelligence",
      },
      {
        name: "Department Ranking",
        href: "/software/department-ranking",
      },
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AIMasterControlCentrePage() {
  return (
    <DashboardShell title="AI Master Control Centre">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-8">

          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-8 shadow-xl">

            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm">
              Module 99 · AI Master Control Centre
            </p>

            <h1 className="text-5xl font-bold mt-4">
              Enterprise Manufacturing Intelligence Platform
            </h1>

            <p className="text-slate-300 mt-5 max-w-5xl text-lg leading-relaxed">
              Central enterprise command centre designed for
              directors, factory heads, managers,
              industrial engineers, merchandising teams,
              quality teams, compliance officers,
              finance teams, and operational leadership.
            </p>

          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <a
              href="#active-enterprise-modules"
              className="block rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
            >

              <p className="text-cyan-300 text-sm uppercase tracking-widest">
                Active Enterprise Modules
              </p>

              <h2 className="text-6xl font-bold mt-4">
                98+
              </h2>

            </a>

            <a
              href="#intelligence-engines"
              className="block rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-6 transition hover:-translate-y-1 hover:border-fuchsia-400/40"
            >

              <p className="text-fuchsia-300 text-sm uppercase tracking-widest">
                Intelligence Engines
              </p>

              <h2 className="text-6xl font-bold mt-4">
                AI
              </h2>

            </a>

            <a
              href="#platform-status"
              className="block rounded-2xl border border-green-700/40 bg-green-950/10 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
            >

              <p className="text-green-300 text-sm uppercase tracking-widest">
                Platform Status
              </p>

              <h2 className="text-4xl font-bold mt-5">
                Operational
              </h2>

            </a>

          </section>

          <section className="space-y-8">

            {MODULE_GROUPS.map((group) => {
              const groupId = slugify(group.title);

              return (
                <section
                  key={group.title}
                  id={groupId}
                  className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
                >

                  <div className="border-b border-slate-800 px-6 py-5">

                    <h2 className="text-2xl font-bold">
                      {group.title}
                    </h2>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">

                    {group.modules.map((module) => (
                      <Link
                        key={module.href}
                        href={module.href}
                        className="block rounded-2xl border border-slate-700 bg-slate-950 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900"
                      >

                        <h3 className="text-lg font-semibold text-white">
                          {module.name}
                        </h3>

                        <p className="text-slate-400 mt-3 text-sm">
                          Open enterprise intelligence module
                        </p>

                      </Link>
                    ))}

                  </div>

                </section>
              );
            })}

          </section>

          <section className="space-y-5">

            <section
              id="active-enterprise-modules"
              className="scroll-mt-28 rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">
                Active Enterprise Modules
              </h2>

              <p className="mt-3 text-slate-300">
                This platform is designed as a multi-module enterprise
                manufacturing intelligence system covering operational control,
                executive reporting, risk management, Lean, Kaizen, TQM,
                workforce, supply chain, buyer risk and factory profitability.
              </p>
            </section>

            <section
              id="intelligence-engines"
              className="scroll-mt-28 rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-fuchsia-300">
                Intelligence Engines
              </h2>

              <p className="mt-3 text-slate-300">
                Each module acts as an intelligence engine, helping leadership
                detect risk, identify loss, improve productivity, recover value,
                assign accountability and support faster management decisions.
              </p>
            </section>

            <section
              id="platform-status"
              className="scroll-mt-28 rounded-2xl border border-green-700/40 bg-green-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-green-300">
                Platform Status
              </h2>

              <p className="mt-3 text-slate-300">
                The platform is operational as a director-facing navigation and
                command centre. Individual modules can continue to be connected
                to Firestore, AI analysis and reporting exports progressively.
              </p>
            </section>

          </section>

          <section className="rounded-2xl border border-amber-700/40 bg-amber-950/10 p-6">

            <h2 className="text-2xl font-bold text-amber-300">
              Executive Navigation Guidance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 text-slate-300">

              <a
                href="#directors-and-owners"
                className="block rounded-xl border border-slate-700 bg-slate-950 p-5 transition hover:-translate-y-1 hover:border-amber-400/40"
              >

                <h3 className="text-lg font-semibold text-white">
                  Directors & Owners
                </h3>

                <p className="mt-3">
                  Use Executive Dashboard, Factory War Room,
                  KPI Dashboard, and Enterprise Reports
                  for strategic operational decisions.
                </p>

              </a>

              <a
                href="#managers-and-officers"
                className="block rounded-xl border border-slate-700 bg-slate-950 p-5 transition hover:-translate-y-1 hover:border-amber-400/40"
              >

                <h3 className="text-lg font-semibold text-white">
                  Managers & Officers
                </h3>

                <p className="mt-3">
                  Use production entries, quality systems,
                  shipment systems, corrective actions,
                  and operational intelligence modules daily.
                </p>

              </a>

            </div>

          </section>

          <section className="space-y-5">

            <section
              id="directors-and-owners"
              className="scroll-mt-28 rounded-2xl border border-amber-700/40 bg-amber-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-amber-300">
                Directors & Owners
              </h2>

              <p className="mt-3 text-slate-300">
                Directors and owners should begin with executive dashboards,
                factory war room views, KPI intelligence and report generators
                to understand operational risk, profitability exposure and
                factory-level recovery requirements.
              </p>
            </section>

            <section
              id="managers-and-officers"
              className="scroll-mt-28 rounded-2xl border border-amber-700/40 bg-amber-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-amber-300">
                Managers & Officers
              </h2>

              <p className="mt-3 text-slate-300">
                Managers and officers should use the operational modules daily
                to capture evidence, update progress, close corrective actions,
                monitor department performance and support executive review.
              </p>
            </section>

          </section>

        </div>

      </main>

    </DashboardShell>
  );
}