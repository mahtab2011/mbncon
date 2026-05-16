"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

type ModuleItem = {
  id: string;
  name: string;
  category: string;
  href: string;
  users: string;
  keywords: string[];
  description: string;
};

const MODULES: ModuleItem[] = [
  {
    id: "M-001",
    name: "AI Master Control Centre",
    category: "Executive Navigation",
    href: "/software/ai-master-control-centre",
    users: "Directors, Owners, Factory Heads",
    keywords: ["master", "control", "navigation", "modules", "overview"],
    description:
      "Central command centre for accessing the enterprise manufacturing intelligence platform.",
  },
  {
    id: "M-002",
    name: "Executive Dashboard",
    category: "Executive Intelligence",
    href: "/software/executive-dashboard",
    users: "Directors, Senior Management",
    keywords: ["executive", "dashboard", "kpi", "performance"],
    description:
      "High-level operational visibility for directors and senior leadership.",
  },
  {
    id: "M-003",
    name: "Factory War Room Dashboard",
    category: "Factory War Room",
    href: "/software/ai-factory-war-room-dashboard",
    users: "Factory Head, Operations Team",
    keywords: ["war room", "risk", "urgent", "daily", "action"],
    description:
      "Urgent operational control dashboard for high-risk factory issues.",
  },
  {
    id: "M-004",
    name: "Production Bottleneck Intelligence",
    category: "Manufacturing Intelligence",
    href: "/software/production-bottleneck-intelligence",
    users: "Production, IE, Factory Head",
    keywords: ["production", "bottleneck", "line", "output", "delay"],
    description:
      "Identifies production bottlenecks, output risks, and line flow disruption.",
  },
  {
    id: "M-005",
    name: "Line Balancing Intelligence",
    category: "Industrial Engineering",
    href: "/software/line-balancing-intelligence",
    users: "IE, Production Manager",
    keywords: ["line", "balancing", "ie", "operator", "efficiency"],
    description:
      "Supports industrial engineering decisions on line balancing and manpower use.",
  },
  {
    id: "M-006",
    name: "Quality Failure Prediction Engine",
    category: "Quality Intelligence",
    href: "/software/ai-quality-failure-prediction-engine",
    users: "Quality, Production, Compliance",
    keywords: ["quality", "failure", "defect", "rejection", "inspection"],
    description:
      "Predicts quality failures and highlights preventive control areas.",
  },
  {
    id: "M-007",
    name: "Supplier Performance Intelligence",
    category: "Supply Chain Intelligence",
    href: "/software/supplier-performance-intelligence",
    users: "Supply Chain, Merchandising, Procurement",
    keywords: ["supplier", "delivery", "material", "otif", "delay"],
    description:
      "Monitors supplier delivery, quality, dependency, and sourcing risk.",
  },
  {
    id: "M-008",
    name: "Buyer Risk Intelligence",
    category: "Buyer Intelligence",
    href: "/software/buyer-risk-intelligence",
    users: "Merchandising, Directors, Commercial",
    keywords: ["buyer", "risk", "order", "payment", "claim"],
    description:
      "Assesses buyer-side risk including cancellation, delay, claim, and commercial exposure.",
  },
  {
    id: "M-009",
    name: "Compliance Audit Intelligence",
    category: "Compliance Intelligence",
    href: "/software/compliance-audit-intelligence",
    users: "Compliance, QA, Factory Head",
    keywords: ["audit", "compliance", "capa", "evidence", "finding"],
    description:
      "Tracks audit findings, compliance gaps, corrective actions, and ownership.",
  },
  {
    id: "M-010",
    name: "Utility Cost Intelligence",
    category: "Energy Intelligence",
    href: "/software/utility-cost-intelligence",
    users: "Maintenance, Finance, Factory Head",
    keywords: ["utility", "electricity", "gas", "generator", "cost"],
    description:
      "Monitors utility cost, generator cost, consumption risk, and cost saving areas.",
  },
  {
    id: "M-011",
    name: "Workforce Absence Intelligence",
    category: "Workforce Intelligence",
    href: "/software/workforce-absence-intelligence",
    users: "HR, Production, Factory Head",
    keywords: ["absence", "hr", "manpower", "attendance", "labour"],
    description:
      "Highlights absenteeism, manpower instability, and production impact.",
  },
  {
    id: "M-012",
    name: "Executive Report Generator",
    category: "Reporting Intelligence",
    href: "/software/executive-report-generator",
    users: "Directors, Senior Management",
    keywords: ["report", "summary", "executive", "board", "director"],
    description:
      "Generates leadership-level reports from operational intelligence.",
  },
];

function normalise(value: string) {
  return value.toLowerCase().trim();
}

export default function AIGlobalSearchModuleFinderPage() {
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(() => {
    const q = normalise(query);

    if (!q) {
      return MODULES;
    }

    return MODULES.filter((module) => {
      const searchableText = [
        module.id,
        module.name,
        module.category,
        module.users,
        module.description,
        ...module.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [query]);

  return (
    <DashboardShell title="AI Global Search & Module Finder">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm">
              Module 100 · AI Global Search & Module Finder
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Search Any Intelligence Module
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              A simple enterprise module finder for directors, officers,
              managers, compliance teams, production teams, quality teams,
              merchandising teams, and factory leadership.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <label className="block text-sm text-slate-300 mb-2">
              Search by module, department, risk, report, KPI, action or user role
            </label>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: buyer, quality, audit, production, utility, report..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
            />

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {["production", "quality", "buyer", "audit", "supplier", "utility", "report"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-5">
              <p className="text-sm text-cyan-300">Modules Found</p>
              <h2 className="text-5xl font-bold mt-3">
                {filteredModules.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-5">
              <p className="text-sm text-fuchsia-300">Search Mode</p>
              <h2 className="text-3xl font-bold mt-4">
                {query ? "Filtered" : "All"}
              </h2>
            </div>

            <div className="rounded-2xl border border-green-700/40 bg-green-950/10 p-5">
              <p className="text-sm text-green-300">Navigation Status</p>
              <h2 className="text-3xl font-bold mt-4">Ready</h2>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredModules.map((module) => (
              <Link
                key={module.id}
                href={module.href}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-cyan-500 hover:bg-slate-900/80 transition-all duration-300"
              >
                <p className="text-xs uppercase tracking-widest text-cyan-300">
                  {module.id} · {module.category}
                </p>

                <h3 className="text-xl font-bold mt-3">{module.name}</h3>

                <p className="text-slate-300 mt-3 text-sm leading-relaxed">
                  {module.description}
                </p>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">Designed for</p>
                  <p className="text-sm text-slate-300 mt-1">{module.users}</p>
                </div>
              </Link>
            ))}
          </section>

          {filteredModules.length === 0 && (
            <section className="rounded-2xl border border-amber-700/40 bg-amber-950/10 p-6">
              <h2 className="text-2xl font-bold text-amber-300">
                No module found
              </h2>
              <p className="text-slate-300 mt-3">
                Try searching by department name, such as production, quality,
                buyer, supplier, audit, utility, finance, report, or risk.
              </p>
            </section>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}