"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type InventoryRecord = {
  id: string;
  material: string;
  category: string;
  currentStock: number;
  minimumRequired: number;
  ageingDays: number;
  stockValue: number;
  monthlyConsumption: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoInventoryData: InventoryRecord[] = [
  {
    id: "INV-001",
    material: "Cotton Fabric",
    category: "Raw Material",
    currentStock: 12000,
    minimumRequired: 8000,
    ageingDays: 24,
    stockValue: 42000,
    monthlyConsumption: 6500,
    riskLevel: "Low",
  },
  {
    id: "INV-002",
    material: "Poly Thread",
    category: "Accessories",
    currentStock: 1800,
    minimumRequired: 3500,
    ageingDays: 12,
    stockValue: 6800,
    monthlyConsumption: 4200,
    riskLevel: "High",
  },
  {
    id: "INV-003",
    material: "Packaging Cartons",
    category: "Packaging",
    currentStock: 28000,
    minimumRequired: 10000,
    ageingDays: 96,
    stockValue: 18500,
    monthlyConsumption: 2200,
    riskLevel: "Critical",
  },
  {
    id: "INV-004",
    material: "Zippers",
    category: "Accessories",
    currentStock: 6200,
    minimumRequired: 5000,
    ageingDays: 15,
    stockValue: 7200,
    monthlyConsumption: 3400,
    riskLevel: "Medium",
  },
];

function getRiskColor(risk: InventoryRecord["riskLevel"]) {
  if (risk === "Critical") {
    return "text-red-300 border-red-700/40 bg-red-950/20";
  }

  if (risk === "High") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  if (risk === "Medium") {
    return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
  }

  return "text-green-300 border-green-700/40 bg-green-950/20";
}

function getInventoryAssessment(
  critical: number,
  high: number
) {
  if (critical >= 2) {
    return "Inventory Instability Detected";
  }

  if (critical >= 1 || high >= 2) {
    return "High Inventory Risk";
  }

  if (high >= 1) {
    return "Moderate Inventory Risk";
  }

  return "Inventory Environment Stable";
}

