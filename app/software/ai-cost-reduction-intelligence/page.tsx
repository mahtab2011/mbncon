"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type CostReductionRecord = {
  id: string;
  department: string;
  costArea: string;
  monthlyLoss: number;
  savingsPotential: number;
  priority: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
};

const demoCostReductionData: CostReductionRecord[] = [
  {
    id: "CRI-001",
    department: "Production",
    costArea: "Overtime Leakage",
    monthlyLoss: 12000,
    savingsPotential: 8500,
    priority: "High",
    recommendation:
      "Rebalance manpower allocation and optimize line scheduling.",
  },
  {
    id: "CRI-002",
    department: "Utilities",
    costArea: "Generator Fuel Consumption",
    monthlyLoss: 18000,
    savingsPotential: 14000,
    priority: "Critical",
    recommendation:
      "Optimize generator runtime and reduce peak-hour wastage.",
  },
  {
    id: "CRI-003",
    department: "Maintenance",
    costArea: "Unexpected Machine Downtime",
    monthlyLoss: 9500,
    savingsPotential: 6200,
    priority: "High",
    recommendation:
      "Increase preventive maintenance scheduling frequency.",
  },
  {
    id: "CRI-004",
    department: "Quality",
    costArea: "Rework & Rejection Loss",
    monthlyLoss: 7600,
    savingsPotential: 5100,
    priority: "Medium",
    recommendation:
      "Strengthen inline quality checkpoints and operator training.",
  },
];

function getPriorityColor(
  priority: CostReductionRecord["priority"]
) {
  if (priority === "Critical") {
    return "text-red-300 border-red-700/40 bg-red-950/20";
  }

  if (priority === "High") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  if (priority === "Medium") {
    return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
  }

  return "text-green-300 border-green-700/40 bg-green-950/20";
}

function getExecutiveAssessment(score: number) {
  if (score >= 25000) {
    return "Major Cost Optimisation Opportunity";
  }

  if (score >= 15000) {
    return "High Savings Potential";
  }

  if (score >= 8000) {
    return "Moderate Cost Reduction Opportunity";
  }

  return "Controlled Cost Environment";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export default function AICostReductionIntelligencePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    CostReductionRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadCostReductionData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoCostReductionData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load cost reduction intelligence:",
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

    loadCostReductionData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalMonthlyLoss = records.reduce(
      (sum, r) => sum + r.monthlyLoss,
      0
    );

    const totalSavingsPotential = records.reduce(
      (sum, r) => sum + r.savingsPotential,
      0
    );

    const criticalAreas = records.filter(
      (r) => r.priority === "Critical"
    ).length;

    const highPriorityAreas = records.filter(
      (r) =>
        r.priority === "Critical" ||
        r.priority === "High"
    ).length;

    return {
      totalMonthlyLoss,
      totalSavingsPotential,
      criticalAreas,
      highPriorityAreas,
      assessment: getExecutiveAssessment(
        totalSavingsPotential
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Cost Reduction Intelligence">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-emerald-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-emerald-300 uppercase tracking-widest text-sm">
              Module 29 · AI Cost Reduction Intelligence
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Manufacturing Cost Optimisation Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered manufacturing cost reduction system
              for identifying operational waste, hidden losses,
              efficiency gaps, overtime leakage, utility
              overspending, machine inefficiency, and
              department-wise savings opportunities.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading cost reduction intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

  <a
    href="#monthly-loss-exposure"
    className="block rounded-2xl bg-slate-900 border border-slate-800 p-5 transition hover:-translate-y-1 hover:border-red-400/40 hover:bg-red-900/20"
  >

    <p className="text-slate-400 text-sm">
      Monthly Loss Exposure
    </p>

    <h2 className="text-4xl font-bold mt-3 text-red-300">
      £
      {intelligence.totalMonthlyLoss.toLocaleString()}
    </h2>

  </a>

  <a
    href="#savings-potential"
    className="block rounded-2xl border border-emerald-700/40 bg-emerald-950/20 p-5 transition hover:-translate-y-1 hover:border-emerald-400/40"
  >

    <p className="text-emerald-300 text-sm">
      Savings Potential
    </p>

    <h2 className="text-4xl font-bold mt-3">
      £
      {intelligence.totalSavingsPotential.toLocaleString()}
    </h2>

  </a>

  <a
    href="#critical-cost-areas"
    className="block rounded-2xl border border-red-700/40 bg-red-950/20 p-5 transition hover:-translate-y-1 hover:border-red-400/40"
  >

    <p className="text-red-300 text-sm">
      Critical Cost Areas
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.criticalAreas}
    </h2>

  </a>

  <a
    href="#high-priority-areas"
    className="block rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5 transition hover:-translate-y-1 hover:border-orange-400/40"
  >

    <p className="text-orange-300 text-sm">
      High Priority Areas
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {intelligence.highPriorityAreas}
    </h2>

  </a>

</section>

              <section className="rounded-2xl border border-emerald-700/40 bg-emerald-950/10 p-6">

                <p className="text-emerald-300 uppercase tracking-widest text-sm">
                  Executive Cost Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates hidden operational
                  losses and identifies manufacturing cost-saving
                  opportunities across utilities, manpower,
                  production, maintenance, quality,
                  and operational efficiency.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Cost Reduction Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Department
                        </th>

                        <th className="text-left p-4">
                          Cost Area
                        </th>

                        <th className="text-left p-4">
                          Monthly Loss
                        </th>

                        <th className="text-left p-4">
                          Savings Potential
                        </th>

                        <th className="text-left p-4">
                          Priority
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {records.map((record) => (
  <tr
    key={record.id}
    id={slugify(record.costArea)}
    className="border-b border-slate-800 transition hover:bg-emerald-900/20"
  >

                          <td className="p-4">
                            {record.department}
                          </td>

                          <td className="p-4">
  <a
    href={`#${slugify(record.costArea)}`}
    className="text-cyan-300 underline hover:text-cyan-200"
  >
    {record.costArea}
  </a>
</td>

                          <td className="p-4 text-red-300">
                            £
                            {record.monthlyLoss.toLocaleString()}
                          </td>

                          <td className="p-4 text-emerald-300">
                            £
                            {record.savingsPotential.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {record.priority}
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
    href={`#${slugify(record.costArea)}`}
    className={`block rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 ${getPriorityColor(
      record.priority
    )}`}
  >
    <p className="text-sm opacity-80">
      {record.department}
    </p>

    <h3 className="text-2xl font-bold mt-2">
      {record.costArea}
    </h3>

    <p className="mt-4 text-slate-200">
      {record.recommendation}
    </p>

    <div className="mt-5 flex justify-between">
      <span>
        Loss: £{record.monthlyLoss.toLocaleString()}
      </span>

      <span>
        Save: £{record.savingsPotential.toLocaleString()}
      </span>
    </div>
  </a>
))}

</section>

</>
)}

</div>

</main>

</DashboardShell>
);
}