function getRecommendation(record: InventoryRecord) {
  if (record.riskLevel === "Critical") {
    return "Urgent executive inventory review required. Investigate dead stock, ageing exposure, and procurement control.";
  }

  if (record.currentStock < record.minimumRequired) {
    return "AI recommends immediate replenishment planning to avoid production disruption.";
  }

  if (record.ageingDays > 90) {
    return "Long inventory ageing detected. Evaluate liquidation or controlled consumption strategy.";
  }

  return "Inventory level currently manageable with standard monitoring.";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AIInventoryIntelligenceEnginePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    InventoryRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadInventoryData() {
      try {
        setLoading(true);

        const data = demoInventoryData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load inventory intelligence:",
          error
        );

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInventoryData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalStockValue = records.reduce(
      (sum, r) => sum + r.stockValue,
      0
    );

    const criticalItems = records.filter(
      (r) => r.riskLevel === "Critical"
    ).length;

    const highRiskItems = records.filter(
      (r) =>
        r.riskLevel === "Critical" ||
        r.riskLevel === "High"
    ).length;

    const shortageItems = records.filter(
      (r) => r.currentStock < r.minimumRequired
    ).length;

    return {
      totalStockValue,
      criticalItems,
      highRiskItems,
      shortageItems,
      assessment: getInventoryAssessment(
        criticalItems,
        highRiskItems
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Inventory Intelligence Engine">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-indigo-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-indigo-300 uppercase tracking-widest text-sm">
              Module 30 · AI Inventory Intelligence Engine
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Inventory Risk & Stock Optimisation Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered inventory intelligence system
              for detecting dead stock, shortage risk,
              over-ordering, ageing exposure, warehouse
              inefficiency, and inventory-related
              operational risks before they impact
              production and profitability.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading inventory intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <a
                  href="#total-inventory-value"
                  className="block rounded-2xl bg-slate-900 border border-slate-800 p-5 transition hover:-translate-y-1 hover:border-indigo-400/40"
                >

                  <p className="text-slate-400 text-sm">
                    Total Inventory Value
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-indigo-300">
                    £
                    {intelligence.totalStockValue.toLocaleString()}
                  </h2>

                </a>

                <a
                  href="#critical-inventory-risks"
                  className="block rounded-2xl border border-red-700/40 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
                >

                  <p className="text-red-300 text-sm">
                    Critical Inventory Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalItems}
                  </h2>

                </a>

                <a
                  href="#high-risk-inventory"
                  className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
                >

                  <p className="text-orange-300 text-sm">
                    High Risk Inventory
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRiskItems}
                  </h2>

                </a>

                <a
                  href="#shortage-risk-items"
                  className="block rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5 transition hover:-translate-y-1 hover:border-yellow-400/40"
                >

                  <p className="text-yellow-300 text-sm">
                    Shortage Risk Items
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.shortageItems}
                  </h2>

                </a>

              </section>

              <section className="rounded-2xl border border-indigo-700/40 bg-indigo-950/10 p-6">

                <p className="text-indigo-300 uppercase tracking-widest text-sm">
                  Executive Inventory Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates inventory
                  behaviour, material movement,
                  warehouse exposure, and stock
                  consumption patterns to prevent
                  operational disruption and hidden
                  financial losses.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Inventory Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Material
                        </th>

                        <th className="text-left p-4">
                          Category
                        </th>

                        <th className="text-left p-4">
                          Current Stock
                        </th>

                        <th className="text-left p-4">
                          Minimum Required
                        </th>

                        <th className="text-left p-4">
                          Ageing
                        </th>

                        <th className="text-left p-4">
                          Stock Value
                        </th>

                        <th className="text-left p-4">
                          Risk
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {records.map((record) => (
                        <tr
                          key={record.id}
                          id={slugify(record.material)}
                          className="border-b border-slate-800 transition hover:bg-indigo-900/20"
                        >

                          <td className="p-4">
                            <a
                              href={`#${slugify(record.material)}`}
                              className="text-cyan-300 underline hover:text-cyan-200"
                            >
                              {record.material}
                            </a>
                          </td>

                          <td className="p-4">
                            {record.category}
                          </td>

                          <td className="p-4">
                            {record.currentStock.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {record.minimumRequired.toLocaleString()}
                          </td>

                          <td className="p-4 text-orange-300">
                            {record.ageingDays} days
                          </td>

                          <td className="p-4 text-indigo-300">
                            £
                            {record.stockValue.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {record.riskLevel}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {records.map((record) => (
                  <a
                    key={record.id}
                    href={`#${slugify(record.material)}`}
                    className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-indigo-400/40 ${getRiskColor(
                      record.riskLevel
                    )}`}
                  >

                    <p className="text-sm opacity-80">
                      {record.category}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {record.material}
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">

                      <span>
                        Stock:
                        {" "}
                        {record.currentStock.toLocaleString()}
                      </span>

                      <span>
                        Ageing:
                        {" "}
                        {record.ageingDays} days
                      </span>

                    </div>

                  </a>
                ))}

              </section>

              <section className="space-y-5">

                {records.map((record) => (
                  <section
                    key={record.id}
                    id={slugify(record.material)}
                    className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-sm uppercase tracking-widest text-indigo-300">
                          {record.category} · {record.id}
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                          {record.material}
                        </h2>

                      </div>

                      <div
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskColor(
                          record.riskLevel
                        )}`}
                      >
                        {record.riskLevel} Risk
                      </div>

                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Current Stock
                        </p>

                        <p className="mt-2 font-semibold">
                          {record.currentStock.toLocaleString()}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Minimum Required
                        </p>

                        <p className="mt-2 font-semibold">
                          {record.minimumRequired.toLocaleString()}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Ageing Days
                        </p>

                        <p className="mt-2 font-semibold text-orange-300">
                          {record.ageingDays} days
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950/70 p-4">

                        <p className="text-sm text-slate-400">
                          Stock Value
                        </p>

                        <p className="mt-2 font-semibold text-indigo-300">
                          £{record.stockValue.toLocaleString()}
                        </p>

                      </div>

                    </div>

                    <div className="mt-6 rounded-xl border border-indigo-700/30 bg-indigo-950/20 p-5">

                      <p className="text-sm uppercase tracking-widest text-indigo-300">
                        AI Recommendation
                      </p>

                      <p className="mt-3 text-slate-200">
                        {getRecommendation(record)}
                      </p>

                    </div>

                  </section>
                ))}

              </section>

            </>
          )}

        </div>

      </main>

    </DashboardShell>
  );
}